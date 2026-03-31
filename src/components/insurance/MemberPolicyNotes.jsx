import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { MicNone as MicIcon } from "@mui/icons-material";

const MemberPolicyNotes = ({ 
  formData,
  handleInputChange,
  inputBg,
  noteTypes = ['Policy Notes', 'Member Plan Notes']
}) => {
  return (
    <Box>
      {noteTypes.map((noteType, index) => (
        <Box key={index} sx={{ mt: 2.5 }}>
          <Typography sx={{ fontWeight: 700, mb: 1.5, color: "#333", fontSize: '0.8rem' }}>
            {noteType}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>
            {noteType}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={formData[`${noteType.replace(/\s+/g, '').charAt(0).toLowerCase() + noteType.replace(/\s+/g, '').slice(1)}`] || ''}
            onChange={(e) => handleInputChange(`${noteType.replace(/\s+/g, '').charAt(0).toLowerCase() + noteType.replace(/\s+/g, '').slice(1)}`, e.target.value)}
            placeholder={`Add your ${noteType.toLowerCase()} here...`}
            sx={{ 
              bgcolor: inputBg || 'transparent',
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

export default MemberPolicyNotes;
