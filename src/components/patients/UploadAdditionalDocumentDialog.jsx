import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";
import { useSelector, useDispatch } from 'react-redux';
import { selectPracticeInfo, fetchCurrentPracticeInfo, updateDocumentCategories } from '../../store/slices/practiceInfoSlice';
import { defaultDocumentList, defaultCategoryList } from '../../constants/documentCategories';
import ManageDocumentPresetsDialog from './ManageDocumentPresetsDialog';
import { SettingsOutlined as SettingsIcon } from "@mui/icons-material";

const UploadAdditionalDocumentDialog = ({
  open,
  onClose,
  onSave,
  files = []
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
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

  useEffect(() => {
    if (open) {
      setName(files.length === 1 ? files[0].name.split('.').slice(0, -1).join('.') || files[0].name : "");
      setCategory("");
    }
  }, [open, files]);

  const handleSave = () => {
    onSave({ name, category, files });
    onClose();
  };

  const saveNewPreset = async (type, value) => {
    if (!value) return;
    const newCategories = type === "categories" ? (presetCategories.includes(value) ? presetCategories : [...presetCategories, value]) : presetCategories;
    const newDocuments = type === "documents" ? (presetNames.includes(value) ? presetNames : [...presetNames, value]) : presetNames;
    
    let practiceId = practiceInfo?._id || practiceInfo?.id;
    if (!practiceId) {
      try {
        const res = await dispatch(fetchCurrentPracticeInfo()).unwrap();
        practiceId = res?._id || res?.id;
      } catch (err) {
        console.error('Failed to fetch practice info', err);
      }
    }
    if (practiceId) {
      dispatch(updateDocumentCategories({
        practiceInfoId: practiceId,
        documentCategoriesData: { categories: newCategories, documents: newDocuments }
      }));
    }
  };

  const handleReorder = async (type) => {
    let sortedCategories = presetCategories;
    let sortedDocuments = presetNames;
    
    if (type === "categories") {
      sortedCategories = [...presetCategories].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } else {
      sortedDocuments = [...presetNames].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }
    
    let practiceId = practiceInfo?._id || practiceInfo?.id;
    if (!practiceId) {
      try {
        const res = await dispatch(fetchCurrentPracticeInfo()).unwrap();
        practiceId = res?._id || res?.id;
      } catch (err) {
        console.error('Failed to fetch practice info', err);
      }
    }
    if (practiceId) {
      dispatch(updateDocumentCategories({
        practiceInfoId: practiceId,
        documentCategoriesData: { categories: sortedCategories, documents: sortedDocuments }
      }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      sx={{ zIndex: 26000 }}
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
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
        }}
      >
        <Typography
          sx={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
            fontFamily: "Inter"
          }}
        >
          Upload Additional Document
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: COLORS.TEXT_MUTED, p: "4px" }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 4, pt: 3, position: "relative" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 3 }}>
          Please enter a name and category
        </Typography>

        {/* Name Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY }}>Name:</Typography>
            <TextField
              variant="standard"
              placeholder="name of the document"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ flex: 1, maxWidth: 300, "& .MuiInputBase-input": { fontSize: fontSize.md, fontFamily: "Inter", color: COLORS.TEXT_PRIMARY } }}
            />
            {name && !presetNames.includes(name) && (
              <Button size="small" onClick={() => saveNewPreset("documents", name)} sx={{ textTransform: "none", fontSize: "0.7rem", py: 0, minWidth: 'auto', fontWeight: 600 }}>
                Save as default
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button size="small" onClick={() => handleReorder("documents")} sx={{ textTransform: "none", fontSize: "0.7rem", py: 0, minWidth: 'auto', fontWeight: 600, color: COLORS.ACCENT }}>
              Re-order
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {presetNames.map((preset) => (
              <Chip
                key={preset}
                label={preset}
                onClick={() => setName(preset)}
                sx={{
                  backgroundColor: COLORS.BORDER,
                  color: "#000",
                  fontFamily: "Inter",
                  fontSize: fontSize.xs,
                  fontWeight: fontWeight.medium,
                  borderRadius: radius.sm,
                  height: "24px",
                  "&:hover": { backgroundColor: COLORS.BORDER_HOVER }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Category Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY }}>Category:</Typography>
            <TextField
              variant="standard"
              placeholder="Category Name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ flex: 1, maxWidth: 300, "& .MuiInputBase-input": { fontSize: fontSize.md, fontFamily: "Inter", color: COLORS.TEXT_PRIMARY } }}
            />
            {category && !presetCategories.includes(category) && (
              <Button size="small" onClick={() => saveNewPreset("categories", category)} sx={{ textTransform: "none", fontSize: "0.7rem", py: 0, minWidth: 'auto', fontWeight: 600 }}>
                Save as default
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button size="small" onClick={() => handleReorder("categories")} sx={{ textTransform: "none", fontSize: "0.7rem", py: 0, minWidth: 'auto', fontWeight: 600, color: COLORS.ACCENT }}>
              Re-order
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {presetCategories.map((preset) => (
              <Chip
                key={preset}
                label={preset}
                onClick={() => setCategory(preset)}
                sx={{
                  backgroundColor: COLORS.BORDER,
                  color: "#000",
                  fontFamily: "Inter",
                  fontSize: fontSize.xs,
                  fontWeight: fontWeight.medium,
                  borderRadius: radius.sm,
                  height: "24px",
                  "&:hover": { backgroundColor: COLORS.BORDER_HOVER }
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2, backgroundColor: COLORS.SURFACE_CARD, borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: "#fff",
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: fontWeight.semibold,
            px: 4,
            borderRadius: radius.md,
            boxShadow: "none",
            "&:hover": { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: "none" }
          }}
        >
          Ok
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: COLORS.TEXT_SECONDARY,
            borderColor: COLORS.BORDER,
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: fontWeight.medium,
            px: 3,
            borderRadius: radius.md,
            "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.BORDER_HOVER }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAdditionalDocumentDialog;
