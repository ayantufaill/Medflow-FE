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
    return <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>No pending invoices found.</Typography>;
  }

  // Use the invoices as-is — they are already filtered by the Redux thunk.
  // The slice guarantees each invoice has at least one item with an outstanding balance.
  const activeInvoices = invoices.filter(inv => (inv.lineItems || []).length > 0);

  if (activeInvoices.length === 0) {
    return <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>No unpaid procedures found.</Typography>;
  }

  return (
    <>
      {activeInvoices.map((inv) => {
        // Derive invoice-level summary columns from the enriched line items.
        // This ensures the header always reflects post-transfer per-item values
        // rather than the potentially stale invoice-level meta fields.
        const items = inv.lineItems || [];
        const totalCharge   = items.reduce((s, i) => s + Number(i.totalAmount    || 0), 0);
        const totalIns      = items.reduce((s, i) => s + Number(i.insuranceAmount || 0), 0);
        const totalPatient  = items.reduce((s, i) => s + Number(i.patientBalance  || 0), 0);
        const totalPayment  = items.reduce((s, i) => s + Number(i.payAmount       || 0), 0);

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
                  Ins Writeoff
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '140px', textAlign: 'right' }}>
                  Insurance Balance: ${totalIns.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '130px', textAlign: 'right' }}>
                  Patient Balance: ${totalPatient.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, width: '100px', textAlign: 'right', color: '#5e9e42' }}>
                  Payment: ${totalPayment.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Line-item rows */}
            {items.map((proc) => (
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
                    ${Number(proc.totalAmount    || 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', width: '80px', textAlign: 'center', color: '#555' }}>
                    ${Number(proc.writeoffAmount || 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', width: '140px', textAlign: 'right', color: '#555' }}>
                    ${Number(proc.insuranceAmount || 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', width: '130px', textAlign: 'right', color: '#555' }}>
                    ${Number(proc.patientBalance  || 0).toFixed(2)}
                  </Typography>
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
            ))}
          </Box>
        );
      })}
    </>
  );
};

export default AddPaymentInvoiceList;
