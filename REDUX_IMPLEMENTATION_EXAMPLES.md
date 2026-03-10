# Redux Implementation Examples - MedFlow

## 📋 Current Status

### ✅ Already Implemented:
1. **Redux Store** - Configured in `src/store/index.js`
2. **5 Slices** - patient, appointment, billing, clinical, ui
3. **Custom Hook** - `usePatient` hook (Redux + React Query)
4. **Provider** - Connected in `App.jsx`

### ⚠️ Can Be Improved:
1. **AppointmentForm** - Patient selection abhi local state use kar raha hai
2. **Calendar View** - Redux me store ho sakta hai
3. **Filters** - Redux me persist ho sakte hain

---

## 🎯 Example 1: AppointmentForm me Redux Integration

### Current (Local State):
```javascript
// src/components/appointments/AppointmentForm.jsx
const [selectedPatient, setSelectedPatient] = useState(null);

const handlePatientSelect = (patient) => {
  setSelectedPatient(patient);
  // Local state me store ho raha hai
};
```

### Improved (Redux):
```javascript
// src/components/appointments/AppointmentForm.jsx
import { usePatient } from '../../hooks/redux/usePatient';
import { useSelector } from 'react-redux';
import { selectCurrentAppointment } from '../../store/slices/appointmentSlice';

const AppointmentForm = ({ initialData, onSubmit }) => {
  // Redux se current patient le rahe hain
  const { currentPatient, setPatient } = usePatient();
  
  // Redux se current appointment le rahe hain
  const currentAppointment = useSelector(selectCurrentAppointment);
  
  const handlePatientSelect = (patient) => {
    setPatient(patient); // Redux me store hoga
    // Ab appointments, billing, clinical notes sab me available hoga
  };
  
  return (
    <Autocomplete
      value={currentPatient}
      onChange={(e, newValue) => handlePatientSelect(newValue)}
      // ...
    />
  );
};
```

**Benefits:**
- ✅ Patient selection ab sab components me available hoga
- ✅ Navigation ke baad bhi persist rahega
- ✅ Billing aur clinical notes me automatically available hoga

---

## 🎯 Example 2: Calendar View Preference (Already Implemented)

### Current Implementation:
```javascript
// src/pages/appointments/AppointmentCalendarPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCalendarView, 
  setCalendarView,
  selectSelectedDate,
  setSelectedDate
} from '../../store/slices/appointmentSlice';

function AppointmentCalendarPage() {
  const calendarView = useSelector(selectCalendarView); // 'week' | 'month' | 'day'
  const selectedDate = useSelector(selectSelectedDate);
  const dispatch = useDispatch();
  
  const handleViewChange = (view) => {
    dispatch(setCalendarView(view)); // Redux me save hoga
  };
  
  const handleDateChange = (date) => {
    dispatch(setSelectedDate(date.toISOString())); // Redux me save hoga
  };
  
  return (
    <Box>
      <Button onClick={() => handleViewChange('month')}>Month</Button>
      <Button onClick={() => handleViewChange('week')}>Week</Button>
      {/* Calendar view persist rahega navigation ke baad bhi */}
    </Box>
  );
}
```

**Benefits:**
- ✅ Calendar view preference persist rahega
- ✅ Selected date sab appointment pages me share hoga

---

## 🎯 Example 3: Patient Filters (Already Implemented)

### Current Implementation:
```javascript
// src/pages/patients/PatientsListPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectPatientFilters, 
  setFilters,
  clearFilters
} from '../../store/slices/patientSlice';

function PatientsListPage() {
  const filters = useSelector(selectPatientFilters);
  const dispatch = useDispatch();
  
  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm })); // Redux me persist hoga
  };
  
  const handleStatusFilter = (status) => {
    dispatch(setFilters({ status })); // Redux me persist hoga
  };
  
  // Filters navigation ke baad bhi rahenge
  return (
    <TextField
      value={filters.search}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search patients..."
    />
  );
}
```

**Benefits:**
- ✅ Filters navigation ke baad bhi persist rahenge
- ✅ Better UX (user ko dobara filter set nahi karna padega)

---

## 🎯 Example 4: New Slice - Claims Module

### Step 1: Create Claims Slice
```javascript
// src/store/slices/claimsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentClaim: null,
  selectedClaimId: null,
  filters: {
    status: '',
    dateRange: null,
    search: '',
  },
  loading: false,
  error: null,
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setCurrentClaim: (state, action) => {
      state.currentClaim = action.payload;
      state.selectedClaimId = action.payload?._id || null;
      state.error = null;
    },
    setSelectedClaimId: (state, action) => {
      state.selectedClaimId = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentClaim: (state) => {
      state.currentClaim = null;
      state.selectedClaimId = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentClaim,
  setSelectedClaimId,
  setFilters,
  clearFilters,
  clearCurrentClaim,
  setLoading,
  setError,
} = claimsSlice.actions;

// Selectors
export const selectCurrentClaim = (state) => state.claims.currentClaim;
export const selectSelectedClaimId = (state) => state.claims.selectedClaimId;
export const selectClaimFilters = (state) => state.claims.filters;
export const selectClaimLoading = (state) => state.claims.loading;
export const selectClaimError = (state) => state.claims.error;

export default claimsSlice.reducer;
```

### Step 2: Add to Store
```javascript
// src/store/index.js
import claimsReducer from './slices/claimsSlice';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    billing: billingReducer,
    clinical: clinicalReducer,
    ui: uiReducer,
    claims: claimsReducer, // ✅ Add here
  },
});
```

### Step 3: Use in Component
```javascript
// src/pages/claims/ClaimsListPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCurrentClaim, 
  selectClaimFilters,
  setCurrentClaim,
  setFilters
} from '../../store/slices/claimsSlice';

function ClaimsListPage() {
  const currentClaim = useSelector(selectCurrentClaim);
  const filters = useSelector(selectClaimFilters);
  const dispatch = useDispatch();
  
  const handleSelectClaim = (claim) => {
    dispatch(setCurrentClaim(claim)); // Redux me store hoga
    // Ab ViewClaimPage me automatically available hoga
  };
  
  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters)); // Redux me persist hoga
  };
  
  return (
    <div>
      <TextField
        value={filters.search}
        onChange={(e) => handleFilterChange({ search: e.target.value })}
      />
      {/* Claim list */}
    </div>
  );
}
```

---

## 🎯 Example 5: Custom Hook - useAppointment

### Create Custom Hook:
```javascript
// src/hooks/redux/useAppointment.js
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  selectCurrentAppointment,
  selectSelectedAppointmentId,
  selectCalendarView,
  selectSelectedDate,
  setCurrentAppointment,
  setSelectedAppointmentId,
  setCalendarView,
  setSelectedDate,
} from '../../store/slices/appointmentSlice';
import { appointmentService } from '../../services/appointment.service';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id) => [...appointmentKeys.details(), id] as const,
};

export const useAppointment = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const currentAppointment = useSelector(selectCurrentAppointment);
  const selectedAppointmentId = useSelector(selectSelectedAppointmentId);
  const calendarView = useSelector(selectCalendarView);
  const selectedDate = useSelector(selectSelectedDate);
  
  // React Query - Fetch appointment data
  const {
    data: appointmentData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: appointmentKeys.detail(selectedAppointmentId),
    queryFn: async () => {
      if (!selectedAppointmentId) return null;
      return await appointmentService.getAppointmentById(selectedAppointmentId);
    },
    enabled: !!selectedAppointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Actions
  const setAppointment = (appointment) => {
    dispatch(setCurrentAppointment(appointment));
    if (appointment?._id || appointment?.id) {
      dispatch(setSelectedAppointmentId(appointment._id || appointment.id));
    }
  };
  
  const setAppointmentId = (appointmentId) => {
    dispatch(setSelectedAppointmentId(appointmentId));
  };
  
  return {
    // State
    currentAppointment: appointmentData || currentAppointment,
    appointmentData,
    selectedAppointmentId,
    calendarView,
    selectedDate,
    isLoading,
    error,
    
    // Actions
    setAppointment,
    setAppointmentId,
    setCalendarView: (view) => dispatch(setCalendarView(view)),
    setSelectedDate: (date) => dispatch(setSelectedDate(date)),
    refetch,
  };
};
```

### Use in Component:
```javascript
// src/pages/appointments/ViewAppointmentPage.jsx
import { useAppointment } from '../../hooks/redux/useAppointment';

function ViewAppointmentPage() {
  const { currentAppointment, isLoading, setAppointment } = useAppointment();
  
  // Ab sab kuch ek hook se mil raha hai!
  return <div>{currentAppointment?.patientId?.name}</div>;
}
```

---

## 🎯 Example 6: UI State Management

### Current Implementation (uiSlice):
```javascript
// src/store/slices/uiSlice.js (Already exists ✅)
// Sidebar state, modal states, loading states

// Use in Component:
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectSidebarOpen,
  setSidebarOpen
} from '../../store/slices/uiSlice';

function Layout() {
  const sidebarOpen = useSelector(selectSidebarOpen);
  const dispatch = useDispatch();
  
  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!sidebarOpen)); // Redux me store hoga
  };
  
  return <Drawer open={sidebarOpen}>...</Drawer>;
}
```

---

## 📝 Summary: Redux Implementation Checklist

### ✅ Already Done:
- [x] Redux Toolkit installed
- [x] Store configured
- [x] 5 slices created (patient, appointment, billing, clinical, ui)
- [x] Provider connected in App.jsx
- [x] Custom hook (usePatient) created
- [x] Calendar view using Redux
- [x] Patient filters using Redux

### 🔄 Can Be Improved:
- [ ] AppointmentForm me patient selection Redux se karein
- [ ] Custom hook (useAppointment) create karein
- [ ] Claims slice create karein (agar zarurat ho)
- [ ] ERA slice create karein (agar zarurat ho)
- [ ] Authorizations slice create karein (agar zarurat ho)

### 🎯 Best Practices:
1. **Selectors use karein** (direct state access se better)
2. **Custom hooks banayein** (reusability ke liye)
3. **Server data React Query me** (Redux me mat daalein)
4. **Simple UI state useState me** (Redux me mat daalein)

---

## ❓ Questions?

Agar koi specific component me Redux implement karna ho, bataiye!
