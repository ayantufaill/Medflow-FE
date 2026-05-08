import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';

const StatementFooter = ({ appointments, notes, showNotesInput, onNotesChange, onSaveNotes, onEditNotes, onCloseNotes }) => {
  const textDarkBlue = '#40548e';
  const rowLightBlue = '#f0f4fa';

  return (
    <>
      {/* Appointments */}
      <Grid container sx={{ mt: 2, bgcolor: rowLightBlue, border: '1px solid #e0e0e0' }}>
        {appointments.map((appointment, index) => (
          <Grid 
            item 
            xs={6} 
            key={appointment.label}
            sx={{ 
              p: 1, 
              borderRight: index === 0 ? '1px solid #e0e0e0' : 'none',
              minWidth: 0
            }}
          >
            <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.sm, color: textDarkBlue }}>{appointment.label}</Typography>
            <Typography sx={{ fontSize: fontSize.sm }}>{appointment.value}</Typography>
          </Grid>
        ))}
      </Grid>

      {/* Notes Section */}
      {(showNotesInput || notes) && (
        <Box sx={{ mt: 3, border: '1px solid #e0e0e0' }}>
          <Box sx={{ bgcolor: rowLightBlue, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.sm, color: textDarkBlue }}>Statement Notes:</Typography>
            <Typography 
              sx={{ fontWeight: fontWeight.bold, cursor: 'pointer', color: textDarkBlue, px: 1 }}
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
                      bgcolor: textDarkBlue,
                      textTransform: 'none',
                      fontSize: fontSize.sm
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
