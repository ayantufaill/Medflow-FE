import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Typography } from '@mui/material';
import PatientInsuranceCoverage from './reports/patient/PatientInsuranceCoverage';
import PatientMembershipPlan from './reports/patient/PatientMembershipPlan';
import OnlineSchedulingReferral from './reports/patient/OnlineSchedulingReferral';
import PatientFlagsReport from './reports/patient/PatientFlagsReport';
import CancelledAppointmentsReport from './reports/patient/CancelledAppointmentsReport';
import NoShowAppointmentsReport from './reports/patient/NoShowAppointmentsReport';
import AppointmentsReport from './reports/patient/AppointmentsReport';
import DuplicatePatientsReport from './reports/patient/DuplicatePatientsReport';
import PatientContactPreferencesReport from './reports/patient/PatientContactPreferencesReport';
import PatientLastAppointmentReport from './reports/patient/PatientLastAppointmentReport';
import PatientNextAppointmentReport from './reports/patient/PatientNextAppointmentReport';
import ReferralDocumentReport from './reports/patient/ReferralDocumentReport';
import LabCaseReport from './reports/patient/LabCaseReport';
import PatientDiscountEditedFeeReport from './reports/patient/PatientDiscountEditedFeeReport';
import ReviewReport from './reports/patient/ReviewReport';
import NotificationsReport from './reports/patient/NotificationsReport';
import ProceduresReport from './reports/patient/ProceduresReport';
import PatientTrackersReport from './reports/patient/PatientTrackersReport';
import ReferralByPatientReport from './reports/patient/ReferralByPatientReport';
import RecareReport from './reports/clinical/RecareReport';
import UnsignedProgressNotesReport from './reports/clinical/UnsignedProgressNotesReport';
import RxReport from './reports/clinical/RxReport';
import LoginReport from './reports/others/LoginReport';
import AuditReport from './reports/others/AuditReport';
import SavedReports from './reports/saving/SavedReports';
import AgingReport from './reports/financial/AgingReport';
import PatientAgingReport from './reports/financial/PatientAgingReport';
import DepositSlips from './reports/financial/DepositSlips';
import ProductionReport from './reports/financial/ProductionReport';
import ProductionCollection from './reports/financial/ProductionCollection';
import ProductionCollectionSummary from './reports/financial/ProductionCollectionSummary';
import ProviderCollectionPaymentType from './reports/financial/ProviderCollectionPaymentType';
import ProductionPerCode from './reports/financial/ProductionPerCode';
import CollectionCodeCarrier from './reports/financial/CollectionCodeCarrier';
import ReferralProductionReport from './reports/financial/ReferralProductionReport';
import AdjustmentReport from './reports/financial/AdjustmentReport';
import CourtesyCreditReport from './reports/financial/CourtesyCreditReport';
import CourtesyCreditModifications from './reports/financial/CourtesyCreditModifications';
import CreditAccountsReport from './reports/financial/CreditAccountsReport';
import ModificationsReport from './reports/financial/ModificationsReport';
import DepositSummary from './reports/financial/DepositSummary';
import CollectionCarrier from './reports/financial/CollectionCarrier';
import TotalCollectionIndividuals from './reports/financial/TotalCollectionIndividuals';
import TotalCollectionFamily from './reports/financial/TotalCollectionFamily';
import PaymentPlans from './reports/financial/PaymentPlans';
import PaymentLines from './reports/financial/PaymentLines';
import PaymentRequest from './reports/financial/PaymentRequest';
import OpenEdgeTransactions from './reports/financial/OpenEdgeTransactions';
import ProceduresInsurance from './reports/financial/ProceduresInsurance';
import FamilyMigratedBalances from './reports/financial/FamilyMigratedBalances';
import DashboardTab from './reports/DashboardTab';
import KpiDashboard from './reports/KpiDashboard';
import { TABS, FINANCIAL_REPORT_SUB_TABS, PATIENT_REPORT_SUB_TABS, CLINICAL_REPORT_SUB_TABS, OTHERS_REPORT_SUB_TABS, SAVING_REPORT_SUB_TABS } from './ReportsConfig';
import PatientReportsSubNav from '../../components/admin/reports/PatientReportsSubNav';
import ClinicalReportsSubNav from '../../components/admin/reports/ClinicalReportsSubNav';
import OthersReportsSubNav from '../../components/admin/reports/OthersReportsSubNav';
import SavingReportsSubNav from '../../components/admin/reports/SavingReportsSubNav';
import FinancialReportsSubNav from '../../components/admin/reports/FinancialReportsSubNav';

const ReportsDashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  console.log("ReportsDashboard mounted/rendered. Pathname:", location.pathname);
  const [hoveredTab, setHoveredTab] = useState(null);

  const activeTab = TABS.findIndex((tab) => location.pathname.startsWith(tab.path));

  // No redirect for /admin/reports, it is the root reports dashboard

  const getCurrentPageLabel = () => {
    const allSubTabs = [
      ...FINANCIAL_REPORT_SUB_TABS,
      ...PATIENT_REPORT_SUB_TABS,
      ...CLINICAL_REPORT_SUB_TABS,
      ...OTHERS_REPORT_SUB_TABS,
      ...SAVING_REPORT_SUB_TABS
    ];
    const subTab = allSubTabs.find(sub => sub.path === location.pathname);
    if (subTab) return subTab.label;
    
    const mainTab = TABS[activeTab === -1 ? 0 : activeTab];
    return mainTab ? mainTab.label : '';
  };

  return (
    <Box onMouseLeave={() => setHoveredTab(null)} sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ borderBottom: hoveredTab !== null ? 0 : 1, borderColor: 'divider', mb: hoveredTab !== null ? 0 : 3, position: 'relative' }}>
        <Tabs
          value={activeTab === -1 ? false : activeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              minWidth: 140,
              color: 'text.secondary',
              borderBottom: '3px solid transparent',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {TABS.map((tab, index) => (
            <Tab
              key={tab.label}
              label={tab.label}
              component={Link}
              to={tab.path}
              disableRipple
              onMouseEnter={() => setHoveredTab(index)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Sub-nav — visible on hover */}
      {hoveredTab === 0 && <FinancialReportsSubNav left={0} onItemClick={() => setHoveredTab(null)} />}
      {hoveredTab === 1 && <ClinicalReportsSubNav left={140} onItemClick={() => setHoveredTab(null)} />}
      {hoveredTab === 2 && <PatientReportsSubNav left={280} onItemClick={() => setHoveredTab(null)} />}
      {hoveredTab === 3 && <OthersReportsSubNav left={420} onItemClick={() => setHoveredTab(null)} />}
      {hoveredTab === 4 && <SavingReportsSubNav left={560} onItemClick={() => setHoveredTab(null)} />}

      {/* Page content */}
      <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
        {(location.pathname === '/admin/reports' || location.pathname === '/admin/reports/dashboard') ? (
          <DashboardTab />
        ) : location.pathname.toLowerCase().includes('/kpi') ? (
          <KpiDashboard />
        ) : location.pathname === '/admin/reports/patient/insurance-coverage' ? (
          <PatientInsuranceCoverage />
        ) : location.pathname === '/admin/reports/patient/membership-plan' ? (
          <PatientMembershipPlan />
        ) : location.pathname === '/admin/reports/patient/online-scheduling-referral' ? (
          <OnlineSchedulingReferral />
        ) : location.pathname === '/admin/reports/patient/by-flag' ? (
          <PatientFlagsReport />
        ) : location.pathname === '/admin/reports/patient/cancelled-appointments' ? (
          <CancelledAppointmentsReport />
        ) : location.pathname === '/admin/reports/patient/no-show-appointments' ? (
          <NoShowAppointmentsReport />
        ) : location.pathname === '/admin/reports/patient/appointments' ? (
          <AppointmentsReport />
        ) : location.pathname === '/admin/reports/patient/duplicate-patients' ? (
          <DuplicatePatientsReport />
        ) : location.pathname === '/admin/reports/patient/contact-preferences' ? (
          <PatientContactPreferencesReport />
        ) : location.pathname === '/admin/reports/patient/last-appointment' ? (
          <PatientLastAppointmentReport />
        ) : location.pathname === '/admin/reports/patient/next-appointment' ? (
          <PatientNextAppointmentReport />
        ) : location.pathname === '/admin/reports/patient/referral-document' ? (
          <ReferralDocumentReport />
        ) : location.pathname === '/admin/reports/patient/lab-case' ? (
          <LabCaseReport />
        ) : location.pathname === '/admin/reports/patient/discount-edited-fee' ? (
          <PatientDiscountEditedFeeReport />
        ) : location.pathname === '/admin/reports/patient/review' ? (
          <ReviewReport />
        ) : location.pathname === '/admin/reports/patient/notifications' ? (
          <NotificationsReport />
        ) : location.pathname === '/admin/reports/patient/procedures' ? (
          <ProceduresReport />
        ) : location.pathname === '/admin/reports/patient/trackers' ? (
          <PatientTrackersReport />
        ) : location.pathname === '/admin/reports/patient/referral-by-patient' ? (
          <ReferralByPatientReport />
        ) : location.pathname === '/admin/reports/clinical/recare' ? (
          <RecareReport />
        ) : location.pathname === '/admin/reports/clinical/unsigned-progress-notes' ? (
          <UnsignedProgressNotesReport />
        ) : location.pathname === '/admin/reports/clinical/rx' ? (
          <RxReport />
        ) : location.pathname === '/admin/reports/others/login' ? (
          <LoginReport />
        ) : location.pathname === '/admin/reports/others/audit' ? (
          <AuditReport />
                ) : location.pathname === '/admin/reports/financial/aging' ? (
          <AgingReport />
        ) : location.pathname === '/admin/reports/financial/patient-aging' ? (
          <PatientAgingReport />
        ) : location.pathname === '/admin/reports/financial/deposit-slips' ? (
          <DepositSlips />
        ) : location.pathname === '/admin/reports/financial/production' ? (
          <ProductionReport />
        ) : location.pathname === '/admin/reports/financial/production-collection' ? (
          <ProductionCollection />
        ) : location.pathname === '/admin/reports/financial/production-collection-summary' ? (
          <ProductionCollectionSummary />
        ) : location.pathname === '/admin/reports/financial/provider-collection-payment-type' ? (
          <ProviderCollectionPaymentType />
        ) : location.pathname === '/admin/reports/financial/production-per-code' ? (
          <ProductionPerCode />
        ) : location.pathname === '/admin/reports/financial/collection-code-carrier' ? (
          <CollectionCodeCarrier />
        ) : location.pathname === '/admin/reports/financial/referral-production' ? (
          <ReferralProductionReport />
        ) : location.pathname === '/admin/reports/financial/adjustment' ? (
          <AdjustmentReport />
        ) : location.pathname === '/admin/reports/financial/courtesy-credit' ? (
          <CourtesyCreditReport />
        ) : location.pathname === '/admin/reports/financial/courtesy-credit-modifications' ? (
          <CourtesyCreditModifications />
        ) : location.pathname === '/admin/reports/financial/credit-accounts' ? (
          <CreditAccountsReport />
        ) : location.pathname === '/admin/reports/financial/modifications' ? (
          <ModificationsReport />
        ) : location.pathname === '/admin/reports/financial/deposit-summary' ? (
          <DepositSummary />
        ) : location.pathname === '/admin/reports/financial/collection-carrier' ? (
          <CollectionCarrier />
        ) : location.pathname === '/admin/reports/financial/total-collection-individuals' ? (
          <TotalCollectionIndividuals />
        ) : location.pathname === '/admin/reports/financial/total-collection-family' ? (
          <TotalCollectionFamily />
        ) : location.pathname === '/admin/reports/financial/payment-plans' ? (
          <PaymentPlans />
        ) : location.pathname === '/admin/reports/financial/payment-lines' ? (
          <PaymentLines />
        ) : location.pathname === '/admin/reports/financial/payment-request' ? (
          <PaymentRequest />
        ) : location.pathname === '/admin/reports/financial/openedge-transactions' ? (
          <OpenEdgeTransactions />
        ) : location.pathname === '/admin/reports/financial/procedures-insurance' ? (
          <ProceduresInsurance />
        ) : location.pathname === '/admin/reports/financial/family-migrated-balances' ? (
          <FamilyMigratedBalances />
        ) : location.pathname === '/admin/reports/saving' ? (
          <SavedReports />
        ) : (
          <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f9fafb', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              {getCurrentPageLabel()}
            </Typography>
            <Typography color="text.secondary">Content for this report is coming soon.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportsDashboard;
