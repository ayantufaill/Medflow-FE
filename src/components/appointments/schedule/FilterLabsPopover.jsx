import React, { useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontWeight, radius } from '../../../constants/styles';
import { useDropdownData, useScheduleState } from '../../../hooks/redux';

const FilterLabsPopover = ({ anchorEl, onClose }) => {
  const open = Boolean(anchorEl);
  const { providers = [] } = useDropdownData({ providers: true });
  const { frontendFilters, setFrontendFilters } = useScheduleState();

  const [providerId, setProviderId] = useState(frontendFilters?.providerId || 'All');
  const [visitType, setVisitType] = useState(frontendFilters?.visitType || 'All');

  // Sync local state when popover opens
  React.useEffect(() => {
    if (open) {
      setProviderId(frontendFilters?.providerId || 'All');
      setVisitType(frontendFilters?.visitType || 'All');
    }
  }, [open, frontendFilters]);

  const getProviderName = (p) => {
    if (!p) return "";
    if (p.name) return p.name;
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    if (fullName) return fullName;
    const userFullName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
    if (userFullName) return userFullName;
    return p.providerCode || `Provider #${p._id || p.id}` || "";
  };

  const handleApply = () => {
    setFrontendFilters({ providerId, visitType });
    onClose();
  };

  const handleClear = () => {
    setProviderId('All');
    setVisitType('All');
    setFrontendFilters({ providerId: 'All', visitType: 'All' });
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: '8px',
            width: 320,
            borderRadius: radius.md,
            boxShadow: '0px 12px 24px -4px rgba(0, 0, 0, 0.08), 0px 4px 12px -4px rgba(0, 0, 0, 0.12)',
            border: `1px solid ${COLORS.BORDER}`
          }
        }
      }}
    >
      <Box sx={{ p: '16px' }}>

        <Box sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', mb: '8px' }}>
            BY PROVIDER
          </Typography>
          <Select
            size="small"
            fullWidth
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            sx={{
              height: '40px',
              fontFamily: 'Inter',
              fontSize: '13px',
              borderRadius: '8px',
              '& fieldset': { borderColor: COLORS.BORDER },
            }}
          >
            <MenuItem value="All" sx={{ fontSize: '13px' }}>All</MenuItem>
            {providers.map((p) => (
              <MenuItem key={p._id || p.id} value={p._id || p.id} sx={{ fontSize: '13px' }}>
                {getProviderName(p)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', mb: '8px' }}>
            BY VISIT TYPE
          </Typography>
          <Select
            size="small"
            fullWidth
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
            sx={{
              height: '40px',
              fontFamily: 'Inter',
              fontSize: '13px',
              borderRadius: '8px',
              '& fieldset': { borderColor: COLORS.BORDER },
            }}
          >
            <MenuItem value="All" sx={{ fontSize: '13px' }}>All</MenuItem>
            <MenuItem value="Treatment" sx={{ fontSize: '13px' }}>Treatment</MenuItem>
            <MenuItem value="Recare" sx={{ fontSize: '13px' }}>Recare</MenuItem>
            <MenuItem value="Exam" sx={{ fontSize: '13px' }}>Exam</MenuItem>
            <MenuItem value="Emergency" sx={{ fontSize: '13px' }}>Emergency</MenuItem>
            <MenuItem value="Consultation" sx={{ fontSize: '13px' }}>Consultation</MenuItem>
          </Select>
        </Box>

      </Box>

      <Box sx={{ p: '16px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, display: 'flex', gap: '12px' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleClear}
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_SECONDARY,
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '40px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
          }}
        >
          Clear
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleApply}
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '40px',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Popover>
  );
};

export default FilterLabsPopover;
