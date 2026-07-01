import React, { useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import {
  KeyboardArrowDown,
  Refresh
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
import InsuranceCoverageDialog from './InsuranceCoverageDialog';

const FinanceActions = ({ 
  view, 
  expanded, 
  onExpandToggle,
  onCalendarClick,
  onCashMinusClick,
  onRefreshCoinClick,
  onOpenDepositMenu,
  onTriggerPatientFinanceIcon
}) => {
  const navigate = useNavigate();
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);

  const handleInsuranceCoverageClick = () => setShowInsuranceDialog(true);
  const handleCloseInsuranceDialog = () => setShowInsuranceDialog(false);

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
        <Tooltip title="Insurance Payment"><IconButton size="small" onClick={(e) => onTriggerPatientFinanceIcon?.('claim', e)}><Box component="img" src={insurancepaymentIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Patient Deposit"><IconButton size="small" onClick={() => onTriggerPatientFinanceIcon?.('insuranceWallet')}><Box component="img" src={patientdepositIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Courtesy Refund"><IconButton size="small" onClick={onRefreshCoinClick}><Box component="img" src={courtestrefundIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Create Payment Plan"><IconButton size="small" onClick={onOpenDepositMenu}><Box component="img" src={createpaymentplanIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Print"><IconButton size="small" onClick={(e) => onTriggerPatientFinanceIcon?.('print', e)}><Box component="img" src={printIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Share"><IconButton size="small" onClick={(e) => onTriggerPatientFinanceIcon?.('share', e)}><Box component="img" src={shareIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Account Adjustment"><IconButton size="small" onClick={(e) => onTriggerPatientFinanceIcon?.('cashPlus', e)}><Box component="img" src={accountadjustmentIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Account Adjustment Minus"><IconButton size="small" onClick={onCashMinusClick}><Box component="img" src={accountadjustmentminusIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
        <Tooltip title="Add Claim"><IconButton size="small" onClick={onCalendarClick}><Box component="img" src={addclaimIcon} sx={{ width: 20, height: 20 }} /></IconButton></Tooltip>
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
        <Button 
          variant="outlined" 
          sx={{ 
            minWidth: '36px',
            width: '36px',
            height: '36px',
            p: 0,
            borderColor: '#A1C2FA',
            color: '#2362EF'
          }}
        >
          <Refresh sx={{ fontSize: '20px' }} />
        </Button>
      </Box>

      <InsuranceCoverageDialog 
        open={showInsuranceDialog} 
        onClose={handleCloseInsuranceDialog} 
      />
    </Box>
  );
};

export default FinanceActions;
