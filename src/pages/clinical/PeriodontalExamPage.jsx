import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Radio, RadioGroup, FormControlLabel,
  Button, Select, Menu, MenuItem, Grid, Divider, Tabs, Tab, IconButton, Checkbox,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, TextField, Stack,
  CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PrintIcon from '@mui/icons-material/Print';
import MicIcon from '@mui/icons-material/Mic';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import settingIcon from "../../assets/clinicalicons/setting icon.svg";
import printIcon from "../../assets/clinicalicons/print icon.svg";
import compareIcon from "../../assets/clinicalicons/compare icon.svg";
import voiceIcon from "../../assets/clinicalicons/voice.svg";
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import PerioChartGrid from "../../components/clinical/PerioChartGrid";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import ExamActionBar from "../../components/radiographic/ExamActionBar";
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
import DiagnosisCard from "../../components/clinical/periodontal/DiagnosisCard";
import SummaryCard from "../../components/clinical/periodontal/SummaryCard";
import PeriographTab from "../../components/clinical/periodontal/PeriographTab";
import RightPanel from '../../components/appointments/right-panel/RightPanel';


const initialToothData = (missingTeeth = []) => {
  const data = {};
  for (let i = 1; i <= 32; i++) {
    const isMissing = missingTeeth.includes(i);
    data[i] = {
      facial: {
        mobility: 'none',
        furcation: 'none',
        bleeding: [0, 2],
        pcs: ['P', 'C', 'S'],
        recession: ['', '1', ''],
        probe: ['3', '2', '3'],
        attachment: ['3', '3', '3']
      },
      lingual: {
        mobility: 'none',
        furcation: 'none',
        bleeding: [0, 2],
        pcs: ['P', 'C', 'S'],
        recession: ['', '1', ''],
        probe: ['3', '2', '3'],
        attachment: ['3', '3', '3']
      }
    };
    
    // Calculate attachment loss
    for (const side of ['facial', 'lingual']) {
      const sideData = data[i][side];
      sideData.attachment = sideData.probe.map((pVal, idx) => {
        const rVal = sideData.recession[idx] || '0';
        if (!pVal) return '';
        return String(parseInt(pVal) + parseInt(rVal));
      });
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [viewingAppointmentId, setViewingAppointmentId] = useState(null);
  const activeAppointmentId = viewingAppointmentId && viewingAppointmentId !== 'undefined' 
    ? String(viewingAppointmentId) 
    : (appointmentId && String(appointmentId) !== 'undefined' ? String(appointmentId) : null);

  const { data: examRecord, isLoading: examLoading } = useClinicalExamQuery('periodontal', activeAppointmentId);
  const upsertMutation = useUpsertClinicalExam('periodontal', activeAppointmentId);
  const radiographicUpsertMutation = useUpsertClinicalExam('radiographic', activeAppointmentId);
  const signMutation = useSignClinicalExam('periodontal', activeAppointmentId);

  const isSigned = !!examRecord?.isSigned;

  const sessionState = useSelector(state => state.clinicalExamSession.exam.periodontal);
  const dispatch = useDispatch();

  const { data: radiographicRecord } = useClinicalExamQuery('radiographic', activeAppointmentId);
  const missingTeeth = (radiographicRecord?.examData?.missingTeeth || []).map(Number);

  const { currentAppointment } = useAppointmentDetail();

  const { data: historicalDates } = useExamHistoryDates('periodontal', patientId);
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

  const [showSettings, setShowSettings] = useState(false);
  const [talkBackEnabled, setTalkBackEnabled] = useState(false);
  const [perioTab, setPerioTab] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const openDropdown = Boolean(anchorEl);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };
  
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
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const setSettings = (val) => {
    const newVal = typeof val === 'function' ? val(settingsRef.current) : val;
    settingsRef.current = newVal;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'periodontal', data: { settings: newVal } } });
  };

  const defaultChartData = useMemo(() => initialToothData(missingTeeth), [missingTeeth]);
  const chartData = sessionState?.chartData || defaultChartData;
  const chartDataRef = useRef(chartData);
  useEffect(() => {
    chartDataRef.current = chartData;
  }, [chartData]);

  const setChartData = (val) => {
    const newVal = typeof val === 'function' ? val(chartDataRef.current) : val;
    chartDataRef.current = newVal;
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'periodontal', data: { chartData: newVal } } });
  };

  // Sync data from database to form state when loaded
  useEffect(() => {
    // Only load from DB if we haven't already populated Redux (or if we want DB to take precedence on initial load)
    // For now, we update Redux with DB data if it arrives
    if (examRecord?.examData && examRecord.examData.chartData) {
      setChartData(examRecord.examData.chartData);
    } else if (!examLoading) {
      setChartData(initialToothData(missingTeeth));
    }
    
    if (examRecord?.examData && examRecord.examData.settings) {
      setSettings(examRecord.examData.settings);
    } else if (!examLoading) {
      setSettings(defaultSettings);
    }
  }, [examRecord?.examData, examLoading]);

  const handleSaveExam = async () => {
    if (!activeAppointmentId || activeAppointmentId === 'undefined') {
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
      showSnackbar('Periodontal exam signed and locked', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || 'Failed to sign exam', 'error');
    }
  };

  const handleDeleteExam = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    showSnackbar('Periodontal exam deleted', 'info');
  };

  const handleRemoveDate = (indexToRemove) => {
    // setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  const handleNewExam = async () => {
    if (isSigned) {
      showSnackbar('Cannot create a new exam on a signed record', 'error');
      return;
    }
    setViewingAppointmentId(null);
    handleClearAll();
    if (appointmentId) {
      try {
        await upsertMutation.mutateAsync({
          patientId: patientId ? String(patientId) : undefined,
          providerId: providerId ? String(providerId) : undefined,
          examData: {
            chartData: initialToothData(missingTeeth),
            settings: defaultSettings
          }
        });
        showSnackbar('New Periodontal exam initialized', 'success');
      } catch (err) {
        showSnackbar(err.response?.data?.error?.message || 'Failed to initialize new exam', 'error');
      }
    }
  };

  const handleApplyAll = () => {
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (missingTeeth.includes(i)) continue;
        updated[i] = { facial: { ...prev[i].facial }, lingual: { ...prev[i].lingual } };
        for (const side of ['facial', 'lingual']) {
          const sideData = updated[i][side];
          
          if (settings.probing.some(p => p !== '')) sideData.probe = [...settings.probing];
          if (settings.recession.some(r => r !== '')) sideData.recession = [...settings.recession];
          if (settings.mobility !== 'none') sideData.mobility = settings.mobility;
          if (settings.bleeding.length > 0) sideData.bleeding = [...settings.bleeding];
          if (settings.pcs.length > 0) sideData.pcs = [...settings.pcs];

          // Calculate attachment based on new probe and recession
          if (settings.probing.some(p => p !== '') || settings.recession.some(r => r !== '')) {
            sideData.attachment = sideData.probe.map((p, idx) => {
              const r = sideData.recession[idx] || '0';
              if (!p) return '';
              return String(parseInt(p) + parseInt(r));
            });
          }

          // If attachedGingiva is explicitly provided, it overwrites the attachment field (matching original logic)
          if (settings.attachedGingiva.some(a => a !== '')) {
            sideData.attachment = [...settings.attachedGingiva];
          }
        }
      }
      return updated;
    });
    setShowSettings(false);
  };

  const handleResetToDefault = async () => {
    setSettings(defaultSettings);
    dispatch({ type: 'clinicalExamSession/setExamSubTabSession', payload: { subTab: 'radiographic', data: { missingTeeth: [] } } });
    if (radiographicRecord) {
      await radiographicUpsertMutation.mutateAsync({
        examData: {
          ...radiographicRecord.examData,
          missingTeeth: []
        }
      });
    }

    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        updated[i] = { 
          facial: { ...(prev[i]?.facial || {}) }, 
          lingual: { ...(prev[i]?.lingual || {}) } 
        };
        for (const side of ['facial', 'lingual']) {
          updated[i][side] = {
            ...updated[i][side],
            probe: ['3', '2', '3'],
            recession: ['', '1', ''],
            attachment: ['3', '3', '3'], // (probe + recession)
            mobility: 'none',
            furcation: 'none',
            bleeding: [0, 2],
            pcs: ['P', 'C', 'S']
          };
        }
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    setSettings({
      probing: ['', '', ''],
      recession: ['', '', ''],
      recessionPresent: false,
      attachedGingiva: ['', '', ''],
      mobility: 'none',
      bleeding: [],
      bleedingPresent: false,
      pcs: []
    });
    setChartData(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= 32; i++) {
        if (missingTeeth.includes(i)) continue;
        updated[i] = { 
          facial: { ...(prev[i]?.facial || {}) }, 
          lingual: { ...(prev[i]?.lingual || {}) } 
        };
        for (const side of ['facial', 'lingual']) {
          updated[i][side] = {
            ...updated[i][side],
            probe: ['', '', ''],
            recession: ['', '', ''],
            attachment: ['', '', ''],
            mobility: 'none',
            furcation: 'none',
            bleeding: [],
            pcs: []
          };
        }
      }
      return updated;
    });
  };

  const dynamicSummaryData = useMemo(() => {
    let validTeethCount = 0;
    
    let bleedingSites = 0;
    let p4Sites = 0;
    let p5Sites = 0;
    let p6Sites = 0;
    let recessionSites = 0;

    let bleedingTeeth = 0;
    let p4Teeth = 0;
    let p5Teeth = 0;
    let p6Teeth = 0;
    let recessionTeeth = 0;

    for (let i = 1; i <= 32; i++) {
      if (missingTeeth.includes(i)) continue;
      validTeethCount++;
      
      const tooth = chartData[i];
      if (!tooth) continue;

      let hasBleeding = false;
      let hasP4 = false;
      let hasP5 = false;
      let hasP6 = false;
      let hasRecession = false;

      ['facial', 'lingual'].forEach(side => {
        const sideData = tooth[side];
        if (!sideData) return;

        if (sideData.bleeding && sideData.bleeding.length > 0) {
          bleedingSites += sideData.bleeding.length;
          hasBleeding = true;
        }

        for (let j = 0; j < 3; j++) {
          const pVal = parseInt(sideData.probe?.[j], 10);
          if (!isNaN(pVal)) {
            if (pVal <= 4) {
              p4Sites++;
              hasP4 = true;
            } else if (pVal === 5) {
              p5Sites++;
              hasP5 = true;
            } else if (pVal >= 6) {
              p6Sites++;
              hasP6 = true;
            }
          }

          const rVal = parseInt(sideData.recession?.[j], 10);
          if (!isNaN(rVal) && rVal > 0) {
            recessionSites++;
            hasRecession = true;
          }
        }
      });

      if (hasBleeding) bleedingTeeth++;
      if (hasP4) p4Teeth++;
      if (hasP5) p5Teeth++;
      if (hasP6) p6Teeth++;
      if (hasRecession) recessionTeeth++;
    }

    const totalSites = validTeethCount * 6;
    const calcPercent = (part, total) => total > 0 ? Math.round((part / total) * 100) : 0;

    return [
      { 
        label: '# of sites', 
        bleeding: String(bleedingSites), 
        p4: String(p4Sites), 
        p5: String(p5Sites), 
        p6: String(p6Sites), 
        recession: String(recessionSites) 
      },
      { 
        label: '% of sites', 
        bleeding: `${calcPercent(bleedingSites, totalSites)}%`, 
        p4: `${calcPercent(p4Sites, totalSites)}%`, 
        p5: `${calcPercent(p5Sites, totalSites)}%`, 
        p6: `${calcPercent(p6Sites, totalSites)}%`, 
        recession: `${calcPercent(recessionSites, totalSites)}%` 
      },
      { 
        label: '# of teeth', 
        bleeding: String(bleedingTeeth), 
        p4: String(p4Teeth), 
        p5: String(p5Teeth), 
        p6: String(p6Teeth), 
        recession: String(recessionTeeth) 
      },
      { 
        label: '% of teeth', 
        bleeding: `${calcPercent(bleedingTeeth, validTeethCount)}%`, 
        p4: `${calcPercent(p4Teeth, validTeethCount)}%`, 
        p5: `${calcPercent(p5Teeth, validTeethCount)}%`, 
        p6: `${calcPercent(p6Teeth, validTeethCount)}%`, 
        recession: `${calcPercent(recessionTeeth, validTeethCount)}%` 
      },
    ];
  }, [chartData]);

  if (examLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Box>
            <ClinicalNavbar />
            <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, mb: 0 }}>
              <Typography sx={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700, 
                fontSize: '24px', 
                lineHeight: '29.04px',
                color: '#111827' 
              }}>
                Exam
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', pt: 0.5 }}>
                Patient examination records and clinical findings
              </Typography>
            </Stack>
            <Box sx={{ px: 0 }}>
              <ExamNavbar />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: { md: 260, lg: 300 }, flexShrink: 0, height: '100%', flexDirection: 'column' }}>
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
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box>
            <ClinicalNavbar />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, mb: 0 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700, 
                  fontSize: '24px', 
                  lineHeight: '29.04px',
                  color: '#111827' 
                }}>
                  Exam
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', pt: 0.5 }}>
                  Patient examination records and clinical findings
                </Typography>
              </Stack>
              

            </Stack>
            <Box sx={{ px: 0 }}>
              <ExamNavbar />
            </Box>
          </Box>
          <Box sx={{ px: 3, pb: 3, flex: 1 }}>
        {isSigned && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This exam has been signed and locked. It is now read-only.
          </Alert>
        )}
        
        {/* 1. TIMELINE HEADER */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3, 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px', 
          p: 1, 
          px: 2,
          bgcolor: '#ffffff'
        }}>
          {/* Left: Visit dates timeline + New Exam */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', flex: 1 }}>
            <IconButton size="small" sx={{ flexShrink: 0 }}><ArrowBackIosNewIcon sx={{ fontSize: 16 }} /></IconButton>
            <VisitDatesTimeline visitDates={visitDates} onDateClick={(id) => setViewingAppointmentId(id)} activeAppointmentId={activeAppointmentId} />
            <IconButton size="small" sx={{ flexShrink: 0 }}><ArrowForwardIosIcon sx={{ fontSize: 16 }} /></IconButton>
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
                '&:hover': { bgcolor: '#f9fafb', borderColor: isSigned ? '#e5e7eb' : '#9ca3af' },
                ml: 2
              }}
              onClick={handleNewExam}
              disabled={isSigned}
            >
              New Exam
            </Button>
          </Box>
          

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
            <IconButton 
              onClick={() => setShowSettings(true)}
              sx={{ 
                width: 32,
                height: 32,
                p: 0, 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                bgcolor: '#FBFDFE',
                '&:hover': { bgcolor: '#f0f4f8' }
              }}
            >
              <img src={settingIcon} alt="Settings" style={{ width: 16, height: 16 }} />
            </IconButton>
            <IconButton 
              sx={{ 
                width: 32,
                height: 32,
                p: 0, 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                bgcolor: '#FBFDFE',
                '&:hover': { bgcolor: '#f0f4f8' }
              }}
            >
              <img src={printIcon} alt="Print" style={{ width: 16, height: 16 }} />
            </IconButton>
            <Button 
              variant="outlined" 
              startIcon={<img src={compareIcon} alt="Compare" style={{ width: 16, height: 16 }} />}
              sx={{ 
                color: '#334155', 
                bgcolor: '#FBFDFE',
                borderColor: '#e2e8f0',
                textTransform: 'none', 
                fontSize: fontSize.sm, 
                height: 32,
                px: 2, 
                fontWeight: fontWeight.semibold,
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#f0f4f8', borderColor: '#cbd5e1' }
              }}
            >
              Compare
            </Button>
            <Button 
              variant="contained" 
              onClick={handleDropdownClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ 
                bgcolor: '#00BBAB', 
                color: '#fff',
                textTransform: 'none', 
                borderRadius: '8px', 
                fontSize: fontSize.sm, 
                height: 32,
                px: 2, 
                fontWeight: fontWeight.semibold,
                '&:hover': { bgcolor: '#00a093' }
              }}
            >
              New Period Chart
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openDropdown}
              onClose={handleDropdownClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: '180px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    color: '#334155',
                    py: 1.5,
                    px: 2,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#f8fafc'
                    }
                  }
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  handleResetToDefault();
                  handleDropdownClose();
                }}
              >
                Copy from latest
              </MenuItem>
              
              <MenuItem 
                onClick={() => {
                  handleClearAll();
                  handleDropdownClose();
                }}
              >
                Empty Chart
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <fieldset disabled={isSigned} style={{ border: 'none', padding: 0, margin: 0, width: '100%', minWidth: 0 }}>

        {/* 2. DIAGNOSTIC SECTION */}
        <Grid container spacing={3} sx={{ mt: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <Grid item xs={12} sx={{ flexBasis: { md: '30%' }, maxWidth: { md: '30%' }, minWidth: 0 }}>
            <DiagnosisCard />
          </Grid>
          <Grid item xs={12} sx={{ flexBasis: { md: '70%' }, maxWidth: { md: '70%' }, minWidth: 0 }}>
            <SummaryCard summaryData={dynamicSummaryData} />
          </Grid>
        </Grid>

        {/* 3. TABS HEADER */}
        <Box sx={{ mt: 4, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Tabs 
            value={perioTab} 
            onChange={(e, v) => setPerioTab(v)}
            sx={{ 
              minHeight: 0,
              '& .MuiTabs-indicator': { backgroundColor: '#4379EE', height: '2px' }
            }}
          >
            <Tab 
              label="PERIO CHART" 
              sx={{ 
                fontSize: '13px', 
                fontWeight: perioTab === 0 ? 700 : 600, 
                minWidth: 'auto', 
                p: 0, 
                pb: 1, 
                mr: 4, 
                color: perioTab === 0 ? '#4379EE !important' : '#1E293B !important' 
              }} 
            />
            <Tab 
              label="PERIO GRAPH" 
              sx={{ 
                fontSize: '13px', 
                fontWeight: perioTab === 1 ? 700 : 600, 
                minWidth: 'auto', 
                p: 0, 
                pb: 1, 
                color: perioTab === 1 ? '#4379EE !important' : '#1E293B !important' 
              }} 
            />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, pb: 1 }}>
            <Box 
              onClick={() => setTalkBackEnabled(!talkBackEnabled)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            >
              <Box sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                border: '1.5px solid #4379EE',
                backgroundColor: talkBackEnabled ? '#4379EE' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                {talkBackEnabled && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
                )}
              </Box>
              <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Enable System Talk Back
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#4379EE', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>
              Voice Commands Guide
            </Typography>
            <IconButton 
              sx={{ 
                bgcolor: '#EBF0FE', 
                width: 32, 
                height: 32, 
                '&:hover': { bgcolor: '#dbe4fe' }
              }}
            >
              <img src={voiceIcon} alt="Voice" style={{ width: 16, height: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* 4. PERIO CHART GRID */}
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          {perioTab === 0 ? (
            <PerioChartGrid chartData={chartData} setChartData={setChartData} missingTeeth={missingTeeth} />
          ) : (
            <PeriographTab chartData={chartData} missingTeeth={missingTeeth} />
          )}
        </Box>

        </fieldset>

        <Box sx={{ 
          mt: 4, 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px', 
          bgcolor: '#ffffff',
        }}>
          <Box sx={{ mt: -2.5, pb: 1.5, mr: 1 }}>
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

      {/* Perio Defaults Dialog */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 99999 }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden'
          }
        }}
      >
        {/* Title Bar */}
        <DialogTitle
          sx={{
            backgroundColor: '#F1F5FD',
            color: '#111',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB',
            m: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <SettingsIcon sx={{ color: '#2563EB', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>
                Perio Defaults
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: '#6B7280' }}>
                Set your clinical defaults for periodontal measurements
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setShowSettings(false)} sx={{ color: '#6B7280' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5, bgcolor: '#FFFFFF' }}>
          <Box sx={{ mb: 0 }}>

            <Stack spacing={2}>
              {/* Probing Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2 }}>
                <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Probing</Typography>
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
                      inputProps={{ style: { textAlign: 'center', padding: '0', fontSize: '0.875rem' } }}
                      sx={{ width: 36, '& .MuiOutlinedInput-root': { borderRadius: '6px', height: 36, bgcolor: '#F8FAFC', '& fieldset': { borderColor: '#E2E8F0' } } }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Recession Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2 }}>
                <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Recession</Typography>
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
                    inputProps={{ style: { textAlign: 'center', padding: '0', fontSize: '0.875rem' } }}
                    sx={{ width: 36, '& .MuiOutlinedInput-root': { borderRadius: '6px', height: 36, bgcolor: '#F8FAFC', '& fieldset': { borderColor: '#E2E8F0' } } }}
                  />
                  <FormControlLabel
                    control={
                      <Radio 
                        size="small" 
                        checked={settings.recessionPresent} 
                        onClick={() => setSettings(prev => ({ ...prev, recessionPresent: !prev.recessionPresent }))}
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#4379EE' } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>Present</Typography>}
                  />
                </Stack>
              </Box>

              {/* Attached Gingiva Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2 }}>
                <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Attached Gingiva</Typography>
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
                      inputProps={{ style: { textAlign: 'center', padding: '0', fontSize: '0.875rem' } }}
                      sx={{ width: 36, '& .MuiOutlinedInput-root': { borderRadius: '6px', height: 36, bgcolor: '#F8FAFC', '& fieldset': { borderColor: '#E2E8F0' } } }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Mobility Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2 }}>
                <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Mobility</Typography>
                <Box sx={{ flex: 1 }}>
                  <Select
                    size="small"
                    value={settings.mobility}
                    onChange={(e) => setSettings(prev => ({ ...prev, mobility: e.target.value }))}
                    sx={{ height: 36, fontSize: '0.875rem', minWidth: 100, borderRadius: '6px', bgcolor: '#F8FAFC', '& fieldset': { borderColor: '#E2E8F0' } }}
                  >
                    <MenuItem value="none">none</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
                </Box>
              </Box>

              {/* Bleeding Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2 }}>
                <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Bleeding</Typography>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1.5}>
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
                            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            bgcolor: isRed ? '#FEE2E2' : '#F8FAFC',
                            border: '1px solid', borderColor: isRed ? '#EF4444' : '#E2E8F0',
                            borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {isRed && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                  <FormControlLabel
                    control={
                      <Radio 
                        size="small" 
                        checked={settings.bleedingPresent} 
                        onClick={() => setSettings(prev => ({ ...prev, bleedingPresent: !prev.bleedingPresent }))} 
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#4379EE' } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>Present</Typography>}
                  />
                </Stack>
              </Box>

              {/* PCS Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', p: 2 }}>
                <Typography sx={{ width: 140, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>PCS</Typography>
                <Stack direction="row" spacing={1.5} sx={{ flex: 1 }}>
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
                          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: isActive ? '#F59E0B' : '#F8FAFC',
                          border: '1px solid', borderColor: isActive ? '#F59E0B' : '#E2E8F0',
                          borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
                          color: isActive ? '#fff' : '#64748B', fontSize: '0.875rem', fontWeight: 600
                        }}
                      >
                        {char}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Dialog Footer Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, py: 2, borderTop: '1px solid #E2E8F0', bgcolor: '#fff', mt: 3, mx: -3, mb: -2.5 }}>
            <Button
              onClick={() => setShowSettings(false)}
              variant="outlined"
              sx={{
                color: '#334155',
                borderColor: '#E2E8F0',
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                fontWeight: 600,
                '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outlined"
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                px: 2.5,
                fontWeight: 600,
                borderColor: '#FCA5A5',
                '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444' }
              }}
            >
              Clear Grid
            </Button>
            <Button
              onClick={handleApplyAll}
              variant="contained"
              sx={{
                bgcolor: '#4379EE',
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#3b6be0', boxShadow: 'none' }
              }}
            >
              Apply Defaults
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