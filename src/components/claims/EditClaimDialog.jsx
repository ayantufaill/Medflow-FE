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
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fetchProviders, selectProviderList } from '../../store/slices/providerSlice';

const labelSx = { 
  fontSize: '12px', 
  fontWeight: 600, 
  color: '#334155', 
  mb: 0.5, 
  display: 'block' 
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: "42px", 
    borderRadius: '8px', 
    backgroundColor: COLORS.SURFACE_INPUT, 
    fontFamily: "Inter",
    "& fieldset": { borderWidth: "1.2px", borderColor: COLORS.BORDER },
    "&:hover fieldset": { borderColor: COLORS.TEXT_MUTED },
    "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT, borderWidth: "1.2px" },
    "&.Mui-error fieldset": { borderColor: COLORS.STATUS_ERROR },
  },
  "& .MuiOutlinedInput-input": { padding: "8px 12px", fontSize: '14px' },
};

const selectSx = {
  '& .MuiInputBase-root': {
    height: 36,
    fontSize: '13px',
    fontFamily: 'Inter',
    fontWeight: 500,
    color: '#09121f',
    backgroundColor: '#fafbfe',
    borderRadius: '4px',
  },
  '& .MuiSelect-select': {
    py: 1,
    pl: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0'
  }
};

const menuItemSx = { fontFamily: 'Inter', fontSize: '13px' };

const dropdownMenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  PaperProps: {
    style: {
      maxHeight: 250,
    },
  },
  sx: { zIndex: 150001 }
};

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
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Accident Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.accidentDate} 
                onChange={handleChange('accidentDate')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Diagnostic Code</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.diagnosticCode} 
                onChange={handleChange('diagnosticCode')}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Predetermination Number</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.predeterminationNumber} 
                onChange={handleChange('predeterminationNumber')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Service Location</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined"
                size="small"
                fullWidth 
                value={formData.serviceLocation} 
                onChange={handleChange('serviceLocation')}
                sx={selectSx}
              >
                <MenuItem value="" sx={menuItemSx}><em>Select a location</em></MenuItem>
                <MenuItem value="Office" sx={menuItemSx}>Office</MenuItem>
                <MenuItem value="Hospital" sx={menuItemSx}>Hospital</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Laboratory or Facility Primary ID</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.laboratoryId} 
                onChange={handleChange('laboratoryId')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Document Control Number</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.documentControlNumber} 
                onChange={handleChange('documentControlNumber')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Delay Reason Code</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.delayReasonCode} 
                onChange={handleChange('delayReasonCode')}
                sx={selectSx}
              >
                <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
                <MenuItem value="Proof of eligibility Unknown or Unavailable" sx={menuItemSx}>Proof of eligibility Unknown or Unavailable</MenuItem>
                <MenuItem value="Litigation" sx={menuItemSx}>Litigation</MenuItem>
                <MenuItem value="Authorization Delays" sx={menuItemSx}>Authorization Delays</MenuItem>
                <MenuItem value="Delay in Certifying Provider" sx={menuItemSx}>Delay in Certifying Provider</MenuItem>
                <MenuItem value="Delay in Supplying Billing Forms" sx={menuItemSx}>Delay in Supplying Billing Forms</MenuItem>
                <MenuItem value="Delay in Delivery of Custom made Appliances" sx={menuItemSx}>Delay in Delivery of Custom made Appliances</MenuItem>
                <MenuItem value="Third Party Processing Delay" sx={menuItemSx}>Third Party Processing Delay</MenuItem>
                <MenuItem value="Delay in Eligibility Determination" sx={menuItemSx}>Delay in Eligibility Determination</MenuItem>
                <MenuItem value="Original Claim Rejected or Denied Due to a Reason Unrelated to the Billing Limitation Rules" sx={menuItemSx}>Original Claim Rejected or Denied Due to a Reason Unrelated to the Billing Limitation Rules</MenuItem>
                <MenuItem value="Administration Delay in the Prior Approval Process" sx={menuItemSx}>Administration Delay in the Prior Approval Process</MenuItem>
                <MenuItem value="Other" sx={menuItemSx}>Other</MenuItem>
                <MenuItem value="Natural Disaster" sx={menuItemSx}>Natural Disaster</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography sx={labelSx}>Prior Placement Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.priorPlacementDate} 
                onChange={handleChange('priorPlacementDate')}
                sx={inputSx}
              />
            </Box>
            
            <Typography sx={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'underline', mb: 1, cursor: 'pointer' }}>
              Ortho Treatment
            </Typography>
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.treatmentRequiredForOrtho} onChange={handleChange('treatmentRequiredForOrtho')} />}
              label={<Typography sx={{ fontSize: '12px', color: '#334155' }}>Treatment Required for Ortho</Typography>}
              sx={{ mb: 1 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Estimated Treatment Start Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.estimatedTreatmentStartDate} 
                onChange={handleChange('estimatedTreatmentStartDate')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Initial Payment</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.initialPayment} 
                onChange={handleChange('initialPayment')}
                sx={inputSx}
              />
            </Box>
          </Grid>

          {/* MIDDLE COLUMN */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{...labelSx, display: 'inline-block', mr: 2}}>Accident Indicator</Typography>
              <RadioGroup 
                row 
                value={formData.accidentIndicator} 
                onChange={handleChange('accidentIndicator')}
              >
                <FormControlLabel value="Automobile" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Automobile</Typography>} />
                <FormControlLabel value="Non-Automobile" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Non-Automobile</Typography>} />
                <FormControlLabel value="Non Accident" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Non Accident</Typography>} />
              </RadioGroup>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Auto Accident State</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.autoAccidentState} 
                onChange={handleChange('autoAccidentState')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Referral Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.referralDate} 
                onChange={handleChange('referralDate')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Admission Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.admissionDate} 
                onChange={handleChange('admissionDate')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Discharge Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.dischargeDate} 
                onChange={handleChange('dischargeDate')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Billing Entity</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.billingEntity} 
                onChange={handleChange('billingEntity')}
                sx={selectSx}
              >
                <MenuItem value="" sx={menuItemSx}><em>None</em></MenuItem>
                {providerOptions.map(p => (
                  <MenuItem key={p.value} value={p.value} sx={menuItemSx}>{p.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Service Authorization Exception Code</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.serviceAuthExceptionCode} 
                onChange={handleChange('serviceAuthExceptionCode')}
                sx={selectSx}
              >
                <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
                <MenuItem value="Immediate/Urgent Care" sx={menuItemSx}>Immediate/Urgent Care</MenuItem>
                <MenuItem value="Services rendered in retroactive period" sx={menuItemSx}>Services rendered in retroactive period</MenuItem>
                <MenuItem value="Emergency Care" sx={menuItemSx}>Emergency Care</MenuItem>
                <MenuItem value="Client like temporary Medicaid" sx={menuItemSx}>Client like temporary Medicaid</MenuItem>
                <MenuItem value="Request from County for second opinion to recipient can work" sx={menuItemSx}>Request from County for second opinion to recipient can work</MenuItem>
                <MenuItem value="Request for override pending" sx={menuItemSx}>Request for override pending</MenuItem>
                <MenuItem value="Special Handling" sx={menuItemSx}>Special Handling</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography sx={labelSx}>Remittance Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.remittanceDate} 
                onChange={handleChange('remittanceDate')}
                sx={inputSx}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Date Orthodontic Appliance Placed</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.dateOrthoAppliancePlaced} 
                onChange={handleChange('dateOrthoAppliancePlaced')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>SRP Last Date</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.srpLastDate} 
                onChange={handleChange('srpLastDate')}
                sx={inputSx}
              />
            </Box>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{...labelSx, display: 'inline-block', mr: 2}}>Attachment Indicator</Typography>
              <RadioGroup 
                row 
                value={formData.attachmentIndicator} 
                onChange={handleChange('attachmentIndicator')}
              >
                <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Yes</Typography>} />
                <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>No</Typography>} />
              </RadioGroup>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Attachment Type</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.attachmentType} 
                onChange={handleChange('attachmentType')}
                sx={selectSx}
              >
                <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
                <MenuItem value="Referral Form" sx={menuItemSx}>Referral Form</MenuItem>
                <MenuItem value="Dental Models" sx={menuItemSx}>Dental Models</MenuItem>
                <MenuItem value="Diagnostic Report" sx={menuItemSx}>Diagnostic Report</MenuItem>
                <MenuItem value="Explanation of Benefits" sx={menuItemSx}>Explanation of Benefits</MenuItem>
                <MenuItem value="Operative Note" sx={menuItemSx}>Operative Note</MenuItem>
                <MenuItem value="Support Data for Claim" sx={menuItemSx}>Support Data for Claim</MenuItem>
                <MenuItem value="Periodontal Charts" sx={menuItemSx}>Periodontal Charts</MenuItem>
                <MenuItem value="Radiology Films" sx={menuItemSx}>Radiology Films</MenuItem>
                <MenuItem value="Radiology Reports" sx={menuItemSx}>Radiology Reports</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Attachment Transmission Code</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.attachmentTransmissionCode} 
                onChange={handleChange('attachmentTransmissionCode')}
                sx={selectSx}
              >
                <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
                <MenuItem value="Available on Request at Provider Site" sx={menuItemSx}>Available on Request at Provider Site</MenuItem>
                <MenuItem value="By Mail" sx={menuItemSx}>By Mail</MenuItem>
                <MenuItem value="Electronically Only" sx={menuItemSx}>Electronically Only</MenuItem>
                <MenuItem value="E-Mail" sx={menuItemSx}>E-Mail</MenuItem>
                <MenuItem value="By Fax" sx={menuItemSx}>By Fax</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Additional Attachment Information</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.additionalAttachmentInformation} 
                onChange={handleChange('additionalAttachmentInformation')}
                sx={inputSx}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Claim Submission Reason Code</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.claimSubmissionReasonCode} 
                onChange={handleChange('claimSubmissionReasonCode')}
                sx={selectSx}
              >
                <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
                <MenuItem value="Original" sx={menuItemSx}>Original</MenuItem>
                <MenuItem value="Corrected" sx={menuItemSx}>Corrected</MenuItem>
                <MenuItem value="Replacement" sx={menuItemSx}>Replacement</MenuItem>
                <MenuItem value="Void" sx={menuItemSx}>Void</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Treating Provider *</Typography>
              <TextField 
                select
                SelectProps={{ MenuProps: dropdownMenuProps }}
                variant="outlined" 
                size="small"
                fullWidth 
                value={formData.treatingProvider} 
                onChange={handleChange('treatingProvider')}
                sx={selectSx}
              >
                <MenuItem value="" sx={menuItemSx}><em>Select</em></MenuItem>
                {providerOptions.map(p => (
                  <MenuItem key={p.value} value={p.value} sx={menuItemSx}>{p.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography sx={labelSx}>Insurance Payment Amount $</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.insurancePaymentAmount} 
                onChange={handleChange('insurancePaymentAmount')}
                sx={inputSx}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>Treatment Duration (Months)</Typography>
              <TextField 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formData.treatmentDurationMonths} 
                onChange={handleChange('treatmentDurationMonths')}
                sx={inputSx}
              />
            </Box>
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
