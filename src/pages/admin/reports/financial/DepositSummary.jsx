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
import { depositService } from '../../../../services/deposit.service';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { reportingService } from '../../../../services/reporting.service';
import { ReportLayout } from '../../../../components/reports/ui';

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
    <ReportLayout title="Deposit Summary:">
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={7}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#337ab7', mb: 1, borderBottom: '1px solid #e0e0e0', pb: 0.5 }}>
            Create new deposit summary:
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#4a89dc', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export CSV</Button>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#d9a366', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Transactions Date Range:</Typography>
              <Select
                value={dateRangeType}
                onChange={(e) => setDateRangeType(e.target.value)}
                size="small"
                variant="standard"
                sx={{ fontSize: '0.85rem', minWidth: 100, backgroundColor: '#fff' }}
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
              </Select>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ backgroundColor: '#00BBAB', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#009b8e' } }}>Apply Filters</Button>
              <Button variant="contained" size="small" sx={{ backgroundColor: '#d9a366', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#c89255' } }}>Create Template</Button>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 2 }}>Include payment types</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <CheckboxGroup title="Patient payment types" items={PAYMENT_TYPES} selected={patientTypes} setSelected={setPatientTypes} />
            </Grid>
            <Grid item xs={4}>
              <CheckboxGroup title="Insurance payment types" items={PAYMENT_TYPES.slice(0, 15)} selected={insuranceTypes} setSelected={setInsuranceTypes} />
            </Grid>
            <Grid item xs={4}>
              <CheckboxGroup title="Include refund payment types" items={PAYMENT_TYPES.slice(0, 15)} selected={refundTypes} setSelected={setRefundTypes} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <CheckboxGroup title="Include Deposits" items={PAYMENT_TYPES.slice(0, 5)} selected={depositTypes} setSelected={setDepositTypes} />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#4a89dc', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>
              Preview Deposit
            </Button>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#d9a366', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#c89255' } }}>
              Print Slip
            </Button>
          </Box>
        </Grid>

        {/* Divider */}
        <Grid item xs={false} md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 1, borderColor: '#e0e0e0' }} />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
             <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#337ab7', borderBottom: '1px solid #337ab7', pb: 0.5 }}>
              Deposit summary:
            </Typography>
             <Button
              variant="contained"
              sx={{
                backgroundColor: '#d9a366',
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                minWidth: 60,
                height: 30,
                '&:hover': { bgcolor: '#c99f54' }
              }}
              onClick={() => window.print()}
            >
              Print
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            {!groupedPayments ? (
              <>
                <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#333', mb: 1, display: 'block' }}>
                  No summary create.
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#666', display: 'block' }}>
                  Create a deposit summary by editing the left side options and clicking 'Create Deposit'.
                </Typography>
              </>
            ) : (
              <Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1 }}>date</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1 }}>payment type</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1 }}>amount</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, p: 1 }}>daily total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupedPayments.map((group, gIdx) => {
                        const typesEntries = Object.entries(group.types);
                        return typesEntries.map(([type, amount], tIdx) => (
                          <TableRow key={`${gIdx}-${tIdx}`}>
                            <TableCell sx={{ fontSize: '0.75rem', p: 1, borderBottom: 'none' }}>
                              {tIdx === 0 ? group.date : ''}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem', p: 1, borderBottom: 'none' }}>
                              {type}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem', p: 1, borderBottom: 'none' }}>
                              ${amount.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.75rem', p: 1, borderBottom: 'none' }}>
                              {tIdx === 0 ? `$${group.dailyTotal.toFixed(2)}` : ''}
                            </TableCell>
                          </TableRow>
                        ));
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {groupedPayments.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
                    <Typography sx={{ bgcolor: '#2196f3', color: '#fff', px: 1, py: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>
                      Total: ${overallTotal.toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </ReportLayout>
  );
};

export default DepositSummary;
