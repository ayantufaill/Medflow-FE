import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import FormInput from './FormInput';
import CarrierSearchDropdown from '../insurance-info/CarrierSearchDropdown';
import PlanBillingTable from '../insurance-info/PlanBillingTable';
import PhoneNumberInput from '../../shared/PhoneNumberInput';

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

  // Robust dummy data to ensure results show up as in the screenshot
  const DUMMY_INSURANCE = [
    { payerId: '00621', carrierName: 'Blue Cross Blue Shield of Illinois', groupName: 'VIVID SEATS, LLC', groupNumber: '300871', planName: 'BCBS IL', payerAddress: '123 Blue St, Chicago, IL', carrierPhone: '800-123-4567' },
    { payerId: '52133', carrierName: 'United Healthcare Dental', groupName: 'DOXIM', groupNumber: '1602187', planName: 'UHC ( DOXIM )', payerAddress: '456 Health Way, Minnetonka, MN', carrierPhone: '800-987-6543' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'Texas Health Resources', groupNumber: '087639801700001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TX Health Resources', groupNumber: '087639801300001', planName: 'TX HEALTH RESOURCES', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'Texas Health Resources', groupNumber: '876398-17-001', planName: '800-451-7715', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna(TEXAS HEALTH RESOURCES)', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  ];

  const handleSearch = (val, forceOpen = true, excludeOverride = undefined) => {
    handleInputChange('carrierSearch', val);

    const searchPool = companies.length > 0 ? companies : DUMMY_INSURANCE;
    let filtered = searchPool;
    
    if (val) {
      filtered = searchPool.filter(item => 
        (item.payerId || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.carrierName || item.name || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupName || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupNumber || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.planName || item.name || '').toLowerCase().includes(val.toLowerCase())
      );
    }

    // Always filter out inactive companies regardless of the checkbox
    filtered = filtered.filter(item => item.isActive !== false);

    const exclude = excludeOverride !== undefined ? excludeOverride : formData.excludeSystemCarriers;
    if (exclude) {
      filtered = filtered.filter(item => !item.isSystemCarrier && !item.isSystem);
    }

    setSearchResults(filtered);
    if (forceOpen) {
      setShowDropdown(true);
    }
  };

  const handleSelectResult = (item) => {
    handleInputChange('insuranceCompanyId', item._id || item.id || 1);
    handleInputChange('carrierName', item.carrierName || item.name || '');
    handleInputChange('payerId', item.payerId || '');
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

  return (
    <Box sx={{ border: '1px solid #DFE5EC', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
             <BusinessIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Insurance Information
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Carrier, payer and plan billing details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
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
                renderInput={() => (
                  <PhoneNumberInput
                    value={formData.carrierPhone}
                    onChange={(e) => handleInputChange('carrierPhone', e.target.value)}
                    sx={{
                      '& .react-tel-input .form-control': {
                        bgcolor: '#f8f9fc',
                        fontSize: '14px',
                        borderColor: '#DFE5EC',
                        height: '30px',
                        borderRadius: '4px',
                        '&:hover': { borderColor: '#2563eb' },
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          <FormInput
            label="Payer Address"
            value={formData.payerAddress || ''}
            onChange={(e) => handleInputChange('payerAddress', e.target.value)}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, mt: 1, pt: 1.5, px: 0.5, borderTop: '1px solid #DFE5EC' }}>
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
          formData={formData}
          handleInputChange={handleInputChange}
          benefits={benefits}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, mt: 2, px: 1 }}>
          <Typography sx={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: 600 }}>
            Patients covered: {formData.patientsCovered || 1}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem' }}>
            Editing this plan will result in changes to all patients covered under it
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InsuranceInformation;
