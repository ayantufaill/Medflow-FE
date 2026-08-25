import React from 'react';
import { Box } from '@mui/material';

import AccountAdjustmentDialog from './AccountAdjustmentDialog';
import CourtesyRefundDialog from './CourtesyRefundDialog';
import PatientFlagsDialog from '../patient-flags/PatientFlagsDialog';
import DepositDialog from './DepositDialog';
import DepositOptionsMenu from './DepositOptionsMenu';
import CourtesyCreditComponent from './CourtesyCreditComponent';
import NewPaymentPlan from './NewPaymentPlan';
import PaymentDetailsForm from './PaymentDetailsForm';
import { Dialog } from '@mui/material';

const DialogWrapper = ({ children, onClose, maxWidth = '100%', extraSx = {} }) => (
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
      zIndex: 130000
    }}
    onClick={onClose}
  >
    <Box 
      sx={{ 
        maxWidth: maxWidth, 
        width: '95%',
        bgcolor: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        ...extraSx
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Box>
  </Box>
);

const FinancePageDialogs = ({
  patient,
  showAccountAdjustment, setShowAccountAdjustment, handleAccountAdjustmentSave,
  showCourtesyRefund, setShowCourtesyRefund,
  showEditFlags, setShowEditFlags, handleEditFlagsSave,
  showDeposit, setShowDeposit, handleDepositSave, depositType,
  depositMenuAnchor, setDepositMenuAnchor, handleDepositOptionSelect,
  showCourtesyCredit, setShowCourtesyCredit, handleCourtesyCreditSave,
  showPaymentPlan, setShowPaymentPlan, handleCreatePaymentPlan,
  showAddCard, setShowAddCard
}) => {
  return (
    <>
      {showAccountAdjustment && (
        <DialogWrapper onClose={() => setShowAccountAdjustment(false)}>
          <AccountAdjustmentDialog 
            patient={patient}
            onClose={() => setShowAccountAdjustment(false)} 
            onSave={handleAccountAdjustmentSave}
          />
        </DialogWrapper>
      )}

      {showCourtesyRefund && (
        <DialogWrapper onClose={() => setShowCourtesyRefund(false)} maxWidth="1000px" extraSx={{ width: '90%' }}>
          <CourtesyRefundDialog 
            patient={patient}
            onClose={() => setShowCourtesyRefund(false)} 
          />
        </DialogWrapper>
      )}

      <PatientFlagsDialog
        open={showEditFlags}
        onClose={() => setShowEditFlags(false)}
        onSave={(newFlags) => {
          handleEditFlagsSave(newFlags);
          setShowEditFlags(false);
        }}
        initialFlags={patient?.patientFlags || []}
      />

      {showDeposit && (
        <DialogWrapper onClose={() => setShowDeposit(false)} maxWidth="1100px" extraSx={{ width: '90%' }}>
          <DepositDialog 
            patient={patient}
            onClose={() => setShowDeposit(false)} 
            onSave={handleDepositSave}
            depositType={depositType}
          />
        </DialogWrapper>
      )}

      <DepositOptionsMenu
        anchorEl={depositMenuAnchor}
        onClose={() => setDepositMenuAnchor(null)}
        onSelect={handleDepositOptionSelect}
      />

      {showCourtesyCredit && (
        <DialogWrapper onClose={() => setShowCourtesyCredit(false)} maxWidth="600px" extraSx={{ width: '90%' }}>
          <CourtesyCreditComponent 
            onClose={() => setShowCourtesyCredit(false)}
            onSave={handleCourtesyCreditSave}
          />
        </DialogWrapper>
      )}

      {showPaymentPlan && (
        <DialogWrapper onClose={() => setShowPaymentPlan(false)} maxWidth="1200px" extraSx={{ width: '95%' }}>
          <NewPaymentPlan 
            patient={patient}
            onBack={() => setShowPaymentPlan(false)}
            onCreatePlan={handleCreatePaymentPlan}
            onAddCard={() => setShowAddCard(true)}
          />
        </DialogWrapper>
      )}

      <Dialog 
        open={showAddCard} 
        onClose={() => setShowAddCard(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '18px', overflow: 'hidden' } }}
        sx={{ zIndex: 140000 }}
      >
        <PaymentDetailsForm onBack={() => setShowAddCard(false)} />
      </Dialog>
    </>
  );
};

export default FinancePageDialogs;
