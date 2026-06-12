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
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#4b71a1', 
        color: 'white', 
        textAlign: 'center',
        py: 1,
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Clear Manual Fee Guide
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { py: 1.5, fontWeight: 700, color: '#333', fontSize: '0.85rem' } }}>
                <TableCell sx={{ width: '40%' }}>Patient Name</TableCell>
                <TableCell sx={{ width: '40%' }}>Fee Guide Name</TableCell>
                <TableCell align="center" sx={{ width: '20%' }}>
                  <Typography 
                    onClick={handleSelectAllPatients}
                    sx={{ ...actionLinkStyle, textDecoration: 'underline', color: '#4b71a1', justifyContent: 'center' }}
                  >
                    {selectedPatients.length === mockPatients.length ? 'Deselect All' : 'Select All'}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id} sx={{ '& .MuiTableCell-root': { py: 1, color: '#333' } }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#999', textTransform: 'none', '&:hover': { bgcolor: '#888' } }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#d9a366', textTransform: 'none', '&:hover': { bgcolor: '#c08d50' } }}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Clearing...' : 'Clear'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClearManualFeeGuideDialog;
