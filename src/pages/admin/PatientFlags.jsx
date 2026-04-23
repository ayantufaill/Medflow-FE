import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Grid,
  IconButton,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { practiceInfoService } from '../../services/practice-info.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const PatientFlags = () => {
  const { showSnackbar } = useSnackbar();
  const primaryNavy = '#002855';

  const [practiceId, setPracticeId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [colorValue, setColorValue] = useState('#7cb342');

  const fetchPatientFlags = async () => {
    setLoading(true);
    try {
      const data = await practiceInfoService.getCurrentPracticeInfo();
      setPracticeId(data._id);
      setCategories(data.patientFlags || []);
    } catch (err) {
      console.error('Fetch error:', err);
      showSnackbar('Failed to load patient flags', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientFlags();
  }, []);

  const handleSaveAll = async (newCategories) => {
    if (!practiceId) return;
    setSaving(true);
    try {
      await practiceInfoService.updatePatientFlags(practiceId, newCategories);
      setCategories(newCategories);
      showSnackbar('Patient flags updated successfully', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showSnackbar('Failed to update patient flags', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Category Actions
  const handleAddCategory = () => {
    setEditItem(null);
    setInputValue('');
    setCatDialogOpen(true);
  };

  const handleEditCategory = (cat) => {
    setEditItem(cat);
    setInputValue(cat.name);
    setCatDialogOpen(true);
  };

  const handleDeleteCategory = (catId) => {
    if (!window.confirm('Are you sure you want to delete this category and all its flags?')) return;
    const newCategories = categories.filter(c => c.id !== catId);
    handleSaveAll(newCategories);
  };

  const handleSaveCategory = () => {
    const name = inputValue.trim();
    if (!name) return;

    let newCategories;
    if (editItem) {
      newCategories = categories.map(c => c.id === editItem.id ? { ...c, name } : c);
    } else {
      newCategories = [...categories, { id: Date.now().toString(), name, flags: [] }];
    }
    
    handleSaveAll(newCategories);
    setCatDialogOpen(false);
  };

  // Flag Actions
  const handleAddFlag = (cat) => {
    setCurrentCategory(cat);
    setEditItem(null);
    setInputValue('');
    setColorValue('#7cb342');
    setFlagDialogOpen(true);
  };

  const handleEditFlag = (cat, flag) => {
    setCurrentCategory(cat);
    setEditItem(flag);
    setInputValue(flag.name);
    setColorValue(flag.color);
    setFlagDialogOpen(true);
  };

  const handleDeleteFlag = (cat, flagId) => {
    if (!window.confirm('Are you sure you want to delete this flag?')) return;
    const newCategories = categories.map(c => {
      if (c.id === cat.id) {
        return { ...c, flags: c.flags.filter(f => f.id !== flagId) };
      }
      return c;
    });
    handleSaveAll(newCategories);
  };

  const handleSaveFlag = () => {
    const name = inputValue.trim();
    if (!name) return;

    const newCategories = categories.map(c => {
      if (c.id === currentCategory.id) {
        let newFlags;
        if (editItem) {
          newFlags = c.flags.map(f => f.id === editItem.id ? { ...f, name, color: colorValue } : f);
        } else {
          newFlags = [...c.flags, { id: Date.now().toString(), name, color: colorValue }];
        }
        return { ...c, flags: newFlags };
      }
      return c;
    });

    handleSaveAll(newCategories);
    setFlagDialogOpen(false);
  };

  const FlagRow = ({ color, name, onEdit, onDelete }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1, 
        mb: 0.5, 
        bgcolor: '#f8f9fa', 
        borderRadius: 1,
        width: 'fit-content',
        '&:hover': { bgcolor: '#f1f3f4' }
      }}
    >
      <Box sx={{ width: 16, height: 16, bgcolor: color, mr: 2, borderRadius: '2px', flexShrink: 0 }} />
      <Typography 
        variant="body2" 
        sx={{ 
          mr: 4, 
          color: '#333', 
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }}
      >
        {name}
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
        <IconButton size="small" onClick={onEdit} sx={{ p: 0.5 }}><EditIcon sx={{ fontSize: 16, color: '#1976d2' }} /></IconButton>
        <IconButton size="small" onClick={onDelete} sx={{ p: 0.5 }}><DeleteIcon sx={{ fontSize: 16, color: '#d32f2f' }} /></IconButton>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Box sx={{ p: 4, maxWidth: 1600, mx: 'auto' }}>
        {/* --- HEADER & BREADCRUMBS --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: '0.85rem' }}>
            <Link
                component={RouterLink}
                to="/admin/practice-setup"
                variant="body2"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 500 }}
                >
                Practice Setup
            </Link>
            <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Patient Flags</Typography>
          </Breadcrumbs>
          
          <Stack spacing={1} direction="row" alignItems="center" sx={{ mt: -0.5 }}>
            <Button 
              startIcon={loading ? <CircularProgress size={16} /> : <SyncIcon />} 
              onClick={fetchPatientFlags}
              disabled={loading}
              sx={{ textTransform: 'none', color: '#666', fontWeight: 600, fontSize: '0.8rem' }}
            >
              Sync
            </Button>
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddCategory}
              sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 600, fontSize: '0.8rem' }}
            >
              Add new category
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={24}>
            {categories.map((cat) => (
              <Grid item xs={12} md={5} key={cat.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem', mr: 2 }}>
                    {cat.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => handleEditCategory(cat)} sx={{ p: 0.5 }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteCategory(cat.id)} sx={{ p: 0.5 }}><DeleteIcon sx={{ fontSize: 14, color: '#d32f2f' }} /></IconButton>
                  </Stack>
                </Box>
                
                <Stack direction="row" spacing={2} sx={{ mb: 1.5, px: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, width: 40, color: '#333' }}>Color</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#333' }}>Name</Typography>
                </Stack>
                
                <Box>
                  {cat.flags.map((flag) => (
                    <FlagRow 
                      key={flag.id} 
                      color={flag.color} 
                      name={flag.name} 
                      onEdit={() => handleEditFlag(cat, flag)}
                      onDelete={() => handleDeleteFlag(cat, flag.id)}
                    />
                  ))}
                </Box>
                
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddFlag(cat)}
                  sx={{ textTransform: 'none', mt: 2, color: '#9e9e9e', fontWeight: 500 }} 
                  size="small"
                >
                  Add new flag
                </Button>
              </Grid>
            ))}

            {categories.length === 0 && (
              <Grid item xs={12}>
                <Typography align="center" color="textSecondary" sx={{ py: 10 }}>
                  No flag categories defined. Click "Add new category" to start.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Category Dialog */}
      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: primaryNavy }}>
          {editItem ? 'Edit Category' : 'New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCatDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained" sx={{ bgcolor: primaryNavy }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={flagDialogOpen} onClose={() => setFlagDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: primaryNavy }}>
          {editItem ? 'Edit Flag' : 'New Flag'} in {currentCategory?.name}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Flag Name"
              fullWidth
              variant="outlined"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Box>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>Select Color</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {['#7cb342', '#26a69a', '#5e35b1', '#d81b60', '#fb8c00', '#03a9f4', '#00ff00', '#d32f2f', '#002855'].map(color => (
                  <Box
                    key={color}
                    onClick={() => setColorValue(color)}
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: color,
                      cursor: 'pointer',
                      borderRadius: '4px',
                      outline: colorValue === color ? '2px solid #1976d2' : 'none',
                      outlineOffset: '2px',
                      '&:hover': { opacity: 0.8 }
                    }}
                  />
                ))}
                <input 
                  type="color" 
                  value={colorValue} 
                  onChange={(e) => setColorValue(e.target.value)}
                  style={{ width: 24, height: 24, padding: 0, border: 'none', cursor: 'pointer' }}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setFlagDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveFlag} variant="contained" sx={{ bgcolor: primaryNavy }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PatientFlags;
