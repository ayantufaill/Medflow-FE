import React, { useEffect, useMemo } from 'react';
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
import DynamicRouteSlipRenderer from '../../../common/DynamicRouteSlipRenderer';

import { usePatient, useScheduleState, useDropdownData, useAppointmentDetail } from '../../../../hooks/redux';
import { useSelector, useDispatch } from 'react-redux';
import { selectPatientHistoryList, fetchPatientHistory } from '../../../../store/slices/appointmentSlice';
import {
  fetchPatientById,
  fetchPatientBalance,
  fetchPatientInsurances,
  selectPatientBalanceCache,
  selectPatientInsurancesCache,
} from '../../../../store/slices/patientSlice';
import { providerLabel } from '../../new-appointment/helpers';

import { SectionHeader, InfoRow, SectionContainer } from './RouteSlipShared';
import { RouteSlipApptDisplay } from './RouteSlipApptDisplay';
import medflowLogo from '../../../../assets/medflow-logo.png';

const RouteSlipDialog = () => {
  const { routeSlipDialogOpen, setRouteSlipDialogOpen } = useScheduleState();
  const { providers = [], rooms = [] } = useDropdownData({ providers: true, rooms: true });
  const { currentPatient } = usePatient();
  const { currentAppointment } = useAppointmentDetail();
  const patientHistory = useSelector(selectPatientHistoryList) || [];
  const balanceCache = useSelector(selectPatientBalanceCache);
  const insurancesCache = useSelector(selectPatientInsurancesCache);
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
    const patientId = currentPatient?._id || currentPatient?.id || currentAppointment?.patientId?._id || currentAppointment?.patientId;
    if (routeSlipDialogOpen && patientId) {
      dispatch(fetchPatientById(patientId));
      dispatch(fetchPatientHistory(patientId));
      dispatch(fetchPatientBalance(patientId));
      dispatch(fetchPatientInsurances({ patientId, activeOnly: true }));
    }
  }, [routeSlipDialogOpen, currentPatient, currentAppointment, dispatch]);

  const handleClose = () => {
    setRouteSlipDialogOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const patientId = currentPatient?._id || currentPatient?.id || currentAppointment?.patientId?._id || currentAppointment?.patientId;
  const patientBalance = patientId ? balanceCache?.[patientId]?.data : null;
  const patientInsurances = patientId ? (insurancesCache?.[patientId]?.data || []) : [];

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatAddress = (addr) => {
    if (!addr) return '--';
    if (typeof addr === 'string') return addr || '--';
    return [
      addr.street,
      addr.addressLine1,
      addr.line1,
      addr.address1,
      addr.addressLine2,
      addr.line2,
      addr.city,
      addr.state,
      addr.zip,
      addr.postalCode,
    ].filter(Boolean).join(', ') || '--';
  };

  const fullName = (person) => {
    if (!person) return '';
    if (typeof person === 'string') return person;
    return person.name || person.fullName || `${person.firstName || ''} ${person.lastName || ''}`.trim();
  };

  const patientName = fullName(currentPatient) || currentPatient?.patientName || 'No patient selected';
  const address = formatAddress(currentPatient?.address || currentPatient?.homeAddress || currentPatient?.contact?.address);
  const dob = currentPatient?.dateOfBirth || currentPatient?.dob ? dayjs(currentPatient.dateOfBirth || currentPatient.dob).format('MM/DD/YYYY') : '--';
  const email = currentPatient?.email || currentPatient?.emailAddress || currentPatient?.contact?.email || '--';
  const phone = currentPatient?.phonePrimary || currentPatient?.mobileNumber || currentPatient?.mobilePhone || currentPatient?.phone || currentPatient?.mobile || currentPatient?.contact?.phone || '--';

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

  const referringSource = currentPatient?.referringSource?.name || currentPatient?.referringSource || currentPatient?.referralSource?.name || currentPatient?.referralSource || currentPatient?.howDidYouHearAboutUs || '--';
  const totalOutstanding = patientBalance?.totalOutstanding ?? patientBalance?.familyTotalOutstanding ?? patientBalance?.balance ?? currentPatient?.balance ?? 0;
  const individualOutstanding = patientBalance?.individualOutstanding ?? patientBalance?.patientOutstanding ?? patientBalance?.patientBalance ?? patientBalance?.balance ?? 0;
  const insuranceOutstanding = patientBalance?.insuranceOutstanding ?? patientBalance?.insuranceBalance ?? patientBalance?.pendingInsurance ?? 0;

  const activeInsuranceRows = patientInsurances.length > 0
    ? patientInsurances
    : (currentPatient?.coverages || currentPatient?.insurance || currentPatient?.insurances || []).filter(Boolean);

  const getInsuranceName = (insurance) => (
    insurance?.insuranceCompany?.name ||
    insurance?.carrier?.name ||
    insurance?.payer?.name ||
    insurance?.plan?.name ||
    insurance?.planName ||
    insurance?.name ||
    insurance?.insuranceName ||
    '--'
  );

  // Identify the primary appointment for the Route Slip
  let routeSlipAppt = null;

  const getApptDateTime = (appt) => {
    let dateStr;
    if (appt.appointmentDate) {
      dateStr = appt.appointmentDate.split('T')[0];
    } else if (appt.start) {
      dateStr = typeof appt.start === 'string' ? appt.start.split('T')[0] : dayjs(appt.start).format('YYYY-MM-DD');
    } else {
      dateStr = dayjs().format('YYYY-MM-DD');
    }

    let timeStr = '00:00';
    if (appt.time) {
      const timeObj = dayjs(`1970-01-01 ${appt.time}`, 'YYYY-MM-DD h:mm A');
      if (timeObj.isValid()) timeStr = timeObj.format('HH:mm');
    } else if (appt.startTime && typeof appt.startTime === 'string' && appt.startTime.includes(':')) {
      timeStr = appt.startTime;
      if (timeStr.split(':').length === 2) timeStr += ':00';
    } else if (appt.start && typeof appt.start === 'string' && appt.start.includes('T')) {
      timeStr = appt.start.split('T')[1].substring(0, 8);
    }

    return dayjs(`${dateStr}T${timeStr}`);
  };

  // If we have an active appointment in Redux and it belongs to this patient, use it
  const currentAppointmentPatientId = currentAppointment?.patientId?._id || currentAppointment?.patientId?.id || currentAppointment?.patientId;

  if (currentAppointment && patientId && String(currentAppointmentPatientId) === String(patientId)) {
    routeSlipAppt = currentAppointment;
  } else {
    // Fallback: look for an appointment today
    const todayAppts = patientHistory.filter(appt => {
      const appointmentDateTime = getApptDateTime(appt);
      return appointmentDateTime.isSame(dayjs(), 'day') && appointmentDateTime.isAfter(dayjs());
    });
    if (todayAppts.length > 0) {
      todayAppts.sort((a, b) => dayjs(a.appointmentDate || a.start).diff(dayjs(b.appointmentDate || b.start)));
      routeSlipAppt = todayAppts[0];
    }
  }

  const primaryDateStr = routeSlipAppt ? dayjs(routeSlipAppt.appointmentDate || routeSlipAppt.start).format('dddd MMM DD, YYYY') : dayjs().format('dddd MMM DD, YYYY');
  const primaryApptTitle = routeSlipAppt ? `APPOINTMENT OF ${dayjs(routeSlipAppt.appointmentDate || routeSlipAppt.start).format('MM/DD/YYYY')}` : `APPOINTMENT OF ${dayjs().format('MM/DD/YYYY')}`;

  // Next appointment is the first one strictly after the primary appointment
  const referenceDateTime = routeSlipAppt ? getApptDateTime(routeSlipAppt) : dayjs();
  const now = dayjs();
  const futureAppts = patientHistory.filter(appt => {
    // Exclude the primary appointment itself safely
    if (routeSlipAppt) {
      const aId = appt._id || appt.id;
      const rId = routeSlipAppt._id || routeSlipAppt.id;
      if (aId && rId && String(aId) === String(rId)) return false;
    }
    const appointmentDateTime = getApptDateTime(appt);
    return appointmentDateTime.isAfter(now) && appointmentDateTime.isAfter(referenceDateTime);
  });
  futureAppts.sort((a, b) => getApptDateTime(a).diff(getApptDateTime(b)));
  const nextAppt = futureAppts.length > 0 ? futureAppts[0] : null;

  const getProcedures = (appt) => {
    if (!appt) return [];
    const candidates = [
      appt.customFields?.procedures,
      appt.workspace?.procedures,
      appt.procedures,
      appt.procedureCodes
    ];
    let procs = candidates.find(arr => Array.isArray(arr) && arr.length > 0) || [];
    
    return procs.map((p) => {
      if (typeof p === 'string') return { code: p, description: p };
      
      const code = p.code || p.procedureCode || p.ProcCode || p.cdtCode || p.id || '-';
      const description = p.treatment || p.description || p.name || p.Descript || p.label || code;
      const rawCharge = Number(String(p.charge || p.fee || p.negRate || 0).replace(/[^0-9.-]+/g, ''));
      const insEst = Number(String(p.insPortion || p.insuranceAmount || p.insEst || 0).replace(/[^0-9.-]+/g, ''));
      const ptEst = Number(String(p.ptPart || p.ptPortion || p.patientAmount || p.ptEst || 0).replace(/[^0-9.-]+/g, ''));
      
      return {
        ...p,
        status: p.completed || appt.status === 'completed' || appt.status === 'checked_out_complete' ? 'Completed' : 'Scheduled',
        scheduled: dayjs(appt.appointmentDate || appt.start || appt.date).format('MM/DD/YYYY'),
        site: p.site || p.tooth || '-',
        code,
        description,
        provider: p.provider || appt.provider || appt.providerId,
        negRate: rawCharge,
        insEst: insEst,
        ptEst: ptEst
      };
    });
  };

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
              
              body {
                margin: 0;
                padding: 0;
                background-color: white;
              }

              #route-slip-print-content {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 900px !important; /* Force desktop width to maintain grid alignment */
                max-width: 900px !important;
                margin: 0 !important;
                padding: 30px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .MuiDialog-root, .MuiDialog-container, .MuiDialog-paper, .MuiDialogContent-root {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: auto !important;
                min-height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                transform: none !important;
                box-shadow: none !important;
                border: none !important;
                background-color: transparent !important;
                max-width: none !important;
                max-height: none !important;
              }

              /* Also specifically ensure DialogContent doesn't have internal scrolling */
              #route-slip-print-content {
                overflow: visible !important;
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
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <PrintIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Patient Route Slip
          </Typography>
          
          <Typography sx={{
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            {patientName !== 'No patient selected' ? patientName : 'No patient selected'}
          </Typography>
        </Box>

        <IconButton onClick={handleClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      {/* MODAL BODY (Print Target) */}
      <DialogContent id="route-slip-print-content" sx={{ p: '25px', pt: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <DynamicRouteSlipRenderer 
          patient={currentPatient} 
          appointment={routeSlipAppt} 
          nextAppointment={nextAppt}
          procedures={getProcedures(routeSlipAppt)} 
          insurances={activeInsuranceRows} 
          planTitle={routeSlipAppt?.planTitle || 'Treatment Plan'}
        />
      </DialogContent>

      <DialogActions className="no-print-in-modal" sx={{ p: '12px 24px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, backgroundColor: COLORS.WHITE, justifyContent: 'flex-end', gap: 1, flexShrink: 0 }}>
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
      </DialogActions>

    </Dialog>
  );
};

export default RouteSlipDialog;
