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

import CourtesyRefundTopRow from './courtesy-refund/CourtesyRefundTopRow';
import CourtesyRefundAmount from './courtesy-refund/CourtesyRefundAmount';
import CourtesyRefundFooter from './courtesy-refund/CourtesyRefundFooter';

const CourtesyRefundDialog = ({ patient, onClose }) => {
  const [fromPatient, setFromPatient] = useState(patient ? `${patient.firstName} ${patient.lastName}` : 'test test');
  const [paymentMethod, setPaymentMethod] = useState('Do not use');
  const [toAccount, setToAccount] = useState('');
  const [accountCredit, setAccountCredit] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    if (patient) {
      setFromPatient(`${patient.firstName} ${patient.lastName}`);
    }
  }, [patient]);
  
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
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '14px',
      }}>
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Courtesy Refund #24633
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2, display: 'flex', flexDirection: 'column' }}>
        <CourtesyRefundTopRow 
          fromPatient={fromPatient}
          setFromPatient={setFromPatient}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          toAccount={toAccount}
          setToAccount={setToAccount}
          accountCredit={accountCredit}
          setAccountCredit={setAccountCredit}
        />
        
        <CourtesyRefundAmount 
          accountCredit={accountCredit}
          refundAmount={refundAmount}
        />
      </DialogContent>

      <CourtesyRefundFooter onClose={onClose} />
    </Box>
  );
};

export default CourtesyRefundDialog;