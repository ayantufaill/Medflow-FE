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
  const [procedures, setProcedures] = useState([]);

  const handleProcedureChange = (index, field, value) => {
    const newProcedures = [...procedures];
    const proc = { ...newProcedures[index] };
    
    if (['ded', 'allowed', 'wo', 'pay'].includes(field)) {
      if (!/^\d*\.?\d*$/.test(value) && value !== '') return;
    }
    
    proc[field] = value;

    const submittedNum = Number((proc.submitted || '').toString().replace(/[^0-9.-]+/g, "")) || 0;
    
    if (field === 'allowed') {
      const allowedNum = Number(value || 0);
      proc.wo = (submittedNum - allowedNum).toFixed(2);
      const dedNum = Number(proc.ded || 0);
      proc.pay = Math.max(0, allowedNum - dedNum).toFixed(2);
    } else if (field === 'wo') {
      const woNum = Number(value || 0);
      const allowedNum = submittedNum - woNum;
      proc.allowed = allowedNum.toFixed(2);
      const dedNum = Number(proc.ded || 0);
      proc.pay = Math.max(0, allowedNum - dedNum).toFixed(2);
    } else if (field === 'ded') {
      const dedNum = Number(value || 0);
      const allowedNum = Number(proc.allowed || 0);
      proc.pay = Math.max(0, allowedNum - dedNum).toFixed(2);
    }
    
    newProcedures[index] = proc;
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

  useEffect(() => {
    if (selectedClaim === 'select a claim' || !selectedClaim) {
      setProcedures([]);
      return;
    }
    const claim = claims.find(c => c.id === selectedClaim);
    if (!claim) {
      setProcedures([]);
      return;
    }
    
    let claimProcs = [];
    if (claim.procedures && claim.procedures.length > 0) {
      claimProcs = claim.procedures.filter(p => !p.dbi).map(p => ({
        code: `${p.ProcCode || p.code || p.cptCode || ''} - ${p.Descript || p.description || ''}`,
        submitted: `$${Number(p.ProcFee || p.charge || 0).toFixed(2)}`,
        bal: `$${Number(p.ProcFee || p.balance || p.charge || 0).toFixed(2)}`,
        ded: '0.00',
        allowed: Number(p.ProcFee || p.charge || 0).toFixed(2),
        wo: '0.00',
        pay: Number(p.ProcFee || p.charge || 0).toFixed(2)
      }));
    } else if (claim.selectedItems && claim.selectedItems.length > 0) {
      claimProcs = claim.selectedItems.filter(item => !item.dbi).map(item => ({
        code: `Item ID: ${item.itemId}`,
        submitted: `$${Number(item.amount || 0).toFixed(2)}`,
        bal: `$${Number(item.amount || 0).toFixed(2)}`,
        ded: '0.00',
        allowed: Number(item.amount || 0).toFixed(2),
        wo: '0.00',
        pay: Number(item.amount || 0).toFixed(2)
      }));
    } else if (claim.invoice && claim.invoice.lineItems) {
      claimProcs = claim.invoice.lineItems.filter(l => !l.dbi).map(l => ({
        code: `${l.code || ''} - ${l.description || l.name || ''}`,
        submitted: `$${Number(l.charge || l.totalPrice || 0).toFixed(2)}`,
        bal: `$${Number(l.balance || l.charge || 0).toFixed(2)}`,
        ded: '0.00',
        allowed: Number(l.charge || l.totalPrice || 0).toFixed(2),
        wo: '0.00',
        pay: Number(l.charge || l.totalPrice || 0).toFixed(2)
      }));
    }
    setProcedures(claimProcs);
  }, [selectedClaim, claims]);
  
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
      let finalInvoiceId = selectedClaimObj.invoiceId;
      if (typeof finalInvoiceId === 'object' && finalInvoiceId !== null) {
        finalInvoiceId = finalInvoiceId.id || finalInvoiceId._id;
      }
      if (!finalInvoiceId) {
        finalInvoiceId = selectedClaimObj.invoice?.id || selectedClaimObj.invoice?._id || selectedClaimObj.id || selectedClaimObj.ClaimNum;
      }                

      const totalPay = procedures.reduce((acc, proc) => acc + Number(proc.pay || 0), 0);
      
      let backendMethod = 'ach';
      const pLower = (paymentMethod || '').toLowerCase();
      if (pLower.includes('cash')) backendMethod = 'cash';
      else if (pLower.includes('check')) backendMethod = 'check';
      else if (pLower.includes('card') || pLower.includes('amex')) backendMethod = 'card';
      else if (pLower.includes('eft') || pLower.includes('ach')) backendMethod = 'ach';
      else if (pLower.includes('insurance')) backendMethod = 'insurance';

      const paymentData = {
        patientId: patientId.toString(),
        invoiceId: finalInvoiceId?.toString(),
        amount: totalPay,
        paymentMethod: backendMethod,
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
          selectedClaimObj={claims.find(c => c.id === selectedClaim)}
          patientName={patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : ''}
        />
      </DialogContent>

      <InsurancePaymentFooter 
        handleSwitchToSimpleBilling={handleSwitchToSimpleBilling}
        handleApplyAndPay={handleApplyAndPay}
        onClose={onClose}
        totalWo={procedures.reduce((acc, proc) => acc + Number(proc.wo || 0), 0)}
        totalPay={procedures.reduce((acc, proc) => acc + Number(proc.pay || 0), 0)}
      />

      {/* Simple Billing Alert Dialog */}
      <Dialog
        open={showSimpleBillingAlert}
        onClose={handleCancelSimpleBilling}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 140000, '& .MuiDialog-paper': { maxWidth: '650px', borderRadius: '14px' } }}
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
        <DialogContent sx={{ pt: '32px !important', px: '25px', pb: 2 }}>
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
        sx={{ zIndex: 140000, '& .MuiDialog-paper': { maxWidth: '500px', borderRadius: '14px', overflow: 'hidden' } }}
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
              sx={{ bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.8125rem', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Proceed
            </Button>
            <Button 
              onClick={handleCancelPayment}
              variant="outlined"
              sx={{ color: COLORS.TEXT_SECONDARY, borderColor: COLORS.BORDER, bgcolor: 'white', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.8125rem', '&:hover': { bgcolor: '#f5f5f5' } }}
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
