import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

export const portalSurfaceSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: '8px',
  border: '1px solid #e0e5eb',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
  backgroundColor: '#ffffff',
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
        variant="h5"
        sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#09121f' }}
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
        sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', color: '#09121f' }}
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

export const PortalStatCard = ({ label, value, accent = '#2262ef', helper }) => (
  <Paper elevation={0} sx={{ ...portalSurfaceSx, borderTop: `3px solid ${accent}` }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4" sx={{ mt: 0.25, fontFamily: 'Inter', fontWeight: 600, color: '#09121f' }}>
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
      border: '1px dashed #d0d7e2',
      backgroundColor: '#fafbfc',
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

