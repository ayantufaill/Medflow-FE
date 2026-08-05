import React, { useState, useRef } from 'react';
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

const DetailedStatementDialog = ({ onClose }) => {
  const contentRef = useRef(null);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState('');
  
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
            <title>Detailed Account Statement</title>
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
          Detailed Account Statement
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Box ref={contentRef} sx={{ p: '25px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography sx={{ fontSize: '13px' }}>Only Open Invoices</Typography>}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Header Type</Typography>
              <Select 
                MenuProps={{ 
                  sx: { zIndex: 1500 },
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
                defaultValue={dayjs("2026-04-06")}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 1500 } },
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
                  popper: { sx: { zIndex: 1500 } },
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

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ pr: 1 }}>
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
                    defaultValue="Vicky Widener"
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

                  {/* Detailed Estimates Table */}
                  <Box sx={{ mt: 2, border: `1px solid ${lightBlue}`, borderRadius: '6px', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: lightBlue, display: 'flex' }}>
                      <Box sx={{ flex: 1, p: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#2c3e50' }}>Outstanding:</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2c3e50' }}>$200.00</Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#2c3e50' }}>Insurance Estimate:</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2c3e50' }}>$0.00</Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#2c3e50' }}>Your Portion:</Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2c3e50' }}>$200.00</Typography>
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

            <Box sx={{ position: 'relative', textAlign: 'center', mb: 4, mt: 4 }}>
              <Box sx={{ borderTop: '1px dashed #ccc', width: '100%', position: 'absolute', top: '50%' }} />
              <ContentCutIcon sx={{ position: 'absolute', left: 0, top: -12, color: '#ccc', fontSize: '16px' }} />
              <Typography sx={{ position: 'relative', display: 'inline-block', bgcolor: 'white', px: 2, fontSize: '10px', color: '#999' }}>
                Please detach and return this part of the statement with your payment to ensure proper processing
              </Typography>
              <Typography sx={{ display: 'block', fontSize: '10px', color: '#999', mt: 1 }}>
                Please keep this part of the statement for your records
              </Typography>
            </Box>

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
                    <Typography sx={{ width: '150px', p: 1, pl: 1.5, fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>Patient Name</Typography>
                    <InputBase defaultValue="Vicky Widener" sx={{ flex: 1, p: 1, fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, borderLeft: `1px solid ${lightBlue}`, paddingLeft: '1.5rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ width: '150px', p: 1, pl: 1.5, fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>Statement Date</Typography>
                    <InputBase defaultValue="05/06/2026" sx={{ flex: 1, p: 1, fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, borderLeft: `1px solid ${lightBlue}`, paddingLeft: '1.5rem' }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Detailed Transactions Table */}
            <TableContainer component={Box} sx={{ mb: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: tableHeaderBg }}>
                  <TableRow>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px' }}>Date</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px' }}>Description</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px' }}>Provider</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px', textAlign: 'right' }}>Amount</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px', textAlign: 'right' }}>Credit</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: 'bold', fontSize: '12px', textAlign: 'right' }}>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { date: '05/06/2026', desc: 'Invoice #25135: $100.00', sub: 'L5001 Broken appt', prov: 'Christina Sabour', amt: '$100.00', crd: '', bal: '$100.00' },
                    { date: '05/06/2026', desc: 'Invoice #25136: $100.00', sub: 'L5002 Late cancellation', prov: 'Christina Sabour', amt: '$100.00', crd: '', bal: '$200.00' },
                  ].map((row, i) => (
                    <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#f4f7fa' }}>
                      <TableCell sx={{ fontSize: '12px', color: '#5c7bb5', verticalAlign: 'top' }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: '12px', verticalAlign: 'top' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>{row.desc}</Typography>
                        <Typography sx={{ fontSize: '12px', color: '#5c7bb5' }}>{row.sub}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '12px', verticalAlign: 'top' }}>
                        <Typography sx={{ fontSize: '12px' }}>{row.prov}</Typography>
                        <Typography sx={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>insurance est.</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', verticalAlign: 'top', fontSize: '12px', fontWeight: 'bold', color: '#003366' }}>{row.amt}</TableCell>
                      <TableCell sx={{ textAlign: 'right', verticalAlign: 'top', fontSize: '12px' }}>{row.crd}</TableCell>
                      <TableCell sx={{ textAlign: 'right', verticalAlign: 'top', fontSize: '12px', color: '#003366', fontWeight: 'bold' }}>{row.bal}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: '#d1d9e6' }}>
                    <TableCell colSpan={5} sx={{ textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>Outstanding Balance</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>$200.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer sx={{ mt: 3, mb: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#eef2f6' }}>
                  <TableRow>
                    {['Total Charges', 'Total Patient Payments', 'Total Insurance Payments', 'Total Adjustment', 'Outstanding Balance'].map(h => (
                      <TableCell key={h} sx={{ fontSize: '11px', fontWeight: 'bold', color: '#333' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$200.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$200.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 4, mb: 0.5 }}>
                <Typography sx={{ fontSize: '12px', color: '#333' }}>Estimated Remaining Insurance</Typography>
                <Typography sx={{ fontSize: '12px', color: '#333', width: '60px', textAlign: 'right' }}>$0.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Typography sx={{ fontSize: '12px', color: '#333' }}>Estimated Remaining Insurance Adjustment</Typography>
                <Typography sx={{ fontSize: '12px', color: '#333', width: '60px', textAlign: 'right' }}>$0.00</Typography>
              </Box>
            </Box>

            <Box sx={{ bgcolor: '#a4b4cb', p: 1, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333', textAlign: 'center', flex: 1 }}>Your Portion</Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>$200.00</Typography>
            </Box>

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
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$200.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>$0.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ border: '1px solid #5c7bb5', borderRadius: '4px', p: 1.5, mb: 3, display: 'flex' }}>
              <Typography sx={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>Statement Summary:</Typography>
              <Box sx={{ width: '250px' }}>
                {[{ label: 'Total Charges', value: '$200.00' }, { label: 'Total Patient Payments', value: '$0.00' }, { label: 'Total Insurance Payments', value: '$0.00' }, { label: 'Total Insurance Write-Offs', value: '$0.00' }, { label: 'Total Office Adjustments', value: '$0.00' }, { label: 'Total Refunds', value: '$0.00' }].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '12px', color: '#333' }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Typography sx={{ fontSize: '11px', color: '#999', fontStyle: 'italic', mb: 1 }}>* These transactions will not affect the running balance.</Typography>
            
            <StatementFooter 
              appointments={[{ label: 'Next Scheduled Treatment Appointment', value: 'No Scheduled Appointment' }, { label: 'Next Scheduled Hygiene Appointment', value: 'No Scheduled Appointment' }]}
              notes={notes}
              showNotesInput={showNotesInput}
              onNotesChange={(e) => setNotes(e.target.value)}
              onSaveNotes={() => setShowNotesInput(false)}
              onEditNotes={() => setShowNotesInput(true)}
              onCloseNotes={() => { if (showNotesInput && notes) { setShowNotesInput(false); } else { setShowNotesInput(false); setNotes(''); } }}
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

export default DetailedStatementDialog;
