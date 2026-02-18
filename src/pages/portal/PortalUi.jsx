import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

export const portalSurfaceSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 3,
  border: '1px solid #dce6f5',
  boxShadow: '0 12px 24px rgba(15, 59, 102, 0.06)',
  background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
};

export const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'scheduled':
      return 'info';
    case 'confirmed':
      return 'primary';
    case 'checked_in':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'default';
    case 'no_show':
      return 'error';
    default:
      return 'default';
  }
};

export const PortalPageHeader = ({ title, subtitle, action }) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', md: 'center' }}
    spacing={1.5}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Space Grotesk", "Avenir Next", "Segoe UI", sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action || null}
  </Stack>
);

export const PortalSectionTitle = ({ title, subtitle, action }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    justifyContent="space-between"
    spacing={1}
    sx={{ mb: 1.5 }}
  >
    <Box>
      <Typography
        variant="h6"
        sx={{ fontFamily: '"Space Grotesk", "Avenir Next", "Segoe UI", sans-serif', fontWeight: 700 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {action || null}
  </Stack>
);

export const PortalStatCard = ({ label, value, accent = '#1976d2', helper }) => (
  <Paper
    sx={{
      ...portalSurfaceSx,
      background: `linear-gradient(140deg, ${accent}15 0%, #ffffff 60%)`,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4" sx={{ mt: 0.25, fontWeight: 700 }}>
      {value}
    </Typography>
    {helper ? (
      <Typography variant="caption" color="text.secondary">
        {helper}
      </Typography>
    ) : null}
  </Paper>
);

export const PortalStatusChip = ({ status }) => (
  <Chip
    size="small"
    label={(status || 'unknown').replace('_', ' ')}
    color={getStatusColor(status)}
    variant="filled"
    sx={{ textTransform: 'capitalize' }}
  />
);

export const PortalEmptyState = ({ title, description, actionLabel, onAction }) => (
  <Stack
    spacing={1}
    alignItems="flex-start"
    sx={{
      p: 2,
      borderRadius: 2,
      border: '1px dashed #b8c9e8',
      backgroundColor: '#f7fafe',
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    {description ? (
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    ) : null}
    {actionLabel && onAction ? (
      <Button size="small" variant="outlined" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
);

