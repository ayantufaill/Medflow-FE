import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import {
  fetchCurrentPracticeInfo,
  updatePracticeInfo,
  createPracticeInfo,
  clearPracticeInfoError,
} from '../../store/slices/practiceInfoSlice';

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useBranch } from '../../hooks/redux';

import PracticeDetails from '../../components/admin/practice-setup/practice-information/PracticeDetails';
import AddressLocale from '../../components/admin/practice-setup/practice-information/AddressLocale';
import IntegrationSecurity from '../../components/admin/practice-setup/practice-information/IntegrationSecurity';
import OnyxStripeBilling from '../../components/admin/practice-setup/practice-information/OnyxStripeBilling';
import AdditionalInformation from '../../components/admin/practice-setup/practice-information/AdditionalInformation';

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

const PracticeInformation = () => {
  const dispatch = useDispatch();
  const { data: practiceData, loading, error: reduxError, updateError } = useSelector((state) => state.practiceInfo);
  const { branches, fetchBranches: loadBranches } = useBranch();

  // '' = the caller's own/default context (GET /practice-info/current with no
  // branchId) — the backend has no separate "practice-wide" record distinct
  // from a branch's own record, confirmed live: every branchId tested returns
  // a fully independent record, none of them a fallback/inherited default.
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [localError, setLocalError] = useState('');

  // Additional Info lists
  const [services, setServices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [referrals, setReferrals] = useState(DEFAULT_REFERRALS);
  const [careTeam, setCareTeam] = useState([]);
  const [showDeletedRefs, setShowDeletedRefs] = useState(false);

  const methods = useForm({
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

  useEffect(() => {
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetches whenever the selected branch changes — the thunk's own
  // condition() skips the request if this exact branch's data is already
  // cached, so switching back to a previously-viewed branch doesn't re-hit
  // the network.
  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo({ branchId: selectedBranchId || null }));
  }, [dispatch, selectedBranchId]);

  useEffect(() => {
    if (practiceData) {
      methods.reset({
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
  }, [practiceData, methods.reset]);

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

  const getInitialCustomState = () => {
    let initialServices = [];
    let initialPaymentMethods = [];
    let initialReferrals = DEFAULT_REFERRALS;
    let initialCareTeam = [];

    if (practiceData?.practiceSettings) {
      if (practiceData.practiceSettings.services) initialServices = practiceData.practiceSettings.services;
      if (practiceData.practiceSettings.paymentMethods) initialPaymentMethods = practiceData.practiceSettings.paymentMethods;
      if (practiceData.practiceSettings.referrals) {
        initialReferrals = practiceData.practiceSettings.referrals.map(r => typeof r === 'string' ? { name: r, isDeleted: false } : r);
      }
      if (practiceData.practiceSettings.careTeam) {
        initialCareTeam = practiceData.practiceSettings.careTeam.map(c => typeof c === 'string' ? { name: c, isDeleted: false } : c);
      }
    }
    return { initialServices, initialPaymentMethods, initialReferrals, initialCareTeam };
  };

  const { initialServices, initialPaymentMethods, initialReferrals, initialCareTeam } = getInitialCustomState();

  const hasChanges =
    methods.formState.isDirty ||
    logoFile !== null ||
    JSON.stringify(services) !== JSON.stringify(initialServices) ||
    JSON.stringify(paymentMethods) !== JSON.stringify(initialPaymentMethods) ||
    JSON.stringify(referrals) !== JSON.stringify(initialReferrals) ||
    JSON.stringify(careTeam) !== JSON.stringify(initialCareTeam);

  const onSubmit = async (formData) => {
    setLocalError('');
    dispatch(clearPracticeInfoError());

    // Helper: omit keys with empty-string / null / undefined values
    const stripEmpty = (obj) => {
      const result = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          result[key] = value;
        }
      });
      return result;
    };

    // Build payload with only backend-recognized top-level fields,
    // stripping empty strings so optional validators are never triggered.
    const payload = stripEmpty({
      practiceName: formData.practiceName,
      phone: formData.phone,
      email: formData.email,
      taxId: formData.taxId,
      npiNumber: formData.npiNumber,
      fax: formData.fax,
      website: formData.website,
      timezone: formData.timezone,
      billingContactEmail: formData.billingContactEmail,
      extension: formData.extension,
    });

    // Structured nested objects — always included
    payload.address = {
      line1: formData.addressLine1,
      line2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.zipCode,
      country: formData.country,
    };

    payload.practiceSettings = {
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
      setLogoFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // error handled in redux state
    }
  };

  const errorMsg = localError || reduxError || updateError;

  if (loading && !practiceData) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          bgcolor: '#FBFCFE',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          p: { xs: 2, sm: 3, md: 4 },
          fontFamily: '"Segoe UI", sans-serif'
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#11223F">
            Practice Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {branches.length > 0 && (
              <Select
                size="small"
                displayEmpty
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                disabled={loading}
                sx={{ minWidth: 180, fontSize: '13px' }}
              >
                <MenuItem value="">My Branch (Default)</MenuItem>
                {branches.map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                ))}
              </Select>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon sx={{ width: 14, height: 14 }} />}
              disabled={!hasChanges}
              sx={{
                width: '93.53px',
                height: '35.33px',
                borderRadius: '8px',
                bgcolor: '#2F6FED',
                textTransform: 'none',
                fontSize: '12px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#2558be',
                  boxShadow: 'none'
                },
                '&.Mui-disabled': {
                  bgcolor: '#E5E7EB',
                  color: '#9CA3AF'
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }} onClose={() => { setLocalError(''); dispatch(clearPracticeInfoError()); }}>{errorMsg}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 2 }}>
          <PracticeDetails logoPreview={logoPreview} onLogoChange={handleLogoChange} />
          <AddressLocale />
          <IntegrationSecurity />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
          <OnyxStripeBilling />
          <AdditionalInformation
            services={services} setServices={setServices}
            paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods}
            referrals={referrals} setReferrals={setReferrals}
            showDeletedRefs={showDeletedRefs} setShowDeletedRefs={setShowDeletedRefs}
            careTeam={careTeam} setCareTeam={setCareTeam}
          />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default PracticeInformation;
