import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import {
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Description as TemplateIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const NotificationsList = ({ notifications, enabled }) => {
  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
          Outstanding Balance Notifications Settings
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {!enabled && (
          <Typography sx={{ color: '#ef4444', fontSize: '0.85rem', mb: 3, fontWeight: 500 }}>
            Notifications are currently disabled. To modify notification settings, please enable the feature above.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notifications.map((notif) => (
            <Paper 
              elevation={0}
              key={notif.id} 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                border: '1px solid #e2e8f0',
                backgroundColor: '#fafafa',
                opacity: enabled ? 1 : 0.6,
                pointerEvents: enabled ? 'auto' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                  {notif.title}
                </Typography>
                <Chip 
                  label="DEFAULT" 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    bgcolor: '#e0f2fe', 
                    color: '#0369a1',
                    borderRadius: '4px'
                  }} 
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Send</Typography>
                  <TemplateIcon sx={{ fontSize: '1.1rem', color: '#2563eb' }} />
                  <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>
                    {notif.template}
                  </Typography>
                </Box>

                <ArrowIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>as an</Typography>
                  <EmailIcon sx={{ fontSize: '1.1rem', color: '#2563eb' }} />
                  <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>
                    {notif.method}
                  </Typography>
                </Box>

                <ArrowIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>after</Typography>
                  <CalendarIcon sx={{ fontSize: '1.1rem', color: '#2563eb' }} />
                  <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>
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

export default NotificationsList;
