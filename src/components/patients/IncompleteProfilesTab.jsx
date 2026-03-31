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

const ProfileCard = ({ type, data, isLinked, isSelected, onToggleSelect, onToggleCheckbox, isCheckboxChecked }) => {
  const isMyChart = type === "mychart";
  const bgColor = isMyChart ? "#e8f5f3" : "#f1f6ff";
  const borderColor = isMyChart ? "#b2dfdb" : "#d1d9e6";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1.5,
        bgcolor: '#fff',
        border: isMyChart ? '2px solid #b2dfdb' : `1px solid ${borderColor}`,
        borderRadius: 2,
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
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
          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#333" }}>
            {data.name} - {data.dob}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#666" }}>Date: {data.date}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#333" }}>Email: {data.email}</Typography>
          {isMyChart && (
            <Typography sx={{ fontSize: "0.7rem", color: "#888" }}>Registered With: {data.email}</Typography>
          )}
          
          {!isMyChart && (
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button 
                variant="contained" 
                size="small" 
                disabled={!isLinked}
                sx={{ 
                  fontSize: '0.65rem', 
                  textTransform: 'none', 
                  bgcolor: '#5c7cba',
                  minWidth: 60,
                  height: 24
                }}
              >
                Update
              </Button>
              <Button 
                variant="contained" 
                size="small" 
                sx={{ 
                  fontSize: '0.65rem', 
                  textTransform: 'none', 
                  bgcolor: '#d4b483',
                  '&:hover': { bgcolor: '#c4a473' },
                  height: 24
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
                  <Box key={tag} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Checkbox 
                      size="small" 
                      checked={isCheckboxChecked(data.id, tag)}
                      onChange={() => onToggleCheckbox(data.id, tag)}
                      sx={{ p: 0 }} 
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: '#888' }}>{tag}</Typography>
                  </Box>
                ))}
              </Box>
              <DeleteIcon sx={{ fontSize: 16, color: '#d32f2f', cursor: 'pointer' }} />
            </Stack>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

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
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>

      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#5c7cba", mb: 1 }}>
          UPDATE REQUESTS
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Checkbox 
            size="small" 
            sx={{ p: 0 }} 
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>All</Typography>
          <Typography 
            sx={{ 
              fontSize: '0.7rem', 
              color: '#d32f2f', 
              cursor: selectedPatients.length > 0 ? 'pointer' : 'not-allowed',
              ml: 1,
              textDecoration: selectedPatients.length > 0 ? 'underline' : 'none'
            }}
            onClick={handleDeleteSelected}
          >
            Delete All Selected ({selectedPatients.length})
          </Typography>
        </Box>

        {/* Three Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 1, alignItems: 'start' }}>
          {/* MyChart Column Container */}
          <Box sx={{ bgcolor: '#e8f5f3', borderRadius: 2, p: 1 }}>
            {/* Section Header */}
            <Typography align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#4db6ac', py: 1 }}>
              MYCHART PATIENT PROFILE
            </Typography>

            {/* List of MyChart Rows - Using main array */}
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

          {/* Link Indicators Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', px: 1, pt: 4, position: 'relative' }}>
            {mychartPatients.map((patient, index) => (
              <Box key={patient.id} sx={{ height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 1.5, position: 'relative' }}>
                {/* Connection Line - Only extends to left for unlinked patients */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '-20px',
                    right: patient.linked ? '-20px' : '50%',
                    height: '2px',
                    bgcolor: patient.linked ? '#999' : '#d32f2f',
                    transform: 'translateY(-50%)',
                    zIndex: 0
                  }}
                />
                {/* Icon centered on the line */}
                <Box
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: '50%',
                    p: 0.5,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {patient.linked ? (
                    <LinkIcon sx={{ color: '#5c7cba', fontSize: 20 }} />
                  ) : (
                    <LinkOffIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Office Profiles Column */}
          <Box sx={{ bgcolor: '#f1f6ff', borderRadius: 2, p: 1 }}>
            {/* Section Header */}
            <Typography align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#5c7cba', py: 1 }}>
              OFFICE PATIENT PROFILE
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
                      bgcolor: '#fff',
                      border: '1px solid #d1d9e6',
                      borderRadius: 2,
                      minHeight: 130,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search patients"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <SearchIcon sx={{ fontSize: 18, color: '#999', mr: 1 }} />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                              endAdornment: (
                                <>
                                  {loadingSearch[index] ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                            sx={{ 
                              '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem' },
                              '& .MuiInputBase-root': { minHeight: 'auto' }
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ py: 0.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                {option.firstName} {option.lastName}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: '#666' }}>
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
                        disabled={!selectedPatient[index]}
                        sx={{ 
                          fontSize: '0.6rem', 
                          height: 32, 
                          minWidth: 60, 
                          bgcolor: selectedPatient[index] ? '#5c7cba' : '#ccc',
                          textTransform: 'none',
                          whiteSpace: 'nowrap'
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