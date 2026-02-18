import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

const PortalMessagesPage = () => {
  const [providers, setProviders] = useState([]);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState({
    providerIds: [],
    subject: '',
    message: '',
  });

  const providerMap = useMemo(
    () =>
      new Map(
        providers.map((provider) => [
          provider._id,
          provider.name ||
            `${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
            provider.providerCode ||
            `Provider #${provider._id}`,
        ])
      ),
    [providers]
  );

  const selectedThread = useMemo(
    () => threads.find((item) => item._id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );

  const refreshThreads = async () => {
    const [providersData, threadsData] = await Promise.all([
      portalService.getProviders(),
      portalService.getMessageThreads(),
    ]);
    setProviders(providersData);
    setThreads(threadsData);

    if (selectedThreadId && threadsData.some((item) => item._id === selectedThreadId)) {
      return;
    }
    setSelectedThreadId(threadsData[0]?._id || '');
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshThreads();
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load messages'
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([]);
      return;
    }
    (async () => {
      try {
        const rows = await portalService.getThreadMessages(selectedThreadId);
        setMessages(rows);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load thread messages'
        );
      }
    })();
  }, [selectedThreadId]);

  const handleSend = async () => {
    try {
      setSending(true);
      setError('');
      const payload = {
        threadId: selectedThreadId || undefined,
        providerIds:
          selectedThreadId && selectedThread?.providerId
            ? [selectedThread.providerId]
            : draft.providerIds,
        subject: draft.subject || undefined,
        message: draft.message.trim(),
      };

      await portalService.sendMessage(payload);
      setDraft((prev) => ({ ...prev, message: '' }));
      await refreshThreads();
      if (selectedThreadId) {
        const rows = await portalService.getThreadMessages(selectedThreadId);
        setMessages(rows);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to send message'
      );
    } finally {
      setSending(false);
    }
  };

  const canSend = selectedThreadId
    ? Boolean(draft.message.trim())
    : Boolean(draft.message.trim() && draft.providerIds.length > 0);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Messages</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6">Conversations</Typography>
              <Button size="small" onClick={() => setSelectedThreadId('')}>
                New
              </Button>
            </Stack>
            <Stack spacing={1}>
              {threads.length === 0 && (
                <Typography color="text.secondary">No conversation yet.</Typography>
              )}
              {threads.map((thread) => (
                <Button
                  key={thread._id}
                  variant={selectedThreadId === thread._id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedThreadId(thread._id)}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <Box textAlign="left">
                    <Typography variant="body2">{thread.subject || 'Conversation'}</Typography>
                    <Typography variant="caption" color="inherit">
                      {thread.providerId ? providerMap.get(thread.providerId) || thread.providerId : 'Provider'}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={thread.unreadCount ? `${thread.unreadCount}` : '0'}
                    color={thread.unreadCount ? 'secondary' : 'default'}
                  />
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {selectedThreadId ? 'Reply in Thread' : 'New Message'}
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                select
                label="Providers"
                value={draft.providerIds}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    providerIds:
                      typeof event.target.value === 'string'
                        ? event.target.value.split(',')
                        : event.target.value,
                  }))
                }
                disabled={Boolean(selectedThreadId)}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) =>
                    selected.map((id) => providerMap.get(id) || id).join(', '),
                }}
              >
                {providers.map((provider) => (
                  <MenuItem key={provider._id} value={provider._id}>
                    {providerMap.get(provider._id)}
                  </MenuItem>
                ))}
              </TextField>
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
                minRows={3}
              />
              <Button variant="contained" onClick={handleSend} disabled={!canSend || sending}>
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Thread Messages
            </Typography>
            <Stack spacing={1}>
              {messages.length === 0 && (
                <Typography color="text.secondary">Select a thread to view messages.</Typography>
              )}
              {messages.map((message) => (
                <Box
                  key={message._id}
                  sx={{
                    border: '1px solid #e8edf3',
                    borderRadius: 1,
                    p: 1.5,
                    backgroundColor: message.senderRole === 'patient' ? '#f3f9ff' : '#fff',
                  }}
                >
                  <Typography variant="body2">{message.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {message.senderRole} • {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PortalMessagesPage;
