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
        width: '100%',
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Blue Header with Icon */}
      <Box sx={{ px: 3, py: 2, bgcolor: '#eef4ff', borderBottom: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 28, height: 28, display: 'grid', placeItems: 'center', bgcolor: '#dbeafe', borderRadius: 1.5 }}>
          {getCategoryIcon(category)}
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {category}
        </Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>
        {/* 3-Column Header: COLOR | NAME | ACTIONS */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '72px 1fr 92px', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', mb: 1, flexShrink: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Color</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Name</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</Typography>
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
          startIcon={<AddIcon />}
          onClick={() => onAddFlag(category)}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: '#2563eb',
            fontWeight: 600,
            px: 0,
            flexShrink: 0,
            '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.06)' },
          }}
        >
          Add new flag
        </Button>
      </Box>
    </Paper>
  );
};

export default PatientFlagCategorySection;