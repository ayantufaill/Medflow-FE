import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Select, MenuItem, TextField } from '@mui/material';

const BillingConfigAddress = ({ formData, handleChange, setFormData }) => {
  const addressFields = [
    { key: 'country', label: 'Country', placeholder: 'Country', type: 'select' },
    { key: 'address1', label: 'Address Line 1', placeholder: 'Address line 1' },
    { key: 'address2', label: 'Address Line 2', placeholder: 'Address line 2' },
    { key: 'city', label: 'City', placeholder: 'City' },
    { key: 'state', label: 'State/Province', placeholder: 'State/Province' },
    { key: 'zip', label: 'Zip/Postal Code', placeholder: 'Zip/Postal Code' },
  ];

  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
          Billing Address
        </Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={formData.useOfficeAddress || false}
                onChange={handleChange('useOfficeAddress')}
                sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
              />
            }
            label={<Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Use office address</Typography>}
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={formData.useForClaims || false}
                onChange={handleChange('useForClaims')}
                sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
              />
            }
            label={<Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Use for claims</Typography>}
            sx={{ m: 0 }}
          />
        </Box>
        {addressFields.map((field) => (
          <Box key={field.key} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '140px', fontWeight: 600 }}>
              {field.label}:
            </Typography>
            {field.type === 'select' ? (
              <Select
                size="small"
                value={formData[field.key] || ''}
                onChange={handleChange(field.key)}
                displayEmpty
                sx={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 2,
                  fontSize: '0.85rem',
                  width: '250px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
                }}
              >
                <MenuItem value="" disabled>{field.placeholder}</MenuItem>
                <MenuItem value="Country">Country</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
              </Select>
            ) : (
              <TextField
                size="small"
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={handleChange(field.key)}
                sx={{
                  width: '250px',
                  '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2 },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
                  '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 },
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BillingConfigAddress;
