import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Chip, Button, Stack, Divider, Grid,
  Dialog, IconButton, TextField, CircularProgress, Alert
} from "@mui/material";
import {
  CalendarMonth,
  Add as AddIcon,
  KeyboardDoubleArrowUp,
  VisibilityOutlined,
  ElectricBolt
} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import {
  GeneralToothSurvey,
  CoronalToothStructure,
  RadicularToothStructure,
  SupportingStructure,
  Tooth,
  ToothNumber,
  SelectToothDialog
} from "../../components/radiographic";
import InteractiveToothChart from '../../components/clinical/InteractiveToothChart';
import { fontSize, fontWeight } from "../../constants/styles";
import { Popover } from "@mui/material";
import { selectSelectedPatientId } from '../../store/slices/patientSlice';
import { selectSelectedAppointmentId } from '../../store/slices/appointmentSlice';
import {
  useClinicalExamQuery,
  useUpsertClinicalExam,
  useSignClinicalExam
} from '../../hooks/queries/useClinicalExam';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";

const Radiographic = () => {
  const { showSnackbar } = useSnackbar();
  const patientId = useSelector(selectSelectedPatientId);
  const appointmentId = useSelector(selectSelectedAppointmentId);
  const providerId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('radiographic', appointmentId);
  const upsertMutation = useUpsertClinicalExam('radiographic', appointmentId);
  const signMutation = useSignClinicalExam('radiographic', appointmentId);

  const isSigned = !!examRecord?.isSigned;

  const sessionState = useSelector(state => state.clinicalExamSession.exam.radiographic);
  const dispatch = useDispatch();

  const selectedTeeth = sessionState?.selectedTeeth || [];
  const setSelectedTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(selectedTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'radiographic', data: { selectedTeeth: newVal } } });
  };

  const missingTeeth = sessionState?.missingTeeth || [];
  const setMissingTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(missingTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'radiographic', data: { missingTeeth: newVal } } });
  };

  const toothFindings = sessionState?.toothFindings || {};
  const setToothFindings = (val) => {
    const newVal = typeof val === 'function' ? val(toothFindings) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'radiographic', data: { toothFindings: newVal } } });
  };

  const additionalTeeth = sessionState?.additionalTeeth || [];
  const setAdditionalTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(additionalTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'radiographic', data: { additionalTeeth: newVal } } });
  };

  const [activeToothNum, setActiveToothNum] = React.useState(null);
  const [detailModalTooth, setDetailModalTooth] = React.useState(null);
  const [newNoteText, setNewNoteText] = React.useState('');
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Sync data from database to form state when loaded
  useEffect(() => {
    if (examRecord?.examData) {
      setSelectedTeeth(examRecord.examData.selectedTeeth || []);
      setMissingTeeth(examRecord.examData.missingTeeth || []);
      setToothFindings(examRecord.examData.toothFindings || {});
      setAdditionalTeeth(examRecord.examData.additionalTeeth || []);
    }
  }, [examRecord]);

  const handleSaveExam = async () => {
    if (!appointmentId) {
      showSnackbar('No active appointment selected', 'error');
      return;
    }
    try {
      await upsertMutation.mutateAsync({
        patientId: patientId ? String(patientId) : undefined,
        providerId: providerId ? String(providerId) : undefined,
        examData: {
          selectedTeeth,
          missingTeeth,
          toothFindings,
          additionalTeeth
        }
      });
      showSnackbar('Radiographic exam saved successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to save exam', 'error');
    }
  };

  const handleSignExam = () => {
    if (!appointmentId) {
      showSnackbar('No active appointment selected', 'error');
      return;
    }
    setSignDialogOpen(true);
  };

  const handleConfirmSign = async () => {
    setSignDialogOpen(false);
    try {
      await signMutation.mutateAsync();
      showSnackbar('Radiographic exam signed and locked', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to sign exam', 'error');
    }
  };

  // Additional Teeth selection states
  const [additionalTeethAnchorEl, setAdditionalTeethAnchorEl] = React.useState(null);
  const [showSelectToothDialog, setShowSelectToothDialog] = React.useState(false);

  const handleToothClick = (num) => {
    // If the tooth has findings, open the details modal
    if (toothFindings[num]) {
      setDetailModalTooth(num);
      setActiveToothNum(num);
      return;
    }
    
    setSelectedTeeth(prev => 
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
  };

  const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const LOWER_TEETH = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  const handleMaxToggle = () => {
    const allUpperSelected = UPPER_TEETH.every(t => selectedTeeth.includes(t));
    setSelectedTeeth(prev => allUpperSelected ? prev.filter(t => !UPPER_TEETH.includes(t)) : [...new Set([...prev, ...UPPER_TEETH])]);
  };

  const handleManToggle = () => {
    const allLowerSelected = LOWER_TEETH.every(t => selectedTeeth.includes(t));
    setSelectedTeeth(prev => allLowerSelected ? prev.filter(t => !LOWER_TEETH.includes(t)) : [...new Set([...prev, ...LOWER_TEETH])]);
  };

  const handleMarkMissing = () => {
    if (selectedTeeth.length === 0) return;
    setMissingTeeth(prev => {
      const allSelectedAreMissing = selectedTeeth.every(t => prev.includes(t));
      if (allSelectedAreMissing) {
        return prev.filter(t => !selectedTeeth.includes(t));
      } else {
        return [...new Set([...prev, ...selectedTeeth])];
      }
    });
    setSelectedTeeth([]);
  };

  const handleAddNewNote = () => {
    if (!newNoteText.trim() || detailModalTooth === null) return;
    
    setToothFindings(prev => {
      const updated = { ...prev };
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      
      const existingNotes = updated[detailModalTooth]?.notes || [];
      updated[detailModalTooth] = {
        ...updated[detailModalTooth],
        notes: [...existingNotes, { date: today, text: newNoteText }]
      };
      return updated;
    });
    
    setNewNoteText('');
  };

  const handleSidebarSurfaceClick = (surfaceLabel) => {
    const activeTeeth = selectedTeeth.length > 0 ? selectedTeeth : (activeToothNum ? [activeToothNum] : []);
    if (activeTeeth.length === 0) return;

    let mappedSurfaces = [];
    if (surfaceLabel === 'MO') mappedSurfaces = ['M', 'O/I'];
    else if (surfaceLabel === 'DO') mappedSurfaces = ['D', 'O/I'];
    else if (surfaceLabel === 'MOD') mappedSurfaces = ['M', 'O/I', 'D'];
    else mappedSurfaces = [surfaceLabel];

    setToothFindings(prev => {
      const updated = { ...prev };
      activeTeeth.forEach(num => {
        if (!updated[num]) {
          updated[num] = {
            findings: ['Coronal radiolucency'],
            surfaces: mappedSurfaces,
            depth: 'Limited to enamel',
            notes: []
          };
        } else {
          updated[num] = {
            ...updated[num],
            surfaces: mappedSurfaces
          };
        }
      });
      return updated;
    });
  };

  // State for managing section collapse/expand
  const [expandedSections, setExpandedSections] = React.useState({
    generalToothSurvey: true,
    coronalToothStructure: true,
    radicularToothStructure: true,
    supportingStructure: true
  });

  // State for visit dates timeline
  const [visitDates, setVisitDates] = useState([
    'Sep 29, 2023',
    'Apr 26, 2024',
    'Jul 03, 2024'
  ]);

  // Toggle function for sections
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Handle new exam
  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setVisitDates([...visitDates, today]);
  };

  // Handle delete exam
  const handleDeleteExam = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    console.log('Delete exam');
    showSnackbar('Radiographic exam deleted', 'info');
  };

  // Handle remove date from timeline
  const handleRemoveDate = (indexToRemove) => {
    setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  if (examLoading) {
    return (
      <Box>
        <ClinicalNavbar />
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
            Exam
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
            Patient examination records and clinical findings
          </Typography>
        </Box>
        <ExamNavbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Exam
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Patient examination records and clinical findings
        </Typography>
      </Box>
      <ExamNavbar />
      
      {/* Timeline and Status Section */}
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        {isSigned && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This exam has been signed and locked. It is now read-only.
          </Alert>
        )}
        
        {/* 1. Top Navigation / Timeline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, overflowX: 'auto' }}>
          <VisitDatesTimeline
            visitDates={visitDates}
            onRemoveDate={handleRemoveDate}
          />
          <Button 
            startIcon={<AddIcon />} 
            sx={{ textTransform: 'none', color: '#777', fontSize: fontSize.xs, whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={handleNewExam}
          >
            New Exam
          </Button>
        </Box>

        <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>
        {/* 2-Column Layout: Sidebar on left (30%), Image on right (50%) */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
          {/* Left Column - Sidebar (30% Width) */}
          <Box sx={{ width: '30%', flex: '0 0 30%' }}>
            <Box sx={{ width: '100%', bgcolor: "#fff", p: 0, height: 'calc(100vh - 250px)', overflowY: "auto", border: "1px solid #ccc" }}>
            
            {/* Top Filter Bar */}
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>{selectedTeeth.length > 0 ? "Unerupted" : "Erupted"} | Resolve</Typography>
              <VisibilityOutlined sx={{ fontSize: 16, color: '#1976d2', ml: 0.5 }} />
              <Box sx={{ flexGrow: 1 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>Tooth First</Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: '#ddd' }} />
              <ElectricBolt sx={{ fontSize: 16, color: '#fbc02d', ml: 0.5 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500, ml: 0.5 }}>Condition First</Typography>
            </Stack>

            {/* Section Components */}
            <GeneralToothSurvey 
              expanded={expandedSections.generalToothSurvey}
              onToggle={() => toggleSection('generalToothSurvey')}
              missingTeeth={missingTeeth}
              onMissingTeethClick={handleMarkMissing}
            />
            
            <CoronalToothStructure 
              expanded={expandedSections.coronalToothStructure}
              onToggle={() => toggleSection('coronalToothStructure')}
              toothFindings={toothFindings}
              setToothFindings={setToothFindings}
              selectedTeeth={selectedTeeth}
              setSelectedTeeth={setSelectedTeeth}
              activeToothNum={activeToothNum}
              setActiveToothNum={setActiveToothNum}
            />
            
            <RadicularToothStructure 
              expanded={expandedSections.radicularToothStructure}
              onToggle={() => toggleSection('radicularToothStructure')}
              toothFindings={toothFindings}
              setToothFindings={setToothFindings}
              selectedTeeth={selectedTeeth}
              activeToothNum={activeToothNum}
              setActiveToothNum={setActiveToothNum}
            />
            
            <SupportingStructure 
              expanded={expandedSections.supportingStructure}
              onToggle={() => toggleSection('supportingStructure')}
            />
          </Box>
        </Box>

        {/* Right Column - Tooth Chart */}
        <Grid item xs={8.5} sx={{ position: 'relative', bgcolor: '#fff', ml: 2, flexGrow: 1 }}>
          
          <InteractiveToothChart
            selectedTeeth={selectedTeeth}
            missingTeeth={missingTeeth}
            toothFindings={toothFindings}
            onToothClick={handleToothClick}
            onSidebarSurfaceClick={handleSidebarSurfaceClick}
            onMaxToggle={handleMaxToggle}
            onManToggle={handleManToggle}
            isTreatmentPlan={false}
          />

            {/* Additional Footer Controls */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 20, ml: 2 }}>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center" 
                onClick={(e) => setAdditionalTeethAnchorEl(e.currentTarget)}
                sx={{ cursor: 'pointer', color: '#6b7cb4', '&:hover': { opacity: 0.8 } }}
              >
                <AddCircleIcon fontSize="small" />
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Additional teeth</Typography>
              </Stack>
              
              {/* Badges for selected additional teeth */}
              <Stack direction="row" spacing={0.5}>
                {additionalTeeth.map(tooth => (
                  <Box
                    key={tooth}
                    sx={{
                      position: 'relative',
                      '&:hover .delete-btn': {
                        display: 'flex'
                      }
                    }}
                  >
                    <Box sx={{ 
                      px: 0.6, py: 0.1, border: '1px solid',
                      borderColor: '#4a69bd',
                      bgcolor: '#f8fafc',
                      color: '#4a69bd',
                      fontSize: '0.75rem', fontWeight: 'bold',
                      borderRadius: '2px', minWidth: '20px', textAlign: 'center',
                      userSelect: 'none'
                    }}>
                      {tooth}
                    </Box>
                    
                    <Box
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdditionalTeeth(prev => prev.filter(t => t !== tooth));
                      }}
                      sx={{
                        display: 'none',
                        position: 'absolute',
                        top: -9,
                        right: -6,
                        width: 14,
                        height: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#e74c3c',
                        fontWeight: 'bold',
                        lineHeight: 1,
                        zIndex: 10,
                        '&:hover': {
                          color: '#c0392b'
                        }
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Stack>

            {/* Popover Menu for Additional Teeth Options */}
            <Popover
              open={Boolean(additionalTeethAnchorEl)}
              anchorEl={additionalTeethAnchorEl}
              onClose={() => setAdditionalTeethAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  width: 220,
                  boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  mt: 0.5
                }
              }}
            >
              <Stack spacing={0.5} sx={{ p: 0.5 }}>
                {[
                  'Supernumerary adult teeth',
                  'Retained Primary teeth',
                  'Supernumerary primary teeth'
                ].map(opt => (
                  <Box
                    key={opt}
                    onClick={() => {
                      setAdditionalTeethAnchorEl(null);
                      setShowSelectToothDialog(true);
                    }}
                    sx={{
                      px: 1.5,
                      py: 1,
                      fontSize: '0.8rem',
                      color: '#334155',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'background-color 0.15s',
                      '&:hover': {
                        bgcolor: '#f1f5f9',
                        color: '#1976d2'
                      }
                    }}
                  >
                    {opt}
                  </Box>
                ))}
              </Stack>
            </Popover>

            {/* Dialog for selecting additional teeth */}
            <SelectToothDialog
              open={showSelectToothDialog}
              onClose={() => setShowSelectToothDialog(false)}
              selectedTeeth={additionalTeeth}
              onSelect={(tooth) => {
                setAdditionalTeeth(prev => 
                  prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth]
                );
                setShowSelectToothDialog(false);
              }}
            />
        </Grid>
      </Box>

        </fieldset>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveExam}
            disabled={isSigned}
            sx={{ textTransform: 'none', px: 3 }}
          >
            Save Exam
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSignExam}
            disabled={isSigned}
            sx={{ textTransform: 'none', px: 3 }}
          >
            Sign & Finalize
          </Button>
          <Button 
            variant="contained" 
            disabled={isSigned}
            sx={{ bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' }, textTransform: 'none' }}
            onClick={handleDeleteExam}
          >
            Delete Exam
          </Button>
        </Box>
      </Box>

    {/* Tooth Details Modal */}
    <Dialog
      open={detailModalTooth !== null}
      onClose={() => setDetailModalTooth(null)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          p: 4,
          borderRadius: '8px',
          position: 'relative',
          minHeight: '350px'
        }
      }}
    >
      <IconButton
        onClick={() => setDetailModalTooth(null)}
        sx={{ position: 'absolute', right: 8, top: 8, color: '#aaa' }}
      >
        <CloseIcon />
      </IconButton>

      {detailModalTooth !== null && toothFindings[detailModalTooth] && (
        <Grid container spacing={4}>
          {/* Left Column: Findings & Diagnosis */}
          <Grid item xs={6} sx={{ pr: 2 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#1a2735',
                borderBottom: '2px solid #0f766e',
                pb: 1,
                display: 'inline-block',
                minWidth: '150px',
                fontFamily: "'Manrope', sans-serif"
              }}
            >
              Tooth #{detailModalTooth}
            </Typography>

            <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>
              Initial Findings {toothFindings[detailModalTooth].notes?.[0]?.date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </Typography>
            
            <Box sx={{ mt: 1, pl: 1 }}>
              {toothFindings[detailModalTooth].findings.map(finding => {
                const depth = toothFindings[detailModalTooth].depth || 'Limited to enamel';
                const surfacesStr = (toothFindings[detailModalTooth].surfaces || []).map(s => s === 'O/I' ? 'O' : s).join('');
                
                // Capitalize depth
                const depthCapitalized = depth.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                
                return (
                  <Typography key={finding} sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>
                    - Caries Active {depthCapitalized}: {surfacesStr}
                  </Typography>
                );
              })}
              <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>
                - Pulpal Concern
              </Typography>
            </Box>

            <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>
              Diagnosis
            </Typography>
            <Box sx={{ mt: 1, pl: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>
                - Caries
              </Typography>
            </Box>
          </Grid>

          {/* Vertical Divider & Right Column: Notes */}
          <Grid item xs={6} sx={{ borderLeft: '1px solid #0f766e', pl: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2735', mb: 2, fontFamily: "'Manrope', sans-serif" }}>
              Notes
            </Typography>

            <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2, pr: 1 }}>
              {(toothFindings[detailModalTooth].notes || []).map((note, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>
                    {note.date}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#666', pl: 1, mt: 0.5 }}>
                    - {note.text}
                  </Typography>
                </Box>
              ))}
              {(!toothFindings[detailModalTooth].notes || toothFindings[detailModalTooth].notes.length === 0) && (
                <Typography sx={{ fontSize: '0.85rem', color: '#bbb', fontStyle: 'italic' }}>
                  No notes added yet.
                </Typography>
              )}
            </Box>

            {/* New Note input */}
            <Box sx={{ mt: 4 }}>
              <TextField
                variant="standard"
                placeholder="New Note"
                fullWidth
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewNote();
                  }
                }}
                sx={{
                  '& .MuiInput-underline:before': { borderBottomColor: '#ccc' },
                  '& .MuiInput-underline:after': { borderBottomColor: '#0f766e' },
                  '& input': { fontSize: '0.9rem', color: '#555' }
                }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={handleAddNewNote}
                sx={{ 
                  mt: 1.5, 
                  bgcolor: '#0f766e', 
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#0d5e58' }
                }}
              >
                Save Note
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Dialog>

    <ConfirmationDialog
      open={signDialogOpen}
      onClose={() => setSignDialogOpen(false)}
      onConfirm={handleConfirmSign}
      title="Sign & Lock Exam"
      message="Are you sure you want to sign and lock this exam? This action cannot be undone."
      confirmText="Sign & Lock"
      confirmColor="#0f766e"
      loading={signMutation.isPending}
    />

    <ConfirmationDialog
      open={deleteDialogOpen}
      onClose={() => setDeleteDialogOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Delete Exam Record"
      message="Are you sure you want to delete this exam? This action cannot be undone."
      confirmText="Delete"
      confirmColor="error"
    />
    </Box>
  );
};

export default Radiographic;