import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';

import {
  fetchPaymentTerminals,
  savePaymentTerminals,
  selectPaymentTerminals,
  selectPaymentTerminalsLoading
} from '../../store/slices/billingSlice';

import OpenEdgeSection from '../../components/admin/finance-management/payment-terminals/OpenEdgeSection';
import ProsperipaySection from '../../components/admin/finance-management/payment-terminals/ProsperipaySection';
import PayrixSection from '../../components/admin/finance-management/payment-terminals/PayrixSection';

const PaymentTerminals = () => {
  const dispatch = useDispatch();
  const paymentTerminalsState = useSelector(selectPaymentTerminals);
  const loading = useSelector(selectPaymentTerminalsLoading);

  useEffect(() => {
    dispatch(fetchPaymentTerminals());
  }, [dispatch]);

  // Derive lists from Redux state
  const openEdgeTerminals = paymentTerminalsState?.openEdge || [];
  const prosperipayTerminals = paymentTerminalsState?.prosperipay || [];
  const payrixTerminals = paymentTerminalsState?.payrix || [];

  // --- HANDLERS FOR ADDING ---
  const handleAddOpenEdgeManual = (form) => {
    const newTerminals = {
      ...paymentTerminalsState,
      openEdge: [
        ...openEdgeTerminals,
        { id: Date.now(), serialNum: form.serialNum, accountToken: form.accountToken }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleAddOpenEdgeAuto = () => {
    const newTerminals = {
      ...paymentTerminalsState,
      openEdge: [
        ...openEdgeTerminals,
        { id: Date.now(), serialNum: 'AUTO-' + Math.floor(1000 + Math.random() * 9000), accountToken: 'TOKEN-' + Math.floor(100000 + Math.random() * 900000) }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleAddProsperipay = (form) => {
    const newTerminals = {
      ...paymentTerminalsState,
      prosperipay: [
        ...prosperipayTerminals,
        {
          id: Date.now(),
          name: form.name,
          serialNum: form.serialNum,
          merchantId: form.merchantId || 'XXXX-9012',
          model: form.model || 'Model Name',
          deviceId: form.deviceId || 'DEV-' + Math.floor(100000 + Math.random() * 900000)
        }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleAddPayrix = (form) => {
    const newTerminals = {
      ...paymentTerminalsState,
      payrix: [
        ...payrixTerminals,
        {
          id: Date.now(),
          terminalId: form.terminalId,
          serialNum: form.serialNum,
          modelNum: form.modelNum || 'Model Name',
          laneId: form.laneId || '1'
        }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
  };

  // --- HANDLERS FOR DELETING ---
  const handleDeleteOpenEdge = (id) => {
    const newTerminals = { ...paymentTerminalsState, openEdge: openEdgeTerminals.filter(t => t.id !== id) };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleDeleteProsperipay = (id) => {
    const newTerminals = { ...paymentTerminalsState, prosperipay: prosperipayTerminals.filter(t => t.id !== id) };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleDeletePayrix = (id) => {
    const newTerminals = { ...paymentTerminalsState, payrix: payrixTerminals.filter(t => t.id !== id) };
    dispatch(savePaymentTerminals(newTerminals));
  };

  if (loading && !paymentTerminalsState) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: '100vh', backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Payment Terminals
        </Typography>
      </Box>

      <OpenEdgeSection 
        terminals={openEdgeTerminals}
        onAddManual={handleAddOpenEdgeManual}
        onAddAuto={handleAddOpenEdgeAuto}
        onDelete={handleDeleteOpenEdge}
      />

      <ProsperipaySection 
        terminals={prosperipayTerminals}
        onAdd={handleAddProsperipay}
        onDelete={handleDeleteProsperipay}
      />

      <PayrixSection 
        terminals={payrixTerminals}
        onAdd={handleAddPayrix}
        onDelete={handleDeletePayrix}
      />

    </Box>
  );
};

export default PaymentTerminals;
