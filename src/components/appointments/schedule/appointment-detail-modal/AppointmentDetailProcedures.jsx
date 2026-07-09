import React from 'react';
import { Box, Typography } from '@mui/material';

const AppointmentDetailProcedures = ({ procedures }) => {
  return (
    <Box sx={{ width: '550px', height: '326px', border: '1px solid #e2e8f0', borderRadius: '12px', p: '24px', flexShrink: 0, boxSizing: 'border-box' }}>
      <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', mb: '4px' }}>
        Procedures
      </Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 700, color: '#0f172a', mb: '20px' }}>
        Planned for this visit
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc', py: '8px', px: '16px', borderRadius: '6px', mb: '8px' }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.5px' }}>CONDITION</Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.5px' }}>AMOUNT</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
        {procedures.map((proc, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < procedures.length - 1 ? '1px solid #f1f5f9' : 'none', py: '14px', px: '8px' }}>
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#0f172a', width: '48px' }}>
                {proc.code}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748b' }}>&mdash;</Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#0f172a' }}>
                {proc.name}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              {proc.amount}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AppointmentDetailProcedures;
