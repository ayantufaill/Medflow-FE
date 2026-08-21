import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import EditSvg from '../../../assets/practicesetupicon/editicon.svg';
import DeleteSvg from '../../../assets/practicesetupicon/deleteicon.svg';

const PatientFlagRow = ({ flag, onEdit, onDelete }) => (
  <Box
    sx={{
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '56px minmax(0, 1fr) 92px',
      alignItems: 'center',
      gap: 1,
      p: 1.25,
      borderRadius: 2,
      bgcolor: '#ffffff',
      border: '1px solid #e5e7eb',
    }}
  >
    <Box
      sx={{
        width: 20,
        height: 20,
        bgcolor: flag.color,
        borderRadius: '6px',
        justifySelf: 'center',
      }}
    />
    <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>
      {flag.name}
    </Typography>
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <IconButton
        size="small"
        onClick={() => onEdit(flag)}
        sx={{ p: 0.5 }}
        aria-label={`Edit ${flag.name}`}
      >
        <img src={EditSvg} alt="edit" width="16" height="16" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onDelete(flag.id)}
        sx={{ p: 0.5 }}
        aria-label={`Delete ${flag.name}`}
      >
        <img src={DeleteSvg} alt="delete" width="16" height="16" />
      </IconButton>
    </Stack>
  </Box>
);

export default PatientFlagRow;