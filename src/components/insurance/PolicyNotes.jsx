import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { MicNone as MicIcon } from "@mui/icons-material";

const PolicyNotes = () => {
  return (
    <Box>
      {[
        { label: "Policy Notes", color: "transparent" },
        { label: "Eligibility Policy Notes", color: "transparent" },
        { label: "Insurance Plan Notes", color: "transparent" }
      ].map((note, index) => (
        <Box key={index} sx={{ mt: 2.5 }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>{note.label}</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Add your note here..."
            sx={{ 
              bgcolor: note.color,
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
      ))}
    </Box>
  );
};

export default PolicyNotes;
