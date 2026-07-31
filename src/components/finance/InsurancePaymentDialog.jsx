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
  Radio,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningIcon from '@mui/icons-material/Warning';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { claimService } from '../../services/claim.service';
import { paymentService } from '../../services/payment.service';
import { COLORS } from '../../constants/colors';

import InsurancePaymentTopRow from './insurance-payment/InsurancePaymentTopRow';
import InsurancePaymentTable from './insurance-payment/InsurancePaymentTable';
import InsurancePaymentFooter from './insurance-payment/InsurancePaymentFooter';

const InsurancePaymentDialog = ({ patient, onClose, onSave }) => {
  const [selectedClaim, setSelectedClaim] = useState('select a claim');
  const [paymentMethod, setPaymentMethod] = useState('EFT');
  const [paymentAmount, setPaymentAmount] = useState('0.00');
  const [procedures, setProcedures] = useState([
    { code: 'D0120 - periodic ex', submitted: '$42.00', bal: '$42.00', ded: '0.00', allowed: '42.00', wo: '0.00', pay: '42.00' },
    { code: 'D1110 - hygiene', submitted: '$100.00', bal: '$100.00', ded: '0.00', allowed: '100.00', wo: '0.00', pay: '100.00' }
  ]);

  const handleProcedureChange = (index, field, value) => {
    const newProcedures = [...procedures];
    newProcedures[index][field] = value;
    setProcedures(newProcedures);
  };
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
    <Box sx={{ width: '100%', minWidth: '1250px', border: `1px solid ${COLORS.BORDER}`, borderRadius: '14px', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <DialogTitle sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
      }}>
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Add insurance payment
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 0, maxHeight: 'calc(90vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <InsurancePaymentTopRow 
          claims={claims}
          selectedClaim={selectedClaim}
          setSelectedClaim={setSelectedClaim}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          checkboxOptions={checkboxOptions}
        />

        <Box sx={{ borderTop: `1px solid ${COLORS.BORDER}`, mt: 2.5, mb: 2.5 }} />

        <InsurancePaymentTable 
          procedures={procedures}
          handleProcedureChange={handleProcedureChange}
        />
      </DialogContent>

      <InsurancePaymentFooter 
        handleSwitchToSimpleBilling={handleSwitchToSimpleBilling}
        handleApplyAndPay={handleApplyAndPay}
        onClose={onClose}
      />

      {/* Simple Billing Alert Dialog */}
      <Dialog
        open={showSimpleBillingAlert}
        onClose={handleCancelSimpleBilling}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 1600, '& .MuiDialog-paper': { maxWidth: '650px' } }}
      >
        <DialogTitle sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Alert
          </Typography>
          <IconButton onClick={handleCancelSimpleBilling} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
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
            sx={{ bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#1565c0' } }}
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
        sx={{ zIndex: 1600, '& .MuiDialog-paper': { maxWidth: '500px' } }}
      >
        <DialogTitle sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Payment Options
          </Typography>
          <IconButton onClick={handleCancelPayment} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
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
