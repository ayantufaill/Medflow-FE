import { Box, Typography } from "@mui/material";

const ColoredChipCheckbox = ({ checked, onChange, label, shape = "square", sx = {} }) => {
  const isCircle = shape === "circle";
  
  return (
    <Box
      onClick={() => onChange(!checked)}
      sx={{
        display: "flex", alignItems: "center", width: "100%", cursor: "pointer",
        p: "10px 14px", borderRadius: "8px", minHeight: "44px",
        transition: "all 0.2s ease-in-out",
        ...(checked 
          ? { backgroundColor: "#EFF6FF", border: "1.2px solid #3B82F6", color: "#2563EB" }
          : { backgroundColor: "#F1F5F9", border: "1.2px solid transparent", color: "#475569", "&:hover": { backgroundColor: "#E2E8F0" } }
        ),
        ...sx
      }}
    >
      <Box 
        sx={{ 
          width: 18, height: 18, borderRadius: isCircle ? "50%" : "4px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center", mr: 1.5,
          ...(checked 
            ? { backgroundColor: isCircle ? "#fff" : "#3B82F6", border: isCircle ? "5px solid #3B82F6" : "1px solid #3B82F6" }
            : { backgroundColor: "#fff", border: "1px solid #CBD5E1" }
          )
        }}
      >
        {checked && !isCircle && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </Box>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.3 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default ColoredChipCheckbox;

