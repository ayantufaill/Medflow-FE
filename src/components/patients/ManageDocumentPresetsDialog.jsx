import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const ManageDocumentPresetsDialog = ({
  open,
  onClose,
  title,
  presets,
  onSave
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (open) setItems([...presets]);
  }, [open, presets]);

  const moveUp = (idx) => {
    if (idx === 0) return;
    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    setItems(newItems);
  };

  const moveDown = (idx) => {
    if (idx === items.length - 1) return;
    const newItems = [...items];
    [newItems[idx + 1], newItems[idx]] = [newItems[idx], newItems[idx + 1]];
    setItems(newItems);
  };

  const remove = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth 
      sx={{ zIndex: 27000 }}
      PaperProps={{ 
        sx: { borderRadius: radius.lg, overflow: "hidden" } 
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.25,
          backgroundColor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
        }}
      >
        <Typography
          sx={{
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
            fontFamily: "Inter"
          }}
        >
          Manage {title} Presets
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: COLORS.TEXT_MUTED, p: "4px" }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 2, maxHeight: '400px' }}>
        {items.length === 0 ? (
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY, textAlign: "center", py: 4 }}>
            No presets available.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {items.map((item, idx) => (
              <Box key={`${item}-${idx}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.sm }}>
                <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
                  {item}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => moveUp(idx)} disabled={idx === 0} sx={{ p: 0.5 }}>
                    <ArrowUpIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => moveDown(idx)} disabled={idx === items.length - 1} sx={{ p: 0.5 }}>
                    <ArrowDownIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => remove(idx)} sx={{ p: 0.5, color: COLORS.ERROR }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, backgroundColor: COLORS.SURFACE_CARD, borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
        <Button
          onClick={onClose}
          sx={{
            color: COLORS.TEXT_SECONDARY,
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: fontWeight.medium,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => { onSave(items); onClose(); }}
          variant="contained"
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: "#fff",
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: fontWeight.semibold,
            boxShadow: "none",
            "&:hover": { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: "none" }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageDocumentPresetsDialog;
