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
  CircularProgress,
  Grid,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { usePatients } from '../../hooks/queries/usePatients';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useUpdateTask } from '../../hooks/queries/useTasks';
import { COLORS } from '../../constants/colors';
import { roundedSelectMenuProps } from '../../constants/styles';
import CardWrapper from '../../components/admin/AddUserDrawer/CardWrapper';
import adduserIcon from '../../assets/usermanagement icons/adduser1.svg';
// We'll reuse the personalinfo icon or similar for sections, or just omit icons if we don't have task specific ones
import personalInfoIcon from '../../assets/usermanagement icons/personalinformation.svg';

const EditTaskModal = ({ open, onClose, users, taskLists, roles, task }) => {
  const { data: patients = [] } = usePatients({ limit: 500, status: 'active' });
  const updateTaskMutation = useUpdateTask();
  const [saving, setSaving] = useState(false);

  // Merge rounded menu props with high zIndex for modal overlay
  const modalMenuProps = {
    ...roundedSelectMenuProps,
    sx: { zIndex: 10000 },
    PaperProps: {
      ...roundedSelectMenuProps.PaperProps,
      sx: {
        ...roundedSelectMenuProps.PaperProps?.sx,
      },
    },
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      Descript: '',
      Message: '',
      PriorityDefNum: 0,
      assignedTo: '',
      TaskListNum: '',
      DateTask: null,
      dueTime: null,
      IsRepeating: 0,
      ReminderFrequency: 0,
      comment: '',
      KeyNum: '',
    }
  });

  React.useEffect(() => {
    if (task && open) {
      const descParts = task.Descript ? task.Descript.split('\n') : [''];
      reset({
        Descript: descParts[0] || '',
        Message: descParts.slice(1).join('\n') || '',
        PriorityDefNum: task.PriorityDefNum || 0,
        assignedTo: task.UserNum || '',
        TaskListNum: task.TaskListNum || '',
        DateTask: task.DateTask ? dayjs(task.DateTask) : null,
        dueTime: null, // Depending on if dueTime is part of DateTask or separate
        IsRepeating: task.IsRepeating || 0,
        ReminderFrequency: task.ReminderFrequency || 0,
        comment: '', // don't prefill comment on edit
        KeyNum: task.KeyNum || '',
      });
    }
  }, [task, open, reset]);

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    setSaving(true);
    // Format data for API
    const formattedData = {
      ...data,
      Descript: data.Message ? `${data.Descript}\n${data.Message}` : data.Descript,
      DateTask: data.DateTask ? data.DateTask.format('YYYY-MM-DD') : undefined,
      dueTime: data.dueTime ? data.dueTime.format('HH:mm') : undefined,
      KeyNum: data.KeyNum === '' ? null : data.KeyNum,
      assignedTo: data.assignedTo === '' ? null : data.assignedTo,
      TaskListNum: data.TaskListNum === '' ? null : data.TaskListNum,
    };

    updateTaskMutation.mutate({ taskId: task.TaskNum, updates: formattedData }, {
      onSuccess: () => {
        setSaving(false);
        handleClose();
      },
      onError: () => {
        setSaving(false);
      }
    });
  };

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh', overflow: 'hidden' } }}
      >
        <Box
          component="form"
          id="edit-task-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
        >
          {/* ── Header ── */}
          <Box sx={{
            px: '25px', py: '16px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#F3F8FD',
            borderBottom: `1px solid #e0e0e0`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <img src={adduserIcon} alt="Add Task" style={{ width: 20, height: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>
                  Edit Task
                </Typography>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: 'text.secondary' }}>
                  Update task details
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} disabled={saving} sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ── Scrollable body ── */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, backgroundColor: 'white' }}>
            
            <CardWrapper title="Task Details" icon={personalInfoIcon}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <FieldLabel>Title <span style={{color: 'red'}}>*</span></FieldLabel>
                  <Controller
                    name="Descript"
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <TextField 
                        {...field} 
                        fullWidth 
                        size="small" 
                        placeholder="Enter Title" 
                        error={!!errors.Descript}
                        helperText={errors.Descript?.message}
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={12}>
                  <FieldLabel>Message</FieldLabel>
                  <Controller
                    name="Message"
                    control={control}
                    render={({ field }) => (
                      <TextField 
                        {...field} 
                        fullWidth 
                        size="small" 
                        placeholder="Enter Message (optional)" 
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={12}>
                  <FieldLabel>Priority</FieldLabel>
                  <Controller
                    name="PriorityDefNum"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} fullWidth size="small" MenuProps={modalMenuProps} sx={{ bgcolor: 'white', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } }}
                        renderValue={(selected) => {
                          if (selected === 0) return <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>None</Typography>;
                          const labels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' };
                          return <Typography sx={{ fontSize: '14px', color: '#1E293B' }}>{labels[selected] || 'None'}</Typography>;
                        }}
                      >
                        <MenuItem value={0}>None</MenuItem>
                        <MenuItem value={1}>Low</MenuItem>
                        <MenuItem value={2}>Medium</MenuItem>
                        <MenuItem value={3}>High</MenuItem>
                        <MenuItem value={4}>Urgent</MenuItem>
                      </Select>
                    )}
                  />
                </Grid>
              </Grid>
            </CardWrapper>

            <Box sx={{ mt: 3 }}>
              <CardWrapper title="Assignments">
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FieldLabel>Assign to user</FieldLabel>
                    <Controller
                      name="assignedTo"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth size="small" displayEmpty MenuProps={modalMenuProps} sx={{ bgcolor: 'white', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } }}
                          renderValue={(selected) => {
                            if (!selected) return <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>None</Typography>;
                            const match = users.find(u => String(u._id || u.id || u.UserNum) === String(selected));
                            return <Typography sx={{ fontSize: '14px', color: '#1E293B' }}>{match ? (`${match.firstName || ''} ${match.lastName || ''}`.trim() || match.email || match.UserName || 'Unknown User') : selected}</Typography>;
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {(users || []).map(u => (
                            <MenuItem key={u._id || u.id || u.UserNum} value={u._id || u.id || u.UserNum}>
                              {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || u.UserName || 'Unknown User'}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FieldLabel>Assign to group</FieldLabel>
                    <Controller
                      name="TaskListNum"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth size="small" displayEmpty MenuProps={modalMenuProps} sx={{ bgcolor: 'white', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } }}
                          renderValue={(selected) => {
                            if (!selected) return <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>None</Typography>;
                            const match = taskLists?.find(g => String(g.TaskListNum) === String(selected));
                            return <Typography sx={{ fontSize: '14px', color: '#1E293B' }}>{match ? match.Descript : selected}</Typography>;
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {(taskLists || []).map(list => (
                            <MenuItem key={list.TaskListNum} value={list.TaskListNum}>{list.Descript}</MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FieldLabel>Link Patient</FieldLabel>
                    <Controller
                      name="KeyNum"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth size="small" displayEmpty MenuProps={modalMenuProps} sx={{ bgcolor: 'white', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } }}
                          renderValue={(selected) => {
                            if (!selected) return <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>None</Typography>;
                            const match = patients.find(p => String(p._id || p.id || p.PatNum) === String(selected));
                            return <Typography sx={{ fontSize: '14px', color: '#1E293B' }}>{match ? (`${match.firstName || ''} ${match.lastName || ''}`.trim() || match.email) : selected}</Typography>;
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {patients.map(p => (
                            <MenuItem key={p._id || p.id || p.PatNum} value={p._id || p.id || p.PatNum}>
                              {`${p.firstName || ''} ${p.lastName || ''}`.trim() || p.email}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardWrapper>
            </Box>

            <Box sx={{ mt: 3 }}>
              <CardWrapper title="Scheduling">
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FieldLabel>Due date</FieldLabel>
                    <Controller
                      name="DateTask"
                      control={control}
                      render={({ field }) => (
                        <DatePicker 
                          value={field.value} 
                          onChange={field.onChange} 
                          slotProps={{ 
                            textField: { size: 'small', fullWidth: true, sx: { bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } } },
                            popper: { sx: { zIndex: 10000 } }
                          }} 
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FieldLabel>Time</FieldLabel>
                    <Controller
                      name="dueTime"
                      control={control}
                      render={({ field }) => (
                        <TimePicker 
                          value={field.value} 
                          onChange={field.onChange} 
                          slotProps={{ 
                            textField: { size: 'small', fullWidth: true, sx: { bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } } },
                            popper: { sx: { zIndex: 10000 } }
                          }} 
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FieldLabel>Repeat</FieldLabel>
                    <Controller
                      name="IsRepeating"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} fullWidth size="small" MenuProps={modalMenuProps} sx={{ bgcolor: 'white', borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } }}>
                          <MenuItem value={0}>Does not repeat</MenuItem>
                          <MenuItem value={1}>Daily</MenuItem>
                          <MenuItem value={2}>Weekly</MenuItem>
                          <MenuItem value={3}>Monthly</MenuItem>
                        </Select>
                      )}
                    />
                  </Grid>
                  
                  <Grid size={12}>
                    <FieldLabel>Comments</FieldLabel>
                    <Controller
                      name="comment"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          fullWidth 
                          size="small" 
                          placeholder="Add initial comment..." 
                          sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' } } }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
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
              Save Changes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditTaskModal;
