import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';

const DUMMY_DATA = [
  { sentToPatient: 'Alice Smith (alice@example.com)', sentToUser: '', template: 'Save The Date', status: 'Pending', plannedOn: 'May 08, 2026', sentOn: '', info: 'Appt on 05/14/2026 @ 8:15 AM', sentBy: 'System', reply: '' },
  { sentToPatient: 'Bob Johnson (bob@example.com)', sentToUser: '', template: 'Patient Custom SMS', status: 'Sent', plannedOn: 'May 08, 2026', sentOn: 'May 08, 2026', info: '', sentBy: 'User', reply: '' },
  { sentToPatient: 'Charlie Brown (charlie@example.com)', sentToUser: '', template: 'Patient Welcome', status: 'Sent', plannedOn: 'May 08, 2026', sentOn: 'May 08, 2026', info: '', sentBy: 'User', reply: '' },
  { sentToPatient: 'David Lee (david@example.com)', sentToUser: '', template: 'Patient Custom SMS', status: 'Sent', plannedOn: 'May 08, 2026', sentOn: 'May 08, 2026', info: '', sentBy: 'User', reply: 'Great! Thank you! See you then!' },
];

const NotificationsReport = () => {
  const [notificationType, setNotificationType] = useState('patient');
  const [plannedStart, setPlannedStart] = useState(dayjs('2026-05-08'));
  const [plannedEnd, setPlannedEnd] = useState(dayjs('2026-05-08'));

  const [templateAnchorEl, setTemplateAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);

  const handleTemplateClick = (event) => setTemplateAnchorEl(event.currentTarget);
  const handleTemplateClose = () => setTemplateAnchorEl(null);

  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusClose = () => setStatusAnchorEl(null);

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting report as CSV...');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Notifications Report:
        </Typography>

        {/* Filter Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Planned On Start Date:</Typography>
              <DatePicker
                value={plannedStart}
                onChange={(v) => setPlannedStart(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 120, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Planned On End Date:</Typography>
              <DatePicker
                value={plannedEnd}
                onChange={(v) => setPlannedEnd(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 120, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sent On Start Date:</Typography>
              <DatePicker
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 120, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sent On End Date:</Typography>
              <DatePicker
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { variant: 'standard', size: 'small', sx: { width: 120, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Notification Type:</Typography>
            <RadioGroup 
              row 
              value={notificationType} 
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <FormControlLabel value="patient" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Patient</Typography>} />
              <FormControlLabel value="internal" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Internal</Typography>} />
              <FormControlLabel value="other" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Other</Typography>} />
            </RadioGroup>

            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleTemplateClick}
              endIcon={<ChevronRight sx={{ fontSize: '0.8rem', transform: 'rotate(90deg)' }} />}
              sx={{ textTransform: 'none', color: '#4a89dc', borderColor: '#4a89dc', fontSize: '0.75rem', height: 26, ml: 2 }}
            >
              Choose Template
            </Button>
            <Menu anchorEl={templateAnchorEl} open={Boolean(templateAnchorEl)} onClose={handleTemplateClose}>
              <MenuItem onClick={handleTemplateClose} sx={{ fontSize: '0.75rem' }}>Save The Date</MenuItem>
              <MenuItem onClick={handleTemplateClose} sx={{ fontSize: '0.75rem' }}>Patient Custom SMS</MenuItem>
              <MenuItem onClick={handleTemplateClose} sx={{ fontSize: '0.75rem' }}>Patient Welcome</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Notification Status:</Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleStatusClick}
              endIcon={<ChevronRight sx={{ fontSize: '0.8rem', transform: 'rotate(90deg)' }} />}
              sx={{ textTransform: 'none', color: '#4a89dc', borderColor: '#4a89dc', fontSize: '0.75rem', height: 26 }}
            >
              Choose Status
            </Button>
            <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusClose}>
              <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Sent</MenuItem>
              <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
              <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Failed</MenuItem>
            </Menu>

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Apply</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Create Template</Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, opacity: 0.3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button variant="contained" size="small" onClick={handleExport} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}>Export as CSV</Button>
          <Button variant="contained" size="small" onClick={handlePrint} sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}>Print</Button>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Sent to Patient', 'Sent to User', 'Template', 'Status', 'Planned On', 'Sent On', 'Related Info', 'Sent By', 'Patient Reply'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                  <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7' }}>{row.sentToPatient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentToUser}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.template}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.plannedOn}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentOn}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.info}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentBy}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.reply}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default NotificationsReport;
