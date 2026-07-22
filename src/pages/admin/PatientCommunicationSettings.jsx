import { useState } from 'react';
import { Box, Paper } from '@mui/material';

import WelcomeEmailDefaults from './WelcomeEmailDefaults';
import EmailTemplateSettings from './EmailTemplateSettings';
import EmailNotifications from './EmailNotifications';

// New modular components
import ReminderSidebar from '../../components/admin/patient-communication/ReminderSidebar';
import ReminderConfig from '../../components/admin/patient-communication/ReminderConfig';

const PatientCommunicationSettings = () => {
  const [activeTab, setActiveTab] = useState('reminder-config');

  return (
    <Box>

      <Paper elevation={0} sx={{ 
        display: 'flex', 
        minHeight: '80vh', 
        bgcolor: '#FBFCFE', 
        borderRadius: '12px', 
        border: '1px solid #E5E9F2',
        overflow: 'hidden'
      }}>
        {/* ── Left Sidebar ── */}
        <ReminderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── Right Content ── */}
        <Box sx={{ flex: 1, px: 4, py: 3, overflow: 'auto' }}>
          {activeTab === 'reminder-config' && <ReminderConfig />}
          {activeTab === 'email-defaults' && <WelcomeEmailDefaults />}
          {activeTab === 'template-settings' && <EmailTemplateSettings />}
          {activeTab === 'notifications' && <EmailNotifications />}
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientCommunicationSettings;
