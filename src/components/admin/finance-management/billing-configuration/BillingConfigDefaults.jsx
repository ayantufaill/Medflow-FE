import React from 'react';
import { Box, Typography, Select, MenuItem, TextField } from '@mui/material';

const BillingConfigDefaults = ({ formData, handleChange, setFormData }) => {
  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
          System Defaults & Bank Info
        </Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Default Billing Type */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '200px', fontWeight: 600 }}>
            Default Billing Type:
          </Typography>
          <Select
            size="small"
            value={formData.defaultBillingType || 'Standard'}
            onChange={handleChange('defaultBillingType')}
            sx={{
              backgroundColor: '#f8fafc', borderRadius: 2, fontSize: '0.85rem', width: '250px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
            }}
          >
            <MenuItem value="Standard">Standard</MenuItem>
          </Select>
        </Box>

        {/* Default Practice Service */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '200px', fontWeight: 600 }}>
            Default Practice Service:
          </Typography>
          <Select
            size="small"
            displayEmpty
            value={formData.defaultPracticeService || ''}
            onChange={handleChange('defaultPracticeService')}
            sx={{
              backgroundColor: '#f8fafc', borderRadius: 2, fontSize: '0.85rem', width: '250px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
            }}
          >
            <MenuItem value="" disabled>Select Service</MenuItem>
          </Select>
        </Box>

        {/* Default Billing Provider */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '200px', fontWeight: 600 }}>
            Default Billing Provider:
          </Typography>
          <Select
            size="small"
            value={formData.defaultBillingProvider || 'Treating Provider'}
            onChange={handleChange('defaultBillingProvider')}
            sx={{
              backgroundColor: '#f8fafc', borderRadius: 2, fontSize: '0.85rem', width: '250px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
            }}
          >
            <MenuItem value="Treating Provider">Treating Provider</MenuItem>
          </Select>
        </Box>

        {/* Statement Version */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '200px', fontWeight: 600 }}>
            Statement Version:
          </Typography>
          <Select
            size="small"
            value={formData.statementVersion || '2'}
            onChange={handleChange('statementVersion')}
            sx={{
              backgroundColor: '#f8fafc', borderRadius: 2, fontSize: '0.85rem', width: '100px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' }
            }}
          >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
          </Select>
        </Box>

        {/* Bank Account Number */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '200px', fontWeight: 600 }}>
            Bank Account Number:
          </Typography>
          <TextField
            size="small"
            placeholder="Account Number"
            value={formData.bankAccountNumber || ''}
            onChange={handleChange('bankAccountNumber')}
            sx={{
              width: '250px',
              '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
              '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 },
            }}
          />
        </Box>

        {/* Bank Account Info */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#475569', width: '200px', fontWeight: 600 }}>
            Bank Account Info:
          </Typography>
          <TextField
            size="small"
            placeholder="Account Info"
            value={formData.bankAccountInfo || ''}
            onChange={handleChange('bankAccountInfo')}
            sx={{
              width: '250px',
              '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
              '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 },
            }}
          />
        </Box>

      </Box>
    </Box>
  );
};

export default BillingConfigDefaults;
