import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GoalTableRow, headerStyle } from './SharedGoalInputs';

const VisitsSection = ({ data, handleUpdate }) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700, mb: 3, fontSize: '1.1rem' }}>
        Number of Visits
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
                label="Total Visits Per Month" 
                value={data.visitsTotal} 
                unit="#" 
                onChange={(val) => handleUpdate('visitsTotal', val)} 
              />
              <GoalTableRow 
                label="Hygiene Visits Per Month" 
                value={data.visitsHygienePercent} 
                unit="%" 
                subtext="(% out of total visits)" 
                onChange={(val) => handleUpdate('visitsHygienePercent', val)} 
              />
              <GoalTableRow 
                label="Treatment Visits Per Month" 
                value={data.visitsTreatmentPercent} 
                unit="%" 
                subtext="(100% - Percentage of Hygiene Visits Per Month)" 
                onChange={(val) => handleUpdate('visitsTreatmentPercent', val)} 
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default VisitsSection;
