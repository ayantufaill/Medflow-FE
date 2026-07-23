import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Button
} from '@mui/material';
import {
  NotificationsNone as NotificationsIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const TypesOfRemindersCard = ({ settings, setSettings }) => {
  if (!settings) return null;

  const handleReminderChange = (index, checked) => {
    const updatedReminders = [...settings.reminders];
    updatedReminders[index] = { ...updatedReminders[index], checked };
    setSettings(prev => ({
      ...prev,
      reminders: updatedReminders
    }));
  };

  return (
    <Box sx={{ 
      border: '1px solid #E5E9F2', 
      borderRadius: '8px', 
      bgcolor: '#FFFFFF',
      overflow: 'hidden' 
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#F2F6FC', 
        px: 2.5, 
        py: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        borderBottom: '1px solid #E5E9F2'
      }}>
        <NotificationsIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#334155', letterSpacing: '0.5px' }}>
          TYPES OF REMINDERS
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, display: 'flex', gap: 6, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Checkbox List */}
        <Box sx={{ flex: 1 }}>
          {(settings.reminders || []).map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={item.checked}
                    onChange={(e) => handleReminderChange(idx, e.target.checked)}
                    sx={{ 
                      p: 0.5, 
                      color: '#CBD5E1',
                      '&.Mui-checked': { color: '#3B82F6' },
                      '& .MuiSvgIcon-root': { fontSize: '1.2rem', borderRadius: '4px' } 
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{item.label}</Typography>}
                sx={{ mr: 1, ml: 0 }}
              />
            </Box>
          ))}

          {/* Social Media Links */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', mb: 1.5 }}>
              Social Media Links
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ width: 32, height: 32, bgcolor: '#3B82F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <FacebookIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
              </Box>
              <Box sx={{ width: 32, height: 32, bgcolor: '#3B82F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <InstagramIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
              </Box>
              <Box sx={{ width: 32, height: 32, bgcolor: '#3B82F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <EmailIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
              </Box>
              <Box sx={{ width: 32, height: 32, bgcolor: '#3B82F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <TwitterIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
              </Box>
              <Box sx={{ width: 32, height: 32, bgcolor: '#3B82F6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>G+</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Map Embed */}
        <Box sx={{ width: '320px', height: '180px', flexShrink: 0, position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E9F2' }}>
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', zIndex: 1 }}>
            <Button
              size="small"
              sx={{
                bgcolor: '#fff', color: '#334155', textTransform: 'none', fontSize: '0.7rem',
                minWidth: 40, height: 26, borderRadius: '4px 0 0 4px', border: '1px solid #CBD5E1',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              Map
            </Button>
            <Button
              size="small"
              sx={{
                bgcolor: '#f1f5f9', color: '#64748b', textTransform: 'none', fontSize: '0.7rem',
                minWidth: 55, height: 26, borderRadius: '0 4px 4px 0', border: '1px solid #CBD5E1', borderLeft: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: '#e2e8f0' }
              }}
            >
              Satellite
            </Button>
          </Box>
          <Box sx={{ 
            width: '100%', height: '100%', 
            bgcolor: '#E5E1D8', // Light map-like background color
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Simple Map Pin */}
            <Box sx={{
              width: 14, height: 14, bgcolor: '#EF4444', borderRadius: '50%',
              border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TypesOfRemindersCard;
