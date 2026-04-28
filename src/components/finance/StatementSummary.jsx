import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';

const StatementSummary = ({ summaryData, insuranceSubtotals, yourPortion, agingData, showOutstandingBalance = true }) => {
  const textDarkBlue = '#40548e';
  const headerBlue = '#abb8d3';
  const rowLightBlue = '#f0f4fa';

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
          bgcolor: '#f0f4f8',
          borderBottom: '1px solid #ddd',
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
                  fontSize: fontSize.xs, 
                  fontWeight: fontWeight.bold, 
                  color: textDarkBlue,
                  whiteSpace: 'nowrap' 
                }}
              >
                {item.label}
              </Typography>
              <Typography 
                sx={{ 
                  fontWeight: fontWeight.bold, 
                  fontSize: fontSize.lg, 
                  mt: 0.5, 
                  color: '#333' 
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
            <Typography sx={{ fontSize: fontSize.sm, color: textDarkBlue }}>{item.label}</Typography>
            <Typography sx={{ fontSize: fontSize.sm }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Your Portion Banner */}
      <Box 
        sx={{ 
          bgcolor: headerBlue, 
          p: 1.5, 
          mb: 2,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr', 
          alignItems: 'center'
        }}
      >
        {/* Left Spacer */}
        <Box />

        {/* Center Text */}
        <Typography 
          sx={{ 
            fontWeight: fontWeight.bold, 
            color: textDarkBlue, 
            fontSize: fontSize.lg,
            textAlign: 'center'
          }}
        >
          Your Portion
        </Typography>

        {/* Right Amount */}
        <Typography 
          sx={{ 
            fontWeight: fontWeight.bold, 
            color: textDarkBlue, 
            fontSize: fontSize.lg, 
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
          bgcolor: '#f0f4f8',
          borderBottom: '1px solid #ddd',
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
                fontSize: fontSize.xs, 
                color: textDarkBlue, 
                whiteSpace: 'nowrap',
                fontWeight: fontWeight.medium 
              }}
            >
              {item.label}
            </Typography>
            <Typography 
              sx={{ 
                fontWeight: fontWeight.bold, 
                fontSize: fontSize.lg, 
                mt: 0.5, 
                color: '#333' 
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
