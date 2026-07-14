import { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, IconButton } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { useDispatch } from 'react-redux';
import { updateAppointmentThunk } from '../../../store/slices/appointmentSlice';
import { COLORS } from '../../../constants/colors';
import { fontWeight } from '../../../constants/styles';
import { STATUS_OPTIONS } from '../new-appointment/constants';

const STATUS_CONFIG = {
  PRECONFIRMED: { bg: COLORS.STATUS_PRECONFIRMED },
  UNCONFIRMED: { bg: COLORS.STATUS_UNCONFIRMED },
  CONFIRMED: { bg: COLORS.STATUS_CONFIRMED },
};



// Single-color status stripe to match AppointmentCard
const StatusBanner = ({ status }) => {
  const s = String(status || 'UNCONFIRMED').toUpperCase();
  const statusCfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.CONFIRMED;
  return (
    <Box sx={{ backgroundColor: statusCfg.bg, py: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ fontSize: '9px', fontWeight: fontWeight.bold, color: '#fff', letterSpacing: '0.7px' }}>
        {s.replace(/_/g, ' ')}
      </Typography>
    </Box>
  );
};

// Receives the appointment object directly as a prop from LeftPanel
const AppointmentSummaryCard = ({ appointment }) => {
  const dispatch = useDispatch();

  // Local state for optimistic UI updates
  const [localStatus, setLocalStatus] = useState(String(appointment?.status || 'unconfirmed').toLowerCase());

  // Sync local status when a new appointment is selected
  useEffect(() => {
    if (appointment) {
      setLocalStatus(String(appointment.status || 'unconfirmed').toLowerCase());
    }
  }, [appointment?.id, appointment?._id, appointment?.status]);

  if (!appointment) return null;

  const visitType = 
    appointment.visitType || 
    appointment.customFields?.visitType ||
    appointment.workspace?.visitType ||
    appointment.appointmentTypeId?.name || 
    (typeof appointment.appointmentType === 'object' ? appointment.appointmentType?.name : null) ||
    appointment.appointmentTypeName || 
    (typeof appointment.appointmentType === 'string' && appointment.appointmentType !== 'consultation' ? appointment.appointmentType : null) || 
    'APPOINTMENT';
  
  let formattedTime = appointment.time || appointment.startTime || '';
  if (formattedTime && typeof formattedTime === 'string' && formattedTime.includes(':')) {
    const timeRegex = /^(\d{1,2}):(\d{2})(?:\s?(AM|PM|am|pm))?/;
    const match = formattedTime.match(timeRegex);
    if (match) {
      let hour = parseInt(match[1], 10);
      const min = match[2];
      const existingAmpm = match[3];
      
      if (!existingAmpm) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        formattedTime = `${hour}:${min} ${ampm}`;
      } else {
        formattedTime = `${hour}:${min} ${existingAmpm.toUpperCase()}`;
      }
    }
  }

  const time = formattedTime;
  let rawProcedures = 
    appointment.chiefComplaint || 
    appointment.workspace?.procedures ||
    appointment.customFields?.procedures ||
    appointment.procedures || 
    appointment.appointmentProcedures ||
    appointment.procedureCodes ||
    appointment.customFields?.procedureTags ||
    appointment.description || 
    appointment.note ||
    '';
    
  if (Array.isArray(rawProcedures)) {
    rawProcedures = rawProcedures.map(p => typeof p === 'string' ? p : (p.name || p.treatment || p.code)).filter(Boolean).join(', ');
  } else if (typeof rawProcedures === 'string' && rawProcedures.includes(',')) {
    rawProcedures = rawProcedures.split(',').map(p => p.trim()).join(', ');
  } else if (typeof rawProcedures !== 'string') {
    rawProcedures = '';
  }
  const procedures = rawProcedures;

  let rawProvider = 
    appointment.provider || 
    appointment.providerId || 
    appointment.providerName || 
    appointment.customFields?.providerRows?.[0]?.providerId ||
    appointment.customFields?.providers?.[0]?.providerId ||
    appointment.customFields?.providers?.[0] ||
    appointment.ProvNum ||
    '';
    
  if (typeof rawProvider === 'object' && rawProvider !== null) {
    rawProvider = rawProvider.name || 
                  `${rawProvider.firstName || ''} ${rawProvider.lastName || ''}`.trim() || 
                  `${rawProvider.userId?.firstName || ''} ${rawProvider.userId?.lastName || ''}`.trim() ||
                  rawProvider.providerCode ||
                  '';
  }
  const provider = typeof rawProvider === 'string' ? rawProvider : '';

  // Provider initials for the blue avatar
  const initials = provider
    ? provider.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus); // Optimistic update
    
    const id = appointment.id || appointment._id;
    if (id) {
      dispatch(updateAppointmentThunk({ appointmentId: id, payload: { status: newStatus } }));
    }
  };

  return (
    <Box sx={{ border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: '10px', overflow: 'hidden', mt: '8px', mb: '2px', backgroundColor: COLORS.WHITE }}>

      {/* Header matching calendar cards: uses appointment.headerColor */}
      <Box sx={{ backgroundColor: appointment.headerColor || COLORS.ACCENT, px: '8px', py: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: '#fff', letterSpacing: '0.5px' }}>
          {String(visitType).toUpperCase()}
        </Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.semibold, color: '#fff' }}>
          {time}
        </Typography>
      </Box>

      {/* Status stripe */}
      <StatusBanner status={localStatus} />

      {/* Body */}
      <Box sx={{ px: '12px', py: '8px' }}>
        {/* Status dropdown + action icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '8px' }}>
          <Select
            value={localStatus}
            onChange={handleStatusChange}
            size="small"
            sx={{ height: 28, fontSize: '12px', minWidth: 130, borderRadius: '6px', bgcolor: '#fff', '& .MuiSelect-select': { py: '4px', pl: '10px' } }}
            MenuProps={{
              PaperProps: { style: { maxHeight: 250 } },
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
              sx: { zIndex: 1600 },
            }}
          >
            {STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '12px' }}>{opt.label}</MenuItem>
            ))}
          </Select>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <IconButton size="small" sx={{ p: '4px', color: COLORS.ACCENT }}>
              <MailOutlineIcon sx={{ fontSize: '16px' }} />
            </IconButton>
            <IconButton size="small" sx={{ p: '4px', color: COLORS.ACCENT }}>
              <ChatOutlinedIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Procedures text + provider avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_BODY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, mr: '8px' }}>
            {procedures || 'No procedures listed'}
          </Typography>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: COLORS.ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: '#fff' }}>
              {initials}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentSummaryCard;
