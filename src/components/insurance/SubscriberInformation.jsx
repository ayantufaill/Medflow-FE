import React from "react";
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
  ASSIGNMENT_OF_BENEFITS_OPTIONS,
  inputBg
}) => {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1, color: "#333", fontSize: "0.85rem" }}>Subscriber Information</Typography>
      
      <Stack spacing={1.5}>
        {/* Relationship Dropdown */}
        <TextField
          select
          fullWidth
          label="Patient Relationship to Subscriber *"
          value={formData.subscriber.relationship}
          onChange={(e) => handleSubscriberChange('relationship', e.target.value)}
          size="small"
          sx={{ 
            bgcolor: inputBg,
            '& .MuiInputBase-root': { fontSize: '0.7rem' },
            '& .MuiInputLabel-root': { fontSize: '0.7rem' }
          }}
        >
          <MenuItem value="Self" sx={{ fontSize: '0.7rem' }}>Self</MenuItem>
          <MenuItem value="Spouse" sx={{ fontSize: '0.7rem' }}>Spouse</MenuItem>
          <MenuItem value="Child" sx={{ fontSize: '0.7rem' }}>Child</MenuItem>
          <MenuItem value="Parent" sx={{ fontSize: '0.7rem' }}>Parent</MenuItem>
          <MenuItem value="Other" sx={{ fontSize: '0.7rem' }}>Other</MenuItem>
        </TextField>

        {/* Name and ID with Validation Icons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Subscriber Name *"
            value={formData.subscriber.name}
            onChange={(e) => handleSubscriberChange('name', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: inputBg,
              '& .MuiInputBase-root': { fontSize: '0.7rem' },
              '& .MuiInputLabel-root': { fontSize: '0.7rem' }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CheckCircleIcon sx={{ color: formData.subscriber.name ? '#81c784' : '#bdbdbd', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Subscriber ID *"
            value={formData.subscriber.subscriberId}
            onChange={(e) => handleSubscriberChange('subscriberId', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: inputBg,
              '& .MuiInputBase-root': { fontSize: '0.7rem' },
              '& .MuiInputLabel-root': { fontSize: '0.7rem' }
            }}
          />
        </Box>

        {/* SSN with Edit Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.65rem' }}>Subscriber Social Security Number:</Typography>
          <IconButton size="small"><EditIcon sx={{ fontSize: 12 }} /></IconButton>
        </Box>

        {/* Date of Birth with Calendar Icon */}
        <input
          type="date"
          value={formData.subscriber.dateOfBirth}
          onChange={(e) => handleSubscriberChange('dateOfBirth', e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '0.7rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: inputBg,
            width: '160px',
            fontFamily: 'inherit',
            color: '#333'
          }}
        />
      </Stack>

      {/* Assignment and Release Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 3 }}>
        <TextField
          select
          label="Assignment of Benefits *"
          value={formData.assignmentOfBenefits}
          onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
          size="small"
          sx={{ 
            flex: 1, 
            bgcolor: inputBg,
            '& .MuiInputBase-root': { fontSize: '0.7rem' },
            '& .MuiInputLabel-root': { fontSize: '0.65rem' }
          }}
        >
          {ASSIGNMENT_OF_BENEFITS_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.7rem' }}>{option.label}</MenuItem>
          ))}
        </TextField>
        <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={formData.saveAsTemplate} 
              onChange={(e) => handleInputChange('saveAsTemplate', e.target.checked)}
              size="small" 
            />
          }
          label={<Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>Release info</Typography>}
        />
        <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
      </Box>
    </Box>
  );
};

export default SubscriberInformation;
