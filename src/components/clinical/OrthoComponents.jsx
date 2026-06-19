import React from 'react';
import { Typography, Stack } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fontSize, fontWeight } from "../../constants/styles";

// --- Ortho Procedure Item ---
export const OrthoProcedure = ({ code, description }) => (
  <Typography sx={{ fontSize: fontSize.sm, color: '#333', py: 0.2, pl: 2, lineHeight: 1.2 }}>
    <strong>{code}:</strong> {description}
  </Typography>
);

// --- Sub-category Header ---
export const OrthoSubHeader = ({ label, expanded = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.5, mt: 0.5 }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333'
    }}>
      {label}
    </Typography>
    {expanded ? <KeyboardArrowUpIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
  </Stack>
);

// --- Highlighted Sub-Header (No Yellow Background) ---
export const HighlightedOrthoSubHeader = ({ label, isExpanded = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.6, mt: 0.5 }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, 
      fontWeight: fontWeight.medium, 
      color: '#333'
    }}>
      {label}
    </Typography>
    {isExpanded ? (
      <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#333' }} />
    ) : (
      <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#333' }} />
    )}
  </Stack>
);

// --- Ortho Code Item Component ---
export const OrthoCodeItem = ({ code, label }) => (
  <Typography sx={{ 
    fontSize: fontSize.sm, 
    color: '#333', 
    pl: 3, 
    py: 0.25, 
    lineHeight: 1.2
  }}>
    <strong>{code}:</strong> {label}
  </Typography>
);

// --- Ortho Section Header (No Yellow Highlight) ---
export const OrthoSectionHeader = ({ label, isExpanded = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.6 }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, 
      fontWeight: fontWeight.medium, 
      color: '#333'
    }}>
      {label}
    </Typography>
    {isExpanded ? (
      <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
    ) : (
      <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
    )}
  </Stack>
);
