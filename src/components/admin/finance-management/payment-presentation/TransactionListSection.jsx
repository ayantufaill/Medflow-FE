import React from 'react';
import { Grid, Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import FormSection from './FormSection';

const TransactionListSection = ({ show, onToggle, formSettings, handleSettingChange }) => {
  return (
    <FormSection 
      title="Transaction List" 
      show={show} 
      onToggle={onToggle}
    >
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#334155' }}>Display Per Invoice</Typography>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayToothNum} onChange={(e) => handleSettingChange('displayToothNum', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Tooth number</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayProcCode} onChange={(e) => handleSettingChange('displayProcCode', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Procedure Code</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayShortDesc} onChange={(e) => handleSettingChange('displayShortDesc', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>System Short Description</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayTreatmentProvider} onChange={(e) => handleSettingChange('displayTreatmentProvider', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Treatment Provider</Typography>} />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayOfficeDesc} onChange={(e) => handleSettingChange('displayOfficeDesc', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Office Description</Typography>} />
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayEstInsPortion} onChange={(e) => handleSettingChange('displayEstInsPortion', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Estimated Ins. Portion</Typography>} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayPerInsCoverage} onChange={(e) => handleSettingChange('displayPerInsCoverage', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Show per insurance coverage</Typography>} />
            </Box>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings.displayEstInsAdj} onChange={(e) => handleSettingChange('displayEstInsAdj', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Estimated Ins. Adjustment</Typography>} />
          </Box>
        </Grid>
      </Grid>

      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 3, mb: 1, color: '#334155' }}>Other transactions to display</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
        {[
          { label: 'Patient Payment', key: 'transPatientPayment' },
          { label: 'Insurance Payment', key: 'transInsPayment' },
          { label: 'Insurance Adj (write-off)', key: 'transInsAdj' },
          { label: 'Office Adjustment', key: 'transOfficeAdj' },
          { label: 'Claim', key: 'transClaim' },
          { label: 'Payment Refund', key: 'transRefund' },
        ].map((item, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel control={<Checkbox size="small" checked={formSettings[item.key]} onChange={(e) => handleSettingChange(item.key, e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{item.label}</Typography>} />
            {item.key === 'transClaim' && (
              <FormControlLabel sx={{ ml: 0 }} control={<Checkbox size="small" checked={formSettings.transClaimInsName} onChange={(e) => handleSettingChange('transClaimInsName', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Insurance Name</Typography>} />
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, mt: 0.5 }}>
        {[
          { label: 'Deposit (pre-payment & overpayment) - only on full account statement', key: 'transDeposit' },
          { label: 'Refund Account Credit - only on full account statement', key: 'transRefundCredit' },
          { label: 'Transfer of Account Credit - only on full account statement', key: 'transTransferCredit' }
        ].map((item, i) => (
          <FormControlLabel key={i} control={<Checkbox size="small" checked={formSettings[item.key]} onChange={(e) => handleSettingChange(item.key, e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{item.label}</Typography>} />
        ))}
      </Box>
      <Typography sx={{ color: '#f59e0b', fontSize: '0.75rem', mt: 1, fontStyle: 'italic', fontWeight: 500 }}>
        * We recommend you uncheck the credit and balance columns from the section below<br/>since the number will not match due to the hidden transcations
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Show columns:</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.showCreditColumn} onChange={(e) => handleSettingChange('showCreditColumn', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Credit Column</Typography>} />
          <FormControlLabel control={<Checkbox size="small" checked={formSettings.showBalanceColumn} onChange={(e) => handleSettingChange('showBalanceColumn', e.target.checked)} sx={{ color: '#2563eb' }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Balance Column</Typography>} />
        </Box>
      </Box>
    </FormSection>
  );
};

export default TransactionListSection;
