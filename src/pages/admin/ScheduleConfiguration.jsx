import React from 'react';
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const ScheduleConfiguration = () => {
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
          {[
            "Display half-hour intervals",
            "Hide appointments with 'No Show' status",
            "Show patient flags",
            "Show adjusted production",
            "Display Appointment Procedures",
            "Display Dental History/Risk Assessment icon",
            "Display Alerts icon",
            "Display Progress Notes icon",
            "Display Billing icon",
            "Display Treatment Plan icon",
            "Display Exam icon",
            "Display Appointment Tags",
            "Display Notes icon",
            "Display Appointment Status Bar",
            "Name",
            "Display Appointment Time",
            "Show Patient Phone Number On Print",
          ].map((label, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FormControlLabel
                control={<Switch defaultChecked={index > 3} />}
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

      {/* Tooltip & Patient Information */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Patient Information</Typography>
            {[
              "Patient ID", "Patient Title", "Patient First Name", "Patient Last Name",
              "Patient Date of Birth", "Patient Home Phone", "Patient Mobile Number",
              "Patient Email", "Patient Risk", "Patient Premed", "Insurance Info"
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
      </Grid>

      {/* Appointment Checklists */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Appointment Checklists</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Pre-appointment Checklist</Typography>
            {["Import History", "Import Record", "Appt Reminder", "Verify Insurance Eligibility", "Share Consent Forms"].map((item) => (
              <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                <Typography>{item}</Typography>
                <IconButton color="error" size="small"><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button sx={{ mt: 2 }}>+ Add</Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Check-in Checklist</Typography>
            {["Review Records", "Review & sign Visit Plan", "Sign Consent Forms", "Verify Premed Taken"].map((item) => (
              <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                <Typography>{item}</Typography>
                <IconButton color="error" size="small"><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button sx={{ mt: 2 }}>+ Add</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ScheduleConfiguration;