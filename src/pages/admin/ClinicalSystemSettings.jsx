import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSystemSettings, 
  updateSystemSetting,
  selectSettingsMap,
  selectLoadingSettings
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box, Typography } from '@mui/material';

import DirectionSettings from '../../components/admin/clinical-management/system-settings/DirectionSettings';
import PerioChartingSettings from '../../components/admin/clinical-management/system-settings/PerioChartingSettings';
import ProgressNotesSettings from '../../components/admin/clinical-management/system-settings/ProgressNotesSettings';
import TreatmentPlanSettings from '../../components/admin/clinical-management/system-settings/TreatmentPlanSettings';
import PediatricExamSettings from '../../components/admin/clinical-management/system-settings/PediatricExamSettings';
import AISettings from '../../components/admin/clinical-management/system-settings/AISettings';

const ClinicalSystemSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const settingsMap = useSelector(selectSettingsMap);
  const loading = useSelector(selectLoadingSettings);

  // State for all settings
  const [directions, setDirections] = useState({
    maxFacial: 'Left to right',
    maxPalatal: 'Right to left',
    manFacial: 'Left to right',
    manLingual: 'Right to left',
  });

  const [perio, setPerio] = useState({
    gingiva: 'One',
    recession: 'One',
    attachedGingiva: true,
    probingDepthLimit: '4',
  });

  const [progressNotes, setProgressNotes] = useState({
    showWarning: true,
    lockDays: '7',
  });

  const [treatmentPlan, setTreatmentPlan] = useState({
    defaultState: 'Diagnosed',
    hideFeeAndProvider: false,
  });

  const [pediatric, setPediatric] = useState({
    activateExam: true,
  });

  const [aiPrompt, setAiPrompt] = useState(
    `# ROLE\nYou are an AI clinical assistant specializing in summarizing dental patient encounters.\nYour primary function is to transform conversational transcripts into concise, structured clinical notes.\n\n# INPUT\nA JSON transcript of a conversation between a dentist and a patient.`
  );
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const originalDirections = settingsMap?.clinical_directions_settings
    ? JSON.parse(settingsMap.clinical_directions_settings)
    : { maxFacial: 'Left to right', maxPalatal: 'Right to left', manFacial: 'Left to right', manLingual: 'Right to left' };

  const isDirectionsModified = JSON.stringify(directions) !== JSON.stringify(originalDirections);

  const originalAiPrompt = settingsMap?.clinical_ai_prompt_settings || `# ROLE\nYou are an AI clinical assistant specializing in summarizing dental patient encounters.\nYour primary function is to transform conversational transcripts into concise, structured clinical notes.\n\n# INPUT\nA JSON transcript of a conversation between a dentist and a patient.`;

  const isAiPromptModified = aiPrompt !== originalAiPrompt;

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settingsMap) {
      if (settingsMap.clinical_directions_settings) {
        try {
          setDirections(JSON.parse(settingsMap.clinical_directions_settings));
        } catch(e) {}
      }
      if (settingsMap.clinical_perio_settings) {
        try {
          setPerio(JSON.parse(settingsMap.clinical_perio_settings));
        } catch(e) {}
      }
      if (settingsMap.clinical_progress_notes_settings) {
        try {
          setProgressNotes(JSON.parse(settingsMap.clinical_progress_notes_settings));
        } catch(e) {}
      }
      if (settingsMap.clinical_treatment_plan_settings) {
        try {
          setTreatmentPlan(JSON.parse(settingsMap.clinical_treatment_plan_settings));
        } catch(e) {}
      }
      if (settingsMap.clinical_pediatric_settings) {
        try {
          setPediatric(JSON.parse(settingsMap.clinical_pediatric_settings));
        } catch(e) {}
      }
      if (settingsMap.clinical_ai_prompt_settings) {
        setAiPrompt(settingsMap.clinical_ai_prompt_settings);
      }
    }
  }, [settingsMap]);

  const handleDirectionChange = (key, value) => {
    setDirections((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDirections = async () => {
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_directions_settings', value: JSON.stringify(directions) })).unwrap();
      showSnackbar('Direction settings saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to save direction settings', 'error');
    }
  };

  const handlePerioChange = async (updates) => {
    const newPerio = { ...perio, ...updates };
    setPerio(newPerio);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_perio_settings', value: JSON.stringify(newPerio) })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleProgressNotesChange = async (updates) => {
    const newProgressNotes = { ...progressNotes, ...updates };
    setProgressNotes(newProgressNotes);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_progress_notes_settings', value: JSON.stringify(newProgressNotes) })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTreatmentPlanChange = async (updates) => {
    const newTreatmentPlan = { ...treatmentPlan, ...updates };
    setTreatmentPlan(newTreatmentPlan);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_treatment_plan_settings', value: JSON.stringify(newTreatmentPlan) })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePediatricChange = async (updates) => {
    const newPediatric = { ...pediatric, ...updates };
    setPediatric(newPediatric);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_pediatric_settings', value: JSON.stringify(newPediatric) })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleEditPrompt = async () => {
    if (isEditingPrompt) {
      try {
        await dispatch(updateSystemSetting({ key: 'clinical_ai_prompt_settings', value: aiPrompt })).unwrap();
        showSnackbar('AI prompt saved successfully', 'success');
      } catch (error) {
        console.error(error);
        showSnackbar('Failed to save AI prompt', 'error');
      }
    }
    setIsEditingPrompt(!isEditingPrompt);
  };

  const handleResetPrompt = async () => {
    const defaultPrompt = `# ROLE\nYou are an AI clinical assistant specializing in summarizing dental patient encounters.\nYour primary function is to transform conversational transcripts into concise, structured clinical notes.\n\n# INPUT\nA JSON transcript of a conversation between a dentist and a patient.`;
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_ai_prompt_settings', value: defaultPrompt })).unwrap();
      setAiPrompt(defaultPrompt);
      setIsEditingPrompt(false);
      showSnackbar('AI prompt reset to default', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to reset AI prompt', 'error');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>System Settings</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
            Manage clinical system configurations. Changes here will not override user custom settings.
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ px: 4 }}>
        <DirectionSettings 
          directions={directions} 
          handleDirectionChange={handleDirectionChange} 
          handleSaveDirections={handleSaveDirections} 
          isModified={isDirectionsModified}
        />
        <PerioChartingSettings 
          perio={perio} 
          handlePerioChange={handlePerioChange} 
        />
        <ProgressNotesSettings 
          progressNotes={progressNotes} 
          handleProgressNotesChange={handleProgressNotesChange} 
        />
        <TreatmentPlanSettings 
          treatmentPlan={treatmentPlan} 
          handleTreatmentPlanChange={handleTreatmentPlanChange} 
        />
        <PediatricExamSettings 
          pediatric={pediatric} 
          handlePediatricChange={handlePediatricChange} 
        />
        <AISettings 
          aiPrompt={aiPrompt} 
          setAiPrompt={setAiPrompt} 
          isEditingPrompt={isEditingPrompt} 
          handleToggleEditPrompt={handleToggleEditPrompt} 
          handleResetPrompt={handleResetPrompt} 
          isAiPromptModified={isAiPromptModified}
        />
      </Box>
    </Box>
  );
};

export default ClinicalSystemSettings;
