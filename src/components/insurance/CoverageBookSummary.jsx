import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Button } from "@mui/material";
import { Article as ArticleIcon } from "@mui/icons-material";
import { headerCellSx } from './styles/coverageStyles';
import { DEFAULT_BOOK_ROW_DATA } from './utils/insuranceConstants';
import ToothSelectionDialog from './shared/ToothSelectionDialog';
import CoverageBookRow from './CoverageBookRow';

const CoverageBookSummary = ({ 
  coverageData = [],
  onCoverageDataChange,
  onViewFullBook
}) => {
  const [activeToothSelection, setActiveToothSelection] = useState(null);

  const handleFieldChange = (index, field, value) => {
    if (onCoverageDataChange) {
      let updatedData = [...coverageData];
      if (updatedData.length === 0) {
        updatedData = DEFAULT_BOOK_ROW_DATA.map(row => ({ ...row }));
      }
      if (updatedData[index]) {
        updatedData[index] = { ...updatedData[index], [field]: value };
        onCoverageDataChange(updatedData);
      }
    }
  };

  const handleToothToggle = (tooth) => {
    if (activeToothSelection === null) return;
    
    let updatedData = coverageData.length > 0 ? [...coverageData] : DEFAULT_BOOK_ROW_DATA.map(row => ({ ...row }));
    const proc = updatedData[activeToothSelection];
    if (!proc) return;
    
    let currentTeeth = proc.teethLimit ? proc.teethLimit.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (currentTeeth.includes(tooth)) {
      currentTeeth = currentTeeth.filter(t => t !== tooth);
    } else {
      currentTeeth.push(tooth);
    }
    
    handleFieldChange(activeToothSelection, 'teethLimit', currentTeeth.join(', '));
  };

  const isToothSelected = (tooth) => {
    const dataArray = coverageData.length > 0 ? coverageData : DEFAULT_BOOK_ROW_DATA;
    return dataArray[activeToothSelection]?.teethLimit?.includes(tooth);
  };

  const displayData = coverageData.length > 0 ? coverageData : DEFAULT_BOOK_ROW_DATA;

  return (
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
            <ArticleIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Coverage Book Summary
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Procedure-level limits, age and downgrade rules
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.8px', textTransform: 'uppercase' }}>OPTIONAL</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            onClick={onViewFullBook}
            sx={{
              bgcolor: '#2563eb',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' }
            }}
          >
            View Full Coverage Book
          </Button>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fc' }}>
                <TableCell sx={{ ...headerCellSx, textAlign: 'left' }}>CODE</TableCell>
                <TableCell sx={{ ...headerCellSx, textAlign: 'left' }}>PROCEDURE NAME</TableCell>
                <TableCell sx={headerCellSx}>MAX ALLOWED /<br/>UCR ($)</TableCell>
                <TableCell sx={headerCellSx}>DELIVERY<br/>PATTERN<br/>(F,M,Y)</TableCell>
                <TableCell sx={headerCellSx}>LIFETIME<br/>LIMIT</TableCell>
                <TableCell sx={headerCellSx}>AGE LIMIT<br/>(YRS)</TableCell>
                <TableCell sx={headerCellSx}>TEETH<br/>LIMIT</TableCell>
                <TableCell sx={headerCellSx}>DOWN-<br/>GRADE</TableCell>
                <TableCell sx={headerCellSx}>NC</TableCell>
                <TableCell sx={headerCellSx}>FLAT PLAN<br/>PORTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((row, index) => (
                <CoverageBookRow 
                  key={index} 
                  row={row} 
                  index={index} 
                  handleFieldChange={handleFieldChange} 
                  setActiveToothSelection={setActiveToothSelection} 
                />
              ))}
            </TableBody>
          </Table>
        </Box>

        <ToothSelectionDialog
          open={activeToothSelection !== null}
          onClose={() => setActiveToothSelection(null)}
          activeSelectionCode={activeToothSelection}
          isToothSelected={isToothSelected}
          onToothToggle={handleToothToggle}
        />
      </Box>
    </Box>
  );
};

export default CoverageBookSummary;
