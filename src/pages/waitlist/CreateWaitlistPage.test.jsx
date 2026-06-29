import React from "react";
import {
    render,
    screen,
    waitFor,
    fireEvent,
    act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateWaitlistPage from "./CreateWaitlistPage";
import { waitlistService } from "../../services/waitlist.service";
import { useSnackbar } from "../../contexts/SnackbarContext";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../config/api", () => ({
    default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

jest.mock("../../services/waitlist.service");
jest.mock("../../contexts/SnackbarContext");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Stub WaitlistForm — gives us a simple form we fully control.
// It calls props.onSubmit with canned data when submitted.
const FORM_PAYLOAD = {
    patientId: "patient-123",
    providerId: "provider-456",
    appointmentTypeId: "type-789",
    preferredDate: "2025-09-01",
    preferredTimeStart: "09:00",
    preferredTimeEnd: "09:30",
    priority: "normal",
    status: "active",
    notes: "Test note",
};

jest.mock("../../components/waitlist/WaitlistForm", () => ({
    __esModule: true,
    default: ({ onSubmit, loading, formId }) => (
        <form
            id={formId}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(FORM_PAYLOAD);
            }}
            data-testid="waitlist-form"
        >
            <button type="submit" disabled={loading} data-testid="form-submit">
                Submit Form
            </button>
            {loading && <span data-testid="form-loading">loading</span>}
        </form>
    ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockShowSnackbar = jest.fn();

const renderPage = () =>
    render(
        <MemoryRouter>
            <CreateWaitlistPage />
        </MemoryRouter>
    );

// Submit the form by clicking the external "Add to Waitlist" button
// (which submits the form via form="create-waitlist-form").
const submitForm = () => {
    fireEvent.click(screen.getByRole("button", { name: /add to waitlist/i }));
};

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
    jest.clearAllMocks();
    useSnackbar.mockReturnValue({ showSnackbar: mockShowSnackbar });
    waitlistService.createWaitlistEntry.mockResolvedValue({
        _id: "new-entry-001",
        ...FORM_PAYLOAD,
    });
});

// ---------------------------------------------------------------------------
// 1. Page renders
// ---------------------------------------------------------------------------

describe("Page renders", () => {
    it("renders the page title", () => {
        renderPage();
        expect(screen.getByRole("heading", { name: "Add to Waitlist" })).toBeInTheDocument();
    });

    it("renders the WaitlistForm", () => {
        renderPage();
        expect(screen.getByTestId("waitlist-form")).toBeInTheDocument();
    });

    it("renders Cancel and Add to Waitlist buttons", () => {
        renderPage();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /add to waitlist/i })
        ).toBeInTheDocument();
    });

    it("does not show an error alert on initial render", () => {
        renderPage();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// 2. Service call
// ---------------------------------------------------------------------------

describe("waitlistService.createWaitlistEntry call", () => {
    it("calls createWaitlistEntry with the form data on submit", async () => {
        renderPage();
        submitForm();

        await waitFor(() =>
            expect(waitlistService.createWaitlistEntry).toHaveBeenCalledTimes(1)
        );
        expect(waitlistService.createWaitlistEntry).toHaveBeenCalledWith(
            FORM_PAYLOAD
        );
    });

    it("calls createWaitlistEntry exactly once per submit", async () => {
        renderPage();
        submitForm();

        await waitFor(() =>
            expect(waitlistService.createWaitlistEntry).toHaveBeenCalledTimes(1)
        );
    });

    it("passes all form fields to createWaitlistEntry", async () => {
        renderPage();
        submitForm();

        await waitFor(() =>
            expect(waitlistService.createWaitlistEntry).toHaveBeenCalledWith(
                expect.objectContaining({
                    patientId: "patient-123",
                    providerId: "provider-456",
                    appointmentTypeId: "type-789",
                    preferredDate: "2025-09-01",
                    preferredTimeStart: "09:00",
                    preferredTimeEnd: "09:30",
                    priority: "normal",
                    status: "active",
                    notes: "Test note",
                })
            )
        );
    });
});

// ---------------------------------------------------------------------------
// 3. Success flow
// ---------------------------------------------------------------------------

describe("Success flow", () => {
    it("shows a success snackbar after successful submission", async () => {
        renderPage();
        submitForm();

        await waitFor(() =>
            expect(mockShowSnackbar).toHaveBeenCalledWith(
                "Waitlist entry created successfully",
                "success"
            )
        );
    });

    it("navigates to /waitlist after successful submission", async () => {
        renderPage();
        submitForm();

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/waitlist")
        );
    });

    it("shows success toast before navigating", async () => {
        // Ensure snackbar is called before navigate (order matters for UX)
        renderPage();
        submitForm();

        await waitFor(() => {
            expect(mockShowSnackbar).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalled();
        });

        const snackbarOrder = mockShowSnackbar.mock.invocationCallOrder[0];
        const navigateOrder = mockNavigate.mock.invocationCallOrder[0];
        expect(snackbarOrder).toBeLessThan(navigateOrder);
    });

    it("does not show an error alert on success", async () => {
        renderPage();
        submitForm();

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/waitlist")
        );

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// 4. Error flow
// ---------------------------------------------------------------------------

describe("Error flow", () => {
    it("shows an error alert when createWaitlistEntry fails", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue({
            response: { data: { message: "Patient not found" } },
        });

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByRole("alert")).toBeInTheDocument()
        );
        expect(screen.getByText("Patient not found")).toBeInTheDocument();
    });

    it("shows error from nested error.message field", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue({
            response: { data: { error: { message: "Validation failed" } } },
        });

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByText("Validation failed")).toBeInTheDocument()
        );
    });

    it("shows fallback error message when no response body", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue(
            new Error("Network Error")
        );

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(
                screen.getByText(/failed to create waitlist entry/i)
            ).toBeInTheDocument()
        );
    });

    it("shows error snackbar when createWaitlistEntry fails", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue({
            response: { data: { message: "Server error" } },
        });

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(mockShowSnackbar).toHaveBeenCalledWith("Server error", "error")
        );
    });

    it("does not navigate on failure", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue(
            new Error("Network Error")
        );

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByRole("alert")).toBeInTheDocument()
        );

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("error alert can be dismissed", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue({
            response: { data: { message: "Server error" } },
        });

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByRole("alert")).toBeInTheDocument()
        );

        // Close button on the Alert
        fireEvent.click(screen.getByRole("button", { name: /close/i }));

        await waitFor(() =>
            expect(screen.queryByRole("alert")).not.toBeInTheDocument()
        );
    });
});

// ---------------------------------------------------------------------------
// 5. Loading state
// ---------------------------------------------------------------------------

describe("Loading / saving state", () => {
    it("disables the Add to Waitlist button while saving", async () => {
        // Never resolves so we can inspect mid-flight state
        waitlistService.createWaitlistEntry.mockReturnValue(new Promise(() => { }));

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(
                screen.getByRole("button", { name: /adding/i })
            ).toBeDisabled()
        );
    });

    it("disables the Cancel button while saving", async () => {
        waitlistService.createWaitlistEntry.mockReturnValue(new Promise(() => { }));

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled()
        );
    });

    it("shows 'Adding...' text on the button while saving", async () => {
        waitlistService.createWaitlistEntry.mockReturnValue(new Promise(() => { }));

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByRole("button", { name: /adding/i })).toBeInTheDocument()
        );
    });

    it("re-enables the button after an error", async () => {
        waitlistService.createWaitlistEntry.mockRejectedValue(
            new Error("Network Error")
        );

        renderPage();
        submitForm();

        await waitFor(() =>
            expect(screen.getByRole("alert")).toBeInTheDocument()
        );

        expect(
            screen.getByRole("button", { name: /add to waitlist/i })
        ).not.toBeDisabled();
    });
});

// ---------------------------------------------------------------------------
// 6. Form props wired correctly
// ---------------------------------------------------------------------------

describe("WaitlistForm props", () => {
    it("passes formId='create-waitlist-form' to WaitlistForm", () => {
        renderPage();
        expect(screen.getByTestId("waitlist-form")).toHaveAttribute(
            "id",
            "create-waitlist-form"
        );
    });

    it("Add to Waitlist button targets the form via form attribute", () => {
        renderPage();
        const submitBtn = screen.getByRole("button", { name: /add to waitlist/i });
        expect(submitBtn).toHaveAttribute("form", "create-waitlist-form");
    });
});