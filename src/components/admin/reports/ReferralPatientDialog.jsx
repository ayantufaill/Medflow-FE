import React, { useRef } from 'react';
import { 
  Dialog, 
  Box, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const MOCK_PATIENTS = [
  { id: '51', name: 'Melina Polvos', phone: '+13607368380' },
  { id: '110', name: 'Candi Schmitt', phone: '+15738956325' },
  { id: '127', name: 'Barbara Streisandzz', phone: '+12534449006' },
  { id: '136', name: 'Johannes Smith', phone: '+12534449006' },
  { id: '167', name: 'tina Christopher', phone: '+255711466206' },
  { id: '168', name: 'RICHARD SARA', phone: '+255765354312' },
  { id: '207', name: 'Leighton Kennedy', phone: '+13366016732' },
  { id: '227', name: 'Gentle Dental', phone: '+18558495255' },
];

const ReferralPatientDialog = ({ open, onClose, referral }) => {
  const tableRef = useRef(null);

  const handlePrint = () => {
    if (!tableRef.current) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Referral - ' + (referral?.name || '') + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { margin: 0; padding: 20px; font-family: sans-serif; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 12px; }');
    printWindow.document.write('th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }');
    printWindow.document.write('th { font-weight: bold; color: #555; }');
    printWindow.document.write('.hide-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>' + (referral?.name || 'Referral Report') + '</h2>');
    printWindow.document.write(tableRef.current.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const currentPatients = referral?.patients && referral.patients.length > 0 
    ? referral.patients 
    : MOCK_PATIENTS;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 0 } }}>
      
      {/* Header */}
      <Box sx={{ bgcolor: '#4a73b1', p: 1.5, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontWeight: 600 }}>
          {referral?.name}
        </Typography>
      </Box>

      {/* Table Content */}
      <Box sx={{ p: 2, maxHeight: 500, overflowY: 'auto' }}>
        <TableContainer ref={tableRef}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="hide-print" sx={{ width: 120, borderBottom: '1px solid #eee' }}></TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', borderBottom: '1px solid #eee' }}>id</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', borderBottom: '1px solid #eee' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', borderBottom: '1px solid #eee' }}>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPatients.map((p, idx) => (
                <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #eee' } }}>
                  <TableCell className="hide-print" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, color: '#4a73b1', cursor: 'pointer', alignItems: 'center' }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                      <EventNoteIcon sx={{ fontSize: 16 }} />
                      <AttachMoneyIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: '16px' }}>Tx</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1, color: '#555' }}>{p.id || p.patientId || '-'}</TableCell>
                  <TableCell sx={{ py: 1, color: '#555' }}>{p.name || p.patientName || p.patient || '-'}</TableCell>
                  <TableCell sx={{ py: 1, color: '#555' }}>{p.phone || p.phoneNumber || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ textTransform: 'none', bgcolor: '#9e9e9e', '&:hover': { bgcolor: '#757575' }, boxShadow: 'none' }}
        >
          close
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePrint}
          sx={{ textTransform: 'none', bgcolor: '#e6c875', color: '#fff', '&:hover': { bgcolor: '#c59d24' }, boxShadow: 'none' }}
        >
          Print
        </Button>
      </Box>

    </Dialog>
  );
};

export default ReferralPatientDialog;
