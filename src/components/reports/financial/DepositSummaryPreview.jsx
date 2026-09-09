import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const DepositSummaryPreview = ({
  groupedPayments,
  overallTotal,
  handlePrint
}) => {
  if (!groupedPayments) {
    return (
      <Box className="no-print">
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0px', color: '#2563eb', mb: 2 }}>
          Deposit summary preview:
        </Typography>
        
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>No summary created.</Typography>
          <Typography variant="caption" color="text.secondary">
            Create a deposit summary by editing the left side options and clicking 'Generate Deposit Summary'.
          </Typography>
        </Box>
      </Box>
    );
  }

  // Count total payments inside all groups
  let totalPaymentsCount = 0;
  groupedPayments.forEach(group => {
    totalPaymentsCount += group.payments.length;
  });

  return (
    <Box className="no-print">
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0px', color: '#2563eb', mb: 2 }}>
        Deposit summary preview:
      </Typography>

      <Box>
        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: '12px', borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL SUMMARY AMOUNT</Typography>
              <Typography sx={{ fontWeight: 800, color: '#00c853', fontSize: '2rem', lineHeight: 1 }}>
                ${overallTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL ITEM COUNT</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '2rem', color: '#000000', lineHeight: 1 }}>
                  {totalPaymentsCount}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>Summary Details:</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#3CA2E0', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2b8ac3', boxShadow: 'none' } }}>
              Export as CSV
            </Button>
            <Button onClick={handlePrint} variant="outlined" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600 }}>
              Print
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', maxHeight: 350, overflowY: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, py: 1.5, borderBottom: '1px solid #e2e8f0', textTransform: 'capitalize' } }}>
                <TableCell>Date</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Daily Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedPayments.map((group, gIdx) => {
                const typesEntries = Object.entries(group.types);
                return typesEntries.map(([type, amount], tIdx) => (
                  <TableRow key={`${gIdx}-${tIdx}`} sx={{ '& td': { fontSize: '0.85rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#334155' }, backgroundColor: '#ffffff' }}>
                    <TableCell>{tIdx === 0 ? group.date : ''}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#1e293b' }}>${amount.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: tIdx === 0 ? 700 : 400, color: tIdx === 0 ? '#1e293b' : 'transparent' }}>
                      {tIdx === 0 ? `$${group.dailyTotal.toFixed(2)}` : ''}
                    </TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DepositSummaryPreview;
