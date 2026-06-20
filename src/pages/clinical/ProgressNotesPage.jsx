import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, Button, Chip, Stack, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, 
  Select, FormControl, InputLabel, Collapse, IconButton, Popover
} from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import InteractiveToothChart from '../../components/clinical/InteractiveToothChart';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedPatientId } from '../../store/slices/patientSlice';
import { selectCurrentAppointment } from '../../store/slices/appointmentSlice';
import {
  useProgressNotesQuery,
  useCreateProgressNote,
  useUpdateProgressNote,
  useAddProcedureToNote,
  useArchiveProgressNote,
  useSignProgressNote
} from '../../hooks/queries';
import { clinicalExamService } from '../../services/clinical-exam.service';
import { treatmentPlanService } from '../../services/treatment-plan.service';
import { formatPeriodontalNotes } from '../../utils/formatPeriodontalNotes';
import PrintIcon from '@mui/icons-material/Print';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import MicIcon from '@mui/icons-material/Mic';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

const ProgressNotesPage = () => {
  const selectedPatientId = useSelector(selectSelectedPatientId);
  const currentAppointment = useSelector(selectCurrentAppointment);
  const authProviderId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);

  // Derive provider from the active appointment (priority) or fallback to logged-in user
  const appointmentProvider = currentAppointment?.providerId;
  const providerName = (() => {
    if (currentAppointment?.providerName) return currentAppointment.providerName;
    if (!appointmentProvider) return '';
    
    if (typeof appointmentProvider !== 'object') {
      // If it's a string that's not just numbers, it might be the name itself
      if (typeof appointmentProvider === 'string' && isNaN(Number(appointmentProvider))) {
        return appointmentProvider;
      }
      return '';
    }

    // Backend maps provider as: { _id, providerCode, userId: { _id, firstName, lastName } }
    const user = appointmentProvider.userId;
    if (user && typeof user === 'object') {
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      if (name) return name;
    }
    // Fallback: check if firstName/lastName are directly on provider (some endpoints)
    const directName = `${appointmentProvider.firstName || ''} ${appointmentProvider.lastName || ''}`.trim();
    if (directName) return directName;
    // Last resort: use providerCode (e.g. "DDS")
    return appointmentProvider.providerCode || '';
  })();

  const providerId = (() => {
    if (currentAppointment?.providerId) {
      const prov = currentAppointment.providerId;
      if (typeof prov === 'object') {
        const extractedId = prov._id || prov.id || prov.ProvNum || (prov.userId && typeof prov.userId === 'object' ? (prov.userId._id || prov.userId.id) : null);
        if (extractedId) return extractedId;
      } else if (!isNaN(Number(prov))) {
        return prov;
      }
    }
    if (currentAppointment?.provider) {
      const provObj = currentAppointment.provider;
      const extractedId = provObj._id || provObj.id || provObj.ProvNum;
      if (extractedId) return extractedId;
    }
    return authProviderId;
  })();
  const sessionState = useSelector(state => state.clinicalExamSession.progressNotes);
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openProcDialog, setOpenProcDialog] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [allExpanded, setAllExpanded] = useState(true);
  const [isAmending, setIsAmending] = useState(null);
  const [examView, setExamView] = useState('Chart View');
  const [selectedChecklist, setSelectedChecklist] = useState('Treatment Checklist');
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  
  // Persisted state via Redux
  const editorContent = sessionState.editorContent;
  const setEditorContent = (val) => dispatch({ type: 'clinicalExamSession/setProgressNotesSession', payload: { editorContent: val } });
  
  const panoImages = sessionState.panoImages;
  const setPanoImages = (val) => {
    const newVal = typeof val === 'function' ? val(panoImages) : val;
    dispatch({ type: 'clinicalExamSession/setProgressNotesSession', payload: { panoImages: newVal } });
  };
  
  const [activeMount, setActiveMount] = useState(null);
  
  const progressSelectedTeeth = sessionState.progressSelectedTeeth;
  const setProgressSelectedTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(progressSelectedTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setProgressNotesSession', payload: { progressSelectedTeeth: newVal } });
  };

  const panoInputRef = React.useRef(null);
  const [textColorAnchor, setTextColorAnchor] = useState(null);
  
  const formatState = sessionState.formatState;
  const setFormatState = (val) => {
    const newVal = typeof val === 'function' ? val(formatState) : val;
    dispatch({ type: 'clinicalExamSession/setProgressNotesSession', payload: { formatState: newVal } });
  };
  
  const editorRef = React.useRef(null);
  
  const [confirmNewNote, setConfirmNewNote] = useState(null);
  const [activeChecklistPopup, setActiveChecklistPopup] = useState(null);
  
  const defaultChecklistFindings = {
    generatedNotes: true, identifiedFindings: true, bleedingPoints: false,
    questionableRestorations: false, bruxism: false, analysisRequired: true,
    analysisYes: false, analysisNo: false, nv: true, recare: false, txPlanned: false,
    provider: true, dentistJohnSmith: false, assistantJolene: false
  };
  const checklistFindings = sessionState.checklistFindings || defaultChecklistFindings;
  const setChecklistFindings = (val) => {
    const newVal = typeof val === 'function' ? val(checklistFindings) : val;
    dispatch({ type: 'clinicalExamSession/setProgressNotesSession', payload: { checklistFindings: newVal } });
  };

  const defaultCompletedProcedures = [
    { id: 1, code: 'D0120', procedure: 'Periodic Oral Evaluation', tooth: '', type: 'Diagnostic', selected: false },
    { id: 2, code: 'D1110', procedure: 'Prophylaxis - Adult', tooth: '', type: 'Preventative', selected: false },
    { id: 3, code: 'D0274', procedure: 'Bitewings - Four Radiographic Images', tooth: '', type: 'Diagnostic', selected: false },
    { id: 4, code: 'D1206', procedure: 'Topical Application of Fluoride Varnish', tooth: '', type: 'Preventative', selected: false },
  ];
  const completedProcedures = sessionState.completedProcedures || defaultCompletedProcedures;
  const setCompletedProcedures = (val) => {
    const newVal = typeof val === 'function' ? val(completedProcedures) : val;
    dispatch({ type: 'clinicalExamSession/setProgressNotesSession', payload: { completedProcedures: newVal } });
  };

  const standardColors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  ];

  // Local Tooth component removed — now using shared InteractiveToothChart
  
  
  // --- High-fidelity Checklist Icons (Synced from TreatmentPlan) ---
  const EndoIcon = ({ filled = false }) => (
    <Box sx={{ width: 22, height: 22, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
        <path d="M7 3C4 3 3 6 3 9C3 13 5 21 8 21C10 21 11 19 12 19C13 19 14 21 16 21C19 21 21 13 21 9C21 6 20 3 18 3C15 3 13 4 12 5C11 4 9 3 7 3Z" />
        {filled && <circle cx="15" cy="7" r="3" fill="#666" />}
      </svg>
    </Box>
  );

  const BracesIconSmall = () => (
    <Box sx={{ width: 20, height: 16, border: '1px solid #999', borderRadius: '2px', bgcolor: '#fff', display: 'flex', alignItems: 'center', px: 0.2 }}>
      <Box sx={{ width: '100%', height: '1.5px', bgcolor: '#555', position: 'relative' }}>
        {[2, 7, 12].map((left) => (
          <Box key={left} sx={{ position: 'absolute', top: -2, left, width: 3, height: 5, bgcolor: '#90caf9', border: '0.5px solid #1976d2' }} />
        ))}
      </Box>
    </Box>
  );

  const DentureIconSmall = ({ color }) => (
    <Box sx={{ width: 18, height: 14, bgcolor: color, borderRadius: '8px 8px 2px 2px', border: '1px solid rgba(0,0,0,0.2)' }} />
  );

  const ImplantIconSmall = () => (
    <Box sx={{ width: 10, height: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: 8, height: 3, bgcolor: '#999' }} />
      <Box sx={{ width: 5, height: 10, bgcolor: '#bbb', mt: '1px', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
    </Box>
  );
  
  const [notes, setNotes] = useState([]);

  // --- React Query Hooks ---
  const progressNotesQuery = useProgressNotesQuery({
    patientId: selectedPatientId,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    tab: tabValue === 1 ? 'Archived' : undefined
  });
  const createNoteMutation = useCreateProgressNote();
  const updateNoteMutation = useUpdateProgressNote();
  const addProcedureMutation = useAddProcedureToNote();
  const archiveNoteMutation = useArchiveProgressNote();
  const signNoteMutation = useSignProgressNote();

  // --- Date formatting helper ---
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) + ' ' +
             d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return dateStr;
    }
  };

  // --- Sync API data into local state ---
  useEffect(() => {
    if (progressNotesQuery.data?.data?.notes) {
      setNotes(progressNotesQuery.data.data.notes.map(n => ({
        ...n,
        date: formatDate(n.date),
        signedDate: formatDate(n.signedDate),
        isExpanded: true
      })));
    }
  }, [progressNotesQuery.data]);

  // Keep newNote provider in sync with the appointment's provider
  useEffect(() => {
    if (providerName) {
      setNewNote(prev => ({ ...prev, provider: providerName }));
    }
  }, [providerName]);

  const [newNote, setNewNote] = useState({ description: '', category: 'Exam Notes', provider: providerName || 'Unknown Provider' });
  const [newProc, setNewProc] = useState('');

  const noteCategories = [
    { label: 'Exam Notes', color: '#FEF9E7', textColor: '#9A7D0A' },
    { label: 'Treatment Notes', color: '#E9F7EF', textColor: '#1D8348' },
    { label: 'Recare Notes', color: '#EBF5FB', textColor: '#2874A6' },
    { label: 'Emergency Notes', color: '#FDEDEC', textColor: '#943126' },
    { label: 'Conversation Notes', color: '#F4ECF7', textColor: '#633974' },
    { label: 'General Notes', color: '#F2F3F4', textColor: '#566573' },
    { label: 'Ortho Notes', color: '#FDE9F7', textColor: '#922B21' },
  ];

  // --- Logic Handlers ---

  const handleToggleAll = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    setNotes(notes.map(n => ({ ...n, isExpanded: nextState })));
  };

  const handleToggleRow = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isExpanded: !n.isExpanded } : n));
  };

  const handlePrint = () => window.print();

  const handleAddNote = () => {
    if (selectedPatientId) {
      createNoteMutation.mutate({
        patientId: selectedPatientId,
        category: newNote.category,
        description: newNote.description || 'New progress note',
        providerId: providerId ? String(providerId) : '1'
      }, {
        onSuccess: () => {
          setOpenNoteDialog(false);
          setNewNote({ description: '', category: 'Exam Notes', provider: 'Christina Sabour' });
        }
      });
    } else {
      // Fallback to local state if no patient selected
      const note = {
        id: Date.now().toString(),
        date: formatDate(new Date().toISOString()),
        procedures: [],
        ...newNote,
        signedBy: newNote.provider,
        signedDate: formatDate(new Date().toISOString()),
        isExpanded: true
      };
      setNotes([note, ...notes]);
      setOpenNoteDialog(false);
    }
  };

  const handleConfirmNewNote = () => {
    if (selectedPatientId) {
      createNoteMutation.mutate({
        patientId: selectedPatientId,
        category: confirmNewNote,
        description: 'New note',
        providerId: providerId ? String(providerId) : '1'
      }, {
        onSuccess: (res) => {
          setConfirmNewNote(null);
          const created = res?.data?.progressNote;
          if (created) {
            setIsAmending(created.id);
          }
        }
      });
    } else {
      const note = {
        id: Date.now().toString(),
        date: formatDate(new Date().toISOString()),
        procedures: [],
        description: '',
        provider: providerName || 'Unknown Provider',
        signedBy: providerName || 'Unknown Provider',
        signedDate: formatDate(new Date().toISOString()),
        category: confirmNewNote,
        isExpanded: true
      };
      setNotes([note, ...notes]);
      setConfirmNewNote(null);
      setIsAmending(note.id);
    }
  };

  const handleOpenProc = (id) => {
    setActiveNoteId(id);
    setOpenProcDialog(true);
  };

  const handleAddProcedure = () => {
    if (activeNoteId && newProc) {
      addProcedureMutation.mutate(
        { noteId: activeNoteId, procedureCode: newProc },
        {
          onSuccess: () => {
            // Also update local state for immediate feedback
            setNotes(notes.map(n => 
              n.id === activeNoteId ? { ...n, procedures: [...n.procedures, newProc] } : n
            ));
            setNewProc('');
            setOpenProcDialog(false);
          },
          onError: () => {
            // Fallback: update local state anyway
            setNotes(notes.map(n => 
              n.id === activeNoteId ? { ...n, procedures: [...n.procedures, newProc] } : n
            ));
            setNewProc('');
            setOpenProcDialog(false);
          }
        }
      );
    }
  };

  const handleFormat = (format, value) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(format, false, value);
      setEditorContent(editorRef.current.innerHTML);
      
      // Update local UI state for highlighting
      if (format === 'bold') setFormatState(prev => ({ ...prev, bold: !prev.bold }));
      if (format === 'italic') setFormatState(prev => ({ ...prev, italic: !prev.italic }));
      if (format === 'justifyLeft') setFormatState(prev => ({ ...prev, align: 'left' }));
      if (format === 'justifyCenter') setFormatState(prev => ({ ...prev, align: 'center' }));
      if (format === 'justifyRight') setFormatState(prev => ({ ...prev, align: 'right' }));
    }
  };

  const insertEmoji = (emoji) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, emoji);
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  const handleMountClick = (mountId) => {
    setActiveMount(mountId);
    if (panoInputRef.current) {
      panoInputRef.current.click();
    }
  };

  const handlePanoFileChange = (e) => {
    const file = e.target.files[0];
    if (file && activeMount) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPanoImages(prev => ({
          ...prev,
          [activeMount]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const MountBox = ({ id, width, height }) => (
    <Box 
      onClick={() => handleMountClick(id)}
      sx={{ 
        border: '1px solid #ccc', 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#999', 
        fontSize: '1rem',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': { bgcolor: '#f9f9f9', borderColor: '#ccae81' }
      }}
    >
      {panoImages[id] ? (
        <img src={panoImages[id]} alt={`mount-${id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        id
      )}
    </Box>
  );

  const filteredNotes = selectedCategory === 'All' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  return (
    <>
      <Box sx={{ "@media print": { ".no-print": { display: "none" } } }}>
      <Box className="no-print"><ClinicalNavbar /></Box>

      <Box className="no-print" sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Box>
    <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }}>
      Progress Notes
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
      Patient updates and history
    </Typography>
  </Box>
</Box>

<Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Box className="no-print" sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Active Progress Notes" sx={{ textTransform: 'none' }} />
            <Tab label="Archived Progress Notes" sx={{ textTransform: 'none' }} />
          </Tabs>
        </Box>

        <Stack className="no-print" direction="row" spacing={1} sx={{ mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          {noteCategories.map((cat) => {
            const isDisabled = cat.label !== 'Exam Notes';
            return (
              <Button 
                key={cat.label} 
                onClick={() => setConfirmNewNote(cat.label)} 
                disabled={isDisabled}
                sx={{ 
                  backgroundColor: cat.color, color: cat.textColor, 
                  textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
                  border: '1px solid #e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: cat.color, filter: 'brightness(0.95)' },
                  '&.Mui-disabled': {
                    backgroundColor: cat.color,
                    color: cat.textColor,
                    opacity: 0.5
                  }
                }}
              >
                {cat.label}
              </Button>
            );
          })}
        </Stack>

        <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 1, alignItems: 'center' }}>
          <Typography 
            onClick={handleToggleAll}
            sx={{ color: '#5b84c1', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
          >
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </Typography>
          <IconButton onClick={handlePrint} size="small"><PrintIcon sx={{ fontSize: '1.2rem' }} /></IconButton>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                 <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '15%' }}>Date</TableCell>
                 <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '25%' }}>Procedure</TableCell>
                 <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '35%' }}>Description</TableCell>
                 <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '25%' }}>Provider / Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotes.map((note) => (
                <React.Fragment key={note.id}>
                  {/* The main row - standardized to the lavender color from the image */}
                  <TableRow sx={{ backgroundColor: '#E8DAEF' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => handleToggleRow(note.id)}>
                          {note.isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        <Typography sx={{ fontSize: '0.8rem' }}>{note.date}</Typography>
                      </Box>
                    </TableCell>
                     <TableCell sx={{ fontSize: '0.8rem' }}>
                       <Stack spacing={0.5}>
                         {note.isExpanded && note.procedures.map((p, i) => (
                           <Typography key={i} sx={{ fontSize: '0.75rem', color: '#333' }}>{p}</Typography>
                         ))}
                         <Box 
                           onClick={() => handleOpenProc(note.id)}
                           sx={{ 
                             display: 'inline-block',
                             bgcolor: '#d0d0d0', 
                             px: 1, 
                             py: 0.4, 
                             borderRadius: '4px',
                             color: '#fff', 
                             fontSize: '0.7rem', 
                             cursor: 'pointer', 
                             fontWeight: 600,
                             mt: 1,
                             width: 'fit-content',
                             '&:hover': { bgcolor: '#c0c0c0' }
                           }}
                         >
                           +add completed procedure
                         </Box>
                       </Stack>
                     </TableCell>
                     <TableCell sx={{ fontSize: '0.8rem' }}>
                        <Box 
                          sx={{ 
                            maxHeight: 100, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            '& p': { margin: 0, fontSize: '0.75rem' },
                            '& ul': { margin: 0, paddingLeft: '20px', fontSize: '0.75rem' }
                          }} 
                          dangerouslySetInnerHTML={{ __html: note.description }} 
                        />
                     </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1D8348', fontWeight: 600 }}>
                          {note.provider}
                        </Typography>
                        
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#333' }}>
                              Signed by {note.signedBy}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>
                              {note.signedDate}
                            </Typography>
                          </Box>
                          {note.isExpanded && (
                            <IconButton size="small" onClick={handlePrint}>
                              <PrintIcon sx={{ fontSize: '1.2rem', color: '#666' }} />
                            </IconButton>
                          )}
                        </Stack>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* The expanded body part from the image */}
                  {note.isExpanded && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ p: 0, borderBottom: 'none' }}>
                        <Box sx={{ backgroundColor: 'white', p: 3, borderTop: '1px solid #e0e0e0' }}>
                          {/* --- Always Visible Medical Details Header --- */}
                          <Box sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 2 }}>
                            <Grid container spacing={2} sx={{ fontSize: '0.75rem' }}>
                              <Grid item xs={12} md={6}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Typography sx={{ minWidth: 100, fontSize: '0.8rem', fontWeight: 'bold' }}>Medical History:</Typography>
                                  <label><input type="checkbox" /> Reviewed</label>
                                </Stack>
                                <Box sx={{ borderBottom: '1px solid #ccc', mb: 1 }} />
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Typography sx={{ minWidth: 100, fontSize: '0.8rem', fontWeight: 'bold' }}>Dental History:</Typography>
                                  <label><input type="checkbox" /> Reviewed</label>
                                </Stack>
                                <Box sx={{ borderBottom: '1px solid #ccc', mb: 1 }} />
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Typography sx={{ minWidth: 100, fontSize: '0.8rem', fontWeight: 'bold' }}>Blood Pressure:</Typography>
                                  <Typography>Systolic: <span style={{borderBottom: '1px solid #ccc', display: 'inline-block', width: 40}}></span></Typography>
                                  <Typography>Diastolic: <span style={{borderBottom: '1px solid #ccc', display: 'inline-block', width: 40}}></span></Typography>
                                  <Typography>Heart rate: <span style={{borderBottom: '1px solid #ccc', display: 'inline-block', width: 40}}></span></Typography>
                                </Stack>
                                <Box sx={{ borderBottom: '1px solid #ccc', mb: 1 }} />
                                {!isAmending && (
                                  <Button onClick={() => setIsAmending(note.id)} variant="contained" size="small" sx={{ bgcolor: '#ccae81', textTransform: 'none', mt: 1, color: 'white', '&:hover': { bgcolor: '#b79a6d' }, boxShadow: 'none' }}>Edit note</Button>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Typography sx={{ minWidth: 100, fontSize: '0.8rem', fontWeight: 'bold' }}>Radiographs:</Typography>
                                  <label><input type="checkbox" /> Taken</label>
                                  <label><input type="checkbox" /> Reviewed</label>
                                </Stack>
                                <Box sx={{ borderBottom: '1px solid #ccc', mb: 1 }} />
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Typography sx={{ minWidth: 100, fontSize: '0.8rem', fontWeight: 'bold' }}>Diagnostic Opinion:</Typography>
                                  <label><input type="checkbox" /> Reviewed</label>
                                </Stack>
                                <Box sx={{ borderBottom: '1px solid #ccc', mb: 1 }} />
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Typography sx={{ minWidth: 100, fontSize: '0.8rem', fontWeight: 'bold' }}>Risk assessment:</Typography>
                                  <label><input type="checkbox" /> Reviewed</label>
                                </Stack>
                                <Box sx={{ borderBottom: '1px solid #ccc', mb: 1 }} />
                              </Grid>
                            </Grid>

                            {isAmending === note.id && (
                              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3, mb: 1 }}>
                                <Button 
                                  onClick={async () => {
                                    if (!selectedPatientId) {
                                      if (editorRef.current) { editorRef.current.innerHTML = '<p><em>No patient selected.</em></p>'; setEditorContent(editorRef.current.innerHTML); }
                                      return;
                                    }
                                    
                                    const appointmentId = currentAppointment?.id || currentAppointment?.AptNum || currentAppointment?._id;
                                    if (!appointmentId) {
                                      if (editorRef.current) { editorRef.current.innerHTML = '<p><em>No active appointment selected to fetch exam data for.</em></p>'; setEditorContent(editorRef.current.innerHTML); }
                                      return;
                                    }
                                    
                                    try {
                                      const examTypes = ['radiographic', 'teeth-structure', 'head-neck', 'tmj', 'periodontal', 'airway', 'morphological', 'dentofacial'];
                                      const results = await Promise.allSettled(examTypes.map(type => clinicalExamService.getExam(type, appointmentId)));
                                      
                                      // Fetch treatment plans
                                      let tpData = null;
                                      try {
                                        const tpRes = await treatmentPlanService.getAll({ patientId: selectedPatientId });
                                        tpData = tpRes?.data?.treatmentPlans || [];
                                      } catch (e) {
                                        console.error('Failed to fetch treatment plans', e);
                                      }
                                      
                                      let generatedHtml = '';
                                      const formatValue = (val) => {
                                        if (Array.isArray(val)) return val.join(', ');
                                        if (typeof val === 'object' && val !== null) {
                                          const parts = [];
                                          Object.entries(val).forEach(([k, v]) => {
                                            if (v != null && v !== '') {
                                              if (typeof v === 'object') {
                                                parts.push(`${k}: [${formatValue(v)}]`);
                                              } else {
                                                parts.push(`${k}: ${v}`);
                                              }
                                            }
                                          });
                                          return parts.join(', ');
                                        }
                                        return String(val);
                                      };

                                      const titleMap = { 'radiographic': 'Radiographic Findings', 'teeth-structure': 'Teeth Findings', 'head-neck': 'Head & Neck', 'tmj': 'TMJ', 'periodontal': 'Periodontal', 'airway': 'Airway', 'morphological': 'Morphological', 'dentofacial': 'Dentofacial' };
                                      examTypes.forEach((type, idx) => {
                                        const result = results[idx];
                                        if (result.status === 'fulfilled' && result.value?.exam?.examData) {
                                          const examData = result.value.exam.examData;
                                          const title = titleMap[type] || type;

                                          // Use dedicated formatter for periodontal data
                                          if (type === 'periodontal') {
                                            generatedHtml += formatPeriodontalNotes(examData);
                                            return;
                                          }

                                          generatedHtml += `<p style="margin:8px 0 4px 0"><strong>${title}</strong><br>`;
                                          Object.entries(examData).forEach(([key, value]) => {
                                            if (value != null && value !== '' && key !== '_id') {
                                              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                                              if (Array.isArray(value) && value.length > 0) { generatedHtml += `${label}: ${value.join(', ')}<br>`; }
                                              else if (typeof value === 'object' && !Array.isArray(value)) { 
                                                const sub = formatValue(value); 
                                                if (sub) generatedHtml += `${label}: ${sub}<br>`; 
                                              }
                                              else if (typeof value !== 'object') { generatedHtml += `${label}: ${value}<br>`; }
                                            }
                                          });
                                          generatedHtml += '</p>';
                                        }
                                      });

                                      if (tpData && tpData.length > 0) {
                                        const activePlan = tpData.find(p => p.status === 'active') || tpData[0];
                                        generatedHtml += `<p style="margin:8px 0 4px 0"><strong>Active Treatment Plan (${activePlan.title || 'Untitled'})</strong><br>`;
                                        if (activePlan.items && Array.isArray(activePlan.items)) {
                                          activePlan.items.forEach(visit => {
                                            generatedHtml += `<strong>${visit.label || 'Visit'}:</strong><br>`;
                                            if (visit.procedures && Array.isArray(visit.procedures)) {
                                              visit.procedures.forEach(proc => {
                                                generatedHtml += `- [${proc.code}] Tooth ${proc.toothNum || proc.tooth || 'N/A'}: ${proc.description || 'Procedure'} ($${proc.fee || 0})<br>`;
                                              });
                                            }
                                          });
                                        }
                                        generatedHtml += `Total Estimated Cost: $${(activePlan.totalAmount || 0).toFixed(2)}</p>`;
                                      }

                                      if (!generatedHtml) {
                                        generatedHtml = '<p><strong>Comprehensive Exam</strong><br>- No clinical exam data or active treatment plans found for this patient.<br>- Please complete the clinical exam tabs first.<br>- Once saved, this button will auto-generate notes.</p>';
                                      } else {
                                        generatedHtml = `<p><strong>Comprehensive Exam - Generated Notes</strong><br>- Auto-generated from clinical exam data and treatment plan<br>- Date: ${new Date().toLocaleDateString('en-US')}</p>` + generatedHtml;
                                      }
                                      if (editorRef.current) { editorRef.current.innerHTML = generatedHtml; setEditorContent(generatedHtml); }
                                    } catch (error) {
                                      console.error('Failed to generate exam notes:', error);
                                      if (editorRef.current) { editorRef.current.innerHTML = '<p><em>Failed to fetch exam data.</em></p>'; setEditorContent(editorRef.current.innerHTML); }
                                    }
                                  }}
                                   variant="contained" size="small" sx={{ bgcolor: '#ccae81', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#b79a6d' } }}
                                 >
                                   Generate Exam Notes
                                 </Button>
                                <Button variant="contained" size="small" disabled sx={{ bgcolor: '#ccae81', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#b79a6d' }, '&.Mui-disabled': { bgcolor: '#ccae81', color: 'white', opacity: 0.5 } }}>Hide Checklist</Button>
                                <Button variant="contained" size="small" disabled sx={{ bgcolor: '#ccae81', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#b79a6d' }, '&.Mui-disabled': { bgcolor: '#ccae81', color: 'white', opacity: 0.5 } }}>Used Adj Products</Button>
                                <Button variant="contained" size="small" disabled sx={{ bgcolor: '#ccae81', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#b79a6d' }, '&.Mui-disabled': { bgcolor: '#ccae81', color: 'white', opacity: 0.5 } }}>Recommended Adj Products</Button>
                              </Stack>
                            )}
                          </Box>

                          {!isAmending && (
                            <Box sx={{ mb: 4, pl: 0 }}>
                              <Box sx={{ color: '#333', fontSize: '0.85rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: note.description || 'No notes generated yet.' }} />
                            </Box>
                          )}

                          {/* --- Amendment Section (Image View) --- */}
                          {isAmending === note.id && (
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ borderTop: '1px solid #eee', pt: 3 }}>

                                 <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                   {/* Left side: Checklists */}
                                   <Box sx={{ width: '40%', flex: '0 0 40%' }}>
                                     <Stack spacing={2.5} sx={{ mt: 8, pl: 0 }}>
                                       <Box 
                                         onClick={() => {
                                           setSelectedChecklist('Treatment Checklist');
                                           setIsChecklistExpanded(!isChecklistExpanded || selectedChecklist !== 'Treatment Checklist');
                                         }}
                                         sx={{ 
                                           bgcolor: '#d5e8d4', 
                                           p: 1.5, 
                                           borderRadius: 1, 
                                           border: selectedChecklist === 'Treatment Checklist' ? '2px solid #2e7d32' : '1px solid #b9d1b7',
                                           cursor: 'pointer',
                                           boxShadow: selectedChecklist === 'Treatment Checklist' ? '0 0 8px rgba(46, 125, 50, 0.2)' : 'none',
                                           '&:hover': { bgcolor: '#c8e6c9' }
                                         }}
                                       >
                                         <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Treatment Checklist</Typography>
                                       </Box>

                                       {isChecklistExpanded && selectedChecklist === 'Treatment Checklist' && (
                                         <Box sx={{ border: '1px solid #b4c7e7', borderRadius: 1, bgcolor: '#fff', mt: 1, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                           {[
                                             { name: 'Hygiene', chips: ['FMD', 'Las', 'LBR'], icons: [<Box key="1" sx={{ color: '#9c27b0' }}>🧪</Box>, <Box key="2" sx={{ color: '#4caf50' }}>🪥</Box>] },
                                             { name: 'Preventative', chips: ['Whi', 'Cur'], icons: [<Box key="1" sx={{ transform: 'rotate(-45deg)' }}>🖌️</Box>, <EndoIcon key="2" />] },
                                             { name: 'Anesthetic', chips: ['Nit', 'Nit'], icons: [<Box key="1" sx={{ color: '#666' }}>💉</Box>] },
                                             { name: 'Restorative', chips: ['Cla', 'OC', 'Cro', 'KOR', 'IMP', 'Imp', 'BvC', 'Tre', 'BPO', 'Whi', 'Exa'], icons: [<EndoIcon key="1" filled />, <ImplantIconSmall key="2" />] },
                                             { name: 'Restorative-Cohesive', chips: [], icons: [<Box key="1" sx={{ color: '#1976d2' }}>🏗️</Box>, <Box key="2" sx={{ color: '#f44336' }}>🔩</Box>] },
                                             { name: 'Endodontics', chips: [], icons: [<EndoIcon key="1" />, <EndoIcon key="2" filled />] },
                                             { name: 'Diagnostic', chips: [], icons: [<Box key="1" onClick={() => setActiveChecklistPopup('Comprehensive exam')} sx={{ cursor: 'pointer' }}><DentureIconSmall color="#ef9a9a" /></Box>] },
                                             { name: 'Orthodontic', chips: ['IPR', 'Ort', 'Deb', 'Inv'], icons: [<BracesIconSmall key="1" />] },
                                             { name: 'Periodontics', chips: ['Ext', 'Res', 'TSP'], icons: [<Box key="1" sx={{ width: 4, height: 14, bgcolor: '#f44336' }} />, <Box key="2" sx={{ width: 4, height: 14, bgcolor: '#4caf50' }} />] },
                                             { name: 'Occlusion', chips: ['Bot'], icons: [<Box key="1" sx={{ px: 0.5, bgcolor: '#e8f5e9', fontSize: '0.6rem', border: '1px solid #4caf50', color: '#2e7d32' }}>DEP</Box>] },
                                             { name: 'Restorative-Adhesive', chips: [], icons: [<Box key="1" sx={{ color: '#2196f3' }}>🧪</Box>] },
                                             { name: 'Oral Surgery', chips: ['EXT'], icons: [<svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2"><path d="M12 2L15 5L12 8L9 5L12 2Z" /><path d="M12 8V22" /></svg>] },
                                             { name: 'Prosthodontics', chips: ['EZ'], icons: [<DentureIconSmall key="1" color="#9c27b0" />, <DentureIconSmall key="2" color="#ffecb3" />] },
                                           ].map((row, idx) => (
                                             <Box key={idx} sx={{ 
                                               display: 'flex', 
                                               alignItems: 'center', 
                                               p: 0.8, 
                                               borderBottom: idx === 12 ? 'none' : '1px solid #b4c7e7',
                                               opacity: row.name === 'Diagnostic' ? 1 : 0.4,
                                               pointerEvents: row.name === 'Diagnostic' ? 'auto' : 'none',
                                               '&:hover': { bgcolor: row.name === 'Diagnostic' ? '#f8f9fa' : 'transparent' }
                                             }}>
                                               <Typography 
                                                 onClick={() => {
                                                   if (row.name === 'Diagnostic') {
                                                     setActiveChecklistPopup('Comprehensive exam');
                                                   }
                                                 }}
                                                 sx={{ 
                                                   fontSize: '0.72rem', 
                                                   color: '#000', 
                                                   textDecoration: 'underline', 
                                                   width: '115px', 
                                                   flexShrink: 0,
                                                   cursor: row.name === 'Diagnostic' ? 'pointer' : 'default',
                                                   fontWeight: 500
                                                 }}
                                               >
                                                 {row.name}
                                               </Typography>
                                               <Stack direction="row" spacing={0.6} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                                                 {row.chips.map(c => (
                                                   <Box key={c} sx={{ 
                                                     bgcolor: '#e3f2fd', 
                                                     px: 0.7, 
                                                     py: 0.2, 
                                                     borderRadius: '3px', 
                                                     fontSize: '0.62rem', 
                                                     border: '1px solid #bbdefb',
                                                     color: '#0d47a1',
                                                     fontWeight: 600
                                                   }}>
                                                     {c}
                                                   </Box>
                                                 ))}
                                                 {row.icons.map((icon, i) => (
                                                   <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                                                     {icon}
                                                   </Box>
                                                 ))}
                                               </Stack>
                                             </Box>
                                           ))}
                                         </Box>
                                       )}

                                       <Box 
                                         onClick={() => {
                                           setSelectedChecklist('Recare Checklist');
                                           setIsChecklistExpanded(!isChecklistExpanded || selectedChecklist !== 'Recare Checklist');
                                         }}
                                         sx={{ 
                                           bgcolor: '#dae8fc', 
                                           p: 1.5, 
                                           borderRadius: 1, 
                                           border: selectedChecklist === 'Recare Checklist' ? '2px solid #1976d2' : '1px solid #b4c7e7',
                                           cursor: 'pointer',
                                           boxShadow: selectedChecklist === 'Recare Checklist' ? '0 0 8px rgba(25, 118, 210, 0.2)' : 'none',
                                           '&:hover': { bgcolor: '#c3d9f9' }
                                         }}
                                       >
                                         <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Recare Checklist</Typography>
                                       </Box>

                                       {isChecklistExpanded && selectedChecklist === 'Recare Checklist' && (
                                         <Box sx={{ border: '1px solid #b4c7e7', borderRadius: 1, bgcolor: '#fff', mt: 1, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                           {[
                                             { name: 'Hygiene', chips: ['FMD', 'Las', 'LBR'], icons: [<Box key="1" sx={{ color: '#9c27b0' }}>🧪</Box>, <Box key="2" sx={{ color: '#4caf50' }}>🪥</Box>] },
                                             { name: 'Preventative', chips: ['Whi', 'Cur'], icons: [<Box key="1" sx={{ transform: 'rotate(-45deg)' }}>🖌️</Box>, <EndoIcon key="2" />] },
                                             { name: 'Anesthetic', chips: ['Nit', 'Nit'], icons: [<Box key="1" sx={{ color: '#666' }}>💉</Box>] },
                                             { name: 'Restorative', chips: ['Exa'], icons: [<Box key="1" sx={{ color: '#333' }}>🧪</Box>, <Box key="2" sx={{ transform: 'rotate(45deg)' }}>💨</Box>] },
                                           ].map((row, idx) => (
                                             <Box key={idx} sx={{ 
                                               display: 'flex', 
                                               alignItems: 'center', 
                                               p: 0.8, 
                                               borderBottom: idx === 3 ? 'none' : '1px solid #b4c7e7',
                                               '&:hover': { bgcolor: '#f8f9fa' }
                                             }}>
                                               <Typography sx={{ 
                                                 fontSize: '0.72rem', 
                                                 color: '#000', 
                                                 textDecoration: 'underline', 
                                                 width: '115px', 
                                                 flexShrink: 0,
                                                 cursor: 'pointer',
                                                 fontWeight: 500
                                               }}>
                                                 {row.name}
                                               </Typography>
                                               <Stack direction="row" spacing={0.6} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                                                 {row.chips.map(c => (
                                                   <Box key={c} sx={{ 
                                                     bgcolor: '#e3f2fd', 
                                                     px: 0.7, 
                                                     py: 0.2, 
                                                     borderRadius: '3px', 
                                                     fontSize: '0.62rem', 
                                                     border: '1px solid #bbdefb',
                                                     color: '#0d47a1',
                                                     fontWeight: 600
                                                   }}>
                                                     {c}
                                                   </Box>
                                                 ))}
                                                 {row.icons.map((icon, i) => (
                                                   <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                                                     {icon}
                                                   </Box>
                                                 ))}
                                               </Stack>
                                             </Box>
                                           ))}
                                         </Box>
                                       )}
                                     </Stack>
                                   </Box>

                                   {/* Right side: Generate Button & Chart */}
                                   <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

                                      {/* View Selectors */}
                                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3, width: '100%' }}>
                                        {['Chart View', 'Pano/FMX', 'Repose/Smile', 'Occlusals', 'Perio view', 'Other'].map((lbl) => {
                                          const isDisabled = lbl !== 'Chart View';
                                          return (
                                          <Button 
                                            key={lbl} variant="outlined" size="small"
                                            onClick={() => setExamView(lbl)}
                                            disabled={isDisabled}
                                            sx={{ 
                                              textTransform: 'none', fontSize: '0.7rem', 
                                              borderColor: examView === lbl ? '#ccae81' : '#ccc',
                                              bgcolor: examView === lbl ? '#ccae81' : 'transparent',
                                              color: examView === lbl ? 'white' : '#666',
                                              '&:hover': { bgcolor: examView === lbl ? '#b79a6d' : '#f5f5f5' },
                                              '&.Mui-disabled': {
                                                opacity: 0.5,
                                                borderColor: '#ccc',
                                                color: '#666'
                                              }
                                            }}
                                          >
                                            {lbl}
                                          </Button>
                                          );
                                        })}
                                      </Stack>

                                      {/* Exam View Content Container with stable height to prevent jumping */}
                                      <Box sx={{ minHeight: 320, width: '100%' }}>
                                        <input 
                                          type="file" 
                                          ref={panoInputRef} 
                                          style={{ display: 'none' }} 
                                          accept="image/*"
                                          onChange={handlePanoFileChange}
                                        />
                                        {examView === 'Chart View' ? (
                                          <Box sx={{ bgcolor: '#fff', p: 2, border: '1px solid #eee', borderRadius: 1, width: '100%', position: 'relative' }}>
                                            <InteractiveToothChart
                                              selectedTeeth={progressSelectedTeeth}
                                              onToothClick={(num) => {
                                                setProgressSelectedTeeth(prev =>
                                                  prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
                                                );
                                              }}
                                            />
                                          </Box>
                                        ) : examView === 'Pano/FMX' ? (
                                          <Box sx={{ width: '100%', p: 2, bgcolor: '#fff', border: '1px solid #eee', borderRadius: 1 }}>
                                            <Stack spacing={4} sx={{ width: '100%' }}>
                                              {/* Top Row Group */}
                                              <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between" sx={{ width: '100%' }}>
                                                <Stack direction="row" spacing={2}>
                                                  <MountBox id="12" width={110} height={110} />
                                                  <MountBox id="11" width={110} height={110} />
                                                </Stack>
                                                <Stack direction="row" spacing={2}>
                                                  <MountBox id="3" width={85} height={150} />
                                                  <MountBox id="2" width={85} height={150} />
                                                  <MountBox id="1" width={85} height={150} />
                                                </Stack>
                                                <MountBox id="7" width={140} height={110} />
                                              </Stack>

                                              {/* Middle Row Group */}
                                              <Stack direction="row" spacing={2} sx={{ pl: '12%' }}>
                                                <MountBox id="18" width={110} height={110} />
                                                <MountBox id="17" width={110} height={110} />
                                              </Stack>

                                              {/* Bottom Row Group */}
                                              <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between" sx={{ width: '100%' }}>
                                                <Stack direction="row" spacing={2}>
                                                  <MountBox id="10" width={110} height={110} />
                                                  <MountBox id="9" width={110} height={110} />
                                                </Stack>
                                                <Stack direction="row" spacing={2}>
                                                  <MountBox id="4" width={85} height={150} />
                                                  <MountBox id="5" width={85} height={150} />
                                                  <MountBox id="6" width={85} height={150} />
                                                </Stack>
                                                <MountBox id="13" width={140} height={110} />
                                              </Stack>
                                            </Stack>
                                          </Box>
                                        ) : (
                                          <Box sx={{ width: '100%', p: 4, textAlign: 'center', color: '#999', border: '1px solid #eee', borderRadius: 1 }}>
                                            {examView} details coming soon...
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Procedure Checklist Editor */}
                                      <Box sx={{ width: '100%', mt: 4 }}>
                                        <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {selectedChecklist}
                                        </Typography>
                                        <Box sx={{ border: '1px solid #b4c7e7', borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
                                          {/* Toolbar */}
                                          <Box sx={{ bgcolor: '#f0f2f5', p: 1, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #b4c7e7', flexWrap: 'wrap' }}>
                                            <Stack direction="row" spacing={0.5}>
                                              <IconButton size="small" onClick={() => handleFormat('undo')}><UndoIcon fontSize="small" /></IconButton>
                                              <IconButton size="small" onClick={() => handleFormat('redo')}><RedoIcon fontSize="small" /></IconButton>
                                            </Stack>
                                            <Box sx={{ width: '1px', height: '20px', bgcolor: '#ccc' }} />
                                            <Stack direction="row" spacing={0.5}>
                                              <IconButton 
                                                size="small" 
                                                onClick={() => handleFormat('bold')}
                                                sx={{ bgcolor: formatState.bold ? '#e0e0e0' : 'transparent', borderRadius: 1 }}
                                              >
                                                <FormatBoldIcon fontSize="small" color={formatState.bold ? 'primary' : 'inherit'} />
                                              </IconButton>
                                              <IconButton 
                                                size="small" 
                                                onClick={() => handleFormat('italic')}
                                                sx={{ bgcolor: formatState.italic ? '#e0e0e0' : 'transparent', borderRadius: 1 }}
                                              >
                                                <FormatItalicIcon fontSize="small" color={formatState.italic ? 'primary' : 'inherit'} />
                                              </IconButton>
                                            </Stack>
                                            <Box sx={{ width: '1px', height: '20px', bgcolor: '#ccc' }} />
                                            <Stack direction="row" spacing={0.5}>
                                              <IconButton 
                                                size="small" 
                                                onClick={() => handleFormat('justifyLeft')}
                                                sx={{ bgcolor: formatState.align === 'left' ? '#e0e0e0' : 'transparent', borderRadius: 1 }}
                                              >
                                                <FormatAlignLeftIcon fontSize="small" color={formatState.align === 'left' ? 'primary' : 'inherit'} />
                                              </IconButton>
                                              <IconButton 
                                                size="small" 
                                                onClick={() => handleFormat('justifyCenter')}
                                                sx={{ bgcolor: formatState.align === 'center' ? '#e0e0e0' : 'transparent', borderRadius: 1 }}
                                              >
                                                <FormatAlignCenterIcon fontSize="small" color={formatState.align === 'center' ? 'primary' : 'inherit'} />
                                              </IconButton>
                                              <IconButton 
                                                size="small" 
                                                onClick={() => handleFormat('justifyRight')}
                                                sx={{ bgcolor: formatState.align === 'right' ? '#e0e0e0' : 'transparent', borderRadius: 1 }}
                                              >
                                                <FormatAlignRightIcon fontSize="small" color={formatState.align === 'right' ? 'primary' : 'inherit'} />
                                              </IconButton>
                                            </Stack>
                                            <Box sx={{ width: '1px', height: '20px', bgcolor: '#ccc' }} />
                                            
                                            <Select 
                                              size="small" defaultValue="p" sx={{ height: 28, fontSize: '0.75rem', minWidth: 100, bgcolor: 'white' }}
                                              onChange={(e) => handleFormat('formatBlock', e.target.value)}
                                            >
                                              <MenuItem value="p">Paragraph</MenuItem>
                                              <MenuItem value="h1">Heading 1</MenuItem>
                                              <MenuItem value="h2">Heading 2</MenuItem>
                                              <MenuItem value="h3">Heading 3</MenuItem>
                                              <MenuItem value="h4">Heading 4</MenuItem>
                                              <MenuItem value="pre">Preformatted</MenuItem>
                                            </Select>
                                            
                                            <Select 
                                              size="small" defaultValue="2" sx={{ height: 28, fontSize: '0.75rem', minWidth: 70, bgcolor: 'white' }}
                                              onChange={(e) => handleFormat('fontSize', e.target.value)}
                                            >
                                              <MenuItem value="1">8pt</MenuItem>
                                              <MenuItem value="1.5">9pt</MenuItem>
                                              <MenuItem value="2">10pt</MenuItem>
                                              <MenuItem value="3">12pt</MenuItem>
                                              <MenuItem value="4">14pt</MenuItem>
                                              <MenuItem value="5">18pt</MenuItem>
                                            </Select>
                                            
                                            <Select 
                                              size="small" defaultValue="Lato" sx={{ height: 28, fontSize: '0.75rem', minWidth: 100, bgcolor: 'white' }}
                                              onChange={(e) => handleFormat('fontName', e.target.value)}
                                            >
                                              <MenuItem value="Lato">Lato</MenuItem>
                                              <MenuItem value="Arial">Arial</MenuItem>
                                              <MenuItem value="Inter">Inter</MenuItem>
                                            </Select>

                                            <Box sx={{ width: '1px', height: '20px', bgcolor: '#ccc' }} />
                                            <IconButton size="small" onClick={(e) => setTextColorAnchor(e.currentTarget)}>
                                              <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, borderBottom: '2px solid red' }}>A</Typography>
                                            </IconButton>
                                            
                                            <Popover 
                                              open={Boolean(textColorAnchor)} 
                                              anchorEl={textColorAnchor} 
                                              onClose={() => setTextColorAnchor(null)}
                                              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                            >
                                              <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5 }}>
                                                {standardColors.map(c => (
                                                  <Box 
                                                    key={c} 
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => { handleFormat('foreColor', c); setTextColorAnchor(null); }} 
                                                    sx={{ width: 20, height: 20, bgcolor: c, cursor: 'pointer', border: '1px solid #eee', '&:hover': { border: '1px solid #000' } }} 
                                                  />
                                                ))}
                                              </Box>
                                            </Popover>

                                            <IconButton size="small" onClick={() => insertEmoji('😊')}><SentimentSatisfiedAltIcon fontSize="small" /></IconButton>
                                            
                                            <Box sx={{ width: '1px', height: '20px', bgcolor: '#ccc' }} />
                                            <IconButton size="small"><MicIcon fontSize="small" /></IconButton>
                                            <IconButton size="small"><AccessTimeIcon fontSize="small" /></IconButton>
                                          </Box>
                                          
                                          {/* Editor Area */}
                                          <Box 
                                            ref={editorRef}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                                            sx={{ 
                                              p: 2, minHeight: 200, outline: 'none', 
                                              '&:empty:before': { content: '"Type clinical notes here..."', color: '#999', fontStyle: 'italic' } 
                                            }} 
                                          />
                                        </Box>
                                        
                                        {/* Editor Footer Buttons */}
                                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                                          <Button 
                                            variant="contained" size="small"
                                            onClick={() => { if(editorRef.current) editorRef.current.innerHTML = ''; setEditorContent(''); }}
                                            sx={{ 
                                              bgcolor: '#e4a5a2', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600,
                                              '&:hover': { bgcolor: '#d18f8c' }, boxShadow: 'none'
                                            }}
                                          >
                                            Clear Note
                                          </Button>
                                          <Button 
                                            variant="contained" size="small"
                                            onClick={() => {
                                              // Save locally first for immediate feedback
                                              setNotes(notes.map(n => n.id === note.id ? { ...n, description: editorContent } : n));
                                              setIsAmending(null);
                                              if (editorRef.current) {
                                                editorRef.current.innerHTML = '';
                                                setEditorContent('');
                                              }
                                              // Then attempt API save in background
                                              if (note.id && selectedPatientId) {
                                                updateNoteMutation.mutate(
                                                  { id: note.id, data: { description: editorContent } }
                                                );
                                              }
                                            }}
                                            sx={{ 
                                              bgcolor: '#ccae81', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600,
                                              '&:hover': { bgcolor: '#b79a6d' }, boxShadow: 'none'
                                            }}
                                          >
                                            Done
                                          </Button>
                                        </Stack>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                                </Box>
                              </Box>
                            )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- Dialogs --- */}
      <Dialog open={openNoteDialog} onClose={() => setOpenNoteDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Progress Note</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select value={newNote.category} label="Category" onChange={(e) => setNewNote({...newNote, category: e.target.value})}>
              {noteCategories.map(c => <MenuItem key={c.label} value={c.label}>{c.label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Description" multiline rows={3} fullWidth value={newNote.description} onChange={(e) => setNewNote({...newNote, description: e.target.value})} />
        </DialogContent>
        <DialogActions><Button onClick={handleAddNote} variant="contained" sx={{ bgcolor: '#2e3b84' }}>Save</Button></DialogActions>
      </Dialog>

      <Dialog open={openProcDialog} onClose={() => setOpenProcDialog(false)} maxWidth="md" fullWidth>
        <Box sx={{ bgcolor: '#5b84c1', p: 1.5, textAlign: 'center' }}>
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>
            Display Completed Procedures
          </Typography>
        </Box>
        <DialogContent sx={{ p: 2 }}>
          <TableContainer component={Box} sx={{ borderBottom: '1px solid #eee', mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <input type="checkbox" onChange={(e) => {
                        setCompletedProcedures(completedProcedures.map(p => ({ ...p, selected: e.target.checked })));
                      }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>All</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Code ⇅</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Procedure</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Tooth# ⇅</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>ProcedureType</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedProcedures.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell padding="checkbox">
                      <input type="checkbox" checked={proc.selected} onChange={() => {
                        setCompletedProcedures(completedProcedures.map(p => p.id === proc.id ? { ...p, selected: !p.selected } : p));
                      }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{proc.code}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{proc.procedure}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{proc.tooth}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{proc.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Button 
            variant="contained" size="small"
            sx={{ 
              bgcolor: '#5b84c1', textTransform: 'none', px: 2, 
              '&:hover': { bgcolor: '#4a6fa5' }, boxShadow: 'none'
            }}
          >
            Add More
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            onClick={() => {
              const selected = completedProcedures.filter(p => p.selected).map(p => `${p.code} - ${p.procedure}`);
              setNotes(notes.map(n => n.id === activeNoteId ? { ...n, procedures: [...n.procedures, ...selected] } : n));
              setOpenProcDialog(false);
            }} 
            variant="contained"
            sx={{ 
              bgcolor: '#ccae81', textTransform: 'none', px: 4, fontWeight: 600,
              '&:hover': { bgcolor: '#b79a6d' }, boxShadow: 'none'
            }}
          >
            Save
          </Button>
          <Button 
            onClick={() => setOpenProcDialog(false)} 
            variant="contained"
            sx={{ 
              bgcolor: '#a0a0a0', textTransform: 'none', px: 4, fontWeight: 600,
              '&:hover': { bgcolor: '#8e8e8e' }, boxShadow: 'none'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmNewNote} onClose={() => setConfirmNewNote(null)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography sx={{ fontSize: '1rem', mb: 3 }}>
            Are you sure you want to continue and create a new one?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={handleConfirmNewNote} sx={{ bgcolor: '#5b84c1', '&:hover': { bgcolor: '#4a6fa5' } }}>Yes</Button>
            <Button variant="contained" onClick={() => setConfirmNewNote(null)} sx={{ bgcolor: '#a0a0a0', '&:hover': { bgcolor: '#8e8e8e' } }}>No</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={!!activeChecklistPopup} onClose={() => setActiveChecklistPopup(null)} maxWidth="sm" fullWidth>
        <Box sx={{ bgcolor: '#5b84c1', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1rem', flex: 1, textAlign: 'center' }}>
            Generate note from checklist
          </Typography>
        </Box>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>{activeChecklistPopup}</Typography>
              <Typography 
                onClick={() => {
                  const allChecked = Object.values(checklistFindings).every(v => v);
                  const newState = {};
                  Object.keys(checklistFindings).forEach(k => newState[k] = !allChecked);
                  setChecklistFindings(newState);
                }}
                sx={{ color: '#1976d2', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Select/Deselect All
              </Typography>
            </Stack>
            
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <input type="checkbox" checked={checklistFindings.generatedNotes} onChange={e => setChecklistFindings({...checklistFindings, generatedNotes: e.target.checked})} />
                <Typography sx={{ fontSize: '0.9rem' }}>1 - Generated Exam notes</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <input type="checkbox" checked={checklistFindings.identifiedFindings} onChange={e => setChecklistFindings({...checklistFindings, identifiedFindings: e.target.checked})} />
                <Typography sx={{ fontSize: '0.9rem' }}>2 - Identified findings</Typography>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ pl: 4 }}>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.bleedingPoints} onChange={e => setChecklistFindings({...checklistFindings, bleedingPoints: e.target.checked})} /> bleeding points</label>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.questionableRestorations} onChange={e => setChecklistFindings({...checklistFindings, questionableRestorations: e.target.checked})} /> questionable restorations</label>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.bruxism} onChange={e => setChecklistFindings({...checklistFindings, bruxism: e.target.checked})} /> bruxism</label>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <input type="checkbox" checked={checklistFindings.analysisRequired} onChange={e => setChecklistFindings({...checklistFindings, analysisRequired: e.target.checked})} />
                <Typography sx={{ fontSize: '0.9rem' }}>3 - Further analysis required</Typography>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ pl: 4 }}>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.analysisYes} onChange={e => setChecklistFindings({...checklistFindings, analysisYes: e.target.checked})} /> yes</label>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.analysisNo} onChange={e => setChecklistFindings({...checklistFindings, analysisNo: e.target.checked})} /> no</label>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <input type="checkbox" checked={checklistFindings.nv} onChange={e => setChecklistFindings({...checklistFindings, nv: e.target.checked})} />
                <Typography sx={{ fontSize: '0.9rem' }}>4 - NV:</Typography>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ pl: 4 }}>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.recare} onChange={e => setChecklistFindings({...checklistFindings, recare: e.target.checked})} /> Recare</label>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.txPlanned} onChange={e => setChecklistFindings({...checklistFindings, txPlanned: e.target.checked})} /> Tx planned</label>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <input type="checkbox" checked={checklistFindings.provider} onChange={e => setChecklistFindings({...checklistFindings, provider: e.target.checked})} />
                <Typography sx={{ fontSize: '0.9rem' }}>5 - -</Typography>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ pl: 4 }}>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.dentistJohnSmith} onChange={e => setChecklistFindings({...checklistFindings, dentistJohnSmith: e.target.checked})} /> Dentist John Smith</label>
                <label style={{ fontSize: '0.85rem' }}><input type="checkbox" checked={checklistFindings.assistantJolene} onChange={e => setChecklistFindings({...checklistFindings, assistantJolene: e.target.checked})} /> Assistant Jolene</label>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            onClick={() => {
              // Generate text and insert into editor
              let generatedText = "<p><strong>Comprehensive Exam:</strong></p><ul>";
              if (checklistFindings.generatedNotes) {
                generatedText += "<li>Generated Exam notes</li>";
              }
              if (checklistFindings.identifiedFindings) {
                let sub = [];
                if (checklistFindings.bleedingPoints) sub.push("bleeding points");
                if (checklistFindings.questionableRestorations) sub.push("questionable restorations");
                if (checklistFindings.bruxism) sub.push("bruxism");
                generatedText += "<li>Identified findings" + (sub.length ? ": " + sub.join(", ") : "") + "</li>";
              }
              if (checklistFindings.analysisRequired) {
                let sub = [];
                if (checklistFindings.analysisYes) sub.push("yes");
                if (checklistFindings.analysisNo) sub.push("no");
                generatedText += "<li>Further analysis required" + (sub.length ? ": " + sub.join(", ") : "") + "</li>";
              }
              if (checklistFindings.nv) {
                let sub = [];
                if (checklistFindings.recare) sub.push("Recare");
                if (checklistFindings.txPlanned) sub.push("Tx planned");
                generatedText += "<li>NV" + (sub.length ? ": " + sub.join(", ") : "") + "</li>";
              }
              if (checklistFindings.provider) {
                let sub = [];
                if (checklistFindings.dentistJohnSmith) sub.push("Dentist John Smith");
                if (checklistFindings.assistantJolene) sub.push("Assistant Jolene");
                if (sub.length) {
                  generatedText += "<li>Providers: " + sub.join(", ") + "</li>";
                }
              }
              generatedText += "</ul>";
              
              if (editorRef.current) {
                editorRef.current.innerHTML += generatedText;
                setEditorContent(editorRef.current.innerHTML);
              }
              setActiveChecklistPopup(null);
            }} 
            variant="contained"
            sx={{ bgcolor: '#ccae81', textTransform: 'none', px: 3, fontWeight: 600, '&:hover': { bgcolor: '#b79a6d' }, boxShadow: 'none' }}
          >
            Generate
          </Button>
          <Button 
            onClick={() => setActiveChecklistPopup(null)} 
            variant="contained"
            sx={{ bgcolor: '#a0a0a0', textTransform: 'none', px: 3, fontWeight: 600, '&:hover': { bgcolor: '#8e8e8e' }, boxShadow: 'none' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default ProgressNotesPage;
