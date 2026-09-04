import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, IconButton, Button, Tooltip } from "@mui/material";
import { InfoOutlined as InfoIcon, DeleteOutlined as DeleteIcon, RequestQuote as RequestQuoteIcon } from "@mui/icons-material";
import FormInput from './FormInput';
import { providerService } from '../../../services/provider.service';

const COVERAGE_TYPE_TOOLTIP_TEXT = "Choosing the option “copay/fixed benefits plan” for any plan will remove the coverage table. This will also add a 'patient co-pay' column in the coverage book";

const CoverageTypeInfoIcon = () => (
  <Tooltip
    title={
      <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
        {COVERAGE_TYPE_TOOLTIP_TEXT}
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
    <InfoIcon sx={{ fontSize: 14, color: '#9ca3af', cursor: 'pointer', '&:hover': { color: '#2563eb' }, ml: 0.5 }} />
  </Tooltip>
);

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
  const [providersList, setProvidersList] = useState([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await providerService.getAllProviders(1, 100);
        const list = data?.providers || data?.items || (Array.isArray(data) ? data : []);
        setProvidersList(list);
      } catch (err) {
        console.error('Failed to fetch providers:', err);
      }
    };
    loadProviders();
  }, []);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
            <RequestQuoteIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Plan Fee Guide & Coverage Type
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Choose fee schedule and coverage model
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>

      {/* Single row: PLAN FEE GUIDE + View Fee Guide + COVERAGE TYPE */}
      <Box sx={{ p: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Plan Fee Guide */}
        <Box sx={{ flex: '0 0 auto' }}>
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
                minWidth: '240px',
                '& .MuiOutlinedInput-root': { 
                  bgcolor: '#f3f4f6', 
                  borderRadius: '8px',
                  height: '36px' 
                },
                '& fieldset': { borderColor: '#DFE5EC' },
                '& .MuiSelect-select': {
                  fontSize: '14px !important',
                  color: '#111827 !important',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingTop: '0 !important',
                  paddingBottom: '0 !important',
                  height: '100% !important',
                  minHeight: 'unset !important'
                }
              }}
            >
              {planFeeGuideOptions.map(option => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>{option.label}</MenuItem>
              ))}
            </TextField>
            <Button 
              variant="outlined" 
              size="small" 
              className="view-btn"
              disabled={!formData.planFeeGuide || formData.planFeeGuide === 'None'}
              onClick={() => setIsFeeGuideModalOpen(true)}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '0.7rem', 
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
        <Box sx={{ flex: '0 0 auto', minWidth: '260px' }}>
          <FormInput
            select
            label="COVERAGE TYPE"
            labelEndAdornment={<CoverageTypeInfoIcon />}
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
      <Typography sx={{ color: '#000', fontSize: '0.75rem', mt: 2.5, fontWeight: 600 }}>
        Providers Plan Fee Guides
      </Typography>
      {formData.providersPlanFeeGuides?.map((guide, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
          <TextField
            select
            size="small"
            value={guide.providerId || ''}
            onChange={(e) => handleProviderFeeGuideChange(index, 'providerId', e.target.value)}
            sx={{ minWidth: '240px', bgcolor: '#fff', '& .MuiInputBase-root': { height: '36px' }, '& fieldset': { borderColor: '#DFE5EC' }, '& .MuiSelect-select': { fontSize: '14px !important', color: '#111827 !important', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: '0 !important', paddingBottom: '0 !important', height: '100% !important', minHeight: 'unset !important' } }}
          >
            <MenuItem value="" disabled sx={{ fontSize: '14px', color: '#aaa' }}>
              <em>Select Provider</em>
            </MenuItem>
            {providersList.map((p) => {
              const pId = String(p._id || p.id || p.ProvNum || p.providerId || '');
              const firstName = p.userId?.firstName || p.firstName || '';
              const lastName = p.userId?.lastName || p.lastName || '';
              const fullName = `${firstName} ${lastName}`.trim();
              const code = p.providerCode || p.Abbr || p.abbreviation || '';

              let displayName = fullName;
              if (!displayName && code) displayName = code;
              if (!displayName) displayName = p.name || `Provider #${pId}`;

              return (
                <MenuItem key={pId} value={pId} sx={{ fontSize: '14px' }}>
                  {displayName}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            select
            size="small"
            value={guide.feeGuide || ''}
            onChange={(e) => handleProviderFeeGuideChange(index, 'feeGuide', e.target.value)}
            sx={{ minWidth: '240px', bgcolor: '#fff', '& .MuiInputBase-root': { height: '36px' }, '& fieldset': { borderColor: '#DFE5EC' }, '& .MuiSelect-select': { fontSize: '14px !important', color: '#111827 !important', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: '0 !important', paddingBottom: '0 !important', height: '100% !important', minHeight: 'unset !important' } }}
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
        sx={{ color: '#2563eb', fontSize: '0.7rem', mt: 1, cursor: 'pointer', display: 'inline-block', fontWeight: 600 }}
      >
        + Add
      </Typography>
      </Box>
    </Box>
  );
};

export default PlanFeeGuideSection;
