import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Checkbox, FormControlLabel, TextField, Paper, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  InputAdornment, Tabs, Tab, Alert, MenuItem, Tooltip, Divider, CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  DeleteOutline as DeleteOutlineIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { practiceInfoService } from '../../services/practice-info.service';
import { appointmentTypeService } from '../../services/appointment-type.service';
import { providerService } from '../../services/provider.service';
import { roomService } from '../../services/room.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const OnlineScheduleConfiguration = () => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [practiceId, setPracticeId] = useState(null);
  
  // Data for lists
  const [allAppointmentTypes, setAllAppointmentTypes] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [allOperatories, setAllOperatories] = useState([]);
  
  // State for configuration
  const [config, setConfig] = useState({
    enabled: true,
    minBookingHours: 4,
    maxBookingDays: 28,
    requireCardForNewPatients: true,
    rules: [
      { show: true, title: "Cancellation Policy", body: "If you can't make it to your appointment, please cancel 2 days in advance to avoid a $100 short notice fee." },
      { show: true, title: "No Show Fee", body: "A fee of $100 will be charged for no shows." },
      { show: true, title: "Secure Appointment", body: "A Credit Card is required to secure your appointment." }
    ],
    enabledAppointmentTypes: [], // Array of IDs
  });

  const [saveStatus, setSaveStatus] = useState('');
  const saveTimeoutRef = useRef(null);

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const [practiceData, apptTypesData, providersData, roomsData] = await Promise.all([
          practiceInfoService.getCurrentPracticeInfo(),
          appointmentTypeService.getAllAppointmentTypes(1, 100, '', true),
          providerService.getAllProviders(1, 100, '', true),
          roomService.getAllRooms(1, 100, '', true)
        ]);

        if (practiceData) {
          setPracticeId(practiceData._id || practiceData.id);
          if (practiceData.onlineSchedule && Object.keys(practiceData.onlineSchedule).length > 0) {
            // Merge saved config with default structure
            setConfig(prev => ({
              ...prev,
              ...practiceData.onlineSchedule,
              rules: practiceData.onlineSchedule.rules || prev.rules
            }));
          }
        }

        setAllAppointmentTypes(apptTypesData.appointmentTypes || []);
        setAllProviders(providersData.providers || []);
        setAllOperatories(roomsData.rooms || []);
      } catch (err) {
        console.error('Failed to load online schedule data:', err);
        showSnackbar('Failed to load configuration data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Autosave mechanism
  const triggerAutosave = useCallback((updatedConfig) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setSaveStatus('Saving...');
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (practiceId) {
          await practiceInfoService.updateOnlineSchedule(practiceId, updatedConfig);
          setSaveStatus('Changes saved automatically');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      } catch (err) {
        console.error('Autosave error:', err);
        showSnackbar('Failed to save changes automatically', 'error');
        setSaveStatus('Failed to save');
      }
    }, 1000);
  }, [practiceId, showSnackbar]);

  // Handle simple field changes
  const handleChange = (field, value) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    triggerAutosave(updated);
  };

  // Handle rule changes
  const handleRuleChange = (index, field, value) => {
    const newRules = [...config.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    const updated = { ...config, rules: newRules };
    setConfig(updated);
    triggerAutosave(updated);
  };

  // Handle appointment type toggles
  const handleTypeToggle = (typeId) => {
    let newTypes = [...(config.enabledAppointmentTypes || [])];
    if (newTypes.includes(typeId)) {
      newTypes = newTypes.filter(id => id !== typeId);
    } else {
      newTypes.push(typeId);
    }
    const updated = { ...config, enabledAppointmentTypes: newTypes };
    setConfig(updated);
    triggerAutosave(updated);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const onlineSchedulingLink = `${window.location.origin}/online-schedule/${practiceId || ''}`;

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Save Status Overlay */}
      {saveStatus && (
        <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
          <Alert severity={saveStatus.includes('Failed') ? 'error' : 'success'} sx={{ boxShadow: 3 }}>
            {saveStatus}
          </Alert>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          component={RouterLink}
          to="/admin/practice-setup"
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Practice Setup
        </Typography>
        <Typography variant="caption" color="textSecondary">{'>'}</Typography>
        <Typography variant="caption" color="textSecondary">Online Schedule</Typography>
      </Box>

      {/* --- 1. SCHEDULING DETAILS --- */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>1. Scheduling Details</Typography>
        <FormControlLabel 
          control={
            <Checkbox 
              checked={config.enabled} 
              onChange={(e) => handleChange('enabled', e.target.checked)}
              size="small" 
            />
          } 
          label={<Typography variant="body2" fontWeight={500}>Enable online scheduling</Typography>} 
          sx={{ mb: 1, display: 'flex', alignItems: 'center' }} 
        />

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="body2">Do not allow patients to book less than:</Typography>
          <TextField 
            variant="standard" 
            value={config.minBookingHours}
            onChange={(e) => handleChange('minBookingHours', e.target.value)}
            sx={{ width: 35, input: { textAlign: 'center' } }} 
          />
          <Typography variant="body2">Hours before an appointment</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="body2">Do not allow patients to book appointments more than:</Typography>
          <TextField 
            variant="standard" 
            value={config.maxBookingDays}
            onChange={(e) => handleChange('maxBookingDays', e.target.value)}
            sx={{ width: 35, input: { textAlign: 'center' } }} 
          />
          <Typography variant="body2">Days in advance</Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Card on File</Typography>
        <FormControlLabel 
          control={
            <Checkbox 
              checked={config.requireCardForNewPatients} 
              onChange={(e) => handleChange('requireCardForNewPatients', e.target.checked)}
              size="small" 
            />
          } 
          label={<Typography variant="body2">Require Credit Card for New Patients (for Online Booking)</Typography>} 
          sx={{ mb: 3, display: 'flex', alignItems: 'center' }} 
        />

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Rules & Restrictions:</Typography>
        {config.rules.map((rule, i) => (
          <Box key={i} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={rule.show} 
                  onChange={(e) => handleRuleChange(i, 'show', e.target.checked)}
                  size="small" 
                />
              } 
              label={<Typography variant="caption" fontWeight="bold">Show Rule</Typography>} 
              sx={{ mt: 0.5 }} 
            />
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="caption" sx={{ width: 40 }}>Title</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={rule.title} 
                  onChange={(e) => handleRuleChange(i, 'title', e.target.value)}
                />
              </Box>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Typography variant="caption" sx={{ width: 40, mt: 1 }}>Body</Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={2} 
                  size="small" 
                  value={rule.body} 
                  onChange={(e) => handleRuleChange(i, 'body', e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* --- 2. APPOINTMENT TYPES SETUP --- */}
      <Box sx={{ bgcolor: '#f9f9f9', p: 3, borderRadius: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>2. Appointment Types Setup</Typography>
        <Grid container spacing={2}>
          {allAppointmentTypes.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">No appointment types found. Add them in Schedule Configuration.</Typography>
            </Grid>
          ) : (
            <>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {allAppointmentTypes.slice(0, Math.ceil(allAppointmentTypes.length / 2)).map((type) => (
                    <FormControlLabel 
                      key={type._id}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={(config.enabledAppointmentTypes || []).includes(type._id)}
                          onChange={() => handleTypeToggle(type._id)}
                        />
                      } 
                      label={<Typography variant="body2">{type.name}</Typography>} 
                      sx={{ my: -0.2 }} 
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {allAppointmentTypes.slice(Math.ceil(allAppointmentTypes.length / 2)).map((type) => (
                    <FormControlLabel 
                      key={type._id}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={(config.enabledAppointmentTypes || []).includes(type._id)}
                          onChange={() => handleTypeToggle(type._id)}
                        />
                      } 
                      label={<Typography variant="body2">{type.name}</Typography>} 
                      sx={{ my: -0.2 }} 
                    />
                  ))}
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* --- 3. PROVIDERS SETUP --- */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f1f3f4', display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight="bold">3. Providers Setup</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
        </Box>
        <Box sx={{ p: 3 }}>
          <Tabs value={0} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Active Providers" sx={{ textTransform: 'none', fontWeight: 'bold' }} />
          </Tabs>

          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>In Office Providers:</Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
            <Box display="flex" gap={1} flex={1}>
              <TextField 
                placeholder="Search by provider name" 
                size="small" 
                sx={{ width: 250 }} 
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} 
              />
              <TextField select defaultValue="" size="small" sx={{ width: 200 }} SelectProps={{ displayEmpty: true }}>
                <MenuItem value="">Filter by Specialty</MenuItem>
                <MenuItem value="dentist">General Dentist</MenuItem>
                <MenuItem value="hygiene">Dental Hygienist</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Box display="flex" alignItems="center">
                <Checkbox size="small" />
                <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.1 }}>Drag and drop table<br/>rows to reorder</Typography>
              </Box>
              <Button variant="contained" component={RouterLink} to="/admin/user-management" sx={{ bgcolor: '#003366', textTransform: 'none', borderRadius: 5, px: 3 }}>Add Provider +</Button>
              <Button variant="contained" sx={{ bgcolor: '#e0e0e0', color: 'text.primary', textTransform: 'none', borderRadius: 5, '&:hover': { bgcolor: '#d5d5d5' } }}>Reset Providers Order</Button>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                <TableRow>
                  {['Provider', 'Specialty', 'Provider Type', 'Email', 'Mobile Phone Number', 'Federal Tax Number', 'License Number', ''].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>No providers found.</TableCell>
                  </TableRow>
                ) : (
                  allProviders.map((p, i) => (
                    <TableRow key={p._id}>
                      <TableCell sx={{ color: '#1976d2', fontSize: '0.8rem', fontWeight: 500 }}>{`${p.firstName} ${p.lastName}`}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{p.specialty}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{p.providerType}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{p.email}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{p.phone}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{p.taxId}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{p.licenseNumber}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><VisibilityIcon fontSize="inherit" /></IconButton>
                        <IconButton size="small" component={RouterLink} to={`/users/${p._id}/edit`}><EditIcon fontSize="inherit" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* --- 4. OPERATORY SETUP --- */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f1f3f4' }}><Typography variant="subtitle2" fontWeight="bold">4. Operatory Setup</Typography></Box>
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={2} alignItems="flex-start">
            <Typography variant="h6" fontSize="1rem" fontWeight="bold">Operatories</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Button variant="contained" component={RouterLink} to="/admin/operatory-setup" sx={{ bgcolor: '#003366', textTransform: 'none', borderRadius: 5 }}>Add Operatory</Button>
              <FormControlLabel 
                control={<Checkbox size="small" sx={{ p: 0.5 }} />} 
                label={<Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Show Deleted Operatories</Typography>} 
                sx={{ mr: 0 }}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                <TableRow>{['Operatory', 'Status', 'Order', 'Note', ''].map(h => <TableCell key={h} sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{h}</TableCell>)}</TableRow>
              </TableHead>
              <TableBody>
                {allOperatories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No operatories found.</TableCell>
                  </TableRow>
                ) : (
                  allOperatories.map((op, i) => (
                    <TableRow key={op._id}>
                      <TableCell sx={{ color: '#1976d2', fontSize: '0.8rem' }}>{op.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{op.isActive ? 'Active' : 'Hidden'}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{op.itemOrder}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}></TableCell>
                      <TableCell align="right">
                        <IconButton size="small" component={RouterLink} to="/admin/operatory-setup"><EditIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* --- 5. ANALYTICS SETUP --- */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f1f3f4' }}><Typography variant="subtitle2" fontWeight="bold">5. Analytics Setup</Typography></Box>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>Please add your Google Measurement ID in Admin → Practice Info to track UTM links.</Alert>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: 'text.secondary' }}>
              No referral analytics links found. <Box component="span" sx={{ fontWeight: 600, color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>click here to add a new link</Box>
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: '#1a3a6b', whiteSpace: 'nowrap' }}>Online Scheduling Link:</Typography>
              <TextField fullWidth size="small" value={onlineSchedulingLink} InputProps={{ readOnly: true }} />
              <Button 
                variant="contained" 
                startIcon={<ContentCopyIcon />} 
                onClick={() => copyToClipboard(onlineSchedulingLink)}
                sx={{ bgcolor: '#4a90e2', textTransform: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: '#357abd' } }}
              >
                Copy to clipboard
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OnlineScheduleConfiguration;
