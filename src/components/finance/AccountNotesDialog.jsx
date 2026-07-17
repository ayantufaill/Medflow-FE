import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { COLORS } from '../../constants/colors';
import { fontWeight } from '../../constants/styles';

const AccountNotesDialog = ({ patient, onClose }) => {
  const dispatch = useDispatch();
  const notes = useSelector(selectPatientAccountNotes);
  const loading = useSelector(selectPatientAccountNotesLoading);

  const [activeTab, setActiveTab] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [remindMeNewNote, setRemindMeNewNote] = useState(false);
  
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
        })).then(() => {
          dispatch(fetchPatientAccountNotes(patient));
        });
        setEditingNoteId(null);
      } else {
        // Create new note
        dispatch(createPatientAccountNote({
          patient,
          text: noteText,
          remindMe: remindMeNewNote
        })).then(() => {
          dispatch(fetchPatientAccountNotes(patient));
        });
      }
      setNoteText('');
      setRemindMeNewNote(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteText(note.text);
  };

  const handleToggleRemindMe = (noteId) => {
    const notesList = Array.isArray(notes) ? notes : [];
    const note = notesList.find(n => n.id === noteId || String(n.id) === String(noteId));
    if (note) {
      dispatch(updatePatientAccountNote({
        patient,
        noteId,
        updates: { remindMe: !note.remindMe }
      })).then(() => {
        dispatch(fetchPatientAccountNotes(patient));
      });
    }
  };

  const handleCancel = () => {
    setNoteText('');
    setEditingNoteId(null);
    setRemindMeNewNote(false);
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

  const notesList = Array.isArray(notes) ? notes : [];
  const activeNotesList = notesList.filter(n => !n.archived);
  const archivedNotesList = notesList.filter(n => n.archived);

  const displayedNotes = activeTab === 0 ? activeNotesList : archivedNotesList;

  return (
    <Dialog 
      open={Boolean(patient)} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
         <ReceiptLongIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
         <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            <span style={{ fontWeight: 700 }}>Account Notes</span>
            <span style={{ color: COLORS.TEXT_SECONDARY, fontWeight: 400, marginLeft: '8px' }}>
              — {patient?.name || (patient?.firstName ? `${patient.firstName} ${patient.lastName}` : 'Unknown')}
            </span>
         </Typography>
         <IconButton onClick={handleCancel} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
           <CloseIcon sx={{ fontSize: "18px" }} />
         </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Tab Header */}
        <Box sx={{ 
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          px: "24px",
          backgroundColor: COLORS.WHITE,
          flexShrink: 0,
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              minHeight: "unset",
              "& .MuiTabs-indicator": { backgroundColor: COLORS.ACCENT }
            }}
          >
            <Tab label={`Account Notes (${activeNotesList.length})`} sx={{ textTransform: 'none', fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, fontSize: '13px', minHeight: 'unset', py: 1.5, "&.Mui-selected": { color: COLORS.ACCENT } }} />
            <Tab label={`Archived (${archivedNotesList.length})`} sx={{ textTransform: 'none', fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, fontSize: '13px', minHeight: 'unset', py: 1.5, "&.Mui-selected": { color: COLORS.ACCENT } }} />
          </Tabs>
        </Box>

        {/* Body Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', backgroundColor: COLORS.SURFACE_CARD }}>
          
          {/* Notes List */}
          <List sx={{ flex: 1, overflow: "auto", pt: 2, pb: 0 }}>
            {displayedNotes.map((note) => (
              <ListItem
                key={note.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2,
                  px: 2,
                  mx: 2,
                  mb: 2,
                  width: 'calc(100% - 32px)',
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  borderRadius: '8px',
                  bgcolor: COLORS.WHITE,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_MUTED }}>
                      {dayjs(note.createdAt || note.date || new Date()).format('MM/DD/YYYY')} —
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: COLORS.ACCENT, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleEditNote(note)}>
                      {note.source || 'agingReport'} <LaunchIcon sx={{ fontSize: 14 }} />
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => handleToggleRemindMe(note.id)}>
                    <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>remind me</Typography>
                    <Checkbox 
                      size="small" 
                      checked={note.remindMe || false} 
                      onChange={() => handleToggleRemindMe(note.id)} 
                      sx={{ p: 0 }} 
                      icon={<RadioButtonUncheckedIcon sx={{ fontSize: 18, color: COLORS.ACCENT }} />}
                      checkedIcon={<CheckCircleIcon sx={{ fontSize: 18, color: COLORS.ACCENT }} />}
                    />
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '14px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>
                  {note.text}
                </Typography>
              </ListItem>
            ))}

            {displayedNotes.length === 0 && (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="body2" sx={{ color: COLORS.TEXT_MUTED, fontStyle: 'italic' }}>
                  {loading ? 'Loading notes...' : 'No notes in this category.'}
                </Typography>
              </Box>
            )}
          </List>
        </Box>

        {/* Textfield Input Section */}
        <Box sx={{ px: "24px", pb: "24px", pt: "12px", borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.SURFACE_CARD }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write a new account note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{ 
              "& .MuiOutlinedInput-root": { 
                borderRadius: '8px', 
                bgcolor: COLORS.WHITE,
                fontSize: '14px',
                '& fieldset': { borderColor: COLORS.BORDER_LIGHT },
                '&:hover fieldset': { borderColor: COLORS.BORDER },
                '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT, borderWidth: '1px' },
              } 
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: "16px", px: "24px", justifyContent: 'space-between', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.WHITE }}>
        <Box 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => setRemindMeNewNote(!remindMeNewNote)}
        >
          <Checkbox 
            size="small" 
            checked={remindMeNewNote} 
            sx={{ p: 0 }} 
            icon={<RadioButtonUncheckedIcon sx={{ fontSize: 20, color: COLORS.ACCENT }} />}
            checkedIcon={<CheckCircleIcon sx={{ fontSize: 20, color: COLORS.ACCENT }} />}
          />
          <Typography sx={{ fontSize: '14px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>Remind me</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            onClick={handleCancel}
            disableRipple
            sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, textTransform: 'none', px: 2, '&:hover': { bgcolor: 'transparent' } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            disableElevation
            sx={{ 
              textTransform: 'none', 
              px: 3, 
              py: 1, 
              borderRadius: '6px', 
              bgcolor: COLORS.ACCENT, 
              color: COLORS.WHITE, 
              fontWeight: fontWeight.semibold, 
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER }, 
              '&.Mui-disabled': { bgcolor: COLORS.SURFACE_DISABLED, color: COLORS.TEXT_MUTED } 
            }}
          >
            {editingNoteId ? 'Save' : 'Add'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AccountNotesDialog;
