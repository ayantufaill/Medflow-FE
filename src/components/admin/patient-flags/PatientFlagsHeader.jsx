import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { radius, fontSize, fontWeight } from '../../../constants/styles';
import { COLORS } from '../../../constants/colors';

const PatientFlagsHeader = ({ onAddCategory, onSave, onSync }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
      Patient Flags
    </Typography>

    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
      <Button
        startIcon={<SyncIcon sx={{ fontSize: '16px' }} />}
        onClick={onSync}
        sx={{ 
          textTransform: 'none', 
          color: COLORS.TEXT_MUTED,
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
        }}
      >
        Sync
      </Button>
      <Button
        variant="outlined"
        disableElevation
        startIcon={<AddIcon sx={{ fontSize: '16px' }} />}
        onClick={onAddCategory}
        sx={{
          textTransform: 'none',
          borderRadius: radius.md,
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: COLORS.ACCENT,
          borderColor: COLORS.ACCENT,
          '&:hover': {
            borderColor: COLORS.ACCENT_HOVER,
            backgroundColor: COLORS.ACCENT_BG,
          },
        }}
      >
        Add new category
      </Button>
      <Button
        variant="contained"
        disableElevation
        startIcon={<SaveIcon sx={{ fontSize: '16px' }} />}
        onClick={onSave}
        sx={{
          textTransform: 'none',
          borderRadius: radius.md,
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          px: 3,
          backgroundColor: COLORS.ACCENT,
          color: COLORS.WHITE,
          '&:hover': {
            backgroundColor: COLORS.ACCENT_HOVER,
          },
        }}
      >
        Save Configuration
      </Button>
    </Stack>
  </Box>
);

export default PatientFlagsHeader;
