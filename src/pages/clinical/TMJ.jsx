import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup,
  Divider, Button, Grid, Chip, IconButton, Container, TextField, Stack,
  CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { fontSize, fontWeight } from "../../constants/styles";
import { selectSelectedPatientId } from '../../store/slices/patientSlice';
import { selectSelectedAppointmentId } from '../../store/slices/appointmentSlice';
import {
  useClinicalExamQuery,
  useUpsertClinicalExam,
  useSignClinicalExam,
  useExamHistoryDates
} from '../../hooks/queries/useClinicalExam';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import { useAppointment } from '../../hooks/redux/useAppointment';


// Custom Ring Radio to match the "Acceptable/Warning/Issue" style
const StatusRadio = ({ color, ...props }) => (
  <Radio
    {...props}
    sx={{
      color: color,
      '&.Mui-checked': { color: color },
      '& .MuiSvgIcon-root': { fontSize: 18 },
      padding: '4px'
    }}
  />
);

const SectionHeader = ({ title, status = 'green' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Box sx={{ 
      width: 10, height: 10, borderRadius: '50%', 
      border: `2px solid ${status === 'green' ? '#2ecc71' : '#e74c3c'}`, 
      mr: 1 
    }} />
    <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{title}</Typography>
  </Box>
);

const getStatusIconStyle = (color) => ({
  width: 12, height: 12, borderRadius: '50%', border: `2px solid ${color}`, mr: 1, display: 'inline-block'
});

const CustomLabel = ({ text, subText, italic = false }) => (
  <Box>
    <Typography sx={{ 
      fontWeight: fontWeight.regular, 
      fontSize: fontSize.xs, 
      color: '#333', 
      lineHeight: 1.2,
      fontStyle: italic ? 'italic' : 'normal'
    }}>
      {text}
    </Typography>
    {subText && (
      <Typography sx={{ fontSize: fontSize.xs, color: '#666', fontStyle: italic ? 'italic' : 'normal' }}>
        {subText}
      </Typography>
    )}
  </Box>
);

const MMInput = ({ value, onChange }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'baseline', ml: 1 }}>
    <TextField
      variant="standard"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ 
        width: 35,
        '& input': { textAlign: 'center', fontSize: fontSize.xs, padding: '2px 0' },
        '& .MuiInput-root:before': { borderBottom: '1px solid #9ca3af !important' },
        '& .MuiInput-root:after': { borderBottom: '1px solid #1976d2 !important' }
      }}
    />
    <Typography variant="caption" sx={{ ml: 0.5, fontSize: fontSize.xs, color: '#333' }}>mm</Typography>
  </Box>
);

const DentalTmdExamPage = () => {
  const { showSnackbar } = useSnackbar();
  const patientId = useSelector(selectSelectedPatientId);
  const appointmentId = useSelector(selectSelectedAppointmentId);
  const providerId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('tmj', appointmentId);
  const upsertMutation = useUpsertClinicalExam('tmj', appointmentId);
  const signMutation = useSignClinicalExam('tmj', appointmentId);

  const isSigned = !!examRecord?.isSigned;
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const sessionState = useSelector(state => state.clinicalExamSession.exam.tmj);
  const dispatch = useDispatch();

  // Collapsible sections state
  const expandedSections = sessionState?.expandedSections || {
    rangeOfMotion: true,
    muscleEvaluation: false,
    jointEvaluation: false
  };
  const setExpandedSections = (updater) => {
    const newVal = typeof updater === 'function' ? updater(expandedSections) : updater;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'tmj', data: { expandedSections: newVal } } });
  };

  // Form state for TMJ exam
  const formData = sessionState?.formData || {
    // Range of Motion
    maxOpening: '60',
    deviationOnOpening: 'yes',
    restrictedHorizontal: 'no',
    leftLateral: '12',
    rightLateral: '12',
    deviationDirection: ['yes'],
    deviationLeft: false,
    deviationLeftReduction: false,
    deviationRight: true,
    deviationRightReduction: true,
    painWhenInMotion: 'no',
    painTypes: [],

    // Muscle Evaluation
    tenderness: 'no',
    immobilizationTest: 'neg',
    temporalisMasseter: 'symp',
    frequency: 'Daily',
    timing: 'am',
    timingCustom: '',
    duration: 'constant',
    intensity: '3',
    painOnPalpation: true,
    rigidity: false,
    reproducible: true,

    // Joint Evaluation
    jointSounds: 'no',
    loadTest: 'neg',
    jointSoundsNeg: false,
    crepitus: false,
    crepitusLeftGrade: '',
    crepitusRightGrade: '',
    clicking: true,
    clickingLeftGrade: '2',
    clickingRightGrade: '1',
    clickingLeftOpening: false,
    clickingLeftClosing: false,
    clickingRightOpening: false,
    clickingRightClosing: true,
    reproducibleLeft: false,
    reproducibleRight: false,
    selectedMuscles: [],
    selectedJoints: []
  };

  const setFormData = (updater) => {
    const newVal = typeof updater === 'function' ? updater(formData) : updater;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'tmj', data: { formData: newVal } } });
  };

  // Sync data from database to form state when loaded
  useEffect(() => {
    if (examRecord?.examData) {
      setFormData(prev => ({
        ...prev,
        ...examRecord.examData
      }));
    }
  }, [examRecord?.examData]);

  const handleSaveExam = async () => {
    if (!appointmentId) {
      showSnackbar('No active appointment selected', 'error');
      return;
    }
    try {
      await upsertMutation.mutateAsync({
        patientId: patientId ? String(patientId) : undefined,
        providerId: providerId ? String(providerId) : undefined,
        examData: formData
      });
      showSnackbar('TMJ exam saved successfully', 'success');
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
      showSnackbar('TMJ exam signed and locked', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to sign exam', 'error');
    }
  };

  const handleDeleteExam = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    showSnackbar('TMJ exam deleted', 'info');
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleCheckboxArrayChange = (field, item, checked) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, item] };
      } else {
        return { ...prev, [field]: currentArray.filter(i => i !== item) };
      }
    });
  };

  const toggleMuscleCircle = (id) => {
    setFormData(prev => {
      const arr = prev.selectedMuscles || [];
      const newArr = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
      return { ...prev, selectedMuscles: newArr };
    });
  };

  const toggleJointCircle = (id) => {
    setFormData(prev => {
      const arr = prev.selectedJoints || [];
      const newArr = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
      return { ...prev, selectedJoints: newArr };
    });
  };

  const { currentAppointment } = useAppointment();

  const { data: historicalDates } = useExamHistoryDates('tmj', patientId);
  const visitDates = React.useMemo(() => {
    const historyArray = historicalDates || [];
    const formattedHistory = historyArray.map(dateStr => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    });

    if (currentAppointment?.appointmentDate || currentAppointment?.date) {
      const currentD = new Date(currentAppointment.appointmentDate || currentAppointment.date);
      if (!isNaN(currentD)) {
        const formattedCurrent = currentD.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        if (!formattedHistory.includes(formattedCurrent)) {
          formattedHistory.push(formattedCurrent);
        }
      }
    }

    return formattedHistory;
  }, [historicalDates, currentAppointment]);

  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    // setVisitDates([...visitDates, today]);
  };

  const handleRemoveDate = (indexToRemove) => {
    // setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
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
      
      <Container maxWidth="xl" sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
        {/* Timeline and Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, overflowX: 'auto' }}>
          <VisitDatesTimeline
            visitDates={visitDates}
          />
          <Button 
            startIcon={<AddIcon />} 
            sx={{ textTransform: 'none', color: '#777', ml: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            New Exam
          </Button>
        </Box>

        {isSigned && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This exam has been signed and locked. It is now read-only.
          </Alert>
        )}

        <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>
          {/* MH/DH Badges */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>MH</Typography>
            <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>DH</Typography>
          </Box>

          {/* Accordion 1: Range of Motion */}
        <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 1, mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box 
              onClick={() => toggleSection('rangeOfMotion')}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, cursor: 'pointer', userSelect: 'none' }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#455a64' }}>
                1. Range of Motion
              </Typography>
              <IconButton size="small">
                {expandedSections.rangeOfMotion ? (
                  <KeyboardArrowUpIcon sx={{ color: '#555' }} />
                ) : (
                  <KeyboardDoubleArrowDownIcon sx={{ color: '#555', fontSize: 18 }} />
                )}
              </IconButton>
            </Box>

            {/* Summaries (Always visible) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(Number(formData.maxOpening) >= 35 && Number(formData.maxOpening) <= 65 ? '#2ecc71' : '#e74c3c')} />
              <CustomLabel text="Max opening:" />
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>{formData.maxOpening} mm</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(formData.deviationOnOpening === 'no' ? '#2ecc71' : '#e74c3c')} />
              <CustomLabel text="Deviation upon opening:" />
              <RadioGroup 
                row 
                value={formData.deviationOnOpening}
                onChange={(e) => handleFieldChange('deviationOnOpening', e.target.value)}
                sx={{ ml: 2, gap: 1 }}
              >
                <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
                <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(formData.restrictedHorizontal === 'no' ? '#2ecc71' : '#e74c3c')} />
              <CustomLabel text="Restricted Horizontal movement:" />
              <RadioGroup 
                row 
                value={formData.restrictedHorizontal}
                onChange={(e) => handleFieldChange('restrictedHorizontal', e.target.value)}
                sx={{ ml: 2, gap: 1 }}
              >
                <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
                <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
              </RadioGroup>
            </Box>

            {/* Detailed View (Visible when expanded) */}
            {expandedSections.rangeOfMotion && (
              <>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {/* LEFT FORM COLUMN */}
                  <Grid item xs={8.5}>
                    {/* Row 1: Maximum Opening */}
                    <Grid container alignItems="center" sx={{ mb: 3 }}>
                      <Grid item xs={4.5} sx={{ pr: 2 }}>
                        <CustomLabel text="Maximum Opening" italic />
                      </Grid>
                      <Grid item xs={1.5}>
                        <MMInput 
                          value={formData.maxOpening} 
                          onChange={(val) => handleFieldChange('maxOpening', val)} 
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                          <Chip 
                            label="WNL" 
                            variant="outlined" 
                            size="small" 
                            sx={{ height: 18, fontSize: '0.65rem', fontWeight: 'bold', color: '#2ecc71', borderColor: '#2ecc71', borderRadius: '8px' }} 
                          />
                          <Typography sx={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                            Restricted (&lt; 35 mm) &nbsp;&nbsp; Excessive (&gt; 65 mm)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Row 2: Left to Right Movement */}
                    <Grid container alignItems="flex-start" sx={{ mb: 3 }}>
                      <Grid item xs={4.5} sx={{ pr: 2 }}>
                        <CustomLabel text="Left to Right Movement" italic />
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '13px', minWidth: 80 }}>Left Lateral</Typography>
                          <TextField
                            variant="standard"
                            value={formData.leftLateral}
                            onChange={(e) => handleFieldChange('leftLateral', e.target.value)}
                            sx={{ width: 45, mx: 1, '& input': { textAlign: 'center', fontSize: '13px', padding: '1px 0' } }}
                          />
                          <Typography sx={{ fontSize: '13px' }}>mm</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '13px', minWidth: 80 }}>Right Lateral</Typography>
                          <TextField
                            variant="standard"
                            value={formData.rightLateral}
                            onChange={(e) => handleFieldChange('rightLateral', e.target.value)}
                            sx={{ width: 45, mx: 1, '& input': { textAlign: 'center', fontSize: '13px', padding: '1px 0' } }}
                          />
                          <Typography sx={{ fontSize: '13px' }}>mm</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', mb: 1 }}>
                          WNL &nbsp; Restricted (&lt; 10 mm)
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>
                          WNL &nbsp; Restricted (&lt; 10 mm)
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Row 3: Deviation Upon Opening */}
                    <Grid container alignItems="center" sx={{ mb: 3 }}>
                      <Grid item xs={4.5} sx={{ pr: 2 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Deviation Upon Opening</Typography>
                      </Grid>
                      <Grid item xs={2.5}>
                        <RadioGroup 
                          row 
                          value={formData.deviationOnOpening}
                          onChange={(e) => handleFieldChange('deviationOnOpening', e.target.value)}
                          sx={{ gap: 1 }}
                        >
                          <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                          <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Yes:</Typography>} />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <FormControlLabel 
                            control={<Checkbox size="small" checked={formData.deviationLeft} onChange={(e) => handleCheckboxChange('deviationLeft', e.target.checked)} />} 
                            label={<Typography sx={{ fontSize: '13px' }}>Left</Typography>} 
                            sx={{ mr: 0.5 }} 
                          />
                          <FormControlLabel 
                            control={<Checkbox size="small" checked={formData.deviationLeftReduction} onChange={(e) => handleCheckboxChange('deviationLeftReduction', e.target.checked)} />} 
                            label={<Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: formData.deviationLeftReduction ? '#333' : '#aaa' }}>w/ Reduction</Typography>} 
                            sx={{ mr: 1.5 }} 
                          />
                          <FormControlLabel 
                            control={<Checkbox size="small" checked={formData.deviationRight} onChange={(e) => handleCheckboxChange('deviationRight', e.target.checked)} />} 
                            label={<Typography sx={{ fontSize: '13px' }}>Right</Typography>} 
                            sx={{ mr: 0.5 }} 
                          />
                          <FormControlLabel 
                            control={<Checkbox size="small" checked={formData.deviationRightReduction} onChange={(e) => handleCheckboxChange('deviationRightReduction', e.target.checked)} />} 
                            label={<Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: formData.deviationRightReduction ? '#333' : '#aaa' }}>w/ Reduction</Typography>} 
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Row 4: Pain When in Motion */}
                    <Grid container alignItems="center">
                      <Grid item xs={4.5} sx={{ pr: 2 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Pain When in Motion</Typography>
                      </Grid>
                      <Grid item xs={2.5}>
                        <RadioGroup 
                          row 
                          value={formData.painWhenInMotion}
                          onChange={(e) => handleFieldChange('painWhenInMotion', e.target.value)}
                          sx={{ gap: 1 }}
                        >
                          <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                          <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Yes:</Typography>} />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={5}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          {['Sharp', 'Dull', 'Muscle', 'Right TMJ', 'Left TMJ'].map((text) => (
                            <FormControlLabel 
                              key={text} 
                              control={
                                <Checkbox 
                                  size="small" 
                                  checked={formData.painTypes.includes(text)}
                                  onChange={(e) => handleCheckboxArrayChange('painTypes', text, e.target.checked)}
                                />
                              } 
                              label={<Typography sx={{ fontSize: '12px', fontStyle: 'italic' }}>{text}</Typography>} 
                              sx={{ mr: 0.8 }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* RIGHT DIAGRAM COLUMN */}
                  <Grid item xs={3.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                      <Typography sx={{ position: 'absolute', left: '12%', top: '2%', fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>R</Typography>
                      <Typography sx={{ position: 'absolute', right: '12%', top: '2%', fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>L</Typography>
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <line x1="15" y1="24" x2="85" y2="24" stroke="#333" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="50" y1="24" x2="50" y2="85" stroke="#333" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M40 75 L50 85 L60 75" fill="none" stroke="#333" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Box>

        {/* Accordion 2: Muscle Evaluation */}
        <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 1, mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box 
              onClick={() => toggleSection('muscleEvaluation')}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, cursor: 'pointer', userSelect: 'none' }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#455a64' }}>
                2. Muscle Evaluation
              </Typography>
              <IconButton size="small">
                {expandedSections.muscleEvaluation ? (
                  <KeyboardArrowUpIcon sx={{ color: '#555' }} />
                ) : (
                  <KeyboardDoubleArrowDownIcon sx={{ color: '#555', fontSize: 18 }} />
                )}
              </IconButton>
            </Box>

            {/* Summaries (Always visible) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(formData.tenderness === 'no' ? '#2ecc71' : '#e74c3c')} />
              <Typography variant="body2" sx={{ mr: 2, minWidth: 220 }}>Tenderness (Masseter/Temporalis):</Typography>
              <RadioGroup 
                row 
                value={formData.tenderness}
                onChange={(e) => handleFieldChange('tenderness', e.target.value)}
                sx={{ gap: 1 }}
              >
                <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
                <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>}/>
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(formData.immobilizationTest === 'neg' ? '#2ecc71' : '#e74c3c')} />
              <Typography variant="body2" sx={{ mr: 2, minWidth: 220 }}>Immobilization Test:</Typography>
              <RadioGroup 
                row 
                value={formData.immobilizationTest}
                onChange={(e) => handleFieldChange('immobilizationTest', e.target.value)}
                sx={{ gap: 1 }}
              >
                <FormControlLabel value="neg" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Negative</Typography>} sx={{ mr: 1 }}/>
                <FormControlLabel value="pos" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Positive</Typography>}/>
              </RadioGroup>
            </Box>

            {/* Detailed View (Visible when expanded) */}
            {expandedSections.muscleEvaluation && (
              <>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={4}>
                  <Grid item xs={6.5}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 2 }}>Temporalis/Masseter Only</Typography>
                    <RadioGroup
                      value={formData.temporalisMasseter}
                      onChange={(e) => handleFieldChange('temporalisMasseter', e.target.value)}
                    >
                      <FormControlLabel value="asymp" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Asymptomatic</Typography>} />
                      <FormControlLabel value="symp" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Symptomatic</Typography>} />
                    </RadioGroup>
                    
                    <Box sx={{ ml: 4, mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                            Frequency: 
                            <TextField
                              variant="standard"
                              value={formData.frequency}
                              onChange={(e) => handleFieldChange('frequency', e.target.value)}
                              sx={{ ml: 1, width: 80, '& input': { fontSize: '13px', padding: '1px 0' } }}
                            />
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="caption" sx={{ fontSize: '13px' }}>Timing:</Typography>
                            <RadioGroup 
                              row 
                              value={formData.timing}
                              onChange={(e) => handleFieldChange('timing', e.target.value)}
                              sx={{ ml: 1, gap: 1 }}
                            >
                              <FormControlLabel value="am" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>AM</Typography>} />
                              <FormControlLabel value="pm" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>PM</Typography>} />
                            </RadioGroup>
                            <TextField
                              variant="standard"
                              value={formData.timingCustom}
                              onChange={(e) => handleFieldChange('timingCustom', e.target.value)}
                              placeholder="other"
                              sx={{ 
                                width: 80,
                                ml: 1,
                                '& input': { fontSize: '13px', padding: '2px 0' }
                              }}
                            />
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: '13px' }}>Duration:</Typography>
                          <Box sx={{ display: 'flex', mt: 1 }}>
                            <RadioGroup 
                              row 
                              value={formData.duration}
                              onChange={(e) => handleFieldChange('duration', e.target.value)}
                              sx={{ gap: 1 }}
                            >
                              <FormControlLabel value="chewing" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Chewing</Typography>} />
                              <FormControlLabel value="constant" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Constant</Typography>} />
                            </RadioGroup>
                          </Box>
                        </Box>
                      </Box>
                    
                      <Typography variant="body1" sx={{ display: 'block', mb: 1, fontWeight: 500, fontSize: '13px' }}>Intensity/Pain Level: &nbsp; 
                        <RadioGroup 
                          row 
                          value={formData.intensity}
                          onChange={(e) => handleFieldChange('intensity', e.target.value)}
                          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                        >
                          {['1', '2', '3', '4', '5'].map((v) => (
                            <FormControlLabel key={v} value={v} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>{v}</Typography>} />
                          ))}
                        </RadioGroup>
                      </Typography>
                                  
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControlLabel control={<Checkbox size="small" checked={formData.painOnPalpation} onChange={(e) => handleCheckboxChange('painOnPalpation', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px' }}>Pain on muscle palpation</Typography>} />
                        <FormControlLabel control={<Checkbox size="small" checked={formData.rigidity} onChange={(e) => handleCheckboxChange('rigidity', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px' }}>Rigidity of jaw on manipulation</Typography>} />
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <FormControlLabel control={<Checkbox size="small" checked={formData.reproducible} onChange={(e) => handleCheckboxChange('reproducible', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px' }}>Reproducible</Typography>} />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Muscle Images */}
                  <Grid item xs={5.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: -2 }}>
                    <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Right Muscle (Right Profile, facing right, labeled Right) */}
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <img src="/right_muscle.png" alt="Right Muscle" style={{ width: '260px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} />
                          {/* Temporalis */}
                          <Box
                            onClick={() => toggleMuscleCircle('right_temporalis')}
                            sx={{
                              position: 'absolute',
                              left: '45%',
                              top: '49%',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: (formData.selectedMuscles || []).includes('right_temporalis') ? '#ffff00' : 'transparent',
                              cursor: 'pointer',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                          {/* Masseter */}
                          <Box
                            onClick={() => toggleMuscleCircle('right_masseter')}
                            sx={{
                              position: 'absolute',
                              left: '40.5%',
                              top: '82%',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: (formData.selectedMuscles || []).includes('right_masseter') ? '#ffff00' : 'transparent',
                              cursor: 'pointer',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                        </Box>

                        {/* Left Muscle (Left Profile, facing left, labeled Left) */}
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <img src="/left_muscle.png" alt="Left Muscle" style={{ width: '260px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} />
                          {/* Temporalis */}
                          <Box
                            onClick={() => toggleMuscleCircle('left_temporalis')}
                            sx={{
                              position: 'absolute',
                              left: '44%',
                              top: '46%',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: (formData.selectedMuscles || []).includes('left_temporalis') ? '#ffff00' : 'transparent',
                              cursor: 'pointer',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                          {/* Masseter */}
                          <Box
                            onClick={() => toggleMuscleCircle('left_masseter')}
                            sx={{
                              position: 'absolute',
                              left: '48%',
                              top: '80%',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: (formData.selectedMuscles || []).includes('left_masseter') ? '#ffff00' : 'transparent',
                              cursor: 'pointer',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 0.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Right</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Left</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: '#888', mt: 0.5 }}>
                        select the muscle
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 2, color: '#333' }}>Possible Concern</Typography>
                <Box sx={{ display: 'flex', gap: 10 }}>
                  {/* Reflex Splinting Column */}
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', mb: 0.5, color: '#455a64', fontWeight: 'bold' }}>
                      - Reflex Splinting
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                      Pain on muscle palpation
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                      Rigidity of jaw on manipulation
                    </Typography>
                  </Box>

                  {/* Myofascial Pain Column */}
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', mb: 0.5, color: '#455a64', fontWeight: 'bold' }}>
                      - Myofascial Pain
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                      Pain on muscle palpation
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                      Pain referred reproducibly on palpation of trigger points
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Accordion 3: Joint Evaluation */}
        <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 1, mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box 
              onClick={() => toggleSection('jointEvaluation')}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, cursor: 'pointer', userSelect: 'none' }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#455a64' }}>
                3. Joint Evaluation
              </Typography>
              <IconButton size="small">
                {expandedSections.jointEvaluation ? (
                  <KeyboardArrowUpIcon sx={{ color: '#555' }} />
                ) : (
                  <KeyboardDoubleArrowDownIcon sx={{ color: '#555', fontSize: 18 }} />
                )}
              </IconButton>
            </Box>

            {/* Summaries (Always visible) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(formData.jointSounds === 'no' ? '#2ecc71' : '#e74c3c')} />
              <Typography variant="body2" sx={{ mr: 2, minWidth: 220 }}>Joint Sounds:</Typography>
              <RadioGroup 
                row 
                value={formData.jointSounds}
                onChange={(e) => handleFieldChange('jointSounds', e.target.value)}
                sx={{ gap: 1 }}
              >
                <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
                <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>}/>
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={getStatusIconStyle(formData.loadTest === 'neg' ? '#2ecc71' : '#e74c3c')} />
              <Typography variant="body2" sx={{ mr: 2, minWidth: 220 }}>Load Test:</Typography>
              <RadioGroup 
                row 
                value={formData.loadTest}
                onChange={(e) => handleFieldChange('loadTest', e.target.value)}
                sx={{ gap: 1 }}
              >
                <FormControlLabel value="neg" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Negative</Typography>} sx={{ mr: 1 }}/>
                <FormControlLabel value="pos" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Positive</Typography>}/>
              </RadioGroup>
            </Box>

            {/* Detailed View (Visible when expanded) */}
            {expandedSections.jointEvaluation && (
              <>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6.5}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1, color: '#333' }}>
                      Joint Sounds Details
                    </Typography>
                    
                    <Box sx={{ ml: 0.5 }}>
                      {/* Negative Row */}
                      <FormControlLabel 
                        control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.jointSoundsNeg} onChange={(e) => handleCheckboxChange('jointSoundsNeg', e.target.checked)} />} 
                        label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Negative</Typography>} 
                      />

                      {/* Crepitus Section */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                        <FormControlLabel 
                          control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.crepitus} onChange={(e) => handleCheckboxChange('crepitus', e.target.checked)} />} 
                          label={<Typography sx={{ fontSize: '0.8rem', color: '#333', minWidth: '70px' }}>Crepitus</Typography>} 
                        />
                        
                        {/* Left Side Crepitus */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Left: Grade</Typography>
                          <RadioGroup 
                            row 
                            value={formData.crepitusLeftGrade}
                            onChange={(e) => handleFieldChange('crepitusLeftGrade', e.target.value)}
                            sx={{ gap: 0.5 }}
                          >
                            {[1, 2, 3].map((v) => (
                              <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                            ))}
                          </RadioGroup>
                        </Box>

                        {/* Right Side Crepitus */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Right: Grade</Typography>
                          <RadioGroup 
                            row 
                            value={formData.crepitusRightGrade}
                            onChange={(e) => handleFieldChange('crepitusRightGrade', e.target.value)}
                            sx={{ gap: 0.5 }}
                          >
                            {[1, 2, 3].map((v) => (
                              <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                            ))}
                          </RadioGroup>
                        </Box>
                      </Box>

                      {/* Clicking Section */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <FormControlLabel 
                          control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.clicking} onChange={(e) => handleCheckboxChange('clicking', e.target.checked)} />} 
                          label={<Typography sx={{ fontSize: '0.8rem', color: '#333', minWidth: '70px' }}>Clicking</Typography>} 
                        />
                        
                        {/* Left Side Clicking */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Left: Grade</Typography>
                          <RadioGroup 
                            row 
                            value={formData.clickingLeftGrade}
                            onChange={(e) => handleFieldChange('clickingLeftGrade', e.target.value)}
                            sx={{ gap: 0.5 }}
                          >
                            {[1, 2, 3].map((v) => (
                              <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                            ))}
                          </RadioGroup>
                        </Box>

                        {/* Right Side Clicking */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Right: Grade</Typography>
                          <RadioGroup 
                            row 
                            value={formData.clickingRightGrade}
                            onChange={(e) => handleFieldChange('clickingRightGrade', e.target.value)}
                            sx={{ gap: 0.5 }}
                          >
                            {[1, 2, 3].map((v) => (
                              <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                            ))}
                          </RadioGroup>
                        </Box>
                      </Box>

                      {/* Clicking Child Checkboxes Row 1 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ minWidth: '70px' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.clickingLeftOpening} onChange={(e) => handleCheckboxChange('clickingLeftOpening', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingLeftOpening ? '#333' : '#ccc' }}>Opening</Typography>} />
                          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px', ml: 1 }} checked={formData.clickingLeftClosing} onChange={(e) => handleCheckboxChange('clickingLeftClosing', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingLeftClosing ? '#333' : '#ccc' }}>Closing</Typography>} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.clickingRightOpening} onChange={(e) => handleCheckboxChange('clickingRightOpening', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingRightOpening ? '#333' : '#ccc' }}>Opening</Typography>} />
                          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px', ml: 1 }} checked={formData.clickingRightClosing} onChange={(e) => handleCheckboxChange('clickingRightClosing', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingRightClosing ? '#333' : '#333' }}>Closing</Typography>} />
                        </Box>
                      </Box>

                      {/* Clicking Child Checkboxes Row 2 - Reproducible */}
                      <Box sx={{ display: 'flex', ml: 9, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', minWidth: '220px' }}>
                          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.reproducibleLeft} onChange={(e) => handleCheckboxChange('reproducibleLeft', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.reproducibleLeft ? '#333' : '#ccc' }}>Reproducible</Typography>} />
                        </Box>
                        <Box sx={{ display: 'flex', ml: 2 }}>
                          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.reproducibleRight} onChange={(e) => handleCheckboxChange('reproducibleRight', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.reproducibleRight ? '#333' : '#ccc' }}>Reproducible</Typography>} />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Joint Images */}
                  <Grid item xs={5.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Right Joint (Right Profile, facing right, labeled Right) */}
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <img src="/right_joint.png" alt="Right Joint" style={{ width: '240px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} />
                          <Box
                            onClick={() => toggleJointCircle('right_joint')}
                            sx={{
                              position: 'absolute',
                              left: '46%',
                              top: '34%',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: (formData.selectedJoints || []).includes('right_joint') ? '#ffff00' : 'transparent',
                              cursor: 'pointer',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                        </Box>

                        {/* Left Joint (Left Profile, facing left, labeled Left) */}
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <img src="/left_joint.png" alt="Left Joint" style={{ width: '240px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} />
                          <Box
                            onClick={() => toggleJointCircle('left_joint')}
                            sx={{
                              position: 'absolute',
                              left: '54%',
                              top: '34%',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: (formData.selectedJoints || []).includes('left_joint') ? '#ffff00' : 'transparent',
                              cursor: 'pointer',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 0.5 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Right</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Left</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: '#888', mt: 0.5 }}>
                        select the joint
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Box>

        {/* Footer section */}
        <Box sx={{ ml: 1, mb: 3, mt: 4 }}>
          <Typography variant="body2" sx={{ display: 'inline', mr: 2, fontSize: '13px' }}>Additional Imaging required:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', color: '#555', fontStyle: 'italic', mr: 1, fontSize: '13px' }}>MRI:</Typography>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>Left</Typography>} sx={{ mr: 1 }}/>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>Right</Typography>} sx={{ mr: 4 }}/>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>CBCT</Typography>}/>
        </Box>

        </fieldset>

        <Box sx={{ ml: 1, mt: 3, display: 'flex', gap: 2 }}>
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
            sx={{ bgcolor: '#e74c3c', textTransform: 'none', px: 2, '&:hover': { bgcolor: '#c0392b' } }}
            onClick={handleDeleteExam}
          >
            Delete Exam
          </Button>
        </Box>
      </Container>

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

export default DentalTmdExamPage;