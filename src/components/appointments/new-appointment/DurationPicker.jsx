import { Box, TextField, Typography } from "@mui/material";
import { Label } from "./helpers";

const PRESETS = [[30, 45, 60], [90, 120]];

const DurationPicker = ({ value, onChange }) => (
  <Box>
    <Label>Appt duration</Label>
    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <TextField
          type="number"
          size="small"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          sx={{
            width: "64px",
            "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "13px", py: "6px", textAlign: "center" },
            "& .MuiOutlinedInput-root": { borderRadius: "8px" },
          }}
          inputProps={{ min: 5, step: 5 }}
        />
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>mins</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {PRESETS.map((row, i) => (
          <Box key={i} sx={{ display: "flex", gap: "4px" }}>
            {row.map((v) => (
              <Box
                key={v}
                onClick={() => onChange(v)}
                sx={{
                  px: "10px", py: "3px", borderRadius: "6px",
                  cursor: "pointer", fontFamily: "Inter", fontSize: "11px", fontWeight: 600,
                  backgroundColor: value === v ? "#2262ef" : "#f1f5f9",
                  color: value === v ? "#fff" : "#6b7280",
                  transition: "all 0.15s",
                  "&:hover": { backgroundColor: value === v ? "#1a50cc" : "#e2e8f0" },
                }}
              >
                {v}m
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default DurationPicker;
