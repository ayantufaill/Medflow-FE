import React from "react";
import { render, screen, waitFor, fireEvent, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import WaitlistListPage from "./WaitlistListPage";
import { waitlistService } from "../../services/waitlist.service";
import { useSnackbar } from "../../contexts/SnackbarContext";
// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../config/api", () => ({
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock("../../services/waitlist.service");
jest.mock("../../contexts/SnackbarContext");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

// Stub DatePicker — passes a real dayjs object to onChange so component can
// call .format() on it without crashing.
// dayjs is required inside the factory (not imported at top level) because
// jest.mock() factories cannot reference out-of-scope variables.
jest.mock("@mui/x-date-pickers/DatePicker", () => ({
    DatePicker: ({ label, onChange, value }) => {
        const mockDayjs = require("dayjs");
        return (
            <input
                aria-label={label}
                value={value ? value.format("YYYY-MM-DD") : ""}
                onChange={(e) => onChange(e.target.value ? mockDayjs(e.target.value) : null)}
                data-testid={`date-picker-${label}`}
            />
        );
    },
}));

jest.mock("@mui/x-date-pickers/TimePicker", () => ({
    TimePicker: ({ label, onChange, value }) => (
        <input
            aria-label={label}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            data-testid={`time-picker-${label}`}
        />
    ),
}));

jest.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
    LocalizationProvider: ({ children }) => <>{children}</>,
}));

jest.mock("../../components/shared/ConfirmationDialog", () => () => null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makePaginatedResponse = (entries = [], total = 0) => ({
    waitlistEntries: entries,
    pagination: { total, page: 1, limit: 10 },
});

const makeEntry = (overrides = {}) => ({
    _id: "entry-001",
    status: "active",
    priority: "normal",
    preferredDate: "2025-08-01",
    preferredTimeStart: "09:00",
    preferredTimeEnd: "09:30",
    patient: { firstName: "Jane", lastName: "Doe" },
    provider: { userId: { firstName: "Dr", lastName: "Smith" } },
    ...overrides,
});

const renderPage = () =>
    render(
        <MemoryRouter>
            <WaitlistListPage />
        </MemoryRouter>
    );

// MUI Select can't be changed with fireEvent.change on the div.
// This helper opens the dropdown and clicks the option by its text.
const selectMuiOption = async (labelText, optionText) => {
    const combobox = screen.getByRole("combobox", { name: new RegExp(labelText, "i") });
    fireEvent.mouseDown(combobox);
    const listbox = await screen.findByRole("listbox");
    fireEvent.click(within(listbox).getByText(optionText));
};

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
    jest.clearAllMocks();
    waitlistService.getAllWaitlistEntries.mockResolvedValue(makePaginatedResponse());
    useSnackbar.mockReturnValue({ showSnackbar: jest.fn() });
});

// ---------------------------------------------------------------------------
// 1. Initial load — default parameters
// ---------------------------------------------------------------------------

describe("Initial load", () => {
    it("calls getAllWaitlistEntries on mount with default params", async () => {
        renderPage();

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        // Positional signature:
        // getAllWaitlistEntries(page, limit, providerId, patientId, status, priority, search, dateFrom, dateTo)
        expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
            1,  // page (component starts at 0, sends page+1)
            10, // rowsPerPage default
            "", // providerId — always empty from this page
            "", // patientId  — always empty from this page
            "", // statusFilter default
            "", // priorityFilter default
            "", // debouncedSearch default
            "", // dateFrom default
            ""  // dateTo default
        );
    });

    it("renders the waitlist table header", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("Patient")).toBeInTheDocument()
        );
        expect(screen.getByText("Provider")).toBeInTheDocument();
        // Use getAllByText because "Priority" and "Status" also appear as chip
        // labels in the table body — just assert at least one match exists.
        expect(screen.getAllByText("Priority").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
    });

    it("shows empty-state message when API returns no entries", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("No waitlist entries found")).toBeInTheDocument()
        );
    });

    it("renders entries returned by the API", async () => {
        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 1)
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/Jane/i)).toBeInTheDocument()
        );
    });
});

// ---------------------------------------------------------------------------
// 2. Pagination params
// ---------------------------------------------------------------------------

describe("Pagination params", () => {
    it("sends page=1 and limit=10 on initial load", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "", "", "", ""
            )
        );
    });

    it("increments page number when user navigates to next page", async () => {
        // Need enough entries so TablePagination enables the next-page button
        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 25)
        );

        renderPage();

        // Wait for table to render (spinner gone, next-page button available)
        const nextButton = await screen.findByRole("button", { name: /next page/i });
        fireEvent.click(nextButton);

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                2, 10, "", "", "", "", "", "", ""
            )
        );
    });

    it("resets to page 1 after changing rows-per-page", async () => {
        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 50)
        );

        renderPage();

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        // MUI TablePagination's rows-per-page select: find it by its aria-label
        // which MUI sets to "Rows per page:" on the underlying Select input element.
        await waitFor(() =>
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
        );

        // Find the Select for rows per page by locating the hidden native input
        // that MUI renders, then trigger change on its parent Select via the
        // visible combobox element that belongs to TablePagination specifically.
        // We identify it by checking all comboboxes and picking the one NOT
        // labelled Status or Priority.
        const allComboboxes = screen.getAllByRole("combobox");
        const rowsCombobox = allComboboxes.find(
            (el) =>
                !el.getAttribute("aria-labelledby")?.includes("status") &&
                !el.getAttribute("aria-labelledby")?.includes("priority")
        );
        fireEvent.mouseDown(rowsCombobox);
        const listbox = await screen.findByRole("listbox");
        fireEvent.click(within(listbox).getByText("25"));

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 25, "", "", "", "", "", "", ""
            )
        );
    });
});

// ---------------------------------------------------------------------------
// 3. Status filter
// ---------------------------------------------------------------------------

describe("Status filter param", () => {
    it("passes the selected status to getAllWaitlistEntries", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        await selectMuiOption("Status", "Active");

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "active", "", "", "", ""
            )
        );
    });

    it("resets page to 1 when status filter changes", async () => {
        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 30)
        );

        renderPage();

        // Go to page 2 first
        const nextButton = await screen.findByRole("button", { name: /next page/i });
        fireEvent.click(nextButton);
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                2, 10, "", "", "", "", "", "", ""
            )
        );

        // Change status — page should reset to 1
        await selectMuiOption("Status", "Called");

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "called", "", "", "", ""
            )
        );
    });

    it("sends empty string for status when All Status is selected", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        // Select a status then clear it
        await selectMuiOption("Status", "Expired");
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "expired", "", "", "", ""
            )
        );

        await selectMuiOption("Status", "All Status");

        await waitFor(() => {
            const calls = waitlistService.getAllWaitlistEntries.mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall[4]).toBe("");
        });
    });
});

// ---------------------------------------------------------------------------
// 4. Priority filter
// ---------------------------------------------------------------------------

describe("Priority filter param", () => {
    it("passes the selected priority to getAllWaitlistEntries", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        await selectMuiOption("Priority", "Urgent");

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "urgent", "", "", ""
            )
        );
    });

    it("resets page to 1 when priority filter changes", async () => {
        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 30)
        );

        renderPage();

        const nextButton = await screen.findByRole("button", { name: /next page/i });
        fireEvent.click(nextButton);
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                2, 10, "", "", "", "", "", "", ""
            )
        );

        await selectMuiOption("Priority", "Flexible");

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "flexible", "", "", ""
            )
        );
    });

    it("sends all three priority values correctly", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        for (const [label, value] of [["Urgent", "urgent"], ["Normal", "normal"], ["Flexible", "flexible"]]) {
            await selectMuiOption("Priority", label);
            await waitFor(() => {
                const calls = waitlistService.getAllWaitlistEntries.mock.calls;
                expect(calls[calls.length - 1][5]).toBe(value);
            });
            // Reset back to All Priorities before next iteration
            await selectMuiOption("Priority", "All Priorities");
        }
    });
});

// ---------------------------------------------------------------------------
// 5. Search param
// ---------------------------------------------------------------------------

describe("Search param", () => {
    it("passes debounced search term to getAllWaitlistEntries", async () => {
        jest.useFakeTimers();

        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: "Jane" } });

        act(() => jest.advanceTimersByTime(400));

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "", "Jane", "", ""
            )
        );

        jest.useRealTimers();
    });

    it("resets page to 1 when search term is committed", async () => {
        jest.useFakeTimers();

        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 30)
        );

        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        // Navigate to page 2 — need to run timers so loading finishes
        act(() => jest.runAllTimers());
        const nextButton = await screen.findByRole("button", { name: /next page/i });
        fireEvent.click(nextButton);
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                2, 10, "", "", "", "", "", "", ""
            )
        );

        // Type in search — should reset to page 1
        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: "Smith" } });
        act(() => jest.advanceTimersByTime(400));

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "", "Smith", "", ""
            )
        );

        jest.useRealTimers();
    });
});

// ---------------------------------------------------------------------------
// 6. Date filters
// ---------------------------------------------------------------------------

describe("Date filter params", () => {
    it("passes dateFrom formatted as YYYY-MM-DD to getAllWaitlistEntries", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        const fromPicker = screen.getByTestId("date-picker-From Date");
        fireEvent.change(fromPicker, { target: { value: "2025-08-01" } });

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "", "", "2025-08-01", ""
            )
        );
    });

    it("passes dateTo formatted as YYYY-MM-DD to getAllWaitlistEntries", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        const toPicker = screen.getByTestId("date-picker-To Date");
        fireEvent.change(toPicker, { target: { value: "2025-08-31" } });

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "", "", "", "", "2025-08-31"
            )
        );
    });

    it("resets page to 1 when dateFrom changes", async () => {
        waitlistService.getAllWaitlistEntries.mockResolvedValue(
            makePaginatedResponse([makeEntry()], 30)
        );

        renderPage();

        const nextButton = await screen.findByRole("button", { name: /next page/i });
        fireEvent.click(nextButton);
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                2, 10, "", "", "", "", "", "", ""
            )
        );

        const fromPicker = screen.getByTestId("date-picker-From Date");
        fireEvent.change(fromPicker, { target: { value: "2025-09-01" } });

        await waitFor(() => {
            const calls = waitlistService.getAllWaitlistEntries.mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall[0]).toBe(1); // page reset to 1
        });
    });
});

// ---------------------------------------------------------------------------
// 7. Combined filters
// ---------------------------------------------------------------------------

describe("Combined filters", () => {
    it("sends all active filters together in a single call", async () => {
        jest.useFakeTimers();

        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        await selectMuiOption("Status", "Active");
        await selectMuiOption("Priority", "Urgent");

        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: "John" } });
        act(() => jest.advanceTimersByTime(400));

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "active", "urgent", "John", "", ""
            )
        );

        jest.useRealTimers();
    });
});

// ---------------------------------------------------------------------------
// 8. Reset filters
// ---------------------------------------------------------------------------

describe("Reset filters", () => {
    it("calls getAllWaitlistEntries with empty filters after reset", async () => {
        renderPage();
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );

        // Apply a filter first
        await selectMuiOption("Status", "Called");
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledWith(
                1, 10, "", "", "called", "", "", "", ""
            )
        );

        // Click Reset Filters button
        const resetBtn = screen.getByRole("button", { name: /reset filters/i });
        fireEvent.click(resetBtn);

        await waitFor(() => {
            const calls = waitlistService.getAllWaitlistEntries.mock.calls;
            const lastCall = calls[calls.length - 1];
            expect(lastCall).toEqual([1, 10, "", "", "", "", "", "", ""]);
        });
    });
});

// ---------------------------------------------------------------------------
// 9. Refresh button
// ---------------------------------------------------------------------------

describe("Refresh button", () => {
    it("calls getAllWaitlistEntries again when Refresh is clicked", async () => {
        renderPage();

        // Wait for loading to finish so the Refresh button becomes enabled
        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(1)
        );
        await waitFor(() =>
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
        );

        const refreshBtn = screen.getByRole("button", { name: /refresh/i });
        fireEvent.click(refreshBtn);

        await waitFor(() =>
            expect(waitlistService.getAllWaitlistEntries).toHaveBeenCalledTimes(2)
        );
    });
});

// ---------------------------------------------------------------------------
// 10. Error handling
// ---------------------------------------------------------------------------

describe("Error handling", () => {
    it("shows an error alert when the API call fails", async () => {
        waitlistService.getAllWaitlistEntries.mockRejectedValue({
            response: { data: { message: "Internal Server Error" } },
        });

        renderPage();

        await waitFor(() =>
            expect(screen.getByRole("alert")).toBeInTheDocument()
        );
        expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });

    it("shows the fallback error message when no response body", async () => {
        waitlistService.getAllWaitlistEntries.mockRejectedValue(new Error("Network Error"));

        renderPage();

        await waitFor(() =>
            expect(
                screen.getByText(/failed to fetch waitlist entries/i)
            ).toBeInTheDocument()
        );
    });
});

// ---------------------------------------------------------------------------
// 11. Loading state
// ---------------------------------------------------------------------------

describe("Loading state", () => {
    it("shows a loading spinner while the API call is in flight", () => {
        waitlistService.getAllWaitlistEntries.mockReturnValue(new Promise(() => { }));
        renderPage();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("hides the spinner after the API call resolves", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
        );
    });
});
