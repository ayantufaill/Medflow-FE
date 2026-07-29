import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentPracticeInfo,
  updateOfficeTimings as updateOfficeTimingsThunk,
} from '../../store/slices/practiceInfoSlice';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSnackbar } from '../../contexts/SnackbarContext';
import OfficeTimingCycles from '../../components/admin/office-timings/OfficeTimingCycles';
import OfficeTimingScheduleEditor from '../../components/admin/office-timings/OfficeTimingScheduleEditor';

dayjs.extend(customParseFormat);

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
  const dispatch = useDispatch();
  const { data: practiceData, loading, updateLoading } = useSelector((state) => state.practiceInfo);

  const [timings, setTimings] = useState(defaultTimings);
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [newCycle, setNewCycle] = useState({ name: '', fromDate: '', toDate: '' });
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  useEffect(() => {
    if (practiceData && practiceData.officeTimings && Object.keys(practiceData.officeTimings).length > 0) {
      setTimings(prev => ({
        cycles: practiceData.officeTimings.cycles || prev.cycles,
        openingHours: { ...prev.openingHours, ...practiceData.officeTimings.openingHours },
        schedulingAppt: { ...prev.schedulingAppt, ...practiceData.officeTimings.schedulingAppt }
      }));
    }
  }, [practiceData]);

  const handleAddCycle = () => {
    if (!newCycle.name) return;
    setTimings((prev) => ({
      ...prev,
      cycles: [...(prev.cycles || []), { id: Date.now().toString(), ...newCycle }],
    }));
    setNewCycle({ name: '', fromDate: '', toDate: '' });
    setShowAddCycle(false);
  };

  const handleDeleteCycle = (id) => {
    setTimings((prev) => ({
      ...prev,
      cycles: (prev.cycles || []).filter((c) => c.id !== id),
    }));
  };

  const handleCycleFieldChange = (field, value) => {
    setNewCycle((prev) => ({ ...prev, [field]: value }));
  };

  const validateTimes = () => {
    for (const section of ['openingHours', 'schedulingAppt']) {
      for (const day of days) {
        const { from, to, closed } = timings[section][day];
        if (!closed && from && to) {
          const fromTime = dayjs(from, ['hh:mm A', 'h:mm A']);
          const toTime = dayjs(to, ['hh:mm A', 'h:mm A']);
          if (fromTime.isValid() && toTime.isValid() && fromTime.isAfter(toTime)) {
            showSnackbar(`${section === 'openingHours' ? 'Opening Hours' : 'Scheduling Appt'} on ${day}: 'From' time must be before 'To' time.`, 'error');
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateTimes()) return;

    try {
      if (!practiceData || (!practiceData._id && !practiceData.id)) {
        showSnackbar('Practice Information not found. Please fill it out first.', 'error');
        return;
      }
      const id = practiceData._id || practiceData.id;
      await dispatch(updateOfficeTimingsThunk({ practiceInfoId: id, officeTimingsData: timings })).unwrap();
      showSnackbar('Office timings saved successfully', 'success');
    } catch (error) {
      showSnackbar(error || 'Failed to save office timings', 'error');
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

  if (loading && !practiceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          bgcolor: '#FBFCFE',
          borderRadius: '12px',
          border: '1px solid #DFE5EC',
          p: { xs: 2, sm: 3, md: 4 },
          fontFamily: '"Segoe UI", sans-serif'
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#11223F">
            Office Timings
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                height: '30.67px',
                px: 2,
                fontSize: '12px',
                borderRadius: '8px',
                borderColor: '#3B63E0',
                color: '#3B63E0',
                '&:hover': {
                  borderColor: '#2f51bd',
                  backgroundColor: 'rgba(59, 99, 224, 0.08)',
                },
              }}
            >
              Re-Generate
            </Button>
            <Button
              variant="contained"
              startIcon={updateLoading ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ width: 14, height: 14 }} />}
              onClick={handleSave}
              disabled={updateLoading}
              sx={{
                height: '30.67px',
                borderRadius: '8px',
                bgcolor: '#3B63E0',
                textTransform: 'none',
                fontSize: '12px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#2f51bd',
                  boxShadow: 'none'
                }
              }}
            >
              {updateLoading ? 'Saving...' : 'Save Timings'}
            </Button>
          </Box>
        </Box>

        {/* Cycles Section */}
          <Box sx={{ mb: 3 }}>
            <OfficeTimingCycles
              cycles={timings.cycles || []}
              showAddCycle={showAddCycle}
              newCycle={newCycle}
              onShowAddCycle={() => setShowAddCycle(true)}
              onCycleFieldChange={handleCycleFieldChange}
              onAddCycle={handleAddCycle}
              onCancelAddCycle={() => setShowAddCycle(false)}
              onDeleteCycle={handleDeleteCycle}
            />
          </Box>

          {/* Schedule Section */}
          <Box sx={{ mb: 3 }}>
            <OfficeTimingScheduleEditor
              days={days}
              timings={timings}
              onTimingChange={handleTimingChange}
            />
          </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default OfficeTimings;
