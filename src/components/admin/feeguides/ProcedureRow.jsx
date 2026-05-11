import React from 'react';
import { TableRow, TableCell, Box, Typography, TextField } from '@mui/material';

const ProcedureRow = ({ procedure }) => {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
      <TableCell sx={{ width: '15%', borderBottom: 'none' }} />
      <TableCell sx={{ width: '15%', borderBottom: 'none' }} />
      <TableCell sx={{ width: '10%', py: 1.5, color: '#333', verticalAlign: 'top' }}>{procedure.code}</TableCell>
      <TableCell sx={{ width: '20%', py: 1.5, color: '#333', verticalAlign: 'top' }}>{procedure.name}</TableCell>
      <TableCell sx={{ width: '20%', py: 1.5, color: '#666', fontSize: '0.8rem', lineHeight: 1.4 }}>
        {procedure.description}
      </TableCell>
      <TableCell sx={{ width: '10%', py: 1.5, color: '#333', fontWeight: 500, verticalAlign: 'top' }}>{procedure.fee}</TableCell>
      <TableCell align="center" sx={{ width: '10%', py: 1.5, verticalAlign: 'top' }}>
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
  );
};

export default ProcedureRow;
