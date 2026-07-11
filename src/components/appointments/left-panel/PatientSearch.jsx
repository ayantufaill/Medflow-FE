import { useState, useEffect, useRef } from 'react';
import { Box, Typography, InputBase, CircularProgress } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import { usePatients, usePatient } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

// PatientSearch provides a debounced search input that queries the patients
// API and shows a results dropdown. Selecting a patient sets currentPatient
// in Redux, which PatientCard and PatientActions then read.

const PatientSearch = () => {
  const { patients, loading, fetch: searchPatients } = usePatients();
  const { setPatient, setPatientId, clear, fetchById } = usePatient();

  const [inputValue,  setInputValue]  = useState('');
  const [isOpen,      setIsOpen]      = useState(false);

  // Debounce the raw input so we don't fire an API call on every keystroke.
  const [debouncedValue] = useDebounce(inputValue, 400);

  // Ref for the container — used to close the dropdown on outside click.
  const containerRef = useRef(null);

  // Trigger a server-side search whenever the debounced value changes.
  useEffect(() => {
    if (debouncedValue.trim().length >= 1) {
      searchPatients({ search: debouncedValue.trim(), limit: 20, page: 1 });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedValue]); // searchPatients is a stable useCallback

  // Close dropdown when user clicks outside the component.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Commit the selected patient to Redux and reset the search field.
  const handleSelectPatient = (patient) => {
    const pId = patient._id || patient.id || patient.PatNum;
    setPatientId(pId); // sets selectedPatientId in patientSlice
    
    // Fetch the full workspace data so family details and balances are populated
    if (pId) {
      fetchById(pId);
    } else {
      setPatient(patient); // Fallback if no ID (should never happen)
    }
    
    setInputValue('');
    setIsOpen(false);
  };

  // Clear the current patient and reset the field.
  const handleClear = () => {
    clear();
    setInputValue('');
    setIsOpen(false);
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', mb: '10px' }}>

      {/* Search input box */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          height: '40px',
          backgroundColor: COLORS.SURFACE_INPUT,
          border: `1px solid ${isOpen ? COLORS.ACCENT : COLORS.BORDER}`,
          borderRadius: isOpen ? `${radius.md} ${radius.md} 0 0` : radius.md,
          px: '12px',
          transition: 'border-color 0.15s',
        }}
      >
        <Search sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED, flexShrink: 0 }} />

        <InputBase
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search patient..."
          autoComplete="off"
          sx={{
            flex: 1,
            fontSize: fontSize.md,
            color: COLORS.TEXT_BODY,
            '& input': { p: 0 },
          }}
        />

        {/* Show spinner while fetching, clear icon when there's input */}
        {loading && inputValue
          ? <CircularProgress size={13} sx={{ color: COLORS.ACCENT, flexShrink: 0 }} />
          : inputValue && (
            <Clear
              onClick={handleClear}
              sx={{ fontSize: '15px', color: COLORS.TEXT_MUTED, cursor: 'pointer', flexShrink: 0 }}
            />
          )
        }
      </Box>

      {/* Results dropdown */}
      {isOpen && patients.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            zIndex: 20,
            backgroundColor: COLORS.SURFACE_CARD,
            border: `1px solid ${COLORS.ACCENT}`,
            borderTop: 'none',
            borderRadius: `0 0 ${radius.md} ${radius.md}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {patients.map((patient) => {
            const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
            const patientId = patient.patientNumber || patient._id?.slice(-6);

            return (
              <Box
                key={patient._id || patient.id}
                onClick={() => handleSelectPatient(patient)}
                sx={{
                  px: '12px',
                  py: '8px',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: COLORS.SURFACE_INPUT },
                }}
              >
                <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                  {fullName || 'Unknown Patient'}
                </Typography>
                {patientId && (
                  <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
                    #{patientId}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* No-results message */}
      {isOpen && !loading && debouncedValue && patients.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            zIndex: 20,
            backgroundColor: COLORS.SURFACE_CARD,
            border: `1px solid ${COLORS.ACCENT}`,
            borderTop: 'none',
            borderRadius: `0 0 ${radius.md} ${radius.md}`,
            px: '12px',
            py: '10px',
          }}
        >
          <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
            No patients found for &quot;{debouncedValue}&quot;
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PatientSearch;
