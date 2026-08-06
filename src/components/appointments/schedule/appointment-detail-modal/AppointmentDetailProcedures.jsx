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
        <Typography sx={{ flex: 2, fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.5px' }}>CONDITION</Typography>
        <Typography sx={{ flex: 1, fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.5px' }}>PROVIDER</Typography>
        <Typography sx={{ width: '60px', textAlign: 'right', fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.5px' }}>AMOUNT</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
        {procedures.map((proc, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < procedures.length - 1 ? '1px solid #f1f5f9' : 'none', py: '14px', px: '8px' }}>
            <Box sx={{ flex: 2, display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#0f172a', width: '48px' }}>
                {proc.code || 'TBD'}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748b' }}>&mdash;</Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {proc.description || proc.name || 'Procedure'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
               <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                 {proc.providerName || proc.provider || 'Default'}
               </Typography>
            </Box>
            <Typography sx={{ width: '60px', textAlign: 'right', fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              {proc.amount || (proc.fee !== undefined ? `$${proc.fee.toFixed(2)}` : '$0.00')}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AppointmentDetailProcedures;
