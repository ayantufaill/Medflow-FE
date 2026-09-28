import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import PatientManagementPage from '../pages/patients/PatientManagementPage';
import AddPatientPage from '../pages/patients/AddPatientPage';
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
import ViewDocumentPage from '../pages/documents/ViewDocumentPage';
import PatientReportPage from '../pages/patient-reports/PatientReportPage';
import PatientReportsPage from '../pages/patient-reports/PatientReportsPage';
import RiskAssessmentPage from '../pages/patient-reports/RiskAssessmentPage';
import HomeCarePage from '../pages/patient-reports/HomeCarePage';
import ConcernsPage from '../pages/patient-reports/ConcernsPage';
import ShowcasePage from '../pages/patient-reports/ShowcasePage';

const ALL_STAFF_GROUPS = ['ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'];

const staffPatientRoute = (children, hideSidebar = false) => (
  <ProtectedRoute allowedGroups={ALL_STAFF_GROUPS}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

const patientRoutes = [
  <Route key="/patients" path="/patients" element={staffPatientRoute(<PatientManagementPage />)} />,
  <Route key="/patients/new" path="/patients/new" element={staffPatientRoute(<AddPatientPage />, true)} />,
  <Route key="/patients/import" path="/patients/import" element={staffPatientRoute(<ImportPatientsPage />)} />,
  <Route key="/patients/details/:patientId" path="/patients/details/:patientId" element={staffPatientRoute(<PatientDetailPage />)} />,
  <Route key="/patients/:patientId/edit" path="/patients/:patientId/edit" element={staffPatientRoute(<EditPatientPage />)} />,
  <Route key="/patients/:patientId/view" path="/patients/:patientId/view" element={staffPatientRoute(<ViewPatientPage />)} />,
  <Route key="/patients/member/:patientId" path="/patients/member/:patientId" element={staffPatientRoute(<MembershipPlanPage />)} />,
  <Route key="/patients/:patientId/insurance/new" path="/patients/:patientId/insurance/new" element={staffPatientRoute(<AddCoveragePage />, true)} />,
  <Route key="/patients/:patientId/insurance/:insuranceId/edit" path="/patients/:patientId/insurance/:insuranceId/edit" element={staffPatientRoute(<AddCoveragePage />, true)} />,
  <Route key="/patients/:patientId/insurance" path="/patients/:patientId/insurance" element={staffPatientRoute(<InsurancePage />, true)} />,
  <Route key="/patients/:patientId/insurance/:insuranceId" path="/patients/:patientId/insurance/:insuranceId" element={staffPatientRoute(<ViewPatientInsurancePage />)} />,
  <Route key="/patients/:patientId/signed-documents" path="/patients/:patientId/signed-documents" element={staffPatientRoute(<PatientSignedDocumentsPage />)} />,
  <Route
    key="/patients/:patientId/allergies/:allergyId"
    path="/patients/:patientId/allergies/:allergyId"
    element={
      <ProtectedRoute allowedGroups={['ADMIN_GROUP', 'CLINICAL_GROUP']}>
        <Layout><ViewPatientAllergyPage /></Layout>
      </ProtectedRoute>
    }
  />,
  <Route key="/patients/:patientId/medical-history" path="/patients/:patientId/medical-history" element={staffPatientRoute(<PatientMedicalHistoryPage />)} />,
  <Route key="/patients/:patientId/dental-history" path="/patients/:patientId/dental-history" element={staffPatientRoute(<PatientDentalHistoryPage />)} />,
  <Route key="/patients/:patientId/additional-documents" path="/patients/:patientId/additional-documents" element={staffPatientRoute(<PatientAdditionalDocumentsPage />)} />,
  <Route key="/patients/:patientId/signed-documents/:documentId" path="/patients/:patientId/signed-documents/:documentId" element={staffPatientRoute(<ViewDocumentPage />)} />,
  <Route key="/patients/:patientId/report" path="/patients/:patientId/report" element={staffPatientRoute(<PatientReportPage />)} />,
  <Route key="/patients/:patientId/report/risk" path="/patients/:patientId/report/risk" element={staffPatientRoute(<RiskAssessmentPage />)} />,
  <Route key="/patients/:patientId/report/homecare" path="/patients/:patientId/report/homecare" element={staffPatientRoute(<HomeCarePage />)} />,
  <Route key="/patients/:patientId/report/concerns" path="/patients/:patientId/report/concerns" element={staffPatientRoute(<ConcernsPage />)} />,
  <Route key="/patients/:patientId/report/showcase" path="/patients/:patientId/report/showcase" element={staffPatientRoute(<ShowcasePage />)} />,
  <Route key="/patient-reports" path="/patient-reports" element={staffPatientRoute(<PatientReportsPage />)} />,
  <Route key="/patients/:patientId" path="/patients/:patientId" element={staffPatientRoute(<RedirectToPatientDetails />)} />,
];

export default patientRoutes;
