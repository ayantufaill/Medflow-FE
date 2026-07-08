import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { formatPhoneInput } from "./formatters";
import { COLORS } from "../../../constants/colors";
import { radius, fontSize, fontWeight, roundedSelectMenuProps } from "../../../constants/styles";

// Styled <TextField> used for every plain text input in the intake form —
// rounded, light-gray fill, matches the design used across the rest of the app
// (PatientsListPage, AppointmentRightPanel, etc.).
export const OutlinedInput = (props) => (
  <TextField
    variant="outlined" size="small" fullWidth {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: "42px", borderRadius: radius.md, backgroundColor: COLORS.SURFACE_INPUT, fontFamily: "Inter",
        "& fieldset": { borderWidth: "1.2px", borderColor: COLORS.BORDER },
        "&:hover fieldset": { borderColor: COLORS.TEXT_MUTED },
        "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT, borderWidth: "1.2px" },
      },
      "& .MuiOutlinedInput-input": { padding: "8px 12px", fontSize: fontSize.md },
      ...props.sx
    }}
  />
);

// Same visual treatment as OutlinedInput, but for a <select>.
export const OutlinedSelect = ({ children, ...props }) => (
  <TextField
    select variant="outlined" size="small" fullWidth {...props}
    SelectProps={{ displayEmpty: true, MenuProps: roundedSelectMenuProps, ...props.SelectProps }}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: "42px", borderRadius: radius.md, backgroundColor: COLORS.SURFACE_INPUT, fontFamily: "Inter",
        "& fieldset": { borderWidth: "1.2px", borderColor: COLORS.BORDER },
        "&:hover fieldset": { borderColor: COLORS.TEXT_MUTED },
        "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT, borderWidth: "1.2px" },
      },
      "& .MuiSelect-select": { padding: "8px 12px", fontSize: fontSize.md },
      ...props.sx
    }}
  >
    {children}
  </TextField>
);

// OutlinedInput with a fixed "US" country-code prefix and live (###) ###-####
// formatting as the user types.
export const PhoneInput = ({ onChange, ...props }) => (
  <OutlinedInput
    {...props}
    placeholder="(201) 555-0123"
    onChange={(event) => {
      event.target.value = formatPhoneInput(event.target.value);
      onChange?.(event);
    }}
    InputProps={{
      startAdornment: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, pr: 1, borderRight: `1px solid ${COLORS.BORDER}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.TEXT_SECONDARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <TextField
            select
            variant="standard"
            defaultValue="US"
            InputProps={{ disableUnderline: true }}
            SelectProps={{ IconComponent: () => null, MenuProps: roundedSelectMenuProps }}
            sx={{
              "& .MuiSelect-select": {
                py: 0, pl: 0, pr: "0 !important",
                fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY,
                "&:focus": { backgroundColor: "transparent" }
              }
            }}
          >
            <MenuItem value="US">US</MenuItem>
          </TextField>
        </Box>
      ),
      ...props.InputProps
    }}
  />
);

// Custom-drawn radio group (MUI Radio doesn't match this design) — a row of
// pill-shaped options, each with its own filled dot when selected.
export const CustomRadioGroup = ({ options = [], value, onChange, sx = {} }) => (
  <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", ...sx }}>
    {options.map((opt) => (
      <Box
        key={opt.value}
        onClick={() => onChange(opt.value)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "34.8px",
          px: 1.5,
          borderRadius: radius.md,
          border: "1.2px solid",
          borderColor: value === opt.value ? COLORS.ACCENT : COLORS.BORDER,
          backgroundColor: value === opt.value ? COLORS.ACCENT_BG : COLORS.SURFACE_INPUT,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: value === opt.value ? COLORS.ACCENT : COLORS.TEXT_MUTED },
          ...(opt.width ? { width: opt.width } : {}),
          boxSizing: "border-box"
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "1.2px solid",
            borderColor: value === opt.value ? COLORS.ACCENT : COLORS.TEXT_MUTED,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value === opt.value && <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS.ACCENT }} />}
        </Box>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: value === opt.value ? COLORS.ACCENT : COLORS.TEXT_BODY, fontWeight: fontWeight.medium, whiteSpace: "nowrap" }}>
          {opt.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

// Small divider used between sub-groups of fields inside a SectionCard.
export const FieldDivider = () => (
  <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, ml: "-40px", width: "calc(100% + 80px)" }} />
);
