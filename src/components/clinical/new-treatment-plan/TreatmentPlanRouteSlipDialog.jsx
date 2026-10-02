import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import { fetchPatientInsurances, selectPatientInsurancesCache } from '../../../store/slices/patientSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { COLORS } from '../../../constants/colors';
import medflowLogo from '../../../assets/medflow-logo.png';

const sectionHeaderSx = {
  bgcolor: '#f3f8fd',
  border: '1px solid #d9e2ef',
  py: 0.75,
  px: 1.5,
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#1e3a5f',
  textTransform: 'uppercase'
};

const sectionBodySx = {
  border: '1px solid #d9e2ef',
  borderTop: 'none',
  bgcolor: '#fff',
  p: 1.5
};

const InfoRow = ({ label, value, align = 'left' }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 0.75, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>
    <Box sx={{ minWidth: 132, fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap' }}>{label}:</Box>
    <Box sx={{ flex: 1, color: '#475569', textAlign: align, wordBreak: 'break-word' }}>{value || '-'}</Box>
  </Box>
);

const parseMoney = (value) => {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value || '').replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) => `$${parseMoney(value).toFixed(2)}`;

const formatAddress = (patient) => {
  const address = patient?.address || patient?.addressInfo || {};
  if (typeof address === 'string') return address || '-';
  return [
    address.street || address.addressLine1 || address.line1,
    address.addressLine2 || address.line2,
    address.city,
    address.state,
    address.zip || address.postalCode
  ].filter(Boolean).join(', ') || '-';
};

const getPatientName = (patient) => {
  const first = patient?.firstName || patient?.FName || '';
  const last = patient?.lastName || patient?.LName || '';
  return `${first} ${last}`.trim() || patient?.name || 'No patient selected';
};

const getProviderId = (provider) => {
  if (!provider) return '';
  if (typeof provider === 'object') return String(provider._id || provider.id || provider.providerCode || provider.ProvNum || '');
  return String(provider);
};

const getProviderLabel = (provider, providersList) => {
  if (!provider || provider === '-') return '-';
  if (typeof provider === 'object') {
    const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
    const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
    return provider.name || `${first} ${last}`.trim() || provider.providerCode || provider.Abbr || getProviderId(provider) || '-';
  }
  const id = String(provider);
  const found = providersList.find((p) => {
    const ids = [p._id, p.id, p.providerCode, p.ProvNum, p.Abbr].filter(Boolean).map(String);
    return ids.includes(id);
  });
  if (!found) return id;
  return getProviderLabel(found, providersList);
};

const getAppointmentDate = (appointment, procedures) => {
  const rawDate = appointment?.appointmentDate || appointment?.date || appointment?.start || appointment?.startTime;
  if (rawDate) return dayjs(rawDate);
  const scheduledProcedure = procedures.find((procedure) => procedure.scheduled && procedure.scheduled !== '-');
  if (scheduledProcedure) return dayjs(scheduledProcedure.scheduled, ['MM/DD/YYYY', 'YYYY-MM-DD']);
  return dayjs();
};

const TreatmentPlanRouteSlipDialog = ({
  open,
  onClose,
  patient,
  appointment,
  procedures = [],
  planTitle = 'Treatment Plan'
}) => {
  const dispatch = useDispatch();
  const printRef = useRef(null);
  const patientId = patient?._id || patient?.id;
  const insurancesCache = useSelector(selectPatientInsurancesCache);
  const providersList = useSelector(selectProviderDropdownList) || [];
  const patientName = getPatientName(patient);
  const appointmentDate = getAppointmentDate(appointment, procedures);

  useEffect(() => {
    if (!open) return;
    if (providersList.length === 0) {
      dispatch(fetchAllProvidersForDropdown());
    }
    if (patientId && !insurancesCache?.[patientId]?.data) {
      dispatch(fetchPatientInsurances({ patientId })).catch(() => {});
    }
  }, [dispatch, open, patientId, providersList.length, insurancesCache]);

  const insurances = useMemo(() => {
    const cached = patientId ? insurancesCache?.[patientId]?.data : null;
    if (Array.isArray(cached)) return cached;
    const fromPatient = patient?.insurances || patient?.insurance || patient?.coverages;
    return Array.isArray(fromPatient) ? fromPatient : [];
  }, [insurancesCache, patient, patientId]);

  const totals = useMemo(() => {
    return procedures.reduce((acc, procedure) => {
      acc.fee += parseMoney(procedure.negRate || procedure.fee || procedure.charge);
      acc.ins += parseMoney(procedure.insEst || procedure.insPortion || procedure.insuranceAmount);
      acc.pt += parseMoney(procedure.ptEst || procedure.ptPortion || procedure.patientAmount);
      return acc;
    }, { fee: 0, ins: 0, pt: 0 });
  }, [procedures]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 10000 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.22)',
          overflow: 'hidden'
        }
      }}
    >
      {open && (
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #treatment-route-slip-print, #treatment-route-slip-print * { visibility: visible; }
              #treatment-route-slip-print {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 900px !important;
                max-width: 900px !important;
                margin: 0 !important;
                padding: 28px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .treatment-route-slip-no-print { display: none !important; }
              .MuiDialog-root, .MuiDialog-container, .MuiDialog-paper, .MuiDialogContent-root {
                position: absolute !important;
                inset: 0 auto auto 0 !important;
                width: 100% !important;
                max-width: none !important;
                height: auto !important;
                max-height: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                box-shadow: none !important;
                border: 0 !important;
                transform: none !important;
              }
            }
          `}
        </style>
      )}

      <DialogTitle
        className="treatment-route-slip-no-print"
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#f3f8fd',
          borderBottom: `1px solid ${COLORS.BORDER}`
        }}
      >
        <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#eff6ff', color: '#2262ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PrintIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', fontWeight: 700, color: '#09121f' }}>
            Patient Route Slip
          </Typography>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#5c646f' }}>
            {patientName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent id="treatment-route-slip-print" ref={printRef} sx={{ p: 3, bgcolor: '#fff' }}>
        <Box sx={{ display: 'none', '@media print': { display: 'flex', justifyContent: 'center', width: '100%', mb: 3 } }}>
          <Box component="img" src={medflowLogo} alt="Medflow Logo" sx={{ height: 45, objectFit: 'contain' }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>
            {appointmentDate.format('dddd MMM DD, YYYY')}
          </Typography>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: 0 }}>
            PATIENT ROUTE SLIP
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#334155', textAlign: 'right' }}>
            {patientName}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={sectionHeaderSx}>PATIENT</Box>
          <Box sx={sectionBodySx}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Name" value={patientName} />
                <InfoRow label="Address" value={formatAddress(patient)} />
                <InfoRow label="Date of Birth" value={patient?.dateOfBirth || patient?.dob ? dayjs(patient.dateOfBirth || patient.dob).format('MM/DD/YYYY') : '-'} />
                <InfoRow label="Email" value={patient?.email || patient?.emailAddress || '-'} />
                <InfoRow label="Phone Number" value={patient?.phonePrimary || patient?.mobileNumber || patient?.mobile || patient?.phone || '-'} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoRow label="Preferred Dentist" value={getProviderLabel(patient?.preferredDentist || patient?.preferredProvider || patient?.preferredDentistId, providersList)} />
                <InfoRow label="Preferred Hygienist" value={getProviderLabel(patient?.preferredHygienist || patient?.preferredHygienistId, providersList)} />
                <InfoRow label="Referring Sources" value={patient?.referralSource || patient?.referringSource || '-'} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={sectionHeaderSx}>ACCOUNT</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 98 }}>
              <InfoRow label="Treatment Total" value={money(totals.fee)} align="right" />
              <InfoRow label="Insurance Est" value={money(totals.ins)} align="right" />
              <InfoRow label="Patient Est" value={money(totals.pt)} align="right" />
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={sectionHeaderSx}>INSURANCE</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 98 }}>
              {insurances.length > 0 ? (
                insurances.slice(0, 3).map((insurance, index) => (
                  <Box key={insurance._id || insurance.id || index} sx={{ mb: index === insurances.length - 1 ? 0 : 0.75 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1f2937' }}>
                      {insurance.insuranceCompany?.name || insurance.companyName || insurance.name || insurance.planName || 'Insurance'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
                      ID: {insurance.subscriberId || insurance.memberId || '-'} | Group: {insurance.groupNumber || insurance.group || '-'}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>No active insurance</Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={sectionHeaderSx}>{`APPOINTMENT OF ${appointmentDate.format('MM/DD/YYYY')}`}</Box>
          <Box sx={sectionBodySx}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <InfoRow label="Time" value={appointment?.time || (appointment?.startTime ? dayjs(`1970-01-01 ${appointment.startTime}`).format('h:mm A') : appointmentDate.format('h:mm A'))} />
                <InfoRow label="Plan" value={planTitle} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InfoRow label="Provider" value={getProviderLabel(appointment?.provider || appointment?.providerId || procedures[0]?.provider, providersList)} />
                <InfoRow label="Room" value={appointment?.room?.name || appointment?.roomName || appointment?.operatory || '-'} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InfoRow label="Procedures" value={procedures.length ? String(procedures.length) : '0'} />
                <InfoRow label="Status" value={appointment?.status || '-'} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={sectionHeaderSx}>TREATMENT PLAN PROCEDURES</Box>
          <Box sx={{ border: '1px solid #d9e2ef', borderTop: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  {['Status', 'Date', 'Site', 'Code', 'Description', 'Provider', 'Fee', 'Ins Est', 'Pt Est'].map((heading) => (
                    <TableCell key={heading} sx={{ py: 0.75, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderColor: '#d9e2ef' }}>
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.length > 0 ? procedures.map((procedure) => (
                  <TableRow key={procedure.id || `${procedure.code}-${procedure.site}`}>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.status || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.scheduled && procedure.scheduled !== '-' ? procedure.scheduled : procedure.created || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.site || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7', fontWeight: 700 }}>{procedure.code || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.description || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{getProviderLabel(procedure.provider, providersList)}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.negRate || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.insEst || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', borderColor: '#edf2f7' }}>{procedure.ptEst || '-'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ py: 3, textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                      No procedures in this treatment plan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>

        <Box>
          <Box sx={sectionHeaderSx}>NEXT APPOINTMENT</Box>
          <Box sx={{ ...sectionBodySx, textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            No future appointments scheduled.
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="treatment-route-slip-no-print" sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ height: 36, borderRadius: '8px', textTransform: 'none', borderColor: '#cbd5e1', color: '#475569', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button onClick={handlePrint} variant="contained" startIcon={<PrintIcon />} sx={{ height: 36, borderRadius: '8px', textTransform: 'none', bgcolor: '#2262ef', boxShadow: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentPlanRouteSlipDialog;
