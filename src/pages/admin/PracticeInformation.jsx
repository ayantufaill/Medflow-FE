import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  InputAdornment,
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
  Add as AddIcon,
} from '@mui/icons-material';
import { practiceInfoService } from '../../services/practice-info.service';

// ─── Constants ─────────────────────────────────────────────────────────────────
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const XRAY_BRIDGES = ['carestream', 'dexis', 'vatech', 'planmeca', 'cadi'];

const DEFAULT_REFERRALS = [
  'Bailey Orthodontics', 'Bioclear website', "Children's Dental Centre of Irv...",
  'DFW Oral Surgeons', 'Dental Care 4 Kids', "Dr. Seysan's Practice",
  'Drove by', 'Endo Excellence', 'Existing Patient',
  'Friend or Family-Sabour', 'Google', 'Insurance Network',
  'Kois contact', 'Meta Ads', 'ROOT Perio', 'Zocdoc',
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

/** Searchable add list — "+ Add" input + search + chips grid */
const AddSearchList = ({ label, items, onAdd, onRemove, showDeleted, onToggleDeleted, deletedLabel }) => {
  const [addVal, setAddVal]       = useState('');
  const [searchVal, setSearchVal] = useState('');

  const filtered = items.filter((i) =>
    !searchVal || i.toLowerCase().includes(searchVal.toLowerCase())
  );

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
          {filtered.map((item) => (
            <Paper
              key={item}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1, py: 0.5,
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" noWrap sx={{ flex: 1 }}>{item}</Typography>
              <IconButton size="small" onClick={() => onRemove(item)} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const PracticeInformation = () => {
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [practiceId, setPracticeId] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoRef = useRef(null);

  // Additional Info lists
  const [services,           setServices]           = useState([]);
  const [paymentMethods,     setPaymentMethods]     = useState([]);
  const [referrals,          setReferrals]          = useState(DEFAULT_REFERRALS);
  const [careTeam,           setCareTeam]           = useState([]);
  const [showDeletedRefs,    setShowDeletedRefs]    = useState(false);
  const [showDeletedCare,    setShowDeletedCare]    = useState(false);

  const [form, setForm] = useState({
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
    surchargeFee: '',
    usingOryxImaging: false,
    xrayBridges: [],
    // address
    country: 'United States',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    // misc
    timezone: 'America/Chicago',
    businessRegNumber: '',
    businessRegIdentifier: '',
    businessLegalName: '',
    // social
    facebookUrl: '',
    googleUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    yelpUrl: '',
    logoFile: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await practiceInfoService.getCurrentPracticeInfo();
        if (data) {
          setPracticeId(data._id || data.id);
          const settings = data.practiceSettings || {};
          
          setForm((prev) => ({
            ...prev,
            practiceName:         data.practiceName         || '',
            phone:                data.phone                || '',
            fax:                  data.fax                  || '',
            email:                data.email                || '',
            website:              data.website              || '',
            timezone:             data.timezone             || 'America/Chicago',
            addressLine1:         data.address?.line1       || '',
            addressLine2:         data.address?.line2       || '',
            city:                 data.address?.city        || '',
            state:                data.address?.state       || '',
            zipCode:              data.address?.postalCode  || '',
            
            // Map settings
            extension:            settings.extension            || '',
            feeGuidesUnit:        settings.feeGuidesUnit        || '',
            scheduleUnit:         settings.scheduleUnit         || '10',
            rxId:                 settings.rxId                 || '',
            mangoId:              settings.mangoId              || '',
            mangoAuthToken:       settings.mangoAuthToken       || '',
            myChartLink:          settings.myChartLink          || '',
            onlineSchedulingLink: settings.onlineSchedulingLink || '',
            restrictIPs:          !!settings.restrictIPs,
            twoFactorNonAuth:     !!settings.twoFactorNonAuth,
            openEdgeToken:        settings.openEdgeToken        || '',
            openEdgeMyChartToken: settings.openEdgeMyChartToken || '',
            surchargeFee:         settings.surchargeFee         || '',
            usingOryxImaging:     !!settings.usingOryxImaging,
            xrayBridges:          settings.xrayBridges          || [],
            country:              data.address?.country         || 'United States',
            businessRegNumber:    settings.businessRegNumber    || '',
            businessRegIdentifier: settings.businessRegIdentifier || '',
            businessLegalName:    settings.businessLegalName    || '',
            facebookUrl:          settings.facebookUrl          || '',
            googleUrl:            settings.googleUrl            || '',
            linkedinUrl:          settings.linkedinUrl          || '',
            twitterUrl:           settings.twitterUrl           || '',
            instagramUrl:         settings.instagramUrl         || '',
            yelpUrl:              settings.yelpUrl              || '',
          }));

          if (data.logoPath) setLogoPreview(data.logoPath);
          
          // Map lists
          if (settings.services)       setServices(settings.services);
          if (settings.paymentMethods) setPaymentMethods(settings.paymentMethods);
          if (settings.referrals)      setReferrals(settings.referrals);
          if (settings.careTeam)       setCareTeam(settings.careTeam);
        }
      } catch (err) {
        console.error('Failed to load practice info:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set      = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setCheck = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.checked }));

  const toggleXray = (bridge) =>
    setForm((p) => ({
      ...p,
      xrayBridges: p.xrayBridges.includes(bridge)
        ? p.xrayBridges.filter((b) => b !== bridge)
        : [...p.xrayBridges, bridge],
    }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Logo must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
    setForm((p) => ({ ...p, logoFile: file }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const payload = {
        practiceName: form.practiceName,
        phone: form.phone,
        fax: form.fax,
        email: form.email,
        website: form.website,
        timezone: form.timezone,
        address: {
          line1: form.addressLine1,
          line2: form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.zipCode,
          country: form.country,
        },
        practiceSettings: {
          extension:            form.extension,
          feeGuidesUnit:        form.feeGuidesUnit,
          scheduleUnit:         form.scheduleUnit,
          rxId:                 form.rxId,
          mangoId:              form.mangoId,
          mangoAuthToken:       form.mangoAuthToken,
          myChartLink:          form.myChartLink,
          onlineSchedulingLink: form.onlineSchedulingLink,
          restrictIPs:          form.restrictIPs,
          twoFactorNonAuth:     form.twoFactorNonAuth,
          openEdgeToken:        form.openEdgeToken,
          openEdgeMyChartToken: form.openEdgeMyChartToken,
          surchargeFee:         form.surchargeFee,
          usingOryxImaging:     form.usingOryxImaging,
          xrayBridges:          form.xrayBridges,
          businessRegNumber:    form.businessRegNumber,
          businessRegIdentifier: form.businessRegIdentifier,
          businessLegalName:    form.businessLegalName,
          facebookUrl:          form.facebookUrl,
          googleUrl:            form.googleUrl,
          linkedinUrl:          form.linkedinUrl,
          twitterUrl:           form.twitterUrl,
          instagramUrl:         form.instagramUrl,
          yelpUrl:              form.yelpUrl,
          // Lists
          services,
          paymentMethods,
          referrals,
          careTeam,
        },
        ...(form.logoFile ? { logo: form.logoFile } : {}),
      };

      let result;
      if (practiceId) {
        result = await practiceInfoService.updatePracticeInfo(practiceId, payload);
      } else {
        result = await practiceInfoService.createPracticeInfo(payload);
      }
      
      if (result) {
        setPracticeId(result._id || result.id);
        if (result.logoPath) setLogoPreview(result.logoPath);
        setForm(prev => ({ ...prev, logoFile: null }));
      }
      
      setSuccess('Saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

  return (
    <Box>
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

      {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
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
              bgcolor: '#fcfcfc',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            {logoPreview && !logoPreview.includes('null') && logoPreview !== ''
              ? <img 
                  src={logoPreview} 
                  alt="logo" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setLogoPreview(null);
                  }}
                />
              : <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                  Click to upload logo
                </Typography>
            }
          </Box>
          <input ref={logoRef} type="file" accept="image/*" hidden onChange={handleLogoChange} />

          <FieldRow label="Practice Name:">
            <TextField variant="standard" fullWidth value={form.practiceName} onChange={set('practiceName')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Phone Number:">
            <TextField variant="standard" fullWidth value={form.phone} onChange={set('phone')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Extension:">
            <TextField variant="standard" fullWidth value={form.extension} onChange={set('extension')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Fax:">
            <TextField variant="standard" fullWidth value={form.fax} onChange={set('fax')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="E-mail Address:">
            <TextField variant="standard" fullWidth value={form.email} onChange={set('email')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Website:">
            <TextField variant="standard" fullWidth value={form.website} onChange={set('website')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Fee Guides unit:">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField variant="standard" value={form.feeGuidesUnit} onChange={set('feeGuidesUnit')} sx={{ width: 120 }} inputProps={{ style: stdSx }} />
              <Typography variant="body2" color="text.secondary">mins</Typography>
            </Box>
          </FieldRow>
          <FieldRow label="Schedule unit:" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={`${form.scheduleUnit} mins`} size="small" sx={{ fontSize: '0.8rem', bgcolor: '#e0e0e0' }} />
              <Tooltip title="Schedule unit is configured separately">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </Tooltip>
            </Box>
          </FieldRow>
          <FieldRow label="Rx ID:">
            <TextField variant="standard" fullWidth value={form.rxId} onChange={set('rxId')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Mango ID:">
            <TextField variant="standard" fullWidth value={form.mangoId} onChange={set('mangoId')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Mango Authentication Token:">
            <TextField variant="standard" fullWidth multiline maxRows={4} value={form.mangoAuthToken} onChange={set('mangoAuthToken')} inputProps={{ style: { ...stdSx, wordBreak: 'break-all' } }} />
          </FieldRow>
          <FieldRow label="MyChart Link:">
            <TextField variant="standard" fullWidth value={form.myChartLink} onChange={set('myChartLink')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Online Scheduling Link:">
            <TextField variant="standard" fullWidth value={form.onlineSchedulingLink} onChange={set('onlineSchedulingLink')} inputProps={{ style: stdSx }} />
          </FieldRow>

          {/* Restrict IPs */}
          <Box sx={{ mb: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200, flexShrink: 0 }}>Restrict IPs:</Typography>
              <FormControlLabel
                control={<Checkbox size="small" checked={form.restrictIPs} onChange={setCheck('restrictIPs')} />}
                label={<Typography variant="body2">yes</Typography>}
                sx={{ m: 0 }}
              />
            </Box>
            {form.restrictIPs && (
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
            <FormControlLabel
              control={<Checkbox size="small" checked={form.twoFactorNonAuth} onChange={setCheck('twoFactorNonAuth')} />}
              label={<Typography variant="body2">yes</Typography>}
              sx={{ m: 0 }}
            />
          </Box>

          <FieldRow label="Open Edge Token:">
            <TextField variant="standard" fullWidth value={form.openEdgeToken} onChange={set('openEdgeToken')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Open Edge MyChart Token:">
            <TextField variant="standard" fullWidth value={form.openEdgeMyChartToken} onChange={set('openEdgeMyChartToken')} inputProps={{ style: stdSx }} />
          </FieldRow>

          {/* Surcharge fee */}
          <FieldRow label="Surcharge fee:" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField variant="standard" value={form.surchargeFee} onChange={set('surchargeFee')} sx={{ width: 80 }} inputProps={{ style: stdSx }} />
              <Typography variant="body2" color="text.secondary">%</Typography>
            </Box>
          </FieldRow>

          {/* Using Oryx Imaging */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.25 }}>
            <Typography variant="body2" color="primary.main" sx={{ minWidth: 200, flexShrink: 0 }}>Using Oryx Imaging:</Typography>
            <FormControlLabel
              control={<Checkbox size="small" checked={form.usingOryxImaging} onChange={setCheck('usingOryxImaging')} />}
              label={<Typography variant="body2">yes</Typography>}
              sx={{ m: 0 }}
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
                      checked={form.xrayBridges.includes(bridge)}
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
            <FormControl variant="standard" fullWidth>
              <Select value={form.country} onChange={set('country')} sx={{ fontSize: '0.85rem' }}>
                <MenuItem value="United States" sx={{ fontSize: '0.85rem' }}>United States</MenuItem>
                <MenuItem value="Canada"        sx={{ fontSize: '0.85rem' }}>Canada</MenuItem>
                <MenuItem value="Mexico"        sx={{ fontSize: '0.85rem' }}>Mexico</MenuItem>
              </Select>
            </FormControl>
          </FieldRow>
          <FieldRow label="Address Line 1:">
            <TextField variant="standard" fullWidth value={form.addressLine1} onChange={set('addressLine1')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Address Line 2:">
            <TextField variant="standard" fullWidth value={form.addressLine2} onChange={set('addressLine2')} placeholder="Address line 2" inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="City:">
            <TextField variant="standard" fullWidth value={form.city} onChange={set('city')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="State:">
            <FormControl variant="standard" fullWidth>
              <Select value={form.state} onChange={set('state')} sx={{ fontSize: '0.85rem' }} displayEmpty>
                <MenuItem value="" sx={{ fontSize: '0.85rem' }}><em>Select state</em></MenuItem>
                {US_STATES.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FieldRow>
          <FieldRow label="Zip/Postal Code:">
            <TextField variant="standard" fullWidth value={form.zipCode} onChange={set('zipCode')} inputProps={{ style: stdSx }} />
          </FieldRow>

          <Box sx={{ mb: 2 }} />

          <FieldRow label="Time zone:">
            <FormControl variant="standard" fullWidth>
              <Select value={form.timezone} onChange={set('timezone')} sx={{ fontSize: '0.85rem' }}>
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
          </FieldRow>
          <FieldRow label="Business Registration Number:">
            <TextField variant="standard" fullWidth value={form.businessRegNumber} onChange={set('businessRegNumber')} inputProps={{ style: stdSx }} />
          </FieldRow>
          <FieldRow label="Business Registration Identifier:">
            <FormControl variant="standard" fullWidth>
              <Select value={form.businessRegIdentifier} onChange={set('businessRegIdentifier')} sx={{ fontSize: '0.85rem' }} displayEmpty>
                <MenuItem value=""    sx={{ fontSize: '0.85rem' }}><em>Select...</em></MenuItem>
                <MenuItem value="EIN" sx={{ fontSize: '0.85rem' }}>EIN</MenuItem>
                <MenuItem value="SSN" sx={{ fontSize: '0.85rem' }}>SSN</MenuItem>
                <MenuItem value="NPI" sx={{ fontSize: '0.85rem' }}>NPI</MenuItem>
              </Select>
            </FormControl>
          </FieldRow>
          <FieldRow label="Business Legal Name:">
            <TextField variant="standard" fullWidth value={form.businessLegalName} onChange={set('businessLegalName')} inputProps={{ style: stdSx }} />
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
                <Tooltip key={field} title={form[field] || label}>
                  <IconButton
                    size="small"
                    sx={{
                      border: '1px solid #ddd', borderRadius: 1, p: 0.5,
                      color: form[field] ? color : 'text.disabled',
                      '&:hover': { color, borderColor: color },
                    }}
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              ))}
              <Tooltip title={form.yelpUrl || 'Yelp'}>
                <IconButton
                  size="small"
                  sx={{
                    border: '1px solid #ddd', borderRadius: 1,
                    px: 0.75, py: 0.5,
                    color: form.yelpUrl ? '#D32323' : 'text.disabled',
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
        onAdd={(v) => setReferrals((p) => [...p, v])}
        onRemove={(v) => setReferrals((p) => p.filter((i) => i !== v))}
        showDeleted={showDeletedRefs}
        onToggleDeleted={(e) => setShowDeletedRefs(e.target.checked)}
        deletedLabel="Show Deleted Referrals"
      />

      <AddSearchList
        label="Care Team:"
        items={careTeam}
        onAdd={(v) => setCareTeam((p) => [...p, v])}
        onRemove={(v) => setCareTeam((p) => p.filter((i) => i !== v))}
        showDeleted={showDeletedCare}
        onToggleDeleted={(e) => setShowDeletedCare(e.target.checked)}
        deletedLabel="Show Deleted Care Team"
      />

      {/* Save */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: 'none', px: 4, bgcolor: '#1a3a6b' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default PracticeInformation;
