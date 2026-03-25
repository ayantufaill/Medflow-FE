# Redux Implementation Changelog

## Overview

Implemented **Redux Toolkit** across the MedFlow frontend to centralize state management, eliminate redundant API calls, and cache shared data (providers, rooms, appointment types) so they are fetched **once** and reused across all pages/forms.

---

## Architecture

```
src/
├── store/
│   ├── index.js                      # Redux store configuration
│   └── slices/
│       ├── patientSlice.js           # Patient list + CRUD state (updated)
│       ├── appointmentSlice.js       # Appointment list + CRUD state (updated)
│       ├── providerSlice.js          # Provider list state (NEW)
│       ├── roomSlice.js              # Room list state (NEW)
│       ├── appointmentTypeSlice.js   # Appointment type list state (NEW)
│       ├── billingSlice.js           # Billing state (existing)
│       ├── clinicalSlice.js          # Clinical state (existing)
│       └── uiSlice.js               # UI state (existing)
├── hooks/redux/
│   ├── index.js                      # Central exports (updated)
│   ├── usePatient.js                 # Patient hook with Redux + React Query (updated)
│   ├── useAppointment.js             # Appointment hook (NEW)
│   └── useDropdownData.js            # Shared dropdown data hook (NEW)
```

---

## New Files Created

### 1. `src/store/slices/providerSlice.js`
- Redux slice for provider data
- `fetchProviders` async thunk — calls `providerService.getAllProviders()`
- Selectors: `selectProviders`, `selectProvidersLoading`, `selectProvidersError`, `selectTotalProviders`
- Reducers: `updateProviderStatus`, `removeProvider`

### 2. `src/store/slices/roomSlice.js`
- Redux slice for room data
- `fetchRooms` async thunk — calls `roomService.getAllRooms()`
- Selectors: `selectRooms`, `selectRoomsLoading`, `selectRoomsError`, `selectTotalRooms`
- Reducers: `updateRoomStatus`, `removeRoom`

### 3. `src/store/slices/appointmentTypeSlice.js`
- Redux slice for appointment type data
- `fetchAppointmentTypes` async thunk — calls `appointmentTypeService.getAllAppointmentTypes()`
- Selectors: `selectAppointmentTypes`, `selectAppointmentTypesLoading`, `selectAppointmentTypesError`, `selectTotalAppointmentTypes`
- Reducers: `updateAppointmentTypeStatus`, `removeAppointmentType`

### 4. `src/hooks/redux/useDropdownData.js`
- **Key hook** — fetches and caches shared dropdown data
- Accepts config object: `{ providers: true, appointmentTypes: true, rooms: true, languages: true }`
- Only dispatches fetch if data is not already in the store (prevents duplicate API calls)
- Returns: `{ providers, providersLoading, appointmentTypes, appointmentTypesLoading, rooms, roomsLoading, languages, languagesLoading }`

### 5. `src/hooks/redux/useAppointment.js`
- Hook for appointment list data
- Wraps Redux selectors and dispatch for clean component usage
- Returns: `{ appointmentsList, totalAppointments, loading, error, getAppointments, updateStatus, updateCopay, deleteAppointment }`

---

## Modified Files

### Store Configuration

| File | Changes |
|------|---------|
| `src/store/index.js` | Added `providerReducer`, `roomReducer`, `appointmentTypeReducer` to store. Updated middleware `serializableCheck` to ignore new thunk actions and state paths. |

### Existing Slices (Updated)

| File | Changes |
|------|---------|
| `src/store/slices/patientSlice.js` | Added `fetchPatients` async thunk, `list`/`total` state, `updatePatientStatus`/`removePatient` reducers, and selectors. |
| `src/store/slices/appointmentSlice.js` | Added `fetchAppointments` async thunk, `list`/`total` state, `updateAppointmentStatus`/`updateAppointmentCopay`/`removeAppointment` reducers, and selectors. |

### Hooks

| File | Changes |
|------|---------|
| `src/hooks/redux/index.js` | Added exports for `useAppointment` and `useDropdownData`. |
| `src/hooks/redux/usePatient.js` | Updated to use Redux for patient list data alongside React Query for single patient fetches. |

### List Pages (Now use Redux for data fetching)

| Page | Before | After |
|------|--------|-------|
| `PatientsListPage.jsx` | Local `useState` + `useCallback` API calls | `useSelector` + `dispatch(fetchPatients())` |
| `AppointmentsListPage.jsx` | Local `useState` + `useCallback` API calls | `useSelector` + `dispatch(fetchAppointments())` |
| `ProvidersListPage.jsx` | Local `useState` + `useCallback` API calls | `useSelector` + `dispatch(fetchProviders())` |
| `RoomsListPage.jsx` | Local `useState` + `useCallback` API calls | `useSelector` + `dispatch(fetchRooms())` |
| `AppointmentTypesListPage.jsx` | Local `useState` + `useCallback` API calls | `useSelector` + `dispatch(fetchAppointmentTypes())` |

**Key benefits for list pages:**
- Delete/status-change operations update Redux store directly (no full refetch needed)
- Pagination, filtering, and search dispatch new thunks with updated params
- Loading/error states managed by Redux

### Forms (Now use `useDropdownData` for shared data)

| Form | Data Now from Redux |
|------|-------------------|
| `AppointmentForm.jsx` | Providers, Rooms, Appointment Types |
| `RecurringAppointmentForm.jsx` | Providers, Appointment Types |
| `WaitlistForm.jsx` | Providers, Appointment Types |
| `InvoiceForm.jsx` | Providers |
| `CreateClinicalNotePage.jsx` | Providers |
| `CreateEstimatePage.jsx` | Providers |
| `EditEstimatePage.jsx` | Providers |
| `SchedulePage.jsx` | Providers |
| `AppointmentCalendarPage.jsx` | Providers |

**Key benefits for forms:**
- Providers, rooms, and appointment types are fetched **once** on first use, then cached
- Navigating between forms doesn't re-fetch the same data
- Removed `Promise.all` calls that fetched providers/rooms/types alongside page-specific data
- Removed unused `providerService` and `appointmentTypeService` imports from forms

---

## How Data Flows

```
Component mounts
    │
    ├── useDropdownData({ providers: true, rooms: true })
    │       │
    │       ├── Checks Redux store: providers.list.length > 0 ?
    │       │       ├── YES → Return cached data (no API call)
    │       │       └── NO  → dispatch(fetchProviders({ page:1, limit:100, isActive:true }))
    │       │                      │
    │       │                      └── providerSlice extraReducer handles pending/fulfilled/rejected
    │       │                              │
    │       │                              └── state.list = [...providers]
    │       │
    │       └── Same for rooms, appointmentTypes
    │
    └── Component renders with cached data from useSelector()
```

---

## API Calls Eliminated

| Scenario | Before | After |
|----------|--------|-------|
| Open AppointmentForm | 5 API calls (patients, providers, rooms, types, languages) | 2 API calls (patients, languages) — rest from Redux cache |
| Navigate to RecurringAppointmentForm | 3 API calls (patients, providers, types) | 1 API call (patients) — rest from Redux cache |
| Open WaitlistForm | 3 API calls (patients, providers, types) | 1 API call (patients) — rest from Redux cache |
| Open CreateEstimatePage | 2 API calls (patients, providers) | 1 API call (patients) — providers from cache |
| Open SchedulePage | 1 API call (providers) | 0 API calls — providers from cache |
| Switch between list pages | Each page refetches its list | Lists cached in Redux, only refetch on filter/page change |

---

## Pattern: List Page Redux Integration

```jsx
// Before (local state):
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const fetchItems = useCallback(async () => {
  setLoading(true);
  const result = await service.getAll(page, limit);
  setItems(result.items);
  setLoading(false);
}, [page, limit]);
useEffect(() => { fetchItems(); }, [fetchItems]);

// After (Redux):
const dispatch = useDispatch();
const items = useSelector(selectItems);
const loading = useSelector(selectItemsLoading);
useEffect(() => {
  dispatch(fetchItems({ page, limit }));
}, [dispatch, page, limit]);

// Delete: update store directly, no refetch
const handleDelete = async (id) => {
  await service.delete(id);
  dispatch(removeItem(id)); // Instant UI update
};
```

---

## Pattern: Form Dropdown Redux Integration

```jsx
// Before (direct API call in every form):
const [providers, setProviders] = useState([]);
useEffect(() => {
  providerService.getAllProviders(1, 100).then(r => setProviders(r.providers));
}, []);

// After (Redux cached):
const { providers, providersLoading } = useDropdownData({ providers: true });
// No useEffect needed — hook handles fetching + caching internally
```

---

## Fix: Duplicate API Calls Prevention

### Problem
List pages like `ProvidersListPage` and `AppointmentTypesListPage` had **two separate `useEffect`s** that both fired on mount — causing 2-3 duplicate API calls:

```jsx
// OLD (BAD) — two effects both fire on mount:
useEffect(() => { doFetch(search); }, [page, rowsPerPage, statusFilter]); // fires on mount
useEffect(() => { setTimeout(() => doFetch(search), 500); }, [search]);   // fires 500ms later
```

### Fix Applied

**1. Consolidated to single `useEffect` with `useDebounce`:**

```jsx
// NEW (GOOD) — one effect, debounced search:
const [debouncedSearch] = useDebounce(search, 500);

useEffect(() => {
  dispatch(fetchProviders({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearch.trim(),
    isActive,
  }));
}, [dispatch, page, rowsPerPage, debouncedSearch, statusFilter]); // single effect
```

**2. Added `condition` to all `createAsyncThunk`s** to block duplicate in-flight requests:

```jsx
export const fetchProviders = createAsyncThunk(
  'provider/fetchProviders',
  async (params, { rejectWithValue }) => { /* ... */ },
  {
    // If already loading, skip this dispatch entirely
    condition: (_, { getState }) => {
      const { provider } = getState();
      return !provider.listLoading;
    },
  }
);
```

### Pages Fixed
| Page | Before | After |
|------|--------|-------|
| `ProvidersListPage.jsx` | 3 API calls on mount | **1 API call** |
| `AppointmentTypesListPage.jsx` | 3 API calls on mount | **1 API call** |

### Thunks with `condition` Guard
| Thunk | Prevents duplicate when... |
|-------|---------------------------|
| `fetchProviders` | `provider.listLoading === true` |
| `fetchRooms` | `room.listLoading === true` |
| `fetchAppointmentTypes` | `appointmentType.listLoading === true` |
| `fetchPatients` | `patient.listLoading === true` |
| `fetchAppointments` | `appointment.listLoading === true` |
