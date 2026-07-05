import React from 'react';
import { Box, Typography, TextField, MenuItem, IconButton, Button } from "@mui/material";
import { InfoOutlined as InfoIcon, DeleteOutlined as DeleteIcon, RequestQuote as RequestQuoteIcon } from "@mui/icons-material";
import FormInput from './FormInput';

const PlanFeeGuideSection = ({ 
  formData, 
  handleInputChange, 
  planFeeGuideOptions, 
  COVERAGE_TYPES, 
  setIsFeeGuideModalOpen, 
  handleProviderFeeGuideChange, 
  handleRemoveProviderFeeGuide, 
  handleAddProviderFeeGuide 
}) => {
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
            <RequestQuoteIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Plan Fee Guide & Coverage Type
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Choose fee schedule and coverage model
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#eef2ff', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>

      {/* Single row: PLAN FEE GUIDE + View Fee Guide + COVERAGE TYPE */}
      <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Plan Fee Guide */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', mb: 0.5, textTransform: 'uppercase' }}>
            PLAN FEE GUIDE
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              select
              size="small"
              value={formData.planFeeGuide || ''}
              onChange={(e) => handleInputChange('planFeeGuide', e.target.value)}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': { 
                  bgcolor: '#f3f4f6', 
                  borderRadius: '8px',
                  fontSize: '14px', 
                  height: '36px' 
                },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            >
              {planFeeGuideOptions.map(option => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>{option.label}</MenuItem>
              ))}
            </TextField>
            <Button 
              variant="outlined" 
              size="small" 
              disabled={!formData.planFeeGuide || formData.planFeeGuide === 'None'}
              onClick={() => setIsFeeGuideModalOpen(true)}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '0.75rem', 
                height: '36px', 
                borderRadius: '8px',
                borderColor: '#DFE5EC', 
                color: '#4b5563', 
                px: 2, 
                minWidth: 'auto', 
                whiteSpace: 'nowrap', 
                bgcolor: '#fff',
                '&:hover': { borderColor: '#bbb' }
              }}
            >
              View Fee Guide
            </Button>
          </Box>
        </Box>

        {/* Coverage Type */}
        <Box sx={{ flex: 1 }}>
          <FormInput
            select
            label="COVERAGE TYPE"
            labelEndAdornment={<InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />}
            value={formData.coverageType || ''}
            onChange={(e) => handleInputChange('coverageType', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                bgcolor: '#f3f4f6', 
                borderRadius: '8px',
              }
            }}
          >
            {COVERAGE_TYPES.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>{option.label}</MenuItem>
            ))}
          </FormInput>
        </Box>
      </Box>

      {/* Providers Plan Fee Guides */}
      <Typography sx={{ color: '#000', fontSize: '0.8rem', mt: 2.5, fontWeight: 600 }}>
        Providers Plan Fee Guides
      </Typography>
      {formData.providersPlanFeeGuides?.map((guide, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
          <TextField
            placeholder="Provider Name/ID"
            size="small"
            value={guide.providerId}
            onChange={(e) => handleProviderFeeGuideChange(index, 'providerId', e.target.value)}
            sx={{ flex: 1, bgcolor: '#fff', '& .MuiInputBase-root': { fontSize: '14px', height: '36px' }, '& fieldset': { borderColor: '#DFE5EC' } }}
          />
          <TextField
            select
            size="small"
            value={guide.feeGuide}
            onChange={(e) => handleProviderFeeGuideChange(index, 'feeGuide', e.target.value)}
            sx={{ flex: 1, bgcolor: '#fff', '& .MuiInputBase-root': { fontSize: '14px', height: '36px' }, '& fieldset': { borderColor: '#DFE5EC' } }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '14px', color: '#aaa' }}>
              <em>Select Fee Guide</em>
            </MenuItem>
            {planFeeGuideOptions.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>{option.label}</MenuItem>
            ))}
          </TextField>
          <IconButton size="small" onClick={() => handleRemoveProviderFeeGuide(index)} sx={{ color: '#d32f2f', p: 0.5 }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ))}
      <Typography 
        onClick={handleAddProviderFeeGuide}
        sx={{ color: '#2563eb', fontSize: '0.75rem', mt: 1, cursor: 'pointer', display: 'inline-block', fontWeight: 600 }}
      >
        + Add
      </Typography>
      </Box>
    </Box>
  );
};

export default PlanFeeGuideSection;
