import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import DocumentsListPage from '../pages/documents/DocumentsListPage';
import UploadDocumentPage from '../pages/documents/UploadDocumentPage';
import EditDocumentPage from '../pages/documents/EditDocumentPage';
import ViewDocumentPage from '../pages/documents/ViewDocumentPage';
import PatientDocumentsPage from '../pages/documents/PatientDocumentsPage';

// 'Doctor' is not a real backend role (see seedRoles.ts) — 'Provider' is its
// actual seeded equivalent.
const adminProvider = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Provider']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const documentRoutes = [
  <Route key="/documents" path="/documents" element={adminProvider(<DocumentsListPage />)} />,
  <Route key="/documents/upload" path="/documents/upload" element={adminProvider(<UploadDocumentPage />)} />,
  <Route key="/documents/patient/:patientId" path="/documents/patient/:patientId" element={adminProvider(<PatientDocumentsPage />)} />,
  <Route key="/documents/:documentId" path="/documents/:documentId" element={adminProvider(<ViewDocumentPage />)} />,
  <Route key="/documents/:documentId/edit" path="/documents/:documentId/edit" element={adminProvider(<EditDocumentPage />)} />,
];

export default documentRoutes;
