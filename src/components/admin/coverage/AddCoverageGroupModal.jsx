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
import { Close as CloseIcon } from '@mui/icons-material';

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
      PaperProps={{
        sx: {
          borderRadius: 1,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#003366', 
        color: 'white', 
        py: 1.5,
        px: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {groupData ? 'Edit Coverage Group' : 'Add Coverage Group'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Group Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 120, color: '#003366', fontWeight: 600, fontSize: '0.85rem' }}>
              Group Name:
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              variant="standard"
              fullWidth
              InputProps={{
                sx: { fontSize: '0.85rem' }
              }}
            />
          </Box>

          {/* Select Group Codes */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ minWidth: 120, color: '#003366', fontWeight: 600, fontSize: '0.85rem' }}>
              Select Group Codes:
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Enter code or procedure"
                variant="standard"
                fullWidth
                InputProps={{
                  sx: { fontSize: '0.85rem' }
                }}
              />
              <Link 
                href="#" 
                underline="always" 
                sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap', fontWeight: 600, color: '#003366' }}
              >
                Select Procedure
              </Link>
            </Box>
          </Box>

          {/* Include Group in */}
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ color: '#003366', fontWeight: 600, fontSize: '0.85rem', mb: 2 }}>
              Include Group in:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2 }}>
              {/* Frequency */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem', color: '#888' }}>Frequency</Typography>}
                  sx={{ minWidth: 120 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField 
                    value={deliveryPattern}
                    onChange={(e) => setDeliveryPattern(e.target.value)}
                    variant="standard" 
                    placeholder="Pattern (e.g. 1/5 year(s))" 
                    sx={{ width: 150, '& input': { textAlign: 'center', fontSize: '0.85rem' } }} 
                  />
                </Box>
              </Box>

              {/* Limitations */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem', color: '#888' }}>Limitations</Typography>}
                  sx={{ minWidth: 120 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: '#888', mr: 0.5 }}>$</Typography>
                    <TextField 
                      variant="standard" 
                      placeholder="Life Limit" 
                      sx={{ width: 80, '& input': { fontSize: '0.85rem' } }} 
                    />
                  </Box>
                  <TextField 
                    value={ageLimit}
                    onChange={(e) => setAgeLimit(e.target.value)}
                    variant="standard" 
                    placeholder="Age Limit" 
                    sx={{ width: 80, '& input': { fontSize: '0.85rem' } }} 
                  />
                </Box>
              </Box>

              {/* Downgrades */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem', color: '#888' }}>Downgrades</Typography>}
                  sx={{ minWidth: 120 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Checkbox size="small" />
                  <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f4fa', px: 1, py: 0.5, borderRadius: 1 }}>
                    <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>🦷</Typography>
                    <TextField 
                      value={downgrade}
                      onChange={(e) => setDowngrade(e.target.value)}
                      variant="standard" 
                      placeholder="Code" 
                      sx={{ width: 80, '& input': { fontSize: '0.85rem' } }} 
                      InputProps={{ disableUnderline: true }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ height: '1px', backgroundColor: '#003366', mt: 2 }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{ 
            backgroundColor: '#7a96b5', 
            '&:hover': { backgroundColor: '#6a86a5' },
            textTransform: 'none',
            borderRadius: 50,
            px: 4,
            fontWeight: 600
          }}
        >
          Save
        </Button>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            color: '#003366', 
            borderColor: '#003366',
            textTransform: 'none',
            borderRadius: 50,
            px: 4,
            fontWeight: 600,
            '&:hover': { borderColor: '#002244', backgroundColor: 'rgba(0,51,102,0.05)' }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoverageGroupModal;
