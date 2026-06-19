import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';

const PolicyNotes = ({ 
  noteTypes = ['Policy Notes', 'Eligibility Policy Notes', 'Insurance Plan Notes'],
  formData = {},
  handleInputChange
}) => {
  const [isListening, setIsListening] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  const startListening = (fieldName) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setActiveNote(fieldName);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const currentValue = formData[fieldName] || '';
      const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;
      if (handleInputChange) {
        handleInputChange(fieldName, newValue);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setActiveNote(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveNote(null);
    };

    recognition.start();
  };

  return (
    <Box>
      {noteTypes.map((note, index) => {
        const fieldName = note.replace(/\s+/g, '').charAt(0).toLowerCase() + note.replace(/\s+/g, '').slice(1);
        const isActive = isListening && activeNote === fieldName;
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
                    <IconButton size="small" onClick={() => startListening(fieldName)} sx={{ p: 0 }}>
                      <MicIcon sx={{ fontSize: 16, color: isActive ? '#f44336' : '#4db6ac', cursor: 'pointer' }} />
                    </IconButton>
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
