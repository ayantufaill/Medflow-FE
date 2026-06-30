import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Radio, RadioGroup, FormControlLabel,
  Button, Select, MenuItem, Grid, Divider, Tabs, Tab, IconButton, Checkbox,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogContent, TextField, Stack,
  CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PrintIcon from '@mui/icons-material/Print';
import MicIcon from '@mui/icons-material/Mic';
import AddIcon from '@mui/icons-material/Add';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import PerioChartGrid from "../../components/clinical/PerioChartGrid";
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

const SummaryData = [
  { label: '# of sites', bleeding: '50', p4: '150', p5: '0', p6: '0', recession: '43' },
  { label: '% of sites', bleeding: '33%', p4: '100%', p5: '0%', p6: '0%', recession: '28%' },
  { label: '# of teeth', bleeding: '15', p4: '25', p5: '0', p6: '0', recession: '14' },
  { label: '% of teeth', bleeding: '60%', p4: '100%', p5: '0%', p6: '0%', recession: '56%' },
];

const DiagnosticHeader = () => {
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [distribution, setDistribution] = useState('Localized');

  return (
  <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e0e0e0' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      {/* 3. MH/DH Badges */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>MH</Typography>
              <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>DH</Typography>
            </Box>
      <IconButton size="small"><PrintIcon sx={{ fontSize: 18, color: '#999' }} /></IconButton>
    </Box>

    <Grid container spacing={4}>
      {/* Classification Column */}
      <Grid item xs={12} md={5}>
        <RadioGroup row value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)}>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <FormControlLabel value="Healthy" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Healthy</Typography>} />
            <FormControlLabel value="Gingivitis" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Gingivitis</Typography>} />
          </Box>
        </RadioGroup>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.xs }}>Periodontitis:</Typography>
          <Select 
            size="small" 
            value="stage2" 
            sx={{ 
              height: 24, 
              fontSize: fontSize.xs, 
              minWidth: 100,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              borderBottom: '1px solid #9ca3af',
              borderRadius: 0,
              '& .MuiSvgIcon-root': { fontSize: '1rem' }
            }} 
          >
            <MenuItem value="stage2" sx={{ fontSize: fontSize.xs }}>stage II</MenuItem>
          </Select>
        </Box>

        <RadioGroup row value={distribution} onChange={(e) => setDistribution(e.target.value)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
            <FormControlLabel value="Localized" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Localized (&lt; 30% of teeth)</Typography>} />
            <FormControlLabel value="Generalized" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Generalized</Typography>} />
            <FormControlLabel value="Molar/Incisor" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Molar/Incisor</Typography>} />
          </Box>
        </RadioGroup>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.xs }}>Periodontal Grading:</Typography>
          <Select 
            size="small" 
            value="gradeB" 
            sx={{ 
              height: 24, 
              fontSize: fontSize.xs, 
              minWidth: 100,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              borderBottom: '1px solid #9ca3af',
              borderRadius: 0,
              '& .MuiSvgIcon-root': { fontSize: '1rem' }
            }} 
          >
            <MenuItem value="gradeB" sx={{ fontSize: fontSize.xs }}>grade B</MenuItem>
          </Select>
        </Box>
      </Grid>

      {/* Summary Table Column */}
      <Grid item xs={12} md={7}>
        <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, display: 'block', mb: 1, fontSize: fontSize.xs }}>Summary</Typography>
        <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: fontSize.xs, py: 0.5, borderBottom: 'none' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }} />
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Bleeding</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Probing ≤ 4mm</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Probing 5mm</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Probing ≥ 6mm</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Recession</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SummaryData.map((row, idx) => (
              <TableRow key={idx} sx={{ borderTop: (idx === 0 || idx === 2) ? '1px solid #f0f0f0' : 'none' }}>
                <TableCell sx={{ color: '#999', fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.label}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.bleeding}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.p4}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.p5}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.p6}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.recession}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  </Box>
  );
};

const MISSING_TEETH = [1, 12, 16, 17, 32];

const initialToothData = () => {
  const data = {};
  for (let i = 1; i <= 32; i++) {
    const isMissing = MISSING_TEETH.includes(i);
    data[i] = {
      facial: {
        mobility: isMissing ? 'none' : (i % 5 === 0 ? '1' : 'none'),
        furcation: isMissing ? 'none' : (i % 7 === 0 ? '1' : 'none'),
        bleeding: isMissing ? [] : (i % 3 === 0 ? [0] : []),
        pcs: isMissing ? [] : (i % 2 === 0 ? ['P', 'S'] : ['C']),
        recession: isMissing ? ['', '', ''] : (i % 4 === 0 ? ['2', '3', '2'] : ['', '', '']),
        probe: isMissing ? ['', '', ''] : [String((i % 3) + 2), String((i % 2) + 2), String((i % 4) + 2)],
        attachment: isMissing ? ['', '', ''] : ['', '', '']
      },
      lingual: {
        mobility: isMissing ? 'none' : (i % 5 === 0 ? '1' : 'none'),
        furcation: isMissing ? 'none' : (i % 7 === 0 ? '1' : 'none'),
        bleeding: isMissing ? [] : (i % 3 === 0 ? [0] : []),
        pcs: isMissing ? [] : (i % 2 === 0 ? ['P', 'S'] : ['C']),
        recession: isMissing ? ['', '', ''] : (i % 4 === 0 ? ['2', '3', '2'] : ['', '', '']),
        probe: isMissing ? ['', '', ''] : [String((i % 3) + 2), String((i % 2) + 2), String((i % 4) + 2)],
        attachment: isMissing ? ['', '', ''] : ['', '', '']
      }
    };
    
    // Calculate attachment loss
    if (!isMissing) {
      for (const side of ['facial', 'lingual']) {
        const sideData = data[i][side];
        sideData.attachment = sideData.probe.map((pVal, idx) => {
          const rVal = sideData.recession[idx] || '0';
          if (!pVal) return '';
          return String(parseInt(pVal) + parseInt(rVal));
        });
      }
    }
  }
  return data;
};

const PeriodontalExamPage = () => {
  const { showSnackbar } = useSnackbar();
  const patientId = useSelector(selectSelectedPatientId);
  const appointmentId = useSelector(selectSelectedAppointmentId);
  const providerId = useSelector(state => state.auth.user?.providerId || state.auth.user?.id || state.auth.user?._id);
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('periodontal', appointmentId);
  const upsertMutation = useUpsertClinicalExam('periodontal', appointmentId);
  const signMutation = useSignClinicalExam('periodontal', appointmentId);

  const isSigned = !!examRecord?.isSigned;

  const sessionState = useSelector(state => state.clinicalExamSession.exam.periodontal);
  const dispatch = useDispatch();

  const { currentAppointment } = useAppointment();

  const { data: historicalDates } = useExamHistoryDates('periodontal', patientId);
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

  const [showSettings, setShowSettings] = useState(false);
  
  const defaultSettings = {
    probing: ['3', '2', '3'],
    recession: ['', '1', ''],
    recessionPresent: false,
    attachedGingiva: ['', '', ''],
    mobility: 'none',
    bleeding: [0, 2], // indices of bleeding sites
    bleedingPresent: false,
    pcs: ['P', 'C', 'S']
  };
  
  const settings = sessionState?.settings || defaultSettings;
  const setSettings = (val) => {
    const newVal = typeof val === 'function' ? val(settings) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'periodontal', data: { settings: newVal } } });
  };

  const defaultChartData = initialToothData();
  const chartData = sessionState?.chartData || defaultChartData;
  const setChartData = (val) => {
    const newVal = typeof val === 'function' ? val(chartData) : val;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'periodontal', data: { chartData: newVal } } });
  };

  // Sync data from database to form state when loaded
  useEffect(() => {
    // Only load from DB if we haven't already populated Redux (or if we want DB to take precedence on initial load)
    // For now, we update Redux with DB data if it arrives
    if (examRecord?.examData && examRecord.examData.chartData) {
      setChartData(examRecord.examData.chartData);
    }
    if (examRecord?.examData && examRecord.examData.settings) {
      setSettings(examRecord.examData.settings);
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
        examData: { chartData, settings }
      });
      showSnackbar('Periodontal exam saved successfully', 'success');
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
      showSnackbar('Periodontal exam signed and locked', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to sign exam', 'error');
    }
  };

  const handleRemoveDate = (indexToRemove) => {
    // setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    // setVisitDates([...visitDates, today]);
  };

  const handleSetProbing = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].probe = [...settings.probing];
          updated[i][side].attachment = settings.probing.map((p, idx) => {
            const r = updated[i][side].recession[idx] || '0';
            if (!p) return '';
            return String(parseInt(p) + parseInt(r));
          });
        }
      }
      return updated;
    });
  };

  const handleClearProbing = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].probe = ['', '', ''];
          updated[i][side].attachment = ['', '', ''];
        }
      }
      return updated;
    });
  };

  const handleSetRecession = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].recession = [...settings.recession];
          updated[i][side].attachment = updated[i][side].probe.map((p, idx) => {
            const r = settings.recession[idx] || '0';
            if (!p) return '';
            return String(parseInt(p) + parseInt(r));
          });
        }
      }
      return updated;
    });
  };

  const handleClearRecession = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].recession = ['', '', ''];
          updated[i][side].attachment = updated[i][side].probe.map((p, idx) => {
            if (!p) return '';
            return p;
          });
        }
      }
      return updated;
    });
  };

  const handleSetBleeding = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].bleeding = [...settings.bleeding];
        }
      }
      return updated;
    });
  };

  const handleClearBleeding = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].bleeding = [];
        }
      }
      return updated;
    });
  };

  const handleSetPCS = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].pcs = [...settings.pcs];
        }
      }
      return updated;
    });
  };

  const handleClearPCS = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].pcs = [];
        }
      }
      return updated;
    });
  };

  const handleSetMobility = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].mobility = settings.mobility;
        }
      }
      return updated;
    });
  };

  const handleClearMobility = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].mobility = 'none';
        }
      }
      return updated;
    });
  };

  const handleSetAttachedGingiva = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          // Setting 'attachment' field in the chart based on attachedGingiva defaults
          updated[i][side].attachment = [...settings.attachedGingiva];
        }
      }
      return updated;
    });
  };

  const handleClearAttachedGingiva = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (MISSING_TEETH.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          updated[i][side].attachment = ['', '', ''];
        }
      }
      return updated;
    });
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
      <Box sx={{ p: 3, bgcolor: '#fff', minHeight: '100vh' }}>
        {isSigned && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This exam has been signed and locked. It is now read-only.
          </Alert>
        )}
        
        {/* 1. TIMELINE HEADER */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2, overflowX: 'auto' }}>
          <IconButton size="small" sx={{ flexShrink: 0 }}><ArrowBackIosNewIcon sx={{ fontSize: 16 }} /></IconButton>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <VisitDatesTimeline
              visitDates={visitDates}
            />
            <Button 
              startIcon={<AddIcon />} 
              sx={{ textTransform: 'none', color: '#777', fontSize: fontSize.xs, whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              New Exam
            </Button>
          </Box>
          <IconButton size="small" sx={{ flexShrink: 0 }}><ArrowForwardIosIcon sx={{ fontSize: 16 }} /></IconButton>
          
          <Box sx={{ ml: 4, display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <IconButton 
              onClick={() => setShowSettings(true)}
              sx={{ 
                p: 0.5, 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <SettingsIcon sx={{ fontSize: 20, color: '#555' }} />
            </IconButton>
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#003366', textTransform: 'none', fontSize: fontSize.sm, px: 3, fontWeight: fontWeight.semibold }}
            >
              Compare
            </Button>
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#d4a373', textTransform: 'none', borderRadius: 2, fontSize: fontSize.sm, px: 3, fontWeight: fontWeight.semibold }}
            >
              New Perio Chart ▾
            </Button>
          </Box>
        </Box>

        <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%' }}>

        {/* 2. DIAGNOSTIC SECTION */}
        <DiagnosticHeader />

        {/* 3. TABS HEADER */}
        <Box sx={{ mt: 4, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Tabs value={0} sx={{ minHeight: 0 }}>
            <Tab label="PERIO CHART" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, minWidth: 100 }} />
            <Tab label="PERIO GRAPH" sx={{ fontSize: fontSize.xs, color: '#ccc', minWidth: 100 }} />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
            <FormControlLabel 
              control={<Checkbox size="small" />} 
              label={<Typography variant="caption" color="textSecondary" sx={{ fontSize: fontSize.xs }}>Enable System Talk Back</Typography>} 
            />
            <Typography variant="caption" sx={{ color: '#4472c4', textDecoration: 'underline', cursor: 'pointer', fontSize: fontSize.xs }}>Voice Commands Guide</Typography>
            <Box sx={{ bgcolor: '#e3d5ca', p: 0.5, borderRadius: '50%' }}><MicIcon sx={{ color: 'white', fontSize: 20 }} /></Box>
          </Box>
        </Box>

        {/* 4. PERIO CHART GRID */}
        <PerioChartGrid chartData={chartData} setChartData={setChartData} missingTeeth={MISSING_TEETH} />

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

      </Box>

      {/* Perio Defaults Dialog */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflow: 'hidden'
          }
        }}
      >
        {/* Title Bar */}
        <Box sx={{ bgcolor: '#4a70bc', py: 1.5, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
            Perio Defaults
          </Typography>
          <IconButton 
            onClick={() => setShowSettings(false)}
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          {/* Section Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem', mb: 0.5 }}>
              Set defaults
            </Typography>
            <Divider sx={{ borderBottomWidth: 1.5, borderColor: '#ccc', width: '150px' }} />
          </Box>

          <Stack spacing={3.5}>
            {/* Probing Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ width: 140, fontSize: '0.85rem', color: '#333' }}>Probing</Typography>
              <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                {[0, 1, 2].map(idx => (
                  <TextField
                    key={idx}
                    value={settings.probing[idx]}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1).replace(/[^0-9]/g, '');
                      setSettings(prev => {
                        const nextProbing = [...prev.probing];
                        nextProbing[idx] = val;
                        return { ...prev, probing: nextProbing };
                      });
                    }}
                    inputProps={{ style: { textAlign: 'center', padding: '4px', fontSize: '0.85rem' } }}
                    sx={{ width: 32, '& .MuiOutlinedInput-root': { borderRadius: '2px', bgcolor: '#fff' } }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ width: 150, justifyContent: 'flex-end' }}>
                <Typography onClick={handleSetProbing} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Set</Typography>
                <Typography onClick={handleClearProbing} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Clear all</Typography>
              </Stack>
            </Stack>

            {/* Recession Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ width: 140, fontSize: '0.85rem', color: '#333' }}>Recession</Typography>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
                <TextField
                  value={settings.recession[1]}
                  onChange={(e) => {
                    const val = e.target.value.slice(-1).replace(/[^0-9]/g, '');
                    setSettings(prev => {
                      const nextRec = [...prev.recession];
                      nextRec[1] = val;
                      return { ...prev, recession: nextRec };
                    });
                  }}
                  inputProps={{ style: { textAlign: 'center', padding: '4px', fontSize: '0.85rem' } }}
                  sx={{ width: 32, '& .MuiOutlinedInput-root': { borderRadius: '2px', bgcolor: '#fff' } }}
                />
                <FormControlLabel
                  control={
                    <Radio 
                      size="small" 
                      checked={settings.recessionPresent} 
                      onClick={() => setSettings(prev => ({ ...prev, recessionPresent: !prev.recessionPresent }))} 
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Present</Typography>}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ width: 150, justifyContent: 'flex-end' }}>
                <Typography onClick={handleSetRecession} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Set</Typography>
                <Typography onClick={handleClearRecession} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Clear all</Typography>
              </Stack>
            </Stack>

            {/* Attached Gingiva Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ width: 140, fontSize: '0.85rem', color: '#333' }}>Attached Gingiva</Typography>
              <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                {[0, 1, 2].map(idx => (
                  <TextField
                    key={idx}
                    value={settings.attachedGingiva[idx]}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1).replace(/[^0-9]/g, '');
                      setSettings(prev => {
                        const nextGing = [...prev.attachedGingiva];
                        nextGing[idx] = val;
                        return { ...prev, attachedGingiva: nextGing };
                      });
                    }}
                    inputProps={{ style: { textAlign: 'center', padding: '4px', fontSize: '0.85rem' } }}
                    sx={{ width: 32, '& .MuiOutlinedInput-root': { borderRadius: '2px', bgcolor: '#fff' } }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ width: 150, justifyContent: 'flex-end' }}>
                <Typography onClick={handleSetAttachedGingiva} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Set</Typography>
                <Typography onClick={handleClearAttachedGingiva} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Clear all</Typography>
              </Stack>
            </Stack>

            {/* Mobility Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ width: 140, fontSize: '0.85rem', color: '#333' }}>Mobility</Typography>
              <Box sx={{ flex: 1 }}>
                <Select
                  size="small"
                  value={settings.mobility}
                  onChange={(e) => setSettings(prev => ({ ...prev, mobility: e.target.value }))}
                  sx={{ height: 28, fontSize: '0.8rem', minWidth: 80, borderRadius: '2px' }}
                >
                  <MenuItem value="none">none</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
              </Box>
              <Stack direction="row" spacing={2} sx={{ width: 150, justifyContent: 'flex-end' }}>
                <Typography onClick={handleSetMobility} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Set</Typography>
                <Typography onClick={handleClearMobility} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Clear all</Typography>
              </Stack>
            </Stack>

            {/* Bleeding Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ width: 140, fontSize: '0.85rem', color: '#333' }}>Bleeding</Typography>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1}>
                  {[0, 1, 2].map(idx => {
                    const isRed = settings.bleeding.includes(idx);
                    return (
                      <Box
                        key={idx}
                        onClick={() => {
                          setSettings(prev => {
                            const nextBleeding = prev.bleeding.includes(idx)
                              ? prev.bleeding.filter(i => i !== idx)
                              : [...prev.bleeding, idx];
                            return { ...prev, bleeding: nextBleeding };
                          });
                        }}
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: isRed ? '#e74c3c' : 'transparent',
                          border: '1px solid #ccc',
                          borderRadius: '2px',
                          cursor: 'pointer'
                        }}
                      />
                    );
                  })}
                </Stack>
                <FormControlLabel
                  control={
                    <Radio 
                      size="small" 
                      checked={settings.bleedingPresent} 
                      onClick={() => setSettings(prev => ({ ...prev, bleedingPresent: !prev.bleedingPresent }))} 
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Present</Typography>}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ width: 150, justifyContent: 'flex-end' }}>
                <Typography onClick={handleSetBleeding} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Set</Typography>
                <Typography onClick={handleClearBleeding} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Clear all</Typography>
              </Stack>
            </Stack>

            {/* PCS Row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ width: 140, fontSize: '0.85rem', color: '#333' }}>PCS</Typography>
              <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                {['P', 'C', 'S'].map(char => {
                  const isActive = settings.pcs.includes(char);
                  return (
                    <Box
                      key={char}
                      onClick={() => {
                        setSettings(prev => {
                          const nextPCS = prev.pcs.includes(char)
                            ? prev.pcs.filter(c => c !== char)
                            : [...prev.pcs, char];
                          return { ...prev, pcs: nextPCS };
                        });
                      }}
                      sx={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isActive ? '#f39c12' : 'transparent',
                        border: '1px solid #ccc',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        color: isActive ? 'white' : '#999',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {char}
                    </Box>
                  );
                })}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ width: 150, justifyContent: 'flex-end' }}>
                <Typography onClick={handleSetPCS} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Set</Typography>
                <Typography onClick={handleClearPCS} sx={{ fontSize: '0.85rem', color: '#e74c3c', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Clear all</Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Dialog Footer Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              onClick={() => setShowSettings(false)}
              variant="contained"
              sx={{
                bgcolor: '#888',
                '&:hover': { bgcolor: '#777' },
                textTransform: 'none',
                borderRadius: '4px',
                px: 3
              }}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
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
    </Box>
  );
};

export default PeriodontalExamPage;