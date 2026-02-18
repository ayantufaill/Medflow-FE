import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { portalService } from '../../services/portal.service';
import { PortalPageHeader, PortalSectionTitle, portalSurfaceSx } from './PortalUi';

const defaultForm = {
  firstName: '',
  lastName: '',
  email: '',
  phonePrimary: '',
  phoneSecondary: '',
  preferredLanguage: 'en',
  communicationPreference: 'phone',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  },
  insurance: {
    insuranceCompanyId: '',
    policyNumber: '',
    groupNumber: '',
    subscriberName: '',
    relationshipToPatient: 'self',
  },
};

const PortalProfilePage = () => {
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState({ error: '', success: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await portalService.getMyProfile();
        const patient = profile.patient || {};
        const firstInsurance = (profile.insurance || [])[0] || {};
        setForm({
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          email: patient.email || '',
          phonePrimary: patient.phonePrimary || '',
          phoneSecondary: patient.phoneSecondary || '',
          preferredLanguage: patient.preferredLanguage || 'en',
          communicationPreference: patient.communicationPreference || 'phone',
          address: {
            line1: patient.address?.line1 || '',
            line2: patient.address?.line2 || '',
            city: patient.address?.city || '',
            state: patient.address?.state || '',
            postalCode: patient.address?.postalCode || '',
          },
          insurance: {
            insuranceCompanyId: firstInsurance.insuranceCompanyId?._id || '',
            policyNumber: firstInsurance.policyNumber || '',
            groupNumber: firstInsurance.groupNumber || '',
            subscriberName: firstInsurance.subscriberName || '',
            relationshipToPatient: firstInsurance.relationshipToPatient || 'self',
          },
        });
      } catch (err) {
        setStatus({
          error:
            err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load profile',
          success: '',
        });
      }
    })();
  }, []);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateAddress = (key, value) =>
    setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
  const updateInsurance = (key, value) =>
    setForm((prev) => ({ ...prev, insurance: { ...prev.insurance, [key]: value } }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus({ error: '', success: '' });
      await portalService.updateMyProfile(form);
      setStatus({ error: '', success: 'Profile updated successfully' });
    } catch (err) {
      setStatus({
        error:
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to update profile',
        success: '',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <PortalPageHeader
        title="Profile"
        subtitle="Keep your contact details and insurance information up to date."
      />
      {status.error && <Alert severity="error">{status.error}</Alert>}
      {status.success && <Alert severity="success">{status.success}</Alert>}

      <Stack spacing={2}>
        <Stack sx={portalSurfaceSx} spacing={1.5}>
          <PortalSectionTitle title="Contact Information" />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <TextField label="First Name" fullWidth value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Last Name" fullWidth value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" fullWidth value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Primary Phone" fullWidth value={form.phonePrimary} onChange={(e) => update('phonePrimary', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Secondary Phone" fullWidth value={form.phoneSecondary} onChange={(e) => update('phoneSecondary', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select label="Language" fullWidth value={form.preferredLanguage} onChange={(e) => update('preferredLanguage', e.target.value)}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Preferred Contact"
                fullWidth
                value={form.communicationPreference}
                onChange={(e) => update('communicationPreference', e.target.value)}
              >
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="portal">Portal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address Line 1" fullWidth value={form.address.line1} onChange={(e) => updateAddress('line1', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address Line 2" fullWidth value={form.address.line2} onChange={(e) => updateAddress('line2', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="City" fullWidth value={form.address.city} onChange={(e) => updateAddress('city', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="State" fullWidth value={form.address.state} onChange={(e) => updateAddress('state', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Postal Code" fullWidth value={form.address.postalCode} onChange={(e) => updateAddress('postalCode', e.target.value)} />
            </Grid>
          </Grid>
        </Stack>

        <Stack sx={portalSurfaceSx} spacing={1.5}>
          <PortalSectionTitle title="Insurance (Primary)" subtitle="Leave fields blank if not applicable." />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6}>
              <TextField label="Insurance Company ID" fullWidth value={form.insurance.insuranceCompanyId} onChange={(e) => updateInsurance('insuranceCompanyId', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Policy Number" fullWidth value={form.insurance.policyNumber} onChange={(e) => updateInsurance('policyNumber', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Group Number" fullWidth value={form.insurance.groupNumber} onChange={(e) => updateInsurance('groupNumber', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Subscriber Name" fullWidth value={form.insurance.subscriberName} onChange={(e) => updateInsurance('subscriberName', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Relationship"
                fullWidth
                value={form.insurance.relationshipToPatient}
                onChange={(e) => updateInsurance('relationshipToPatient', e.target.value)}
              >
                <MenuItem value="self">Self</MenuItem>
                <MenuItem value="spouse">Spouse</MenuItem>
                <MenuItem value="child">Child</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Stack>
      </Stack>

      <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ alignSelf: 'flex-start' }}>
        {saving ? 'Saving...' : 'Save Profile'}
      </Button>
    </Stack>
  );
};

export default PortalProfilePage;

