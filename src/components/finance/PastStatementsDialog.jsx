import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';
import { invoiceService } from '../../services/invoice.service';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import { fontWeight, radius } from '../../constants/styles';
import ViewInvoiceDialog from './ViewInvoiceDialog';

const PastStatementsDialog = ({ open, onClose, patient }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [dialogAction, setDialogAction] = useState('view');

  const patientId = patient?._id || patient?.id;

  useEffect(() => {
    if (!open || !patientId) return;

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await invoiceService.getAllInvoices({
          patientId,
          limit: 50,
        });
        setInvoices(data.invoices || []);
      } catch (err) {
        console.error('Error fetching past statements:', err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [open, patientId]);

  const getStatusLabel = (status) => {
    const statusMap = {
      draft: 'draft',
      pending: 'not shared',
      sent: 'printed',
      paid: 'printed',
      partially_paid: 'printed',
      overdue: 'not shared',
      void: 'voided',
    };
    return statusMap[status] || status || 'not shared';
  };

  const handleOpen = (invoice) => {
    const invoiceId = invoice._id || invoice.id;
    setDialogAction('view');
    setSelectedInvoiceId(invoiceId);
  };

  const handleDownload = (invoice) => {
    const invoiceId = invoice._id || invoice.id;
    setDialogAction('download');
    setSelectedInvoiceId(invoiceId);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{ sx: { borderRadius: '14px', overflow: 'hidden' } }}
      sx={{ zIndex: 9999 }}
    >
      {/* Header Bar */}
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
        <DescriptionOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Past Statements
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', py: '20px', pt: '25px !important', display: 'flex', flexDirection: 'column', gap: 2.5, maxHeight: '70vh', overflowY: 'auto', bgcolor: COLORS.BACKGROUND }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : invoices.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
            No past statements found for this patient.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', borderBottom: '2px solid #ddd' }}>
                  Date Created
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', borderBottom: '2px solid #ddd' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', borderBottom: '2px solid #ddd', textAlign: 'center' }}>
                  Open
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', borderBottom: '2px solid #ddd', textAlign: 'center' }}>
                  Download
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const invoiceId = invoice._id || invoice.id;
                const dateCreated = invoice.createdAt || invoice.invoiceDate;
                return (
                  <TableRow key={invoiceId} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ fontSize: '0.85rem', color: '#333' }}>
                      {dateCreated ? dayjs(dateCreated).format('MM/DD/YYYY') : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', color: '#555' }}>
                      {getStatusLabel(invoice.status)}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        onClick={() => handleOpen(invoice)}
                        sx={{
                          color: '#5b7bb1',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Open
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        onClick={() => handleDownload(invoice)}
                        sx={{
                          color: '#5b7bb1',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Download
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </DialogContent>

      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'flex-end', bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
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
              px: 3,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
            }}
          >
            Close
          </Button>
        </Box>
      </DialogActions>

      <ViewInvoiceDialog 
        open={Boolean(selectedInvoiceId)}
        onClose={() => setSelectedInvoiceId(null)}
        invoiceId={selectedInvoiceId}
        autoDownload={dialogAction === 'download'}
      />
    </Dialog>
  );
};

export default PastStatementsDialog;
