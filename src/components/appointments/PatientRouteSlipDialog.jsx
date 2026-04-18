import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import { patientService } from '../../services/patient.service';
import { appointmentService } from '../../services/appointment.service';

const PatientRouteSlipDialog = ({ open, onClose, patient, patientDetails, patientBalance }) => {
  const [loading, setLoading] = useState(false);
  const [insurances, setInsurances] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [todayAppointment, setTodayAppointment] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);

  const patientId = patient?.id || patient?._id;
  const patientName = patient?.firstName && patient?.lastName ? `${patient.firstName} ${patient.lastName}` : patient?.name || '---';

  useEffect(() => {
    if (open && patientId) {
      fetchExtraData();
    }
  }, [open, patientId]);

  const fetchExtraData = async () => {
    setLoading(true);
    try {
      const [insData, apptData] = await Promise.all([
        patientService.getPatientInsurances(patientId),
        appointmentService.getAppointmentsByPatient(patientId)
      ]);

      setInsurances(insData);
      setAppointments(apptData);

      // Process appointments
      const today = dayjs().startOf('day');
      const todayAppts = apptData.filter(a => dayjs(a.startTime).isSame(today, 'day'));
      setTodayAppointment(todayAppts[0] || null);

      const futureAppts = apptData
        .filter(a => dayjs(a.startTime).isAfter(dayjs().endOf('day')))
        .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)));
      setNextAppointment(futureAppts[0] || null);

    } catch (error) {
      console.error("Error fetching route slip data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const SectionHeader = ({ title }) => (
    <Box sx={{ bgcolor: '#e0e8f5', py: 0.5, px: 2, border: '1px solid #c0cfe3', mb: 1 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', color: '#1a3353', textTransform: 'uppercase' }}>
        {title}
      </Typography>
    </Box>
  );

  const LabelValue = ({ label, value }) => (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', minWidth: '120px' }}>{label}:</Typography>
      <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>{value || '---'}</Typography>
    </Box>
  );

  const formatAddress = (addr) => {
    if (!addr) return '---';
    if (typeof addr === 'string') return addr;
    const { line1, line2, city, state, postalCode } = addr;
    return [line1, line2, city, state, postalCode].filter(Boolean).join(', ');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: '4px', overflow: 'hidden' } }}
    >
      {/* Blue Header Bar */}
      <Box sx={{ bgcolor: '#5c7cbc', color: 'white', px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>Print Patient Route Slip</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem' }}>{patientName}</Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 4, bgcolor: '#ffffff', '@media print': { p: 0 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <Box className="printable-content">
            {/* Top Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontSize: '0.8rem' }}>{dayjs().format('dddd MMM DD, YYYY')}</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3353' }}>PATIENT ROUTE SLIP</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{patientName}</Typography>
            </Box>

            {/* PATIENT SECTION */}
            <SectionHeader title="PATIENT" />
            <Grid container spacing={15} sx={{ mb: 3, px: 1 }}>
              <Grid item xs={7}>
                <LabelValue label="Name" value={patientName} />
                <LabelValue label="Address" value={formatAddress(patientDetails?.address)} />
                <LabelValue label="Date of Birth" value={patient?.dateOfBirth ? dayjs(patient.dateOfBirth).format('MM/DD/YYYY') : '---'} />
                <LabelValue label="Email" value={patient?.email} />
                <LabelValue label="Phone Number" value={patient?.mobilePhone || patient?.phone} />
              </Grid>
              <Grid item xs={5}>
                <LabelValue label="Preferred Dentist" value={patientDetails?.preferredProvider?.name || patientDetails?.preferredDentist?.name} />
                <LabelValue label="Preferred Hygienist" value={patientDetails?.preferredHygienist?.name} />
                <LabelValue label="Referring Sources" value="---" />
                <LabelValue label="Care Team Providers" value="---" />
              </Grid>
            </Grid>

            {/* ACCOUNT & INSURANCE ROW */}
            <Box sx={{ display: 'flex', mb: 3, border: '1px solid #c0cfe3', width: '100%' }}>
              <Box sx={{ flex: 1, borderRight: '1px solid #c0cfe3' }}>
                <Box sx={{ bgcolor: '#e0e8f5', py: 0.5, borderBottom: '1px solid #c0cfe3' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', color: '#1a3353', textTransform: 'uppercase' }}>
                    ACCOUNT
                  </Typography>
                </Box>
                <Box sx={{ px: 2, py: 2 }}>
                  <LabelValue label="Total Outstanding" value={patientBalance?.familyTotalOutstanding ? `$${patientBalance.familyTotalOutstanding.toLocaleString()}` : '$0.00'} />
                  <LabelValue label="Individual Outstanding" value={patientBalance?.individualOutstanding ? `$${patientBalance.individualOutstanding.toLocaleString()}` : '$0.00'} />
                  <LabelValue label="Insurance Outstanding" value={patientBalance?.insuranceOutstanding ? `$${patientBalance.insuranceOutstanding.toLocaleString()}` : '$0.00'} />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ bgcolor: '#e0e8f5', py: 0.5, borderBottom: '1px solid #c0cfe3' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', color: '#1a3353', textTransform: 'uppercase' }}>
                    INSURANCE
                  </Typography>
                </Box>
                <Box sx={{ px: 2, py: 2 }}>
                  {insurances.length > 0 ? (
                    insurances.map((ins, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{ins.insuranceCompany?.name || 'Insurance'}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>ID: {ins.subscriberId || '---'} | Group: {ins.groupNumber || '---'}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>No active insurance</Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* APPOINTMENT OF TODAY */}
            <SectionHeader title={`APPOINTMENT OF ${dayjs().format('MM/DD/YYYY')}`} />
            <Box sx={{ border: '1px solid #c0cfe3', p: 2, mb: 3, minHeight: '60px' }}>
              {todayAppointment ? (
                <Grid container>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{dayjs(todayAppointment.startTime).format('h:mm A')}</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography sx={{ fontSize: '0.75rem' }}>{todayAppointment.reason || todayAppointment.appointmentType?.name || 'Scheduled Appointment'}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Provider: {todayAppointment.provider?.name || '---'}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>No appointments for this day!</Typography>
              )}
            </Box>

            {/* NEXT APPOINTMENT */}
            <SectionHeader title="NEXT APPOINTMENT" />
            <Box sx={{ border: '1px solid #c0cfe3', p: 2, minHeight: '60px' }}>
              {nextAppointment ? (
                <Grid container>
                  <Grid item xs={4}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{dayjs(nextAppointment.startTime).format('ddd MM/DD/YYYY')}</Typography>
                    <Typography sx={{ fontSize: '0.75rem' }}>{dayjs(nextAppointment.startTime).format('h:mm A')}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography sx={{ fontSize: '0.75rem' }}>{nextAppointment.reason || nextAppointment.appointmentType?.name || 'Future Appointment'}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Provider: {nextAppointment.provider?.name || '---'}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>No future appointments scheduled.</Typography>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Button 
          variant="contained" 
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          sx={{ bgcolor: '#5c7cbc', textTransform: 'none', px: 3 }}
        >
          Print
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ bgcolor: '#94a3b8', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#7f8c8d' } }}
        >
          Close
        </Button>
      </DialogActions>

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-content, .printable-content * {
              visibility: visible;
            }
            .printable-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .MuiDialog-paper {
              box-shadow: none !important;
            }
            .MuiDialogActions-root, .MuiDialogTitle-root, .MuiIconButton-root {
              display: none !important;
            }
          }
        `}
      </style>
    </Dialog>
  );
};

export default PatientRouteSlipDialog;
