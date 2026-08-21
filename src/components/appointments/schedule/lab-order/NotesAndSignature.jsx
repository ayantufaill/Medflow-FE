import React from 'react';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const NotesAndSignature = ({
  noteInput,
  setNoteInput,
  handleAddNote,
  notesList,
  canvasRef,
  startDrawing,
  finishDrawing,
  draw,
  handleClearSignature
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 6, mb: 4, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: '280px' }}>
         <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>Instructions/Notes</Typography>
         <TextField 
            size="small" 
            placeholder="Add Note..." 
            fullWidth 
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
            sx={{ '& .MuiOutlinedInput-root': { height: '36px', fontSize: '13px', fontFamily: 'Inter', borderRadius: '8px' } }}
            InputProps={{
              endAdornment: (
                <IconButton size="small" onClick={handleAddNote}>
                  <Add sx={{ fontSize: '18px', color: '#6b7280' }} />
                </IconButton>
              )
            }}
         />
         {notesList.length > 0 && (
           <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
             {notesList.map((note, nIdx) => (
               <Typography key={nIdx} sx={{ fontSize: '12px', color: '#4b5563', bgcolor: '#f3f4f6', p: '4px 8px', borderRadius: '4px', fontFamily: 'Inter' }}>
                 • {note}
               </Typography>
             ))}
           </Box>
         )}
         
         <Typography sx={{ fontSize: '12px', fontWeight: 600, mt: 3, mb: 1, color: '#374151', fontFamily: 'Inter' }}>Provider Signature</Typography>
         <Typography sx={{ fontSize: '12px', color: '#6b7280', mb: 1, fontFamily: 'Inter' }}>Draw your signature</Typography>
         <Box sx={{ border: '1px solid #d0d5dd', borderRadius: '8px', width: '100%', height: '140px', mb: 1, overflow: 'hidden', bgcolor: '#ffffff' }}>
            <canvas 
              ref={canvasRef} 
              width={380} 
              height={140} 
              style={{ cursor: 'crosshair', width: '100%', height: '100%', touchAction: 'none' }} 
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={finishDrawing}
            />
         </Box>
         <Button 
           variant="outlined" 
           size="small" 
           sx={{ color: '#374151', borderColor: '#d0d5dd', textTransform: 'none', borderRadius: '6px', fontSize: '12px', fontFamily: 'Inter', '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' } }} 
           onClick={handleClearSignature}
         >
           Clear signature
         </Button>
      </Box>
      <Box sx={{ flex: 1, minWidth: '280px' }}>
         <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>History</Typography>
         <Box sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d0d5dd' }}>
           <Typography sx={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', fontFamily: 'Inter' }}>
             No previous lab order slip history for this appointment.
           </Typography>
         </Box>
      </Box>
    </Box>
  );
};

export default NotesAndSignature;
