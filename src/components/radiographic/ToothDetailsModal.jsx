import React from "react";
import { Box, Typography, Dialog, Grid, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ToothDetailsModal = ({ 
  detailModalTooth, 
  toothFindings, 
  onClose, 
  newNoteText, 
  onNoteTextChange, 
  onAddNote 
}) => {
  const toothData = detailModalTooth !== null ? toothFindings[detailModalTooth] : null;

  return (
    <Dialog
      open={detailModalTooth !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          p: 4,
          borderRadius: '8px',
          position: 'relative',
          minHeight: '350px'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: '#aaa' }}
      >
        <CloseIcon />
      </IconButton>

      {detailModalTooth !== null && toothData && (
        <Grid container spacing={4}>
          {/* Left Column: Findings & Diagnosis */}
          <Grid item xs={6} sx={{ pr: 2 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#1a2735',
                borderBottom: '2px solid #0f766e',
                pb: 1,
                display: 'inline-block',
                minWidth: '150px',
                fontFamily: "'Manrope', sans-serif"
              }}
            >
              Tooth #{detailModalTooth}
            </Typography>

            <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>
              Initial Findings {toothData.notes?.[0]?.date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </Typography>
            
            <Box sx={{ mt: 1, pl: 1 }}>
              {toothData.findings.map(finding => {
                const depth = toothData.depth || 'Limited to enamel';
                const surfacesStr = (toothData.surfaces || []).map(s => s === 'O/I' ? 'O' : s).join('');
                
                // Capitalize depth
                const depthCapitalized = depth.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                
                return (
                  <Typography key={finding} sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>
                    - Caries Active {depthCapitalized}: {surfacesStr}
                  </Typography>
                );
              })}
              <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>
                - Pulpal Concern
              </Typography>
            </Box>

            <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>
              Diagnosis
            </Typography>
            <Box sx={{ mt: 1, pl: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>
                - Caries
              </Typography>
            </Box>
          </Grid>

          {/* Vertical Divider & Right Column: Notes */}
          <Grid item xs={6} sx={{ borderLeft: '1px solid #0f766e', pl: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2735', mb: 2, fontFamily: "'Manrope', sans-serif" }}>
              Notes
            </Typography>

            <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2, pr: 1 }}>
              {(toothData.notes || []).map((note, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>
                    {note.date}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#666', pl: 1, mt: 0.5 }}>
                    - {note.text}
                  </Typography>
                </Box>
              ))}
              {(!toothData.notes || toothData.notes.length === 0) && (
                <Typography sx={{ fontSize: '0.85rem', color: '#bbb', fontStyle: 'italic' }}>
                  No notes added yet.
                </Typography>
              )}
            </Box>

            {/* New Note input */}
            <Box sx={{ mt: 4 }}>
              <TextField
                variant="standard"
                placeholder="New Note"
                fullWidth
                value={newNoteText}
                onChange={(e) => onNoteTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddNote();
                  }
                }}
                sx={{
                  '& .MuiInput-underline:before': { borderBottomColor: '#ccc' },
                  '& .MuiInput-underline:after': { borderBottomColor: '#0f766e' },
                  '& input': { fontSize: '0.9rem', color: '#555' }
                }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={onAddNote}
                sx={{ 
                  mt: 1.5, 
                  bgcolor: '#0f766e', 
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#0d5e58' }
                }}
              >
                Save Note
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
};

export default ToothDetailsModal;
