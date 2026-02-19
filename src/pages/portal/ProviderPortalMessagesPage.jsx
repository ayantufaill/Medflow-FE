import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';
import {
  PortalEmptyState,
  PortalPageHeader,
  PortalSectionTitle,
  PortalStatusChip,
  portalSurfaceSx,
} from './PortalUi';

const formatName = (firstName, lastName) => `${firstName || ''} ${lastName || ''}`.trim();

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MMM D, YYYY h:mm A') : 'N/A';
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MMM D, YYYY') : 'N/A';
};

const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toDisplayLabel = (key) => {
  if (!key) return '';
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return 'N/A';
    const parsed = dayjs(trimmed);
    if (parsed.isValid() && /[T:\-]/.test(trimmed)) {
      return trimmed.includes(':') ? formatDateTime(trimmed) : formatDate(trimmed);
    }
    return trimmed;
  }
  return String(value);
};

const FormDataViewer = ({ data, depth = 0 }) => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          N/A
        </Typography>
      );
    }

    const hasNestedItems = data.some((item) => isPlainObject(item) || Array.isArray(item));
    if (!hasNestedItems) {
      return <Typography variant="body2">{data.map((item) => formatFieldValue(item)).join(', ')}</Typography>;
    }

    return (
      <Stack spacing={1}>
        {data.map((item, index) => (
          <Box
            key={`array-item-${index}`}
            sx={{
              border: '1px solid #e6ebf4',
              borderRadius: 1.5,
              p: 1,
              backgroundColor: depth > 0 ? '#fbfdff' : '#ffffff',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              Item {index + 1}
            </Typography>
            <FormDataViewer data={item} depth={depth + 1} />
          </Box>
        ))}
      </Stack>
    );
  }

  if (!isPlainObject(data)) {
    return <Typography variant="body2">{formatFieldValue(data)}</Typography>;
  }

  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        N/A
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {entries.map(([key, value]) => {
        const label = toDisplayLabel(key);
        const hasNestedValue = isPlainObject(value) || Array.isArray(value);
        if (hasNestedValue) {
          return (
            <Box key={key}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {label}
              </Typography>
              <Box
                sx={{
                  border: '1px solid #e6ebf4',
                  borderRadius: 1.5,
                  p: 1,
                  backgroundColor: '#fbfdff',
                }}
              >
                <FormDataViewer data={value} depth={depth + 1} />
              </Box>
            </Box>
          );
        }

        return (
          <Stack
            key={key}
            direction="row"
            justifyContent="space-between"
            spacing={1}
            sx={{ borderBottom: '1px dashed #e6ebf4', pb: 0.5 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {label}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>
              {formatFieldValue(value)}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

const ProviderPortalMessagesPage = () => {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('');
  const [patientContext, setPatientContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread._id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  const loadThreads = async () => {
    const rows = await portalService.getProviderMessageThreads();
    setThreads(rows);
    if (selectedThreadId && rows.some((thread) => thread._id === selectedThreadId)) {
      return;
    }
    setSelectedThreadId(rows[0]?._id || '');
  };

  useEffect(() => {
    (async () => {
      try {
        await loadThreads();
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load portal message threads'
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([]);
      setPatientContext(null);
      setContextLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setError('');
        const rows = await portalService.getProviderThreadMessages(selectedThreadId);
        if (cancelled) return;
        setMessages(rows);
        const subject = rows[rows.length - 1]?.subject || selectedThread?.subject || '';
        setDraft((prev) => ({ ...prev, subject }));

        const patientId =
          selectedThread?.patientId || rows.find((message) => message.patientId)?.patientId || '';
        if (!patientId) {
          setPatientContext(null);
          return;
        }

        setContextLoading(true);
        try {
          const context = await portalService.getProviderPatientContext(patientId);
          if (!cancelled) {
            setPatientContext(context);
          }
        } finally {
          if (!cancelled) {
            setContextLoading(false);
          }
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load thread messages'
        );
        setContextLoading(false);
        setPatientContext(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedThreadId, selectedThread?.patientId]);

  const handleSendReply = async () => {
    if (!selectedThreadId || !draft.message.trim()) return;
    try {
      setSending(true);
      setError('');
      await portalService.replyToProviderThread({
        threadId: selectedThreadId,
        subject: draft.subject || undefined,
        message: draft.message.trim(),
      });
      setDraft((prev) => ({ ...prev, message: '' }));
      await loadThreads();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to send reply'
      );
    } finally {
      setSending(false);
    }
  };

  const patient = patientContext?.patient || null;
  const patientName = patient
    ? formatName(patient.firstName, patient.lastName) || patient.preferredName || patient.email || 'Patient'
    : '';
  const appointments = patientContext?.appointments || [];
  const forms = patientContext?.forms || [];
  const clinicalNotes = patientContext?.clinicalNotes || [];

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Portal Messages"
        subtitle="Review patient conversations and reply in the same thread."
      />
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ ...portalSurfaceSx, height: '100%' }}>
            <PortalSectionTitle title="Patient Threads" />
            <Stack spacing={1}>
              {threads.length === 0 && (
                <PortalEmptyState
                  title="No messages yet"
                  description="Patient conversations will appear here."
                />
              )}
              {threads.map((thread) => {
                const patientName = thread.patient
                  ? `${thread.patient.firstName || ''} ${thread.patient.lastName || ''}`.trim()
                  : '';
                return (
                  <Button
                    key={thread._id}
                    variant={selectedThreadId === thread._id ? 'contained' : 'outlined'}
                    onClick={() => setSelectedThreadId(thread._id)}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      borderRadius: 2,
                      textTransform: 'none',
                      p: 1.2,
                    }}
                  >
                    <Box textAlign="left">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {thread.subject || 'Conversation'}
                      </Typography>
                      <Typography variant="caption" color="inherit">
                        {patientName || thread.patient?.email || thread.patientId || 'Unknown patient'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="inherit"
                        sx={{ display: 'block', opacity: 0.85, mt: 0.25 }}
                      >
                        {thread.lastMessage || 'No message yet'}
                      </Typography>
                    </Box>
                    <Stack alignItems="flex-end" spacing={0.25}>
                      <Typography variant="caption">
                        {thread.unreadCount ? `${thread.unreadCount} unread` : 'read'}
                      </Typography>
                      <Typography variant="caption">
                        {thread.lastMessageAt ? dayjs(thread.lastMessageAt).format('MMM D') : ''}
                      </Typography>
                    </Stack>
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Box sx={portalSurfaceSx}>
              <PortalSectionTitle
                title="Patient Context"
                subtitle="Quickly review appointment history, forms, and notes for this thread."
              />

              {!selectedThreadId && (
                <PortalEmptyState
                  title="Select a thread"
                  description="Pick a patient conversation to load clinical context."
                />
              )}

              {selectedThreadId && contextLoading && (
                <Typography variant="body2" color="text.secondary">
                  Loading patient context...
                </Typography>
              )}

              {selectedThreadId && !contextLoading && !patient && (
                <PortalEmptyState
                  title="No patient context"
                  description="This thread does not have a patient linked yet."
                />
              )}

              {selectedThreadId && !contextLoading && patient && (
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    spacing={1.2}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {patientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.email || 'No email'} • {patient.phonePrimary || 'No phone'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      <Chip size="small" label={`${appointments.length} Appointments`} />
                      <Chip size="small" label={`${forms.length} Forms`} />
                      <Chip size="small" label={`${clinicalNotes.length} Notes`} />
                    </Stack>
                  </Stack>

                  <Divider />

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                        Appointments
                      </Typography>
                      <Stack spacing={0.9}>
                        {appointments.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            No appointments linked.
                          </Typography>
                        )}
                        {appointments.slice(0, 3).map((appointment) => (
                          <Box
                            key={appointment._id}
                            sx={{ border: '1px solid #e6ebf4', borderRadius: 1.5, p: 1 }}
                          >
                            <Stack direction="row" justifyContent="space-between" spacing={0.75}>
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                {formatDate(appointment.appointmentDate)}
                              </Typography>
                              <PortalStatusChip status={appointment.status} />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.startTime || '--'} - {appointment.endTime || '--'}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {appointment.chiefComplaint || 'No complaint captured'}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {appointment.notes || 'No appointment notes'}
                            </Typography>
                            <Button
                              size="small"
                              sx={{ mt: 0.75, px: 0, minWidth: 'auto' }}
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              View details
                            </Button>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                        Forms
                      </Typography>
                      <Stack spacing={0.9}>
                        {forms.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            No submitted forms yet.
                          </Typography>
                        )}
                        {forms.slice(0, 3).map((form) => (
                          <Box key={form._id} sx={{ border: '1px solid #e6ebf4', borderRadius: 1.5, p: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                              {(form.templateId || 'patient-form').replace(/-/g, ' ')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Status: {form.status || 'submitted'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Submitted: {formatDateTime(form.submittedAt)}
                            </Typography>
                            <Button
                              size="small"
                              sx={{ mt: 0.75, px: 0, minWidth: 'auto' }}
                              onClick={() => setSelectedForm(form)}
                            >
                              View form
                            </Button>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                        Clinical Notes
                      </Typography>
                      <Stack spacing={0.9}>
                        {clinicalNotes.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            No clinical notes found.
                          </Typography>
                        )}
                        {clinicalNotes.slice(0, 3).map((note) => (
                          <Box key={note._id} sx={{ border: '1px solid #e6ebf4', borderRadius: 1.5, p: 1 }}>
                            <Stack direction="row" justifyContent="space-between" spacing={0.75}>
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                {note.summary || note.chiefComplaint || 'Clinical note'}
                              </Typography>
                              <Chip
                                size="small"
                                label={(note.noteType || 'soap').toUpperCase()}
                                color="primary"
                                variant="outlined"
                              />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(note.createdAt)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              )}
            </Box>

            <Box sx={portalSurfaceSx}>
              <PortalSectionTitle title="Reply" />
              <Stack spacing={1.5}>
                <TextField
                  label="Subject"
                  value={draft.subject}
                  onChange={(event) => setDraft((prev) => ({ ...prev, subject: event.target.value }))}
                />
                <TextField
                  label="Message"
                  value={draft.message}
                  onChange={(event) => setDraft((prev) => ({ ...prev, message: event.target.value }))}
                  multiline
                  minRows={4}
                />
                <Button
                  variant="contained"
                  onClick={handleSendReply}
                  disabled={!selectedThreadId || !draft.message.trim() || sending}
                >
                  {sending ? 'Sending...' : 'Send Reply'}
                </Button>
              </Stack>
            </Box>

            <Box sx={portalSurfaceSx}>
              <PortalSectionTitle title="Messages" />
              <Stack spacing={1.25}>
                {messages.length === 0 && (
                  <PortalEmptyState
                    title="Select a thread"
                    description="Open a patient thread to see the full conversation."
                  />
                )}
                {messages.map((message) => {
                  const isDoctor = message.senderRole === 'doctor';
                  return (
                    <Box
                      key={message._id}
                      sx={{
                        border: '1px solid #e8edf3',
                        borderRadius: 2,
                        p: 1.5,
                        backgroundColor: isDoctor ? '#e9f4ff' : '#fff',
                        alignSelf: isDoctor ? 'flex-end' : 'flex-start',
                        maxWidth: { xs: '100%', md: '85%' },
                      }}
                    >
                      <Typography variant="body2">{message.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {isDoctor ? 'You' : 'Patient'} • {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent dividers>
          {selectedAppointment && (
            <Stack spacing={1.25}>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {selectedAppointment.startTime || '--'} -{' '}
                {selectedAppointment.endTime || '--'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {selectedAppointment.status || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Chief Complaint:</strong> {selectedAppointment.chiefComplaint || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Notes:</strong> {selectedAppointment.notes || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {selectedAppointment.durationMinutes || 'N/A'} mins
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong>{' '}
                {selectedAppointment.appointmentTypeId?.name ||
                  selectedAppointment.appointmentType ||
                  'N/A'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedForm)} onClose={() => setSelectedForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>Form Details</DialogTitle>
        <DialogContent dividers>
          {selectedForm && (
            <Stack spacing={1.25}>
              <Typography variant="body2">
                <strong>Form ID:</strong> {selectedForm._id}
              </Typography>
              <Typography variant="body2">
                <strong>Template:</strong> {selectedForm.templateId || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {selectedForm.status || 'submitted'}
              </Typography>
              <Typography variant="body2">
                <strong>Submitted:</strong> {formatDateTime(selectedForm.submittedAt)}
              </Typography>
              <Box sx={{ border: '1px solid #e6ebf4', borderRadius: 1.5, p: 1.25 }}>
                <FormDataViewer data={selectedForm.formData} />
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ProviderPortalMessagesPage;
