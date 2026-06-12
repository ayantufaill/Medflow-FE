import React from 'react';
import { TableRow, TableCell, Box, Typography, TextField, Collapse, Table, TableBody } from '@mui/material';
import { ChevronRight as ChevronRightIcon, KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import GroupRow from './GroupRow';

const CategoryRow = ({ cat, expandedCategories, toggleCategory, expandedGroups, toggleGroup, feeGuideId, dispatch, updateProcedureFee }) => {
  const isExpanded = expandedCategories.includes(cat.name);

  return (
    <React.Fragment>
      <TableRow 
        sx={{ '&:hover': { bgcolor: '#f9fafb' }, cursor: 'pointer' }}
        onClick={() => toggleCategory(cat.name)}
      >
        <TableCell sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#333', fontWeight: 500, borderBottom: 'none', whiteSpace: 'nowrap' }}>
          {isExpanded ? (
            <ChevronDownIcon sx={{ color: '#4b71a1', fontSize: '1.2rem' }} />
          ) : (
            <ChevronRightIcon sx={{ color: '#4b71a1', fontSize: '1.2rem' }} />
          )}
          {cat.name}
        </TableCell>
        <TableCell colSpan={5} />
        <TableCell align="center">
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
                {cat.groups.map((group, gIdx) => (
                  <GroupRow 
                    key={gIdx} 
                    group={group} 
                    catName={cat.name}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
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

export default CategoryRow;
