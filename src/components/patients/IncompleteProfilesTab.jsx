import React, { useState, useEffect } from "react";
import {
  Box, Typography, Checkbox, 
  TextField, Button, Paper, Stack, CircularProgress, Autocomplete
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { patientService } from '../../services/patient.service';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight, roundedAutocompletePaperSx } from '../../constants/styles';

// ── Shared button sx ──────────────────────────────────────────────────────────
const actionButtonSx = {
  textTransform: 'none',
  borderRadius: radius.md,
  fontFamily: 'Inter',
  fontSize: fontSize.sm,
  fontWeight: fontWeight.semibold,
  boxShadow: 'none',
  '&:hover': { boxShadow: 'none' },
};

// ── ProfileCard ───────────────────────────────────────────────────────────────
const ProfileCard = ({ type, data, isLinked, isSelected, onToggleSelect, onToggleCheckbox, isCheckboxChecked }) => {
  const isMyChart = type === "mychart";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1.5,
        bgcolor: COLORS.SURFACE_CARD,
        border: isMyChart
          ? `1.5px solid ${COLORS.ACCENT}`
          : `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.lg,
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: isMyChart ? COLORS.ACCENT : COLORS.TEXT_MUTED,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {isMyChart && (
          <Checkbox 
            size="small" 
            sx={{ p: 0, mt: 0.5 }} 
            checked={isSelected}
            onChange={onToggleSelect}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.bold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY }}>
            {data.name} - {data.dob}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>Date: {data.date}</Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_BODY }}>Email: {data.email}</Typography>
          {isMyChart && (
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>Registered With: {data.email}</Typography>
          )}
          
          {!isMyChart && (
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button 
                variant="contained" 
                size="small" 
                disableElevation
                disabled={!isLinked}
                sx={{ 
                  ...actionButtonSx,
                  backgroundColor: COLORS.ACCENT,
                  '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
                  minWidth: 60,
                  height: 26,
                }}
              >
                Update
              </Button>
              <Button 
                variant="contained" 
                size="small" 
                disableElevation
                sx={{ 
                  ...actionButtonSx,
                  backgroundColor: COLORS.STATUS_WARNING,
                  '&:hover': { backgroundColor: '#c2410c', boxShadow: 'none' },
                  height: 26,
                }}
              >
                Ignore Patient Requests
              </Button>
            </Stack>
          )}

          {isMyChart && (
            <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
                {['HIPAA', 'Confidential', 'MH', 'DH'].map((tag) => (
                  <Box key={tag} sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <Checkbox 
                      size="small" 
                      checked={isCheckboxChecked(data.id, tag)}
                      onChange={() => onToggleCheckbox(data.id, tag)}
                      sx={{ p: 0 }} 
                    />
                    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>{tag}</Typography>
                  </Box>
                ))}
              </Box>
              <DeleteIcon
                sx={{
                  fontSize: 16,
                  color: COLORS.STATUS_ERROR,
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  '&:hover': { color: '#dc2626' },
                }}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

// ── IncompleteProfilesTab ─────────────────────────────────────────────────────
const IncompleteProfilesTab = () => {
  // State for all data - initialized empty, will be populated from API
  const [mychartPatients, setMychartPatients] = useState([]);
  
  // Selection state
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Search state (keyed by patient index)
  const [searchQuery, setSearchQuery] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [loadingSearch, setLoadingSearch] = useState({});
  const [selectedPatient, setSelectedPatient] = useState({});
  
  // Checkbox states for MyChart patients (keyed by patientId-checkboxType)
  const [patientCheckboxes, setPatientCheckboxes] = useState({});

  // Get unlinked patients array
  const getUnlinkedPatients = () => mychartPatients.filter(p => !p.linked);
  
  // Get linked patients array
  const getLinkedPatients = () => mychartPatients.filter(p => p.linked);

  // Toggle individual patient selection
  const handleTogglePatient = (id) => {
    setSelectedPatients((prev) => 
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Select/Deselect all patients
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    
    if (checked) {
      // Select all patients
      const allIds = mychartPatients.map((p) => p.id);
      setSelectedPatients(allIds);
    } else {
      // Deselect all patients
      setSelectedPatients([]);
    }
  };

  // Delete selected patients
  const handleDeleteSelected = () => {
    if (selectedPatients.length === 0) return;
    
    // Call API to delete patients
    deletePatientsAPI(selectedPatients);
    
    // Update local state
    setMychartPatients((prev) => prev.filter((p) => !selectedPatients.includes(p.id)));
    setSelectedPatients([]);
    setSelectAll(false);
  };

  // Update selectAll state when selectedPatients changes
  useEffect(() => {
    setSelectAll(selectedPatients.length === mychartPatients.length && mychartPatients.length > 0);
  }, [selectedPatients, mychartPatients.length]);

  // Search patients from database
  const searchPatients = async (patientIndex, query) => {
    if (!query || query.length < 2) {
      setSearchResults(prev => ({ ...prev, [patientIndex]: [] }));
      return;
    }

    setLoadingSearch(prev => ({ ...prev, [patientIndex]: true }));
    
    try {
      const response = await patientService.getAllPatients(1, 10, query);
      setSearchResults(prev => ({ ...prev, [patientIndex]: response.patients || [] }));
    } catch (error) {
      console.error('Error searching patients:', error);
      setSearchResults(prev => ({ ...prev, [patientIndex]: [] }));
    } finally {
      setLoadingSearch(prev => ({ ...prev, [patientIndex]: false }));
    }
  };

  // Handle linking a patient
  const handleLinkPatient = (patientIndex, selectedPatientData) => {
    if (!selectedPatientData) return;
    
    // Call API to update link
    updatePatientLinkAPI(patientIndex, selectedPatientData._id || selectedPatientData.id);
    
    // Update local state
    setMychartPatients(prev => prev.map((p, idx) => {
      if (idx === patientIndex) {
        return { ...p, linked: true };
      }
      return p;
    }));
    
    // Clear the search for this index
    setSearchQuery(prev => ({ ...prev, [patientIndex]: '' }));
    setSearchResults(prev => ({ ...prev, [patientIndex]: [] }));
    setSelectedPatient(prev => ({ ...prev, [patientIndex]: null }));
  };

  // Toggle individual checkbox for a patient
  const handleToggleCheckbox = (patientId, checkboxType) => {
    const newCheckedState = !patientCheckboxes[`${patientId}-${checkboxType}`];
    
    setPatientCheckboxes(prev => ({
      ...prev,
      [`${patientId}-${checkboxType}`]: newCheckedState
    }));
    
    // Call API to update flags
    const allFlags = ['HIPAA', 'Confidential', 'MH', 'DH'];
    const currentFlags = {};
    allFlags.forEach(flag => {
      currentFlags[flag] = !!patientCheckboxes[`${patientId}-${flag}`];
    });
    currentFlags[checkboxType] = newCheckedState;
    
    updatePatientFlagsAPI(patientId, currentFlags);
  };

  // Get checkbox state for a patient
  const isCheckboxChecked = (patientId, checkboxType) => {
    return !!patientCheckboxes[`${patientId}-${checkboxType}`];
  };

  // Load patients on component mount
  useEffect(() => {
    loadPatientsFromAPI();
  }, []);

  // ============================================
  // HELPER FUNCTIONS FOR API INTEGRATION
  // ============================================
  
  // Load patients from API
  const loadPatientsFromAPI = async () => {
    try {
      const response = await patientService.getAllPatients(1, 100);
      console.log('API Response:', response);
      
      const apiPatients = (response.patients || []).map(patient => {
        console.log('Patient data:', patient);
        return ({
          id: patient._id || patient.id,
          name: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || patient.name || 'Unknown',
          dob: patient.dob ? new Date(patient.dob).toLocaleDateString() : (patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : ''),
          date: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '',
          email: patient.email || '',
          provider: patient.primaryProvider || '',
          linked: patient.linkedToOfficeProfile || false
        });
      });
      
      console.log('Processed patients:', apiPatients);
      setMychartPatients(apiPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  // Update patient link status via API
  const updatePatientLinkAPI = async (patientIndex, officeProfileId) => {
    try {
      // TODO: Call your API to update the link
      // await patientService.linkPatient(mychartPatients[patientIndex].id, officeProfileId);
      console.log('Link patient to office profile:', mychartPatients[patientIndex].id, officeProfileId);
    } catch (error) {
      console.error('Error updating patient link:', error);
    }
  };

  // Delete patients via API
  const deletePatientsAPI = async (patientIds) => {
    try {
      // TODO: Call your API to delete patients
      // await Promise.all(patientIds.map(id => patientService.deletePatient(id)));
      console.log('Delete patients:', patientIds);
    } catch (error) {
      console.error('Error deleting patients:', error);
    }
  };

  // Update patient flags (HIPAA, Confidential, etc.) via API
  const updatePatientFlagsAPI = async (patientId, flags) => {
    try {
      // TODO: Call your API to update patient flags
      // await patientService.updateFlags(patientId, flags);
      console.log('Update patient flags:', patientId, flags);
    } catch (error) {
      console.error('Error updating patient flags:', error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Section Title */}
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: fontWeight.bold,
            fontSize: fontSize.md,
            color: COLORS.ACCENT,
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            mb: 1.5,
          }}
        >
          Update Requests
        </Typography>
        
        {/* Toolbar — Select All / Delete */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            py: 1,
            px: 1.5,
            backgroundColor: COLORS.SURFACE_INPUT,
            borderRadius: radius.md,
            border: `1px solid ${COLORS.BORDER_LIGHT}`,
          }}
        >
          <Checkbox 
            size="small" 
            sx={{ p: 0 }} 
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>All</Typography>
          <Typography 
            sx={{ 
              fontFamily: 'Inter',
              fontSize: fontSize.sm, 
              fontWeight: fontWeight.semibold,
              color: selectedPatients.length > 0 ? COLORS.STATUS_ERROR : COLORS.TEXT_MUTED, 
              cursor: selectedPatients.length > 0 ? 'pointer' : 'not-allowed',
              ml: 0.5,
              textDecoration: selectedPatients.length > 0 ? 'underline' : 'none',
              transition: 'color 0.15s',
              '&:hover': selectedPatients.length > 0 ? { color: '#dc2626' } : {},
            }}
            onClick={handleDeleteSelected}
          >
            Delete All Selected ({selectedPatients.length})
          </Typography>
        </Box>

        {/* Three Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 1, alignItems: 'start' }}>
          {/* ── MyChart Column ─────────────────────────────────────────── */}
          <Box
            sx={{
              backgroundColor: COLORS.ACCENT_BG,
              borderRadius: radius.lg,
              border: `1px solid rgba(35, 98, 239, 0.15)`,
              p: 1.5,
            }}
          >
            {/* Column Header */}
            <Typography
              align="center"
              sx={{
                fontFamily: 'Inter',
                fontWeight: fontWeight.bold,
                fontSize: fontSize.sm,
                color: COLORS.ACCENT,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                py: 0.8,
              }}
            >
              MyChart Patient Profile
            </Typography>

            {/* Patient Cards */}
            {mychartPatients.map((patient, index) => (
              <Box key={patient.id} sx={{ mb: 1.5 }}>
                <ProfileCard 
                  type="mychart" 
                  data={patient} 
                  isSelected={selectedPatients.includes(patient.id)}
                  onToggleSelect={() => handleTogglePatient(patient.id)}
                  onToggleCheckbox={handleToggleCheckbox}
                  isCheckboxChecked={isCheckboxChecked}
                />
              </Box>
            ))}
          </Box>

          {/* ── Link Indicators Column ──────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', px: 1, pt: 4, position: 'relative' }}>
            {mychartPatients.map((patient, index) => (
              <Box key={patient.id} sx={{ height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 1.5, position: 'relative' }}>
                {/* Connection Line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '-20px',
                    right: patient.linked ? '-20px' : '50%',
                    height: '2px',
                    bgcolor: patient.linked ? COLORS.TEXT_MUTED : COLORS.STATUS_ERROR,
                    transform: 'translateY(-50%)',
                    zIndex: 0,
                  }}
                />
                {/* Icon centered on the line */}
                <Box
                  sx={{
                    bgcolor: COLORS.SURFACE_CARD,
                    borderRadius: '50%',
                    border: `1.5px solid ${patient.linked ? COLORS.ACCENT : COLORS.STATUS_ERROR}`,
                    p: 0.5,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {patient.linked ? (
                    <LinkIcon sx={{ color: COLORS.ACCENT, fontSize: 18 }} />
                  ) : (
                    <LinkOffIcon sx={{ color: COLORS.STATUS_ERROR, fontSize: 18 }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* ── Office Profiles Column ──────────────────────────────────── */}
          <Box
            sx={{
              backgroundColor: COLORS.SURFACE_TINT,
              borderRadius: radius.lg,
              border: `1px solid ${COLORS.BORDER}`,
              p: 1.5,
            }}
          >
            {/* Column Header */}
            <Typography
              align="center"
              sx={{
                fontFamily: 'Inter',
                fontWeight: fontWeight.bold,
                fontSize: fontSize.sm,
                color: COLORS.ACCENT,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                py: 0.8,
              }}
            >
              Office Patient Profile
            </Typography>

            {mychartPatients.map((patient, index) => (
              <Box key={patient.id} sx={{ mb: 1.5 }}>
                {patient.linked ? (
                  <ProfileCard type="office" data={patient} isLinked={true} />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      bgcolor: COLORS.SURFACE_CARD,
                      border: `1px solid ${COLORS.BORDER}`,
                      borderRadius: radius.lg,
                      minHeight: 130,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: COLORS.TEXT_MUTED },
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
                      <Autocomplete
                        fullWidth
                        size="small"
                        options={searchResults[index] || []}
                        loading={loadingSearch[index] || false}
                        getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''} - ${option.dob ? new Date(option.dob).toLocaleDateString() : ''}`}
                        getOptionKey={(option) => option._id || option.id}
                        value={selectedPatient[index] || null}
                        onChange={(event, newValue) => {
                          setSelectedPatient(prev => ({ ...prev, [index]: newValue }));
                        }}
                        onInputChange={(event, newInputValue) => {
                          setSearchQuery(prev => ({ ...prev, [index]: newInputValue }));
                          searchPatients(index, newInputValue);
                        }}
                        slotProps={{
                          paper: { sx: roundedAutocompletePaperSx },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search patients"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <SearchIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED, mr: 0.5 }} />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                              endAdornment: (
                                <>
                                  {loadingSearch[index] ? <CircularProgress color="inherit" size={18} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: radius.md,
                                fontFamily: 'Inter',
                                '& fieldset': { borderColor: COLORS.BORDER },
                                '&:hover fieldset': { borderColor: COLORS.TEXT_MUTED },
                                '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT, borderWidth: '1.2px' },
                              },
                              '& .MuiInputBase-input': { py: 0.5, fontFamily: 'Inter', fontSize: fontSize.base },
                              '& .MuiInputBase-input::placeholder': { color: COLORS.TEXT_MUTED, opacity: 0.8 },
                              '& .MuiInputBase-root': { minHeight: 'auto' },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ py: 0.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                                {option.firstName} {option.lastName}
                              </Typography>
                              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>
                                DOB: {option.dob ? new Date(option.dob).toLocaleDateString() : 'N/A'} | 
                                {option.email ? ` ${option.email}` : ''}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        noOptionsText="No patients found"
                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                      />
                      <Button 
                        size="small" 
                        variant="contained" 
                        disableElevation
                        disabled={!selectedPatient[index]}
                        sx={{ 
                          ...actionButtonSx,
                          height: 34, 
                          minWidth: 70, 
                          backgroundColor: selectedPatient[index] ? COLORS.ACCENT : COLORS.SURFACE_INPUT,
                          color: selectedPatient[index] ? '#fff' : COLORS.TEXT_MUTED,
                          '&:hover': {
                            backgroundColor: selectedPatient[index] ? COLORS.ACCENT_HOVER : COLORS.SURFACE_INPUT,
                            boxShadow: 'none',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: COLORS.SURFACE_INPUT,
                            color: COLORS.TEXT_MUTED,
                          },
                        }}
                        onClick={() => handleLinkPatient(index, selectedPatient[index])}
                      >
                        Link to
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default IncompleteProfilesTab;