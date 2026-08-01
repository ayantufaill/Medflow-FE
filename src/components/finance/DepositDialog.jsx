import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';

import DepositTopRow from './deposit/DepositTopRow';
import DepositAmount from './deposit/DepositAmount';
import DepositFooter from './deposit/DepositFooter';

const DepositDialog = ({ patient, onClose, onSave, depositType = 'patient-deposit' }) => {
  const [fromPatient, setFromPatient] = useState(patient ? `${patient.firstName} ${patient.lastName}` : 'test test');
  const [paymentMethod, setPaymentMethod] = useState('Do not use');
  const [toAccount, setToAccount] = useState('');
  const [policy, setPolicy] = useState('');
  const [depositAmount, setDepositAmount] = useState('0.00');

  useEffect(() => {
    if (patient) {
      setFromPatient(`${patient.firstName} ${patient.lastName}`);
    }
  }, [patient]);
  
  const handleSave = () => {
    const depositData = {
      depositType,
      fromPatient,
      paymentMethod,
      toAccount,
      policy: depositType === 'insurance-deposit' ? policy : undefined,
      depositAmount: parseFloat(depositAmount) || 0,
      date: '04/15/2026'
    };
    
    if (onSave) {
      onSave(depositData);
    }
  };
  return (
    <Box sx={{ width: '100%', minWidth: '1000px', border: `1px solid ${COLORS.BORDER}`, borderRadius: '14px', overflow: 'visible', bgcolor: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
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
          {depositType === 'insurance-deposit' ? 'Insurance Deposit' : 'Deposit #24634'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2, display: 'flex', flexDirection: 'column' }}>
        <DepositTopRow 
          depositType={depositType}
          fromPatient={fromPatient}
          setFromPatient={setFromPatient}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          toAccount={toAccount}
          setToAccount={setToAccount}
          policy={policy}
          setPolicy={setPolicy}
        />
        
        <DepositAmount 
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
        />
      </DialogContent>

      <DepositFooter handleSave={handleSave} onClose={onClose} />
    </Box>
  );
};

export default DepositDialog;
