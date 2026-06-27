import { useState } from 'react';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import InitialsAvatar from '../../shared/InitialsAvatar';
import PatientDropdownPanel from './patient-dropdown/PatientDropdownPanel';

const PATIENT = { name: "Ali Tariq", chartRef: "#PAT007 · 43y" };

const PatientDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        {/* Trigger pill */}
        <Box
          onClick={() => setOpen((p) => !p)}
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
          <InitialsAvatar name={PATIENT.name} size={28} fontSize={10} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{
              fontFamily: 'Inter', fontWeight: 700, fontSize: '14px',
              lineHeight: '20px', color: '#09121f',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {PATIENT.name}
            </Typography>
            <Typography sx={{
              fontFamily: 'Inter', fontWeight: 400, fontSize: '10.5px',
              lineHeight: '13px', color: '#5c646f',
            }}>
              {PATIENT.chartRef}
            </Typography>
          </Box>

          {open
            ? <KeyboardArrowUp sx={{ fontSize: '14px', color: '#7a8a9a', flexShrink: 0 }} />
            : <KeyboardArrowDown sx={{ fontSize: '14px', color: '#7a8a9a', flexShrink: 0 }} />
          }
        </Box>

        {/* Dropdown panel */}
        {open && (
          <Box sx={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 1500,
          }}>
            <PatientDropdownPanel />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default PatientDropdown;
