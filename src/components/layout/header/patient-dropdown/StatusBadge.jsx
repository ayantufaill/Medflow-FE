import { Box, Typography } from "@mui/material";

const STYLES = {
  active:       { bg: "#dcfce7", color: "#16a34a", label: "Active" },
  in_treatment: { bg: "#dbeafe", color: "#2262ef", label: "In treatment" },
  overdue:      { bg: "#fef3c7", color: "#d97706", label: "Overdue" },
  new:          { bg: "#f1f5f9", color: "#64748b", label: "New" },
};

const StatusBadge = ({ status }) => {
  const s = STYLES[status] || STYLES.new;
  return (
    <Box sx={{ backgroundColor: s.bg, borderRadius: "20px", px: "10px", py: "2px", flexShrink: 0 }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: s.color, whiteSpace: "nowrap" }}>
        {s.label}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
