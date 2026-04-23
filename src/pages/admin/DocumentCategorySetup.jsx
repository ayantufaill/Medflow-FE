import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { practiceInfoService } from '../../services/practice-info.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const DocumentCategorySetup = () => {
  const { showSnackbar } = useSnackbar();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [practiceInfoId, setPracticeInfoId] = useState(null);

  // Dialog State
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState('document'); // 'document' or 'category'
  const [inputValue, setInputValue] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await practiceInfoService.getCurrentPracticeInfo();
      if (data) {
        const id = data._id || data.id;
        setPracticeInfoId(id);
        const config = data.documentCategories || {};
        setDocuments(config.documents || []);
        setCategories(config.categories || []);
      } else {
        showSnackbar('Practice information not found. Please set up practice info first.', 'warning');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showSnackbar('Failed to load document categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedDocs, updatedCats) => {
    if (!practiceInfoId) {
      showSnackbar('No practice information found. Please refresh.', 'error');
      return false;
    }

    setSaving(true);
    try {
      setDocuments(updatedDocs);
      setCategories(updatedCats);

      await practiceInfoService.updateDocumentCategories(practiceInfoId, {
        documents: updatedDocs,
        categories: updatedCats
      });
      
      showSnackbar('Settings updated successfully', 'success');
      return true;
    } catch (err) {
      console.error('Update failed:', err);
      showSnackbar('Failed to update settings. Please try again.', 'error');
      fetchData(); 
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddClick = (type) => {
    setDialogType(type);
    setInputValue('');
    setEditItem(null);
    setOpen(true);
  };

  const handleEditClick = (type, name) => {
    setDialogType(type);
    setInputValue(name);
    setEditItem({ type, name });
    setOpen(true);
  };

  const handleSaveItem = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    
    let updatedDocs = [...documents];
    let updatedCats = [...categories];

    if (editItem) {
      // Edit existing item
      if (dialogType === 'document') {
        if (updatedDocs.includes(trimmedValue) && trimmedValue !== editItem.name) {
          showSnackbar('This document already exists', 'warning');
          return;
        }
        updatedDocs = updatedDocs.map(item => item === editItem.name ? trimmedValue : item);
      } else {
        if (updatedCats.includes(trimmedValue) && trimmedValue !== editItem.name) {
          showSnackbar('This category already exists', 'warning');
          return;
        }
        updatedCats = updatedCats.map(item => item === editItem.name ? trimmedValue : item);
      }
    } else {
      // Add new item
      if (dialogType === 'document') {
        if (updatedDocs.includes(trimmedValue)) {
          showSnackbar('This document already exists', 'warning');
          return;
        }
        updatedDocs.push(trimmedValue);
      } else {
        if (updatedCats.includes(trimmedValue)) {
          showSnackbar('This category already exists', 'warning');
          return;
        }
        updatedCats.push(trimmedValue);
      }
    }

    const success = await handleUpdate(updatedDocs, updatedCats);
    if (success) {
      setOpen(false);
      setInputValue('');
      setEditItem(null);
    }
  };

  const handleDelete = async (type, itemToDelete) => {
    let updatedDocs = [...documents];
    let updatedCats = [...categories];

    if (type === 'document') {
      updatedDocs = updatedDocs.filter(item => item !== itemToDelete);
    } else {
      updatedCats = updatedCats.filter(item => item !== itemToDelete);
    }

    await handleUpdate(updatedDocs, updatedCats);
  };

  const TableRowItem = ({ name, type }) => (
    <TableRow sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
      <TableCell sx={{ py: 0.5, borderBottom: '1px solid #f0f0f0', color: '#444' }}>
        {name}
      </TableCell>
      <TableCell align="right" sx={{ py: 0.5, borderBottom: '1px solid #f0f0f0' }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton size="small" sx={{ color: '#1976d2' }} onClick={() => handleEditClick(type, name)}>
            <EditNoteIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: '#ff8a80' }}
            onClick={() => handleDelete(type, name)}
            disabled={saving}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#bdbdbd' }} />} 
        sx={{ mb: 4, fontSize: '0.85rem' }}
      >
        <Link 
          component={RouterLink} 
          to="/admin/practice-setup" 
          sx={{ color: '#9e9e9e', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Practice Setup
        </Link>
        <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>Document Category Setup</Typography>
      </Breadcrumbs>

      <Box sx={{ maxWidth: 800 }}>
        {/* Documents Section */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#555' }}>
          Documents
        </Typography>
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableBody>
              {documents.map((item, index) => <TableRowItem key={index} name={item} type="document" />)}
            </TableBody>
          </Table>
        </TableContainer>
        <Link 
          component="button" 
          variant="body2" 
          onClick={() => handleAddClick('document')}
          sx={{ display: 'flex', alignItems: 'center', mb: 6, color: '#9e9e9e', textDecoration: 'none', cursor: 'pointer' }}
        >
          <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add new item
        </Link>

        {/* Category Section */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#555' }}>
          Category
        </Typography>
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableBody>
              {categories.map((item, index) => <TableRowItem key={index} name={item} type="category" />)}
            </TableBody>
          </Table>
        </TableContainer>
        <Link 
          component="button" 
          variant="body2" 
          onClick={() => handleAddClick('category')}
          sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#9e9e9e', textDecoration: 'none', cursor: 'pointer' }}
        >
          <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add new item
        </Link>
      </Box>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editItem ? `Edit ${dialogType === 'document' ? 'Document' : 'Category'}` : `Add New ${dialogType === 'document' ? 'Document' : 'Category'}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveItem()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleSaveItem} 
            variant="contained" 
            disabled={saving || !inputValue.trim()}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : (editItem ? 'Save Changes' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentCategorySetup;
