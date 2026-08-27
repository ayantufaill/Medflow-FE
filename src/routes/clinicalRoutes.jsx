import { Route } from 'react-router-dom';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import ClinicalPage from '../pages/clinical/ClinicalPage';
import ExamPage from '../pages/clinical/ExamPage';
import DiagnosticOpinionPage from '../pages/clinical/DiagnosticOpinionPage';
import PeriodontalPage from '../pages/clinical/PeriodontalPage';
import PeriodontalExamPage from '../pages/clinical/PeriodontalExamPage';
import BiomechanicalPage from '../pages/clinical/BiomechanicalPage';
import FunctionalPage from '../pages/clinical/FunctionalPage';
import DentofacialPage from '../pages/clinical/DentofacialPage';
import ExamDentofacial from '../pages/clinical/ExamDentofacial';
import Morphological from '../pages/clinical/Morphological';
import AirwayPage from '../pages/clinical/AirwayPage';
import DentalTmdExamPage from '../pages/clinical/TMJ';
import HeadAndNeck from '../pages/clinical/HeadAndNeck';
import TeethStructureExam from '../pages/clinical/TeehthStructureExam';
import Radiographic from '../pages/clinical/Radiographic';
import TreatmentPlanPage from '../pages/clinical/TreatmentPlanPage';
import NewTreatmentPlanPage from '../pages/clinical/NewTreatmentPlanPage';
import AdjunctiveTherapyPage from '../pages/clinical/AdjunctiveTherapyPage';
import RXPage from '../pages/clinical/RXPage';
import ReferralPage from '../pages/clinical/ReferralPage';
import ProgressNotesPage from '../pages/clinical/ProgressNotesPage';
import LabCasePage from '../pages/clinical/LabCasePage';
import AIConversationPage from '../pages/clinical/AIConversationPage';
import ClinicalNotesListPage from '../pages/clinical-notes/ClinicalNotesListPage';
import CreateClinicalNotePage from '../pages/clinical-notes/CreateClinicalNotePage';
import EditClinicalNotePage from '../pages/clinical-notes/EditClinicalNotePage';
import ViewClinicalNotePage from '../pages/clinical-notes/ViewClinicalNotePage';
import VitalSignsListPage from '../pages/vital-signs/VitalSignsListPage';
import CreateVitalSignPage from '../pages/vital-signs/CreateVitalSignPage';
import EditVitalSignPage from '../pages/vital-signs/EditVitalSignPage';
import PatientVitalHistoryPage from '../pages/vital-signs/PatientVitalHistoryPage';

// 'Doctor' is not a real backend role (see seedRoles.ts) — 'Provider' is its
// actual seeded equivalent.
const adminProvider = (children, hideSidebar = true) => (
  <ProtectedRoute requiredRoles={['Admin', 'Provider']}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

const wrapWithBoundary = (children) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset}>
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);

const clinicalRoutes = [
  <Route key="/clinical" path="/clinical" element={adminProvider(<ClinicalPage />)} />,
  <Route key="/clinical/exam" path="/clinical/exam" element={adminProvider(<ExamPage />)} />,
  <Route key="/clinical/exam/head-neck" path="/clinical/exam/head-neck" element={adminProvider(<HeadAndNeck />)} />,
  <Route key="/clinical/exam/tooth-structure" path="/clinical/exam/tooth-structure" element={adminProvider(<TeethStructureExam />)} />,
  <Route key="/clinical/exam/radiographic" path="/clinical/exam/radiographic" element={adminProvider(<Radiographic />)} />,
  <Route key="/clinical/exam/morphological" path="/clinical/exam/morphological" element={adminProvider(<Morphological />)} />,
  <Route key="/clinical/exam/periodontal" path="/clinical/exam/periodontal" element={adminProvider(<PeriodontalExamPage />)} />,
  <Route key="/clinical/exam/dentofacial" path="/clinical/exam/dentofacial" element={adminProvider(<ExamDentofacial />)} />,
  <Route key="/clinical/exam/airway" path="/clinical/exam/airway" element={adminProvider(<AirwayPage />)} />,
  <Route key="/clinical/exam/tmj" path="/clinical/exam/tmj" element={adminProvider(<DentalTmdExamPage />)} />,
  <Route key="/clinical/diagnostic-opinion" path="/clinical/diagnostic-opinion" element={adminProvider(<BiomechanicalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/periodontal" path="/clinical/diagnostic-opinion/periodontal" element={adminProvider(<PeriodontalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/biomechanical" path="/clinical/diagnostic-opinion/biomechanical" element={adminProvider(<BiomechanicalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/functional" path="/clinical/diagnostic-opinion/functional" element={adminProvider(<FunctionalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/dentofacial" path="/clinical/diagnostic-opinion/dentofacial" element={adminProvider(<DentofacialPage />)} />,
  <Route key="/clinical/treatment-plan" path="/clinical/treatment-plan" element={adminProvider(<NewTreatmentPlanPage />)} />,
  <Route key="/clinical/adjunctive-therapy" path="/clinical/adjunctive-therapy" element={adminProvider(<AdjunctiveTherapyPage />)} />,
  <Route key="/clinical/rx" path="/clinical/rx" element={adminProvider(<RXPage />)} />,
  <Route key="/clinical/referral" path="/clinical/referral" element={adminProvider(<ReferralPage />)} />,
  <Route key="/clinical/progress-notes" path="/clinical/progress-notes" element={adminProvider(<ProgressNotesPage />)} />,
  <Route key="/clinical/lab-case" path="/clinical/lab-case" element={adminProvider(<LabCasePage />)} />,
  <Route key="/clinical/ai-conversation" path="/clinical/ai-conversation" element={adminProvider(<AIConversationPage />)} />,
  <Route key="/clinical-notes" path="/clinical-notes" element={adminProvider(<ClinicalNotesListPage />)} />,
  <Route key="/clinical-notes/create" path="/clinical-notes/create" element={adminProvider(<CreateClinicalNotePage />)} />,
  <Route key="/clinical-notes/:clinicalNoteId" path="/clinical-notes/:clinicalNoteId" element={adminProvider(<ViewClinicalNotePage />)} />,
  <Route key="/clinical-notes/:clinicalNoteId/edit" path="/clinical-notes/:clinicalNoteId/edit" element={adminProvider(<EditClinicalNotePage />)} />,
  <Route key="/vital-signs" path="/vital-signs" element={adminProvider(wrapWithBoundary(<VitalSignsListPage />))} />,
  <Route key="/vital-signs/create" path="/vital-signs/create" element={adminProvider(wrapWithBoundary(<CreateVitalSignPage />), false)} />,
  <Route key="/vital-signs/patient/:patientId" path="/vital-signs/patient/:patientId" element={adminProvider(wrapWithBoundary(<PatientVitalHistoryPage />), false)} />,
  <Route key="/vital-signs/:vitalSignId/edit" path="/vital-signs/:vitalSignId/edit" element={adminProvider(wrapWithBoundary(<EditVitalSignPage />))} />,
];

export default clinicalRoutes;
