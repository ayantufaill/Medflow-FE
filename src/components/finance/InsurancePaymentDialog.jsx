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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useDispatch } from 'react-redux';
import { claimService } from '../../services/claim.service';
import { paymentService } from '../../services/payment.service';
import {
  invalidatePatientBalance,
  invalidateInsuranceUsage,
  fetchPatientBalance,
  fetchInsuranceUsage
} from '../../store/slices/patientSlice';
import { COLORS } from '../../constants/colors';
import { useSnackbar } from '../../contexts/SnackbarContext';

import InsurancePaymentTopRow from './insurance-payment/InsurancePaymentTopRow';
import InsurancePaymentTable from './insurance-payment/InsurancePaymentTable';
import InsurancePaymentFooter from './insurance-payment/InsurancePaymentFooter';
import SecondaryClaimPromptDialog from './SecondaryClaimPromptDialog';

const InsurancePaymentDialog = ({ patient, onClose, onSave }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState('select a claim');
  const [paymentMethod, setPaymentMethod] = useState('EFT');
  const [paymentAmount, setPaymentAmount] = useState('0.00');
  const [procedures, setProcedures] = useState([]);
  const [updateAllowedFee, setUpdateAllowedFee] = useState(false);
  const [updateInsFlatPortion, setUpdateInsFlatPortion] = useState(false);
  const [applyWriteOff, setApplyWriteOff] = useState(false);
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [showOverpaymentAlert, setShowOverpaymentAlert] = useState(false);
  const [overpaymentAction, setOverpaymentAction] = useState(null); // 'credit' | 'refund'
  const [showSecondaryPrompt, setShowSecondaryPrompt] = useState(false);
  const [createdPaymentInfo, setCreatedPaymentInfo] = useState(null);

  const handleProcedureChange = (index, field, value) => {
    const newProcedures = [...procedures];
    const proc = { ...newProcedures[index] };
    
    proc[field] = value;

    // If user checks "Move to new claim", zero out their payment for this procedure
    if (field === 'moveToNewClaim' && value === true) {
      proc['pay'] = '0.00';
      proc['allowed'] = '0.00';
      proc['wo'] = '0.00';
    }
    
    if (['ded', 'allowed', 'wo', 'pay'].includes(field)) {
      if (!/^\d*\.?\d*$/.test(value) && value !== '') return;
    }
    
    proc[field] = value;

    const submittedNum = Number((proc.submitted || '').toString().replace(/[^0-9.-]+/g, "")) || 0;
    
    if (field === 'allowed') {
      const allowedNum = Number(value || 0);
      proc.wo = Math.max(0, submittedNum - allowedNum).toFixed(2);
    } else if (field === 'wo') {
      const woNum = Number(value || 0);
      const allowedNum = Math.max(0, submittedNum - woNum);
      proc.allowed = allowedNum.toFixed(2);
    } else if (field === 'ded') {
      // ded is updated directly
    } else if (field === 'pay') {
      // pay is updated directly - do NOT change proc.wo on pay change!
      // Underpayments transfer to patient responsibility, not write-offs.
    }
    
    newProcedures[index] = proc;
    setProcedures(newProcedures);
  };

  const handleProcedureBlur = (index, field) => {
    const newProcedures = [...procedures];
    const proc = { ...newProcedures[index] };
    if (['ded', 'allowed', 'wo', 'pay'].includes(field)) {
      const num = parseFloat(proc[field]);
      proc[field] = isNaN(num) ? '0.00' : num.toFixed(2);
      newProcedures[index] = proc;
      setProcedures(newProcedures);
    }
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
    
    // Determine overall claim-level payments and insurance balance
    const claimPaidAmount = Number(claim.paidAmount || claim.insPaid || claim.invoice?.insurancePaid || claim.invoice?.insPaid || 0);
    const claimInsBalance = (claim.insuranceBalance !== undefined && claim.insuranceBalance !== null)
      ? Number(claim.insuranceBalance)
      : (claim.insbalance !== undefined && claim.insbalance !== null
        ? Number(claim.insbalance)
        : (claim.invoice?.insuranceBalance !== undefined && claim.invoice?.insuranceBalance !== null
          ? Number(claim.invoice.insuranceBalance)
          : null));

    let claimProcs = [];
    if (claim.procedures && claim.procedures.length > 0) {
      const eligibleProcs = claim.procedures.filter(
        p => !p.dbi && String(p.dbi) !== 'true' && (p.insPayEst === undefined || Number(p.insPayEst) > 0)
      );

      const totalExplicitPaid = eligibleProcs.reduce((sum, p) => sum + Number(p.insPayAmt || p.insPaid || 0), 0);
      const unallocatedClaimPaid = Math.max(0, claimPaidAmount - totalExplicitPaid);
      const totalClaimEst = eligibleProcs.reduce((sum, p) => {
        const sub = Number(p.fee || p.ProcFee || p.charge || 0);
        const eWo = Number(p.writeOffEst ?? p.writeoff ?? p.writeOff ?? 0);
        return sum + (p.insPayEst !== undefined && p.insPayEst !== null ? Number(p.insPayEst) : Math.max(0, sub - eWo));
      }, 0);

      claimProcs = eligibleProcs.map(p => {
        const submittedNum = Number(p.fee || p.ProcFee || p.charge || 0);
        const existingWo = Number(p.writeOffEst ?? p.writeoff ?? p.writeOff ?? 0);
        const allowedNum = p.allowedOverride !== undefined && p.allowedOverride !== null && Number(p.allowedOverride) > 0
          ? Number(p.allowedOverride)
          : (p.feeAllowed !== undefined && p.feeAllowed !== null && Number(p.feeAllowed) > 0
            ? Number(p.feeAllowed)
            : Math.max(0, submittedNum - existingWo));
        const woNum = existingWo;
        const initialEst = p.insPayEst !== undefined && p.insPayEst !== null
          ? Number(p.insPayEst)
          : Math.max(0, allowedNum - woNum);

        let procAlreadyPaid = Number(p.insPayAmt ?? p.insPaid ?? 0);
        if (procAlreadyPaid === 0 && unallocatedClaimPaid > 0) {
          if (eligibleProcs.length === 1) {
            procAlreadyPaid = unallocatedClaimPaid;
          } else if (totalClaimEst > 0) {
            procAlreadyPaid = Math.round((unallocatedClaimPaid * (initialEst / totalClaimEst)) * 100) / 100;
          }
        }

        let remainingPay = Math.max(0, Math.round((initialEst - procAlreadyPaid) * 100) / 100);
        if (eligibleProcs.length === 1 && claimInsBalance !== null && !isNaN(claimInsBalance) && claimPaidAmount > 0) {
          remainingPay = Math.max(0, Math.round(claimInsBalance * 100) / 100);
        }

        let procInvoiceId = p.invoiceId;
        if (!procInvoiceId && claim.selectedItems?.length > 0) {
          const found = claim.selectedItems.find(si => String(si.itemId) === String(p.id || p._id || p.ProcNum));
          if (found) procInvoiceId = found.invoiceId;
        }
        if (!procInvoiceId) {
          procInvoiceId = claim.invoiceId || (claim.invoice?._id || claim.invoice?.id);
        }

        return {
          id: p.id || p._id || p.ProcNum || p.procedureId,
          invoiceId: procInvoiceId ? String(procInvoiceId) : undefined,
          invoiceNumber: p.invoiceNumber,
          invoiceDate: p.invoiceDate,
          code: `${p.ProcCode || p.code || p.cptCode || ''} - ${p.Descript || p.description || p.name || ''}`,
          submitted: `$${submittedNum.toFixed(2)}`,
          bal: `$${Number(p.balance || submittedNum).toFixed(2)}`,
          ded: '0.00',
          allowed: allowedNum.toFixed(2),
          wo: woNum.toFixed(2),
          pay: remainingPay.toFixed(2),
          insPortionEst: (remainingPay + existingWo).toFixed(2),
          updateAllowedFee: false,
          updateInsFlatPortion: false,
          moveToNewClaim: false
        };
      });
    } else if (claim.invoice && claim.invoice.lineItems && claim.invoice.lineItems.length > 0) {
      const isSecondary = claim.insuranceType === 'secondary' || String(claim.ClaimType || claim.claimType || '').toLowerCase() === 'secondary';
      const eligibleItems = claim.invoice.lineItems.filter(
        l => !l.dbi && String(l.dbi) !== 'true' && (
          isSecondary 
            ? (l.secondaryInsPortion !== undefined && Number(l.secondaryInsPortion) > 0)
            : ((l.insPayEst === undefined || Number(l.insPayEst) > 0) && (l.insPortion === undefined || Number(l.insPortion) > 0))
        )
      );
      const totalExplicitPaid = eligibleItems.reduce((sum, l) => sum + Number(l.insPayAmt || l.insPaid || l.insurancePaid || 0), 0);
      const unallocatedClaimPaid = Math.max(0, claimPaidAmount - totalExplicitPaid);
      const totalClaimEst = eligibleItems.reduce((sum, l) => {
        const sub = Number(l.charge || l.totalPrice || l.fee || 0);
        const eWo = Number(l.writeoff ?? l.estimatedWriteOff ?? 0);
        const estPortion = isSecondary 
          ? (l.secondaryInsPortion !== undefined && l.secondaryInsPortion !== null ? Number(l.secondaryInsPortion) : 0)
          : (l.insPortion !== undefined && l.insPortion !== null ? Number(l.insPortion) : (l.insPayEst !== undefined && l.insPayEst !== null ? Number(l.insPayEst) : Math.max(0, sub - eWo)));
        return sum + estPortion;
      }, 0);

      claimProcs = eligibleItems.map(l => {
        const submittedNum = Number(l.charge || l.totalPrice || l.fee || 0);
        const existingWo = Number(l.writeoff ?? l.estimatedWriteOff ?? 0);
        const allowedNum = l.allowedFee !== undefined && l.allowedFee !== null && Number(l.allowedFee) > 0
          ? Number(l.allowedFee)
          : (l.feeAllowed !== undefined && l.feeAllowed !== null && Number(l.feeAllowed) > 0
            ? Number(l.feeAllowed)
            : Math.max(0, submittedNum - existingWo));
        const woNum = existingWo;
        const initialEst = isSecondary
          ? (l.secondaryInsPortion !== undefined && l.secondaryInsPortion !== null ? Number(l.secondaryInsPortion) : 0)
          : (l.insPortion !== undefined && l.insPortion !== null
          ? Number(l.insPortion)
          : (l.insPayEst !== undefined && l.insPayEst !== null
            ? Number(l.insPayEst)
            : Math.max(0, allowedNum - woNum)));

        let procAlreadyPaid = Number(l.insPayAmt || l.insPaid || l.insurancePaid || 0);
        if (procAlreadyPaid === 0 && unallocatedClaimPaid > 0) {
          if (eligibleItems.length === 1) {
            procAlreadyPaid = unallocatedClaimPaid;
          } else if (totalClaimEst > 0) {
            procAlreadyPaid = Math.round((unallocatedClaimPaid * (initialEst / totalClaimEst)) * 100) / 100;
          }
        }

        let remainingPay = Math.max(0, Math.round((initialEst - procAlreadyPaid) * 100) / 100);
        if (eligibleItems.length === 1 && claimInsBalance !== null && !isNaN(claimInsBalance) && claimPaidAmount > 0) {
          remainingPay = Math.max(0, Math.round(claimInsBalance * 100) / 100);
        }

        const procInvoiceId = l.invoiceId || claim.invoiceId || (claim.invoice?._id || claim.invoice?.id);

        return {
          id: l.id || l._id || l.procedureId || l.procId,
          invoiceId: procInvoiceId ? String(procInvoiceId) : undefined,
          invoiceNumber: l.invoiceNumber,
          invoiceDate: l.invoiceDate,
          code: `${l.code || ''} - ${l.description || l.name || ''}`,
          submitted: `$${submittedNum.toFixed(2)}`,
          bal: `$${Number(l.balance || submittedNum).toFixed(2)}`,
          ded: '0.00',
          allowed: allowedNum.toFixed(2),
          wo: woNum.toFixed(2),
          pay: remainingPay.toFixed(2),
          insPortionEst: (remainingPay + existingWo).toFixed(2),
          updateAllowedFee: false,
          updateInsFlatPortion: false,
          moveToNewClaim: false
        };
      });
    } else if (claim.selectedItems && claim.selectedItems.length > 0) {
      const eligibleItems = claim.selectedItems.filter(item => !item.dbi && String(item.dbi) !== 'true');
      const totalExplicitPaid = eligibleItems.reduce((sum, item) => sum + Number(item.insPayAmt || item.insPaid || 0), 0);
      const unallocatedClaimPaid = Math.max(0, claimPaidAmount - totalExplicitPaid);
      const totalClaimEst = eligibleItems.reduce((sum, item) => sum + Number(item.amount || item.fee || 0), 0);

      claimProcs = eligibleItems.map(item => {
        const submittedNum = Number(item.fee || item.amount || 0);
        const existingWo = Number(item.writeoff ?? item.writeOff ?? 0);
        const allowedNum = Math.max(0, submittedNum - existingWo);
        const itemCode = item.code ? (item.description ? `${item.code} - ${item.description}` : item.code) : `Item ID: ${item.itemId}`;
        const procInvoiceId = item.invoiceId || claim.invoiceId || (claim.invoice?._id || claim.invoice?.id);
        const initialEst = item.amount !== undefined && item.amount !== null && Number(item.amount) > 0
          ? Number(item.amount)
          : Math.max(0, allowedNum - existingWo);

        let procAlreadyPaid = Number(item.insPayAmt || item.insPaid || 0);
        if (procAlreadyPaid === 0 && unallocatedClaimPaid > 0) {
          if (eligibleItems.length === 1) {
            procAlreadyPaid = unallocatedClaimPaid;
          } else if (totalClaimEst > 0) {
            procAlreadyPaid = Math.round((unallocatedClaimPaid * (initialEst / totalClaimEst)) * 100) / 100;
          }
        }

        let remainingPay = Math.max(0, Math.round((initialEst - procAlreadyPaid) * 100) / 100);
        if (eligibleItems.length === 1 && claimInsBalance !== null && !isNaN(claimInsBalance) && claimPaidAmount > 0) {
          remainingPay = Math.max(0, Math.round(claimInsBalance * 100) / 100);
        }

        return {
          id: item.id || item._id || item.itemId || item.procedureId,
          invoiceId: procInvoiceId ? String(procInvoiceId) : undefined,
          invoiceNumber: item.invoiceNumber,
          invoiceDate: item.invoiceDate,
          code: itemCode,
          submitted: `$${submittedNum.toFixed(2)}`,
          bal: `$${submittedNum.toFixed(2)}`,
          ded: '0.00',
          allowed: allowedNum.toFixed(2),
          wo: existingWo.toFixed(2),
          pay: remainingPay.toFixed(2),
          insPortionEst: (remainingPay + existingWo).toFixed(2),
          updateAllowedFee: false,
          updateInsFlatPortion: false,
          moveToNewClaim: false
        };
      });
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
    { label: 'Update allowed fee', checked: updateAllowedFee, onChange: (e) => setUpdateAllowedFee(e.target.checked) },
    { label: 'Update Ins. Flat Portion', checked: updateInsFlatPortion, onChange: (e) => setUpdateInsFlatPortion(e.target.checked) },
    { label: 'Apply write-off', icon: true, checked: applyWriteOff, onChange: (e) => setApplyWriteOff(e.target.checked) },
    { label: 'Partial Payment', checked: isPartialPayment, onChange: (e) => setIsPartialPayment(e.target.checked) }
  ];

  const handleSwitchToSimpleBilling = () => {
    setShowSimpleBillingAlert(true);
  };

  const handleConfirmSimpleBilling = () => {
    setShowSimpleBillingAlert(false);
  };

  const handleCancelSimpleBilling = () => {
    setShowSimpleBillingAlert(false);
  };

  const handleApplyAndPay = () => {
    // Intercept Apply to check for insurance overpayment before showing payment options
    const overpay = procedures.reduce((total, proc) => {
      const insEst = Number(proc.insPortionEst || 0);
      const wo = Number(proc.wo || 0);
      const pay = Number(proc.pay || 0);
      return total + Math.max(0, Math.round(((wo + pay) - insEst) * 100) / 100);
    }, 0);

    if (overpay > 0.005) {
      // Show overpayment alert instead of directly showing payment options
      setOverpaymentAction(null);
      setShowOverpaymentAlert(true);
    } else {
      setShowPaymentOptions(true);
    }
  };

  const handleProceedPayment = async () => {
    const patientId = patient?._id || patient?.id;
    const selectedClaimObj = claims.find(c => c.id === selectedClaim);
    
    if (!patientId || !selectedClaimObj) {
      showSnackbar('Please select a valid claim before proceeding.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      let defaultInvoiceId = selectedClaimObj.invoiceId;
      if (typeof defaultInvoiceId === 'object' && defaultInvoiceId !== null) {
        defaultInvoiceId = defaultInvoiceId.id || defaultInvoiceId._id;
      }
      if (!defaultInvoiceId) {
        const inv = selectedClaimObj.invoice;
        defaultInvoiceId = (typeof inv === 'string') ? inv : (inv?.id || inv?._id);
      }
      if (!defaultInvoiceId && selectedClaimObj.selectedItems?.length > 0) {
        defaultInvoiceId = selectedClaimObj.selectedItems[0].invoiceId || selectedClaimObj.selectedItems[0].StatementNum;
      }
      if (!defaultInvoiceId) {
        defaultInvoiceId = selectedClaimObj.id || selectedClaimObj.ClaimNum;
      }

      const totalPay = procedures.reduce((acc, proc) => acc + Number(proc.pay || 0), 0);
      
      let backendMethod = 'ach';
      const pLower = (paymentMethod || '').toLowerCase();
      if (pLower.includes('cash')) backendMethod = 'cash';
      else if (pLower.includes('check')) backendMethod = 'check';
      else if (pLower.includes('card') || pLower.includes('amex')) backendMethod = 'card';
      else if (pLower.includes('eft') || pLower.includes('ach')) backendMethod = 'ach';
      else if (pLower.includes('insurance')) backendMethod = 'insurance';

      // Group procedures by their respective invoiceId so payments are distributed per invoice
      const procsByInvoice = {};
      procedures.forEach((proc) => {
        let invId = proc.invoiceId;
        if (!invId && selectedClaimObj.selectedItems?.length > 0) {
          const found = selectedClaimObj.selectedItems.find(si => String(si.itemId) === String(proc.id || proc.ProcNum));
          if (found) invId = found.invoiceId;
        }
        if (!invId) {
          invId = defaultInvoiceId;
        }
        const invKey = String(invId);
        if (!procsByInvoice[invKey]) {
          procsByInvoice[invKey] = [];
        }
        procsByInvoice[invKey].push(proc);
      });

      const invoiceEntries = Object.entries(procsByInvoice);
      let shouldSuggestSecondary = false;
      for (const [invId, invProcs] of invoiceEntries) {
        if (!invProcs || invProcs.length === 0) continue;
        const invPay = invProcs.reduce((acc, proc) => acc + Number(proc.pay || 0), 0);

        const paymentData = {
          patientId: patientId.toString(),
          invoiceId: invId.toString(),
          amount: Math.max(0, invPay),
          paymentMethod: backendMethod,
          paymentSource: 'insurance_company',
          paymentDate: new Date().toISOString(),
          insuranceCompanyId: (
            selectedClaimObj.insuranceCompanyId?._id ||
            selectedClaimObj.insuranceCompanyId?.id ||
            (typeof selectedClaimObj.insuranceCompanyId === 'string' && selectedClaimObj.insuranceCompanyId !== '[object Object]' ? selectedClaimObj.insuranceCompanyId : null) ||
            selectedClaimObj.insuranceCompany?._id ||
            selectedClaimObj.insuranceCompany?.id ||
            selectedClaimObj.insuranceCompanyRefId
          )?.toString() || undefined,
          notes: `Insurance Claim #${selectedClaimObj.id} Payment. Options: ${checkboxOptions.filter(opt => opt.checked).map(opt => opt.label).join(', ') || 'None'}`,
          overpaymentAmount: overpaymentAmount > 0.005 ? Math.round(overpaymentAmount * 100) / 100 : undefined,
          overpaymentAction: overpaymentAmount > 0.005 ? (overpaymentAction || 'credit') : undefined,
          procedures: invProcs.map(p => ({
            ...p,
            allowed: Number(p.allowed || 0),
            wo: Number(p.wo || 0),
            pay: Number(p.pay || 0),
            ded: Number(p.ded || 0),
            claimId: selectedClaimObj.id || selectedClaimObj._id
          }))
        };

        // Call API to create payment for this invoice
        const paymentRes = await paymentService.createPayment(paymentData);
        if (paymentRes?.data?.suggestSecondaryClaim || paymentRes?.suggestSecondaryClaim) {
          shouldSuggestSecondary = true;
        }
      }

      // Update claim paidAmount and status:
      // If Partial Payment is checked, claim remains 'partial' (unadjudicated balance stays with insurance).
      // Otherwise, claim status is set to 'paid' (final adjudication, underpayment transfers to patient responsibility).
      const claimPaidAmt = totalPay > 0 ? totalPay : 0;
      const priorClaimPaid = Number(selectedClaimObj.paidAmount || 0);
      const newTotalClaimPaid = Math.round((priorClaimPaid + claimPaidAmt) * 100) / 100;
      await claimService.updateClaim(selectedClaimObj.id, {
        status: isPartialPayment ? 'partial' : 'paid',
        paidAmount: newTotalClaimPaid,
        paidDate: new Date().toISOString()
      });

      // Invalidate and refresh patient balance and insurance usage across Redux
      const pId = patientId.toString();
      dispatch(invalidatePatientBalance(pId));
      dispatch(invalidateInsuranceUsage(pId));
      dispatch(fetchPatientBalance(pId));
      dispatch(fetchInsuranceUsage(pId));

      const eventPayload = {
        patientId: pId,
        amount: totalPay,
      };
      window.dispatchEvent(new CustomEvent('payment-completed', { detail: eventPayload }));
      window.dispatchEvent(new CustomEvent('appointment-financials-updated', { detail: eventPayload }));
      window.dispatchEvent(new CustomEvent('refresh-ledger'));
      try {
        const bc = new BroadcastChannel('medflow-payments');
        bc.postMessage(eventPayload);
        bc.close();
      } catch (e) {}

      showSnackbar('Insurance payment applied successfully', 'success');

      if (onSave) {
        onSave({ totalPay, procsByInvoice });
      }

      if (shouldSuggestSecondary) {
        setShowPaymentOptions(false);
        setCreatedPaymentInfo({
          invoiceId: defaultInvoiceId,
          primaryClaimId: selectedClaimObj.id || selectedClaimObj._id
        });
        setShowSecondaryPrompt(true);
      } else {
        setShowPaymentOptions(false);
        onClose?.();
      }
    } catch (err) {
      console.error('Error applying insurance payment:', err);
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to apply insurance payment';
      showSnackbar(errorMsg, 'error');
      setShowPaymentOptions(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentOptions(false);
  };

  const handleSecondarySubmit = async ({ claimType, invoiceId, primaryClaimId }) => {
    setIsSubmitting(true);
    try {
      const generatedClaimRes = await claimService.generateSecondaryClaim(primaryClaimId);
      const generatedClaim = generatedClaimRes?.data || generatedClaimRes;
      
      if (claimType === 'electronic') {
        await claimService.updateClaim(generatedClaim.id || generatedClaim.ClaimNum, { status: 'ready to send' });
      }
      
      showSnackbar(`Secondary claim generated successfully (${claimType}).`, 'success');
    } catch (err) {
      console.error('Error generating secondary claim:', err);
      showSnackbar('Failed to generate secondary claim', 'error');
    } finally {
      setIsSubmitting(false);
      setShowSecondaryPrompt(false);
      onClose?.();
    }
  };

  // Derived: real-time overpayment amount (sum of per-procedure excess)
  const overpaymentAmount = procedures.reduce((total, proc) => {
    const insEst = Number(proc.insPortionEst || 0);
    const wo = Number(proc.wo || 0);
    const pay = Number(proc.pay || 0);
    return total + Math.max(0, Math.round(((wo + pay) - insEst) * 100) / 100);
  }, 0);

  // Overpaid procedure details for the alert dialog
  const overpaidProcedures = procedures
    .map(proc => {
      const insEst = Number(proc.insPortionEst || 0);
      const wo = Number(proc.wo || 0);
      const pay = Number(proc.pay || 0);
      const excess = Math.max(0, Math.round(((wo + pay) - insEst) * 100) / 100);
      return { ...proc, excess };
    })
    .filter(proc => proc.excess > 0.005);

  const handleOverpaymentContinueCredit = () => {
    setOverpaymentAction('credit');
    setShowOverpaymentAlert(false);
    setShowPaymentOptions(true);
  };

  const handleOverpaymentContinueRefund = () => {
    setOverpaymentAction('refund');
    setShowOverpaymentAlert(false);
    setShowPaymentOptions(true);
  };

  const handleOverpaymentCancel = () => {
    setShowOverpaymentAlert(false);
    setOverpaymentAction(null);
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
          handleProcedureBlur={handleProcedureBlur}
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
        overpaymentAmount={overpaymentAmount}
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
        <DialogActions sx={{ px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, gap: 1 }}>
          <Button 
            onClick={handleConfirmSimpleBilling}
            variant="contained"
            sx={{ bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#1565c0' } }}
          >
            Confirm and proceed
          </Button>
          <Button 
            onClick={handleCancelSimpleBilling}
            variant="outlined"
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600
            }}
          >
            Cancel
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
              disabled={isSubmitting}
              sx={{ bgcolor: COLORS.ACCENT, color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#1565c0' } }}
            >
              {isSubmitting ? 'Processing...' : 'Proceed'}
            </Button>
            <Button 
              onClick={handleCancelPayment}
              variant="outlined"
              sx={{
                color: '#64748b',
                borderColor: '#cbd5e1',
                borderRadius: '8px',
                '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
                textTransform: 'none',
                px: 2,
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Overpayment Alert Dialog */}
      <Dialog
        open={showOverpaymentAlert}
        onClose={handleOverpaymentCancel}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 150000, '& .MuiDialog-paper': { maxWidth: '560px', borderRadius: '14px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}>
          <InfoOutlinedIcon sx={{ color: COLORS.ACCENT, fontSize: '22px', flexShrink: 0 }} />
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Overpayment Detected
          </Typography>
          <IconButton onClick={handleOverpaymentCancel} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: '24px !important', px: '25px', pb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 2, lineHeight: 1.6 }}>
            The following procedures are overpaid by the entered amounts. How would you like to handle the overpayment?
          </Typography>
          <Box sx={{ bgcolor: '#f0f7ff', border: '1px solid #b8d5f8', borderRadius: '8px', px: 2, py: 1.5, mb: 1 }}>
            {overpaidProcedures.map((proc, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 500 }}>
                  {proc.code}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#1976d2', fontWeight: 700 }}>
                  overpaid by ${proc.excess.toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Box sx={{ borderTop: '1px solid #b8d5f8', mt: 1, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a' }}>Total Overpayment</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1976d2' }}>${overpaymentAmount.toFixed(2)}</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleOverpaymentContinueCredit}
            variant="contained"
            id="overpay-save-as-credit-btn"
            sx={{
              bgcolor: COLORS.ACCENT,
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              px: 2,
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            Continue and save overpay as credit
          </Button>
          <Button
            onClick={handleOverpaymentContinueRefund}
            variant="outlined"
            id="overpay-refund-btn"
            sx={{
              color: COLORS.ACCENT,
              borderColor: '#90caf9',
              bgcolor: '#f0f7ff',
              borderRadius: '8px',
              '&:hover': { borderColor: COLORS.ACCENT, backgroundColor: '#e3f2fd' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            Continue and refund overpayment
          </Button>
          <Button
            onClick={handleOverpaymentCancel}
            variant="outlined"
            id="overpay-cancel-btn"
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <SecondaryClaimPromptDialog
        open={showSecondaryPrompt}
        onClose={() => {
          setShowSecondaryPrompt(false);
          onClose?.();
        }}
        onSubmit={handleSecondarySubmit}
        patientName={`${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Patient'}
        invoiceId={createdPaymentInfo?.invoiceId}
        primaryClaimId={createdPaymentInfo?.primaryClaimId}
        secondaryInsuranceName="Secondary Insurance"
      />
    </Box>
  );
};

export default InsurancePaymentDialog;
