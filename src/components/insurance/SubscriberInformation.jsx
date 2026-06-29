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
        <Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
            Patient Relationship to Subscriber <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>
          <TextField
            select
            fullWidth
            value={formData.subscriber?.relationship || ''}
            onChange={(e) => handleSubscriberChange('relationship', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: '#f8f9fc',
              '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
              '& fieldset': { borderColor: '#DFE5EC' }
            }}
          >
            {relationships.map(rel => (
              <MenuItem key={rel} value={rel} sx={{ fontSize: '0.75rem' }}>{rel}</MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Name and ID */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
              Subscriber Name <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={formData.subscriber?.name || ''}
              onChange={(e) => handleSubscriberChange('name', e.target.value)}
              size="small"
              disabled={formData.subscriber?.relationship === 'Self'}
              sx={{ 
                bgcolor: '#f8f9fc',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
              Subscriber ID <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={formData.subscriber?.subscriberId || ''}
              onChange={(e) => {
                const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                handleSubscriberChange('subscriberId', alphanumericValue);
              }}
              size="small"
              sx={{ 
                bgcolor: '#f8f9fc',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            />
          </Box>
        </Box>

        {/* SSN */}
        <Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
            Subscriber Social Security Number
          </Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="•••-••-••••"
            value={formData.subscriber?.ssn || ''}
            onChange={(e) => handleSubscriberChange('ssn', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: '#f8f9fc',
              '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', letterSpacing: '2px' },
              '& fieldset': { borderColor: '#DFE5EC' }
            }}
          />
        </Box>

        {/* Date of Birth */}
        <Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
            Date of Birth <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.subscriber?.dateOfBirth || ''}
            onChange={(e) => handleSubscriberChange('dateOfBirth', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: '#f8f9fc',
              '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
              '& fieldset': { borderColor: '#DFE5EC' }
            }}
          />
        </Box>
      </Stack>

      {/* Assignment and Release Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1, mt: 3, alignItems: 'flex-end' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>
              Assignment of Benefit to
            </Typography>
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
          </Box>
          <TextField
            select
            fullWidth
            value={formData.assignmentOfBenefits || 1}
            onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: '#f8f9fc',
              '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
              '& fieldset': { borderColor: '#DFE5EC' }
            }}
          >
            {benefits.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>{option.label}</MenuItem>
            ))}
          </TextField>
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
