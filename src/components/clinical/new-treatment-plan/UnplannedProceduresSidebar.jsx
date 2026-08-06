import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const UnplannedProceduresSidebar = ({ procedures = [] }) => {
  const [tab, setTab] = useState('Unplanned');

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  const filteredProcedures = useMemo(() => {
    return procedures.filter(p => {
      // Normalizing statuses just in case they are abbreviations
      const status = p.status === 'P' ? 'Planned' 
                    : p.status === 'R' ? 'Referred' 
                    : p.status === 'EO' ? 'Existing'
                    : p.status === 'D' ? 'Completed'
                    : p.status;
      return status === tab;
    });
  }, [procedures, tab]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={handleTabChange}
        size="small"
        fullWidth
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            py: 0.75,
            color: '#475569',
            borderColor: '#e2e8f0',
            fontWeight: 500,
            '&.Mui-selected': {
              color: '#2563eb',
              bgcolor: '#eff6ff',
              borderColor: '#bfdbfe',
              zIndex: 1,
              '&:hover': {
                bgcolor: '#dbeafe',
              }
            }
          }
        }}
      >
        <ToggleButton value="Unplanned">Unplanned</ToggleButton>
        <ToggleButton value="Referred">Referred</ToggleButton>
        <ToggleButton value="Rejected">Rejected</ToggleButton>
      </ToggleButtonGroup>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', flexDirection: 'column', minHeight: 200, maxHeight: 240 }}>
        {filteredProcedures.length === 0 ? (
          <Box sx={{ flex: 1, p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography sx={{ color: '#475569', fontSize: '1rem', fontWeight: 400 }}>
              No {tab.toLowerCase()} procedures found
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowY: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600, color: '#475569', fontSize: '0.75rem', py: 1, px: 1.5 }}>Code</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600, color: '#475569', fontSize: '0.75rem', py: 1, px: 1.5 }}>Site</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600, color: '#475569', fontSize: '0.75rem', py: 1, px: 1.5 }}>Description</TableCell>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600, color: '#475569', fontSize: '0.75rem', py: 1, px: 1.5, textAlign: 'right' }}>Fee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProcedures.map((proc, index) => (
                  <TableRow key={proc.id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.8rem', px: 1.5, py: 1 }}>{proc.code}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.8rem', px: 1.5, py: 1 }}>{proc.site}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.8rem', px: 1.5, py: 1, maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{proc.description}</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 500, fontSize: '0.8rem', px: 1.5, py: 1, textAlign: 'right' }}>{proc.ptEst}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default UnplannedProceduresSidebar;
