import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Checkbox, FormControlLabel, TextField, Paper, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  InputAdornment, Tabs, Tab, Alert, MenuItem, Tooltip, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  DeleteOutline as DeleteOutlineIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

const OnlineScheduleConfiguration = () => {
  const appointmentTypes = [
    'Exam', 'Emergency', 'Cleaning', 'Treatment', 'Other', 
    'Online Consult', 'Custom1', 'Custom2', 'Custom3', 
    'Custom4', 'Custom5', 'Custom6', 'Custom7', 
    'Custom8', 'Custom9', 'Custom10'
  ];

  const providers = [
    { name: 'Dr. John Doe (Default Dentist)', specialty: 'General Dentist', type: 'Dentist', email: 'john@example.com', phone: '123-456-7890', tax: 'XX-XXXXX', license: 'L12345' },
    { name: 'Jane Smith (Default Hygienist)', specialty: 'Dental Hygienist', type: 'Hygienist', email: 'jane@example.com', phone: '098-765-4321', tax: 'YY-YYYYY', license: 'L67890' }
  ];

  const operatories = [
    { name: 'Operatory 1', status: 'Active', order: 1, note: '' },
    { name: 'Operatory 2', status: 'Active', order: 2, note: '' },
    { name: 'Operatory 3', status: 'Active', order: 3, note: '' },
    { name: 'Operatory 4', status: 'Active', order: 4, note: '' },
    { name: 'Consult', status: 'Active', order: 5, note: '' },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 5 }}>
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
          control={<Checkbox defaultChecked size="small" />} 
          label={<Typography variant="body2" fontWeight={500}>Enable online scheduling</Typography>} 
          sx={{ mb: 1, display: 'block' }} 
        />

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="body2">Do not allow patients to book less than:</Typography>
          <TextField variant="standard" defaultValue="4" sx={{ width: 35, input: { textAlign: 'center' } }} />
          <Typography variant="body2">Hours before an appointment</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Typography variant="body2">Do not allow patients to book appointments more than:</Typography>
          <TextField variant="standard" defaultValue="28" sx={{ width: 35, input: { textAlign: 'center' } }} />
          <Typography variant="body2">Days in advance</Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Card on File</Typography>
        <FormControlLabel 
          control={<Checkbox defaultChecked size="small" />} 
          label={<Typography variant="body2">Require Credit Card for New Patients (for Online Booking)</Typography>} 
          sx={{ mb: 3, display: 'block' }} 
        />

        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Rules & Restrictions:</Typography>
        {[
          { title: "Cancellation Policy", body: "If you can't make it to your appointment, please cancel 2 days in advance to avoid a $100 short notice fee." },
          { title: "No Show Fee", body: "A fee of $100 will be charged for no shows." },
          { title: "Secure Appointment", body: "A Credit Card is required to secure your appointment." }
        ].map((rule, i) => (
          <Box key={i} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControlLabel control={<Checkbox defaultChecked size="small" />} label={<Typography variant="caption" fontWeight="bold">Show Rule</Typography>} sx={{ mt: 0.5 }} />
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="caption" sx={{ width: 40 }}>Title</Typography>
                <TextField fullWidth size="small" defaultValue={rule.title} />
              </Box>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Typography variant="caption" sx={{ width: 40, mt: 1 }}>Body</Typography>
                <TextField fullWidth multiline rows={2} size="small" defaultValue={rule.body} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* --- 2. APPOINTMENT TYPES SETUP --- */}
      <Box sx={{ bgcolor: '#f9f9f9', p: 3, borderRadius: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>2. Appointment Types Setup</Typography>
        <Grid container spacing={0}>
          {appointmentTypes.map((type) => (
            <Grid item xs={12} key={type}>
              <FormControlLabel 
                control={<Checkbox size="small" defaultChecked={['Exam', 'Emergency', 'Cleaning', 'Online Consult'].includes(type)} />} 
                label={<Typography variant="body2">{type}</Typography>} 
                sx={{ my: -0.5 }} 
              />
            </Grid>
          ))}
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
                {providers.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ color: '#1976d2', fontSize: '0.8rem', fontWeight: 500 }}>{p.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{p.specialty}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{p.type}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{p.email}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{p.phone}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{p.tax}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{p.license}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><VisibilityIcon fontSize="inherit" /></IconButton>
                      <IconButton size="small"><EditIcon fontSize="inherit" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* --- 4. OPERATORY SETUP --- */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f1f3f4' }}><Typography variant="subtitle2" fontWeight="bold">4. Operatory Setup</Typography></Box>
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontSize="1rem" fontWeight="bold">Operatories</Typography>
            <Button variant="contained" sx={{ bgcolor: '#003366', textTransform: 'none', borderRadius: 5 }}>Add Operatory</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                <TableRow>{['Operatory', 'Status', 'Order', 'Note', ''].map(h => <TableCell key={h} sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{h}</TableCell>)}</TableRow>
              </TableHead>
              <TableBody>
                {operatories.map((op, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ color: '#1976d2', fontSize: '0.8rem' }}>{op.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{op.status}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{op.order}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{op.note}</TableCell>
                    <TableCell align="right"><IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
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
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" fontWeight="bold">Online Scheduling Link:</Typography>
            <TextField fullWidth size="small" defaultValue="https://myoryx.com" InputProps={{ readOnly: true }} />
            <Button variant="contained" startIcon={<ContentCopyIcon />} sx={{ bgcolor: '#4a90e2', textTransform: 'none', whiteSpace: 'nowrap' }}>Copy to clipboard</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OnlineScheduleConfiguration;
