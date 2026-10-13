import apiClient from '../config/api';
import { patientService } from './patient.service';

jest.mock('../config/api', () => ({ __esModule: true, default: { get: jest.fn() } }));

test('timeline strict mode surfaces a 404 while preserving legacy audit callers', async () => {
  const error = { response: { status: 404 } };
  apiClient.get.mockRejectedValue(error);
  await expect(patientService.getPatientAuditHistory('7', { strict: true })).rejects.toBe(error);
  await expect(patientService.getPatientAuditHistory('7')).resolves.toEqual([]);
});

test('timeline strict mode rejects malformed data instead of inventing an empty history', async () => {
  apiClient.get.mockResolvedValue({ data: { data: {} } });
  await expect(patientService.getPatientAuditHistory('7', { strict: true })).rejects.toThrow('Invalid patient history response');
});
