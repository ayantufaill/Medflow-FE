import React from 'react';
import { TableRow, TableCell, Box, Typography, TextField } from '@mui/material';

const ProcedureRow = ({ procedure, feeGuideId, dispatch, updateProcedureFee }) => {
  const [localFee, setLocalFee] = React.useState(procedure.fee);

  React.useEffect(() => {
    setLocalFee(procedure.fee);
  }, [procedure.fee]);

  const handleFeeSave = () => {
    if (localFee !== procedure.fee) {
      const numericFee = parseFloat(localFee.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericFee)) {
        dispatch(updateProcedureFee({ id: feeGuideId, procCode: procedure.code, amount: numericFee }));
      } else {
        setLocalFee(procedure.fee); // revert if invalid
      }
    }
  };

  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
      <TableCell sx={{ width: '15%', borderBottom: 'none' }} />
      <TableCell sx={{ width: '15%', borderBottom: 'none' }} />
      <TableCell sx={{ width: '10%', py: 1.5, color: '#333', verticalAlign: 'top' }}>{procedure.code}</TableCell>
      <TableCell sx={{ width: '20%', py: 1.5, color: '#333', verticalAlign: 'top' }}>{procedure.name}</TableCell>
      <TableCell sx={{ width: '20%', py: 1.5, color: '#666', fontSize: '0.8rem', lineHeight: 1.4 }}>
        {procedure.description}
      </TableCell>
      <TableCell sx={{ width: '10%', py: 1.5, color: '#333', fontWeight: 500, verticalAlign: 'top' }}>
        <TextField
          size="small"
          variant="standard"
          value={localFee}
          onChange={(e) => setLocalFee(e.target.value)}
          onBlur={handleFeeSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFeeSave();
            }
          }}
          sx={{ width: 60, '& .MuiInputBase-input': { fontSize: '0.9rem', fontWeight: 500 } }}
        />
      </TableCell>
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
