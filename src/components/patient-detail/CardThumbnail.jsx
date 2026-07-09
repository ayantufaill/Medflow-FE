import { Box, Typography, IconButton, Chip } from '@mui/material';
import { Close as CloseIcon, CreditCardOutlined as CreditCardIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';

// Real card-network brand colors (not a design choice — these identify the network).
const BRAND_STYLE = {
  visa: { label: 'VISA', color: '#1A1F71' },
  mastercard: { label: 'MASTERCARD', color: '#EB001B' },
  amex: { label: 'AMEX', color: '#2E77BC' },
  discover: { label: 'DISCOVER', color: '#FF6000' },
  unknown: { label: 'CARD', color: COLORS.TEXT_MUTED },
};

/**
 * Replaces the "No cards registered" empty state once a card has been saved —
 * shows the network brand, last 4 digits, and expiry. Never has access to the
 * full card number; only ever renders what tokenizeCard() returned.
 */
export default function CardThumbnail({ card, isDefault, isEditMode, onRemove }) {
  const brandStyle = BRAND_STYLE[card.brand] || BRAND_STYLE.unknown;
  const expiry = card.expMonth && card.expYear
    ? `${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`
    : '--/--';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        px: 1.5,
        py: 1.25,
      }}
    >
      <CreditCardIcon sx={{ fontSize: 22, color: COLORS.TEXT_MUTED, flexShrink: 0 }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.bold, fontSize: fontSize.xs, letterSpacing: '0.5px', color: brandStyle.color }}>
            {brandStyle.label}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>
            •••• {card.last4 || '----'}
          </Typography>
          {isDefault && (
            <Chip
              label="DEFAULT"
              size="small"
              sx={{
                height: 18,
                fontFamily: 'Inter',
                fontSize: '9px',
                fontWeight: fontWeight.semibold,
                letterSpacing: '0.3px',
                backgroundColor: COLORS.ACCENT_BG,
                color: COLORS.ACCENT,
              }}
            />
          )}
        </Box>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
          {card.cardholderName ? `${card.cardholderName} · ` : ''}Expires {expiry}
        </Typography>
      </Box>

      {isEditMode && onRemove && (
        <IconButton size="small" onClick={onRemove} sx={{ color: COLORS.TEXT_MUTED, '&:hover': { color: COLORS.STATUS_ERROR } }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );
}
