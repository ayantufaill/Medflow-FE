import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
  Button,
  Link as MuiLink,
  Divider,
  FormControl,
  InputLabel,
  Radio as MuiRadio
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  InfoOutlined as InfoIcon
} from '@mui/icons-material';

const BillingConfiguration = () => {
  const [formData, setFormData] = useState({
    // General Settings (Left side)
    assignmentAllBenefits: true,
    outOfNetworkByDefault: false,
    chronologicalInvoices: false,
    closeClaimsNonAssignment: true,
    closeClaimsZeroOwing: false,
    policiesForClaimsOnly: false,

    // Right Side
    useOfficeAddress: false,
    useForClaims: false,
    country: 'Country',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    defaultBillingType: 'Standard',
    defaultPracticeService: '',
    defaultBillingProvider: 'Treating Provider',
    estimateInsurance: 'Yes',
    bankAccountNumber: '',
    bankAccountInfo: '',
    billingMode: 'advanced',
    excludeClosedInvoices: true,
    hideBillingTransfers: false,
    hideVoidedInvoices: true,
    enableInsuranceCreditPayment: true,
    enableInsuranceCreditTowardsOutstanding: true,
    statementVersion: '2',
    defaultAddClaims: true,
    defaultClaimType: 'Electronic',
    useFamilyCredit: true,
    hideBillingEntity: false,
    clearingHouse: 'Vyne',
    autogenerateInvoice: false,
    autogenerateStatement: false,
    showSecondaryClaimPrompt: true,
    displayZeroPayments: false,
    applyMembershipAdjustment: true,
    includeUnpaidMembershipPlans: true,
    includeMembershipPortionsInReports: false,
    honorWriteOff: true,
  });

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generalSettingsItems = [
    { key: 'assignmentAllBenefits', label: 'Assignment all benefits to be paid by default from the insurance company directly to the office.', info: true },
    { key: 'outOfNetworkByDefault', label: 'Set all provider to be out of network with all carriers, by default.', info: true },
    { key: 'chronologicalInvoices', label: 'Display invoices in chronological order.', info: false },
    { key: 'closeClaimsNonAssignment', label: 'Automatically close claims if non assignment.', info: false },
    { key: 'closeClaimsZeroOwing', label: 'Automatically close claims if zero owing.', info: false },
    { key: 'policiesForClaimsOnly', label: 'Use Policies for Claims Only.', info: true },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; Billing Configuration
        </Typography>
      </Box>

      {/* Main Content Card */}
      <Box 
        sx={{ 
          backgroundColor: 'white', 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          p: 4,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ display: 'flex', gap: 6, alignItems: 'start' }}>
          {/* Left Column: General Settings */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'underline' }}>
                General Settings
              </Typography>
              <MuiLink href="#" sx={{ fontSize: '0.8125rem', textDecoration: 'none', color: 'primary.main' }}>
                Preview statement
              </MuiLink>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, backgroundColor: '#fdfdfd' }}>
              {generalSettingsItems.map((item) => (
                <Box 
                  key={item.key} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 0.5, 
                    px: 1,
                    border: '1px solid #edf2f7',
                    mb: -'1px',
                    backgroundColor: 'white'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox 
                        size="small" 
                        checked={formData[item.key]} 
                        onChange={handleChange(item.key)}
                        sx={{ color: '#cbd5e0', '&.Mui-checked': { color: '#4a5568' } }} 
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>{item.label}</Typography>
                        {item.info && <InfoIcon sx={{ fontSize: '0.875rem', color: '#a0aec0' }} />}
                      </Box>
                    }
                    sx={{ margin: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e0e0' }} />

          {/* Right Column */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Billing Address Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '100px', textDecoration: 'underline' }}>
                  Billing Address
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.useOfficeAddress} onChange={handleChange('useOfficeAddress')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>use office address</Typography>}
                  sx={{ m: 0 }}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.useForClaims} onChange={handleChange('useForClaims')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>use for claims</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 0 }}>
                {[
                  { key: 'country', label: 'Country:', value: 'Country', type: 'select' },
                  { key: 'address1', label: 'Address Line 1:', value: 'Address line 1' },
                  { key: 'address2', label: 'Address Line 2:', value: 'Address line 2' },
                  { key: 'city', label: 'City:', value: 'City' },
                  { key: 'state', label: 'State/Province:', value: 'State/Province' },
                  { key: 'zip', label: 'Zip/Postal Code:', value: 'Zip/Postal Code' },
                ].map((field) => (
                  <Box key={field.key} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.8125rem', color: '#4a5568', width: '120px', textAlign: 'right', pr: 2, fontWeight: 600 }}>
                      {field.label}
                    </Typography>
                    {field.type === 'select' ? (
                      <Select
                        size="small"
                        value={formData[field.key]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        sx={{ height: 24, fontSize: '0.8125rem', width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1px solid #e2e8f0', borderRadius: 0 } }}
                      >
                        <MenuItem value={field.value}>{field.value}</MenuItem>
                      </Select>
                    ) : (
                      <TextField
                        variant="standard"
                        placeholder={field.value}
                        value={formData[field.key]}
                        onChange={handleChange(field.key)}
                        sx={{ width: '200px', '& .MuiInput-underline:before': { borderBottomColor: '#e2e8f0' }, '& .MuiInputBase-input': { py: 0, fontSize: '0.8125rem' } }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Other settings */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Default Billing Type */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Default Billing Type:
                </Typography>
                <Select
                  size="small"
                  value={formData.defaultBillingType}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultBillingType: e.target.value }))}
                  sx={{ height: 24, fontSize: '0.8125rem', width: '120px' }}
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                </Select>
              </Box>

              {/* Default Practice Service */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Default Practice Service:
                </Typography>
                <Select
                  size="small"
                  value={formData.defaultPracticeService}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultPracticeService: e.target.value }))}
                  sx={{ height: 24, fontSize: '0.8125rem', width: '200px' }}
                >
                  <MenuItem value="">Select Service</MenuItem>
                </Select>
              </Box>

              {/* Default Billing Provider */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Default Billing Provider:
                </Typography>
                <Select
                  size="small"
                  value={formData.defaultBillingProvider}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultBillingProvider: e.target.value }))}
                  sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
                >
                  <MenuItem value="Treating Provider">Treating Provider</MenuItem>
                </Select>
              </Box>

              {/* Estimate Insurance */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '220px', textDecoration: 'underline' }}>
                  Estimate Insurance For All Plans:
                </Typography>
                <RadioGroup row value={formData.estimateInsurance} onChange={handleChange('estimateInsurance')}>
                  <FormControlLabel value="Yes" control={<MuiRadio size="small" />} label={<Typography sx={{ fontSize: '0.8125rem' }}>Yes</Typography>} />
                  <FormControlLabel value="No" control={<MuiRadio size="small" />} label={<Typography sx={{ fontSize: '0.8125rem' }}>No</Typography>} />
                </RadioGroup>
              </Box>

              {/* Bank Info */}
              {[
                { key: 'bankAccountNumber', label: 'Bank Account Number:', placeholder: '________________________' },
                { key: 'bankAccountInfo', label: 'Bank Account Info:', placeholder: '____________________________________' },
              ].map((item) => (
                <Box key={item.key} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                    {item.label}
                  </Typography>
                  <TextField 
                    variant="standard" 
                    placeholder={item.placeholder} 
                    value={formData[item.key]}
                    onChange={handleChange(item.key)}
                    sx={{ width: '250px', '& .MuiInput-underline:before': { borderBottom: 'none' }, '& .MuiInputBase-input': { py: 0, fontSize: '0.8125rem' } }} 
                  />
                </Box>
              ))}

              {/* Billing Mode */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '100px', textDecoration: 'underline' }}>
                  Billing Mode:
                </Typography>
                <RadioGroup row value={formData.billingMode} onChange={handleChange('billingMode')}>
                  <FormControlLabel value="advanced" control={<MuiRadio size="small" />} label={<Typography sx={{ fontSize: '0.8125rem' }}>advanced</Typography>} />
                  <FormControlLabel value="simple" control={<MuiRadio size="small" />} label={<Typography sx={{ fontSize: '0.8125rem' }}>simple</Typography>} />
                </RadioGroup>
              </Box>

              {/* Misc Checkboxes */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {[
                  { key: 'excludeClosedInvoices', label: 'Exclude closed invoices on new claims', subLabel: 'Exclude closed invoices on new claims' },
                  { key: 'hideBillingTransfers', label: 'Hide billing transfers', subLabel: 'Hide billing transfers' },
                  { key: 'hideVoidedInvoices', label: 'Hide voided invoices', subLabel: 'Hide voided invoices' },
                ].map((item) => (
                  <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '160px', textDecoration: 'underline' }}>
                      {item.label}
                    </Typography>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={formData[item.key]} onChange={handleChange(item.key)} sx={{ color: '#cbd5e0' }} />}
                      label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>{item.subLabel}</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Insurance Account Credit */}
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', mb: 0.5, textDecoration: 'underline' }}>
                  Insurance Account Credit
                </Typography>
                <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.enableInsuranceCreditPayment} onChange={handleChange('enableInsuranceCreditPayment')} sx={{ color: '#cbd5e0' }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Enable insurance account credit payment</Typography>}
                    sx={{ m: 0 }}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.enableInsuranceCreditTowardsOutstanding} onChange={handleChange('enableInsuranceCreditTowardsOutstanding')} sx={{ color: '#cbd5e0' }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Enable insurance account credit payment towards patient outstanding</Typography>}
                    sx={{ m: 0 }}
                  />
                </Box>
              </Box>

              {/* Statement Configurations */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', textDecoration: 'underline' }}>
                  Statement Configurations
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Version:</Typography>
                  <Select 
                    size="small" 
                    value={formData.statementVersion} 
                    onChange={(e) => setFormData(prev => ({ ...prev, statementVersion: e.target.value }))}
                    sx={{ height: 24, fontSize: '0.8125rem', width: '50px' }}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                </Box>
              </Box>

              {/* Default Add Claims */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Default Add Claims
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.defaultAddClaims} onChange={handleChange('defaultAddClaims')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>"Add Claims" checkbox checked when adding an invoice</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Default Claim Type */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Default Claim Type
                </Typography>
                <RadioGroup row value={formData.defaultClaimType} onChange={handleChange('defaultClaimType')}>
                  <FormControlLabel value="Manual" control={<MuiRadio size="small" />} label={<Typography sx={{ fontSize: '0.8125rem' }}>Manual</Typography>} />
                  <FormControlLabel value="Electronic" control={<MuiRadio size="small" />} label={<Typography sx={{ fontSize: '0.8125rem' }}>Electronic</Typography>} />
                </RadioGroup>
              </Box>

              {/* Use Family Credit */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Use Family Credit
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.useFamilyCredit} onChange={handleChange('useFamilyCredit')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568', maxWidth: '300px' }}>"Use Family Credit" checkbox checked when applying patient payment with account credit</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Hide Billing Entity */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', minWidth: '150px', textDecoration: 'underline' }}>
                  Hide Billing Entity
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.hideBillingEntity} onChange={handleChange('hideBillingEntity')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Hide billing entity in claim form when insurance is non-assigned</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Clearing House */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', width: '120px', textDecoration: 'underline' }}>
                  Clearing House
                </Typography>
                <Select 
                  size="small" 
                  value={formData.clearingHouse} 
                  onChange={(e) => setFormData(prev => ({ ...prev, clearingHouse: e.target.value }))}
                  sx={{ height: 24, fontSize: '0.8125rem', width: '100px' }}
                >
                  <MenuItem value="Vyne">Vyne</MenuItem>
                </Select>
              </Box>

              {/* Autogenerate Invoice */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', width: '140px', textDecoration: 'underline' }}>
                  Autogenerate Invoice
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.autogenerateInvoice} onChange={handleChange('autogenerateInvoice')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Automatically generate invoice after completing treatment plan procedures.</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Autogenerate Statement */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', width: '140px', textDecoration: 'underline' }}>
                  Autogenerate Statement
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.autogenerateStatement} onChange={handleChange('autogenerateStatement')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Automatically generate statement after completing patient payment.</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Show Secondary Claim Prompt */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', width: '160px', textDecoration: 'underline' }}>
                  Show Secondary Claim Prompt
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.showSecondaryClaimPrompt} onChange={handleChange('showSecondaryClaimPrompt')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Prompt only if first claim is closed</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Zero Payments */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', width: '100px', textDecoration: 'underline' }}>
                  Zero Payments
                </Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.displayZeroPayments} onChange={handleChange('displayZeroPayments')} sx={{ color: '#cbd5e0' }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Display Zero Payments</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>

              {/* Membership Plans */}
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', width: '120px', textDecoration: 'underline' }}>
                  Membership Plans
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.applyMembershipAdjustment} onChange={handleChange('applyMembershipAdjustment')} sx={{ color: '#cbd5e0' }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Apply Membership Adjustment</Typography>}
                    sx={{ m: 0 }}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.includeUnpaidMembershipPlans} onChange={handleChange('includeUnpaidMembershipPlans')} sx={{ color: '#cbd5e0' }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Include unpaid membership plans in procedure portion estimates</Typography>}
                    sx={{ m: 0 }}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.includeMembershipPortionsInReports} onChange={handleChange('includeMembershipPortionsInReports')} sx={{ color: '#cbd5e0' }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Include Membership Plan Portions in Financial Reports</Typography>}
                    sx={{ m: 0 }}
                  />
                </Box>
              </Box>

              {/* Honor Write Off */}
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'primary.main', mb: 1, textDecoration: 'underline' }}>
                  Honor Write Off (When Limitation Reached for In-Network Providers Only)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.honorWriteOff} onChange={handleChange('honorWriteOff')} sx={{ color: '#cbd5e0' }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#4a5568' }}>Honor Write Off</Typography>}
                    sx={{ m: 0 }}
                  />
                  <Button 
                    variant="contained" 
                    size="small"
                    sx={{ 
                      textTransform: 'none', 
                      fontSize: '0.75rem', 
                      backgroundColor: '#5a8dee',
                      '&:hover': { backgroundColor: '#4a7dce' }
                    }}
                  >
                    Apply to Insurance Plans
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingConfiguration;
