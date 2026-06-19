import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem, Checkbox, Button, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

// Redux
import {
  fetchPaymentDraftInvoices,
  togglePaymentInvoiceChecked,
  togglePaymentLineItemChecked,
  selectPaymentInvoicesForPatient,
  selectPaymentInvoicesLoading,
} from '../../store/slices/billingSlice';

const MENU_PROPS = {
  disablePortal: true,
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 },
      '& .Mui-selected': { bgcolor: '#5c6bc0 !important', color: '#fff' },
    },
  },
};

const AddPaymentDialog = ({ patient, onClose, onPaymentApply }) => {
  const dispatch  = useDispatch();
  const patientId = patient?._id || patient?.id;

  // ── Redux state ──────────────────────────────────────────────────────────
  const invoices = useSelector(selectPaymentInvoicesForPatient(patientId));
  const loading  = useSelector(selectPaymentInvoicesLoading);

  // ── Local form state ─────────────────────────────────────────────────────
  const [selectedPatient, setSelectedPatient] = useState(
    patient ? `${patient.firstName} ${patient.lastName}` : 'test test'
  );
  const [paymentMethod,        setPaymentMethod]        = useState('Master Card');
  const [description,          setDescription]          = useState('');
  const [showDescription,      setShowDescription]      = useState(false);
  const [patientAmountChecked, setPatientAmountChecked] = useState(false);
  const [manualAmount,         setManualAmount]         = useState('');

  // ── Fetch draft invoices for this patient ────────────────────────────────
  useEffect(() => {
    if (patientId) dispatch(fetchPaymentDraftInvoices(patientId));
  }, [dispatch, patientId]);

  // ── Derived totals ───────────────────────────────────────────────────────
  const { totalChecked } = useMemo(() => {
    let sum = 0;
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (item.checked) sum += Number(item.payAmount || 0);
      });
    });
    return { totalChecked: sum };
  }, [invoices]);

  const displayAmount   = manualAmount !== '' ? manualAmount : totalChecked.toFixed(2);
  const paymentAmount   = parseFloat(displayAmount) || 0;
  const overpayment     = '0.00';

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInvoiceToggle = (invoiceId) =>
    dispatch(togglePaymentInvoiceChecked({ patientId, invoiceId }));

  const handleProcedureToggle = (invoiceId, itemId) =>
    dispatch(togglePaymentLineItemChecked({ patientId, invoiceId, itemId }));

  const handleApplyAndPay = () => {
    const selectedInvoices = invoices.filter(
      (inv) => inv.checked || inv.lineItems?.some((i) => i.checked)
    );
    const selectedItems = [];
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (item.checked) selectedItems.push({ invoiceId: inv.id, itemId: item.id, amount: item.payAmount });
      });
    });

    onPaymentApply?.({
      amount: paymentAmount,
      patient: selectedPatient,
      paymentMethod,
      paymentType: 'patient amount',
      description,
      paymentAmount,
      overpayment: parseFloat(overpayment),
      selectedInvoices,
      selectedItems,
    });
    onClose();
  };

  const headerBackground = '#7788bb';
  const greenHeader      = '#8eb378';
  const greenText        = '#7788bb';
  const linkBlue         = '#5b7bb1';

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', minWidth: '1250px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: headerBackground, py: 1.25, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 400 }}>Add Payment</Typography>
      </Box>

      <Box sx={{ p: 2.5, maxHeight: 'calc(90vh - 50px)', overflowY: 'auto' }}>
        {/* Top Info Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <Typography sx={{ color: greenText, fontSize: '0.8125rem', fontWeight: 500 }}>
            {dayjs().format('MM/DD/YYYY')}
          </Typography>
          <Typography sx={{ color: greenText, fontSize: '0.8125rem' }}>Payment</Typography>
          <Typography sx={{ fontSize: '0.8125rem' }}>from</Typography>
          <Select variant="standard" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}
            sx={{ fontSize: '0.8125rem', minWidth: 100, '& .MuiSelect-select': { pb: 0.5 } }} MenuProps={MENU_PROPS}>
            <MenuItem value={selectedPatient}>{selectedPatient}</MenuItem>
          </Select>
          <Typography sx={{ fontSize: '0.8125rem' }}>with</Typography>
          <Select variant="standard" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ fontSize: '0.8125rem', minWidth: 120, '& .MuiSelect-select': { pb: 0.5 } }} MenuProps={MENU_PROPS}>
            {['EFT','Debit Card (debit)','Visa Card','Master Card','Amex','Patient Check','Insurance Check',
              'Cash','Account Credit','Account Correction','Courtesy Credit','INP Special',
              'Insurance Refund/Back to Office','HSA','Testing Credit','Collection Agency Payment'].map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
          {paymentMethod === 'Patient Check' && (
            <>
              <Typography sx={{ fontSize: '0.8125rem', ml: 2 }}>Cheque #:</Typography>
              <TextField variant="standard" sx={{ width: 80, mx: 1 }} />
              <Typography sx={{ fontSize: '0.8125rem', ml: 2 }}>Bank/Branch #:</Typography>
              <TextField variant="standard" sx={{ width: 100, mx: 1 }} />
            </>
          )}
        </Box>

        <Box sx={{ borderTop: `1px solid ${greenHeader}`, my: 2.5 }} />

        {/* Patient Amount Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Checkbox size="small" sx={{ p: 0.5 }} checked={patientAmountChecked} onChange={(e) => setPatientAmountChecked(e.target.checked)} />
          <Select variant="standard" value="patient amount"
            sx={{ fontSize: '0.8125rem', width: 130, '& .MuiSelect-select': { pb: 0.5 } }} MenuProps={MENU_PROPS}>
            <MenuItem value="patient amount">patient amount</MenuItem>
          </Select>
          <Box sx={{ border: '1px dashed #999', padding: '2px 8px', display: 'flex', alignItems: 'center', width: '80px' }}>
            <Typography sx={{ fontSize: '0.8125rem', mr: 0.5 }}>$</Typography>
            <TextField
              value={displayAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ input: { p: 0, fontSize: '0.8125rem' } }}
            />
          </Box>
        </Box>

        {/* Invoice / Procedure list */}
        {loading ? (
          <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>Loading pending invoices...</Typography>
        ) : invoices.length === 0 ? (
          <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>No pending invoices found.</Typography>
        ) : (
          invoices
            .map(inv => ({
              ...inv,
              lineItems: (inv.lineItems || []).filter(proc => Number(proc.payAmount) > 0)
            }))
            .filter(inv => inv.lineItems.length > 0)
            .length === 0 ? (
            <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>No unpaid procedures found.</Typography>
          ) : (
          invoices
            .map(inv => ({
              ...inv,
              lineItems: (inv.lineItems || []).filter(proc => Number(proc.payAmount) > 0)
            }))
            .filter(inv => inv.lineItems.length > 0)
            .map((inv) => (
            <Box key={inv.id} sx={{ mb: 2 }}>
              {/* Invoice summary row */}
              <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Checkbox size="small" sx={{ p: 0.5 }} checked={inv.checked} onChange={() => handleInvoiceToggle(inv.id)} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#333' }}>
                    Invoice #{inv.invoiceNumber || inv.id} :{' '}
                    {inv.invoiceDate ? dayjs(inv.invoiceDate).format('MM/DD/YYYY') : 'N/A'} for {selectedPatient}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 2 }}>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '120px', textAlign: 'right' }}>
                    Total Balance: ${Number(inv.balanceDue || inv.totalAmount || 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '80px', textAlign: 'center' }}>Ins Writeoff</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '140px', textAlign: 'right' }}>
                    Insurance Balance: ${Number(inv.insurancePortion || 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '130px', textAlign: 'right' }}>
                    Patient Balance: ${Number(inv.patientPortion || 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '100px', textAlign: 'right', color: '#5e9e42' }}>
                    Payment: ${(inv.lineItems || []).reduce((s, i) => s + Number(i.payAmount || 0), 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Line-item rows */}
              {(inv.lineItems || []).map((proc) => (
                <Box key={proc.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f5f5f5', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, pl: 2 }}>
                    <Checkbox size="small" sx={{ p: 0.5 }} checked={proc.checked} onChange={() => handleProcedureToggle(inv.id, proc.id)} />
                    <Typography sx={{ fontSize: '0.75rem', width: '60px',  color: '#555' }}>{proc.cptCode || proc.code || 'N/A'}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '180px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {proc.description || proc.name || proc.notes || 'Procedure'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>
                      {inv.provider?.firstName} {inv.provider?.lastName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 2 }}>
                    <Typography sx={{ fontSize: '0.75rem', width: '120px', textAlign: 'right', color: '#555' }}>${Number(proc.totalAmount     || 0).toFixed(2)}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', width:  '80px', textAlign: 'center', color: '#555' }}>${Number(proc.writeoffAmount  || 0).toFixed(2)}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '140px', textAlign: 'right', color: '#555' }}>${Number(proc.insuranceAmount || 0).toFixed(2)}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '130px', textAlign: 'right', color: '#555' }}>${Number(proc.patientBalance  || 0).toFixed(2)}</Typography>
                    <Box sx={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
                      <Box sx={{ border: '1px dashed #999', padding: '2px 4px', display: 'flex', alignItems: 'center', width: '60px' }}>
                        <TextField
                          value={proc.payAmount}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ input: { p: 0, fontSize: '0.75rem', textAlign: 'right', color: proc.checked ? '#5e9e42' : '#999' } }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ))
          )
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2.5, mt: 2.5, borderTop: `1px solid ${greenHeader}`, pt: 2 }}>
          {!showDescription ? (
            <Typography onClick={() => setShowDescription(true)} sx={{ color: linkBlue, fontSize: '0.8125rem', cursor: 'pointer', mr: 'auto' }}>
              + Add description
            </Typography>
          ) : (
            <TextField placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
              variant="standard" autoFocus sx={{ width: 250, mr: 'auto', input: { fontSize: '0.8125rem' } }} />
          )}

          <Typography sx={{ color: '#4a6b96', fontWeight: 'bold', fontSize: '0.8125rem' }}>
            Overpayment: ${overpayment}
          </Typography>
          <Typography sx={{ color: '#5e9e42', fontSize: '0.8125rem', fontWeight: 500 }}>
            Payment: ${paymentAmount.toFixed(2)}
          </Typography>

          <Button variant="contained" onClick={handleApplyAndPay} disabled={paymentAmount <= 0}
            sx={{ bgcolor: '#d4c197', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2.25, fontSize: '0.8125rem',
              '&:disabled': { cursor: 'not-allowed' }, '&:hover': { bgcolor: '#c5b396' } }}>
            Apply
          </Button>
          <Button variant="contained" onClick={onClose}
            sx={{ bgcolor: '#a9a9a9', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2.25, fontSize: '0.8125rem' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPaymentDialog;
