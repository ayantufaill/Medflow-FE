import React, { useState } from 'react';
import { 
  Box, Typography, Tabs, Tab, Button, Chip, Stack, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, 
  Select, FormControl, InputLabel, Collapse, IconButton 
} from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import PrintIcon from '@mui/icons-material/Print';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ProgressNotesPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openProcDialog, setOpenProcDialog] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [allExpanded, setAllExpanded] = useState(true);
  
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

  const filteredNotes = selectedCategory === 'All' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', "@media print": { ".no-print": { display: "none" } } }}>
      <Box className="no-print"><ClinicalNavbar /></Box>

      <Box sx={{ px: 4, py: 2 }}>
        <Box className="no-print" sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Box>
    <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }}>
      Progress Notes
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
      Patient updates and history
    </Typography>
  </Box>
  
  {/* Updated Button Styling */}
  <Button 
    variant="contained" 
    onClick={() => setOpenNoteDialog(true)} 
    size="small" 
    sx={{ 
      backgroundColor: '#2e3b84', 
      fontSize: '0.75rem', 
      textTransform: 'none',
      px: 2, 
      py: 0.5,
      minWidth: 'auto',
      height: 'fit-content',
      '&:hover': { backgroundColor: '#1e2a63' }
    }}
  >
    + New Note
  </Button>
</Box>

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
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '20%' }}>Date</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '25%' }}>Procedures</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '30%' }}>Description</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold', width: '25%' }}>Provider / Signature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotes.map((note) => (
                <React.Fragment key={note.id}>
                  <TableRow sx={{ backgroundColor: '#A9CCE3' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => handleToggleRow(note.id)}>
                          {note.isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        <Typography sx={{ fontSize: '0.8rem' }}>{note.date}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" size="small" 
                        onClick={() => handleOpenProc(note.id)}
                        sx={{ backgroundColor: '#95A5A6', textTransform: 'none', fontSize: '0.65rem', py: 0 }}
                      >
                        +Add Completed Procedures
                      </Button>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{note.description}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1D8348', fontWeight: 600 }}>{note.provider}</Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Signed by {note.signedBy}</Typography>
                          <Typography sx={{ fontSize: '0.7rem' }}>{note.signedDate}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={note.isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, ml: 10 }}>
                          {note.procedures.length > 0 ? (
                            note.procedures.map((p, i) => (
                              <Typography key={i} sx={{ fontSize: '0.75rem', color: '#666', mb: 0.5 }}>• {p}</Typography>
                            ))
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>No procedures added to this note.</Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
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
  );
};

export default ProgressNotesPage;