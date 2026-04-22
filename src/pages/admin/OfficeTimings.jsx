import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { practiceInfoService } from '../../services/practice-info.service';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultTimings = {
  openingHours: days.reduce((acc, day) => {
    acc[day] = { from: '07:00 AM', to: '04:00 PM', closed: ['Saturday', 'Sunday', 'Monday'].includes(day) };
    return acc;
  }, {}),
  schedulingAppt: days.reduce((acc, day) => {
    acc[day] = { from: '08:00 AM', to: '03:00 PM', closed: ['Saturday', 'Sunday', 'Monday'].includes(day) };
    return acc;
  }, {})
};

const OfficeTimings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [practiceInfoId, setPracticeInfoId] = useState(null);
  const [timings, setTimings] = useState(defaultTimings);
  const [loading, setLoading] = useState(true);
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [newCycle, setNewCycle] = useState({ name: '', fromDate: '', toDate: '' });
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const practiceInfo = await practiceInfoService.getCurrentPracticeInfo();
        if (practiceInfo) {
          setPracticeInfoId(practiceInfo._id || practiceInfo.id);
          if (practiceInfo.officeTimings && Object.keys(practiceInfo.officeTimings).length > 0) {
            // Merge fetched settings over default settings to avoid undefined fields
            setTimings(prev => ({
              cycles: practiceInfo.officeTimings.cycles || prev.cycles,
              openingHours: { ...prev.openingHours, ...practiceInfo.officeTimings.openingHours },
              schedulingAppt: { ...prev.schedulingAppt, ...practiceInfo.officeTimings.schedulingAppt }
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch practice info:', error);
        showSnackbar('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showSnackbar]);

  const handleAddCycle = () => {
    if (!newCycle.name) return;
    setTimings(prev => ({
      ...prev,
      cycles: [...(prev.cycles || []), { id: Date.now().toString(), ...newCycle }]
    }));
    setNewCycle({ name: '', fromDate: '', toDate: '' });
    setShowAddCycle(false);
  };

  const handleDeleteCycle = (id) => {
    setTimings(prev => ({
      ...prev,
      cycles: (prev.cycles || []).filter(c => c.id !== id)
    }));
  };

  const handleSave = async () => {
    if (!practiceInfoId) {
      showSnackbar('Practice Info not found', 'error');
      return;
    }
    try {
      await practiceInfoService.updateOfficeTimings(practiceInfoId, timings);
      showSnackbar('Office timings saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to save office timings', 'error');
    }
  };

  const handleTimingChange = (section, day, field, value) => {
    setTimings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [day]: {
          ...prev[section][day],
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="caption"
            component={RouterLink}
            to="/admin/practice-setup"
            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Practice Setup
          </Typography>
          <Typography variant="caption" color="textSecondary">{'>'}</Typography>
          <Typography variant="caption" color="textSecondary">Office Timings</Typography>
        </Box>

        {/* Header Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={4}>
          <Button variant="outlined" color="primary" sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}>
            Re-Generate
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
          >
            Save Timings
          </Button>
        </Box>

        {/* Cycles Section */}
        <Box mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">Cycles</Typography>
            <Button 
              variant="contained" 
              onClick={() => setShowAddCycle(true)}
              sx={{ bgcolor: '#003366', borderRadius: 5, textTransform: 'none' }}
            >
              Add Cycle
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {(timings.cycles || []).map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{cycle.name}</TableCell>
                    <TableCell>
                      {cycle.fromDate && <>From <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>{cycle.fromDate}</Typography></>}
                    </TableCell>
                    <TableCell>
                      {cycle.toDate && <>To <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>{cycle.toDate}</Typography></>}
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>Show details</Typography>
                        <InfoOutlinedIcon fontSize="small" sx={{ color: '#ccc', mr: 2 }} />
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteCycle(cycle.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {showAddCycle && (
                  <TableRow>
                    <TableCell>
                      <TextField 
                        size="small" 
                        placeholder="Name (e.g. Summer)" 
                        value={newCycle.name} 
                        onChange={(e) => setNewCycle(p => ({ ...p, name: e.target.value }))}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField 
                        size="small" 
                        placeholder="From (e.g. Jun 1)" 
                        value={newCycle.fromDate} 
                        onChange={(e) => setNewCycle(p => ({ ...p, fromDate: e.target.value }))}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField 
                        size="small" 
                        placeholder="To (e.g. Aug 31)" 
                        value={newCycle.toDate} 
                        onChange={(e) => setNewCycle(p => ({ ...p, toDate: e.target.value }))}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="contained" onClick={handleAddCycle} sx={{ mr: 1, textTransform: 'none' }}>Add</Button>
                      <Button size="small" variant="outlined" onClick={() => setShowAddCycle(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell colSpan={3} sx={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer' }}>+ Add Exceptions</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>233 Exception/s</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Schedules Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="bold">Schedules</Typography>
            <Button variant="contained" sx={{ bgcolor: '#003366', borderRadius: 5, textTransform: 'none' }}>
              Add Schedule
            </Button>
          </Box>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            {(timings.cycles || []).map((cycle, i) => (
              <Tab key={cycle.id} label={cycle.name} sx={{ textTransform: 'none' }} />
            ))}
          </Tabs>

          <Paper variant="outlined" sx={{ p: 3 }}>
            {/* Opening Hours */}
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Opening hours:</Typography>
            {days.map((day) => {
              const rowData = timings.openingHours[day] || {};
              return (
                <Box key={day} display="flex" alignItems="center" mb={1.5} sx={{ height: 40 }}>
                  <Typography variant="body2" sx={{ width: 120 }}>{day}</Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ opacity: rowData.closed ? 0.5 : 1 }}>from</Typography>
                    <TextField 
                      size="small" 
                      value={rowData.from || ''} 
                      onChange={(e) => handleTimingChange('openingHours', day, 'from', e.target.value)}
                      disabled={rowData.closed}
                      sx={{ width: 100 }} 
                      inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} 
                    />
                    <Typography variant="caption" sx={{ opacity: rowData.closed ? 0.5 : 1 }}>to</Typography>
                    <TextField 
                      size="small" 
                      value={rowData.to || ''} 
                      onChange={(e) => handleTimingChange('openingHours', day, 'to', e.target.value)}
                      disabled={rowData.closed}
                      sx={{ width: 100 }} 
                      inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} 
                    />
                    <Box display="flex" alignItems="center" ml="auto">
                      <Checkbox 
                        size="small" 
                        checked={!!rowData.closed}
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
              const rowData = timings.schedulingAppt[day] || {};
              return (
                <Box key={`appt-${day}`} display="flex" alignItems="center" mb={1.5} sx={{ height: 40 }}>
                  <Typography variant="body2" sx={{ width: 120 }}>{day}</Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ opacity: rowData.closed ? 0.5 : 1 }}>from</Typography>
                    <TextField 
                      size="small" 
                      value={rowData.from || ''} 
                      onChange={(e) => handleTimingChange('schedulingAppt', day, 'from', e.target.value)}
                      disabled={rowData.closed}
                      sx={{ width: 100 }} 
                      inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} 
                    />
                    <Typography variant="caption" sx={{ opacity: rowData.closed ? 0.5 : 1 }}>to</Typography>
                    <TextField 
                      size="small" 
                      value={rowData.to || ''} 
                      onChange={(e) => handleTimingChange('schedulingAppt', day, 'to', e.target.value)}
                      disabled={rowData.closed}
                      sx={{ width: 100 }} 
                      inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} 
                    />
                    <Box display="flex" alignItems="center" ml="auto">
                      <Checkbox 
                        size="small" 
                        checked={!!rowData.closed}
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
      </Box>
    </LocalizationProvider>
  );
};

export default OfficeTimings;
