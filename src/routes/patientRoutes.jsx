import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import PatientManagementPage from '../pages/patients/PatientManagementPage';
import CreatePatientPage from '../pages/patients/CreatePatientPage';
import EditPatientPage from '../pages/patients/EditPatientPage';
import ViewPatientPage from '../pages/patients/ViewPatientPage';
import PatientDetailPage from '../pages/patients/PatientDetailPage';
import RedirectToPatientDetails from '../pages/patients/RedirectToPatientDetails';
import ImportPatientsPage from '../pages/patients/ImportPatientsPage';
import ViewPatientInsurancePage from '../pages/patients/ViewPatientInsurancePage';
import InsurancePage from '../pages/insurance/InsurancePage';
import AddCoveragePage from '../pages/patients/AddCoveragePage';
import MembershipPlanPage from '../pages/patients/MemberPage';
import ViewPatientAllergyPage from '../pages/patients/ViewPatientAllergyPage';
import PatientMedicalHistoryPage from '../pages/patients/PatientMedicalHistoryPage';
import PatientSignedDocumentsPage from '../pages/patients/PatientSignedDocumentsPage';
import PatientDentalHistoryPage from '../pages/patients/PatientDentalHistoryPage';
import PatientAdditionalDocumentsPage from '../pages/patients/PatientAdditionalDocumentsPage';
import PatientReportPage from '../pages/patient-reports/PatientReportPage';
import PatientReportsPage from '../pages/patient-reports/PatientReportsPage';
import RiskAssessmentPage from '../pages/patient-reports/RiskAssessmentPage';
import HomeCarePage from '../pages/patient-reports/HomeCarePage';
import ConcernsPage from '../pages/patient-reports/ConcernsPage';
import ShowcasePage from '../pages/patient-reports/ShowcasePage';

const adminReception = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Receptionist']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const adminDoctorReception = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Doctor', 'Receptionist']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const patientRoutes = [
  <Route key="/patients" path="/patients" element={adminReception(<PatientManagementPage />)} />,
  <Route key="/patients/new" path="/patients/new" element={adminReception(<CreatePatientPage />)} />,
  <Route key="/patients/import" path="/patients/import" element={adminReception(<ImportPatientsPage />)} />,
  <Route key="/patients/details/:patientId" path="/patients/details/:patientId" element={adminReception(<PatientDetailPage />)} />,
  <Route key="/patients/:patientId/edit" path="/patients/:patientId/edit" element={adminReception(<EditPatientPage />)} />,
  <Route key="/patients/:patientId/view" path="/patients/:patientId/view" element={adminReception(<ViewPatientPage />)} />,
  <Route key="/patients/member/:patientId" path="/patients/member/:patientId" element={adminReception(<MembershipPlanPage />)} />,
  <Route key="/patients/:patientId/insurance/new" path="/patients/:patientId/insurance/new" element={adminReception(<AddCoveragePage />)} />,
  <Route key="/patients/:patientId/insurance" path="/patients/:patientId/insurance" element={adminReception(<InsurancePage />)} />,
  <Route key="/patients/:patientId/insurance/:insuranceId" path="/patients/:patientId/insurance/:insuranceId" element={adminReception(<ViewPatientInsurancePage />)} />,
  <Route key="/patients/:patientId/signed-documents" path="/patients/:patientId/signed-documents" element={adminReception(<PatientSignedDocumentsPage />)} />,
  <Route
    key="/patients/:patientId/allergies/:allergyId"
    path="/patients/:patientId/allergies/:allergyId"
    element={
      <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
        <Layout><ViewPatientAllergyPage /></Layout>
      </ProtectedRoute>
    }
  />,
  <Route key="/patients/:patientId/medical-history" path="/patients/:patientId/medical-history" element={adminDoctorReception(<PatientMedicalHistoryPage />)} />,
  <Route key="/patients/:patientId/dental-history" path="/patients/:patientId/dental-history" element={adminDoctorReception(<PatientDentalHistoryPage />)} />,
  <Route key="/patients/:patientId/additional-documents" path="/patients/:patientId/additional-documents" element={adminDoctorReception(<PatientAdditionalDocumentsPage />)} />,
  <Route key="/patients/:patientId/report" path="/patients/:patientId/report" element={adminDoctorReception(<PatientReportPage />)} />,
  <Route key="/patients/:patientId/report/risk" path="/patients/:patientId/report/risk" element={adminDoctorReception(<RiskAssessmentPage />)} />,
  <Route key="/patients/:patientId/report/homecare" path="/patients/:patientId/report/homecare" element={adminDoctorReception(<HomeCarePage />)} />,
  <Route key="/patients/:patientId/report/concerns" path="/patients/:patientId/report/concerns" element={adminDoctorReception(<ConcernsPage />)} />,
  <Route key="/patients/:patientId/report/showcase" path="/patients/:patientId/report/showcase" element={adminDoctorReception(<ShowcasePage />)} />,
  <Route key="/patient-reports" path="/patient-reports" element={adminDoctorReception(<PatientReportsPage />)} />,
  <Route key="/patients/:patientId" path="/patients/:patientId" element={adminReception(<RedirectToPatientDetails />)} />,
];

export default patientRoutes;
