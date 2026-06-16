import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup,
  Button, Chip, Divider, List, ListItem, ListItemText, Grid, Container,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
  CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { fontSize, fontWeight } from "../../constants/styles";
import { selectSelectedPatientId } from '../../store/slices/patientSlice';
import { selectSelectedAppointmentId } from '../../store/slices/appointmentSlice';
import {
  useClinicalExamQuery,
  useUpsertClinicalExam,
  useSignClinicalExam
} from '../../hooks/queries/useClinicalExam';
import { useSnackbar } from '../../contexts/SnackbarContext';

// Custom sidebar header component
const BlueHeader = ({ text }) => (
  <Box sx={{ bgcolor: '#4472c4', color: 'white', px: 2, py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium }}>{text}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#bcc3ce' }} />
  </Box>
);

// Hotspots mapping for the main Oral Anatomy Map (/anatomy.png)
const ANATOMY_HOTSPOTS = [
  { id: 'lip', name: 'Lip', left: '50%', top: '9%', width: '80px', height: '24px' },
  { id: 'labial_mucosa_left', name: 'Left Labial Mucosa', left: '58%', top: '17%', width: '90px', height: '24px' },
  { id: 'labial_mucosa_right', name: 'Right Labial Mucosa', left: '42%', top: '17%', width: '90px', height: '24px' },
  { id: 'vestibule_left', name: 'Left Vestibule', left: '68%', top: '38%', width: '70px', height: '24px' },
  { id: 'vestibule_right', name: 'Right Vestibule', left: '32%', top: '38%', width: '70px', height: '24px' },
  { id: 'gingiva_left', name: 'Left Upper Gingiva', left: '62%', top: '44%', width: '75px', height: '24px' },
  { id: 'gingiva_right', name: 'Right Upper Gingiva', left: '38%', top: '44%', width: '75px', height: '24px' },
  { id: 'hard_palate_left', name: 'Left Hard Palate', left: '54%', top: '39%', width: '50px', height: '24px' },
  { id: 'hard_palate_right', name: 'Right Hard Palate', left: '46%', top: '39%', width: '50px', height: '24px' },
  { id: 'soft_palate_left', name: 'Left Soft Palate', left: '54%', top: '49%', width: '50px', height: '24px' },
  { id: 'soft_palate_right', name: 'Right Soft Palate', left: '46%', top: '49%', width: '50px', height: '24px' },
  { id: 'posterior_pillar_left', name: 'Left Posterior Pillar', left: '54%', top: '61%', width: '60px', height: '24px' },
  { id: 'posterior_pillar_right', name: 'Right Posterior Pillar', left: '46%', top: '61%', width: '60px', height: '24px' },
  { id: 'anterior_pillar_left', name: 'Left Anterior Pillar', left: '58%', top: '69%', width: '60px', height: '24px' },
  { id: 'anterior_pillar_right', name: 'Right Anterior Pillar', left: '42%', top: '69%', width: '60px', height: '24px' },
  { id: 'tongue_dorsum_left', name: 'Left Tongue Dorsum', left: '53%', top: '80%', width: '50px', height: '24px' },
  { id: 'tongue_dorsum_right', name: 'Right Tongue Dorsum', left: '47%', top: '80%', width: '50px', height: '24px' },
  { id: 'lateral_tongue_left', name: 'Left Lateral Tongue', left: '58%', top: '87%', width: '60px', height: '24px' },
  { id: 'lateral_tongue_right', name: 'Right Lateral Tongue', left: '42%', top: '87%', width: '60px', height: '24px' },
  { id: 'buccal_mucosa_left', name: 'Left Buccal Mucosa', left: '77%', top: '58%', width: '90px', height: '24px' },
  { id: 'buccal_mucosa_right', name: 'Right Buccal Mucosa', left: '23%', top: '58%', width: '90px', height: '24px' },
  { id: 'commissure_left', name: 'Left Commissure', left: '77%', top: '41%', width: '80px', height: '24px' },
  { id: 'commissure_right', name: 'Right Commissure', left: '23%', top: '41%', width: '80px', height: '24px' },
];

const DentalAnatomyExamPage = () => {
  const { showSnackbar } = useSnackbar();
  const patientId = useSelector(selectSelectedPatientId);
  const appointmentId = useSelector(selectSelectedAppointmentId);
  const providerId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('head-neck', appointmentId);
  const upsertMutation = useUpsertClinicalExam('head-neck', appointmentId);
  const signMutation = useSignClinicalExam('head-neck', appointmentId);

  const isSigned = !!examRecord?.isSigned;

  const [visitDates, setVisitDates] = useState(['Sep 29, 2023', 'Jul 15, 2022']);
  const [activeTool, setActiveTool] = useState(null); // 'lesion' | 'tori' | 'exostosis' | null
  
  // Clinical findings state
  const [findings, setFindings] = useState([]);

  // Sync data from database to form state when loaded
  useEffect(() => {
    if (examRecord?.examData) {
      setFindings(examRecord.examData.findings || []);
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
        examData: { findings }
      });
      showSnackbar('Head and Neck exam saved successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to save exam', 'error');
    }
  };

  const handleSignExam = async () => {
    if (!appointmentId) {
      showSnackbar('No active appointment selected', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to sign and lock this exam? This action cannot be undone.')) {
      try {
        await signMutation.mutateAsync();
        showSnackbar('Head and Neck exam signed and locked', 'success');
      } catch (err) {
        showSnackbar(err.response?.data?.error?.message || 'Failed to sign exam', 'error');
      }
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState(null);

  // Dialog form state
  const [formState, setFormState] = useState({
    sizeAP: '',
    sizeInfSup: '',
    margins: '',
    features: '',
    colorType: '',
    colorOther: '',
    raisedType: '',
    raisedMm: '',
    texture: '',
    patientAware: '',
    howLong: '',
    growing: '',
    growingDetails: '',
    aggravates: '',
    aggravatesDetails: '',
    notes: '',
    followUpVelscope: false,
    followUpBiopsy: false,
    followUpBiopsyType: '',
    followUpHyg: false,
    followUpScreen: false,
    followUpScreenValue: '',
    followUpSpec: false,
    followUpSpecValue: '',
  });

  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setVisitDates([...visitDates, today]);
  };

  const handleRemoveDate = (indexToRemove) => {
    setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  // Click handler for hotspot label click on diagram
  const handleHotspotClick = (hotspot) => {
    if (!activeTool) return;
    
    // Set up form state for new finding
    setFormState({
      sizeAP: '',
      sizeInfSup: '',
      margins: 'Diffuse',
      features: 'Homogeneous',
      colorType: 'Normal',
      colorOther: '',
      raisedType: 'No',
      raisedMm: '',
      texture: 'Smooth',
      patientAware: 'No',
      howLong: '',
      growing: 'No',
      growingDetails: '',
      aggravates: 'No',
      aggravatesDetails: '',
      notes: '',
      followUpVelscope: false,
      followUpBiopsy: false,
      followUpBiopsyType: 'Incisional',
      followUpHyg: false,
      followUpScreen: false,
      followUpScreenValue: '',
      followUpSpec: false,
      followUpSpecValue: '',
    });

    setEditingFinding({
      type: activeTool,
      location: hotspot.name,
      isNew: true
    });
    setDialogOpen(true);
  };

  // Open existing finding for editing
  const handleEditFinding = (finding) => {
    setFormState({
      sizeAP: finding.sizeAP || '',
      sizeInfSup: finding.sizeInfSup || '',
      margins: finding.margins || '',
      features: finding.features || '',
      colorType: finding.colorType || '',
      colorOther: finding.colorOther || '',
      raisedType: finding.raisedType || '',
      raisedMm: finding.raisedMm || '',
      texture: finding.texture || '',
      patientAware: finding.patientAware || '',
      howLong: finding.howLong || '',
      growing: finding.growing || '',
      growingDetails: finding.growingDetails || '',
      aggravates: finding.aggravates || '',
      aggravatesDetails: finding.aggravatesDetails || '',
      notes: finding.notes || '',
      followUpVelscope: finding.followUpVelscope || false,
      followUpBiopsy: finding.followUpBiopsy || false,
      followUpBiopsyType: finding.followUpBiopsyType || 'Incisional',
      followUpHyg: finding.followUpHyg || false,
      followUpScreen: finding.followUpScreen || false,
      followUpScreenValue: finding.followUpScreenValue || '',
      followUpSpec: finding.followUpSpec || false,
      followUpSpecValue: finding.followUpSpecValue || '',
    });

    setEditingFinding(finding);
    setDialogOpen(true);
  };

  const handleSaveFinding = () => {
    if (editingFinding.isNew) {
      const newFinding = {
        ...formState,
        id: 'finding-' + Date.now(),
        type: editingFinding.type,
        location: editingFinding.location,
        date: new Date().toLocaleDateString('en-US')
      };
      setFindings([...findings, newFinding]);
    } else {
      setFindings(findings.map(f => f.id === editingFinding.id ? { ...f, ...formState } : f));
    }
    setDialogOpen(false);
    setEditingFinding(null);
    setActiveTool(null); // Reset tool selection
  };

  const handleDeleteFinding = (id) => {
    setFindings(findings.filter(f => f.id !== id));
    setDialogOpen(false);
    setEditingFinding(null);
  };

  const handleClearExam = () => {
    setFindings([]);
  };

  if (examLoading) {
    return (
      <Box>
        <ClinicalNavbar />
        <Box sx={{ mb: 3, px: 4, mt: 3 }}>
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
      <Box sx={{ mb: 3, px: 4, mt: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Exam
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Patient examination records and clinical findings
        </Typography>
      </Box>
      <ExamNavbar />
      
      <Container maxWidth="xl" sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        {isSigned && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This exam has been signed and locked. It is now read-only.
          </Alert>
        )}

        {/* Top Navbar / Timeline Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, overflowX: 'auto' }}>
          <VisitDatesTimeline
            visitDates={visitDates}
            onRemoveDate={handleRemoveDate}
          />
          <Button 
            startIcon={<AddIcon />} 
            sx={{ textTransform: 'none', color: '#777', ml: 2, fontSize: fontSize.xs, whiteSpace: 'nowrap', flexShrink: 0 }} 
            onClick={handleNewExam}
          >
            New Exam
          </Button>
        </Box>

        <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: Controls */}
          <Grid item sx={{ width: 280, flexShrink: 0 }}>
            
            {/* Finding Options Checkboxes */}
            <Box sx={{ display: 'flex', gap: 2, mb: 1.5, px: 1 }}>
              <FormControlLabel 
                control={<Checkbox size="small" sx={{ color: '#ccc', p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: '11px', color: '#333' }}>No Significant Findings</Typography>} 
                sx={{ m: 0 }} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" sx={{ color: '#ccc', p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: '11px', color: '#333'}}>Show Resolved Findings</Typography>} 
                sx={{ m: 0 }} 
              />
            </Box>

            {/* Left Panel Bordered Container */}
            <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 0, overflow: 'hidden', mb: 3 }}>
              
              {/* Lesions Section */}
              <BlueHeader text="Lesions" />
              <List sx={{ p: 0 }}>
                {findings.filter(f => f.type === 'lesion').map(finding => (
                  <ListItem 
                    key={finding.id} 
                    button 
                    onClick={() => handleEditFinding(finding)}
                    sx={{ py: 0.75, pl: 4, borderBottom: '1px solid #eee', '&:hover': { bgcolor: '#f5f7fa' } }}
                  >
                    <ListItemText 
                      primary={
                        <Typography sx={{ color: '#333', fontSize: fontSize.xs, fontWeight: 500 }}>
                          Lesion ({finding.location})
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
                <ListItem 
                  button 
                  onClick={() => setActiveTool(activeTool === 'lesion' ? null : 'lesion')}
                  sx={{ py: 0.75, pl: 4, bgcolor: activeTool === 'lesion' ? 'rgba(68, 114, 196, 0.1)' : 'transparent' }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#4472c4', fontSize: fontSize.xs, fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', fontWeight: activeTool === 'lesion' ? 'bold' : 'normal' }}>
                        + Add Lesion
                      </Typography>
                    } 
                  />
                </ListItem>
              </List>

              <Divider />

              {/* Bony Growth Section */}
              <BlueHeader text="Bony Growth" />
              <List sx={{ p: 0 }}>
                {findings.filter(f => f.type === 'tori').map(finding => (
                  <ListItem 
                    key={finding.id} 
                    button 
                    onClick={() => handleEditFinding(finding)}
                    sx={{ py: 0.75, pl: 4, borderBottom: '1px solid #eee', '&:hover': { bgcolor: '#f5f7fa' } }}
                  >
                    <ListItemText 
                      primary={
                        <Typography sx={{ color: '#333', fontSize: fontSize.xs, fontWeight: 500 }}>
                          Tori ({finding.location})
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
                <ListItem 
                  button 
                  onClick={() => setActiveTool(activeTool === 'tori' ? null : 'tori')}
                  sx={{ py: 0.75, pl: 4, bgcolor: activeTool === 'tori' ? 'rgba(68, 114, 196, 0.1)' : 'transparent' }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#4472c4', fontSize: fontSize.xs, fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', fontWeight: activeTool === 'tori' ? 'bold' : 'normal' }}>
                        + Add Tori
                      </Typography>
                    } 
                  />
                </ListItem>
                <Divider sx={{ ml: 4 }} />
                
                {findings.filter(f => f.type === 'exostosis').map(finding => (
                  <ListItem 
                    key={finding.id} 
                    button 
                    onClick={() => handleEditFinding(finding)}
                    sx={{ py: 0.75, pl: 4, borderBottom: '1px solid #eee', '&:hover': { bgcolor: '#f5f7fa' } }}
                  >
                    <ListItemText 
                      primary={
                        <Typography sx={{ color: '#333', fontSize: fontSize.xs, fontWeight: 500 }}>
                          Exostosis ({finding.location})
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
                <ListItem 
                  button 
                  onClick={() => setActiveTool(activeTool === 'exostosis' ? null : 'exostosis')}
                  sx={{ py: 0.75, pl: 4, bgcolor: activeTool === 'exostosis' ? 'rgba(68, 114, 196, 0.1)' : 'transparent' }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: '#4472c4', fontSize: fontSize.xs, fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', fontWeight: activeTool === 'exostosis' ? 'bold' : 'normal' }}>
                        + Add Exostosis
                      </Typography>
                    } 
                  />
                </ListItem>
              </List>

              <Divider />

              {/* Mallampati Section */}
              <Box sx={{ bgcolor: '#d9e1f2', color: '#4472c4', px: 2, py: 0.5 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Mallampati score</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <RadioGroup row sx={{ gap: 1.5, justifyContent: 'space-between' }}>
                  <FormControlLabel value="class1" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.xs, color: '#333' }}>Class I</Typography>} sx={{ m: 0 }} />
                  <FormControlLabel value="class2" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.xs, color: '#333' }}>Class II</Typography>} sx={{ m: 0 }} />
                  <FormControlLabel value="class3" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.xs, color: '#333' }}>Class III</Typography>} sx={{ m: 0 }} />
                  <FormControlLabel value="class4" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.xs, color: '#333' }}>Class IV</Typography>} sx={{ m: 0 }} />
                </RadioGroup>
              </Box>
            </Box>

            {/* Delete Button */}
            <Button 
              variant="contained" 
              onClick={handleClearExam}
              sx={{ 
                bgcolor: '#e74c3c', textTransform: 'none', px: 2, py: 0.5, fontSize: '13px', 
                '&:hover': { bgcolor: '#c0392b' }, ml: 1, borderRadius: 1 
              }}
            >
              Delete Exam
            </Button>
          </Grid>

          {/* RIGHT COLUMN: Anatomical Maps */}
          <Grid item xs sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Guide message when active tool is selected */}
            {activeTool && (
              <Box sx={{ bgcolor: '#ebf3fc', border: '1px solid #7cb5ec', p: 1, mb: 2, borderRadius: '4px', width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <HelpOutlineIcon sx={{ color: '#31708f', fontSize: '20px' }} />
                <Typography sx={{ fontSize: '13px', color: '#31708f' }}>
                  Please click on any of the text labels on the diagram to place the <strong>{activeTool}</strong>.
                </Typography>
              </Box>
            )}

            {/* Main Oral Anatomy Map */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <img 
                src="/anatomy.png" 
                alt="Oral Anatomy Map" 
                style={{ width: '800px', height: 'auto', display: 'block', pointerEvents: 'none' }} 
              />
              
              {/* Absolute positioned interactive label hotspots */}
              {ANATOMY_HOTSPOTS.map((hotspot) => {
                const hasFinding = findings.some(f => f.location === hotspot.name);
                return (
                  <Box
                    key={hotspot.id}
                    onClick={() => handleHotspotClick(hotspot)}
                    sx={{
                      position: 'absolute',
                      left: hotspot.left,
                      top: hotspot.top,
                      width: hotspot.width,
                      height: hotspot.height,
                      transform: 'translate(-50%, -50%)',
                      cursor: activeTool ? 'crosshair' : 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: activeTool ? '1.5px dashed #2196f3' : '1px solid transparent',
                      backgroundColor: hasFinding 
                        ? 'rgba(255, 235, 59, 0.4)' 
                        : (activeTool ? 'rgba(33, 150, 243, 0.05)' : 'transparent'),
                      boxShadow: hasFinding ? '0 0 5px rgba(255, 235, 59, 0.8)' : 'none',
                      transition: 'all 0.15s ease',
                      zIndex: 20,
                      '&:hover': {
                        backgroundColor: activeTool ? 'rgba(33, 150, 243, 0.2)' : 'rgba(0, 0, 0, 0.03)',
                        border: '1px solid #1976d2',
                      }
                    }}
                    title={hotspot.name}
                  />
                );
              })}
            </Box>

            {/* Bottom Two Diagrams Grid */}
            <Grid container spacing={4} sx={{ width: '100%', maxWidth: '800px', justifyContent: 'center' }}>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '350px' }}>
                  <img src="/gingival.png" alt="Gingival/Floor Map" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '280px' }}>
                  <img src="/neck_lymph.png" alt="Neck/Lymph Node Map" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </Box>
              </Grid>
            </Grid>

          </Grid>
        </Grid>
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
        </Box>

        {/* Custom "Add New" Finding Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: '6px', overflow: 'hidden' }
          }}
        >
          {/* Header */}
          <DialogTitle sx={{ bgcolor: '#4472c4', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 3 }}>
            <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>Add New</Typography>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px' }}>Location: <strong>{editingFinding?.location}</strong></Typography>
              <Typography sx={{ fontSize: '13px' }}>Date: {editingFinding?.date || new Date().toLocaleDateString('en-US')}</Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 4, bgcolor: '#fcfcfc' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Row 1: Size & Margins */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Size</Typography>
                  <TextField 
                    size="small" 
                    value={formState.sizeAP}
                    onChange={(e) => setFormState({ ...formState, sizeAP: e.target.value })}
                    sx={{ width: 50, '& input': { p: '4px 6px', textAlign: 'center', fontSize: '13px' } }} 
                  />
                  <Typography sx={{ fontSize: '13px' }}>mm (AP) x</Typography>
                  <TextField 
                    size="small" 
                    value={formState.sizeInfSup}
                    onChange={(e) => setFormState({ ...formState, sizeInfSup: e.target.value })}
                    sx={{ width: 50, '& input': { p: '4px 6px', textAlign: 'center', fontSize: '13px' } }} 
                  />
                  <Typography sx={{ fontSize: '13px' }}>mm (inf-sup)</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Margins</Typography>
                  <RadioGroup 
                    row 
                    value={formState.margins}
                    onChange={(e) => setFormState({ ...formState, margins: e.target.value })}
                  >
                    <FormControlLabel value="Diffuse" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Diffuse</Typography>} />
                    <FormControlLabel value="Discrete" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Discrete</Typography>} />
                  </RadioGroup>
                </Box>
              </Box>

              <Divider />

              {/* Row 2: Features */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Features</Typography>
                <RadioGroup 
                  row 
                  value={formState.features}
                  onChange={(e) => setFormState({ ...formState, features: e.target.value })}
                >
                  <FormControlLabel value="Homogeneous" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Homogeneous</Typography>} />
                  <FormControlLabel value="Non-homogeneous" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Non-homogeneous</Typography>} />
                </RadioGroup>
              </Box>

              <Divider />

              {/* Row 3: Color */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, mr: 1 }}>Color</Typography>
                <RadioGroup 
                  row 
                  value={formState.colorType}
                  onChange={(e) => setFormState({ ...formState, colorType: e.target.value })}
                >
                  <FormControlLabel value="Normal" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Normal</Typography>} />
                  <FormControlLabel value="White >75%" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>White &gt;75%</Typography>} />
                  <FormControlLabel value="Red >75%" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Red &gt;75%</Typography>} />
                  <FormControlLabel value="Both red & white" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Both red & white</Typography>} />
                  <FormControlLabel value="Other" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Other</Typography>} />
                </RadioGroup>
                {formState.colorType === 'Other' && (
                  <TextField 
                    size="small" 
                    value={formState.colorOther}
                    onChange={(e) => setFormState({ ...formState, colorOther: e.target.value })}
                    sx={{ width: 150, '& input': { p: '4px 6px', fontSize: '13px' } }}
                  />
                )}
              </Box>

              <Divider />

              {/* Row 4: Raised & Texture */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Raised</Typography>
                  <RadioGroup 
                    row 
                    value={formState.raisedType}
                    onChange={(e) => setFormState({ ...formState, raisedType: e.target.value })}
                  >
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
                    <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                  </RadioGroup>
                  {formState.raisedType === 'Yes' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField 
                        size="small" 
                        value={formState.raisedMm}
                        onChange={(e) => setFormState({ ...formState, raisedMm: e.target.value })}
                        sx={{ width: 45, '& input': { p: '4px 6px', textAlign: 'center', fontSize: '13px' } }} 
                      />
                      <Typography sx={{ fontSize: '13px' }}>mm</Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Texture</Typography>
                  <RadioGroup 
                    row 
                    value={formState.texture}
                    onChange={(e) => setFormState({ ...formState, texture: e.target.value })}
                  >
                    <FormControlLabel value="Ulcerated" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Ulcerated</Typography>} />
                    <FormControlLabel value="Fissured" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Fissured</Typography>} />
                    <FormControlLabel value="Smooth" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Smooth</Typography>} />
                    <FormControlLabel value="Velvety" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Velvety</Typography>} />
                    <FormControlLabel value="Nodular" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Nodular</Typography>} />
                  </RadioGroup>
                </Box>
              </Box>

              <Divider />

              {/* Row 5: Patient aware */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Patient aware?</Typography>
                <RadioGroup 
                  row 
                  value={formState.patientAware}
                  onChange={(e) => setFormState({ ...formState, patientAware: e.target.value })}
                >
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
                  <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                </RadioGroup>
                {formState.patientAware === 'Yes' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Typography sx={{ fontSize: '13px' }}>How long?</Typography>
                    <TextField 
                      size="small" 
                      value={formState.howLong}
                      onChange={(e) => setFormState({ ...formState, howLong: e.target.value })}
                      sx={{ width: 180, '& input': { p: '4px 6px', fontSize: '13px' } }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Row 6: Growing or changing */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Is it growing or changing?</Typography>
                <RadioGroup 
                  row 
                  value={formState.growing}
                  onChange={(e) => setFormState({ ...formState, growing: e.target.value })}
                >
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
                  <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                </RadioGroup>
                {formState.growing === 'Yes' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Typography sx={{ fontSize: '13px' }}>Details:</Typography>
                    <TextField 
                      size="small" 
                      value={formState.growingDetails}
                      onChange={(e) => setFormState({ ...formState, growingDetails: e.target.value })}
                      sx={{ width: 250, '& input': { p: '4px 6px', fontSize: '13px' } }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Row 7: Aggravates or relieves */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Is there anything that aggravates or relieves it?</Typography>
                <RadioGroup 
                  row 
                  value={formState.aggravates}
                  onChange={(e) => setFormState({ ...formState, aggravates: e.target.value })}
                >
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
                  <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                </RadioGroup>
                {formState.aggravates === 'Yes' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Typography sx={{ fontSize: '13px' }}>Details:</Typography>
                    <TextField 
                      size="small" 
                      value={formState.aggravatesDetails}
                      onChange={(e) => setFormState({ ...formState, aggravatesDetails: e.target.value })}
                      sx={{ width: 250, '& input': { p: '4px 6px', fontSize: '13px' } }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Row 8: Notes */}
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1 }}>Notes</Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Enter clinical notes here..."
                  sx={{ '& .MuiInputBase-root': { p: 1.5, fontSize: '13px', bgcolor: 'white' } }}
                />
              </Box>

              <Divider />

              {/* Row 9: Follow up */}
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1 }}>Follow up</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          size="small" 
                          checked={formState.followUpVelscope} 
                          onChange={(e) => setFormState({ ...formState, followUpVelscope: e.target.checked })}
                        />
                      } 
                      label={<Typography sx={{ fontSize: '13px' }}>Velscope & Stain</Typography>} 
                    />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          size="small" 
                          checked={formState.followUpBiopsy} 
                          onChange={(e) => setFormState({ ...formState, followUpBiopsy: e.target.checked })}
                        />
                      } 
                      label={<Typography sx={{ fontSize: '13px' }}>Biopsy</Typography>} 
                    />
                    {formState.followUpBiopsy && (
                      <RadioGroup 
                        row 
                        value={formState.followUpBiopsyType}
                        onChange={(e) => setFormState({ ...formState, followUpBiopsyType: e.target.value })}
                      >
                        <FormControlLabel value="Incisional" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Incisional</Typography>} />
                        <FormControlLabel value="Excisional" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Excisional</Typography>} />
                      </RadioGroup>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          size="small" 
                          checked={formState.followUpHyg} 
                          onChange={(e) => setFormState({ ...formState, followUpHyg: e.target.checked })}
                        />
                      } 
                      label={<Typography sx={{ fontSize: '13px' }}>At next hyg.</Typography>} 
                    />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          size="small" 
                          checked={formState.followUpScreen} 
                          onChange={(e) => setFormState({ ...formState, followUpScreen: e.target.checked })}
                        />
                      } 
                      label={<Typography sx={{ fontSize: '13px' }}>Screen again</Typography>} 
                    />
                    {formState.followUpScreen && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField 
                          size="small" 
                          value={formState.followUpScreenValue}
                          onChange={(e) => setFormState({ ...formState, followUpScreenValue: e.target.value })}
                          sx={{ width: 100, '& input': { p: '4px 6px', fontSize: '13px' } }} 
                        />
                        <Typography sx={{ fontSize: '11px', color: '#666' }}>wks/mo.s/yrs</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          size="small" 
                          checked={formState.followUpSpec} 
                          onChange={(e) => setFormState({ ...formState, followUpSpec: e.target.checked })}
                        />
                      } 
                      label={<Typography sx={{ fontSize: '13px' }}>Spec. exam</Typography>} 
                    />
                    {formState.followUpSpec && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField 
                          size="small" 
                          value={formState.followUpSpecValue}
                          onChange={(e) => setFormState({ ...formState, followUpSpecValue: e.target.value })}
                          sx={{ width: 100, '& input': { p: '4px 6px', fontSize: '13px' } }} 
                        />
                        <Typography sx={{ fontSize: '11px', color: '#666' }}>wks/mo.s/yrs</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>

            </Box>
          </DialogContent>

          {/* Footer Actions */}
          <DialogActions sx={{ p: 2, px: 3, borderTop: '1px solid #eee', justifyContent: 'space-between', bgcolor: '#fcfcfc' }}>
            <Box>
              {!editingFinding?.isNew && (
                <IconButton 
                  onClick={() => handleDeleteFinding(editingFinding.id)} 
                  sx={{ color: '#e74c3c', '&:hover': { bgcolor: '#fce4ec' } }}
                  title="Delete Finding"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                onClick={() => setDialogOpen(false)} 
                sx={{ 
                  textTransform: 'none', bgcolor: '#7f8c8d', color: 'white', px: 3.5, py: 0.5, fontSize: '13px', fontWeight: 600,
                  '&:hover': { bgcolor: '#95a5a6' }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveFinding}
                sx={{ 
                  textTransform: 'none', bgcolor: '#d29d47', color: 'white', px: 4.5, py: 0.5, fontSize: '13px', fontWeight: 600,
                  '&:hover': { bgcolor: '#c08a36' }
                }}
              >
                Save
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default DentalAnatomyExamPage;