import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, CircularProgress, Snackbar, Alert } from '@mui/material';

import WelcomeEmailDefaults from './WelcomeEmailDefaults';
import EmailTemplateSettings from './EmailTemplateSettings';
import EmailNotifications from './EmailNotifications';

// New modular components
import ReminderSidebar from '../../components/admin/patient-communication/ReminderSidebar';
import ReminderConfig from '../../components/admin/patient-communication/ReminderConfig';

import { communicationService } from '../../services/communication.service';

const PatientCommunicationSettings = () => {
  const [activeTab, setActiveTab] = useState('reminder-config');
  const [settings, setSettings] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await communicationService.getSettings();
        setSettings(data);
        setInitialSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const isDirty = initialSettings && JSON.stringify(initialSettings) !== JSON.stringify(settings);

  const handleSave = async () => {
    if (!settings || !isDirty) return;
    try {
      setSaving(true);
      await communicationService.updateSettings(settings);
      setInitialSettings(settings);
      setToast({ open: true, message: 'Settings saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setToast({ open: true, message: 'Failed to save settings.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseToast = () => setToast(prev => ({ ...prev, open: false }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
        bgcolor: '#FBFCFE',
        borderRadius: '12px',
        border: '1px solid #E5E9F2',
        overflow: 'hidden'
      }}>
        {/* ── Top Header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>
            Communication Setting
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={saving || !isDirty}
            sx={{ textTransform: 'none', backgroundColor: '#3B82F6', minWidth: 'auto', px: 3, '&:hover': { bgcolor: '#2563EB' } }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>

        {/* ── Main Layout ── */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* ── Left Sidebar ── */}
          <ReminderSidebar activeTab={activeTab} setActiveTab={setActiveTab} onSave={handleSave} />

          {/* ── Right Content ── */}
          <Box sx={{ flex: 1, px: 4, py: 1, pb: 3, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'reminder-config' && <ReminderConfig settings={settings} setSettings={setSettings} />}
            {activeTab === 'email-defaults' && <WelcomeEmailDefaults settings={settings} setSettings={setSettings} />}
            {activeTab === 'template-settings' && <EmailTemplateSettings settings={settings} setSettings={setSettings} />}
            {activeTab === 'notifications' && <EmailNotifications settings={settings} setSettings={setSettings} />}
          </Box>
        </Box>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientCommunicationSettings;
