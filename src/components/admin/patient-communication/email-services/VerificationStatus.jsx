import { Box, Typography, Chip, Button, CircularProgress } from '@mui/material';
import {
  CheckCircleOutline as VerifiedIcon,
  HourglassEmpty as PendingIcon,
  ErrorOutline as FailedIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import { DOMAIN_STATUS } from './constants';

const STATUS_CONFIG = {
  [DOMAIN_STATUS.VERIFIED]: {
    label: 'Verified',
    description: 'Your domain is verified and you can send emails and campaigns from MedFlow.',
    icon: <VerifiedIcon />,
    color: COLORS.STATUS_SUCCESS,
    bg: 'rgba(22, 163, 74, 0.12)',
  },
  [DOMAIN_STATUS.PENDING]: {
    label: 'Pending',
    description:
      'We are waiting for your DNS records to be detected. This can take up to 72 hours after you add them.',
    icon: <PendingIcon />,
    color: COLORS.STATUS_UNCONFIRMED,
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  [DOMAIN_STATUS.FAILED]: {
    label: 'Verification failed',
    description:
      'We could not find the DNS records for your domain. Check that every record below was added exactly as shown, then check again.',
    icon: <FailedIcon />,
    color: COLORS.STATUS_ERROR,
    bg: 'rgba(239, 68, 68, 0.12)',
  },
};

const formatCheckedAt = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const VerificationStatus = ({ domain, status, lastCheckedAt, onCheckStatus, checking }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[DOMAIN_STATUS.PENDING];
  const checkedAt = formatCheckedAt(lastCheckedAt);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>
        Verification
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 2 }}>
        {config.description}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Chip
          icon={config.icon}
          label={config.label}
          sx={{
            height: 34,
            px: 0.5,
            borderRadius: radius.sm,
            bgcolor: config.bg,
            color: config.color,
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            '& .MuiChip-icon': { color: config.color, fontSize: 18 },
          }}
        />
        {domain && (
          <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_BODY, fontWeight: fontWeight.medium }}>
            {domain}
          </Typography>
        )}
        {status !== DOMAIN_STATUS.VERIFIED && (
          <Button
            size="small"
            variant="outlined"
            onClick={onCheckStatus}
            disabled={checking}
            startIcon={checking ? <CircularProgress size={14} /> : <RefreshIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
            }}
          >
            {checking ? 'Checking...' : 'Check status'}
          </Button>
        )}
      </Box>

      {checkedAt && (
        <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 1.5 }}>
          Last checked {checkedAt}
        </Typography>
      )}
    </Box>
  );
};

export default VerificationStatus;
