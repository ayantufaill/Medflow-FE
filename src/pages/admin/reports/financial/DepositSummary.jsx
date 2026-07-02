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
  TextField
} from '@mui/material';
import { depositService } from '../../../../services/deposit.service';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { reportingService } from '../../../../services/reporting.service';

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
      <Typography variant="h6" className="no-print" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Deposit Summary:
      </Typography>

      <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
        {/* Left Section - Controls */}
        <Grid item xs={4} className="no-print">
          <Box sx={{ borderRight: '1px solid #e0e0e0', pr: 3, height: '100%' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
              Create new deposit summary:
            </Typography>

            <RadioGroup 
              row 
              value={dateRangeType} 
              onChange={handleDateModeChange}
              sx={{ mb: 2 }}
            >
              <FormControlLabel value="Daily" control={<Radio size="small" />} label={<Typography variant="caption">Daily</Typography>} />
              <FormControlLabel value="Range" control={<Radio size="small" />} label={<Typography variant="caption">Range</Typography>} />
              <FormControlLabel value="Weekly" control={<Radio size="small" />} label={<Typography variant="caption">Weekly</Typography>} />
              <FormControlLabel value="Monthly" control={<Radio size="small" />} label={<Typography variant="caption">Monthly</Typography>} />
            </RadioGroup>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Transactions done from: 
                <input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', fontFamily: 'inherit' }}
                />
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                to: 
                <input 
                  type="date" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', fontFamily: 'inherit' }}
                />
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Include payment types</Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <CheckboxGroup 
                  title="Patient payment types" 
                  items={PAYMENT_TYPES} 
                  selected={patientTypes} 
                  setSelected={setPatientTypes} 
                />
                
                <Box sx={{ mt: 3 }}>
                  <CheckboxGroup 
                    title="Include Deposits" 
                    items={PAYMENT_TYPES} 
                    selected={depositTypes} 
                    setSelected={setDepositTypes} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CheckboxGroup 
                  title="Insurance payment types" 
                  items={PAYMENT_TYPES} 
                  selected={insuranceTypes} 
                  setSelected={setInsuranceTypes} 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CheckboxGroup 
                  title="Include refund payment types" 
                  items={PAYMENT_TYPES} 
                  selected={refundTypes} 
                  setSelected={setRefundTypes} 
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {!showTemplateForm && (
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={executeCreateDeposit}
                  disabled={loading || creating}
                  sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}
                >
                  {loading || creating ? <CircularProgress size={20} color="inherit" /> : 'Create Deposit'}
                </Button>
              )}
              
              {showTemplateForm ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    sx={{ width: 200, '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem' } }}
                    autoFocus
                  />
                  <Button 
                    variant="contained" 
                    disabled={savingTemplate}
                    onClick={handleSaveTemplate}
                    sx={{ textTransform: 'none', bgcolor: '#8db3d9', height: 36 }}
                  >
                    {savingTemplate ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      setShowTemplateForm(false);
                      setTemplateName('');
                    }}
                    sx={{ textTransform: 'none', bgcolor: '#d1a066', height: 36 }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => setShowTemplateForm(true)}
                  sx={{ textTransform: 'none', bgcolor: '#dcb265', '&:hover': { bgcolor: '#c99f54' } }}
                >
                  Create Template
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Section - Dynamic Preview / Created Report */}
        <Grid item xs={8} sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
             <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main', borderBottom: '1px solid #1a3a6b', pb: 0.5 }}>
              Deposit summary:
            </Typography>
             <Button
              variant="contained"
              sx={{
                bgcolor: '#dcb265',
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
    </Box>
  );
};

export default DepositSummary;
