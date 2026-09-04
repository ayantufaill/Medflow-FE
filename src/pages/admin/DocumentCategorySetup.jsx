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
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

import DocumentCategoryCard from '../../components/admin/practice-setup/document-category/DocumentCategoryCard';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import BaseDialog from '../../components/shared/BaseDialog';
import { defaultDocumentList, defaultCategoryList } from '../../constants/documentCategories';

import SaveConfigIcon from '../../assets/practicesetupicon/saveconfigurationicon.svg';
import CategoryIcon from '../../assets/practicesetupicon/categoryicon.svg';
import DocumentsIcon from '../../assets/practicesetupicon/documents.svg';

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
      const dbDocs = practiceInfo.documentCategories.documents || [];
      const dbCats = practiceInfo.documentCategories.categories || [];
      
      // If the DB only has the old dummy BOB(Breakdown of Benefit) repeated, or is empty, use the rich defaults
      const isDummyDocs = dbDocs.length === 0 || (dbDocs.length === 5 && dbDocs[0] === "BOB(Breakdown of Benefit)");
      const isDummyCats = dbCats.length === 0 || (dbCats.length === 5 && dbCats[0] === "BOB(Breakdown of Benefit)");

      setDocuments(isDummyDocs ? defaultDocumentList : dbDocs);
      setCategories(isDummyCats ? defaultCategoryList : dbCats);
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
            disableElevation
            onClick={handleSave}
            startIcon={<SaveIcon sx={{ fontSize: '16px' }} />}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              px: 3,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
            {`${inputDialog.mode === 'add' ? 'Add New' : 'Edit'} ${inputDialog.type === 'document' ? 'Document' : 'Category'}`}
          </Typography>
          <IconButton onClick={() => setInputDialog(prev => ({ ...prev, open: false }))} size="small" sx={{ color: '#64748b' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mb: '4px' }}>Name</Typography>
            <TextField
              autoFocus
              size="small"
              fullWidth
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
              sx={{ '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px', fontSize: '13px' } }}
            />
          </Box>
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
              color: '#64748b',
              borderColor: '#cbd5e1',
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              px: 3,
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmInput}
            variant="contained"
            sx={{
              bgcolor: '#2262EF',
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1a4fc4', boxShadow: 'none' },
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
