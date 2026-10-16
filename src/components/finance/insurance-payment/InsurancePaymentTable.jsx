import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import dayjs from 'dayjs';

// Every column is a flex item that shrinks with the dialog, so the table never
// overflows its container (no horizontal scroll) and no cell is clipped — the
// numeric inputs stretch to their column instead of holding a fixed width.
const COLS = {
  code: 2.6,
  rsl: 0.6,
  submitted: 1,
  balance: 1,
  deductible: 1,
  allowed: 1,
  appliedInsPay: 1.15,
  appliedInsWo: 1.15,
  insWo: 1,
  insPay: 1.25,
  updateAllowedFee: 1.15,
  updateInsFlatPortion: 1.25,
  moveToNewClaim: 1.25,
};

const gridTemplate = (showBalance) => [
  COLS.code,
  COLS.rsl,
  COLS.submitted,
  showBalance && COLS.balance,
  COLS.deductible,
  COLS.allowed,
  showBalance && COLS.appliedInsPay,
  showBalance && COLS.appliedInsWo,
  COLS.insWo,
  COLS.insPay,
  COLS.updateAllowedFee,
  COLS.updateInsFlatPortion,
  COLS.moveToNewClaim,
].filter(Boolean).map((size) => `${size}fr`).join(' ');

// `boxSizing: 'border-box'` keeps every cell's width exactly its flex share.
// Without it the per-cell padding is added outside the flex-basis, so cells
// with different padding (inputs, the RSL spacer, …) end up slightly wider and
// each row's columns drift out of line with the header/total labels.
const col = (grow, extra = {}) => ({
  flex: `${grow} 1 0`,
  minWidth: 0,
  boxSizing: 'border-box',
  ...extra,
});

const headerCell = (grow, extra = {}) => ({
  ...col(grow),
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#555',
  textAlign: 'left',
  ...extra,
});

const textCell = { fontSize: '0.75rem', color: '#666' };

// A shared input box: the outer wrapper fills the column, the inner dashed box
// fills the wrapper, and the input itself fills whatever is left after the "$".
const moneyBox = (borderColor) => ({
  border: `1px dashed ${borderColor}`,
  px: 0.5,
  py: 0.25,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
});

const moneyInput = (extra = {}) => ({
  border: 'none',
  outline: 'none',
  background: 'transparent',
  width: '100%',
  minWidth: 0,
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: 0,
  ...extra,
});

const InsurancePaymentTable = ({
  procedures,
  handleProcedureChange,
  handleProcedureBlur,
  selectedClaimObj,
  patientName,
  showBalanceColumn = false
}) => {
  const invoiceNum = selectedClaimObj?.invoice?.invoiceNumber || selectedClaimObj?.invoice?.id || selectedClaimObj?.invoiceId || selectedClaimObj?.claimNumber || selectedClaimObj?.id || 'N/A';
  const rawDate = selectedClaimObj?.invoice?.invoiceDate || selectedClaimObj?.createdAt || selectedClaimObj?.dateService || selectedClaimObj?.DateService || selectedClaimObj?.submissionDate;
  const invoiceDate = rawDate ? dayjs(rawDate).format('MM/DD/YYYY') : 'N/A';

  const totalCharge = procedures.reduce((acc, proc) => acc + Number(proc.charge || 0), 0);
  const totalDeductible = procedures.reduce((acc, proc) => acc + Number(proc.ded || 0), 0);
  const totalAllowed = procedures.reduce((acc, proc) => acc + Number(proc.allowed || 0), 0);
  const totalAppliedInsPay = procedures.reduce((acc, proc) => acc + Number(proc.appliedInsPay || 0), 0);
  const totalAppliedInsWo = procedures.reduce((acc, proc) => acc + Number(proc.appliedInsWo || 0), 0);
  const totalWo = procedures.reduce((acc, proc) => acc + Number(proc.wo || 0), 0);
  const totalPay = procedures.reduce((acc, proc) => acc + Number(proc.pay || 0), 0);
  const totalBalance = procedures.reduce((acc, proc) => acc + Number(proc.balance || 0), 0);

  // Group procedures by invoice if available
  const invoiceGroups = React.useMemo(() => {
    const groups = {};
    procedures.forEach((proc, idx) => {
      const invId = proc.invoiceId || 'default';
      if (!groups[invId]) {
        groups[invId] = {
          invoiceId: proc.invoiceId,
          invoiceNumber: proc.invoiceNumber || selectedClaimObj?.invoice?.invoiceNumber || proc.invoiceId || invoiceNum,
          invoiceDate: proc.invoiceDate ? dayjs(proc.invoiceDate).format('MM/DD/YYYY') : invoiceDate,
          items: []
        };
      }
      groups[invId].items.push({ ...proc, _originalIndex: idx });
    });
    return Object.values(groups);
  }, [procedures, invoiceNum, invoiceDate, selectedClaimObj]);

  return (
    <Box sx={{ px: 3, pb: 2, width: '100%', boxSizing: 'border-box' }}>
      {/* Table Header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: gridTemplate(showBalanceColumn), alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
        <Box sx={col(COLS.code)}></Box>
        <Box sx={col(COLS.rsl, { borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 })}></Box>
        <Typography sx={headerCell(COLS.submitted)}>Submitted</Typography>
        {showBalanceColumn && (
          <Typography sx={headerCell(COLS.balance)}>Balance</Typography>
        )}
        <Typography sx={headerCell(COLS.deductible)}>Deductible</Typography>
        <Typography sx={headerCell(COLS.allowed)}>Allowed</Typography>
        {showBalanceColumn && (
          <Typography sx={headerCell(COLS.appliedInsPay)}>Applied Ins Pay</Typography>
        )}
        {showBalanceColumn && (
          <Typography sx={headerCell(COLS.appliedInsWo)}>Applied Ins WO</Typography>
        )}
        <Typography sx={headerCell(COLS.insWo)}>Ins WO</Typography>
        <Typography sx={headerCell(COLS.insPay)}>Ins pay</Typography>
        <Typography sx={headerCell(COLS.updateAllowedFee, { textAlign: 'center' })}>Update allowed fee</Typography>
        <Typography sx={headerCell(COLS.updateInsFlatPortion, { textAlign: 'center' })}>Update Ins. Flat Portion</Typography>
        <Typography sx={headerCell(COLS.moveToNewClaim, { textAlign: 'center' })}>Move to new claim ⓘ</Typography>
      </Box>

      {/* Invoice Groups */}
      {invoiceGroups.map((group, gIdx) => (
        <Box key={gIdx} sx={{ mb: 2 }}>
          {/* Invoice Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', px: 1.5, py: 0.75, borderRadius: '6px', mb: 1, border: '1px solid #e2e8f0' }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b' }}>
              Invoice #{group.invoiceNumber} : {group.invoiceDate} for {patientName || 'Unknown Patient'}
            </Typography>
          </Box>

          {/* Procedure Rows for this Invoice */}
          {group.items.map((proc) => {
            const i = proc._originalIndex;
            // Detect overpayment: if (wo + pay) > insPortionEst, highlight this row
            const insEst = Number(proc.insPortionEst || 0);
            const woNum = Number(proc.wo || 0);
            const payNum = Number(proc.pay || 0);
            const procOverpay = insEst > 0 ? Math.max(0, Math.round(((woNum + payNum) - insEst) * 100) / 100) : 0;
            const isOverpaid = procOverpay > 0.005;
            const allowedNum = Number(proc.allowed || 0);
            const isPayOverAllowed =
              !proc.moveToNewClaim &&
              Math.round((payNum - allowedNum) * 100) / 100 > 0.005;

            return (
              <Box
                key={i}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: gridTemplate(showBalanceColumn),
                  alignItems: 'stretch',
                  borderBottom: '1px solid #f5f5f5',
                  borderRadius: isOverpaid ? '4px' : undefined,
                  border: isOverpaid ? '1px solid #90caf9' : undefined,
                  bgcolor: isOverpaid ? 'rgba(35, 98, 239, 0.04)' : undefined,
                  mb: isOverpaid ? 0.5 : undefined,
                }}
              >
                <Box sx={col(COLS.code, { display: 'flex', alignItems: 'center', py: 1, pl: isOverpaid ? 0.5 : 0, pr: 0.5 })}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {proc.code}
                    </Typography>
                    {isOverpaid && (
                      <Typography sx={{ fontSize: '0.68rem', color: '#1976d2', fontWeight: 600, mt: 0.25 }}>
                        ℹ Overpays by ${procOverpay.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={col(COLS.rsl, { display: 'flex', alignItems: 'center', py: 1, borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 })}>
                  <Typography sx={textCell}>RSL</Typography>
                </Box>
                <Box sx={col(COLS.submitted, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                  <Typography sx={textCell}>{Number(proc.charge) > 0 ? `$${Number(proc.charge).toFixed(2)}` : proc.submitted}</Typography>
                </Box>
                {showBalanceColumn && (
                  <Box sx={col(COLS.balance, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: Number(proc.balance) > 0 ? '#b26a00' : '#666' }}>
                      ${Number(proc.balance || 0).toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box sx={col(COLS.deductible, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                  <Box sx={moneyBox('#ccc')}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                    <input
                      type="text"
                      value={proc.ded}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleProcedureChange(i, 'ded', e.target.value)}
                      onBlur={() => handleProcedureBlur?.(i, 'ded')}
                      style={moneyInput()}
                    />
                  </Box>
                </Box>
                <Box sx={col(COLS.allowed, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                  <Box sx={moneyBox('#ccc')}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                    <input
                      type="text"
                      value={proc.allowed}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleProcedureChange(i, 'allowed', e.target.value)}
                      onBlur={() => handleProcedureBlur?.(i, 'allowed')}
                      style={moneyInput()}
                    />
                  </Box>
                </Box>
                {showBalanceColumn && (
                  <Box sx={col(COLS.appliedInsPay, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: Number(proc.appliedInsPay) > 0 ? '#2e7d32' : '#666' }}>
                      ${Number(proc.appliedInsPay || 0).toFixed(2)}
                    </Typography>
                  </Box>
                )}
                {showBalanceColumn && (
                  <Box sx={col(COLS.appliedInsWo, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: Number(proc.appliedInsWo) > 0 ? '#2e7d32' : '#666' }}>
                      ${Number(proc.appliedInsWo || 0).toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box sx={col(COLS.insWo, { display: 'flex', alignItems: 'center', py: 1, pr: 0.5 })}>
                  <Box sx={moneyBox(isOverpaid ? '#90caf9' : '#ccc')}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25, color: '#f06c6c' }}>$</Typography>
                    <input
                      type="text"
                      value={proc.wo}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleProcedureChange(i, 'wo', e.target.value)}
                      onBlur={() => handleProcedureBlur?.(i, 'wo')}
                      style={moneyInput({ color: '#f06c6c' })}
                    />
                  </Box>
                </Box>
                <Box sx={col(COLS.insPay, { display: 'flex', alignItems: 'stretch' })}>
                  <Box sx={{ bgcolor: isPayOverAllowed ? '#d32f2f' : (isOverpaid ? '#1976d2' : '#8eb378'), px: 1, py: 1, display: 'flex', alignItems: 'center', width: '100%', minWidth: 0, boxSizing: 'border-box', transition: 'background-color 0.2s', boxShadow: isPayOverAllowed ? '0 0 0 2px rgba(211, 47, 47, 0.35)' : undefined }}>
                    <Box sx={moneyBox(isPayOverAllowed ? '#ffcdd2' : (isOverpaid ? '#1565c0' : '#7ea368'))}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', mr: 0.25 }}>$</Typography>
                      <input
                        type="text"
                        value={proc.pay}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleProcedureChange(i, 'pay', e.target.value)}
                        onBlur={() => handleProcedureBlur?.(i, 'pay')}
                        style={moneyInput({ color: '#fff' })}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={col(COLS.updateAllowedFee, { display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
                  <input
                    type="checkbox"
                    checked={proc.updateAllowedFee}
                    onChange={(e) => handleProcedureChange(i, 'updateAllowedFee', e.target.checked)}
                  />
                </Box>
                <Box sx={col(COLS.updateInsFlatPortion, { display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
                  <input
                    type="checkbox"
                    checked={proc.updateInsFlatPortion}
                    onChange={(e) => handleProcedureChange(i, 'updateInsFlatPortion', e.target.checked)}
                  />
                </Box>
                <Box sx={col(COLS.moveToNewClaim, { display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
                  <input
                    type="checkbox"
                    checked={proc.moveToNewClaim}
                    onChange={(e) => handleProcedureChange(i, 'moveToNewClaim', e.target.checked)}
                  />
                </Box>
                {isPayOverAllowed && (
                  <Box sx={{ gridColumn: '1 / -1', width: '100%', display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#fdecea', border: '1px solid #f5a9a0', borderRadius: '6px', px: 1, py: 0.5, mt: 0.5, mb: 0.5 }}>
                    <WarningIcon sx={{ fontSize: '0.9rem', color: '#c0392b' }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#c0392b' }}>
                      Ins payment is greater than the allowed — adjust it or type a correct amount.
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Total Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: gridTemplate(showBalanceColumn), alignItems: 'center', py: 1, borderBottom: '1px solid #eee', mb: 3 }}>
        <Box sx={col(COLS.code)}></Box>
        <Box sx={col(COLS.rsl, { display: 'flex', alignItems: 'center', borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 })}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Total</Typography>
        </Box>
        <Typography sx={col(COLS.submitted, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalCharge.toFixed(2)}</Typography>
        {showBalanceColumn && (
          <Typography sx={col(COLS.balance, { fontSize: '0.75rem', fontWeight: 600, color: '#b26a00' })}>${totalBalance.toFixed(2)}</Typography>
        )}
        <Typography sx={col(COLS.deductible, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalDeductible.toFixed(2)}</Typography>
        <Typography sx={col(COLS.allowed, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalAllowed.toFixed(2)}</Typography>
        {showBalanceColumn && (
          <Typography sx={col(COLS.appliedInsPay, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalAppliedInsPay.toFixed(2)}</Typography>
        )}
        {showBalanceColumn && (
          <Typography sx={col(COLS.appliedInsWo, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalAppliedInsWo.toFixed(2)}</Typography>
        )}
        <Typography sx={col(COLS.insWo, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalWo.toFixed(2)}</Typography>
        <Typography sx={col(COLS.insPay, { fontSize: '0.75rem', fontWeight: 600, color: '#555' })}>${totalPay.toFixed(2)}</Typography>
        <Box sx={col(COLS.updateAllowedFee)}></Box>
        <Box sx={col(COLS.updateInsFlatPortion)}></Box>
        <Box sx={col(COLS.moveToNewClaim)}></Box>
      </Box>
    </Box>
  );
};

export default InsurancePaymentTable;
