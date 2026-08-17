import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const PRESET_OPTIONS = [
  '1/1 M',
  '1/6 M',
  '1/12 M',
  '2/12 M',
  '1/1 Y',
  '1/5 Y',
];

const parseDeliveryPattern = (str) => {
  if (!str || typeof str !== 'string') {
    return { num1: '', num2: '', unit: 'M' };
  }
  const clean = str.trim();
  const match = clean.match(/^(\d*)\s*\/\s*(\d*)\s*([MYmy]?)$/);
  if (match) {
    return {
      num1: match[1] || '',
      num2: match[2] || '',
      unit: (match[3] || 'M').toUpperCase(),
    };
  }
  return { num1: '', num2: '', unit: 'M' };
};

const DeliveryPatternInput = ({ value, onChange }) => {
  const parsed = parseDeliveryPattern(value);
  const [num1, setNum1] = useState(parsed.num1);
  const [num2, setNum2] = useState(parsed.num2);
  const [unit, setUnit] = useState(parsed.unit);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const num1Ref = useRef(null);
  const num2Ref = useRef(null);

  // Sync internal state if prop value changes externally
  useEffect(() => {
    const p = parseDeliveryPattern(value);
    setNum1(p.num1);
    setNum2(p.num2);
    setUnit(p.unit);
  }, [value]);

  const updatePattern = (n1, n2, u) => {
    setNum1(n1);
    setNum2(n2);
    setUnit(u);
    if (!n1 && !n2) {
      onChange('');
    } else {
      onChange(`${n1}/${n2} ${u}`);
    }
  };

  const handleNum1Change = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Digits only
    updatePattern(val, num2, unit);

    // If user typed a digit in num1, auto-advance focus to num2
    if (val.length > 0) {
      setTimeout(() => {
        num2Ref.current?.focus();
        num2Ref.current?.select();
      }, 10);
    }
  };

  const handleNum1KeyDown = (e) => {
    // If user presses '/', 'ArrowRight', or 'Enter', move focus to num2
    if (e.key === '/' || e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      num2Ref.current?.focus();
      num2Ref.current?.select();
    }
  };

  const handleNum2Change = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2); // Max 2 digits
    updatePattern(num1, val, unit);
  };

  const handleNum2KeyDown = (e) => {
    // If Backspace pressed in num2 and num2 is empty, jump back to num1
    if (e.key === 'Backspace' && !num2) {
      e.preventDefault();
      num1Ref.current?.focus();
      num1Ref.current?.select();
    } else if (e.key === 'ArrowLeft' && e.target.selectionStart === 0) {
      num1Ref.current?.focus();
    }
  };

  const handleToggleUnit = (e) => {
    e.stopPropagation();
    const nextUnit = unit === 'M' ? 'Y' : 'M';
    updatePattern(num1, num2, nextUnit);
  };

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectPreset = (preset) => {
    if (!preset) {
      updatePattern('', '', 'M');
    } else {
      const p = parseDeliveryPattern(preset);
      updatePattern(p.num1, p.num2, p.unit);
    }
    handleCloseMenu();
  };

  return (
    <Box
      sx={{
        bgcolor: '#f0f3f7',
        borderRadius: '6px',
        height: '36px',
        minWidth: '105px',
        px: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: isFocused ? '1px solid #1976d2' : '1px solid transparent',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
        cursor: 'text',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (!num1) num1Ref.current?.focus();
          else num2Ref.current?.focus();
        }
      }}
    >
      {/* Input area: [num1] / [num2] [unit] */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0.2 }}>
        <input
          ref={num1Ref}
          type="text"
          value={num1}
          placeholder="__"
          onChange={handleNum1Change}
          onKeyDown={handleNum1KeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '20px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontFamily: 'inherit',
            fontWeight: 500,
            color: '#333',
            padding: 0,
          }}
        />

        <Typography sx={{ fontSize: '0.75rem', color: '#777', fontWeight: 600, userSelect: 'none', px: 0.2 }}>
          /
        </Typography>

        <input
          ref={num2Ref}
          type="text"
          value={num2}
          placeholder="__"
          onChange={handleNum2Change}
          onKeyDown={handleNum2KeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '24px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontFamily: 'inherit',
            fontWeight: 500,
            color: '#333',
            padding: 0,
          }}
        />

        <Typography
          onClick={handleToggleUnit}
          title="Click to toggle Months (M) / Years (Y)"
          sx={{
            fontSize: '0.75rem',
            color: '#1976d2',
            fontWeight: 700,
            ml: 0.5,
            cursor: 'pointer',
            userSelect: 'none',
            px: 0.4,
            py: 0.1,
            borderRadius: '3px',
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' },
          }}
        >
          {unit}
        </Typography>
      </Box>

      {/* Dropdown Menu Arrow */}
      <IconButton
        size="small"
        onClick={handleOpenMenu}
        sx={{ p: 0.2, ml: 0.5, color: '#666', '&:hover': { color: '#333' } }}
      >
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>

      {/* Preset Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            maxHeight: 220,
            width: '120px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        <MenuItem onClick={() => handleSelectPreset('')} sx={{ fontSize: '0.75rem', color: '#999' }}>
          <em>Select</em>
        </MenuItem>
        {PRESET_OPTIONS.map((opt) => (
          <MenuItem key={opt} onClick={() => handleSelectPreset(opt)} sx={{ fontSize: '0.75rem' }}>
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default DeliveryPatternInput;
