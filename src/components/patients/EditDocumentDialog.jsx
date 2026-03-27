import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Link,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const EDIT_NAME_SUGGESTIONS = [
  "BOB (Breakdown of benefits)",
  "Insurance Fax Back",
  "Treatment consent",
  "N2O Consent",
  "Signed Treatment Plan",
  "Pre-D",
];

const EDIT_CATEGORY_SUGGESTIONS = [
  "Insurance",
  "Consent",
  "Medical/Dental History",
  "Treatment Plan",
  "Referral",
  "Signed Receipt",
  "Medications",
  "ID",
  "Lab",
  "Invoices",
  "Consult",
];

export const EditDocumentDialog = ({ open, section, docId, name, type, category, onClose, onSave }) => {
  const [editData, setEditData] = useState({
    name: name || "",
    type: type || "",
    category: category || "",
  });

  // Update local state when props change
  useState(() => {
    setEditData({
      name: name || "",
      type: type || "",
      category: category || "",
    });
  });

  const handleSave = () => {
    onSave({
      section,
      docId,
      name: editData.name,
      category: editData.category,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 1,
          minWidth: 420,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1rem",
          bgcolor: "#3f5f98",
          color: "#ffffff",
          py: 1,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Edit Additional Document</span>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          pt: 2,
          pb: 1,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, color: "#616161" }}>
          Please enter a name and category
        </Typography>

        {/* Name row */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#333333", mr: 0.5 }}
            >
              Name:
            </Typography>
            <TextField
              variant="standard"
              fullWidth
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, name: e.target.value }))
              }
              InputProps={{
                disableUnderline: false,
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "0.9rem",
                  py: 0.25,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  pr: 1,
                  maxHeight: 140,
                  overflowY: "auto",
                }}
              >
                {EDIT_NAME_SUGGESTIONS.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    onClick={() =>
                      setEditData((prev) => ({ ...prev, name: label }))
                    }
                    sx={{
                      bgcolor: "#b0b0b0",
                      color: "#ffffff",
                      borderRadius: 0.5,
                      fontSize: "0.7rem",
                      px: 1,
                      "& .MuiChip-label": {
                        px: 1,
                        py: 0.25,
                        whiteSpace: "normal",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                minWidth: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  px: 2,
                  bgcolor: "#3f5f98",
                  "&:hover": { bgcolor: "#344a7c" },
                }}
              >
                Save to Defaults
              </Button>
              <Link
                component="button"
                variant="caption"
                underline="hover"
                sx={{ color: "#3f5f98" }}
              >
                Re-order
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Category row */}
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#333333", mr: 0.5 }}
            >
              Category:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                borderBottom: "1px solid #cccccc",
                minWidth: 180,
                pb: 0.25,
                fontSize: "0.9rem",
                color: "#333333",
              }}
            >
              {editData.category || "Claim Attachment"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  pr: 1,
                  maxHeight: 160,
                  overflowY: "auto",
                }}
              >
                {EDIT_CATEGORY_SUGGESTIONS.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    onClick={() =>
                      setEditData((prev) => ({ ...prev, category: label }))
                    }
                    sx={{
                      bgcolor: "#b0b0b0",
                      color: "#ffffff",
                      borderRadius: 0.5,
                      fontSize: "0.7rem",
                      px: 1,
                      "& .MuiChip-label": {
                        px: 1,
                        py: 0.25,
                        whiteSpace: "normal",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                minWidth: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  px: 2,
                  bgcolor: "#3f5f98",
                  "&:hover": { bgcolor: "#344a7c" },
                }}
              >
                Save to Defaults
              </Button>
              <Link
                component="button"
                variant="caption"
                underline="hover"
                sx={{ color: "#3f5f98" }}
              >
                Re-order
              </Link>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            bgcolor: "#3f5f98",
            "&:hover": { bgcolor: "#344a7c" },
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
