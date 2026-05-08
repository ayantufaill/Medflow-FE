import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';

const ItemizedReceiptPreview = ({ onClose, patientName = 'Vicky Widener', accountNo = '1259' }) => {
  const blueHeader = '#5c7bb5'; // Matches the image's slightly different blue, or use #7788bb if preferred. Image looks more like #5c7bb5.
  const tanButton = '#d2b48c';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        fontFamily: '"Segoe UI", Tahoma, sans-serif'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: blueHeader,
          color: 'white',
          padding: '12px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', fontSize: '18px' }}>
          Print Preview
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ padding: '20px 40px' }}>
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
            <Typography sx={{ fontSize: '13px', color: '#5c7bb5' }}>no scheduled appt</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#444' }}>Next scheduled hygiene appt</Typography>
            <Typography sx={{ fontSize: '13px', color: '#5c7bb5' }}>no scheduled appt</Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pb: 2 }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: '#9ca3af',
              color: 'white',
              textTransform: 'none',
              fontSize: '15px',
              padding: '6px 25px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#8b949e', boxShadow: 'none' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{
              backgroundColor: tanButton,
              color: 'white',
              textTransform: 'none',
              fontSize: '15px',
              padding: '6px 25px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c1a37b', boxShadow: 'none' },
            }}
          >
            Print
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Helper
const Divider = ({ sx }) => <Box sx={{ height: '1px', bgcolor: '#ccc', ...sx }} />;

export default ItemizedReceiptPreview;
