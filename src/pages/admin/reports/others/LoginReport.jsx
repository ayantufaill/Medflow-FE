import React from 'react';
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
  const rows = [
    { id: 1, username: 'Babar Magsi', date: '05/08/2026 2:20 PM', status: 'Success', ip: '125.209.73.246', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36' },
    { id: 2, username: 'Dr. Smith', date: '05/08/2026 1:07 PM', status: 'Success', ip: '125.209.73.246', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
    { id: 3, username: 'Hygienist A', date: '05/08/2026 1:05 PM', status: 'Success', ip: '182.188.108.206', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
    { id: 4, username: 'Staff B', date: '05/08/2026 1:02 PM', status: 'Success', ip: '162.251.62.66', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
    { id: 5, username: 'Babar Magsi', date: '05/08/2026 12:42 PM', status: 'Success', ip: '182.188.108.206', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        Login Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date Range:</Typography>
          <Select defaultValue="Daily" size="small" variant="standard" sx={{ minWidth: 100, fontSize: '0.85rem' }}>
            <MenuItem value="Daily">Daily</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small"><ChevronLeft fontSize="small" /></IconButton>
          <Typography variant="body2" color="primary">May 08, 2026</Typography>
          <Typography variant="body2" sx={{ mx: 0.5 }}>➔</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date:</Typography>
          <Typography variant="body2" color="primary">05/08/2026</Typography>
          <IconButton size="small"><ChevronRight fontSize="small" /></IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Filter by User:</Typography>
          <TextField 
            placeholder="Search User" 
            size="small" 
            variant="outlined" 
            sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="contained" size="small" sx={{ backgroundColor: '#8db3d9', textTransform: 'none', px: 3 }}>Apply</Button>
          <Button variant="contained" size="small" sx={{ backgroundColor: '#d1a066', textTransform: 'none', px: 3 }}>Create Template</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Export Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" startIcon={<FileDownload />} sx={{ backgroundColor: '#4a90e2', textTransform: 'none' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<Print />} sx={{ backgroundColor: '#d1a066', textTransform: 'none' }}>Print</Button>
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
            {rows.map((row) => (
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
