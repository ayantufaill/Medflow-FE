import React, { useState } from 'react';
import { feeService } from '../../../services/fee.service';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Button,
} from '@mui/material';

const mockPatients = [
  { id: '1', name: 'John Doe', feeGuide: 'Office Fees 2026' },
  { id: '2', name: 'Matt Borowski', feeGuide: 'TDS Membership 2023' },
  { id: '3', name: 'Sarah Wilson', feeGuide: 'Office Fees 2026' },
  { id: '4', name: 'James Miller', feeGuide: 'Office Fees 2023/2024' },
  { id: '5', name: 'Linda Taylor', feeGuide: 'TDS Membership 2023' },
  { id: '6', name: 'Robert Moore', feeGuide: 'TDS Membership 2023' },
  { id: '7', name: 'Patricia White', feeGuide: 'TDS Membership 2025' },
  { id: '8', name: 'Michael Harris', feeGuide: 'TDS Membership 2023' },
  { id: '9', name: 'Elizabeth Martin', feeGuide: 'TDS Membership 2025' },
  { id: '10', name: 'David Thompson', feeGuide: 'TDS Membership 2023' },
  { id: '11', name: 'Jennifer Garcia', feeGuide: 'Office Fees 2023/2024' },
  { id: '12', name: 'Charles Davis', feeGuide: 'Office Fees 2023/2024' },
];

const ClearManualFeeGuideDialog = ({ open, onClose }) => {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await feeService.resetTPlans(selectedPatients);
      onClose();
    } catch (error) {
      console.error('Failed to reset treatment plans:', error);
      alert('Failed to reset treatment plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllPatients = () => {
    if (selectedPatients.length === mockPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(mockPatients.map((p) => p.id));
    }
  };

  const handleSelectPatient = (id) => {
    setSelectedPatients((prev) => 
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const actionLinkStyle = {
    color: '#4b71a1',
    fontSize: '0.8rem',
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': { textDecoration: 'underline' },
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#fff',
        color: '#0f172a',
        fontSize: '1.1rem',
        fontWeight: 700,
        py: 3,
        px: 4,
        lineHeight: 1.3,
        borderBottom: '1px solid #f1f5f9'
      }}>
        Clear Manual Fee Guide
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <TableContainer sx={{ maxHeight: 400, border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: '#F8FAFC', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell sx={{ width: '40%' }}>Patient Name</TableCell>
                <TableCell sx={{ width: '40%' }}>Fee Guide Name</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>
                  <Typography 
                    onClick={handleSelectAllPatients}
                    sx={{ ...actionLinkStyle, textDecoration: 'underline', color: '#2563eb', justifyContent: 'center' }}
                  >
                    {selectedPatients.length === mockPatients.length ? 'Deselect All' : 'Select All'}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9', py: 1.5, color: '#1e293b', fontSize: '0.85rem' } }}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.feeGuide}</TableCell>
                  <TableCell align="center">
                    <Checkbox 
                      size="small" 
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => handleSelectPatient(patient.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 4, pb: 4 }}>
        <Button 
          variant="text" 
          sx={{ 
            textTransform: 'none', 
            color: '#475569', 
            fontWeight: 600, 
            borderRadius: 2, 
            px: 3, 
            '&:hover': { backgroundColor: '#f1f5f9' } 
          }}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#2563eb', 
            fontWeight: 600, 
            borderRadius: 2, 
            px: 3, 
            boxShadow: 'none', 
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' } 
          }}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Clearing...' : 'Clear'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ClearManualFeeGuideDialog;
