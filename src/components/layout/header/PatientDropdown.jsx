import { useState } from 'react';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import dayjs from 'dayjs';

import InitialsAvatar from '../../shared/InitialsAvatar';
import PatientDropdownPanel from './patient-dropdown/PatientDropdownPanel';
import { usePatient } from '../../../hooks/redux';

// PatientDropdown is the compact trigger pill in the top header bar.
// It shows the currently selected patient's name and chart info from Redux.
// Clicking it opens PatientDropdownPanel where staff can search and switch patients.
// Selecting any patient from the panel writes them into Redux via usePatient(),
// which propagates the change to the schedule page's left panel automatically.

const PatientDropdown = () => {
  const [open, setOpen] = useState(false);

  // Read the currently selected patient from Redux — updated by PatientDropdownPanel on selection.
  const { currentPatient } = usePatient();

  // Build the display values for the trigger pill.
  const patientName = currentPatient
    ? `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim()
    : 'Select Patient';

  const age = currentPatient?.dateOfBirth
    ? dayjs().diff(dayjs(currentPatient.dateOfBirth), 'year')
    : null;

  const chartRefAge = currentPatient
    ? [
        currentPatient.patientNumber ? `#PAT${currentPatient.patientNumber}` : null,
        age !== null ? `${age}y` : null,
      ].filter(Boolean).join(' · ')
    : '';

  // avatarName drives the initial letters in InitialsAvatar.
  // this needs to be updated as, we will be having the display pictures of the patients in the future, so we will be using the initials only when the display picture is not available.
  const avatarName = patientName !== 'Select Patient' ? patientName : 'SP';

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>

        {/* ── Trigger pill ────────────────────────────────────────────────────── */}
        <Box
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            width: '155px', height: '42px',
            backgroundColor: open ? '#f0f6ff' : 'rgba(255,255,255,0.80)',
            border: '1px solid', borderColor: open ? '#2262ef' : '#e0e5eb',
            borderRadius: '100px',
            px: '8px', gap: '8px',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background-color 0.15s',
          }}
        >
          <InitialsAvatar name={avatarName} size={28} fontSize={10} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={[patientName === 'Select Patient'?{
              fontFamily: 'Inter', fontWeight: 400, fontSize: '12.8px',
              lineHeight: '20px', color: '#09121f',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }:{
              fontFamily: 'Inter', fontWeight: 700, fontSize: '14px',
              lineHeight: '20px', color: '#09121f',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }]}>
              {patientName} fahad
            </Typography>

            {/* Only show chart info line when a patient is selected */}
            {chartRefAge && (
              <Typography sx={{
                fontFamily: 'Inter', fontWeight: 400, fontSize: '10.5px',
                lineHeight: '13px', color: '#5c646f',
              }}>
                {chartRefAge}
              </Typography>
            )}
          </Box>

          {open
            ? <KeyboardArrowUp sx={{ fontSize: '14px', color: '#7a8a9a', flexShrink: 0 }} />
            : <KeyboardArrowDown sx={{ fontSize: '14px', color: '#7a8a9a', flexShrink: 0 }} />
          }
        </Box>

        {/* ── Dropdown panel ───────────────────────────────────────────────────── */}
        {open && (
          <Box sx={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 1500 }}>
            {/* onClose collapses the dropdown after the user selects a patient */}
            <PatientDropdownPanel onClose={() => setOpen(false)} />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default PatientDropdown;
