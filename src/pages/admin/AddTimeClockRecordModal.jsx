import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useUsers } from '../../hooks/queries/useUsers';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { COLORS } from '../../constants/colors';
import { roundedSelectMenuProps } from '../../constants/styles';
import CardWrapper from '../../components/admin/AddUserDrawer/CardWrapper';

// Helper for field labels
const FieldLabel = ({ children }) => (
  <Typography sx={{ 
    fontFamily: 'Inter, sans-serif', 
    fontSize: '11px', 
    fontWeight: 700, 
    color: '#64748B', 
    textTransform: 'uppercase', 
    letterSpacing: '0.4px', 
    mb: '6px' 
  }}>
    {children}
  </Typography>
);

const AddTimeClockRecordModal = ({ open, onClose }) => {
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  const [saving, setSaving] = useState(false);

  // Merge rounded menu props with high zIndex for modal overlay
  const modalMenuProps = {
    ...roundedSelectMenuProps,
    sx: { zIndex: 15000 },
    PaperProps: {
      ...roundedSelectMenuProps.PaperProps,
      sx: {
        ...roundedSelectMenuProps.PaperProps?.sx,
      },
    },
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      user: '',
      date: dayjs(),
      recordType: 'Clock In',
      time: dayjs(),
    }
  });

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    setSaving(true);
    // TODO: Connect to backend API when ready
    console.log("Saving Time Clock Record:", data);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      handleClose();
    }, 1000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            backgroundColor: '#f8fafc',
          }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#111' }}>
              Add Time Clock Record
            </Typography>
            <IconButton onClick={handleClose} size="small" sx={{ color: '#64748B' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ── Body ── */}
          <Box sx={{ px: '25px', py: '24px', overflowY: 'auto', flexGrow: 1 }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, color: '#111', mb: 0.5 }}>
                Record Details
              </Typography>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#64748B', mb: 2 }}>
                Enter the time clock information below.
              </Typography>
              
              <CardWrapper>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  
                  {/* User Selection */}
                  <Box>
                    <FieldLabel>User</FieldLabel>
                    <Controller
                      name="user"
                      control={control}
                      rules={{ required: 'User is required' }}
                      render={({ field }) => (
                        <FormControl fullWidth size="small" error={!!errors.user}>
                          <Select 
                            {...field} 
                            fullWidth 
                            size="small" 
                            displayEmpty
                            MenuProps={modalMenuProps} 
                            error={!!errors.user}
                            sx={{ 
                              bgcolor: 'white', borderRadius: '6px', 
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, 
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, 
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                              '& .MuiSelect-select': { color: field.value ? '#111' : '#94A3B8' }
                            }}
                          >
                            <MenuItem value="" disabled>Select User</MenuItem>
                            {users.map(u => (
                              <MenuItem key={u._id || u.id || u.UserNum} value={u._id || u.id || u.UserNum}>
                                {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.user && (
                            <Typography sx={{ color: 'error.main', fontSize: '11px', mt: 0.5, fontFamily: 'Inter' }}>
                              {errors.user.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Date Selection */}
                  <Box>
                    <FieldLabel>Date</FieldLabel>
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: 'Date is required' }}
                      render={({ field }) => (
                        <DatePicker 
                          value={field.value} 
                          onChange={field.onChange} 
                          slotProps={{ 
                            textField: { 
                              size: 'small', fullWidth: true, 
                              error: !!errors.date,
                              sx: { bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } } 
                            },
                            popper: { sx: { zIndex: 15000 } }
                          }} 
                        />
                      )}
                    />
                  </Box>

                  {/* Record Type */}
                  <Box>
                    <FieldLabel>Record Type</FieldLabel>
                    <Controller
                      name="recordType"
                      control={control}
                      rules={{ required: 'Record Type is required' }}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <Select 
                            {...field} 
                            fullWidth 
                            size="small" 
                            MenuProps={modalMenuProps} 
                            sx={{ 
                              bgcolor: 'white', borderRadius: '6px', 
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, 
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, 
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } 
                            }}
                          >
                            <MenuItem value="Clock In">Clock In</MenuItem>
                            <MenuItem value="Clock Out">Clock Out</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Time Selection */}
                  <Box>
                    <FieldLabel>Time</FieldLabel>
                    <Controller
                      name="time"
                      control={control}
                      rules={{ required: 'Time is required' }}
                      render={({ field }) => (
                        <TimePicker 
                          value={field.value} 
                          onChange={field.onChange} 
                          slotProps={{ 
                            textField: { 
                              size: 'small', fullWidth: true, 
                              error: !!errors.time,
                              sx: { bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } } 
                            },
                            popper: { sx: { zIndex: 15000 } }
                          }} 
                        />
                      )}
                    />
                  </Box>

                </Box>
              </CardWrapper>
            </Box>
          </Box>

          {/* ── Footer ── */}
          <Box sx={{
            px: '25px', py: '16px', flexShrink: 0,
            borderTop: `1px solid ${COLORS.BORDER}`,
            display: 'flex', justifyContent: 'flex-end', gap: 1.5,
            backgroundColor: 'white',
          }}>
            <Button 
              variant="outlined" 
              onClick={handleClose} 
              disabled={saving} 
              sx={{ borderRadius: 2, borderColor: '#d1d5db', color: '#4b5563', '&:hover': { borderColor: '#9ca3af', backgroundColor: 'transparent' }, textTransform: 'none', fontWeight: 600, fontFamily: 'Inter' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ backgroundColor: '#2262EF', borderRadius: 2, '&:hover': { backgroundColor: '#1d4ed8' }, boxShadow: 'none', textTransform: 'none', fontWeight: 600, fontFamily: 'Inter', px: 3 }}
            >
              Add Record
            </Button>
          </Box>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddTimeClockRecordModal;
