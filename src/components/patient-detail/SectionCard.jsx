import { Box, Paper, Typography, Chip } from '@mui/material';

/**
 * Enhanced reusable SectionCard component for wrapping section content.
 * Supports icons, titles, and badges for consistent styling across the patient detail page.
 * 
 * @param {object} props
 * @param {ReactNode} props.children - Card content
 * @param {string} props.title - Section title (optional)
 * @param {ReactNode} props.icon - Icon component (optional)
 * @param {string} props.badge - Badge text like "VERIFIED" (optional)
 * @param {string} props.badgeColor - Badge color: "success" | "info" | "warning" | "error" (optional)
 * @param {object} props.sx - Additional MUI sx styles
 */
export default function SectionCard({ 
  children, 
  title, 
  icon, 
  badge, 
  badgeColor = 'success',
  headerAction,
  sx = {} 
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: '8px',
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        ...sx,
      }}
    >
      {title && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #f1f5f9',
            bgcolor: '#f8fafc'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && (
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#3b82f6' }}>
                {icon}
              </Box>
            )}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {badge && (
              <Chip 
                label={badge} 
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: 
                    badgeColor === 'success' ? '#dcfce7' :
                    badgeColor === 'info' ? '#dbeafe' :
                    badgeColor === 'warning' ? '#fef3c7' :
                    '#fee2e2',
                  color: 
                    badgeColor === 'success' ? '#16a34a' :
                    badgeColor === 'info' ? '#0284c7' :
                    badgeColor === 'warning' ? '#d97706' :
                    '#dc2626',
                  border: 'none'
                }}
              />
            )}
            {headerAction && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {headerAction}
              </Box>
            )}
          </Box>
        </Box>
      )}
      <Box sx={{ p: title ? 2 : 0 }}>
        {children}
      </Box>
    </Paper>
  );
}
