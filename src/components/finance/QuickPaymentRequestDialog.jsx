import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  InputBase, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  Button 
} from '@mui/material';

const QuickPaymentRequestDialog = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [notifyMethod, setNotifyMethod] = useState('sms');
  
  const textBlue = '#2c3e50';
  const placeholderGrey = '#b0bec5';
  const muiBlue = '#5c7cb6';
  const tanButton = '#d4c197';
  const disabledBlue = '#a9b9d1';

  const isConfirmDisabled = !amount || parseFloat(amount) <= 0;

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '8px', maxWidth: 400, boxShadow: 1 }}>
      {/* Title Label */}
      <Typography sx={{ color: textBlue, fontSize: '0.9rem', mb: 1.5 }}>
        Please enter the requested payment amount:
      </Typography>

      {/* Large Amount Input */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.2rem', color: textBlue, mt: 0.5, mr: 1 }}>
          $
        </Typography>
        <InputBase
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{
            fontSize: '1.2rem',
            color: amount ? textBlue : placeholderGrey,
            width: '100%',
            borderBottom: '2px solid #eee',
            '& input::placeholder': {
              color: placeholderGrey,
              opacity: 1
            }
          }}
        />
      </Box>

      {/* Notification Section */}
      <Typography sx={{ color: textBlue, fontSize: '0.9rem', mb: 0.75 }}>
        Notify patient by:
      </Typography>
      <RadioGroup 
        row 
        value={notifyMethod} 
        onChange={(e) => setNotifyMethod(e.target.value)}
        sx={{ mb: 2.5 }}
      >
        <FormControlLabel 
          value="sms" 
          control={<Radio size="small" sx={{ color: muiBlue, '&.Mui-checked': { color: muiBlue } }} />} 
          label={<Typography sx={{ fontSize: '0.85rem', color: muiBlue, fontWeight: 500 }}>SMS</Typography>} 
        />
        <FormControlLabel 
          value="email" 
          control={<Radio size="small" sx={{ color: muiBlue, '&.Mui-checked': { color: muiBlue } }} />} 
          label={<Typography sx={{ fontSize: '0.85rem', color: muiBlue, fontWeight: 500 }}>Email</Typography>} 
        />
      </RadioGroup>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ 
            bgcolor: tanButton, 
            color: '#fff', 
            textTransform: 'none',
            px: 4,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#c4b187', boxShadow: 'none' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          disabled={isConfirmDisabled}
          sx={{ 
            bgcolor: isConfirmDisabled ? disabledBlue : muiBlue, 
            color: '#fff !important', 
            textTransform: 'none',
            px: 3,
            boxShadow: 'none',
            '&.Mui-disabled': { bgcolor: disabledBlue },
            '&:hover': { 
              bgcolor: isConfirmDisabled ? disabledBlue : '#4a6a9e',
              boxShadow: 'none' 
            }
          }}
        >
          Confirm Request
        </Button>
      </Box>
    </Box>
  );
};

export default QuickPaymentRequestDialog;