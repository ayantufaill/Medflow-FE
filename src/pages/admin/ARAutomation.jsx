import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Alert,
  IconButton,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Description as TemplateIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const ARAutomation = () => {
  const [enabled, setEnabled] = useState(false);
  const [skipOpenClaims, setSkipOpenClaims] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const notifications = [
    { id: 1, title: '#1 Notification', template: 'AR Automation 15 Days', method: 'Email', after: '15 Days' },
    { id: 2, title: '#2 Notification', template: 'AR Automation 30 Days', method: 'Email', after: '30 Days' },
    { id: 3, title: '#3 Notification', template: 'AR Automation 45 Days', method: 'Email', after: '45 Days' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; AR Automation
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, color: '#1a3a6b', fontSize: '1rem' }}>
        AR AUTOMATION
      </Typography>

      {/* Outstanding Balance Notification Enable */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1, fontSize: '0.9rem' }}>
              Outstanding Balance Notification
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
              Enable this setting to set up periodic reminders for users with outstanding balances. You can customize the reminder schedule based on user preferences.
            </Typography>
          </Box>
          <Switch 
            checked={enabled} 
            onChange={(e) => setEnabled(e.target.checked)}
            sx={{ 
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4a89dc' }
            }}
          />
        </Box>
      </Paper>

      <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1.5, fontSize: '0.9rem' }}>
        Outstanding Balance Notifications Settings
      </Typography>
      {!enabled && (
        <Typography sx={{ color: '#64748b', fontSize: '0.8125rem', mb: 2 }}>
          Notifications are disabled. To modify notification settings, please enable this feature first.
        </Typography>
      )}

      {showAlert && (
        <Alert 
          icon={<InfoIcon fontSize="small" sx={{ color: '#4a89dc' }} />}
          onClose={() => setShowAlert(false)}
          sx={{ 
            mb: 4, 
            borderRadius: 2, 
            bgcolor: '#eff6ff', 
            color: '#1e40af',
            border: '1px solid #bfdbfe',
            '& .MuiAlert-message': { fontSize: '0.8125rem' }
          }}
        >
          The notification reminders will check open invoices created starting from 01/25/2025.
        </Alert>
      )}

      {/* Skip Invoices Section */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
            Skip Invoices with open claims
          </Typography>
          <Switch 
            checked={skipOpenClaims} 
            onChange={(e) => setSkipOpenClaims(e.target.checked)}
            sx={{ 
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4a89dc' }
            }}
          />
        </Box>
      </Paper>

      {/* Notifications List */}
      <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 700, color: '#334155', mb: 3, fontSize: '0.9rem' }}>
          Notifications
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notifications.map((notif) => (
            <Paper 
              key={notif.id} 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.875rem' }}>
                  {notif.title}
                </Typography>
                <Chip 
                  label="DEFAULT" 
                  size="small" 
                  sx={{ 
                    height: 18, 
                    fontSize: '0.625rem', 
                    fontWeight: 700, 
                    bgcolor: '#e0f2fe', 
                    color: '#0369a1',
                    borderRadius: '4px'
                  }} 
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>Send</Typography>
                  <TemplateIcon sx={{ fontSize: '1rem', color: '#4a89dc' }} />
                  <Typography sx={{ color: '#1e40af', fontWeight: 600, fontSize: '0.8125rem' }}>
                    {notif.template}
                  </Typography>
                </Box>

                <ArrowIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>as an</Typography>
                  <EmailIcon sx={{ fontSize: '1rem', color: '#4a89dc' }} />
                  <Typography sx={{ color: '#1e40af', fontWeight: 600, fontSize: '0.8125rem' }}>
                    {notif.method}
                  </Typography>
                </Box>

                <ArrowIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8125rem' }}>after</Typography>
                  <CalendarIcon sx={{ fontSize: '1rem', color: '#4a89dc' }} />
                  <Typography sx={{ color: '#1e40af', fontWeight: 600, fontSize: '0.8125rem' }}>
                    {notif.after}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ARAutomation;
