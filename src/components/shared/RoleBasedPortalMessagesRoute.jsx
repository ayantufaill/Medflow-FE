import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import PortalLayout from '../layout/PortalLayout';
import PortalMessagesPage from '../../pages/portal/PortalMessagesPage';
import ProviderPortalMessagesPage from '../../pages/portal/ProviderPortalMessagesPage';

const RoleBasedPortalMessagesRoute = () => {
  const { user } = useAuth();
  const roleNames = (user?.roles || [])
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);

  const isPatient = roleNames.includes('Patient');
  const isProviderSide = roleNames.some((role) =>
    ['Admin', 'Provider', 'Doctor'].includes(role)
  );

  if (isPatient) {
    return (
      <PortalLayout>
        <PortalMessagesPage />
      </PortalLayout>
    );
  }

  if (isProviderSide) {
    return (
      <Layout>
        <ProviderPortalMessagesPage />
      </Layout>
    );
  }

  return <Navigate to="/" replace />;
};

export default RoleBasedPortalMessagesRoute;
