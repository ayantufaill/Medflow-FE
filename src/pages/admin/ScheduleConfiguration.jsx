import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentPracticeInfo, updateScheduleConfig } from '../../store/slices/practiceInfoSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';

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
  Chip,
  Link,
  Checkbox,
  Collapse,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';


const ScheduleConfiguration = () => {
  const dispatch = useDispatch();
  const { data: practiceData, updateLoading } = useSelector((state) => state.practiceInfo);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  // Sync route slip settings from Redux
  useEffect(() => {
    if (practiceData?.scheduleConfig?.routeSlipSettings) {
      setRouteSlipSettings(prev => ({...prev, ...practiceData.scheduleConfig.routeSlipSettings}));
    }
    if (practiceData?.scheduleConfig?.enableRouteSlip !== undefined) {
      setEnableRouteSlip(practiceData.scheduleConfig.enableRouteSlip);
    }
  }, [practiceData]);

  const handleSave = async () => {
    if (!practiceData || (!practiceData._id && !practiceData.id)) {
      showSnackbar('Practice Info not found. Please fill it out first.', 'error');
      return;
    }
    try {
      const payload = {
        enableRouteSlip,
        routeSlipSettings,
      };
      await dispatch(updateScheduleConfig({ practiceInfoId: practiceData._id || practiceData.id, scheduleConfigData: payload })).unwrap();
      showSnackbar('Schedule Configuration saved successfully', 'success');
    } catch (err) {
      showSnackbar(err || 'Failed to save configuration', 'error');
    }
  };

  const [routeSlipOpen, setRouteSlipOpen] = useState(true);
  const [enableRouteSlip, setEnableRouteSlip] = useState(true);
  const [defaultColorsOpen, setDefaultColorsOpen] = useState(true);
  const [checklistsOpen, setChecklistsOpen] = useState(true);
  
  const [expandedSections, setExpandedSections] = useState({
    patientDetails: false,
    accountDetails: false,
    insuranceDetails: false,
    appointmentDetails: false,
    nextAppointmentDetails: false,
    otherDetails: false
  });

  const [routeSlipSettings, setRouteSlipSettings] = useState({
    patientName: true,
    patientAddress: true,
    patientDob: true,
    patientEmail: true,
    patientPhone: true,
    patientPrefDentist: true,
    patientPrefHygienist: true,
    patientReferringSources: true,
    
    totalOutstanding: true,
    individualOutstanding: true,
    insuranceOutstanding: true,
    
    carrierName: true,
    subscriberId: true,
    groupNumber: true,
    
    apptTime: true,
    apptReason: true,
    apptProvider: true,
    
    nextApptDate: true,
    nextApptTime: true,
    nextApptReason: true,
    
    printableNotes: true,
    customHeader: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const APPOINTMENT_CARD_SETTINGS = [
    { label: "Display half-hour intervals", defaultChecked: true },
    { label: "Hide appointments with 'No Show' status", defaultChecked: true },
    { label: "Show patient flags", defaultChecked: true },
    { label: "Show adjusted production", defaultChecked: false },
    { label: "Display Appointment Procedures", defaultChecked: true },
    { label: "Display Dental History/Risk Assessment icon", defaultChecked: true },
    { label: "Display Alerts icon", defaultChecked: true },
    { label: "Display Progress Notes icon", defaultChecked: true },
    { label: "Display Billing icon", defaultChecked: true },
    { label: "Display Treatment Plan icon", defaultChecked: true },
    { label: "Display Exam icon", defaultChecked: true },
    { label: "Display Appointment Tags", defaultChecked: true },
    { label: "Display Notes icon", defaultChecked: true },
    { label: "Display Appointment Status Bar", defaultChecked: true },
    { label: "Name", defaultChecked: true },
    { label: "Display Appointment Time", defaultChecked: true },
    { label: "Show Patient Phone Number On Print", defaultChecked: true },
    // Newly requested settings
    { label: "Send emails on declined appointments", defaultChecked: false },
    { label: "Display clinical docs icon", defaultChecked: true },
    { label: "Minimize communication icons", defaultChecked: false },
    { label: "Display total charge", defaultChecked: false },
    { label: "On appointment card: display total patient owing", defaultChecked: false },
    { label: "Inside appointment card details: display total patient owing", defaultChecked: false },
  ];
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ m: 0 }}>
          Practice Setup → Schedule Configuration
        </Typography>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={updateLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={updateLoading}
          sx={{ borderRadius: 5, textTransform: 'none', px: 3, bgcolor: '#003366' }}
        >
          {updateLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </Box>

      {/* General Settings */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>General Settings</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel control={<Switch />} label="Enable Horizontal Scroll" />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Minimum Slot Width</Typography>
            <TextField size="small" defaultValue={200} sx={{ width: 100 }} /> px
          </Box>

          <FormControlLabel control={<Switch defaultChecked />} label="Show Calendar in Patient Tab" />
          <FormControlLabel control={<Switch />} label="Enable adjustable slot height for screens wider than 2560px" />

          <Box>
            <Typography gutterBottom>Adjust slot height for wide screens</Typography>
            <Slider defaultValue={50} valueLabelDisplay="auto" />
          </Box>
        </Box>
      </Paper>

      {/* Appointment Card Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appointment Card Header</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" gutterBottom>Patient Name Format</Typography>
            <Select defaultValue="First Name Last Name" size="small" sx={{ minWidth: 220 }}>
              <MenuItem value="First Name Last Name">First Name Last Name</MenuItem>
            </Select>
          </Box>
          <FormControlLabel control={<Switch defaultChecked />} label="Display age" />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>Header Font Color</Typography>
          <Box sx={{ width: 60, height: 40, border: '2px solid #ddd', borderRadius: 1, bgcolor: '#ffffff' }} />
        </Box>
      </Paper>

      {/* Appointment Card Settings */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appointment Card Settings</Typography>
        <Grid container spacing={2}>
          {APPOINTMENT_CARD_SETTINGS.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FormControlLabel
                control={<Switch defaultChecked={!!item.defaultChecked} />}
                label={item.label}
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
            <TextField fullWidth label="Treatment Visit Duration" defaultValue="60 mins" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Recare Visit Duration" defaultValue="60 mins" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>Schedule Unit</Typography>
            <Select fullWidth defaultValue="10 mins">
              <MenuItem value="10 mins">10 mins</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>Schedule Increments</Typography>
            <Select fullWidth defaultValue="5 mins">
              <MenuItem value="5 mins">5 mins</MenuItem>
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
              {[
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
              ].map((row, index) => (
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
          <Button variant="contained" color="primary" size="small">
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
              {[
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
              ].map((appt, i) => (
                <TableRow key={i}>
                  <TableCell>{appt.type}</TableCell>
                  <TableCell align="center">{appt.providers}</TableCell>
                  <TableCell align="center">{appt.time}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Appointment Types Default Colors */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box 
          onClick={() => setDefaultColorsOpen(!defaultColorsOpen)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mb: defaultColorsOpen ? 2 : 0 }}
        >
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Appointment Types Default Colors
          </Typography>
          <InfoIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />
          {defaultColorsOpen ? <KeyboardArrowUpIcon color="primary" /> : <KeyboardArrowDownIcon color="primary" />}
        </Box>
        
        <Collapse in={defaultColorsOpen}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            {[
              { key: 'dentist', label: 'Dentist', color: '#4ade80' },
              { key: 'hygienist', label: 'Hygienist', color: '#60a5fa' },
              { key: 'assistant', label: 'Assistant', color: '#fbbf24' },
            ].map((role) => (
              <Box key={role.key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5, pl: 0.5 }}>
                <Box sx={{ width: 24, height: 18, bgcolor: role.color, borderRadius: 1, border: '1px solid #ccc', cursor: 'pointer', '&:hover': { opacity: 0.8 } }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{role.label}</Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Paper>
      {/* Tooltip, Patient Info & Route Slip Settings */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Appointment Tooltip Settings</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="Enable Tooltip" sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>Appointment Information</Typography>
            {[
              "Appointment Provider", "Appointment Type", "Appointment Tags", "Appointment Procedures",
              "Appointment Date", "Appointment Start Time", "Appointment End Time", "Appointment Charge",
              "Appointment Status", "Appointment Scheduled By", "Appointment Notes"
            ].map((item) => (
              <FormControlLabel key={item} control={<Switch defaultChecked />} label={item} sx={{ display: 'block', ml: 0 }} />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Patient Information</Typography>
            {[
              "Patient ID", "Patient Title", "Patient First Name", "Patient Last Name",
              "Patient Date of Birth", "Patient Home Phone", "Patient Mobile Number",
              "Patient Email", "Patient Risk", "Patient Premed", "Insurance Info",
              "Patient Credit", "Reffering Sources", "Patient Default DDS", "Patient Default Hygienist"
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={<Switch defaultChecked />}
                label={item}
                sx={{ display: 'block', ml: 0 }}
              />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Patient Route Slip Settings Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Patient Route Slip Settings</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={enableRouteSlip} 
                      onChange={(e) => setEnableRouteSlip(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Route Slip"
                  sx={{ mb: 1 }}
                />
                
                {/* Sub-accordions when enabled */}
                <Collapse in={enableRouteSlip}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1 }}>
                    {/* Patient Details */}
                    <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Box 
                        onClick={() => toggleSection('patientDetails')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#1a73e8' }, py: 0.5 }}
                      >
                        {expandedSections.patientDetails ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: expandedSections.patientDetails ? 600 : 500, color: expandedSections.patientDetails ? '#1a73e8' : 'text.primary' }}>
                          Patient Details
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections.patientDetails}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { key: 'patientName', label: 'Name' },
                            { key: 'patientAddress', label: 'Address' },
                            { key: 'patientDob', label: 'Date of Birth' },
                            { key: 'patientEmail', label: 'Email' },
                            { key: 'patientPhone', label: 'Phone Number' },
                            { key: 'patientPrefDentist', label: 'Preferred Dentist' },
                            { key: 'patientPrefHygienist', label: 'Preferred Hygienist' },
                            { key: 'patientReferringSources', label: 'Referring Sources' },
                          ].map((item) => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>

                    {/* Account Details */}
                    <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Box 
                        onClick={() => toggleSection('accountDetails')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#1a73e8' }, py: 0.5 }}
                      >
                        {expandedSections.accountDetails ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: expandedSections.accountDetails ? 600 : 500, color: expandedSections.accountDetails ? '#1a73e8' : 'text.primary' }}>
                          Account Details
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections.accountDetails}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { key: 'totalOutstanding', label: 'Total Outstanding' },
                            { key: 'individualOutstanding', label: 'Individual Outstanding' },
                            { key: 'insuranceOutstanding', label: 'Insurance Outstanding' },
                          ].map((item) => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>

                    {/* Insurance Details */}
                    <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Box 
                        onClick={() => toggleSection('insuranceDetails')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#1a73e8' }, py: 0.5 }}
                      >
                        {expandedSections.insuranceDetails ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: expandedSections.insuranceDetails ? 600 : 500, color: expandedSections.insuranceDetails ? '#1a73e8' : 'text.primary' }}>
                          Insurance Details
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections.insuranceDetails}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { key: 'carrierName', label: 'Carrier Name' },
                            { key: 'subscriberId', label: 'Subscriber ID' },
                            { key: 'groupNumber', label: 'Group Number' },
                          ].map((item) => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>

                    {/* Appointment Details */}
                    <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Box 
                        onClick={() => toggleSection('appointmentDetails')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#1a73e8' }, py: 0.5 }}
                      >
                        {expandedSections.appointmentDetails ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: expandedSections.appointmentDetails ? 600 : 500, color: expandedSections.appointmentDetails ? '#1a73e8' : 'text.primary' }}>
                          Appointment Details
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections.appointmentDetails}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { key: 'apptTime', label: 'Appointment Time' },
                            { key: 'apptReason', label: 'Appointment Reason' },
                            { key: 'apptProvider', label: 'Provider Name' },
                          ].map((item) => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>

                    {/* Next Appointment Details */}
                    <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Box 
                        onClick={() => toggleSection('nextAppointmentDetails')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#1a73e8' }, py: 0.5 }}
                      >
                        {expandedSections.nextAppointmentDetails ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: expandedSections.nextAppointmentDetails ? 600 : 500, color: expandedSections.nextAppointmentDetails ? '#1a73e8' : 'text.primary' }}>
                          Next Appointment Details
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections.nextAppointmentDetails}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { key: 'nextApptDate', label: 'Next Appointment Date' },
                            { key: 'nextApptTime', label: 'Next Appointment Time' },
                            { key: 'nextApptReason', label: 'Next Appointment Reason' },
                          ].map((item) => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>

                    {/* Other Details */}
                    <Box sx={{ pb: 0.5 }}>
                      <Box 
                        onClick={() => toggleSection('otherDetails')}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#1a73e8' }, py: 0.5 }}
                      >
                        {expandedSections.otherDetails ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: expandedSections.otherDetails ? 600 : 500, color: expandedSections.otherDetails ? '#1a73e8' : 'text.primary' }}>
                          Other Details
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections.otherDetails}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { key: 'printableNotes', label: 'Printable Notes' },
                            { key: 'customHeader', label: 'Custom Header' },
                          ].map((item) => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography variant="body2">{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Appointment Checklists */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box 
            onClick={() => setChecklistsOpen(!checklistsOpen)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          >
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Appointment Checklists
            </Typography>
            <InfoIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />
            {checklistsOpen ? <KeyboardArrowUpIcon color="primary" /> : <KeyboardArrowDownIcon color="primary" />}
          </Box>
          <Button 
            variant="text" 
            color="primary" 
            startIcon={<RefreshIcon />} 
            size="small" 
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Update Existing Checklists
          </Button>
        </Box>
        
        <Collapse in={checklistsOpen}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Pre-appointment Checklist</Typography>
              {["Import History", "Import Record", "Appt Reminder", "Verify Insurance Eligibility", "Share Consent Forms", "Deposit for treatment"].map((item) => (
                <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography>{item}</Typography>
                  <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                </Box>
              ))}
              <Button sx={{ mt: 2 }}>+ Add</Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Check-in Checklist</Typography>
              {["Review Records", "Review & sign Visit Plan", "Sign Consent Forms", "Verify Premed Taken"].map((item) => (
                <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography>{item}</Typography>
                  <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                </Box>
              ))}
              <Button sx={{ mt: 2 }}>+ Add</Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Check-out Checklist</Typography>
              {["Complete & Bill Procedures", "Purchase Products", "Share Clinical Reports", "Prescription", "Schedule Next Appt", "Send Lab Case"].map((item) => (
                <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography>{item}</Typography>
                  <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                </Box>
              ))}
              <Button sx={{ mt: 2 }}>+ Add</Button>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default ScheduleConfiguration;