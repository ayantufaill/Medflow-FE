import React from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

const InsurancePaymentTable = ({
  procedures,
  handleProcedureChange,
  handleProcedureBlur,
  selectedClaimObj,
  patientName
}) => {
  const invoiceNum = selectedClaimObj?.invoice?.invoiceNumber || selectedClaimObj?.invoice?.id || selectedClaimObj?.invoiceId || selectedClaimObj?.claimNumber || selectedClaimObj?.id || 'N/A';
  const rawDate = selectedClaimObj?.invoice?.invoiceDate || selectedClaimObj?.createdAt || selectedClaimObj?.dateService || selectedClaimObj?.DateService || selectedClaimObj?.submissionDate;
  const invoiceDate = rawDate ? dayjs(rawDate).format('MM/DD/YYYY') : 'N/A';

  const totalSubmitted = procedures.reduce((acc, proc) => acc + Number((proc.submitted || '').toString().replace(/[^0-9.-]+/g, "")), 0);
  const totalDeductible = procedures.reduce((acc, proc) => acc + Number(proc.ded || 0), 0);
  const totalAllowed = procedures.reduce((acc, proc) => acc + Number(proc.allowed || 0), 0);
  const totalWo = procedures.reduce((acc, proc) => acc + Number(proc.wo || 0), 0);
  const totalPay = procedures.reduce((acc, proc) => acc + Number(proc.pay || 0), 0);

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
    <Box sx={{ px: 3, pb: 2 }}>
      {/* Table Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
        <Box sx={{ width: '250px' }}></Box>
        <Box sx={{ width: '40px', borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 }}></Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Submitted</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Deductible</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Allowed</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Ins WO</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '120px', textAlign: 'left', color: '#555' }}>Ins pay</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '130px', textAlign: 'center', color: '#555' }}>Update allowed fee</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '150px', textAlign: 'center', color: '#555' }}>Update Ins. Flat Portion</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, textAlign: 'center', color: '#555' }}>Move to new claim ⓘ</Typography>
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

            return (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  borderBottom: '1px solid #f5f5f5',
                  borderRadius: isOverpaid ? '4px' : undefined,
                  border: isOverpaid ? '1px solid #90caf9' : undefined,
                  bgcolor: isOverpaid ? 'rgba(35, 98, 239, 0.04)' : undefined,
                  mb: isOverpaid ? 0.5 : undefined,
                }}
              >
                <Box sx={{ width: '250px', display: 'flex', alignItems: 'center', py: 1, pl: isOverpaid ? 0.5 : 0 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>{proc.code}</Typography>
                    {isOverpaid && (
                      <Typography sx={{ fontSize: '0.68rem', color: '#1976d2', fontWeight: 600, mt: 0.25 }}>
                        ℹ Overpays by ${procOverpay.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ width: '40px', display: 'flex', alignItems: 'center', py: 1, borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>RSL</Typography>
                </Box>
                <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{proc.submitted}</Typography>
                </Box>
                <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
                  <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', width: '70px' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                    <input
                      type="text"
                      value={proc.ded}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleProcedureChange(i, 'ded', e.target.value)}
                      onBlur={() => handleProcedureBlur?.(i, 'ded')}
                      style={{ border: 'none', outline: 'none', background: 'transparent', width: '55px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
                  <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', width: '70px' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
                    <input
                      type="text"
                      value={proc.allowed}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleProcedureChange(i, 'allowed', e.target.value)}
                      onBlur={() => handleProcedureBlur?.(i, 'allowed')}
                      style={{ border: 'none', outline: 'none', background: 'transparent', width: '55px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
                  <Box sx={{ border: `1px dashed ${isOverpaid ? '#90caf9' : '#ccc'}`, px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', width: '70px' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25, color: '#f06c6c' }}>$</Typography>
                    <input
                      type="text"
                      value={proc.wo}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleProcedureChange(i, 'wo', e.target.value)}
                      onBlur={() => handleProcedureBlur?.(i, 'wo')}
                      style={{ border: 'none', outline: 'none', background: 'transparent', width: '55px', fontSize: '0.75rem', fontWeight: 600, padding: 0, color: '#f06c6c' }}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: '120px', display: 'flex', alignItems: 'stretch' }}>
                  <Box sx={{ bgcolor: isOverpaid ? '#1976d2' : '#8eb378', px: 1, py: 1, display: 'flex', alignItems: 'center', width: '100%', transition: 'background-color 0.2s' }}>
                    <Box sx={{ border: `1px dashed ${isOverpaid ? '#1565c0' : '#7ea368'}`, px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', bgcolor: 'transparent', width: '85px' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', mr: 0.25 }}>$</Typography>
                      <input
                        type="text"
                        value={proc.pay}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleProcedureChange(i, 'pay', e.target.value)}
                        onBlur={() => handleProcedureBlur?.(i, 'pay')}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '70px', fontSize: '0.75rem', fontWeight: 600, color: '#fff', padding: 0 }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ width: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={proc.updateAllowedFee} 
                    onChange={(e) => handleProcedureChange(i, 'updateAllowedFee', e.target.checked)} 
                  />
                </Box>
                <Box sx={{ width: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={proc.updateInsFlatPortion} 
                    onChange={(e) => handleProcedureChange(i, 'updateInsFlatPortion', e.target.checked)} 
                  />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={proc.moveToNewClaim} 
                    onChange={(e) => handleProcedureChange(i, 'moveToNewClaim', e.target.checked)} 
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Total Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee', mb: 3 }}>
        <Box sx={{ width: '250px' }}></Box>
        <Box sx={{ width: '40px', display: 'flex', alignItems: 'center', borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Total</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', color: '#555' }}>${totalSubmitted.toFixed(2)}</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', color: '#555' }}>${totalDeductible.toFixed(2)}</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', color: '#555' }}>${totalAllowed.toFixed(2)}</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', color: '#555' }}>${totalWo.toFixed(2)}</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '120px', color: '#555' }}>${totalPay.toFixed(2)}</Typography>
        <Box sx={{ flex: 1 }}></Box>
      </Box>
    </Box>
  );
};

export default InsurancePaymentTable;
