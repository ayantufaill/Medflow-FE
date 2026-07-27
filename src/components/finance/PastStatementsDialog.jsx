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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import BaseDialog from '../shared/BaseDialog';
import { invoiceService } from '../../services/invoice.service';
import dayjs from 'dayjs';

const PastStatementsDialog = ({ open, onClose, patient }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

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
    // Open invoice in a new tab or trigger a preview
    const invoiceId = invoice._id || invoice.id;
    window.open(`/invoices/${invoiceId}`, '_blank');
  };

  const handleDownload = (invoice) => {
    // Trigger download — opens in new tab for print/save-as-PDF
    const invoiceId = invoice._id || invoice.id;
    window.open(`/invoices/${invoiceId}?download=true`, '_blank');
  };

  const headerBg = '#7788bb';

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Past Statements"
      maxWidth="md"
      contentSx={{ pt: 2, pb: 1, px: 0 }}
      titleColor={headerBg}
    >
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

      {/* Close button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, py: 1.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: '#a9a9a9',
            color: '#fff',
            textTransform: 'none',
            boxShadow: 'none',
            px: 3,
            fontSize: '0.85rem',
            '&:hover': { bgcolor: '#999' },
          }}
        >
          Close
        </Button>
      </Box>
    </BaseDialog>
  );
};

export default PastStatementsDialog;
