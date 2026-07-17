import { Box, Typography } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useSelector } from 'react-redux';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { useDispatch } from 'react-redux';
import { deleteAppointmentThunk } from '../../../store/slices/appointmentSlice';

const DraggablePendingAppt = ({ appt }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pending-appt-${appt._id || appt.id || appt.AptNum}`,
    data: {
      isPendingItem: true,
      type: "appointment",
      id: appt._id || appt.id || appt.AptNum,
      originalData: appt
    }
  });

  const patientObj = appt.patient || (typeof appt.patientId === 'object' ? appt.patientId : null);
  const patientName = patientObj 
    ? `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim()
    : appt.patientName || 'Unknown Patient';

  const typeName = appt.appointmentType?.name || appt.appointmentTypeId?.name || appt.appointmentType || 'Appointment';
  
  const dispatch = useDispatch();
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      dispatch(deleteAppointmentThunk(appt._id || appt.id || appt.AptNum));
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'Unknown Patient') return 'UP';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  const duration = appt.durationMinutes || 60;

  return (
    <Box 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      sx={{ 
        p: '12px', 
        border: `1px solid ${COLORS.BORDER}`, 
        borderRadius: radius.md, 
        textAlign: 'left', 
        backgroundColor: COLORS.WHITE,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT, fontSize: '12px', fontWeight: fontWeight.bold }}>
            {getInitials(patientName)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
              {patientName}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.medium }}>
              {typeName}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleDelete} sx={{ color: COLORS.TEXT_SECONDARY, p: '2px', '&:hover': { color: COLORS.DANGER } }} onPointerDown={(e) => e.stopPropagation()}>
          <DeleteIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '12px' }}>
        <Box sx={{ backgroundColor: '#eefcf3', color: '#16a34a', px: '6px', py: '2px', borderRadius: '4px', fontSize: '10px', fontWeight: fontWeight.bold }}>
          APPOINTMENT
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: COLORS.TEXT_SECONDARY }}>
          <AccessTimeIcon sx={{ fontSize: '14px' }} />
          <Typography sx={{ fontSize: '12px', fontWeight: fontWeight.medium }}>{duration} min</Typography>
        </Box>
      </Box>

      {appt.notes && (
        <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_SECONDARY, mt: '8px' }}>
          {appt.notes}
        </Typography>
      )}
    </Box>
  );
};

const DraggableWaitlistEntry = ({ entry }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pending-wl-${entry._id || entry.id}`,
    data: {
      isPendingItem: true,
      type: "waitlist",
      id: entry._id || entry.id,
      originalData: entry
    }
  });

  const patientObj = typeof entry.patientId === 'object' ? entry.patientId : null;
  const patientName = patientObj 
    ? `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim()
    : entry.patientName || 'Unknown Patient';

  return (
    <Box 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      sx={{ 
        p: '12px', 
        border: `1px solid ${COLORS.BORDER}`, 
        borderRadius: radius.md, 
        textAlign: 'left', 
        backgroundColor: COLORS.WHITE,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
      }}
    >
      <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
        {patientName}
      </Typography>
      {entry.notes && (
        <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
          {entry.notes}
        </Typography>
      )}
    </Box>
  );
};

const PendingReschedules = () => {
  const { waitlistEntries, total } = useSelector(state => state.waitlist);
  const appointmentsList = useSelector(state => state.appointment?.list || []);
  const pendingAppointments = appointmentsList.filter(a => String(a.status).toLowerCase() === 'pending');
  const combinedTotal = (total || 0) + pendingAppointments.length;

  const { setNodeRef, isOver } = useDroppable({
    id: 'pending-tab',
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        p: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px dashed ${isOver ? COLORS.ACCENT : '#bac7d5'}`,
        borderRadius: radius.lg,
        backgroundColor: isOver ? 'rgba(34, 98, 239, 0.05)' : COLORS.SURFACE_CARD,
        textAlign: 'center',
        minHeight: '250px',
        overflowY: 'auto'
      }}
    >
      <Typography
        sx={{
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: COLORS.TEXT_PRIMARY,
          mb: '32px'
        }}
      >
        Pending Reschedules ({combinedTotal})
      </Typography>

      {((waitlistEntries && waitlistEntries.length > 0) || pendingAppointments.length > 0) ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', mb: '20px' }}>
          {pendingAppointments.map(appt => (
            <DraggablePendingAppt key={`appt-${appt._id || appt.id || appt.AptNum}`} appt={appt} />
          ))}
          {waitlistEntries && waitlistEntries.map(entry => (
            <DraggableWaitlistEntry key={`wl-${entry._id || entry.id}`} entry={entry} />
          ))}
        </Box>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: COLORS.ACCENT_BG,
              borderRadius: radius.sm,
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: '20px',
            }}
          >
            <AutorenewIcon sx={{ color: COLORS.ACCENT, fontSize: '28px' }} />
          </Box>

          <Typography
            sx={{
              fontSize: fontSize.md,
              color: COLORS.TEXT_SECONDARY,
              lineHeight: 1.5,
              px: '12px'
            }}
          >
            Drag any appointment or blocked slot
            <br />
            from the calendar and drop here
          </Typography>
        </>
      )}
    </Box>
  );
};

export default PendingReschedules;
