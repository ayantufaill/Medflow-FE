import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  ContentCopy as CopyIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as FoundIcon,
  HighlightOff as NotFoundIcon,
} from '@mui/icons-material';

import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';

const Row = ({ label, value, onCopy }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 0.5 }}>
    <Typography
      sx={{ width: 64, minWidth: 64, fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}
    >
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
      <Typography
        sx={{ fontSize: fontSize.md, color: COLORS.TEXT_BODY, wordBreak: 'break-all', fontFamily: onCopy ? 'monospace' : 'inherit' }}
      >
        {value}
      </Typography>
      {onCopy && (
        <Tooltip title={`Copy ${label.toLowerCase()}`}>
          <IconButton size="small" onClick={() => onCopy(value, label)} sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CopyIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  </Box>
);

// `found` is only present after a verification run.
const FoundBadge = ({ found }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.25,
      borderRadius: radius.sm,
      bgcolor: found ? 'rgba(22, 163, 74, 0.12)' : 'rgba(239, 68, 68, 0.12)',
      color: found ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR,
    }}
  >
    {found ? <FoundIcon sx={{ fontSize: 14 }} /> : <NotFoundIcon sx={{ fontSize: 14 }} />}
    <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: 'inherit' }}>
      {found ? 'Found' : 'Not found'}
    </Typography>
  </Box>
);

const DnsRecordCard = ({ record, onCopy }) => (
  <Box
    sx={{
      position: 'relative',
      border: `1px solid ${COLORS.BORDER}`,
      borderRadius: radius.md,
      bgcolor: COLORS.SURFACE_CARD,
      px: 2,
      py: 1.25,
    }}
  >
    {typeof record.found === 'boolean' && (
      <Box sx={{ position: 'absolute', top: 10, right: 12 }}>
        <FoundBadge found={record.found} />
      </Box>
    )}
    <Row label="Type" value={record.type} />
    <Row label="Name" value={record.name} onCopy={onCopy} />
    <Row label="Value" value={record.value} onCopy={onCopy} />
    {record.hint && (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, pt: 0.75 }}>
        <InfoIcon sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY, mt: '1px' }} />
        <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
          {record.hint}
        </Typography>
      </Box>
    )}
  </Box>
);

export default DnsRecordCard;
