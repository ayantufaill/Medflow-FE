import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Checkbox, FormControlLabel, TextField, Paper, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  InputAdornment, Tabs, Tab, Alert, MenuItem, Tooltip, Divider, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  DeleteOutline as DeleteOutlineIcon,
  ContentCopy as ContentCopyIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { practiceInfoService } from '../../services/practice-info.service';
import { providerService } from '../../services/provider.service';
import { roomService } from '../../services/room.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const deepMerge = (target, source) => {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;
  
  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] instanceof Array) {
      output[key] = source[key];
    } else if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  });
  return output;
};

const defaultSettings = {
  enableOnlineScheduling: true,
  bookLessThanHours: '4',
  bookMoreThanDays: '28',
  requireCreditCard: true,
  rules: [
    { title: "Cancellation Policy", body: "If you can't make it to your appointment, please cancel 2 days in advance to avoid a $100 short notice fee.", enabled: true },
    { title: "No Show Fee", body: "A fee of $100 will be charged for no shows.", enabled: true },
    { title: "Secure Appointment", body: "A Credit Card is required to secure your appointment.", enabled: true }
  ],
  enabledAppointmentTypes: ['Exam', 'Emergency', 'Cleaning', 'Online Consult']
};

const appointmentTypes = [
  'Exam', 'Emergency', 'Cleaning', 'Treatment', 'Other', 
  'Online Consult', 'Custom1', 'Custom2', 'Custom3', 
  'Custom4', 'Custom5', 'Custom6', 'Custom7', 
  'Custom8', 'Custom9', 'Custom10'
];

// Dummy constants removed, fetching from API instead.

const OnlineScheduleConfiguration = () => {
  const [practiceInfoId, setPracticeInfoId] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [providersData, setProvidersData] = useState([]);
  const [operatoriesData, setOperatoriesData] = useState([]);
  const [providerSearch, setProviderSearch] = useState('');
  const [providerSpecialty, setProviderSpecialty] = useState('');
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [practiceInfo, providersRes, operatoriesRes] = await Promise.all([
          practiceInfoService.getCurrentPracticeInfo().catch(() => null),
          providerService.getAllProviders(1, 100).catch(() => ({ providers: [] })),
          roomService.getAllRooms(1, 100).catch(() => ({ rooms: [] }))
        ]);

        if (practiceInfo) {
          setPracticeInfoId(practiceInfo._id || practiceInfo.id);
          if (practiceInfo.onlineSchedule && Object.keys(practiceInfo.onlineSchedule).length > 0) {
            setSettings(prev => deepMerge(prev, practiceInfo.onlineSchedule));
          }
        }

        setProvidersData(providersRes?.providers || []);
        setOperatoriesData(operatoriesRes?.rooms || []);
      } catch (error) {
        console.error('Failed to fetch online schedule:', error);
        showSnackbar('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showSnackbar]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleRuleChange = (index, field, value) => {
    setSettings(prev => {
      const newRules = [...prev.rules];
      newRules[index] = { ...newRules[index], [field]: value };
      return { ...prev, rules: newRules };
    });
  };

  const handleApptTypeToggle = (type) => {
    setSettings(prev => {
      const isEnabled = prev.enabledAppointmentTypes.includes(type);
      return {
        ...prev,
        enabledAppointmentTypes: isEnabled 
          ? prev.enabledAppointmentTypes.filter(t => t !== type)
          : [...prev.enabledAppointmentTypes, type]
      };
    });
  };

  const handleSave = async () => {
    try {
      let id = practiceInfoId;
      if (!id) {
        const newPractice = await practiceInfoService.createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: {
            line1: '123 Default St',
            city: 'Metropolis',
            state: 'NY',
            postalCode: '10001',
            country: 'United States'
          }
        });
        id = newPractice._id || newPractice.id;
        setPracticeInfoId(id);
      }
      
      await practiceInfoService.updateOnlineSchedule(id, settings);
      showSnackbar('Online Schedule configuration saved successfully', 'success');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to save configuration';
      showSnackbar(errMsg, 'error');
    }
  };

  const handleDeleteOperatory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operatory?')) return;
    try {
      await roomService.deleteRoom(id);
      setOperatoriesData(prev => prev.filter(op => op._id !== id && op.roomNumber !== id));
      showSnackbar('Operatory deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to delete operatory', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
        >
          Save Configuration
        </Button>
      </Box>

      {/* --- 1. SCHEDULING DETAILS --- */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>1. Scheduling Details</Typography>
        <FormControlLabel 
          control={
            <Checkbox 
              size="small" 
              checked={settings.enableOnlineScheduling}
              onChange={(e) => handleChange('enableOnlineScheduling', e.target.checked)}
            />
          } 
          label={<Typography variant="body2" fontWeight={500}>Enable online scheduling</Typography>} 
          sx={{ mb: 1, display: 'flex', alignItems: 'center' }} 
        />

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="body2">Do not allow patients to book less than:</Typography>
          <TextField 
            variant="standard" 
            value={settings.bookLessThanHours} 
            onChange={(e) => handleChange('bookLessThanHours', e.target.value)}
            sx={{ width: 35, input: { textAlign: 'center' } }} 
          />
          <Typography variant="body2">Hours before an appointment</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="body2">Do not allow patients to book appointments more than:</Typography>
          <TextField 
            variant="standard" 
            value={settings.bookMoreThanDays} 
            onChange={(e) => handleChange('bookMoreThanDays', e.target.value)}
            sx={{ width: 35, input: { textAlign: 'center' } }} 
          />
          <Typography variant="body2">Days in advance</Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Card on File</Typography>
        <FormControlLabel 
          control={
            <Checkbox 
              size="small" 
              checked={settings.requireCreditCard}
              onChange={(e) => handleChange('requireCreditCard', e.target.checked)}
            />
          } 
          label={<Typography variant="body2">Require Credit Card for New Patients (for Online Booking)</Typography>} 
          sx={{ mb: 3, display: 'flex', alignItems: 'center' }} 
        />

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Rules & Restrictions:</Typography>
        {settings.rules.map((rule, i) => (
          <Box key={i} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControlLabel 
              control={
                <Checkbox 
                  size="small" 
                  checked={rule.enabled}
                  onChange={(e) => handleRuleChange(i, 'enabled', e.target.checked)}
                />
              } 
              label={<Typography variant="caption" fontWeight="bold">Show Rule</Typography>} 
              sx={{ mt: 0.5 }} 
            />
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="caption" sx={{ width: 40 }}>Title</Typography>
                <TextField 
                  fullWidth size="small" 
                  value={rule.title} 
                  onChange={(e) => handleRuleChange(i, 'title', e.target.value)}
                />
              </Box>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Typography variant="caption" sx={{ width: 40, mt: 1 }}>Body</Typography>
                <TextField 
                  fullWidth multiline rows={2} size="small" 
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
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {appointmentTypes.slice(0, 8).map((type) => (
                <FormControlLabel 
                  key={type}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={settings.enabledAppointmentTypes.includes(type)}
                      onChange={() => handleApptTypeToggle(type)}
                    />
                  } 
                  label={<Typography variant="body2">{type}</Typography>} 
                  sx={{ my: -0.2 }} 
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {appointmentTypes.slice(8).map((type) => (
                <FormControlLabel 
                  key={type}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={settings.enabledAppointmentTypes.includes(type)}
                      onChange={() => handleApptTypeToggle(type)}
                    />
                  } 
                  label={<Typography variant="body2">{type}</Typography>} 
                  sx={{ my: -0.2 }} 
                />
              ))}
            </Box>
          </Grid>
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
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                sx={{ width: 250 }} 
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} 
              />
              <TextField 
                select 
                value={providerSpecialty}
                onChange={(e) => setProviderSpecialty(e.target.value)}
                size="small" 
                sx={{ width: 200 }} 
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">Filter by Specialty</MenuItem>
                <MenuItem value="General Dentist">General Dentist</MenuItem>
                <MenuItem value="Dental Hygienist">Dental Hygienist</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Box display="flex" alignItems="center">
                <Checkbox size="small" />
                <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.1 }}>Drag and drop table<br/>rows to reorder</Typography>
              </Box>
              <Button variant="contained" sx={{ bgcolor: '#003366', textTransform: 'none', borderRadius: 5, px: 3 }}>Add Provider +</Button>
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
                {providersData
                  .filter(p => {
                    const name = p.userId ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}` : `${p.firstName || ''} ${p.lastName || ''}`;
                    const specialty = p.specialty?.length ? p.specialty.join(', ') : '';
                    
                    const matchesSearch = name.toLowerCase().includes(providerSearch.toLowerCase());
                    const matchesSpecialty = !providerSpecialty || specialty.includes(providerSpecialty);
                    
                    return matchesSearch && matchesSpecialty;
                  })
                  .map((p, i) => {
                  const name = p.userId ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}` : `${p.firstName || ''} ${p.lastName || ''}`;
                  const specialty = p.specialty?.length ? p.specialty.join(', ') : '';
                  const type = p.providerClass || 'Dentist';
                  const email = p.userId?.email || p.email || '';
                  const phone = p.phone || '';
                  const tax = p.npiNumber || '';
                  const license = p.licenseNumber || '';

                  return (
                    <TableRow key={p._id || i}>
                      <TableCell sx={{ color: '#1976d2', fontSize: '0.8rem', fontWeight: 500 }}>{name}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{specialty}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{type}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{email}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{phone}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{tax}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{license}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><VisibilityIcon fontSize="inherit" /></IconButton>
                        <IconButton size="small"><EditIcon fontSize="inherit" /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              <Button variant="contained" sx={{ bgcolor: '#003366', textTransform: 'none', borderRadius: 5 }}>Add Operatory</Button>
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
                {operatoriesData.map((op, i) => (
                  <TableRow key={op._id || i}>
                    <TableCell sx={{ color: '#1976d2', fontSize: '0.8rem' }}>{op.name || op.roomNumber}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{op.status || 'Active'}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{op.order || i + 1}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{op.note || ''}</TableCell>
                    <TableCell align="right"><IconButton size="small" onClick={() => handleDeleteOperatory(op._id || op.roomNumber)}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
                  </TableRow>
                ))}
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
              <TextField fullWidth size="small" defaultValue="https://mychart.myoryx.com/online-schedule/index.html?realm=tf" InputProps={{ readOnly: true }} />
              <Button variant="contained" startIcon={<ContentCopyIcon />} sx={{ bgcolor: '#4a90e2', textTransform: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: '#357abd' } }}>Copy to clipboard</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OnlineScheduleConfiguration;
