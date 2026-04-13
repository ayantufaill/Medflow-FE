import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
  TextField,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patient.service';
import dayjs from 'dayjs';

/**
 * AddFamilyMemberDialog
 * UI exactly matching the provided screenshot.
 */
const AddFamilyMemberDialog = ({ open, onClose, onConfirm, currentPatientId }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('search');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const searchPatients = useCallback(async (query = "") => {
    try {
      setLoading(true);
      const result = await patientService.getAllPatients(1, 25, query, "");
      const patients = result.patients || [];
      const filtered = patients.filter(p => String(p._id || p.id) !== String(currentPatientId));
      setOptions(filtered);
    } catch (err) {
      console.error("Error searching patients:", err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPatientId]);

  useEffect(() => {
    if (open && mode === 'search') {
      searchPatients("");
    }
  }, [open, mode, searchPatients]);

  const handleConfirm = () => {
    if (mode === 'search' && selectedPatient) {
      onConfirm(selectedPatient);
    } else if (mode === 'add_new') {
      navigate('/patients/new');
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: '4px',
          width: '900px', // Widening to match the screenshot's aspect ratio
          maxWidth: '100%'
        } 
      }}
    >
      {/* HEADER - Solid Blue */}
      <DialogTitle sx={{ 
        bgcolor: '#5c7cbc', 
        p: 1.2, 
        textAlign: 'center', 
        position: 'relative',
        minHeight: '45px'
      }}>
        <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }}>
          Add Family Member
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1.5 }}>
        {/* RADIO OPTIONS - Left Aligned */}
        <RadioGroup value={mode} onChange={(e) => setMode(e.target.value)} row sx={{ mb: 2 }}>
          <FormControlLabel 
            value="search" 
            control={<Radio size="small" sx={{ color: '#666', '&.Mui-checked': { color: '#666' } }} />} 
            label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Search for a patient</Typography>} 
          />
          <FormControlLabel 
            value="add_new" 
            control={<Radio size="small" sx={{ color: '#666', '&.Mui-checked': { color: '#666' } }} />} 
            label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Add new profile</Typography>} 
          />
        </RadioGroup>

        {mode === 'search' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#333', fontWeight: 400, whiteSpace: 'nowrap' }}>
              Search Patients:
            </Typography>
            <Autocomplete
              sx={{ width: '220px' }} // Matching the narrow look in screenshot
              options={options}
              loading={loading}
              autoHighlight
              filterOptions={(x) => x}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return `${option.firstName || ''} ${option.lastName || ''}`.trim();
              }}
              onInputChange={(e, value, reason) => {
                if (reason === 'input') searchPatients(value);
                else if (reason === 'clear') searchPatients("");
              }}
              onChange={(e, value) => setSelectedPatient(value)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Search patients" 
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    sx: { height: '32px', fontSize: '0.85rem', bgcolor: '#fff' },
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              // BLUE DROPDOWN MATCHING SCREENSHOT
              PaperComponent={({ children }) => (
                <Paper sx={{ bgcolor: '#517ab0', color: '#fff', mt: 0.5, borderRadius: '4px' }}>
                  {children}
                </Paper>
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option._id || option.id} sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start', 
                  textAlign: 'left',
                  py: 1, 
                  px: 2, 
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1) !important' }
                }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', textAlign: 'left', width: '100%' }}>
                    {option.firstName} {option.lastName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', textAlign: 'left', width: '100%' }}>
                    {option.dateOfBirth ? dayjs(option.dateOfBirth).format('MM/DD/YYYY') : 'N/A'}
                  </Typography>
                  {option.patientCode && (
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textAlign: 'left', width: '100%' }}>
                      {option.patientCode}
                    </Typography>
                  )}
                </Box>
              )}
              noOptionsText={<Typography sx={{ p: 1, fontSize: '0.85rem', color: '#fff' }}>{loading ? 'Searching...' : 'No results'}</Typography>}
            />
          </Box>
        )}

        {mode === 'add_new' && (
          <Box sx={{ p: 3, bgcolor: '#f1f5f9', borderRadius: 1, ml: 1 }}>
            <Typography sx={{ color: '#475569', fontSize: '0.85rem' }}>
              Redirecting to Add Patient form...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
        <Button 
          onClick={handleConfirm} 
          disabled={mode === 'search' && !selectedPatient}
          sx={{ 
            bgcolor: '#d8b16b', 
            '&:hover': { bgcolor: '#c49c56' }, 
            color: '#fff', 
            textTransform: 'none', 
            px: 3.5, 
            py: 0.8,
            fontWeight: 500,
            borderRadius: '6px',
            fontSize: '0.95rem',
            '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
          }}
        >
          Link to Profile
        </Button>
        <Button 
          onClick={onClose} 
          sx={{ 
            bgcolor: '#a0a0a0', 
            '&:hover': { bgcolor: '#8e8e8e' }, 
            color: '#fff', 
            textTransform: 'none', 
            px: 3.5, 
            py: 0.8,
            fontWeight: 500, 
            borderRadius: '6px',
            fontSize: '0.95rem'
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFamilyMemberDialog;
