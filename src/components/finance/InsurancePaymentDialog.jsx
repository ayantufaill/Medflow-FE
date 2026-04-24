import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningIcon from '@mui/icons-material/Warning';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const InsurancePaymentDialog = ({ onClose }) => {
  const [selectedClaim, setSelectedClaim] = useState('select a claim');
  const [paymentMethod, setPaymentMethod] = useState('Master Card');
  const [showSimpleBillingAlert, setShowSimpleBillingAlert] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('swipe');
  const [rememberCard, setRememberCard] = useState(false);
  
  const greenHeader = '#8fb884';
  const warningRed = '#c0392b';
  const greenButton = '#8fb884';
  const tanButton = '#d4c197';
  const linkBlue = '#5c7cb6';

  const checkboxOptions = [
    { label: 'Update allowed fee' },
    { label: 'Update Ins. Flat Portion' },
    { label: 'Apply write-off', icon: true },
    { label: 'Partial Payment' }
  ];

  const handleSwitchToSimpleBilling = () => {
    setShowSimpleBillingAlert(true);
  };

  const handleConfirmSimpleBilling = () => {
    setShowSimpleBillingAlert(false);
    // Add logic for switching to simple billing here
  };

  const handleCancelSimpleBilling = () => {
    setShowSimpleBillingAlert(false);
  };

  const handleApplyAndPay = () => {
    setShowPaymentOptions(true);
  };

  const handleProceedPayment = () => {
    setShowPaymentOptions(false);
    // Add logic for proceeding with payment here
  };

  const handleCancelPayment = () => {
    setShowPaymentOptions(false);
  };

  return (
    <Box sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: greenHeader, py: 1, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontWeight: 500 }}>Add Payment</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* First Row: Date and Claim Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 2, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ fontSize: '1.2rem', color: '#888' }} />
            <Typography sx={{ color: '#8fb884', fontSize: '0.9rem', fontWeight: 500 }}>04/15/2026</Typography>
          </Box>

          <Typography sx={{ color: '#2c3e50', fontSize: '0.9rem' }}>
            <span style={{ color: '#8fb884', fontWeight: 500 }}>Payment</span> claim:
          </Typography>

          <Select
            variant="standard"
            value={selectedClaim}
            onChange={(e) => setSelectedClaim(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="select a claim">select a claim</MenuItem>
          </Select>

          <Typography sx={{ fontSize: '0.85rem' }}>with</Typography>

          <Select
            variant="standard"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="Master Card">Master Card</MenuItem>
            <MenuItem value="Visa">Visa</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </Select>

          {/* Checkbox Group */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {checkboxOptions.map((item) => (
              <FormControlLabel
                key={item.label}
                control={<Checkbox size="small" defaultChecked sx={{ p: 0.5 }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem' }}>{item.label}</Typography>
                    {item.icon && <HelpOutlineIcon sx={{ fontSize: '0.9rem', ml: 0.5, color: '#333' }} />}
                  </Box>
                }
                sx={{ m: 0 }}
              />
            ))}
          </Box>
        </Box>

        {/* Warning Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          py: 1.5, 
          px: 2, 
          borderTop: '1px solid #8fb884', 
          borderBottom: '1px solid #8fb884',
          mb: 2 
        }}>
          <WarningIcon sx={{ color: '#d35400', fontSize: '2rem' }} />
          <Typography sx={{ color: '#c0392b', fontSize: '1rem', fontWeight: 400 }}>
            There are no claims on the patient's account. Please create one before applying insurance payment.
          </Typography>
        </Box>

        {/* Footer Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Typography sx={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#333' }}>
            Before applying payment, please make sure the deductibles and total insurance payment match your EOB
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button 
                variant="contained" 
                onClick={handleSwitchToSimpleBilling}
                sx={{ bgcolor: tanButton, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2 }}
              >
                Switch to simple billing
              </Button>
              <Typography sx={{ color: linkBlue, fontSize: '0.85rem', cursor: 'pointer' }}>
                + Add description
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                onClick={handleApplyAndPay}
                sx={{ bgcolor: greenButton, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 3 }}
              >
                Apply and Pay
              </Button>
              <Button 
                variant="contained" 
                onClick={onClose}
                sx={{ bgcolor: '#b3b3b3', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 3 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Simple Billing Alert Dialog */}
      <Dialog
        open={showSimpleBillingAlert}
        onClose={handleCancelSimpleBilling}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { maxWidth: '650px' } }}
      >
        <DialogTitle sx={{ bgcolor: '#e83b4cff', color: '#fcfcfcff', fontWeight: 600, textAlign: 'center' }}>
          Alert
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            In simple mode, the system will automatically assign a payment amount per procedure. By switching to simple mode, you will have no control over the way the software will split the total payment.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelSimpleBilling}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSimpleBilling}
            variant="contained"
            sx={{ bgcolor: greenButton, color: '#fff', textTransform: 'none', boxShadow: 'none' }}
          >
            Confirm and proceed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Options Dialog */}
      <Dialog
        open={showPaymentOptions}
        onClose={handleCancelPayment}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { maxWidth: '500px' } }}
      >
        <DialogTitle sx={{ bgcolor: '#8eb378', color: '#fff', fontWeight: 600, textAlign: 'center', py: 1.5 }}>
          Payment Options
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel
              control={
                <Radio
                  checked={selectedPaymentOption === 'manual'}
                  onChange={() => setSelectedPaymentOption('manual')}
                  value="manual"
                  sx={{ mr: 1 }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.95rem' }}>
                  Type card number or use a magtek swiper
                </Typography>
              }
              sx={{ m: 0 }}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={selectedPaymentOption === 'swipe'}
                  onChange={() => setSelectedPaymentOption('swipe')}
                  value="swipe"
                  sx={{ mr: 1 }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.95rem' }}>
                  Swipe/insert card
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberCard}
                onChange={(e) => setRememberCard(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography sx={{ fontSize: '0.85rem', color: '#888' }}>
                Remember card for next time
              </Typography>
            }
            sx={{ flexGrow: 1, m: 0 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={handleProceedPayment}
              variant="contained"
              sx={{ bgcolor: '#d1bc8a', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 3 }}
            >
              Proceed
            </Button>
            <Button 
              onClick={handleCancelPayment}
              variant="contained"
              sx={{ bgcolor: '#a9a9a9', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 3 }}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsurancePaymentDialog;
