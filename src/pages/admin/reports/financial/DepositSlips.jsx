import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const DepositSlips = () => {
  const dispatch = useDispatch();
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

  const isMethodSelected = (method, selectedTypes) => {
    if (!method) return false;
    const lowerMethod = method.toLowerCase().trim();
    // Allow matching both exact string (like 'Check') and partial check types
    return selectedTypes.some(t => {
      const lowerT = t.toLowerCase().trim();
      return lowerT === lowerMethod || 
             (lowerT === 'check' && lowerMethod === 'patient check') ||
             (lowerT === 'check' && lowerMethod === 'insurance check') ||
             (lowerT === 'patient check' && lowerMethod === 'check') ||
             (lowerT === 'insurance check' && lowerMethod === 'check');
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
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Created Slip Report States
  const [createdSlipDetails, setCreatedSlipDetails] = useState(null);
  const [depositNote, setDepositNote] = useState('');

  useEffect(() => {
    dispatch(fetchDepositSlips({ page: 1, limit: 50 }));
    dispatch(fetchUnDepositedPayments());
  }, [dispatch]);

  // Automatically initialize start and end dates based on un-deposited payments available in the DB
  useEffect(() => {
    const pts = unDeposited.patientPayments || [];
    const inss = unDeposited.insurancePayments || [];
    if (pts.length > 0 || inss.length > 0) {
      const allDates = [...pts, ...inss]
        .map((p) => p.date)
        .filter(Boolean)
        .map((d) => new Date(d).getTime());

      if (allDates.length > 0) {
        const minDateStr = getLocalDateOnly(Math.min(...allDates));
        const maxDateStr = getLocalDateOnly(Math.max(...allDates));
        setStartDate(minDateStr);
        setEndDate(maxDateStr);
        setFilterMode('range');
      }
    }
  }, [unDeposited]);

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    setFilterMode(newMode);
    const today = new Date();
    
    if (newMode === 'daily') {
      const todayStr = today.toISOString().split('T')[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (newMode === 'weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      setStartDate(startOfWeek.toISOString().split('T')[0]);
      setEndDate(endOfWeek.toISOString().split('T')[0]);
    } else if (newMode === 'monthly') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(startOfMonth.toISOString().split('T')[0]);
      setEndDate(endOfMonth.toISOString().split('T')[0]);
    }
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
    const pts = (unDeposited.patientPayments || []).filter((p) => {
      // Check if it's a refund
      const isSelected = p.amount < 0 
        ? isMethodSelected(p.method, refPayTypes)
        : isMethodSelected(p.method, patientPayTypes);
      
      if (!isSelected) return false;

      if (p.date) {
        const pDate = getLocalDateOnly(p.date);
        if (pDate < startDate || pDate > endDate) return false;
      }
      return true;
    });

    const inss = (unDeposited.insurancePayments || []).filter((ins) => {
      const isSelected = ins.amount < 0 
        ? isMethodSelected(ins.method, refPayTypes)
        : isMethodSelected(ins.method, insPayTypes);

      if (!isSelected) return false;

      if (ins.date) {
        const insDate = getLocalDateOnly(ins.date);
        if (insDate < startDate || insDate > endDate) return false;
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
      const method = p.method || 'Check';
      if (!groups[method]) groups[method] = [];
      groups[method].push(p);
    });
    return groups;
  }, [createdSlipDetails]);

  const insuranceGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.insurancePayments.forEach((ins) => {
      const method = ins.method || 'Check';
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
      <Typography variant="h6" className="no-print" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Deposit Slips:
      </Typography>

      <Grid container spacing={4}>
        {/* Left Section - Controls */}
        <Grid item xs={6} className="no-print" sx={{ borderRight: '1px solid #e0e0e0', pr: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Create new deposit slip:</Typography>
          
          <RadioGroup row value={filterMode} onChange={handleFilterModeChange} sx={{ mb: 2 }}>
            <FormControlLabel value="daily" control={<Radio size="small" />} label={<Typography variant="caption">Daily</Typography>} />
            <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="caption">Range</Typography>} />
            <FormControlLabel value="weekly" control={<Radio size="small" />} label={<Typography variant="caption">Weekly</Typography>} />
            <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="caption">Monthly</Typography>} />
          </RadioGroup>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Transactions done from: 
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', fontFamily: 'inherit' }}
              />
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              to: 
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', fontFamily: 'inherit' }}
              />
            </Typography>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="caption">Group by provider</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Include payment types</Typography>
            <FormControlLabel
              control={<Checkbox size="small" defaultChecked />}
              label={<Typography variant="caption">Include Archived Payment Types</Typography>}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              {renderCheckboxList('Patient payment types', paymentTypes, 'patient', patientPayTypes, patPayAll)}
            </Grid>
            <Grid item xs={4}>
              {renderCheckboxList('Insurance payment types', paymentTypes, 'insurance', insPayTypes, insPayAll)}
            </Grid>
            <Grid item xs={4}>
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleCreateDepositClick}
              disabled={loading}
              sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}
            >
              {loading ? 'Creating...' : 'Create Deposit'}
            </Button>
            <Button variant="contained" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Grid>

        {/* Right Section - Dynamic Preview / Created Report */}
        <Grid item xs={6}>
          {!createdSlipDetails ? (
            <Box className="no-print">
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
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
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#fafafa' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Total Deposit Amount</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                          ${previewTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Total Item Count</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {previewPayments.length} ({filteredPatientPayments.length} pt, {filteredInsurancePayments.length} ins)
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>Included Items:</Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', maxHeight: 350, overflowY: 'auto' }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700 }}>Patient/Carrier</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700 }}>Method</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700 }}>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewPayments.map((p, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontSize: '0.7rem', py: 0.5 }}>{p.patientName || p.carrierName || 'Unknown'}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', py: 0.5 }}>{p.method}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', py: 0.5 }}>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', py: 0.5 }}>${p.amount.toFixed(2)}</TableCell>
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
              <Box sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2', textDecoration: 'underline', mb: 2 }}>
                  Deposit slip:
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                      Total Amount: ${createdSlipDetails.slip.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      Bank account number:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      Bank account info: {createdSlipDetails.slip.bankAccountInfo || ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Patient Payments Grouped Section */}
              {createdSlipDetails.patientPayments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ bgcolor: '#1976d2', color: 'white', px: 1, py: 0.5, fontWeight: 700, mb: 2, width: 'fit-content' }}>
                    Patient Payment:
                  </Typography>

                  {Object.entries(patientGroups).map(([method, items]) => {
                    const groupTotal = items.reduce((sum, item) => sum + item.amount, 0);
                    return (
                      <Box key={method} sx={{ mb: 3, pl: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#555' }}>
                          {method}
                        </Typography>
                        <Table size="small" sx={{ mb: 1 }}>
                          <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: '1px solid #ddd', fontSize: '0.75rem', color: '#777', fontWeight: 600, py: 0.5 } }}>
                              <TableCell sx={{ pl: 0 }}>date</TableCell>
                              <TableCell>name</TableCell>
                              <TableCell>pay type</TableCell>
                              <TableCell>check number</TableCell>
                              <TableCell>pay amount</TableCell>
                              <TableCell sx={{ pr: 0 }}>description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ '& td': { borderBottom: 'none', fontSize: '0.75rem', py: 0.5 } }}>
                            {items.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell sx={{ pl: 0 }}>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                                <TableCell sx={{ color: '#1976d2' }}>{p.patientName}</TableCell>
                                <TableCell>{p.method}</TableCell>
                                <TableCell>{p.checkNum || ''}</TableCell>
                                <TableCell>${p.amount.toFixed(2)}</TableCell>
                                <TableCell sx={{ pr: 0 }}>{p.notes || ''}</TableCell>
                              </TableRow>
                            ))}
                            {/* Group Total */}
                            <TableRow>
                              <TableCell colSpan={4} />
                              <TableCell colSpan={2} sx={{ pr: 0, pt: 1, borderTop: '1px solid #eee' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textAlign: 'right' }}>
                                  Total: ${groupTotal.toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Insurance Payments Grouped Section */}
              {createdSlipDetails.insurancePayments.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ bgcolor: '#1976d2', color: 'white', px: 1, py: 0.5, fontWeight: 700, mb: 2, width: 'fit-content' }}>
                    Insurance Payment:
                  </Typography>

                  {Object.entries(insuranceGroups).map(([method, items]) => {
                    const groupTotal = items.reduce((sum, item) => sum + item.amount, 0);
                    return (
                      <Box key={method} sx={{ mb: 3, pl: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#555' }}>
                          {method}
                        </Typography>
                        <Table size="small" sx={{ mb: 1 }}>
                          <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: '1px solid #ddd', fontSize: '0.75rem', color: '#777', fontWeight: 600, py: 0.5 } }}>
                              <TableCell sx={{ pl: 0 }}>date</TableCell>
                              <TableCell>name</TableCell>
                              <TableCell>ins. name</TableCell>
                              <TableCell>pay type</TableCell>
                              <TableCell>check number</TableCell>
                              <TableCell>pay amount</TableCell>
                              <TableCell sx={{ pr: 0 }}>description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ '& td': { borderBottom: 'none', fontSize: '0.75rem', py: 0.5 } }}>
                            {items.map((ins) => (
                              <TableRow key={ins.id}>
                                <TableCell sx={{ pl: 0 }}>{ins.date ? new Date(ins.date).toLocaleDateString() : '-'}</TableCell>
                                <TableCell sx={{ color: '#1976d2' }}>{ins.patientName || 'Unknown'}</TableCell>
                                <TableCell>{ins.carrierName || 'Unknown'}</TableCell>
                                <TableCell>{ins.method}</TableCell>
                                <TableCell>{ins.checkNum || ''}</TableCell>
                                <TableCell>${ins.amount.toFixed(2)}</TableCell>
                                <TableCell sx={{ pr: 0 }}>{ins.notes || ''}</TableCell>
                              </TableRow>
                            ))}
                            {/* Group Total */}
                            <TableRow>
                              <TableCell colSpan={5} />
                              <TableCell colSpan={2} sx={{ pr: 0, pt: 1, borderTop: '1px solid #eee' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textAlign: 'right' }}>
                                  Total: ${groupTotal.toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
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
