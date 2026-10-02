import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';
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
  <Box className="estimate-info-row" sx={{ display: 'flex', gap: 1, mb: 0.75, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>
    <Box sx={{ minWidth: 132, fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap' }}>{label}:</Box>
    <Box sx={{ flex: 1, color: '#475569', textAlign: align, wordBreak: 'break-word' }}>{value || '-'}</Box>
  </Box>
);

const parseMoney = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value || '').replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) => `$${parseMoney(value).toFixed(2)}`;

const getPatientName = (patient) => {
  const first = patient?.firstName || patient?.FName || '';
  const last = patient?.lastName || patient?.LName || '';
  return `${first} ${last}`.trim() || patient?.name || patient?.fullName || 'Patient';
};

const formatAddress = (patient) => {
  const address = patient?.address || patient?.addressInfo || patient?.homeAddress || patient?.contact?.address || {};
  if (typeof address === 'string') return address || '-';
  return [
    address.street || address.addressLine1 || address.line1 || address.address1,
    address.addressLine2 || address.line2,
    address.city,
    address.state,
    address.zip || address.postalCode
  ].filter(Boolean).join(', ') || '-';
};

const getProviderId = (provider) => {
  if (!provider) return '';
  if (typeof provider === 'object') return String(provider._id || provider.id || provider.providerCode || provider.ProvNum || provider.Abbr || '');
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
  return found ? getProviderLabel(found, providersList) : id;
};

const formatPhone = (value) => value || '-';

const getPractice = (patient, appointment) => {
  const branch = appointment?.branch || appointment?.branchId || patient?.branch || patient?.branchId || patient?.clinic || {};
  const address = branch.address || branch.addressInfo || {};
  const addressLines = [
    branch.addressLine1 || address.street || address.addressLine1 || address.line1,
    branch.addressLine2 || address.line2,
    [branch.city || address.city, branch.state || address.state, branch.zip || address.zip || address.postalCode].filter(Boolean).join(', ')
  ].filter(Boolean);

  return {
    name: branch.name || branch.branchName || branch.practiceName || 'MedFlow Dental',
    addressLines,
    phone: branch.phone || branch.phoneNumber || branch.callNumber || patient?.practicePhone,
    text: branch.text || branch.textNumber || branch.smsNumber || branch.phone || branch.phoneNumber
  };
};

const getAppointmentTypeLabel = (appointment, appointmentTypes, planTitle) => {
  const raw = appointment?.appointmentTypeId || appointment?.category || appointment?.appointmentType || appointment?.type;
  if (raw && typeof raw === 'object') return raw.name || raw.label || raw.title || planTitle;
  const rawId = raw ? String(raw) : '';
  const match = appointmentTypes?.find((type) => {
    const ids = [type._id, type.id, type.name, type.label].filter(Boolean).map(String);
    return ids.includes(rawId);
  });
  return match?.name || match?.label || rawId || planTitle || 'Treatment Plan';
};

const getAppointmentDateTime = (appointment) => {
  const dateSource = appointment?.appointmentDate || appointment?.date || appointment?.scheduled || appointment?.start;
  const date = dateSource ? dayjs(dateSource) : null;
  const dateText = date?.isValid() ? date.format('MM/DD/YYYY') : '-';

  const parseTime = (value) => {
    if (!value) return null;
    const raw = String(value);
    const match = raw.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]m)?$/i);
    if (!match) {
      const fullDateTime = dayjs(raw);
      return fullDateTime.isValid() ? fullDateTime : null;
    }
    if (!date?.isValid()) return null;

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = Number(match[3] || 0);
    const meridiem = match[4]?.toLowerCase();
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    if (hour > 23 || minute > 59 || second > 59) return null;

    return date.hour(hour).minute(minute).second(second).millisecond(0);
  };

  const start = parseTime(appointment?.start || appointment?.startTime || appointment?.time);
  const end = parseTime(appointment?.end || appointment?.endTime);

  if (start?.isValid()) {
    const derivedEnd = end || (Number(appointment?.durationMinutes) ? start.add(Number(appointment.durationMinutes), 'minute') : null);
    const endText = derivedEnd?.isValid() && !derivedEnd.isSame(start) ? ` - ${derivedEnd.format('hh:mm A')}` : '';
    return { dateText, timeText: `${start.format('hh:mm A')}${endText}` };
  }

  const startTime = appointment?.time || appointment?.startTime;
  const endTime = appointment?.endTime;
  return { dateText, timeText: [startTime, endTime].filter(Boolean).join(' - ') || '-' };
};

const getAppointmentDateTitle = (dateText) => {
  const date = dayjs(dateText, 'MM/DD/YYYY');
  return date.isValid() ? `APPOINTMENT OF ${date.format('MM/DD/YYYY')}` : 'APPOINTMENT';
};

const getToothSurface = (procedure) => {
  if (procedure.site && !procedure.tooth && !procedure.toothNumber) return procedure.site;
  const tooth = procedure.tooth || procedure.toothNumber || procedure.site || procedure.Tth || '';
  const surface = procedure.surface || procedure.surf || procedure.Surf || '';
  return [tooth, surface].filter(Boolean).join('/') || '-';
};

const TreatmentPlanEstimatePrintDialog = ({
  open,
  onClose,
  patient,
  appointment,
  procedures = [],
  appointmentTypes = [],
  planTitle = 'Treatment Plan'
}) => {
  const providersList = useSelector(selectProviderDropdownList) || [];
  const patientName = getPatientName(patient);
  const practice = getPractice(patient, appointment);
  const appointmentLabel = getAppointmentTypeLabel(appointment, appointmentTypes, planTitle);
  const { dateText, timeText } = getAppointmentDateTime(appointment);
  const appointmentTitle = getAppointmentDateTitle(dateText);
  const headerDateText = dayjs().format('MMM D, YYYY h:mm A');
  const provider = getProviderLabel(appointment?.provider || appointment?.providerId || procedures[0]?.provider, providersList);
  const hygienist = getProviderLabel(appointment?.hygienist || appointment?.hygienistId || appointment?.hygienistProviderId, providersList);
  const patientDob = patient?.dateOfBirth || patient?.dob ? dayjs(patient.dateOfBirth || patient.dob).format('MM/DD/YYYY') : '-';
  const patientPhone = patient?.phonePrimary || patient?.mobileNumber || patient?.mobilePhone || patient?.phone || patient?.mobile || patient?.contact?.phone || '-';
  const patientEmail = patient?.email || patient?.emailAddress || patient?.contact?.email || '-';

  const totals = useMemo(() => {
    return procedures.reduce((acc, procedure) => {
      acc.fee += parseMoney(procedure.negRate ?? procedure.fee ?? procedure.charge);
      acc.ins += parseMoney(procedure.insEst ?? procedure.insPortion ?? procedure.insuranceAmount);
      acc.pt += parseMoney(procedure.ptEst ?? procedure.ptPortion ?? procedure.patientAmount);
      return acc;
    }, { fee: 0, ins: 0, pt: 0 });
  }, [procedures]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 10000 }}
      PaperProps={{
        sx: {
          borderRadius: '10px',
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.22)',
          overflow: 'hidden'
        }
      }}
    >
      {open && (
        <style>
          {`
            @page { size: A4 portrait; margin: 12mm; }
            @media print {
              html, body, #root { width: 100% !important; height: auto !important; overflow: visible !important; }
              body * { visibility: hidden; }
              #treatment-estimate-print, #treatment-estimate-print * { visibility: visible; }
              #treatment-estimate-print {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: none !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
                font-size: 12px !important;
                background: #fff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .treatment-estimate-no-print { display: none !important; }
              #treatment-estimate-print, #treatment-estimate-print * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #treatment-estimate-print .estimate-section-title {
                background: #eaf1fa !important;
                border: 1px solid #8092aa !important;
                color: #17365f !important;
                font-size: 11px !important;
                padding: 7px 10px !important;
              }
              #treatment-estimate-print .estimate-section-body {
                border: 1px solid #8092aa !important;
                border-top: 0 !important;
                padding: 12px !important;
              }
              #treatment-estimate-print .estimate-info-row { font-size: 11px !important; line-height: 1.45 !important; }
              #treatment-estimate-print .estimate-procedure-box { border: 1px solid #8092aa !important; border-top: 0 !important; }
              #treatment-estimate-print .MuiTable-root { width: 100% !important; border-collapse: collapse !important; }
              #treatment-estimate-print .MuiTableCell-root {
                font-size: 11px !important;
                line-height: 1.4 !important;
                padding: 7px 5px !important;
                border-bottom: 1px solid #aebdce !important;
                overflow-wrap: anywhere !important;
              }
              #treatment-estimate-print .MuiTableHead-root .MuiTableCell-root {
                background: #eaf1fa !important;
                color: #17365f !important;
                font-weight: 700 !important;
              }
              #treatment-estimate-print .MuiTableRow-root { break-inside: avoid; }
              #treatment-estimate-print > .MuiBox-root { break-inside: avoid; }
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
              .MuiDialog-container { display: block !important; }
            }
          `}
        </style>
      )}

      <DialogTitle
        className="treatment-estimate-no-print"
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
            Print Estimate
          </Typography>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#5c646f' }}>
            {patientName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent id="treatment-estimate-print" sx={{ p: 3, bgcolor: '#fff' }}>
        <Box sx={{ display: 'none', '@media print': { display: 'flex', justifyContent: 'center', width: '100%', mb: 2 } }}>
          <Box component="img" src={medflowLogo} alt="Medflow Logo" sx={{ height: 45, objectFit: 'contain' }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>
            {headerDateText}
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#334155', textAlign: 'right' }}>
            {patientName}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box className="estimate-section-title" sx={sectionHeaderSx}>PATIENT</Box>
          <Box className="estimate-section-body" sx={sectionBodySx}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <InfoRow label="Name" value={patientName} />
                <InfoRow label="Address" value={formatAddress(patient)} />
                <InfoRow label="Date of Birth" value={patientDob} />
              </Box>
              <Box>
                <InfoRow label="Email" value={patientEmail} />
                <InfoRow label="Phone Number" value={patientPhone} />
                <InfoRow label="Practice" value={practice.name} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box className="estimate-section-title" sx={sectionHeaderSx}>PRACTICE</Box>
            <Box className="estimate-section-body" sx={{ ...sectionBodySx, minHeight: 98 }}>
              <InfoRow label="Name" value={practice.name} />
              <InfoRow label="Address" value={practice.addressLines.join(', ') || '-'} />
              <InfoRow label="Call" value={formatPhone(practice.phone)} />
              <InfoRow label="Text" value={formatPhone(practice.text)} />
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box className="estimate-section-title" sx={sectionHeaderSx}>ESTIMATE TOTALS</Box>
            <Box className="estimate-section-body" sx={{ ...sectionBodySx, minHeight: 98 }}>
              <InfoRow label="Total Fee" value={money(totals.fee)} align="right" />
              <InfoRow label="Insurance Est" value={money(totals.ins)} align="right" />
              <InfoRow label="Patient Est" value={money(totals.pt)} align="right" />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box className="estimate-section-title" sx={sectionHeaderSx}>{appointmentTitle}</Box>
          <Box className="estimate-section-body" sx={sectionBodySx}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <Box>
                <InfoRow label="Date" value={dateText} />
                <InfoRow label="Time" value={timeText} />
              </Box>
              <Box>
                <InfoRow label="Appointment" value={appointmentLabel} />
                <InfoRow label="Plan" value={planTitle} />
              </Box>
              <Box>
                <InfoRow label="Provider" value={provider} />
                <InfoRow label="Hygienist" value={hygienist} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box className="estimate-section-title" sx={sectionHeaderSx}>TREATMENT PLAN PROCEDURES</Box>
          <Box className="estimate-procedure-box" sx={{ border: '1px solid #d9e2ef', borderTop: 'none' }}>
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  {[
                    ['CDT Code', '11%'],
                    ['Tth/Surf', '11%'],
                    ['Description', '43%'],
                    ['Fee', '12%'],
                    ['Ins Est', '12%'],
                    ['Pt Est', '11%']
                  ].map(([label, width]) => (
                    <TableCell key={label} sx={{ width, py: 0.75, px: 0.75, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderColor: '#d9e2ef' }}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.length > 0 ? procedures.map((procedure, index) => (
                  <TableRow key={procedure.id || procedure._id || `${procedure.code}-${index}`}>
                    <TableCell sx={{ borderColor: '#edf2f7', py: 0.9, px: 0.75, fontSize: '0.72rem', color: '#111827', fontWeight: 700 }}>{procedure.code || procedure.procedureCode || '-'}</TableCell>
                    <TableCell sx={{ borderColor: '#edf2f7', py: 0.9, px: 0.75, fontSize: '0.72rem', color: '#111827' }}>{getToothSurface(procedure)}</TableCell>
                    <TableCell sx={{ borderColor: '#edf2f7', py: 0.9, px: 0.75, fontSize: '0.72rem', color: '#111827' }}>{procedure.description || procedure.treatment || procedure.name || '-'}</TableCell>
                    <TableCell sx={{ borderColor: '#edf2f7', py: 0.9, px: 0.75, fontSize: '0.72rem', color: '#111827', textAlign: 'right' }}>{money(procedure.negRate ?? procedure.fee ?? procedure.charge)}</TableCell>
                    <TableCell sx={{ borderColor: '#edf2f7', py: 0.9, px: 0.75, fontSize: '0.72rem', color: '#111827', textAlign: 'right' }}>{money(procedure.insEst ?? procedure.insPortion ?? procedure.insuranceAmount)}</TableCell>
                    <TableCell sx={{ borderColor: '#edf2f7', py: 0.9, px: 0.75, fontSize: '0.72rem', color: '#111827', textAlign: 'right' }}>{money(procedure.ptEst ?? procedure.ptPortion ?? procedure.patientAmount)}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 3, textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                      No procedures in this treatment plan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', mt: 2 }}>
          <Box sx={{ flex: 1.35 }}>
            <Box className="estimate-section-title" sx={sectionHeaderSx}>PATIENT AUTHORIZATION</Box>
            <Box className="estimate-section-body" sx={{ ...sectionBodySx, minHeight: 128 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#111827' }}>
                Patient Signature (For minor, Parent or Guardian)
              </Typography>
              <Box sx={{ mt: 4.5, borderBottom: '1px solid #9ca3af', width: '88%' }} />
              <Typography sx={{ mt: 3.5, fontSize: '0.78rem', color: '#111827' }}>Date</Typography>
              <Box sx={{ mt: 4, borderBottom: '1px solid #9ca3af', width: '42%' }} />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box className="estimate-section-title" sx={sectionHeaderSx}>ESTIMATE SUMMARY</Box>
            <Box className="estimate-section-body" sx={{ ...sectionBodySx, minHeight: 128 }}>
              <InfoRow label="Total Fee" value={money(totals.fee)} align="right" />
              <InfoRow label="Insurance Est" value={money(totals.ins)} align="right" />
              <InfoRow label="Patient Est" value={money(totals.pt)} align="right" />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="treatment-estimate-no-print" sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ height: 36, borderRadius: '8px', textTransform: 'none', borderColor: '#cbd5e1', color: '#475569', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button onClick={() => window.print()} variant="contained" startIcon={<PrintIcon />} sx={{ height: 36, borderRadius: '8px', textTransform: 'none', bgcolor: '#2262ef', boxShadow: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentPlanEstimatePrintDialog;
