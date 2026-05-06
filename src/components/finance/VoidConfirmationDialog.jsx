import { Button, Typography } from '@mui/material';
import BaseDialog from '../shared/BaseDialog';

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
          sx={{ textTransform: 'none', color: '#666', borderColor: '#ccc' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: '#7788bb',
            color: '#fff',
            '&:hover': { bgcolor: '#6577aa' },
          }}
        >
          Void
        </Button>
      </>
    }
  >
    <Typography variant="body2" sx={{ color: '#555', fontSize: '14px' }}>
      Are you sure you want to void this adjustment?
    </Typography>
  </BaseDialog>
);

export default VoidConfirmationDialog;
