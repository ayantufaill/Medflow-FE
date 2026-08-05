import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const InsuranceWriteOffDialog = ({ onClose }) => {
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
        <DescriptionOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Insurance Write-Off invoice #24635
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: '24px', py: '24px', pt: '24px !important' }}>
        {/* Main Input Row */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semiBold, fontSize: '13px' }}>
            04/15/2026
          </Typography>
          
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>claim:</Typography>
          
          <Box sx={{ position: 'relative' }}>
            <Select 
              variant="outlined" 
              defaultValue="select a claim" 
              size="small"
              sx={{ 
                height: '36px',
                borderRadius: radius.sm,
                fontSize: '13px', 
                bgcolor: COLORS.SURFACE_TINT,
                '.MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER_HOVER },
              }}
              MenuProps={{ 
                sx: { zIndex: 150000 },
                PaperProps: {
                  sx: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                    borderRadius: radius.sm,
                    mt: 0.5,
                    '& .MuiMenuItem-root': { fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 }
                  }
                }
              }}
            >
              <MenuItem value="select a claim" sx={{ fontSize: '13px' }}>select a claim</MenuItem>
            </Select>
          </Box>

          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>for invoice: #</Typography>
        </Stack>

        {/* Divider */}
        <Divider sx={{ mt: 3, mb: 1, borderColor: COLORS.BORDER_LIGHT }} />
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px', borderTop: `1px solid ${COLORS.BORDER}` }}>
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

export default InsuranceWriteOffDialog;
