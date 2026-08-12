import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Grid,
  TablePagination,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Visibility, Clear as ClearIcon, FilterAltOff, Refresh as RefreshIcon, Info as InfoIcon } from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';
import { usePatients } from '../../hooks/redux/usePatient';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';
import InitialsAvatar from '../../components/shared/InitialsAvatar';

const PatientReportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByName, setSortByName] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
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
    setPage(0);
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

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Sliced for local frontend pagination
  const paginatedPatients = sortedPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleViewReport = (patientId) => {
    navigate(`/patients/${patientId}/report/risk`);
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, p: '16px' }}>
        
        {/* Row 1: Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '14px', flexWrap: 'wrap' }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: '8px',
            flex: '1 1 280px', maxWidth: 420,
            backgroundColor: COLORS.SURFACE_INPUT,
            borderRadius: radius.md,
            px: '10px', py: '7px',
            border: '1.5px solid transparent',
            '&:focus-within': { borderColor: COLORS.ACCENT },
          }}>
            <SearchIcon sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED, flexShrink: 0 }} />
            <Box
              component="input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              placeholder="Patient Name"
              sx={{
                flex: 1, border: 'none', outline: 'none',
                backgroundColor: 'transparent',
                fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_BODY,
                '&::placeholder': { color: COLORS.TEXT_MUTED },
              }}
            />
            {loading && searchTerm ? (
              <CircularProgress size={16} sx={{ color: COLORS.ACCENT, flexShrink: 0 }} />
            ) : searchTerm ? (
              <IconButton size="small" onClick={() => { setSearchTerm(''); setPage(0); }} aria-label="clear" sx={{ p: '2px' }}>
                <ClearIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            ) : null}
          </Box>
          <Tooltip title="Search help">
            <IconButton size="small" sx={{ color: COLORS.TEXT_MUTED }}><InfoIcon fontSize="small" /></IconButton>
          </Tooltip>

          <FormControlLabel
            control={<Checkbox checked={sortByName} onChange={(e) => { setSortByName(e.target.checked); setPage(0); }} size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
            label="Sort By Name"
            sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY } }}
          />

          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center', ml: 'auto' }}>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={() => fetch({ page: 1, limit: 100 })} disabled={loading} sx={{ color: COLORS.TEXT_MUTED }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Filters">
              <span>
                <IconButton size="small" onClick={handleResetFilters} disabled={!hasActiveFilters} sx={{ color: COLORS.TEXT_MUTED }}>
                  <FilterAltOff fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{
                '& .MuiTableCell-head': {
                  py: '10px',
                  fontFamily: 'Inter',
                  fontSize: fontSize.sm,
                  fontWeight: fontWeight.semibold,
                  color: COLORS.TEXT_MUTED,
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${COLORS.BORDER}`,
                },
              }}>
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
                  <TableCell colSpan={5} align="center" sx={{ py: 3, fontSize: '0.8rem', color: COLORS.TEXT_MUTED }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, fontSize: '0.8rem', color: COLORS.TEXT_MUTED }}>
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPatients.map((patient) => (
                  <TableRow key={patient._id || patient.id} hover sx={{
                    '& .MuiTableCell-body': {
                      py: 1,
                      fontFamily: 'Inter',
                      fontSize: fontSize.md,
                      color: COLORS.TEXT_BODY,
                      borderBottom: `1px solid ${COLORS.BORDER}`,
                    }
                  }}>
                    <TableCell sx={{ color: COLORS.TEXT_BODY }}>{patient.patientCode || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <InitialsAvatar
                          initials={getPatientInitials(patient.firstName, patient.lastName)}
                          size={26}
                          fontSize={11}
                          bg={COLORS.ACCENT}
                        />
                        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                          {patient.firstName} {patient.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_BODY }}>{patient.email || '-'}</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_BODY }}>{patient.phonePrimary || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility fontSize="small" />}
                        onClick={() => handleViewReport(patient._id || patient.id)}
                        sx={{
                          fontSize: '0.75rem',
                          fontFamily: 'Inter',
                          textTransform: 'none',
                          borderRadius: '6px',
                          borderColor: COLORS.BORDER,
                          color: COLORS.TEXT_MAIN,
                          '&:hover': {
                            backgroundColor: COLORS.BACKGROUND_LIGHT,
                            borderColor: COLORS.TEXT_MUTED
                          }
                        }}
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
        
        <TablePagination
          component="div"
          count={sortedPatients.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Rows per page:"
          sx={{
            borderTop: `1px solid ${COLORS.BORDER}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED,
              textTransform: 'uppercase', letterSpacing: '0.3px',
            },
            '& .MuiTablePagination-select': { fontFamily: 'Inter', fontSize: fontSize.sm },
          }}
        />
      </Box>
    </Box>
  );
};

export default PatientReportsPage;
