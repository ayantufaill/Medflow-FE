import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import dayjs from 'dayjs';
import { appointmentService } from '../../../services/appointment.service';
import { COLORS } from '../../../constants/colors';

const HIDDEN_FIELDS = new Set([
  '__v',
  '_id',
  'id',
  'createdAt',
  'updatedAt',
  'operatoryId',
  'operatory',
  'procedureTags',
  'providerRows',
]);

const isHiddenField = (field) => {
  if (!field) return false;
  const fieldParts = String(field).split('.');
  return fieldParts.some((part) => HIDDEN_FIELDS.has(part));
};

const YES_NO_FIELDS = new Set([
  'insuranceVerified',
]);

const shouldUseYesNo = (field) => {
  if (!field) return false;
  const fieldParts = String(field).split('.');
  return fieldParts.some((part) => YES_NO_FIELDS.has(part));
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'On' : 'Off';
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (!item || typeof item !== 'object') return item;
      return item.treatment || item.description || item.name || item.code || item.OldCode || JSON.stringify(item);
    }).filter(Boolean).join(', ') || '-';
  }
  if (typeof value === 'object') {
    if (value.from !== undefined || value.to !== undefined) return `${formatValue(value.from)} -> ${formatValue(value.to)}`;
    if (value.firstName || value.lastName) return `${value.firstName || ''} ${value.lastName || ''}`.trim();
    return value.name || value.title || value.code || value.OldCode || value._id || value.id || JSON.stringify(value);
  }
  return String(value);
};

const formatMaybeDate = (field, value) => {
  if (shouldUseYesNo(field) && typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (!value || typeof value !== 'string') return formatValue(value);
  const normalizedField = String(field || '').toLowerCase();
  if (!normalizedField.includes('date') && !normalizedField.includes('time')) return formatValue(value);
  const parsed = dayjs(value);
  if (!parsed.isValid()) return formatValue(value);
  if (normalizedField.includes('time') && !normalizedField.includes('date')) return parsed.format('h:mm A');
  return parsed.format('MM/DD/YYYY');
};

const fieldLabel = (field) => {
  const labels = {
    _id: 'ID',
    appointmentCode: 'Appointment Code',
    appointmentDate: 'Date',
    date: 'Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    durationMinutes: 'Duration Minutes',
    patientId: 'Patient',
    status: 'Status',
    providerId: 'Provider',
    provider: 'Provider',
    roomId: 'Room',
    room: 'Room',
    appointmentType: 'Category',
    appointmentTypeName: 'Category',
    appointmentTypeId: 'Appointment Type',
    category: 'Category',
    customFields: 'Custom Fields',
    procedures: 'Procedures',
    procedureTags: 'Procedure Tags',
    colorTags: 'Color Tags',
    operatoryId: 'Operatory',
    providerRows: 'Provider Rows',
    reminderPreferences: 'Reminder Preferences',
    checklists: 'Checklists',
    insuranceVerified: 'Insurance Verified',
    copayCollected: 'Copay Collected',
    reminderSent: 'Reminder Sent',
    requiresInterpreter: 'Requires Interpreter',
    createdBy: 'Created By',
    sendReminders: 'Send reminders',
  };
  if (labels[field]) return labels[field];
  return String(field || 'Value')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
};

const getActorInitials = (entry) => {
  const actor = getActorName(entry) || 'SO';
  const parts = String(actor).trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return String(actor).slice(0, 2).toUpperCase();
};

const getActorName = (entry) => {
  const actor =
    entry?.actor?.name ||
    (entry?.actor?.firstName ? `${entry.actor.firstName} ${entry.actor.lastName || ''}`.trim() : null) ||
    entry?.actorName ||
    entry?.user?.name ||
    (entry?.user?.firstName ? `${entry.user.firstName} ${entry.user.lastName || ''}`.trim() : null) ||
    entry?.userName ||
    null;
  return actor || null;
};

const getCreatedByName = (entry, source) => {
  const sourceName =
    source?.createdByName ||
    source?.createdByUser?.name ||
    (source?.createdByUser?.firstName ? `${source.createdByUser.firstName} ${source.createdByUser.lastName || ''}`.trim() : null) ||
    source?.createdByProvider?.name ||
    (source?.createdByProvider?.firstName ? `${source.createdByProvider.firstName} ${source.createdByProvider.lastName || ''}`.trim() : null);
  return sourceName || getActorName(entry) || 'System';
};

const getEventTime = (entry) => entry?.changedAt || entry?.createdAt || entry?.timestamp || entry?.date;

const getActionTitle = (entry) => {
  const raw = String(entry?.action || entry?.type || entry?.section || '').toLowerCase();
  if (raw.includes('create')) return 'Appointment created';
  if (raw.includes('status')) return 'Status updated';
  if (raw.includes('time') || raw.includes('schedule') || raw.includes('reschedule')) return 'Time updated';
  if (raw.includes('update')) return 'Appointment updated';
  return entry?.message || 'Appointment updated';
};

const formatProcedure = (procedure) => {
  if (!procedure || typeof procedure !== 'object') return formatValue(procedure);
  return procedure.treatment || procedure.description || procedure.name || procedure.title || '-';
};

const formatColorTag = (tag) => {
  if (!tag || typeof tag !== 'object') return formatValue(tag);
  return tag.label || tag.name || tag.color || '-';
};

const formatProcedureTag = (tag) => {
  if (!tag || typeof tag !== 'object') return formatValue(tag);
  return tag.label || tag.name || tag.value || tag.color || '-';
};

const formatProviderRows = (rows) => {
  if (!rows || typeof rows !== 'object') return formatValue(rows);
  return Object.entries(rows)
    .map(([providerId, row]) => {
      const provider = row?.providerName || row?.name || row?.providerId || providerId;
      const time = row?.time ? `${row.time} min` : '';
      return [provider, time].filter(Boolean).join(' - ');
    })
    .join(', ') || '-';
};

const formatReminderPreferences = (preferences) => {
  if (!preferences || typeof preferences !== 'object') return formatValue(preferences);
  return Object.entries(preferences)
    .map(([key, enabled]) => `${fieldLabel(key)}: ${formatValue(enabled)}`)
    .join(', ') || '-';
};

const formatChecklists = (checklists) => {
  if (!checklists || typeof checklists !== 'object') return formatValue(checklists);
  return Object.entries(checklists)
    .map(([key, list]) => {
      if (!list || typeof list !== 'object' || Object.keys(list).length === 0) {
        return `${fieldLabel(key)}: none`;
      }
      return `${fieldLabel(key)}: ${Object.entries(list).map(([item, value]) => `${fieldLabel(item)} ${formatValue(value)}`).join(', ')}`;
    })
    .join(', ') || '-';
};

const formatStructuredField = (key, value) => {
  if (key === 'procedures' && Array.isArray(value)) return value.map(formatProcedure).filter(Boolean).join(', ') || '-';
  if (key === 'procedureTags' && Array.isArray(value)) return value.map(formatProcedureTag).filter(Boolean).join(', ') || '-';
  if (key === 'colorTags' && Array.isArray(value)) return value.map(formatColorTag).filter(Boolean).join(', ') || '-';
  if (key === 'providerRows') return formatProviderRows(value);
  if (key === 'reminderPreferences') return formatReminderPreferences(value);
  if (key === 'checklists') return formatChecklists(value);
  return null;
};

const customFieldDetails = (value, prefix = '') => {
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value).flatMap(([key, val]) => {
    if (isHiddenField(key)) return [];

    const structuredValue = formatStructuredField(key, val);
    if (structuredValue !== null) {
      return [{
        label: `${prefix}${fieldLabel(key)}`,
        oldValue: '-',
        newValue: structuredValue,
      }];
    }

    if (Array.isArray(val)) {
      return [{
        label: `${prefix}${fieldLabel(key)}`,
        oldValue: '-',
        newValue: val.map(formatValue).filter(Boolean).join(', ') || '-',
      }];
    }

    if (val && typeof val === 'object') {
      return customFieldDetails(val, `${fieldLabel(key)} `);
    }

    return [{
      label: `${prefix}${fieldLabel(key)}`,
      oldValue: '-',
      newValue: formatMaybeDate(key, val),
    }];
  });
};

const getDifferences = (entry) => {
  const formatFieldValue = (key, value, source) => {
    if (key === 'createdBy' && value !== null && value !== undefined && value !== '') {
      return getCreatedByName(entry, source);
    }
    return formatMaybeDate(key, value);
  };

  if (Array.isArray(entry?.differences)) {
    return entry.differences.flatMap((diff) => {
      const key = diff?.key || diff?.field || diff?.path;
      if (isHiddenField(key)) return [];
      const oldValue = diff?.old ?? diff?.previous;
      const newValue = diff?.new ?? diff?.current;

      if (key === 'customFields') {
        return customFieldDetails(newValue || oldValue);
      }

      return [{
        label: fieldLabel(key),
        oldValue: formatFieldValue(key, oldValue),
        newValue: formatFieldValue(key, newValue),
      }];
    });
  }

  if (entry?.oldValue !== undefined || entry?.newValue !== undefined) {
    const oldValue = entry.oldValue;
    const newValue = entry.newValue;

    if ((oldValue && typeof oldValue === 'object') || (newValue && typeof newValue === 'object')) {
      const oldObj = oldValue && typeof oldValue === 'object' ? oldValue : {};
      const newObj = newValue && typeof newValue === 'object' ? newValue : {};
      const keys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));
      return keys.flatMap((key) => {
        if (isHiddenField(key)) return [];
        const oldField = oldObj[key];
        const newField = newObj[key];
        if (key === 'customFields') {
          return customFieldDetails(newField || oldField);
        }
        const structuredNewValue = formatStructuredField(key, newField);
        const structuredOldValue = formatStructuredField(key, oldField);
        if (structuredNewValue !== null || structuredOldValue !== null) {
          return {
            label: fieldLabel(key),
            oldValue: structuredOldValue || '-',
            newValue: structuredNewValue || '-',
          };
        }
        if (oldField && typeof oldField === 'object' && ('from' in oldField || 'to' in oldField) && newField === undefined) {
          return {
            label: fieldLabel(key),
            oldValue: formatFieldValue(key, oldField.from, oldObj),
            newValue: formatFieldValue(key, oldField.to, newObj),
          };
        }
        return {
          label: fieldLabel(key),
          oldValue: formatFieldValue(key, oldField, oldObj),
          newValue: formatFieldValue(key, newField, newObj),
        };
      }).filter((diff) => diff.oldValue !== diff.newValue || diff.newValue !== '-');
    }

    return [{
      label: fieldLabel(entry?.section || 'Value'),
      oldValue: formatValue(oldValue),
      newValue: formatValue(newValue),
    }];
  }

  return [];
};

const normalizeDetailLabels = (details) => {
  let timeCount = 0;
  return details.map((detail) => {
    if (detail.label !== 'Time') return detail;
    timeCount += 1;
    return {
      ...detail,
      label: timeCount === 1 ? 'Start Time' : 'End Time',
    };
  });
};

const normalizeEvents = (events) => (Array.isArray(events) ? events : [])
  .map((entry, index) => ({
    id: entry?._id || entry?.id || entry?.eventId || `history-${index}`,
    initials: getActorInitials(entry),
    title: getActionTitle(entry),
    timestamp: getEventTime(entry),
    details: normalizeDetailLabels(getDifferences(entry)),
    message: entry?.message,
  }))
  .sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());

const AppointmentHistoryTimelineDialog = ({ open, onClose, appointment }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const appointmentId = appointment?._id || appointment?.id;
  const normalizedEvents = useMemo(() => normalizeEvents(events), [events]);

  useEffect(() => {
    if (!open) {
      setEvents([]);
      setLoading(false);
      return;
    }

    if (!appointmentId) {
      setEvents([]);
      return;
    }

    let cancelled = false;
    const loadHistory = async () => {
      setLoading(true);
      try {
        const auditEvents = await appointmentService.getAppointmentAuditHistory(appointmentId);
        if (!cancelled) setEvents(auditEvents);
      } catch {
        if (!cancelled) setEvents(appointment?.systemEvents || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [open, appointmentId, appointment]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 640 },
          maxWidth: '100%',
          bgcolor: COLORS.SURFACE_PAGE,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT, flexShrink: 0 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MenuBookOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 700 }}>
              Appointment history
            </Typography>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'Inter, sans-serif', fontSize: 13, mt: 0.25 }}>
              View appointment updates from the backend audit timeline
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ width: 32, height: 32, borderRadius: '8px', color: COLORS.TEXT_SECONDARY, '&:hover': { bgcolor: COLORS.SURFACE_INPUT, color: COLORS.TEXT_PRIMARY } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

      <Box sx={{ px: 3, py: 3, overflowY: 'auto', flex: 1, bgcolor: COLORS.WHITE }}>
        {loading ? (
          <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : !appointmentId ? (
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b' }}>
            No appointment is selected.
          </Typography>
        ) : normalizedEvents.length === 0 ? (
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b' }}>
            No appointment history found.
          </Typography>
        ) : (
          <Box>
            {normalizedEvents.map((event, index) => (
              <Box key={event.id} sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                <Box sx={{ width: 32, mr: 1.75, display: 'flex', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                  {index < normalizedEvents.length - 1 && (
                    <Box sx={{ position: 'absolute', top: 32, bottom: -22, width: '2px', bgcolor: '#dbe3ef' }} />
                  )}
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: COLORS.AVATAR_BG, color: COLORS.AVATAR_TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', zIndex: 1 }}>
                    {event.initials}
                  </Box>
                </Box>
                <Box sx={{ pb: index === normalizedEvents.length - 1 ? 0 : 2.5, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                      {event.title}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: COLORS.TEXT_PRIMARY }}>
                      {event.timestamp ? dayjs(event.timestamp).format('MMMM D, YYYY [at] h:mm A') : ''}
                    </Typography>
                  </Box>

                  {event.details.length > 0 ? (
                    <Box sx={{ mt: 0.65 }}>
                      {event.details.map((detail, idx) => (
                        <Box key={`${event.id}-${detail.label}-${idx}`} sx={{ display: 'flex', mb: 0.35 }}>
                          <Typography sx={{ width: 120, flexShrink: 0, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                            {detail.label}
                          </Typography>
                          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#536985', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {detail.oldValue !== '-' && detail.newValue !== '-' ? `${detail.oldValue} -> ${detail.newValue}` : detail.newValue}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : event.message ? (
                    <Typography sx={{ mt: 0.65, fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#536985' }}>
                      {event.message}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      </Box>
    </Drawer>
  );
};

export default AppointmentHistoryTimelineDialog;
