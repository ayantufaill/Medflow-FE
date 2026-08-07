import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const ItemizedReceiptPreview = ({ onClose, patientName = 'Vicky Widener', accountNo = '1259' }) => {
  const handlePrint = () => {
    window.print();
  };

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
              <Typography sx={{ fontSize: '14px', color: '#333' }}>Printed on 05/06/2026</Typography>
              <Typography sx={{ fontSize: '14px', color: '#333' }}>Account #{accountNo}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              {/* Empty right column */}
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
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'right', fontWeight: 'bold', fontSize: '13px', borderBottom: 'none' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '13px', borderBottom: 'none' }}>$0.00</TableCell>
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
