import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup,
  Divider, Button, Grid, Chip, IconButton, Container, TextField, Stack,
  CircularProgress, Alert, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { RadioExamHeader, ExamToolbar, ExamActionBar } from "../../components/radiographic";
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
import { useAppointmentDetail } from '../../hooks/redux/useAppointment';

import { getStatusIconStyle, CustomLabel } from '../../components/clinical/tmj/TMJHelpers';
import TMJSectionContainer from '../../components/clinical/tmj/TMJSectionContainer';
import RangeOfMotionSection from '../../components/clinical/tmj/RangeOfMotionSection';
import MuscleEvaluationSection from '../../components/clinical/tmj/MuscleEvaluationSection';
import JointEvaluationSection from '../../components/clinical/tmj/JointEvaluationSection';
import RightPanel from '../../components/appointments/right-panel/RightPanel';

const PillToggle = ({ value, onChange, options = [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] }) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    onChange={(e, val) => { if (val !== null) onChange(val); }}
    sx={{
      backgroundColor: '#f1f5f9',
      borderRadius: '20px',
      padding: '2px',
      height: '28px',
      '& .MuiToggleButton-root': {
        border: 'none',
        borderRadius: '16px !important',
        padding: '0 14px',
        textTransform: 'none',
        fontSize: '12px',
        fontWeight: 600,
        color: '#64748b',
        lineHeight: 1,
        '&.Mui-selected': {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        },
        '&:hover': {
          backgroundColor: 'transparent',
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
          }
        }
      }
    }}
  >
    {options.map((opt) => (
      <ToggleButton key={opt.value} value={opt.value}>
        {opt.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

const DentalTmdExamPage = () => {
  const { showSnackbar } = useSnackbar();
  const patientId = useSelector(selectSelectedPatientId);
  const appointmentId = useSelector(selectSelectedAppointmentId);
  const providerId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);

  const [viewingAppointmentId, setViewingAppointmentId] = useState(null);
  const activeAppointmentId = viewingAppointmentId && viewingAppointmentId !== 'undefined' 
    ? String(viewingAppointmentId) 
    : (appointmentId && String(appointmentId) !== 'undefined' ? String(appointmentId) : null);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('tmj', activeAppointmentId);
  const upsertMutation = useUpsertClinicalExam('tmj', activeAppointmentId);
  const signMutation = useSignClinicalExam('tmj', activeAppointmentId);

  const isSigned = !!examRecord?.isSigned;
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Default form state for TMJ
  const defaultFormData = useMemo(() => ({
    maxOpening: '60', deviationOnOpening: 'yes', restrictedHorizontal: 'no', leftLateral: '12', rightLateral: '12',
    deviationDirection: ['yes'], deviationLeft: false, deviationLeftReduction: false, deviationRight: true, deviationRightReduction: true,
    painWhenInMotion: 'no', painTypes: [], tenderness: 'no', immobilizationTest: 'neg', temporalisMasseter: 'symp',
    frequency: 'Daily', timing: 'am', timingCustom: '', duration: 'constant', intensity: '3', painOnPalpation: true,
    rigidity: false, reproducible: true, jointSounds: 'no', loadTest: 'neg', jointSoundsNeg: false, crepitus: false,
    crepitusLeftGrade: '', crepitusRightGrade: '', clicking: true, clickingLeftGrade: '2', clickingRightGrade: '1',
    clickingLeftOpening: false, clickingLeftClosing: false, clickingRightOpening: false, clickingRightClosing: true,
    reproducibleLeft: false, reproducibleRight: false, selectedMuscles: [], selectedJoints: []
  }), []);

  // Sync data from database to form state when loaded
  useEffect(() => {
    if (examRecord?.examData) {
      setFormData({
        ...defaultFormData,
        ...examRecord.examData
      });
    } else if (!examLoading) {
      setFormData(defaultFormData);
    }
  }, [examRecord?.examData, examLoading, defaultFormData]);

  const handleSaveExam = async () => {
    if (!activeAppointmentId || activeAppointmentId === 'undefined') {
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
    if (!activeAppointmentId || activeAppointmentId === 'undefined') {
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

  const { currentAppointment } = useAppointmentDetail();

  const { data: historicalDates } = useExamHistoryDates('tmj', patientId);
  const visitDates = React.useMemo(() => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      if (dateString instanceof Date) {
        if (isNaN(dateString)) return '';
        return dateString.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
      if (typeof dateString === 'string') {
        const isMidnightUTC = dateString.endsWith('T00:00:00.000Z') || dateString.endsWith('T00:00:00Z');
        const isJustDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString.trim());
        
        if (isJustDate || isMidnightUTC) {
          const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (match) {
            const y = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const d = parseInt(match[3], 10);
            const localDate = new Date(y, m - 1, d, 12, 0, 0);
            return localDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          }
        }
        const parsedDate = new Date(dateString);
        if (!isNaN(parsedDate)) {
          return parsedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
      }
      return '';
    };

    const historyArray = historicalDates || [];
    const formattedHistory = historyArray.map(item => {
      const dateValue = typeof item === 'object' ? item.date : item;
      return {
        label: formatDate(dateValue) || 'Invalid Date',
        appointmentId: typeof item === 'object' ? item.appointmentId : null
      };
    });

    if (currentAppointment?.appointmentDate || currentAppointment?.date || currentAppointment?.AptDateTime) {
      const rawDate = currentAppointment.appointmentDate || currentAppointment.date || currentAppointment.AptDateTime;
      const formattedCurrent = formatDate(rawDate);
      if (formattedCurrent) {
        const currentApptId = currentAppointment.id || currentAppointment.AptNum || appointmentId;
        if (currentApptId && String(currentApptId) !== 'undefined') {
          const exists = formattedHistory.find(h => h.appointmentId === String(currentApptId));
          if (!exists) {
            formattedHistory.push({
              label: formattedCurrent,
              appointmentId: String(currentApptId)
            });
          }
        }
      }
    }

    return formattedHistory;
  }, [historicalDates, currentAppointment]);

  const handleCollapseAll = () => {
    const allCollapsed = Object.values(expandedSections).every(v => !v);
    if (allCollapsed) {
      setExpandedSections({
        rangeOfMotion: true,
        muscleEvaluation: true,
        jointEvaluation: true
      });
    } else {
      setExpandedSections({
        rangeOfMotion: false,
        muscleEvaluation: false,
        jointEvaluation: false
      });
    }
  };

  const handleNewExam = async () => {
    if (isSigned) {
      showSnackbar('Cannot create a new exam on a signed record', 'error');
      return;
    }
    setViewingAppointmentId(null);
    setFormData(defaultFormData);
    if (appointmentId) {
      try {
        await upsertMutation.mutateAsync({
          patientId: patientId ? String(patientId) : undefined,
          providerId: providerId ? String(providerId) : undefined,
          examData: defaultFormData
        });
        showSnackbar('New TMJ exam initialized', 'success');
      } catch (err) {
        showSnackbar(err.response?.data?.error?.message || 'Failed to initialize new exam', 'error');
      }
    }
  };

  const handleRemoveDate = (indexToRemove) => {
    // setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  if (examLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f9fafb', p: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <RadioExamHeader />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  const rangeOfMotionSummary = (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={getStatusIconStyle(Number(formData.maxOpening) >= 35 && Number(formData.maxOpening) <= 65 ? '#10b981' : '#ef4444')} />
        <Typography sx={{ fontSize: '13px', color: '#64748b', width: 220 }}>Max opening:</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{formData.maxOpening} mm</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={getStatusIconStyle(formData.deviationOnOpening === 'no' ? '#10b981' : '#ef4444')} />
        <Typography sx={{ fontSize: '13px', color: '#64748b', width: 220 }}>Deviation upon opening:</Typography>
        <PillToggle value={formData.deviationOnOpening} onChange={(val) => handleFieldChange('deviationOnOpening', val)} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={getStatusIconStyle(formData.restrictedHorizontal === 'no' ? '#10b981' : '#ef4444')} />
        <Typography sx={{ fontSize: '13px', color: '#64748b', width: 220 }}>Restricted Horizontal<br />movement:</Typography>
        <PillToggle value={formData.restrictedHorizontal} onChange={(val) => handleFieldChange('restrictedHorizontal', val)} />
      </Box>
    </Box>
  );

  const muscleEvaluationSummary = (
    <Box sx={{ display: 'flex', gap: 6, mb: 3 }}>
      <Box>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1, textTransform: 'uppercase' }}>Tenderness (Masseter / Temporalis)</Typography>
        <PillToggle value={formData.tenderness} onChange={(val) => handleFieldChange('tenderness', val)} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1, textTransform: 'uppercase' }}>Immobilization Test</Typography>
        <PillToggle value={formData.immobilizationTest} onChange={(val) => handleFieldChange('immobilizationTest', val)} options={[{ value: 'neg', label: 'Negative' }, { value: 'pos', label: 'Positive' }]} />
      </Box>
    </Box>
  );

  const jointEvaluationSummary = (
    <Box sx={{ display: 'flex', gap: 6, mb: 3 }}>
      <Box>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1, textTransform: 'uppercase' }}>Joint Sounds</Typography>
        <PillToggle value={formData.jointSounds} onChange={(val) => handleFieldChange('jointSounds', val)} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1, textTransform: 'uppercase' }}>Load Test</Typography>
        <PillToggle value={formData.loadTest} onChange={(val) => handleFieldChange('loadTest', val)} options={[{ value: 'neg', label: 'Negative' }, { value: 'pos', label: 'Positive' }]} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f9fafb' }}>

      {/* LEFT + CENTER COLUMN — Main Exam Content */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{
          backgroundColor: '#ffffff',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <RadioExamHeader />

          {/* Main content area */}
          <Box sx={{ px: 3, pb: 3, flex: 1, fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
            {isSigned && (
              <Alert severity="info" sx={{ mb: 2 }}>
                This exam has been signed and locked. It is now read-only.
              </Alert>
            )}

            {/* Timeline + Toolbar Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, mx: -3, px: 3, borderBottom: '1px solid #e0e0e0' }}>
              {/* Left: Visit dates timeline + New Exam */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', flex: 1 }}>
                <VisitDatesTimeline visitDates={visitDates} onDateClick={(id) => setViewingAppointmentId(id)} activeAppointmentId={activeAppointmentId} />
                <Button
                  startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    textTransform: 'none',
                    color: isSigned ? '#9ca3af' : '#2563eb',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    border: isSigned ? '1.5px dashed #e5e7eb' : '1.5px dashed #d1d5db',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    bgcolor: '#fff',
                    '&:hover': { bgcolor: '#f9fafb', borderColor: isSigned ? '#e5e7eb' : '#9ca3af' }
                  }}
                  onClick={handleNewExam}
                  disabled={isSigned}
                >
                  New Exam
                </Button>
              </Box>

              {/* Right: Search + Collapse all + Save Exam */}
              <ExamToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCollapseAll={handleCollapseAll}
                onSaveExam={handleSaveExam}
                isSigned={isSigned}
              />
            </Box>

            <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>


              {/* Accordion 1: Range of Motion */}
              <TMJSectionContainer
                title="1. Range of Motion"
                isExpanded={expandedSections.rangeOfMotion}
                onToggle={() => toggleSection('rangeOfMotion')}
              >
                <RangeOfMotionSection
                  formData={formData}
                  handleFieldChange={handleFieldChange}
                  handleCheckboxChange={handleCheckboxChange}
                  handleCheckboxArrayChange={handleCheckboxArrayChange}
                  summaryContent={rangeOfMotionSummary}
                />
              </TMJSectionContainer>

              {/* Accordion 2: Muscle Evaluation */}
              <TMJSectionContainer
                title="2. Muscle Evaluation"
                isExpanded={expandedSections.muscleEvaluation}
                onToggle={() => toggleSection('muscleEvaluation')}
              >
                <MuscleEvaluationSection
                  formData={formData}
                  handleFieldChange={handleFieldChange}
                  handleCheckboxChange={handleCheckboxChange}
                  toggleMuscleCircle={toggleMuscleCircle}
                  summaryContent={muscleEvaluationSummary}
                />
              </TMJSectionContainer>

              {/* Accordion 3: Joint Evaluation */}
              <TMJSectionContainer
                title="3. Joint Evaluation"
                isExpanded={expandedSections.jointEvaluation}
                onToggle={() => toggleSection('jointEvaluation')}
              >
                <JointEvaluationSection
                  formData={formData}
                  handleFieldChange={handleFieldChange}
                  handleCheckboxChange={handleCheckboxChange}
                  toggleJointCircle={toggleJointCircle}
                  summaryContent={jointEvaluationSummary}
                />
              </TMJSectionContainer>

            </fieldset>

            {/* Footer section */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Typography variant="body2" sx={{ display: 'inline', mr: 2, fontSize: '13px', color: '#0d477a', fontWeight: 500 }}>Additional Imaging required:</Typography>
                <Typography variant="body2" sx={{ display: 'inline', color: '#0d477a', fontStyle: 'italic', mr: 1, fontSize: '13px', fontWeight: 500 }}>MRI:</Typography>
                <FormControlLabel control={<Checkbox size="small" sx={{ color: '#8fa8c0', '&.Mui-checked': { color: '#0d477a' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#6388a8' }}>Left</Typography>} sx={{ mr: 2 }} />
                <FormControlLabel control={<Checkbox size="small" sx={{ color: '#8fa8c0', '&.Mui-checked': { color: '#0d477a' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#6388a8' }}>Right</Typography>} sx={{ mr: 2 }} />
                <FormControlLabel control={<Checkbox size="small" sx={{ color: '#8fa8c0', '&.Mui-checked': { color: '#0d477a' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#6388a8' }}>CBCT</Typography>} />
              </Box>

              <Box sx={{ mt: -4, mr: -1 }}>
                <ExamActionBar
                  isSigned={isSigned}
                  onSave={handleSaveExam}
                  onSign={handleSignExam}
                  onDelete={handleDeleteExam}
                  signDialogOpen={signDialogOpen}
                  onSignDialogClose={() => setSignDialogOpen(false)}
                  onConfirmSign={handleConfirmSign}
                  signLoading={signMutation.isPending}
                  deleteDialogOpen={deleteDialogOpen}
                  onDeleteDialogClose={() => setDeleteDialogOpen(false)}
                  onConfirmDelete={handleConfirmDelete}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT COLUMN — Task List + Messages Panel */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, width: { md: 260, lg: 300 }, flexShrink: 0, height: '100%', flexDirection: 'column' }}>
        <RightPanel hideAppointmentShortlist />
      </Box>
    </Box>
  );
};

export default DentalTmdExamPage;