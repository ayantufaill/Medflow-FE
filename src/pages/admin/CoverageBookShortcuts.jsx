import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  Breadcrumbs,
  Link,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCoverageShortcuts, 
  createCoverageShortcut, 
  updateCoverageShortcut, 
  deleteCoverageShortcut,
  selectCoverageShortcuts 
} from '../../store/slices/coverageShortcutsSlice';
import AddCoverageGroupModal from '../../components/admin/coverage/AddCoverageGroupModal';
import CoverageCategoryItem from '../../components/admin/finance-management/coverage-book-shortcuts/CoverageCategoryItem';
import CircularProgress from '@mui/material/CircularProgress';

const CoverageBookShortcuts = () => {
  const dispatch = useDispatch();
  const shortcuts = useSelector(selectCoverageShortcuts);
  const initialized = useSelector(state => state.coverageShortcuts.initialized);

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const [addTemplateModalOpen, setAddTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  React.useEffect(() => {
    dispatch(fetchCoverageShortcuts());
  }, [dispatch]);

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleAddGroup = (e, categoryId) => {
    e.stopPropagation();
    setSelectedGroup(null);
    setSelectedCategoryId(categoryId);
    setModalOpen(true);
  };

  const handleEditGroup = (e, categoryId, group) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setSelectedCategoryId(categoryId);
    setModalOpen(true);
  };

  const handleAddTemplate = () => {
    setNewTemplateName('');
    setAddTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      dispatch(createCoverageShortcut({ name: newTemplateName.trim(), groups: [] }));
    }
    setAddTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this template?")) {
      dispatch(deleteCoverageShortcut(id));
    }
  };

  const handleDeleteGroup = (e, categoryId, groupId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this group?")) {
      const category = shortcuts.find(c => c.id === categoryId);
      if (category) {
        const updatedGroups = category.groups.filter(g => g.id !== groupId);
        dispatch(updateCoverageShortcut({ id: categoryId, updates: { groups: updatedGroups } }));
      }
    }
  };

  const handleSaveGroup = (groupData) => {
    const category = shortcuts.find(c => c.id === selectedCategoryId);
    if (!category) return;

    let updatedGroups;
    if (selectedGroup) {
      // Edit
      updatedGroups = category.groups.map(g => g.id === groupData.id ? groupData : g);
    } else {
      // Add
      updatedGroups = [...category.groups, { ...groupData, id: Date.now() }];
    }
    
    dispatch(updateCoverageShortcut({ id: selectedCategoryId, updates: { groups: updatedGroups } }));
    setModalOpen(false);
  };

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Coverage Book Shortcuts
        </Typography>
        <Button
          variant="contained"
          onClick={handleAddTemplate}
          startIcon={<AddIcon sx={{ fontSize: '18px' }} />}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            height: 38, 
            px: "20px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Add Template
        </Button>
      </Box>

      {/* List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {shortcuts.length === 0 && (
          <Typography sx={{ p: 2, color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>No templates found. Click "Add Template" to create one.</Typography>
        )}
        {shortcuts.map((category) => (
          <CoverageCategoryItem
            key={category.id}
            category={category}
            isExpanded={expandedCategories.includes(category.id)}
            toggleCategory={toggleCategory}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            handleAddGroup={handleAddGroup}
            handleEditGroup={handleEditGroup}
            handleDeleteTemplate={handleDeleteTemplate}
            handleDeleteGroup={handleDeleteGroup}
          />
        ))}
      </Box>

      <AddCoverageGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGroup}
        groupData={selectedGroup}
      />

      {/* Add Template Modal */}
      <Dialog 
        open={addTemplateModalOpen} 
        onClose={() => setAddTemplateModalOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
        }}
      >
        <Box sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "20px", py: "16px",
          borderBottom: "1px solid #e0e5eb",
          backgroundColor: "#f3f8fd",
        }}>
          <Box sx={{
            width: "36px", height: "36px", borderRadius: "8px",
            backgroundColor: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
              Add Template
            </Typography>
            <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
              Create a new coverage book template.
            </Typography>
          </Box>
          <IconButton onClick={() => setAddTemplateModalOpen(false)} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 4, py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontFamily: "Inter", color: '#374151', fontWeight: 600, fontSize: '13px' }}>
              Template Name:
            </Typography>
            <TextField
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
              variant="outlined"
              size="small"
              fullWidth
              autoFocus
              InputProps={{
                sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" }
              }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={() => setAddTemplateModalOpen(false)}
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #d0d5dd", color: "#374151",
              px: "16px", py: "7px",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveTemplate}
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            }}
          >
            Create Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoverageBookShortcuts;
