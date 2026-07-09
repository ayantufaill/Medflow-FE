import { useState, useEffect } from 'react';
import { Dialog, Box, Typography, TextField, Button, IconButton, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { formatCardNumber, expectedCardLength, tokenizeCard } from '../../utils/cardTokenization';

const ERROR_RED = '#ef4444'; // matches the app's existing error-red convention (see AppointmentRightPanel's "occupied" message)

const formatExpiry = (value) => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 4); // Limit to 4 digits (MMYY)
  if (digitsOnly.length <= 2) return digitsOnly;
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`; // Format as MM/YY
};

const errorFieldSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: ERROR_RED },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ERROR_RED },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ERROR_RED },
};

/**
 * Add-card modal (a Dialog, not a page — patient context stays in place behind it).
 * Collects card details, calls the tokenizeCard() stub (see cardTokenization.js
 * for why it's a stub, not a real Stripe/Braintree call), and hands the parent
 * only the tokenized result — the raw card number/CVV never leave this component.
 */
export default function AddCreditCardModal({ open, onClose, onSave, hasExistingCards }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(!hasExistingCards);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset fresh every time the modal opens, using the *current* hasExistingCards —
  // this component instance persists across multiple open/close cycles (only `open`
  // toggles, it never remounts), so a one-time useState initializer for isDefault
  // goes stale after the first card is added (it incorrectly defaulted every
  // subsequent card to "default" too).
  useEffect(() => {
    if (open) {
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardholderName('');
      setIsDefault(!hasExistingCards);
      setSubmitAttempted(false);
      setSaving(false);
    }
  }, [open, hasExistingCards]);

  const digitsOnly = cardNumber.replace(/\D/g, '');
  const [expMonthStr = '', expYearStr = ''] = expiry.split('/');
  const expMonth = parseInt(expMonthStr, 10);
  const expYear = expYearStr.length === 2 ? 2000 + parseInt(expYearStr, 10) : NaN;

  const cardNumberValid = digitsOnly.length === expectedCardLength(digitsOnly);
  const monthValid = expMonth >= 1 && expMonth <= 12;
  const now = new Date();
  const yearValid = !Number.isNaN(expYear)
    && (expYear > now.getFullYear() || (expYear === now.getFullYear() && expMonth >= now.getMonth() + 1));
  const expiryValid = monthValid && yearValid;
  const cvvValid = /^\d{3,4}$/.test(cvv);
  const nameValid = cardholderName.trim().length > 0;

  const handleSave = async () => {
    setSubmitAttempted(true);
    if (!cardNumberValid || !expiryValid || !cvvValid || !nameValid) return;

    setSaving(true);
    try {
      const tokenized = await tokenizeCard({ cardNumber, expMonth, expYear, cvv, cardholderName });
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
      PaperProps={{ sx: { width: '420px', maxWidth: '92vw', borderRadius: radius.lg, p: 0 } }}
    >
      {/* Header — same SURFACE_TINT + close-X treatment as BlockSlotModal.jsx */}
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
          Add Credit Card
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED, p: '4px' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Card Number */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
            Card Number
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            inputProps={{ inputMode: 'numeric', maxLength: 19 }}
            error={submitAttempted && !cardNumberValid}
            helperText={submitAttempted && !cardNumberValid ? 'Enter a valid card number' : ' '}
            FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
              ...(submitAttempted && !cardNumberValid ? errorFieldSx : {}),
            }}
          />
        </Box>

        {/* Expiry + CVV */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
              Expiry (MM/YY)
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              inputProps={{ inputMode: 'numeric', maxLength: 5 }}
              error={submitAttempted && !expiryValid}
              helperText={
                submitAttempted && !expiryValid
                  ? (monthValid ? 'Card has expired' : 'Enter a valid expiry (MM/YY)')
                  : ' '
              }
              FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
                ...(submitAttempted && !expiryValid ? errorFieldSx : {}),
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
              CVV
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputProps={{ inputMode: 'numeric', maxLength: 4 }}
              error={submitAttempted && !cvvValid}
              helperText={submitAttempted && !cvvValid ? '3-4 digits' : ' '}
              FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
                ...(submitAttempted && !cvvValid ? errorFieldSx : {}),
              }}
            />
          </Box>
        </Box>

        {/* Cardholder Name */}
        <Box sx={{ mb: hasExistingCards ? 2 : 0.5 }}>
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
            Cardholder Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Name on card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            error={submitAttempted && !nameValid}
            helperText={submitAttempted && !nameValid ? 'Cardholder name is required' : ' '}
            FormHelperTextProps={{ sx: { color: ERROR_RED, fontSize: fontSize.xs, mx: 0, mt: 0.25 } }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
              ...(submitAttempted && !nameValid ? errorFieldSx : {}),
            }}
          />
        </Box>

        {/* Set as default — only meaningful once more than one card can exist */}
        {hasExistingCards && (
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
