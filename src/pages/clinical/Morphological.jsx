import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Box, Alert, Grid, CircularProgress } from '@mui/material';

import { RadioExamHeader } from "../../components/radiographic";
import RightPanel from '../../components/appointments/right-panel/RightPanel';
import MorphologicalHeader from "../../components/morphological/MorphologicalHeader";
import ShortMorphologicalAnalysis from "../../components/morphological/ShortMorphologicalAnalysis";
import OrthodonticClassification from "../../components/morphological/OrthodonticClassification";
import ToothPositionCard from "../../components/morphological/ToothPositionCard";
import MorphologicalActionBar from "../../components/morphological/MorphologicalActionBar";

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

const MORPHOLOGICAL_DATA = {
  canineClassification: [
    { value: '1', label: 'Class I' },
    { value: '2', label: 'Class II' },
    { value: '3', label: 'Class III' }
  ],
  posteriorCrossbite: [
    { value: 'none', label: 'None' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
  ],
  molarClassification: [
    { value: '1', label: 'Class I' },
    { value: '2', label: 'Class II' },
    { value: '3', label: 'Class III' }
  ],
  primaryMolarRelationship: [
    { value: 'straight', label: 'Straight' },
    { value: 'mesialStep', label: 'Mesial Step' },
    { value: 'distalStep', label: 'Distal Step' },
    { value: 'primateSpace', label: 'Primate Space' }
  ],
  anteriorToothShape: [
    { value: 'oval', label: 'Oval' },
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'triangular', label: 'Triangular' }
  ],
  midline: [
    { value: 'acceptable', label: 'Acceptable' },
    { value: 'right', label: 'Right' },
    { value: 'left', label: 'Left' }
  ],
  axialInclination: [
    { value: 'vertical', label: 'Vertical in the face' },
    { value: 'right', label: 'Right' },
    { value: 'left', label: 'Left' }
  ],
  toothPosition: [
    { id: 'crossBite', label: 'Cross Bite' },
    { id: 'openBite', label: 'Open Bite' },
    { id: 'crowdingOverlap', label: 'Crowding / Overlap' },
    { id: 'diastema', label: 'Diastema' },
    { id: 'rotation', label: 'Rotation' }
  ]
};

const Morphological = () => {
  const { showSnackbar } = useSnackbar();
  const patientId = useSelector(selectSelectedPatientId);
  const appointmentId = useSelector(selectSelectedAppointmentId);
  const providerId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('morphological', appointmentId);
  const upsertMutation = useUpsertClinicalExam('morphological', appointmentId);
  const signMutation = useSignClinicalExam('morphological', appointmentId);

  const isSigned = !!examRecord?.isSigned;
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { currentAppointment } = useAppointmentDetail();
  const { data: historicalDates } = useExamHistoryDates('morphological', patientId);

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

  const sessionState = useSelector(state => state.clinicalExamSession.exam.morphological);
  const dispatch = useDispatch();

  const formData = sessionState?.formData || {
    canineRight: '', canineLeft: '', posteriorCrossbite: [], overbite: 2, overbitePercent: '', overjet: 1,
    molarRight: '', molarLeft: '', primaryMolarRight: '', primaryMolarLeft: '', anteriorToothShape: '',
    midline: '', midlineMm: '', axialInclination: '',
    toothPosition: {
      crossBite: { value: '', selectedTeeth: [] }, openBite: { value: '', selectedTeeth: [] },
      crowdingOverlap: { value: '', selectedTeeth: [] }, diastema: { value: 'select', selectedTeeth: [] },
      rotation: { value: '', selectedTeeth: [] }
    },
    analysisRequired: false, analysisReferred: false, noFindings: false
  };

  const setFormData = (updater) => {
    const newVal = typeof updater === 'function' ? updater(formData) : updater;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'morphological', data: { formData: newVal } } });
  };

  useEffect(() => {
    if (examRecord?.examData) {
      setFormData(prev => ({ ...prev, ...examRecord.examData }));
    }
  }, [examRecord?.examData]);

  const handleFieldChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSaveExam = async () => {
    if (!appointmentId) return showSnackbar('No active appointment selected', 'error');
    try {
      await upsertMutation.mutateAsync({ patientId: patientId ? String(patientId) : undefined, providerId: providerId ? String(providerId) : undefined, examData: formData });
      showSnackbar('Morphological exam saved successfully', 'success');
    } catch (err) { showSnackbar(err.response?.data?.error?.message || 'Failed to save exam', 'error'); }
  };

  const handleSignExam = () => {
    if (!appointmentId) return showSnackbar('No active appointment selected', 'error');
    setSignDialogOpen(true);
  };

  const handleConfirmSign = async () => {
    setSignDialogOpen(false);
    try {
      await signMutation.mutateAsync();
      showSnackbar('Morphological exam signed and locked', 'success');
    } catch (err) { showSnackbar(err.response?.data?.error?.message || 'Failed to sign exam', 'error'); }
  };

  const handleDeleteExam = () => setDeleteDialogOpen(true);
  const handleConfirmDelete = () => { setDeleteDialogOpen(false); showSnackbar('Morphological exam deleted', 'info'); };
  const handleAddTeeth = (itemId) => console.log('Add teeth for:', itemId);
  const handleShowPhotos = () => console.log('Show patient photos');

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

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f9fafb' }}>

      {/* LEFT + CENTER COLUMN — Main Exam Content */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{
          backgroundColor: '#ffffff',
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <RadioExamHeader />

          <Box sx={{ px: 3, pb: 3, flex: 1, fontFamily: "'Inter', sans-serif" }}>
            {isSigned && (
              <Alert severity="info" sx={{ mb: 2 }}>
                This exam has been signed and locked. It is now read-only.
              </Alert>
            )}

            <MorphologicalHeader
              visitDates={visitDates}
              formData={formData}
              handleFieldChange={handleFieldChange}
            />

            <Box sx={{
              bgcolor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              overflow: 'hidden'
            }}>
              <Box component="fieldset" disabled={isSigned} sx={{ border: 'none', padding: 4, margin: 0, width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 6, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
                  {/* Left Side: Forms Container */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ShortMorphologicalAnalysis
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                      MORPHOLOGICAL_DATA={MORPHOLOGICAL_DATA}
                    />

                    <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e5e7eb' }}>
                      <OrthodonticClassification
                        formData={formData}
                        handleFieldChange={handleFieldChange}
                        MORPHOLOGICAL_DATA={MORPHOLOGICAL_DATA}
                      />
                    </Box>
                  </Box>

                  {/* Right Side: Tooth Position Widget */}
                  <Box sx={{ width: '402.13px', flexShrink: 0 }}>
                    <ToothPositionCard
                      formData={formData}
                      handleFieldChange={handleFieldChange}
                      MORPHOLOGICAL_DATA={MORPHOLOGICAL_DATA}
                      handleAddTeeth={handleAddTeeth}
                      handleShowPhotos={handleShowPhotos}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ px: 4, py: 3, borderTop: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
                <MorphologicalActionBar
                  isSigned={isSigned}
                  handleSaveExam={handleSaveExam}
                  handleSignExam={handleSignExam}
                  handleDeleteExam={handleDeleteExam}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT COLUMN — Task List + Messages Panel */}
      <Box sx={{ width: 300, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <RightPanel hideAppointmentShortlist />
      </Box>

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

export default Morphological;