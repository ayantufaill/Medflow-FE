import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const ProcedureGroupDialog = ({ open, onClose, isEdit, formData, setFormData, onSave }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
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
            {isEdit ? 'Edit Procedure Group' : 'Add Procedure Group'}
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Configure dashboard goals procedure group.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ py: 3, px: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Group Name"
            variant="outlined"
            size="small"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            InputLabelProps={{ sx: { fontFamily: "Inter", fontSize: "13px" } }}
            sx={{ 
              '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
              '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Percentage (%)"
              variant="outlined"
              size="small"
              type="number"
              sx={{ 
                width: '50%',
                '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
                '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
              }}
              InputLabelProps={{ sx: { fontFamily: "Inter", fontSize: "13px" } }}
              value={formData.percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
            />
            <TextField
              label="Color Hex"
              variant="outlined"
              size="small"
              type="color"
              sx={{ 
                width: '50%',
                '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
                '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff', height: '40px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
              }}
              InputLabelProps={{ sx: { fontFamily: "Inter", fontSize: "13px" } }}
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </Box>
          <TextField
            label="Procedure Codes (comma separated)"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={3}
            value={formData.codes}
            onChange={(e) => setFormData(prev => ({ ...prev, codes: e.target.value }))}
            placeholder="e.g. D1110, D1120"
            InputLabelProps={{ sx: { fontFamily: "Inter", fontSize: "13px" } }}
            sx={{ 
              '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
              '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          variant="contained" 
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Save Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureGroupDialog;
