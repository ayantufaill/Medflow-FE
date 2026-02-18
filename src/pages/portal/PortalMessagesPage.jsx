import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
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
  portalSurfaceSx,
} from './PortalUi';

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
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Messages"
        subtitle="Send messages to your care team and follow each conversation thread."
      />
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ ...portalSurfaceSx, height: '100%' }}>
            <PortalSectionTitle
              title="Conversations"
              subtitle="Select a thread or start a new one."
              action={
                <Button size="small" onClick={() => setSelectedThreadId('')}>
                  New
                </Button>
              }
            />
            <Stack spacing={1}>
              {threads.length === 0 && (
                <PortalEmptyState
                  title="No conversations yet"
                  description="Start a new message to reach your provider."
                />
              )}
              {threads.map((thread) => (
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
                  <Box textAlign="left" sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {thread.subject || 'Conversation'}
                    </Typography>
                    <Typography variant="caption" color="inherit" sx={{ display: 'block', opacity: 0.9 }}>
                      {thread.providerId ? providerMap.get(thread.providerId) || thread.providerId : 'Provider'}
                    </Typography>
                    {thread.lastMessageAt ? (
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.75 }}>
                        {dayjs(thread.lastMessageAt).format('MMM D, h:mm A')}
                      </Typography>
                    ) : null}
                  </Box>
                  <Chip
                    size="small"
                    label={thread.unreadCount ? `${thread.unreadCount}` : '0'}
                    color={thread.unreadCount ? 'secondary' : 'default'}
                  />
                </Button>
              ))}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Box sx={portalSurfaceSx}>
              <PortalSectionTitle
                title={selectedThreadId ? 'Reply in Thread' : 'New Message'}
                subtitle={selectedThreadId ? 'Respond in the selected conversation.' : 'You can send to one or multiple providers.'}
              />
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
                  minRows={4}
                />
                <Button variant="contained" onClick={handleSend} disabled={!canSend || sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </Stack>
            </Box>

            <Box sx={portalSurfaceSx}>
              <PortalSectionTitle title="Thread Messages" subtitle="Conversation history" />
              <Stack spacing={1.25}>
                {messages.length === 0 && (
                  <PortalEmptyState
                    title="No messages in this thread"
                    description="Select a conversation from the left or start a new one."
                  />
                )}
                {messages.map((message) => {
                  const isPatient = message.senderRole === 'patient';
                  return (
                    <Box
                      key={message._id}
                      sx={{
                        border: '1px solid #dde7f7',
                        borderRadius: 2,
                        p: 1.5,
                        backgroundColor: isPatient ? '#e9f4ff' : '#ffffff',
                        alignSelf: isPatient ? 'flex-start' : 'flex-end',
                        maxWidth: { xs: '100%', md: '85%' },
                      }}
                    >
                      <Typography variant="body2">{message.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {isPatient ? 'You' : 'Provider'} • {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PortalMessagesPage;

