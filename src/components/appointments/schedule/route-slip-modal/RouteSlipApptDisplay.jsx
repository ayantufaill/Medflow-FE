import React from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { InfoRow } from './RouteSlipShared';
import { providerLabel } from '../../new-appointment/helpers';

export const RouteSlipApptDisplay = ({ appt, OPERATORY_COLUMNS }) => {
  if (!appt) return null;
  
  const formatTime = (a) => {
    if (a.time) return a.time;
    if (a.startTime && typeof a.startTime === 'string' && a.startTime.includes(':')) {
      const [h, m] = a.startTime.split(':');
      let hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      return `${hour}:${m || '00'} ${ampm}`;
    }
    return dayjs(a.appointmentDate || a.start).format('h:mm A');
  };

  const time = formatTime(appt);
  let typeLabel = '--';
  const rawProcedures = appt.customFields?.procedures || appt.procedures;
  
  if (typeof rawProcedures === 'string') {
    typeLabel = rawProcedures;
  } else if (Array.isArray(rawProcedures) && rawProcedures.length > 0) {
    typeLabel = rawProcedures.map(p => {
      if (typeof p === 'string') return p;
      return p.name || p.treatment || p.code;
    }).filter(Boolean).join(', ');
  }
  
  if (typeLabel === '--' || !typeLabel) {
    typeLabel = appt.title || appt.appointmentType?.name || '--';
  }

  const providerName = providerLabel(appt.provider || appt.providerId) || '--';
  
  // Attempt to match the room using OPERATORY_COLUMNS logic
  const resolvedRoom = OPERATORY_COLUMNS.find(c => c.id === appt.columnId || c.id === `op${appt.roomId}`);
  
  let roomName = resolvedRoom?.label || appt.room?.name || appt.columnId;
  
  // If it's a raw string like "op1", format it cleanly
  if (typeof roomName === 'string' && /^op\s*\d+$/i.test(roomName)) {
    roomName = `Op ${roomName.replace(/^op\s*/i, '')}`;
  }
  
  if (!roomName) roomName = '--';
  
  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <InfoRow label="Time" value={time} />
      <InfoRow label="Type/Procedure" value={typeLabel} />
      <InfoRow label="Provider" value={providerName} />
      <InfoRow label="Room" value={roomName} />
    </Box>
  );
};
