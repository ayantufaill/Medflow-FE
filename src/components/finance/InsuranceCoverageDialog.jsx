import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  Stack,
  Divider
} from '@mui/material';
import { Add, HealthAndSafety } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const InsuranceCoverageDialog = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleAddInsurancePolicy = () => {
    onClose();
    navigate('/insurance');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '4px',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        bgcolor: '#7788bb', 
        color: '#fff', 
        fontWeight: 600, 
        textAlign: 'center',
        py: 1,
        fontSize: '16px'
      }}>
        Insurance Coverage
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 1 }}>
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <HealthAndSafety sx={{ fontSize: 36, color: '#7788bb', mb: 1 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 0.5, fontWeight: 500, fontSize: '1rem' }}>
            No Insurance Policies Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mb: 1.5, fontSize: '0.8rem' }}>
            Add an insurance policy to manage coverage and claims
          </Typography>

          <Divider sx={{ mb: 1.5 }} />

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddInsurancePolicy}
            sx={{
              bgcolor: '#d4a537',
              color: '#fff',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              py: 1.2,
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#c4942d'
              }
            }}
          >
            Add Insurance Policy
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InsuranceCoverageDialog;
