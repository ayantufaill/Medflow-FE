import { useState } from 'react';
import { Box, Typography, Collapse, Menu, MenuItem, IconButton } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, headingSecondarySx } from '../../../constants/styles';
import dayjs from 'dayjs';

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
            const providerText = proc.providerId ? 'PRV' : 'SAB'; // Fallback mock badge
            const badgeColor = '#6ee7b7'; // Mint green from screenshot

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
                  {/* Provider/Status Badge */}
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
                    {providerText}
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
