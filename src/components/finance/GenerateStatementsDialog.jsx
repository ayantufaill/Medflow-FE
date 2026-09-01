import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const GenerateStatementsDialog = ({ open = true, onClose, onGenerate }) => {
  const [statementType, setStatementType] = useState('Family');
  const [shareWithPatients, setShareWithPatients] = useState(true);

  const handleGenerate = () => {
    onGenerate?.({
      type: statementType,
      share: shareWithPatients,
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
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ boxSizing: 'border-box', px: '25px', py: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd', m: 0, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Generate Statements
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748B' }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, px: 4, pb: 2 }}>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 4, fontFamily: 'Inter, sans-serif' }}>
          Configure the batch statement generation settings for the selected patients.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
            Statement Type
          </Typography>
          <RadioGroup
            row
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
            sx={{ gap: 3 }}
          >
            <FormControlLabel
              value="Family"
              control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>Family</Typography>}
            />
            <FormControlLabel
              value="Individual"
              control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>Individual</Typography>}
            />
          </RadioGroup>
        </Box>

        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={shareWithPatients}
                onChange={(e) => setShareWithPatients(e.target.checked)}
                sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#2563eb' } }}
              />
            }
            label={
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                Share With Patients
              </Typography>
            }
          />
          <Typography variant="caption" sx={{ display: 'block', color: '#64748b', ml: 4, mt: 0.5 }}>
            Patients will be notified via email or SMS based on their preferences.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #e0e5eb', px: 2.5, py: 2, bgcolor: '#fff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: 'none', color: '#64748b', borderColor: '#cbd5e1', fontWeight: 600, borderRadius: '8px', px: 3, fontFamily: 'Inter, sans-serif', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          sx={{
            bgcolor: '#2362EF',
            color: '#fff',
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            fontFamily: 'Inter, sans-serif',
            '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' },
          }}
        >
          Generate Batch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateStatementsDialog;
