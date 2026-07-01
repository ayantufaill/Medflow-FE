import React from 'react';
import { Box } from '@mui/material';

import AccountAdjustmentDialog from './AccountAdjustmentDialog';
import CourtesyRefundDialog from './CourtesyRefundDialog';
import EditPatientFlagsDialog from './EditPatientFlagsDialog';
import DepositDialog from './DepositDialog';
import DepositOptionsMenu from './DepositOptionsMenu';
import CourtesyCreditComponent from './CourtesyCreditComponent';

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
      zIndex: 1300
    }}
    onClick={onClose}
  >
    <Box 
      sx={{ 
        maxWidth: maxWidth, 
        width: '95%',
        bgcolor: '#fff',
        borderRadius: '8px',
        overflow: 'visible',
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
  showCourtesyCredit, setShowCourtesyCredit, handleCourtesyCreditSave
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
        <DialogWrapper onClose={() => setShowCourtesyRefund(false)} maxWidth="900px" extraSx={{ width: '90%' }}>
          <CourtesyRefundDialog 
            patient={patient}
            onClose={() => setShowCourtesyRefund(false)} 
          />
        </DialogWrapper>
      )}

      {showEditFlags && (
        <DialogWrapper onClose={() => setShowEditFlags(false)} maxWidth="750px" extraSx={{ width: '90%', overflow: 'hidden' }}>
          <EditPatientFlagsDialog 
            onClose={() => setShowEditFlags(false)}
            onSave={handleEditFlagsSave}
            initialFlags={patient?.patientFlags || []}
          />
        </DialogWrapper>
      )}

      {showDeposit && (
        <DialogWrapper onClose={() => setShowDeposit(false)} maxWidth="900px" extraSx={{ width: '90%' }}>
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
    </>
  );
};

export default FinancePageDialogs;
