import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import {
  Download as DownloadIcon,
  AttachFile as AttachIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';
import { getDocumentTypeLabel, getDocumentTypeColor } from '../../validations/documentValidations';

export default function DocumentHeader({
  document,
  patientName,
  onAttach,
  onDelete,
  hasNotes,
}) {
  const fileUrl = document.fileUrl || document.storagePath || document.documentUrl;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!fileUrl) return;
    try {
      setDownloading(true);
      // Fetch as blob — this works for cross-origin URLs (S3/CloudFront)
      // where the `download` attribute on <a> is silently ignored by browsers.
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = objectUrl;
      link.download = document.documentName || 'document';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      // Release the object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      // Fallback: open in new tab if blob fetch fails
      window.open(fileUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };
  return (
    <Box
      sx={{
        mt: 1.5,
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        bgcolor: COLORS.SURFACE_CARD,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.lg,
        px: 2.5,
        py: 2,
      }}
    >
      {/* Left — document name + patient name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: COLORS.TEXT_PRIMARY,
                fontSize: '1.05rem',
                fontFamily: 'Inter',
              }}
            >
              {document.documentName}
            </Typography>
            <Chip
              label={getDocumentTypeLabel(document.documentType)}
              color={getDocumentTypeColor(document.documentType)}
              size="small"
              sx={{
                borderRadius: radius.sm,
                fontWeight: fontWeight.semibold,
                fontSize: fontSize.xs,
              }}
            />
            {document.isConfidential && (
              <Chip
                icon={<LockIcon sx={{ fontSize: '12px !important' }} />}
                label="Confidential"
                color="error"
                size="small"
                sx={{
                  borderRadius: radius.sm,
                  fontWeight: fontWeight.semibold,
                  fontSize: fontSize.xs,
                }}
              />
            )}
          </Box>
          {patientName && (
            <Typography
              variant="body2"
              sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mt: 0.25 }}
            >
              {patientName}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right — action buttons */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {fileUrl && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              bgcolor: COLORS.ACCENT,
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.base,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: COLORS.ACCENT_HOVER,
                boxShadow: 'none',
              },
            }}
          >
            {downloading ? 'Downloading...' : 'Download'}
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<AttachIcon />}
          onClick={onAttach}
          disabled={!hasNotes}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_SECONDARY,
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.base,
            '&:hover': {
              borderColor: COLORS.TEXT_MUTED,
              backgroundColor: COLORS.SURFACE_HOVER,
            },
          }}
        >
          Attach to Note
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            borderColor: 'error.main',
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.base,
            '&:hover': {
              backgroundColor: 'error.50',
            },
          }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}
