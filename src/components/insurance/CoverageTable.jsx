import React from 'react';
import { Box, Typography } from "@mui/material";
import { InfoOutlined as InfoIcon, GppGood as GppGoodIcon } from "@mui/icons-material";
import AnnualMaximumsTable from './coverage-table/AnnualMaximumsTable';
import FinalCoverageSection from './coverage-table/FinalCoverageSection';

const CoverageTable = ({ 
  formData, 
  handleCoverageChange, 
  handleInputChange,
  headerStyle,
  coverageCategoryData,
  setCoverageCategoryData
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Card 1: Coverage */}
      <Box sx={{ 
        border: '1px solid #DFE5EC', 
        borderRadius: '12px', 
        backgroundColor: '#FFFFFF', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', px: 3, py: 2, borderBottom: '1px solid #DFE5EC' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
              <GppGoodIcon sx={{ fontSize: 20, color: '#2563eb' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
                Coverage
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Annual maximums and usage to date
              </Typography>
            </Box>
          </Box>
          <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
          </Box>
        </Box>
        <AnnualMaximumsTable 
          formData={formData} 
          handleCoverageChange={handleCoverageChange} 
          handleInputChange={handleInputChange} 
          headerStyle={headerStyle} 
        />
      </Box>

      {/* Card 2: Coverage Table */}
      <Box sx={{ 
        border: '1px solid #DFE5EC', 
        borderRadius: '12px', 
        backgroundColor: '#FFFFFF', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', px: 3, py: 2, borderBottom: '1px solid #DFE5EC' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
              <InfoIcon sx={{ fontSize: 20, color: '#2563eb' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
                Coverage Table
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Per-category coverage % and waiting periods
              </Typography>
            </Box>
          </Box>
          <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
          </Box>
        </Box>
        <Box sx={{ py: 2.5, px: 3 }}>
          <FinalCoverageSection coverageData={coverageCategoryData} setCoverageData={setCoverageCategoryData} />
        </Box>
      </Box>
    </Box>
  );
};

export default CoverageTable;
