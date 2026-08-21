import React from 'react';
import { Box, Typography, TextField, Grid, Tooltip } from "@mui/material";
import { InfoOutlined as InfoIcon, Tune as TuneIcon } from "@mui/icons-material";

const MEMBER_IDENTIFIER_TOOLTIP_TEXT = "Some insurance companies have specific identifiers for their members, or members’ dependents. They are unique IDs different from the normal subscriber IDs and can located on the insurance card. This space can be left blank if the insurance company does not have a Member Identifier. You can add the SSN if the insurance requires it.";
const CARD_SEQUENCE_TOOLTIP_TEXT = "The Insurance Card Sequence is typically a dependent specific identifier. You can find this number on the insurance card if it exists.";

const AdvancedSection = ({ formData, handleInputChange, inputBg }) => {
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
             <TuneIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Advanced
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Identifiers and overrides
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', border: '1px solid #DFE5EC', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.8px', textTransform: 'uppercase' }}>OPTIONAL</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>Member Identifier</Typography>
            <Tooltip
              PopperProps={{ sx: { zIndex: 999999 } }}
              title={
                <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                  {MEMBER_IDENTIFIER_TOOLTIP_TEXT}
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
                    maxWidth: 280,
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
          <TextField 
            fullWidth 
            size="small" 
            value={formData.memberIdentifier || ''}
            onChange={(e) => handleInputChange('memberIdentifier', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                bgcolor: '#f3f4f6', 
                borderRadius: '8px',
                fontSize: '0.7rem', 
                height: '36px' 
              },
              '& fieldset': { borderColor: '#DFE5EC' }
            }} 
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>Card Sequence</Typography>
            <Tooltip
              PopperProps={{ sx: { zIndex: 999999 } }}
              title={
                <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                  {CARD_SEQUENCE_TOOLTIP_TEXT}
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
                    maxWidth: 260,
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
          <TextField 
            fullWidth 
            size="small" 
            helperText="Required for Dentaide carc"
            value={formData.cardSequence || ''}
            onChange={(e) => handleInputChange('cardSequence', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                bgcolor: '#f3f4f6', 
                borderRadius: '8px',
                fontSize: '0.7rem', 
                height: '36px' 
              },
              '& fieldset': { borderColor: '#DFE5EC' },
              '& .MuiFormHelperText-root': { fontSize: '0.65rem', color: '#6b7280', mx: 0, mt: 0.5 }
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedSection;
