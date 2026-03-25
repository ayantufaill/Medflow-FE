# Redux Implementation Guide - MedFlow Project

## 📚 Redux Kya Hai?

**Redux** ek **state management library** hai jo React applications me **global state** manage karne ke liye use hoti hai.

### Simple Analogy:
- **Local State (useState)**: Apke ghar ka drawer (sirf ek component use kar sakta hai)
- **Context API**: Apke ghar ka common room (limited components use kar sakte hain)
- **Redux**: Apke ghar ka **central storage room** (sab components access kar sakte hain, organized, predictable)

---

## 🔄 Redux Toolkit vs Redux Classic

### Redux Classic (Old Way - ❌ Mat Use Karein)
```javascript
// Boilerplate zyada, complex setup
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PATIENT':
      return { ...state, patient: action.payload };
    default:
      return state;
  }
};
```

### Redux Toolkit (Modern Way - ✅ Ye Use Kar Rahe Hain)
```javascript
// Simple, clean, less boilerplate
const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatient: (state, action) => {
      state.patient = action.payload; // Immer automatically handles immutability
    },
  },
});
```

**MedFlow me Redux Toolkit use ho raha hai** ✅

---

## 🏗️ Redux Architecture (MedFlow Project)

### Current Setup:

```
src/store/
├── index.js              # Store configuration
└── slices/
    ├── patientSlice.js      # Patient state
    ├── appointmentSlice.js  # Appointment state
    ├── billingSlice.js      # Billing state
    ├── clinicalSlice.js     # Clinical notes state
    └── uiSlice.js          # UI state (sidebar, modals)
```

### Store Structure:
```javascript
{
  patient: {
    currentPatient: null,
    selectedPatientId: null,
    filters: { search: '', status: '' },
    loading: false,
    error: null
  },
  appointment: {
    currentAppointment: null,
    selectedDate: '2024-01-01',
    calendarView: 'week',
    conflicts: []
  },
  billing: { ... },
  clinical: { ... },
  ui: { ... }
}
```

---

## 🎯 Kab Redux Use Karein vs Kab Nahi?

### ✅ Redux Use Karein Jab:
1. **Multiple components ko same data chahiye**
   - Example: Patient selection (appointments, billing, clinical notes me use hota hai)

2. **State persist karna hai navigation ke baad**
   - Example: Patient filters, calendar view preference

3. **Complex state interactions**
   - Example: Appointment → Billing → Claims (ek dusre se linked)

4. **Time-travel debugging chahiye**
   - Redux DevTools se state history dekh sakte hain

5. **Audit logging chahiye**
   - HIPAA compliance ke liye state changes track karna

### ❌ Redux Mat Use Karein Jab:
1. **Simple local UI state**
   - Example: Button disabled, input value, modal open/close (sirf ek component me)
   - **Solution**: `useState` use karein

2. **Server data fetching**
   - Example: API se patient list fetch karna
   - **Solution**: **React Query** use karein (already installed ✅)

3. **Simple global state (auth, notifications)**
   - Example: User login status, snackbar messages
   - **Solution**: **Context API** use karein (already implemented ✅)

---

## 📖 Redux Concepts (Simple Explanation)

### 1. **Store** (Central Storage)
```javascript
// src/store/index.js
export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    // ...
  }
});
```
- **Kya hai**: Central state storage
- **Kahan hai**: `src/store/index.js`
- **Kya karta hai**: Sab state yahan store hoti hai

### 2. **Slice** (State Module)
```javascript
// src/store/slices/patientSlice.js
const patientSlice = createSlice({
  name: 'patient',
  initialState: { currentPatient: null },
  reducers: {
    setPatient: (state, action) => {
      state.currentPatient = action.payload;
    }
  }
});
```
- **Kya hai**: Ek module ka state + actions
- **Kahan hai**: `src/store/slices/`
- **Kya karta hai**: State define karta hai aur actions create karta hai

### 3. **Actions** (State Change Commands)
```javascript
// Automatically generated from reducers
dispatch(setCurrentPatient(patientData));
```
- **Kya hai**: State change karne ke commands
- **Kahan se aate hain**: Slice ke reducers se automatically generate hote hain
- **Kya karta hai**: Store ko batata hai ki state kaise change karni hai

### 4. **Reducers** (State Update Logic)
```javascript
reducers: {
  setPatient: (state, action) => {
    state.currentPatient = action.payload; // Immer handles immutability
  }
}
```
- **Kya hai**: Functions jo state update karte hain
- **Kahan hain**: Slice ke andar `reducers` object me
- **Kya karta hai**: Action ke basis par state update karta hai

### 5. **Selectors** (State Read Functions)
```javascript
// In slice file
export const selectCurrentPatient = (state) => state.patient.currentPatient;

// In component
const patient = useSelector(selectCurrentPatient);
```
- **Kya hai**: Functions jo state read karte hain
- **Kahan hain**: Slice file ke end me
- **Kya karta hai**: Component ko state access karne deta hai

---

## 💻 Redux Usage in Components

### Step 1: Import Hooks
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPatient } from '../store/slices/patientSlice';
import { selectCurrentPatient } from '../store/slices/patientSlice';
```

### Step 2: Read State (useSelector)
```javascript
function PatientComponent() {
  // Read state from Redux
  const currentPatient = useSelector(selectCurrentPatient);
  const selectedPatientId = useSelector(selectSelectedPatientId);
  
  return <div>{currentPatient?.name}</div>;
}
```

### Step 3: Update State (useDispatch)
```javascript
function PatientComponent() {
  const dispatch = useDispatch();
  
  const handleSelectPatient = (patient) => {
    // Update state in Redux
    dispatch(setCurrentPatient(patient));
  };
  
  return <button onClick={() => handleSelectPatient(patient)}>Select</button>;
}
```

### Step 4: Custom Hooks (Best Practice)
```javascript
// src/hooks/redux/usePatient.js (Already exists ✅)
import { usePatient } from '../hooks/redux/usePatient';

function PatientComponent() {
  const { currentPatient, setPatient, isLoading } = usePatient();
  
  return <div>{currentPatient?.name}</div>;
}
```

---

## 🔄 Redux + React Query Integration (MedFlow Pattern)

### Current Architecture:
```
┌─────────────────┐
│   Component     │
└────────┬────────┘
         │
         ├─── Redux (Application State)
         │    - Current patient selection
         │    - Filters
         │    - UI preferences
         │
         └─── React Query (Server State)
              - Patient data from API
              - Automatic caching
              - Request deduplication
```

### Example: usePatient Hook (Already Implemented ✅)
```javascript
// src/hooks/redux/usePatient.js
export const usePatient = () => {
  // Redux: Current patient selection
  const currentPatient = useSelector(selectCurrentPatient);
  const selectedPatientId = useSelector(selectSelectedPatientId);
  
  // React Query: Fetch patient data
  const { data: patientData, isLoading } = useQuery({
    queryKey: ['patient', selectedPatientId],
    queryFn: () => patientService.getPatientById(selectedPatientId),
    enabled: !!selectedPatientId,
  });
  
  return {
    currentPatient: patientData || currentPatient,
    isLoading,
    setPatient: (patient) => dispatch(setCurrentPatient(patient)),
  };
};
```

**Why This Pattern?**
- ✅ Redux: Manages **which** patient is selected (application state)
- ✅ React Query: Fetches **patient data** from API (server state)
- ✅ Best of both worlds!

---

## 📝 Redux Implementation Examples

### Example 1: Patient Selection (Already Implemented)
```javascript
// Component me
import { usePatient } from '../hooks/redux/usePatient';

function AppointmentForm() {
  const { currentPatient, setPatientId } = usePatient();
  
  const handlePatientSelect = (patientId) => {
    setPatientId(patientId); // Redux me store hoga
  };
  
  return <div>Current: {currentPatient?.name}</div>;
}
```

### Example 2: Appointment Calendar View (Already Implemented)
```javascript
// Component me
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCalendarView, 
  setCalendarView 
} from '../store/slices/appointmentSlice';

function CalendarPage() {
  const calendarView = useSelector(selectCalendarView); // 'week' | 'month' | 'day'
  const dispatch = useDispatch();
  
  const handleViewChange = (view) => {
    dispatch(setCalendarView(view)); // Redux me save hoga, navigation ke baad bhi rahega
  };
  
  return <button onClick={() => handleViewChange('month')}>Month View</button>;
}
```

### Example 3: Patient Filters (Already Implemented)
```javascript
// Component me
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectPatientFilters, 
  setFilters 
} from '../store/slices/patientSlice';

function PatientsListPage() {
  const filters = useSelector(selectPatientFilters);
  const dispatch = useDispatch();
  
  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm })); // Redux me persist hoga
  };
  
  return <input 
    value={filters.search} 
    onChange={(e) => handleSearch(e.target.value)} 
  />;
}
```

---

## 🚀 New Slice Create Karne Ka Tarika

### Step 1: Create Slice File
```javascript
// src/store/slices/claimsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentClaim: null,
  selectedClaimId: null,
  filters: {
    status: '',
    dateRange: null,
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
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentClaim: (state) => {
      state.currentClaim = null;
      state.selectedClaimId = null;
    },
  },
});

export const {
  setCurrentClaim,
  setFilters,
  clearCurrentClaim,
} = claimsSlice.actions;

// Selectors
export const selectCurrentClaim = (state) => state.claims.currentClaim;
export const selectSelectedClaimId = (state) => state.claims.selectedClaimId;
export const selectClaimFilters = (state) => state.claims.filters;

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
// Component me
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCurrentClaim, 
  setCurrentClaim 
} from '../store/slices/claimsSlice';

function ClaimsListPage() {
  const currentClaim = useSelector(selectCurrentClaim);
  const dispatch = useDispatch();
  
  const handleSelectClaim = (claim) => {
    dispatch(setCurrentClaim(claim));
  };
  
  return <div>{currentClaim?.claimNumber}</div>;
}
```

---

## 🛠️ Redux DevTools

### Installation:
Already configured ✅ (development mode me automatically enable hota hai)

### Usage:
1. Browser me **Redux DevTools Extension** install karein
2. DevTools automatically open hoga
3. Dekh sakte hain:
   - Current state
   - Action history
   - Time-travel debugging
   - State diff

### Access:
- Chrome: Redux DevTools extension
- Firefox: Redux DevTools extension
- Or: `window.__REDUX_DEVTOOLS_EXTENSION__`

---

## 📋 Best Practices

### ✅ Do's:
1. **Selectors use karein** (direct state access se better)
2. **Custom hooks banayein** (reusability ke liye)
3. **Slice me selectors export karein**
4. **Meaningful action names** (e.g., `setCurrentPatient`, not `setData`)
5. **Immer ka fayda uthayein** (mutable syntax, immutable result)

### ❌ Don'ts:
1. **Server data Redux me mat store karein** (React Query use karein)
2. **Simple local state Redux me mat daalein** (useState use karein)
3. **Direct state mutation mat karein** (Immer automatically handle karta hai, but be careful)
4. **Boilerplate mat create karein** (Redux Toolkit already minimal hai)

---

## 🎓 Summary

### MedFlow me Redux:
- ✅ **Redux Toolkit** installed aur configured
- ✅ **5 slices** already created (patient, appointment, billing, clinical, ui)
- ✅ **Store** App.jsx me connected
- ✅ **Custom hooks** available (usePatient)
- ✅ **React Query** integration (server state)
- ✅ **Context API** for simple global state (auth, notifications)

### Next Steps:
1. **Existing slices use karein** components me
2. **New slices create karein** agar zarurat ho (e.g., claims, era, authorizations)
3. **Custom hooks banayein** reusability ke liye
4. **Redux DevTools** use karein debugging ke liye

---

## ❓ Common Questions

### Q: Redux vs React Query?
**A**: 
- **Redux**: Application state (which patient selected, filters, UI preferences)
- **React Query**: Server state (API data, caching, fetching)

### Q: Redux vs Context API?
**A**:
- **Redux**: Complex state, multiple modules, time-travel debugging
- **Context API**: Simple global state (auth, notifications)

### Q: Kya sab kuch Redux me daalna chahiye?
**A**: **Nahi!** Sirf wo state jo:
- Multiple components me share honi hai
- Navigation ke baad persist honi hai
- Complex interactions hai

### Q: Redux me server data kyun nahi?
**A**: React Query better hai:
- Automatic caching
- Request deduplication
- Background refetching
- Less boilerplate

---

**Ab aap Redux samajh gaye hain! 🎉**

Agar koi specific feature implement karna ho, bataiye!
