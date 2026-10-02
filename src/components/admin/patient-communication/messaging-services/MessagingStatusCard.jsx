import { Box, Typography, Link, Chip } from '@mui/material';
import {
  SmsOutlined as SmsIcon,
  ThumbUpAltOutlined as ThumbUpIcon,
  SentimentSatisfiedAltOutlined as SmileIcon,
} from '@mui/icons-material';

import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import { formatPhoneNumber } from '../../../shared/PhoneNumberInput';
import { MESSAGING_STATUS } from './mockMessagingService';

const STATUS_CONFIG = {
  [MESSAGING_STATUS.ACTIVE]: {
    label: 'Active',
    description:
      'Your messaging service is active. Patients will be able to message you directly through MedFlow using the number below.',
    color: COLORS.STATUS_SUCCESS,
    bg: 'rgba(22, 163, 74, 0.12)',
  },
  [MESSAGING_STATUS.PENDING]: {
    label: 'Pending',
    description:
      'Your number is being registered with the carriers. Patients will be able to message you once registration completes.',
    color: COLORS.STATUS_UNCONFIRMED,
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  [MESSAGING_STATUS.INACTIVE]: {
    label: 'Inactive',
    description: 'Your messaging service is not active. Patients cannot message your practice through MedFlow.',
    color: COLORS.STATUS_ERROR,
    bg: 'rgba(239, 68, 68, 0.12)',
  },
};

const MessagingStatusCard = ({ status, phoneNumber, onEdit }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[MESSAGING_STATUS.INACTIVE];

  return (
    <Box sx={{ bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.lg, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Illustration */}
        <Box
          sx={{
            position: 'relative',
            width: 110,
            minWidth: 110,
            height: 96,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 22,
              top: 6,
              width: 64,
              height: 84,
              borderRadius: '12px',
              bgcolor: COLORS.WHITE,
              border: `2px solid ${COLORS.ACCENT}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SmsIcon sx={{ fontSize: 34, color: COLORS.ACCENT }} />
          </Box>
          <SmileIcon
            sx={{ position: 'absolute', left: -6, bottom: 0, fontSize: 30, color: COLORS.ACCENT, opacity: 0.85 }}
          />
          <ThumbUpIcon
            sx={{ position: 'absolute', right: 0, top: 4, fontSize: 26, color: COLORS.ACCENT, opacity: 0.6 }}
          />
        </Box>

        {/* Status + number */}
        <Box>
          <Chip
            label={config.label}
            size="small"
            sx={{
              mb: 1,
              borderRadius: radius.pill,
              bgcolor: config.bg,
              color: config.color,
              fontSize: fontSize.base,
              fontWeight: fontWeight.medium,
            }}
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, mb: 1 }}>
            {config.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: fontWeight.semibold, color: '#1E293B' }}>
              {phoneNumber ? formatPhoneNumber(phoneNumber) : 'No number assigned'}
            </Typography>
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={onEdit}
              sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.ACCENT }}
            >
              Edit
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagingStatusCard;
