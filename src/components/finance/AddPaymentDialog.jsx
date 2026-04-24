import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  Button,
  TextField
} from '@mui/material';

const AddPaymentDialog = ({ onClose, onPaymentApply }) => {
  const [amount, setAmount] = useState('0');
  const [selectedPatient, setSelectedPatient] = useState('test test');
  const [paymentMethod, setPaymentMethod] = useState('Master Card');
  const [generateStatement, setGenerateStatement] = useState(false);
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const [paymentType, setPaymentType] = useState('patient amount');
  const [paymentAmount, setPaymentAmount] = useState('0.00');
  const [overpayment, setOverpayment] = useState('0.00');
  
  const greenHeader = '#8eb378';
  const greenText = '#8eb378';
  const warningColor = '#c66d6d';
  const applyButtonColor = '#abc49d';
  const cancelButtonColor = '#a9a9a9';
  const linkBlue = '#5b7bb1';

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    // Calculate payment and overpayment
    const numAmount = parseFloat(value) || 0;
    if (numAmount > 0) {
      setPaymentAmount(numAmount.toFixed(2));
      setOverpayment('0.00');
    } else {
      setPaymentAmount('0.00');
      setOverpayment('0.00');
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleApplyAndPay = () => {
    const paymentData = {
      amount: parseFloat(amount) || 0,
      patient: selectedPatient,
      paymentMethod: paymentMethod,
      paymentType: paymentType,
      generateStatement: generateStatement,
      description: description,
      paymentAmount: parseFloat(paymentAmount) || 0,
      overpayment: parseFloat(overpayment) || 0
    };

    if (onPaymentApply) {
      onPaymentApply(paymentData);
    }
    
    // Close the dialog after applying
    onClose();
  };

  return (
    <Box sx={{ width: '100%', minWidth: '1100px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: greenHeader, py: 1.25, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 400 }}>
          Add Payment
        </Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Top Info Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <Typography sx={{ color: greenText, fontSize: '0.875rem', fontWeight: 500 }}>
            04/15/2026
          </Typography>
          <Typography sx={{ color: greenText, fontSize: '0.875rem' }}>
            Payment
          </Typography>
          <Typography sx={{ fontSize: '0.875rem' }}>
            from
          </Typography>
          <Select
            variant="standard"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            sx={{ fontSize: '0.875rem', minWidth: 100 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="test test">test test</MenuItem>
          </Select>
          <Typography sx={{ fontSize: '0.875rem' }}>
            with
          </Typography>
          <Select
            variant="standard"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.875rem', minWidth: 120 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="Master Card">Master Card</MenuItem>
          </Select>

          <Typography sx={{ 
            color: warningColor, 
            fontSize: '0.75rem', 
            flexGrow: 1, 
            textAlign: 'right',
            lineHeight: 1.4,
            ml: 2
          }}>
            There is no outstanding balance on the patient's account. Please cancel this window and add as a deposit.
          </Typography>
        </Box>

        <Box sx={{ borderTop: `1px solid ${greenHeader}`, my: 2.5 }} />

        {/* Amount Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
          <Checkbox 
            checked={isChecked} 
            onChange={handleCheckboxChange}
            size="small" 
            sx={{ p: 0 }} 
          />
          <Select
            variant="standard"
            value={paymentType}
            onChange={handlePaymentTypeChange}
            sx={{ fontSize: '0.875rem', width: 120 }}
            MenuProps={{ disablePortal: true }}
            disabled={!isChecked}
          >
            <MenuItem value="patient amount">patient amount</MenuItem>
            <MenuItem value="insurance amount">insurance amount</MenuItem>
          </Select>
          <Box sx={{ border: '1px dashed #666', padding: '5px 10px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', mr: 0.5 }}>$</Typography>
            <TextField
              value={amount}
              onChange={handleAmountChange}
              sx={{ 
                input: { 
                  border: 'none', 
                  outline: 'none', 
                  width: '80px',
                  fontSize: '0.875rem',
                  p: 0
                },
                '& fieldset': { border: 'none' }
              }}
            />
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          gap: 2.5, 
          mt: 2.5, 
          borderTop: `1px solid ${greenHeader}`,
          pt: 2
        }}>
          <TextField
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="standard"
            sx={{ 
              width: 150,
              mr: 'auto',
              input: { fontSize: '0.875rem' }
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={generateStatement}
                onChange={(e) => setGenerateStatement(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography sx={{ color: linkBlue, fontSize: '0.875rem' }}>
                Generate Statement
              </Typography>
            }
          />

          <Typography sx={{ color: '#4a6b96', fontWeight: 'bold', fontSize: '0.875rem' }}>
            Overpayment: ${overpayment}
          </Typography>
          <Typography sx={{ color: greenText, fontSize: '0.875rem', fontWeight: 500 }}>
            Payment: ${paymentAmount}
          </Typography>

          <Button 
            variant="contained" 
            onClick={handleApplyAndPay}
            disabled={parseFloat(amount) <= 0}
            sx={{ 
              bgcolor: applyButtonColor, 
              color: '#fff', 
              textTransform: 'none', 
              boxShadow: 'none', 
              px: 2.25,
              fontSize: '0.8125rem',
              '&:disabled': {
                cursor: 'not-allowed'
              }
            }}
          >
            Apply and Pay
          </Button>
          
          <Button 
            variant="contained" 
            onClick={onClose}
            sx={{ 
              bgcolor: cancelButtonColor, 
              color: '#fff', 
              textTransform: 'none', 
              boxShadow: 'none', 
              px: 2.25,
              fontSize: '0.8125rem'
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPaymentDialog;
