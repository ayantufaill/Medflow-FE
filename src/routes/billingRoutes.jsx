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

const OPERATIONS_ALLOWED_GROUPS = ['ADMIN_GROUP', 'OPERATIONS_GROUP'];

const operationsRoute = (children, hideSidebar = false) => (
  <ProtectedRoute allowedGroups={OPERATIONS_ALLOWED_GROUPS}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

const billingRoutes = [
  <Route key="/insurance" path="/insurance" element={operationsRoute(<InsurancePage />, true)} />,
  <Route key="/insurance/new" path="/insurance/new" element={operationsRoute(<AddCoveragePage />, true)} />,
  <Route key="/finance" path="/finance" element={operationsRoute(<FinancePage />, true)} />,

  <Route key="/services" path="/services" element={operationsRoute(<ServicesListPage />)} />,
  <Route key="/services/new" path="/services/new" element={operationsRoute(<CreateServicePage />)} />,
  <Route key="/services/:serviceId" path="/services/:serviceId" element={operationsRoute(<ViewServicePage />)} />,
  <Route key="/services/:serviceId/edit" path="/services/:serviceId/edit" element={operationsRoute(<EditServicePage />)} />,

  <Route key="/invoices" path="/invoices" element={operationsRoute(<InvoicesListPage />)} />,
  <Route key="/invoices/new" path="/invoices/new" element={operationsRoute(<CreateInvoicePage />)} />,
  <Route key="/invoices/:invoiceId" path="/invoices/:invoiceId" element={operationsRoute(<ViewInvoicePage />)} />,
  <Route key="/invoices/:invoiceId/edit" path="/invoices/:invoiceId/edit" element={operationsRoute(<EditInvoicePage />)} />,

  <Route key="/payments" path="/payments" element={operationsRoute(<PaymentsListPage />)} />,
  <Route key="/payments/new" path="/payments/new" element={operationsRoute(<RecordPaymentPage />)} />,
  <Route key="/payments/:paymentId" path="/payments/:paymentId" element={operationsRoute(<ViewPaymentPage />)} />,

  <Route key="/estimates" path="/estimates" element={operationsRoute(<EstimatesListPage />)} />,
  <Route key="/estimates/new" path="/estimates/new" element={operationsRoute(<CreateEstimatePage />)} />,
  <Route key="/estimates/:estimateId/edit" path="/estimates/:estimateId/edit" element={operationsRoute(<EditEstimatePage />)} />,
  <Route key="/estimates/:estimateId" path="/estimates/:estimateId" element={operationsRoute(<ViewEstimatePage />)} />,

  <Route key="/claims" path="/claims" element={operationsRoute(<ClaimsListPage />, true)} />,
  <Route key="/batch-actions" path="/batch-actions" element={operationsRoute(<BatchActionsPage />, true)} />,
  <Route key="/claims/denied" path="/claims/denied" element={operationsRoute(<DeniedClaimsPage />)} />,
  <Route key="/claims/secondary" path="/claims/secondary" element={operationsRoute(<SecondaryClaimsPage />)} />,
  <Route key="/claims/:claimId" path="/claims/:claimId" element={operationsRoute(<ViewClaimPage />)} />,
  <Route key="/claims/:claimId/resubmit" path="/claims/:claimId/resubmit" element={operationsRoute(<ResubmitClaimPage />)} />,

  <Route key="/era" path="/era" element={operationsRoute(<ERAListPage />)} />,
  <Route key="/era/import" path="/era/import" element={operationsRoute(<ImportERAPage />)} />,
  <Route key="/era/unmatched" path="/era/unmatched" element={operationsRoute(<UnmatchedERAItemsPage />)} />,
  <Route key="/era/:eraId" path="/era/:eraId" element={operationsRoute(<ViewERAPage />)} />,

  <Route key="/authorizations" path="/authorizations" element={operationsRoute(<AuthorizationsListPage />)} />,
  <Route key="/authorizations/new" path="/authorizations/new" element={operationsRoute(<CreateAuthorizationPage />)} />,
  <Route key="/authorizations/:authorizationId" path="/authorizations/:authorizationId" element={operationsRoute(<ViewAuthorizationPage />)} />,
];

export default billingRoutes;
