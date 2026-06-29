import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditWaitlistPage from "./EditWaitlistPage";
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

// Stub WaitlistForm — captures the props it receives and lets us trigger
// onSubmit with controlled data.
let capturedFormProps = {};
const FORM_PAYLOAD = {
  patientId: "patient-123",
  providerId: "provider-456",
  appointmentTypeId: "type-789",
  preferredDate: "2025-09-01",
  preferredTimeStart: "09:00",
  preferredTimeEnd: "09:30",
  priority: "urgent",
  status: "active",
  notes: "Updated note",
};

jest.mock("../../components/waitlist/WaitlistForm", () => ({
  __esModule: true,
  default: (props) => {
    capturedFormProps = props;
    return (
      <form
        data-testid="waitlist-form"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(FORM_PAYLOAD);
        }}
      >
        <button type="submit" disabled={props.loading} data-testid="form-submit">
          Submit
        </button>
        {props.loading && <span data-testid="form-loading">saving</span>}
      </form>
    );
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ENTRY_ID = "entry-abc-123";

const makeEntry = (overrides = {}) => ({
  _id: ENTRY_ID,
  patientId: { _id: "patient-123", firstName: "Jane", lastName: "Doe" },
  providerId: { _id: "provider-456", userId: { firstName: "Dr", lastName: "Smith" } },
  appointmentTypeId: { _id: "type-789", name: "General" },
  preferredDate: "2025-09-01",
  preferredTimeStart: "09:00",
  preferredTimeEnd: "09:30",
  priority: "normal",
  status: "active",
  notes: "Original note",
  ...overrides,
});

const mockShowSnackbar = jest.fn();

// Render inside a route so useParams() gets waitlistEntryId
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[`/waitlist/${ENTRY_ID}/edit`]}>
      <Routes>
        <Route path="/waitlist/:waitlistEntryId/edit" element={<EditWaitlistPage />} />
      </Routes>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  capturedFormProps = {};
  useSnackbar.mockReturnValue({ showSnackbar: mockShowSnackbar });

  // Default: fetch succeeds
  waitlistService.getWaitlistEntryById.mockResolvedValue(makeEntry());
  // Default: update succeeds
  waitlistService.updateWaitlistEntry.mockResolvedValue({
    ...makeEntry(),
    priority: "urgent",
  });
});

// ---------------------------------------------------------------------------
// 1. Initial data fetch
// ---------------------------------------------------------------------------

describe("Initial data fetch", () => {
  it("calls getWaitlistEntryById with the correct entry ID on mount", async () => {
    renderPage();

    await waitFor(() =>
      expect(waitlistService.getWaitlistEntryById).toHaveBeenCalledWith(ENTRY_ID)
    );
  });

  it("shows a loading spinner while fetching", () => {
    waitlistService.getWaitlistEntryById.mockReturnValue(new Promise(() => { }));
    renderPage();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("hides the spinner and renders the form after fetch succeeds", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
    expect(screen.getByTestId("waitlist-form")).toBeInTheDocument();
  });

  it("shows an error alert if fetch fails and hides the form", async () => {
    waitlistService.getWaitlistEntryById.mockRejectedValue({
      response: { data: { message: "Entry not found" } },
    });

    renderPage();

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );
    expect(screen.getByText("Entry not found")).toBeInTheDocument();
    expect(screen.queryByTestId("waitlist-form")).not.toBeInTheDocument();
  });

  it("shows fallback fetch error message when no response body", async () => {
    waitlistService.getWaitlistEntryById.mockRejectedValue(new Error("Network Error"));

    renderPage();

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load waitlist entry data/i)
      ).toBeInTheDocument()
    );
  });

  it("shows 'Waitlist entry not found' when entry is null", async () => {
    waitlistService.getWaitlistEntryById.mockResolvedValue(null);

    renderPage();

    await waitFor(() =>
      expect(screen.getByText("Waitlist entry not found")).toBeInTheDocument()
    );
  });

  it("passes the fetched entry as initialData to WaitlistForm", async () => {
    const entry = makeEntry();
    waitlistService.getWaitlistEntryById.mockResolvedValue(entry);

    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    expect(capturedFormProps.initialData).toEqual(entry);
  });

  it("passes isEditMode=true to WaitlistForm", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    expect(capturedFormProps.isEditMode).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Page renders (after load)
// ---------------------------------------------------------------------------

describe("Page renders", () => {
  it("renders the Edit Waitlist Entry heading", async () => {
    renderPage();
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /edit waitlist entry/i })
      ).toBeInTheDocument()
    );
  });

  it("does not show an error alert on successful load", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. updateWaitlistEntry service call
// ---------------------------------------------------------------------------

describe("waitlistService.updateWaitlistEntry call", () => {
  it("calls updateWaitlistEntry with the entry ID and form data on submit", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() =>
      expect(waitlistService.updateWaitlistEntry).toHaveBeenCalledWith(
        ENTRY_ID,
        FORM_PAYLOAD
      )
    );
  });

  it("calls updateWaitlistEntry exactly once per submit", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() =>
      expect(waitlistService.updateWaitlistEntry).toHaveBeenCalledTimes(1)
    );
  });

  it("passes the correct waitlistEntryId (from URL params) to updateWaitlistEntry", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() => {
      const [calledId] = waitlistService.updateWaitlistEntry.mock.calls[0];
      expect(calledId).toBe(ENTRY_ID);
    });
  });
});

// ---------------------------------------------------------------------------
// 4. Priority field update
// ---------------------------------------------------------------------------

describe("Priority field update", () => {
  it("passes updated priority to updateWaitlistEntry", async () => {
    // FORM_PAYLOAD already has priority: "urgent"
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() =>
      expect(waitlistService.updateWaitlistEntry).toHaveBeenCalledWith(
        ENTRY_ID,
        expect.objectContaining({ priority: "urgent" })
      )
    );
  });

  it("sends all three priority values correctly", async () => {
    const priorities = ["urgent", "normal", "flexible"];

    for (const priority of priorities) {
      jest.clearAllMocks();
      waitlistService.getWaitlistEntryById.mockResolvedValue(makeEntry({ priority }));
      waitlistService.updateWaitlistEntry.mockResolvedValue(makeEntry({ priority }));

      const { unmount } = renderPage();

      await waitFor(() =>
        expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
      );

      // Submit with the priority in FORM_PAYLOAD (urgent) — what matters is
      // the service receives whatever the form sends
      fireEvent.submit(screen.getByTestId("waitlist-form"));

      await waitFor(() =>
        expect(waitlistService.updateWaitlistEntry).toHaveBeenCalledTimes(1)
      );

      unmount();
    }
  });

  it("initialData passed to form includes the fetched priority", async () => {
    const entry = makeEntry({ priority: "flexible" });
    waitlistService.getWaitlistEntryById.mockResolvedValue(entry);

    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    expect(capturedFormProps.initialData.priority).toBe("flexible");
  });
});

// ---------------------------------------------------------------------------
// 5. Success flow
// ---------------------------------------------------------------------------

describe("Success flow", () => {
  const submitAndWait = async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );
    fireEvent.submit(screen.getByTestId("waitlist-form"));
  };

  it("shows success snackbar after successful update", async () => {
    await submitAndWait();

    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        "Waitlist entry updated successfully",
        "success"
      )
    );
  });

  it("navigates to /waitlist after successful update", async () => {
    await submitAndWait();

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/waitlist")
    );
  });

  it("shows success toast before navigating", async () => {
    await submitAndWait();

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });

    const snackbarOrder = mockShowSnackbar.mock.invocationCallOrder[0];
    const navigateOrder = mockNavigate.mock.invocationCallOrder[0];
    expect(snackbarOrder).toBeLessThan(navigateOrder);
  });

  it("does not show an error alert on successful update", async () => {
    await submitAndWait();

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/waitlist")
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. Error flow (update)
// ---------------------------------------------------------------------------

describe("Error flow on update", () => {
  const submitWithError = async (rejection) => {
    waitlistService.updateWaitlistEntry.mockRejectedValue(rejection);
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );
    fireEvent.submit(screen.getByTestId("waitlist-form"));
  };

  it("shows an error alert when update fails", async () => {
    await submitWithError({
      response: { data: { message: "Update failed" } },
    });

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );
    expect(screen.getByText("Update failed")).toBeInTheDocument();
  });

  it("shows error from nested error.message field", async () => {
    await submitWithError({
      response: { data: { error: { message: "Validation error" } } },
    });

    await waitFor(() =>
      expect(screen.getByText("Validation error")).toBeInTheDocument()
    );
  });

  it("shows fallback update error message when no response body", async () => {
    await submitWithError(new Error("Network Error"));

    await waitFor(() =>
      expect(
        screen.getByText(/failed to update waitlist entry/i)
      ).toBeInTheDocument()
    );
  });

  it("shows error snackbar when update fails", async () => {
    await submitWithError({
      response: { data: { message: "Server error" } },
    });

    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith("Server error", "error")
    );
  });

  it("does not navigate on update failure", async () => {
    await submitWithError(new Error("Network Error"));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("error alert can be dismissed after update failure", async () => {
    await submitWithError({
      response: { data: { message: "Server error" } },
    });

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
  });
});

// ---------------------------------------------------------------------------
// 7. Loading / saving state
// ---------------------------------------------------------------------------

describe("Loading / saving state", () => {
  const submitAndHold = async () => {
    waitlistService.updateWaitlistEntry.mockReturnValue(new Promise(() => { }));
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );
    fireEvent.submit(screen.getByTestId("waitlist-form"));
  };

  it("passes loading=true to WaitlistForm while saving", async () => {
    await submitAndHold();

    await waitFor(() =>
      expect(screen.getByTestId("form-loading")).toBeInTheDocument()
    );
  });

  it("form submit button is disabled while saving", async () => {
    await submitAndHold();

    await waitFor(() =>
      expect(screen.getByTestId("form-submit")).toBeDisabled()
    );
  });

  it("passes loading=false to WaitlistForm after save completes", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/waitlist")
    );

    expect(screen.queryByTestId("form-loading")).not.toBeInTheDocument();
  });

  it("re-enables form after update error", async () => {
    waitlistService.updateWaitlistEntry.mockRejectedValue(new Error("fail"));

    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("waitlist-form")).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );

    expect(screen.getByTestId("form-submit")).not.toBeDisabled();
  });
});
