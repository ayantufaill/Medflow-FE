import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Checkbox,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { practiceInfoService } from '../../services/practice-info.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const OfficeTimings = () => {
  const { showSnackbar } = useSnackbar();
  const [practiceId, setPracticeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Data structure for office timings
  const [data, setData] = useState({
    cycles: [
      { id: 'default', name: 'Default', from: 'Aug 31', to: '' },
      { id: 'april-6', name: 'April 6', from: 'Apr 6', to: 'Apr 6' }
    ],
    schedules: {
      'default': {
        openingHours: {},
        schedulingAppt: {}
      },
      'april-6': {
        openingHours: {},
        schedulingAppt: {}
      }
    }
  });

  // Dialog State for adding/editing cycles
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [inputValue, setInputValue] = useState({ name: '', from: '', to: '' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const defaultOpening = { from: '07:00 AM', to: '04:00 PM', closed: false };
  const defaultScheduling = { from: '08:00 AM', to: '03:00 PM', closed: false };

  // Helper to get timing for a specific day and cycle
  const getTiming = (type, cycleId, day) => {
    const cycleData = data.schedules[cycleId] || { openingHours: {}, schedulingAppt: {} };
    const dayData = cycleData[type][day];
    
    if (dayData) return dayData;
    
    // Return defaults based on the mock UI
    const isClosedDay = ['Saturday', 'Sunday', 'Monday'].includes(day);
    if (type === 'openingHours') {
      return { ...defaultOpening, closed: isClosedDay };
    } else {
      return { ...defaultScheduling, closed: isClosedDay };
    }
  };

  const fetchTimings = async () => {
    setLoading(true);
    try {
      const practice = await practiceInfoService.getCurrentPracticeInfo();
      setPracticeId(practice._id);
      if (practice.officeTimings && practice.officeTimings.cycles) {
        setData(practice.officeTimings);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showSnackbar('Failed to load office timings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimings();
  }, []);

  const handleSave = async (newData) => {
    if (!practiceId) return;
    setSaving(true);
    try {
      await practiceInfoService.updateOfficeTimings(practiceId, newData);
      setData(newData);
      showSnackbar('Office timings saved successfully', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showSnackbar('Failed to save timings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTimingChange = (type, day, field, value) => {
    const currentCycleId = data.cycles[tabValue]?.id;
    if (!currentCycleId) return;

    const newData = { ...data };
    if (!newData.schedules[currentCycleId]) {
      newData.schedules[currentCycleId] = { openingHours: {}, schedulingAppt: {} };
    }
    
    const currentTiming = getTiming(type, currentCycleId, day);
    newData.schedules[currentCycleId][type][day] = {
      ...currentTiming,
      [field]: value
    };
    
    handleSave(newData);
  };

  const handleAddCycle = () => {
    setEditItem(null);
    setInputValue({ name: '', from: '', to: '' });
    setOpen(true);
  };

  const handleEditCycle = (cycle) => {
    setEditItem(cycle);
    setInputValue({ name: cycle.name, from: cycle.from, to: cycle.to || '' });
    setOpen(true);
  };

  const handleDeleteCycle = (cycleId) => {
    if (data.cycles.length <= 1) {
        showSnackbar('Cannot delete the last cycle', 'warning');
        return;
    }
    
    const newCycles = data.cycles.filter(c => c.id !== cycleId);
    const newSchedules = { ...data.schedules };
    delete newSchedules[cycleId];
    
    const newData = { ...data, cycles: newCycles, schedules: newSchedules };
    setTabValue(0);
    handleSave(newData);
  };

  const handleSaveCycle = () => {
    if (!inputValue.name.trim()) return;
    
    let newCycles = [...data.cycles];
    let newSchedules = { ...data.schedules };
    
    if (editItem) {
      newCycles = newCycles.map(c => c.id === editItem.id ? { ...c, ...inputValue } : c);
    } else {
      const newId = Date.now().toString();
      newCycles.push({ id: newId, ...inputValue });
      newSchedules[newId] = { openingHours: {}, schedulingAppt: {} };
    }
    
    const newData = { ...data, cycles: newCycles, schedules: newSchedules };
    handleSave(newData);
    setOpen(false);
  };

  const TimeInput = ({ value, onChange, disabled }) => (
    <TextField
      size="small"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="00:00 AM"
      sx={{ 
        width: 100,
        '& .MuiInputBase-input': { 
          fontSize: 12, 
          textAlign: 'center',
        }
      }}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>
        
        {/* --- BREADCRUMBS --- */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: '0.85rem' }}>
            <Link
                component={RouterLink}
                to="/admin/practice-setup"
                variant="body2"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 500 }}
                >
                Practice Setup
            </Link>
            <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Office Timings</Typography>
          </Breadcrumbs>
        </Box>

        {/* Header Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={4}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={fetchTimings}
            disabled={saving}
            sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Re-Generate'}
          </Button>
        </Box>

        {/* Cycles Section */}
        <Box mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">Cycles</Typography>
            <Button 
              variant="contained" 
              onClick={handleAddCycle}
              sx={{ bgcolor: '#003366', borderRadius: 5, textTransform: 'none' }}
            >
              Add Cycle
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {data.cycles.map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{cycle.name}</TableCell>
                    <TableCell>From <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>{cycle.from}</Typography></TableCell>
                    <TableCell>{cycle.to && <>To <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>{cycle.to}</Typography></>}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>Show details</Typography>
                        <InfoOutlinedIcon fontSize="small" sx={{ color: '#ccc', mr: 2 }} />
                        <IconButton size="small" onClick={() => handleEditCycle(cycle)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteCycle(cycle.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} sx={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer' }}>+ Add Exceptions</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>0 Exception/s</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Schedules Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="bold">Schedules</Typography>
            <Button 
                variant="contained" 
                onClick={handleAddCycle}
                sx={{ bgcolor: '#003366', borderRadius: 5, textTransform: 'none' }}
            >
              Add Schedule
            </Button>
          </Box>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            {data.cycles.map((cycle, index) => (
              <Tab key={cycle.id} label={cycle.name} sx={{ textTransform: 'none' }} />
            ))}
          </Tabs>

          <Paper variant="outlined" sx={{ p: 3 }}>
            {/* Opening Hours */}
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Opening hours:</Typography>
            {days.map((day) => {
              const timing = getTiming('openingHours', data.cycles[tabValue]?.id, day);
              return (
                <Box key={day} display="flex" alignItems="center" mb={1.5} sx={{ height: 40 }}>
                  <Typography variant="body2" sx={{ width: 120 }}>{day}</Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ opacity: timing.closed ? 0.5 : 1 }}>from</Typography>
                    <TimeInput 
                      value={timing.from} 
                      onChange={(val) => handleTimingChange('openingHours', day, 'from', val)}
                      disabled={timing.closed}
                    />
                    <Typography variant="caption" sx={{ opacity: timing.closed ? 0.5 : 1 }}>to</Typography>
                    <TimeInput 
                      value={timing.to} 
                      onChange={(val) => handleTimingChange('openingHours', day, 'to', val)}
                      disabled={timing.closed}
                    />
                    <Box display="flex" alignItems="center" ml="auto">
                      <Checkbox 
                        size="small" 
                        checked={timing.closed} 
                        onChange={(e) => handleTimingChange('openingHours', day, 'closed', e.target.checked)}
                      />
                      <Typography variant="caption">closed</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            <Divider sx={{ my: 4 }} />

            {/* Scheduling Appt */}
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Scheduling Appt:</Typography>
            {days.map((day) => {
              const timing = getTiming('schedulingAppt', data.cycles[tabValue]?.id, day);
              return (
                <Box key={`appt-${day}`} display="flex" alignItems="center" mb={1.5} sx={{ height: 40 }}>
                  <Typography variant="body2" sx={{ width: 120 }}>{day}</Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ opacity: timing.closed ? 0.5 : 1 }}>from</Typography>
                    <TimeInput 
                      value={timing.from} 
                      onChange={(val) => handleTimingChange('schedulingAppt', day, 'from', val)}
                      disabled={timing.closed}
                    />
                    <Typography variant="caption" sx={{ opacity: timing.closed ? 0.5 : 1 }}>to</Typography>
                    <TimeInput 
                      value={timing.to} 
                      onChange={(val) => handleTimingChange('schedulingAppt', day, 'to', val)}
                      disabled={timing.closed}
                    />
                    <Box display="flex" alignItems="center" ml="auto">
                      <Checkbox 
                        size="small" 
                        checked={timing.closed} 
                        onChange={(e) => handleTimingChange('schedulingAppt', day, 'closed', e.target.checked)}
                      />
                      <Typography variant="caption">closed</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Box>

        {/* Cycle Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>{editItem ? 'Edit Cycle' : 'Add New Cycle'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Cycle Name"
              fullWidth
              variant="outlined"
              value={inputValue.name}
              onChange={(e) => setInputValue(p => ({ ...p, name: e.target.value }))}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              margin="dense"
              label="From Date (e.g. Aug 31)"
              fullWidth
              variant="outlined"
              value={inputValue.from}
              onChange={(e) => setInputValue(p => ({ ...p, from: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="To Date (Optional)"
              fullWidth
              variant="outlined"
              value={inputValue.to}
              onChange={(e) => setInputValue(p => ({ ...p, to: e.target.value }))}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
                onClick={handleSaveCycle} 
                variant="contained" 
                disabled={!inputValue.name.trim()}
                sx={{ bgcolor: '#003366' }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </LocalizationProvider>
  );
};

export default OfficeTimings;
