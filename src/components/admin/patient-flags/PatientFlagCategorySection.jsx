import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import PatientFlagRow from './PatientFlagRow';

const getCategoryIcon = (category) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('communication')) return <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#2563eb' }} />;
  if (normalized.includes('billing')) return <ReceiptLongIcon sx={{ fontSize: 18, color: '#2563eb' }} />;
  return <LabelOutlinedIcon sx={{ fontSize: 18, color: '#2563eb' }} />;
};

const PatientFlagCategorySection = ({ category, flags, onAddFlag, onEditFlag, onDeleteFlag }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 527,
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Blue Header with Icon */}
      <Box sx={{ px: 3, py: 1.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {getCategoryIcon(category)}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          {category}
        </Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>
        {/* 2-Column Header: COLOR | NAME */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '56px 1fr 92px', alignItems: 'center', gap: 1, px: 1, pt: 1, mb: 0, flexShrink: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', textAlign: 'center' }}>Color</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Name</Typography>
          <Box /> {/* Empty cell for actions */}
        </Box>

        {/* List of Flags - scrollable */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, overflow: 'auto', minHeight: 0 }}>
          {flags.length > 0 ? (
            flags.map((flag) => (
              <PatientFlagRow key={flag.id} flag={flag} onEdit={onEditFlag} onDelete={onDeleteFlag} />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', p: 2, borderRadius: 2, border: '1px solid #e5e7eb', bgcolor: '#f8fafc' }}>
              No flags added for this category yet.
            </Typography>
          )}
        </Box>

        {/* Add new flag button - always visible at bottom */}
        <Button
          size="small"
          variant="text"
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => onAddFlag(category)}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: '#9ca3af',
            fontWeight: 500,
            fontSize: '0.85rem',
            px: 1,
            flexShrink: 0,
            '&:hover': { backgroundColor: 'transparent', color: '#6b7280' },
          }}
        >
          Add new flag
        </Button>
      </Box>
    </Paper>
  );
};

export default PatientFlagCategorySection;