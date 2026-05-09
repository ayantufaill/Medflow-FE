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
  TextField,
  Select,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const DUMMY_DATA = [
  { patient: 'Alice Smith', code: 'CD2999', description: 'DLVR', status: 'Completed', provider: 'Christina Sabour', created: 'Mar 04, 2026', scheduled: 'Apr 22, 2026' },
  { patient: 'Bob Johnson', code: 'CD2999', description: 'DLVR', status: 'Completed', provider: 'Christina Sabour', created: 'Mar 04, 2026', scheduled: 'Apr 22, 2026' },
  { patient: 'Charlie Brown', code: 'D9951', description: 'occlusal adjustment', status: 'Completed', provider: 'Christina Sabour', created: 'Apr 23, 2026', scheduled: 'Apr 24, 2026' },
];

const ProceduresReport = () => {
  const [dateType, setDateType] = useState('scheduled');
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));

  const [providerAnchorEl, setProviderAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);

  const handleProviderClick = (event) => setProviderAnchorEl(event.currentTarget);
  const handleProviderClose = () => setProviderAnchorEl(null);

  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusClose = () => setStatusAnchorEl(null);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleCreateTemplate = () => setTemplateDialogOpen(true);
  const handleSaveTemplate = (name) => {
    console.log('Saving template:', name);
    alert(`Template "${name}" saved successfully!`);
  };

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting report as CSV...');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
        >
          Procedures Report:
        </Typography>

        {/* Filter Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <RadioGroup value={dateType} onChange={(e) => setDateType(e.target.value)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel 
                  value="scheduled" 
                  control={<Radio size="small" sx={{ p: 0.5 }} />} 
                  label={<Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600 }}>Procedure Scheduled Date :</Typography>} 
                />
                <Select variant="standard" size="small" value="range" sx={{ fontSize: '0.75rem', width: 80, height: 24 }}>
                  <MenuItem value="range">Range</MenuItem>
                </Select>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Start Date:</Typography>
                <DatePicker
                  value={startDate}
                  format="MM/DD/YYYY"
                  slotProps={{ 
                    textField: { variant: 'standard', size: 'small', sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                    openPickerIcon: { sx: { display: 'none' } }
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600, ml: 2 }}>End Date:</Typography>
                <DatePicker
                  value={endDate}
                  format="MM/DD/YYYY"
                  slotProps={{ 
                    textField: { variant: 'standard', size: 'small', sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem' } } },
                    openPickerIcon: { sx: { display: 'none' } }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel 
                  value="created" 
                  control={<Radio size="small" sx={{ p: 0.5 }} />} 
                  label={<Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, opacity: dateType === 'created' ? 1 : 0.5 }}>Procedure Created Date :</Typography>} 
                />
                <Select variant="standard" size="small" value="range" sx={{ fontSize: '0.75rem', width: 80, height: 24, opacity: 0.5 }}>
                  <MenuItem value="range">Range</MenuItem>
                </Select>
                <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.5 }}>Start Date:</Typography>
                <DatePicker
                  disabled
                  format="MM/DD/YYYY"
                  slotProps={{ 
                    textField: { variant: 'standard', size: 'small', sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem', opacity: 0.5 } } },
                    openPickerIcon: { sx: { display: 'none' } }
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600, ml: 2, opacity: 0.5 }}>End Date:</Typography>
                <DatePicker
                  disabled
                  format="MM/DD/YYYY"
                  slotProps={{ 
                    textField: { variant: 'standard', size: 'small', sx: { width: 100, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem', opacity: 0.5 } } },
                    openPickerIcon: { sx: { display: 'none' } }
                  }}
                />
              </Box>
            </RadioGroup>
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 600, color: '#337ab7', display: 'block', mt: 2 }}>Filter Report by:</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Provider:</Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleProviderClick}
              endIcon={<ChevronRight sx={{ fontSize: '0.8rem', transform: 'rotate(90deg)' }} />}
              sx={{ textTransform: 'none', color: '#4a89dc', borderColor: '#4a89dc', fontSize: '0.75rem', height: 26 }}
            >
              Select Provider
            </Button>
            <Menu anchorEl={providerAnchorEl} open={Boolean(providerAnchorEl)} onClose={handleProviderClose}>
              <MenuItem onClick={handleProviderClose} sx={{ fontSize: '0.75rem' }}>Dr. Smith</MenuItem>
              <MenuItem onClick={handleProviderClose} sx={{ fontSize: '0.75rem' }}>Dr. Sabour</MenuItem>
            </Menu>

            <Typography variant="caption" sx={{ fontWeight: 600, ml: 2 }}>Procedure Status:</Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleStatusClick}
              endIcon={<ChevronRight sx={{ fontSize: '0.8rem', transform: 'rotate(90deg)' }} />}
              sx={{ textTransform: 'none', color: '#4a89dc', borderColor: '#4a89dc', fontSize: '0.75rem', height: 26 }}
            >
              Select Status
            </Button>
            <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusClose}>
              <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Completed</MenuItem>
              <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Ada Code:</Typography>
            <TextField 
              placeholder="Enter code or procedure"
              variant="standard"
              size="small"
              sx={{ width: 200, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
            />
            
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Apply</Button>
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleCreateTemplate}
                sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
              >
                Create Template
              </Button>
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
                {['Patient', 'Procedure Code', 'Procedure Description', 'Status', 'Provider', 'Created Date', 'Scheduled Date'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map((row, i) => (
                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                  <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7' }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.code}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.created}</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem' }}>{row.scheduled}</TableCell>
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

export default ProceduresReport;
