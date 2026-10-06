import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  ChatBubbleOutline as ActionsIcon,
  SendOutlined as SentIcon,
  PeopleAltOutlined as RecipientsIcon,
} from '@mui/icons-material';

import ReminderSidebar from '../../components/admin/patient-communication/ReminderSidebar';
import AutomationStatCard from '../../components/admin/patient-communication/automations/AutomationStatCard';
import AutomationMessagesTable from '../../components/admin/patient-communication/automations/AutomationMessagesTable';
import AutomationMessageDialog from '../../components/admin/patient-communication/automations/AutomationMessageDialog';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import {
  AUTOMATION_CATEGORIES,
  getCategory,
  formatTiming,
} from '../../components/admin/patient-communication/automations/automationConfig';
import { automationsApi } from '../../components/admin/patient-communication/automations/automationsApi';
import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';


const SIDEBAR_ITEMS = AUTOMATION_CATEGORIES.map(({ id, label }) => ({ id, label }));

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error?.message || err.response?.data?.message || err?.message || fallback;

const Automations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategory(searchParams.get('tab')) ?? AUTOMATION_CATEGORIES[0];

  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [dialog, setDialog] = useState({ open: false, message: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });

  const fetchAutomations = useCallback(async () => {
    try {
      setLoadError('');
      setData(await automationsApi.getAutomations(category.id));
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Failed to load automations.'));
    }
  }, [category.id]);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  const handleToggleActive = async (message, active) => {
    // Optimistic: flip immediately, roll back if the save fails.
    setData((prev) => ({ ...prev, messages: prev.messages.map((m) => (m.id === message.id ? { ...m, active } : m)) }));
    try {
      setTogglingId(message.id);
      await automationsApi.setAutomationActive(category.id, message.id, active);
      showToast(`"${formatTiming(message.timing)}" turned ${active ? 'on' : 'off'}.`);
    } catch (err) {
      setData((prev) => ({ ...prev, messages: prev.messages.map((m) => (m.id === message.id ? { ...m, active: !active } : m)) }));
      showToast(getErrorMessage(err, 'Failed to update message.'), 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Throws so the dialog can show the validation message inline.
  const handleSubmitMessage = async (payload) => {
    try {
      if (dialog.message) {
        await automationsApi.updateAutomation(category.id, dialog.message.id, payload);
        showToast('Message updated.');
      } else {
        await automationsApi.createAutomation(category.id, payload);
        showToast('Message created.');
      }
      setDialog({ open: false, message: null });
      fetchAutomations();
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Failed to save message.'));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await automationsApi.deleteAutomation(category.id, deleteTarget.id);
      setDeleteTarget(null);
      showToast('Message deleted.');
      fetchAutomations();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete message.'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const renderContent = () => {
    if (loadError) {
      return (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchAutomations}>Retry</Button>}>
          {loadError}
        </Alert>
      );
    }
    // data is cleared on tab switch, so it can be null before the new fetch starts.
    if (!data) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }
    const { overview, messages } = data;
    return (
      <>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 2 }}>Overview</Typography>
        <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 2, mb: 4 }}>
          <AutomationStatCard label="Actions" value={overview.actions.toLocaleString()} icon={ActionsIcon} color="#3B82F6" tint="#F0F5FF" />
          <AutomationStatCard label="Total Sent" value={overview.totalSent.toLocaleString()} icon={SentIcon} color="#10B981" tint="#ECFDF5" />
          <AutomationStatCard label="Recipients" value={overview.recipients.toLocaleString()} icon={RecipientsIcon} color="#F59E0B" tint="#FFFBEB" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>Messages</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDialog({ open: true, message: null })}
            sx={{ textTransform: 'none', borderRadius: radius.md, fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.semibold }}
          >
            New Message
          </Button>
        </Box>
        <AutomationMessagesTable
          messages={messages}
          togglingId={togglingId}
          onToggleActive={handleToggleActive}
          onEdit={(message) => setDialog({ open: true, message })}
          onDelete={setDeleteTarget}
        />
      </>
    );
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', bgcolor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', overflow: 'hidden' }}
      >
        {/* ── Top Header ── */}
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>Automations</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>{category.description}</Typography>
        </Box>

        {/* ── Main Layout ── */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <ReminderSidebar
            items={SIDEBAR_ITEMS}
            activeTab={category.id}
            setActiveTab={(id) => {
              setData(null);
              setSearchParams({ tab: id });
            }}
          />
          <Box sx={{ flex: 1, px: 4, py: 1, pb: 4, overflow: 'auto', minWidth: 0 }}>{renderContent()}</Box>
        </Box>
      </Paper>

      {dialog.open && (
        <AutomationMessageDialog
          open
          key={dialog.message?.id ?? 'new'}
          category={category}
          message={dialog.message}
          onClose={() => setDialog({ open: false, message: null })}
          onSubmit={handleSubmitMessage}
        />
      )}

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Message"
        message={`Delete "${deleteTarget ? formatTiming(deleteTarget.timing) : ''}"? Patients will no longer receive this message.`}
        confirmText="Delete"
        confirmColor="error"
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Automations;
