import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GoalTableRow, headerStyle } from './SharedGoalInputs';

const ReappointmentsSection = ({ data, handleUpdate }) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700, mb: 3, fontSize: '1.1rem' }}>
        Re-appointments
      </Typography>
      <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '40%' }}>Metric</TableCell>
                <TableCell sx={{ ...headerStyle, width: '30%' }}>Target Value</TableCell>
                <TableCell sx={{ ...headerStyle, width: '30%' }}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <GoalTableRow 
                label="Re-Appointment Percent" 
                value={data.reappointmentPercent} 
                unit="%" 
                subtext="(% out of total visits)" 
                onChange={(val) => handleUpdate('reappointmentPercent', val)} 
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ReappointmentsSection;
