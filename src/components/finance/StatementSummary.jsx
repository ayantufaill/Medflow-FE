import { Box, Typography, Grid } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const StatementSummary = ({ summaryData, insuranceSubtotals, yourPortion, agingData, showOutstandingBalance = true }) => {
  const textDarkBlue = COLORS.TEXT_PRIMARY;
  const headerBlue = COLORS.SURFACE_TINT;
  const rowLightBlue = COLORS.SURFACE_TINT;

  // Filter out Outstanding Balance if showOutstandingBalance is false
  const filteredSummaryData = showOutstandingBalance 
    ? summaryData 
    : summaryData.filter(item => item.label !== 'Outstanding Balance');

  return (
    <>
      {/* Totals Grid */}
      <Box 
        sx={{ 
          mt: 2,
          p: '12px 24px', 
          bgcolor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTop: `1px solid ${COLORS.BORDER}`,
          width: '100%'
        }}
      >
        <Grid 
          container 
          justifyContent="space-between" 
          alignItems="center"
        >
          {filteredSummaryData.map((item) => (
            <Grid 
              item 
              key={item.label}
              sx={{ minWidth: 'auto' }}
            >
              <Typography 
                sx={{ 
                  fontSize: '12px', 
                  fontWeight: fontWeight.semiBold, 
                  color: COLORS.TEXT_SECONDARY,
                  whiteSpace: 'nowrap' 
                }}
              >
                {item.label}
              </Typography>
              <Typography 
                sx={{ 
                  fontWeight: fontWeight.semiBold, 
                  fontSize: '16px', 
                  mt: 0.5, 
                  color: COLORS.TEXT_PRIMARY 
                }}
              >
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Insurance Sub-totals */}
      <Box sx={{ mt:2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pr: 2, mb: 2 }}>
        {insuranceSubtotals.map((item) => (
          <Box key={item.label} sx={{ display: 'flex', width: '300px', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>{item.label}</Typography>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Your Portion Banner */}
      <Box 
        sx={{ 
          bgcolor: COLORS.SURFACE_TINT, 
          p: 1.5, 
          mb: 2,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr', 
          alignItems: 'center',
          borderTop: `1px solid ${COLORS.BORDER}`,
          borderBottom: `1px solid ${COLORS.BORDER}`
        }}
      >
        {/* Left Spacer */}
        <Box />

        {/* Center Text */}
        <Typography 
          sx={{ 
            fontWeight: fontWeight.semiBold, 
            color: COLORS.TEXT_PRIMARY, 
            fontSize: '15px',
            textAlign: 'center'
          }}
        >
          Your Portion
        </Typography>

        {/* Right Amount */}
        <Typography 
          sx={{ 
            fontWeight: fontWeight.semiBold, 
            color: COLORS.TEXT_PRIMARY, 
            fontSize: '15px', 
            textAlign: 'right',
            pr: 2 
          }}
        >
          {yourPortion}
        </Typography>
      </Box>

      {/* Aging Grid */}
      <Grid 
        container 
        sx={{ 
          p: '12px 24px',
          bgcolor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTop: `1px solid ${COLORS.BORDER}`,
          width: '100%' 
        }} 
        justifyContent="space-between"
        alignItems="center"
      >
        {agingData.map((item) => (
          <Grid 
            item 
            key={item.label} 
            sx={{ 
              textAlign: 'left',
              minWidth: 'auto' 
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '12px', 
                color: COLORS.TEXT_SECONDARY, 
                whiteSpace: 'nowrap',
                fontWeight: fontWeight.medium 
              }}
            >
              {item.label}
            </Typography>
            <Typography 
              sx={{ 
                fontWeight: fontWeight.semiBold, 
                fontSize: '15px', 
                mt: 0.5, 
                color: COLORS.TEXT_PRIMARY 
              }}
            >
              {item.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
      
      <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#888', mt: 1, display: 'block', fontSize: fontSize.xs }}>
        * These transactions will not affect the running balance.
      </Typography>
    </>
  );
};

export default StatementSummary;
