/**
 * Simple in-memory cache for patient data. Used so that when switching
 * between Medical History and Dental History (same patient), the second
 * page can show content immediately from cache instead of a blank loading state.
 */
const cache = new Map();

export function getCachedPatient(patientId) {
  if (!patientId) return null;
  return cache.get(patientId) ?? null;
}

export function setCachedPatient(patientId, patient) {
  if (!patientId || !patient) return;
  cache.set(patientId, patient);
}
