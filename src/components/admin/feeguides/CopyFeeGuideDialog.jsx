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
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#4b71a1', 
        color: 'white', 
        textAlign: 'center',
        py: 1,
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Copy Fee Guide from
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 1, bgcolor: '#f5f5f5' }}>
          <TextField
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fee guide"
            sx={{ 
              '& .MuiInputBase-root': { bgcolor: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
          />
        </Box>
        <List sx={{ pt: 0, maxHeight: 300, overflow: 'auto' }}>
          {filteredGuides.map((guide) => (
            <ListItem 
              key={guide.id} 
              button 
              onClick={() => handleCopy(guide)}
              sx={{ borderBottom: '1px solid #f0f0f0', py: 0.2 }}
            >
              <ListItemText 
                primary={guide.name} 
                primaryTypographyProps={{ fontSize: '0.8rem', color: '#333' }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderTop: '1px solid #f0f0f0' }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#999', textTransform: 'none', '&:hover': { bgcolor: '#888' } }}
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
