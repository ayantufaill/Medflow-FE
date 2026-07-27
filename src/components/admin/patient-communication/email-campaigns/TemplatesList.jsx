import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Paper, Button } from '@mui/material';
import { Search as SearchIcon, ContentCopy as CopyIcon, Add as AddIcon } from '@mui/icons-material';

const templatesData = [
  'Membership Plan-941944290',
  'Membership Plan',
  'Use it or Lose it',
  'Leave Us a Review',
  '4 Year Birthday',
  'BOTOX',
  'BOOST 2025-492156060',
  'TOP 3 BOTOX-363682503',
  'TOP 3 BOTOX',
  'BOOST 2025',
  'BOTOX',
  'Spring Break Is Around the Corner',
  'Heart Health Month',
  'Deactivation letter',
  'Use it or Lose it!',
];

const TemplatesList = ({ onEditTemplate }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B' }}>Email Templates</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 4 }}>Manage and create reusable templates for your campaigns to ensure consistent communication.</Typography>
      
      <TextField
        size="small"
        placeholder="Search templates..."
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1.2rem', color: '#94a3b8' }} /></InputAdornment> }}
        sx={{ width: '100%', maxWidth: 400, mb: 3, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem', borderRadius: 1, bgcolor: '#fff', '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }}
      />
      
      <Paper elevation={0} sx={{ border: '1px solid #E5E9F2', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 1.5, backgroundColor: '#FBFCFE', borderBottom: '1px solid #E5E9F2', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>
            Template Name
          </Typography>
        </Box>
        {templatesData.map((template, i) => (
          <Box 
            key={i} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              px: 3,
              py: 2, 
              borderBottom: i < templatesData.length - 1 ? '1px solid #F1F5F9' : 'none', 
              transition: 'background-color 0.15s',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#F8FAFC' }
            }}
            onClick={() => onEditTemplate(template)}
          >
            <Typography 
              sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1E293B', flex: 1 }}
            >
              {template}
            </Typography>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); }} sx={{ color: '#94a3b8', '&:hover': { color: '#3B82F6', bgcolor: '#F0F5FF' } }}>
              <CopyIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default TemplatesList;
