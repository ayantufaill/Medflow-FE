import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import FormInput from './FormInput';
import CarrierSearchDropdown from './insurance-info/CarrierSearchDropdown';
import PlanBillingTable from './insurance-info/PlanBillingTable';
import { DUMMY_INSURANCE } from './utils/insuranceConstants';
import { formatPhoneNumber } from './utils/insuranceHelpers';

const InsuranceInformation = ({ 
  formData, 
  handleInputChange, 
  insuranceCompanies = [],
  assignmentOptions = []
}) => {
  const companies = insuranceCompanies.length > 0 ? insuranceCompanies : [];
  const benefits = assignmentOptions.length > 0 ? assignmentOptions : [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' }
  ];

  const handleSelectResult = (item) => {
    handleInputChange('insuranceCompanyId', item._id || item.id || 1);
    handleInputChange('carrierName', item.carrierName || item.name || '');
    handleInputChange('payerId', item.payerId || item.id || '');
    handleInputChange('carrierPhone', item.carrierPhone || item.phone || '');
    handleInputChange('payerAddress', item.payerAddress || item.address || item.city || '');
    handleInputChange('groupName', item.groupName || '');
    handleInputChange('groupNumber', item.groupNumber || '');
    handleInputChange('insurancePlan', item.planName || item.name || '');
    if (item.feeSched || item.feeGuide) {
      handleInputChange('planFeeGuide', item.feeSched || item.feeGuide);
    }
    handleInputChange('carrierSearch', '');
  };

  const onPhoneChange = (e) => {
    handleInputChange('phoneNumber', formatPhoneNumber(e.target.value));
  };

  return (
    <Box sx={{ border: '1px solid #DFE5EC', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
             <BusinessIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Insurance Information
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Carrier, payer and plan billing details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <CarrierSearchDropdown 
          formData={formData} 
          handleInputChange={handleInputChange} 
          companies={companies} 
          DUMMY_INSURANCE={DUMMY_INSURANCE} 
          handleSelectResult={handleSelectResult} 
        />

        <Box sx={{ mt: 1, mb: 1.5 }}>
          <FormInput
            label="Carrier / Payer Name"
            required
            value={formData.carrierName || ''}
            onChange={(e) => handleInputChange('carrierName', e.target.value)}
            sx={{ mb: 1.5 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <FormInput
                label="Payer ID"
                required
                value={formData.payerId || ''}
                onChange={(e) => handleInputChange('payerId', e.target.value)}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormInput
                label="Carrier Phone"
                value={formData.carrierPhone || ''}
                onChange={(e) => handleInputChange('carrierPhone', e.target.value)}
              />
            </Box>
          </Box>

          <FormInput
            label="Payer Address"
            value={formData.payerAddress || ''}
            onChange={(e) => handleInputChange('payerAddress', e.target.value)}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, mt: 1, px: 0.5 }}>
          <FormControlLabel
            control={<Checkbox size="small" sx={{ p: 0.5 }} checked={formData.claimsOnlyPolicy || false} onChange={(e) => handleInputChange('claimsOnlyPolicy', e.target.checked)} />}
            label={<Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>Claims only policy</Typography>}
          />
          <FormControlLabel
            control={<Checkbox size="small" sx={{ p: 0.5 }} checked={formData.planInfo} onChange={(e) => handleInputChange('planInfo', e.target.checked)} />}
            label={<Typography variant="caption">Plan Info</Typography>}
          />
        </Box>

        <PlanBillingTable 
          formData={{...formData, phoneNumber: formData.phoneNumber || ''}} 
          handleInputChange={(f,v) => f === 'phoneNumber' ? onPhoneChange({target:{value:v}}) : handleInputChange(f, v)} 
          benefits={benefits} 
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, mt: 2, px: 1 }}>
          <Typography sx={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600 }}>
            Patients covered: {formData.patientsCovered || 1}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
            Editing this plan will result in changes to all patients covered under it
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InsuranceInformation;
