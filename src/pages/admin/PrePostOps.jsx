import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const PrePostOps = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOp, setCurrentOp] = useState({ name: '', description: '' });
  
  const [prePostOps, setPrePostOps] = useState([
    { id: 1, name: 'Implant Placement', description: 'Pre-op: Fasting for 8 hours. Post-op: No hot liquids for 24 hours.' },
    { id: 2, name: 'Wisdom Tooth Extraction', description: 'Pre-op: Take prescribed antibiotics. Post-op: Use ice pack for swelling.' }
  ]);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleOpenDialog = (op = null) => {
    if (op) {
      setCurrentOp(op);
      setIsEditing(true);
    } else {
      setCurrentOp({ name: '', description: '' });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleSaveOp = () => {
    if (currentOp.name) {
      if (isEditing) {
        setPrePostOps(prePostOps.map(op => op.id === currentOp.id ? currentOp : op));
      } else {
        setPrePostOps([...prePostOps, { ...currentOp, id: Date.now() }]);
      }
      setDialogOpen(false);
    }
  };

  const handleDeleteOp = (id) => {
    setPrePostOps(prePostOps.filter(op => op.id !== id));
  };

  const filteredOps = prePostOps.filter(op => 
    op.name.toLowerCase().includes(searchQuery) || 
    op.description.toLowerCase().includes(searchQuery)
  );

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
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>Pre & Post-Ops</Typography>
      </Box>

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1.1rem' }}>
          Pre & Post-Ops
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ 
              width: 300, 
              '& .MuiInputBase-root': { fontSize: '0.85rem', height: 36, backgroundColor: '#fff' }
            }}
            InputProps={{ 
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ fontSize: '1.1rem', color: '#999' }} />
                </InputAdornment>
              ) 
            }}
          />
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            sx={{ 
              backgroundColor: '#0c345d', 
              color: '#fff', 
              textTransform: 'none', 
              fontSize: '0.85rem', 
              height: 36, 
              px: 3,
              borderRadius: '18px',
              '&:hover': { backgroundColor: '#082646' }
            }}
          >
            + Add Pre/Post-Op
          </Button>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eef2f6', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem', width: '30%' }}>Name</TableCell>
              <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem' }}>Description</TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem', width: 100 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>No Pre or Post Ops Found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOps.map((op) => (
                <TableRow key={op.id} sx={{ '&:hover': { backgroundColor: '#fbfcfd' } }}>
                  <TableCell sx={{ py: 2, fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{op.name}</TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.85rem', color: '#666' }}>{op.description}</TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleOpenDialog(op)} sx={{ color: '#4a90e2' }}>
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteOp(op.id)} sx={{ color: '#e57373' }}>
                        <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: '#1a3a6b', fontSize: '1.1rem', fontWeight: 600, pb: 1 }}>
          {isEditing ? 'Edit Pre/Post-Op' : 'Add New Pre/Post-Op'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Name:</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Enter Name" 
              value={currentOp.name} 
              onChange={(e) => setCurrentOp({ ...currentOp, name: e.target.value })} 
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Description:</Typography>
            <TextField 
              fullWidth 
              size="small" 
              multiline
              rows={4}
              placeholder="Enter Pre & Post operative instructions" 
              value={currentOp.description} 
              onChange={(e) => setCurrentOp({ ...currentOp, description: e.target.value })} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{ backgroundColor: '#cbd5e0', color: '#4a5568', textTransform: 'none', px: 3, borderRadius: 5, boxShadow: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveOp}
            variant="contained"
            sx={{ backgroundColor: '#0c345d', color: '#fff', textTransform: 'none', px: 3, borderRadius: 5 }}
            disabled={!currentOp.name}
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrePostOps;
