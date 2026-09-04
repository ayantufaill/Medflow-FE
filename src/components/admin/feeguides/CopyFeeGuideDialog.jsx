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
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';
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
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
        flexShrink: 0,
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
            Copy Fee Guide
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Select a fee guide to copy.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0, overflowY: 'auto', flex: 1 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: '#F8FAFC' }}>
          <TextField
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fee guide..."
            sx={{ 
              '& .MuiInputBase-root': { fontFamily: "Inter", fontSize: "13px", backgroundColor: '#fff', borderRadius: "8px", color: "#374151" },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262ef' }
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
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 4, py: 3, borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
          <Button 
            variant="outlined" 
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #d0d5dd", color: "#374151",
              px: "16px", py: "7px",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
    </Dialog>
  );
};

export default CopyFeeGuideDialog;
