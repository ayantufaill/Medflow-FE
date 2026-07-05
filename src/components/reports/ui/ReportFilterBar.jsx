import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

export const ReportFilterBar = ({
  topRowFilters,
  topRowActions,
  bottomRowFilters,
  bottomRowLeftActions,
  onApplyFilters,
  onClearAll,
  onCreateTemplate,
  onPrint,
  onExportCsv,
}) => {
  const hasTopRow = topRowFilters || topRowActions;
  const hasBottomRow = bottomRowFilters || bottomRowLeftActions || onApplyFilters || onClearAll || onCreateTemplate || onPrint || onExportCsv;

  return (
    <Box sx={{ mb: 2, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Top Filter Row */}
      {hasTopRow && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'nowrap', 
          gap: 1.5, 
          p: 2, 
          pb: hasBottomRow ? 1.5 : 2, 
          backgroundColor: '#fff',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 0, display: 'none' } 
        }}>
          {topRowFilters && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'nowrap' }}>
              {topRowFilters}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {topRowActions && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              {topRowActions}
            </Box>
          )}
        </Box>
      )}

      {/* Second Filter Row */}
      {hasBottomRow && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'nowrap', 
          gap: 3, 
          p: 2, 
          pt: hasTopRow ? 1.5 : 2, 
          backgroundColor: '#f8fafc', 
          borderTop: hasTopRow ? '1px solid #e2e8f0' : 'none',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 0, display: 'none' }
        }}>
          {bottomRowFilters && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'nowrap' }}>
              {bottomRowFilters}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap', justifyContent: 'flex-end' }}>
            {bottomRowLeftActions}
            
            {onClearAll && (
              <Typography 
                onClick={onClearAll}
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Clear all
              </Typography>
            )}

            {onApplyFilters && (
              <Button 
                variant="contained" 
                size="small" 
                onClick={onApplyFilters}
                sx={{ 
                  textTransform: 'none', 
                  bgcolor: '#2362EF', 
                  borderRadius: '8px', 
                  px: 2, 
                  fontWeight: 600, 
                  boxShadow: 'none', 
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' }
                }}
              >
                Apply Filters
              </Button>
            )}

            {onCreateTemplate && (
              <Button 
                variant="outlined" 
                size="small" 
                onClick={onCreateTemplate}
                sx={{ 
                  textTransform: 'none', 
                  borderColor: '#e2e8f0', 
                  color: '#1e293b', 
                  borderRadius: '8px', 
                  px: 2, 
                  fontWeight: 600, 
                  bgcolor: '#fff', 
                  whiteSpace: 'nowrap',
                  boxShadow: 'none'
                }}
              >
                Create Template
              </Button>
            )}

            {onPrint && (
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<PrintIcon sx={{ color: '#3b82f6' }} />} 
                onClick={onPrint}
                sx={{ 
                  textTransform: 'none', 
                  borderColor: '#3b82f6', 
                  color: '#3b82f6', 
                  borderRadius: '8px', 
                  px: 2, 
                  fontWeight: 600, 
                  bgcolor: '#fff', 
                  whiteSpace: 'nowrap',
                  boxShadow: 'none'
                }}
              >
                Print
              </Button>
            )}

            {onExportCsv && (
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<FileDownloadIcon />} 
                onClick={onExportCsv}
                sx={{ 
                  textTransform: 'none', 
                  bgcolor: '#3CA2E0', 
                  borderRadius: '8px', 
                  px: 2, 
                  boxShadow: 'none', 
                  fontWeight: 600, 
                  whiteSpace: 'nowrap', 
                  '&:hover': { bgcolor: '#2E8CCC', boxShadow: 'none' } 
                }}
              >
                Export CSV
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReportFilterBar;
