import { useParams, Navigate } from 'react-router-dom';

/**
 * Redirects /patients/:patientId to Patient Management PATIENT DETAILS tab
 * so all patient details show in one place (Patient Management > PATIENT DETAILS).
 */
export default function RedirectToPatientDetails() {
  const { patientId } = useParams();
  return <Navigate to={`/patients/details/${patientId || ''}`} replace />;
}
