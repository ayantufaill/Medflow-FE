import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const StatementFooter = ({ appointments, notes, showNotesInput, onNotesChange, onSaveNotes, onEditNotes, onCloseNotes }) => {
  const textDarkBlue = COLORS.TEXT_PRIMARY;
  const rowLightBlue = COLORS.SURFACE_TINT;

  return (
    <>
      {/* Appointments */}
      <Box sx={{ display: 'flex', border: `1px solid ${COLORS.BORDER}`, borderRadius: '4px', overflow: 'hidden', mt: 2 }}>
        {appointments.map((appointment, index) => (
          <Box 
            key={appointment.label}
            sx={{ 
              flex: 1, 
              p: 1.5,
              bgcolor: '#fff',
              borderRight: index === 0 ? `1px solid ${COLORS.BORDER}` : 'none'
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>
              {appointment.label}
            </Typography>
            <Typography sx={{ fontSize: fontSize.sm, color: COLORS.ACCENT }}>
              {appointment.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Notes Section */}
      {(showNotesInput || notes) && (
        <Box sx={{ mt: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: '4px', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: COLORS.SURFACE_TINT, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.BORDER}` }}>
            <Typography sx={{ fontWeight: fontWeight.semiBold, fontSize: '14px', color: COLORS.TEXT_PRIMARY, pl: 1 }}>Statement Notes:</Typography>
            <Typography 
              sx={{ fontWeight: fontWeight.semiBold, cursor: 'pointer', color: COLORS.TEXT_SECONDARY, px: 1 }}
              onClick={onCloseNotes}
            >
              x
            </Typography>
          </Box>
          <Box sx={{ p: 2, position: 'relative', minHeight: showNotesInput ? 120 : 'auto' }}>
            {showNotesInput ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write your notes here..."
                  value={notes}
                  onChange={onNotesChange}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: fontSize.sm
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      bgcolor: COLORS.ACCENT,
                      textTransform: 'none',
                      fontSize: fontSize.sm,
                      '&:hover': { bgcolor: COLORS.ACCENT_HOVER }
                    }}
                    onClick={onSaveNotes}
                  >
                    Save
                  </Button>
                </Box>
              </>
            ) : (
              <Typography 
                sx={{ fontSize: fontSize.sm, whiteSpace: 'pre-wrap', cursor: 'pointer' }}
                onClick={onEditNotes}
              >
                {notes}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default StatementFooter;
