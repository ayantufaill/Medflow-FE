import { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Link,
  Button,
  Breadcrumbs,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import {
  AccessTime as TimeIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import WelcomeEmailDefaults from './WelcomeEmailDefaults';
import EmailTemplateSettings from './EmailTemplateSettings';
import EmailNotifications from './EmailNotifications';

const PatientCommunicationSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reminder-config');

  const sidebarItems = [
    { id: 'reminder-config', label: 'Reminder Config' },
    { id: 'email-defaults', label: 'Welcome/Update Email Defaults' },
    { id: 'template-settings', label: 'Email Template Settings' },
    { id: 'notifications', label: 'Email Notifications' },
  ];

  /* ─── Reminder Configurations Content ─── */
  const ReminderConfigView = () => (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 3, color: '#222' }}>
        Reminder Configurations
      </Typography>

      {/* General Configuration */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#c06000', mb: 0.5 }}>
          General Configuration:
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#333' }}>
          What days would you like the system to skip sending communications (ex: holidays)?
        </Typography>
        <Typography
          component={Link}
          href="#"
          sx={{ fontSize: '0.82rem', color: '#c06000', textDecoration: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', mt: 0.3 }}
        >
          Add exceptions <AddIcon sx={{ fontSize: '0.9rem', ml: 0.3 }} />
        </Typography>
      </Box>

      {/* ── Email + Text scheduling side-by-side ── */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4 }}>
        {/* Email Communications */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', mb: 1.5 }}>
            When would you like the system to send all email communications?
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Days:</Typography>
            <Select size="small" value="Weekdays" sx={{ height: 28, fontSize: '0.8rem', minWidth: 100 }}>
              <MenuItem value="Weekdays">Weekdays</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Time:</Typography>
            <TextField size="small" defaultValue="08" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Typography sx={{ fontSize: '0.8rem' }}>:</Typography>
            <TextField size="small" defaultValue="00" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', px: 0.8, py: 0.3, borderRadius: '3px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>AM</Box>
            <Typography sx={{ fontSize: '0.8rem', mx: 0.5 }}>to</Typography>
            <TextField size="small" defaultValue="05" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Typography sx={{ fontSize: '0.8rem' }}>:</Typography>
            <TextField size="small" defaultValue="00" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', px: 0.8, py: 0.3, borderRadius: '3px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>PM</Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <TimeIcon sx={{ fontSize: '0.9rem' }} />
            <Typography sx={{ fontSize: '0.78rem' }}>Time Window: 9 h</Typography>
          </Box>
        </Box>

        {/* Text Message Communications */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', mb: 1.5 }}>
            When would you like the system to send all text message communications?
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Days:</Typography>
            <Select size="small" value="Custom" sx={{ height: 28, fontSize: '0.8rem', minWidth: 100 }}>
              <MenuItem value="Weekdays">Weekdays</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.3, flexWrap: 'wrap', mb: 1.5, alignItems: 'center' }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    size="small"
                    defaultChecked={day !== 'Sunday'}
                    sx={{ p: 0.3, '& .MuiSvgIcon-root': { fontSize: '1rem' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.72rem' }}>{day}</Typography>}
                sx={{ mr: 0.5 }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Time:</Typography>
            <TextField size="small" defaultValue="08" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Typography sx={{ fontSize: '0.8rem' }}>:</Typography>
            <TextField size="small" defaultValue="00" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', px: 0.8, py: 0.3, borderRadius: '3px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>AM</Box>
            <Typography sx={{ fontSize: '0.8rem', mx: 0.5 }}>to</Typography>
            <TextField size="small" defaultValue="08" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Typography sx={{ fontSize: '0.8rem' }}>:</Typography>
            <TextField size="small" defaultValue="00" sx={{ width: 48, '& .MuiOutlinedInput-root': { height: 28, fontSize: '0.8rem' } }} />
            <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', px: 0.8, py: 0.3, borderRadius: '3px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>PM</Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <TimeIcon sx={{ fontSize: '0.9rem' }} />
            <Typography sx={{ fontSize: '0.78rem' }}>Time Window: 12 h  0.993333333333405 min</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Types of Reminders ── */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#c06000', mb: 1.5 }}>
          Types of Reminders:
        </Typography>
        {[
          { label: 'Existing Appointments (Treatment and Hygiene)', checked: true, hasLinks: true },
          { label: 'Recall (Patients without recare appointments)', checked: true, hasLinks: true },
          { label: 'Birthdays', checked: true, hasLinks: false },
          { label: 'Appointment Reminder After Confirmation', checked: true, hasLinks: false },
          { label: "Include Don't Remind Me Again Button", checked: true, hasLinks: false },
          { label: 'Include All Same-Day Appointments for Each Patient in Reminders (Not only the First Appt Time) *', checked: true, hasLinks: false },
          { label: 'Appointment Notification After Cancellation using Email *', checked: false, hasLinks: false },
          { label: "Automatic reply for patient's missed calls", checked: false, hasLinks: false },
        ].map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  defaultChecked={item.checked}
                  sx={{ p: 0.3, '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}
                />
              }
              label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>{item.label}</Typography>}
            />
            {item.hasLinks && (
              <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
                <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', color: '#4b71a1' }}>settings</Link>
                <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>/</Typography>
                <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', color: '#4b71a1' }}>preview</Link>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* ── Social Media Links + Map ── */}
      <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        {/* Social Media */}
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: 'text.secondary', mb: 1.5 }}>
            Social Media Links:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box sx={{ width: 28, height: 28, bgcolor: '#1877F2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <FacebookIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Box sx={{ width: 28, height: 28, bgcolor: '#E4405F', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <InstagramIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Box sx={{ width: 28, height: 28, bgcolor: '#0A66C2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <LinkedInIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Box sx={{ width: 28, height: 28, bgcolor: '#1DA1F2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <TwitterIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Box sx={{ width: 28, height: 28, bgcolor: '#E60023', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>G+</Typography>
            </Box>
          </Box>
        </Box>

        {/* Map Embed */}
        <Box sx={{ flex: 1, maxWidth: 400, height: 220, bgcolor: '#e8e4d8', borderRadius: 1, overflow: 'hidden', position: 'relative', border: '1px solid #ddd' }}>
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0, zIndex: 1 }}>
            <Button
              size="small"
              sx={{
                bgcolor: '#fff', color: '#333', textTransform: 'none', fontSize: '0.7rem',
                minWidth: 40, height: 24, borderRadius: '3px 0 0 3px', border: '1px solid #ccc',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Map
            </Button>
            <Button
              size="small"
              sx={{
                bgcolor: '#fff', color: '#333', textTransform: 'none', fontSize: '0.7rem',
                minWidth: 55, height: 24, borderRadius: '0 3px 3px 0', border: '1px solid #ccc', borderLeft: 'none',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Satellite
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Box sx={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #d4cfb8 0%, #c8c3ac 30%, #bfbb9f 50%, #c8c3ac 70%, #d4cfb8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              {/* Map Pin */}
              <Box sx={{
                width: 20, height: 30, position: 'relative',
                '&::before': {
                  content: '""', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 20, bgcolor: '#e53935', borderRadius: '50% 50% 50% 0', border: '2px solid #c62828',
                  transformOrigin: 'center', rotate: '-45deg'
                }
              }} />
            </Box>
          </Box>
          {/* Fullscreen button */}
          <Box sx={{
            position: 'absolute', top: 8, right: 8, width: 24, height: 24, bgcolor: '#fff',
            border: '1px solid #ccc', borderRadius: '3px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem'
          }}>⛶</Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: '1rem' }} />}
        sx={{ mb: 2, px: 2, pt: 1 }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin');
          }}
          sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#1a3a6b' }}
        >
          Patient Communication
        </Link>
        <Typography sx={{ fontSize: '0.95rem', color: 'text.primary' }}>Communication Settings</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', minHeight: '80vh' }}>
      {/* ── Left Sidebar ── */}
      <Box sx={{ width: 200, minWidth: 200, borderRight: '1px solid #e0e0e0', pt: 2 }}>
        {sidebarItems.map((item) => (
          <Box
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            sx={{
              px: 2,
              py: 1,
              cursor: 'pointer',
              bgcolor: activeTab === item.id ? '#f0f4fa' : 'transparent',
              borderLeft: activeTab === item.id ? '3px solid #1a3a6b' : '3px solid transparent',
              '&:hover': { bgcolor: '#f5f7fb' },
              transition: 'all 0.15s',
            }}
          >
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: activeTab === item.id ? 600 : 400,
              color: activeTab === item.id ? '#1a3a6b' : '#555',
              lineHeight: 1.4,
            }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Right Content ── */}
      <Box sx={{ flex: 1, px: 4, py: 2, overflow: 'auto' }}>
        {activeTab === 'reminder-config' && <ReminderConfigView />}
        {activeTab === 'email-defaults' && <WelcomeEmailDefaults />}
        {activeTab === 'template-settings' && <EmailTemplateSettings />}
        {activeTab === 'notifications' && <EmailNotifications />}
      </Box>
      </Box>
    </Box>
  );
};

export default PatientCommunicationSettings;
