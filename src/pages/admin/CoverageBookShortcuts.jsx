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
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#003366' } }}>
        <Link underline="hover" color="#7a96b5" component={RouterLink} to="/admin/finance-management" sx={{ fontSize: '0.85rem' }}>
          Finance Management
        </Link>
        <Typography color="#003366" sx={{ fontSize: '0.85rem' }}>
          Coverage Book Shortcuts
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
          Coverage Book Shortcuts
        </Typography>
        <Button
          onClick={handleAddTemplate}
          startIcon={<AddIcon />}
          sx={{
            color: '#003366',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Add Template
        </Button>
      </Box>

      {/* List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {shortcuts.length === 0 && (
          <Typography sx={{ p: 2, color: '#666', fontStyle: 'italic' }}>No templates found. Click "Add Template" to create one.</Typography>
        )}
        {shortcuts.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <Box key={category.id} sx={{ borderBottom: '1px solid #7a96b5', pb: 1 }}>
              <Box
                onClick={() => toggleCategory(category.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1.2,
                  px: 2,
                  backgroundColor: isExpanded ? '#003366' : '#f0f7ff',
                  color: isExpanded ? 'white' : '#003366',
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: isExpanded ? '#002244' : '#e1efff',
                  },
                }}
              >
                {isExpanded ? (
                  <ChevronDownIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                ) : (
                  <ChevronRightIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                )}
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>
                  {category.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    onClick={(e) => handleAddGroup(e, category.id)}
                    startIcon={<AddIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      color: isExpanded ? 'white' : '#003366',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Add Group
                  </Button>
                  <IconButton 
                    onClick={(e) => handleDeleteTemplate(e, category.id)}
                    size="small" 
                    sx={{ color: isExpanded ? 'white' : '#7a96b5' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ pl: 4, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {(!category.groups || category.groups.length === 0) && (
                    <Typography sx={{ color: '#888', fontStyle: 'italic', fontSize: '0.8rem', py: 1 }}>
                      No groups added yet.
                    </Typography>
                  )}
                  {category.groups && category.groups.map((group) => {
                    const isGroupExpanded = expandedGroups.includes(group.id);

                    return (
                      <Box key={group.id} sx={{ mb: 0.5 }}>
                        <Box
                          onClick={() => toggleGroup(group.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 1,
                            px: 2,
                            backgroundColor: '#f9fbfd',
                            borderRadius: 1,
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            '&:hover': { borderColor: '#7a96b5' },
                          }}
                        >
                          {isGroupExpanded ? (
                            <ChevronDownIcon sx={{ mr: 2, fontSize: '1.1rem', color: '#7a96b5' }} />
                          ) : (
                            <ChevronRightIcon sx={{ mr: 2, fontSize: '1.1rem', color: '#7a96b5' }} />
                          )}
                          <Typography sx={{ color: '#003366', fontWeight: 600, fontSize: '0.85rem', width: '200px' }}>
                            {group.name}
                          </Typography>

                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {group.deliveryPattern && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                                  Delivery Pattern:
                                </Typography>
                                <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                                  {group.deliveryPattern}
                                </Typography>
                              </Box>
                            )}
                            
                            {group.ageLimit && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                                  Age Limit:
                                </Typography>
                                <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                                  {group.ageLimit}
                                </Typography>
                              </Box>
                            )}

                            {group.downgrade && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                                  Downgrade:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography sx={{ fontSize: '0.9rem' }}>🦷</Typography>
                                  {typeof group.downgrade === 'string' && (
                                    <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                                      {group.downgrade}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              onClick={(e) => handleEditGroup(e, category.id, group)}
                              sx={{
                                color: '#003366',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton onClick={(e) => handleDeleteGroup(e, category.id, group.id)} size="small" sx={{ color: '#7a96b5' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Collapsible Nested Codes List */}
                        <Collapse in={isGroupExpanded}>
                          <Box sx={{ pl: 6, mt: 0.5, borderLeft: '1px dashed #cbd5e1', ml: 3, display: 'flex', flexDirection: 'column' }}>
                            {group.codes && group.codes.map((codeItem, cIdx) => (
                              <Box
                                key={cIdx}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  py: 1,
                                  borderBottom: '1px solid #f1f5f9',
                                  gap: 2
                                }}
                              >
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a3a6b', minWidth: 60 }}>
                                  {codeItem.code}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                                  {codeItem.desc}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          );
        })}
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
