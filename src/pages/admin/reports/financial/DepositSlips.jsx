import React, { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import {
  Box,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Collapse,
  TextField,
} from '@mui/material';
import {
  fetchDepositSlips,
  fetchUnDepositedPayments,
  createDepositSlip,
} from '../../../../store/slices/depositSlice';
import { reportingService } from '../../../../services/reporting.service';

const DepositSlips = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const templateData = location.state?.templateData;
  const { slips, unDeposited, loading } = useSelector((state) => state.deposits || { slips: [], unDeposited: { patientPayments: [], insurancePayments: [] }, loading: false });
  const [isSlipsExpanded, setIsSlipsExpanded] = useState(true);

  const paymentTypes = [
    'Do not use', 'Check', 'Debit Card', 'EFT', 'Cash', 'Care Credit', 
    'Master Card', 'Visa Card', 'ACH Payment', 'American Express', 
    'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'
  ];

  const defaultSelectedTypes = [
    'Check', 'Patient Check', 'Insurance Check', 'Debit Card', 'EFT', 'Cash', 
    'Care Credit', 'Master Card', 'Visa Card', 'ACH Payment', 'American Express', 
    'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC',
    'Courtesy Credit', 'Account Correction'
  ];

  const [patientPayTypes, setPatientPayTypes] = useState(defaultSelectedTypes);
  const [insPayTypes, setInsPayTypes] = useState(defaultSelectedTypes);
  const [refPayTypes, setRefPayTypes] = useState(defaultSelectedTypes);
  const [incDepTypes, setIncDepTypes] = useState(defaultSelectedTypes);

  const [patPayAll, setPatPayAll] = useState(true);
  const [insPayAll, setInsPayAll] = useState(true);
  const [refPayAll, setRefPayAll] = useState(true);
  const [incDepAll, setIncDepAll] = useState(true);

  // Apply template filters if navigated from Saved Reports
  useEffect(() => {
    if (templateData && templateData.filters) {
      templateData.filters.forEach(f => {
        if (f.type === 'mode') setFilterMode(f.value);
        if (f.type === 'patientPayTypes') setPatientPayTypes(f.value);
        if (f.type === 'insPayTypes') setInsPayTypes(f.value);
        if (f.type === 'refPayTypes') setRefPayTypes(f.value);
        if (f.type === 'incDepTypes') setIncDepTypes(f.value);
      });
    }
  }, [templateData]);

  const formatMethodLabel = (method) => {
    if (!method) return 'Check';
    const lower = method.toLowerCase().trim();
    if (lower === 'card' || lower === 'credit_card') return 'Credit Card';
    if (lower === 'cash') return 'Cash';
    if (lower === 'ach' || lower === 'eft') return 'EFT';
    if (lower === 'check') return 'Check';
    return method; // preserve legacy OpenDental strings like "Visa Card"
  };

  const isMethodSelected = (method, selectedTypes) => {
    if (!method) return false;
    const lowerMethod = method.toLowerCase().trim();
    
    return selectedTypes.some(t => {
      const lowerT = t.toLowerCase().trim();
      
      // Match exact strings
      if (lowerT === lowerMethod) return true;
      
      // Map Backend "card" to UI "Visa/Master/Debit Card"
      if (lowerMethod === 'card' && lowerT.includes('card')) return true;
      
      // Map Backend "ach" to UI "EFT" or "ACH Payment"
      if (lowerMethod === 'ach' && (lowerT === 'eft' || lowerT === 'ach payment')) return true;
      
      // Handle the generic 'Check' mappings
      if ((lowerT === 'check' && lowerMethod === 'patient check') ||
          (lowerT === 'check' && lowerMethod === 'insurance check') ||
          (lowerT === 'patient check' && lowerMethod === 'check') ||
          (lowerT === 'insurance check' && lowerMethod === 'check')) {
        return true;
      }

      return false;
    });
  };

  const getLocalDateOnly = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter States
  const [filterMode, setFilterMode] = useState('daily');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  // Created Slip Report States
  const [createdSlipDetails, setCreatedSlipDetails] = useState(null);
  const [depositNote, setDepositNote] = useState('');

  // Template Saving States
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);
  const templateTitle = templateData?.name;

  // Apply filters from template
  useEffect(() => {
    if (templateData && templateData.filters) {
      templateData.filters.forEach(f => {
        if (f.type === 'mode') {
          setFilterMode(f.value);
          applyModeDates(f.value);
        }
        if (f.type === 'patientPayTypes') setPatientPayTypes(f.value);
        if (f.type === 'insPayTypes') setInsPayTypes(f.value);
        if (f.type === 'refPayTypes') setRefPayTypes(f.value);
        if (f.type === 'incDepTypes') setIncDepTypes(f.value);
      });
    }
  }, [templateData]);

  useEffect(() => {
    dispatch(fetchDepositSlips({ page: 1, limit: 50 }));
    dispatch(fetchUnDepositedPayments());
  }, [dispatch]);

  // Automatically initialize start and end dates based on un-deposited payments available in the DB
  useEffect(() => {
    if (templateData) return; // Do not overwrite if we are loading a template

    const pts = unDeposited.patientPayments || [];
    const inss = unDeposited.insurancePayments || [];
    if (pts.length > 0 || inss.length > 0) {
      const allDates = [...pts, ...inss]
        .map((p) => p.date)
        .filter(Boolean)
        .map((d) => new Date(d).getTime());

      if (allDates.length > 0) {
        const minDateStr = dayjs(Math.min(...allDates));
        const maxDateStr = dayjs(Math.max(...allDates));
        setStartDate(minDateStr);
        setEndDate(maxDateStr);
        setFilterMode('range');
      }
    }
  }, [unDeposited]);

  const applyModeDates = (mode) => {
    const today = dayjs();

    if (mode === 'daily') {
      setStartDate(today);
      setEndDate(today);
    } else if (mode === 'weekly') {
      const startOfWeek = today.startOf('week');
      const endOfWeek = today.endOf('week');
      
      setStartDate(startOfWeek);
      setEndDate(endOfWeek);
    } else if (mode === 'monthly') {
      const startOfMonth = today.startOf('month');
      const endOfMonth = today.endOf('month');
      
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
  };

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    setFilterMode(newMode);
    applyModeDates(newMode);
  };

  const handleToggleAll = (type, checked) => {
    const list = checked ? [...paymentTypes] : [];
    if (type === 'patient') {
      setPatPayAll(checked);
      setPatientPayTypes(list);
    } else if (type === 'insurance') {
      setInsPayAll(checked);
      setInsPayTypes(list);
    } else if (type === 'refund') {
      setRefPayAll(checked);
      setRefPayTypes(list);
    } else if (type === 'include') {
      setIncDepAll(checked);
      setIncDepTypes(list);
    }
  };

  const handleToggleItem = (type, item, checked) => {
    let list;
    if (type === 'patient') {
      list = checked ? [...patientPayTypes, item] : patientPayTypes.filter(x => x !== item);
      setPatientPayTypes(list);
      setPatPayAll(list.length === paymentTypes.length);
    } else if (type === 'insurance') {
      list = checked ? [...insPayTypes, item] : insPayTypes.filter(x => x !== item);
      setInsPayTypes(list);
      setInsPayAll(list.length === paymentTypes.length);
    } else if (type === 'refund') {
      list = checked ? [...refPayTypes, item] : refPayTypes.filter(x => x !== item);
      setRefPayTypes(list);
      setRefPayAll(list.length === paymentTypes.length);
    } else if (type === 'include') {
      list = checked ? [...incDepTypes, item] : incDepTypes.filter(x => x !== item);
      setIncDepTypes(list);
      setIncDepAll(list.length === paymentTypes.length);
    }
  };



  // Filtered Payments for Live Preview
  const { filteredPatientPayments, filteredInsurancePayments } = useMemo(() => {
    const startStr = startDate ? startDate.format('YYYY-MM-DD') : '';
    const endStr = endDate ? endDate.format('YYYY-MM-DD') : '';

    const pts = (unDeposited.patientPayments || []).filter((p) => {
      // Check if it's a refund
      const isSelected = p.amount < 0 
        ? isMethodSelected(p.method, refPayTypes)
        : isMethodSelected(p.method, patientPayTypes);
      
      if (!isSelected) return false;

      if (p.date && startStr && endStr) {
        const pDate = getLocalDateOnly(p.date);
        if (pDate < startStr || pDate > endStr) return false;
      }
      return true;
    });

    const inss = (unDeposited.insurancePayments || []).filter((ins) => {
      const isSelected = ins.amount < 0 
        ? isMethodSelected(ins.method, refPayTypes)
        : isMethodSelected(ins.method, insPayTypes);

      if (!isSelected) return false;

      if (ins.date && startStr && endStr) {
        const insDate = getLocalDateOnly(ins.date);
        if (insDate < startStr || insDate > endStr) return false;
      }
      return true;
    });

    return { filteredPatientPayments: pts, filteredInsurancePayments: inss };
  }, [unDeposited, patientPayTypes, insPayTypes, refPayTypes, startDate, endDate]);

  const previewPayments = useMemo(() => {
    return [...filteredPatientPayments, ...filteredInsurancePayments];
  }, [filteredPatientPayments, filteredInsurancePayments]);

  const previewTotal = useMemo(() => {
    return previewPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [previewPayments]);

  // Grouped payments for created report view
  const patientGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.patientPayments.forEach((p) => {
      const method = formatMethodLabel(p.method);
      if (!groups[method]) groups[method] = [];
      groups[method].push(p);
    });
    return groups;
  }, [createdSlipDetails]);

  const insuranceGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.insurancePayments.forEach((ins) => {
      const method = formatMethodLabel(ins.method);
      if (!groups[method]) groups[method] = [];
      groups[method].push(ins);
    });
    return groups;
  }, [createdSlipDetails]);

  const handleCreateDepositClick = async () => {
    const patientPaymentIds = filteredPatientPayments.map((p) => p.id);
    const insurancePaymentIds = filteredInsurancePayments.map((ins) => ins.id);

    if (patientPaymentIds.length === 0 && insurancePaymentIds.length === 0) {
      alert('No un-deposited payments found matching the selected filters.');
      return;
    }

    try {
      const res = await dispatch(createDepositSlip({
        bankAccountInfo: 'Main Bank Account',
        memo: depositNote || `Deposit Slip - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        patientPaymentIds,
        insurancePaymentIds,
      })).unwrap();

      // Store created slip details and matching payments for preview
      setCreatedSlipDetails({
        slip: res,
        patientPayments: [...filteredPatientPayments],
        insurancePayments: [...filteredInsurancePayments],
      });

      alert('Deposit slip created successfully!');
      dispatch(fetchUnDepositedPayments());
    } catch (err) {
      alert(err || 'Failed to create deposit slip.');
    }
  };

  const handleClear = () => {
    setCreatedSlipDetails(null);
    setDepositNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }

    // Automatically prepend the filter type to the name to organize it in Saved Reports
    let finalName = templateName.trim();
    if (filterMode === 'daily' && !finalName.toLowerCase().includes('daily')) {
      finalName = `Daily ${finalName}`;
    } else if (filterMode === 'weekly' && !finalName.toLowerCase().includes('weekly')) {
      finalName = `Weekly ${finalName}`;
    } else if (filterMode === 'monthly' && !finalName.toLowerCase().includes('monthly')) {
      finalName = `Monthly ${finalName}`;
    } else if (filterMode === 'range' && !finalName.toLowerCase().includes('custom')) {
      // Just save it as is or add 'Custom'
    }

    try {
      setSavingTemplate(true);
      await reportingService.saveReport({
        name: finalName,
        kind: 'Financial',
        filters: [
          { type: 'mode', value: filterMode },
          { type: 'patientPayTypes', value: patientPayTypes },
          { type: 'insPayTypes', value: insPayTypes },
          { type: 'refPayTypes', value: refPayTypes },
          { type: 'incDepTypes', value: incDepTypes },
        ],
        columns: []
      });
      alert('Template saved successfully! It will now appear in Saved Reports.');
      setShowTemplateForm(false);
      setTemplateName('');
    } catch (err) {
      alert(err || 'Failed to save template.');
    } finally {
      setSavingTemplate(false);
    }
  };

  const renderCheckboxList = (title, items, type, selectedList, isAllChecked) => (
    <Box sx={{ mb: 2 }}>
      <FormControlLabel
        control={
          <Checkbox 
            size="small" 
            checked={isAllChecked} 
            onChange={(e) => handleToggleAll(type, e.target.checked)} 
          />
        }
        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>}
      />
      <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
        {items.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox 
                size="small" 
                checked={selectedList.includes(item)} 
                onChange={(e) => handleToggleItem(type, item, e.target.checked)} 
              />
            }
            label={<Typography variant="caption">{item}</Typography>}
            sx={{ my: -0.5 }}
          />
        ))}
      </Box>
    </Box>
  );

  const displaySlips = slips && slips.length > 0 ? slips : [
    { date: '02/01/2022', amount: '29,243.17', memo: 'Mock: Deposit slip 1' },
    { date: '03/06/2022', amount: '11,009.60', memo: 'Mock: Deposit slip 2' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {templateTitle && (
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 700, color: '#1e293b' }}>
          {templateTitle}
        </Typography>
      )}
      <Typography variant="h6" className="no-print" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Deposit Slips:
      </Typography>

      <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Left Section - Controls */}
        <Grid item xs={12} md={8} className="no-print">
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', height: '100%' }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: '#2563eb' }}>Create new deposit slip:</Typography>
          
          <RadioGroup row value={filterMode} onChange={handleFilterModeChange} sx={{ mb: 2 }}>
            <FormControlLabel value="daily" control={<Radio size="small" />} label={<Typography variant="caption">Daily</Typography>} />
            <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="caption">Range</Typography>} />
            <FormControlLabel value="weekly" control={<Radio size="small" />} label={<Typography variant="caption">Weekly</Typography>} />
            <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="caption">Monthly</Typography>} />
          </RadioGroup>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#1e293b' }}>
              Transactions done from: 
              <DatePicker
                value={startDate}
                onChange={(v) => setStartDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 1400 } },
                  textField: { 
                    size: 'small', 
                    sx: { width: '140px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px', height: '36px', backgroundColor: '#fff' }, '& fieldset': { borderColor: '#e2e8f0' } } 
                  }
                }}
              />
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#1e293b' }}>
              to: 
              <DatePicker
                value={endDate}
                onChange={(v) => setEndDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 1400 } },
                  textField: { 
                    size: 'small', 
                    sx: { width: '140px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px', height: '36px', backgroundColor: '#fff' }, '& fieldset': { borderColor: '#e2e8f0' } } 
                  }
                }}
              />
            </Typography>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Group by provider</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Include payment types</Typography>
            <FormControlLabel
              control={<Checkbox size="small" defaultChecked />}
              label={<Typography variant="caption">Include Archived Payment Types</Typography>}
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              {renderCheckboxList('Patient payment types', paymentTypes, 'patient', patientPayTypes, patPayAll)}
            </Grid>
            <Grid item xs={12} sm={4}>
              {renderCheckboxList('Insurance payment types', paymentTypes, 'insurance', insPayTypes, insPayAll)}
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={refPayAll} 
                    onChange={(e) => handleToggleAll('refund', e.target.checked)} 
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Include refund payment types</Typography>}
              />
              <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
                {paymentTypes.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox 
                        size="small" 
                        checked={refPayTypes.includes(item)} 
                        onChange={(e) => handleToggleItem('refund', item, e.target.checked)} 
                      />
                    }
                    label={<Typography variant="caption">{item}</Typography>}
                    sx={{ my: -0.5 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            {renderCheckboxList('Include Deposits', paymentTypes, 'include', incDepTypes, incDepAll)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
            {!showTemplateForm && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setShowTemplateForm(true)}
                sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#1e293b', fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}
              >
                Create Template
              </Button>
            )}
            
            {showTemplateForm && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Enter Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  sx={{ width: 200, '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem', borderRadius: '8px' }, '& fieldset': { borderColor: '#e2e8f0' } }}
                  autoFocus
                />
                <Button 
                  variant="contained" 
                  size="small"
                  disabled={savingTemplate}
                  onClick={handleSaveTemplate}
                  sx={{ textTransform: 'none', bgcolor: '#3b82f6', borderRadius: '8px', boxShadow: 'none', height: 36, '&:hover': { bgcolor: '#2563eb', boxShadow: 'none' } }}
                >
                  {savingTemplate ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    setShowTemplateForm(false);
                    setTemplateName('');
                  }}
                  sx={{ textTransform: 'none', borderRadius: '8px', height: 36, borderColor: '#e2e8f0', color: '#64748b', '&:hover': { bgcolor: '#f8fafc' } }}
                >
                  Cancel
                </Button>
              </Box>
            )}

            {!showTemplateForm && (
              <Button 
                variant="contained" 
                size="small"
                onClick={handleCreateDepositClick}
                disabled={loading}
                sx={{ textTransform: 'none', bgcolor: '#2563eb', borderRadius: '8px', boxShadow: 'none', px: 3, '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }}
              >
                {loading ? 'Generating...' : 'Generate Deposit Slip'}
              </Button>
            )}
          </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', height: '100%' }}>
          {!createdSlipDetails ? (
            <Box className="no-print">
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#2563eb' }}>
                Deposit slip preview:
              </Typography>
              
              {previewPayments.length === 0 ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>No payments match filters.</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Adjust the date range or payment type filters to see pending deposits.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: '12px', borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL DEPOSIT AMOUNT</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#00c853', fontSize: '2rem', lineHeight: 1 }}>
                          ${previewTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL ITEM COUNT</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '2rem', color: '#000000', lineHeight: 1 }}>
                            {previewPayments.length}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                            ({filteredPatientPayments.length} pt, {filteredInsurancePayments.length} ins)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>Included Items:</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button startIcon={<DownloadIcon fontSize="small" />} variant="outlined" size="small" sx={{ textTransform: 'none', color: '#000000', borderColor: '#cbd5e1', borderRadius: '6px', px: 2, fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}>
                        CSV
                      </Button>
                      <Button startIcon={<PrintIcon fontSize="small" />} variant="outlined" size="small" sx={{ textTransform: 'none', color: '#000000', borderColor: '#cbd5e1', borderRadius: '6px', px: 2, fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}>
                        Print
                      </Button>
                    </Box>
                  </Box>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #cbd5e1', borderRadius: '12px', maxHeight: 350, overflowY: 'auto' }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ '& th': { backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: 500, py: 2, borderBottom: '1px solid #cbd5e1' } }}>
                          <TableCell>Patient/Carrier</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewPayments.map((p, idx) => (
                          <TableRow key={idx} sx={{ '& td': { fontSize: '0.85rem', py: 2, verticalAlign: 'middle', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }, backgroundColor: '#ffffff' }}>
                            <TableCell>{p.patientName || p.carrierName || 'Unknown Carrier'}</TableCell>
                            <TableCell>{formatMethodLabel(p.method)}</TableCell>
                            <TableCell>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>${p.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          ) : (
            /* Created Deposit Slip Preview */
            <Box sx={{ fontFamily: 'sans-serif', color: '#333' }}>
              {/* Slip Header */}
              <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3b82f6', mb: 2 }}>
                  Deposit slip:
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                      Total Amount: ${createdSlipDetails.slip.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Bank account number:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Bank account info: {createdSlipDetails.slip.bankAccountInfo || ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Patient Payments Grouped Section */}
              {createdSlipDetails.patientPayments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', px: 2, py: 1, fontWeight: 700, mb: 2, width: 'fit-content' }}>
                    Patient Payment:
                  </Typography>

                  {Object.entries(patientGroups).map(([method, items]) => {
                    const groupTotal = items.reduce((sum, item) => sum + item.amount, 0);
                    return (
                      <Box key={method} sx={{ mb: 3, pl: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#64748b' }}>
                          {method}
                        </Typography>
                        <TableContainer sx={{ overflowX: 'auto', mb: 1, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                          <Table size="small">
                            <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, py: 1 } }}>
                              <TableCell>Date</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Pay Type</TableCell>
                              <TableCell>Check Number</TableCell>
                              <TableCell>Pay Amount</TableCell>
                              <TableCell>Description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {items.map((p, idx) => (
                              <TableRow key={p.id} sx={{ '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' }, backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                                <TableCell>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                                <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{p.patientName}</TableCell>
                                <TableCell>{p.method}</TableCell>
                                <TableCell>{p.checkNum || ''}</TableCell>
                                <TableCell>${p.amount.toFixed(2)}</TableCell>
                                <TableCell>{p.notes || ''}</TableCell>
                              </TableRow>
                            ))}
                            {/* Group Total */}
                            <TableRow sx={{ backgroundColor: '#ffffff' }}>
                              <TableCell colSpan={4} sx={{ borderBottom: 'none' }} />
                              <TableCell colSpan={2} sx={{ pt: 1.5, pb: 1.5, borderTop: '2px solid #e2e8f0', borderBottom: 'none' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textAlign: 'right', color: '#1e293b' }}>
                                  Total: ${groupTotal.toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        </TableContainer>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Insurance Payments Grouped Section */}
              {createdSlipDetails.insurancePayments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', px: 2, py: 1, fontWeight: 700, mb: 2, width: 'fit-content' }}>
                    Insurance Payment:
                  </Typography>

                  {Object.entries(insuranceGroups).map(([method, items]) => {
                    const groupTotal = items.reduce((sum, item) => sum + item.amount, 0);
                    return (
                      <Box key={method} sx={{ mb: 3, pl: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#64748b' }}>
                          {method}
                        </Typography>
                        <TableContainer sx={{ overflowX: 'auto', mb: 1, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                          <Table size="small">
                            <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, py: 1 } }}>
                              <TableCell>Date</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Ins. Name</TableCell>
                              <TableCell>Pay Type</TableCell>
                              <TableCell>Check Number</TableCell>
                              <TableCell>Pay Amount</TableCell>
                              <TableCell>Description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {items.map((ins, idx) => (
                              <TableRow key={ins.id} sx={{ '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' }, backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                                <TableCell>{ins.date ? new Date(ins.date).toLocaleDateString() : '-'}</TableCell>
                                <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{ins.patientName || 'Unknown'}</TableCell>
                                <TableCell>{ins.carrierName || 'Unknown'}</TableCell>
                                <TableCell>{ins.method}</TableCell>
                                <TableCell>{ins.checkNum || ''}</TableCell>
                                <TableCell>${ins.amount.toFixed(2)}</TableCell>
                                <TableCell>{ins.notes || ''}</TableCell>
                              </TableRow>
                            ))}
                            {/* Group Total */}
                            <TableRow sx={{ backgroundColor: '#ffffff' }}>
                              <TableCell colSpan={5} sx={{ borderBottom: 'none' }} />
                              <TableCell colSpan={2} sx={{ pt: 1.5, pb: 1.5, borderTop: '2px solid #e2e8f0', borderBottom: 'none' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textAlign: 'right', color: '#1e293b' }}>
                                  Total: ${groupTotal.toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        </TableContainer>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Deposit Note Area */}
              <Box className="no-print" sx={{ mt: 3, mb: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1, color: '#555', textDecoration: 'underline' }}>
                  Deposit note: (would appear on the deposit slip)
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="Enter note details here..."
                  sx={{ bgcolor: 'white' }}
                />
              </Box>

              {/* Print and Clear Action Buttons */}
              <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handlePrint}
                  sx={{ textTransform: 'none', bgcolor: '#c49b63', '&:hover': { bgcolor: '#b28851' } }}
                >
                  Print
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleClear}
                  sx={{ textTransform: 'none', bgcolor: '#9e9e9e', '&:hover': { bgcolor: '#757575' } }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} className="no-print" />

      {/* Bottom Section - Previous Slips */}
      <Box className="no-print">
        <Typography 
          variant="body2" 
          onClick={() => setIsSlipsExpanded(!isSlipsExpanded)}
          sx={{ mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <Box component="span" sx={{ mr: 1, display: 'inline-block', transform: isSlipsExpanded ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>⌄</Box> Previous Deposit Slips:
        </Typography>
        <Collapse in={isSlipsExpanded}>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Date of Slip</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displaySlips.map((row, idx) => {
                  const displayDate = row.date && !isNaN(Date.parse(row.date)) 
                    ? new Date(row.date).toLocaleDateString() 
                    : row.date || '-';
                  const displayAmount = typeof row.amount === 'number' 
                    ? `$${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                    : row.amount ? `$${row.amount}` : '$0.00';
                  return (
                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{displayDate}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{displayAmount}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.memo || row.bankAccountInfo || ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>

      {/* Global CSS to handle printing cleanly */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #root, main, .MuiGrid-container {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          /* Only display the created deposit slip report during printing */
          div[class*="MuiGrid-item"]:last-child, 
          div[class*="MuiGrid-item"]:last-child * {
            visibility: visible;
          }
          div[class*="MuiGrid-item"]:last-child {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Box>
  );
};

export default DepositSlips;
