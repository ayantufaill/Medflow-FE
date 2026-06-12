import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Paper,
  IconButton,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Sync as SyncIcon,
  DeleteOutline as DeleteIcon,
  Cached as RefreshIcon,
} from '@mui/icons-material';
import {
  fetchStatementForms,
  createStatementForm,
  updateStatementForm,
  deleteStatementForm,
  selectStatementForms
} from '../../store/slices/statementFormsSlice';

const FormSection = ({ title, subTitle, children, show, onToggle }) => (
  <Paper sx={{ mb: 2, borderRadius: 1, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
    <Grid container>
      <Grid item xs={2.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', bgcolor: '#fff' }}>
        <Typography sx={{ color: '#4b71a1', fontWeight: 600, fontSize: '0.85rem' }}>{title}</Typography>
        {subTitle && (
          <Typography sx={{ color: '#666', fontSize: '0.75rem', fontStyle: 'italic', mt: 0.5 }}>
            {subTitle}
          </Typography>
        )}
        <RadioGroup row sx={{ mt: 1 }} value={show ? 'show' : 'hide'} onChange={(e) => onToggle(e.target.value === 'show')}>
          <FormControlLabel 
            value="show" 
            control={<Radio size="small" sx={{ color: '#f56565', '&.Mui-checked': { color: '#f56565' } }} />} 
            label={<Typography sx={{ fontSize: '0.8rem' }}>Show</Typography>} 
          />
          <FormControlLabel 
            value="hide" 
            control={<Radio size="small" sx={{ color: '#f56565', '&.Mui-checked': { color: '#f56565' } }} />} 
            label={<Typography sx={{ fontSize: '0.8rem' }}>Hide</Typography>} 
          />
        </RadioGroup>
      </Grid>
      <Grid item xs={9.5} sx={{ p: 2 }}>
        {children}
      </Grid>
    </Grid>
  </Paper>
);

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

  if (!initialized || (forms.length > 0 && !activeFormId)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#003366' } }}>
        <Link underline="hover" color="#7a96b5" component={RouterLink} to="/admin/finance-management" sx={{ fontSize: '0.85rem' }}>
          Finance Management
        </Link>
        <Typography color="#003366" sx={{ fontSize: '0.85rem' }}>
          Payment Presentation
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<SyncIcon />} sx={{ color: '#4b71a1', textTransform: 'none', fontWeight: 600 }}>
          Sync
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={9}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography sx={{ color: '#4b71a1', fontWeight: 600, fontSize: '0.9rem' }}>
              Patient Statement Form
            </Typography>
            <TextField
              size="small"
              value={statementName}
              onChange={(e) => setStatementName(e.target.value)}
              sx={{ width: 250, '& .MuiOutlinedInput-root': { height: 35, fontSize: '0.85rem' } }}
            />
          </Box>

          <FormSection 
            title="Header Area" 
            show={sections.header} 
            onToggle={(val) => toggleSection('header', val)}
          >
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Header Type</Typography>
                <RadioGroup value={formSettings.headerType} onChange={(e) => handleSettingChange('headerType', e.target.value)}>
                  <FormControlLabel value="detachable" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Detachable slip</Typography>} />
                  <FormControlLabel value="envelope" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>2-window envelope</Typography>} />
                  <FormControlLabel value="regular" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Regular</Typography>} />
                </RadioGroup>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Office Info</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeLogo} onChange={(e) => handleSettingChange('officeLogo', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Office Logo</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.officePhone} onChange={(e) => handleSettingChange('officePhone', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Office Phone Number</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeAddress} onChange={(e) => handleSettingChange('officeAddress', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Address</Typography>} />
                  <Box sx={{ ml: 3 }}>
                    <Select size="small" value={formSettings.officeAddressValue} onChange={(e) => handleSettingChange('officeAddressValue', e.target.value)} sx={{ height: 25, fontSize: '0.75rem', width: 120 }}>
                      <MenuItem value="office1">Office Address</MenuItem>
                    </Select>
                  </Box>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeWebsite} onChange={(e) => handleSettingChange('officeWebsite', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Office Website</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.officeEmail} onChange={(e) => handleSettingChange('officeEmail', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Office Email</Typography>} />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Patient Info</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientName} onChange={(e) => handleSettingChange('patientName', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Patient Full Name</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientTitle} onChange={(e) => handleSettingChange('patientTitle', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Patient Title</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientAge} onChange={(e) => handleSettingChange('patientAge', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Patient Age</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientDOB} onChange={(e) => handleSettingChange('patientDOB', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Patient DOB</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.patientPhone} onChange={(e) => handleSettingChange('patientPhone', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Patient Phone Number</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.enclosedAmountBox} onChange={(e) => handleSettingChange('enclosedAmountBox', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Enclosed Amount Box</Typography>} />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>General</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.dueDate} onChange={(e) => handleSettingChange('dueDate', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Due Date</Typography>} />
                  <Select size="small" value={formSettings.dueDateValue} onChange={(e) => handleSettingChange('dueDateValue', e.target.value)} sx={{ height: 30, fontSize: '0.8rem', width: '100%' }}>
                    <MenuItem value="receipt">Upon Receipt</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection 
            title="Transacton List" 
            show={sections.transaction} 
            onToggle={(val) => toggleSection('transaction', val)}
          >
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Display Per Invoice</Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayToothNum} onChange={(e) => handleSettingChange('displayToothNum', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Tooth number</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayProcCode} onChange={(e) => handleSettingChange('displayProcCode', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Procedure Code</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayShortDesc} onChange={(e) => handleSettingChange('displayShortDesc', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>System Short Description</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayTreatmentProvider} onChange={(e) => handleSettingChange('displayTreatmentProvider', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Treatment Provider</Typography>} />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayOfficeDesc} onChange={(e) => handleSettingChange('displayOfficeDesc', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Office Description</Typography>} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayEstInsPortion} onChange={(e) => handleSettingChange('displayEstInsPortion', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Estimated Ins. Portion</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayPerInsCoverage} onChange={(e) => handleSettingChange('displayPerInsCoverage', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show per insurance coverage</Typography>} />
                </Box>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayEstInsAdj} onChange={(e) => handleSettingChange('displayEstInsAdj', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Estmated Ins. Adjustment</Typography>} />
              </Grid>
            </Grid>

            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 2, mb: 1, color: '#333' }}>Other transactions to display</Typography>
            <Grid container spacing={0.5}>
              {[
                { label: 'Patient Payment', key: 'transPatientPayment' },
                { label: 'Insurance Payment', key: 'transInsPayment' },
                { label: 'Insurance Adj (write-off)', key: 'transInsAdj' },
                { label: 'Office Adjustment', key: 'transOfficeAdj' },
                { label: 'Claim', key: 'transClaim' },
                { label: 'Payment Refund', key: 'transRefund' },
                { label: 'Deposit (pre-payment & overpayment) - only on full account statement', key: 'transDeposit' },
                { label: 'Refund Account Credit - only on full account statement', key: 'transRefundCredit' },
                { label: 'Transfer of Account Credit - only on full account statement', key: 'transTransferCredit' }
              ].map((item, i) => (
                <Grid item xs={6} key={i}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings[item.key]} onChange={(e) => handleSettingChange(item.key, e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>{item.label}</Typography>} />
                  {item.key === 'transClaim' && (
                    <Box sx={{ ml: 3 }}>
                      <FormControlLabel control={<Checkbox size="small" checked={formSettings.transClaimInsName} onChange={(e) => handleSettingChange('transClaimInsName', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Insurance Name</Typography>} />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
            <Typography sx={{ color: '#f56565', fontSize: '0.75rem', mt: 1, fontStyle: 'italic' }}>
              we recommend you uncheck the credit and balance columns from the section below<br/>since the number will not match due to the hidden transcations
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Show columns:</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.showCreditColumn} onChange={(e) => handleSettingChange('showCreditColumn', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Credit Column</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.showBalanceColumn} onChange={(e) => handleSettingChange('showBalanceColumn', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Balance Column</Typography>} />
              </Box>
            </Box>
          </FormSection>

          <FormSection 
            title="Remaining Balances" 
            show={sections.balances} 
            onToggle={(val) => toggleSection('balances', val)}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Estimated portions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.balEstRemInsAdj} onChange={(e) => handleSettingChange('balEstRemInsAdj', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Estimated Remaining Ins. Adjustment</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.balEstRemIns} onChange={(e) => handleSettingChange('balEstRemIns', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Estimated Remaining Insurance</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.balEstPtPortion} onChange={(e) => handleSettingChange('balEstPtPortion', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Estimated pt portion</Typography>} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ pt: 3 }}>
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.balTotalPtPayments} onChange={(e) => handleSettingChange('balTotalPtPayments', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Patient Payments</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.balTotalInsPayments} onChange={(e) => handleSettingChange('balTotalInsPayments', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Insurance Payments</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={formSettings.balTotalAdj} onChange={(e) => handleSettingChange('balTotalAdj', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Adjustment</Typography>} />
                </Box>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection 
            title="Aging Balance & Credit" 
            show={sections.aging} 
            onToggle={(val) => toggleSection('aging', val)}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={2.5}><Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Balance Aging:</Typography></Grid>
              <Grid item xs={9.5}>
                <RadioGroup row value={formSettings.agingBalance} onChange={(e) => handleSettingChange('agingBalance', e.target.value)}>
                  <FormControlLabel value="total" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show Total Aging (ins & pt)</Typography>} />
                  <FormControlLabel value="patientOnly" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show Patient Aging Only</Typography>} />
                  <FormControlLabel value="none" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Don't Show Aging</Typography>} />
                </RadioGroup>
                <Typography sx={{ color: '#888', fontSize: '0.75rem', mt: -0.5, fontStyle: 'italic' }}>this excludes the estimated remaining write-off (ins adj).</Typography>
              </Grid>

              <Grid item xs={2.5} sx={{ mt: 1 }}><Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Account Credit:</Typography></Grid>
              <Grid item xs={9.5} sx={{ mt: 1 }}>
                <RadioGroup row value={formSettings.agingCredit} onChange={(e) => handleSettingChange('agingCredit', e.target.value)}>
                  <FormControlLabel value="total" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show Total Credit (ins & pt)</Typography>} />
                  <FormControlLabel value="patientOnly" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show Patient Credit Only</Typography>} />
                  <FormControlLabel value="none" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Don't Show Credit</Typography>} />
                </RadioGroup>
              </Grid>

              <Grid item xs={2.5} sx={{ mt: 1 }}><Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Aging Date:</Typography></Grid>
              <Grid item xs={9.5} sx={{ mt: 1 }}>
                <RadioGroup row value={formSettings.agingDate} onChange={(e) => handleSettingChange('agingDate', e.target.value)}>
                  <FormControlLabel value="dos" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Remaining Balance DOS</Typography>} />
                  <FormControlLabel value="invoice" control={<Radio size="small" sx={{ color: '#f56565' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Invoice Date</Typography>} />
                </RadioGroup>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection 
            title="Statement Summary" 
            subTitle="only on full account statement"
            show={sections.summary} 
            onToggle={(val) => toggleSection('summary', val)}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Totals</Typography>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalCharges} onChange={(e) => handleSettingChange('summaryTotalCharges', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Charges</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalPtPayments} onChange={(e) => handleSettingChange('summaryTotalPtPayments', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Patient Payments</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalOfficeAdj} onChange={(e) => handleSettingChange('summaryTotalOfficeAdj', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Office Adjustments</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalRefunds} onChange={(e) => handleSettingChange('summaryTotalRefunds', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Refunds</Typography>} />
              </Grid>
              <Grid item xs={4} sx={{ pt: 4.5 }}>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalInsPayments} onChange={(e) => handleSettingChange('summaryTotalInsPayments', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Insurance Payments</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryTotalInsAdj} onChange={(e) => handleSettingChange('summaryTotalInsAdj', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Total Insurance Adjs (write-off)</Typography>} />
              </Grid>
              <Grid item xs={4} sx={{ pt: 4.5 }}>
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryShowPerInsCoverage} onChange={(e) => handleSettingChange('summaryShowPerInsCoverage', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show per insurance coverage</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formSettings.summaryShowPerInsCoverageAdj} onChange={(e) => handleSettingChange('summaryShowPerInsCoverageAdj', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show per insurance coverage adjs</Typography>} />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection 
            title="Next Scheduled Appointments" 
            show={sections.appointments} 
            onToggle={(val) => toggleSection('appointments', val)}
          >
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Provider Name</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel control={<Checkbox size="small" checked={formSettings.apptShowTreatmentProvider} onChange={(e) => handleSettingChange('apptShowTreatmentProvider', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show Treatment Provider Name</Typography>} />
              <FormControlLabel control={<Checkbox size="small" checked={formSettings.apptShowHygieneProvider} onChange={(e) => handleSettingChange('apptShowHygieneProvider', e.target.checked)} sx={{ color: '#4a89dc' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Show Hygiene Provider Name</Typography>} />
            </Box>
          </FormSection>

          <FormSection 
            title="Disclaimer" 
            show={sections.disclaimer} 
            onToggle={(val) => toggleSection('disclaimer', val)}
          >
            <TextField
              multiline
              rows={4}
              fullWidth
              value={formSettings.disclaimerText}
              onChange={(e) => handleSettingChange('disclaimerText', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
            />
            <Typography sx={{ color: '#4a89dc', fontSize: '0.8rem', mt: 1, cursor: 'pointer', fontWeight: 500 }}>
              + add new paragraph
            </Typography>
          </FormSection>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 5 }}>
            <Button variant="contained" sx={{ bgcolor: '#a0aec0', '&:hover': { bgcolor: '#718096' }, textTransform: 'none', px: 4, boxShadow: 'none' }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4b71a1', '&:hover': { bgcolor: '#385882' }, textTransform: 'none', px: 4, boxShadow: 'none' }}>
              Save
            </Button>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button onClick={handleCreateNew} variant="contained" sx={{ bgcolor: '#4b71a1', '&:hover': { bgcolor: '#385882' }, textTransform: 'none', py: 1, boxShadow: 'none' }}>
              Create new statement
            </Button>
            
            <Paper sx={{ border: '1px solid #a0aec0', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#4b71a1', color: 'white', p: 1.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Saved Statement Printout Form</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {forms.map(form => (
                  <Box 
                    key={form.id} 
                    onClick={() => handleSelectForm(form)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      p: 1.5, 
                      bgcolor: activeFormId === form.id ? '#5a86bc' : 'white', 
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: activeFormId === form.id ? '#5a86bc' : '#f8fafc' }
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', color: activeFormId === form.id ? 'white' : '#2d3748' }}>
                      {form.name} 
                      {form.isDefault && (
                        <Typography component="span" sx={{ fontSize: '0.85rem', color: activeFormId === form.id ? '#e2e8f0' : '#718096', ml: 1 }}>
                          (Default)
                        </Typography>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); handleDelete(form.id); }} 
                        sx={{ color: '#f56565', p: 0.5 }}
                      >
                        <DeleteIcon fontSize="1.2rem" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                {forms.length === 0 && (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#718096', fontStyle: 'italic' }}>
                      No forms saved.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentPresentation;
