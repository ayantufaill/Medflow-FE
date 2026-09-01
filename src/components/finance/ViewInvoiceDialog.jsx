import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import { invoiceService } from '../../services/invoice.service';

const STATUS_COLORS = {
  draft: 'default',
  pending: 'warning',
  sent: 'info',
  paid: 'success',
  partial: 'secondary',
  overdue: 'error',
  cancelled: 'default',
};

const ViewInvoiceDialog = ({ open, onClose, invoiceId, autoDownload = false }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && invoiceId) {
      const fetchInvoice = async () => {
        try {
          setLoading(true);
          const invoiceData = await invoiceService.getInvoiceById(invoiceId);
          setInvoice(invoiceData);
        } catch (err) {
          setError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              'Failed to load invoice.'
          );
        } finally {
          setLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [open, invoiceId]);

  useEffect(() => {
    if (autoDownload && invoice && !loading && !error) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [autoDownload, invoice, loading, error]);

  const handleDownloadClick = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            /* Reset MUI Dialog containers for printing */
            .MuiDialog-root, .MuiDialog-container, .MuiPaper-root {
              position: static !important;
              overflow: visible !important;
              transform: none !important;
              height: auto !important;
              box-shadow: none !important;
            }
            #invoice-dialog-print-area, #invoice-dialog-print-area * {
              visibility: visible;
            }
            #invoice-dialog-print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px !important;
              overflow: visible !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: '12px', overflow: 'hidden' } }}
        sx={{ zIndex: 10000 }} // higher than PastStatementsDialog (which is 9999)
      >
      <DialogTitle
        className="no-print"
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
        <ReceiptIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Invoice Details
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent id="invoice-dialog-print-area" sx={{ px: '25px', py: '20px', pt: '25px !important', bgcolor: COLORS.BACKGROUND }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : invoice ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Invoice {invoice?.invoiceNumber}
                </Typography>
                <Chip
                  label={invoice?.status?.charAt(0).toUpperCase() + invoice?.status?.slice(1)}
                  color={STATUS_COLORS[invoice?.status] || 'default'}
                  size="small"
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: COLORS.TEXT_PRIMARY } }}>
                      <TableCell>Patient</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell>Date of Service</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Insurance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontSize: '13px', p: 1.5 }}>
                        {invoice?.patient?.firstName} {invoice?.patient?.lastName}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', p: 1.5 }}>
                        {invoice?.provider?.userId?.firstName} {invoice?.provider?.userId?.lastName}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', p: 1.5 }}>
                        {formatDate(invoice?.dateOfService)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', p: 1.5 }}>
                        {formatDate(invoice?.dueDate)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', p: 1.5 }}>
                        {invoice?.insuranceCompany?.name || invoice?.insuranceCompanyId?.name || '—'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: COLORS.TEXT_PRIMARY } }}>
                      <TableCell>Description (Line Items)</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice?.lineItems?.map((item, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontSize: '13px', p: 1 }}>{item.description}</TableCell>
                        <TableCell align="center" sx={{ fontSize: '13px', p: 1 }}>{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '13px', p: 1 }}>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '13px', p: 1 }}>{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    {(!invoice?.lineItems || invoice.lineItems.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px', p: 2 }}>No line items</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <Box sx={{ backgroundColor: '#f8f9fa', py: 1, px: 2, borderBottom: '1px solid #e2e8f0' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                  Summary & Notes
                </Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: 1, pr: 2 }}>
                  {invoice?.notes && (
                    <Box>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
                        Notes
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>
                        {invoice.notes}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '220px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>Subtotal:</Typography>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>{formatCurrency(invoice?.totalAmount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>Paid:</Typography>
                    <Typography sx={{ fontSize: '13px', color: COLORS.STATUS_SUCCESS }}>
                      -{formatCurrency(invoice?.paidAmount || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>Balance Due:</Typography>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: COLORS.ACCENT }}>
                      {formatCurrency(invoice?.balanceDue)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions className="no-print" sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'flex-end', gap: 1, bgcolor: 'white' }}>
        <Button
          variant="contained"
          onClick={handleDownloadClick}
          sx={{
            bgcolor: COLORS.ACCENT,
            color: 'white',
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '6px',
            height: '36px',
            px: 3,
            boxShadow: 'none',
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
          }}
        >
          Download
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '6px',
            height: '36px',
            px: 3,
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ViewInvoiceDialog;
