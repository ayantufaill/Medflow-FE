import { Box, Chip } from "@mui/material";

const ChipToggleGroup = ({ options = [], value, onChange, sx = {} }) => (
  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", ...sx }}>
    {options.map((opt) => {
      const isSelected = value === opt.value;
      return (
        <Chip
          key={opt.value}
          label={opt.label}
          onClick={() => onChange(isSelected ? "" : opt.value)}
          variant={isSelected ? "filled" : "outlined"}
          sx={{
            fontWeight: 500,
            fontSize: "0.82rem",
            height: 34,
            borderRadius: "17px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            ...(isSelected
              ? {
                  backgroundColor: "#1E293B",
                  color: "#fff",
                  border: "1px solid #1E293B",
                  "&:hover": { backgroundColor: "#334155" },
                }
              : {
                  backgroundColor: "#fff",
                  color: "#475569",
                  border: "1px solid #CBD5E1",
                  "&:hover": { backgroundColor: "#F8FAFC", borderColor: "#94A3B8" },
                }),
          }}
        />
      );
    })}
  </Box>
);

export default ChipToggleGroup;
