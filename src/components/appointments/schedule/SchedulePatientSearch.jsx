import { useState, useEffect, useRef } from 'react';
import { Box, Typography, InputBase, CircularProgress } from '@mui/material';
import { Search, Clear, Person } from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';
import { usePatients, usePatient } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

// SchedulePatientSearch lives in the center-panel header bar.
// Typing a name queries the patients API (debounced 400ms), shows a dropdown,
// and selecting a patient writes them into Redux so LeftPanel's PatientCard
// automatically reflects the selection without any prop-passing.

const SchedulePatientSearch = () => {
  const { patients, loading, fetch: searchPatients } = usePatients();
  const { setPatient, setPatientId }                  = usePatient();

  const [inputValue, setInputValue] = useState('');
  const [isOpen,     setIsOpen]     = useState(false);

  // Debounce prevents an API call on every keystroke.
  const [debouncedValue] = useDebounce(inputValue, 400);

  // Container ref used to close the dropdown on outside click.
  const containerRef = useRef(null);

  // Fire the API search whenever the debounced value changes.
  useEffect(() => {
    if (debouncedValue.trim().length >= 1) {
      searchPatients({ search: debouncedValue.trim(), limit: 20, page: 1 });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedValue]); // searchPatients is a stable useCallback

  // Collapse the dropdown when the user clicks elsewhere on the page.
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Write the selected patient into Redux — the left panel's PatientCard and
  // PatientActions read from the same slice so they update automatically.
  const handleSelectPatient = (patient) => {
    setPatient(patient);
    setPatientId(patient._id || patient.id);
    setInputValue('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    setIsOpen(false);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        flex: 1,
        maxWidth: '340px',   // cap so it doesn't stretch across the full header
        minWidth: '200px',
      }}
    >
      {/* ── Search input field ──────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '34px',
          backgroundColor: COLORS.SURFACE_INPUT,
          border: `1px solid ${isOpen ? COLORS.ACCENT : COLORS.BORDER}`,
          borderRadius: isOpen ? `${radius.md} ${radius.md} 0 0` : radius.md,
          px: '10px',
          transition: 'border-color 0.15s',
        }}
      >
        <Search sx={{ fontSize: '15px', color: COLORS.TEXT_MUTED, flexShrink: 0 }} />

        <InputBase
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search patient..."
          autoComplete="off"
          sx={{
            flex: 1,
            fontSize: fontSize.base,
            color: COLORS.TEXT_BODY,
            '& input': { p: 0, height: '100%' },
          }}
        />

        {/* Right-side indicator: spinner while loading, clear icon when there's input */}
        {loading && inputValue
          ? <CircularProgress size={12} sx={{ color: COLORS.ACCENT, flexShrink: 0 }} />
          : inputValue && (
            <Clear
              onClick={handleClear}
              sx={{ fontSize: '14px', color: COLORS.TEXT_MUTED, cursor: 'pointer', flexShrink: 0 }}
            />
          )
        }
      </Box>

      {/* ── Results dropdown ────────────────────────────────────────────────── */}
      {isOpen && (patients.length > 0 || (!loading && debouncedValue)) && (
        <Box
          sx={{
            position: 'absolute',
            top: '34px',
            left: 0,
            right: 0,
            zIndex: 100,  // above the sticky OperatoryHeaders (zIndex 3)
            backgroundColor: COLORS.SURFACE_CARD,
            border: `1px solid ${COLORS.ACCENT}`,
            borderTop: 'none',
            borderRadius: `0 0 ${radius.md} ${radius.md}`,
            boxShadow: '0 6px 16px rgba(0,0,0,0.14)',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {patients.length === 0 ? (
            /* No-results state */
            <Box sx={{ px: '12px', py: '10px' }}>
              <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
                No patients found for &quot;{debouncedValue}&quot;
              </Typography>
            </Box>
          ) : (
            patients.map((patient) => {
              const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
              const dob      = patient.dateOfBirth
                ? dayjs(patient.dateOfBirth).format('MM/DD/YYYY')
                : null;
              const patientNo = patient.patientNumber || patient._id?.slice(-6)?.toUpperCase();

              return (
                <Box
                  key={patient._id || patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    px: '12px',
                    py: '8px',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { backgroundColor: COLORS.SURFACE_INPUT },
                  }}
                >
                  {/* Small avatar circle */}
                  <Box
                    sx={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.ACCENT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {fullName
                      ? (
                        <Typography sx={{ fontSize: '10px', fontWeight: fontWeight.bold, color: COLORS.WHITE }}>
                          {(patient.firstName?.[0] || '') + (patient.lastName?.[0] || '')}
                        </Typography>
                      )
                      : <Person sx={{ fontSize: '14px', color: COLORS.WHITE }} />
                    }
                  </Box>

                  {/* Patient name + meta */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: fontSize.md,
                        fontWeight: fontWeight.medium,
                        color: COLORS.TEXT_PRIMARY,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {fullName || 'Unknown Patient'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '8px' }}>
                      {dob && (
                        <Typography sx={{ fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>
                          {dob}
                        </Typography>
                      )}
                      {patientNo && (
                        <Typography sx={{ fontSize: fontSize.xs, color: COLORS.ACCENT, fontWeight: fontWeight.medium }}>
                          #{patientNo}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      )}
    </Box>
  );
};

export default SchedulePatientSearch;
