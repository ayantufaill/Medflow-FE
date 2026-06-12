import { Route } from 'react-router-dom';
import HomeRoute from '../components/shared/HomeRoute';
import DashboardRoute from '../components/shared/DashboardRoute';
import authRoutes from './authRoutes';
import portalRoutes from './portalRoutes';
import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';
import practiceInfoRoutes from './practiceInfoRoutes';
import accountRoutes from './accountRoutes';
import patientRoutes from './patientRoutes';
import allergyRoutes from './allergyRoutes';
import appointmentRoutes from './appointmentRoutes';
import clinicalRoutes from './clinicalRoutes';
import documentRoutes from './documentRoutes';
import billingRoutes from './billingRoutes';
import configRoutes from './configRoutes';

const allRoutes = [
  ...authRoutes,
  ...portalRoutes,
  ...adminRoutes,
  ...userRoutes,
  ...practiceInfoRoutes,
  ...accountRoutes,
  ...patientRoutes,
  ...allergyRoutes,
  ...appointmentRoutes,
  ...clinicalRoutes,
  ...documentRoutes,
  ...billingRoutes,
  ...configRoutes,
  <Route key="dashboard" path="/dashboard" element={<DashboardRoute />} />,
  <Route key="home" path="/" element={<HomeRoute />} />,
  <Route key="fallback" path="*" element={<HomeRoute />} />,
];

export default allRoutes;
