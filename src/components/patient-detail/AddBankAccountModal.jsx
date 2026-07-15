import { useState, useEffect } from 'react';
import { Dialog, Box, Typography, TextField, MenuItem, Button, IconButton, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { isValidRoutingNumber, tokenizeBankAccount } from '../../utils/bankAccountTokenization';

const ERROR_RED = '#ef4444'; // matches the app's existing error-red convention (see AppointmentRightPanel's "occupied" message)

const errorFieldSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: ERROR_RED },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ERROR_RED },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ERROR_RED },
};

/**
 * Add-account modal (a Dialog, not a page — patient context stays in place behind
 * it). Mirrors AddCreditCardModal.jsx exactly: collects account details, calls the
 * tokenizeBankAccount() stub (see bankAccountTokenization.js for why it's a stub),
 * and hands the parent only the tokenized result — the raw account/routing
 * numbers never leave this component.
 */
export default function AddBankAccountModal({ open, onClose, onSave, hasExistingAccounts }) {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [isDefault, setIsDefault] = useState(!hasExistingAccounts);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset fresh every time the modal opens, using the *current* hasExistingAccounts —
  // this component instance persists across multiple open/close cycles (only `open`
  // toggles, it never remounts), so a one-time useState initializer for isDefault
  // goes stale after the first account is added (see the identical fix/comment in
  // AddCreditCardModal.jsx, which had this exact bug).
  useEffect(() => {
    if (open) {
      setAccountHolderName('');
      setRoutingNumber('');
      setAccountNumber('');
      setAccountType('checking');
      setIsDefault(!hasExistingAccounts);
      setSubmitAttempted(false);
      setSaving(false);
    }
  }, [open, hasExistingAccounts]);

  const nameValid = accountHolderName.trim().length > 0;
  const routingValid = isValidRoutingNumber(routingNumber);
  const accountNumberValid = /^\d{4,17}$/.test(accountNumber.replace(/\D/g, ''));

  const handleSave = async () => {
    setSubmitAttempted(true);
    if (!nameValid || !routingValid || !accountNumberValid) return;

    setSaving(true);
    try {
      const tokenized = await tokenizeBankAccount({ accountHolderName, routingNumber, accountNumber, accountType });
      onSave(tokenized, isDefault);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{ sx: { width: '420px', maxWidth: '92vw', borderRadius: radius.lg, p: 0 } }}
    >
      {/* Header — same SURFACE_TINT + close-X treatment as BlockSlotModal.jsx / AddCreditCardModal.jsx */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.25,
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }}>
        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
          Add Bank Account
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED, p: '4px' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Account Holder Name */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
            Account Holder Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Name on account"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            error={submitAttempted && !nameValid}
            helperText={submitAttempted && !nameValid ? 'Account holder name is required' : ' '}
            FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
              ...(submitAttempted && !nameValid ? errorFieldSx : {}),
            }}
          />
        </Box>

        {/* Routing + Account Type */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
              Routing Number
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="021000021"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
              inputProps={{ inputMode: 'numeric', maxLength: 9 }}
              error={submitAttempted && !routingValid}
              helperText={submitAttempted && !routingValid ? 'Enter a valid 9-digit routing number' : ' '}
              FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
                ...(submitAttempted && !routingValid ? errorFieldSx : {}),
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
              Account Type
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md } }}
            >
              <MenuItem value="checking">Checking</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Account Number */}
        <Box sx={{ mb: hasExistingAccounts ? 2 : 0.5 }}>
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
            Account Number
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="000123456789"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 17))}
            inputProps={{ inputMode: 'numeric', maxLength: 17 }}
            error={submitAttempted && !accountNumberValid}
            helperText={submitAttempted && !accountNumberValid ? 'Enter a valid account number' : ' '}
            FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
              ...(submitAttempted && !accountNumberValid ? errorFieldSx : {}),
            }}
          />
        </Box>

        {/* Set as default — only meaningful once more than one account can exist */}
        {hasExistingAccounts && (
          <FormControlLabel
            control={<Switch size="small" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />}
            label={<Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_BODY }}>Set as default</Typography>}
            sx={{ ml: 0 }}
          />
        )}
      </Box>

      {/* Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER}`,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1,
        backgroundColor: COLORS.SURFACE_FOOTER,
      }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          disabled={saving}
          sx={{
            borderRadius: radius.sm,
            textTransform: 'none',
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            px: 2,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            '&:hover': { borderColor: COLORS.TEXT_MUTED, backgroundColor: 'rgba(0,0,0,0.02)' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          disableElevation
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{
            borderRadius: radius.sm,
            textTransform: 'none',
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            px: 2,
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Dialog>
  );
}
