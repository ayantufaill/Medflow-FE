import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Tabs, Tab, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  MenuItem, Select, FormControl, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Grid, Menu
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import LabOrder from '../../components/shared/LabOrder';

const LabCasePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sortBy, setSortBy] = useState('Due Date');
  const [order, setOrder] = useState('Ascending');
  const [open, setOpen] = useState(false);
  
  // Status Filtering State
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');

  const [labCases, setLabCases] = useState([
    {
      id: 1,
      lab: 'Elite Dental Lab',
      patient: 'John Doe',
      createdDate: '2026-03-10',
      dueDate: '2026-03-25',
      appointmentDate: '2026-03-26',
      sharedOn: '2026-03-11',
      status: 'Sent',
      notes: 'PFM Crown #14',
      type: 'Active'
    }
  ]);

  const [formData, setFormData] = useState({
    lab: '', patient: '', createdDate: '', dueDate: '', 
    appointmentDate: '', sharedOn: '', status: 'Sent', notes: ''
  });

  // --- Handlers ---
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setActiveStatusFilter('All'); // Reset filter on tab change
  };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ lab: '', patient: '', createdDate: '', dueDate: '', appointmentDate: '', sharedOn: '', status: 'Sent', notes: '' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleStatusHeaderClick = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusFilterSelect = (status) => {
    setActiveStatusFilter(status);
    setStatusAnchorEl(null);
  };

  const handleAddCase = (data) => {
    const newCase = {
      lab: data.lab !== 'none' ? data.lab : 'New Lab', 
      patient: 'Unknown', // LabOrder doesn't currently provide patient
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      appointmentDate: '',
      sharedOn: '',
      status: 'Sent',
      notes: data.instructions ? 'Instructions provided' : '',
      id: Date.now(),
      type: tabValue === 0 ? 'Active' : tabValue === 1 ? 'Completed' : 'Archived'
    };
    setLabCases([...labCases, newCase]);
    handleClose();
  };

  // --- Filter & Sort Logic ---
  const filteredAndSortedCases = useMemo(() => {
    const tabMap = ['Active', 'Completed', 'Archived'];
    let result = labCases.filter(c => c.type === tabMap[tabValue]);

    // Apply Status Filter
    if (activeStatusFilter !== 'All') {
      result = result.filter(c => c.status === activeStatusFilter);
    }

    // Apply Sorting
    result.sort((a, b) => {
      const field = sortBy === 'Due Date' ? 'dueDate' : sortBy === 'Patient' ? 'patient' : 'status';
      if (order === 'Ascending') return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });

    return result;
  }, [labCases, tabValue, sortBy, order, activeStatusFilter]);

  const tableHeaders = ['Lab', 'Patient', 'Created Date', 'Due Date', 'Appointment Date', 'Shared On', 'Status', 'Notes'];

  return (
    <Box>
      <ClinicalNavbar />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.8rem', color: '#1a2735' }}>
          Lab Cases
        </Typography>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        {/* Sorting Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Sort By</Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ fontSize: '0.85rem', height: '32px' }}>
              <MenuItem value="Due Date">Due Date</MenuItem>
              <MenuItem value="Patient">Patient</MenuItem>
              <MenuItem value="Status">Status</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={order} onChange={(e) => setOrder(e.target.value)} sx={{ fontSize: '0.85rem', height: '32px' }}>
              <MenuItem value="Ascending">Ascending</MenuItem>
              <MenuItem value="Descending">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#1a2735' },
            '& .Mui-selected': { color: '#1a2735 !important', fontWeight: 'bold' }
          }}>
            <Tab label="Active Cases" sx={{ textTransform: 'none', fontSize: '0.85rem' }} />
            <Tab label="Completed Cases" sx={{ textTransform: 'none', fontSize: '0.85rem', color: '#82ad4e !important' }} />
            <Tab label="Archived Cases" sx={{ textTransform: 'none', fontSize: '0.85rem' }} />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#003380', borderRadius: '20px', textTransform: 'none', px: 3 }}>
            Add Lab Case
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                {tableHeaders.map((header) => (
                  <TableCell 
                    key={header} 
                    onClick={header === 'Status' ? handleStatusHeaderClick : null}
                    sx={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold', 
                      py: 1.5, 
                      cursor: header === 'Status' ? 'pointer' : 'default',
                      '&:hover': header === 'Status' ? { backgroundColor: '#f0f0f0' } : {}
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {header}
                      {header === 'Status' && <FilterListIcon sx={{ fontSize: '0.9rem' }} />}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8, color: '#9ca3af', fontStyle: 'italic' }}>
                    No lab cases found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCases.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.lab}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.patient}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.createdDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.dueDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.appointmentDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.sharedOn}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.status}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.notes}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Status Filter Menu */}
      <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={() => setStatusAnchorEl(null)}>
        <MenuItem onClick={() => handleStatusFilterSelect('All')}>All Statuses</MenuItem>
        <MenuItem onClick={() => handleStatusFilterSelect('Sent')}>Sent</MenuItem>
        <MenuItem onClick={() => handleStatusFilterSelect('Received')}>Received</MenuItem>
        <MenuItem onClick={() => handleStatusFilterSelect('In Progress')}>In Progress</MenuItem>
      </Menu>

      {/* Add Case Dialog using LabOrder */}
      <LabOrder 
        open={open} 
        onClose={handleClose} 
        onSubmit={handleAddCase}
        isLabCase={true} 
      />
    </Box>
  );
};

export default LabCasePage;