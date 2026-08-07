import { Button, Typography } from '@mui/material';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const VoidConfirmationDialog = ({ open, onClose, onConfirm }) => (
  <BaseDialog
    open={open}
    onClose={onClose}
    title="Void Adjustment"
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
          Void
        </Button>
      </>
    }
  >
    <Typography variant="body2" sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '14px', textAlign: 'center', py: 2 }}>
      Are you sure you want to void this adjustment? This action cannot be undone.
    </Typography>
  </BaseDialog>
);

export default VoidConfirmationDialog;
