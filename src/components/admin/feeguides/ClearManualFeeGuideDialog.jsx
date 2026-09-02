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
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

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
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
        flexShrink: 0,
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
            Clear Manual Fee Guide
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Select patients to clear their manual fee guides.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 4, pt: 3, overflowY: 'auto', flex: 1 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 4, py: 3, borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
        <Button 
          variant="outlined" 
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
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
