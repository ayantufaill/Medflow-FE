import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, MenuItem, Button } from '@mui/material';
import CustomSelect from '../../../common/CustomSelect';

const BillingConfigPreferences = ({ formData, handleChange, setFormData }) => {
  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
          Preferences & Toggles
        </Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        
        {/* Insurance & Claims */}
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', mb: 1.5 }}>
            Insurance & Claims
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#475569', minWidth: '220px', fontWeight: 500 }}>
                Estimate Insurance For All Plans:
              </Typography>
              <RadioGroup row value={formData.estimateInsurance || 'Yes'} onChange={handleChange('estimateInsurance')}>
                <FormControlLabel value="Yes" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Yes</Typography>} />
                <FormControlLabel value="No" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>No</Typography>} />
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#475569', minWidth: '220px', fontWeight: 500 }}>
                Default Claim Type:
              </Typography>
              <RadioGroup row value={formData.defaultClaimType || 'Electronic'} onChange={handleChange('defaultClaimType')}>
                <FormControlLabel value="Manual" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Manual</Typography>} />
                <FormControlLabel value="Electronic" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Electronic</Typography>} />
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#475569', minWidth: '220px', fontWeight: 500 }}>
                Clearing House:
              </Typography>
              <CustomSelect
                size="small"
                value={formData.clearingHouse || 'Vyne'}
                onChange={handleChange('clearingHouse')}
                sx={{ width: '150px' }}
              >
                <MenuItem value="Vyne">Vyne</MenuItem>
              </CustomSelect>
            </Box>
            
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.defaultAddClaims || false} onChange={handleChange('defaultAddClaims')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>"Add Claims" checkbox checked when adding an invoice</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.showSecondaryClaimPrompt || false} onChange={handleChange('showSecondaryClaimPrompt')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Prompt for secondary claim only if first claim is closed</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.hideBillingEntity || false} onChange={handleChange('hideBillingEntity')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Hide billing entity in claim form when insurance is non-assigned</Typography>}
            />
          </Box>
        </Box>

        {/* Billing & Statements */}
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', mb: 1.5 }}>
            Billing & Statements
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#475569', minWidth: '220px', fontWeight: 500 }}>
                Billing Mode:
              </Typography>
              <RadioGroup row value={formData.billingMode || 'advanced'} onChange={handleChange('billingMode')}>
                <FormControlLabel value="advanced" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>advanced</Typography>} />
                <FormControlLabel value="simple" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>simple</Typography>} />
              </RadioGroup>
            </Box>

            <FormControlLabel
              control={<Checkbox size="small" checked={formData.excludeClosedInvoices || false} onChange={handleChange('excludeClosedInvoices')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Exclude closed invoices on new claims</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.hideBillingTransfers || false} onChange={handleChange('hideBillingTransfers')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Hide billing transfers</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.hideVoidedInvoices || false} onChange={handleChange('hideVoidedInvoices')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Hide voided invoices</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.autogenerateInvoice || false} onChange={handleChange('autogenerateInvoice')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Automatically generate invoice after completing treatment plan procedures</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.autogenerateStatement || false} onChange={handleChange('autogenerateStatement')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Automatically generate statement after completing patient payment</Typography>}
            />
          </Box>
        </Box>

        {/* Payments & Credits */}
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', mb: 1.5 }}>
            Payments & Credits
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.enableInsuranceCreditPayment || false} onChange={handleChange('enableInsuranceCreditPayment')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Enable insurance account credit payment</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.enableInsuranceCreditTowardsOutstanding || false} onChange={handleChange('enableInsuranceCreditTowardsOutstanding')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Enable insurance account credit payment towards patient outstanding</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.useFamilyCredit || false} onChange={handleChange('useFamilyCredit')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>"Use Family Credit" checked by default when applying patient payment</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.displayZeroPayments || false} onChange={handleChange('displayZeroPayments')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Display Zero Payments</Typography>}
            />
          </Box>
        </Box>

        {/* Membership & Write-Offs */}
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', mb: 1.5 }}>
            Membership & Write-Offs
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.applyMembershipAdjustment || false} onChange={handleChange('applyMembershipAdjustment')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Apply Membership Adjustment</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.includeUnpaidMembershipPlans || false} onChange={handleChange('includeUnpaidMembershipPlans')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Include unpaid membership plans in procedure portion estimates</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.includeMembershipPortionsInReports || false} onChange={handleChange('includeMembershipPortionsInReports')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Include Membership Plan Portions in Financial Reports</Typography>}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={formData.honorWriteOff || false} onChange={handleChange('honorWriteOff')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only)</Typography>}
              />
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: '#2563eb',
                  borderColor: '#2563eb',
                  borderRadius: 1.5,
                  '&:hover': { backgroundColor: '#eff6ff', borderColor: '#1d4ed8' }
                }}
              >
                Apply to Insurance Plans
              </Button>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default BillingConfigPreferences;
