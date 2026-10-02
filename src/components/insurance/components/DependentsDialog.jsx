import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, People as PeopleIcon } from '@mui/icons-material';
import FormInput from './FormInput';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

// Mirrors the BE's relationshipToPatient enum (insurance.validator.ts) — the
// dropdown shows title case, the submitted value is the lowercase code.
const RELATIONSHIP_OPTIONS = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'other', label: 'Dependent' },
];

// Same list/order used by ImportedCoverageModal and RenewalSection so a
// renewalMonth picked here reads the same everywhere else in Insurance.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Confirms the three things a shared family policy needs before it can be
 * attached to a new dependent: how that dependent relates to the subscriber,
 * which month the policy renews, and who the subscriber actually is (editable
 * in case the policy template guessed wrong). Opened from the "Activate
 * Insurance Policy On This Patient" cell in FamilyCoverageMatrix.
 */
export default function DependentsDialog({
  open,
  onClose,
  member,
  policy,
  familyMembers = [],
  onConfirm,
  submitting = false,
}) {
  // Seeded once from the policy's own subscriber/renewal month at mount time.
  // The parent remounts this component (via a `key` on member+policy) each
  // time a different cell opens the dialog, so these lazy initializers are
  // all the "reset on reopen" behavior needs — no effect required.
  const [relationship, setRelationship] = useState(() => {
    const subscriber = (policy?.template?.subscriberName || '').trim();
    const isMemberTheSubscriber = subscriber && member?.name && subscriber.toLowerCase() === member.name.trim().toLowerCase();
    return isMemberTheSubscriber ? 'self' : 'child';
  });
  const [renewalMonth, setRenewalMonth] = useState(() => {
    const monthIndex = Number(policy?.template?.renewalMonth);
    return monthIndex >= 1 && monthIndex <= 12 ? MONTHS[monthIndex - 1] : 'January';
  });
  const [subscriberName, setSubscriberName] = useState(
    () => (policy?.template?.subscriberName || '').trim() || familyMembers.find((m) => m.isSelf)?.name || ''
  );

  const subscriberMatch = familyMembers.find(
    (m) => m.name.trim().toLowerCase() === subscriberName.trim().toLowerCase()
  );

  const canSubmit = Boolean(relationship) && Boolean(renewalMonth) && Boolean(subscriberName.trim()) && !submitting;

  const handleActivate = () => {
    if (!canSubmit) return;
    onConfirm({
      relationshipToPatient: relationship,
      renewalMonth: MONTHS.indexOf(renewalMonth) + 1,
      subscriberName: subscriberName.trim(),
      subscriberDateOfBirth: subscriberMatch?.dateOfBirth,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: radius.lg, overflow: 'hidden' } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          bgcolor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: COLORS.WHITE, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <PeopleIcon sx={{ color: COLORS.ACCENT, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.bold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>
              Dependents
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
              Activate {policy?.label || 'this policy'} for {member?.name || 'this patient'}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} disabled={submitting} sx={{ color: COLORS.TEXT_MUTED, '&:hover': { color: COLORS.TEXT_PRIMARY } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3, bgcolor: COLORS.WHITE }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          <Box sx={{ flex: 1 }}>
            <FormInput
              select
              label="Patient Relationship to Subscriber"
              required
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '14px' }}>{opt.label}</MenuItem>
              ))}
            </FormInput>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormInput
              select
              label="Month"
              required
              value={renewalMonth}
              onChange={(e) => setRenewalMonth(e.target.value)}
            >
              {MONTHS.map((m) => (
                <MenuItem key={m} value={m} sx={{ fontSize: '14px' }}>{m}</MenuItem>
              ))}
            </FormInput>
          </Box>
        </Box>

        <FormInput
          label="Subscriber Name"
          required
          renderInput={() => (
            <Autocomplete
              freeSolo
              options={familyMembers}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name || '')}
              value={subscriberMatch || subscriberName}
              onInputChange={(e, newValue) => setSubscriberName(newValue)}
              onChange={(e, newValue) => setSubscriberName(typeof newValue === 'string' ? newValue : newValue?.name || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {subscriberMatch && <CheckCircleIcon sx={{ color: COLORS.STATUS_SUCCESS, fontSize: 20 }} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{ bgcolor: '#f8f9fc', '& .MuiInputBase-root': { fontSize: '14px', minHeight: '36px' }, '& fieldset': { borderColor: '#DFE5EC' } }}
                />
              )}
            />
          )}
        />
      </DialogContent>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, pb: 3, pt: 0.5 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={submitting}
          sx={{
            fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.bold, textTransform: 'none',
            borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, bgcolor: COLORS.WHITE,
            '&:hover': { bgcolor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
            borderRadius: radius.md, boxShadow: 'none', px: 3, py: 0.75,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleActivate}
          disabled={!canSubmit}
          startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{
            fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.bold, textTransform: 'none',
            bgcolor: COLORS.STATUS_SUCCESS, '&:hover': { bgcolor: COLORS.STATUS_SUCCESS, opacity: 0.9 },
            borderRadius: radius.md, boxShadow: 'none', px: 3, py: 0.75,
          }}
        >
          Activate
        </Button>
      </Box>
    </Dialog>
  );
}
