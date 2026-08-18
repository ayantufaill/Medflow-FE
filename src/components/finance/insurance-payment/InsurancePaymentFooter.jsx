import React from 'react';
import { Box, Typography, Button, DialogActions } from '@mui/material';
import { COLORS } from '../../../constants/colors';

const InsurancePaymentFooter = ({
  handleSwitchToSimpleBilling,
  handleApplyAndPay,
  onClose,
  totalWo = 0,
  totalPay = 0
}) => {
  return (
    <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto', px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSwitchToSimpleBilling}
          sx={{ bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.75rem', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#1565c0' } }}
        >
          Switch to simple billing
        </Button>
        <Typography sx={{ color: COLORS.ACCENT, fontSize: '0.8125rem', cursor: 'pointer' }}>
          + Add description
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Typography sx={{ fontStyle: 'italic', fontSize: '0.75rem', color: '#555' }}>
          Before applying payment, please make sure the deductibles and total insurance payment match your EOB
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#d32f2f' }}>Ins Writeoff: ${totalWo.toFixed(2)}</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#8eb378' }}>Ins Payment: ${totalPay.toFixed(2)}</Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleApplyAndPay}
              sx={{ bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.75rem', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#1565c0' } }}
            >
              Apply
            </Button>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{
                color: '#64748b',
                borderColor: '#cbd5e1',
                borderRadius: '8px',
                '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
                textTransform: 'none',
                px: 2,
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </DialogActions>
  );
};

export default InsurancePaymentFooter;
