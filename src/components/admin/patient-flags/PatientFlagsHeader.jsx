import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

const PatientFlagsHeader = ({ onAddCategory, onSave, onSync }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
      Patient Flags
    </Typography>

    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
      <Button
        startIcon={<SyncIcon />}
        onClick={onSync}
        sx={{ textTransform: 'none', color: '#666', fontWeight: 600, fontSize: '0.8rem' }}
      >
        Sync
      </Button>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={onAddCategory}
        sx={{
          textTransform: 'none',
          color: '#2563eb',
          borderColor: '#2563eb',
          borderRadius: '20px',
          fontWeight: 600,
          fontSize: '0.8rem',
          '&:hover': {
            borderColor: '#1d4ed8',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
          },
        }}
      >
        Add new category
      </Button>
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={onSave}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          px: 3,
          backgroundColor: '#2563eb',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        }}
      >
        Save Configuration
      </Button>
    </Stack>
  </Box>
);

export default PatientFlagsHeader;
