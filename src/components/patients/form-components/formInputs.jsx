import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { formatPhoneInput } from "./formatters";

// Styled <TextField> used for every plain text input in the intake form —
// rounded, light-gray fill, matches the design in NewPatientIntakeFormV2.
export const OutlinedInput = (props) => (
  <TextField
    variant="outlined" size="small" fullWidth {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: "42px", borderRadius: "8px", backgroundColor: "#F0F3FB",
        "& fieldset": { borderWidth: "1.2px", borderColor: "#E2E8F0" },
        "&:hover fieldset": { borderColor: "#CBD5E1" },
        "&.Mui-focused fieldset": { borderColor: "#1a73e8", borderWidth: "1.2px" },
      },
      "& .MuiOutlinedInput-input": { padding: "8px 12px", fontSize: "0.88rem" },
      ...props.sx
    }}
  />
);

// Same visual treatment as OutlinedInput, but for a <select>.
export const OutlinedSelect = ({ children, ...props }) => (
  <TextField
    select variant="outlined" size="small" fullWidth {...props}
    SelectProps={{ displayEmpty: true, ...props.SelectProps }}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: "42px", borderRadius: "8px", backgroundColor: "#F0F3FB",
        "& fieldset": { borderWidth: "1.2px", borderColor: "#E2E8F0" },
        "&:hover fieldset": { borderColor: "#CBD5E1" },
        "&.Mui-focused fieldset": { borderColor: "#1a73e8", borderWidth: "1.2px" },
      },
      "& .MuiSelect-select": { padding: "8px 12px", fontSize: "0.88rem" },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, pr: 1, borderRight: "1px solid #E2E8F0" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <TextField
            select
            variant="standard"
            defaultValue="US"
            InputProps={{ disableUnderline: true }}
            SelectProps={{ IconComponent: () => null }}
            sx={{
              "& .MuiSelect-select": {
                py: 0, pl: 0, pr: "0 !important",
                fontSize: "0.85rem", fontWeight: 500, color: "#1E293B",
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
          borderRadius: "8px",
          border: "1.2px solid",
          borderColor: value === opt.value ? "#1a73e8" : "#E2E8F0",
          backgroundColor: value === opt.value ? "#e8f0fe" : "#F0F3FB",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: value === opt.value ? "#1a73e8" : "#CBD5E1" },
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
            borderColor: value === opt.value ? "#1a73e8" : "#94A3B8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value === opt.value && <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#1a73e8" }} />}
        </Box>
        <Typography sx={{ fontSize: "0.85rem", color: value === opt.value ? "#1a73e8" : "#475569", fontWeight: 500, whiteSpace: "nowrap" }}>
          {opt.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

// Small uppercase divider used between sub-groups of fields inside a SectionCard.
export const FieldDivider = () => (
  <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
);
