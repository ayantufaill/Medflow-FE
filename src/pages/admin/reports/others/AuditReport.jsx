import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { ChevronLeft, ChevronRight, Search } from '@mui/icons-material';

const AuditReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const rows = [
    { id: 1, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'User Login Report', date: '05/08/2026 02:26 PM', message: 'Success, duration=171ms, params=startDate=2026-5-8 & endDate=2026-5-8', diff: { key: '', old: '', new: '' } },
    { id: 2, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Recare List Report', date: '05/08/2026 02:25 PM', message: 'Success, duration=40ms, params={"currentPage":1,"pageSize":15,"includeAppointed":false,"patientList":[],"includeFlags":null,"flagIds":null}', diff: { key: '', old: '', new: '' } },
    { id: 3, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Recare List Report', date: '05/08/2026 02:25 PM', message: 'Success, duration=38ms, params={"currentPage":1,"pageSize":15,"includeAppointed":false,"patientList":[],"includeFlags":null,"flagIds":null}', diff: { key: '', old: '', new: '' } },
    { id: 4, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Rx Report', date: '05/08/2026 02:25 PM', message: 'Success, duration=20ms, params=startDate=2026-5-7 & endDate=2026-5-8', diff: { key: '', old: '', new: '' } },
    { id: 5, patient: '', user: 'Y... S...', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Payment Lines Report', date: '05/08/2026 02:23 PM', message: 'Success, duration=24ms', diff: { key: '', old: '', new: '' } },
    { id: 6, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Unsigned Progress Notes Report', date: '05/08/2026 02:23 PM', message: 'Success, duration=656ms, params=date=2026-4-8 & endDate=2026-5-8', diff: { key: '', old: '', new: '' } },
    { id: 7, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Advanced Report', date: '05/08/2026 02:23 PM', message: 'Success, duration=281ms', diff: { key: '', old: '', new: '' } },
  ];

  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchUser) result = result.filter(r => r.user.toLowerCase().includes(searchUser.toLowerCase()));
    if (searchPatient) result = result.filter(r => r.patient.toLowerCase().includes(searchPatient.toLowerCase()));
    if (actionFilter !== 'All') result = result.filter(r => r.action === actionFilter);
    if (categoryFilter !== 'All') result = result.filter(r => r.category === categoryFilter);
    
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : new Date('1900-01-01');
      const e = endDate ? new Date(endDate) : new Date('2100-01-01');
      result = result.filter(r => {
        const dateOnly = r.date.split(' ')[0];
        const d = new Date(dateOnly);
        return d >= s && d <= e;
      });
    }
    return result;
  }, [searchUser, searchPatient, actionFilter, categoryFilter, startDate, endDate]);

  const handlePrint = () => window.print();

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        Audit Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Start Date:</Typography>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: '0.85rem', padding: '4px', border: '1px solid #ccc' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>End Date:</Typography>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: '0.85rem', padding: '4px', border: '1px solid #ccc' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Filter by User:</Typography>
          <TextField 
            placeholder="Search User" 
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            size="small" 
            variant="outlined" 
            sx={{ width: 150, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Filter by Patient:</Typography>
          <TextField 
            placeholder="Search Patient" 
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            size="small" 
            variant="outlined" 
            sx={{ width: 150, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Action:</Typography>
          <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} size="small" variant="standard" sx={{ minWidth: 100, fontSize: '0.85rem' }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Action Performed">Action Performed</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Category:</Typography>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} size="small" variant="standard" sx={{ minWidth: 100, fontSize: '0.85rem' }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Report">Report</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
        <Button variant="text" size="small" onClick={() => { setStartDate(''); setEndDate(''); setSearchUser(''); setSearchPatient(''); setActionFilter('All'); setCategoryFilter('All'); }} sx={{ textTransform: 'none', color: 'error.main' }}>Clear filters</Button>
        <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#f44336', textTransform: 'none', px: 3 }}>Print</Button>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Audit Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Subcategory</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Object</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee' }} rowSpan={2}>Message</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee', textAlign: 'center' }} colSpan={3}>Difference</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>Key</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>Old</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>New</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.user}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.category}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.subcategory}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.action}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.object}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.date}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee', maxWidth: 300, wordBreak: 'break-word' }}>{row.message}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.diff.key}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.diff.old}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', border: '1px solid #eee' }}>{row.diff.new}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditReport;
