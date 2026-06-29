import { useState } from 'react';
import {
  Box, Typography, TextField, Checkbox, FormControlLabel, IconButton, Stack, InputAdornment, MenuItem
} from "@mui/material";
import { 
  CheckCircle as CheckCircleIcon, 
  CalendarToday as CalendarIcon,
  PeopleOutline as PeopleIcon,
  Edit as EditIcon,
  InfoOutlined as InfoIcon
} from "@mui/icons-material";
import FormInput from './FormInput';

const SubscriberInformation = ({ 
  formData, 
  handleSubscriberChange, 
  handleInputChange,
  relationshipOptions = ['Self', 'Spouse', 'Child', 'Parent', 'Other'],
  assignmentOptions = [],
  inputBg
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
             <PeopleIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Subscriber Information
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Policy holder details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
      
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
            <FormInput
              label="Subscriber Name"
              required
              value={formData.subscriber?.name || ''}
              onChange={(e) => handleSubscriberChange('name', e.target.value)}
              disabled={formData.subscriber?.relationship === 'Self'}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormInput
              label="Subscriber ID"
              required
              value={formData.subscriber?.subscriberId || ''}
              onChange={(e) => {
                const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                handleSubscriberChange('subscriberId', alphanumericValue);
              }}
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
        />
      </Stack>

      {/* Assignment and Release Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1, mt: 3, alignItems: 'flex-end' }}>
        <Box sx={{ flex: 1 }}>
          <FormInput
            select
            label="Assignment of Benefit to"
            labelEndAdornment={<InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />}
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
            label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Release info</Typography>}
            sx={{ m: 0 }}
          />
          <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
      </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default SubscriberInformation;
