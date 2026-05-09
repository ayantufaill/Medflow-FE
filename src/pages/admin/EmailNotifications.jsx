import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, TextField, InputAdornment, IconButton, Collapse,
} from '@mui/material';
import { Search as SearchIcon, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const categories = [
  {
    name: 'Owner',
    items: ['Onyx Connection', 'E-Mail Service', 'Onyx Support'],
  },
  {
    name: 'Doctor',
    items: ['E-Mail Service', 'Onyx Support'],
  },
  {
    name: 'Assistant',
    items: ['Protocol Warning', 'Good News'],
  },
  {
    name: 'Front',
    items: ['Text Forms', 'Route Slips'],
  },
  {
    name: 'Manager',
    items: ['MailBoxWatch', 'Reminders Dashboard', 'Text Forms', 'Route Slips', 'System Service', 'Message Station'],
  },
  {
    name: 'Integration Role',
    items: ['Faxs'],
  },
];

const EmailNotifications = () => {
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('list');
  const [expandedCategories, setExpandedCategories] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  );

  const toggleCategory = (name) => {
    setExpandedCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.toLowerCase().includes(search.toLowerCase())),
  })).filter(cat => cat.items.length > 0);

  return (
    <Box>
      {/* Header */}
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#222', mb: 1 }}>Email Notifications</Typography>
      <Typography sx={{ fontSize: '0.78rem', color: '#666', mb: 3 }}>
        You can configure email notifications that each role would receive within patients table action for checking or unchecking the user to send or not to send an email notification.
      </Typography>

      {/* Search */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          size="small" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: '1rem', color: '#999' }} /></InputAdornment> }}
          sx={{ width: 200, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }}
        />
      </Box>

      {/* Category Tables */}
      {filteredCategories.map((cat) => (
        <Box key={cat.name} sx={{ mb: 0 }}>
          {/* Category Header */}
          <Box
            onClick={() => toggleCategory(cat.name)}
            sx={{
              bgcolor: '#1a3a6b', color: '#fff', px: 2, py: 0.6,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer', '&:hover': { bgcolor: '#15305a' },
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{cat.name}</Typography>
            <IconButton size="small" sx={{ color: '#fff', p: 0.2 }}>
              {expandedCategories[cat.name] ? <KeyboardArrowUp sx={{ fontSize: '1.1rem' }} /> : <KeyboardArrowDown sx={{ fontSize: '1.1rem' }} />}
            </IconButton>
          </Box>

          {/* Category Items */}
          <Collapse in={expandedCategories[cat.name]}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {cat.items.map((item, i) => (
                    <TableRow key={i} hover sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                      <TableCell sx={{ fontSize: '0.8rem', py: 0.8, borderBottom: '1px solid #eee', color: '#1a3a6b', fontWeight: 500 }}>
                        {item}
                      </TableCell>
                      <TableCell sx={{ width: 60, py: 0.8, borderBottom: '1px solid #eee' }} align="center">
                        <Checkbox size="small" sx={{ p: 0.3 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default EmailNotifications;
