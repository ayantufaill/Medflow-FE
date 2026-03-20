import React, { useState } from 'react';
import { 
  Box, Typography, Button, IconButton, Paper, RadioGroup, 
  FormControlLabel, FormControl, InputLabel, Radio, TextField, Select, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Chip, Avatar, Dialog
} from '@mui/material';
import { 
  DeleteOutline, MailOutline, ChatBubbleOutline, 
  Settings, Science, Mic, MoreVert, Close, InfoOutlined, CheckCircle
} from '@mui/icons-material';
import LabOrder from './LabOrder';

const AppointmentPage = ({ patient, open, onClose, onSave }) => {
  // Mock data for the procedure icons shown in your screenshot
  const procedureIcons = [
    { label: "New", color: "#81ecec" }, { label: "Scr", color: "#ff7675" },
    { label: "FULL", color: "#ffeaa7" }, { label: "Pano", color: "#636e72", font: "white" },
    { label: "FMX", color: "#2d3436", font: "white" }, { label: "Xray", color: "#636e72", font: "white" },
    { label: "AdX", color: "#b2bec3" }, { label: "SCN", color: "#55efc4" },
    { label: "Con", color: "#81ecec" }, { label: "Vir", color: "#00b894", font: "white" }
  ];

  // State management
  const [visitType, setVisitType] = useState('recare');
  const [appointmentStatus, setAppointmentStatus] = useState('checked out complete');
  const [durationMins, setDurationMins] = useState(60);
  const [providerTimes, setProviderTimes] = useState([
    { provider: 'Dr. Masterson', mins: 60 }
  ]);
  const [preferredDentist, setPreferredDentist] = useState('');
  const [preferredHygienist, setPreferredHygienist] = useState('');
  const [referredBy, setReferredBy] = useState('Google reviews.');
  const [notes, setNotes] = useState('- Cash pay, no insurance.');
  const [sendReminders, setSendReminders] = useState(false);
  const [operatory, setOperatory] = useState('Operatory 2');
  const [labOrderOpen, setLabOrderOpen] = useState(false);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #eef2f6',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ bgcolor: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100%', overflow: 'hidden' }}>
        
        {/* 1. Top Blue Header Bar */}
        <Box sx={{ 
          bgcolor: '#4a6da7', color: 'white', p: 0.8, 
          display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '13px',
          position: 'relative'
        }}>
          <Typography sx={{ fontWeight: 500, fontSize: '14px', ml: 1 }}>
            {patient ? `${patient.firstName} ${patient.lastName}` : 'Tony Mastutus'}, Recare Appointment on 03/04/2026 @ 08:15 AM
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button variant="contained" 
              sx={{ bgcolor: '#d4a373', textTransform: 'none', fontSize: '11px', py: 0, height: 22, px: 1, boxShadow: 'none' }}>
              Re-schedule
            </Button>
            <Button variant="contained" 
              sx={{ bgcolor: '#d4a373', textTransform: 'none', fontSize: '11px', py: 0, height: 22, px: 1, boxShadow: 'none' }}>
              Move to shortlist
            </Button>
            <Button variant="contained" 
              sx={{ bgcolor: '#d4a373', textTransform: 'none', fontSize: '11px', py: 0, height: 22, px: 1, boxShadow: 'none' }}>
              Copy to shortlist
            </Button>
          </Box>
          <Select size="small" value={operatory} onChange={(e) => setOperatory(e.target.value)}
            sx={{ bgcolor: 'white', height: 24, ml: 'auto', fontSize: '12px', borderRadius: 1, '& .MuiSelect-select': { py: 0, px: 1 } }}>
            <MenuItem value="Operatory 1">Operatory 1</MenuItem>
            <MenuItem value="Operatory 2">Operatory 2</MenuItem>
            <MenuItem value="Operatory 3">Operatory 3</MenuItem>
            <MenuItem value="Hyg 1">Hyg 1</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* LEFT PANEL: Procedure Entry */}
          <Box sx={{ flexGrow: 1, p: 2, borderRight: '1px solid #cbd5e1', overflowY: 'auto', minHeight: 0 }}>
            
            {/* Visit Type Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontSize: '12px', mr: 2, fontWeight: 600, color: '#4a6da7' }}>Type of visit:</Typography>
              <RadioGroup row value={visitType} onChange={(e) => setVisitType(e.target.value)}>
                <FormControlLabel value="treatment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{fontSize: '12px'}}>Treatment</Typography>} />
                <FormControlLabel value="recare" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{fontSize: '12px'}}>Recare</Typography>} />
              </RadioGroup>
            </Box>

            {/* Procedure Icons Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, alignItems: 'center' }}>
               {/* Dynamic Icons from your screenshot */}
               <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {procedureIcons.map((item, idx) => (
                    <Chip 
                      key={idx} 
                      label={item.label} 
                      sx={{ 
                        bgcolor: item.color, color: item.font || 'black', 
                        borderRadius: '4px', height: 22, fontSize: '10px', fontWeight: 700 
                      }} 
                    />
                  ))}
                  <Typography sx={{ color: '#64748b', fontSize: '12px', ml: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>+Add Procedure</Typography>
               </Box>
            </Box>

            {/* Table Header Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#4a6da7' }}>
                Scheduled Procedures: <span style={{ fontWeight: 400, color: '#64748b', fontSize: '12px' }}>(show all procedures)</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button sx={{ bgcolor: '#e74c3c', color: 'white', textTransform: 'none', fontSize: '11px', height: 28, px: 2 }}>Compute next visit</Button>
                <Button sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', fontSize: '11px', height: 28, px: 2 }}>Re-estimate</Button>
              </Box>
            </Box>

            {/* The Procedure Table */}
            <Table size="small" sx={{ border: '1px solid #e2e8f0' }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ borderBottom: '2px solid #cbd5e1' }}><Checkbox size="small" checked /></TableCell>
                  {['Procedure', 'Site', 'Treatment', 'Provider', 'Pt Part', 'Total Charge'].map(head => (
                    <TableCell key={head} sx={{ fontSize: '11px', fontWeight: 700, color: '#475569', borderBottom: '2px solid #cbd5e1' }}>{head}</TableCell>
                  ))}
                  <TableCell sx={{ borderBottom: '2px solid #cbd5e1' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                  <TableCell padding="checkbox"><Checkbox size="small" checked /></TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>D4910</TableCell>
                  <TableCell />
                  <TableCell>
                    <Select size="small" value="Maintenance" sx={{ height: 26, fontSize: '11px', width: 140, bgcolor: 'white' }}>
                      <MenuItem value="Maintenance">Maintenance</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select size="small" value="Dr. Masterson" sx={{ height: 26, fontSize: '11px', minWidth: 120, bgcolor: 'white' }}>
                      <MenuItem value="Dr. Masterson">Dr. Masterson</MenuItem>
                      <MenuItem value="Dr. Kim">Dr. Kim</MenuItem>
                      <MenuItem value="Hygienist Kim">Hygienist Kim</MenuItem>
                      <MenuItem value="Hygienist Sarah">Hygienist Sarah</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>$257.00</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>$257.00</TableCell>
                  <TableCell sx={{ width: 80 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, color: '#94a3b8' }}>
                      <CheckCircle sx={{ fontSize: 18, color: '#22c55e' }} />
                      <Settings sx={{ fontSize: 18, cursor: 'pointer' }} />
                    </Box>
                  </TableCell>
                </TableRow>
                {/* Total Row */}
                <TableRow>
                  <TableCell colSpan={6} align="right" sx={{ fontSize: '12px', fontWeight: 700, py: 0.5 }}>$257.00</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 700, py: 0.5 }}>$257.00</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>

            {/* Action Footer */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2, gap: 1 }}>
               <Button variant="contained" sx={{ bgcolor: '#4a6da7', textTransform: 'none', fontSize: '10px', px: 3 }}>Complete All</Button>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{fontSize: '12px', color: '#475569'}}>check out appointment</Typography>} />
                  <Button sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', ml: 1, fontSize: '12px', px: 2 }}>Collect Payments</Button>
               </Box>
            </Box>
            <Button
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '11px',
                p: 0,
                minHeight: 0,
                mb: 2,
              }}
            >
              + add procedures from another visit
            </Button>
          </Box>
          

          {/* RIGHT PANEL: Appointment Details */}
          <Box sx={{ width: 340, p: 1.5, bgcolor: '#fdfdfd', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#475569', mb: 0.5 }}>Appointment Status</Typography>
              <FormControl size="small" fullWidth>
                <Select 
                  value={appointmentStatus} 
                  onChange={(e) => setAppointmentStatus(e.target.value)}
                  sx={{ fontSize: '11px', height: 30 }}
                >
                  <MenuItem value="unconfirmed">Unconfirmed</MenuItem>
                  <MenuItem value="preconfirmed">Preconfirmed</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="seated">Seated</MenuItem>
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="checkout incomplete">Checkout Incomplete</MenuItem>
                  <MenuItem value="checked out complete">Checked out complete</MenuItem>
                  <MenuItem value="no show">No Show</MenuItem>
                  <MenuItem value="rescheduled">Rescheduled</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#4a6da7' }}>Appt Duration:</Typography>
              <TextField 
                type="number"
                size="small" 
                value={durationMins} 
                onChange={(e) => setDurationMins(Number(e.target.value))}
                sx={{ width: 45, '& .MuiInputBase-input': { py: 0.3, px: 1, fontSize: '11px' } }} 
              />
              <Typography sx={{ fontSize: '11px', color: '#64748b' }}>mins</Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#4a6da7', mb: 0.5 }}>Provider/Assistant Times:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 0.3, mb: 0.5 }}>
                  <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Provider</Typography>
                  <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Time</Typography>
              </Box>
              {providerTimes.map((row, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Select size="small" value={row.provider} sx={{ height: 28, flexGrow: 1, fontSize: '11px' }}>
                    <MenuItem value="Dr. Masterson">Dr. Masterson</MenuItem>
                    <MenuItem value="Dr. Kim">Dr. Kim</MenuItem>
                    <MenuItem value="Hygienist Kim">Hygienist Kim</MenuItem>
                  </Select>
                  <Typography sx={{ fontSize: '10px', color: '#64748b' }}>{row.mins}m</Typography>
                  <DeleteOutline sx={{ color: '#ff7675', fontSize: 16, cursor: 'pointer' }} onClick={() => {
                    const newTimes = [...providerTimes];
                    newTimes.splice(index, 1);
                    setProviderTimes(newTimes);
                  }} />
                </Box>
              ))}
              <Button 
                size="small" 
                onClick={() => setProviderTimes([...providerTimes, { provider: '', mins: 60 }])}
                sx={{ fontSize: '10px', color: '#4a6da7', textTransform: 'none', p: 0, minHeight: 0 }}
              >
                + Add Provider/Assistant
              </Button>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', color: '#475569', mb: 0.3 }}>
                Patient's Preferred Dentist:
              </Typography>
              <FormControl size="small" fullWidth>
                <Select 
                  value={preferredDentist}
                  onChange={(e) => setPreferredDentist(e.target.value)}
                  sx={{ fontSize: '11px', height: 30 }}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="Dr. Masterson">Dr. Masterson</MenuItem>
                  <MenuItem value="Dr. Kim">Dr. Kim</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', color: '#475569', mb: 0.3 }}>
                Patient's Preferred Hygienist:
              </Typography>
              <FormControl size="small" fullWidth>
                <Select 
                  value={preferredHygienist}
                  onChange={(e) => setPreferredHygienist(e.target.value)}
                  sx={{ fontSize: '11px', height: 30 }}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="Hygienist Kim">Hygienist Kim</MenuItem>
                  <MenuItem value="Hygienist Sarah">Hygienist Sarah</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', color: '#4a6da7' }}>Referred By:</Typography>
              <TextField 
                size="small" 
                fullWidth
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '11px' }, mt: 0.3 }} 
              />
              <Typography sx={{ fontSize: '11px', color: '#4a6da7', mt: 0.5 }}>Notes <span style={{ fontSize: '9px', color: '#94a3b8' }}>(Show System Notes)</span></Typography>
              <Paper variant="outlined" sx={{ p: 0.5, mt: 0.3, bgcolor: '#fff', position: 'relative', minHeight: '32px', minWidth: '100%' }}>
                 {notes ? (
                   <Typography sx={{ fontSize: '10px', pr: 2 }}>{notes}</Typography>
                 ) : (
                   <Typography sx={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>No notes</Typography>
                 )}
                 <DeleteOutline 
                    sx={{ position: 'absolute', right: 4, top: 4, fontSize: 14, color: '#ff7675', cursor: 'pointer' }} 
                    onClick={() => setNotes('')}
                  />
              </Paper>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                <Button 
                  size="small" 
                  sx={{ fontSize: '10px', color: '#d4a373', textTransform: 'none', p: 0, minHeight: 0 }}
                  onClick={() => setNotes(notes + ' - ')}
                >
                  Add note/tags
                </Button>
                <IconButton size="small" sx={{ p: 0, color: '#00d2d3' }}>
                  <Mic fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#475569', mb: 0.3 }}>
                Reminder Preferences
              </Typography>
              <FormControlLabel 
                control={
                  <Checkbox 
                    size="small" 
                    checked={sendReminders}
                    onChange={(e) => setSendReminders(e.target.checked)}
                    sx={{ py: 0 }} 
                  />
                } 
                label={<Typography sx={{fontSize: '10px'}}>Don't send reminders for this appointment</Typography>} 
                sx={{ mt: 0, ml: 0, '& .MuiFormControlLabel-label': { fontSize: '10px' } }}
              />
            </Box>

            <Box sx={{ mt: 'auto' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#4a6da7', mb: 0.3 }}>Tags</Typography>
              <Button size="small" sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', width: 55, fontSize: '10px', py: 0.3 }}>Add</Button>
            </Box>
          </Box>
        </Box>

        {/* Footer Utility Bar */}
        <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          {/* First Line: Lab Order Button */}
          <Box sx={{ mb: 1 }}>
            <Button
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '11px',
                p: 0,
                minHeight: 0,
              }}
              onClick={() => setLabOrderOpen(true)}
            >
              + Lab Order
            </Button>
          </Box>

          {/* Second Line: Reminder and Save/Cancel Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '12px', color: '#475569' }}>Send a reminder to "save the date" now:</Typography>
              <Button startIcon={<MailOutline />} sx={{ fontSize: '11px', textTransform: 'none', color: '#4a6da7' }}>Via Email</Button>
              <Button startIcon={<ChatBubbleOutline />} sx={{ fontSize: '11px', textTransform: 'none', color: '#4a6da7' }}>Via Text Message</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', fontSize: '11px', px: 2 }}
                onClick={() => {
                  if (onSave) {
                    onSave({
                      patientId: patient?.id || patient?._id,
                      visitType,
                      appointmentStatus,
                      durationMinutes: durationMins,
                      providerTimes,
                      preferredDentist,
                      preferredHygienist,
                      referredBy,
                      notes,
                      sendReminders,
                      operatory
                    });
                  }
                }}
              >
                Save
              </Button>
              <Button sx={{ bgcolor: '#94a3b8', color: 'white', textTransform: 'none', fontSize: '11px', px: 2 }} onClick={onClose}>Cancel</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Lab Order Dialog */}
      <LabOrder open={labOrderOpen} onClose={() => setLabOrderOpen(false)} />
    </Dialog>
  );
};

export default AppointmentPage;