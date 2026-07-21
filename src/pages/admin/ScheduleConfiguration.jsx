import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentPracticeInfo, updateScheduleConfig } from '../../store/slices/practiceInfoSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import GeneralSettings from '../../components/admin/practice-setup/schedule-configuration/GeneralSettings';
import AppointmentCardHeader from '../../components/admin/practice-setup/schedule-configuration/AppointmentCardHeader';
import AppointmentCardSettings from '../../components/admin/practice-setup/schedule-configuration/AppointmentCardSettings';
import TreatmentScheduleSettings from '../../components/admin/practice-setup/schedule-configuration/TreatmentScheduleSettings';
import AppointmentStatusColors from '../../components/admin/practice-setup/schedule-configuration/AppointmentStatusColors';
import AppointmentTypesSetting from '../../components/admin/practice-setup/schedule-configuration/AppointmentTypesSetting';
import TooltipPatientInfoRouteSlip from '../../components/admin/practice-setup/schedule-configuration/TooltipPatientInfoRouteSlip';
import AppointmentChecklist from '../../components/admin/practice-setup/schedule-configuration/AppointmentChecklist';

import SaveConfigIcon from '../../assets/scheduleconfigurationicon/saveconfigurationicon.svg';

const scheduleConfigTheme = createTheme({
  typography: {
    fontFamily: '"Segoe UI", sans-serif',
    body1: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0px',
    },
    body2: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0px',
    },
    subtitle1: {
      fontFamily: '"Segoe UI", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Segoe UI", sans-serif',
    },
    button: {
      fontFamily: '"Segoe UI", sans-serif',
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Segoe UI", sans-serif',
          fontSize: '12px',
          fontWeight: 400,
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Segoe UI", sans-serif',
          fontSize: '12px',
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Segoe UI", sans-serif',
          fontSize: '12px',
        }
      }
    }
  }
});

const ScheduleConfiguration = () => {
  const dispatch = useDispatch();
  const { data: practiceData, updateLoading } = useSelector((state) => state.practiceInfo);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [addItemCategory, setAddItemCategory] = useState('');
  const [newItemText, setNewItemText] = useState('');

  const [enableRouteSlip, setEnableRouteSlip] = useState(true);

  const DEFAULT_PRE_APPT_CHECKLIST = ["Import History", "Import Record", "Appt Reminder", "Verify Insurance Eligibility", "Share Consent Forms", "Deposit for treatment"];
  const DEFAULT_CHECK_IN_CHECKLIST = ["Review Records", "Review & sign Visit Plan", "Sign Consent Forms", "Verify Premed Taken"];
  const DEFAULT_CHECK_OUT_CHECKLIST = ["Complete & Bill Procedures", "Purchase Products", "Share Clinical Reports", "Prescription", "Schedule Next Appt", "Send Lab Case"];

  const [preApptChecklist, setPreApptChecklist] = useState(DEFAULT_PRE_APPT_CHECKLIST);
  const [checkInChecklist, setCheckInChecklist] = useState(DEFAULT_CHECK_IN_CHECKLIST);
  const [checkOutChecklist, setCheckOutChecklist] = useState(DEFAULT_CHECK_OUT_CHECKLIST);

  const [generalSettings, setGeneralSettings] = useState({
    enableHorizontalScroll: false,
    minSlotWidth: 200,
    showCalendar: true,
    adjustableSlotHeight: false,
    slotHeight: 50
  });

  const [appointmentCardHeader, setAppointmentCardHeader] = useState({
    patientNameFormat: 'First Name Last Name',
    displayAge: true,
    headerFontColor: '#ffffff'
  });

  const [appointmentCardSettings, setAppointmentCardSettings] = useState({}); // Stores key-value boolean pairs for the toggles

  const [treatmentScheduleSettings, setTreatmentScheduleSettings] = useState({
    defaultTreatmentSlotDuration: '60 mins',
    defaultAppointmentSlotDuration: '60 mins',
    scheduleUnit: '10 mins',
    scheduleIncrements: '5 mins'
  });

  const INITIAL_STATUS_COLORS = [
    { name: "Unconfirmed", color1: "#f3f4f6", color2: "", anim: "None" },
    { name: "Preconfirmed", color1: "#3b82f6", color2: "", anim: "None" },
    { name: "Confirmed", color1: "#22c55e", color2: "", anim: "None" },
    { name: "Arrived", color1: "#eab308", color2: "#fef08a", anim: "Moving Stripes" },
    { name: "Ready To Be Seated", color1: "#eab308", color2: "#fef08a", anim: "On/Off" },
    { name: "Seated", color1: "#22c55e", color2: "#bbf7d0", anim: "Moving Stripes" },
    { name: "Ready For Doctor", color1: "#3b82f6", color2: "#bfdbfe", anim: "Moving Stripes" },
    { name: "In Treatment", color1: "#f472b6", color2: "", anim: "None" },
    { name: "Ready For Checkout", color1: "#374151", color2: "#9ca3af", anim: "Moving Stripes" },
    { name: "Checked out incomplete", color1: "#4b5563", color2: "", anim: "None" },
    { name: "Checked out complete", color1: "#9ca3af", color2: "", anim: "None" },
    { name: "Call", color1: "#ef4444", color2: "", anim: "None" },
    { name: "Left message", color1: "#f59e0b", color2: "", anim: "None" },
    { name: "Running Late", color1: "#92400e", color2: "", anim: "None" },
    { name: "Sent Email Or Text", color1: "#8b5cf6", color2: "", anim: "None" },
    { name: "Late", color1: "#ef4444", color2: "#fecaca", anim: "Moving Stripes" },
  ];
  const [statusColors, setStatusColors] = useState(INITIAL_STATUS_COLORS);

  const INITIAL_TYPES = [
    { type: "Crown/bridge prep", providers: 3, time: "90 mins" },
    { type: "Periodic Ortho check", providers: 2, time: "30 mins" },
    { type: "Hygiene + Exam", providers: 2, time: "60 mins" },
    { type: "SRP", providers: 1, time: "120 mins" },
    { type: "Crown Delivery", providers: 2, time: "60 mins" },
    { type: "Invisalign bond", providers: 1, time: "60 mins" },
    { type: "Doctor new patient exam", providers: 2, time: "60 mins" },
    { type: "Hygiene new patient exam", providers: 2, time: "60 mins" },
    { type: "Composite 1-3 teeth", providers: 2, time: "60 mins" },
    { type: "Provisional swap", providers: 2, time: "65 mins" },
    { type: "Hygiene-no exam", providers: 1, time: "60 mins" },
    { type: "Limited Exam", providers: 2, time: "45 mins" },
    { type: "Implant scan 1-2 implants", providers: 3, time: "60 mins" },
    { type: "Implant delivery 1-2 implants", providers: 2, time: "60 mins" },
    { type: "New Patient Comp Exam", providers: 2, time: "60 mins" },
    { type: "Full arch prep", providers: 2, time: "180 mins" },
    { type: "Post op photos", providers: 2, time: "30 mins" },
  ];
  const [appointmentTypes, setAppointmentTypes] = useState(INITIAL_TYPES);

  // Sync route slip and checklist settings from Redux
  useEffect(() => {
    if (practiceData?.scheduleConfig?.routeSlipSettings) {
      setRouteSlipSettings(prev => ({...prev, ...practiceData.scheduleConfig.routeSlipSettings}));
    }
    if (practiceData?.scheduleConfig?.enableRouteSlip !== undefined) {
      setEnableRouteSlip(practiceData.scheduleConfig.enableRouteSlip);
    }
    if (practiceData?.scheduleConfig?.preApptChecklist) {
      setPreApptChecklist(practiceData.scheduleConfig.preApptChecklist);
    }
    if (practiceData?.scheduleConfig?.checkInChecklist) {
      setCheckInChecklist(practiceData.scheduleConfig.checkInChecklist);
    }
    if (practiceData?.scheduleConfig?.checkOutChecklist) {
      setCheckOutChecklist(practiceData.scheduleConfig.checkOutChecklist);
    }
    if (practiceData?.scheduleConfig?.generalSettings) {
      setGeneralSettings(prev => ({...prev, ...practiceData.scheduleConfig.generalSettings}));
    }
    if (practiceData?.scheduleConfig?.appointmentCardHeader) {
      setAppointmentCardHeader(prev => ({...prev, ...practiceData.scheduleConfig.appointmentCardHeader}));
    }
    if (practiceData?.scheduleConfig?.appointmentCardSettings) {
      setAppointmentCardSettings(prev => ({...prev, ...practiceData.scheduleConfig.appointmentCardSettings}));
    }
    if (practiceData?.scheduleConfig?.treatmentScheduleSettings) {
      setTreatmentScheduleSettings(prev => ({...prev, ...practiceData.scheduleConfig.treatmentScheduleSettings}));
    }
    if (practiceData?.scheduleConfig?.statusColors && practiceData.scheduleConfig.statusColors.length > 0) {
      setStatusColors(practiceData.scheduleConfig.statusColors);
    }
    if (practiceData?.scheduleConfig?.appointmentTypes && practiceData.scheduleConfig.appointmentTypes.length > 0) {
      setAppointmentTypes(practiceData.scheduleConfig.appointmentTypes);
    }
  }, [practiceData]);

  const handleSave = async () => {
    if (!practiceData || (!practiceData._id && !practiceData.id)) {
      showSnackbar('Practice Info not found. Please fill it out first.', 'error');
      return;
    }
    try {
      const payload = {
        enableRouteSlip,
        routeSlipSettings,
        preApptChecklist,
        checkInChecklist,
        checkOutChecklist,
        generalSettings,
        appointmentCardHeader,
        appointmentCardSettings,
        treatmentScheduleSettings,
        statusColors,
        appointmentTypes
      };
      await dispatch(updateScheduleConfig({ practiceInfoId: practiceData._id || practiceData.id, scheduleConfigData: payload })).unwrap();
      showSnackbar('Schedule Configuration saved successfully', 'success');
    } catch (err) {
      showSnackbar(err || 'Failed to save configuration', 'error');
    }
  };

  const handleAddItem = (category) => {
    setAddItemCategory(category);
    setNewItemText('');
    setAddItemModalOpen(true);
  };

  const submitNewItem = () => {
    if (newItemText && newItemText.trim()) {
      const item = newItemText.trim();
      if (addItemCategory === 'preAppt') setPreApptChecklist(prev => [...prev, item]);
      else if (addItemCategory === 'checkIn') setCheckInChecklist(prev => [...prev, item]);
      else if (addItemCategory === 'checkOut') setCheckOutChecklist(prev => [...prev, item]);
    }
    setAddItemModalOpen(false);
  };

  const handleDeleteItem = (category, index) => {
    if (category === 'preAppt') setPreApptChecklist(prev => prev.filter((_, i) => i !== index));
    else if (category === 'checkIn') setCheckInChecklist(prev => prev.filter((_, i) => i !== index));
    else if (category === 'checkOut') setCheckOutChecklist(prev => prev.filter((_, i) => i !== index));
  };
  
  const [expandedSections, setExpandedSections] = useState({
    patientDetails: false,
    accountDetails: false,
    insuranceDetails: false,
    appointmentDetails: false,
    nextAppointmentDetails: false,
    otherDetails: false
  });

  const [routeSlipSettings, setRouteSlipSettings] = useState({
    patientName: true,
    patientAddress: true,
    patientDob: true,
    patientEmail: true,
    patientPhone: true,
    patientPrefDentist: true,
    patientPrefHygienist: true,
    patientReferringSources: true,
    
    totalOutstanding: true,
    individualOutstanding: true,
    insuranceOutstanding: true,
    
    carrierName: true,
    subscriberId: true,
    groupNumber: true,
    
    apptTime: true,
    apptReason: true,
    apptProvider: true,
    
    nextApptDate: true,
    nextApptTime: true,
    nextApptReason: true,
    
    printableNotes: true,
    customHeader: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ThemeProvider theme={scheduleConfigTheme}>
      <Box 
        sx={{ 
          bgcolor: '#F4F5F7', 
          borderRadius: '12px', 
          border: '1px solid #e0e0e0', 
          p: { xs: 2, sm: 3, md: 4 },
          fontFamily: '"Segoe UI", sans-serif'
        }}
      >
      {/* --- HEADER SECTION --- */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#11223F">
          Schedule Configuration
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSave}
          disabled={updateLoading}
          sx={{ borderRadius: 1.5, textTransform: 'none', px: 2, py: 1 }}
          startIcon={updateLoading ? <CircularProgress size={20} color="inherit" /> : <img src={SaveConfigIcon} alt="Save" style={{ width: 16, height: 16 }} />}
        >
          {updateLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </Box>

      {/* --- CONTENT SECTION --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* General Settings */}
        <GeneralSettings generalSettings={generalSettings} setGeneralSettings={setGeneralSettings} />

        {/* Appointment Card Header & Settings */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' }, alignItems: 'stretch' }}>
          <Box sx={{ width: { xs: '100%', sm: '320px' }, flexShrink: 0 }}>
            <AppointmentCardHeader appointmentCardHeader={appointmentCardHeader} setAppointmentCardHeader={setAppointmentCardHeader} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppointmentCardSettings appointmentCardSettings={appointmentCardSettings} setAppointmentCardSettings={setAppointmentCardSettings} />
          </Box>
        </Box>

        {/* Treatment & Schedule Settings */}
        <TreatmentScheduleSettings treatmentScheduleSettings={treatmentScheduleSettings} setTreatmentScheduleSettings={setTreatmentScheduleSettings} />

        {/* Appointment Status Colors */}
        <AppointmentStatusColors statusColors={statusColors} setStatusColors={setStatusColors} />

        {/* Appointment Types Settings */}
        <AppointmentTypesSetting apptTypes={appointmentTypes} setApptTypes={setAppointmentTypes} />

        {/* Tooltip, Patient Info & Route Slip */}
        <TooltipPatientInfoRouteSlip 
          enableRouteSlip={enableRouteSlip}
          setEnableRouteSlip={setEnableRouteSlip}
          routeSlipSettings={routeSlipSettings}
          setRouteSlipSettings={setRouteSlipSettings}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* Appointment Checklists */}
        <AppointmentChecklist 
          preApptChecklist={preApptChecklist}
          checkInChecklist={checkInChecklist}
          checkOutChecklist={checkOutChecklist}
          handleAddItem={handleAddItem}
          handleDeleteItem={handleDeleteItem}
        />
      </Box>

      {/* Add Checklist Item Dialog */}
      <Dialog open={addItemModalOpen} onClose={() => setAddItemModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 600, fontSize: '16px' }}>
          Add {addItemCategory === 'preAppt' ? 'Pre-appointment' : addItemCategory === 'checkIn' ? 'Check-in' : 'Check-out'} Checklist Item
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Description"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitNewItem();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setAddItemModalOpen(false)} sx={{ textTransform: 'none', color: '#6b7280' }}>Cancel</Button>
          <Button onClick={submitNewItem} variant="contained" color="primary" sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: '4px' }}>Add Item</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </ThemeProvider>
  );
};

export default ScheduleConfiguration;