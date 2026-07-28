import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Link as MuiLink } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

const generalSettingsItems = [
  { key: 'assignmentAllBenefits', label: 'Assignment all benefits to be paid by default from the insurance company directly to the office.', info: true },
  { key: 'outOfNetworkByDefault', label: 'Set all provider to be out of network with all carriers, by default.', info: true },
  { key: 'chronologicalInvoices', label: 'Display invoices in chronological order.', info: false },
  { key: 'closeClaimsNonAssignment', label: 'Automatically close claims if non assignment.', info: false },
  { key: 'closeClaimsZeroOwing', label: 'Automatically close claims if zero owing.', info: false },
  { key: 'policiesForClaimsOnly', label: 'Use Policies for Claims Only.', info: true },
];

const BillingConfigGeneral = ({ formData, handleChange, onPreviewStatement }) => {
  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
          General Settings
        </Typography>
        <MuiLink
          component="button"
          onClick={onPreviewStatement}
          sx={{ fontSize: '0.8125rem', textDecoration: 'none', color: '#2563eb', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          Preview statement
        </MuiLink>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {generalSettingsItems.map((item, index) => (
          <Box
            key={item.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.5,
              px: 3,
              borderBottom: index !== generalSettingsItems.length - 1 ? '1px solid #f1f5f9' : 'none',
              '&:hover': { backgroundColor: '#f8fafc' }
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={formData[item.key] || false}
                  onChange={handleChange(item.key)}
                  sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{item.label}</Typography>
                  {item.info && <InfoIcon sx={{ fontSize: '1.1rem', color: '#94a3b8' }} />}
                </Box>
              }
              sx={{ margin: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BillingConfigGeneral;
