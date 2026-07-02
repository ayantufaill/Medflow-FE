import React from 'react';
import {
  Box, Typography, Checkbox, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

const PatientAgingReportTable = ({ reportData, agingBuckets, hidePatientNames }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1 } }}>
            <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
            <TableCell>Flags</TableCell>
            <TableCell>Patient Name</TableCell>
            {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket}</TableCell>)}
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Total owings</TableCell>
            <TableCell align="right">Payment Plan Owing</TableCell>
            <TableCell align="right">Credit</TableCell>
            <TableCell>Last Billed On</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((row, idx) => (
            <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5, verticalAlign: 'top' } }}>
              <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem' }}>👤</Typography>
                  </Box>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer' }}>
                    {hidePatientNames ? 'Hidden Name' : row.name}
                  </Typography>
                </Box>
              </TableCell>
              {agingBuckets.map(bucket => (
                <TableCell key={bucket} align="right">
                  <Box>
                    <Typography variant="caption" sx={{ display: 'block' }}>Pt. ${(row.buckets[bucket]?.pt || 0).toFixed(2)}</Typography>
                  </Box>
                </TableCell>
              ))}
              <TableCell align="right">
                <Typography variant="caption" sx={{ display: 'block' }}>${row.total.toFixed(2)}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>${row.totalOwings.toFixed(2)}</TableCell>
              <TableCell align="right">${row.paymentPlan.toFixed(2)}</TableCell>
              <TableCell align="right">${row.credit.toFixed(2)}</TableCell>
              <TableCell>{row.lastBilled}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', cursor: 'pointer' }}>
                  <NoteAddOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  <Typography variant="caption">add account note</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientAgingReportTable;
