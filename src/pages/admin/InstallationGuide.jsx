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
    <Box sx={{ p: 0, minHeight: '80vh' }}>
      
      {/* Header Container */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: titleColor, 
            fontWeight: 500,
            fontSize: { xs: '1.75rem', md: '2.25rem' }
          }}
        >
          Oryx Imaging Installation Guide
        </Typography>

        <Button
          variant="contained"
          onClick={() => setScheduleOpen(true)}
          sx={{
            backgroundColor: scheduleBtnBg,
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            px: 2.5,
            py: 1,
            borderRadius: '4px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: scheduleBtnHover,
              boxShadow: 'none'
            }
          }}
        >
          Schedule Appointment
        </Button>
      </Box>

      {/* Main Form/Wizard Area */}
      {!submittedOs ? (
        <Box sx={{ mt: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#333', 
              mb: 2,
              fontSize: '1rem'
            }}
          >
            1. What Operating System will you be installing Oryx Imaging on?
          </Typography>

          <form onSubmit={handleOsSubmit}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={selectedOs}
                onChange={(e) => setSelectedOs(e.target.value)}
                sx={{ mb: 4 }}
              >
                <FormControlLabel 
                  value="Windows" 
                  control={<Radio size="medium" sx={{ color: '#ccc', '&.Mui-checked': { color: submitBtnBg } }} />} 
                  label={<Typography sx={{ fontSize: '0.95rem', color: '#4a5568' }}>Windows</Typography>} 
                  sx={{ mr: 4 }}
                />
                <FormControlLabel 
                  value="macOs" 
                  control={<Radio size="medium" sx={{ color: '#ccc', '&.Mui-checked': { color: submitBtnBg } }} />} 
                  label={<Typography sx={{ fontSize: '0.95rem', color: '#4a5568' }}>macOs</Typography>} 
                />
              </RadioGroup>
            </FormControl>

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedOs}
                sx={{
                  backgroundColor: submitBtnBg,
                  color: '#fff',
                  textTransform: 'none',
                  px: 4,
                  py: 0.75,
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: submitBtnHover,
                    boxShadow: 'none'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#e2e8f0',
                    color: '#a0aec0'
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
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
              color: '#718096',
              textTransform: 'none',
              fontSize: '0.85rem',
              mb: 4,
              p: 0,
              '&:hover': { background: 'none', textDecoration: 'underline' }
            }}
          >
            Choose a different Operating System
          </Button>

          {submittedOs === 'Windows' ? (
            /* WINDOWS GUIDE */
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <DesktopWindowsIcon sx={{ color: '#1976d2', fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
                  Windows Installation Steps
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  {/* Step 1 */}
                  <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2b6cb0', mb: 1 }}>
                      Step 1: Download the Oryx Imaging Installer
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', mb: 2, lineHeight: 1.6 }}>
                      Download the certified MSI installer packet for Windows. This download contains the drivers and system service utility required to establish bridge communication between your local X-ray sensors/intraoral cameras and the Oryx cloud system.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<GetAppIcon />}
                      sx={{
                        backgroundColor: '#2b6cb0',
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        '&:hover': { backgroundColor: '#1d4ed8' }
                      }}
                    >
                      Download OryxImagingSetup.msi (112 MB)
                    </Button>
                  </Paper>

                  {/* Step 2 */}
                  <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Step 2: Run the Setup Wizard
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                      Once the download is complete, locate the <strong>OryxImagingSetup.msi</strong> file in your downloads folder. Double-click it to run the installer. If a Windows User Account Control prompt appears, click <strong>Yes</strong> to grant administration privilege. Follow the prompt wizard and click <strong>Finish</strong>.
                    </Typography>
                  </Paper>

                  {/* Step 3 */}
                  <Paper variant="outlined" sx={{ p: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Step 3: Connect and Activate Workstation Device
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                      Connect your X-ray sensor or intraoral camera to an active USB port. Open the <strong>Oryx Imaging</strong> client from the newly created Desktop shortcut. Fill in your clinic authentication keys and select the appropriate workstation name. The sensor integration status will light up green once ready.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, bgcolor: '#f7fafc', borderLeft: '4px solid #4b71a1' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      System Requirements (Windows)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.8rem', lineHeight: 1.7 }}>
                      • OS: Windows 10 or 11 (64-bit Pro recommended)<br />
                      • CPU: Intel Core i5 / AMD Ryzen 5 or higher<br />
                      • RAM: 8 GB minimum (16 GB recommended)<br />
                      • USB: USB 3.0 port for hardware sensors<br />
                      • Network: Active high-speed broadband connection
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          ) : (
            /* MACOS GUIDE */
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AppleIcon sx={{ color: '#000', fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>
                  macOS Installation Steps
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  {/* Step 1 */}
                  <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2b6cb0', mb: 1 }}>
                      Step 1: Download the macOS Disk Image Bundle
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', mb: 2, lineHeight: 1.6 }}>
                      Download the secure package installer for macOS. This package includes both Intel and Apple Silicon native compilation formats to ensure optimal workstation performance.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<GetAppIcon />}
                      sx={{
                        backgroundColor: '#1a202c',
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        '&:hover': { backgroundColor: '#2d3748' }
                      }}
                    >
                      Download OryxImagingBundle.dmg (95 MB)
                    </Button>
                  </Paper>

                  {/* Step 2 */}
                  <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Step 2: Install the Application
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                      Double-click the downloaded <strong>OryxImagingBundle.dmg</strong> file. In the window that opens, drag the <strong>Oryx Imaging</strong> icon directly into your macOS <strong>Applications</strong> shortcut folder.
                    </Typography>
                  </Paper>

                  {/* Step 3 */}
                  <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Step 3: Allow Privacy &amp; Security Permissions
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                      Due to macOS Gatekeeper, you may need to authorize the application. Go to <strong>System Settings &gt; Privacy &amp; Security</strong>. Under "Security", click <strong>Open Anyway</strong> next to Oryx Imaging to confirm launch permissions.
                    </Typography>
                  </Paper>

                  {/* Step 4 */}
                  <Paper variant="outlined" sx={{ p: 3, borderColor: '#e2e8f0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      Step 4: Launch and Sync
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                      Launch the app from your Applications list. Select "Allow local network access" if prompted. Log in with your clinical registration keys to sync Oryx Imaging with your administrative database workstation.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, bgcolor: '#f7fafc', borderLeft: '4px solid #4b71a1' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                      System Requirements (macOS)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', fontSize: '0.8rem', lineHeight: 1.7 }}>
                      • OS: macOS Monterey 12 or newer<br />
                      • CPU: Apple Silicon (M1, M2, M3) or Intel Core i5<br />
                      • RAM: 8 GB minimum (16 GB recommended)<br />
                      • Hardware support: macOS-supported intraoral camera drivers<br />
                      • Network: Active broadband internet connection
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
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
