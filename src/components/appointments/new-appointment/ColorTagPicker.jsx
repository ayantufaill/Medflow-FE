import { useState } from "react";
import { Box, Typography, Menu, Tooltip } from "@mui/material";
import { Add, LocalOfferOutlined, Close } from "@mui/icons-material";
import { Label } from "./helpers";
import { ICON_TAGS } from "./constants";

const MAX_TAGS = 2;

const ColorTagPicker = ({ selected = new Set(), onChange, readOnly = false }) => {
  const selectedArray = selected instanceof Set ? Array.from(selected) : (Array.isArray(selected) ? selected : []);
  const normalizedSelected = new Set(selectedArray.map(s => typeof s === 'string' ? s.toLowerCase() : s));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const selectedTags = ICON_TAGS.filter((tag) => normalizedSelected.has(tag.id.toLowerCase()));
  const availableTags = ICON_TAGS.filter((tag) => !normalizedSelected.has(tag.id.toLowerCase()));

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectTag = (tag) => {
    if (onChange) {
      onChange((prev) => {
        const prevSet = prev instanceof Set ? prev : new Set(Array.isArray(prev) ? prev : []);
        const n = new Set(prevSet);
        n.add(tag.id);
        return n;
      });
    }
    handleClose();
  };

  const handleRemoveTag = (tagId) => {
    if (onChange) {
      onChange((prev) => {
        const prevArray = prev instanceof Set ? Array.from(prev) : (Array.isArray(prev) ? prev : []);
        const n = new Set(prevArray.filter(s => typeof s !== 'string' || s.toLowerCase() !== tagId.toLowerCase()));
        return n;
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "8px" }}>
        <LocalOfferOutlined sx={{ fontSize: "14px", color: "#6b7280" }} />
        <Label sx={{ mb: 0 }}>Tags</Label>
      </Box>

      <Box sx={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        {selectedTags.map((tag) => (
          <Tooltip key={tag.id} title={tag.label} placement="top">
            <Box
              sx={{
                pointerEvents: "auto",
                width: "52px",
                height: "52px",
                borderRadius: "20px",
                backgroundColor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "all 0.15s",
                flexShrink: 0,
                position: "relative",
                "&:hover": {
                  backgroundColor: "#dbeafe",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Box
                component="img"
                src={tag.src}
                alt={tag.label}
                sx={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
              {!readOnly && (
                <Close
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    fontSize: "12px",
                    color: "#ef4444",
                    backgroundColor: "#eff6ff",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    padding: "2px",
                    cursor: "pointer",
                    "&:hover": { color: "#dc2626" },
                  }}
                />
              )}
            </Box>
          </Tooltip>
        ))}
        {!readOnly && selectedTags.length < MAX_TAGS && (
          <Tooltip title="Add Tag" arrow placement="top" disableInteractive>
            <Box
              component="span"
              onClick={handleOpen}
              sx={{
                width: "52px",
                height: "52px",
                borderRadius: "20px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  backgroundColor: "#e8f0fe",
                },
              }}
            >
              <Add sx={{ fontSize: "36px", color: "#9aa3ae" }} />
            </Box>
          </Tooltip>
        )}
      </Box>

      {selectedTags.length >= MAX_TAGS && (
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#ef4444", mt: "6px", ml: "2px" }}>
          Only 2 tags allow
        </Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            maxHeight: "400px",
            overflowY: "auto",
            py: "4px",
          },
        }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0px", px: "12px", py: "4px" }}>
          {availableTags.map((tag) => {
            const isAtMax = selectedTags.length >= MAX_TAGS;
            return (
              <Tooltip key={tag.id} title={isAtMax ? "Only 2 tags allow" : tag.label}>
                <Box
                  component="span"
                  onClick={() => {
                    if (!isAtMax) handleSelectTag(tag);
                  }}
                  sx={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isAtMax ? "not-allowed" : "pointer",
                    opacity: isAtMax ? 0.4 : 1,
                    transition: "all 0.15s",
                    "&:hover": {
                      backgroundColor: isAtMax ? "transparent" : "#f3f4f6",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={tag.src}
                    alt={tag.label}
                    sx={{ width: "44px", height: "44px", objectFit: "contain" }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Menu>
    </Box>
  );
};

export default ColorTagPicker;
