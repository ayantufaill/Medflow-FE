import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Premium HSL Tailored Color Palette matching the screenshot
const PREMIUM_COLORS = [
  "#90a4ae", // slate blue-gray
  "#ffccbc", // soft peach
  "#ffe082", // muted gold
  "#a5d6a7", // sage green
  "#80cbc4", // mint green
  "#80deea", // soft cyan
  "#90caf9", // sky blue
  "#b39ddb", // soft purple
  "#f48fb1", // soft pink
  "#ef9a9a", // coral/rose
  "#b0bec5", // light gray
  "#e0e0e0"  // cool gray
];

const BlockSlotDialog = ({
  open,
  onClose,
  initialData, // { roomId, date, startTime, endTime }
  onSave
}) => {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [selectedColor, setSelectedColor] = useState(PREMIUM_COLORS[0]);

  // Sync state with initialData when dialog opens
  useEffect(() => {
    if (open && initialData) {
      setStartTime(initialData.startTime || "08:00");
      setEndTime(initialData.endTime || "09:00");
      setNotes("");
      setSelectedColor(PREMIUM_COLORS[0]);
    }
  }, [open, initialData]);

  const handleSave = () => {
    onSave({
      roomId: initialData?.roomId,
      date: initialData?.date,
      startTime,
      endTime,
      notes,
      color: selectedColor
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
          overflow: "hidden"
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        bgcolor: "#1976d2", 
        color: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon /> Block Slot
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "#ffffff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, mt: 1.5 }}>
        {/* Time Slots */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
              Start Time
            </Typography>
            <TextField
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              inputProps={{ step: 300 }} // 5 min steps
              fullWidth
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5, display: "block" }}>
              End Time
            </Typography>
            <TextField
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              inputProps={{ step: 300 }}
              fullWidth
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
          </Box>
        </Box>

        {/* Notes */}
        <Box>
          <TextField
            label="Notes"
            placeholder="e.g. Morning Huddle"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => {
              if (e.target.value.length <= 254) {
                setNotes(e.target.value);
              }
            }}
            fullWidth
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
          <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block", textAlign: "right" }}>
            {notes.length}/254 characters
          </Typography>
        </Box>

        {/* Color Palette */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}>
            Select Color
          </Typography>
          
          {/* Main Color Preview Box */}
          <Box sx={{
            height: 48,
            borderRadius: 2,
            bgcolor: selectedColor,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease",
            border: "1px dashed rgba(0,0,0,0.15)"
          }}>
            <Typography sx={{ color: "rgba(0,0,0,0.6)", fontWeight: 500, fontSize: 13 }}>
              Selected Color Preview
            </Typography>
          </Box>

          {/* Color List */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {PREMIUM_COLORS.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <Tooltip key={color} title={color} arrow>
                  <Box
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: isSelected ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.15)",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                      transition: "transform 0.15s ease, border-color 0.15s ease",
                      "&:hover": {
                        transform: "scale(1.15)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    {isSelected && (
                      <CheckIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }} />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: "#f8fafc", borderTop: "1px solid #eef2f6" }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ borderRadius: 1.5, textTransform: "none", px: 3 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 1.5, textTransform: "none", px: 4 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockSlotDialog;
