import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Description as DescriptionIcon, Print as PrintIcon } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import PatientRegistrationDocument from './PatientRegistrationDocument';
import { COLORS } from '../../../constants/colors';
import { usePatientInsurance } from '../../../hooks/redux/usePatientInsurance';
import { fetchFeeGuides, selectFeeGuides } from '../../../store/slices/feeGuideSlice';

const TYPO = {
  fontFamily: 'Inter, sans-serif',
};

export default function PatientRegistrationPreviewDialog({ open, onClose, patient, careTeamProviders }) {
  const componentRef = useRef(null);
  const dispatch = useDispatch();
  
  const patientId = patient?._id || patient?.id;
  const { insurances, fetch: fetchInsurances } = usePatientInsurance(patientId);
  const feeGuides = useSelector(selectFeeGuides);

  useEffect(() => {
    if (open && patientId) {
      fetchInsurances();
      if (!feeGuides || feeGuides.length === 0) {
        dispatch(fetchFeeGuides());
      }
    }
  }, [open, patientId, fetchInsurances, feeGuides?.length, dispatch]);

  const patientWithInsurances = patient ? { ...patient, insurances } : null;

  const handlePrint = () => {
    const element = componentRef.current;
    if (!element) return;

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `Registration_${patient?.firstName || ''}_${patient?.lastName || ''}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!patient) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex', 
          flexDirection: 'column', 
          borderRadius: '14px', 
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden' 
        }
      }}
    >
      <DialogTitle sx={{
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
      }}>
        <DescriptionIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: TYPO.fontFamily }}>
          Print Registration Form
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', alignItems: 'center', overflowY: 'auto' }}>
        <Box sx={{ flexGrow: 1, position: 'relative', p: 4, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            width: '8.5in', // Standard US Letter width
            height: 'fit-content',
            bgcolor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden'
          }}>
          {/* This inner box is what actually gets printed */}
          <Box ref={componentRef}>
              <PatientRegistrationDocument patient={patientWithInsurances} careTeamProviders={careTeamProviders} feeGuides={feeGuides} ref={componentRef} />
          </Box>
        </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, backgroundColor: '#ffffff', borderTop: `1px solid ${COLORS.BORDER}`, justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            textTransform: 'none',
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            py: 0.75,
            '&:hover': {
              borderColor: COLORS.BORDER,
              backgroundColor: COLORS.SURFACE_HOVER,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          sx={{
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            boxShadow: 'none',
            borderRadius: '8px',
            px: 2,
            py: 0.8,
            height: 36,
            border: '1px solid #3b82f6',
            backgroundColor: 'transparent',
            color: '#3b82f6',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.04)' },
          }}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
