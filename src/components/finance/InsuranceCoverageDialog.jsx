import { Button, Box, Typography, Divider } from '@mui/material';
import { Add, HealthAndSafety } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BaseDialog from '../shared/BaseDialog';

const InsuranceCoverageDialog = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleAddInsurancePolicy = () => {
    onClose();
    navigate('/insurance');
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Insurance Coverage"
      maxWidth="md"
      contentSx={{ pt: 1.5, pb: 1 }}
    >
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
            '&:hover': { bgcolor: '#c4942d' },
          }}
        >
          Add Insurance Policy
        </Button>
      </Box>
    </BaseDialog>
  );
};

export default InsuranceCoverageDialog;
