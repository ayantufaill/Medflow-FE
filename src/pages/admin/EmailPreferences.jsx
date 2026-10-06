import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Alert, Snackbar, Divider } from '@mui/material';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';
import { emailPreferencesApi } from '../../components/admin/patient-communication/emailMessagingApi';

const FIELDS = [
  {
    key: 'sentFromEmail',
    label: "'Sent From' Email",
    description: 'Email address you would like emails to send from.',
    placeholder: 'noreply@yourpractice.com',
  },
  {
    key: 'replyToEmail',
    label: "'Reply To' Email",
    description: 'Email address you would like emails to go to if patients reply.',
    placeholder: 'info@yourpractice.com',
  },
];

// The API returns null for an address that hasn't been set yet.
const toDraft = (prefs) => Object.fromEntries(FIELDS.map(({ key }) => [key, prefs?.[key] ?? '']));

// Field-level errors come back as { field: 'sentFromEmail' } (domain rule) or
// { sentFromEmail: ['...'] } (request validation).
const getFieldErrors = (err, message) => {
  const details = err.response?.data?.error?.details;
  if (!details) return null;
  if (details.field) return { [details.field]: message };
  const entries = FIELDS.filter(({ key }) => details[key]).map(({ key }) => [key, [].concat(details[key])[0]]);
  return entries.length ? Object.fromEntries(entries) : null;
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error?.message || err.response?.data?.message || err?.message || fallback;

const EmailPreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const data = await emailPreferencesApi.getEmailPreferences();
      setPreferences(data);
      setDraft(toDraft(data));
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Failed to load email preferences.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const isDirty = Boolean(preferences && draft) && FIELDS.some(({ key }) => draft[key].trim() !== (preferences[key] ?? ''));

  const handleCancel = () => {
    setDraft(toDraft(preferences));
    setFieldErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const saved = await emailPreferencesApi.updateEmailPreferences(draft);
      setPreferences(saved);
      setDraft(toDraft(saved));
      setFieldErrors({});
      setIsEditing(false);
      setToast({ open: true, message: 'Email preferences saved successfully!', severity: 'success' });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to save email preferences.');
      const errors = getFieldErrors(err, message);
      if (errors) {
        setFieldErrors(errors);
      } else {
        setToast({ open: true, message, severity: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const renderField = ({ key, label, description, placeholder }) => (
    <Box key={key}>
      <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: '0.9rem', color: '#1E293B' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5, mb: 1.5 }}>{description}</Typography>
      {isEditing ? (
        <TextField
          size="small"
          fullWidth
          value={draft[key]}
          placeholder={placeholder}
          disabled={saving}
          onChange={(e) => {
            setDraft((prev) => ({ ...prev, [key]: e.target.value }));
            if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: '' }));
          }}
          error={Boolean(fieldErrors[key])}
          helperText={fieldErrors[key] || ' '}
          sx={{
            maxWidth: 420,
            '& .MuiInputBase-input': { fontFamily: 'Inter', fontSize: '13px' },
            '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
          }}
        />
      ) : (
        <Typography sx={{ fontSize: '0.9rem', color: preferences[key] ? COLORS.TEXT_BODY : COLORS.TEXT_MUTED }}>
          {preferences[key] || 'Not set'}
        </Typography>
      )}
    </Box>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (loadError) {
      return (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchPreferences}>Retry</Button>}>
          {loadError}
        </Alert>
      );
    }
    return (
      <Box sx={{ bgcolor: COLORS.WHITE, border: '1px solid #E5E9F2', borderRadius: radius.lg, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>Email Addresses</Typography>
          {actions}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isEditing ? 1.5 : 3 }}>
          {FIELDS.map((field, index) => (
            <Box key={field.key}>
              {index > 0 && !isEditing && <Divider sx={{ borderColor: '#F1F5F9', mb: 3 }} />}
              {renderField(field)}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const actions = (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {isEditing && (
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={saving}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_MUTED,
            borderColor: COLORS.BORDER,
            '&:hover': {
              borderColor: COLORS.TEXT_MUTED,
              backgroundColor: COLORS.SURFACE_HOVER,
            },
          }}
        >
          Cancel
        </Button>
      )}
      <Button
        variant="contained"
        disableElevation
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        disabled={saving || (isEditing && !isDirty)}
        sx={{
          textTransform: 'none',
          borderRadius: radius.md,
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          px: 3,
          backgroundColor: COLORS.ACCENT,
          color: COLORS.WHITE,
          '&:hover': {
            backgroundColor: COLORS.ACCENT_HOVER,
          },
          '&.Mui-disabled': {
            backgroundColor: COLORS.BORDER,
            color: COLORS.TEXT_MUTED,
          },
        }}
      >
        {isEditing ? (saving ? 'Saving...' : 'Save Settings') : 'Edit Preferences'}
      </Button>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ maxWidth: 760 }}>{renderBody()}</Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailPreferences;
