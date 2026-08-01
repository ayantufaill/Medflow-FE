import store from './src/store/index.js';
import { fetchPatientInsurances } from './src/store/slices/patientSlice.js';

console.log("Initial state:", store.getState().patient.insurancesCache);
store.dispatch(fetchPatientInsurances({ patientId: '2' })).then(res => {
  console.log("Result:", res);
  console.log("Final state:", store.getState().patient.insurancesCache);
});
