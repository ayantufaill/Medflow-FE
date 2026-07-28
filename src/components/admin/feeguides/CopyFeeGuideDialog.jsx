import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { copyFeeGuide } from '../../../store/slices/feeGuideSlice';

const CopyFeeGuideDialog = ({ open, onClose, feeGuidesData }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = feeGuidesData.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCopy = (guide) => {
    dispatch(copyFeeGuide({ sourceId: guide.id, newName: guide.name + ' - Copy' }));
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#fff',
        color: '#0f172a',
        fontSize: '1.1rem',
        fontWeight: 700,
        py: 3,
        px: 4,
        lineHeight: 1.3,
        borderBottom: '1px solid #f1f5f9'
      }}>
        Copy Fee Guide
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: '#F8FAFC' }}>
          <TextField
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fee guide..."
            sx={{ 
              '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: 2 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            }}
          />
        </Box>
        <List sx={{ pt: 0, maxHeight: 300, overflow: 'auto' }}>
          {filteredGuides.map((guide) => (
            <ListItem 
              key={guide.id} 
              button 
              onClick={() => handleCopy(guide)}
              sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, px: 3, '&:hover': { backgroundColor: '#f8fafc' } }}
            >
              <ListItemText 
                primary={guide.name} 
                primaryTypographyProps={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}
              />
            </ListItem>
          ))}
          {filteredGuides.length === 0 && (
            <ListItem sx={{ py: 3, justifyContent: 'center' }}>
              <ListItemText primary="No fee guides found" primaryTypographyProps={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }} />
            </ListItem>
          )}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, p: 3, borderTop: '1px solid #f1f5f9' }}>
          <Button 
            variant="text" 
            sx={{ 
              textTransform: 'none', 
              color: '#475569', 
              fontWeight: 600, 
              borderRadius: 2, 
              px: 3, 
              '&:hover': { backgroundColor: '#f1f5f9' } 
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CopyFeeGuideDialog;
