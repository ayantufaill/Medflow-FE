import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Snackbar,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import syncSvg from '../../assets/claimicons/refreshicon.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';
import {
  fetchChecklists,
  addChecklistCategory,
  addChecklist,
  addChecklistItem,
  addChoiceToChecklistItem,
  addProductToChecklistItem,
  updateChecklist,
  deleteChecklistCategory,
  deleteChecklist,
  deleteChecklistItem,
  removeChoiceFromChecklistItem,
  removeProductFromChecklistItem,
  selectChecklists,
  selectLoadingChecklists
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';

import { ChecklistIcon } from '../../components/admin/clinical-management/checklists/ChecklistIcons';
import ChecklistCategoryList from '../../components/admin/clinical-management/checklists/ChecklistCategoryList';

const ChecklistsManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const checklists = useSelector(selectChecklists);
  const loading = useSelector(selectLoadingChecklists);

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedChecklists, setExpandedChecklists] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // { type, category, checklistIdx, itemIdx, value }
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [iconPickerAnchor, setIconPickerAnchor] = useState(null);
  const [activeIconPicker, setActiveIconPicker] = useState(null); // { category, checklistIdx }
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChecklists());
  }, [dispatch]);

  useEffect(() => {
    if (checklists && Object.keys(checklists).length > 0 && expandedCategories.length === 0) {
      setExpandedCategories([Object.keys(checklists)[0]]);
    }
  }, [checklists]);

  const handleOpenSyncDialog = (e) => {
    e.stopPropagation();
    setSyncDialogOpen(true);
  };

  const handleCloseSyncDialog = () => {
    setSyncDialogOpen(false);
  };

  const handleIconClick = (event, category, checklistIdx) => {
    setIconPickerAnchor(event.currentTarget);
    setActiveIconPicker({ category, checklistIdx });
  };

  const handleIconSelect = async (iconId) => {
    if (activeIconPicker) {
      const { category, checklistIdx } = activeIconPicker;
      const checklist = checklists[category][checklistIdx];
      try {
        await dispatch(updateChecklist({
          checklistId: checklist.id,
          updates: { iconId }
        })).unwrap();
        dispatch(fetchChecklists());
        showSnackbar('Icon updated successfully', 'success');
      } catch (err) {
        console.error(err);
        showSnackbar('Failed to update icon', 'error');
      }
    }
    setIconPickerAnchor(null);
    setActiveIconPicker(null);
  };

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleChecklist = (name) => {
    setExpandedChecklists(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleToggleChecklistField = async (category, checklistIdx, field, value) => {
    const checklist = checklists[category][checklistIdx];
    try {
      await dispatch(updateChecklist({
        checklistId: checklist.id,
        updates: { [field]: value }
      })).unwrap();
      dispatch(fetchChecklists());
      showSnackbar('Checklist updated successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to update checklist', 'error');
    }
  };

  const handleInputSubmit = async (e) => {
    if (e.key === 'Enter' && activeInput.value.trim()) {
      const { type, category, checklistIdx, itemIdx, value } = activeInput;
      
      if (type === 'choice') {
        const item = checklists[category][checklistIdx].items[itemIdx];
        try {
          await dispatch(addChoiceToChecklistItem({ itemId: item.id, choice: value })).unwrap();
          dispatch(fetchChecklists());
          showSnackbar('Choice added successfully', 'success');
        } catch (err) {
          console.error(err);
          showSnackbar('Failed to add choice', 'error');
        }
      } else if (type === 'product') {
        const item = checklists[category][checklistIdx].items[itemIdx];
        try {
          await dispatch(addProductToChecklistItem({ itemId: item.id, product: value })).unwrap();
          dispatch(fetchChecklists());
          showSnackbar('Product added successfully', 'success');
        } catch (err) {
          console.error(err);
          showSnackbar('Failed to add product', 'error');
        }
      } else if (type === 'item') {
        const checklist = checklists[category][checklistIdx];
        try {
          await dispatch(addChecklistItem({
            checklistId: checklist.id,
            itemData: {
              text: value,
              choices: [],
              products: []
            }
          })).unwrap();
          dispatch(fetchChecklists());
          showSnackbar('Item added successfully', 'success');
        } catch (err) {
          console.error(err);
          showSnackbar('Failed to add item', 'error');
        }
      } else if (type === 'checklist') {
        try {
          await dispatch(addChecklist({
            categoryName: category,
            checklistData: {
              name: value,
              shortName: value,
              isTreatment: true,
              isHygiene: false,
              iconId: 'tooth-prep'
            }
          })).unwrap();
          dispatch(fetchChecklists());
          showSnackbar('Checklist created successfully', 'success');
        } catch (err) {
          console.error(err);
          showSnackbar('Failed to create checklist', 'error');
        }
      } else if (type === 'category') {
        try {
          await dispatch(addChecklistCategory(value)).unwrap();
          dispatch(fetchChecklists());
          setExpandedCategories(prev => [...prev, value]);
          showSnackbar('Category created successfully', 'success');
        } catch (err) {
          console.error(err);
          showSnackbar('Failed to create category', 'error');
        }
      }

      setActiveInput(null);
    } else if (e.key === 'Escape') {
      setActiveInput(null);
    }
  };

  const handleCopyItemToClipboard = (item) => {
    let textToCopy = `${item.text}`;
    if (item.choices && item.choices.length > 0) {
      textToCopy += `\nChoices: ${item.choices.join(', ')}`;
    }
    if (item.products && item.products.length > 0) {
      textToCopy += `\nProducts: ${item.products.join(', ')}`;
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => setSnackbarOpen(true))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleCopyChecklistToClipboard = (item) => {
    let textToCopy = `Checklist: ${item.name}\nShort Name: ${item.shortName}`;
    if (item.items && item.items.length > 0) {
      textToCopy += '\n\nItems:';
      item.items.forEach(i => {
        textToCopy += `\n- ${i.text}`;
        if (i.choices.length > 0) textToCopy += ` (Choices: ${i.choices.join(', ')})`;
      });
    }

    navigator.clipboard.writeText(textToCopy)
      .then(() => setSnackbarOpen(true))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleDeleteItem = async (category, checklistIdx, itemIdx) => {
    const item = checklists[category][checklistIdx].items[itemIdx];
    try {
      await dispatch(deleteChecklistItem(item.id)).unwrap();
      dispatch(fetchChecklists());
      showSnackbar('Item deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to delete item', 'error');
    }
  };

  const handleRemoveChoice = async (category, checklistIdx, itemIdx, choiceIdx) => {
    const item = checklists[category][checklistIdx].items[itemIdx];
    try {
      await dispatch(removeChoiceFromChecklistItem({ itemId: item.id, choiceIndex: choiceIdx })).unwrap();
      dispatch(fetchChecklists());
      showSnackbar('Choice removed successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to remove choice', 'error');
    }
  };

  const handleRemoveProduct = async (category, checklistIdx, itemIdx, productIdx) => {
    const item = checklists[category][checklistIdx].items[itemIdx];
    try {
      await dispatch(removeProductFromChecklistItem({ itemId: item.id, productIndex: productIdx })).unwrap();
      dispatch(fetchChecklists());
      showSnackbar('Product removed successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to remove product', 'error');
    }
  };

  const handleDeleteChecklist = async (category, checklistIdx) => {
    const checklist = checklists[category][checklistIdx];
    try {
      await dispatch(deleteChecklist(checklist.id)).unwrap();
      dispatch(fetchChecklists());
      showSnackbar('Checklist deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to delete checklist', 'error');
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      await dispatch(deleteChecklistCategory(categoryName)).unwrap();
      showSnackbar('Category deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to delete category', 'error');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header and Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, pt: 4, mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Checklists Management
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<img src={syncSvg} alt="Sync" style={{ width: 16, height: 16 }} />}
              size="small"
              variant="outlined"
              onClick={handleOpenSyncDialog}
              sx={{
                textTransform: 'none',
                color: '#1e293b',
                borderColor: '#e2e8f0',
                fontWeight: 600,
                borderRadius: 2,
                height: 36,
                px: 2,
                '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
              }}
            >
              Sync
            </Button>
          {activeInput?.type === 'category' ? (
            <TextField
              autoFocus
              size="small"
              placeholder="Enter category name and press Enter"
              value={activeInput.value}
              onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
              onKeyDown={handleInputSubmit}
              onBlur={() => setActiveInput(null)}
              sx={{
                width: 320,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  backgroundColor: '#fff',
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1.1, px: 2 },
              }}
            />
          ) : (
            <Button
              variant="contained"
              disableElevation
              onClick={() => setActiveInput({ type: 'category', value: '' })}
              sx={{
                textTransform: 'none',
                borderRadius: radius.md,
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.semibold,
                backgroundColor: COLORS.ACCENT,
                color: COLORS.WHITE,
                px: 3,
                py: 0.8,
                '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
              }}
            >
              + Add Checklist Category
            </Button>
          )}

        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ px: 4 }}>

        {/* Categories List */}
        <ChecklistCategoryList 
          checklists={checklists}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          expandedChecklists={expandedChecklists}
          toggleChecklist={toggleChecklist}
          handleIconClick={handleIconClick}
          handleToggleChecklistField={handleToggleChecklistField}
          handleCopyChecklistToClipboard={handleCopyChecklistToClipboard}
          handleDeleteChecklist={handleDeleteChecklist}
          handleDeleteCategory={handleDeleteCategory}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
          handleInputSubmit={handleInputSubmit}
          handleDeleteItem={handleDeleteItem}
          handleCopyItemToClipboard={handleCopyItemToClipboard}
          handleRemoveChoice={handleRemoveChoice}
          handleRemoveProduct={handleRemoveProduct}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: { backgroundColor: '#1e293b', color: '#fff', fontWeight: 600, borderRadius: '8px' }
        }}
      />

      <Popover
        open={Boolean(iconPickerAnchor)}
        anchorEl={iconPickerAnchor}
        onClose={() => setIconPickerAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: { 
            width: 380, 
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ backgroundColor: '#f8fafc', py: 1.5, px: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
            Select Icon
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.5, p: 2, backgroundColor: '#fff' }}>
          {[
            'syringe-h', 'syringe-v', 'mask', 'tooth-pulp', 'tooth-fill', 'tooth-prep', 
            'bonding', 'instrument', 'post', 'bridge', 'tray', 'spray',
            'tooth-yellow', 'tooth-pink', 'tooth-blue', 'tooth-green', 'tooth-purple',
            'instrument-blue', 'instrument-pink'
          ].map((iconId) => (
            <Box 
              key={iconId}
              onClick={() => handleIconSelect(iconId)}
              sx={{ 
                p: 1.5, 
                cursor: 'pointer', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': { 
                  backgroundColor: '#f1f5f9',
                  transform: 'scale(1.15)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }
              }}
            >
              <ChecklistIcon iconId={iconId} />
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Sync Dialog */}
      <SyncOfficesDialog open={isSyncDialogOpen} onClose={handleCloseSyncDialog} />
    </Box>
  );
};

export default ChecklistsManagement;
