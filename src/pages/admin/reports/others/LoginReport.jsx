import React, { useState, useMemo, useEffect } from 'react';
import { reportingService } from '../../../../services/reporting.service';
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
  IconButton
} from '@mui/material';
import { ChevronLeft, ChevronRight, FileDownload, Print } from '@mui/icons-material';

const LoginReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await reportingService.getOtherReport('login', {
          date: endDate || new Date().toISOString(),
          range: 'Monthly'
        });
        
        const formatted = response.map((item, index) => ({
          id: index + 1,
          username: item.username || 'Unknown',
          date: new Date(item.lastActive || item.timestamp || Date.now()).toLocaleString(),
          status: item.status || 'Success',
          ip: '125.209.73.246', // mock data
          machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' // mock data
        }));
        
        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch login report:", error);
      }
    };
    fetchData();
  }, [endDate]);

  const filteredRows = useMemo(() => {
    let result = data;
    if (searchUser) {
      result = result.filter(r => r.username.toLowerCase().includes(searchUser.toLowerCase()));
    }
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : new Date('1900-01-01');
      const e = endDate ? new Date(endDate) : new Date('2100-01-01');
      result = result.filter(r => {
        // Simple hack: strip the time portion before parsing
        const dateOnly = r.date.split(' ')[0];
        const d = new Date(dateOnly);
        return d >= s && d <= e;
      });
    }
    return result;
  }, [searchUser, startDate, endDate, data]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Username,Login date,Login status,IP address,Machine info\n";
    filteredRows.forEach(row => {
      csvContent += `"${row.username}","${row.date}","${row.status}","${row.ip}","${row.machine}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "login_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        Login Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', mb: 3 }}>
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
            sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="text" size="small" onClick={() => { setSearchUser(''); setStartDate(''); setEndDate(''); }} sx={{ textTransform: 'none', color: 'error.main' }}>Clear filters</Button>
          <Button variant="contained" size="small" sx={{ backgroundColor: '#d1a066', textTransform: 'none', px: 3 }}>Create Template</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Export Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownload />} sx={{ backgroundColor: '#4a90e2', textTransform: 'none' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<Print />} sx={{ backgroundColor: '#d1a066', textTransform: 'none' }}>Print</Button>
      </Box>

      {/* Login Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Login date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Login status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>IP address</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Machine info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600 }}>{row.username}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.status}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.ip}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', maxWidth: 400, wordBreak: 'break-all', color: 'text.secondary' }}>{row.machine}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoginReport;
