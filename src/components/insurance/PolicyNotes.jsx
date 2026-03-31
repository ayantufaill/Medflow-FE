import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';

const PolicyNotes = ({ 
  noteTypes = ['Policy Notes', 'Eligibility Policy Notes', 'Insurance Plan Notes'],
  formData = {},
  handleInputChange
}) => {
  return (
    <Box>
      {noteTypes.map((note, index) => {
        const fieldName = note.replace(/\s+/g, '').charAt(0).toLowerCase() + note.replace(/\s+/g, '').slice(1);
        return (
          <Box key={index} sx={{ mt: 2.5 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>{note}</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData[fieldName] || ''}
              onChange={(e) => handleInputChange && handleInputChange(fieldName, e.target.value)}
              placeholder="Add your note here..."
              sx={{ 
                bgcolor: 'transparent',
                '& .MuiInputBase-root': { fontSize: '0.7rem' },
                '& textarea': {
                  overflow: 'auto',
                  maxHeight: '100px'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ alignSelf: 'flex-end', pb: 1 }}>
                    <MicIcon sx={{ fontSize: 16, color: '#4db6ac', cursor: 'pointer' }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default PolicyNotes;
