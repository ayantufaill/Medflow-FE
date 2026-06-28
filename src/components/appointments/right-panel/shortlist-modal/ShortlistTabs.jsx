import { Box, Typography } from "@mui/material";

const TABS = ["Treatment", "Recare"];

const ShortlistTabs = ({ activeTab, onChange }) => (
  <Box sx={{
    borderBottom: "1px solid #e8edf3",
    px: "24px",
    display: "flex", gap: "24px",
    flexShrink: 0,
  }}>
    {TABS.map((label, i) => (
      <Box
        key={label}
        onClick={() => onChange(i)}
        sx={{
          py: "12px",
          cursor: "pointer",
          borderBottom: activeTab === i ? "2px solid #2262ef" : "2px solid transparent",
          mb: "-1px",
        }}
      >
        <Typography sx={{
          fontFamily: "Inter", fontSize: "14px",
          fontWeight: activeTab === i ? 700 : 400,
          color: activeTab === i ? "#2262ef" : "#9aa3ae",
        }}>
          {label}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default ShortlistTabs;
