import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Tooltip, Menu, MenuItem, ListItemText } from '@mui/material';
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
import { fetchPatientInsurances, selectPatientInsurancesCache } from '../../store/slices/patientSlice';
import PatientPrintOptions from './PatientPrintOptions';
import ShareDropdown from './ShareDropdown';
import PastStatementsDialog from './PastStatementsDialog';
import InsuranceCoverageDialog from './InsuranceCoverageDialog';

const FinanceActions = ({ 
  view, 
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
  const patientId = patient?._id || patient?.id;
  const patientInsurances = patientId ? (insurancesCache?.[patientId] || []) : [];
  const hasInsurance = patientInsurances.length > 0;

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientInsurances({ patientId }));
    }
  }, [dispatch, patientId]);

  const handleInsuranceCoverageClick = (e) => setInsuranceCoverageAnchorEl(e.currentTarget);
  const handleInsuranceCoverageClose = () => setInsuranceCoverageAnchorEl(null);
  const handleInsuranceCoverageSelect = () => {
    handleInsuranceCoverageClose();
    navigate('/insurance');
  };

  // Add Claim dialog (dropdown state)
  const [addClaimAnchorEl, setAddClaimAnchorEl] = useState(null);
  const handleAddClaimClick = (e) => setAddClaimAnchorEl(e.currentTarget);
  const handleAddClaimClose = () => setAddClaimAnchorEl(null);
  const handleAddClaimSelect = (type) => {
    handleAddClaimClose();
    if (type === 'manual') {
      onTriggerPatientFinanceIcon?.('claim');
    } else if (type === 'electronic') {
      onTriggerPatientFinanceIcon?.('electronicClaim');
    }
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

  const iconStyle = { fontSize: '20px' };

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
            minWidth: 280,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
              '&:hover': { bgcolor: '#f5f5f5' }
            }
          }
        }}
      >
        {hasInsurance ? (
          <MenuItem onClick={handleInsuranceCoverageSelect}>
            <CheckCircle sx={{ color: '#4caf50', mr: 1.5, fontSize: 20 }} />
            <ListItemText
              primary="This patient has insurance coverage"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
            />
          </MenuItem>
        ) : (
          <MenuItem onClick={handleInsuranceCoverageSelect}>
            <Cancel sx={{ color: '#f44336', mr: 1.5, fontSize: 20 }} />
            <ListItemText
              primary="No insurance coverage"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
            />
          </MenuItem>
        )}
      </Menu>

      {/* Past Statements Dialog */}
      <PastStatementsDialog
        open={showPastStatements}
        onClose={() => setShowPastStatements(false)}
        patient={patient}
      />

      {/* Add Claim Dropdown Menu */}
      <Menu
        anchorEl={addClaimAnchorEl}
        open={Boolean(addClaimAnchorEl)}
        onClose={handleAddClaimClose}
        PaperProps={{
          sx: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: 150,
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem'
            }
          }
        }}
      >
        <MenuItem onClick={() => handleAddClaimSelect('manual')}>Manual Claim</MenuItem>
        <MenuItem onClick={() => handleAddClaimSelect('electronic')}>Electronic Claim</MenuItem>
      </Menu>

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
