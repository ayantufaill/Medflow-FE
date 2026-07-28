import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentPracticeInfo,
  createPracticeInfo,
  updateOnlineSchedule,
  selectPracticeInfo,
  selectPracticeInfoLoading
} from '../../store/slices/practiceInfoSlice';
import { fetchProviders, selectProviderList } from '../../store/slices/providerSlice';
import { fetchRooms, deleteRoom, selectRoomList } from '../../store/slices/roomSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import SchedulingDetailsSection from '../../components/admin/online-schedule/SchedulingDetailsSection';
import AppointmentTypesSection from '../../components/admin/online-schedule/AppointmentTypesSection';
import ProvidersSetupSection from '../../components/admin/online-schedule/ProvidersSetupSection';
import OperatorySetupSection from '../../components/admin/online-schedule/OperatorySetupSection';
import AnalyticsSetupSection from '../../components/admin/online-schedule/AnalyticsSetupSection';

const deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;

  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] instanceof Array) {
      output[key] = source[key];
    } else if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  });
  return output;
};

const defaultSettings = {
  enableOnlineScheduling: true,
  bookLessThanHours: '4',
  bookMoreThanDays: '28',
  requireCreditCard: true,
  rules: [
    { title: "Cancellation Policy", body: "If you can't make it to your appointment, please cancel 2 days in advance to avoid a $100 short notice fee.", enabled: true },
    { title: "No Show Fee", body: "A fee of $100 will be charged for no shows.", enabled: true },
    { title: "Secure Appointment", body: "A Credit Card is required to secure your appointment.", enabled: true }
  ],
  enabledAppointmentTypes: ['Exam', 'Emergency', 'Cleaning', 'Online Consult']
};

const OnlineScheduleConfiguration = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [providerSearch, setProviderSearch] = useState('');
  const [providerSpecialty, setProviderSpecialty] = useState('');
  const { showSnackbar } = useSnackbar();
  const practiceInfo = useSelector(selectPracticeInfo);
  const loading = useSelector(selectPracticeInfoLoading);
  const providersData = useSelector(selectProviderList);
  const operatoriesData = useSelector(selectRoomList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
    dispatch(fetchProviders({ page: 1, limit: 100 }));
    dispatch(fetchRooms({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (practiceInfo?.onlineSchedule && Object.keys(practiceInfo.onlineSchedule).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings(prev => deepMerge(prev, practiceInfo.onlineSchedule));
    }
  }, [practiceInfo?.onlineSchedule]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRuleChange = (index, field, value) => {
    setSettings(prev => {
      const newRules = [...prev.rules];
      newRules[index] = { ...newRules[index], [field]: value };
      return { ...prev, rules: newRules };
    });
  };

  const handleApptTypeToggle = (type) => {
    setSettings(prev => {
      const isEnabled = prev.enabledAppointmentTypes.includes(type);
      return {
        ...prev,
        enabledAppointmentTypes: isEnabled
          ? prev.enabledAppointmentTypes.filter(t => t !== type)
          : [...prev.enabledAppointmentTypes, type]
      };
    });
  };

  const handleSave = async () => {
    try {
      let id = practiceInfo?._id || practiceInfo?.id;
      if (!id) {
        const newPractice = await dispatch(createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: {
            line1: '123 Default St',
            city: 'Metropolis',
            state: 'NY',
            postalCode: '10001',
            country: 'United States'
          }
        })).unwrap();
        id = newPractice._id || newPractice.id;
      }

      await dispatch(updateOnlineSchedule({
        practiceInfoId: id,
        onlineScheduleData: settings
      })).unwrap();
      showSnackbar('Online Schedule configuration saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to save configuration', 'error');
    }
  };

  const handleDeleteOperatory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operatory?')) return;
    try {
      await dispatch(deleteRoom(id)).unwrap();
      showSnackbar('Operatory deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to delete operatory', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
          Online Schedule
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon sx={{ width: 14, height: 14 }} />}
            onClick={handleSave}
            sx={{
              width: '166.59px',
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
            Save Configuration
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Section 1 — Scheduling Details */}
      <SchedulingDetailsSection
        settings={settings}
        onSettingsChange={handleChange}
        onRuleChange={handleRuleChange}
      />

      {/* Section 2 — Appointment Types Setup */}
      <AppointmentTypesSection
        enabledTypes={settings.enabledAppointmentTypes}
        onToggleType={handleApptTypeToggle}
      />

      {/* Section 3 — Providers Setup */}
      <ProvidersSetupSection
        providers={providersData}
        providerSearch={providerSearch}
        providerSpecialty={providerSpecialty}
        onSearchChange={setProviderSearch}
        onSpecialtyChange={setProviderSpecialty}
      />

      {/* Section 4 — Operatory Setup */}
      <OperatorySetupSection
        operatories={operatoriesData}
        onDeleteOperatory={handleDeleteOperatory}
      />

      {/* Section 5 — Analytics Setup */}
      <AnalyticsSetupSection />

      </Box>
    </Box>
  );
};

export default OnlineScheduleConfiguration;
