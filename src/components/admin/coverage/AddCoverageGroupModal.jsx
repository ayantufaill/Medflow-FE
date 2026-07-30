import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const AddCoverageGroupModal = ({ open, onClose, onSave, groupData }) => {
  const [name, setName] = useState('');
  const [deliveryPattern, setDeliveryPattern] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [downgrade, setDowngrade] = useState('');

  // When modal opens or groupData changes, initialize state
  useEffect(() => {
    if (open) {
      if (groupData) {
        setName(groupData.name || '');
        setDeliveryPattern(groupData.deliveryPattern || '');
        setAgeLimit(groupData.ageLimit || '');
        setDowngrade(groupData.downgrade || '');
      } else {
        setName('');
        setDeliveryPattern('');
        setAgeLimit('');
        setDowngrade('');
      }
    }
  }, [open, groupData]);

  const handleSave = () => {
    onSave({
      id: groupData?.id,
      name,
      deliveryPattern,
      ageLimit,
      downgrade,
      codes: groupData?.codes || [] // preserve existing codes or empty
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
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
            {groupData ? 'Edit Coverage Group' : 'Add Coverage Group'}
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Configure coverage group details.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 4, py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Group Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 120, fontFamily: "Inter", color: '#374151', fontWeight: 600, fontSize: '13px' }}>
              Group Name:
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" }
              }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }}
            />
          </Box>

          {/* Select Group Codes */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 120, fontFamily: "Inter", color: '#374151', fontWeight: 600, fontSize: '13px' }}>
              Select Group Codes:
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Enter code or procedure"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" }
                }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }}
              />
              <Link 
                href="#" 
                underline="always" 
                sx={{ fontFamily: "Inter", fontSize: '13px', whiteSpace: 'nowrap', fontWeight: 600, color: '#2262ef' }}
              >
                Select Procedure
              </Link>
            </Box>
          </Box>

          {/* Include Group in */}
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontFamily: "Inter", color: '#374151', fontWeight: 600, fontSize: '13px', mb: 2 }}>
              Include Group in:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2 }}>
              {/* Frequency */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography sx={{ fontFamily: "Inter", fontSize: '13px', color: '#475569' }}>Frequency</Typography>}
                  sx={{ minWidth: 120 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField 
                    value={deliveryPattern}
                    onChange={(e) => setDeliveryPattern(e.target.value)}
                    variant="outlined" 
                    size="small"
                    placeholder="Pattern (e.g. 1/5 year(s))" 
                    InputProps={{ sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" } }}
                    sx={{ width: 170, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }} 
                  />
                </Box>
              </Box>

              {/* Limitations */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography sx={{ fontFamily: "Inter", fontSize: '13px', color: '#475569' }}>Limitations</Typography>}
                  sx={{ minWidth: 120 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: '#6b7280', mr: 0.5, fontFamily: 'Inter', fontSize: '13px' }}>$</Typography>
                    <TextField 
                      variant="outlined" 
                      size="small"
                      placeholder="Life Limit" 
                      InputProps={{ sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" } }}
                      sx={{ width: 100, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }} 
                    />
                  </Box>
                  <TextField 
                    value={ageLimit}
                    onChange={(e) => setAgeLimit(e.target.value)}
                    variant="outlined" 
                    size="small"
                    placeholder="Age Limit" 
                    InputProps={{ sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" } }}
                    sx={{ width: 100, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }} 
                  />
                </Box>
              </Box>

              {/* Downgrades */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography sx={{ fontFamily: "Inter", fontSize: '13px', color: '#475569' }}>Downgrades</Typography>}
                  sx={{ minWidth: 120 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f8fd', px: 1, py: 0.5, borderRadius: "8px", border: '1px solid #d0d5dd' }}>
                    <Typography sx={{ mr: 1, fontSize: '13px' }}>🦷</Typography>
                    <TextField 
                      value={downgrade}
                      onChange={(e) => setDowngrade(e.target.value)}
                      variant="standard" 
                      placeholder="Code" 
                      InputProps={{ disableUnderline: true, sx: { fontFamily: "Inter", fontSize: "13px" } }}
                      sx={{ width: 80 }} 
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
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
          variant="contained" 
          onClick={handleSave}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoverageGroupModal;
