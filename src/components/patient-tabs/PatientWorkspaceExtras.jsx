import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { patientService } from '../../services/patient.service';

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const useAsyncData = (loader, deps = []) => {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setState({ loading: true, error: '', data: null });
        const data = await loader();
        if (!cancelled) {
          setState({ loading: false, error: '', data });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            error:
              error.response?.data?.error?.message ||
              error.response?.data?.message ||
              'Failed to load data',
            data: null,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};

const SectionHeader = ({ title, action }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
    <Typography variant="h6">{title}</Typography>
    {action}
  </Stack>
);

const LoadingState = ({ loading, error, emptyMessage, hasData, children }) => {
  if (loading) {
    return <Typography color="text.secondary">Loading...</Typography>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!hasData) {
    return <Alert severity="info">{emptyMessage}</Alert>;
  }
  return children;
};

export const PatientUpdateRequestsTab = ({ patientId, onChanged }) => {
  const [sections, setSections] = useState('demographics,medical-history');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { loading, error, data } = useAsyncData(
    () => patientService.getPatientUpdateRequests(patientId),
    [patientId, onChanged]
  );

  const requests = data || [];

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      await patientService.createPatientUpdateRequest(patientId, {
        sections: sections
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        note: note || undefined,
      });
      setNote('');
      onChanged?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <SectionHeader
        title="Update Requests"
        action={
          <Button variant="contained" onClick={handleCreate} disabled={submitting}>
            Send Request
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            label="Sections"
            fullWidth
            value={sections}
            onChange={(event) => setSections(event.target.value)}
            helperText="Comma-separated sections: demographics, medical-history, dental-history, hipaa, consent, custom-form"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Note"
            fullWidth
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </Grid>
      </Grid>
      <LoadingState
        loading={loading}
        error={error}
        hasData={requests.length > 0}
        emptyMessage="No update requests yet."
      >
        <Stack spacing={2}>
          {requests.map((request) => (
            <Card key={request._id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {request.sections?.join(', ') || 'Requested sections'}
                  </Typography>
                  <Chip label={request.status || 'pending'} color={request.status === 'applied' ? 'success' : 'warning'} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Sent: {formatDateTime(request.sentAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted: {formatDateTime(request.submittedAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Applied: {formatDateTime(request.appliedAt)}
                </Typography>
                {request.note ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {request.note}
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </LoadingState>
    </Box>
  );
};

export const PatientAuditHistoryTab = ({ patientId, refreshKey }) => {
  const { loading, error, data } = useAsyncData(
    () => patientService.getPatientAuditHistory(patientId),
    [patientId, refreshKey]
  );
  const events = data || [];

  return (
    <Box>
      <SectionHeader title="Audit History" />
      <LoadingState
        loading={loading}
        error={error}
        hasData={events.length > 0}
        emptyMessage="No audit history yet."
      >
        <List disablePadding>
          {events.map((event, index) => (
            <Box key={event._id}>
              <ListItem alignItems="flex-start" disableGutters sx={{ py: 1.5 }}>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={700}>{event.action}</Typography>
                      <Chip size="small" label={event.source} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(event.changedAt)}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={0.75} sx={{ mt: 1 }}>
                      <Typography variant="body2">Section: {event.section}</Typography>
                      <Typography variant="body2">
                        Actor: {event.actor?.firstName || event.actor?._id || 'System'}
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: '#fafcff' }}>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                          Old Value
                        </Typography>
                        <Typography component="pre" variant="caption" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
                          {formatValue(event.oldValue)}
                        </Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: '#fafcff' }}>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                          New Value
                        </Typography>
                        <Typography component="pre" variant="caption" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
                          {formatValue(event.newValue)}
                        </Typography>
                      </Paper>
                    </Stack>
                  }
                />
              </ListItem>
              {index < events.length - 1 ? <Divider /> : null}
            </Box>
          ))}
        </List>
      </LoadingState>
    </Box>
  );
};

export const PatientCommunicationsTab = ({ patientId, onChanged, refreshKey }) => {
  const [channel, setChannel] = useState('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { loading, error, data } = useAsyncData(
    () => patientService.getPatientCommunications(patientId),
    [patientId, refreshKey]
  );
  const communications = data || [];

  const handleSend = async () => {
    try {
      setSending(true);
      await patientService.createPatientCommunication(patientId, {
        channel,
        subject: subject || undefined,
        message,
      });
      setSubject('');
      setMessage('');
      onChanged?.();
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <SectionHeader
        title="Communications Hub"
        action={
          <Button variant="contained" onClick={handleSend} disabled={sending || !message.trim()}>
            Log Communication
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField label="Channel" fullWidth value={channel} onChange={(event) => setChannel(event.target.value)} />
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField label="Subject" fullWidth value={subject} onChange={(event) => setSubject(event.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Message"
            fullWidth
            multiline
            minRows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </Grid>
      </Grid>
      <LoadingState
        loading={loading}
        error={error}
        hasData={communications.length > 0}
        emptyMessage="No communications logged yet."
      >
        <Stack spacing={2}>
          {communications.map((item) => (
            <Card key={item._id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {item.subject || item.channel}
                  </Typography>
                  <Chip label={item.status || 'sent'} size="small" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.channel} • {formatDateTime(item.createdAt)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {item.message}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </LoadingState>
    </Box>
  );
};

export const PatientReportsTab = ({ patientId, refreshKey, onChanged }) => {
  const [reportType, setReportType] = useState('summary');
  const loaders = useMemo(
    () => ({
      summary: () => patientService.getPatientReportSummary(patientId),
      showcase: () => patientService.getPatientReportShowcase(patientId),
      concerns: () => patientService.getPatientReportConcerns(patientId),
    }),
    [patientId]
  );
  const { loading, error, data } = useAsyncData(() => loaders[reportType](), [patientId, reportType, refreshKey]);

  const handleRefresh = async () => {
    await patientService.refreshPatientReports(patientId);
    onChanged?.();
  };

  return (
    <Box>
      <SectionHeader
        title="Patient Reports"
        action={
          <Stack direction="row" spacing={1}>
            <TextField
              label="Report"
              size="small"
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
            />
            <Button variant="contained" onClick={handleRefresh}>
              Refresh
            </Button>
          </Stack>
        }
      />
      <LoadingState
        loading={loading}
        error={error}
        hasData={Boolean(data)}
        emptyMessage="No report data yet."
      >
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fbfdff' }}>
          <Typography component="pre" variant="body2" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </Typography>
        </Paper>
      </LoadingState>
    </Box>
  );
};
