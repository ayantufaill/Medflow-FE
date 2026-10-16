import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchInsuranceUsage, invalidateInsuranceUsage } from './patientSlice';
import { patientService } from '../../services/patient.service';

jest.mock('../../services/patient.service', () => ({ patientService: { getInsuranceUsage: jest.fn() } }));
jest.mock('../../services/document.service', () => ({ documentService: {} }));
jest.mock('../../services/invoice.service', () => ({ invoiceService: {} }));

const makeStore = () => configureStore({ reducer: { patient: reducer } });
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};

beforeEach(() => { jest.clearAllMocks(); });

test('a forced refresh after a coverage save wins over an earlier usage response', async () => {
  const store = makeStore();
  const oldResponse = deferred();
  const newResponse = deferred();
  patientService.getInsuranceUsage
    .mockReturnValueOnce(oldResponse.promise)
    .mockReturnValueOnce(newResponse.promise);

  const oldRequest = store.dispatch(fetchInsuranceUsage('7'));
  store.dispatch(invalidateInsuranceUsage('7'));
  const newRequest = store.dispatch(fetchInsuranceUsage({ patientId: '7', force: true }));
  newResponse.resolve({ coverages: [{ coverageId: '12', usedAmount: 500, annualMax: 2000, remaining: 1500 }] });
  await newRequest;
  oldResponse.resolve({ coverages: [{ coverageId: '12', usedAmount: 0, annualMax: 2000, remaining: 2000 }] });
  await oldRequest;

  expect(patientService.getInsuranceUsage).toHaveBeenCalledTimes(2);
  expect(store.getState().patient.insuranceUsageCache['7'].data.coverages[0]).toMatchObject({ usedAmount: 500, remaining: 1500 });
  expect(store.getState().patient.insuranceUsageLoading).toBe(false);
});
