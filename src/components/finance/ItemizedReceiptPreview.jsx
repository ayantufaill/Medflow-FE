import React, { useMemo } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';
import { usePatient } from '../../hooks/redux';
import { useSelector } from 'react-redux';
import { selectLedgerItemsForPatient } from '../../store/slices/billingSlice';

const ItemizedReceiptPreview = ({ onClose }) => {
  const { currentPatient } = usePatient();
  const patientId = currentPatient?._id || currentPatient?.id;
  const patientName = currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : 'Unknown Patient';
  const accountNo = currentPatient?.accountNumber || patientId || 'Unknown';

  const ledgerItems = useSelector(selectLedgerItemsForPatient(patientId)) || [];

  const handlePrint = () => {
    window.print();
  };

  const payments = useMemo(() => {
    return ledgerItems.filter(item => item.method === 'Payment' && !item.isVoided);
  }, [ledgerItems]);

  const totalAmount = useMemo(() => {
    return payments.reduce((sum, pay) => {
      const amt = Number((String(pay.amount) || '$0').replace(/[^0-9.-]+/g, ''));
      return sum + amt;
    }, 0);
  }, [payments]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '14px', overflow: 'hidden' }}>
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
          Itemized Receipt Preview
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', pt: '25px !important', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
          {/* Top Info - Using CSS Grid for reliable spacing */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', mb: 4, alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>THE DENTAL HUB</Typography>
              <Typography sx={{ fontSize: '14px', color: '#666' }}>123 Dental Street</Typography>
              <Typography sx={{ fontSize: '14px', color: '#666' }}>Flower Mound, TX 75028</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#333', mb: 0.5 }}>Receipt</Typography>
              <Typography sx={{ fontSize: '14px', color: '#333' }}>Printed on {dayjs().format('MM/DD/YYYY')}</Typography>
              <Typography sx={{ fontSize: '14px', color: '#333' }}>Account #{accountNo.slice(-4) || 'N/A'}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Patient Name */}
          <Typography sx={{ fontSize: '15px', fontWeight: 500, mb: 3 }}>{patientName}</Typography>

          {/* Table */}
          <TableContainer component={Box} sx={{ border: '1px solid #ccc', mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fff' }}>
                  {['Payment #', 'Date', 'Payment Amount', 'Payment Type', 'Payment value', 'Code', 'Tooth #', 'Date of Service', 'Invoice numbers'].map(head => (
                    <TableCell key={head} sx={{ fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #ccc', py: 1.5 }}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3, color: '#666' }}>
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((pay, i) => {
                    const amtStr = `$${Number((String(pay.amount) || '$0').replace(/[^0-9.-]+/g, '')).toFixed(2)}`;
                    let methodStr = (pay.details && pay.details[0]?.title) ? pay.details[0].title : (pay.method || 'Card');
                    if (methodStr.toLowerCase().includes('method:')) {
                      const match = methodStr.match(/Method:\s*([^.]+)/i);
                      if (match && match[1]) {
                        methodStr = match[1].trim();
                      }
                    } else if (methodStr.toLowerCase().includes('via')) {
                      const match = methodStr.match(/via\s+([^.]+)/i);
                      if (match && match[1]) {
                        methodStr = match[1].trim();
                      }
                    }
                    
                    let codes = [];
                    let teeth = [];
                    let serviceDates = [];
                    let invNumbers = [];

                    // Look through ledger items to find invoices this payment was applied to
                    const appliedInvoices = ledgerItems.filter(li => 
                      li.method === 'Invoice' && 
                      (
                         (pay.invoiceNumber && li.invoiceNumber === pay.invoiceNumber) ||
                         (li.details && li.details.some(d => d.isPayment && (String(d.id) === String(pay.id) || String(d.id) === String(pay.receiptNumber))))
                      )
                    );

                    appliedInvoices.forEach(inv => {
                      if (inv.invoiceNumber || inv.id) invNumbers.push(inv.invoiceNumber || inv.id);
                      const procDetail = (inv.details || []).find(d => d.procedures);
                      if (procDetail && procDetail.procedures) {
                        procDetail.procedures.forEach(p => {
                          if (p.code) codes.push(p.code);
                          if (p.tooth || p.toothNum || p.toothNumber) teeth.push(p.tooth || p.toothNum || p.toothNumber);
                          if (p.date || p.Date) serviceDates.push(dayjs(p.date || p.Date).format('MM/DD/YYYY'));
                        });
                      }
                    });

                    codes = [...new Set(codes)];
                    teeth = [...new Set(teeth)];
                    serviceDates = [...new Set(serviceDates)];
                    invNumbers = [...new Set(invNumbers)];

                    return (
                      <TableRow key={pay.id || i}>
                        <TableCell sx={{ fontSize: '12px' }}>{pay.receiptNumber || pay.id || `PAY-${i}`}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{dayjs(pay.rawDate || pay.date).format('MM/DD/YYYY')}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{amtStr}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{methodStr}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{amtStr}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{codes.length > 0 ? codes.join(', ') : 'Unallocated'}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{teeth.length > 0 ? teeth.join(', ') : ''}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{serviceDates.length > 0 ? serviceDates.join(', ') : dayjs(pay.rawDate || pay.date).format('MM/DD/YYYY')}</TableCell>
                        <TableCell sx={{ fontSize: '12px' }}>{invNumbers.length > 0 ? invNumbers.join(', ') : (pay.invoiceNumber || '')}</TableCell>
                      </TableRow>
                    );
                  })
                )}
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'right', fontWeight: 'bold', fontSize: '13px', borderBottom: 'none' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px', borderBottom: 'none' }}>${totalAmount.toFixed(2)}</TableCell>
                  <TableCell colSpan={6} sx={{ borderBottom: 'none' }}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Scheduled Appts - Single Box with 50-50 split */}
          <Box sx={{ border: '1px solid #ccc', display: 'flex', mb: 6, minHeight: '60px' }}>
            <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ccc' }}>
              <Typography sx={{ fontSize: '13px', color: '#444' }}>Next scheduled treatment appt</Typography>
              <Typography sx={{ fontSize: '13px', color: COLORS.ACCENT }}>no scheduled appt</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 1 }}>
              <Typography sx={{ fontSize: '13px', color: '#444' }}>Next scheduled hygiene appt</Typography>
              <Typography sx={{ fontSize: '13px', color: COLORS.ACCENT }}>no scheduled appt</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER}`, gap: 1 }}>
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

// Helper
const Divider = ({ sx }) => <Box sx={{ height: '1px', bgcolor: '#ccc', ...sx }} />;

export default ItemizedReceiptPreview;
