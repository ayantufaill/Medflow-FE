import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchPatientInsurances, updatePatientInsuranceThunk } from './patientSlice';
import { patientService } from '../../services/patient.service';

jest.mock('../../services/patient.service', () => ({ patientService: {
  updatePatientInsurance: jest.fn(),
  getPatientInsurances: jest.fn(),
  getInsuranceUsage: jest.fn(),
} }));
jest.mock('../../services/document.service', () => ({ documentService: {} }));
jest.mock('../../services/invoice.service', () => ({ invoiceService: {} }));

const makeStore = () => configureStore({ reducer: { patient: reducer } });
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};

beforeEach(() => {
  jest.clearAllMocks();
  patientService.getInsuranceUsage.mockResolvedValue({ coverages: [] });
});

test('coverage save waits for the refreshed met amount before completing', async () => {
  const store = makeStore();
  const refresh = deferred();
  const saved = { _id: '12', deductiblesGrid: [{ type: 'Standard', metAmount: 0 }] };
  patientService.updatePatientInsurance.mockResolvedValue(saved);
  patientService.getPatientInsurances.mockReturnValue(refresh.promise);

  const save = store.dispatch(updatePatientInsuranceThunk({
    patientId: '7', insuranceId: '12', payload: { deductiblesGrid: saved.deductiblesGrid },
  }));
  await Promise.resolve();
  await Promise.resolve();
  expect(patientService.getPatientInsurances).toHaveBeenCalledWith('7', undefined);

  let completed = false;
  save.then(() => { completed = true; });
  await Promise.resolve();
  expect(completed).toBe(false);

  refresh.resolve([saved]);
  await expect(save.unwrap()).resolves.toEqual(saved);
  expect(store.getState().patient.insurancesCache['7'].data[0].deductiblesGrid[0].metAmount).toBe(0);
});

test('an older insurance response cannot replace the list refreshed after saving', async () => {
  const store = makeStore();
  const oldResponse = deferred();
  const freshResponse = deferred();
  patientService.getPatientInsurances
    .mockReturnValueOnce(oldResponse.promise)
    .mockReturnValueOnce(freshResponse.promise);
  patientService.updatePatientInsurance.mockResolvedValue({ _id: '12' });

  const oldFetch = store.dispatch(fetchPatientInsurances({ patientId: '7', force: true }));
  const save = store.dispatch(updatePatientInsuranceThunk({ patientId: '7', insuranceId: '12', payload: {} }));
  await Promise.resolve();
  freshResponse.resolve([{ _id: '12', deductiblesGrid: [{ type: 'Standard', metAmount: 200 }] }]);
  await save.unwrap();
  oldResponse.resolve([{ _id: '12', deductiblesGrid: [{ type: 'Standard', metAmount: 500 }] }]);
  await oldFetch;

  expect(store.getState().patient.insurancesCache['7'].data[0].deductiblesGrid[0].metAmount).toBe(200);
});
