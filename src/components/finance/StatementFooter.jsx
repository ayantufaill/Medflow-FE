import React from 'react';
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
      {showNotesInput && (
        <Box sx={{ mt: 3, border: '1px solid #e0e0e0' }}>
          <Box sx={{ bgcolor: rowLightBlue, p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.sm, color: textDarkBlue }}>Statement Notes:</Typography>
            <Typography 
              sx={{ fontWeight: fontWeight.bold, cursor: 'pointer', color: textDarkBlue }}
              onClick={onCloseNotes}
            >
              x
            </Typography>
          </Box>
          <Box sx={{ p: 2, pb: 8, position: 'relative', minHeight: 120 }}>
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
            <Button 
              variant="contained" 
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                right: 10, 
                bgcolor: textDarkBlue 
              }}
              onClick={onSaveNotes}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default StatementFooter;
