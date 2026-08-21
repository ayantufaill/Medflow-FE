import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Switch,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Chip,
  GlobalStyles,
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon, Add as AddIcon } from '@mui/icons-material';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useDispatch } from 'react-redux';
import { createProvider } from '../../store/slices/providerSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { COLORS } from '../../constants/colors';
import adduserIcon from '../../assets/usermanagement icons/adduser1.svg';

import ActiveProviderForm from './AddProviderForms/ActiveProviderForm';
import ReferralProviderForm from './AddProviderForms/ReferralProviderForm';
import LabProviderForm from './AddProviderForms/LabProviderForm';

const FORM_ID = 'add-provider-dialog-form';




// ─── Default values per form type ─────────────────────────────────────────────

const ACTIVE_DEFAULTS = {
  firstName: '', lastName: '', middleName: '', prefix: '', suffix: '',
  preferredName: '', internalCodeName: '', email: '', organizationName: '',
  federalTaxNumber: '', npiNumber: '', additionalProviderId: '', dea: '',
  specialty: '', mobilePhone: '', homePhone: '', licenseNumber: '', taxIdType: '',
  providerType: 'Dentist', signatureOnFile: false, defaultDentist: false, defaultHygienist: false,
  country: 'United States', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '',
  description: '', color: '', openEdgeToken: '', openDentalProviderId: '',
};

const REFERRAL_DEFAULTS = {
  firstName: '', lastName: '', prefix: '', suffix: '',
  officePhone: '', mobilePhone: '', email: '', faxNumber: '', specialty: '',
  country: 'United States', addressLine1: '', addressLine2: '',
  city: '', state: '', zipCode: '', description: '',
};

const LAB_DEFAULTS = {
  labName: '', dueDateInDays: '', inHouseLabProvider: false,
  officePhone: '', mobilePhone: '', email: '', faxNumber: '', specialty: '',
  country: 'United States', addressLine1: '', addressLine2: '',
  city: '', state: '', zipCode: '', description: '',
};

// ─── Dialog ───────────────────────────────────────────────────────────────────

const AddProviderDialog = ({ open, title = 'Add Provider', providerCategory, onClose, onSaved }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isLab = providerCategory === 'lab';
  const isActive = !providerCategory;

  const getDefaults = () => {
    if (isLab) return LAB_DEFAULTS;
    if (isActive) return ACTIVE_DEFAULTS;
    return REFERRAL_DEFAULTS;
  };

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: getDefaults(),
  });

  const handleClose = () => {
    if (saving) return;
    reset();
    setError('');
    onClose();
  };

  const submit = async (data) => {
    try {
      setSaving(true);
      setError('');

      let payload;
      if (isLab) {
        payload = {
          labName: data.labName,
          dueDateInDays: data.dueDateInDays,
          inHouseLabProvider: data.inHouseLabProvider,
          officePhone: data.officePhone,
          phone: data.mobilePhone,
          email: data.email,
          faxNumber: data.faxNumber,
          specialty: data.specialty,
          description: data.description,
          providerCategory,
          address: { country: data.country, street: data.addressLine1, address2: data.addressLine2, city: data.city, state: data.state, zipCode: data.zipCode },
        };
      } else if (isActive) {
        payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          prefix: data.prefix,
          suffix: data.suffix,
          preferredName: data.preferredName,
          internalCodeName: data.internalCodeName,
          email: data.email,
          organizationName: data.organizationName,
          federalTaxNumber: data.federalTaxNumber,
          npiNumber: data.npiNumber,
          additionalProviderId: data.additionalProviderId,
          dea: data.dea,
          specialty: data.specialty,
          phone: data.mobilePhone,
          homePhone: data.homePhone,
          licenseNumber: data.licenseNumber,
          taxIdType: data.taxIdType,
          providerType: data.providerType,
          signatureOnFile: data.signatureOnFile,
          defaultDentist: data.defaultDentist,
          defaultHygienist: data.defaultHygienist,
          description: data.description,
          color: data.color,
          openEdgeToken: data.openEdgeToken,
          openDentalProviderId: data.openDentalProviderId,
          branchIds: data.branchIds,
          address: { country: data.country, street: data.addressLine1, address2: data.addressLine2, city: data.city, state: data.state, zipCode: data.zipCode },
        };
      } else {
        payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          prefix: data.prefix,
          suffix: data.suffix,
          officePhone: data.officePhone,
          phone: data.mobilePhone,
          email: data.email,
          faxNumber: data.faxNumber,
          specialty: data.specialty,
          description: data.description,
          providerCategory,
          address: { country: data.country, street: data.addressLine1, address2: data.addressLine2, city: data.city, state: data.state, zipCode: data.zipCode },
        };
      }

      const created = await dispatch(createProvider(payload)).unwrap();
      showSnackbar('Provider created successfully', 'success');
      handleClose();
      onSaved?.(created);
    } catch (err) {
      // The unwrap() handles the ConditionError object safely
      let msg = 'Failed to create provider. Please try again.';
      if (err?.name === 'ConditionError') return; // Aborted by Redux internally
      
      if (typeof err === 'string') {
        msg = err;
      } else if (err?.message) {
        msg = err.message;
      }

      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <GlobalStyles styles={{ '.MuiPopover-root': { zIndex: '10000 !important' } }} />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden' } }}
        sx={{ zIndex: 10000 }}
      >
        <DialogTitle
          sx={{
            backgroundColor: COLORS.SURFACE_TINT,
            color: '#111',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${COLORS.BORDER}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <img src={adduserIcon} alt="Add Provider" style={{ width: 20, height: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>{title}</Typography>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: '#6B7280' }}>
                Core fields for everyone-role specific fields appear below
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose} sx={{ color: '#6B7280' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5, backgroundColor: COLORS.BACKGROUND }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        <Box component="form" id={FORM_ID} onSubmit={handleSubmit(submit)} noValidate>
          {isLab && <LabProviderForm register={register} control={control} errors={errors} />}
          {isActive && <ActiveProviderForm register={register} control={control} errors={errors} watch={watch} setValue={setValue} />}
          {!isLab && !isActive && <ReferralProviderForm register={register} control={control} errors={errors} />}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        backgroundColor: 'white', 
        borderTop: `1px solid ${COLORS.BORDER}`, 
        gap: 1.5,
        justifyContent: 'flex-end'
      }}>
        <Button 
          onClick={handleClose} 
          disabled={saving} 
          variant="outlined"
          sx={{ 
            borderColor: '#D1D5DB', 
            color: '#374151',
            backgroundColor: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2,
            '&:hover': {
              backgroundColor: '#F3F4F6',
              borderColor: '#D1D5DB'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ 
            backgroundColor: '#2563EB', 
            color: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { 
              backgroundColor: '#1D4ED8',
              boxShadow: 'none'
            }
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default AddProviderDialog;
