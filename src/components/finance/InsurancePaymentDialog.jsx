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
    <Box sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: headerBackground, py: 1.5, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>Add Payment</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Top Info Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, borderBottom: '1px solid #eee', pb: 1.5, flexWrap: 'wrap' }}>
          <Typography sx={{ color: '#8fb884', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
            07/15/2022
          </Typography>
          <Typography sx={{ color: '#8fb884', fontSize: '0.75rem', fontWeight: 500, ml: 1, whiteSpace: 'nowrap' }}>
            Payment claim:
          </Typography>

          <Select 
            variant="standard" 
            value={selectedClaim}
            onChange={(e) => setSelectedClaim(e.target.value)}
            sx={{ fontSize: '0.75rem', minWidth: 250, '& .MuiSelect-select': { pb: 0.5, pt: 0.5 } }}
            MenuProps={{ disablePortal: true, PaperProps: { sx: { bgcolor: '#fff', '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 }, '& .Mui-selected': { bgcolor: '#5c6bc0 !important', color: '#fff' } } } }}
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
            <MenuItem value="select a claim">Claim #3127, Billing Training Oryx by Delta Dental of Washington</MenuItem>
          </Select>

          <Typography sx={{ fontSize: '0.75rem' }}>with</Typography>
          <Select 
            variant="standard" 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.75rem', minWidth: 100, '& .MuiSelect-select': { pb: 0.5, pt: 0.5 } }}
            MenuProps={{ disablePortal: true, PaperProps: { sx: { bgcolor: '#fff', '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 }, '& .Mui-selected': { bgcolor: '#5c6bc0 !important', color: '#fff' } } } }}
          >
            <MenuItem value="EFT">EFT</MenuItem>
            <MenuItem value="Debit Card (debit)">Debit Card (debit)</MenuItem>
            <MenuItem value="Visa Card">Visa Card</MenuItem>
            <MenuItem value="Master Card">Master Card</MenuItem>
            <MenuItem value="Amex">Amex</MenuItem>
            <MenuItem value="Patient Check">Patient Check</MenuItem>
            <MenuItem value="Insurance Check">Insurance Check</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Account Credit">Account Credit</MenuItem>
            <MenuItem value="Account Correction">Account Correction</MenuItem>
            <MenuItem value="Courtesy Credit">Courtesy Credit</MenuItem>
            <MenuItem value="INP Special">INP Special</MenuItem>
            <MenuItem value="Insurance Refund/Back to Office">Insurance Refund/Back to Office</MenuItem>
            <MenuItem value="Test Jen">Test Jen</MenuItem>
            <MenuItem value="HSA">HSA</MenuItem>
            <MenuItem value="Testing Credit">Testing Credit</MenuItem>
            <MenuItem value="Collection Agency Payment">Collection Agency Payment</MenuItem>
          </Select>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {checkboxOptions.map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox size="small" sx={{ p: 0.2 }} />
                <Typography sx={{ fontSize: '0.75rem' }}>{item.label}</Typography>
                {item.icon && <HelpOutlineIcon sx={{ fontSize: '0.8rem', ml: 0.5, color: '#666' }} />}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Invoice Summary Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#333' }}>
            Invoice #3125 : 07/15/2022 for Melina Cuellar
          </Typography>
        </Box>

        {/* Table Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
          <Box sx={{ width: '150px' }}></Box>
          <Box sx={{ width: '40px' }}></Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Submitted</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Balance</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Deductible</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Allowed</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'left', color: '#555' }}>Ins WO</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '110px', textAlign: 'left', color: '#555' }}>Ins pay</Typography>
          <Box sx={{ flex: 1 }}></Box>
        </Box>

        {/* Procedure Rows */}
        {procedures.map((proc, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f5f5f5', py: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', width: '150px', color: '#333', pl: 2 }}>{proc.code}</Typography>
            <Typography sx={{ fontSize: '0.75rem', width: '40px', color: '#666' }}>RSL</Typography>
            <Typography sx={{ fontSize: '0.75rem', width: '100px', color: '#666' }}>{proc.submitted}</Typography>
            <Typography sx={{ fontSize: '0.75rem', width: '100px', color: '#666' }}>{proc.bal}</Typography>
            <Box sx={{ width: '100px' }}>
              <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                <input type="text" value={proc.ded} onChange={(e) => handleProcedureChange(i, 'ded', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
              </Box>
            </Box>
            <Box sx={{ width: '100px' }}>
              <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                <input type="text" value={proc.allowed} onChange={(e) => handleProcedureChange(i, 'allowed', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
              </Box>
            </Box>
            <Box sx={{ width: '100px' }}>
              <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                <input type="text" value={proc.wo} onChange={(e) => handleProcedureChange(i, 'wo', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
              </Box>
            </Box>
            <Box sx={{ width: '110px' }}>
              <Box sx={{ bgcolor: '#8eb378', border: '1px dashed #7ea368', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', width: '70px' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', mr: 0.25 }}>$</Typography>
                <input type="text" value={proc.pay} onChange={(e) => handleProcedureChange(i, 'pay', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, color: '#fff', padding: 0 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox size="small" sx={{ p: 0.2 }} />
                <Typography sx={{ fontSize: '0.75rem' }}>Update allowed fee</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox size="small" sx={{ p: 0.2 }} />
                <Typography sx={{ fontSize: '0.75rem' }}>Update Ins. Flat Portion</Typography>
              </Box>
            </Box>
          </Box>
        ))}

        {/* Total Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee', mb: 3 }}>
          <Box sx={{ width: '150px', textAlign: 'right', pr: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Total</Typography>
          </Box>
          <Box sx={{ width: '40px' }}></Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$142.00</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$142.00</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$0.00</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$142.00</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', color: '#555' }}>$0.00</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '110px', color: '#555' }}>$142.00</Typography>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleSwitchToSimpleBilling}
              sx={{ bgcolor: tanButton, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.75rem', '&:hover': { bgcolor: '#c3b086' } }}
            >
              Switch to simple billing
            </Button>
            <Typography sx={{ color: linkBlue, fontSize: '0.8125rem', cursor: 'pointer' }}>
              + Add description
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Typography sx={{ fontStyle: 'italic', fontSize: '0.75rem', color: '#555' }}>
              Before applying payment, please make sure the deductibles and total insurance payment match your EOB
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#d32f2f' }}>Ins Writeoff: $0.00</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#8eb378' }}>Ins Payment: $142.00</Typography>
              
              <Button 
                variant="contained" 
                onClick={handleApplyAndPay}
                sx={{ bgcolor: '#8eb378', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.75rem', '&:hover': { bgcolor: '#7ea368' } }}
              >
                Apply
              </Button>
              <Button 
                variant="contained" 
                onClick={onClose}
                sx={{ bgcolor: '#a9a9a9', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.75rem' }}
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
