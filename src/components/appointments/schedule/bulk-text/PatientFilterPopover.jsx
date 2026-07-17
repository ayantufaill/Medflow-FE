import React, { useState, useEffect } from 'react';
import {
  Popover,
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  FormGroup,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { COLORS } from '../../../../constants/colors';
import { fontWeight, radius } from '../../../../constants/styles';
import { useDropdownData } from '../../../../hooks/redux';

const STATUSES = [
  { label: 'SCHEDULED', bg: '#dbeafe', color: '#1e40af' },
  { label: 'CONFIRMED', bg: '#dcfce7', color: '#166534' },
  { label: 'CHECKED IN', bg: '#dbeafe', color: '#1e40af' },
  { label: 'COMPLETED', bg: '#ffedd5', color: '#9a3412' },
  { label: 'NO SHOW', bg: '#dbeafe', color: '#1e40af' },
  { label: 'CANCELLED', bg: '#fee2e2', color: '#991b1b' },
];

const PatientFilterPopover = ({ anchorEl, onClose, filters, onApply }) => {
  const open = Boolean(anchorEl);
  const { providers = [] } = useDropdownData({ providers: true });

  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);

  // Sync internal state with props when opened
  useEffect(() => {
    if (open && filters) {
      setSearch(filters.search || '');
      setSelectedStatuses(filters.statuses || []);
      setSelectedProviders(filters.providers || []);
    }
  }, [open, filters]);

  const getProviderName = (p) => {
    if (!p) return "";
    if (p.name) return p.name;
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    if (fullName) return fullName;
    const userFullName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
    if (userFullName) return userFullName;
    return p.providerCode || `Provider #${p._id || p.id}` || "";
  };

  let providerNames = providers
    .map(p => getProviderName(p))
    .filter(Boolean);

  if (providerNames.length === 0) {
    providerNames = ['Sarah Mitchell', 'James Patel', 'Linda Chen'];
  }

  const handleStatusToggle = (label) => {
    setSelectedStatuses((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleProviderToggle = (name) => {
    setSelectedProviders((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleApply = () => {
    onApply({
      search,
      statuses: selectedStatuses,
      providers: selectedProviders,
    });
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      sx={{ zIndex: 1600 }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: '320px',
          ml: '8px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.BORDER_LIGHT}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: '12px 16px', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
        <FilterListIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: '20px' }} />
      </Box>

      <Box sx={{ p: '16px' }}>
        <Box sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', mb: '8px' }}>
            BY PATIENT NAME
          </Typography>
          <TextField
            fullWidth
            placeholder="Search For Patient"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: '18px' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '8px',
                fontSize: '13px',
                '& fieldset': { borderColor: COLORS.BORDER },
              }
            }}
          />
        </Box>

        <Box sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', mb: '8px' }}>
            BY APPOINTMENT STATUS
          </Typography>
          <FormGroup sx={{ gap: '8px' }}>
            {STATUSES.map((status) => (
              <FormControlLabel
                key={status.label}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedStatuses.includes(status.label)}
                    onChange={() => handleStatusToggle(status.label)}
                    sx={{ p: 0, mr: '12px', '&.Mui-checked': { color: '#09121f' } }}
                  />
                }
                label={
                  <Box sx={{ backgroundColor: status.bg, borderRadius: '4px', px: '8px', py: '2px' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: status.color, textTransform: 'uppercase' }}>
                      {status.label}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, '& .MuiFormControlLabel-label': { ml: 0 } }}
              />
            ))}
          </FormGroup>
        </Box>

        <Box sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', mb: '8px' }}>
            BY PROVIDER
          </Typography>
          <Box sx={{ maxHeight: '110px', overflowY: 'auto', pr: '8px' }}>
            <FormGroup sx={{ gap: '8px' }}>
              {providerNames.map((provider) => (
                <FormControlLabel
                  key={provider}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedProviders.includes(provider)}
                      onChange={() => handleProviderToggle(provider)}
                      sx={{ p: 0, mr: '12px', '&.Mui-checked': { color: '#09121f' } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '14px', color: COLORS.TEXT_PRIMARY }}>{provider}</Typography>}
                  sx={{ m: 0 }}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: '16px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
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

export default PatientFilterPopover;
