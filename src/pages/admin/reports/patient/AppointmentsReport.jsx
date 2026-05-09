import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const DUMMY_DATA = [
  {
    patient: 'John Doe',
    flags: '',
    type: 'Treatment',
    status: 'Checked out complete',
    providers: 'KAR',
    operatory: 'Consult',
    aptDate: 'Apr 20, 2026',
    time: 'Mon, 08:00 AM',
    duration: '60 mins',
    procedures: 'fl / Scal w inflam',
    nextAptDate: 'Oct 01, 2026',
  },
  {
    patient: 'Jane Smith',
    flags: '',
    type: 'Recare',
    status: 'Checked out complete',
    providers: 'SAB',
    operatory: 'Operatory 2',
    aptDate: 'Apr 15, 2026',
    time: 'Wed, 10:30 AM',
    duration: '60 mins',
    procedures: 'fl / hygiene / URQ undefined / U...',
    nextAptDate: 'May 13, 2026',
  },
  {
    patient: 'Robert Brown',
    flags: '',
    type: 'Treatment',
    status: 'Cancelled Short Notice',
    providers: 'SAB',
    operatory: 'Operatory 4',
    aptDate: 'May 06, 2026',
    time: 'Wed, 12:30 PM',
    duration: '60 mins',
    procedures: '#30 OB, comp / #31 OB, comp',
    nextAptDate: '',
  },
];

const AppointmentsReport = () => {
  const [dateType, setDateType] = useState('aptDate');
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [provider, setProvider] = useState('all');
  const [status, setStatus] = useState('all');
  const [locationType, setLocationType] = useState('office');

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Appointments Report:
        </Typography>

        {/* Complex Filter Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <RadioGroup row value={dateType} onChange={(e) => setDateType(e.target.value)}>
              <FormControlLabel 
                value="aptDate" 
                control={<Radio size="small" />} 
                label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#337ab7' }}>Appointment Date :</Typography>} 
              />
            </RadioGroup>
            <Select 
              size="small" 
              value="range" 
              sx={{ 
                height: 24, 
                fontSize: '0.75rem', 
                width: 80, 
                '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 },
                '& .MuiSelect-select': { py: 0 }
              }}
            >
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="last7">Last 7 Days</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Start Date:</Typography>
              <DatePicker
                value={startDate}
                onChange={(v) => setStartDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { 
                    variant: 'standard',
                    size: 'small', 
                    sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' }, '& .MuiInputBase-input': { py: 0 } } 
                  },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, ml: 2 }}>End Date:</Typography>
              <DatePicker
                value={endDate}
                onChange={(v) => setEndDate(v)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { 
                    variant: 'standard',
                    size: 'small', 
                    sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' }, '& .MuiInputBase-input': { py: 0 } } 
                  },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <RadioGroup row value="created" onChange={() => {}}>
              <FormControlLabel 
                value="created" 
                control={<Radio size="small" />} 
                label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#337ab7' }}>Appointment Created Date :</Typography>} 
              />
            </RadioGroup>
            <Select 
              size="small" 
              value="range" 
              sx={{ 
                height: 24, 
                fontSize: '0.75rem', 
                width: 80, 
                '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 },
                '& .MuiSelect-select': { py: 0 }
              }}
            >
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="last7">Last 7 Days</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Start Date:</Typography>
              <DatePicker
                value={startDate}
                onChange={() => {}}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { 
                    variant: 'standard',
                    size: 'small', 
                    sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' }, '& .MuiInputBase-input': { py: 0 } } 
                  },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, ml: 2 }}>End Date:</Typography>
              <DatePicker
                value={endDate}
                onChange={() => {}}
                format="MM/DD/YYYY"
                slotProps={{ 
                  textField: { 
                    variant: 'standard',
                    size: 'small', 
                    sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' }, '& .MuiInputBase-input': { py: 0 } } 
                  },
                  openPickerIcon: { sx: { display: 'none' } }
                }}
              />
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600, display: 'block', mb: 1 }}>Filter Report by:</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Provider:</Typography>
              <Select size="small" value={provider} onChange={(e) => setProvider(e.target.value)} sx={{ height: 26, fontSize: '0.75rem', width: 140 }}>
                <MenuItem value="all">Select Provider</MenuItem>
                <MenuItem value="kar">KAR</MenuItem>
                <MenuItem value="sab">SAB</MenuItem>
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Appointment Status:</Typography>
              <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ height: 26, fontSize: '0.75rem', width: 140 }}>
                <MenuItem value="all">Select Status</MenuItem>
                <MenuItem value="complete">Checked out complete</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <RadioGroup row value={locationType} onChange={(e) => setLocationType(e.target.value)}>
              <FormControlLabel value="office" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Appointments</Typography>} />
              <FormControlLabel value="online" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Online Appointments</Typography>} />
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox size="small" sx={{ p: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Include Shortlisted Appointments</Typography>
            </Box>
            <Select size="small" defaultValue="all" sx={{ height: 26, fontSize: '0.75rem', width: 160 }}>
              <MenuItem value="all">Pts With Or Without Flags</MenuItem>
            </Select>

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Apply</Button>
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => setTemplateDialogOpen(true)}
                sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
              >
                Create Template
              </Button>
              <Button variant="contained" size="small" onClick={() => window.print()} sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Print</Button>
              <Button variant="contained" size="small" onClick={() => alert('Exporting CSV...')} sx={{ textTransform: 'none', backgroundColor: '#4a89dc', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Export CSV</Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, opacity: 0.3 }} />

        {/* Table Section */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Patient', 'Flags', 'Type', 'Status', 'Providers', 'Operatory', 'Apt. Date', 'Time', 'Duration', 'Procedures', 'Next Apt. Date'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', py: 1, borderBottom: '1px solid #ddd' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                  <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.flags}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.providers}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.operatory}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.aptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.time}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.procedures}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAptDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CreateTemplateDialog 
          open={templateDialogOpen} 
          onClose={() => setTemplateDialogOpen(false)} 
          onSave={handleSaveTemplate} 
        />
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentsReport;
