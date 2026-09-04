import React from 'react';
import { Select } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

const dropdownMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      '& .MuiMenuItem-root': {
        fontSize: '13px',
        fontFamily: 'Inter',
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: '#f3f4f6'
        },
        '&.Mui-selected': {
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          '&:hover': {
            backgroundColor: '#dbeafe'
          }
        }
      }
    }
  },
  style: { zIndex: 10000 },
  sx: { zIndex: 10000 },
};

const selectStyles = {
  fontFamily: "Inter", 
  fontSize: "13px", 
  borderRadius: "6px", 
  backgroundColor: "#fff",
  color: "#374151", 
  height: "30px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6", borderWidth: "1.5px" },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    height: "100% !important",
  },
  "& .MuiSelect-icon": {
    color: "#6b7280",
  }
};

const CustomSelect = ({ sx = {}, MenuProps = {}, ...props }) => {
  return (
    <Select
      IconComponent={KeyboardArrowDownIcon}
      MenuProps={{
        ...dropdownMenuProps,
        ...MenuProps,
        PaperProps: {
          ...dropdownMenuProps.PaperProps,
          ...(MenuProps.PaperProps || {}),
          sx: {
            ...dropdownMenuProps.PaperProps.sx,
            ...(MenuProps.PaperProps?.sx || {})
          }
        }
      }}
      sx={{ ...selectStyles, ...sx }}
      {...props}
    >
      {props.children}
    </Select>
  );
};

export default CustomSelect;
