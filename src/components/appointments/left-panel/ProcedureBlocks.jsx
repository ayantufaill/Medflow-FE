import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Collapse, Menu, MenuItem, IconButton } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, headingSecondarySx } from '../../../constants/styles';
import dayjs from 'dayjs';
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';

const getProviderInitials = (name) => {
  if (!name) return null;
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PROCEDURE_OPTIONS = [
  'Enter Manually',
  'Composite 1-3 teeth',
  'Crown Delivery',
  'Crown/bridge prep',
  'Doctor new patient exam',
  'Full arch prep',
  'Hygiene + Exam',
  'Hygiene new patient exam',
  'Hygiene-no exam',
  'Implant delivery 1-2 implants',
  'Implant scan 1-2 implants',
  'Invisalign bond',
  'Invisalign debond',
  'Limited Exam',
  'New Patient Comp Exam',
  'Periodic Ortho check',
  'Post op photos',
  'Provisional swap',
  'SRP'
];

const ProcedureBlocks = ({ appointment }) => {
  const [open, setOpen] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const providers = useSelector(selectProviderDropdownList);

  // Build a lookup map: provider ID -> provider object
  const providerMap = useMemo(() => {
    const map = {};
    (providers || []).forEach((p) => {
      const id = String(p._id || p.id || p.ProvNum || '');
      if (id) map[id] = p;
    });
    return map;
  }, [providers]);

  // Safely extract a plain string ID from a value that could be a string, number, or nested object
  const extractId = (val) => {
    if (!val) return null;
    if (typeof val === 'object') return String(val._id || val.id || val.ProvNum || '');
    return String(val);
  };

  const getProviderName = (p) => {
    if (!p) return null;
    if (p.userId?.firstName || p.userId?.lastName) {
      return `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim();
    }
    return `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || null;
  };

  if (!appointment) return null;

  // Determine header label
  let headerLabel = appointment.appointmentTypeName || appointment.visitType || appointment.appointmentType;
  if (typeof headerLabel === 'object') {
    headerLabel = headerLabel?.name || 'Procedures';
  }
  if (!headerLabel) {
    headerLabel = 'Scheduled Procedures';
  }

  // Duration
  const apptDuration = appointment.durationMinutes || appointment.duration;
  const durationLabel = apptDuration ? `${apptDuration} min` : '-- min';

  // Extract array of procedures
  let proceduresList = [];
  if (Array.isArray(appointment.procedures)) {
    proceduresList = appointment.procedures;
  } else if (typeof appointment.procedures === 'string') {
    // If it's just a string, simulate a single procedure object
    proceduresList = appointment.procedures.split(',').map(p => ({ description: p.trim() }));
  } else if (appointment.chiefComplaint) {
    proceduresList = [{ description: appointment.chiefComplaint }];
  }

  if (proceduresList.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.SURFACE_CARD,
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.md,
          px: '12px',
          py: '10px',
        }}
      >
        <Typography sx={{ ...headingSecondarySx, color: COLORS.TEXT_MUTED }}>
          No procedures scheduled
        </Typography>
        <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
          {durationLabel}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: COLORS.SURFACE_CARD,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      {/* Header Row */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '12px',
          py: '10px',
          cursor: 'pointer',
          backgroundColor: open ? '#f8fafc' : 'transparent',
          borderBottom: open ? `1px solid ${COLORS.BORDER}` : 'none',
          '&:hover': { backgroundColor: '#f1f5f9' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {open ? (
            <KeyboardArrowUp sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          ) : (
            <KeyboardArrowDown sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          )}
          <Typography sx={{ ...headingSecondarySx, color: COLORS.TEXT_PRIMARY }}>
            {headerLabel}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
            {durationLabel}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchorEl(e.currentTarget);
            }}
            sx={{ p: 0 }}
          >
            <KeyboardArrowDown sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Content: Sub-procedures */}
      <Collapse in={open}>
        <Box sx={{ p: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {proceduresList.map((proc, idx) => {
            const desc = proc.description || proc.name || proc.code || 'Procedure';

            // Helper: extract name from any provider-shaped object
            const nameFromObj = (obj) => {
              if (!obj || typeof obj !== 'object') return null;
              // Nested userId
              const fName = obj.userId?.firstName || obj.firstName || obj.FName || '';
              const lName = obj.userId?.lastName  || obj.lastName  || obj.LName  || '';
              return (fName + ' ' + lName).trim() || obj.name || obj.Abbr || null;
            };

            // 1. Try procedure-level provider object embedded in the procedure itself
            let resolvedName = proc.providerName || nameFromObj(proc.providerObj) || null;

            // 2. Try map lookup using numeric ID on the procedure
            if (!resolvedName) {
              const procProviderId = extractId(proc.providerId || proc.provider || proc.ProvNum);
              const procProviderObj = procProviderId ? providerMap[procProviderId] : null;
              resolvedName = nameFromObj(procProviderObj);
            }

            // 3. Fall back to the appointment's main provider — read name directly first
            if (!resolvedName) {
              const apptProvider = appointment.provider;
              if (typeof apptProvider === 'string') {
                resolvedName = apptProvider || null;
              } else {
                resolvedName = nameFromObj(apptProvider) || null;
              }
              resolvedName = resolvedName || appointment.providerName || null;
            }

            // 4. Final fallback: map lookup using appointment providerId
            if (!resolvedName) {
              const apptProviderId = extractId(appointment.providerId);
              const apptProviderObj = apptProviderId ? providerMap[apptProviderId] : null;
              resolvedName = nameFromObj(apptProviderObj);
            }

            const initials = getProviderInitials(resolvedName) || '—';
            const badgeColor = '#6ee7b7';

            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pl: '24px' // Indent relative to header
                }}
              >
                <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_BODY }}>
                  {desc}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Provider badge — always shown, falls back to appointment provider */}
                  <Box
                    sx={{
                      backgroundColor: badgeColor,
                      color: '#064e3b',
                      px: '4px',
                      py: '1px',
                      borderRadius: '2px',
                      fontSize: '10px',
                      fontWeight: fontWeight.bold,
                      lineHeight: 1.2
                    }}
                  >
                    {initials}
                  </Box>

                  {/* Optional Date (only show if it has a created date) */}
                  {proc.createdAt && (
                    <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
                      {dayjs(proc.createdAt).format('MM/DD/YY')}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>

      {/* Procedure Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 200,
            maxHeight: 300,
            borderRadius: radius.md,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.BORDER}`,
            '& .MuiMenuItem-root': {
              fontSize: '13px',
              fontFamily: 'Inter',
              color: COLORS.TEXT_PRIMARY,
              py: 1,
              px: 2,
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: COLORS.SURFACE_HOVER,
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {PROCEDURE_OPTIONS.map((option) => (
          <MenuItem 
            key={option} 
            onClick={() => {
              setMenuAnchorEl(null);
              // In the future, this would dispatch an action to attach the new procedure
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ProcedureBlocks;
