import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PatientCommunicationSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reminder-config');

  const sidebarItems = [
    { id: 'reminder-config', label: 'Reminder Config' },
    { id: 'email-defaults', label: 'Welcome/Update Email Defaults' },
    { id: 'template-settings', label: 'Email Template Settings' },
    { id: 'notifications', label: 'Email Notifications' },
  ];

  const ReminderConfigView = () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 4, color: '#333' }}>Reminder Configurations</Typography>

      {/* General Configuration */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#4b71a1', mb: 1 }}>General Configuration:</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>
          What days would you like the system to skip sending communications (ex: holidays)?
        </Typography>
        <Link href="#" sx={{ fontSize: '0.85rem', color: '#4b71a1', textDecoration: 'none', display: 'flex', alignItems: 'center', mt: 0.5 }}>
          Add exceptions <AddIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
        </Link>
      </Box>

      {/* Scheduling Row */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Email Communications */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2 }}>When would you like the system to send all email communications?</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Days: </Typography>
            <Typography component="span" sx={{ fontSize: '0.85rem' }}>Weekdays</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Time: </Typography>
            <TextField size="small" value="08:00" sx={{ width: 80, '& .MuiOutlinedInput-root': { height: 32 } }} />
            <Select size="small" value="AM" sx={{ height: 32 }}>
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.85rem' }}>to</Typography>
            <TextField size="small" value="05:00" sx={{ width: 80, '& .MuiOutlinedInput-root': { height: 32 } }} />
            <Select size="small" value="PM" sx={{ height: 32 }}>
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <TimeIcon sx={{ fontSize: '1rem' }} />
            <Typography sx={{ fontSize: '0.8rem' }}>Time Window: 9 h</Typography>
          </Box>
        </Grid>

        {/* Text Message Communications */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2 }}>When would you like the system to send all text message communications?</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Days: </Typography>
            <Select size="small" value="Custom" sx={{ height: 32, width: 120 }}>
              <MenuItem value="Custom">Custom</MenuItem>
              <MenuItem value="Weekdays">Weekdays</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <FormControlLabel
                key={day}
                control={<Checkbox size="small" defaultChecked={day !== 'Saturday' && day !== 'Sunday'} sx={{ p: 0.5 }} />}
                label={<Typography sx={{ fontSize: '0.75rem' }}>{day}</Typography>}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Time: </Typography>
            <TextField size="small" value="08:00" sx={{ width: 80, '& .MuiOutlinedInput-root': { height: 32 } }} />
            <Select size="small" value="AM" sx={{ height: 32 }}>
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.85rem' }}>to</Typography>
            <TextField size="small" value="08:00" sx={{ width: 80, '& .MuiOutlinedInput-root': { height: 32 } }} />
            <Select size="small" value="PM" sx={{ height: 32 }}>
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <TimeIcon sx={{ fontSize: '1rem' }} />
            <Typography sx={{ fontSize: '0.8rem' }}>Time Window: 12 h 0.00333333333333405 min</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Types of Reminders */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#4b71a1', mb: 3 }}>Types of Reminders:</Typography>
        <Grid container spacing={1}>
          {[
            { label: 'Existing Appointments (Treatment and Hygiene)', hasLinks: true },
            { label: 'Recall (Patients without recare appointments)', hasLinks: true },
            { label: 'Birthdays', hasLinks: false },
            { label: 'Appointment Reminder After Confirmation', hasLinks: false },
            { label: "Include Don't Remind Me Again Button", hasLinks: false },
            { label: 'Include All Same-Day Appointments for Each Patient in Reminders (Not only the First Appt Time) *', hasLinks: false },
            { label: 'Appointment Notification After Cancellation using Email *', hasLinks: false },
            { label: "Automatic reply for patient's missed calls", hasLinks: false },
          ].map((item, idx) => (
            <Grid item xs={12} key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Checkbox size="small" defaultChecked sx={{ p: 0.5 }} />}
                label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>{item.label}</Typography>}
              />
              {item.hasLinks && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Link href="#" sx={{ fontSize: '0.75rem', color: '#4b71a1', textDecoration: 'none' }}>settings</Link>
                  <Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>/</Typography>
                  <Link href="#" sx={{ fontSize: '0.75rem', color: '#4b71a1', textDecoration: 'none' }}>preview</Link>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Social Media Links */}
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.secondary' }}>Social Media Links:</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FacebookIcon sx={{ color: '#1877F2', cursor: 'pointer' }} />
          <InstagramIcon sx={{ color: '#E4405F', cursor: 'pointer' }} />
          <LinkedInIcon sx={{ color: '#0A66C2', cursor: 'pointer' }} />
          <TwitterIcon sx={{ color: '#1DA1F2', cursor: 'pointer' }} />
          <Box sx={{ bgcolor: '#eee', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <AddIcon sx={{ fontSize: '1rem', color: '#666' }} />
          </Box>
        </Box>
      </Box>

      {/* Map Section */}
      <Box sx={{ width: '100%', height: 300, bgcolor: '#f0f0f0', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 1, zIndex: 1 }}>
          <Button variant="contained" size="small" sx={{ bgcolor: '#fff', color: '#333', textTransform: 'none', '&:hover': { bgcolor: '#f5f5f5' } }}>Map</Button>
          <Button variant="contained" size="small" sx={{ bgcolor: '#fff', color: '#333', textTransform: 'none', '&:hover': { bgcolor: '#f5f5f5' } }}>Satellite</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
          {/* Map Image Placeholder */}
          <Typography>Google Maps Embed Placeholder</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ px: 2, py: 1 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3, fontSize: '0.85rem', color: 'text.secondary' }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin/patient-communication');
          }}
          sx={{ cursor: 'pointer' }}
        >
          Patient Communication
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Communication Settings</Typography>
      </Breadcrumbs>

      <Grid container spacing={0} sx={{ border: '1px solid #eee', borderRadius: 2, minHeight: '80vh', bgcolor: '#fff', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3} lg={2.5} sx={{ borderRight: '1px solid #eee', bgcolor: '#fff' }}>
          <Box sx={{ pt: 2 }}>
            {sidebarItems.map((item) => (
              <Box
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  px: 3,
                  py: 1.5,
                  cursor: 'pointer',
                  borderLeft: activeTab === item.id ? '4px solid #4b71a1' : '4px solid transparent',
                  bgcolor: activeTab === item.id ? '#f0f4fa' : 'transparent',
                  '&:hover': { bgcolor: '#f9fafb' },
                  transition: 'all 0.2s'
                }}
              >
                <Typography sx={{
                  fontSize: '0.85rem',
                  fontWeight: activeTab === item.id ? 700 : 500,
                  color: activeTab === item.id ? '#4b71a1' : '#666'
                }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right Content */}
        <Grid item xs={12} md={9} lg={9.5} sx={{ p: 4 }}>
          {activeTab === 'reminder-config' ? (
            <ReminderConfigView />
          ) : (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Typography variant="h6" color="text.secondary">
                {sidebarItems.find(i => i.id === activeTab)?.label} section is under development.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientCommunicationSettings;
