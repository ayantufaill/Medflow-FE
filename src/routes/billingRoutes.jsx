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

// Billing operations are available to operational admin roles and
// front-office/billing roles. Backend permissions and branch/group scope remain
// the source of truth for data access.
const OPERATIONS_ALLOWED_GROUPS = ['FULL_ADMIN_GROUP', 'OPERATIONS_GROUP'];

// Insurance, services, and authorizations are different: Provider/Doctor/
// Hygienist hold read (and for authorizations, create) permissions for these
// on the backend, so clinical staff should actually be able to view them —
// they were previously locked out entirely, the opposite-direction version
// of the Group Admin bug (hiding something a role IS allowed to use).
const CLINICAL_READABLE_GROUPS = ['FULL_ADMIN_GROUP', 'OPERATIONS_GROUP', 'CLINICAL_GROUP'];

const operationsRoute = (children, hideSidebar = false, allowedGroups = OPERATIONS_ALLOWED_GROUPS, requiredPermissions = []) => (
  <ProtectedRoute allowedGroups={allowedGroups} requiredPermissions={requiredPermissions}>
    <Layout hideSidebar={hideSidebar}>{children}</Layout>
  </ProtectedRoute>
);

const billingRoutes = [
  <Route key="/insurance" path="/insurance" element={operationsRoute(<InsurancePage />, true, CLINICAL_READABLE_GROUPS, ['insurance.read'])} />,
  <Route key="/insurance/new" path="/insurance/new" element={operationsRoute(<AddCoveragePage />, true, OPERATIONS_ALLOWED_GROUPS, ['insurance.create'])} />,
  <Route key="/finance" path="/finance" element={operationsRoute(<FinancePage />, true, OPERATIONS_ALLOWED_GROUPS, ['invoices.read'])} />,

  <Route key="/services" path="/services" element={operationsRoute(<ServicesListPage />, false, CLINICAL_READABLE_GROUPS)} />,
  <Route key="/services/new" path="/services/new" element={operationsRoute(<CreateServicePage />)} />,
  <Route key="/services/:serviceId" path="/services/:serviceId" element={operationsRoute(<ViewServicePage />, false, CLINICAL_READABLE_GROUPS)} />,
  <Route key="/services/:serviceId/edit" path="/services/:serviceId/edit" element={operationsRoute(<EditServicePage />)} />,

  <Route key="/invoices" path="/invoices" element={operationsRoute(<InvoicesListPage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.read'])} />,
  <Route key="/invoices/new" path="/invoices/new" element={operationsRoute(<CreateInvoicePage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.create'])} />,
  <Route key="/invoices/:invoiceId" path="/invoices/:invoiceId" element={operationsRoute(<ViewInvoicePage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.read'])} />,
  <Route key="/invoices/:invoiceId/edit" path="/invoices/:invoiceId/edit" element={operationsRoute(<EditInvoicePage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.update'])} />,

  <Route key="/payments" path="/payments" element={operationsRoute(<PaymentsListPage />, false, OPERATIONS_ALLOWED_GROUPS, ['payments.read'])} />,
  <Route key="/payments/new" path="/payments/new" element={operationsRoute(<RecordPaymentPage />, false, OPERATIONS_ALLOWED_GROUPS, ['payments.create'])} />,
  <Route key="/payments/:paymentId" path="/payments/:paymentId" element={operationsRoute(<ViewPaymentPage />, false, OPERATIONS_ALLOWED_GROUPS, ['payments.read'])} />,

  <Route key="/estimates" path="/estimates" element={operationsRoute(<EstimatesListPage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.read'])} />,
  <Route key="/estimates/new" path="/estimates/new" element={operationsRoute(<CreateEstimatePage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.create'])} />,
  <Route key="/estimates/:estimateId/edit" path="/estimates/:estimateId/edit" element={operationsRoute(<EditEstimatePage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.update'])} />,
  <Route key="/estimates/:estimateId" path="/estimates/:estimateId" element={operationsRoute(<ViewEstimatePage />, false, OPERATIONS_ALLOWED_GROUPS, ['invoices.read'])} />,

  <Route key="/claims" path="/claims" element={operationsRoute(<ClaimsListPage />, true, OPERATIONS_ALLOWED_GROUPS, ['claims.read'])} />,
  <Route key="/batch-actions" path="/batch-actions" element={operationsRoute(<BatchActionsPage />, true, OPERATIONS_ALLOWED_GROUPS, ['claims.process'])} />,
  <Route key="/claims/denied" path="/claims/denied" element={operationsRoute(<DeniedClaimsPage />, false, OPERATIONS_ALLOWED_GROUPS, ['claims.read'])} />,
  <Route key="/claims/secondary" path="/claims/secondary" element={operationsRoute(<SecondaryClaimsPage />, false, OPERATIONS_ALLOWED_GROUPS, ['claims.read'])} />,
  <Route key="/claims/:claimId" path="/claims/:claimId" element={operationsRoute(<ViewClaimPage />, false, OPERATIONS_ALLOWED_GROUPS, ['claims.read'])} />,
  <Route key="/claims/:claimId/resubmit" path="/claims/:claimId/resubmit" element={operationsRoute(<ResubmitClaimPage />, false, OPERATIONS_ALLOWED_GROUPS, ['claims.update'])} />,

  <Route key="/era" path="/era" element={operationsRoute(<ERAListPage />, false, OPERATIONS_ALLOWED_GROUPS, ['era.read'])} />,
  <Route key="/era/import" path="/era/import" element={operationsRoute(<ImportERAPage />, false, OPERATIONS_ALLOWED_GROUPS, ['era.create'])} />,
  <Route key="/era/unmatched" path="/era/unmatched" element={operationsRoute(<UnmatchedERAItemsPage />, false, OPERATIONS_ALLOWED_GROUPS, ['era.read'])} />,
  <Route key="/era/:eraId" path="/era/:eraId" element={operationsRoute(<ViewERAPage />, false, OPERATIONS_ALLOWED_GROUPS, ['era.read'])} />,

  <Route key="/authorizations" path="/authorizations" element={operationsRoute(<AuthorizationsListPage />, false, CLINICAL_READABLE_GROUPS)} />,
  <Route key="/authorizations/new" path="/authorizations/new" element={operationsRoute(<CreateAuthorizationPage />, false, CLINICAL_READABLE_GROUPS)} />,
  <Route key="/authorizations/:authorizationId" path="/authorizations/:authorizationId" element={operationsRoute(<ViewAuthorizationPage />, false, CLINICAL_READABLE_GROUPS)} />,
];

export default billingRoutes;
