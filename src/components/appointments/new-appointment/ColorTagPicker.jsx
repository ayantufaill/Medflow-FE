import { useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { Add, LocalOfferOutlined } from "@mui/icons-material";
import { Label } from "./helpers";
import { ICON_TAGS } from "./constants";

const ColorTagPicker = ({ selected = new Set(), onChange }) => {
  const selectedSet = selected instanceof Set ? selected : new Set(Array.isArray(selected) ? selected : []);
  
  // If tags are already selected initially, start expanded; otherwise show only the add button
  const [isExpanded, setIsExpanded] = useState(() => selectedSet.size > 0);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "8px" }}>
        <LocalOfferOutlined sx={{ fontSize: "14px", color: "#6b7280" }} />
        <Label sx={{ mb: 0 }}>Tags</Label>
      </Box>

      {!isExpanded ? (
        <Tooltip title="Add Tag" arrow placement="top" disableInteractive>
          <Box
            onClick={() => setIsExpanded(true)}
            sx={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: "1.5px dashed #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s",
              "&:hover": {
                borderColor: "#2262ef",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            <Add sx={{ fontSize: "22px", color: "#9aa3ae" }} />
          </Box>
        </Tooltip>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px", alignItems: "center" }}>
          {ICON_TAGS.map((tag) => {
            const lowerId = tag.id.toLowerCase();
            const isSelected = selectedSet.has(lowerId) || selectedSet.has(tag.id);
            return (
              <Tooltip key={tag.id} title={tag.label} arrow placement="top" disableInteractive>
                <Box
                  onClick={() => {
                    if (onChange) {
                      onChange((prev) => {
                        const prevSet = prev instanceof Set ? prev : new Set(Array.isArray(prev) ? prev : []);
                        const n = new Set(prevSet);
                        if (isSelected) {
                          n.delete(tag.id);
                          n.delete(lowerId);
                        } else {
                          n.add(tag.id);
                        }
                        return n;
                      });
                    }
                  }}
                  sx={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "6px",
                    backgroundColor: isSelected ? "#e0e7ff" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: "2px",
                    border: isSelected ? "2px solid #09121f" : "2px solid transparent",
                    transition: "all 0.15s",
                    "&:hover": {
                      backgroundColor: isSelected ? "#e0e7ff" : "#f3f4f6",
                    },
                  }}
                >
                  <img src={tag.src} alt={tag.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ColorTagPicker;
