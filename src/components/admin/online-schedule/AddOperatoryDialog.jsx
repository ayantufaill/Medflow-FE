import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { roomService } from '../../../services/room.service';
import { useSnackbar } from '../../../contexts/SnackbarContext';

const AddOperatoryDialog = ({ open, onClose, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  const handleClose = () => {
    if (saving) return;
    setName('');
    setIsActive(true);
    setError('');
    setNameError('');
    onClose();
  };

  const validate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Operatory name is required');
      return false;
    }
    if (trimmed.length > 100) {
      setNameError('Name must be less than 100 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setError('');
      await roomService.createRoom({ name: name.trim(), isActive });
      showSnackbar('Operatory created successfully', 'success');
      onSuccess?.();
      handleClose();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create operatory. Please try again.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        px: '24px', height: '73px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#f3f8fd',
        borderBottom: `1px solid ${COLORS.BORDER}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mr: '16px',
          }}>
            <GridViewIcon sx={{ fontSize: '22px', color: '#3b82f6' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', color: '#0f172a', lineHeight: 1 }}>
              Add Operatory
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11.5px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
              Create a new room or chair for online booking
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={saving} sx={{ color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <CloseIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: '24px', bgcolor: '#ffffff' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', fontFamily: 'Inter, sans-serif' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" id="add-operatory-form" onSubmit={handleSubmit}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#0f172a', mb: 0.75 }}>
            Operatory Name *
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g., Room 101, Exam Room 1, Chair 3"
            value={name}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
            error={!!nameError}
            helperText={nameError || 'Enter the name or number of the room/chair'}
            disabled={saving}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
              },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={saving}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#16a34a' },
                }}
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Active
              </Typography>
            }
          />
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box sx={{
        height: '57px', px: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
        backgroundColor: '#ffffff',
        borderTop: `1px solid ${COLORS.BORDER}`,
      }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={saving}
          sx={{
            textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
            borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px',
            px: '16px', height: '36px',
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-operatory-form"
          variant="contained"
          disableElevation
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <GridViewIcon sx={{ fontSize: '17px !important' }} />}
          sx={{
            textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
            bgcolor: '#1d4ed8', color: '#ffffff', borderRadius: '6px',
            px: '24px', height: '36px',
            '&:hover': { bgcolor: '#1e40af' }
          }}
        >
          {saving ? 'Creating...' : 'Add Operatory'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddOperatoryDialog;
