import { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Description as DescriptionIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  FolderOutlined as FolderOutlinedIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux';
import { selectPracticeInfo, fetchCurrentPracticeInfo, updateDocumentCategories } from '../../store/slices/practiceInfoSlice';
import { defaultDocumentList, defaultCategoryList } from '../../constants/documentCategories';

// ─── Design tokens (mirrors RecordVitalsDialog) ───────────────────────────────

const Label = ({ children, required }) => (
  <Typography
    sx={{
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: "11.5px",
      lineHeight: "17.25px",
      color: "#4b5563",
      display: "block",
      mb: 0.75,
    }}
  >
    {children}
    {required && <span style={{ color: "#e53935" }}> *</span>}
  </Typography>
);

const sharedInputSx = {
  borderRadius: "8px",
  backgroundColor: "#fff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D1D5DB",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2563EB",
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontSize: "0.875rem",
    fontFamily: "Inter",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9CA3AF",
    opacity: 1,
  },
};

const SectionContainer = ({ title, icon: Icon, children }) => (
  <Box
    sx={{
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      mb: 2.5,
      backgroundColor: "#FFFFFF",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2.5,
        py: 1.75,
        backgroundColor: "#F3F8FD",
        borderBottom: "1px solid #E5E7EB",
        borderTopLeftRadius: "11px",
        borderTopRightRadius: "11px",
      }}
    >
      {Icon && <Icon sx={{ color: "#2563EB", fontSize: 20 }} />}
      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: "20px",
          color: "#111",
        }}
      >
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Box>
);

// ─── Suggestion data ──────────────────────────────────────────────────────────



// ─── Component ────────────────────────────────────────────────────────────────

export const EditDocumentDialog = ({
  open,
  section,
  docId,
  name,
  type,
  category,
  onClose,
  onSave,
}) => {
  const [editData, setEditData] = useState({
    name: name || "",
    type: type || "",
    category: category || "",
  });
  const dispatch = useDispatch();
  const practiceInfo = useSelector(selectPracticeInfo);

  useEffect(() => {
    if (open && (!practiceInfo || !practiceInfo.documentCategories)) {
      dispatch(fetchCurrentPracticeInfo());
    }
  }, [open, practiceInfo, dispatch]);

  const dbDocs = practiceInfo?.documentCategories?.documents;
  const dbCats = practiceInfo?.documentCategories?.categories;
  const isDummyDocs = !dbDocs || dbDocs.length === 0 || (dbDocs.length === 5 && dbDocs[0] === "BOB(Breakdown of Benefit)");
  const isDummyCats = !dbCats || dbCats.length === 0 || (dbCats.length === 5 && dbCats[0] === "BOB(Breakdown of Benefit)");

  const presetNames = isDummyDocs ? defaultDocumentList : dbDocs;
  const presetCategories = isDummyCats ? defaultCategoryList : dbCats;

  const [nameSuggestions, setNameSuggestions] = useState(presetNames);
  const [categorySuggestions, setCategorySuggestions] = useState(presetCategories);

  useEffect(() => {
    setNameSuggestions(presetNames);
  }, [presetNames]);

  useEffect(() => {
    setCategorySuggestions(presetCategories);
  }, [presetCategories]);

  // Sync fields when props change (dialog re-opens for a different doc)
  useEffect(() => {
    setEditData({ name: name || "", type: type || "", category: category || "" });
  }, [name, type, category, open]);

  const handleSave = () => {
    onSave({ section, docId, name: editData.name, category: editData.category });
  };

  // ── Name suggestion persistence ──
  const handleSaveNameDefault = async () => {
    const val = editData.name.trim();
    if (!val || nameSuggestions.includes(val)) return;
    const updated = [val, ...nameSuggestions];
    setNameSuggestions(updated);

    let practiceId = practiceInfo?._id || practiceInfo?.id;
    if (!practiceId) {
      try {
        const res = await dispatch(fetchCurrentPracticeInfo()).unwrap();
        practiceId = res?._id || res?.id;
      } catch (err) {
        console.error(err);
      }
    }
    if (practiceId) {
      dispatch(updateDocumentCategories({
        practiceInfoId: practiceId,
        documentCategoriesData: { categories: categorySuggestions, documents: updated }
      }));
    }
  };

  const handleResetNameDefaults = () => {
    setNameSuggestions(defaultDocumentList);
  };

  // ── Category suggestion persistence ──
  const handleSaveCategoryDefault = async () => {
    const val = editData.category.trim();
    if (!val || categorySuggestions.includes(val)) return;
    const updated = [val, ...categorySuggestions];
    setCategorySuggestions(updated);

    let practiceId = practiceInfo?._id || practiceInfo?.id;
    if (!practiceId) {
      try {
        const res = await dispatch(fetchCurrentPracticeInfo()).unwrap();
        practiceId = res?._id || res?.id;
      } catch (err) {
        console.error(err);
      }
    }
    if (practiceId) {
      dispatch(updateDocumentCategories({
        practiceInfoId: practiceId,
        documentCategoriesData: { categories: updated, documents: nameSuggestions }
      }));
    }
  };

  const handleResetCategoryDefaults = () => {
    setCategorySuggestions(defaultCategoryList);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          mt: "80px",
          maxHeight: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
      sx={{ zIndex: 1305, alignItems: "flex-start" }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          backgroundColor: "#F1F5FD",
          borderBottom: "1px solid #E5E7EB",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Icon badge */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#e2ebfc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <DescriptionIcon sx={{ color: "#2563EB", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.4px",
                color: "#111",
              }}
            >
              Edit Document
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "11.5px",
                lineHeight: "17.25px",
                color: "#6B7280",
              }}
            >
              Update the document name and category
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#6B7280" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ px: 3, pt: "24px !important", pb: 1, overflowY: "auto", flex: 1 }}>
        {/* Section 1 — Document Name */}
        <SectionContainer title="Document Name" icon={DescriptionOutlinedIcon}>
          <Label required>Name</Label>
          <TextField
            fullWidth
            variant="outlined"
            value={editData.name}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g. Treatment Consent"
            InputProps={{ sx: sharedInputSx }}
          />

          {/* Quick-select chips */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
            {nameSuggestions.map((label) => {
              const isSelected = editData.name === label;
              return (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setEditData((prev) => ({ ...prev, name: label }))
                  }
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.72rem",
                    borderColor: isSelected ? "#2563EB" : "#E5E7EB",
                    color: isSelected ? "#2563EB" : "#6B7280",
                    backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {
                      borderColor: "#2563EB",
                      color: "#2563EB",
                      backgroundColor: "#EFF6FF",
                    },
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              );
            })}
          </Box>

          {/* Persist controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 1.25,
            }}
          >
            <Typography
              component="button"
              onClick={handleSaveNameDefault}
              sx={{
                fontFamily: "Inter",
                fontSize: "11.5px",
                color: "#2563EB",
                cursor: "pointer",
                background: "none",
                border: "none",
                p: 0,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              + Save as default
            </Typography>
            <Typography
              component="button"
              onClick={handleResetNameDefaults}
              sx={{
                fontFamily: "Inter",
                fontSize: "11.5px",
                color: "#9CA3AF",
                cursor: "pointer",
                background: "none",
                border: "none",
                p: 0,
                "&:hover": { textDecoration: "underline", color: "#6B7280" },
              }}
            >
              Reset
            </Typography>
          </Box>
        </SectionContainer>

        {/* Section 2 — Category */}
        <SectionContainer title="Category" icon={FolderOutlinedIcon}>
          <Label>Category</Label>
          <TextField
            fullWidth
            variant="outlined"
            value={editData.category}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, category: e.target.value }))
            }
            placeholder="e.g. Consent"
            InputProps={{ sx: sharedInputSx }}
          />

          {/* Quick-select chips */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
            {categorySuggestions.map((label) => {
              const isSelected = editData.category === label;
              return (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setEditData((prev) => ({ ...prev, category: label }))
                  }
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.72rem",
                    borderColor: isSelected ? "#2563EB" : "#E5E7EB",
                    color: isSelected ? "#2563EB" : "#6B7280",
                    backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {
                      borderColor: "#2563EB",
                      color: "#2563EB",
                      backgroundColor: "#EFF6FF",
                    },
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              );
            })}
          </Box>

          {/* Persist controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 1.25,
            }}
          >
            <Typography
              component="button"
              onClick={handleSaveCategoryDefault}
              sx={{
                fontFamily: "Inter",
                fontSize: "11.5px",
                color: "#2563EB",
                cursor: "pointer",
                background: "none",
                border: "none",
                p: 0,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              + Save as default
            </Typography>
            <Typography
              component="button"
              onClick={handleResetCategoryDefaults}
              sx={{
                fontFamily: "Inter",
                fontSize: "11.5px",
                color: "#9CA3AF",
                cursor: "pointer",
                background: "none",
                border: "none",
                p: 0,
                "&:hover": { textDecoration: "underline", color: "#6B7280" },
              }}
            >
              Reset
            </Typography>
          </Box>
        </SectionContainer>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #E5E7EB",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "0.875rem",
            borderColor: "#D1D5DB",
            color: "#374151",
            borderRadius: "8px",
            px: 2.5,
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "0.875rem",
            backgroundColor: "#2563EB",
            borderRadius: "8px",
            px: 2.5,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#1d4ed8",
              boxShadow: "none",
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
