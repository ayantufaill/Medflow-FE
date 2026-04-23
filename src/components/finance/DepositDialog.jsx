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

const DepositDialog = ({ onClose, depositType = 'patient-deposit' }) => {
  const [fromPatient, setFromPatient] = useState('test test');
  const [paymentMethod, setPaymentMethod] = useState('Do not use');
  const [toAccount, setToAccount] = useState('');
  const [policy, setPolicy] = useState('');
  const [depositAmount, setDepositAmount] = useState(0);
  
  const blueHeader = '#5c7cb6';
  const blueText = '#3a5a8c';
  const linkBlue = '#5c7cb6';

  // Deposit amount options - can be fetched from API
  const depositAmounts = [
    { label: 'Full Amount', value: 100.00 },
    { label: 'Partial Amount', value: 50.00 },
    { label: 'Custom Amount', value: 0.00 }
  ];

  return (
    <Box sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: blueHeader, py: 1, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontWeight: 500 }}>
          {depositType === 'insurance-deposit' ? 'Insurance Deposit' : 'Deposit #24634'}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Main Inline Selection Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'nowrap', 
          gap: 1, 
          borderBottom: '1px solid #5c7cb6', 
          pb: 1,
          mb: 2 
        }}>
          <Typography sx={{ color: blueText, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            04/15/2026
          </Typography>
          
          <Typography sx={{ color: blueText, fontSize: '0.85rem', whiteSpace: 'nowrap', ml: 1 }}>
            Deposit #24634 from
          </Typography>

          <Select
            variant="standard"
            value={fromPatient}
            onChange={(e) => setFromPatient(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 80, height: 24 }}
            MenuProps={{ 
              disablePortal: true,
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontSize: '0.85rem',
                    py: 0.5,
                    px: 1
                  }
                }
              }
            }}
          >
            <MenuItem value="test test">test test</MenuItem>
          </Select>

          <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>with</Typography>

          <Select
            variant="standard"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 100, height: 24 }}
            MenuProps={{ 
              disablePortal: true,
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontSize: '0.85rem',
                    py: 0.5,
                    px: 1
                  }
                }
              }
            }}
          >
            <MenuItem value="Do not use">Do not use</MenuItem>
            <MenuItem value="Check">Check</MenuItem>
            <MenuItem value="Account Credit">Account Credit</MenuItem>
            <MenuItem value="Debit Card">Debit Card</MenuItem>
            <MenuItem value="EFT">EFT</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Care Credit">Care Credit</MenuItem>
            <MenuItem value="Master Card">Master Card</MenuItem>
            <MenuItem value="Visa Card">Visa Card</MenuItem>
            <MenuItem value="American Express">American Express</MenuItem>
            <MenuItem value="Discover">Discover</MenuItem>
            <MenuItem value="Sunbit">Sunbit</MenuItem>
            <MenuItem value="Cherry">Cherry</MenuItem>
            <MenuItem value="Successful Transaction">Successful Transaction</MenuItem>
            <MenuItem value="HFD">HFD</MenuItem>
            <MenuItem value="VCC">VCC</MenuItem>
          </Select>

          <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>to</Typography>

          <Select
            variant="standard"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.85rem', minWidth: 100, height: 24 }}
            MenuProps={{ 
              disablePortal: true,
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontSize: '0.85rem',
                    py: 0.5,
                    px: 1
                  }
                }
              }
            }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="account1">Account 1</MenuItem>
            <MenuItem value="account2">Account 2</MenuItem>
          </Select>

          {depositType === 'insurance-deposit' && (
            <>
              <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap', ml: 1 }}>Policy</Typography>

              <Select
                variant="standard"
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                displayEmpty
                sx={{ fontSize: '0.85rem', minWidth: 100, height: 24 }}
                MenuProps={{ 
                  disablePortal: true,
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root': {
                        fontSize: '0.85rem',
                        py: 0.5,
                        px: 1
                      }
                    }
                  }
                }}
              >
                <MenuItem value=""><em>Select Policy</em></MenuItem>
                <MenuItem value="policy1">Policy 1</MenuItem>
                <MenuItem value="policy2">Policy 2</MenuItem>
              </Select>
            </>
          )}
        </Box>
        
        {/* Deposit Amount - Always visible */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Typography 
              sx={{ 
                fontSize: '0.85rem', 
                color: '#2c3e50', 
                fontWeight: 500 
              }}
            >
              Deposit Amount:
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
                ${depositAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>

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
                bgcolor: blueHeader, 
                color: '#fff',
                textTransform: 'none', 
                fontWeight: 'normal',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#4a6a9e', boxShadow: 'none' } 
              }}
            >
              Add Deposit
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

export default DepositDialog;
