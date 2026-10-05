import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

/**
 * Shown when the patient belongs to a household that already has coverage, so
 * staff know a family policy may cover this patient before they key in a new
 * one. Styled as the quieter sibling of ImportedCoverageBanner (neutral tint +
 * secondary button) because it is informational, while an imported coverage is
 * an action item waiting on review.
 */
const FamilyCoverageBanner = ({ onReview }) => {
  return (
    <Box sx={{
      bgcolor: COLORS.SURFACE_HOVER,
      p: 2,
      borderRadius: radius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      border: `1px solid ${COLORS.BORDER}`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        <Box sx={{ bgcolor: COLORS.WHITE, p: 1.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <FamilyRestroomIcon sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 28 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>
            Family Coverage was detected
          </Typography>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
            This patient belongs to a family with coverage
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        size="small"
        onClick={onReview}
        sx={{
          bgcolor: COLORS.BORDER,
          color: COLORS.TEXT_BODY,
          borderRadius: radius.md,
          textTransform: 'none',
          px: 3,
          flexShrink: 0,
          fontWeight: fontWeight.bold,
          fontSize: fontSize.base,
          boxShadow: 'none',
          '&:hover': { bgcolor: COLORS.TEXT_MUTED, color: COLORS.WHITE, boxShadow: 'none' },
        }}
      >
        Review
      </Button>
    </Box>
  );
};

export default FamilyCoverageBanner;
