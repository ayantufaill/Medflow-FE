import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Button, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, Grid, Select, MenuItem, Stack, Drawer, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import NewRX from '../NewRX';
import { COLORS } from '../../../constants/colors';
import rxSvg from '../../../assets/clinicalicons/RX icon.svg';
import CardWrapper from '../../admin/AddUserDrawer/CardWrapper';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { 
  selectCurrentPatient, 
  fetchPatientRxThunk, 
  addPatientRxThunk, 
  selectPatientPrescriptions 
} from '../../../store/slices/patientSlice';

const RxDrawer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const providerList = useSelector(selectProviderDropdownList) || [];
  const [selectedProvider, setSelectedProvider] = useState('');

  const currentPatient = useSelector(selectCurrentPatient);
  const patientId = currentPatient?.chartNumber || currentPatient?.id || currentPatient?._id;
  const reduxPrescriptions = useSelector(selectPatientPrescriptions) || [];
  
  // Use local state for immediate UI feedback, but it gets synced with Redux when fetched
  const [localPrescriptions, setLocalPrescriptions] = useState([]);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (open && patientId) {
      dispatch(fetchPatientRxThunk(patientId));
    }
  }, [open, patientId, dispatch]);

  useEffect(() => {
    setLocalPrescriptions(reduxPrescriptions);
  }, [reduxPrescriptions]);

  const [tabValue, setTabValue] = useState(0);
  const [view, setView] = useState('list');
  const [formData, setFormData] = useState({
    rxNum: '', description: '', startDate: '', duration: '',
    longTerm: '', refills: '', dose: '', prints: '', provider: '', notes: ''
  });

  const handleOpen = () => setView('add');
  const handleCloseDialog = () => {
    setView('list');
    setFormData({
      rxNum: '', description: '', startDate: '', duration: '',
      longTerm: '', refills: '', dose: '', prints: '', provider: '', notes: ''
    });
  };

  const handleSaveRx = async (newRxData) => {
    // Optimistic local update
    const tempRx = { ...newRxData, id: Date.now() };
    setLocalPrescriptions(prev => [...prev, tempRx]);
    handleCloseDialog();
    
    // Background database sync
    if (patientId) {
      try {
        await dispatch(addPatientRxThunk({ patientId, rxData: newRxData })).unwrap();
        // Refresh the list from the database to get the real ID and confirm
        dispatch(fetchPatientRxThunk(patientId));
      } catch (err) {
        console.error("Failed to save prescription:", err);
        // On error, revert to original redux state
        setLocalPrescriptions(reduxPrescriptions);
      }
    }
  };

  const tableHeaders = [
    'Rx #', 'Description', 'Start Date', 'Duration',
    'Long Term', 'Refills', 'Dose', 'Prints', 'Provider', 'Notes'
  ];

  const formatRxNum = (rxNum) => {
    if (!rxNum) return '-';
    const str = String(rxNum);
    if (str.toUpperCase().startsWith('RX-')) return str;
    return `RX-${str.padStart(6, '0')}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 800 },
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Modern Header */}
        <Box sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}>
          <Box component="img" src={rxSvg} alt="rx icon" sx={{ width: 18, height: 18 }} />
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              color: COLORS.TEXT_PRIMARY,
              flex: 1,
            }}
          >
            RX (Prescriptions)
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>

        {view === 'list' && (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 4, bgcolor: '#fff' }}>
            <Typography sx={{ fontSize: '1rem', color: '#64748b' }}>
              Prescription records and medication history
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0' }}>
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                sx={{
                  minHeight: '36px',
                  '& .MuiTabs-indicator': { backgroundColor: '#2e3b84', height: '2px' },
                  '& .MuiTab-root': { minHeight: '36px', textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, color: '#64748b' },
                  '& .Mui-selected': { color: '#2e3b84 !important' }
                }}
              >
                <Tab label="Manual" />
                <Tab label="Electronic" />
              </Tabs>
            </Box>

            {/* Prescription List Section */}
            <CardWrapper 
              title="Prescription List" 
              noPadding
              action={
                <Stack direction="row" spacing={2} alignItems="center">
                  {tabValue === 1 && (
                    <>
                      <Button
                        variant="outlined"
                        sx={{
                          color: COLORS.ACCENT,
                          borderColor: COLORS.ACCENT,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          px: 3,
                          fontWeight: 600,
                          '&:hover': { borderColor: COLORS.ACCENT_HOVER, backgroundColor: 'rgba(37, 99, 235, 0.04)' }
                        }}
                      >
                        Generate
                      </Button>
                      <Select
                        size="small"
                        variant="standard"
                        displayEmpty
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        MenuProps={{ sx: { zIndex: 1500 } }}
                        sx={{
                          fontSize: '0.75rem',
                          minWidth: 120,
                          color: '#666',
                          '&:before': { borderBottom: '1px solid #ccc' },
                          '&:after': { borderBottom: `2px solid ${COLORS.ACCENT}` }
                        }}
                      >
                        <MenuItem value="">Select Provider</MenuItem>
                        {providerList.map((provider) => (
                          <MenuItem key={provider._id || provider.id} value={provider._id || provider.id}>
                            {provider.name || `${provider.firstName || ''} ${provider.lastName || ''}`.trim()}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<AddIcon sx={{ fontSize: '18px' }} />}
                    sx={{
                      backgroundColor: COLORS.ACCENT,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem',
                      px: 3,
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              }
            >
              <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '200px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      {tableHeaders.map((header, index) => (
                        <TableCell key={header} sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', borderBottom: `1px solid #e2e8f0`, borderRight: index !== tableHeaders.length - 1 ? `1px solid #e2e8f0` : 'none', py: 1.5 }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {localPrescriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 6, color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
                          No prescriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      localPrescriptions.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{formatRxNum(row.rxNum)}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.description}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.startDate}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.duration}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.longTerm}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.refills}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.dose}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.prints}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0`, borderRight: `1px solid #e2e8f0` }}>{row.provider}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', borderBottom: `1px solid #e2e8f0` }}>{row.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardWrapper>

            {/* Allergies Section */}
            <CardWrapper title="Allergies & Adverse Reactions">
              <Box sx={{ minHeight: 100, px: 1 }}>
                <Typography sx={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>No allergies recorded</Typography>
              </Box>
            </CardWrapper>
          </Box>
        )}

        {view === 'add' && (
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <NewRX onClose={handleCloseDialog} onSave={handleSaveRx} />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default RxDrawer;
