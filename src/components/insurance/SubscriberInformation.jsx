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

const SubscriberInformation = ({ 
  formData, 
  handleSubscriberChange, 
  handleInputChange,
  relationshipOptions = ['Self', 'Spouse', 'Child', 'Parent', 'Other'],
  assignmentOptions = [],
  inputBg,
  errors = {}
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
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1, color: "#333", fontSize: "0.85rem" }}>Subscriber Information</Typography>
      
      <Stack spacing={1.5}>
        {/* Relationship Dropdown */}
        <TextField
          select
          fullWidth
          label="Patient Relationship to Subscriber *"
          value={formData.subscriber?.relationship || ''}
          onChange={(e) => handleSubscriberChange('relationship', e.target.value)}
          size="small"
          sx={{ 
            bgcolor: inputBg,
            '& .MuiInputBase-root': { fontSize: '0.7rem' },
            '& .MuiInputLabel-root': { fontSize: '0.7rem' }
          }}
        >
          {relationships.map(rel => (
            <MenuItem key={rel} value={rel} sx={{ fontSize: '0.7rem' }}>{rel}</MenuItem>
          ))}
        </TextField>

        {/* Name and ID with Validation Icons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Subscriber Name *"
            value={formData.subscriber?.name || ''}
            onChange={(e) => handleSubscriberChange('name', e.target.value)}
            size="small"
            disabled={formData.subscriber?.relationship === 'Self'}
            error={Boolean(errors?.subscriberName)}
            helperText={errors?.subscriberName}
            sx={{ 
              bgcolor: inputBg,
              '& .MuiInputBase-root': { fontSize: '0.7rem' },
              '& .MuiInputLabel-root': { fontSize: '0.7rem' }
            }}
            InputProps={{
              readOnly: formData.subscriber?.relationship === 'Self',
              endAdornment: (
                <InputAdornment position="end">
                  <CheckCircleIcon sx={{ color: formData.subscriber?.name ? '#81c784' : '#bdbdbd', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Subscriber ID *"
            value={formData.subscriber?.subscriberId || ''}
            onChange={(e) => {
              const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
              handleSubscriberChange('subscriberId', alphanumericValue);
            }}
            size="small"
            placeholder="e.g. SUB123456"
            error={Boolean(errors?.subscriberId)}
            helperText={errors?.subscriberId}
            sx={{ 
              bgcolor: inputBg,
              '& .MuiInputBase-root': { fontSize: '0.7rem' },
              '& .MuiInputLabel-root': { fontSize: '0.7rem' }
            }}
          />
        </Box>

        {/* SSN */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, minHeight: 40 }}>
            {!showSsn ? (
              <>
                <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Subscriber Social Security Number:</Typography>
                <IconButton size="small" onClick={() => setShowSsn(true)} sx={{ p: 0.5 }}>
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </>
            ) : (
              <TextField
                fullWidth
                autoFocus
                label="Subscriber Social Security Number"
                value={formData.subscriber?.ssn || ''}
                onChange={(e) => handleSubscriberChange('ssn', e.target.value)}
                size="small"
                onBlur={() => setShowSsn(false)}
                sx={{ 
                  bgcolor: inputBg,
                  '& .MuiInputBase-root': { fontSize: '0.7rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.7rem' }
                }}
              />
            )}
          </Box>
          <Box sx={{ flex: 1 }} />
        </Box>

        {/* Date of Birth */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Date of Birth *"
            InputLabelProps={{ shrink: true }}
            value={formData.subscriber?.dateOfBirth || ''}
            onChange={(e) => handleSubscriberChange('dateOfBirth', e.target.value)}
            size="small"
            error={Boolean(errors?.dateOfBirth)}
            helperText={errors?.dateOfBirth}
            sx={{ 
              flex: 1,
              bgcolor: inputBg,
              '& .MuiInputBase-root': { fontSize: '0.7rem' },
              '& .MuiInputLabel-root': { fontSize: '0.7rem' }
            }}
          />
          <Box sx={{ flex: 1 }} />
        </Box>
      </Stack>

      {/* Assignment and Release Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 3 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TextField
            select
            fullWidth
            label="Assignment of Benefits *"
            value={formData.assignmentOfBenefits}
            onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: inputBg,
              '& .MuiInputBase-root': { fontSize: '0.7rem' },
              '& .MuiInputLabel-root': { fontSize: '0.65rem' }
            }}
          >
            {benefits.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.7rem' }}>{option.label}</MenuItem>
            ))}
          </TextField>
          <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.releaseInfo} 
                onChange={(e) => handleInputChange('releaseInfo', e.target.checked)}
                size="small" 
              />
            }
            label={<Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>Release info</Typography>}
          />
          <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriberInformation;
