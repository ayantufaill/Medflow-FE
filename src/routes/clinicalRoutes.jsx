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

const CLINICAL_ALLOWED_GROUPS = ['ADMIN_GROUP', 'CLINICAL_GROUP'];

const clinicalRoute = (children, hideSidebar = true) => (
  <ProtectedRoute allowedGroups={CLINICAL_ALLOWED_GROUPS}>
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
  <Route key="/clinical" path="/clinical" element={clinicalRoute(<ClinicalPage />)} />,
  <Route key="/clinical/exam" path="/clinical/exam" element={clinicalRoute(<ExamPage />)} />,
  <Route key="/clinical/exam/head-neck" path="/clinical/exam/head-neck" element={clinicalRoute(<HeadAndNeck />)} />,
  <Route key="/clinical/exam/tooth-structure" path="/clinical/exam/tooth-structure" element={clinicalRoute(<TeethStructureExam />)} />,
  <Route key="/clinical/exam/radiographic" path="/clinical/exam/radiographic" element={clinicalRoute(<Radiographic />)} />,
  <Route key="/clinical/exam/morphological" path="/clinical/exam/morphological" element={clinicalRoute(<Morphological />)} />,
  <Route key="/clinical/exam/periodontal" path="/clinical/exam/periodontal" element={clinicalRoute(<PeriodontalExamPage />)} />,
  <Route key="/clinical/exam/dentofacial" path="/clinical/exam/dentofacial" element={clinicalRoute(<ExamDentofacial />)} />,
  <Route key="/clinical/exam/airway" path="/clinical/exam/airway" element={clinicalRoute(<AirwayPage />)} />,
  <Route key="/clinical/exam/tmj" path="/clinical/exam/tmj" element={clinicalRoute(<DentalTmdExamPage />)} />,
  <Route key="/clinical/diagnostic-opinion" path="/clinical/diagnostic-opinion" element={clinicalRoute(<BiomechanicalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/periodontal" path="/clinical/diagnostic-opinion/periodontal" element={clinicalRoute(<PeriodontalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/biomechanical" path="/clinical/diagnostic-opinion/biomechanical" element={clinicalRoute(<BiomechanicalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/functional" path="/clinical/diagnostic-opinion/functional" element={clinicalRoute(<FunctionalPage />)} />,
  <Route key="/clinical/diagnostic-opinion/dentofacial" path="/clinical/diagnostic-opinion/dentofacial" element={clinicalRoute(<DentofacialPage />)} />,
  <Route key="/clinical/treatment-plan" path="/clinical/treatment-plan" element={clinicalRoute(<NewTreatmentPlanPage />)} />,
  <Route key="/clinical/adjunctive-therapy" path="/clinical/adjunctive-therapy" element={clinicalRoute(<AdjunctiveTherapyPage />)} />,
  <Route key="/clinical/rx" path="/clinical/rx" element={clinicalRoute(<RXPage />)} />,
  <Route key="/clinical/referral" path="/clinical/referral" element={clinicalRoute(<ReferralPage />)} />,
  <Route key="/clinical/progress-notes" path="/clinical/progress-notes" element={clinicalRoute(<ProgressNotesPage />)} />,
  <Route key="/clinical/lab-case" path="/clinical/lab-case" element={clinicalRoute(<LabCasePage />)} />,
  <Route key="/clinical/ai-conversation" path="/clinical/ai-conversation" element={clinicalRoute(<AIConversationPage />)} />,
  <Route key="/clinical-notes" path="/clinical-notes" element={clinicalRoute(<ClinicalNotesListPage />)} />,
  <Route key="/clinical-notes/create" path="/clinical-notes/create" element={clinicalRoute(<CreateClinicalNotePage />)} />,
  <Route key="/clinical-notes/:clinicalNoteId" path="/clinical-notes/:clinicalNoteId" element={clinicalRoute(<ViewClinicalNotePage />)} />,
  <Route key="/clinical-notes/:clinicalNoteId/edit" path="/clinical-notes/:clinicalNoteId/edit" element={clinicalRoute(<EditClinicalNotePage />)} />,
  <Route key="/vital-signs" path="/vital-signs" element={clinicalRoute(wrapWithBoundary(<VitalSignsListPage />))} />,
  <Route key="/vital-signs/create" path="/vital-signs/create" element={clinicalRoute(wrapWithBoundary(<CreateVitalSignPage />), false)} />,
  <Route key="/vital-signs/patient/:patientId" path="/vital-signs/patient/:patientId" element={clinicalRoute(wrapWithBoundary(<PatientVitalHistoryPage />), false)} />,
  <Route key="/vital-signs/:vitalSignId/edit" path="/vital-signs/:vitalSignId/edit" element={clinicalRoute(wrapWithBoundary(<EditVitalSignPage />))} />,
];

export default clinicalRoutes;
