import { Box, Button } from "@mui/material";

const PillToggle = ({ value, onChange }) => (
  <Box sx={{ display: "inline-flex", border: "1px solid #E2E8F0", borderRadius: "20px", overflow: "hidden" }}>
    {[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }].map((opt) => (
      <Button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        disableElevation
        size="small"
        sx={{
          textTransform: "none", fontWeight: 500, fontSize: "0.8rem", px: 2, py: 0.5, minWidth: 48, borderRadius: 0,
          ...(value === opt.value
            ? { backgroundColor: "#1E293B", color: "#fff", "&:hover": { backgroundColor: "#334155" } }
            : { backgroundColor: "#fff", color: "#64748B", "&:hover": { backgroundColor: "#F8FAFC" } }),
        }}
      >
        {opt.label}
      </Button>
    ))}
  </Box>
);

export default PillToggle;
