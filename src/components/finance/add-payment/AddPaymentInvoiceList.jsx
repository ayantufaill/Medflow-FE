import React from 'react';
import { Box, Typography, Checkbox, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';

const AddPaymentInvoiceList = ({
  loading,
  invoices,
  selectedPatient,
  handleInvoiceToggle,
  handleProcedureToggle,
  handleLineItemAmountChange
}) => {
  if (loading) {
    return <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>Loading pending invoices...</Typography>;
  }
  if (!invoices || invoices.length === 0) {
    return <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>No pending invoices with patient balance found.</Typography>;
  }

  // The fetchPaymentDraftInvoices thunk computes every per-procedure number with
  // the same ledger math the patient ledger uses, and already dropped the lines
  // nothing is owed on. Re-deriving a balance here (e.g. patientPortion -
  // paidAmount) reads pre-write-off/pre-transfer values and lists invoices that
  // owe nothing, so the enriched values are the single source of truth.
  const getPatientBalance = (value) => {
    if (!value || typeof value !== 'object') return 0;

    const balance = Number(
      value.patientBalance ?? value.payAmount ?? 0,
    );
    return Number.isFinite(balance) ? Math.max(0, balance) : 0;
  };

  const getMoney = (value, fallback = 0) => {
    const raw = value ?? fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const hasPatientBalance = (i) => getPatientBalance(i) > 0;

  const activeInvoices = (invoices || []).filter(
    (inv) => getPatientBalance(inv) > 0 || (inv.lineItems || []).some(hasPatientBalance),
  );

  if (activeInvoices.length === 0) {
    return <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>No pending invoices with patient balance found.</Typography>;
  }

  return (
    <>
      {activeInvoices.map((inv) => {
        // Derive invoice-level summary columns from the enriched line items.
        // This ensures the header always reflects post-transfer per-item values
        // rather than the potentially stale invoice-level meta fields.
        // Rows whose patient portion rounds to $0.00 are not collectible, so
        // they are hidden entirely.
        const items = (inv.lineItems || []).filter((i) => {
          const itemPatientBalance = getPatientBalance(i);
          return Number(itemPatientBalance.toFixed(2)) > 0;
        });
        const itemTotalCharge = items.reduce((s, i) => s + getMoney(i.totalAmount || i.totalPrice || i.charge || i.amount), 0);
        const itemTotalIns = items.reduce((s, i) => s + getMoney(i.insuranceAmount), 0);
        const itemTotalWriteoff = items.reduce((s, i) => s + getMoney(i.writeoffAmount), 0);
        const itemTotalAdjust = items.reduce((s, i) => s + getMoney(i.adjustmentAmount), 0);
        const itemTotalPatient = items.reduce((s, i) => s + getPatientBalance(i), 0);
        const totalCharge   = inv.totalBalance !== undefined ? getMoney(inv.totalBalance) : itemTotalCharge;
        const totalIns      = inv.insuranceBalance !== undefined ? getMoney(inv.insuranceBalance) : itemTotalIns;
        const totalWriteoff = inv.insWriteoffAmount !== undefined ? getMoney(inv.insWriteoffAmount) : itemTotalWriteoff;
        const totalAdjust   = inv.adjustmentAmount !== undefined ? getMoney(inv.adjustmentAmount) : itemTotalAdjust;
        const totalPatient  = inv.patientBalance !== undefined ? getMoney(inv.patientBalance) : itemTotalPatient;
        const totalPayment  = items.reduce((s, i) => s + getMoney(i.payAmount || i.amountPaid || i.paidAmount || 0), 0);

        return (
          <Box key={inv.id} sx={{ mb: 2 }}>
            {/* Invoice summary row */}
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Checkbox
                  size="small"
                  sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
                  checked={inv.checked}
                  onChange={() => handleInvoiceToggle(inv.id)}
                />
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#333' }}>
                  Invoice #{inv.invoiceNumber || inv.id} :{' '}
                  {inv.invoiceDate ? dayjs(inv.invoiceDate).format('MM/DD/YYYY') : 'N/A'} for {selectedPatient}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 2 }}>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '120px', textAlign: 'right' }}>
                  Total Balance: ${totalCharge.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '80px', textAlign: 'center' }}>
                  Ins Writeoff: ${totalWriteoff.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '140px', textAlign: 'right' }}>
                  Insurance Balance: ${totalIns.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '130px', textAlign: 'right' }}>
                  Patient Balance: ${totalPatient.toFixed(2)}
                </Typography>
                {totalAdjust > 0 && (
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '120px', textAlign: 'right' }}>
                    Adjustment: ${totalAdjust.toFixed(2)}
                  </Typography>
                )}
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '100px', textAlign: 'right', color: '#5e9e42' }}>
                  Payment: ${totalPayment.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Line-item rows */}
            {items.map((proc) => {
              const procTotal = getMoney(proc.totalAmount || proc.totalPrice || proc.charge || proc.amount);
              const procWriteoff = getMoney(proc.writeoffAmount);
              const procAdjust = getMoney(proc.adjustmentAmount);
              const procInsurance = getMoney(proc.insuranceAmount);
              const procPatient = getPatientBalance(proc);

              return (
                <Box key={proc.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f5f5f5', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, pl: 2 }}>
                    <Checkbox
                      size="small"
                      sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
                      checked={proc.checked}
                      onChange={() => handleProcedureToggle(inv.id, proc.id)}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '240px' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#333' }}>
                        {proc.description || proc.name || proc.notes || 'Procedure'}
                      </Typography>

                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#555', ml: 2 }}>
                      {inv.provider?.firstName} {inv.provider?.lastName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 2 }}>
                    <Typography sx={{ fontSize: '0.75rem', width: '120px', textAlign: 'right', color: '#555' }}>
                      ${procTotal.toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '80px', textAlign: 'center', color: '#555' }}>
                      ${procWriteoff.toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '140px', textAlign: 'right', color: '#555' }}>
                      ${procInsurance.toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '130px', textAlign: 'right', color: '#555' }}>
                      ${procPatient.toFixed(2)}
                    </Typography>
                    {procAdjust > 0 && (
                      <Typography sx={{ fontSize: '0.75rem', width: '120px', textAlign: 'right', color: '#7c3aed' }}>
                        ${procAdjust.toFixed(2)}
                      </Typography>
                    )}
                    <Box sx={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
                      <Box sx={{ border: '1px dashed #999', padding: '2px 4px', display: 'flex', alignItems: 'center', width: '60px' }}>
                        <TextField
                          value={proc.payAmount}
                          onChange={(e) => handleLineItemAmountChange(inv.id, proc.id, e.target.value)}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          sx={{ input: { p: 0, fontSize: '0.75rem', textAlign: 'right', color: proc.checked ? '#5e9e42' : '#999' } }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </>
  );
};

export default AddPaymentInvoiceList;
