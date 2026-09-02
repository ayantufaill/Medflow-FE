import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import syncSvg from '../../assets/claimicons/refreshicon.svg';

import {
  fetchStatementForms,
  createStatementForm,
  updateStatementForm,
  deleteStatementForm,
  selectStatementForms
} from '../../store/slices/statementFormsSlice';

import HeaderAreaSection from '../../components/admin/finance-management/payment-presentation/HeaderAreaSection';
import TransactionListSection from '../../components/admin/finance-management/payment-presentation/TransactionListSection';
import RemainingBalancesSection from '../../components/admin/finance-management/payment-presentation/RemainingBalancesSection';
import AgingBalanceSection from '../../components/admin/finance-management/payment-presentation/AgingBalanceSection';
import StatementSummarySection from '../../components/admin/finance-management/payment-presentation/StatementSummarySection';
import NextAppointmentsSection from '../../components/admin/finance-management/payment-presentation/NextAppointmentsSection';
import DisclaimerSection from '../../components/admin/finance-management/payment-presentation/DisclaimerSection';
import SavedFormsSidebar from '../../components/admin/finance-management/payment-presentation/SavedFormsSidebar';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

const defaultSettings = {
  headerType: 'detachable',
  officeLogo: true,
  officePhone: true,
  officeAddress: true,
  officeAddressValue: 'office1',
  officeWebsite: true,
  officeEmail: true,
  patientName: true,
  patientTitle: true,
  patientAge: false,
  patientDOB: false,
  patientPhone: false,
  enclosedAmountBox: true,
  dueDate: false,
  dueDateValue: 'receipt',
  displayToothNum: true,
  displayProcCode: true,
  displayShortDesc: true,
  displayTreatmentProvider: true,
  displayOfficeDesc: false,
  displayEstInsPortion: true,
  displayPerInsCoverage: true,
  displayEstInsAdj: false,
  transPatientPayment: false,
  transInsPayment: false,
  transInsAdj: false,
  transOfficeAdj: false,
  transClaim: false,
  transClaimInsName: true,
  transRefund: false,
  transDeposit: false,
  transRefundCredit: false,
  transTransferCredit: false,
  showCreditColumn: false,
  showBalanceColumn: false,
  balEstRemInsAdj: true,
  balEstRemIns: true,
  balEstPtPortion: true,
  balTotalPtPayments: true,
  balTotalInsPayments: true,
  balTotalAdj: true,
  agingBalance: 'patientOnly',
  agingCredit: 'total',
  agingDate: 'invoice',
  summaryTotalCharges: true,
  summaryTotalPtPayments: true,
  summaryTotalOfficeAdj: true,
  summaryTotalRefunds: true,
  summaryTotalInsPayments: true,
  summaryTotalInsAdj: true,
  summaryShowPerInsCoverage: false,
  summaryShowPerInsCoverageAdj: false,
  apptShowTreatmentProvider: true,
  apptShowHygieneProvider: true,
  disclaimerText: '',
};

const PaymentPresentation = () => {
  const dispatch = useDispatch();
  const forms = useSelector(selectStatementForms);
  const initialized = useSelector(state => state.statementForms.initialized);
  
  const [activeFormId, setActiveFormId] = useState(null);
  const [statementName, setStatementName] = useState('Simple Statement');
  const [sections, setSections] = useState({
    header: true,
    transaction: true,
    balances: true,
    aging: true,
    summary: true,
    appointments: true,
    disclaimer: true,
  });
  const [formSettings, setFormSettings] = useState(defaultSettings);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStatementForms());
  }, [dispatch]);

  // When forms load or change, select one to view if none is active
  useEffect(() => {
    if (forms.length > 0) {
      if (!activeFormId || !forms.find(f => f.id === activeFormId)) {
        const formToSelect = forms.find(f => f.isDefault) || forms[0];
        setActiveFormId(formToSelect.id);
        setStatementName(formToSelect.name);
        setSections(formToSelect.sections);
        setFormSettings(formToSelect.settings || defaultSettings);
      }
    }
  }, [forms, activeFormId]);

  const toggleSection = (section, value) => {
    setSections(prev => ({ ...prev, [section]: value }));
  };

  const handleSelectForm = (form) => {
    setActiveFormId(form.id);
    setStatementName(form.name);
    setSections(form.sections);
    setFormSettings(form.settings || defaultSettings);
  };

  const handleSettingChange = (key, value) => {
    setFormSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateNew = () => {
    dispatch(createStatementForm({
      name: 'New Statement Form',
      isDefault: forms.length === 0, // make default if it's the first one
      sections: {
        header: true, transaction: true, balances: true,
        aging: true, summary: true, appointments: true, disclaimer: true
      },
      settings: defaultSettings
    }));
  };

  const handleSave = () => {
    if (activeFormId) {
      dispatch(updateStatementForm({
        id: activeFormId,
        updates: { name: statementName, sections, settings: formSettings }
      }));
    } else {
      // If no active form (e.g., all were deleted), create one
      dispatch(createStatementForm({ name: statementName, sections, settings: formSettings, isDefault: true }));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteStatementForm(id));
  };

  const activeForm = forms.find(f => f.id === activeFormId);
  const isDirty = activeForm ? (
    statementName !== activeForm.name ||
    JSON.stringify(sections) !== JSON.stringify(activeForm.sections) ||
    JSON.stringify(formSettings) !== JSON.stringify(activeForm.settings || defaultSettings)
  ) : true;

  if (!initialized || (forms.length > 0 && !activeFormId)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: '100vh', backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Payment Presentation
        </Typography>
        <Button 
          startIcon={<img src={syncSvg} alt="Sync" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />}
          size="small"
          variant="contained"
          onClick={() => setIsSyncDialogOpen(true)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Sync
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Main Form */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '0.9rem' }}>
              Patient Statement Form
            </Typography>
            <TextField
              size="small"
              value={statementName}
              onChange={(e) => setStatementName(e.target.value)}
              sx={{ width: 250, '& .MuiOutlinedInput-root': { height: 35, fontSize: '0.85rem' } }}
            />
          </Box>

          <HeaderAreaSection 
            show={sections.header} 
            onToggle={(val) => toggleSection('header', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <TransactionListSection 
            show={sections.transaction} 
            onToggle={(val) => toggleSection('transaction', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <RemainingBalancesSection 
            show={sections.balances} 
            onToggle={(val) => toggleSection('balances', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <AgingBalanceSection 
            show={sections.aging} 
            onToggle={(val) => toggleSection('aging', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <StatementSummarySection 
            show={sections.summary} 
            onToggle={(val) => toggleSection('summary', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <NextAppointmentsSection 
            show={sections.appointments} 
            onToggle={(val) => toggleSection('appointments', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <DisclaimerSection 
            show={sections.disclaimer} 
            onToggle={(val) => toggleSection('disclaimer', val)}
            formSettings={formSettings}
            handleSettingChange={handleSettingChange}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, mb: 2 }}>
            <Button variant="outlined" sx={{ color: '#64748b', borderColor: '#cbd5e1', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }, textTransform: 'none', px: 4, boxShadow: 'none' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!isDirty}
              variant="contained" 
              sx={{ 
                bgcolor: '#2563eb', 
                '&:hover': { bgcolor: '#1d4ed8' }, 
                '&.Mui-disabled': { bgcolor: '#94a3b8', color: '#fff' },
                textTransform: 'none', 
                px: 4, 
                boxShadow: 'none' 
              }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: 220, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
          <SavedFormsSidebar 
            forms={forms}
            activeFormId={activeFormId}
            handleSelectForm={handleSelectForm}
            handleCreateNew={handleCreateNew}
            handleDelete={handleDelete}
          />
        </Box>
      </Box>

      <SyncOfficesDialog 
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
      />
    </Box>
  );
};

export default PaymentPresentation;
