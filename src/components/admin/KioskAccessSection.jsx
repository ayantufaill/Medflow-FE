import {
  Box,
  Typography,
  TextField,
  Link,
  Button,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Link as LinkIcon,
  LockOutlined,
  SwapHoriz,
} from '@mui/icons-material';

const SECTION_HEADER_BG = '#eef4ff';

const SectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, backgroundColor: SECTION_HEADER_BG }}>
    {icon}
    <Typography fontWeight={700} fontSize="0.85rem">
      {title}
    </Typography>
  </Box>
);

const KioskAccessSection = ({
  kioskLink,
  password,
  confirmPassword,
  showPassword,
  showConfirm,
  onPasswordChange,
  onConfirmChange,
  onToggleShowPassword,
  onToggleShowConfirm,
  onSavePassword,
  canSavePassword,
  showMoveData,
  onToggleMoveData,
}) => {
  const confirmMismatch = !!confirmPassword && confirmPassword !== password;

  return (
    <Box>
      {/* Kiosk Link */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}
      >
        <SectionHeader icon={<LinkIcon sx={{ color: '#1d4ed8', fontSize: '1rem' }} />} title="Kiosk Link" />
        <Box sx={{ px: 2, py: 2, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Link href={kioskLink} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ fontWeight: 600 }}>
            {kioskLink}
          </Link>
          <Typography variant="caption" color="text.secondary">
            (This link is for internal office use only at the kiosk station.)
          </Typography>
        </Box>
      </Paper>

      {/* Kiosk Password */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1.5, overflow: 'hidden' }}
      >
        <SectionHeader icon={<LockOutlined sx={{ color: '#1d4ed8', fontSize: '1rem' }} />} title="Kiosk Password" />
        <Box sx={{ px: 2, py: 2, backgroundColor: '#fff' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Password *
              </Typography>
              <TextField
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                size="small"
                value={password}
                onChange={onPasswordChange}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={onToggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Confirm Password *
              </Typography>
              <TextField
                placeholder="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                size="small"
                value={confirmPassword}
                onChange={onConfirmChange}
                error={confirmMismatch}
                helperText={confirmMismatch ? 'Passwords do not match' : ''}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={onToggleShowConfirm} edge="end">
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              onClick={onSavePassword}
              disabled={!canSavePassword}
              sx={{ textTransform: 'none', backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' } }}
            >
              Set Password
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Move Data toggle — standalone button under the password panel */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant={showMoveData ? 'contained' : 'outlined'}
          size="small"
          startIcon={<SwapHoriz fontSize="small" />}
          onClick={onToggleMoveData}
          sx={{
            textTransform: 'none',
            ...(showMoveData
              ? { backgroundColor: '#1a3a6b', '&:hover': { backgroundColor: '#142d52' } }
              : { borderColor: 'divider', color: 'text.primary' }),
          }}
        >
          Move Data
        </Button>
      </Box>
    </Box>
  );
};

export default KioskAccessSection;