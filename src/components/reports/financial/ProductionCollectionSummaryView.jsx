import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductionCollectionSummaryView = ({ globalStats, providerGroups, grouping }) => {
  const renderStatsGrid = (prodStats, collStats, percent, heading = '') => (
    <Box 
      sx={{ 
        mt:-2,
        mb: 4, 
        p: 3, 
        backgroundColor: '#ffffff', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {heading && (
        <Typography 
          variant="subtitle1" 
          sx={{ fontWeight: 700, color: '#111827', mb: 3, borderBottom: '1px solid #f3f4f6', pb: 1 }}
        >
          {heading}
        </Typography>
      )}

      {/* Explicit 50/50 CSS Grid Layout */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 0, 
          width: '100%' 
        }}
      >
        {/* LEFT COLUMN: PRODUCTION */}
        <Box sx={{ pr: 3 }}>
          <Typography 
            variant="caption" 
            sx={{ fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', display: 'block', mb: 2 }}
          >
            PRODUCTION
          </Typography>

          {prodStats.map((stat, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between', 
                mb: 1.5, 
                borderBottom: '1px dashed #f1f5f9', 
                pb: 0.75 
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500, 
                  color: '#2563eb',
                  fontSize: '0.875rem'
                }}
              >
                {stat.label}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, textAlign: 'right' }}>
                {stat.isFormula && stat.formulaText && (
                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8125rem' }}>
                    {stat.formulaText}
                  </Typography>
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: stat.value?.startsWith('-') ? '#ef4444' : '#0f172a',
                    fontSize: '0.875rem'
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* RIGHT COLUMN: COLLECTION (Separated by middle border) */}
        <Box 
          sx={{ 
            borderLeft: '1px solid #e2e8f0', 
            pl: 3 
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', display: 'block', mb: 2 }}
          >
            COLLECTION
          </Typography>

          {collStats.map((stat, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1.5, 
                borderBottom: '1px dashed #f1f5f9', 
                pb: 0.75 
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 500, color: '#2563eb', fontSize: '0.875rem' }}
              >
                {stat.label}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 700, 
                  color: stat.value?.startsWith('-') ? '#ef4444' : '#0f172a',
                  fontSize: '0.875rem'
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box id="production-summary-view" sx={{ mt: 2 }}>
      {grouping === 'group-provider' ? (
        <>
          {Object.entries(providerGroups).map(([provName, stats]) => (
            <Box key={provName}>
              {renderStatsGrid(stats.prodStats, stats.collStats, stats.percent, `Provider: ${provName}`)}
            </Box>
          ))}
          
          <Box sx={{ mt: 4, mb: 2, borderBottom: '2px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Grand Total
            </Typography>
          </Box>
          {renderStatsGrid(globalStats.prodStats, globalStats.collStats, globalStats.percent)}
        </>
      ) : (
        renderStatsGrid(globalStats.prodStats, globalStats.collStats, globalStats.percent)
      )}
    </Box>
  );
};

export default ProductionCollectionSummaryView;