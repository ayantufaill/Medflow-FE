import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import AppleIcon from '@mui/icons-material/Apple';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GetAppIcon from '@mui/icons-material/GetApp';
import OSSelectionCard from '../../components/admin/installation/OSSelectionCard';
import WindowsInstallationSteps from '../../components/admin/installation/WindowsInstallationSteps';
import MacOSInstallationSteps from '../../components/admin/installation/MacOSInstallationSteps';

const InstallationGuide = () => {
  const [selectedOs, setSelectedOs] = useState('');
  const [submittedOs, setSubmittedOs] = useState('');
  
  // --- DIALOG STATE FOR SCHEDULING ---
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    email: '',
    date: '2026-05-25',
    timeSlot: '10:00 AM - 11:00 AM',
    note: ''
  });

  const handleOsSubmit = (e) => {
    e.preventDefault();
    if (selectedOs) {
      setSubmittedOs(selectedOs);
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful schedule booking
    setScheduledSuccess(true);
  };

  const handleCloseSchedule = () => {
    setScheduleOpen(false);
    // Reset state after closing
    setTimeout(() => {
      setScheduledSuccess(false);
      setScheduleForm({
        name: '',
        email: '',
        date: '2026-05-25',
        timeSlot: '10:00 AM - 11:00 AM',
        note: ''
      });
    }, 300);
  };

  // --- STYLING CONSTANTS ---
  const titleColor = '#4b71a1';
  const scheduleBtnBg = '#c5a059';
  const scheduleBtnHover = '#b08c48';
  const submitBtnBg = '#4b71a1';
  const submitBtnHover = '#3b5d8a';

  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: '#FFFFFF', 
      borderRadius: '12px', 
      border: '1px solid #E2E8F0',
      minHeight: '266px' // from the figma design, though it will expand with content
    }}>
      
      {/* Header Container */}
      <Box sx={{ mb: 1 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold" 
          color="#11223F"
          sx={{ fontSize: '16px' }}
        >
          Installation Guide
        </Typography>
      </Box>

      {/* Main Form/Wizard Area */}
      {!submittedOs ? (
        <OSSelectionCard 
          selectedOs={selectedOs} 
          setSelectedOs={setSelectedOs} 
          onSubmit={handleOsSubmit} 
        />
      ) : (
        /* STEP-BY-STEP GUIDES */
        <Box sx={{ mt: 2 }}>
          {/* Back button */}
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => {
              setSubmittedOs('');
              setSelectedOs('');
            }}
            sx={{
              color: '#9CA3AF',
              textTransform: 'none',
              fontSize: '13px',
              mb: 4,
              p: 0,
              '&:hover': { background: 'none', textDecoration: 'underline' }
            }}
          >
            Choose a different operating system
          </Button>

          {submittedOs === 'Windows' ? (
            <WindowsInstallationSteps />
          ) : (
            <MacOSInstallationSteps />
          )}
        </Box>
      )}

      {/* --- SCHEDULING DIALOG --- */}
      <Dialog open={scheduleOpen} onClose={handleCloseSchedule} maxWidth="xs" fullWidth>
        {!scheduledSuccess ? (
          <form onSubmit={handleScheduleSubmit}>
            <DialogTitle sx={{ fontWeight: 600, color: '#1a3a6b', pb: 1 }}>
              Schedule Installation Support
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ color: '#666', mb: 2.5, lineHeight: 1.5 }}>
                Book a 15-minute call with an Oryx integration specialist to help you set up or troubleshoot your imaging workstations.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Your Name"
                  size="small"
                  fullWidth
                  required
                  value={scheduleForm.name}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, name: e.target.value }))}
                />
                
                <TextField
                  label="Your Email"
                  type="email"
                  size="small"
                  fullWidth
                  required
                  value={scheduleForm.email}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, email: e.target.value }))}
                />

                <TextField
                  label="Preferred Date"
                  type="date"
                  size="small"
                  fullWidth
                  required
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  select
                  label="Preferred Time Slot"
                  size="small"
                  fullWidth
                  required
                  value={scheduleForm.timeSlot}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                >
                  <MenuItem value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</MenuItem>
                  <MenuItem value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</MenuItem>
                  <MenuItem value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</MenuItem>
                  <MenuItem value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</MenuItem>
                  <MenuItem value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</MenuItem>
                  <MenuItem value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</MenuItem>
                </TextField>

                <TextField
                  label="Notes / Description"
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  value={scheduleForm.note}
                  placeholder="e.g., Setting up Windows 11 client for Apex sensor model"
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, note: e.target.value }))}
                />
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={handleCloseSchedule} color="inherit" size="small" sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  backgroundColor: scheduleBtnBg,
                  '&:hover': { backgroundColor: scheduleBtnHover } 
                }}
              >
                Confirm Booking
              </Button>
            </DialogActions>
          </form>
        ) : (
          /* SUCCESS STATE */
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ color: '#48bb78', fontSize: '3.5rem', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
              Support Call Scheduled!
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', lineHeight: 1.5, mb: 3 }}>
              Thank you, <strong>{scheduleForm.name}</strong>. An onboarding calendar invite has been sent to <strong>{scheduleForm.email}</strong> for <strong>{scheduleForm.date}</strong> at <strong>{scheduleForm.timeSlot}</strong>.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleCloseSchedule} 
              size="small" 
              sx={{ 
                textTransform: 'none', 
                backgroundColor: submitBtnBg, 
                px: 4, 
                '&:hover': { backgroundColor: submitBtnHover } 
              }}
            >
              Close
            </Button>
          </Box>
        )}
      </Dialog>

    </Box>
  );
};

export default InstallationGuide;
