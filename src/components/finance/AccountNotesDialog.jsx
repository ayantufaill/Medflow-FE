import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientAccountNotes,
  createPatientAccountNote,
  updatePatientAccountNote,
  selectPatientAccountNotes,
  selectPatientAccountNotesLoading
} from '../../store/slices/billingSlice';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Mic as MicIcon, Edit as EditIcon } from '@mui/icons-material';

const AccountNotesDialog = ({ patient, onClose }) => {
  const dispatch = useDispatch();
  const notes = useSelector(selectPatientAccountNotes);
  const loading = useSelector(selectPatientAccountNotesLoading);

  const [activeTab, setActiveTab] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    if (patient) {
      dispatch(fetchPatientAccountNotes(patient));
    }
  }, [patient, dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      if (editingNoteId) {
        // Edit existing note
        dispatch(updatePatientAccountNote({
          patient,
          noteId: editingNoteId,
          updates: { text: noteText }
        }));
        setEditingNoteId(null);
      } else {
        // Create new note
        dispatch(createPatientAccountNote({
          patient,
          text: noteText
        }));
      }
      setNoteText('');
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteText(note.text);
  };

  const handleToggleRemindMe = (noteId) => {
    const notesList = notes || [];
    const note = notesList.find(n => n.id === noteId || String(n.id) === String(noteId));
    if (note) {
      dispatch(updatePatientAccountNote({
        patient,
        noteId,
        updates: { remindMe: !note.remindMe }
      }));
    }
  };

  const handleCancel = () => {
    setNoteText('');
    setEditingNoteId(null);
    onClose();
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (speechRecognition) {
        speechRecognition.stop();
      }
      setIsListening(false);
    } else {
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

  const notesList = notes || [];
  const activeNotesList = notesList.filter(n => !n.archived);
  const archivedNotesList = notesList.filter(n => n.archived);

  const displayedNotes = activeTab === 0 ? activeNotesList : archivedNotesList;

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: '4px', overflow: 'hidden' }}>
      {/* Tab Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Account Notes (${activeNotesList.length})`} sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label={`Archived (${archivedNotesList.length})`} sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>
      </Box>

      {/* Body Section */}
      <Box sx={{ p: 3 }}>
        {/* Notes List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, maxH: '200px', overflowY: 'auto' }}>
          {displayedNotes.map((note) => (
            <Box
              key={note.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 0.5,
              }}
            >
              {/* Note Details */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>
                  {note.date} -
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#4a70b0', cursor: 'pointer' }} onClick={() => handleEditNote(note)}>
                  <Typography sx={{ fontSize: '0.85rem', fontStyle: 'italic', mr: 0.25, fontWeight: 500 }}>
                    {note.source}
                  </Typography>
                  <EditIcon sx={{ fontSize: 13 }} />
                </Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', ml: 1 }}>
                  {note.text}
                </Typography>
              </Box>

              {/* Remind Me Checkbox */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#555', lineHeight: 1 }}>
                  remind me
                </Typography>
                <Checkbox
                  size="small"
                  checked={note.remindMe}
                  onChange={() => handleToggleRemindMe(note.id)}
                  sx={{ p: 0.25 }}
                />
              </Box>
            </Box>
          ))}

          {loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
              Loading notes...
            </Typography>
          ) : displayedNotes.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
              No notes in this category.
            </Typography>
          )}
        </Box>

        {/* Textfield Input */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                borderColor: '#ccc',
                bgcolor: '#fff',
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            sx={{
              bgcolor: '#d4c197',
              color: '#fff',
              boxShadow: 'none',
              px: 3.5,
              py: 0.75,
              fontSize: '0.825rem',
              '&:hover': {
                bgcolor: '#c5b396',
              },
              '&:disabled': {
                bgcolor: '#e2d2b5',
                color: '#fff',
              },
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            {editingNoteId ? 'Save' : 'Add'}
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            sx={{
              bgcolor: '#a9a9a9',
              color: '#fff',
              boxShadow: 'none',
              px: 3.5,
              py: 0.75,
              fontSize: '0.825rem',
              '&:hover': {
                bgcolor: '#999',
              },
              textTransform: 'none',
              fontWeight: 500,
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
