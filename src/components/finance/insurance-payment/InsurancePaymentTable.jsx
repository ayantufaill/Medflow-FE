import React from 'react';
import { Box, Typography, Checkbox } from '@mui/material';

const InsurancePaymentTable = ({
  procedures,
  handleProcedureChange
}) => {
  return (
    <Box sx={{ px: 3, pb: 2 }}>
      {/* Invoice Summary Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#333' }}>
          Invoice #3125 : 07/15/2022 for Melina Cuellar
        </Typography>
      </Box>

      {/* Table Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
        <Box sx={{ width: '150px' }}></Box>
        <Box sx={{ width: '40px' }}></Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Submitted</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Balance</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Deductible</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Allowed</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Ins WO</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '110px', textAlign: 'left', color: '#555' }}>Ins pay</Typography>
        <Box sx={{ flex: 1 }}></Box>
      </Box>

      {/* Procedure Rows */}
      {procedures.map((proc, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f5f5f5', py: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', width: '150px', color: '#333', pl: 2 }}>{proc.code}</Typography>
          <Typography sx={{ fontSize: '0.75rem', width: '40px', color: '#666' }}>RSL</Typography>
          <Typography sx={{ fontSize: '0.75rem', width: '100px', color: '#666' }}>{proc.submitted}</Typography>
          <Typography sx={{ fontSize: '0.75rem', width: '100px', color: '#666' }}>{proc.bal}</Typography>
          <Box sx={{ width: '100px' }}>
            <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
              <input type="text" value={proc.ded} onChange={(e) => handleProcedureChange(i, 'ded', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
            </Box>
          </Box>
          <Box sx={{ width: '100px' }}>
            <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
              <input type="text" value={proc.allowed} onChange={(e) => handleProcedureChange(i, 'allowed', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
            </Box>
          </Box>
          <Box sx={{ width: '100px' }}>
            <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
              <input type="text" value={proc.wo} onChange={(e) => handleProcedureChange(i, 'wo', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
            </Box>
          </Box>
          <Box sx={{ width: '110px' }}>
            <Box sx={{ bgcolor: '#8eb378', border: '1px dashed #7ea368', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', width: '70px' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', mr: 0.25 }}>$</Typography>
              <input type="text" value={proc.pay} onChange={(e) => handleProcedureChange(i, 'pay', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, color: '#fff', padding: 0 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox size="small" sx={{ p: 0.2 }} />
              <Typography sx={{ fontSize: '0.75rem' }}>Update allowed fee</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox size="small" sx={{ p: 0.2 }} />
              <Typography sx={{ fontSize: '0.75rem' }}>Update Ins. Flat Portion</Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Total Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee', mb: 3 }}>
        <Box sx={{ width: '150px', textAlign: 'right', pr: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Total</Typography>
        </Box>
        <Box sx={{ width: '40px' }}></Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$142.00</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$142.00</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$0.00</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$142.00</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$0.00</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '110px', color: '#555' }}>$142.00</Typography>
      </Box>
    </Box>
  );
};

export default InsurancePaymentTable;
