import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Checkbox, FormControlLabel, Snackbar, Popover, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SyncIcon from '@mui/icons-material/Sync';
import CopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChecklists,
  addChecklistCategory,
  addChecklist,
  addChecklistItem,
  addChoiceToChecklistItem,
  addProductToChecklistItem,
  updateChecklist,
  deleteChecklist,
  deleteChecklistItem,
  selectChecklists,
  selectLoadingChecklists
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';



const ChoiceIcon = () => (
  <Box sx={{ width: 12, height: 12, backgroundColor: '#f56565', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, mt: 0.5 }}>
    <Box sx={{ width: 6, height: 1.5, backgroundColor: 'white' }} />
  </Box>
);

const ChecklistIcon = ({ iconId, color = '#1a3a6b' }) => {
  const icons = {
    'syringe-h': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 7l4 4-4 4" />
        <path d="M10 11h12" />
        <rect x="2" y="8" width="8" height="6" rx="1" />
        <path d="M2 11h-1" />
      </svg>
    ),
    'syringe-v': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 10v12" />
        <path d="M7 18l4 4 4-4" />
        <rect x="8" y="2" width="6" height="8" rx="1" />
      </svg>
    ),
    'mask': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10c0-2 2-4 8-4s8 2 8 4-2 6-8 6-8-4-8-6z" />
        <path d="M4 10s-2 0-2 2v2" />
        <path d="M20 10s2 0 2 2v2" />
      </svg>
    ),
    'tooth-pulp': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 8c-1 0-2 1-2 2v4c0 1 1 2 2 2s2-1 2-2v-4c0-1-1-2-2-2z" fill="#f56565" stroke="none" />
      </svg>
    ),
    'tooth-fill': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 6h4v8h-4z" fill="#cbd5e0" stroke="none" />
      </svg>
    ),
    'tooth-prep': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 4v4M10 6h4" />
      </svg>
    ),
    'bonding': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    'bridge': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <rect x="2" y="12" width="4" height="6" />
        <rect x="18" y="12" width="4" height="6" />
        <rect x="10" y="12" width="4" height="6" />
      </svg>
    ),
    'post': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M8 6h8M8 18h8" />
      </svg>
    ),
    'instrument': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    ),
    'spray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 8c0-3 2-5 5-5s5 2 5 5-2 5-5 5M10 8v12M7 16h6" />
      </svg>
    ),
    'tray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
        <path d="M6 10h12" />
      </svg>
    ),
    'tooth-yellow': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#FDE047" stroke="none" />
      </svg>
    ),
    'tooth-pink': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#F472B6" stroke="none" />
      </svg>
    ),
    'tooth-blue': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#60A5FA" stroke="none" />
      </svg>
    ),
    'tooth-green': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#4ADE80" stroke="none" />
      </svg>
    ),
    'tooth-purple': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#C084FC" stroke="none" />
      </svg>
    ),
    'instrument-blue': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    ),
    'instrument-pink': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    )
  };

  return (
    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icons[iconId] || icons['tooth-prep']}
    </Box>
  );
};

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

  const renderItemTable = (items, category, checklistIdx) => (
    <Box sx={{ ml: 8, mr: 2, mb: 2, border: '1px solid #eef1f5', borderRadius: '4px', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', backgroundColor: '#f9fafb', py: 1, px: 2, borderBottom: '1px solid #eef1f5' }}>
        <Typography sx={{ width: 30, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>#</Typography>
        <Typography sx={{ flex: 2, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Item</Typography>
        <Typography sx={{ flex: 1.5, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Item Choices</Typography>
        <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Product</Typography>
        <Box sx={{ width: 100 }} />
      </Box>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', py: 1.5, px: 2, borderBottom: idx === items.length - 1 ? 'none' : '1px solid #f0f0f0', '&:hover': { backgroundColor: '#fcfdfe' } }}>
          <Typography sx={{ width: 30, fontSize: '0.8rem', color: '#666' }}>{item.id}-</Typography>
          <Typography sx={{ flex: 2, fontSize: '0.8rem', color: '#1a3a6b', pr: 2 }}>{item.text}</Typography>
          <Box sx={{ flex: 1.5 }}>
            {item.choices.map((choice, cIdx) => (
              <Box key={cIdx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <ChoiceIcon />
                <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>{choice}</Typography>
              </Box>
            ))}
            {activeInput?.type === 'choice' && activeInput.itemIdx === idx && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
              <Box sx={{ mt: 1 }}>
                <input
                  autoFocus
                  placeholder="Type and press Enter"
                  value={activeInput.value}
                  onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                  onKeyDown={handleInputSubmit}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    border: '1px solid #1a3a6b',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </Box>
            ) : (
              <Typography 
                onClick={() => setActiveInput({ type: 'choice', category, checklistIdx, itemIdx: idx, value: '' })}
                sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 500, cursor: 'pointer', mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                +Add choice
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {item.products && item.products.map((product, pIdx) => (
               <Typography key={pIdx} sx={{ fontSize: '0.75rem', color: '#333', mb: 0.5 }}>- {product}</Typography>
            ))}
            {activeInput?.type === 'product' && activeInput.itemIdx === idx && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
              <Box sx={{ mt: 1 }}>
                <input
                  autoFocus
                  placeholder="Type and press Enter"
                  value={activeInput.value}
                  onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                  onKeyDown={handleInputSubmit}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    border: '1px solid #1a3a6b',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </Box>
            ) : (
              <Typography 
                onClick={() => setActiveInput({ type: 'product', category, checklistIdx, itemIdx: idx, value: '' })}
                sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 500, cursor: 'pointer', mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                +Add Product
              </Typography>
            )}
          </Box>
          <Box sx={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
            <DeleteIcon 
              onClick={() => handleDeleteItem(category, checklistIdx, idx)}
              sx={{ color: '#f56565', fontSize: '1rem', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }} 
            />
            <CopyIcon 
              onClick={() => handleCopyItemToClipboard(item)}
              sx={{ color: '#666', fontSize: '1rem', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }} 
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ py: 1.5, px: 2 }}>
        {activeInput?.type === 'item' && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
          <Box sx={{ mb: 1 }}>
            <input
              autoFocus
              placeholder="Enter item text and press Enter"
              value={activeInput.value}
              onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
              onKeyDown={handleInputSubmit}
              onBlur={() => setActiveInput(null)}
              style={{
                width: '100%',
                padding: '6px 12px',
                fontSize: '0.8rem',
                border: '1px solid #1a3a6b',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </Box>
        ) : (
          <Typography 
            onClick={() => setActiveInput({ type: 'item', category, checklistIdx, value: '' })}
            sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            +Add Checklist Item
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderChecklistItem = (item, idx, category) => {
    const isExpanded = expandedChecklists.includes(item.name);
    return (
      <Box key={idx} sx={{ borderBottom: '1px solid #f0f0f0' }}>
        <Box 
          onClick={() => toggleChecklist(item.name)}
          sx={{ 
            pl: 4, 
            pr: 1, 
            py: 1, 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            backgroundColor: isExpanded ? '#f0f4f8' : 'transparent',
            '&:hover': { backgroundColor: isExpanded ? '#e6edf5' : '#f9fafb' },
            borderLeft: isExpanded ? '4px solid #1a3a6b' : '4px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
             {isExpanded ? (
                <KeyboardArrowDownIcon sx={{ color: '#1a3a6b', fontSize: '1.2rem' }} />
             ) : (
                <ChevronRightIcon sx={{ color: '#1a3a6b', fontSize: '1.2rem' }} />
             )}
             <Box 
               onClick={(e) => {
                 e.stopPropagation();
                 handleIconClick(e, category, idx);
               }}
               sx={{ 
                 cursor: 'pointer', 
                 p: 0.5, 
                 borderRadius: '4px',
                 '&:hover': { backgroundColor: '#eef1f5' } 
               }}
             >
               <ChecklistIcon iconId={item.iconId} />
             </Box>
            <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500, flex: 1, ml: 1 }}>
              {item.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 160 }}>
              <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>Short Name:</Typography>
              <Typography sx={{ color: '#333', fontSize: '0.8rem', fontWeight: 500 }}>{item.shortName}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 380 }}>
              <FormControlLabel
                onClick={(e) => e.stopPropagation()}
                control={
                  <Checkbox 
                    size="small" 
                    checked={item.isTreatment} 
                    onChange={(e) => handleToggleChecklistField(category, idx, 'isTreatment', e.target.checked)}
                    sx={{ p: 0.5, color: '#999', '&.Mui-checked': { color: '#1a3a6b' } }} 
                  />
                }
                label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Treatment Checklist</Typography>}
              />
              <FormControlLabel
                onClick={(e) => e.stopPropagation()}
                control={
                  <Checkbox 
                    size="small" 
                    checked={item.isHygiene} 
                    onChange={(e) => handleToggleChecklistField(category, idx, 'isHygiene', e.target.checked)}
                    sx={{ p: 0.5, color: '#999', '&.Mui-checked': { color: '#1a3a6b' } }} 
                  />
                }
                label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Hygiene Checklist</Typography>}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} onClick={(e) => e.stopPropagation()}>
              <CopyIcon 
                onClick={() => handleCopyChecklistToClipboard(item)}
                sx={{ color: '#666', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} 
              />
              <SettingsIcon sx={{ color: '#666', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} />
              <DeleteIcon 
                onClick={() => handleDeleteChecklist(category, idx)}
                sx={{ color: '#666', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { color: '#d32f2f' } }} 
              />
            </Box>
          </Box>
        </Box>
        {isExpanded && item.items && item.items.length > 0 && renderItemTable(item.items, category, idx)}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Checklists
        </Typography>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, mb: 3 }}>
        <Box 
          onClick={handleOpenSyncDialog}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            color: '#1a3a6b', 
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <SyncIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Sync</Typography>
        </Box>
        {activeInput?.type === 'category' ? (
          <Box sx={{ mb: 1, width: 250 }}>
            <input
              autoFocus
              placeholder="Enter category name and press Enter"
              value={activeInput.value}
              onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
              onKeyDown={handleInputSubmit}
              onBlur={() => setActiveInput(null)}
              style={{
                width: '100%',
                padding: '6px 12px',
                fontSize: '0.85rem',
                border: '1px solid #1a3a6b',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </Box>
        ) : (
          <Typography 
            onClick={() => setActiveInput({ type: 'category', value: '' })}
            sx={{ 
              color: '#1a3a6b', 
              fontSize: '0.85rem', 
              fontWeight: 500, 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            + Add Checklist Category
          </Typography>
        )}
      </Box>

      {/* Categories List */}
      <Box sx={{ borderTop: '1px solid #eef1f5' }}>
        {Object.keys(checklists).map((category, idx) => (
          <Box key={idx}>
            <Box 
              onClick={() => toggleCategory(category)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 1.5, 
                px: 1,
                cursor: 'pointer',
                backgroundColor: expandedCategories.includes(category) ? '#fff' : 'transparent',
                '&:hover': { backgroundColor: '#f9fafb' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                {expandedCategories.includes(category) ? (
                   <KeyboardArrowDownIcon sx={{ color: '#1a3a6b', fontSize: '1.4rem' }} />
                ) : (
                   <ChevronRightIcon sx={{ color: '#1a3a6b', fontSize: '1.4rem' }} />
                )}
                <Typography sx={{ color: '#1a3a6b', fontSize: '0.9rem', fontWeight: 600 }}>
                  {category}
                </Typography>
              </Box>
            </Box>
            
            {expandedCategories.includes(category) && (
              <Box>
                {checklists[category].map((item, itemIdx) => renderChecklistItem(item, itemIdx, category))}
                <Box sx={{ pl: 5, py: 2 }}>
                  {activeInput?.type === 'checklist' && activeInput.category === category ? (
                    <Box sx={{ mb: 1, maxWidth: 300 }}>
                      <input
                        autoFocus
                        placeholder="Enter checklist name and press Enter"
                        value={activeInput.value}
                        onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                        onKeyDown={handleInputSubmit}
                        onBlur={() => setActiveInput(null)}
                        style={{
                          width: '100%',
                          padding: '6px 12px',
                          fontSize: '0.85rem',
                          border: '1px solid #1a3a6b',
                          borderRadius: '4px',
                          outline: 'none'
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography 
                      onClick={() => setActiveInput({ type: 'checklist', category, value: '' })}
                      sx={{ 
                        color: '#1a3a6b', 
                        fontSize: '0.85rem', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      + Add Checklist
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            <Divider sx={{ borderColor: '#eef1f5' }} />
          </Box>
        ))}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: { backgroundColor: '#1a3a6b' }
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
            p: 2, 
            width: 400, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px solid #eef1f5'
          }
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1.5 }}>
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
                p: 1, 
                cursor: 'pointer', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': { 
                  backgroundColor: '#f0f4f8',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ChecklistIcon iconId={iconId} />
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={handleCloseSyncDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0c345d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 2,
            px: 3,
            lineHeight: 1.3,
          }}
        >
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Source Office:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="thedentalstudio"
              disabled
              sx={{
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Target Offices
            </Typography>
            {/* Placeholder for Target Offices list - matching Products page */}
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseSyncDialog}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#d0d0d0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseSyncDialog}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#6b8fb9',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#5a7ca8' }
            }}
          >
            Sync
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChecklistsManagement;
