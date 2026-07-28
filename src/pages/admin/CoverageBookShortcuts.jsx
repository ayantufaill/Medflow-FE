import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
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
    const newTemplateName = prompt("Enter new template name:");
    if (newTemplateName) {
      dispatch(createCoverageShortcut({ name: newTemplateName, groups: [] }));
    }
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
          onClick={handleAddTemplate}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
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
    </Box>
  );
};

export default CoverageBookShortcuts;
