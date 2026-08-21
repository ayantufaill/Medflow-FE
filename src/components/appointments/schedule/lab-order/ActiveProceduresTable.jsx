import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

const ActiveProceduresTable = ({ 
  proceduresList, 
  handleProcedureChargeChange, 
  handleDeleteProcedure 
}) => {
  return (
    <Box sx={{ mb: 4, width: '100%', maxWidth: '500px' }}>
      <Box sx={{ display: 'flex', borderBottom: '1px solid #e5e7eb', pb: 1, mb: 1 }}>
        <Typography sx={{ width: '60%', fontWeight: 600, color: '#6b7280', fontSize: '11px', fontFamily: 'Inter', textTransform: 'uppercase' }}>Active Procedure</Typography>
        <Typography sx={{ width: '40%', fontWeight: 600, color: '#6b7280', fontSize: '11px', fontFamily: 'Inter', textTransform: 'uppercase' }}>Procedure Cost</Typography>
      </Box>
      {proceduresList.length === 0 ? (
        <Typography sx={{ fontSize: '13px', color: '#6b7280', py: 1, fontFamily: 'Inter' }}>No active procedures.</Typography>
      ) : (
        proceduresList.map((proc, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #f3f4f6', pb: 1 }}>
            <Typography sx={{ width: '60%', color: '#09121f', fontSize: '13px', fontWeight: 500, fontFamily: 'Inter' }}>
              {proc.treatment || 'Procedure'} {proc.code && proc.code !== 'TBD' ? `(${proc.code})` : ''}
            </Typography>
            <Box sx={{ width: '40%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField 
                size="small" 
                value={proc.charge}
                onChange={(e) => handleProcedureChargeChange(idx, e.target.value)}
                sx={{ width: '90px', '& .MuiOutlinedInput-root': { height: '30px', fontSize: '13px', fontFamily: 'Inter', borderRadius: '6px' } }} 
              />
              <IconButton size="small" onClick={() => handleDeleteProcedure(idx)} sx={{ color: '#ef4444', p: 0.5 }}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ActiveProceduresTable;
