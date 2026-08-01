import React, { useState, useEffect } from 'react';
import { TableRow, TableCell, Typography, TextField } from '@mui/material';

// Common style for table cells
export const cellStyle = {
  fontSize: '0.85rem',
  color: '#1e293b',
  borderBottom: '1px solid #f1f5f9',
  py: 1.5,
  px: 2
};

export const GoalTableRow = ({ label, value, unit, subtext, width = 60, onChange }) => {
  const [localVal, setLocalVal] = useState(value);
  
  useEffect(() => { 
    setLocalVal(value); 
  }, [value]);

  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
      <TableCell sx={{ ...cellStyle, width: '40%', fontWeight: 500 }}>
        {label}
      </TableCell>
      <TableCell sx={{ ...cellStyle, width: '30%' }}>
        <TextField
          variant="standard"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={() => onChange(localVal)}
          sx={{ 
            width, 
            '& input': { textAlign: 'center', fontSize: '0.85rem', py: 0.2, color: '#2563eb', fontWeight: 600 },
            '& .MuiInput-underline:before': { borderBottomColor: '#cbd5e1' },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#94a3b8' },
            '& .MuiInput-underline:after': { borderBottomColor: '#2563eb' }
          }}
        />
      </TableCell>
      <TableCell sx={{ ...cellStyle, width: '30%', color: '#64748b' }}>
        {unit} {subtext && <Typography component="span" sx={{ fontSize: '0.75rem', ml: 0.5 }}>{subtext}</Typography>}
      </TableCell>
    </TableRow>
  );
};

export const ProviderGoalTableRow = ({ name, value, unit, onChange }) => {
  const [localVal, setLocalVal] = useState(value);
  
  useEffect(() => { 
    setLocalVal(value); 
  }, [value]);

  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
      <TableCell sx={{ ...cellStyle, width: '40%', fontWeight: 500 }}>
        {name}
      </TableCell>
      <TableCell sx={{ ...cellStyle, width: '30%' }}>
        <TextField
          variant="standard"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={() => onChange(localVal)}
          sx={{ 
            width: 60, 
            '& input': { textAlign: 'center', fontSize: '0.85rem', py: 0.2, color: '#2563eb', fontWeight: 600 },
            '& .MuiInput-underline:before': { borderBottomColor: '#cbd5e1' },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#94a3b8' },
            '& .MuiInput-underline:after': { borderBottomColor: '#2563eb' }
          }}
        />
      </TableCell>
      <TableCell sx={{ ...cellStyle, width: '30%', color: '#64748b' }}>
        {unit}
      </TableCell>
    </TableRow>
  );
};

// We can export the standard table header style
export const headerStyle = { 
  fontWeight: 600, 
  color: '#475569', 
  fontSize: '0.75rem', 
  textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0', 
  backgroundColor: '#F8FAFC',
  py: 1.5, 
  px: 2
};
