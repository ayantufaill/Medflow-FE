import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import RecareList from './RecareList';

// Helper to classify a row into one of the chart categories
const getRowCategory = row => row.category;

const RecareCategoryDialog = ({ open, onClose, category, month }) => {
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
          {category || 'Patients'}{month ? ` - ${month}` : ''}
        </Typography>
      </Box>
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff' }}>
        <Typography variant="body2" sx={{ color: '#1a3a6b', fontWeight: 600 }}>
          Patients due for their recare
        </Typography>
      </Box>
      <DialogContent sx={{ p: 0, overflowX: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {category && <RecareList hideFilters={true} forcedCategory={category} forcedMonth={month} getRowCategory={getRowCategory} />}
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
