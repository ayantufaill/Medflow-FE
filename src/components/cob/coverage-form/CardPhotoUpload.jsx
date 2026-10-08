import { useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  PhotoCameraOutlined as CameraIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

/**
 * Front and back of the insurance card.
 *
 * Both sides matter: the front carries the member ID and the back carries the
 * payer's claims address and the phone number a biller actually calls. They
 * are separate slots rather than a multi-file picker so a re-shoot of one side
 * cannot silently replace the other — and the endpoint takes one side per
 * request for the same reason.
 *
 * Each side uploads AS SOON AS IT IS PICKED, rather than waiting for the form
 * to be saved. Two reasons: the upload is a separate endpoint from the coverage
 * save, so pretending they are one action would mean a half-failed save with no
 * good recovery; and a front desk photographing a card wants to see it land
 * before handing the card back.
 */
const Slot = ({ side, label, existingUrl, file, uploading, onPick, onRemove }) => {
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
        {uploading ? (
          <Stack alignItems="center" spacing={0.75} sx={{ py: 0.5 }} data-testid={`cob-card-photo-${side}-uploading`}>
            <CircularProgress size={18} />
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
              Uploading…
            </Typography>
          </Stack>
        ) : (
          <>
            {(file || existingUrl) && (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 0.75 }}
              >
                {existingUrl ? (
                  // A stored card opens in a new tab rather than rendering
                  // inline: it is PHI, and a thumbnail on a shared front-desk
                  // screen is a card anyone walking past can read.
                  <Link
                    href={existingUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`cob-card-photo-${side}-link`}
                    sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.ACCENT }}
                  >
                    View photo
                  </Link>
                ) : (
                  <Typography
                    sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_BODY }}
                    data-testid={`cob-card-photo-${side}-name`}
                  >
                    {file?.name}
                  </Typography>
                )}

                {existingUrl && onRemove && (
                  <Tooltip title={`Remove the ${label.toLowerCase()}`}>
                    <IconButton
                      size="small"
                      onClick={() => onRemove(side)}
                      aria-label={`Remove the ${label.toLowerCase()}`}
                      data-testid={`cob-card-photo-${side}-remove`}
                      sx={{ color: COLORS.TEXT_MUTED, p: 0.25 }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
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
          </>
        )}

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

/**
 * `existing` is keyed by the endpoint's own side names (FRONT/BACK), so the
 * caller can pass `cards` straight through from `GET …/cards`.
 */
const CardPhotoUpload = ({ files = {}, existing = {}, uploadingSide, onPick, onRemove, disabled }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
    <Slot
      side="FRONT"
      label="Front of card"
      file={files.FRONT}
      existingUrl={existing.FRONT}
      uploading={uploadingSide === 'FRONT'}
      onPick={disabled ? undefined : onPick}
      onRemove={disabled ? undefined : onRemove}
    />
    <Slot
      side="BACK"
      label="Back of card"
      file={files.BACK}
      existingUrl={existing.BACK}
      uploading={uploadingSide === 'BACK'}
      onPick={disabled ? undefined : onPick}
      onRemove={disabled ? undefined : onRemove}
    />
  </Stack>
);

export default CardPhotoUpload;
