import { Box } from "@mui/material";
import { Add, LocalOfferOutlined } from "@mui/icons-material";
import { Label } from "./helpers";
import { COLOR_TAGS } from "./constants";

const ColorTagPicker = ({ selected, onChange }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "8px" }}>
      <LocalOfferOutlined sx={{ fontSize: "14px", color: "#6b7280" }} />
      <Label sx={{ mb: 0 }}>Tags</Label>
    </Box>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
      {COLOR_TAGS.map((color) => {
        const isSelected = selected.has(color);
        return (
          <Box
            key={color}
            onClick={() => onChange((prev) => {
              const n = new Set(prev);
              isSelected ? n.delete(color) : n.add(color);
              return n;
            })}
            sx={{
              width: "28px", height: "28px", borderRadius: "50%",
              backgroundColor: color, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: isSelected ? "2px solid #09121f" : "2px solid transparent",
              transition: "border 0.15s",
            }}
          >
            {isSelected && (
              <Box sx={{ width: "10px", height: "6px", border: "2px solid #fff", borderTop: "none", borderRight: "none", transform: "rotate(-45deg)", mt: "-2px" }} />
            )}
          </Box>
        );
      })}
      <Box sx={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { borderColor: "#9ca3af" } }}>
        <Add sx={{ fontSize: "14px", color: "#9aa3ae" }} />
      </Box>
    </Box>
  </Box>
);

export default ColorTagPicker;
