import React, { useState } from 'react';
import { 
  Box, Typography, Tabs, Tab, Button, Chip, Stack, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, 
  Select, FormControl, InputLabel, Collapse, IconButton, Popover
} from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
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
  const [editorContent, setEditorContent] = useState('');
  const [panoImages, setPanoImages] = useState({});
  const [activeMount, setActiveMount] = useState(null);
  const panoInputRef = React.useRef(null);
  const [textColorAnchor, setTextColorAnchor] = useState(null);
  const [formatState, setFormatState] = useState({ bold: false, italic: false, align: 'left' });
  const editorRef = React.useRef(null);

  const standardColors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  ];

  // --- Local Tooth Component for Chart ---
  const Tooth = ({ num, isActive = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <Box 
        sx={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0.2,
          cursor: 'pointer', transition: 'transform 0.1s',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Typography sx={{ fontSize: '0.8rem', color: isActive || isHovered ? '#1976d2' : '#666', fontWeight: 'bold' }}>
          {num}
        </Typography>
        <Box 
          component="img" 
          src={`/teeth${num}.png`}
          alt={`Tooth ${num}`}
          sx={{ 
            width: 35, height: 70, mt: 0.5, 
            filter: isActive || isHovered ? 'drop-shadow(0 0 8px #1976d2) brightness(1.2)' : 'none',
            objectFit: 'contain'
          }} 
        />
      </Box>
    );
  };
  
  
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
  
  const [notes, setNotes] = useState([
    {
      id: 1,
      date: '02/14/2023 1:16 PM',
      procedures: ['D0120 - Periodic Oral Evaluation', 'D1110 - Prophylaxis - Adult'],
      description: 'Patient presented for routine cleaning. Gingiva appears healthy.',
      provider: 'Christina Sabour',
      signedBy: 'C. Sabour',
      signedDate: '02/21/2023 12:17 PM',
      category: 'Recare Notes',
      isExpanded: true
    }
  ]);

  const [newNote, setNewNote] = useState({ description: '', category: 'Exam Notes', provider: 'Christina Sabour' });
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
    const note = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      procedures: [],
      ...newNote,
      signedBy: newNote.provider,
      signedDate: new Date().toLocaleString(),
      isExpanded: true
    };
    setNotes([note, ...notes]);
    setOpenNoteDialog(false);
  };

  const handleOpenProc = (id) => {
    setActiveNoteId(id);
    setOpenProcDialog(true);
  };

  const handleAddProcedure = () => {
    setNotes(notes.map(n => 
      n.id === activeNoteId ? { ...n, procedures: [...n.procedures, newProc] } : n
    ));
    setNewProc('');
    setOpenProcDialog(false);
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
          <Chip label="All" onClick={() => setSelectedCategory('All')} variant={selectedCategory === 'All' ? 'filled' : 'outlined'} />
          {noteCategories.map((cat) => (
            <Chip key={cat.label} label={cat.label} onClick={() => setSelectedCategory(cat.label)} sx={{ backgroundColor: cat.color, color: cat.textColor }} />
          ))}
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
                        {note.isExpanded && <EventNoteIcon sx={{ fontSize: '1.1rem', mr: 1, color: '#666' }} />}
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
                     <TableCell sx={{ fontSize: '0.8rem' }}>{note.description}</TableCell>
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
                            <IconButton size="small">
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
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '0.9rem' }}>
                            Notes:
                          </Typography>
                          <Box sx={{ pl: 4, mb: 4 }}>
                            <Typography variant="body2" sx={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.6 }}>
                              {note.description}
                            </Typography>
                          </Box>
                          
                          {!isAmending && (
                            <Stack direction="row" spacing={2}>
                              <Button 
                                variant="contained" 
                                size="small"
                                onClick={() => setIsAmending(note.id)}
                                sx={{ 
                                  backgroundColor: '#ccae81', 
                                  color: 'white',
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  px: 2,
                                  boxShadow: 'none',
                                  '&:hover': { backgroundColor: '#b79a6d', boxShadow: 'none' }
                                }}
                              >
                                Amend Progress Note
                              </Button>
                              <Button 
                                variant="contained" 
                                size="small"
                                disabled
                                sx={{ 
                                  backgroundColor: '#e4a5a2', 
                                  color: 'white',
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  px: 2,
                                  boxShadow: 'none',
                                  '&:hover': { backgroundColor: '#d18f8c', boxShadow: 'none' }
                                }}
                              >
                                Archive Progress Note
                              </Button>
                            </Stack>
                          )}

                          {/* --- Amendment Section (Image View) --- */}
                          {isAmending === note.id && (
                            <Box sx={{ mt: 1 }}>
                              {/* Archive Button moved below notes text but above amendment box */}
                              <Box sx={{ borderTop: '1px solid #eee', pt: 3 }}>
                                {/* Amended Note Box */}
                                <Box sx={{ border: '1px solid #ccc', p: 2, mb: 3, position: 'relative' }}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Amended note:</Typography>
                                    <Typography sx={{ fontSize: '0.85rem', color: '#5b84c1', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                      Sign Amended Note
                                    </Typography>
                                  </Stack>
                                  <Button 
                                    variant="contained" size="small"
                                    sx={{ 
                                      mt: 1, backgroundColor: '#ccae81', textTransform: 'none', 
                                      fontSize: '0.7rem', fontWeight: 600, boxShadow: 'none' 
                                    }}
                                  >
                                    Edit note
                                  </Button>
                                </Box>

                                <Button 
                                  variant="contained" 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: '#e4a5a2', 
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    px: 2,
                                    mb: 3,
                                    boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#d18f8c', boxShadow: 'none' }
                                  }}
                                >
                                  Archive Progress Note
                                </Button>

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
                                             { name: 'Diagnostic', chips: [], icons: [<DentureIconSmall key="1" color="#ef9a9a" />] },
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
                                      <Box sx={{ textAlign: 'center', mb: 2, width: '100%' }}>
                                        <Button 
                                          variant="contained" size="small"
                                          sx={{ 
                                            backgroundColor: '#ccae81', textTransform: 'none', 
                                            fontSize: '0.8rem', fontWeight: 600, boxShadow: 'none', px: 3
                                          }}
                                        >
                                          Generate Exam Notes
                                        </Button>
                                      </Box>

                                      {/* View Selectors */}
                                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3, width: '100%' }}>
                                        {['Chart View', 'Pano/FMX', 'Repose/Smile', 'Occlusals', 'Perio view', 'Other'].map((lbl) => (
                                          <Button 
                                            key={lbl} variant="outlined" size="small"
                                            onClick={() => setExamView(lbl)}
                                            sx={{ 
                                              textTransform: 'none', fontSize: '0.7rem', 
                                              borderColor: examView === lbl ? '#ccae81' : '#ccc',
                                              bgcolor: examView === lbl ? '#ccae81' : 'transparent',
                                              color: examView === lbl ? 'white' : '#666',
                                              '&:hover': { bgcolor: examView === lbl ? '#b79a6d' : '#f5f5f5' }
                                            }}
                                          >
                                            {lbl}
                                          </Button>
                                        ))}
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
                                          <Box sx={{ bgcolor: '#fff', p: 2, border: '1px solid #eee', borderRadius: 1, width: '100%' }}>
                                            {/* Maxillary */}
                                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(n => (
                                                <Tooth key={n} num={n} />
                                              ))}
                                            </Stack>
                                            {/* Mandibular */}
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                              {[32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17].map(n => (
                                                <Tooth key={n} num={n} />
                                              ))}
                                            </Stack>
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
                                            onClick={() => alert('Note Saved: ' + editorContent)}
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

      <Dialog open={openProcDialog} onClose={() => setOpenProcDialog(false)}>
        <DialogTitle>Add Completed Procedure</DialogTitle>
        <DialogContent>
          <TextField fullWidth placeholder="e.g. D0120 - Periodic Evaluation" value={newProc} onChange={(e) => setNewProc(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddProcedure} variant="contained" sx={{ bgcolor: '#2e3b84' }}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default ProgressNotesPage;