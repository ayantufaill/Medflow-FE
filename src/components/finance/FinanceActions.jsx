import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import {
  KeyboardArrowDown,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import invoicesIcon from '../../assets/finance icons/invoices.svg';
import patientpaymentIcon from '../../assets/finance icons/patientpayment.svg';
import insurancepaymentIcon from '../../assets/finance icons/insurancepayment.svg';
import patientdepositIcon from '../../assets/finance icons/patientdeposit.svg';
import courtestrefundIcon from '../../assets/finance icons/courtestrefund.svg';
import createpaymentplanIcon from '../../assets/finance icons/createpaymentplan.svg';
import printIcon from '../../assets/finance icons/print.svg';
import shareIcon from '../../assets/finance icons/share.svg';
import accountadjustmentIcon from '../../assets/finance icons/accountadjustment.svg';
import accountadjustmentminusIcon from '../../assets/finance icons/accountadjustmentminus.svg';
import addclaimIcon from '../../assets/finance icons/addclaim.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPatientInsurances,
  selectPatientInsurancesCache,
  fetchInsuranceUsage,
  selectInsuranceUsage,
  selectInsuranceUsageCache,
} from '../../store/slices/patientSlice';
import { fetchFeeGuides, selectFeeGuides } from '../../store/slices/feeGuideSlice';
import PatientPrintOptions from './PatientPrintOptions';
import ShareDropdown from './ShareDropdown';
import PastStatementsDialog from './PastStatementsDialog';

import {
  getCoverageAmounts,
  getCoverageUsage,
  getFeeGuideLabel,
  parseAmount,
} from '../insurance/utils/insuranceHelpers';

const FinanceActions = ({ 
  expanded, 
  onExpandToggle,
  onCalendarClick,
  onCashMinusClick,
  onRefreshCoinClick,
  onOpenDepositMenu,
  onTriggerPatientFinanceIcon,
  patient
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const insurancesCache = useSelector(selectPatientInsurancesCache);

  // Insurance Coverage dropdown
  const [insuranceCoverageAnchorEl, setInsuranceCoverageAnchorEl] = useState(null);
  
  const [coverageError, setCoverageError] = useState('');
  const coverageLoading = useSelector((state) => state.patient.patientInsurancesLoading);
  // Fee guides arrive as ids; the names shown in the coverage summary come from here.
  const feeGuides = useSelector(selectFeeGuides);

  const patientId = patient?._id || patient?.id;
  const patientInsurancesRaw = patientId ? insurancesCache?.[patientId] : null;
  const patientInsurances = Array.isArray(patientInsurancesRaw) 
    ? patientInsurancesRaw 
    : (patientInsurancesRaw?.data || []);
  // Inactive coverages can't be billed, so they're noise in a picker whose only
  // job is opening a coverage for review. Filter on `=== false` rather than
  // truthiness so a record that predates the isActive flag still shows — hiding
  // real coverage from a billing screen is worse than showing a stale one.
  const activeInsurances = patientInsurances.filter(
    (ins) => ins.isActive !== false
  );
  const hasInsurance = activeInsurances.length > 0;
  const insuranceUsage = useSelector(selectInsuranceUsage);
  const insuranceUsageCache = useSelector(selectInsuranceUsageCache);
  const activeUsage = patientId
    ? (insuranceUsageCache?.[patientId]?.data ?? insuranceUsage ?? null)
    : null;

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientInsurances({ patientId }));
      // Benefit usage is a separate aggregate (paid-to-date claims per
      // subscriber). Without it the card falls back to the limit/copay fields
      // stored on the coverage, which are not what has actually been used.
      dispatch(fetchInsuranceUsage(patientId));
    }
  }, [dispatch, patientId]);

  useEffect(() => {
    if (feeGuides.length === 0) {
      dispatch(fetchFeeGuides());
    }
  }, [dispatch, feeGuides.length]);

  const handleInsuranceCoverageClick = (e) => {
    setInsuranceCoverageAnchorEl(e.currentTarget);
    setCoverageError('');
    if (patientId) {
      dispatch(fetchPatientInsurances({ patientId, force: true })).unwrap()
        .catch(() => setCoverageError('Could not load insurance coverage. Please try again.'));
    }
  };
  const handleInsuranceCoverageClose = () => setInsuranceCoverageAnchorEl(null);
  // "View Coverage" goes to the same coverage page the insurance tab links to,
  // so a plan is reviewed in one place; that route opens read-only unless the
  // user hits Edit, which keeps this button from being an accidental edit path.
  const handleInsuranceCoverageSelect = (insuranceId) => {
    handleInsuranceCoverageClose();
    if (!insuranceId || !patientId) return;
    navigate(`/patients/${patientId}/insurance/${insuranceId}/edit`);
  };

  // Add Claim opens the manual claim dialog directly
  const handleAddClaimClick = () => {
    onTriggerPatientFinanceIcon?.('claim');
  };

  // Past Statements dialog
  const [showPastStatements, setShowPastStatements] = useState(false);

  // Print handlers - local dropdown
  const [printAnchorEl, setPrintAnchorEl] = useState(null);
  const handlePrintClick = (e) => setPrintAnchorEl(e.currentTarget);
  const handlePrintClose = () => setPrintAnchorEl(null);
  const handlePrintSelect = (option) => {
    handlePrintClose();
    onTriggerPatientFinanceIcon?.('printSelect', option);
  };

  // Share handlers - local dropdown
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const handleShareClick = (e) => setShareAnchorEl(e.currentTarget);
  const handleShareClose = () => setShareAnchorEl(null);
  const handleShareSelect = (optionId) => {
    handleShareClose();
    onTriggerPatientFinanceIcon?.('shareSelect', optionId);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        height: '62px',
        borderRadius: '12px',
        border: '1px solid #DFE5EC',
        bgcolor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        boxSizing: 'border-box',
        mb: 2,
        mt: 1
      }}
    >
      {/* Left Icons */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Tooltip title="Invoices"><IconButton size="small" onClick={() => onTriggerPatientFinanceIcon?.('invoice')}><Box component="img" src={invoicesIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Patient Payment"><IconButton size="small" onClick={() => onTriggerPatientFinanceIcon?.('userWallet')}><Box component="img" src={patientpaymentIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Add Claim"><IconButton size="small" onClick={handleAddClaimClick}><Box component="img" src={addclaimIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Insurance Payment"><IconButton size="small" onClick={() => onTriggerPatientFinanceIcon?.('insuranceWallet')}><Box component="img" src={insurancepaymentIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Courtesy Refund"><IconButton size="small" onClick={onRefreshCoinClick}><Box component="img" src={courtestrefundIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>     
        <Tooltip title="Patient Deposit"><IconButton size="small" onClick={onOpenDepositMenu}><Box component="img" src={patientdepositIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Print"><IconButton size="small" onClick={handlePrintClick}><Box component="img" src={printIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Share"><IconButton size="small" onClick={handleShareClick}><Box component="img" src={shareIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Account Adjustment"><IconButton size="small" onClick={(e) => onTriggerPatientFinanceIcon?.('cashPlus', e)}><Box component="img" src={accountadjustmentIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Account Adjustment Minus"><IconButton size="small" onClick={onCashMinusClick}><Box component="img" src={accountadjustmentminusIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Create Payment Plan"><IconButton size="small" onClick={onCalendarClick}><Box component="img" src={createpaymentplanIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
      </Box>

      {/* Right Buttons */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={onExpandToggle}
          startIcon={<KeyboardArrowDown sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />}
          sx={{ 
            color: '#1A1A1A', 
            borderColor: '#DFE5EC', 
            textTransform: 'none', 
            fontWeight: 500,
            borderRadius: '6px',
            height: '36px'
          }}
        >
          {expanded ? 'Collapse Invoices' : 'Expand Invoices'}
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setShowPastStatements(true)}
          sx={{ 
            bgcolor: '#2362EF', 
            '&:hover': { bgcolor: '#1b4ecc' },
            textTransform: 'none',
            borderRadius: '6px',
            height: '36px',
            boxShadow: 'none'
          }}
        >
          Past Statements
        </Button>
        <Button 
          variant="contained" 
          onClick={handleInsuranceCoverageClick}
          endIcon={<KeyboardArrowDown />}
          sx={{ 
            bgcolor: '#2362EF', 
            '&:hover': { bgcolor: '#1b4ecc' },
            textTransform: 'none',
            borderRadius: '6px',
            height: '36px',
            boxShadow: 'none'
          }}
        >
          INS. COVERAGE
        </Button>
        <Tooltip title="Treatment Plan">
          <Button 
            variant="contained" 
            onClick={() => navigate('/clinical/treatment-plan')}
            sx={{ 
              minWidth: '36px',
              width: '36px',
              height: '36px',
              p: 0,
              bgcolor: '#2362EF',
              color: '#ffffff',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1b4ecc',
                boxShadow: 'none'
              }
            }}
          >
            Tx
          </Button>
        </Tooltip>
      </Box>

      {/* Insurance Coverage Dropdown Menu */}
      <Menu
        anchorEl={insuranceCoverageAnchorEl}
        open={Boolean(insuranceCoverageAnchorEl)}
        onClose={handleInsuranceCoverageClose}
        PaperProps={{
          sx: {
            minWidth: 320,
            maxWidth: 380,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            borderRadius: '10px',
            p: 0,
            overflow: 'hidden',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {coverageLoading ? (
          <MenuItem disabled sx={{ py: 2, justifyContent: 'center' }}>Loading coverage…</MenuItem>
        ) : coverageError ? (
          <MenuItem disabled sx={{ py: 2 }}>{coverageError}</MenuItem>
        ) : hasInsurance ? (
          activeInsurances.map((ins, idx) => {
            const carrierName = ins.insuranceCompanyId?.name || ins.insuranceCompany?.name || ins.carrierName || ins.inssub?.insplan?.carrier?.CarrierName || 'Insurance';
            const insType = ins.insuranceType ? ins.insuranceType.charAt(0).toUpperCase() + ins.insuranceType.slice(1) : 'Primary';
            const groupLabel = ins.groupName || ins.planName || ins.groupNumber || '';

            // Financial summary fields — use the same helper as the coverage tab
            const usage = getCoverageUsage(ins, idx, activeUsage);
            const { usedAmount: usedAmt, maxAmount: totalAmt } = getCoverageAmounts(ins, usage);
            const completedNotPaid = ins.completedNotPaid ?? ins.pendingCompletedCount ?? null;
            const estimatedNotCompleted = ins.estimatedNotCompleted ?? ins.pendingEstimatedAmount ?? null;
            // Approx remaining = maxAmount - usedAmount (never negative)
            const remaining = Math.max(totalAmt - usedAmt, 0);
            const insPortionLeft = parseAmount(usage?.remaining) ?? ins.insPortionLeft ?? ins.remainingBenefit ?? remaining;
            const planFeeGuide = getFeeGuideLabel(ins.planFeeGuide ?? ins.feeGuide, feeGuides);

            const fmt = (val) => (val !== null && val !== undefined && val !== 0) ? `$${Number(val).toFixed(2)}` : null;
            const fmtOrDash = (val) => fmt(val) ?? '—';

            return (
              <Box key={ins._id || idx}>
                {idx > 0 && <Divider />}
                <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                  {/* Header: type + carrier name */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <CheckCircle sx={{ color: '#4caf50', fontSize: 18, mt: '2px', flexShrink: 0 }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.82rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                        {insType}:{' '}
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
                        {carrierName}{groupLabel ? ` (${groupLabel})` : ''}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Financial rows */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mb: 1.5, pl: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>Used:</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a' }}>
                        {(usedAmt > 0 || totalAmt > 0)
                          ? `${fmtOrDash(usedAmt)} / ${fmtOrDash(totalAmt)}`
                          : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>Completed Not Paid:</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a' }}>
                        {completedNotPaid !== null ? completedNotPaid : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>Estimated Not Completed:</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a' }}>
                        {estimatedNotCompleted !== null ? estimatedNotCompleted : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>Approx. Ins. Portion Left:</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a' }}>
                        {remaining > 0 ? fmtOrDash(insPortionLeft) : '—'}
                        {remaining > 0 && <span style={{ color: '#888', fontWeight: 400 }}>*</span>}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>Plan Fee Guide:</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a' }}>
                        {planFeeGuide || '—'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* VIEW COVERAGE button */}
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!ins._id}
                    onClick={() => { handleInsuranceCoverageClose(); if (ins._id) handleInsuranceCoverageSelect(ins._id); }}
                    sx={{
                      bgcolor: '#2362EF',
                      '&:hover': { bgcolor: '#1b4ecc' },
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      borderRadius: '6px',
                      height: '34px',
                      boxShadow: 'none',
                    }}
                  >
                    View Coverage
                  </Button>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box sx={{ px: 2, py: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Cancel sx={{ color: '#f44336', fontSize: 20 }} />
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a' }}>No insurance coverage</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem', color: '#888', pl: 3.5 }}>No active insurance plans found for this patient.</Typography>
          </Box>
        )}
      </Menu>

      {/* Past Statements Dialog */}
      <PastStatementsDialog
        open={showPastStatements}
        onClose={() => setShowPastStatements(false)}
        patient={patient}
      />

      <PatientPrintOptions
        anchorEl={printAnchorEl}
        open={Boolean(printAnchorEl)}
        onClose={handlePrintClose}
        onSelect={handlePrintSelect}
      />

      <ShareDropdown
        anchorEl={shareAnchorEl}
        onClose={handleShareClose}
        onSelect={handleShareSelect}
      />
    </Box>
  );
};

export default FinanceActions;
