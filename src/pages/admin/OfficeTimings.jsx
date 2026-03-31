import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Checkbox,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const OfficeTimings = () => {
  const [tabValue, setTabValue] = useState(0);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
        
        {/* Header Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={4}>
          <Button variant="contained" color="success" sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}>
            Re-Generate
          </Button>
        </Box>

        {/* Cycles Section */}
        <Box mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">Cycles</Typography>
            <Button variant="contained" sx={{ bgcolor: '#003366', borderRadius: 5, textTransform: 'none' }}>
              Add Cycle
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Default</TableCell>
                  <TableCell>From <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>Aug 31</Typography></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>Show details</Typography>
                      <InfoOutlinedIcon fontSize="small" sx={{ color: '#ccc', mr: 2 }} />
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>April 6</TableCell>
                  <TableCell>From <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>Apr 6</Typography></TableCell>
                  <TableCell>To <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>Apr 6</Typography></TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>Show details</Typography>
                      <InfoOutlinedIcon fontSize="small" sx={{ color: '#ccc', mr: 2 }} />
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} sx={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer' }}>+ Add Exceptions</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>233 Exception/s</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Schedules Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="bold">Schedules</Typography>
            <Button variant="contained" sx={{ bgcolor: '#003366', borderRadius: 5, textTransform: 'none' }}>
              Add Schedule
            </Button>
          </Box>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Default" sx={{ textTransform: 'none' }} />
            <Tab label="April 6" sx={{ textTransform: 'none' }} />
          </Tabs>

          <Paper variant="outlined" sx={{ p: 3 }}>
            {/* Opening Hours */}
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Opening hours:</Typography>
            {days.map((day) => (
              <Box key={day} display="flex" alignItems="center" mb={1.5} sx={{ height: 40 }}>
                <Typography variant="body2" sx={{ width: 120 }}>{day}</Typography>
                {['Saturday', 'Sunday', 'Monday'].includes(day) ? (
                  <Box display="flex" alignItems="center" ml="auto">
                    <Checkbox checked disabled size="small" />
                    <Typography variant="caption" color="textSecondary">closed</Typography>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="caption">from</Typography>
                    <TextField size="small" defaultValue="07:00 AM" sx={{ width: 100 }} inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} />
                    <Typography variant="caption">to</Typography>
                    <TextField size="small" defaultValue="04:00 PM" sx={{ width: 100 }} inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} />
                    <Box display="flex" alignItems="center" ml="auto">
                      <Checkbox size="small" />
                      <Typography variant="caption">closed</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}

            <Divider sx={{ my: 4 }} />

            {/* Scheduling Appt */}
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Scheduling Appt:</Typography>
            {days.map((day) => (
              <Box key={`appt-${day}`} display="flex" alignItems="center" mb={1.5} sx={{ height: 40 }}>
                <Typography variant="body2" sx={{ width: 120 }}>{day}</Typography>
                {['Saturday', 'Sunday', 'Monday'].includes(day) ? (
                  <Box display="flex" alignItems="center" ml="auto">
                    <Checkbox checked disabled size="small" />
                    <Typography variant="caption" color="textSecondary">closed</Typography>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
                    <Typography variant="caption">from</Typography>
                    <TextField size="small" defaultValue="08:00 AM" sx={{ width: 100 }} inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} />
                    <Typography variant="caption">to</Typography>
                    <TextField size="small" defaultValue="03:00 PM" sx={{ width: 100 }} inputProps={{ style: { fontSize: 12, textAlign: 'center' } }} />
                    <Box display="flex" alignItems="center" ml="auto">
                      <Checkbox size="small" />
                      <Typography variant="caption">closed</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default OfficeTimings;
