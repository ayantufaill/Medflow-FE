import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import {
  GppGood as GppGoodIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const AddCoverageHeader = ({
  isEditing,
  onEditToggle,
  showEditButton,
  onSave,
  onCancel,
  loading,
  title
}) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: '12px',
      py: '6px',
      borderRadius: '12px',
      border: '1px solid #DFE5EC',
      bgcolor: '#FFFFFF'
    }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 2, bgcolor: '#eef2ff' }}>
          <GppGoodIcon sx={{ fontSize: 22, color: '#3f51b5' }} />
        </Box>
        <Box>
          <Typography fontWeight={700} sx={{ fontSize: '0.9rem', color: '#1a1a1a', pt: 0.5, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem', lineHeight: 1.1, mt: -0.2 }}>
            Configure carrier, subscriber, plan benefits and coverage book
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <IconButton size="small" sx={{ border: '1px solid #DFE5EC', borderRadius: 1.5, width: 32, height: 32 }}>
          <BookmarkBorderIcon sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
        {showEditButton && !isEditing && (
          <IconButton
            size="small"
            onClick={onEditToggle}
            sx={{
              border: '1px solid #DFE5EC',
              borderRadius: 1.5,
              width: 32,
              height: 32,
              '&:hover': { backgroundColor: '#f0f4f8' }
            }}
          >
            <EditIcon sx={{ fontSize: 18, color: '#2362EF' }} />
          </IconButton>
        )}
        <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none', color: '#333', borderColor: '#DFE5EC', fontWeight: 600, height: 32, px: 2, borderRadius: 1.5 }}>
          {isEditing ? 'Cancel' : 'Back'}
        </Button>
        {isEditing && (
          <Button variant="contained" onClick={onSave} disabled={loading} sx={{ bgcolor: '#2362EF', textTransform: 'none', fontWeight: 600, height: 32, px: 3, boxShadow: 'none', borderRadius: 1.5 }}>
            Save
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AddCoverageHeader;
