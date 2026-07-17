import { Box, Typography, Avatar, Chip } from '@mui/material';
import {
  Person as PersonIcon,
  AttachFile as AttachIcon,
  Event as EventIcon,
  Description as DocIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';
import { formatFileSize } from '../../validations/documentValidations';

export default function DocumentMetadataPanel({ document, patientName, uploadedByName }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: '10px', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, '&:last-of-type': { borderBottom: 'none' } }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '6px',
          bgcolor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: '2px',
        }}
      >
        <Icon sx={{ fontSize: 15, color: COLORS.TEXT_SECONDARY }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY, mt: '3px' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    /* ── Left panel: white bg, border, rounded — mirrors PatientSelectionColumn ── */
    <Box
      sx={{
        height: '100%',
        border: `1px solid ${COLORS.BORDER_LIGHT}`,
        borderRadius: '12px',
        bgcolor: COLORS.WHITE,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <Box
        sx={{
          p: '16px',
          borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          bgcolor: COLORS.WHITE,
        }}
      >
        <Typography sx={{ fontSize: '16px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
          Document Information
        </Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', mt: '4px' }}>
          FILE DETAILS &amp; METADATA
        </Typography>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: '16px' }}>
        {/* Patient row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: '12px',
            mb: '12px',
            border: `1px solid ${COLORS.BORDER_LIGHT}`,
            borderRadius: radius.md,
            bgcolor: '#f8fafc',
          }}
        >
          <Avatar
            sx={{
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              fontWeight: fontWeight.bold,
              fontSize: '14px',
              width: 36,
              height: 36,
            }}
          >
            {getInitials(patientName)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>
              Patient Name
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mt: '2px' }}>
              {patientName}
            </Typography>
          </Box>
        </Box>

        {/* Info rows */}
        <InfoRow icon={DocIcon}    label="File Size"    value={formatFileSize(document.fileSizeInBytes)} />
        <InfoRow icon={EventIcon}  label="Uploaded On"  value={formatDateTime(document.createdAt)} />
        <InfoRow icon={PersonIcon} label="Uploaded By"  value={uploadedByName} />
        {document.expirationDate && (
          <InfoRow icon={EventIcon} label="Expiration Date" value={formatDate(document.expirationDate)} />
        )}
        {document.mimeType && (
          <InfoRow icon={AttachIcon} label="File Type" value={document.mimeType} />
        )}

        {/* Optional description */}
        {document.description && (
          <Box sx={{ mt: '16px' }}>
            <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', mb: '6px' }}>
              Description
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: COLORS.TEXT_BODY,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                p: '10px',
                bgcolor: '#f8fafc',
                borderRadius: radius.md,
                border: `1px solid ${COLORS.BORDER_LIGHT}`,
              }}
            >
              {document.description}
            </Typography>
          </Box>
        )}

        {/* Optional tags */}
        {document.tags && document.tags.length > 0 && (
          <Box sx={{ mt: '16px' }}>
            <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', mb: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TagIcon sx={{ fontSize: 13 }} /> Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {document.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: radius.sm,
                    fontSize: fontSize.xs,
                    fontWeight: fontWeight.medium,
                    bgcolor: '#f8fafc',
                    borderColor: COLORS.BORDER_LIGHT,
                    color: COLORS.TEXT_SECONDARY,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
