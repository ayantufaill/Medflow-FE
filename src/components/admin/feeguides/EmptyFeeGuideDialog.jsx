import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Box,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';
import { createFeeGuide } from '../../../store/slices/feeGuideSlice';

const EmptyFeeGuideDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    dispatch(createFeeGuide(name));
    setName('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
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
            Empty Fee Guide
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Create a new empty fee guide.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ py: 3, px: 4 }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
          Name
        </Typography>
        <TextField
          size="small"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ 
            mb: 4,
            '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
            '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 4, py: 3, borderTop: '1px solid #f1f5f9', mx: -4, mb: -4 }}>
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
          <Button 
            variant="contained" 
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
              "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
            }}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmptyFeeGuideDialog;
