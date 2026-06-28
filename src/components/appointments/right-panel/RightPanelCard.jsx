import { Box, Typography } from '@mui/material';
import { OpenInFull, Add } from '@mui/icons-material';

const RightPanelCard = ({
  icon,
  title,
  count,
  headerAction = null,   // 'expand' | 'addButton' | 'plus'
  onExpand,
  footerLabel = null,
  onFooterClick,
  children,
}) => (
  <Box
    sx={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e5eb',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* ── Card header ── */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        px: '14px',
        py: '12px',
        backgroundColor: '#f3f8fd',
        borderBottom: '1px solid #e0e5eb',
      }}
    >
      {icon}

      <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#09121f' }}>
        {title}
      </Typography>

      {count !== undefined && (
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 400, color: '#9aa3ae' }}>
          {count}
        </Typography>
      )}

      <Box sx={{ flex: 1 }} />

      {/* Header action — conditional */}
      {headerAction === 'expand' && (
        <OpenInFull onClick={onExpand} sx={{ fontSize: '16px', color: '#9aa3ae', cursor: 'pointer', '&:hover': { color: '#2262ef' } }} />
      )}

      {headerAction === 'addButton' && (
        <Box
          sx={{
            backgroundColor: '#2262ef',
            borderRadius: '6px',
            px: '14px',
            py: '5px',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#1a50cc' },
          }}
        >
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
            Add
          </Typography>
        </Box>
      )}

      {headerAction === 'plus' && (
        <Add sx={{ fontSize: '18px', color: '#9aa3ae', cursor: 'pointer' }} />
      )}
    </Box>

    {/* ── Card content ── */}
    <Box sx={{ flex: 1, px: '14px', py: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {children}
    </Box>

    {/* ── Footer link ── */}
    {footerLabel && (
      <Box
        onClick={onFooterClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: '10px',
          borderTop: '1px solid #f0f2f5',
          cursor: 'pointer',
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, color: '#2262ef' }}>
          {footerLabel}
        </Typography>
      </Box>
    )}
  </Box>
);

export default RightPanelCard;
