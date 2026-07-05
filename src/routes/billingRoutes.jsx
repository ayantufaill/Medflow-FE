import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import Layout from '../components/layout/Layout';
import InsurancePage from '../pages/insurance/InsurancePage';
import AddCoveragePage from '../pages/patients/AddCoveragePage';
import FinancePage from '../pages/finance/FinancePage';
import ServicesListPage from '../pages/services/ServicesListPage';
import CreateServicePage from '../pages/services/CreateServicePage';
import EditServicePage from '../pages/services/EditServicePage';
import ViewServicePage from '../pages/services/ViewServicePage';
import InvoicesListPage from '../pages/invoices/InvoicesListPage';
import CreateInvoicePage from '../pages/invoices/CreateInvoicePage';
import EditInvoicePage from '../pages/invoices/EditInvoicePage';
import ViewInvoicePage from '../pages/invoices/ViewInvoicePage';
import PaymentsListPage from '../pages/payments/PaymentsListPage';
import RecordPaymentPage from '../pages/payments/RecordPaymentPage';
import ViewPaymentPage from '../pages/payments/ViewPaymentPage';
import EstimatesListPage from '../pages/estimates/EstimatesListPage';
import CreateEstimatePage from '../pages/estimates/CreateEstimatePage';
import EditEstimatePage from '../pages/estimates/EditEstimatePage';
import ViewEstimatePage from '../pages/estimates/ViewEstimatePage';
import ClaimsListPage from '../pages/claims/ClaimsListPage';
import BatchActionsPage from '../pages/claims/BatchActionsPage';
import ViewClaimPage from '../pages/claims/ViewClaimPage';
import DeniedClaimsPage from '../pages/claims/DeniedClaimsPage';
import ResubmitClaimPage from '../pages/claims/ResubmitClaimPage';
import SecondaryClaimsPage from '../pages/claims/SecondaryClaimsPage';
import ERAListPage from '../pages/era/ERAListPage';
import ImportERAPage from '../pages/era/ImportERAPage';
import ViewERAPage from '../pages/era/ViewERAPage';
import UnmatchedERAItemsPage from '../pages/era/UnmatchedERAItemsPage';
import AuthorizationsListPage from '../pages/authorizations/AuthorizationsListPage';
import CreateAuthorizationPage from '../pages/authorizations/CreateAuthorizationPage';
import ViewAuthorizationPage from '../pages/authorizations/ViewAuthorizationPage';

const adminBilling = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Billing']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const adminBillingReception = (children, hideSidebar = false) => (
  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Receptionist']}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

const adminBillingDoctor = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Doctor']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const adminBillingFrontDesk = (children) => (
  <ProtectedRoute requiredRoles={['Admin', 'Billing', 'Front Desk']}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const billingRoutes = [
  <Route key="/insurance" path="/insurance" element={adminBillingReception(<InsurancePage />)} />,
  <Route key="/insurance/new" path="/insurance/new" element={adminBillingReception(<AddCoveragePage />, true)} />,
  <Route key="/finance" path="/finance" element={adminBillingReception(<FinancePage />, true)} />,

  <Route key="/services" path="/services" element={adminBilling(<ServicesListPage />)} />,
  <Route key="/services/new" path="/services/new" element={adminBilling(<CreateServicePage />)} />,
  <Route key="/services/:serviceId" path="/services/:serviceId" element={adminBilling(<ViewServicePage />)} />,
  <Route key="/services/:serviceId/edit" path="/services/:serviceId/edit" element={adminBilling(<EditServicePage />)} />,

  <Route key="/invoices" path="/invoices" element={adminBillingReception(<InvoicesListPage />)} />,
  <Route key="/invoices/new" path="/invoices/new" element={adminBillingReception(<CreateInvoicePage />)} />,
  <Route key="/invoices/:invoiceId" path="/invoices/:invoiceId" element={adminBillingReception(<ViewInvoicePage />)} />,
  <Route key="/invoices/:invoiceId/edit" path="/invoices/:invoiceId/edit" element={adminBillingReception(<EditInvoicePage />)} />,

  <Route key="/payments" path="/payments" element={adminBillingReception(<PaymentsListPage />)} />,
  <Route key="/payments/new" path="/payments/new" element={adminBillingReception(<RecordPaymentPage />)} />,
  <Route key="/payments/:paymentId" path="/payments/:paymentId" element={adminBillingReception(<ViewPaymentPage />)} />,

  <Route key="/estimates" path="/estimates" element={adminBillingDoctor(<EstimatesListPage />)} />,
  <Route key="/estimates/new" path="/estimates/new" element={adminBillingDoctor(<CreateEstimatePage />)} />,
  <Route key="/estimates/:estimateId/edit" path="/estimates/:estimateId/edit" element={adminBillingDoctor(<EditEstimatePage />)} />,
  <Route key="/estimates/:estimateId" path="/estimates/:estimateId" element={adminBillingDoctor(<ViewEstimatePage />)} />,

  <Route key="/claims" path="/claims" element={adminBilling(<ClaimsListPage />)} />,
  <Route key="/batch-actions" path="/batch-actions" element={adminBilling(<BatchActionsPage />)} />,
  <Route key="/claims/denied" path="/claims/denied" element={adminBilling(<DeniedClaimsPage />)} />,
  <Route key="/claims/secondary" path="/claims/secondary" element={adminBilling(<SecondaryClaimsPage />)} />,
  <Route key="/claims/:claimId" path="/claims/:claimId" element={adminBilling(<ViewClaimPage />)} />,
  <Route key="/claims/:claimId/resubmit" path="/claims/:claimId/resubmit" element={adminBilling(<ResubmitClaimPage />)} />,

  <Route key="/era" path="/era" element={adminBilling(<ERAListPage />)} />,
  <Route key="/era/import" path="/era/import" element={adminBilling(<ImportERAPage />)} />,
  <Route key="/era/unmatched" path="/era/unmatched" element={adminBilling(<UnmatchedERAItemsPage />)} />,
  <Route key="/era/:eraId" path="/era/:eraId" element={adminBilling(<ViewERAPage />)} />,

  <Route key="/authorizations" path="/authorizations" element={adminBillingFrontDesk(<AuthorizationsListPage />)} />,
  <Route key="/authorizations/new" path="/authorizations/new" element={adminBillingFrontDesk(<CreateAuthorizationPage />)} />,
  <Route key="/authorizations/:authorizationId" path="/authorizations/:authorizationId" element={adminBillingFrontDesk(<ViewAuthorizationPage />)} />,
];

export default billingRoutes;
