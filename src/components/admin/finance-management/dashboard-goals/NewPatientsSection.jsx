import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GoalTableRow, ProviderGoalTableRow, headerStyle } from './SharedGoalInputs';

const NewPatientsSection = ({ data, handleUpdate }) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700, mb: 3, fontSize: '1.1rem' }}>
        New Patients
      </Typography>
      
      <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden', mb: 4 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '40%' }}>Metric</TableCell>
                <TableCell sx={{ ...headerStyle, width: '30%' }}>Target Value</TableCell>
                <TableCell sx={{ ...headerStyle, width: '30%' }}>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <GoalTableRow 
                label="Number of new patients per office" 
                value={data.newPatientsTotal} 
                unit="#" 
                onChange={(val) => handleUpdate('newPatientsTotal', val)} 
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
        
      <Typography sx={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
        Number of new patients per provider
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        <Box sx={{ flex: 1, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headerStyle, width: '40%' }}>Dentist</TableCell>
                  <TableCell sx={{ ...headerStyle, width: '30%' }}>Target Value</TableCell>
                  <TableCell sx={{ ...headerStyle, width: '30%' }}>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.newPatientsProvider?.dentist?.map((p, i) => (
                  <ProviderGoalTableRow 
                    key={p.id} 
                    name={p.name} 
                    value={p.value} 
                    unit="New Pts #" 
                    onChange={(val) => handleUpdate(`newPatientsProvider.dentist.${i}.value`, val)} 
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <Box sx={{ flex: 1, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headerStyle, width: '40%' }}>Hygienist</TableCell>
                  <TableCell sx={{ ...headerStyle, width: '30%' }}>Target Value</TableCell>
                  <TableCell sx={{ ...headerStyle, width: '30%' }}>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.newPatientsProvider?.hygienist?.map((p, i) => (
                  <ProviderGoalTableRow 
                    key={p.id} 
                    name={p.name} 
                    value={p.value} 
                    unit="New Pts #" 
                    onChange={(val) => handleUpdate(`newPatientsProvider.hygienist.${i}.value`, val)} 
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default NewPatientsSection;
