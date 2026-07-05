import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { GppGood as GppGoodIcon, BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material';

const AddCoverageHeader = ({ onSave, onCancel, loading }) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: '24px',
      py: '16px',
      borderRadius: '12px',
      border: '1px solid #DFE5EC',
      bgcolor: '#FFFFFF'
    }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 2, bgcolor: '#eef2ff' }}>
          <GppGoodIcon sx={{ fontSize: 22, color: '#3f51b5' }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9rem', color: '#1a1a1a' }}>
            Add a Coverage for Insurance
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
            Configure carrier, subscriber, plan benefits and coverage book
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <IconButton size="small" sx={{ border: '1px solid #DFE5EC', borderRadius: 1.5, width: 36, height: 36 }}>
          <BookmarkBorderIcon sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
        <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none', color: '#333', borderColor: '#DFE5EC', fontWeight: 600, height: 36, px: 2, borderRadius: 1.5 }}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={loading} sx={{ bgcolor: '#1976d2', textTransform: 'none', fontWeight: 600, height: 36, px: 3, boxShadow: 'none', borderRadius: 1.5 }}>Save</Button>
      </Box>
    </Box>
  );
};

export default AddCoverageHeader;
