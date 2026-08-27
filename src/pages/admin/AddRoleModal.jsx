import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useRoles } from '../../hooks/queries/useRoles';
import { useCreateRole } from '../../hooks/mutations/useRoleMutations';

const COLORS = {
  BORDER: '#e0e0e0',
};

const modalMenuProps = {
  sx: { zIndex: 14001 },
  PaperProps: {
    sx: {
      mt: 1,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #E2E8F0',
      '& .MuiMenuItem-root': {
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        color: '#1E293B',
        py: 1,
        px: 2,
        '&:hover': { bgcolor: '#F8FAFC' },
        '&.Mui-selected': { bgcolor: '#EFF6FF', color: '#2262EF', fontWeight: 500, '&:hover': { bgcolor: '#DBEAFE' } }
      }
    }
  }
};

const FieldLabel = ({ children }) => (
  <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#334155', mb: 0.75 }}>
    {children}
  </Typography>
);

const AddRoleModal = ({ open, onClose }) => {
  const { data: roles = [] } = useRoles();
  const createRoleMutation = useCreateRole();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      defaultRole: 'None',
    }
  });

  const handleClose = () => {
    if (createRoleMutation.isPending) return;
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      description: data.description,
    };

    if (data.defaultRole && data.defaultRole !== 'None') {
      const selectedRole = roles.find(r => r.name === data.defaultRole);
      if (selectedRole) {
        // Handle both possible structures (permissions or resources)
        if (selectedRole.permissions) {
          payload.permissions = selectedRole.permissions;
        } else if (selectedRole.resources) {
          payload.permissions = selectedRole.resources;
        }
      }
    }

    createRoleMutation.mutate(payload, {
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
            Add New Role
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
                    placeholder="Enter Role"
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

            {/* Select default role */}
            <Box>
              <FieldLabel>Select default role:</FieldLabel>
              <Controller
                name="defaultRole"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <Select 
                      {...field} 
                      fullWidth 
                      size="small" 
                      displayEmpty
                      MenuProps={modalMenuProps} 
                      sx={{ 
                        bgcolor: 'white', borderRadius: '6px', 
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, 
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, 
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                        '& .MuiSelect-select': { fontSize: '13px', color: '#111' }
                      }}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {roles.map(r => (
                        <MenuItem key={r.id || r._id} value={r.name}>{r.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
            disabled={createRoleMutation.isPending}
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
            {createRoleMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddRoleModal;
