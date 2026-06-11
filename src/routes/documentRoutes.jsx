import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import { wrapWithBoundary } from '../components/shared';
import DocumentsListPage from '../pages/documents/DocumentsListPage';
import UploadDocumentPage from '../pages/documents/UploadDocumentPage';
import EditDocumentPage from '../pages/documents/EditDocumentPage';
import ViewDocumentPage from '../pages/documents/ViewDocumentPage';
import PatientDocumentsPage from '../pages/documents/PatientDocumentsPage';

const adminDoctor = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Doctor']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const documentRoutes = [
  <Route key="/documents" path="/documents" element={adminDoctor(wrapWithBoundary(<DocumentsListPage />))} />,

  <Route key="/documents/upload" path="/documents/upload" element={adminDoctor(<UploadDocumentPage />)} />,
  <Route key="/documents/patient/:patientId" path="/documents/patient/:patientId" element={adminDoctor(<PatientDocumentsPage />)} />,
  <Route key="/documents/:documentId" path="/documents/:documentId" element={adminDoctor(<ViewDocumentPage />)} />,
  <Route key="/documents/:documentId/edit" path="/documents/:documentId/edit" element={adminDoctor(<EditDocumentPage />)} />,
];

export default documentRoutes;
