import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const BRAND_COLOR = '#7788bb';

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
  titleColor = BRAND_COLOR,
  contentSx,
  paperSx,
}) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
    PaperProps={{
      sx: {
        borderRadius: '4px',
        overflow: 'hidden',
        ...paperSx,
      },
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: titleColor,
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        py: 0.75,
        position: 'relative',
      }}
    >
      {title}
      {showCloseButton && (
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            p: 0.25,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </DialogTitle>

    <DialogContent sx={{ pt: '8px !important', ...contentSx }}>
      {children}
    </DialogContent>

    {actions && (
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {actions}
      </DialogActions>
    )}
  </Dialog>
);

export default BaseDialog;
