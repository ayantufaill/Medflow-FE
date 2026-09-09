import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { depositService } from '../../../../services/deposit.service';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { reportingService } from '../../../../services/reporting.service';
import dayjs from 'dayjs';
import DepositSlipFilters from '../../../../components/reports/financial/DepositSlipFilters';
import DepositSummaryPreview from '../../../../components/reports/financial/DepositSummaryPreview';

const PAYMENT_TYPES = [
  'EFT', 'Debit Card', 'Visa Card', 'Credit Card', 'Master Card', 'Amex', 
  'Patient Check', 'Insurance Check', 'Cash', 'Care Credit', 'ACH Payment', 
  'Account Correction', 'Courtesy Credit', 'NP Special', 
  'Insurance Refund/Back to Office', 'Test', 'Test Jen', 'HSA'
];

const DepositSummary = () => {
  const location = useLocation();
  const templateData = location.state?.templateData;
  const { showSnackbar } = useSnackbar();
  
  const [dateRangeType, setDateRangeType] = useState('Range');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [patientTypes, setPatientTypes] = useState(PAYMENT_TYPES);
  const [insuranceTypes, setInsuranceTypes] = useState(PAYMENT_TYPES);
  const [refundTypes, setRefundTypes] = useState(PAYMENT_TYPES);
  const [depositTypes, setDepositTypes] = useState(PAYMENT_TYPES);
  
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // All undeposited payments from API
  const [allPayments, setAllPayments] = useState([]);
  // Filtered payments grouped by date
  const [groupedPayments, setGroupedPayments] = useState(null);

  useEffect(() => {
    if (templateData && templateData.filters) {
      templateData.filters.forEach(f => {
        if (f.type === 'mode') {
          setDateRangeType(f.value);
          applyModeDates(f.value);
        }
        if (f.type === 'patientPayTypes') setPatientTypes(f.value);
        if (f.type === 'insPayTypes') setInsuranceTypes(f.value);
        if (f.type === 'refPayTypes') setRefundTypes(f.value);
        if (f.type === 'incDepTypes') setDepositTypes(f.value);
      });
    } else {
      applyModeDates('Range');
    }
  }, [templateData]);
  
  const applyModeDates = (mode) => {
    const today = new Date();
    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (mode === 'Daily') {
      const todayStr = getLocalDateString(today);
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (mode === 'Weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      setFromDate(getLocalDateString(startOfWeek));
      setToDate(getLocalDateString(endOfWeek));
    } else if (mode === 'Monthly') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setFromDate(getLocalDateString(startOfMonth));
      setToDate(getLocalDateString(endOfMonth));
    } else if (mode === 'Range') {
      setToDate(getLocalDateString(today));
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      setFromDate(getLocalDateString(lastMonth));
    }
  };

  const handleDateModeChange = (e) => {
    const mode = e.target.value;
    setDateRangeType(mode);
    applyModeDates(mode);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await depositService.getUnDepositedPayments();
      const combined = [...(data?.patientPayments || []), ...(data?.insurancePayments || [])];
      setAllPayments(combined);
      showSnackbar('Fetched undeposited payments', 'success');
    } catch (err) {
      showSnackbar('Failed to fetch payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    if (allPayments.length === 0) {
      await fetchPayments();
    } else {
      filterAndGroupPayments(allPayments);
    }
  };

  useEffect(() => {
    if (allPayments.length > 0) {
      filterAndGroupPayments(allPayments);
    }
  }, [allPayments]);

  const filterAndGroupPayments = (payments) => {
    const selectedMethods = new Set([
      ...patientTypes.map(t => t.toLowerCase()),
      ...insuranceTypes.map(t => t.toLowerCase()),
      ...refundTypes.map(t => t.toLowerCase()),
      ...depositTypes.map(t => t.toLowerCase())
    ]);

    let filtered = payments;

    if (selectedMethods.size > 0) {
      filtered = filtered.filter(p => {
        const method = (p.method || '').toLowerCase();
        return Array.from(selectedMethods).some(sm => method.includes(sm) || sm.includes(method));
      });
    } else {
      filtered = []; 
    }

    const getLocalDateOnly = (dateString) => {
      if (!dateString) return '';
      return dateString.split('T')[0];
    };

    if (fromDate) {
      filtered = filtered.filter(p => p.date && getLocalDateOnly(p.date) >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(p => p.date && getLocalDateOnly(p.date) <= toDate);
    }

    const groups = {};
    filtered.forEach(p => {
      const d = p.date ? new Date(p.date).toLocaleDateString() : 'Unknown Date';
      if (!groups[d]) {
        groups[d] = {
          date: d,
          types: {},
          dailyTotal: 0,
          payments: []
        };
      }
      const typeKey = p.method || 'Unknown';
      if (!groups[d].types[typeKey]) groups[d].types[typeKey] = 0;
      groups[d].types[typeKey] += p.amount;
      groups[d].dailyTotal += p.amount;
      groups[d].payments.push(p);
    });

    const groupedArray = Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
    setGroupedPayments(groupedArray);
  };

  const executeCreateDeposit = async () => {
    let paymentsToProcess = allPayments;
    if (allPayments.length === 0) {
      setLoading(true);
      try {
        const data = await depositService.getUnDepositedPayments();
        const combined = [...(data?.patientPayments || []), ...(data?.insurancePayments || [])];
        paymentsToProcess = combined;
        setAllPayments(paymentsToProcess);
      } catch (err) {
        showSnackbar('Failed to fetch payments', 'error');
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    const selectedMethods = new Set([
      ...patientTypes.map(t => t.toLowerCase()),
      ...insuranceTypes.map(t => t.toLowerCase()),
      ...refundTypes.map(t => t.toLowerCase()),
      ...depositTypes.map(t => t.toLowerCase())
    ]);

    let filtered = paymentsToProcess;
    if (selectedMethods.size > 0) {
      filtered = filtered.filter(p => {
        const method = (p.method || '').toLowerCase();
        return Array.from(selectedMethods).some(sm => method.includes(sm) || sm.includes(method));
      });
    } else {
      filtered = []; 
    }

    const getLocalDateOnly = (dateString) => {
      if (!dateString) return '';
      return dateString.split('T')[0];
    };

    if (fromDate) {
      filtered = filtered.filter(p => p.date && getLocalDateOnly(p.date) >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(p => p.date && getLocalDateOnly(p.date) <= toDate);
    }

    const patientPaymentIds = [];
    const insurancePaymentIds = [];

    const groups = {};
    filtered.forEach(p => {
      const d = p.date ? new Date(p.date).toLocaleDateString() : 'Unknown Date';
      if (!groups[d]) {
        groups[d] = {
          date: d,
          types: {},
          dailyTotal: 0,
          payments: []
        };
      }
      const typeKey = p.method || 'Unknown';
      if (!groups[d].types[typeKey]) groups[d].types[typeKey] = 0;
      groups[d].types[typeKey] += p.amount;
      groups[d].dailyTotal += p.amount;
      groups[d].payments.push(p);

      if (p.type === 'patient') patientPaymentIds.push(p.id);
      else if (p.type === 'insurance') insurancePaymentIds.push(p.id);
    });

    if (patientPaymentIds.length === 0 && insurancePaymentIds.length === 0) {
      showSnackbar('No un-deposited payments match the selected criteria.', 'warning');
      return;
    }

    setCreating(true);
    try {
      await depositService.createDepositSlip({
        patientPaymentIds,
        insurancePaymentIds,
        date: new Date()
      });
      showSnackbar('Deposit created successfully!', 'success');
      
      const groupedArray = Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
      setGroupedPayments(groupedArray);
      
      // Refresh background payments
      const data = await depositService.getUnDepositedPayments();
      const combined = [...(data?.patientPayments || []), ...(data?.insurancePayments || [])];
      setAllPayments(combined);
    } catch (err) {
      showSnackbar('Failed to create deposit', 'error');
    } finally {
      setCreating(false);
    }
  };

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      showSnackbar("Please enter a template name.", "warning");
      return;
    }

    let finalName = templateName.trim();
    const modeStr = dateRangeType.toLowerCase();
    if (modeStr === 'daily' && !finalName.toLowerCase().includes('daily')) {
      finalName = `Daily ${finalName}`;
    } else if (modeStr === 'weekly' && !finalName.toLowerCase().includes('weekly')) {
      finalName = `Weekly ${finalName}`;
    } else if (modeStr === 'monthly' && !finalName.toLowerCase().includes('monthly')) {
      finalName = `Monthly ${finalName}`;
    }

    try {
      setSavingTemplate(true);
      await reportingService.saveReport({
        name: finalName,
        kind: 'Financial',
        filters: [
          { type: 'mode', value: dateRangeType },
          { type: 'patientPayTypes', value: patientTypes },
          { type: 'insPayTypes', value: insuranceTypes },
          { type: 'refPayTypes', value: refundTypes },
          { type: 'incDepTypes', value: depositTypes },
          { type: 'isSummary', value: true },
        ],
        columns: []
      });
      showSnackbar('Template saved successfully! It will now appear in Saved Reports.', 'success');
      setShowTemplateForm(false);
      setTemplateName('');
    } catch (err) {
      showSnackbar(err?.response?.data?.message || 'Failed to save template.', 'error');
    } finally {
      setSavingTemplate(false);
    }
  };

  const CheckboxGroup = ({ title, items, selected, setSelected }) => {
    const handleToggleAll = (e) => {
      if (e.target.checked) setSelected([...items]);
      else setSelected([]);
    };

    const handleToggle = (item) => {
      if (selected.includes(item)) setSelected(selected.filter(i => i !== item));
      else setSelected([...selected, item]);
    };

    const allSelected = items.length > 0 && selected.length === items.length;

    return (
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={allSelected} onChange={handleToggleAll} />}
          label={<Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>}
        />
        <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
          {items.map((item, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox 
                  size="small" 
                  checked={selected.includes(item)} 
                  onChange={() => handleToggle(item)}
                />
              }
              label={<Typography variant="caption">{item}</Typography>}
              sx={{ my: -0.5 }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const overallTotal = groupedPayments 
    ? groupedPayments.reduce((sum, g) => sum + g.dailyTotal, 0)
    : 0;

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" className="no-print" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Deposit Summary:
      </Typography>

      <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Left Column - Filters */}
        <Grid item xs={12} md={8}>
          <DepositSlipFilters
            title="Create new deposit summary:"
            buttonText="Apply Filters"
            extraButtons={
              <>
                <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#3CA2E0', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#2E8CCC', boxShadow: 'none' } }}>Export CSV</Button>
                <Button variant="outlined" size="small" startIcon={<PrintIcon sx={{ color: '#3b82f6' }} />} sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap', boxShadow: 'none' }}>Print</Button>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', px: 2, fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap', boxShadow: 'none' }}>Preview Deposit</Button>
              </>
            }
            filterMode={dateRangeType.toLowerCase()}
            handleFilterModeChange={(e) => {
              setDateRangeType(e.target.value);
              applyModeDates(e.target.value);
            }}
            startDate={fromDate ? dayjs(fromDate) : null}
            setStartDate={(v) => setFromDate(v ? v.format('YYYY-MM-DD') : '')}
            endDate={toDate ? dayjs(toDate) : null}
            setEndDate={(v) => setToDate(v ? v.format('YYYY-MM-DD') : '')}
            paymentTypes={PAYMENT_TYPES}
            patientPaymentTypesOptions={PAYMENT_TYPES}
            insurancePaymentTypesOptions={PAYMENT_TYPES.slice(0, 15)}
            refundPaymentTypesOptions={PAYMENT_TYPES.slice(0, 15)}
            includeDepositTypesOptions={PAYMENT_TYPES.slice(0, 5)}
            patientPayTypes={patientTypes}
            patPayAll={patientTypes.length === PAYMENT_TYPES.length}
            insPayTypes={insuranceTypes}
            insPayAll={insuranceTypes.length === PAYMENT_TYPES.slice(0, 15).length}
            refPayTypes={refundTypes}
            refPayAll={refundTypes.length === PAYMENT_TYPES.slice(0, 15).length}
            incDepTypes={depositTypes}
            incDepAll={depositTypes.length === PAYMENT_TYPES.slice(0, 5).length}
            handleToggleAll={(type, checked) => {
              if (type === 'patient') setPatientTypes(checked ? PAYMENT_TYPES : []);
              else if (type === 'insurance') setInsuranceTypes(checked ? PAYMENT_TYPES.slice(0, 15) : []);
              else if (type === 'refund') setRefundTypes(checked ? PAYMENT_TYPES.slice(0, 15) : []);
              else if (type === 'include') setDepositTypes(checked ? PAYMENT_TYPES.slice(0, 5) : []);
            }}
            handleToggleItem={(type, item, checked) => {
              if (type === 'patient') setPatientTypes(checked ? [...patientTypes, item] : patientTypes.filter(x => x !== item));
              else if (type === 'insurance') setInsuranceTypes(checked ? [...insuranceTypes, item] : insuranceTypes.filter(x => x !== item));
              else if (type === 'refund') setRefundTypes(checked ? [...refundTypes, item] : refundTypes.filter(x => x !== item));
              else if (type === 'include') setDepositTypes(checked ? [...depositTypes, item] : depositTypes.filter(x => x !== item));
            }}
            showTemplateForm={false}
            setShowTemplateForm={() => {}}
            templateName=""
            setTemplateName={() => {}}
            savingTemplate={false}
            handleSaveTemplate={() => {}}
            handleCreateDepositClick={handleApplyFilters}
            loading={loading}
          />
        </Grid>

        {/* Right Column - Preview */}
        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', height: '100%' }}>
            <DepositSummaryPreview
              groupedPayments={groupedPayments}
              overallTotal={overallTotal}
              handlePrint={() => window.print()}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositSummary;
