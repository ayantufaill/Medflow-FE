import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentPracticeInfo,
  createPracticeInfo,
  updateDocumentCategories,
  selectPracticeInfo,
} from '../../store/slices/practiceInfoSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';

import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import DocumentCategoryCard from '../../components/admin/practice-setup/document-category/DocumentCategoryCard';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import BaseDialog from '../../components/shared/BaseDialog';

import SaveConfigIcon from '../../assets/practicesetupicon/saveconfigurationicon.svg';
import CategoryIcon from '../../assets/practicesetupicon/categoryicon.svg';
import DocumentsIcon from '../../assets/practicesetupicon/documents.svg';

const defaultDocumentList = [
  "BOB(Breakdown of Benefit)", "BOB(Breakdown of Benefit)", "BOB(Breakdown of Benefit)",
  "BOB(Breakdown of Benefit)", "BOB(Breakdown of Benefit)"
];

const defaultCategoryList = [
  "BOB(Breakdown of Benefit)", "BOB(Breakdown of Benefit)", "BOB(Breakdown of Benefit)",
  "BOB(Breakdown of Benefit)", "BOB(Breakdown of Benefit)"
];

const DocumentCategorySetup = () => {
  const [documents, setDocuments] = useState(defaultDocumentList);
  const [categories, setCategories] = useState(defaultCategoryList);
  const { showSnackbar } = useSnackbar();
  
  const practiceInfo = useSelector(selectPracticeInfo);
  const dispatch = useDispatch();

  // Dialog States
  const [inputDialog, setInputDialog] = useState({
    open: false,
    mode: 'add',
    type: 'document',
    index: null,
    value: '',
    error: ''
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: 'document',
    index: null,
    itemName: ''
  });

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  useEffect(() => {
    if (practiceInfo?.documentCategories) {
      setDocuments(practiceInfo.documentCategories.documents || defaultDocumentList);
      setCategories(practiceInfo.documentCategories.categories || defaultCategoryList);
    }
  }, [practiceInfo?.documentCategories]);

  const handleSave = async () => {
    try {
      let id = practiceInfo?._id || practiceInfo?.id;
      if (!id) {
        const newPractice = await dispatch(createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: { line1: '123 St', city: 'Metropolis', state: 'NY', postalCode: '10001', country: 'US' }
        })).unwrap();
        id = newPractice._id || newPractice.id;
      }
      
      await dispatch(updateDocumentCategories({
        practiceInfoId: id,
        documentCategoriesData: { documents, categories }
      })).unwrap();
      showSnackbar('Document Categories saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to save configuration', 'error');
    }
  };

  const handleAddItem = (type) => {
    setInputDialog({
      open: true,
      mode: 'add',
      type,
      index: null,
      value: '',
      error: ''
    });
  };

  const handleEditItem = (type, index, oldName) => {
    setInputDialog({
      open: true,
      mode: 'edit',
      type,
      index,
      value: oldName,
      error: ''
    });
  };

  const handleDeleteItem = (type, index) => {
    const itemName = type === 'document' ? documents[index] : categories[index];
    setDeleteDialog({
      open: true,
      type,
      index,
      itemName
    });
  };

  const handleConfirmInput = () => {
    const { mode, type, index, value } = inputDialog;
    if (!value.trim()) {
      setInputDialog(prev => ({ ...prev, error: 'Name is required' }));
      return;
    }

    if (mode === 'add') {
      if (type === 'document') setDocuments(prev => [...prev, value.trim()]);
      else setCategories(prev => [...prev, value.trim()]);
    } else if (mode === 'edit') {
      if (type === 'document') {
        const newDocs = [...documents];
        newDocs[index] = value.trim();
        setDocuments(newDocs);
      } else {
        const newCats = [...categories];
        newCats[index] = value.trim();
        setCategories(newCats);
      }
    }
    
    setInputDialog({ open: false, mode: 'add', type: 'document', index: null, value: '', error: '' });
  };

  const handleConfirmDelete = () => {
    const { type, index } = deleteDialog;
    if (type === 'document') {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    } else {
      setCategories(prev => prev.filter((_, i) => i !== index));
    }
    setDeleteDialog({ open: false, type: 'document', index: null, itemName: '' });
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: '#FBFCFE',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          p: { xs: 3, sm: 4 },
        }}
      >
      {/* --- HEADER SECTION --- */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#11223F">
          Document Category
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSave}
          sx={{ borderRadius: 1.5, textTransform: 'none', px: 2, py: 1 }}
          startIcon={<img src={SaveConfigIcon} alt="Save" style={{ width: 16, height: 16 }} />}
        >
          Save Configuration
        </Button>
      </Box>

      {/* --- CONTENT SECTION --- */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* DOCUMENTS */}
        <Box sx={{ width: { xs: '100%', md: '564px' } }}>
           <DocumentCategoryCard
              title="DOCUMENTS"
              icon={DocumentsIcon}
              items={documents}
              type="document"
              onAdd={handleAddItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
           />
        </Box>
        {/* CATEGORY */}
        <Box sx={{ width: { xs: '100%', md: '564px' } }}>
           <DocumentCategoryCard
              title="CATEGORY"
              icon={CategoryIcon}
              items={categories}
              type="category"
              onAdd={handleAddItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
           />
        </Box>
      </Box>

      </Box>

      {/* --- INPUT DIALOG (ADD/EDIT) --- */}
      <Dialog
        open={inputDialog.open}
        onClose={() => setInputDialog(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 10000 }}
        PaperProps={{ sx: { borderRadius: '12px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#F1F5FD',
            color: '#111',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <img src={inputDialog.type === 'document' ? DocumentsIcon : CategoryIcon} alt="Icon" style={{ width: 20, height: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>
                {`${inputDialog.mode === 'add' ? 'Add New' : 'Edit'} ${inputDialog.type === 'document' ? 'Document' : 'Category'}`}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: '#6B7280' }}>
                Enter the details below
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setInputDialog(prev => ({ ...prev, open: false }))} sx={{ color: '#6B7280' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={inputDialog.value}
            onChange={(e) => setInputDialog(prev => ({ ...prev, value: e.target.value, error: '' }))}
            error={!!inputDialog.error}
            helperText={inputDialog.error}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirmInput();
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          backgroundColor: '#F9FAFB', 
          borderTop: '1px solid #E5E7EB', 
          gap: 1.5,
          justifyContent: 'flex-end'
        }}>
          <Button 
            onClick={() => setInputDialog(prev => ({ ...prev, open: false }))}
            variant="outlined"
            sx={{ 
              borderColor: '#D1D5DB', 
              color: '#374151',
              backgroundColor: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              px: 2,
              '&:hover': {
                backgroundColor: '#F3F4F6',
                borderColor: '#D1D5DB'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmInput}
            variant="contained"
            sx={{ 
              backgroundColor: '#2563EB', 
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              px: 2.5,
              boxShadow: 'none',
              '&:hover': { 
                backgroundColor: '#1D4ED8',
                boxShadow: 'none'
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
        onCancel={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteDialog.type === 'document' ? 'Document' : 'Category'}`}
        message={`Are you sure you want to delete "${deleteDialog.itemName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />

    </Box>
  );
};

export default DocumentCategorySetup;
