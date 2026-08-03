import {
  Box,
  Typography,
  Button,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const MembershipAdjustmentDialog = ({ onClose }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: COLORS.WHITE, 
      borderRadius: radius.md, 
      overflow: 'hidden' 
    }}>
      {/* Header Bar */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '24px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <CardMembershipOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Membership Adjustment
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: '24px', py: '24px', pt: '24px !important' }}>
        {/* Placeholder for middle content if needed later */}
        <Box sx={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.sm, border: `1px dashed ${COLORS.BORDER}` }}>
           <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>
             Patient has no active Membership Plan.
           </Typography>
        </Box>
      </DialogContent>

      {/* Footer with Description and Actions */}
      <DialogActions sx={{ p: '16px 24px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: COLORS.ACCENT, cursor: "pointer", fontWeight: fontWeight.medium, fontSize: '13px', '&:hover': { textDecoration: 'underline' } }}>
          + Add description
        </Typography>
        
        <Stack direction="row" spacing={1.5}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: 'none', 
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              height: '36px',
              px: 3,
              borderRadius: radius.sm,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' } 
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: 'none', 
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              height: '36px',
              px: 3,
              borderRadius: radius.sm,
              boxShadow: 'none',
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' } 
            }}
          >
            Adjust
          </Button>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default MembershipAdjustmentDialog;
