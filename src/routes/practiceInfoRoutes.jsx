import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import PracticeInfoListPage from '../pages/practice-info/PracticeInfoListPage';
import CreatePracticeInfoPage from '../pages/practice-info/CreatePracticeInfoPage';
import EditPracticeInfoPage from '../pages/practice-info/EditPracticeInfoPage';
import ViewPracticeInfoPage from '../pages/practice-info/ViewPracticeInfoPage';

const adminOnly = (children) => (
  <ProtectedRoute requiredRoles={['Admin']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const practiceInfoRoutes = [
  <Route key="/practice-info" path="/practice-info" element={adminOnly(<PracticeInfoListPage />)} />,
  <Route key="/practice-info/new" path="/practice-info/new" element={adminOnly(<CreatePracticeInfoPage />)} />,
  <Route key="/practice-info/:practiceInfoId/edit" path="/practice-info/:practiceInfoId/edit" element={adminOnly(<EditPracticeInfoPage />)} />,
  <Route key="/practice-info/:practiceInfoId" path="/practice-info/:practiceInfoId" element={adminOnly(<ViewPracticeInfoPage />)} />,
];

export default practiceInfoRoutes;
