import React from 'react';
import { 
  Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow, Checkbox, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import medflowLogo from '../../assets/medflow-logo.png';

/* ── Print-preview helpers ── */
const sectionHeaderSx = {
  border: '1px solid #d9e2ef',
  py: 0.75,
  px: 1.5,
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.75rem',
  fontWeight: 800,
  color: '#1e3a5f',
  textTransform: 'uppercase',
  '@media print': {
    border: '1px solid #d9e2ef !important',
    WebkitPrintColorAdjust: 'exact !important',
    printColorAdjust: 'exact !important',
  }
};

const sectionBodySx = {
  border: '1px solid #d9e2ef',
  borderTop: 'none',
  p: 1.5,
  '@media print': {
    border: '1px solid #d9e2ef !important',
    borderTop: 'none !important',
    WebkitPrintColorAdjust: 'exact !important',
    printColorAdjust: 'exact !important',
  }
};

const InfoRow = ({ label, value, align = 'left' }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 0.75, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>
    <Box sx={{ minWidth: 132, fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap' }}>{label}:</Box>
    <Box sx={{ flex: 1, color: '#475569', textAlign: align, wordBreak: 'break-word' }}>{value || '-'}</Box>
  </Box>
);

const RxPrintPreviewDialog = ({ open, onClose, onPrint, data, patient, providerName, providerDea }) => {
  const patientName = patient
    ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'N/A'
    : 'N/A';
  const patientId = patient?.chartNumber || patient?.id || patient?._id || 'N/A';
  const patientDob = patient?.dateOfBirth || patient?.dob
    ? dayjs(patient.dateOfBirth || patient.dob).format('MM/DD/YYYY')
    : '-';
  const patientPhone = patient?.phonePrimary || patient?.mobileNumber || patient?.mobilePhone || patient?.phone || '-';
  const patientAddress = (() => {
    const addr = patient?.address || patient?.addressInfo || {};
    if (typeof addr === 'string') return addr || '-';
    return [addr.street || addr.addressLine1, addr.city, addr.state, addr.zip || addr.postalCode].filter(Boolean).join(', ') || '-';
  })();

  const handlePrint = () => {
    if (onPrint) onPrint();
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
            @page { size: A4 portrait; margin: 12mm; }
            @media print {
              html, body, #root { width: 100% !important; height: auto !important; overflow: visible !important; }
              body * { visibility: hidden; }
              #rx-print-content, #rx-print-content * { visibility: visible; }
              #rx-print-content {
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
              .rx-print-no-print { display: none !important; }

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
        className="rx-print-no-print"
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
            Print Prescription
          </Typography>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#5c646f' }}>
            {patientName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent id="rx-print-content" sx={{ p: 3, bgcolor: '#fff' }}>
        {/* Logo – visible only in print */}
        <Box sx={{ display: 'none', '@media print': { display: 'flex', justifyContent: 'center', width: '100%', mb: 2 } }}>
          <Box component="img" src={medflowLogo} alt="Medflow Logo" sx={{ height: 40, objectFit: 'contain' }} />
        </Box>

        {/* Header row (matches Route Slip) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#64748b', pb: 0.5 }}>
            {dayjs().format('dddd MMM DD, YYYY')}
          </Typography>
          
          {/* Centered Title with Dashed Underline */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              color: '#1d4ed8', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: '1.5px dashed #3b82f6',
              pb: 0.5,
              px: 1
            }}>
              Prescription
            </Typography>
          </Box>

          <Typography sx={{ fontSize: '0.75rem', color: '#64748b', pb: 0.5, textAlign: 'right' }}>
            {patientName}
          </Typography>
        </Box>

        {/* PATIENT SECTION */}
        <Box sx={{ mb: 3 }}>
          <Box sx={sectionHeaderSx}>PATIENT INFORMATION</Box>
          <Box sx={sectionBodySx}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <InfoRow label="Patient Name" value={patientName} />
                <InfoRow label="Patient #" value={patientId} />
                <InfoRow label="Date of Birth" value={patientDob} />
              </Box>
              <Box>
                <InfoRow label="Phone" value={patientPhone} />
                <InfoRow label="Address" value={patientAddress} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* PRESCRIPTION DETAILS - NOW A TABLE */}
        <Box sx={{ mb: 3 }}>
          <Table size="small" sx={{ 
            border: '1px solid #d9e2ef', 
            tableLayout: 'fixed',
            '@media print': {
              border: '1px solid #d9e2ef !important',
            }
          }}>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: '#f8fafc',
                '@media print': {
                  backgroundColor: '#f8fafc !important',
                  WebkitPrintColorAdjust: 'exact !important',
                  printColorAdjust: 'exact !important'
                }
              }}>
                <TableCell sx={{ 
                  py: 0.75, px: 1, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderBottom: '1px solid #d9e2ef', width: '25%',
                  '@media print': {
                    borderBottom: '1px solid #d9e2ef !important',
                    color: '#52637a !important',
                  }
                }}>Drug Name</TableCell>
                <TableCell sx={{ 
                  py: 0.75, px: 1, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderBottom: '1px solid #d9e2ef', width: '15%',
                  '@media print': {
                    borderBottom: '1px solid #d9e2ef !important',
                    color: '#52637a !important',
                  }
                }}>Dose</TableCell>
                <TableCell sx={{ 
                  py: 0.75, px: 1, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderBottom: '1px solid #d9e2ef', width: '12%',
                  '@media print': {
                    borderBottom: '1px solid #d9e2ef !important',
                    color: '#52637a !important',
                  }
                }}>Quantity</TableCell>
                <TableCell sx={{ 
                  py: 0.75, px: 1, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderBottom: '1px solid #d9e2ef', width: '15%',
                  '@media print': {
                    borderBottom: '1px solid #d9e2ef !important',
                    color: '#52637a !important',
                  }
                }}>Duration</TableCell>
                <TableCell sx={{ 
                  py: 0.75, px: 1, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderBottom: '1px solid #d9e2ef', width: '20%',
                  '@media print': {
                    borderBottom: '1px solid #d9e2ef !important',
                    color: '#52637a !important',
                  }
                }}>Route / Form</TableCell>
                <TableCell sx={{ 
                  py: 0.75, px: 1, fontSize: '0.68rem', fontWeight: 800, color: '#52637a', borderBottom: '1px solid #d9e2ef', width: '13%',
                  '@media print': {
                    borderBottom: '1px solid #d9e2ef !important',
                    color: '#52637a !important',
                  }
                }}>Refills</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ 
                  py: 1, px: 1, fontSize: '0.72rem', color: '#0f172a', fontWeight: 600, borderBottom: '1px solid #edf2f7', borderRight: '1px solid #edf2f7',
                  '@media print': { borderBottom: '1px solid #edf2f7 !important', borderRight: '1px solid #edf2f7 !important' }
                }}>
                  {data.drugName || '-'}
                </TableCell>
                <TableCell sx={{ 
                  py: 1, px: 1, fontSize: '0.72rem', color: '#334155', borderBottom: '1px solid #edf2f7', borderRight: '1px solid #edf2f7',
                  '@media print': { borderBottom: '1px solid #edf2f7 !important', borderRight: '1px solid #edf2f7 !important' }
                }}>{data.dose || '-'}</TableCell>
                <TableCell sx={{ 
                  py: 1, px: 1, fontSize: '0.72rem', color: '#334155', borderBottom: '1px solid #edf2f7', borderRight: '1px solid #edf2f7',
                  '@media print': { borderBottom: '1px solid #edf2f7 !important', borderRight: '1px solid #edf2f7 !important' }
                }}>{data.quantity || '-'}</TableCell>
                <TableCell sx={{ 
                  py: 1, px: 1, fontSize: '0.72rem', color: '#334155', borderBottom: '1px solid #edf2f7', borderRight: '1px solid #edf2f7',
                  '@media print': { borderBottom: '1px solid #edf2f7 !important', borderRight: '1px solid #edf2f7 !important' }
                }}>{data.duration || '-'}</TableCell>
                <TableCell sx={{ 
                  py: 1, px: 1, fontSize: '0.72rem', color: '#334155', borderBottom: '1px solid #edf2f7', borderRight: '1px solid #edf2f7',
                  '@media print': { borderBottom: '1px solid #edf2f7 !important', borderRight: '1px solid #edf2f7 !important' }
                }}>
                  {data.route || '-'} / {data.form || '-'}
                </TableCell>
                <TableCell sx={{ 
                  py: 1, px: 1, fontSize: '0.72rem', color: '#334155', borderBottom: '1px solid #edf2f7',
                  '@media print': { borderBottom: '1px solid #edf2f7 !important' }
                }}>{data.refills || '0'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* INSTRUCTIONS */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={sectionHeaderSx}>PATIENT INSTRUCTIONS</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 60 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#475569', whiteSpace: 'pre-wrap' }}>
                {data.patientInstructions || 'None'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={sectionHeaderSx}>RX INSTRUCTIONS</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 60 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#475569', whiteSpace: 'pre-wrap' }}>
                {data.rxInstructions || 'None'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* NOTES */}
        {data.notes && (
          <Box sx={{ mb: 2 }}>
            <Box sx={sectionHeaderSx}>NOTES</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 40 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#475569', whiteSpace: 'pre-wrap' }}>
                {data.notes}
              </Typography>
            </Box>
          </Box>
        )}

        {/* PROVIDER / SIGNATURE */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={sectionHeaderSx}>PRESCRIBER</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 128 }}>
              <InfoRow label="Provider" value={providerName || '-'} />
              <InfoRow label="DEA #" value={providerDea || '-'} />
              <Box sx={{ mt: 5, borderBottom: '1px solid #9ca3af', width: '88%' }} />
              <Typography sx={{ mt: 0.5, fontSize: '0.72rem', color: '#6b7280' }}>
                Provider Signature
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={sectionHeaderSx}>AUTHORIZATION</Box>
            <Box sx={{ ...sectionBodySx, minHeight: 128 }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={!!data.maySubstituteGeneric} disabled sx={{ p: 0.5 }} />}
                label={<Typography sx={{ fontSize: '0.78rem', color: '#111827' }}>May Substitute Generic</Typography>}
              />
              <Box sx={{ mt: 3.5, borderBottom: '1px solid #9ca3af', width: '88%' }} />
              <Typography sx={{ mt: 0.5, fontSize: '0.72rem', color: '#6b7280' }}>Date</Typography>
              <Box sx={{ mt: 2, borderBottom: '1px solid #9ca3af', width: '42%' }} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="rx-print-no-print" sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: 1 }}>
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

export default RxPrintPreviewDialog;
