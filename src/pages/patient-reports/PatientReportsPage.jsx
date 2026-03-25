import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Search, Visibility, Clear, FilterAltOff, Refresh, Info } from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';
import { usePatients } from '../../hooks/redux/usePatient';

const PatientReportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByName, setSortByName] = useState(false);
  const { patients, loading, fetch } = usePatients();

  // Fetch patients on mount
  useEffect(() => {
    fetch({ page: 1, limit: 100 });
  }, [fetch]);

  const getPatientInitials = (firstName, lastName) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    return 'P';
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSortByName(false);
  };

  const hasActiveFilters = searchTerm || sortByName;

  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName?.toLowerCase().includes(searchLower) ||
      patient.lastName?.toLowerCase().includes(searchLower) ||
      patient.patientCode?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower)
    );
  });

  const sortedPatients = useMemo(() => {
    const list = [...filteredPatients];
    if (sortByName) {
      list.sort((a, b) => {
        const na = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
        const nb = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
        return na.localeCompare(nb);
      });
    }
    return list;
  }, [filteredPatients, sortByName]);

  const handleViewReport = (patientId) => {
    navigate(`/patients/${patientId}/report/risk`);
  };

  return (
    <Box>
      <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
        {/* Row 1: Search + Status Filter */}
        <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              fullWidth
              placeholder="Search patient"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm.length > 0 && (
                  <IconButton size="small" onClick={() => setSearchTerm('')} edge="end">
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sortByName}
                  onChange={(e) => setSortByName(e.target.checked)}
                  size="small"
                />
              }
              label="Sort By Name"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Tooltip title="Clear Filters">
                <span>
                  <IconButton
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                    color="primary"
                  >
                    <FilterAltOff />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Refresh">
                <span>
                  <IconButton onClick={() => fetch({ page: 1, limit: 100 })} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-head': { py: 0.75, fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' } }}>
                <TableCell>Patient Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telephone Number</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, fontSize: '0.8rem' }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, fontSize: '0.8rem' }}>
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                sortedPatients.map((patient) => (
                  <TableRow key={patient._id || patient.id} hover sx={{ '& .MuiTableCell-body': { py: 0.5, fontSize: '0.78rem' } }}>
                    <TableCell>{patient.patientCode || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.7rem' }}>
                          {getPatientInitials(patient.firstName, patient.lastName)}
                        </Avatar>
                        <Typography fontSize="0.78rem">
                          {patient.firstName} {patient.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.email || '-'}</TableCell>
                    <TableCell>{patient.phonePrimary || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility fontSize="small" />}
                        onClick={() => handleViewReport(patient._id || patient.id)}
                        sx={{ fontSize: '0.75rem', py: 0.25, px: 1 }}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PatientReportsPage;
