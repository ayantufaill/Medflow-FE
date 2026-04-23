import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

// Sub-components
import PatientFinanceInfo from '../../components/finance/PatientFinanceInfo';
import AgingTable from '../../components/finance/AgingTable';
import FinanceActions from '../../components/finance/FinanceActions';
import LedgerList from '../../components/finance/LedgerList';
import FamilyLedgerTable from '../../components/finance/FamilyLedgerTable';
import NewPaymentPlan from '../../components/finance/NewPaymentPlan';
import AccountAdjustmentDialog from '../../components/finance/AccountAdjustmentDialog';
import CourtesyRefundDialog from '../../components/finance/CourtesyRefundDialog';
import EditPatientFlagsDialog from '../../components/finance/EditPatientFlagsDialog';
import DepositDialog from '../../components/finance/DepositDialog';
import DepositOptionsMenu from '../../components/finance/DepositOptionsMenu';
import CourtesyCreditComponent from '../../components/finance/CourtesyCreditComponent';

const FinancePage = () => {
  const [view, setView] = useState('invoices');
  const [expanded, setExpanded] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [showAccountAdjustment, setShowAccountAdjustment] = useState(false);
  const [showCourtesyRefund, setShowCourtesyRefund] = useState(false);
  const [showEditFlags, setShowEditFlags] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositMenuAnchor, setDepositMenuAnchor] = useState(null);
  const [depositType, setDepositType] = useState('patient-deposit');
  const [showCourtesyCredit, setShowCourtesyCredit] = useState(false);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleDepositOptionSelect = (optionId) => {
    setDepositType(optionId);
    if (optionId === 'patient-deposit') {
      setShowDeposit(true);
    } else if (optionId === 'insurance-deposit') {
      setShowDeposit(true);
    } else if (optionId === 'courtesy-credit') {
      setShowCourtesyCredit(true);
    }
  };

  if (showPaymentPlan) {
    return <NewPaymentPlan onBack={() => setShowPaymentPlan(false)} />;
  }

  return (
    <Box sx={{ p: '8px 8px 8px 8px', bgcolor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* View Selection Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}>View</Typography>
        <RadioGroup row value={view} onChange={handleViewChange}>
          {[
            { value: 'invoices', label: 'Invoices' },
            { value: 'individual', label: 'Individual Ledger' },
            { value: 'family', label: 'Family Ledger' },
          ].map((option) => (
            <FormControlLabel 
              key={option.value}
              value={option.value} 
              control={<Radio size="small" sx={{ color: '#7cb342', '&.Mui-checked': { color: '#7cb342' } }} />} 
              label={<Typography variant="caption">{option.label}</Typography>} 
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Main Dashboard Section */}
      <Box sx={{ display: 'flex', width: '100%', mt: 2, alignItems: 'center' }}>
        <PatientFinanceInfo 
          view={view} 
          onCalendarClick={() => setShowPaymentPlan(true)} 
          onCashMinusClick={() => setShowAccountAdjustment(true)}
          onRefreshCoinClick={() => setShowCourtesyRefund(true)}
          onAddFlagsClick={() => setShowEditFlags(true)}
          onOpenDepositMenu={(e) => setDepositMenuAnchor(e.currentTarget)}
        />
        <AgingTable />
      </Box>

      {/* Action Toolbar: Filters and Buttons */}
      <FinanceActions 
        view={view} 
        expanded={expanded} 
        onExpandToggle={() => setExpanded(!expanded)} 
      />

      {/* Dynamic Ledger Section */}
      {view === 'family' ? <FamilyLedgerTable /> : <LedgerList expanded={expanded} />}

      {/* Account Adjustment Dialog */}
      {showAccountAdjustment && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowAccountAdjustment(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '100%', 
              width: '95%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AccountAdjustmentDialog onClose={() => setShowAccountAdjustment(false)} />
          </Box>
        </Box>
      )}

      {/* Courtesy Refund Dialog */}
      {showCourtesyRefund && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowCourtesyRefund(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '900px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CourtesyRefundDialog onClose={() => setShowCourtesyRefund(false)} />
          </Box>
        </Box>
      )}

      {/* Edit Patient Flags Dialog */}
      {showEditFlags && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowEditFlags(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '750px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <EditPatientFlagsDialog onClose={() => setShowEditFlags(false)} />
          </Box>
        </Box>
      )}

      {/* Deposit Dialog */}
      {showDeposit && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowDeposit(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '900px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DepositDialog 
              onClose={() => setShowDeposit(false)} 
              depositType={depositType}
            />
          </Box>
        </Box>
      )}

      {/* Deposit Options Menu */}
      <DepositOptionsMenu
        anchorEl={depositMenuAnchor}
        onClose={() => setDepositMenuAnchor(null)}
        onSelect={handleDepositOptionSelect}
      />

      {/* Courtesy Credit Dialog */}
      {showCourtesyCredit && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowCourtesyCredit(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '600px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CourtesyCreditComponent 
              onClose={() => setShowCourtesyCredit(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FinancePage;