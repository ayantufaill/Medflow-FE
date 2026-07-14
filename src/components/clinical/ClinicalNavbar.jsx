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

import examIcon from '../../assets/clinicalicons/examicon.svg';
import diagnosticOpinionIcon from '../../assets/clinicalicons/diagnosticopinionicon.svg';
import treatmentPlanIcon from '../../assets/clinicalicons/treatmentplanicon.svg';
import adjunctiveTherapyIcon from '../../assets/clinicalicons/adjunctivetherapyicon.svg';
import rxIcon from '../../assets/clinicalicons/RX icon.svg';
import referralIcon from '../../assets/clinicalicons/referralicon.svg';
import progressNoteIcon from '../../assets/clinicalicons/progressnoteicon.svg';
import labCaseIcon from '../../assets/clinicalicons/labcaseicon.svg';
import aiConversationIcon from '../../assets/clinicalicons/AIconversationicon.svg';

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
    if (selectedPatientId && (!currentPatient || (String(currentPatient._id) !== String(selectedPatientId) && String(currentPatient.id) !== String(selectedPatientId)))) {
      dispatch(fetchPatientById(selectedPatientId));
    }
  }, [selectedPatientId, currentPatient, dispatch]);

  useEffect(() => {
    if (selectedAppointmentId && (!currentAppointment || (String(currentAppointment._id) !== String(selectedAppointmentId) && String(currentAppointment.id) !== String(selectedAppointmentId)))) {
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
    { id: 'exam', label: 'EXAM', path: '/clinical/exam/radiographic', icon: examIcon },
    { id: 'diagnostic', label: 'DIAGNOSTIC OPINION', path: '/clinical/diagnostic-opinion/biomechanical', disabled: true, icon: diagnosticOpinionIcon },
    { id: 'treatment', label: 'TREATMENT PLAN', path: '/clinical/treatment-plan', icon: treatmentPlanIcon },
    { id: 'adjunctive', label: 'ADJUNCTIVE THERAPY', path: '/clinical/adjunctive-therapy', disabled: true, icon: adjunctiveTherapyIcon },
    { id: 'rx', label: 'RX', path: '/clinical/rx', disabled: true, icon: rxIcon },
    { id: 'referral', label: 'REFERRAL', path: '/clinical/referral', disabled: true, icon: referralIcon },
    { id: 'progress', label: 'PROGRESS NOTES', path: '/clinical/progress-notes', icon: progressNoteIcon },
    { id: 'lab', label: 'LAB CASE', path: '/clinical/lab-case', disabled: true, icon: labCaseIcon },
    { id: 'ai', label: 'AI CONVERSATIONS', path: '/clinical/ai-conversation', disabled: true, icon: aiConversationIcon },
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

    const providerName = (() => {
      const prov = currentAppointment?.providerId;
      if (!prov) return '';
      if (typeof prov !== 'object') return prov;
      // Backend: { _id, providerCode, userId: { firstName, lastName } }
      const user = prov.userId;
      if (user && typeof user === 'object') {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        if (name) return name;
      }
      const directName = `${prov.firstName || ''} ${prov.lastName || ''}`.trim();
      if (directName) return directName;
      return prov.providerCode || '';
    })();

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
    <Box sx={{ width: '100%', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
      {/* {renderContextBanner()} */}
      <Stack direction="row" sx={{ px: 2, overflowX: 'auto', gap: 4 }}>
        {clinicalSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <Box
              key={section.id}
              onClick={() => !section.disabled && navigate(section.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1.5,
                cursor: section.disabled ? 'default' : 'pointer',
                opacity: section.disabled ? 0.5 : 1,
                borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                color: isActive ? '#2563eb' : '#6b7280',
                transition: 'all 0.2s',
                '&:hover': {
                  color: section.disabled ? '#6b7280' : '#2563eb'
                }
              }}
            >
              <img 
                src={section.icon} 
                alt={section.label} 
                style={{ 
                  width: 18, 
                  height: 18,
                  filter: isActive ? 'invert(27%) sepia(85%) saturate(2462%) hue-rotate(212deg) brightness(96%) contrast(92%)' : 'grayscale(100%) opacity(0.6)' 
                }} 
              />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                {section.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ClinicalNavbar;
