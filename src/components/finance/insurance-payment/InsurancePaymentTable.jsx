import React from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

const InsurancePaymentTable = ({
  procedures,
  handleProcedureChange,
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

  return (
    <Box sx={{ px: 3, pb: 2 }}>
      {/* Invoice Summary Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#333' }}>
          Invoice #{invoiceNum} : {invoiceDate} for {patientName || 'Unknown Patient'}
        </Typography>
      </Box>

      {/* Table Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
        <Box sx={{ width: '250px' }}></Box>
        <Box sx={{ width: '40px', borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 }}></Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Submitted</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Deductible</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Allowed</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '90px', textAlign: 'left', color: '#555' }}>Ins WO</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '120px', textAlign: 'left', color: '#555' }}>Ins pay</Typography>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'left', color: '#555' }}>Difference</Typography>
        </Box>
      </Box>

      {/* Procedure Rows */}
      {procedures.map((proc, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #f5f5f5' }}>
          <Box sx={{ width: '250px', display: 'flex', alignItems: 'center', py: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>{proc.code}</Typography>
          </Box>
          <Box sx={{ width: '40px', display: 'flex', alignItems: 'center', py: 1, borderRight: '1px solid #eee', pr: 1.5, mr: 1.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>RSL</Typography>
          </Box>
          <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{proc.submitted}</Typography>
          </Box>
          <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
            <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
              <input type="text" value={proc.ded} onChange={(e) => handleProcedureChange(i, 'ded', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
            </Box>
          </Box>
          <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
            <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25 }}>$</Typography>
              <input type="text" value={proc.allowed} onChange={(e) => handleProcedureChange(i, 'allowed', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0 }} />
            </Box>
          </Box>
          <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', py: 1 }}>
            <Box sx={{ border: '1px dashed #ccc', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mr: 0.25, color: '#f06c6c' }}>$</Typography>
              <input type="text" value={proc.wo} onChange={(e) => handleProcedureChange(i, 'wo', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, padding: 0, color: '#f06c6c' }} />
            </Box>
          </Box>
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'stretch' }}>
            <Box sx={{ bgcolor: '#8eb378', px: 1, py: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ border: '1px dashed #7ea368', px: 0.5, py: 0.25, display: 'inline-flex', alignItems: 'center', bgcolor: 'transparent' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', mr: 0.25 }}>$</Typography>
                <input type="text" value={proc.pay} onChange={(e) => handleProcedureChange(i, 'pay', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '40px', fontSize: '0.75rem', fontWeight: 600, color: '#fff', padding: 0 }} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 1, pl: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>
              {(() => {
                const allowed = Number(proc.allowed || 0);
                const pay = Number(proc.pay || 0);
                const ded = Number(proc.ded || 0);
                const diff = (allowed - ded) - pay;
                if (diff > 0.005) {
                  return <>ins underpay: ${diff.toFixed(2)} <span style={{ fontStyle: 'italic' }}>(applied to pt balance)</span></>;
                } else if (diff < -0.005) {
                  return <>ins overpay: ${Math.abs(diff).toFixed(2)} <span style={{ fontStyle: 'italic' }}>(applied to pt balance)</span></>;
                }
                return '';
              })()}
            </Typography>
          </Box>
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
