import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  Button
} from '@mui/material';

const CourtesyRefundDialog = ({ onClose }) => {
  const [fromPatient, setFromPatient] = useState('test test');
  const [paymentMethod, setPaymentMethod] = useState('Do not use');
  const [toAccount, setToAccount] = useState('');
  const [accountCredit, setAccountCredit] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  
  const blueHeader = '#7788bb';
  const blueText = '#5c6bc0';
  const linkBlue = '#5c7cb6';

  // Refund amount options - can be fetched from API
  const refundAmounts = [
    { label: 'Full Amount', value: 100.00 },
    { label: 'Partial Amount', value: 50.00 },
    { label: 'Custom Amount', value: 0.00 }
  ];

  return (
    <Box sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: blueHeader, py: 1, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontWeight: 500 }}>Courtesy Refund #24633</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Main Inline Selection Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'nowrap', 
          gap: 1, 
          borderBottom: '1px solid #7788bb', 
          pb: 1,
          mb: 2 
        }}>
          <Typography sx={{ color: blueText, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            04/15/2026
          </Typography>
          
          <Typography sx={{ color: blueText, fontSize: '0.85rem', whiteSpace: 'nowrap', ml: 1 }}>
            Courtesy Refund #24633 from
          </Typography>

          <Select
            variant="standard"
            value={fromPatient}
            onChange={(e) => setFromPatient(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 80, height: 24 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="test test">test test</MenuItem>
          </Select>

          <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>with</Typography>

          <Select
            variant="standard"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 100, height: 24 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="Do not use">Do not use</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Check">Check</MenuItem>
          </Select>

          <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>to</Typography>

          <Select
            variant="standard"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.85rem', minWidth: 100, height: 24 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="account1">Account 1</MenuItem>
            <MenuItem value="account2">Account 2</MenuItem>
          </Select>

          {/* Spacer to push checkbox to the right */}
          <Box sx={{ flexGrow: 1 }} />

          <FormControlLabel 
            control={
              <Checkbox 
                size="small" 
                checked={accountCredit}
                onChange={(e) => setAccountCredit(e.target.checked)}
                sx={{ color: '#333' }}
              />
            } 
            label={<Typography sx={{ fontSize: '0.85rem' }}>Account Credit</Typography>} 
            sx={{ mr: 0 }}
          />
        </Box>
        
        {/* Refund Amount - Only show when Account Credit is checked */}
        {accountCredit && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Typography 
              sx={{ 
                fontSize: '0.85rem', 
                color: '#2c3e50', 
                fontWeight: 500 
              }}
            >
              Refund Amount:
            </Typography>
            
            <Box 
              sx={{ 
                border: '1.5px dashed #666',
                borderRadius: '2px',
                px: 1,
                py: 0.5,
                minWidth: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'transparent'
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold', 
                  color: '#1a237e' 
                }}
              >
                ${refundAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Bottom Row: Add Description and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            sx={{ 
              color: linkBlue, 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            + Add description
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#d4c197', 
                color: '#fff',
                textTransform: 'none', 
                fontWeight: 'normal',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#c5b396', boxShadow: 'none' } 
              }}
            >
              Add Refund
            </Button>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ 
                bgcolor: '#b3b3b3', 
                color: '#fff',
                textTransform: 'none', 
                fontWeight: 'normal',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#999', boxShadow: 'none' } 
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourtesyRefundDialog;