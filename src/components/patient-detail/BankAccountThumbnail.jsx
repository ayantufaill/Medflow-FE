import { Box, Typography, IconButton, Chip } from '@mui/material';
import { Close as CloseIcon, AccountBalanceOutlined as BankIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';

/**
 * Replaces the "No account on file" empty state once a bank account has been
 * saved — mirrors CardThumbnail.jsx. Never has access to the full account/
 * routing numbers; only ever renders what tokenizeBankAccount() returned.
 */
export default function BankAccountThumbnail({ account, isDefault, isEditMode, onRemove }) {
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
      <BankIcon sx={{ fontSize: 22, color: COLORS.TEXT_MUTED, flexShrink: 0 }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.bold, fontSize: fontSize.xs, letterSpacing: '0.5px', color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>
            {account.accountType || 'Account'}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>
            •••• {account.last4 || '----'}
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
          {account.accountHolderName || '—'}
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
