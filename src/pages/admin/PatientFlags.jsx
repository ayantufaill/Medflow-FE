import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { practiceInfoService } from '../../services/practice-info.service';
import { useSnackbar } from '../../contexts/SnackbarContext';
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
  TextField
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const defaultFlags = [
  { id: '1', category: 'Patient Communication', name: 'Send appointment reminder earlier than scheduled time', color: '#7cb342' },
  { id: '2', category: 'Billing', name: 'alert', color: '#26a69a' },
  { id: '3', category: 'Billing', name: 'old patient', color: '#5e35b1' },
  { id: '4', category: 'Billing', name: 'family & friends', color: '#d81b60' },
  { id: '5', category: 'Billing', name: 'late payment', color: '#fb8c00' },
  { id: '6', category: 'Billing', name: 'needs special care', color: '#03a9f4' },
  { id: '7', category: 'Billing', name: 'TDS Member', color: '#00ff00' },
];

const PatientFlags = () => {
  const [practiceInfoId, setPracticeInfoId] = useState(null);
  const [flags, setFlags] = useState(defaultFlags);
  const { showSnackbar } = useSnackbar();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(''); // 'addCategory', 'addFlag', 'editFlag'
  const [activeCategory, setActiveCategory] = useState('');
  const [editFlagId, setEditFlagId] = useState(null);
  const [formData, setFormData] = useState({ categoryName: '', name: '', color: '#1976d2' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const practiceInfo = await practiceInfoService.getCurrentPracticeInfo();
        if (practiceInfo) {
          setPracticeInfoId(practiceInfo._id || practiceInfo.id);
          if (practiceInfo.patientFlags && practiceInfo.patientFlags.length > 0) {
            setFlags(practiceInfo.patientFlags);
          }
        }
      } catch (error) {
        console.error('Failed to fetch practice info:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      let id = practiceInfoId;
      if (!id) {
        const newPractice = await practiceInfoService.createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: { line1: '123 St', city: 'Metropolis', state: 'NY', postalCode: '10001', country: 'US' }
        });
        id = newPractice._id || newPractice.id;
        setPracticeInfoId(id);
      }
      
      await practiceInfoService.updatePatientFlags(id, flags);
      showSnackbar('Patient Flags saved successfully', 'success');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to save flags';
      showSnackbar(errMsg, 'error');
    }
  };

  const openAddCategoryDialog = () => {
    setDialogMode('addCategory');
    setFormData({ categoryName: '', name: '', color: '#1976d2' });
    setDialogOpen(true);
  };

  const openAddFlagDialog = (category) => {
    setActiveCategory(category);
    setDialogMode('addFlag');
    setFormData({ categoryName: '', name: '', color: '#1976d2' });
    setDialogOpen(true);
  };

  const openEditFlagDialog = (flag) => {
    setEditFlagId(flag.id);
    setDialogMode('editFlag');
    setFormData({ categoryName: '', name: flag.name, color: flag.color });
    setDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (!formData.name || !formData.color) return;

    if (dialogMode === 'addCategory') {
      if (!formData.categoryName) return;
      setFlags(prev => [...prev, { id: Date.now().toString(), category: formData.categoryName, name: formData.name, color: formData.color }]);
    } else if (dialogMode === 'addFlag') {
      setFlags(prev => [...prev, { id: Date.now().toString(), category: activeCategory, name: formData.name, color: formData.color }]);
    } else if (dialogMode === 'editFlag') {
      setFlags(prev => prev.map(f => f.id === editFlagId ? { ...f, name: formData.name, color: formData.color } : f));
    }
    
    setDialogOpen(false);
  };

  const handleDeleteFlag = (id) => {
    if (!window.confirm(`Are you sure you want to delete this flag?`)) return;
    setFlags(prev => prev.filter(f => f.id !== id));
  };

  const primaryNavy = '#002855';

  const FlagRow = ({ flag }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1, 
        mb: 0.5, 
        bgcolor: '#f8f9fa', 
        borderRadius: 1,
        '&:hover': { bgcolor: '#f1f3f4' }
      }}
    >
      <Box sx={{ width: 16, height: 16, bgcolor: flag.color, mr: 2, borderRadius: '2px' }} />
      <Typography variant="body2" sx={{ flexGrow: 1, color: '#333' }}>{flag.name}</Typography>
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" onClick={() => openEditFlagDialog(flag)}>
          <EditIcon sx={{ fontSize: 16, color: '#1976d2' }} />
        </IconButton>
        <IconButton size="small" onClick={() => handleDeleteFlag(flag.id)}>
          <DeleteIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
        </IconButton>
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
            <Button startIcon={<SyncIcon />} sx={{ textTransform: 'none', color: '#666', fontWeight: 600, fontSize: '0.8rem' }}>Sync</Button>
            <Button startIcon={<AddIcon />} onClick={openAddCategoryDialog} sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 600, fontSize: '0.8rem' }}>Add new category</Button>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: 5, textTransform: 'none', px: 3, ml: 2 }}
            >
              Save Configuration
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {[...new Set(flags.map(f => f.category))].map(category => (
            <Grid item xs={12} md={5} key={category}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>{category}</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 1.5, px: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, width: 40, color: '#333' }}>Color</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#333' }}>Name</Typography>
              </Stack>
              {flags.filter(f => f.category === category).map(flag => (
                <FlagRow key={flag.id} flag={flag} />
              ))}
              <Button startIcon={<AddIcon />} onClick={() => openAddFlagDialog(category)} sx={{ textTransform: 'none', mt: 2, color: '#9e9e9e', fontWeight: 500 }} size="small">
                Add new flag
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* --- DIALOG FOR ADDING/EDITING --- */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogMode === 'addCategory' ? 'Add New Category & Flag' : dialogMode === 'addFlag' ? 'Add New Flag' : 'Edit Flag'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {dialogMode === 'addCategory' && (
                <TextField
                  label="Category Name"
                  size="small"
                  fullWidth
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                />
              )}
              <TextField
                label="Flag Name"
                size="small"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Flag Color:</Typography>
                <input
                  type="color"
                  value={formData.color || '#1976d2'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    width: '32px',
                    height: '28px',
                    padding: 0,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  {(formData.color || '#1976d2').toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDialogSubmit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default PatientFlags;
