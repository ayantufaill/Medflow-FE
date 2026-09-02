import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

import {
  fetchPaymentTypes,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
  fetchPaymentTypeDefaults,
  savePaymentTypeDefaults,
  selectPaymentTypes,
  selectPaymentTypesLoading,
  selectPaymentTypeDefaults
} from '../../store/slices/billingSlice';

import PaymentTypesActionBar from '../../components/admin/finance-management/payment-types/PaymentTypesActionBar';
import PaymentTypesTable from '../../components/admin/finance-management/payment-types/PaymentTypesTable';
import PaymentTypesDefaults from '../../components/admin/finance-management/payment-types/PaymentTypesDefaults';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

const PaymentTypes = () => {
  const dispatch = useDispatch();
  const paymentTypes = useSelector(selectPaymentTypes);
  const loading = useSelector(selectPaymentTypesLoading);
  const defaultTypes = useSelector(selectPaymentTypeDefaults);

  const [showDeleted, setShowDeleted] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentTypes());
    dispatch(fetchPaymentTypeDefaults());
  }, [dispatch]);

  const handleToggle = (pt, field) => {
    dispatch(updatePaymentType({
      id: pt.id,
      [field]: !pt[field]
    }));
  };

  const handleNoteChange = (pt, value) => {
    if (pt.note === value) return;
    dispatch(updatePaymentType({
      id: pt.id,
      note: value
    }));
  };

  const handleDelete = (id) => {
    dispatch(deletePaymentType(id));
  };

  const handleRestore = (pt) => {
    dispatch(updatePaymentType({
      id: pt.id,
      isHidden: false
    }));
  };

  const handleAdd = () => {
    dispatch(createPaymentType({
      name: 'New Payment Type',
      depositSlip: false,
      openEdge: false,
      prosperipay: false,
      smilepay: false,
      note: ''
    }));
  };

  const handleDefaultChange = (field, value) => {
    dispatch(savePaymentTypeDefaults({
      ...defaultTypes,
      [field]: value
    }));
  };

  if (loading && paymentTypes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: '100vh', backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
        <CircularProgress />
      </Box>
    );
  }

  const visiblePaymentTypes = paymentTypes.filter(pt => showDeleted || !pt.isHidden);

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      
      <PaymentTypesActionBar 
        showDeleted={showDeleted}
        setShowDeleted={setShowDeleted}
        onSync={() => setIsSyncDialogOpen(true)}
      />

      <PaymentTypesTable 
        paymentTypes={visiblePaymentTypes}
        handleToggle={handleToggle}
        handleNoteChange={handleNoteChange}
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        handleAdd={handleAdd}
      />

      <PaymentTypesDefaults 
        defaultTypes={defaultTypes}
        paymentTypes={paymentTypes}
        handleDefaultChange={handleDefaultChange}
      />

      <SyncOfficesDialog 
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
      />

    </Box>
  );
};

export default PaymentTypes;
