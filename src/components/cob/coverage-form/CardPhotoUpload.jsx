import { useRef } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { PhotoCameraOutlined as CameraIcon } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

/**
 * Front and back of the insurance card.
 *
 * Both sides matter: the front carries the member ID and the back carries the
 * payer's claims address and the phone number a biller actually calls. They
 * are separate slots rather than a multi-file picker so a re-shoot of one side
 * cannot silently replace the other.
 */
const Slot = ({ side, label, existingUrl, file, onPick }) => {
  const inputRef = useRef(null);

  return (
    <Box sx={{ flex: 1, minWidth: 160 }}>
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: COLORS.TEXT_SECONDARY,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          border: `1px dashed ${COLORS.BORDER}`,
          borderRadius: radius.md,
          backgroundColor: COLORS.SURFACE_HOVER,
          p: 1.25,
          textAlign: 'center',
        }}
      >
        {(file || existingUrl) && (
          <Typography
            sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_BODY, mb: 0.75 }}
            data-testid={`cob-card-photo-${side}-name`}
          >
            {file?.name || 'Photo on file'}
          </Typography>
        )}

        <Button
          size="small"
          variant="outlined"
          startIcon={<CameraIcon sx={{ fontSize: 16 }} />}
          onClick={() => inputRef.current?.click()}
          sx={{
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            textTransform: 'none',
            borderRadius: radius.md,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_BODY,
          }}
        >
          {file || existingUrl ? 'Replace' : 'Add photo'}
        </Button>

        {/* The visually hidden input keeps the native file dialog (and its
            keyboard behaviour) while letting the button carry the styling. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label={label}
          data-testid={`cob-card-photo-${side}`}
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          onChange={(e) => onPick?.(side, e.target.files?.[0] || null)}
        />
      </Box>
    </Box>
  );
};

const CardPhotoUpload = ({ files = {}, existing = {}, onPick }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
    <Slot side="front" label="Front of card" file={files.front} existingUrl={existing.frontUrl} onPick={onPick} />
    <Slot side="back" label="Back of card" file={files.back} existingUrl={existing.backUrl} onPick={onPick} />
  </Stack>
);

export default CardPhotoUpload;
