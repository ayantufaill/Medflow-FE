import { Box, Tooltip } from "@mui/material";
import { Add, LocalOfferOutlined } from "@mui/icons-material";
import { Label } from "./helpers";
import { ICON_TAGS } from "./constants";

const ColorTagPicker = ({ selected, onChange }) => {
  // Merge ICON_TAGS with any additionally selected custom icons if needed (currently just ICON_TAGS)
  const allIcons = ICON_TAGS;
  
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "8px" }}>
        <LocalOfferOutlined sx={{ fontSize: "14px", color: "#6b7280" }} />
        <Label sx={{ mb: 0 }}>Tags</Label>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px", alignItems: "center" }}>
        {allIcons.map((tag) => {
          const lowerId = tag.id.toLowerCase();
          const isSelected = selected.has(lowerId) || selected.has(tag.id);
          return (
            <Tooltip key={tag.id} title={tag.label} arrow placement="top" disableInteractive>
              <Box
                onClick={() => onChange((prev) => {
                  const n = new Set(prev);
                  if (isSelected) {
                    n.delete(tag.id);
                    n.delete(lowerId);
                  } else {
                    n.add(tag.id); // store the original ID format
                  }
                  return n;
                })}
                sx={{
                  width: "100%", aspectRatio: "1/1", borderRadius: "6px",
                  backgroundColor: isSelected ? "#e0e7ff" : "transparent",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: isSelected ? "2px solid #09121f" : "2px solid transparent",
                  transition: "all 0.15s",
                  "&:hover": {
                    backgroundColor: isSelected ? "#e0e7ff" : "#f3f4f6",
                  }
                }}
              >
                <img src={tag.src} alt={tag.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </Box>
            </Tooltip>
          );
        })}
        <Tooltip title="Add Tag" arrow placement="top" disableInteractive>
          <Box sx={{ width: "100%", aspectRatio: "1/1", borderRadius: "6px", border: "1.5px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f3f4f6" } }}>
            <Add sx={{ fontSize: "24px", color: "#9aa3ae" }} />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ColorTagPicker;
