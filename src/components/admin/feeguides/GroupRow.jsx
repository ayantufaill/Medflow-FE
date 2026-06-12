import React from 'react';
import { TableRow, TableCell, Box, Typography, TextField, Collapse, Table, TableBody } from '@mui/material';
import { ChevronRight as ChevronRightIcon, KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import ProcedureRow from './ProcedureRow';

const GroupRow = ({ group, catName, expandedGroups, toggleGroup, feeGuideId, dispatch, updateProcedureFee }) => {
  const isExpanded = expandedGroups.includes(`${catName}-${group.name}`);
  
  return (
    <React.Fragment>
      <TableRow 
        sx={{ '&:hover': { bgcolor: '#f9fafb' }, cursor: 'pointer' }}
        onClick={() => toggleGroup(`${catName}-${group.name}`)}
      >
        <TableCell sx={{ width: '15%', borderBottom: 'none' }} />
        <TableCell sx={{ width: '15%', py: 1, borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 1, color: '#333', whiteSpace: 'nowrap' }}>
          {isExpanded ? (
            <ChevronDownIcon sx={{ color: '#4b71a1', fontSize: '1rem' }} />
          ) : (
            <ChevronRightIcon sx={{ color: '#4b71a1', fontSize: '1rem' }} />
          )}
          {group.name}
        </TableCell>
        <TableCell colSpan={4} sx={{ borderBottom: 'none' }} />
        <TableCell align="center" sx={{ width: '10%', borderBottom: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
            <TextField 
              size="small" 
              variant="standard"
              placeholder="-/+"
              sx={{ 
                width: 40, 
                '& .MuiInputBase-input': { 
                  textAlign: 'center', 
                  fontSize: '0.85rem',
                  color: '#4b71a1'
                } 
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <Typography sx={{ color: '#4b71a1', fontSize: '0.85rem' }}>%</Typography>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, borderBottom: 'none' }}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {group.procedures.map((proc, pIdx) => (
                  <ProcedureRow 
                    key={pIdx} 
                    procedure={proc} 
                    feeGuideId={feeGuideId}
                    dispatch={dispatch}
                    updateProcedureFee={updateProcedureFee}
                  />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default GroupRow;
