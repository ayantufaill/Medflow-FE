import React, { useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateRole } from '../../hooks/mutations/useRoleMutations';

const COLORS = {
  BORDER: '#e0e0e0',
};

const FieldLabel = ({ children }) => (
  <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
    {children}
  </Typography>
);

const EditRoleModal = ({ open, onClose, role }) => {
  const updateRoleMutation = useUpdateRole();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  // Populate form when role changes
  useEffect(() => {
    if (role) {
      reset({
        name: role.name || '',
        description: role.description || '',
      });
    }
  }, [role, reset]);

  const handleClose = () => {
    if (updateRoleMutation.isPending) return;
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    if (!role) return;
    
    const payload = {
      name: data.name,
      description: data.description,
    };

    updateRoleMutation.mutate({ roleId: role.id || role._id, roleData: payload }, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 14000 }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          margin: '16px',
          width: '100%',
          maxWidth: '500px'
        }
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* ── Header ── */}
        <Box sx={{
          px: '25px', py: '18px', flexShrink: 0,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: '#F3F8FD',
        }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#111' }}>
            Edit Role
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#64748B' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ── Body ── */}
        <Box sx={{ px: '25px', py: '24px', overflowY: 'auto', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            
            {/* Name */}
            <Box>
              <FieldLabel>Name</FieldLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    fullWidth 
                    size="small" 
                    placeholder="Enter Role Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'white', borderRadius: '6px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#2262EF', borderWidth: '1px' },
                      },
                      '& .MuiInputBase-input': { fontSize: '13px' },
                      '& .MuiFormHelperText-root': { fontFamily: 'Inter', fontSize: '11px', ml: 0 }
                    }}
                  />
                )}
              />
            </Box>

            {/* Description */}
            <Box>
              <FieldLabel>Description</FieldLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    fullWidth 
                    multiline
                    rows={3}
                    placeholder="Enter Description"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: 'white', borderRadius: '6px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#2262EF', borderWidth: '1px' },
                      },
                      '& .MuiInputBase-input': { fontSize: '13px' }
                    }}
                  />
                )}
              />
            </Box>

          </Box>
        </Box>

        {/* ── Footer ── */}
        <Box sx={{
          px: '25px', py: '16px', flexShrink: 0,
          borderTop: `1px solid ${COLORS.BORDER}`,
          display: 'flex', justifyContent: 'flex-end', gap: 2,
          backgroundColor: '#ffffff',
        }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '6px',
              color: '#475569',
              borderColor: '#CBD5E1',
              px: 3,
              '&:hover': {
                backgroundColor: '#F1F5F9',
                borderColor: '#94A3B8',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateRoleMutation.isPending}
            sx={{
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '6px',
              backgroundColor: '#2262EF',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#1E58D6',
                boxShadow: 'none',
              }
            }}
          >
            {updateRoleMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditRoleModal;
