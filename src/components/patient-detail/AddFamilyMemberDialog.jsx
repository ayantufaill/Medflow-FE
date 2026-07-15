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
import { Close as CloseIcon, GroupAdd as GroupAddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';
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
      navigate('/patients/new', { 
        state: { returnToPatientId: currentPatientId } 
      });
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      sx={{ zIndex: 1400 }}
      PaperProps={{ sx: { width: '900px', maxWidth: '92vw', borderRadius: radius.lg, p: 0 } }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.25,
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <GroupAddIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
          <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            Add Family Member
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1.5 }}>
        {/* RADIO OPTIONS - Left Aligned */}
        <RadioGroup value={mode} onChange={(e) => setMode(e.target.value)} row sx={{ mb: 2 }}>
          <FormControlLabel 
            value="search" 
            control={<Radio size="small" sx={{ color: COLORS.TEXT_MUTED, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
            label={<Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>Search for a patient</Typography>} 
          />
          <FormControlLabel 
            value="add_new" 
            control={<Radio size="small" sx={{ color: COLORS.TEXT_MUTED, '&.Mui-checked': { color: COLORS.ACCENT } }} />} 
            label={<Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>Add new profile</Typography>} 
          />
        </RadioGroup>

        {mode === 'search' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, whiteSpace: 'nowrap' }}>
              Search Patients:
            </Typography>
            <Autocomplete
              sx={{ width: '250px' }}
              slotProps={{ popper: { sx: { zIndex: 1500 } } }}
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
                    sx: { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE },
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              PaperComponent={({ children }) => (
                <Paper sx={{ bgcolor: COLORS.SURFACE, border: `1px solid ${COLORS.BORDER}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mt: 0.5, borderRadius: radius.sm }}>
                  {children}
                </Paper>
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option._id || option.id} sx={{ 
                  fontSize: '13px', 
                  color: COLORS.TEXT_PRIMARY,
                  py: 1.5, 
                  px: 2,
                  borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover, &.Mui-focused': { bgcolor: COLORS.SURFACE_TINT + ' !important' }
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>
                      {option.firstName} {option.lastName}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY, mt: 0.5 }}>
                      {option.dateOfBirth ? `DOB: ${dayjs(option.dateOfBirth).format('MM/DD/YYYY')} • ` : ''} 
                      {option.phoneNumbers?.[0]?.number || option.email || 'No contact info'}
                    </Typography>
                    {option.patientCode && (
                      <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                        {option.patientCode}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              noOptionsText={<Typography sx={{ p: 1, fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>{loading ? 'Searching...' : 'No results'}</Typography>}
            />
          </Box>
        )}

        {mode === 'add_new' && (
          <Box sx={{ p: 2, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.sm, mt: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '0.85rem' }}>
              Click "Confirm" to proceed to the Add Patient form.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: '16px 20px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: '8px' }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          disabled={mode === 'search' && !selectedPatient}
          sx={{ 
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: COLORS.SURFACE_DISABLED, color: COLORS.TEXT_MUTED }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFamilyMemberDialog;
