import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

/**
 * Shell for all brand-styled dialogs.
 * Handles the MUI Dialog boilerplate: colored title bar, content padding,
 * optional close icon, optional action buttons, and loading-lock on close.
 */
const BaseDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  loading = false,
  showCloseButton = false,
  contentSx,
  paperSx,
  icon: Icon
}) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
    sx={{ zIndex: 130000 }}
    PaperProps={{
      sx: {
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        ...paperSx,
      },
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        color: COLORS.TEXT_PRIMARY,
        fontSize: '15px',
        fontWeight: fontWeight.semiBold,
        py: 2,
        px: 3,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      {Icon && <Icon sx={{ fontSize: '18px', color: COLORS.ACCENT }} />}
      <Typography sx={{ fontSize: '15px', fontWeight: fontWeight.semiBold, flex: 1, textAlign: 'left' }}>
        {title}
      </Typography>
      {showCloseButton && (
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: COLORS.TEXT_SECONDARY,
            p: 0.5,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </DialogTitle>

    <DialogContent sx={{ pt: '24px !important', px: 3, pb: 3, ...contentSx }}>
      {children}
    </DialogContent>

    {actions && (
      <DialogActions sx={{ px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}` }}>
        {actions}
      </DialogActions>
    )}
  </Dialog>
);

export default BaseDialog;
