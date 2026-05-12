import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const mockPlans = [
  { id: '1', groupNumber: '00652756', groupName: 'PLAN 1 GROUP', employerName: 'EMPLOYER 1', payerName: 'MetLife', payerId: '65978' },
  { id: '2', groupNumber: '3338196', groupName: 'PLAN 2 GROUP', employerName: 'EMPLOYER 2', payerName: 'Total Cigna DPPO', payerId: '62308' },
  { id: '3', groupNumber: '0229020', groupName: 'PLAN 3 GROUP', employerName: 'EMPLOYER 3', payerName: 'MetLife', payerId: '65978' },
  { id: '4', groupNumber: '223127', groupName: 'PLAN 4 GROUP', employerName: 'EMPLOYER 4', payerName: 'MetLife', payerId: '65978' },
  { id: '5', groupNumber: '727796-011-00003', groupName: 'PLAN 5 GROUP', employerName: 'EMPLOYER 5', payerName: 'Aetna Dental Plans', payerId: '60054' },
  { id: '6', groupNumber: '3342972', groupName: 'PLAN 6 GROUP', employerName: 'EMPLOYER 6', payerName: 'CIGNA', payerId: '62308' },
  { id: '7', groupNumber: '150904-010-00001', groupName: 'PLAN 7 GROUP', employerName: 'EMPLOYER 7', payerName: 'Aetna Dental Plans', payerId: '60054' },
  { id: '8', groupNumber: '150902-014-00001', groupName: 'PLAN 8 GROUP', employerName: 'EMPLOYER 8', payerName: 'Aetna Dental Plans', payerId: '60054' },
  { id: '9', groupNumber: '302589', groupName: 'PLAN 9 GROUP', employerName: 'EMPLOYER 9', payerName: 'MetLife', payerId: '65978' },
];

const PlansDialog = ({ open, onClose, selectedFeeGuide }) => {
  const [selectedPlans, setSelectedPlans] = useState([]);

  const handleSelectAllPlans = (event) => {
    if (event.target.checked) {
      setSelectedPlans(mockPlans.map((plan) => plan.id));
    } else {
      setSelectedPlans([]);
    }
  };

  const handleSelectPlan = (id) => {
    setSelectedPlans((prev) => 
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isAllPlansSelected = mockPlans.length > 0 && selectedPlans.length === mockPlans.length;
  const isSomePlansSelected = selectedPlans.length > 0 && selectedPlans.length < mockPlans.length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        py: 2
      }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1a3a6b' }}>
          {selectedFeeGuide}'S PLANS
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#333' }}>
          Insurance Plans:
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '2px solid #e0e0e0', color: '#4b71a1', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small" 
                    checked={isAllPlansSelected}
                    indeterminate={isSomePlansSelected}
                    onChange={handleSelectAllPlans}
                  />
                </TableCell>
                <TableCell>Group Number</TableCell>
                <TableCell>Group Name</TableCell>
                <TableCell>Employer Name</TableCell>
                <TableCell>Payer Name</TableCell>
                <TableCell>Payer Id Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPlans.map((plan, index) => (
                <TableRow key={index} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f0f0f0', py: 1.5, color: '#333', fontSize: '0.875rem' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      size="small" 
                      checked={selectedPlans.includes(plan.id)}
                      onChange={() => handleSelectPlan(plan.id)}
                    />
                  </TableCell>
                  <TableCell>{plan.groupNumber}</TableCell>
                  <TableCell>{plan.groupName}</TableCell>
                  <TableCell>{plan.employerName}</TableCell>
                  <TableCell>{plan.payerName}</TableCell>
                  <TableCell>{plan.payerId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default PlansDialog;
