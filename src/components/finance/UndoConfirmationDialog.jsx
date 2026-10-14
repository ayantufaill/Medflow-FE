import { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const UndoConfirmationDialog = ({ open, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const timeoutId = window.setTimeout(() => setIsSubmitting(false), 0);
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(onConfirm?.());
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Undo Adjustment"
      actions={
        <>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ 
              textTransform: 'none', 
              borderColor: COLORS.BORDER, 
              color: COLORS.TEXT_PRIMARY,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: COLORS.ACCENT, 
              color: COLORS.WHITE,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER || COLORS.ACCENT, boxShadow: 'none' },
            }}
          >
            Undo Adjustments
          </Button>
        </>
      }
    >
      <Typography variant="body2" sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '14px', textAlign: 'center', py: 2 }}>
        Are you sure you want to undo? This will zero out the adjustment.
      </Typography>
    </BaseDialog>
  );
};

export default UndoConfirmationDialog;
