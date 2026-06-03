import React, { useState, useEffect } from 'react';
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
import { claimService } from '../../services/claim.service';
import { paymentService } from '../../services/payment.service';

const InsurancePaymentDialog = ({ patient, onClose, onSave }) => {
  const [selectedClaim, setSelectedClaim] = useState('select a claim');
  const [paymentMethod, setPaymentMethod] = useState('insurance');
  const [paymentAmount, setPaymentAmount] = useState('0.00');
  const [showSimpleBillingAlert, setShowSimpleBillingAlert] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('swipe');
  const [rememberCard, setRememberCard] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      const patientId = patient?._id || patient?.id;
      if (!patientId) return;
      try {
        setLoadingClaims(true);
        const data = await claimService.getAllClaims({ patientId, limit: 1000 });
        const claimsList = data.claims || [];
        setClaims(claimsList);
        if (claimsList.length > 0) {
          setSelectedClaim(claimsList[0].id);
        }
      } catch (err) {
        console.error('Error fetching claims:', err);
      } finally {
        setLoadingClaims(false);
      }
    };
    fetchClaims();
  }, [patient]);
  
  const headerBackground = '#7788bb';
  const greenHeader = '#8fb884';
  const warningRed = '#c0392b';
  const greenButton = '#7788bb';
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

  const handleProceedPayment = async () => {
    const patientId = patient?._id || patient?.id;
    const selectedClaimObj = claims.find(c => c.id === selectedClaim);
    
    if (!patientId || !selectedClaimObj) {
      console.error('Missing patient ID or claim object');
      return;
    }

    try {
      const paymentData = {
        patientId: patientId.toString(),
        invoiceId: selectedClaimObj.invoiceId?.toString() || selectedClaimObj.invoice?.id?.toString() || selectedClaimObj.invoice?._id?.toString(),
        amount: parseFloat(paymentAmount) || 0,
        paymentMethod: paymentMethod,
        paymentSource: 'insurance_company',
        paymentDate: new Date().toISOString(),
        insuranceCompanyId: selectedClaimObj.insuranceCompanyId?.toString() || selectedClaimObj.insuranceCompany?.id?.toString() || selectedClaimObj.insuranceCompany?._id?.toString(),
        notes: `Insurance Claim #${selectedClaimObj.id} Payment. Options: ${checkboxOptions.map(opt => opt.label).join(', ')}`
      };

      // Call API to create payment
      await paymentService.createPayment(paymentData);

      // Update claim paidAmount and status to paid
      await claimService.updateClaim(selectedClaimObj.id, {
        status: 'paid',
        paidAmount: parseFloat(paymentAmount) || 0,
        paidDate: new Date().toISOString()
      });

      if (onSave) {
        onSave(paymentData);
      }
    } catch (err) {
      console.error('Error applying insurance payment:', err);
    }
    
    setShowPaymentOptions(false);
  };

  const handleCancelPayment = () => {
    setShowPaymentOptions(false);
  };

  return (
    <Box sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: headerBackground, py: 1, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontWeight: 500 }}>Add Payment</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* First Row: Date and Claim Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 2, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ fontSize: '1.2rem', color: '#888' }} />
            <Typography sx={{ color: '#7788bb', fontSize: '0.9rem', fontWeight: 500 }}>
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          <Typography sx={{ color: '#2c3e50', fontSize: '0.9rem' }}>
            <span style={{ color: '#7788bb', fontWeight: 500 }}>Payment</span> claim:
          </Typography>

          <Select
            variant="standard"
            value={selectedClaim}
            onChange={(e) => setSelectedClaim(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
            MenuProps={{ disablePortal: true }}
          >
            {claims.length === 0 ? (
              <MenuItem value="select a claim">select a claim</MenuItem>
            ) : (
              claims.map((claim) => (
                <MenuItem key={claim.id} value={claim.id}>
                  Claim #{claim.id} ({claim.status})
                </MenuItem>
              ))
            )}
          </Select>

          <Typography sx={{ fontSize: '0.85rem' }}>with</Typography>

          <Select
            variant="standard"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value="insurance">Insurance</MenuItem>
            <MenuItem value="check">Check</MenuItem>
            <MenuItem value="card">Credit Card</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
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

        {/* Payment Amount Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
          <Typography 
            sx={{ 
              fontSize: '0.85rem', 
              color: '#2c3e50', 
              fontWeight: 500 
            }}
          >
            Payment Amount:
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
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1a237e', mr: 0.5 }}>$</Typography>
            <input
              type="text"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: '#1a237e',
                textAlign: 'center',
                width: '60px',
                fontFamily: 'inherit'
              }}
            />
          </Box>
        </Box>

        {/* Warning Section */}
        {!loadingClaims && claims.length === 0 && (
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
            <WarningIcon sx={{ color: '#d35400', fontSize: '1.5rem' }} />
            <Typography sx={{ color: '#c0392b', fontSize: '0.85rem', fontWeight: 400 }}>
              There are no claims on the patient's account. Please create one before applying insurance payment.
            </Typography>
          </Box>
        )}

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
                disabled={claims.length === 0 || parseFloat(paymentAmount) <= 0}
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
        <DialogTitle sx={{ bgcolor: '#7788bb', color: '#fff', fontWeight: 600, textAlign: 'center', py: 1, fontSize: '16px' }}>
          Alert
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
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
        <DialogTitle sx={{ bgcolor: '#7788bb', color: '#fff', fontWeight: 600, textAlign: 'center', py: 1, fontSize: '16px' }}>
          Payment Options
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
              sx={{ bgcolor: '#7788bb', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 3 }}
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
