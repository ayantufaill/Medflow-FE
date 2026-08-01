import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSystemSettings,
  updateSystemSetting,
  fetchRecareConfig,
  updateRecareConfig,
  selectSettingsMap,
  selectRecareConfig,
  selectLoadingSettings,
  selectLoadingRecare
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box, Typography, Grid } from '@mui/material';

import GeneralRecareConfig from '../../components/admin/clinical-management/recare/GeneralRecareConfig';
import ConfiguringStaging from '../../components/admin/clinical-management/recare/ConfiguringStaging';

const STAGING_PROCEDURES = [
  'Polishing', 'Prophy', 'Exam', 'BW', 'Fluoride', 'Pano/Fmx', 'Scaling', 'Maintenance', 'PA', 'TDS Membership', 'Additional2', 'Additional3'
];

const DEFAULT_STAGING_CONFIG = [
  { name: 'Stage 1', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'Stage 2', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'Stage 3', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'Stage 4', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'Maintenance', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'Healthy', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'Membership Renewal', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) },
  { name: 'New Stage', default: false, procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false })) }
];

const RecareConfiguration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const settingsMap = useSelector(selectSettingsMap);
  const recareConfig = useSelector(selectRecareConfig);
  const loadingSettings = useSelector(selectLoadingSettings);
  const loadingRecare = useSelector(selectLoadingRecare);
  const loading = loadingSettings || loadingRecare;

  const [activeTab, setActiveTab] = useState(0);
  const [autoCreate, setAutoCreate] = useState(true);
  const [procedures, setProcedures] = useState([]);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    dispatch(fetchSystemSettings());
    dispatch(fetchRecareConfig());
  }, [dispatch]);

  useEffect(() => {
    if (recareConfig) {
      setAutoCreate(recareConfig.autoReminder);
    }
  }, [recareConfig]);

  useEffect(() => {
    if (settingsMap) {
      if (settingsMap.clinical_recare_procedures) {
        try {
          setProcedures(JSON.parse(settingsMap.clinical_recare_procedures));
        } catch (e) {
          setProcedures([]);
        }
      } else {
        setProcedures([]);
      }

      if (settingsMap.clinical_recare_staging) {
        try {
          setStages(JSON.parse(settingsMap.clinical_recare_staging));
        } catch (e) {
          setStages(DEFAULT_STAGING_CONFIG);
        }
      } else {
        setStages(DEFAULT_STAGING_CONFIG);
      }
    } else {
      setProcedures([]);
      setStages(DEFAULT_STAGING_CONFIG);
    }
  }, [settingsMap]);

  const handleToggleAutoCreate = async (checked) => {
    setAutoCreate(checked);
    try {
      await dispatch(updateRecareConfig({ autoReminder: checked, intervalMonths: 6 })).unwrap();
      showSnackbar('General configuration updated', 'success');
    } catch (e) {
      console.error(e);
      showSnackbar('Failed to update general configuration', 'error');
    }
  };

  const updateProcedure = async (index, updates) => {
    const newList = [...procedures];
    newList[index] = { ...newList[index], ...updates };
    setProcedures(newList);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_recare_procedures', value: JSON.stringify(newList) })).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddStage = async () => {
    const newStage = {
      name: 'New Stage',
      default: false,
      procedures: STAGING_PROCEDURES.map(name => ({ name, frequency: 'Months', active: false }))
    };
    const newStages = [...stages, newStage];
    setStages(newStages);
    setActiveTab(newStages.length - 1);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_recare_staging', value: JSON.stringify(newStages) })).unwrap();
      showSnackbar('Stage added successfully', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStage = async (tabIndex) => {
    if (stages.length <= 1) {
      showSnackbar('Cannot delete the last stage', 'warning');
      return;
    }
    const newStages = stages.filter((_, idx) => idx !== tabIndex);
    setStages(newStages);
    setActiveTab(Math.max(0, tabIndex - 1));
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_recare_staging', value: JSON.stringify(newStages) })).unwrap();
      showSnackbar('Stage deleted successfully', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStageDetails = async (updates) => {
    const newStages = [...stages];
    if (updates.default) {
      newStages.forEach((s) => { s.default = false; });
    }
    newStages[activeTab] = { ...newStages[activeTab], ...updates };
    setStages(newStages);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_recare_staging', value: JSON.stringify(newStages) })).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStageProcedure = async (procName, procUpdates) => {
    const newStages = [...stages];
    const stage = newStages[activeTab];
    if (!stage) return;
    const procIndex = stage.procedures.findIndex(p => p.name === procName);
    if (procIndex > -1) {
      stage.procedures[procIndex] = { ...stage.procedures[procIndex], ...procUpdates };
    } else {
      stage.procedures.push({ name: procName, frequency: 'Months', active: false, ...procUpdates });
    }
    setStages(newStages);
    try {
      await dispatch(updateSystemSetting({ key: 'clinical_recare_staging', value: JSON.stringify(newStages) })).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>Recare Configuration</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
            Manage recare settings, general procedures, and periodontal staging configurations.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Loading configurations...</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Top Section: General Recare Configuration */}
          <GeneralRecareConfig 
            autoCreate={autoCreate} 
            handleToggleAutoCreate={handleToggleAutoCreate} 
            procedures={procedures} 
            updateProcedure={updateProcedure} 
          />

          {/* Bottom Section: Configuring Staging */}
          <ConfiguringStaging 
            stages={stages} 
            activeTab={activeTab} 
            handleTabChange={handleTabChange} 
            handleAddStage={handleAddStage} 
            handleDeleteStage={handleDeleteStage} 
            handleUpdateStageDetails={handleUpdateStageDetails} 
            handleUpdateStageProcedure={handleUpdateStageProcedure} 
            stagingProcedures={STAGING_PROCEDURES} 
          />
        </Box>
      )}
    </Box>
  );
};

export default RecareConfiguration;
