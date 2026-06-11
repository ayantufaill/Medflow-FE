import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  fetchCurrentPracticeInfo,
  updatePracticeInfo,
  createPracticeInfo,
  clearPracticeInfoError,
} from '../../store/slices/practiceInfoSlice';

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Tooltip,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import {
  InfoOutlined as InfoOutlinedIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Google as GoogleIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// ─── Constants ─────────────────────────────────────────────────────────────────
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const XRAY_BRIDGES = ['carestream', 'dexis', 'vatech', 'planmeca', 'cadi'];

const DEFAULT_REFERRALS = [
  { name: 'Bailey Orthodontics', isDeleted: false },
  { name: 'Bioclear website', isDeleted: false },
  { name: "Children's Dental Centre of Irv...", isDeleted: false },
  { name: 'DFW Oral Surgeons', isDeleted: false },
  { name: 'Dental Care 4 Kids', isDeleted: false },
  { name: "Dr. Seysan's Practice", isDeleted: false },
  { name: 'Drove by', isDeleted: false },
  { name: 'Endo Excellence', isDeleted: false },
  { name: 'Existing Patient', isDeleted: false },
  { name: 'Friend or Family-Sabour', isDeleted: false },
  { name: 'Google', isDeleted: false },
  { name: 'Insurance Network', isDeleted: false },
  { name: 'Kois contact', isDeleted: false },
  { name: 'Meta Ads', isDeleted: false },
  { name: 'ROOT Perio', isDeleted: false },
  { name: 'Zocdoc', isDeleted: false },
];

// ─── Reusable atoms ────────────────────────────────────────────────────────────
const stdSx = { fontSize: '0.85rem' };

const FieldRow = ({ label, children, alignItems = 'flex-start' }) => (
  <Box sx={{ display: 'flex', alignItems, gap: 2, mb: 1.25 }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200, pt: 0.5, flexShrink: 0 }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

const AddSearchList = ({ label, items, onAdd, onRemove, showDeleted, onToggleDeleted, deletedLabel, useObjects = false }) => {
  const [addVal, setAddVal]       = useState('');
  const [searchVal, setSearchVal] = useState('');

  const filtered = items.filter((i) => {
    const nameStr = useObjects ? i.name : i;
    const isDel = useObjects ? i.isDeleted : false;

    // Filter by search text
    const matchesSearch = !searchVal || nameStr.toLowerCase().includes(searchVal.toLowerCase());
    
    // Filter by deleted status
    const matchesDeleted = showDeleted ? true : !isDel;

    return matchesSearch && matchesDeleted;
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="primary.main" sx={{ mb: 1, fontWeight: 500 }}>
        {'> '}{label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="+ Add"
          value={addVal}
          onChange={(e) => setAddVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && addVal.trim()) {
              onAdd(addVal.trim());
              setAddVal('');
            }
          }}
          sx={{ width: 280, '& input': { fontSize: '0.82rem' } }}
        />
        <IconButton size="small" sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
          <SearchIcon fontSize="small" />
        </IconButton>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          sx={{ width: 200, '& input': { fontSize: '0.82rem' } }}
        />
        {deletedLabel && (
          <FormControlLabel
            control={<Checkbox size="small" checked={showDeleted} onChange={onToggleDeleted} />}
            label={<Typography variant="caption">{deletedLabel}</Typography>}
            sx={{ m: 0, ml: 1 }}
          />
        )}
      </Box>
      {filtered.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 0.75,
          }}
        >
          {filtered.map((item, idx) => {
            const nameStr = useObjects ? item.name : item;
            const isDel = useObjects ? item.isDeleted : false;
            return (
              <Paper
                key={idx}
                variant="outlined"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1, py: 0.5,
                  borderRadius: 1,
                  opacity: isDel ? 0.5 : 1,
                  textDecoration: isDel ? 'line-through' : 'none',
                }}
              >
                <Typography variant="caption" noWrap sx={{ flex: 1 }}>{nameStr}</Typography>
                {!isDel && (
                  <IconButton size="small" onClick={() => onRemove(item)} sx={{ p: 0.25 }}>
                    <CloseIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  </IconButton>
                )}
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const PracticeInformation = () => {
  const dispatch = useDispatch();
  const { data: practiceData, loading, updateLoading, error: reduxError, updateError } = useSelector((state) => state.practiceInfo);
  
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [localError, setLocalError] = useState('');
  const logoRef = useRef(null);

  // Additional Info lists
  const [services, setServices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [referrals, setReferrals] = useState(DEFAULT_REFERRALS);
  const [careTeam, setCareTeam] = useState([]);
  const [showDeletedRefs, setShowDeletedRefs] = useState(false);
  const [showDeletedCare, setShowDeletedCare] = useState(false);

  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      practiceName: '',
      phone: '',
      extension: '',
      fax: '',
      email: '',
      website: '',
      feeGuidesUnit: '',
      scheduleUnit: '10',
      rxId: '',
      mangoId: '',
      mangoAuthToken: '',
      myChartLink: '',
      onlineSchedulingLink: '',
      restrictIPs: false,
      twoFactorNonAuth: false,
      openEdgeToken: '',
      openEdgeMyChartToken: '',
      googleMeasurementId: '',
      smilePayMerchantId: '',
      surchargeFee: '',
      usingOryxImaging: false,
      xrayBridges: [],
      country: 'United States',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      timezone: 'America/Chicago',
      businessRegNumber: '',
      businessRegIdentifier: '',
      businessLegalName: '',
      facebookUrl: '',
      googleUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      yelpUrl: '',
    }
  });

  const xrayBridgesVal = watch('xrayBridges');

  useEffect(() => {
    if (!practiceData) {
      dispatch(fetchCurrentPracticeInfo());
    }
  }, [dispatch, practiceData]);

  useEffect(() => {
    if (practiceData) {
      reset({
        ...practiceData,
        addressLine1: practiceData.address?.line1 || '',
        addressLine2: practiceData.address?.line2 || '',
        city: practiceData.address?.city || '',
        state: practiceData.address?.state || '',
        zipCode: practiceData.address?.postalCode || '',
        timezone: practiceData.timezone || 'America/Chicago',
        country: practiceData.address?.country || practiceData.country || 'United States',
        scheduleUnit: practiceData.practiceSettings?.scheduleUnit || practiceData.scheduleUnit || '10',
        xrayBridges: practiceData.practiceSettings?.xrayBridges || practiceData.xrayBridges || [],
        businessRegNumber: practiceData.practiceSettings?.businessRegNumber || '',
        businessRegIdentifier: practiceData.practiceSettings?.businessRegIdentifier || '',
        businessLegalName: practiceData.practiceSettings?.businessLegalName || '',
        facebookUrl: practiceData.practiceSettings?.facebookUrl || '',
        googleUrl: practiceData.practiceSettings?.googleUrl || '',
        linkedinUrl: practiceData.practiceSettings?.linkedinUrl || '',
        twitterUrl: practiceData.practiceSettings?.twitterUrl || '',
        instagramUrl: practiceData.practiceSettings?.instagramUrl || '',
        yelpUrl: practiceData.practiceSettings?.yelpUrl || '',
        usingOryxImaging: practiceData.practiceSettings?.usingOryxImaging || false,
        surchargeFee: practiceData.practiceSettings?.surchargeFee || '',
        smilePayMerchantId: practiceData.practiceSettings?.smilePayMerchantId || '',
        googleMeasurementId: practiceData.practiceSettings?.googleMeasurementId || '',
        openEdgeToken: practiceData.practiceSettings?.openEdgeToken || '',
        openEdgeMyChartToken: practiceData.practiceSettings?.openEdgeMyChartToken || '',
        restrictIPs: practiceData.practiceSettings?.restrictIPs || false,
        twoFactorNonAuth: practiceData.practiceSettings?.twoFactorNonAuth || false,
        rxId: practiceData.practiceSettings?.rxId || '',
        mangoId: practiceData.practiceSettings?.mangoId || '',
        mangoAuthToken: practiceData.practiceSettings?.mangoAuthToken || '',
        myChartLink: practiceData.practiceSettings?.myChartLink || '',
        onlineSchedulingLink: practiceData.practiceSettings?.onlineSchedulingLink || '',
        feeGuidesUnit: practiceData.practiceSettings?.feeGuidesUnit || '',
      });
      if (practiceData.logoPath) {
        setLogoPreview(practiceData.logoPath);
      }
      
      if (practiceData.practiceSettings) {
        if (practiceData.practiceSettings.services) setServices(practiceData.practiceSettings.services);
        if (practiceData.practiceSettings.paymentMethods) setPaymentMethods(practiceData.practiceSettings.paymentMethods);
        if (practiceData.practiceSettings.referrals) {
          const refs = practiceData.practiceSettings.referrals;
          setReferrals(refs.map(r => typeof r === 'string' ? { name: r, isDeleted: false } : r));
        }
        if (practiceData.practiceSettings.careTeam) {
          const ct = practiceData.practiceSettings.careTeam;
          setCareTeam(ct.map(c => typeof c === 'string' ? { name: c, isDeleted: false } : c));
        }
      }
    }
  }, [practiceData, reset]);

  const toggleXray = (bridge) => {
    const current = xrayBridgesVal || [];
    if (current.includes(bridge)) {
      setValue('xrayBridges', current.filter((b) => b !== bridge));
    } else {
      setValue('xrayBridges', [...current, bridge]);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      setLocalError('Logo must be under 5 MB.'); 
      return; 
    }
    setLocalError('');
    dispatch(clearPracticeInfoError());
    
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
    setLogoFile(file);
  };

  const onSubmit = async (formData) => {
    setLocalError('');
    dispatch(clearPracticeInfoError());
    
    const payload = {
      ...formData,
      address: {
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zipCode,
        country: formData.country,
      },
      practiceSettings: {
        businessRegNumber: formData.businessRegNumber,
        businessRegIdentifier: formData.businessRegIdentifier,
        businessLegalName: formData.businessLegalName,
        facebookUrl: formData.facebookUrl,
        googleUrl: formData.googleUrl,
        linkedinUrl: formData.linkedinUrl,
        twitterUrl: formData.twitterUrl,
        instagramUrl: formData.instagramUrl,
        yelpUrl: formData.yelpUrl,
        xrayBridges: formData.xrayBridges,
        usingOryxImaging: formData.usingOryxImaging,
        surchargeFee: formData.surchargeFee,
        smilePayMerchantId: formData.smilePayMerchantId,
        googleMeasurementId: formData.googleMeasurementId,
        openEdgeToken: formData.openEdgeToken,
        openEdgeMyChartToken: formData.openEdgeMyChartToken,
        restrictIPs: formData.restrictIPs,
        twoFactorNonAuth: formData.twoFactorNonAuth,
        rxId: formData.rxId,
        mangoId: formData.mangoId,
        mangoAuthToken: formData.mangoAuthToken,
        myChartLink: formData.myChartLink,
        onlineSchedulingLink: formData.onlineSchedulingLink,
        scheduleUnit: formData.scheduleUnit,
        feeGuidesUnit: formData.feeGuidesUnit,
        services,
        paymentMethods,
        referrals,
        careTeam,
      }
    };
    if (logoFile) {
      payload.logo = logoFile;
    }

    try {
      if (practiceData && (practiceData._id || practiceData.id)) {
        await dispatch(updatePracticeInfo({ practiceInfoId: practiceData._id || practiceData.id, updates: payload })).unwrap();
      } else {
        await dispatch(createPracticeInfo(payload)).unwrap();
      }
      setSuccess('Saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // error handled in redux state
    }
  };

  const errorMsg = localError || reduxError || updateError;

  if (loading && !practiceData) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          component={RouterLink}
          to="/admin/practice-setup"
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Practice Setup
        </Typography>
        <Typography variant="caption" color="text.secondary">{'>'}</Typography>
        <Typography variant="caption" color="text.secondary">Practice Information</Typography>
      </Box>

      {errorMsg   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => {setLocalError(''); dispatch(clearPracticeInfoError());}}>{errorMsg}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* ── Two-column layout ── */}
      <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>

        {/* ── LEFT COLUMN ── */}
        <Box sx={{ flex: '0 0 auto', width: 500 }}>
          {/* Logo */}
          <Box
            onClick={() => logoRef.current?.click()}
            sx={{
              width: 180, height: 160,
              border: '1px solid #ccc', borderRadius: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', mb: 3, overflow: 'hidden',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            {logoPreview
              ? <img 
                  src={logoPreview} 
                  alt="logo" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/180x160/png?text=Mock+S3+Logo';
                  }}
                />
              : <Typography variant="caption" color="text.disabled">Click to upload logo</Typography>}
          </Box>
          <input ref={logoRef} type="file" accept="image/*" hidden onChange={handleLogoChange} />

          <FieldRow label="Practice Name:">
            <TextField variant="standard" fullWidth {...register('practiceName')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Phone Number:">
            <TextField variant="standard" fullWidth {...register('phone')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Extension:">
            <TextField variant="standard" fullWidth {...register('extension')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Fax:">
            <TextField variant="standard" fullWidth {...register('fax')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="E-mail Address:">
            <TextField variant="standard" fullWidth {...register('email')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Website:">
            <TextField variant="standard" fullWidth {...register('website')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Fee Guides unit:">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField variant="standard" {...register('feeGuidesUnit')} sx={{ width: 120 }} inputProps={{ style: stdSx }} />
              <Typography variant="body2" color="text.secondary">mins</Typography>
            </Box>
          </FieldRow>
          <FieldRow label="Schedule unit:" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={`${watch('scheduleUnit') || '10'} mins`} size="small" sx={{ fontSize: '0.8rem', bgcolor: '#e0e0e0' }} />
              <Tooltip title="Schedule unit is configured separately">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </Tooltip>
            </Box>
          </FieldRow>
          <FieldRow label="Rx ID:">
            <TextField variant="standard" fullWidth {...register('rxId')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Mango ID:">
            <TextField variant="standard" fullWidth {...register('mangoId')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Mango Authentication Token:">
            <TextField variant="standard" fullWidth multiline maxRows={4} {...register('mangoAuthToken')} inputProps={{ style: { ...stdSx, wordBreak: 'break-all' } }} />
          </FieldRow>
          <FieldRow label="MyChart Link:">
            <TextField variant="standard" fullWidth {...register('myChartLink')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Online Scheduling Link:">
            <TextField variant="standard" fullWidth {...register('onlineSchedulingLink')} inputProps={{ style: stdSx }} />
          </FieldRow>

          {/* Restrict IPs */}
          <Box sx={{ mb: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200, flexShrink: 0 }}>Restrict IPs:</Typography>
              <Controller
                name="restrictIPs"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox size="small" {...field} checked={field.value} />}
                    label={<Typography variant="body2">yes</Typography>}
                    sx={{ m: 0 }}
                  />
                )}
              />
            </Box>
            {watch('restrictIPs') && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', pl: '216px', mt: 0.5, lineHeight: 1.4 }}>
                Use this web site:{' '}
                <Typography component="span" variant="caption" color="primary.main">https://whatismyipaddress.com</Typography>
                {' '}to see the IP address that will be sent to Oryx when you access it from this location.
              </Typography>
            )}
          </Box>

          {/* Two-factor */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.25 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200, flexShrink: 0 }}>
              Allow two-factor login from non-authorized IPs
            </Typography>
            <Controller
              name="twoFactorNonAuth"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" {...field} checked={field.value} />}
                  label={<Typography variant="body2">yes</Typography>}
                  sx={{ m: 0 }}
                />
              )}
            />
          </Box>

          <FieldRow label="Open Edge Token:">
            <TextField variant="standard" fullWidth {...register('openEdgeToken')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Open Edge MyChart Token:">
            <TextField variant="standard" fullWidth {...register('openEdgeMyChartToken')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Google Measurement ID:">
            <TextField variant="standard" fullWidth {...register('googleMeasurementId')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="SmilePay Merchant ID:">
            <TextField variant="standard" fullWidth {...register('smilePayMerchantId')} inputProps={{ style: stdSx }} />
          </FieldRow>

          {/* Surcharge fee */}
          <FieldRow label="Surcharge fee:" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField variant="standard" {...register('surchargeFee')} sx={{ width: 80 }} inputProps={{ style: stdSx }} />
              <Typography variant="body2" color="text.secondary">%</Typography>
            </Box>
          </FieldRow>

          {/* Using Oryx Imaging */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.25 }}>
            <Typography variant="body2" color="primary.main" sx={{ minWidth: 200, flexShrink: 0 }}>Using Oryx Imaging:</Typography>
            <Controller
              name="usingOryxImaging"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" {...field} checked={field.value} />}
                  label={<Typography variant="body2">yes</Typography>}
                  sx={{ m: 0 }}
                />
              )}
            />
          </Box>

          {/* Xray Acquisition Bridges */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.25 }}>
            <Typography variant="body2" color="primary.main" sx={{ minWidth: 200, pt: 0.5, flexShrink: 0 }}>Xray Acquisition Bridges:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              {XRAY_BRIDGES.map((bridge) => (
                <FormControlLabel
                  key={bridge}
                  control={
                    <Checkbox
                      size="small"
                      checked={(xrayBridgesVal || []).includes(bridge)}
                      onChange={() => toggleXray(bridge)}
                    />
                  }
                  label={<Typography variant="body2">{bridge}</Typography>}
                  sx={{ m: 0, mr: 1 }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── RIGHT COLUMN ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FieldRow label="Address:"><span /></FieldRow>
          <FieldRow label="Country:">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }}>
                    <MenuItem value="United States" sx={{ fontSize: '0.85rem' }}>United States</MenuItem>
                    <MenuItem value="Canada"        sx={{ fontSize: '0.85rem' }}>Canada</MenuItem>
                    <MenuItem value="Mexico"        sx={{ fontSize: '0.85rem' }}>Mexico</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
          <FieldRow label="Address Line 1:">
            <TextField variant="standard" fullWidth {...register('addressLine1')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Address Line 2:">
            <TextField variant="standard" fullWidth {...register('addressLine2')} placeholder="Address line 2" inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="City:">
            <TextField variant="standard" fullWidth {...register('city')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="State:">
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }} displayEmpty>
                    <MenuItem value="" sx={{ fontSize: '0.85rem' }}><em>Select state</em></MenuItem>
                    {US_STATES.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
          <FieldRow label="Zip/Postal Code:">
            <TextField variant="standard" fullWidth {...register('zipCode')} inputProps={{ style: stdSx }} />
          </FieldRow>

          <Box sx={{ mb: 2 }} />

          <FieldRow label="Time zone:">
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }}>
                    <MenuItem value="America/New_York"    sx={{ fontSize: '0.85rem' }}>US/Eastern</MenuItem>
                    <MenuItem value="America/Chicago"     sx={{ fontSize: '0.85rem' }}>US/Central</MenuItem>
                    <MenuItem value="America/Denver"      sx={{ fontSize: '0.85rem' }}>US/Mountain</MenuItem>
                    <MenuItem value="America/Los_Angeles" sx={{ fontSize: '0.85rem' }}>US/Pacific</MenuItem>
                    <MenuItem value="America/Phoenix"     sx={{ fontSize: '0.85rem' }}>US/Arizona</MenuItem>
                    <MenuItem value="America/Anchorage"   sx={{ fontSize: '0.85rem' }}>US/Alaska</MenuItem>
                    <MenuItem value="America/Honolulu"    sx={{ fontSize: '0.85rem' }}>US/Hawaii</MenuItem>
                    <MenuItem value="UTC"                 sx={{ fontSize: '0.85rem' }}>UTC</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
          <FieldRow label="Business Registration Number:">
            <TextField variant="standard" fullWidth {...register('businessRegNumber')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Business Registration Identifier:">
            <Controller
              name="businessRegIdentifier"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" fullWidth>
                  <Select {...field} sx={{ fontSize: '0.85rem' }} displayEmpty>
                    <MenuItem value=""    sx={{ fontSize: '0.85rem' }}><em>Select...</em></MenuItem>
                    <MenuItem value="EIN" sx={{ fontSize: '0.85rem' }}>EIN</MenuItem>
                    <MenuItem value="SSN" sx={{ fontSize: '0.85rem' }}>SSN</MenuItem>
                    <MenuItem value="NPI" sx={{ fontSize: '0.85rem' }}>NPI</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </FieldRow>
          <FieldRow label="Business Legal Name:">
            <TextField variant="standard" fullWidth {...register('businessLegalName')} inputProps={{ style: stdSx }} />
          </FieldRow>

          {/* Social Media Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200, flexShrink: 0 }}>
              Social Media Links:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[
                { icon: <FacebookIcon  sx={{ fontSize: 20 }} />, field: 'facebookUrl',  label: 'Facebook',  color: '#1877F2' },
                { icon: <GoogleIcon    sx={{ fontSize: 20 }} />, field: 'googleUrl',    label: 'Google',    color: '#EA4335' },
                { icon: <LinkedInIcon  sx={{ fontSize: 20 }} />, field: 'linkedinUrl',  label: 'LinkedIn',  color: '#0A66C2' },
                { icon: <TwitterIcon   sx={{ fontSize: 20 }} />, field: 'twitterUrl',   label: 'Twitter/X', color: '#1DA1F2' },
                { icon: <InstagramIcon sx={{ fontSize: 20 }} />, field: 'instagramUrl', label: 'Instagram', color: '#E1306C' },
              ].map(({ icon, field, label, color }) => (
                <Tooltip key={field} title={watch(field) || label}>
                  <IconButton
                    size="small"
                    sx={{
                      border: '1px solid #ddd', borderRadius: 1, p: 0.5,
                      color: watch(field) ? color : 'text.disabled',
                      '&:hover': { color, borderColor: color },
                    }}
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              ))}
              <Tooltip title={watch('yelpUrl') || 'Yelp'}>
                <IconButton
                  size="small"
                  sx={{
                    border: '1px solid #ddd', borderRadius: 1,
                    px: 0.75, py: 0.5,
                    color: watch('yelpUrl') ? '#D32323' : 'text.disabled',
                    fontSize: '0.7rem', fontWeight: 700,
                    '&:hover': { color: '#D32323', borderColor: '#D32323' },
                  }}
                >
                  Yelp
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5, pl: '216px' }}>
            These settings were moved to{' '}
            <Typography component="span" variant="caption" color="primary.main" sx={{ cursor: 'pointer' }}>
              Communication Settings
            </Typography>
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Oryx Stripe Billing */}
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Oryx Stripe Billing</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">No payment method found</Typography>
            <Button variant="text" size="small" sx={{ textTransform: 'none', fontSize: '0.82rem' }}>
              View Billing Info
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Additional Information ── */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>Additional Information:</Typography>

      <AddSearchList
        label="Services available at the office:"
        items={services}
        onAdd={(v) => setServices((p) => [...p, v])}
        onRemove={(v) => setServices((p) => p.filter((i) => i !== v))}
      />

      <AddSearchList
        label="Payment Methods:"
        items={paymentMethods}
        onAdd={(v) => setPaymentMethods((p) => [...p, v])}
        onRemove={(v) => setPaymentMethods((p) => p.filter((i) => i !== v))}
      />

      <AddSearchList
        label="Referral Sources:"
        items={referrals}
        useObjects={true}
        onAdd={(val) => {
          const existing = referrals.find(r => r.name === val);
          if (existing) {
            if (existing.isDeleted) {
              setReferrals(referrals.map(r => r.name === val ? { ...r, isDeleted: false } : r));
            }
          } else {
            setReferrals([...referrals, { name: val, isDeleted: false }]);
          }
        }}
        onRemove={(item) => setReferrals(referrals.map(r => r.name === item.name ? { ...r, isDeleted: true } : r))}
        showDeleted={showDeletedRefs}
        onToggleDeleted={(e) => setShowDeletedRefs(e.target.checked)}
        deletedLabel="Show Deleted Referrals"
      />

      <AddSearchList
        label="Care Team:"
        items={careTeam}
        useObjects={true}
        onAdd={(val) => {
          const existing = careTeam.find(c => c.name === val);
          if (existing) {
            if (existing.isDeleted) {
              setCareTeam(careTeam.map(c => c.name === val ? { ...c, isDeleted: false } : c));
            }
          } else {
            setCareTeam([...careTeam, { name: val, isDeleted: false }]);
          }
        }}
        onRemove={(item) => setCareTeam(careTeam.map(c => c.name === item.name ? { ...c, isDeleted: true } : c))}
        showDeleted={showDeletedCare}
        onToggleDeleted={(e) => setShowDeletedCare(e.target.checked)}
        deletedLabel="Show Deleted Care Team"
      />

      {/* Save */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={updateLoading}
          startIcon={updateLoading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: 'none', px: 4, bgcolor: '#1a3a6b' }}
        >
          {updateLoading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default PracticeInformation;
