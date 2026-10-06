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
import DynamicRouteSlipRenderer from '../../common/DynamicRouteSlipRenderer';

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
        <DynamicRouteSlipRenderer 
          patient={patient} 
          appointment={appointment} 
          procedures={procedures} 
          planTitle={planTitle} 
          insurances={insurances} 
        />
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
