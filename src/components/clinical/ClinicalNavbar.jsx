import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Paper, Typography, Avatar, Chip, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { 
  selectSelectedPatientId, 
  selectCurrentPatient, 
  fetchPatientById,
  clearCurrentPatient
} from '../../store/slices/patientSlice';
import { 
  selectSelectedAppointmentId, 
  selectCurrentAppointment, 
  fetchAppointmentById,
  clearCurrentAppointment
} from '../../store/slices/appointmentSlice';
import { 
  Person as PersonIcon, 
  CalendarToday as CalendarIcon, 
  Warning as WarningIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ClinicalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const selectedPatientId = useSelector(selectSelectedPatientId);
  const selectedAppointmentId = useSelector(selectSelectedAppointmentId);
  const currentPatient = useSelector(selectCurrentPatient);
  const currentAppointment = useSelector(selectCurrentAppointment);

  // Fetch missing detail context if IDs are present but data is empty
  useEffect(() => {
    if (selectedPatientId && (!currentPatient || (currentPatient._id !== selectedPatientId && currentPatient.id !== selectedPatientId))) {
      dispatch(fetchPatientById(selectedPatientId));
    }
  }, [selectedPatientId, currentPatient, dispatch]);

  useEffect(() => {
    if (selectedAppointmentId && (!currentAppointment || (currentAppointment._id !== selectedAppointmentId && currentAppointment.id !== selectedAppointmentId))) {
      dispatch(fetchAppointmentById(selectedAppointmentId));
    }
  }, [selectedAppointmentId, currentAppointment, dispatch]);
  
  // Extract section from pathname
  const getPathnameSection = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/clinical/')) {
      const section = pathname.replace('/clinical/', '');
      // Map section names to IDs
      const sectionMap = {
        'exam': 'exam',
        'diagnostic-opinion': 'diagnostic',
        'diagnostic-opinion/periodontal': 'diagnostic',
        'diagnostic-opinion/biomechanical': 'diagnostic',
        'diagnostic-opinion/functional': 'diagnostic',
        'diagnostic-opinion/dentofacial': 'diagnostic',
        'treatment-plan': 'treatment',
        'adjunctive-therapy': 'adjunctive',
        'rx': 'rx',
        'referral': 'referral',
        'progress-notes': 'progress',
        'lab-case': 'lab',
        'ai-conversation': 'ai',
      };
      return sectionMap[section] || 'exam';
    }
    return 'exam';
  };
  
  const activeSection = getPathnameSection();

  // Navigation sections for the clinical page
  const clinicalSections = [
    { id: 'exam', label: 'EXAM', path: '/clinical/exam/radiographic' },
    { id: 'diagnostic', label: 'DIAGNOSTIC OPINION', path: '/clinical/diagnostic-opinion/biomechanical', disabled: true },
    { id: 'treatment', label: 'TREATMENT PLAN', path: '/clinical/treatment-plan' },
    { id: 'adjunctive', label: 'ADJUNCTIVE THERAPY', path: '/clinical/adjunctive-therapy', disabled: true },
    { id: 'rx', label: 'RX', path: '/clinical/rx', disabled: true },
    { id: 'referral', label: 'REFERRAL', path: '/clinical/referral', disabled: true },
    { id: 'progress', label: 'PROGRESS NOTES', path: '/clinical/progress-notes' },
    { id: 'lab', label: 'LAB CASE', path: '/clinical/lab-case', disabled: true },
    { id: 'ai', label: 'AI CONVERSATION', path: '/clinical/ai-conversation', disabled: true },
  ];

  const getInitials = (patient) => {
    if (!patient) return '';
    const first = patient.firstName || '';
    const last = patient.lastName || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const getAge = (dob) => {
    if (!dob) return '';
    return dayjs().diff(dayjs(dob), 'year') + ' years old';
  };

  const formatApptTime = (appt) => {
    if (!appt) return '';
    const dateStr = appt.appointmentDate ? dayjs(appt.appointmentDate).format('MMM DD, YYYY') : dayjs(appt.start).format('MMM DD, YYYY');
    let start = '';
    let end = '';
    if (appt.startTime) {
      start = dayjs(`2000-01-01T${appt.startTime}`).format('h:mm A');
      end = appt.endTime ? dayjs(`2000-01-01T${appt.endTime}`).format('h:mm A') : '';
    } else if (appt.start) {
      start = dayjs(appt.start).format('h:mm A');
      end = appt.end ? dayjs(appt.end).format('h:mm A') : '';
    }
    return `${dateStr}${start ? ` @ ${start}${end ? ` - ${end}` : ''}` : ''}`;
  };

  const renderContextBanner = () => {
    if (!selectedPatientId || !selectedAppointmentId) {
      return (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2.5,
            borderColor: 'warning.light',
            bgcolor: 'warning.lightest',
            background: 'rgba(255, 243, 205, 0.08)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarningIcon color="warning" />
            <Typography variant="body2" color="warning.main" fontWeight={500}>
              No active patient or appointment selected. Please select one from the Schedule to bind clinical exams.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => navigate('/appointments/operatory-schedule')}
            sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 600 }}
          >
            Go to Schedule
          </Button>
        </Paper>
      );
    }

    const patientName = currentPatient 
      ? `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim() 
      : 'Loading Patient...';
    
    const apptDetails = currentAppointment 
      ? formatApptTime(currentAppointment) 
      : 'Loading Appointment...';

    const providerName = currentAppointment?.providerId 
      ? (typeof currentAppointment.providerId === 'object' 
        ? `${currentAppointment.providerId.firstName || ''} ${currentAppointment.providerId.lastName || ''}`.trim() 
        : currentAppointment.providerId)
      : '';

    const roomLabel = currentAppointment?.roomId ? `Op ${currentAppointment.roomId}` : '';

    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText',
                fontWeight: 600,
                width: 44,
                height: 44,
                boxShadow: '0 2px 10px rgba(43, 108, 176, 0.2)'
              }}
            >
              {currentPatient ? getInitials(currentPatient) : <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2 }}>
                {patientName}
              </Typography>
              {currentPatient && (
                <Typography variant="caption" color="text.secondary">
                  {currentPatient.gender ? `${currentPatient.gender} • ` : ''}
                  {currentPatient.dateOfBirth ? `${getAge(currentPatient.dateOfBirth)} (${dayjs(currentPatient.dateOfBirth).format('MM/DD/YYYY')})` : ''}
                </Typography>
              )}
            </Box>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 1 }} />

          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Active Appointment
              </Typography>
              {currentAppointment?.status && (
                <Chip 
                  label={currentAppointment.status.toUpperCase()} 
                  size="small" 
                  color={
                    currentAppointment.status === 'completed' ? 'success' :
                    currentAppointment.status === 'checked_in' ? 'warning' : 'primary'
                  }
                  sx={{ height: 18, fontSize: '0.625rem', fontWeight: 700 }}
                />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {apptDetails}
              {providerName ? ` • Provider: ${providerName}` : ''}
              {roomLabel ? ` • ${roomLabel}` : ''}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                dispatch(clearCurrentPatient());
                dispatch(clearCurrentAppointment());
                navigate('/appointments/operatory-schedule');
              }}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 1.5, 
                fontSize: '0.75rem', 
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'error.light',
                  color: 'error.main',
                  bgcolor: 'rgba(239, 68, 68, 0.04)'
                }
              }}
            >
              Clear Session
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box>
      {renderContextBanner()}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {clinicalSections.map((section) => (
          <Button
            key={section.id}
            variant="text"
            size="small"
            disabled={section.disabled}
            onClick={() => !section.disabled && navigate(section.path)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
              py: 1,
              px: 1.5,
              borderRadius: 1,
              bgcolor: activeSection === section.id ? 'primary.main' : 'grey.100',
              color: activeSection === section.id ? 'primary.contrastText' : 'text.primary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: activeSection === section.id ? 'primary.dark' : 'grey.200',
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.100',
                color: 'grey.400',
                opacity: 0.7
              }
            }}
          >
            {section.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ClinicalNavbar;
