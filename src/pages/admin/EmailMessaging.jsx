import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

import ReminderSidebar from '../../components/admin/patient-communication/ReminderSidebar';
import { EMAIL_MESSAGING_BASE, EMAIL_MESSAGING_PATHS } from '../../components/admin/patient-communication/emailMessagingPaths';
import EmailServices from './EmailServices';
import EmailPreferences from './EmailPreferences';
import MessagingServices from './MessagingServices';
import NumberSelection from './NumberSelection';

const SECTIONS = [
  {
    id: 'email-services',
    label: 'Email Services',
    path: EMAIL_MESSAGING_PATHS.emailServices,
    description: 'Verify your practice’s email domain so patient emails and campaigns are sent from your own address.',
    Component: EmailServices,
  },
  {
    id: 'email-preferences',
    label: 'Email Preferences',
    path: EMAIL_MESSAGING_PATHS.emailPreferences,
    description: 'Choose the addresses patient emails are sent from and where replies go.',
    Component: EmailPreferences,
  },
  {
    id: 'messaging-services',
    label: 'Messaging Services',
    path: EMAIL_MESSAGING_PATHS.messagingServices,
    description: 'Manage the number patients use to text your practice.',
    Component: MessagingServices,
  },
  {
    id: 'number-selection',
    label: 'Number Selection',
    path: EMAIL_MESSAGING_PATHS.numberSelection,
    description: 'Choose a new texting number for your practice.',
    Component: NumberSelection,
  },
];

const SIDEBAR_ITEMS = SECTIONS.map(({ id, label }) => ({ id, label }));

/**
 * Email & Messaging section: one Patient Communication menu entry with an
 * inner sidebar (same pattern as Automations / Communication Settings).
 * Number Selection is also reachable from "Edit" on Messaging Services.
 */
const EmailMessaging = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/$/, '');

  if (pathname === EMAIL_MESSAGING_BASE) {
    return <Navigate to={EMAIL_MESSAGING_PATHS.emailServices} replace />;
  }

  const section = SECTIONS.find((s) => s.path === pathname) ?? SECTIONS[0];
  const Content = section.Component;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', bgcolor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', overflow: 'hidden' }}
      >
        {/* ── Top Header ── */}
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>Email &amp; Messaging</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>{section.description}</Typography>
        </Box>

        {/* ── Main Layout ── */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <ReminderSidebar
            items={SIDEBAR_ITEMS}
            activeTab={section.id}
            setActiveTab={(id) => navigate(SECTIONS.find((s) => s.id === id).path)}
          />
          <Box sx={{ flex: 1, px: 4, py: 1, pb: 4, overflow: 'auto', minWidth: 0 }}>
            <Content key={pathname} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailMessaging;
