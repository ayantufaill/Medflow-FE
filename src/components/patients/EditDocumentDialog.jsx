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

  const [nameSuggestions, setNameSuggestions] = useState(EDIT_NAME_SUGGESTIONS);
  const [categorySuggestions, setCategorySuggestions] = useState(EDIT_CATEGORY_SUGGESTIONS);

  // Load from localStorage on mount
  useState(() => {
    try {
      const savedNames = localStorage.getItem("medflow_doc_names");
      if (savedNames) setNameSuggestions(JSON.parse(savedNames));
      
      const savedCats = localStorage.getItem("medflow_doc_categories");
      if (savedCats) setCategorySuggestions(JSON.parse(savedCats));
    } catch (e) {
      console.error("Failed to load suggestions from localStorage", e);
    }
    
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

  const handleSaveNameDefault = () => {
    const val = editData.name.trim();
    if (!val || nameSuggestions.includes(val)) return;
    const newSuggestions = [val, ...nameSuggestions];
    setNameSuggestions(newSuggestions);
    localStorage.setItem("medflow_doc_names", JSON.stringify(newSuggestions));
  };

  const handleResetNameDefaults = () => {
    setNameSuggestions(EDIT_NAME_SUGGESTIONS);
    localStorage.removeItem("medflow_doc_names");
  };

  const handleSaveCategoryDefault = () => {
    const val = editData.category.trim();
    if (!val || categorySuggestions.includes(val)) return;
    const newSuggestions = [val, ...categorySuggestions];
    setCategorySuggestions(newSuggestions);
    localStorage.setItem("medflow_doc_categories", JSON.stringify(newSuggestions));
  };

  const handleResetCategoryDefaults = () => {
    setCategorySuggestions(EDIT_CATEGORY_SUGGESTIONS);
    localStorage.removeItem("medflow_doc_categories");
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
                {nameSuggestions.map((label) => (
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
                onClick={handleSaveNameDefault}
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
                onClick={handleResetNameDefaults}
                sx={{ color: "#3f5f98" }}
              >
                Reset Defaults
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
            <TextField
              variant="standard"
              fullWidth
              value={editData.category}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="e.g. custom_form"
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
                  maxHeight: 160,
                  overflowY: "auto",
                }}
              >
                {categorySuggestions.map((label) => (
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
                onClick={handleSaveCategoryDefault}
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
                onClick={handleResetCategoryDefaults}
                sx={{ color: "#3f5f98" }}
              >
                Reset Defaults
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
