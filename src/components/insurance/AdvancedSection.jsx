import React from 'react';
import { Box, Typography, TextField, Grid } from "@mui/material";
import { InfoOutlined as InfoIcon, Tune as TuneIcon } from "@mui/icons-material";

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
             <TuneIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Advanced
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Identifiers and overrides
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #DFE5EC', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.8px', textTransform: 'uppercase' }}>OPTIONAL</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>Member Identifier</Typography>
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
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
                fontSize: '0.75rem', 
                height: '36px' 
              },
              '& fieldset': { borderColor: '#DFE5EC' }
            }} 
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>Card Sequence</Typography>
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
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
                fontSize: '0.75rem', 
                height: '36px' 
              },
              '& fieldset': { borderColor: '#DFE5EC' },
              '& .MuiFormHelperText-root': { fontSize: '0.7rem', color: '#6b7280', mx: 0, mt: 0.5 }
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedSection;
