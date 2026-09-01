import { COLORS } from '../../../constants/colors';

export const labelSx = { 
  fontSize: '12px', 
  fontWeight: 600, 
  color: '#334155', 
  mb: 0.5, 
  display: 'block' 
};

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: "42px", 
    borderRadius: '8px', 
    backgroundColor: COLORS.SURFACE_INPUT, 
    fontFamily: "Inter",
    "& fieldset": { borderWidth: "1.2px", borderColor: COLORS.BORDER },
    "&:hover fieldset": { borderColor: COLORS.TEXT_MUTED },
    "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT, borderWidth: "1.2px" },
    "&.Mui-error fieldset": { borderColor: COLORS.STATUS_ERROR },
  },
  "& .MuiOutlinedInput-input": { padding: "8px 12px", fontSize: '14px' },
};

export const selectSx = {
  '& .MuiInputBase-root': {
    height: 36,
    fontSize: '13px',
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#09121f',
    backgroundColor: '#fafbfe',
    borderRadius: '4px',
  },
  '& .MuiSelect-select': {
    py: 1,
    pl: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0'
  }
};

export const menuItemSx = { fontFamily: 'Inter', fontSize: '13px' };

export const dropdownMenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  PaperProps: {
    style: {
      maxHeight: 250,
    },
  },
  sx: { zIndex: 150001 }
};
