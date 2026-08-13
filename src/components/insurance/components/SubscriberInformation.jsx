import { useState } from 'react';
import {
  Box, Typography, TextField, Checkbox, FormControlLabel, IconButton, Stack, InputAdornment, MenuItem, Tooltip
} from "@mui/material";
import { 
  CheckCircle as CheckCircleIcon, 
  CalendarToday as CalendarIcon,
  PeopleOutline as PeopleIcon,
  Edit as EditIcon,
  InfoOutlined as InfoIcon
} from "@mui/icons-material";
import FormInput from './FormInput';

const ASSIGNMENT_TOOLTIP_TEXT = "Assignment of Benefits is an authorization of payment. It indicates that the benefits paid from the insurance company will go directly to the office if pay to dentist is selected. It will also populate the signature of subscriber field on the claim form. If this is marked as non assignment the signature field on the claim form will be blank and payment will go directly to the patient.";
const RELEASE_INFO_TOOLTIP_TEXT = "With this check box selected, the subscriber authorizes the release of information to the practice.“Signature on File” populates box 36 on insurance claims. With this check box blank, box 36 will be empty.";

const SubscriberInformation = ({ 
  formData, 
  handleSubscriberChange, 
  handleInputChange,
  relationshipOptions = ['Self', 'Spouse', 'Child', 'Parent', 'Other'],
  assignmentOptions = [],
  inputBg,
  errors = {},
  patient,
  handleSubscriberSelect
}) => {
  const [showSsn, setShowSsn] = useState(false);

  // Use API data or default arrays
  const relationships = relationshipOptions.length > 0 ? relationshipOptions : [
    'Self', 'Spouse', 'Child', 'Other Dependent', 'Employee', 
    'Organ Donor', 'Cadaver Donor', 'Life Partner', 'Unknown'
  ];
  const benefits = assignmentOptions.length > 0 ? assignmentOptions : [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' },
    { value: 3, label: 'Pay to both (Split)' }
  ];

  const householdMembers = Array.isArray(patient?.household) ? patient.household : [];
  const familyOptions = householdMembers.map(m => {
    const name = m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim();
    return {
      name,
      dateOfBirth: m.dateOfBirth || m.dob,
      ssn: m.ssn,
      relationship: m.relationship
    };
  });
  
  if (patient?.spouseInfo) {
    const spouse = patient.spouseInfo;
    const name = spouse.name || `${spouse.firstName || ''} ${spouse.lastName || ''}`.trim();
    if (name && !familyOptions.find(o => o.name === name)) {
      familyOptions.push({
        name,
        dateOfBirth: spouse.dateOfBirth || spouse.dob,
        ssn: spouse.ssn,
        relationship: 'Spouse'
      });
    }
  }

  return (
    <Box sx={{ 
      border: '1px solid #DFE5EC', 
      borderRadius: '12px', 
      backgroundColor: '#FFFFFF', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
             <PeopleIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Subscriber Information
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Policy holder details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
      
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {/* Relationship Dropdown */}
        <FormInput
          select
          label="Patient Relationship to Subscriber"
          required
          value={formData.subscriber?.relationship || ''}
          onChange={(e) => handleSubscriberChange('relationship', e.target.value)}
        >
          {relationships.map(rel => (
            <MenuItem key={rel} value={rel} sx={{ fontSize: '14px' }}>{rel}</MenuItem>
          ))}
        </FormInput>

        {/* Name and ID */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            {formData.subscriber?.relationship !== 'Self' && familyOptions.length > 0 ? (
              <FormInput
                select
                label="Subscriber Name"
                required
                value={formData.subscriber?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const member = familyOptions.find(o => o.name === val);
                  if (member && handleSubscriberSelect) {
                    handleSubscriberSelect(member);
                  } else {
                    handleSubscriberChange('name', val);
                  }
                }}
                error={!!errors.subscriberName}
                helperText={errors.subscriberName}
              >
                {familyOptions.map((opt) => (
                  <MenuItem key={opt.name} value={opt.name} sx={{ fontSize: '14px' }}>
                    {opt.name}
                  </MenuItem>
                ))}
              </FormInput>
            ) : (
              <FormInput
                label="Subscriber Name"
                required
                value={formData.subscriber?.name || ''}
                onChange={(e) => handleSubscriberChange('name', e.target.value)}
                disabled={formData.subscriber?.relationship === 'Self'}
                error={!!errors.subscriberName}
                helperText={errors.subscriberName}
              />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormInput
              label="Subscriber ID"
              required
              value={formData.subscriber?.subscriberId || ''}
              onChange={(e) => {
                const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '');
                handleSubscriberChange('subscriberId', alphanumericValue);
              }}
              error={!!errors.subscriberId}
              helperText={errors.subscriberId}
            />
          </Box>
        </Box>

        {/* SSN */}
        <FormInput
          label="Subscriber Social Security Number"
          type="password"
          placeholder="•••-••-••••"
          value={formData.subscriber?.ssn || ''}
          onChange={(e) => handleSubscriberChange('ssn', e.target.value)}
          sx={{ '& .MuiInputBase-root': { letterSpacing: '2px' } }}
        />

        {/* Date of Birth */}
        <FormInput
          label="Date of Birth"
          required
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.subscriber?.dateOfBirth || ''}
          onChange={(e) => handleSubscriberChange('dateOfBirth', e.target.value)}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth}
        />
      </Stack>

      {/* Assignment and Release Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1, mt: 3, alignItems: 'flex-end' }}>
        <Box sx={{ flex: 1 }}>
          <FormInput
            select
            label="Assignment of Benefit to"
            labelEndAdornment={
              <Tooltip
                PopperProps={{ sx: { zIndex: 999999 } }}
                title={
                  <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                    {ASSIGNMENT_TOOLTIP_TEXT}
                  </Typography>
                }
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#ffffff',
                      color: '#1e3a8a',
                      border: '1px solid #1e3a8a',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                      borderRadius: '6px',
                      maxWidth: 290,
                      p: 1,
                      '& .MuiTooltip-arrow': {
                        color: '#ffffff',
                        '&::before': {
                          border: '1px solid #1e3a8a',
                          backgroundColor: '#ffffff',
                        },
                      },
                    },
                  },
                }}
              >
                <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', cursor: 'pointer', '&:hover': { color: '#2563eb' } }} />
              </Tooltip>
            }
            value={formData.assignmentOfBenefits || 1}
            onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
          >
            {benefits.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>{option.label}</MenuItem>
            ))}
          </FormInput>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, height: '36px' }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.releaseInfo} 
                onChange={(e) => handleInputChange('releaseInfo', e.target.checked)}
                size="small" 
                sx={{ py: 0 }}
              />
            }
            label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Release info</Typography>}
            sx={{ m: 0 }}
          />
          <Tooltip
            PopperProps={{ sx: { zIndex: 999999 } }}
            title={
              <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                {RELEASE_INFO_TOOLTIP_TEXT}
              </Typography>
            }
            placement="top"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: '#ffffff',
                  color: '#1e3a8a',
                  border: '1px solid #1e3a8a',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  maxWidth: 270,
                  p: 1,
                  '& .MuiTooltip-arrow': {
                    color: '#ffffff',
                    '&::before': {
                      border: '1px solid #1e3a8a',
                      backgroundColor: '#ffffff',
                    },
                  },
                },
              },
            }}
          >
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', cursor: 'pointer', '&:hover': { color: '#2563eb' } }} />
          </Tooltip>
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default SubscriberInformation;
