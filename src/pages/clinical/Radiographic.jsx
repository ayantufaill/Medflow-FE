import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Button, Grid, CircularProgress, Alert
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  RadioExamHeader,
  FindingsSidebar,
  AdditionalTeethSection,
  ExamActionBar,
  ToothDetailsModal,
  ExamToolbar
} from "../../components/radiographic";
import InteractiveToothChart from '../../components/clinical/InteractiveToothChart';
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import RightPanel from '../../components/appointments/right-panel/RightPanel';
import { fontSize } from "../../constants/styles";
import { selectSelectedPatientId } from '../../store/slices/patientSlice';
import { selectSelectedAppointmentId } from '../../store/slices/appointmentSlice';
import {
  useClinicalExamQuery,
  useUpsertClinicalExam,
  useSignClinicalExam,
  useExamHistoryDates
} from '../../hooks/queries/useClinicalExam';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAppointmentDetail } from '../../hooks/redux/useAppointment';

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

  const uneruptedTeeth = sessionState?.uneruptedTeeth || [];
  const setUneruptedTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(uneruptedTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'radiographic', data: { uneruptedTeeth: newVal } } });
  };

  const [activeToothNum, setActiveToothNum] = React.useState(null);
  const [detailModalTooth, setDetailModalTooth] = React.useState(null);
  const [newNoteText, setNewNoteText] = React.useState('');
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // "No findings" toggle state for each sidebar section
  const [noFindings, setNoFindings] = useState({
    generalToothSurvey: false,
    coronalToothStructure: false,
    radicularToothStructure: false,
    supportingStructure: false
  });

  const toggleNoFindings = (section) => {
    setNoFindings(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync data from database to form state when loaded
  useEffect(() => {
    if (examRecord?.examData) {
      setSelectedTeeth(examRecord.examData.selectedTeeth || []);
      setMissingTeeth(examRecord.examData.missingTeeth || []);
      setToothFindings(examRecord.examData.toothFindings || {});
      setAdditionalTeeth(examRecord.examData.additionalTeeth || []);
      setUneruptedTeeth(examRecord.examData.uneruptedTeeth || []);
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
          additionalTeeth,
          uneruptedTeeth
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

  const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const LOWER_TEETH = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

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

  const handleToggleUnerupted = () => {
    if (selectedTeeth.length === 0) return;
    setUneruptedTeeth(prev => {
      const allSelectedAreUnerupted = selectedTeeth.every(t => prev.includes(t));
      if (allSelectedAreUnerupted) {
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
  const { currentAppointment } = useAppointmentDetail();

  const { data: historicalDates } = useExamHistoryDates('radiographic', patientId);
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

  // Toggle function for sections
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Collapse all sections
  const handleCollapseAll = () => {
    const allCollapsed = Object.values(expandedSections).every(v => !v);
    if (allCollapsed) {
      setExpandedSections({
        generalToothSurvey: true,
        coronalToothStructure: true,
        radicularToothStructure: true,
        supportingStructure: true
      });
    } else {
      setExpandedSections({
        generalToothSurvey: false,
        coronalToothStructure: false,
        radicularToothStructure: false,
        supportingStructure: false
      });
    }
  };

  // Handle new exam
  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    // setVisitDates([...visitDates, today]);
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
    // setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  if (examLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f7f8fa' }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <RadioExamHeader />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Box>
        <Box sx={{ width: 300, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column', pt: 1 }}>
          <RightPanel hideAppointmentShortlist />
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
          {/* Header: ClinicalNavbar + Title + ExamNavbar */}
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
                <VisitDatesTimeline visitDates={visitDates} />
                <Button 
                  startIcon={<AddIcon sx={{ fontSize: 18 }} />} 
                  sx={{ 
                    textTransform: 'none', 
                    color: '#2563eb', 
                    fontWeight: 600, 
                    fontSize: '0.8rem', 
                    whiteSpace: 'nowrap', 
                    flexShrink: 0,
                    border: '1.5px dashed #d1d5db',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    bgcolor: '#fff',
                    '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' }
                  }}
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

            {/* Main 2-Column Layout: Findings Sidebar + Tooth Chart */}
            <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                {/* Left Column - Findings Sidebar */}
                <FindingsSidebar
                  selectedTeeth={selectedTeeth}
                  onToggleUnerupted={handleToggleUnerupted}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  missingTeeth={missingTeeth}
                  onMissingTeethClick={handleMarkMissing}
                  toothFindings={toothFindings}
                  setToothFindings={setToothFindings}
                  setSelectedTeeth={setSelectedTeeth}
                  activeToothNum={activeToothNum}
                  setActiveToothNum={setActiveToothNum}
                  noFindings={noFindings}
                  toggleNoFindings={toggleNoFindings}
                />

                {/* Center Column - Tooth Chart */}
                <Box sx={{ position: 'relative', bgcolor: '#fff', flexGrow: 1, minWidth: 0 }}>
                  <InteractiveToothChart
                    selectedTeeth={selectedTeeth}
                    missingTeeth={missingTeeth}
                    uneruptedTeeth={uneruptedTeeth}
                    toothFindings={toothFindings}
                    onToothClick={handleToothClick}
                    onSidebarSurfaceClick={handleSidebarSurfaceClick}
                    onMaxToggle={handleMaxToggle}
                    onManToggle={handleManToggle}
                    isTreatmentPlan={false}
                  />

                  <AdditionalTeethSection
                    additionalTeeth={additionalTeeth}
                    setAdditionalTeeth={setAdditionalTeeth}
                  />

                  {/* Bottom Action Buttons (Save / Sign & Finalize / Delete) */}
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
            </fieldset>
          </Box>
        </Box>
      </Box>

      {/* RIGHT COLUMN — Task List + Messages Panel */}
      <Box sx={{ width: 300, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <RightPanel hideAppointmentShortlist />
      </Box>

      {/* Tooth Details Modal */}
      <ToothDetailsModal
        detailModalTooth={detailModalTooth}
        toothFindings={toothFindings}
        onClose={() => setDetailModalTooth(null)}
        newNoteText={newNoteText}
        onNoteTextChange={setNewNoteText}
        onAddNote={handleAddNewNote}
      />
    </Box>
  );
};

export default Radiographic;