import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { practiceInfoService } from '../../services/practice-info.service';

const ScheduleConfiguration = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [practiceId, setPracticeId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [openApptTypeDialog, setOpenApptTypeDialog] = useState(false);
  const [newApptType, setNewApptType] = useState({ type: '', providers: 1, time: '60 mins' });
  
  const [openChecklistDialog, setOpenChecklistDialog] = useState(false);
  const [checklistSection, setChecklistSection] = useState('');
  const [newChecklistItemText, setNewChecklistItemText] = useState('');

  const [config, setConfig] = useState({
    general: {
      enableHorizontalScroll: false,
      minSlotWidth: 200,
      showCalendarInPatientTab: true,
      enableAdjustableSlotHeight: false,
      slotHeight: 50
    },
    appointmentCardHeader: {
      patientNameFormat: "First Name Last Name",
      displayAge: true,
      headerFontColor: "#ffffff"
    },
    appointmentCardSettings: {
      displayHalfHourIntervals: false,
      hideNoShowAppointments: false,
      showPatientFlags: false,
      showAdjustedProduction: false,
      displayProcedures: true,
      displayHistoryIcon: true,
      displayAlertsIcon: true,
      displayProgressNotesIcon: true,
      displayBillingIcon: true,
      displayTreatmentPlanIcon: true,
      displayExamIcon: true,
      displayTags: true,
      displayNotesIcon: true,
      displayStatusBar: true,
      displayName: true,
      displayTime: true,
      showPhoneOnPrint: true
    },
    treatmentSchedule: {
      treatmentVisitDuration: "60 mins",
      recareVisitDuration: "60 mins",
      scheduleUnit: "10 mins",
      scheduleIncrements: "5 mins"
    },
    statusColors: [
      { name: "Unconfirmed", color1: "#e5e7eb", color2: "", anim: "None" },
      { name: "Preconfirmed", color1: "#60a5fa", color2: "", anim: "None" },
      { name: "Confirmed", color1: "#4ade80", color2: "", anim: "None" },
      { name: "Arrived", color1: "#facc15", color2: "#fed7aa", anim: "Moving Stripes" },
      { name: "Ready To Be Seated", color1: "#facc15", color2: "#fed7aa", anim: "On Off" },
      { name: "Seated", color1: "#4ade80", color2: "#d1fae5", anim: "Moving Stripes" },
      { name: "Ready For Doctor", color1: "#3b82f6", color2: "#93c5fd", anim: "Moving Stripes" },
      { name: "In Treatment", color1: "#f9a8d4", color2: "", anim: "None" },
      { name: "Ready For Checkout", color1: "#374151", color2: "#9ca3af", anim: "Moving Stripes" },
      { name: "Checked out incomplete", color1: "#374151", color2: "", anim: "None" },
      { name: "Checked out complete", color1: "#6b7280", color2: "", anim: "None" },
      { name: "Call", color1: "#ef4444", color2: "", anim: "None" },
      { name: "Left message", color1: "#fbbf24", color2: "", anim: "None" },
      { name: "Running Late", color1: "#92400e", color2: "", anim: "None" },
      { name: "Sent Email Or Text", color1: "#6b21a8", color2: "", anim: "None" },
      { name: "Late", color1: "#f87171", color2: "#fecaca", anim: "Moving Stripes" },
    ],
    appointmentTypes: [
      { type: "Crown/bridge prep", providers: 3, time: "90 mins" },
      { type: "Periodic Ortho check", providers: 2, time: "30 mins" },
      { type: "Hygiene + Exam", providers: 2, time: "60 mins" },
      { type: "SRP", providers: 1, time: "120 mins" },
      { type: "Crown Delivery", providers: 2, time: "60 mins" },
      { type: "Invisalign bond", providers: 1, time: "60 mins" },
      { type: "Doctor new patient exam", providers: 2, time: "60 mins" },
      { type: "Hygiene new patient exam", providers: 2, time: "60 mins" },
      { type: "Composite 1-3 teeth", providers: 2, time: "60 mins" },
      { type: "Provisional swap", providers: 2, time: "65 mins" },
      { type: "Hygiene-no exam", providers: 1, time: "60 mins" },
      { type: "Limited Exam", providers: 2, time: "45 mins" },
      { type: "Implant scan 1-2 implants", providers: 3, time: "60 mins" },
      { type: "Implant delivery 1-2 implants", providers: 2, time: "60 mins" },
      { type: "New Patient Comp Exam", providers: 2, time: "60 mins" },
      { type: "Full arch prep", providers: 2, time: "180 mins" },
      { type: "Post op photos", providers: 2, time: "30 mins" },
    ],
    tooltipSettings: {
      enableTooltip: true,
      appointmentInfo: {
        "Appointment Provider": true, "Appointment Type": true, "Appointment Tags": true, "Appointment Procedures": true,
        "Appointment Date": true, "Appointment Start Time": true, "Appointment End Time": true, "Appointment Charge": true,
        "Appointment Status": true, "Appointment Scheduled By": true, "Appointment Notes": true
      },
      patientInfo: {
        "Patient ID": true, "Patient Title": true, "Patient First Name": true, "Patient Last Name": true,
        "Patient Date of Birth": true, "Patient Home Phone": true, "Patient Mobile Number": true,
        "Patient Email": true, "Patient Risk": true, "Patient Premed": true, "Insurance Info": true
      }
    },
    checklists: {
      preAppointment: ["Import History", "Import Record", "Appt Reminder", "Verify Insurance Eligibility", "Share Consent Forms"],
      checkIn: ["Review Records", "Review & sign Visit Plan", "Sign Consent Forms", "Verify Premed Taken"]
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await practiceInfoService.getCurrentPracticeInfo();
        if (data) {
          setPracticeId(data._id || data.id);
          if (data.scheduleConfig && Object.keys(data.scheduleConfig).length > 0) {
            setConfig(prev => ({
              ...prev,
              ...data.scheduleConfig
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load schedule config:', err);
        setError('Failed to load configuration.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!practiceId) {
      setError('No practice found to update.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await practiceInfoService.updateScheduleConfig(practiceId, config);
      setSuccess('Configuration saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateTooltip = (type, key, value) => {
    setConfig(prev => ({
      ...prev,
      tooltipSettings: {
        ...prev.tooltipSettings,
        [type]: {
          ...prev.tooltipSettings[type],
          [key]: value
        }
      }
    }));
  };

  const removeListItem = (section, item) => {
    setConfig(prev => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        [section]: prev.checklists[section].filter(i => i !== item)
      }
    }));
  };

  const openAddChecklistItem = (section) => {
    setChecklistSection(section);
    setNewChecklistItemText('');
    setOpenChecklistDialog(true);
  };

  const addChecklistItem = () => {
    if (!newChecklistItemText.trim()) return;
    setConfig(prev => ({
      ...prev,
      checklists: {
        ...prev.checklists,
        [checklistSection]: [...prev.checklists[checklistSection], newChecklistItemText.trim()]
      }
    }));
    setOpenChecklistDialog(false);
  };

  const removeApptType = (type) => {
    setConfig(prev => ({
      ...prev,
      appointmentTypes: prev.appointmentTypes.filter(a => a.type !== type)
    }));
  };

  const addApptType = () => {
    if (!newApptType.type.trim()) return;
    setConfig(prev => ({
      ...prev,
      appointmentTypes: [...prev.appointmentTypes, { ...newApptType }]
    }));
    setNewApptType({ type: '', providers: 1, time: '60 mins' });
    setOpenApptTypeDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc' }}>
      <Link
        component={RouterLink}
        to="/admin/practice-setup"
        variant="body2"
        underline="hover"
        color="primary"
      >
        Practice Setup
      </Link>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Practice Setup → Schedule Configuration
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* General Settings */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>General Settings</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel 
            control={
              <Switch 
                checked={config.general.enableHorizontalScroll} 
                onChange={(e) => updateNested('general', 'enableHorizontalScroll', e.target.checked)}
              />
            } 
            label="Enable Horizontal Scroll" 
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Minimum Slot Width</Typography>
            <TextField 
              size="small" 
              value={config.general.minSlotWidth} 
              onChange={(e) => updateNested('general', 'minSlotWidth', e.target.value)}
              sx={{ width: 100 }} 
            /> px
          </Box>

          <FormControlLabel 
            control={
              <Switch 
                checked={config.general.showCalendarInPatientTab} 
                onChange={(e) => updateNested('general', 'showCalendarInPatientTab', e.target.checked)}
              />
            } 
            label="Show Calendar in Patient Tab" 
          />
          <FormControlLabel 
            control={
              <Switch 
                checked={config.general.enableAdjustableSlotHeight} 
                onChange={(e) => updateNested('general', 'enableAdjustableSlotHeight', e.target.checked)}
              />
            } 
            label="Enable adjustable slot height for screens wider than 2560px" 
          />

          <Box>
            <Typography gutterBottom>Adjust slot height for wide screens</Typography>
            <Slider 
              value={config.general.slotHeight} 
              onChange={(e, v) => updateNested('general', 'slotHeight', v)}
              valueLabelDisplay="auto" 
            />
          </Box>
        </Box>
      </Paper>

      {/* Appointment Card Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appointment Card Header</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" gutterBottom>Patient Name Format</Typography>
            <Select 
              value={config.appointmentCardHeader.patientNameFormat} 
              onChange={(e) => updateNested('appointmentCardHeader', 'patientNameFormat', e.target.value)}
              size="small" 
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="First Name Last Name">First Name Last Name</MenuItem>
              <MenuItem value="Last Name, First Name">Last Name, First Name</MenuItem>
            </Select>
          </Box>
          <FormControlLabel 
            control={
              <Switch 
                checked={config.appointmentCardHeader.displayAge} 
                onChange={(e) => updateNested('appointmentCardHeader', 'displayAge', e.target.checked)}
              />
            } 
            label="Display age" 
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>Header Font Color</Typography>
          <Box 
            sx={{ 
              width: 60, height: 40, border: '2px solid #ddd', borderRadius: 1, 
              bgcolor: config.appointmentCardHeader.headerFontColor 
            }} 
          />
        </Box>
      </Paper>

      {/* Appointment Card Settings */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appointment Card Settings</Typography>
        <Grid container spacing={2}>
          {Object.entries({
            displayHalfHourIntervals: "Display half-hour intervals",
            hideNoShowAppointments: "Hide appointments with 'No Show' status",
            showPatientFlags: "Show patient flags",
            showAdjustedProduction: "Show adjusted production",
            displayProcedures: "Display Appointment Procedures",
            displayHistoryIcon: "Display Dental History/Risk Assessment icon",
            displayAlertsIcon: "Display Alerts icon",
            displayProgressNotesIcon: "Display Progress Notes icon",
            displayBillingIcon: "Display Billing icon",
            displayTreatmentPlanIcon: "Display Treatment Plan icon",
            displayExamIcon: "Display Exam icon",
            displayTags: "Display Appointment Tags",
            displayNotesIcon: "Display Notes icon",
            displayStatusBar: "Display Appointment Status Bar",
            displayName: "Name",
            displayTime: "Display Appointment Time",
            showPhoneOnPrint: "Show Patient Phone Number On Print",
          }).map(([key, label]) => (
            <Grid item xs={12} sm={6} key={key}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={config.appointmentCardSettings[key]} 
                    onChange={(e) => updateNested('appointmentCardSettings', key, e.target.checked)}
                  />
                }
                label={label}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Treatment & Schedule Settings */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Treatment & Schedule Settings</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Treatment Visit Duration" 
              value={config.treatmentSchedule.treatmentVisitDuration} 
              onChange={(e) => updateNested('treatmentSchedule', 'treatmentVisitDuration', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Recare Visit Duration" 
              value={config.treatmentSchedule.recareVisitDuration} 
              onChange={(e) => updateNested('treatmentSchedule', 'recareVisitDuration', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>Schedule Unit</Typography>
            <Select 
              fullWidth value={config.treatmentSchedule.scheduleUnit}
              onChange={(e) => updateNested('treatmentSchedule', 'scheduleUnit', e.target.value)}
            >
              <MenuItem value="10 mins">10 mins</MenuItem>
              <MenuItem value="15 mins">15 mins</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>Schedule Increments</Typography>
            <Select 
              fullWidth value={config.treatmentSchedule.scheduleIncrements}
              onChange={(e) => updateNested('treatmentSchedule', 'scheduleIncrements', e.target.value)}
            >
              <MenuItem value="5 mins">5 mins</MenuItem>
              <MenuItem value="10 mins">10 mins</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* Appointment Status Colors */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Appointment Status Colors</Typography>
          <Button startIcon={<RefreshIcon />} variant="outlined" size="small">
            Reset all
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Status Name</strong></TableCell>
                <TableCell align="center"><strong>Color 1</strong></TableCell>
                <TableCell align="center"><strong>Color 2*</strong></TableCell>
                <TableCell><strong>Animation</strong></TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.statusColors.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ width: 30, height: 20, bgcolor: row.color1, borderRadius: 1, mx: 'auto', border: '1px solid #ccc' }} />
                  </TableCell>
                  <TableCell align="center">
                    {row.color2 && (
                      <Box sx={{ width: 30, height: 20, bgcolor: row.color2, borderRadius: 1, mx: 'auto', border: '1px solid #ccc' }} />
                    )}
                  </TableCell>
                  <TableCell>{row.anim}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Appointment Types */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Appointment Types Settings</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            onClick={() => setOpenApptTypeDialog(true)}
          >
            + Add Appointment Type
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell align="center"><strong># of providers</strong></TableCell>
                <TableCell align="center"><strong>Total time</strong></TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.appointmentTypes.map((appt, i) => (
                <TableRow key={i}>
                  <TableCell>{appt.type}</TableCell>
                  <TableCell align="center">{appt.providers}</TableCell>
                  <TableCell align="center">{appt.time}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" size="small" onClick={() => removeApptType(appt.type)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Tooltip & Patient Information */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Appointment Tooltip Settings</Typography>
            <FormControlLabel 
              control={
                <Switch 
                  checked={config.tooltipSettings.enableTooltip} 
                  onChange={(e) => setConfig(p => ({ ...p, tooltipSettings: { ...p.tooltipSettings, enableTooltip: e.target.checked } }))}
                />
              } 
              label="Enable Tooltip" sx={{ mb: 2 }} 
            />
            
            <Typography variant="subtitle2" gutterBottom>Appointment Information</Typography>
            {Object.keys(config.tooltipSettings.appointmentInfo).map((item) => (
              <FormControlLabel 
                key={item} 
                control={
                  <Switch 
                    checked={config.tooltipSettings.appointmentInfo[item]} 
                    onChange={(e) => updateTooltip('appointmentInfo', item, e.target.checked)}
                  />
                } 
                label={item} sx={{ display: 'block', ml: 0 }} 
              />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Patient Information</Typography>
            {Object.keys(config.tooltipSettings.patientInfo).map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Switch 
                    checked={config.tooltipSettings.patientInfo[item]} 
                    onChange={(e) => updateTooltip('patientInfo', item, e.target.checked)}
                  />
                }
                label={item}
                sx={{ display: 'block', ml: 0 }}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Appointment Checklists */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Appointment Checklists</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Pre-appointment Checklist</Typography>
            {config.checklists.preAppointment.map((item) => (
              <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                <Typography>{item}</Typography>
                <IconButton color="error" size="small" onClick={() => removeListItem('preAppointment', item)}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button sx={{ mt: 2 }} onClick={() => openAddChecklistItem('preAppointment')}>+ Add</Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Check-in Checklist</Typography>
            {config.checklists.checkIn.map((item) => (
              <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                <Typography>{item}</Typography>
                <IconButton color="error" size="small" onClick={() => removeListItem('checkIn', item)}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button sx={{ mt: 2 }} onClick={() => openAddChecklistItem('checkIn')}>+ Add</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: 'none', px: 4, bgcolor: '#1a3a6b' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Box>

      {/* Appointment Type Dialog */}
      <Dialog open={openApptTypeDialog} onClose={() => setOpenApptTypeDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Appointment Type</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Type"
              fullWidth
              size="small"
              value={newApptType.type}
              onChange={(e) => setNewApptType({ ...newApptType, type: e.target.value })}
            />
            <TextField
              label="# of providers"
              type="number"
              fullWidth
              size="small"
              value={newApptType.providers}
              onChange={(e) => setNewApptType({ ...newApptType, providers: parseInt(e.target.value) || 1 })}
            />
            <TextField
              label="Total time"
              fullWidth
              size="small"
              value={newApptType.time}
              onChange={(e) => setNewApptType({ ...newApptType, time: e.target.value })}
              placeholder="e.g. 60 mins"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApptTypeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={addApptType}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Checklist Item Dialog */}
      <Dialog open={openChecklistDialog} onClose={() => setOpenChecklistDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Checklist Item</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Item Text"
              fullWidth
              size="small"
              value={newChecklistItemText}
              onChange={(e) => setNewChecklistItemText(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChecklistDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={addChecklistItem}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleConfiguration;