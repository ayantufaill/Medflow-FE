import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, IconButton, Paper, Dialog } from '@mui/material';
import { SmartToy, Check, KeyboardArrowDown, Print, Close } from '@mui/icons-material';
import PatientRequestModal from './PatientRequestModal';

const PatientChat = ({ patientName, open, onClose }) => {
  const [messages] = useState([
    {
      title: "Save The Date - Text Message",
      patient: patientName || "Karla Pamela",
      details: "Appt on 03/04/2026 @ 9:00 AM",
      time: "3:15 PM - 03/03/2026",
      status: "Sent",
      type: "teal"
    },
    {
      title: "Request Patient Updates - Email",
      patient: patientName || "Karla Pamela",
      details: "",
      time: "8:07 AM - 03/04/2026",
      status: "Delivered",
      type: "orange"
    },
    {
      title: "Appointment Reminder Without Confirm - Text Message",
      patient: patientName || "Karla Pamela",
      details: "Appt on 03/04/2026 @ 9:00 AM",
      time: "8:08 AM - 03/04/2026",
      status: "Sent",
      type: "teal"
    }
  ]);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [actionButtons] = useState([
    { label: "Send Text", color: "#002b71", onClick: () => {} },
    { label: "Send Email", color: "#002b71", onClick: () => {} },
    { label: "Add Call Note", color: "#3b9df2", onClick: () => {} },
    { 
      label: "Request Patient Updates", 
      color: "#f58220", 
      hasArrow: true,
      onClick: (event) => {
        setAnchorEl(event.currentTarget);
        setRequestModalOpen(true);
      }
    },
    { label: "Request Quick Payment", color: "#39b54a", onClick: () => {} },
    { label: "Send Welcome Email", color: "#d1d5db", font: "black", hasArrow: true, onClick: () => {} },
    { label: "Invite To MyChart", color: "#7d8eb5", onClick: () => {} },
    { label: "Request Review", color: "#e6e05d", font: "black", hasArrow: true, onClick: () => {} },
    { label: "Print", color: "#ff49db", onClick: () => {} },
  ]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #eef2f6',
        }
      }}
    >
      <Box sx={{ 
        width: '100%', 
        height: '600px', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: '#f3f4f6',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #ddd', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: '#e5e7eb',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#bfdbfe' }}>
              <Typography sx={{ fontSize: 16 }}>👤</Typography>
            </Avatar>
            <Typography sx={{ fontWeight: 600, color: '#4b5563', fontSize: '14px' }}>
              {patientName || "Karla Pamela"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Message Area */}
        <Box sx={{ 
          flexGrow: 1, 
          p: 2, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8'
          }
        }}>
          {messages.map((msg, i) => (
            <Box key={i} sx={{ 
              alignSelf: 'flex-end', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5,
              maxWidth: '85%' 
            }}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: msg.type === 'teal' ? '#e0f2f1' : '#fff7ed',
                  border: `1px solid ${msg.type === 'teal' ? '#b2dfdb' : '#ffedd5'}`,
                  position: 'relative',
                  width: '280px'
                }}>
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: msg.type === 'teal' ? '#00695c' : '#c2410c', 
                      mb: 0.5,
                      textTransform: 'none'
                    }}
                  >
                    {msg.title}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                    {msg.patient}
                  </Typography>
                  {msg.details && (
                    <Typography sx={{ fontSize: '11px', color: '#6b7280', mt: 0.25 }}>
                      {msg.details}
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography sx={{ fontSize: '10px', color: '#9ca3af' }}>
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Status below the bubble */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                  <Typography sx={{ fontSize: '9px', fontStyle: 'italic', color: '#16a34a', mr: 0.25 }}>
                    {msg.status}
                  </Typography>
                  <Check sx={{ fontSize: 14, color: '#16a34a' }} />
                </Box>
              </Box>
              
              <Avatar sx={{ 
                width: 36, 
                height: 36, 
                border: '1px solid #cbd5e1', 
                bgcolor: 'white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                flexShrink: 0
              }}>
                <SmartToy sx={{ color: '#00acc1', fontSize: 22 }} />
              </Avatar>
            </Box>
          ))}
        </Box>

        {/* Footer Buttons */}
        <Box sx={{ 
          p: 2, 
          bgcolor: '#e5e7eb', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          borderTop: '1px solid #ddd',
          flexShrink: 0,
          justifyContent: 'flex-start',
          alignContent: 'flex-start'
        }}>
          {actionButtons.map((btn, i) => (
            <Button
              key={i}
              variant="contained"
              endIcon={btn.hasArrow ? <KeyboardArrowDown /> : null}
              onClick={btn.onClick}
              sx={{
                bgcolor: btn.color,
                color: btn.font === 'black' ? 'black' : 'white',
                textTransform: 'none',
                borderRadius: 50,
                fontSize: '11px',
                fontWeight: 700,
                px: 1.5,
                py: 0.6,
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: btn.color, 
                  opacity: 0.9, 
                  boxShadow: 'none',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s'
                },
                transition: 'all 0.2s',
                flexGrow: 0,
                flexShrink: 0,
                alignSelf: 'flex-start'
              }}
            >
              {btn.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Patient Request Modal */}
      <PatientRequestModal 
        open={requestModalOpen} 
        onClose={() => {
          setRequestModalOpen(false);
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
      />
    </Dialog>
  );
};

export default PatientChat;
