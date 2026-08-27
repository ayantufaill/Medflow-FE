import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import { COLORS } from '../../../constants/colors';
import { progressNoteService } from '../../../services/progress-note.service';
import dayjs from 'dayjs';

export default function PatientProgressNotesDialog({ open, onClose, patientId, onAttach }) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState(new Set());
  const [attaching, setAttaching] = useState(false);

  useEffect(() => {
    if (open && patientId) {
      fetchNotes();
      setSelectedNoteIds(new Set());
    }
  }, [open, patientId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      // Fetch only Active notes for this patient
      const data = await progressNoteService.getAll({ patientId, tab: 'Active', limit: 100 });
      setNotes(data?.notes || data?.data?.notes || []);
    } catch (err) {
      console.error('Failed to fetch progress notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setSelectedNoteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAttach = async () => {
    setAttaching(true);
    const selectedNotes = notes.filter(n => selectedNoteIds.has(n.id || n._id));
    await onAttach(selectedNotes);
    setAttaching(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth 
      sx={{ zIndex: 1500 }}
      PaperProps={{ 
        sx: { 
          borderRadius: '14px', 
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          minHeight: '400px'
        } 
      }}
    >
      <DialogTitle sx={{
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
      }}>
        <Box sx={{
          width: "32px", height: "32px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <DescriptionIcon sx={{ fontSize: "18px", color: "#2262ef" }} />
        </Box>
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Select Progress Notes to Attach
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 4 }}>
            <CircularProgress />
          </Box>
        ) : notes.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 4 }}>
             <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: 'Inter, sans-serif' }}>
               No progress notes found for this patient.
             </Typography>
          </Box>
        ) : (
          <List sx={{ pt: 0, flex: 1, overflow: 'auto' }}>
            {notes.map(note => {
              const noteId = note.id || note._id;
              const isSelected = selectedNoteIds.has(noteId);
              return (
                <ListItem 
                  key={noteId}
                  disablePadding
                  sx={{ 
                    borderBottom: `1px solid ${COLORS.BORDER}`,
                    cursor: 'pointer',
                    bgcolor: isSelected ? '#f8fafc' : 'transparent',
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                  onClick={() => handleToggle(noteId)}
                >
                  <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', p: 2 }}>
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => handleToggle(noteId)}
                      onClick={e => e.stopPropagation()}
                      sx={{ p: 0, mr: 2, mt: 0.5 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY }}>
                          {dayjs(note.date).format('MMM D, YYYY h:mm A')}
                        </Typography>
                        <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', bgcolor: '#e2e8f0', color: '#475569', fontSize: '0.7rem', fontWeight: 600 }}>
                          {note.category || 'General'}
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_SECONDARY }}>
                        Provider: {note.provider || 'Unknown'}
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {note.description}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={attaching}
          sx={{ textTransform: 'none', borderRadius: '8px', px: 3, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAttach} 
          variant="contained"
          disabled={selectedNoteIds.size === 0 || attaching}
          startIcon={attaching ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ textTransform: 'none', backgroundColor: COLORS.ACCENT, color: '#fff', borderRadius: '8px', px: 3, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#1565c0', boxShadow: 'none' }, fontFamily: 'Inter, sans-serif' }}
        >
          {attaching ? 'Attaching...' : `Attach Selected (${selectedNoteIds.size})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
