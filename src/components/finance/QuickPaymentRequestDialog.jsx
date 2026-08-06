import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  InputBase, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const QuickPaymentRequestDialog = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [notifyMethod, setNotifyMethod] = useState('sms');
  
  const isConfirmDisabled = !amount || parseFloat(amount) <= 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <PaidOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Request a Quick Payment
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ px: '25px', py: '20px', pt: '25px !important', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px', mb: 1.5, fontWeight: fontWeight.medium }}>
            Please enter the requested payment amount:
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, width: '100%' }}>
            <Typography sx={{ fontSize: '1.2rem', color: COLORS.TEXT_PRIMARY, mt: 0.5, mr: 1, fontWeight: fontWeight.semiBold }}>
              $
            </Typography>
            <InputBase
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{
                fontSize: '1rem',
                color: COLORS.TEXT_PRIMARY,
                width: '100%',
                borderBottom: `2px solid ${COLORS.BORDER}`,
                fontWeight: fontWeight.medium,
                '& input::placeholder': {
                  color: COLORS.TEXT_SECONDARY,
                  opacity: 0.6
                }
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px', mb: 1, fontWeight: fontWeight.medium }}>
            Notify patient by:
          </Typography>
          <RadioGroup 
            row 
            value={notifyMethod} 
            onChange={(e) => setNotifyMethod(e.target.value)}
          >
            <FormControlLabel 
              value="sms" 
              control={<Radio size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
              label={<Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>SMS</Typography>} 
            />
            <FormControlLabel 
              value="email" 
              control={<Radio size="small" sx={{ color: COLORS.ACCENT, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
              label={<Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>Email</Typography>} 
            />
          </RadioGroup>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            px: 3,
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          disabled={isConfirmDisabled}
          sx={{ 
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            px: 3,
            boxShadow: 'none',
            '&.Mui-disabled': { backgroundColor: 'rgba(59, 130, 246, 0.5)', color: COLORS.WHITE },
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
          }}
        >
          Confirm Request
        </Button>
      </DialogActions>
    </Box>
  );
};

export default QuickPaymentRequestDialog;