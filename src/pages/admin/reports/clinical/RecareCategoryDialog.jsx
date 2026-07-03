import React, { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import RecareList from './RecareList';
import { selectRecareData } from '../../../../store/slices/clinicalReportSlice';
import { useSelector } from 'react-redux';

// Helper to classify a row into one of the chart categories
export const getRowCategory = (row) => {
  const recallDate = row.recallDate || row.nextRecareAppt;
  const apptDate = row.apptDate || row.nextTreatmentAppt;
  const flags = row.flags;
  const now = new Date();

  if (!recallDate) {
    if (flags) return 'Flagged No-Recare';
    return 'No Recare';
  }
  const rDate = new Date(recallDate);
  if (isNaN(rDate.getTime())) return 'No Recare';

  const diffMonths = (now.getTime() - rDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (diffMonths <= 0) {
    if (apptDate) return 'On-Time Pre-appt';
    return 'On-Time No Pre-appt';
  } else if (diffMonths < 12) {
    if (apptDate) return 'Late <12 months Appointed';
    return 'Late <12 months No Appointment'; // Or Broken Appointment fallback
  } else {
    if (apptDate) return 'Late >12 months Appointed';
    return 'Late >12 months No Appointment';
  }
};

const RecareCategoryDialog = ({ open, onClose, category }) => {
  const handlePrint = () => {
    const tableEl = document.getElementById('recare-list-table');
    if (!tableEl) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${category || 'Recare Report'}</title>`);
    win.document.write('<style>table{width:100%;border-collapse:collapse;font-family:sans-serif;font-size:11px}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#f8f9fa;font-weight:bold} .no-print { display: none !important; } .print-only { display: inline !important; }</style>');
    win.document.write(`</head><body><h2>${category || 'Recare Report'}</h2>`);
    win.document.write(tableEl.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 0, m: 2, height: '90vh', display: 'flex', flexDirection: 'column' } }}
    >
      <Box sx={{ backgroundColor: '#4a90e2', p: 1.5, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
          {category || 'Patients'}
        </Typography>
      </Box>
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff' }}>
        <Typography variant="body2" sx={{ color: '#1a3a6b', fontWeight: 600 }}>
          Patients due for their recare
        </Typography>
      </Box>
      <DialogContent sx={{ p: 0, overflowX: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {category && <RecareList hideFilters={true} forcedCategory={category} getRowCategory={getRowCategory} />}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', justifyContent: 'flex-end', backgroundColor: '#fff' }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#9e9e9e', textTransform: 'none', px: 3, '&:hover': { backgroundColor: '#757575' } }}>
          Close
        </Button>
        <Button onClick={handlePrint} variant="contained" sx={{ backgroundColor: '#d1a066', '&:hover': { backgroundColor: '#b88a52' }, textTransform: 'none', px: 3, ml: 2 }}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecareCategoryDialog;
