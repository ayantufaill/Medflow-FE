import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Switch,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Edit as EditIcon,
  EmailOutlined as EmailIcon,
  InfoOutlined as InfoIcon,
  Sync as SyncIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ScheduleGapFills = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [skipDays, setSkipDays] = useState('30');
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'Email', days: 7 },
    { id: 2, type: 'Email', days: 14 },
    { id: 3, type: 'Email', days: 21 },
  ]);

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
      {/* Dynamic Header */}
      {isEditing ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5, bgcolor: '#f4f6f9', borderBottom: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#555', letterSpacing: 0.5 }}>
            SCHEDULE GAP FILLS NOTIFICATIONS SETTINGS
          </Typography>
          <Button variant="contained" onClick={toggleEdit} sx={{ bgcolor: '#4f6c9e', textTransform: 'none', borderRadius: 5, px: 4, '&:hover': { bgcolor: '#3d5682' } }}>
            Exit & Save
          </Button>
        </Box>
      ) : (
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} sx={{ mb: 2, px: 2, pt: 1 }}>
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
          <Typography sx={{ fontSize: '0.95rem', color: 'text.primary' }}>Schedule Gap Fills</Typography>
        </Breadcrumbs>
      )}

      {/* Main Content Container */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: isEditing ? 4 : 2, px: 2 }}>
        
        {!isEditing && (
          <>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#222', mb: 3 }}>
              SCHEDULE GAP FILLS
            </Typography>

            <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a3a6b', mb: 0.5 }}>
                  Unscheduled Procedure Notification
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>
                  Enable this setting to set up periodic reminders for users with unscheduled procedures. You can customize the reminder schedule based on user preferences.
                </Typography>
              </Box>
              <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a3a6b' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a3a6b' } }} />
            </Box>

            <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3, mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a3a6b', mb: 0.5 }}>
                  Show Book Now button
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>
                  Enable this setting to show or hide the 'Book Now' button in schedule gap fill notification.
                </Typography>
              </Box>
              <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a3a6b' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a3a6b' } }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#222' }}>
                Unscheduled Procedure Notifications Settings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#1a3a6b' }} onClick={toggleEdit}>
                <EditIcon sx={{ fontSize: '1rem' }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Edit Notifications</Typography>
              </Box>
            </Box>
          </>
        )}

        {isEditing && (
          <>
            <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 2 }}>
              Set up automated <span style={{ textDecoration: 'underline' }}>unscheduled procedures</span> notifications based on your preferences. Choose how and when to send reminders—whether via text, email, or both—after procedure creation date.
            </Typography>
            
            <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#fff4e5', border: '1px solid #ffe0b2', borderRadius: 5, px: 2, py: 0.8, mb: 3 }}>
              <InfoIcon sx={{ color: '#ff9800', fontSize: '1.2rem', mr: 1 }} />
              <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>
                Expect the reminder to be sent out 1 to 59 minutes after the scheduled time. This is due to the hourly system check up.
              </Typography>
              <IconButton size="small" sx={{ ml: 1, p: 0 }}><CloseIcon sx={{ fontSize: '1rem', color: '#999' }}/></IconButton>
            </Box>
          </>
        )}

        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 2, mb: 4, display: 'flex', alignItems: 'center' }}>
          {isEditing ? (
            <Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 600 }}>
              Skip sending reminders if the patient had a treatment appointment in the last{' '}
              <TextField 
                size="small" 
                value={skipDays} 
                onChange={(e) => setSkipDays(e.target.value)}
                sx={{ width: 60, mx: 1, '& .MuiOutlinedInput-root': { height: 30, bgcolor: '#fff' }, '& input': { textAlign: 'center', p: 0 } }} 
              />
              {' '}days.
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 500 }}>
              Skip sending reminders if the patient had a treatment appointment in the last {skipDays} days.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#222' }}>Notifications</Typography>
          {isEditing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#1a3a6b' }}>
                <SyncIcon sx={{ fontSize: '1.1rem' }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Reset Notifications to System Default</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#1a3a6b' }}>
                <AddIcon sx={{ fontSize: '1.1rem', fontWeight: 'bold' }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Add New Notification</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 3 }}>
          {notifications.map((notif, idx) => (
            <Box key={notif.id} sx={{ bgcolor: '#fff', border: '1px solid #eee', borderRadius: 2, p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a3a6b' }}>#{notif.id} Notification</Typography>
                  <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontSize: '0.6rem', fontWeight: 700, px: 1, py: 0.2, borderRadius: 1 }}>DEFAULT</Box>
                </Box>
                {isEditing && (
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#d32f2f', cursor: 'pointer' }}>Delete Notification</Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Send</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>@ Schedule Gap Fills</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#555', mx: 1 }}>→</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>as an</Typography>
                
                {isEditing ? (
                  <Select size="small" defaultValue={notif.type} sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#f5f5f5' } }}>
                    <MenuItem value="Email" sx={{ fontSize: '0.85rem' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon fontSize="small" color="primary"/> Email</Box></MenuItem>
                    <MenuItem value="Text" sx={{ fontSize: '0.85rem' }}>Text</MenuItem>
                  </Select>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: '1.1rem', color: '#1976d2' }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{notif.type}</Typography>
                  </Box>
                )}
                
                <Typography sx={{ fontSize: '0.85rem', color: '#555', mx: 1 }}>→</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>after</Typography>

                {isEditing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField 
                      size="small" 
                      defaultValue={notif.days}
                      sx={{ width: 60, '& .MuiOutlinedInput-root': { height: 32, bgcolor: '#f5f5f5' }, '& input': { textAlign: 'center', fontSize: '0.85rem', p: 0 } }} 
                    />
                    <Select size="small" defaultValue="Days" sx={{ minWidth: 90, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', bgcolor: '#f5f5f5' } }}>
                      <MenuItem value="Days" sx={{ fontSize: '0.85rem' }}>Days</MenuItem>
                      <MenuItem value="Hours" sx={{ fontSize: '0.85rem' }}>Hours</MenuItem>
                    </Select>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{notif.days}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Days</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default ScheduleGapFills;
