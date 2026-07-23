import React from 'react';
import {
  Box, Typography, TextField, Button, Checkbox, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, InputAdornment, MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  PeopleAlt as PeopleAltIcon,
} from '@mui/icons-material';
import SectionHeader from './SectionHeader';

const ProvidersSetupSection = ({
  providers,
  providerSearch,
  providerSpecialty,
  onSearchChange,
  onSpecialtyChange,
}) => {
  const filteredProviders = providers.filter(p => {
    const name = p.userId
      ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`
      : `${p.firstName || ''} ${p.lastName || ''}`;
    const specialty = p.specialty?.length ? p.specialty.join(', ') : '';
    const matchesSearch = name.toLowerCase().includes(providerSearch.toLowerCase());
    const matchesSpecialty = !providerSpecialty || specialty.includes(providerSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
    >
      <SectionHeader
        number={3}
        icon={PeopleAltIcon}
        title="Providers Setup"
        subtitle="Active Providers - In office providers available for online booking"
      />

      <Box sx={{ px: 3, py: 2.5 }}>
        {/* Search & Actions Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2} flexWrap="wrap">
          <Box display="flex" gap={1} flex={1} minWidth={300}>
            <TextField
              placeholder="Search by provider name"
              size="small"
              value={providerSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ width: 220 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment>
              }}
            />
            <TextField
              select
              value={providerSpecialty}
              onChange={(e) => onSpecialtyChange(e.target.value)}
              size="small"
              sx={{ width: 180 }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">Filter by Specialty</MenuItem>
              <MenuItem value="General Dentistry">General Dentistry</MenuItem>
              <MenuItem value="Orthodontics">Orthodontics</MenuItem>
              <MenuItem value="Periodontics">Periodontics</MenuItem>
              <MenuItem value="Oral Surgery">Oral Surgery</MenuItem>
              <MenuItem value="Endodontics">Endodontics</MenuItem>
              <MenuItem value="Dental Hygiene">Dental Hygiene</MenuItem>
              <MenuItem value="Dental Assisting">Dental Assisting</MenuItem>
            </TextField>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            <Box display="flex" alignItems="center">
              <Checkbox size="small" />
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                Drag and drop order to reorder
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#2563eb',
                textTransform: 'none',
                borderRadius: 5,
                px: 3,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              + Add Provider
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#d1d5db',
                color: 'text.primary',
                textTransform: 'none',
                borderRadius: 5,
                px: 2,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              Reset Providers Order
            </Button>
          </Box>
        </Box>

        {/* Provider Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                {['PROVIDER', 'SPECIALTY', 'PROVIDER TYPE', 'EMAIL', 'MOBILE PHONE', 'FEDERAL TAX #', 'LICENSE #', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '2px solid', borderColor: 'divider' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProviders.map((p, i) => {
                const name = p.userId
                  ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`
                  : `${p.firstName || ''} ${p.lastName || ''}`;
                const specialty = p.specialty?.length ? p.specialty.join(', ') : '';
                const type = p.providerClass || 'Dentist';
                const email = p.userId?.email || p.email || '';
                const phone = p.phone || '';
                const tax = p.npiNumber || '';
                const license = p.licenseNumber || '';

                return (
                  <TableRow key={p._id || i} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                    <TableCell sx={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 500 }}>{name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{specialty}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{type}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{email}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{phone || '—'}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{tax}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{license}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton size="small"><VisibilityIcon fontSize="inherit" /></IconButton>
                      <IconButton size="small"><EditIcon fontSize="inherit" /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default ProvidersSetupSection;
