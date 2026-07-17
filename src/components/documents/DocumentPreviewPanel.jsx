import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Alert } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';

export default function DocumentPreviewPanel({ document }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn  = () => setZoom((z) => Math.min(3, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
  const handleRotate  = () => setRotation((r) => (r + 90) % 360);
  const handleReset   = () => { setZoom(1); setRotation(0); };

  const isImage = document.mimeType?.startsWith('image/');
  const isPdf   = document.mimeType === 'application/pdf';

  return (
    /* ── Right panel: #f8fafc bg, border, rounded — mirrors TemplatesAndMessageColumn ── */
    <Box
      sx={{
        height: '100%',
        border: `1px solid ${COLORS.BORDER_LIGHT}`,
        borderRadius: '12px',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel header — white, like TemplatesAndMessageColumn header */}
      <Box
        sx={{
          p: '16px',
          borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          bgcolor: COLORS.WHITE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '16px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            Document Preview
          </Typography>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', mt: '4px' }}>
            {isImage ? 'IMAGE FILE' : isPdf ? 'PDF DOCUMENT' : 'FILE PREVIEW'}
          </Typography>
        </Box>

        {/* Zoom / rotate controls (images only) */}
        {isImage && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, mr: '6px' }}>
              {Math.round(zoom * 100)}%
            </Typography>
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={handleZoomIn}
                sx={{ color: COLORS.TEXT_SECONDARY, bgcolor: '#f1f5f9', borderRadius: '6px', '&:hover': { bgcolor: '#e2e8f0' }, width: 28, height: 28 }}>
                <ZoomInIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={handleZoomOut}
                sx={{ color: COLORS.TEXT_SECONDARY, bgcolor: '#f1f5f9', borderRadius: '6px', '&:hover': { bgcolor: '#e2e8f0' }, width: 28, height: 28 }}>
                <ZoomOutIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rotate 90°">
              <IconButton size="small" onClick={handleRotate}
                sx={{ color: COLORS.TEXT_SECONDARY, bgcolor: '#f1f5f9', borderRadius: '6px', '&:hover': { bgcolor: '#e2e8f0' }, width: 28, height: 28 }}>
                <RotateIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset View">
              <IconButton size="small" onClick={handleReset}
                sx={{ color: COLORS.TEXT_SECONDARY, bgcolor: '#f1f5f9', borderRadius: '6px', '&:hover': { bgcolor: '#e2e8f0' }, width: 28, height: 28 }}>
                <ResetIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Preview body */}
      <Box sx={{ flex: 1, p: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {document.storagePath ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 420,
              bgcolor: '#f1f5f9',
              borderRadius: '10px',
              overflow: 'auto',
              p: 2,
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            {isImage ? (
              <Box
                component="img"
                src={document.storagePath}
                alt={document.documentName}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 520,
                  objectFit: 'contain',
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                }}
              />
            ) : isPdf ? (
              <Box
                component="iframe"
                src={document.storagePath}
                sx={{
                  width: '100%',
                  height: 520,
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                  bgcolor: COLORS.WHITE,
                }}
              />
            ) : (
              <Box sx={{ p: 3, width: '100%' }}>
                <Alert severity="info" sx={{ borderRadius: radius.md, fontSize: '13px' }}>
                  Preview not available for this file type. Click <strong>Download</strong> to view the file.
                </Alert>
              </Box>
            )}
          </Box>
        ) : (
          <Alert severity="warning" sx={{ borderRadius: radius.md, fontSize: '13px' }}>
            This document does not have an associated file.
          </Alert>
        )}
      </Box>
    </Box>
  );
}
