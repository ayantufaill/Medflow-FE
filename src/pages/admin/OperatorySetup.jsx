import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { roomService } from '../../services/room.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const OperatorySetup = () => {
  const { showSnackbar } = useSnackbar();
  const [operatories, setOperatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  // Dialog State
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({ name: '', order: '' });
  const [editItem, setEditItem] = useState(null);

  const primaryNavy = '#002855';

  const fetchOperatories = async () => {
    setLoading(true);
    try {
      // Fetch all rooms (isActive null means both active and hidden)
      const data = await roomService.getAllRooms(1, 100, '', showHidden ? null : true);
      setOperatories(data.rooms || []);
    } catch (err) {
      console.error('Fetch error:', err);
      showSnackbar('Failed to load operatories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperatories();
  }, [showHidden]);

  const handleAddClick = () => {
    setInputValue({ name: '', order: (operatories.length + 1).toString() });
    setEditItem(null);
    setOpen(true);
  };

  const handleEditClick = (item) => {
    setInputValue({ name: item.name, order: item.itemOrder.toString() });
    setEditItem(item);
    setOpen(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this operatory?')) return;
    
    try {
      await roomService.deleteRoom(roomId);
      showSnackbar('Operatory deleted successfully', 'success');
      fetchOperatories();
    } catch (err) {
      console.error('Delete error:', err);
      showSnackbar('Failed to delete operatory', 'error');
    }
  };

  const handleSaveItem = async () => {
    const trimmedName = inputValue.name.trim();
    if (!trimmedName) return;

    setSaving(true);
    try {
      if (editItem) {
        await roomService.updateRoom(editItem._id, {
          name: trimmedName,
          itemOrder: parseInt(inputValue.order) || 0
        });
        showSnackbar('Operatory updated successfully', 'success');
      } else {
        await roomService.createRoom({
          name: trimmedName,
          itemOrder: parseInt(inputValue.order) || 0
        });
        showSnackbar('Operatory created successfully', 'success');
      }
      setOpen(false);
      fetchOperatories();
    } catch (err) {
      console.error('Save error:', err);
      showSnackbar(err.response?.data?.message || 'Failed to save operatory', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#ffffff', minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
      
      {/* --- BREADCRUMBS --- */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#9e9e9e' }} />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link 
          component={RouterLink} 
          to="/admin/practice-setup" 
          sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, fontSize: '0.8rem' }}
        >
          Practice Setup
        </Link>
        <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500, fontSize: '0.8rem' }}>
          Operatory Setup
        </Typography>
      </Breadcrumbs>

      {/* --- OPERATORIES SECTION --- */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
            Operatories
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Button 
              variant="contained" 
              onClick={handleAddClick}
              sx={{ 
                borderRadius: '20px', 
                textTransform: 'none', 
                px: 3, 
                bgcolor: primaryNavy,
                '&:hover': { bgcolor: '#001a3a' }
              }}
            >
              Add Operatory
            </Button>
            <Box sx={{ mt: 1 }}>
              <FormControlLabel 
                control={
                  <Checkbox 
                    size="small" 
                    sx={{ p: 0.5 }} 
                    checked={showHidden} 
                    onChange={(e) => setShowHidden(e.target.checked)}
                  />
                } 
                label={<Typography variant="caption" color="textSecondary">Show Deleted Operatories</Typography>} 
              />
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #e0e0e0' }}>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Operatory</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Note</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                operatories.map((op) => (
                  <TableRow key={op._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ py: 1.5 }}>{op.name}</TableCell>
                    <TableCell>{op.isActive ? 'Active' : 'Hidden'}</TableCell>
                    <TableCell>{op.itemOrder}</TableCell>
                    <TableCell></TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton size="small" sx={{ color: '#1976d2' }} onClick={() => handleEditClick(op)}>
                          <EditNoteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(op._id)}>
                          <DeleteOutlineIcon fontSize="small" sx={{ color: '#ff8a80' }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && operatories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No operatories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- OFFICE FILTERS SECTION --- */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
            Office Filters
          </Typography>
          <Button 
            variant="contained" 
            disabled
            sx={{ 
              borderRadius: '20px', 
              textTransform: 'none', 
              px: 3, 
              bgcolor: primaryNavy,
              '&:hover': { bgcolor: '#001a3a' }
            }}
          >
            Add Filter
          </Button>
        </Box>
        <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #e0e0e0' }}>
                <TableCell sx={{ fontWeight: 600, color: '#666', width: '30%' }}>Filter</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', width: '40%' }}>Ops Included</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', width: '30%' }}>Schedule</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
               <TableRow>
                 <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                   Office filters management coming soon.
                 </TableCell>
               </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- USER FILTERS SECTION --- */}
      <Box>
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 500, mb: 1 }}>
          User Filters
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
           <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
             Default User View
           </Typography>
           <Link 
             component="button" 
             variant="body2" 
             underline="none"
             disabled
             sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e' }}
           >
             <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add Filter
           </Link>
        </Box>
      </Box>

      {/* Dialog for Add/Edit Operatory */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: primaryNavy }}>
          {editItem ? 'Edit Operatory' : 'Add New Operatory'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Operatory Name"
            fullWidth
            variant="outlined"
            value={inputValue.name}
            onChange={(e) => setInputValue(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Display Order"
            type="number"
            fullWidth
            variant="outlined"
            value={inputValue.order}
            onChange={(e) => setInputValue(prev => ({ ...prev, order: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleSaveItem} 
            variant="contained" 
            disabled={saving || !inputValue.name.trim()}
            sx={{ bgcolor: primaryNavy, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#001a3a' } }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : (editItem ? 'Save Changes' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default OperatorySetup;
