import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, IconButton } from '@mui/material';
import { Mic as MicIcon } from '@mui/icons-material';

const AccountNotesDialog = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      console.log('Adding note:', noteText);
      // Add logic to save the note (API call, state update, etc.)
      setNoteText('');
      // Optionally close the dialog after adding
      // onClose();
    }
  };

  const handleCancel = () => {
    setNoteText('');
    onClose();
  };

  const handleMicClick = () => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      // Stop listening
      if (speechRecognition) {
        speechRecognition.stop();
      }
      setIsListening(false);
    } else {
      // Start listening
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setNoteText((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
      recognition.start();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, bgcolor: 'white', borderRadius: 1, boxShadow: 3 }}>
      {/* Tab Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Account Notes (0)" />
          <Tab label="Archived (0)" />
        </Tabs>
      </Box>

      {/* Body Section */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Type your note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                borderColor: 'grey.400',
                '&:hover': {
                  borderColor: 'grey.500',
                },
                '&.Mui-focused': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          
          {/* Voice Icon */}
          <IconButton
            size="small"
            onClick={handleMicClick}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              color: isListening ? 'error.main' : 'primary.light',
              border: '1px solid',
              borderColor: 'grey.200',
              bgcolor: isListening ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: isListening ? 'rgba(255, 0, 0, 0.2)' : 'grey.50',
              },
            }}
          >
            <MicIcon fontSize="small" />
          </IconButton>
          {isListening && (
            <Typography
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 50,
                fontSize: '0.75rem',
                color: 'error.main',
                fontWeight: 'bold',
              }}
            >
              Listening...
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            sx={{
              bgcolor: '#d4af37',
              color: '#fff',
              '&:hover': {
                bgcolor: '#b3a247',
              },
              '&:disabled': {
                bgcolor: '#d4af37',
                color: '#fff',
                opacity: 0.5,
              },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            sx={{
              bgcolor: 'grey.400',
              '&:hover': {
                bgcolor: 'grey.500',
              },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountNotesDialog;
