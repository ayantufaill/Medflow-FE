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
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Radio,
  RadioGroup,
  IconButton,
  Tabs,
  Tab,
  Switch,
  Select,
  MenuItem,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  KeyboardArrowDown as ExpandIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';


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
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Recare Configuration
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading configurations...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column: General Recare Configuration */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
              General Recare Configuration
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 1 }}>
              Automatically create recare plans using the default setting when needed, or uncheck it so recare plans are only created by you using the selected configuration.
            </Typography>
            <FormControlLabel
              control={<Checkbox size="small" checked={autoCreate} onChange={(e) => handleToggleAutoCreate(e.target.checked)} />}
              label={<Typography sx={{ fontSize: '0.75rem', color: '#666' }}>Automatically create recare plans</Typography>}
            />
            <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 2, mb: 1 }}>
              Configure and order the codes that you would like to include in your recare plan, the intervals used, and the procedures to trigger the reminders
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: '#333', textTransform: 'none', fontSize: '0.7rem', py: 0.5 }}>
                Update Recall Dates For All Patients
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#a0aec0', color: '#fff', textTransform: 'none', fontSize: '0.7rem', py: 0.5 }}>
                Update Recare Plans For All Patients
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                Drag and drop to rearrange <DragIcon sx={{ fontSize: '0.9rem' }} />
              </Typography>
            </Box>

            <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a3a6b' }}>Name</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a3a6b' }}>Intervals</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a3a6b' }}>Recall Trigger</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedures.map((row, index) => (
                    <TableRow key={index} sx={{ '& td': { py: 1.5 } }}>
                      <TableCell sx={{ fontSize: '0.75rem', color: '#333', fontWeight: 500 }}>{row.name}</TableCell>
                      <TableCell sx={{ width: 200 }}>
                        <TextField 
                          size="small" 
                          fullWidth 
                          value={row.intervals} 
                          onChange={(e) => updateProcedure(index, { intervals: e.target.value })}
                          sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5, backgroundColor: '#f8f9fa' } }} 
                        />
                        <RadioGroup 
                          row 
                          value={row.unit} 
                          onChange={(e) => updateProcedure(index, { unit: e.target.value })}
                          sx={{ mt: 0.5 }}
                        >
                          <FormControlLabel value="Days" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.65rem' }}>Days</Typography>} />
                          <FormControlLabel value="Months" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.65rem' }}>Months</Typography>} />
                        </RadioGroup>
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox 
                          size="small" 
                          checked={row.trigger} 
                          onChange={(e) => updateProcedure(index, { trigger: e.target.checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DragIcon sx={{ fontSize: '0.9rem', color: '#ccc', cursor: 'grab' }} />
                          <IconButton size="small"><ExpandIcon sx={{ fontSize: '1.2rem', color: '#999', border: '1px solid #eee', borderRadius: '50%' }} /></IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Right Column: Configuring Staging */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1rem' }}>
                Configuring Staging
              </Typography>
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleAddStage}
                sx={{ backgroundColor: '#0c345d', color: '#fff', textTransform: 'none', fontSize: '0.75rem' }}
              >
                + Add Stage
              </Button>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 0.5 }}>
              Customize the procedures and the intervals for each stage of periodontal disease (automatically calculated by Medflow)
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 2 }}>
              Create your own recare intervals and procedures for membership plans
            </Typography>

            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable" 
              scrollButtons="auto"
              sx={{ 
                minHeight: 32, 
                mb: 2,
                '& .MuiTab-root': { textTransform: 'none', fontSize: '0.7rem', minWidth: 60, minHeight: 32, p: 0.5, color: '#4a90e2' },
                '& .Mui-selected': { color: '#333 !important', backgroundColor: '#f0f0f0', borderRadius: '4px 4px 0 0' },
                '& .MuiTabs-indicator': { display: 'none' }
              }}
            >
              {stages.map((stage, idx) => (
                <Tab key={idx} label={stage.name} sx={stage.name === 'Healthy' ? { color: '#48bb78 !important' } : {}} />
              ))}
            </Tabs>

            {stages[activeTab] && (
              <Box sx={{ backgroundColor: '#f8f9fa', p: 1.5, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <TextField 
                    placeholder="New Stage" 
                    size="small" 
                    value={stages[activeTab].name}
                    onChange={(e) => handleUpdateStageDetails({ name: e.target.value })}
                    sx={{ flex: 1, backgroundColor: '#fff', '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }} 
                  />
                  <IconButton size="small" onClick={() => handleDeleteStage(activeTab)}>
                    <DeleteIcon sx={{ fontSize: '1.1rem', color: '#ccc' }} />
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        size="small" 
                        checked={stages[activeTab].default || false}
                        onChange={(e) => handleUpdateStageDetails({ default: e.target.checked })}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Default</Typography>}
                  />
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#333' }}>Procedure</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#333' }}>Frequency Interval</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {STAGING_PROCEDURES.map((proc, index) => {
                        const currentProc = stages[activeTab].procedures?.find(p => p.name === proc) || { name: proc, frequency: 'Months', active: false };
                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ fontSize: '0.75rem', color: '#333', fontWeight: 500 }}>{proc}</TableCell>
                            <TableCell sx={{ width: 100 }}>
                              <Select 
                                fullWidth 
                                size="small" 
                                variant="standard" 
                                value={currentProc.frequency || 'Months'}
                                onChange={(e) => handleUpdateStageProcedure(proc, { frequency: e.target.value })}
                                sx={{ fontSize: '0.7rem', backgroundColor: '#fff', border: '1px solid #eee', px: 1 }}
                              >
                                <MenuItem value="Months">Months</MenuItem>
                                <MenuItem value="Weeks">Weeks</MenuItem>
                                <MenuItem value="Days">Days</MenuItem>
                              </Select>
                            </TableCell>
                            <TableCell align="right">
                              <Switch 
                                size="small" 
                                checked={currentProc.active || false}
                                onChange={(e) => handleUpdateStageProcedure(proc, { active: e.target.checked })}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RecareConfiguration;
