import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PatientFlagRow = ({ flag, onEdit, onDelete }) => (
  <Box
    sx={{
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '72px minmax(0, 1fr) 92px',
      alignItems: 'center',
      gap: 1,
      p: 1.25,
      borderRadius: 2,
      bgcolor: '#ffffff',
      border: '1px solid #e5e7eb',
      '&:hover': { bgcolor: '#f8fafc' },
    }}
  >
    <Box
      sx={{
        width: 18,
        height: 18,
        bgcolor: flag.color,
        borderRadius: '4px',
        justifySelf: 'center',
      }}
    />
    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 500 }}>
      {flag.name}
    </Typography>
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <IconButton
        size="small"
        onClick={() => onEdit(flag)}
        sx={{ color: '#2563eb' }}
        aria-label={`Edit ${flag.name}`}  // <-- FIXED
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onDelete(flag.id)}
        sx={{ color: '#ef4444' }}
        aria-label={`Delete ${flag.name}`}  // <-- FIXED
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  </Box>
);

export default PatientFlagRow;