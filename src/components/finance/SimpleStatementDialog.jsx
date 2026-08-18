import React, { useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, Typography, Button, Checkbox, FormControlLabel, TextField, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Divider, InputBase,
  DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CloseIcon from '@mui/icons-material/Close';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import StatementFooter from './StatementFooter';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';
import { usePatient } from '../../hooks/redux';
import { selectLedgerItemsForPatient } from '../../store/slices/billingSlice';

const SimpleStatementDialog = ({ onClose, printItem }) => {
  const contentRef = useRef(null);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState('');
  const [filterStartDate, setFilterStartDate] = useState(dayjs().subtract(30, 'day'));
  const [showOpenInvoicesOnly, setShowOpenInvoicesOnly] = useState(false);
  
  const { currentPatient } = usePatient();
  const patientId = currentPatient?._id || currentPatient?.id;
  const patientName = currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : 'Unknown Patient';
  
  const ledgerItems = useSelector(selectLedgerItemsForPatient(patientId)) || [];

  const isPayment = printItem?.isPayment;
  const isAdjustment = printItem?.isAdjustment;
  const isInvoice = !isPayment && !isAdjustment && !printItem?.isClaim;

  const statementDate = dayjs().format("MM/DD/YYYY");

  let transactions = [];
  let totalCharges = 0;
  let totalPatientPayments = 0;
  let totalInsPayments = 0;
  let totalAdjustments = 0;
  let insEstimate = 0;
  let remainingIns = 0;
  
  if (printItem) {
    const rawProcedures = printItem.details 
      ? printItem.details.flatMap(d => d.procedures || []) 
      : (printItem.procedures || []);

    const allProcedures = [];
    const seenProcIds = new Set();
    rawProcedures.forEach(p => {
      const procId = p.id || p._id || p.ProcNum || (p.code + p.charge);
      if (!seenProcIds.has(procId)) {
        seenProcIds.add(procId);
        allProcedures.push(p);
      }
    });

    if (isInvoice && allProcedures.length > 0) {
      transactions = allProcedures.map(proc => ({
        date: dayjs(proc.date || printItem.date).format("MM/DD/YYYY"),
        desc: `Invoice #${printItem.id || printItem.invoiceId || ''}`,
        sub: `${proc.code || ''} ${proc.description || ''}`,
        prov: proc.provider || 'N/A',
        amt: `$${Number(proc.total || proc.totalPrice || proc.charge || proc.unitPrice || 0).toFixed(2)}`,
        ins: `$${Number(proc.insPortion || 0).toFixed(2)}`
      }));
      totalCharges = allProcedures.reduce((acc, p) => acc + Number(p.total || p.totalPrice || p.charge || p.unitPrice || 0), 0);
      insEstimate = allProcedures.reduce((acc, p) => acc + Number(p.insPortion || 0), 0);
      
      const parseAmt = (val) => Number((String(val || '$0')).replace(/[^0-9.-]+/g, ''));
      totalPatientPayments = parseAmt(printItem.summary?.ptPaid);
      totalInsPayments = parseAmt(printItem.summary?.insPaid);
      totalAdjustments = parseAmt(printItem.summary?.appliedWo) + parseAmt(printItem.summary?.insWo);
    } else {
      transactions = [{
        date: dayjs(printItem.date).format("MM/DD/YYYY"),
        desc: printItem.title || printItem.description || 'Transaction',
        sub: printItem.method || '',
        prov: printItem.initials || 'N/A',
        amt: `$${Number(printItem.amount || 0).toFixed(2)}`,
        ins: '$0.00'
      }];
      if (isPayment) totalPatientPayments = Number(printItem.amount || 0);
      if (isAdjustment) totalAdjustments = Number(printItem.amount || 0);
    }
  } else {
    // Populate from ledgerItems when printItem is absent
    const filteredLedger = ledgerItems.filter(item => {
      const itemDate = dayjs(item.rawDate || item.date);
      if (filterStartDate && itemDate.isBefore(filterStartDate, 'day')) return false;
      if (showOpenInvoicesOnly && item.method === 'Invoice') {
         const invBal = Number((item.summary?.invBal || '$0').replace(/[^0-9.-]+/g, ''));
         return invBal > 0;
      }
      return true;
    });

    const parseAmt = (val) => Number((String(val || '$0')).replace(/[^0-9.-]+/g, ''));

    filteredLedger.forEach(item => {
      if (item.method === 'Invoice' && !item.isVoided) {
        const procDetail = (item.details || []).find(d => d.procedures);
        const procedures = procDetail ? procDetail.procedures : [];
        
        if (procedures.length > 0) {
          procedures.forEach(proc => {
             const charge = Number(proc.total || proc.totalPrice || proc.charge || proc.fee || proc.unitPrice || 0);
             const insPortion = Number(proc.insPortion || 0);
             transactions.push({
               date: dayjs(proc.date || item.rawDate || item.date).format("MM/DD/YYYY"),
               desc: `Invoice #${item.id || item.invoiceNumber || ''}`,
               sub: `${proc.code || ''} ${proc.description || ''}`,
               prov: proc.provider || 'N/A',
               amt: `$${charge.toFixed(2)}`,
               ins: `$${insPortion.toFixed(2)}`
             });
             totalCharges += charge;
             insEstimate += insPortion;
          });
        } else {
           const amt = parseAmt(item.amount);
           transactions.push({
             date: dayjs(item.rawDate || item.date).format("MM/DD/YYYY"),
             desc: `Invoice #${item.id || item.invoiceNumber || ''}`,
             sub: item.title || 'Invoice',
             prov: item.initials || 'N/A',
             amt: `$${amt.toFixed(2)}`,
             ins: `$0.00`
           });
           totalCharges += amt;
        }

        // Also capture payments applied directly to this invoice via details array
        (item.details || []).forEach(d => {
          if (d.isPayment && !d.isVoided) {
             const pAmt = parseAmt(d.amount);
             transactions.push({
               date: dayjs(item.rawDate || item.date).format("MM/DD/YYYY"),
               desc: d.title || 'Payment',
               sub: '',
               prov: 'N/A',
               amt: `-$${Math.abs(pAmt).toFixed(2)}`,
               ins: '$0.00'
             });
             if (d.title && d.title.toLowerCase().includes('insurance')) {
                totalInsPayments += pAmt;
             } else if (d.title && d.title.toLowerCase().includes('adjustment')) {
                totalAdjustments += pAmt;
             } else {
                totalPatientPayments += pAmt;
             }
          }
        });
      } else if (item.method === 'Payment' && !item.isVoided) {
         const amt = parseAmt(item.amount);
         transactions.push({
           date: dayjs(item.rawDate || item.date).format("MM/DD/YYYY"),
           desc: item.description || item.title || 'Payment',
           sub: item.method || '',
           prov: item.initials || 'N/A',
           amt: `-$${Math.abs(amt).toFixed(2)}`,
           ins: '$0.00'
         });
         
         if (item.isInsurance || (item.details && item.details[0]?.title.toLowerCase().includes('insurance'))) {
           totalInsPayments += amt;
         } else {
           totalPatientPayments += amt;
         }
      } else if (item.method === 'Adjustment' && !item.isVoided) {
         const amt = parseAmt(item.amount);
         transactions.push({
           date: dayjs(item.rawDate || item.date).format("MM/DD/YYYY"),
           desc: item.description || item.title || 'Adjustment',
           sub: item.sub || '',
           prov: item.initials || 'N/A',
           amt: `-$${Math.abs(amt).toFixed(2)}`,
           ins: '$0.00'
         });
         totalAdjustments += amt;
      }
    });
    
    // Sort transactions by date descending
    transactions.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }

  let yourPortion = 0;
  if (printItem && isInvoice && printItem.summary) {
    const parseAmt = (val) => Number((String(val || '$0')).replace(/[^0-9.-]+/g, ''));
    yourPortion = parseAmt(printItem.summary.ptBal);
    remainingIns = parseAmt(printItem.summary.insBal);
  } else {
    yourPortion = Math.max(0, totalCharges - totalInsPayments - totalPatientPayments - totalAdjustments);
    remainingIns = Math.max(0, insEstimate - totalInsPayments);
  }


  
  const primaryBlue = COLORS.ACCENT;
  const lightBlue = COLORS.BORDER;
  const textDarkBlue = COLORS.TEXT_PRIMARY;
  const tanButton = COLORS.ACCENT;
  const tableHeaderBg = COLORS.SURFACE_TINT;

  const LabelInput = ({ label, defaultValue = "" }) => (
    <TextField
      variant="standard"
      label={label}
      fullWidth
      size="small"
      defaultValue={defaultValue}
      sx={{ 
        mb: 1.5,
        '& .MuiInputBase-root': { fontSize: '0.8rem' },
        '& .MuiInputLabel-root': { fontSize: '0.75rem', fontStyle: 'italic' }
      }}
    />
  );

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const content = contentRef.current;
    if (content) {
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Patient Account Statement</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                margin: 0; 
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @media print { 
                body { margin: 0; padding: 0; }
                @page { margin: 0.5cm; }
              }
              ${styles}
            </style>
          </head>
          <body>
            ${content.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <PrintOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Patient Account Statement
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Scrollable container for the whole dialog to capture in print */}
      <Box ref={contentRef} sx={{ p: '25px' }}>
        {/* Filters */}
        {!printItem && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={showOpenInvoicesOnly} onChange={(e) => setShowOpenInvoicesOnly(e.target.checked)} />}
              label={<Typography sx={{ fontSize: '13px' }}>Only Open Invoices</Typography>}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Header Type</Typography>
              <Select 
                MenuProps={{ 
                  sx: { zIndex: 999999 },
                  anchorOrigin: { vertical: "bottom", horizontal: "left" },
                  transformOrigin: { vertical: "top", horizontal: "left" }
                }} 
                size="small" 
                defaultValue="Detachable Slip" 
                sx={{ 
                  height: "36px",
                  width: "180px",
                  bgcolor: COLORS.SURFACE_TINT,
                  borderRadius: radius.sm,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: 500,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.BORDER,
                  }
                }}
              >
                <MenuItem value="Detachable Slip" sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>Detachable Slip</MenuItem>
              </Select>
            </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Start Date</Typography>
              <DatePicker
                value={filterStartDate}
                onChange={(newValue) => setFilterStartDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 999999 } },
                  textField: { 
                    size: 'small', 
                    sx: { 
                      width: '180px', 
                      '& .MuiInputBase-root': { 
                        fontSize: '13px', 
                        borderRadius: '4px', 
                        height: '36px', 
                        bgcolor: COLORS.SURFACE_TINT, 
                        color: COLORS.TEXT_PRIMARY 
                      }, 
                      '& .MuiInputBase-input': { padding: '4px 10px' }, 
                      '& fieldset': { borderColor: COLORS.BORDER } 
                    } 
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>End Date</Typography>
              <DatePicker
                defaultValue={dayjs("2026-05-06")}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 999999 } },
                  textField: { 
                    size: 'small', 
                    sx: { 
                      width: '180px', 
                      '& .MuiInputBase-root': { 
                        fontSize: '13px', 
                        borderRadius: '4px', 
                        height: '36px', 
                        bgcolor: COLORS.SURFACE_TINT, 
                        color: COLORS.TEXT_PRIMARY 
                      }, 
                      '& .MuiInputBase-input': { padding: '4px 10px' }, 
                      '& fieldset': { borderColor: COLORS.BORDER } 
                    } 
                  }
                }}
              />
            </Box>
              <Button variant="contained" sx={{ bgcolor: tanButton, textTransform: 'none', fontSize: '13px', ml: 'auto', boxShadow: 'none' }}>Load Statement</Button>
            </Box>
          </Box>
        )}

        {!printItem && <Divider sx={{ mb: 2 }} />}

        {/* Content Area - No longer fixed scroll */}
        <Box sx={{ pr: 1 }}>
          {/* Practice and CC Section (Matching SimpleStatement structure) */}
          <Grid container spacing={16} alignItems="flex-start">
            <Grid item xs={6}>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 8 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4, color: '#333', fontSize: '1rem' }}>
                    <strong>The Dental Studio</strong><br />
                    2211 Dental Rd Suite 300<br />
                    Flower Mound, TX 75028<br />
                    (555) 555-5555
                  </Typography>
                </Box>
                <TextField
                  variant="standard"
                  value={patientName}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  sx={{ '& .MuiInputBase-root': { fontSize: '1rem' } }}
                />
              </Box>
            </Grid>
 
            <Grid item xs={6} sx={{ pl: 10 }}>
              <Box sx={{ mt: 2 }}>
                <LabelInput label="card number" />
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <LabelInput label="expiry date" />
                  <LabelInput label="security code" />
                </Box>
                <LabelInput label="full name (as appears on card)" />
                <LabelInput label="signature" />

                {/* Estimates Table */}
                <Box sx={{ mt: 2, border: `1px solid ${lightBlue}`, borderRadius: '6px', overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: lightBlue, display: 'flex' }}>
                    <Box sx={{ flex: 1, p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#2c3e50' }}>Insurance Estimate:</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2c3e50' }}>${insEstimate.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#2c3e50' }}>Your Portion:</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2c3e50' }}>${yourPortion.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#1a237e', mr: 1 }}>
                      Enclosed amount:
                    </Typography>
                    <InputBase
                      sx={{ fontSize: '0.875rem', color: '#1a237e', flexGrow: 1 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Dotted Line with Scissor */}
          <Box sx={{ position: 'relative', textAlign: 'center', mb: 4, mt: 4 }}>
            <Box sx={{ borderTop: '1px dashed #ccc', width: '100%', position: 'absolute', top: '50%' }} />
            <ContentCutIcon sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#ccc', fontSize: '16px' }} />
            <Typography sx={{ position: 'relative', display: 'inline-block', bgcolor: 'white', px: 2, fontSize: '10px', color: '#999' }}>
              Please detach and return this part of the statement with your payment to ensure proper processing
            </Typography>
            <Typography sx={{ display: 'block', fontSize: '10px', color: '#999', mt: 1 }}>
              Please keep this part of the statement for your records
            </Typography>
          </Box>

          {/* Statement Header (Matching StatementInfo structure) */}
          <Grid container spacing={6} sx={{ mb: 4 }} alignItems="flex-start">
            <Grid item xs={6}>
              <Typography variant="h5" sx={{ fontWeight: 400, letterSpacing: '2px', color: '#333', fontSize: '1.4rem' }}>
                THE DENTAL STUDIO
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: '#666' }}>
                2211 Dental Rd Suite 300 Flower Mound, TX 75028
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ border: `1px solid ${lightBlue}`, borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', borderBottom: `1px solid ${lightBlue}` }}>
                  <Typography sx={{ width: '150px', p: 1, pl: 1.5, fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>
                    Patient Name
                  </Typography>
                  <InputBase
                    value={patientName}
                    readOnly
                    sx={{ 
                      flex: 1, 
                      p: 1, 
                      fontSize: '0.8rem', 
                      color: COLORS.TEXT_PRIMARY,
                      borderLeft: `1px solid ${lightBlue}`,
                      paddingLeft: '1.5rem'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ width: '150px', p: 1, pl: 1.5, fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>
                    Statement Date
                  </Typography>
                  <InputBase
                    value={statementDate}
                    readOnly
                    sx={{ 
                      flex: 1, 
                      p: 1, 
                      fontSize: '0.8rem', 
                      color: COLORS.TEXT_PRIMARY,
                      borderLeft: `1px solid ${lightBlue}`,
                      paddingLeft: '1.5rem'
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Transactions Table */}
          <TableContainer component={Box} sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: tableHeaderBg }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px' }}>Date</TableCell>
                  <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px' }}>Description</TableCell>
                  <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px' }}>Provider</TableCell>
                  <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px', textAlign: 'right' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? transactions.map((row, i) => (
                  <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#f4f7fa' }}>
                    <TableCell sx={{ fontSize: '12px', color: '#5c7bb5', verticalAlign: 'top' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '12px', verticalAlign: 'top' }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>{row.desc}</Typography>
                      <Typography sx={{ fontSize: '12px', color: '#5c7bb5' }}>{row.sub}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', verticalAlign: 'top' }}>
                      <Typography sx={{ fontSize: '12px' }}>{row.prov}</Typography>
                      {row.ins !== '$0.00' && <Typography sx={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>insurance est.</Typography>}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right', verticalAlign: 'top' }}>
                      <Typography sx={{ fontSize: '12px', color: '#003366', fontWeight: 'bold' }}>{row.amt}</Typography>
                      {row.ins !== '$0.00' && <Typography sx={{ fontSize: '12px', color: '#999' }}>{row.ins}</Typography>}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, color: '#999' }}>No transactions found for this item.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Charges Summary */}
          <TableContainer sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: COLORS.SURFACE_TINT }}>
                <TableRow>
                  {['Total Charges', 'Total Patient Payments', 'Total Insurance Payments', 'Total Adjustment'].map(h => (
                    <TableCell key={h} sx={{ fontSize: '11px', fontWeight: 'bold', color: '#333' }}>{h}</TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>${totalCharges.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>${totalPatientPayments.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>${totalInsPayments.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>${totalAdjustments.toFixed(2)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Insurance Sub-summary */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 4, mb: 0.5 }}>
              <Typography sx={{ fontSize: '12px', color: '#333' }}>Estimated Remaining Insurance</Typography>
              <Typography sx={{ fontSize: '12px', color: '#333', width: '60px', textAlign: 'right' }}>${remainingIns.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Typography sx={{ fontSize: '12px', color: '#333' }}>Estimated Remaining Insurance Adjustment</Typography>
              <Typography sx={{ fontSize: '12px', color: '#333', width: '60px', textAlign: 'right' }}>$0.00</Typography>
            </Box>
          </Box>

          {/* Your Portion Banner */}
          <Box sx={{ bgcolor: '#a4b4cb', p: 1, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333', textAlign: 'center', flex: 1 }}>Your Portion</Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>${yourPortion.toFixed(2)}</Typography>
          </Box>

          {/* Aging Table */}
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: COLORS.SURFACE_TINT }}>
                <TableRow>
                  {['Balance 0-30 days', '>30 days', '>60 days', '>90 days', 'Account Credit'].map(h => (
                    <TableCell key={h} sx={{ fontSize: '11px', fontWeight: 'bold', color: '#333' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>${yourPortion.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Statement Summary Box */}
          <Box sx={{ border: '1px solid #5c7bb5', borderRadius: '4px', p: 1.5, mb: 3, display: 'flex' }}>
            <Typography sx={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>Statement Summary:</Typography>
            <Box sx={{ width: '250px' }}>
              {[
                { label: 'Total Charges', value: `$${totalCharges.toFixed(2)}` },
                { label: 'Total Patient Payments', value: `$${totalPatientPayments.toFixed(2)}` },
                { label: 'Total Insurance Payments', value: `$${totalInsPayments.toFixed(2)}` },
                { label: 'Total Insurance Write-Offs', value: '$0.00' },
                { label: 'Total Office Adjustments', value: `$${totalAdjustments.toFixed(2)}` },
                { label: 'Total Refunds', value: '$0.00' },
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '12px', color: '#333' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Typography sx={{ fontSize: '11px', color: '#999', fontStyle: 'italic', mb: 1 }}>* These transactions will not affect the running balance.</Typography>
          
          <StatementFooter 
            appointments={[
              { label: 'Next Scheduled Treatment Appointment', value: 'No Scheduled Appointment' },
              { label: 'Next Scheduled Hygiene Appointment', value: 'No Scheduled Appointment' }
            ]}
            notes={notes}
            showNotesInput={showNotesInput}
            onNotesChange={(e) => setNotes(e.target.value)}
            onSaveNotes={() => setShowNotesInput(false)}
            onEditNotes={() => setShowNotesInput(true)}
            onCloseNotes={() => {
              if (showNotesInput && notes) {
                setShowNotesInput(false);
              } else {
                setShowNotesInput(false);
                setNotes('');
              }
            }}
          />
        </Box>
      </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => setShowNotesInput(true)}
          sx={{
            backgroundColor: primaryBlue,
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#334372', boxShadow: 'none' }
          }}
        >
          {notes ? 'Edit Notes' : 'Add Notes'}
        </Button>
        <Button
          variant="outlined"
          onClick={handlePrint}
          startIcon={<PrintOutlinedIcon />}
          sx={{
            textTransform: 'none',
            borderColor: COLORS.ACCENT,
            color: COLORS.ACCENT,
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '8px',
            height: '36px',
            px: 2,
            '&:hover': { borderColor: COLORS.ACCENT_HOVER, backgroundColor: 'rgba(59, 130, 246, 0.04)' }
          }}
        >
          Print
        </Button>
      </DialogActions>
    </Box>
  );
};

export default SimpleStatementDialog;
