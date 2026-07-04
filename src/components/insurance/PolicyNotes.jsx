import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Stack } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import ArticleIcon from '@mui/icons-material/Article';

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
    <Box sx={{ 
      border: '1px solid #DFE5EC', 
      borderRadius: '12px', 
      backgroundColor: '#FFFFFF', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
             <ArticleIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Notes
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Internal documentation
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.8px', textTransform: 'uppercase' }}>OPTIONAL</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
      <Stack spacing={2.5}>
      {noteTypes.map((note, index) => {
        const fieldName = note.replace(/\s+/g, '').charAt(0).toLowerCase() + note.replace(/\s+/g, '').slice(1);
        const isActive = isListening && activeNote === fieldName;
        return (
          <Box key={index}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>{note}</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData[fieldName] || ''}
              onChange={(e) => handleInputChange && handleInputChange(fieldName, e.target.value)}
              placeholder="Add your note here..."
              sx={{ 
                bgcolor: '#fff',
                '& .MuiInputBase-root': { fontSize: '0.75rem', p: 1.5 },
                '& fieldset': { borderColor: '#DFE5EC' },
                '& textarea': {
                  overflow: 'auto',
                  maxHeight: '100px'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ alignSelf: 'flex-end', pb: 0, mb: -1 }}>
                    <IconButton size="small" onClick={() => startListening(fieldName)} sx={{ p: 0.5 }}>
                      <MicIcon sx={{ fontSize: 18, color: isActive ? '#f44336' : '#26a69a', cursor: 'pointer' }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );
      })}
      </Stack>
      </Box>
    </Box>
  );
};

export default PolicyNotes;
