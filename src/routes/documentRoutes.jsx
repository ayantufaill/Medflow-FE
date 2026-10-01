import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import DocumentsListPage from '../pages/documents/DocumentsListPage';
import UploadDocumentPage from '../pages/documents/UploadDocumentPage';
import EditDocumentPage from '../pages/documents/EditDocumentPage';
import ViewDocumentPage from '../pages/documents/ViewDocumentPage';
import PatientDocumentsPage from '../pages/documents/PatientDocumentsPage';

// The backend grants documents.read/documents.create broadly — to every
// CLINICAL_GROUP role (Provider, Doctor, Hygienist, Assistant, Dental
// Assistant, Clinical Staff) and every OPERATIONS_GROUP role (Front Desk,
// Receptionist, Biller, Billing Staff, Lab, Lab Technician), not just
// Admin/Provider (see seedRoles.ts). This used to only list 'Admin' and
// 'Provider', hiding the page from everyone else who could actually use it.
const documentAccess = (children) => (
  <ProtectedRoute
    allowedGroups={['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP']}
  >
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const documentRoutes = [
  <Route key="/documents" path="/documents" element={documentAccess(<DocumentsListPage />)} />,
  <Route key="/documents/upload" path="/documents/upload" element={documentAccess(<UploadDocumentPage />)} />,
  <Route key="/documents/patient/:patientId" path="/documents/patient/:patientId" element={documentAccess(<PatientDocumentsPage />)} />,
  <Route key="/documents/:documentId" path="/documents/:documentId" element={documentAccess(<ViewDocumentPage />)} />,
  <Route key="/documents/:documentId/edit" path="/documents/:documentId/edit" element={documentAccess(<EditDocumentPage />)} />,
];

export default documentRoutes;
