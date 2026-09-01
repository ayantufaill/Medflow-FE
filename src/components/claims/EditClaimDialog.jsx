import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fetchProviders, selectProviderList } from '../../store/slices/providerSlice';
import EditClaimLeftColumn from './edit-claim/EditClaimLeftColumn';
import EditClaimMiddleColumn from './edit-claim/EditClaimMiddleColumn';
import EditClaimRightColumn from './edit-claim/EditClaimRightColumn';

const EditClaimDialog = ({ open, claim, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    accidentDate: '',
    diagnosticCode: '',
    predeterminationNumber: '',
    serviceLocation: '',
    laboratoryId: '',
    documentControlNumber: '',
    delayReasonCode: 'None',
    priorPlacementDate: '',
    treatmentRequiredForOrtho: false,
    estimatedTreatmentStartDate: '',
    initialPayment: '',
    
    accidentIndicator: 'Non Accident',
    autoAccidentState: '',
    referralDate: '',
    admissionDate: '',
    dischargeDate: '',
    billingEntity: '',
    serviceAuthExceptionCode: 'None',
    remittanceDate: '',
    dateOrthoAppliancePlaced: '',
    srpLastDate: '',
    
    attachmentIndicator: 'No',
    attachmentType: 'None',
    attachmentTransmissionCode: 'None',
    additionalAttachmentInformation: '',
    claimSubmissionReasonCode: 'None',
    treatingProvider: '',
    insurancePaymentAmount: '',
    treatmentDurationMonths: ''
  });

  const dispatch = useDispatch();
  const providersData = useSelector(selectProviderList) || [];

  useEffect(() => {
    dispatch(fetchProviders({ page: 1, limit: 100 }));
  }, [dispatch]);

  const providerOptions = useMemo(() => {
    return providersData.map(p => {
      const name = p.userId ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim() : `${p.firstName || ''} ${p.lastName || ''}`.trim();
      return { value: p._id || name, label: name || 'Unnamed Provider' };
    });
  }, [providersData]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && claim) {
      setFormData({
        accidentDate: claim.accidentDate || '',
        diagnosticCode: claim.diagnosticCode || '',
        predeterminationNumber: claim.predeterminationNumber || '',
        serviceLocation: claim.serviceLocation || '',
        laboratoryId: claim.laboratoryId || '',
        documentControlNumber: claim.documentControlNumber || '',
        delayReasonCode: claim.delayReasonCode || 'None',
        priorPlacementDate: claim.priorPlacementDate || '',
        treatmentRequiredForOrtho: claim.treatmentRequiredForOrtho || false,
        estimatedTreatmentStartDate: claim.estimatedTreatmentStartDate || '',
        initialPayment: claim.initialPayment || '',
        accidentIndicator: claim.accidentIndicator || 'Non Accident',
        autoAccidentState: claim.autoAccidentState || '',
        referralDate: claim.referralDate || '',
        admissionDate: claim.admissionDate || '',
        dischargeDate: claim.dischargeDate || '',
        billingEntity: claim.billingEntity || '',
        serviceAuthExceptionCode: claim.serviceAuthExceptionCode || 'None',
        remittanceDate: claim.remittanceDate || '',
        dateOrthoAppliancePlaced: claim.dateOrthoAppliancePlaced || '',
        srpLastDate: claim.srpLastDate || '',
        attachmentIndicator: claim.attachmentIndicator || 'No',
        attachmentType: claim.attachmentType || 'None',
        attachmentTransmissionCode: claim.attachmentTransmissionCode || 'None',
        additionalAttachmentInformation: claim.additionalAttachmentInformation || '',
        claimSubmissionReasonCode: claim.claimSubmissionReasonCode || 'None',
        treatingProvider: claim.provider || claim.treatingProvider || '',
        insurancePaymentAmount: claim.insurancePaymentAmount || '',
        treatmentDurationMonths: claim.treatmentDurationMonths || ''
      });
    }
  }, [open, claim]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ zIndex: 15000 }}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle sx={{ 
        boxSizing: "border-box",
        px: "25px",
        py: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderBottom: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_TINT,
        m: 0,
        flexShrink: 0,
      }}>
        <ReceiptIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Edit Claim #{claim?.claimNumber || claim?.id || 'New'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, pt: '24px !important' }}>
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN */}
          <Grid size={{ xs: 12, md: 4 }}>
            <EditClaimLeftColumn formData={formData} handleChange={handleChange} />
          </Grid>

          {/* MIDDLE COLUMN */}
          <Grid size={{ xs: 12, md: 4 }}>
            <EditClaimMiddleColumn formData={formData} handleChange={handleChange} providerOptions={providerOptions} />
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid size={{ xs: 12, md: 4 }}>
            <EditClaimRightColumn formData={formData} handleChange={handleChange} providerOptions={providerOptions} />
          </Grid>
          
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, px: 3, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={isSaving}
          sx={{ 
            backgroundColor: COLORS.ACCENT, 
            color: '#ffffff',
            borderRadius: '8px',
            fontFamily: 'Inter',
            fontWeight: 600,
            px: 3,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: COLORS.ACCENT_HOVER,
              boxShadow: 'none'
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Edit Claim'}
        </Button>
        <Button 
          onClick={onClose}
          variant="outlined" 
          size="small"
          sx={{ 
            color: '#64748b',
            borderColor: '#cbd5e1',
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 600,
            px: 2,
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9', boxShadow: 'none' }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClaimDialog;
