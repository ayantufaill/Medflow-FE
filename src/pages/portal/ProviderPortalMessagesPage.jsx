import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { portalService } from '../../services/portal.service';

const ProviderPortalMessagesPage = () => {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState('');
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
      return;
    }
    (async () => {
      try {
        const rows = await portalService.getProviderThreadMessages(selectedThreadId);
        setMessages(rows);
        if (!draft.subject) {
          const subject = rows[rows.length - 1]?.subject || selectedThread?.subject || '';
          setDraft((prev) => ({ ...prev, subject }));
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load thread messages'
        );
      }
    })();
  }, [selectedThreadId]);

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
      const rows = await portalService.getProviderThreadMessages(selectedThreadId);
      setMessages(rows);
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

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Portal Messages</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Patient Threads
            </Typography>
            <Stack spacing={1}>
              {threads.length === 0 && (
                <Typography color="text.secondary">No messages yet.</Typography>
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
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <Box textAlign="left">
                      <Typography variant="body2">{thread.subject || 'Conversation'}</Typography>
                      <Typography variant="caption" color="inherit">
                        {patientName || thread.patient?.email || thread.patientId || 'Unknown patient'}
                      </Typography>
                    </Box>
                    <Typography variant="caption">
                      {thread.unreadCount ? `${thread.unreadCount} unread` : 'read'}
                    </Typography>
                  </Button>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Reply
            </Typography>
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
                minRows={3}
              />
              <Button
                variant="contained"
                onClick={handleSendReply}
                disabled={!selectedThreadId || !draft.message.trim() || sending}
              >
                {sending ? 'Sending...' : 'Send Reply'}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Messages
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
                    backgroundColor: message.senderRole === 'doctor' ? '#f3f9ff' : '#fff',
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

export default ProviderPortalMessagesPage;
