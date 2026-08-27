import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Chip, Button, Paper, CircularProgress, Menu, MenuItem, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotesIcon from '@mui/icons-material/Notes';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import { MOCK_NOTES, MOCK_NOTE_HISTORY, MOCK_FILTER_TAGS } from './notes.constants';
import dayjs from 'dayjs';
import EditNoteForm from '../edit-note/EditNoteForm';
import { clinicalNoteService } from '../../../services/clinical-note.service';

const NotesDrawer = ({ open, onClose, patientName, patientId, currentPatient, selectedProcedures }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['Clinical']);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'history' | 'filter' | 'edit' | 'create'
  const [pendingFilters, setPendingFilters] = useState(['Clinical']);

  const loadRealNotes = async () => {
    if (!patientId) return;
    try {
      setIsLoading(true);
      const res = await clinicalNoteService.getClinicalNotesByPatient(patientId);
      if (res && res.clinicalNotes) {
        // Filter out empty 'soap' notes (junk seed data) that have no structuredData or text
        const validNotes = res.clinicalNotes.filter(n => 
          n.noteType !== 'soap' || n.structuredData || n.text
        );
        
        setNotes(validNotes.map(n => {
          let titleStr = n.structuredData?.restorativeTreatment?.split('\n')[0];
          if (!titleStr) {
            const type = n.noteType || 'Clinical Note';
            titleStr = type.charAt(0).toUpperCase() + type.slice(1);
          }
          let updatedByName = 'Provider';
          if (n.providerId && typeof n.providerId === 'object') {
            updatedByName = `${n.providerId.firstName || ''} ${n.providerId.lastName || ''}`.trim();
          } else if (n.lastEditedBy) {
            const p = providersList.find(p => p.id === n.lastEditedBy || p._id === n.lastEditedBy);
            if (p) {
              updatedByName = `${p.userId?.firstName || p.firstName || ''} ${p.userId?.lastName || p.lastName || ''}`.trim();
            } else {
              updatedByName = n.lastEditedBy;
            }
          }

          return {
            id: n._id || n.id,
            title: titleStr,
            status: n.isSigned ? 'Signed' : 'Draft',
            category: 'Clinical',
            tags: n.structuredData?.isolation || [],
            text: n.structuredData?.procedureAccomplished || n.structuredData?.treatmentRequirementsNotes || '',
            updatedBy: updatedByName || 'Provider',
            updatedAt: dayjs(n.updatedAt).format('MMM D, YYYY [at] h:mm A'),
            isSigned: n.isSigned,
            isHeaderOnly: false
          };
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (patientId) {
        loadRealNotes();
      } else {
        setNotes([]);
      }
      setView('list');
    }
  }, [open, patientId]);

  const handleMenuClick = (event, noteId) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveNoteId(noteId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveNoteId(null);
  };

  const handleHistoryClick = () => {
    setView('history');
    setMenuAnchorEl(null);
  };

  const getStatusDisplay = (note) => {
    if (note.isSigned || note.status === 'Signed') {
      return { text: 'Completed', color: '#dcfce7', textColor: '#15803d' };
    }
    return { text: 'Saved', color: '#ffedd5', textColor: '#c2410c' }; // Draft
  };

  const handleOpenFilters = () => {
    setPendingFilters([...activeFilters]);
    setView('filter');
  };

  const handleApplyFilters = () => {
    setActiveFilters([...pendingFilters]);
    setView('list');
  };

  const displayNotes = activeFilters.length === 0 
    ? notes 
    : notes.filter(note => note.isHeaderOnly || activeFilters.some(filter => note.category === filter || (note.tags && note.tags.includes(filter))));
    
  const resultCount = displayNotes.filter(n => !n.isHeaderOnly).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600 } }
      }}
    >
      {view === 'list' ? (
        <>
          {/* Header */}
      <Box sx={{
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
        <NotesIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            <Box component="span" sx={{ color: '#2563eb' }}>{patientName || 'Patient'}</Box> / Notes
          </Typography>
          <IconButton onClick={() => setView('create')} size="small" sx={{ color: '#2563eb', p: 0.5 }}>
            <AddCircleOutlineIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>
      
      {/* Filter Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '4px' }}>
          {activeFilters.map(filter => (
            <Chip key={filter} label={filter} variant="outlined" sx={{ borderRadius: '16px', color: '#334155', borderColor: '#cbd5e1' }} />
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '4px' }}>
            <Typography sx={{ fontSize: fontSize.md, color: '#475569' }}>{resultCount} result{resultCount === 1 ? '' : 's'}</Typography>
            {activeFilters.length > 0 && (
              <Button size="small" onClick={() => setActiveFilters([])} sx={{ minWidth: 0, p: 0, textTransform: 'none', color: '#2563eb', fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Clear</Button>
            )}
          </Box>
        </Box>
        <IconButton size="small" onClick={handleOpenFilters} sx={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
          <TuneIcon sx={{ color: '#475569', fontSize: '1.2rem' }} />
        </IconButton>
      </Box>

      {/* Notes List */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={24} /></Box>
        ) : displayNotes.length === 0 || resultCount === 0 ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>No clinical notes match the current filters</Typography>
          </Box>
        ) : (
          displayNotes.map((note) => {
            if (note.isHeaderOnly) {
              return (
                <Box key={note.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: '#0f172a' }}>{note.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small"><NotificationsNoneIcon sx={{ color: '#475569' }} /></IconButton>
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, note.id)}><MoreVertIcon sx={{ color: '#475569' }} /></IconButton>
                  </Box>
                </Box>
              );
            }

            const statusDisplay = note.status ? { text: note.status, color: note.statusColor, textColor: note.statusTextColor } : getStatusDisplay(note);
            const title = note.title || note.noteType || 'Clinical Note';
            const text = note.content || note.text || '';
            const category = note.category || note.noteType || 'Clinical';
            const tags = note.tags || [];
            const providerName = note.updatedBy || 'System';
            const updatedAt = note.updatedAt || '';

            return (
              <Box key={note._id || note.id}>
                <Paper 
                  elevation={0} 
                  onClick={() => {
                    setActiveNoteId(note._id || note.id);
                    setView('edit');
                  }}
                  sx={{ 
                    bgcolor: '#f8fafc', 
                    p: 2, 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: '#0f172a' }}>{title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={(e) => e.stopPropagation()}><NotificationsNoneIcon sx={{ color: '#475569' }} /></IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuClick(e, note._id || note.id); }}><MoreVertIcon sx={{ color: '#475569' }} /></IconButton>
                    </Box>
                  </Box>
                  
                  {(statusDisplay.text || category) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                      {statusDisplay.text && (
                        <Chip 
                          label={statusDisplay.text} 
                          size="small" 
                          sx={{ bgcolor: statusDisplay.color, color: statusDisplay.textColor, fontWeight: fontWeight.medium, borderRadius: '4px', fontSize: fontSize.sm }} 
                        />
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#3b82f6' }}>
                        <MedicalServicesIcon sx={{ fontSize: '1.1rem', color: '#0f172a' }} />
                        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.medium }}>{category}</Typography>
                      </Box>
                      {tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', borderRadius: '4px', border: 'none', fontSize: fontSize.sm }} />
                      ))}
                    </Box>
                  )}
                  
                  {text && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#334155', fontSize: fontSize.base, whiteSpace: 'pre-line' }}>
                        {text.length > 200 ? text.substring(0, 200) + '...' : text}
                      </Typography>
                      {text.length > 200 && (
                        <Typography sx={{ color: '#0f172a', fontSize: fontSize.base, fontWeight: fontWeight.semibold, mt: 0.5, cursor: 'pointer' }}>
                          More
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  <Typography sx={{ color: '#94a3b8', fontSize: fontSize.xs }}>
                    Updated by <Box component="span" sx={{ fontWeight: fontWeight.semibold }}>{providerName}</Box> {updatedAt}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
      </Box>
        </>
      ) : view === 'filter' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Filter Header */}
          <Box sx={{
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
            <IconButton onClick={() => setView('list')} size="small" sx={{ color: '#2563eb', p: 0.5, ml: -1 }}>
              <ArrowBackIcon sx={{ fontSize: "20px" }} />
            </IconButton>
            <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
              Filter Notes
            </Typography>
          </Box>
          
          {/* Filter Content */}
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2, fontSize: fontSize.md }}>Tags</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {MOCK_FILTER_TAGS.map((tag) => (
                <Box key={tag.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox 
                    size="small" 
                    checked={pendingFilters.includes(tag.label)} 
                    onChange={(e) => {
                       if (e.target.checked) setPendingFilters(prev => [...prev, tag.label]);
                       else setPendingFilters(prev => prev.filter(f => f !== tag.label));
                    }}
                    sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} 
                  />
                  <Chip 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>{tag.icon}</Box>
                        <Typography sx={{ fontSize: fontSize.md }}>{tag.label}</Typography>
                      </Box>
                    }
                    size="small" 
                    sx={{ 
                      bgcolor: tag.bg, 
                      color: tag.color, 
                      fontWeight: fontWeight.medium, 
                      borderRadius: '4px',
                      height: '24px',
                      border: 'none',
                      '& .MuiChip-label': { px: 1, py: 0 }
                    }} 
                  />
                </Box>
              ))}
            </Box>

            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2, fontSize: fontSize.md }}>Archived</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <Checkbox size="small" sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />
               <Typography sx={{ color: '#334155', fontSize: fontSize.md }}>Show Archived</Typography>
            </Box>
          </Box>
          
          {/* Footer */}
          <Divider />
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fff', flexShrink: 0 }}>
            <Button variant="outlined" onClick={() => setView('list')} sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#2563eb', fontWeight: 600, px: 3, py: 0.75 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleApplyFilters} sx={{ textTransform: 'none', bgcolor: '#2563eb', boxShadow: 'none', fontWeight: 600, px: 3, py: 0.75, '&:hover': { bgcolor: '#1a50c7' } }}>
              Apply
            </Button>
          </Box>
        </Box>
      ) : (view === 'edit' || view === 'create') ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{
            boxSizing: 'border-box',
            px: '25px',
            py: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: `1px solid ${COLORS.BORDER}`,
            backgroundColor: COLORS.SURFACE_TINT,
            m: 0,
            flexShrink: 0,
          }}>
            <IconButton onClick={() => setView('list')} size="small" sx={{ color: '#2563eb', p: 0.5, ml: -1 }}>
              <ArrowBackIcon sx={{ fontSize: '20px' }} />
            </IconButton>
            <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
              {view === 'create' ? 'Create Note' : 'Edit Note'}
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
              <CloseIcon sx={{ fontSize: '18px' }} />
            </IconButton>
          </Box>
          
          {/* Main Content (Form) */}
          <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff' }}>
            <EditNoteForm 
              noteId={activeNoteId} 
              view={view}
              patientId={patientId || "1"} 
              appointmentId={"1"} 
              providerId={"1"}
              currentPatient={currentPatient}
              selectedProcedures={selectedProcedures}
              onCancel={() => setView('list')}
              onSuccess={() => {
                loadRealNotes();
                setView('list');
              }}
            />
          </Box>
        </Box>
      ) : (
        <>
          {/* History Header */}
          <Box sx={{
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
            <IconButton onClick={() => setView('list')} size="small" sx={{ color: '#2563eb', p: 0.5, ml: -1 }}>
              <ArrowBackIcon sx={{ fontSize: "20px" }} />
            </IconButton>
            <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
              Note History
            </Typography>
          </Box>
          
          {/* History Content */}
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
            {MOCK_NOTE_HISTORY.map((item, idx) => (
              <Box key={item.id} sx={{ display: 'flex', position: 'relative', pb: 4 }}>
                {/* Timeline vertical line */}
                {idx !== MOCK_NOTE_HISTORY.length - 1 && (
                  <Box sx={{ position: 'absolute', left: '7px', top: '16px', bottom: '-4px', width: '2px', bgcolor: '#e2e8f0', zIndex: 0 }} />
                )}
                
                {/* Timeline Dot */}
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#e2e8f0', mt: 0.5, mr: 3, position: 'relative', zIndex: 1, border: '2px solid #fff', flexShrink: 0 }} />

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  {/* Edit row */}
                  <Box sx={{ display: 'flex', mb: 1.5 }}>
                     <Typography sx={{ width: 100, color: '#475569', fontSize: fontSize.md, flexShrink: 0 }}>{item.action}</Typography>
                     <Typography sx={{ color: '#475569', fontSize: fontSize.md }}>
                       <Box component="span" sx={{ fontWeight: fontWeight.bold, color: '#2563eb' }}>{item.providerName}</Box> on {item.timestamp}
                     </Typography>
                  </Box>

                  {/* Text row */}
                  <Box sx={{ display: 'flex', mb: item.status ? 1.5 : 0 }}>
                     <Typography sx={{ width: 100, color: '#475569', fontSize: fontSize.md, flexShrink: 0 }}>Text</Typography>
                     <Typography sx={{ color: '#334155', fontSize: fontSize.md, whiteSpace: 'pre-line', flex: 1 }}>{item.text}</Typography>
                  </Box>

                  {/* Status row */}
                  {item.status && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                       <Typography sx={{ width: 100, color: '#475569', fontSize: fontSize.md, flexShrink: 0 }}>Note Status</Typography>
                       <Chip label={item.status} size="small" sx={{ bgcolor: item.statusColor, color: item.statusTextColor, fontWeight: fontWeight.medium, borderRadius: '4px', fontSize: fontSize.sm }} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            width: 180,
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            mt: 0.5,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          setView('edit');
        }} sx={{ py: 1, gap: 1.5 }}>
          <EditOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          <Typography sx={{ color: '#334155', fontSize: '0.95rem' }}>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1, gap: 1.5 }}>
          <FileCopyOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          <Typography sx={{ color: '#334155', fontSize: '0.95rem' }}>Copy Note</Typography>
        </MenuItem>
        <MenuItem onClick={handleHistoryClick} sx={{ py: 1, gap: 1.5 }}>
          <MenuBookOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          <Typography sx={{ color: '#334155', fontSize: '0.95rem' }}>History</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1, gap: 1.5 }}>
          <PrintOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          <Typography sx={{ color: '#334155', fontSize: '0.95rem' }}>Print</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1, gap: 1.5 }}>
          <ArchiveOutlinedIcon sx={{ fontSize: '1.25rem', color: '#ef4444' }} />
          <Typography sx={{ color: '#ef4444', fontSize: '0.95rem' }}>Archive</Typography>
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default NotesDrawer;
