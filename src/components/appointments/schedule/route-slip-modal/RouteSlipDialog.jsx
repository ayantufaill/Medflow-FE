import React, { useRef, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import { COLORS } from '../../../../constants/colors';

import { usePatient, useScheduleState, useDropdownData, useAppointmentDetail } from '../../../../hooks/redux';
import { useSelector, useDispatch } from 'react-redux';
import { selectPatientHistoryList, fetchPatientHistory } from '../../../../store/slices/appointmentSlice';
import { providerLabel } from '../../new-appointment/helpers';

import { SectionHeader, InfoRow, SectionContainer } from './RouteSlipShared';
import { RouteSlipApptDisplay } from './RouteSlipApptDisplay';

const RouteSlipDialog = () => {
  const { routeSlipDialogOpen, setRouteSlipDialogOpen } = useScheduleState();
  const { providers = [], rooms = [] } = useDropdownData({ providers: true, rooms: true });
  const { currentPatient } = usePatient();
  const { currentAppointment } = useAppointmentDetail();
  const patientHistory = useSelector(selectPatientHistoryList) || [];
  const printRef = useRef(null);
  const dispatch = useDispatch();

  const OPERATORY_COLUMNS = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return [{ id: "op1", label: "Op 1" }];
    }
    return rooms.map((room, idx) => ({
      id: `op${room._id || room.id}`,
      label: room.name || room.roomName || room.label || `Op ${idx + 1}`,
    }));
  }, [rooms]);

  useEffect(() => {
    if (routeSlipDialogOpen && currentPatient && (currentPatient._id || currentPatient.id)) {
      dispatch(fetchPatientHistory(currentPatient._id || currentPatient.id));
    }
  }, [routeSlipDialogOpen, currentPatient, dispatch]);

  const handleClose = () => {
    setRouteSlipDialogOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mocked data if patient is missing
  const patientName = currentPatient ? `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim() : 'No patient selected';
  const address = currentPatient?.address ? `${currentPatient.address.street || currentPatient.address.addressLine1 || ''}, ${currentPatient.address.city || ''}, ${currentPatient.address.state || ''}, ${currentPatient.address.zip || currentPatient.address.postalCode || ''}`.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,\s*,/g, ',') : '--';
  const dob = currentPatient?.dateOfBirth || currentPatient?.dob ? dayjs(currentPatient.dateOfBirth || currentPatient.dob).format('MM/DD/YYYY') : '--';
  const email = currentPatient?.email || currentPatient?.emailAddress || '--';
  const phone = currentPatient?.phonePrimary || currentPatient?.mobileNumber || currentPatient?.phone || currentPatient?.mobile || '--';
  
  const getProviderName = (providerData) => {
    if (!providerData) return '--';
    
    // If it's already an object with names, use them directly
    if (typeof providerData === 'object') {
      if (providerData.name) return providerData.name;
      if (providerData.firstName || providerData.lastName) {
        return `${providerData.firstName || ''} ${providerData.lastName || ''}`.trim();
      }
    }
    
    // Otherwise, try to extract an ID to look up in our providers list
    const idToFind = typeof providerData === 'object' ? (providerData._id || providerData.id) : providerData;
    
    if (idToFind !== null && idToFind !== undefined) {
      const searchId = String(idToFind);
      const found = providers.find(p => String(p._id) === searchId || String(p.id) === searchId);
      if (found) {
        return providerLabel(found) || searchId;
      }
      return searchId; // Fallback to raw ID if we couldn't find the provider
    }
    
    return '--';
  };

  const pd = currentPatient?.preferredProvider || currentPatient?.preferredDentist || currentPatient?.preferredDentistId;
  const preferredDentistName = getProviderName(pd);

  const ph = currentPatient?.preferredHygienist || currentPatient?.preferredHygienistId;
  const preferredHygienistName = getProviderName(ph);

  const activeInsurance = currentPatient?.paymentMethod?.paidBy || currentPatient?.primaryInsurance?.name || currentPatient?.insuranceName || currentPatient?.coverages?.[0]?.insuranceCompany?.name || currentPatient?.insurance?.[0]?.name || currentPatient?.insurancePlan || null;

  // Identify the primary appointment for the Route Slip
  let routeSlipAppt = null;
  
  // If we have an active appointment in Redux and it belongs to this patient, use it
  if (currentAppointment && (currentAppointment.patientId === currentPatient?._id || currentAppointment.patientId === currentPatient?.id)) {
    routeSlipAppt = currentAppointment;
  } else {
    // Fallback: look for an appointment today
    const todayAppts = patientHistory.filter(appt => dayjs(appt.appointmentDate || appt.start).isSame(dayjs(), 'day'));
    if (todayAppts.length > 0) {
      todayAppts.sort((a, b) => dayjs(a.appointmentDate || a.start).diff(dayjs(b.appointmentDate || b.start)));
      routeSlipAppt = todayAppts[0];
    }
  }

  const primaryDateStr = routeSlipAppt ? dayjs(routeSlipAppt.appointmentDate || routeSlipAppt.start).format('dddd MMM DD, YYYY') : dayjs().format('dddd MMM DD, YYYY');
  const primaryApptTitle = routeSlipAppt ? `APPOINTMENT OF ${dayjs(routeSlipAppt.appointmentDate || routeSlipAppt.start).format('MM/DD/YYYY')}` : `APPOINTMENT OF ${dayjs().format('MM/DD/YYYY')}`;

  const getApptDateTime = (appt) => {
    // Force everything into a local YYYY-MM-DD format to avoid timezone drift
    let dateStr;
    if (appt.appointmentDate) {
      dateStr = appt.appointmentDate.split('T')[0];
    } else if (appt.start) {
      dateStr = typeof appt.start === 'string' ? appt.start.split('T')[0] : dayjs(appt.start).format('YYYY-MM-DD');
    } else {
      dateStr = dayjs().format('YYYY-MM-DD');
    }
    
    let timeStr = '00:00';
    if (appt.time) { // from calendar mapped object e.g. "6:00 PM"
       const timeObj = dayjs(`1970-01-01 ${appt.time}`, 'YYYY-MM-DD h:mm A');
       if (timeObj.isValid()) {
         timeStr = timeObj.format('HH:mm');
       }
    } else if (appt.startTime && typeof appt.startTime === 'string' && appt.startTime.includes(':')) {
      timeStr = appt.startTime;
      if (timeStr.split(':').length === 2) timeStr += ':00';
    } else if (appt.start && typeof appt.start === 'string' && appt.start.includes('T')) {
      // Extract the HH:mm:ss directly from the string to ignore timezone offset
      timeStr = appt.start.split('T')[1].substring(0, 8);
    }
    
    return dayjs(`${dateStr}T${timeStr}`);
  };

  // Next appointment is the first one strictly after the primary appointment
  const referenceDateTime = routeSlipAppt ? getApptDateTime(routeSlipAppt) : dayjs();
  const futureAppts = patientHistory.filter(appt => {
    // Exclude the primary appointment itself safely
    if (routeSlipAppt) {
      const aId = appt._id || appt.id;
      const rId = routeSlipAppt._id || routeSlipAppt.id;
      if (aId && rId && String(aId) === String(rId)) return false;
    }
    return getApptDateTime(appt).isAfter(referenceDateTime);
  });
  futureAppts.sort((a, b) => getApptDateTime(a).diff(getApptDateTime(b)));
    const nextAppt = futureAppts.length > 0 ? futureAppts[0] : null;

  return (
    <Dialog
      open={routeSlipDialogOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          minHeight: '60vh'
        }
      }}
    >
      {/* Dynamic Print CSS to only print this modal when "Print" is clicked */}
      {routeSlipDialogOpen && (
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #route-slip-print-content, #route-slip-print-content * { visibility: visible; }
              #route-slip-print-content {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
              }
              .MuiDialogActions-root, .no-print-in-modal { display: none !important; }
            }
          `}
        </style>
      )}

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DialogTitle
        className="no-print-in-modal"
        sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <PrintIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Patient Route Slip{patientName !== 'No patient selected' ? ` — ${patientName}` : ""}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      {/* MODAL BODY (Print Target) */}
      <DialogContent id="route-slip-print-content" sx={{ p: '25px', pt: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
        
        {/* Print Layout Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
          <Typography sx={{ fontSize: '14px', color: '#334155' }}>
            {primaryDateStr}
          </Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a' }}>
            PATIENT ROUTE SLIP
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#334155' }}>
            {patientName}
          </Typography>
        </Box>

        {/* PATIENT SECTION */}
        <Box sx={{ mb: 2 }}>
          <SectionHeader title="PATIENT" />
          <SectionContainer>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Name" value={patientName} />
                <InfoRow label="Address" value={address} />
                <InfoRow label="Date of Birth" value={dob} />
                <InfoRow label="Email" value={email} />
                <InfoRow label="Phone Number" value={phone} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ pl: { sm: 6, md: 10 } }}>
                  <InfoRow label="Preferred Dentist" value={preferredDentistName} />
                  <InfoRow label="Preferred Hygienist" value={preferredHygienistName} />
                  <InfoRow label="Referring Sources" value="--" />
                  <InfoRow label="Care Team Providers" value="--" />
                </Box>
              </Grid>
            </Grid>
          </SectionContainer>
        </Box>

        {/* ACCOUNT & INSURANCE SECTIONS */}
        <Box sx={{ display: 'flex', gap: '16px', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <SectionHeader title="ACCOUNT" />
            <SectionContainer sx={{ height: '100px' }}>
              <InfoRow label="Total Outstanding" value="$0.00" alignValue="right" />
              <InfoRow label="Individual Outstanding" value="$0.00" alignValue="right" />
              <InfoRow label="Insurance Outstanding" value="$0.00" alignValue="right" />
            </SectionContainer>
          </Box>
          <Box sx={{ flex: 1 }}>
            <SectionHeader title="INSURANCE" />
            <SectionContainer sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeInsurance ? (
                <Typography sx={{ color: '#334155', fontSize: '13px', fontWeight: 500 }}>
                  {activeInsurance}
                </Typography>
              ) : (
                <Typography sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
                  No active insurance
                </Typography>
              )}
            </SectionContainer>
          </Box>
        </Box>

        {/* PRIMARY APPOINTMENT */}
        <Box sx={{ mb: 2 }}>
          <SectionHeader title={primaryApptTitle} />
          <SectionContainer sx={{ minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', py: 2 }}>
            {routeSlipAppt ? (
              <Box sx={{ width: '100%' }}>
                <RouteSlipApptDisplay appt={routeSlipAppt} OPERATORY_COLUMNS={OPERATORY_COLUMNS} />
              </Box>
            ) : (
              <Typography sx={{ color: '#475569', fontSize: '13px', alignSelf: 'center' }}>
                No appointments for this day!
              </Typography>
            )}
          </SectionContainer>
        </Box>

        {/* NEXT APPOINTMENT */}
        <Box sx={{ mb: 2 }}>
          <SectionHeader title="NEXT APPOINTMENT" />
          <SectionContainer sx={{ minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', py: 2 }}>
            {nextAppt ? (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ px: 2 }}>
                  <InfoRow label="Date" value={dayjs(nextAppt.appointmentDate || nextAppt.start).format('MM/DD/YYYY')} />
                </Box>
                <RouteSlipApptDisplay appt={nextAppt} OPERATORY_COLUMNS={OPERATORY_COLUMNS} />
              </Box>
            ) : (
              <Typography sx={{ color: '#475569', fontSize: '13px', alignSelf: 'center' }}>
                No future appointments scheduled.
              </Typography>
            )}
          </SectionContainer>
        </Box>

      </DialogContent>

      <DialogActions className="no-print-in-modal" sx={{ p: '12px 24px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.WHITE, justifyContent: 'flex-end', gap: 1, flexShrink: 0 }}>
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<PrintIcon />} 
          onClick={handlePrint}
          sx={{ 
            textTransform: 'none',
            borderColor: '#3b82f6', 
            color: '#3b82f6', 
            borderRadius: '8px', 
            px: 2, 
            fontWeight: 600,
            '&:hover': { backgroundColor: '#eff6ff', borderColor: '#2563eb' }
          }}
        >
          Print
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleClose}
          sx={{ 
            color: '#64748b', 
            borderColor: '#cbd5e1', 
            borderRadius: '8px',
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
            textTransform: 'none',
            px: 2,
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default RouteSlipDialog;
