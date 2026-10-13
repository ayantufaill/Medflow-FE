import { Button, Typography } from '@mui/material';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

// Copy per void target. The dialog is opened from payments, adjustments,
// deposits and (whole) invoices, so the wording has to match what is actually
// being undone — an adjustment copy on an invoice void misleads the user about
// how much of the ledger the action touches.
const VOID_COPY = {
  invoice: {
    title: 'Void Invoice',
    message:
      'Are you sure you want to void this entire invoice? This action cannot be undone.',
    confirmLabel: 'Void Invoice',
  },
  payment: {
    title: 'Void Payment',
    message:
      'Are you sure you want to void this payment? The amount will be returned to the outstanding balance. This action cannot be undone.',
    confirmLabel: 'Void Payment',
  },
  deposit: {
    title: 'Delete Deposit',
    message:
      'Are you sure you want to delete this deposit? This action cannot be undone.',
    confirmLabel: 'Delete',
  },
  adjustment: {
    title: 'Void Adjustment',
    message:
      'Are you sure you want to void this adjustment? This action cannot be undone.',
    confirmLabel: 'Void',
  },
};

/**
 * Resolve which of the above copy blocks applies. Adjustments are checked
 * first because an adjustment can sit on an invoice's detail list and both
 * flags can be set on the same payload.
 */
const resolveVoidKind = (target) => {
  if (!target) return 'adjustment';
  if (target.isAdjustment) return 'adjustment';
  if (target.isGrouped) return 'invoice';
  if (target.isPayment) return 'payment';
  if (
    target.isPatientDeposit ||
    target.depositType === 'patient' ||
    target.depositType === 'insurance'
  ) {
    return 'deposit';
  }
  return 'adjustment';
};

const VoidConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  voidTarget,
  title,
  message,
  confirmLabel,
}) => {
  const copy = VOID_COPY[resolveVoidKind(voidTarget)];

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title ?? copy.title}
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
            onClick={onConfirm}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#ef4444', // Danger Red
              color: COLORS.WHITE,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#dc2626', boxShadow: 'none' }, // Darker Danger Red
            }}
          >
            {confirmLabel ?? copy.confirmLabel}
          </Button>
        </>
      }
    >
      <Typography variant="body2" sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '14px', textAlign: 'center', py: 2 }}>
        {message ?? copy.message}
      </Typography>
    </BaseDialog>
  );
};

export default VoidConfirmationDialog;
