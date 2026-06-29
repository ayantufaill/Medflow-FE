import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Box, Button, Checkbox, Select, MenuItem, TextField, Dialog, IconButton, InputAdornment
} from "@mui/material";
import { AutoFixNormal as ToothIcon, Article as ArticleIcon, Edit as EditIcon } from "@mui/icons-material";

const inputFieldSx = {
  bgcolor: '#f0f3f7',
  borderRadius: '6px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' },
  '& fieldset': { borderColor: 'transparent' }
};

const deliveryPatternSx = {
  bgcolor: '#f0f3f7',
  borderRadius: '6px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' },
  '& fieldset': { borderColor: 'transparent' },
  minWidth: '100px'
};

const headerCellSx = {
  fontSize: '0.65rem',
  fontWeight: 700,
  color: '#777',
  textTransform: 'uppercase',
  borderBottom: '1px solid #DFE5EC',
  borderRight: 'none',
  py: 1.5,
  letterSpacing: '0.3px',
  textAlign: 'center',
  verticalAlign: 'bottom',
  lineHeight: 1.3
};

const bodyCellSx = {
  borderBottom: '1px solid #f0f0f0',
  borderRight: 'none',
  py: 2,
  verticalAlign: 'middle'
};

const CoverageBookSummary = ({ 
  headerStyle, 
  bodyCellStyle, 
  blueHeader,
  coverageData = [],
  onCoverageDataChange,
  onViewFullBook
}) => {
  const rowData = [
    { code: "CNAN3 e A", name: "Alternative to Fluoride varnish", age: "18" },
    { code: "D1206", name: "Topical application of fluoride", age: "18" },
    { code: "D1208", name: "Topical application of fluoride - except varnish", age: "18" },
    { code: "D1351", name: "Sealant - per tooth", age: "15" },
    { code: "D2740", name: "Crown - porcelain/ceramic substrate materials", age: "" },
    { code: "D2750", name: "Crown - porcelain fused to high noble metal", age: "" },
  ];

  const handleFieldChange = (index, field, value) => {
    if (onCoverageDataChange) {
      let updatedData = [...coverageData];
      // If coverageData is empty, initialize it with the default rowData template
      if (updatedData.length === 0) {
        updatedData = rowData.map(row => ({ ...row }));
      }
      if (updatedData[index]) {
        updatedData[index] = { ...updatedData[index], [field]: value };
        onCoverageDataChange(updatedData);
      }
    }
  };

  const [activeToothSelection, setActiveToothSelection] = useState(null);

  const handleToothToggle = (tooth) => {
    if (activeToothSelection === null) return;
    
    let updatedData = coverageData.length > 0 ? [...coverageData] : rowData.map(row => ({ ...row }));
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

  const displayData = coverageData.length > 0 ? coverageData : rowData;

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
      {/* CODE */}
      <TableCell sx={{ ...bodyCellSx, fontWeight: 700, fontSize: '0.8rem', color: '#333', minWidth: '80px' }}>
        {row.code}
      </TableCell>
      {/* PROCEDURE NAME */}
      <TableCell sx={{ ...bodyCellSx, fontSize: '0.75rem', color: '#555', minWidth: '150px', maxWidth: '180px' }}>
        {row.name}
      </TableCell>
      {/* MAX ALLOWED / UCR ($) */}
      <TableCell sx={{ ...bodyCellSx, minWidth: '90px' }}>
        <TextField 
          size="small"
          value={row.maxAllowed || ''}
          onChange={(e) => handleFieldChange(index, 'maxAllowed', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#999' }}>$</Typography></InputAdornment>,
          }}
          sx={inputFieldSx}
        />
      </TableCell>
      {/* DELIVERY PATTERN (F,M,Y) */}
      <TableCell sx={{ ...bodyCellSx, minWidth: '110px' }}>
        <Select
          size="small"
          displayEmpty
          value={row.deliveryPattern || ''}
          onChange={(e) => handleFieldChange(index, 'deliveryPattern', e.target.value)}
          renderValue={(selected) => {
            if (!selected) return <Typography sx={{ color: '#999', fontSize: '0.75rem' }}>__ / __ M</Typography>;
            return selected;
          }}
          sx={deliveryPatternSx}
        >
          <MenuItem value="" disabled><em>Select</em></MenuItem>
          <MenuItem value="1/1 M" sx={{ fontSize: '0.75rem' }}>1/1 M</MenuItem>
          <MenuItem value="1/6 M" sx={{ fontSize: '0.75rem' }}>1/6 M</MenuItem>
          <MenuItem value="1/12 M" sx={{ fontSize: '0.75rem' }}>1/12 M</MenuItem>
          <MenuItem value="2/12 M" sx={{ fontSize: '0.75rem' }}>2/12 M</MenuItem>
          <MenuItem value="1/1 Y" sx={{ fontSize: '0.75rem' }}>1/1 Y</MenuItem>
          <MenuItem value="1/5 Y" sx={{ fontSize: '0.75rem' }}>1/5 Y</MenuItem>
        </Select>
      </TableCell>
      {/* LIFETIME LIMIT */}
      <TableCell sx={{ ...bodyCellSx, minWidth: '90px' }}>
        <TextField 
          size="small"
          value={row.lifetimeLimit || ''}
          onChange={(e) => handleFieldChange(index, 'lifetimeLimit', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#999' }}>$</Typography></InputAdornment>,
          }}
          sx={inputFieldSx}
        />
      </TableCell>
      {/* AGE LIMIT (YRS) */}
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '50px', fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
        {row.age || '—'}
      </TableCell>
      {/* TEETH LIMIT */}
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '50px' }}>
        <Box 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
          onClick={() => setActiveToothSelection(index)}
        >
          <EditIcon sx={{ fontSize: 16, color: '#42a5f5' }} />
        </Box>
      </TableCell>
      {/* DOWNGRADE */}
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '50px' }}>
        <Checkbox 
          size="small" 
          checked={!!row.hasDowngrade} 
          onChange={(e) => handleFieldChange(index, 'hasDowngrade', e.target.checked)}
          sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }} 
        />
      </TableCell>
      {/* NC */}
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '40px' }}>
        <Checkbox 
          size="small" 
          checked={!!row.nc} 
          onChange={(e) => handleFieldChange(index, 'nc', e.target.checked)}
          sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }} 
        />
      </TableCell>
      {/* FLAT PLAN PORTION */}
      <TableCell sx={{ ...bodyCellSx, minWidth: '90px' }}>
        <TextField 
          size="small"
          value={row.flatPlanPortion || ''}
          onChange={(e) => handleFieldChange(index, 'flatPlanPortion', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#999' }}>$</Typography></InputAdornment>,
          }}
          sx={inputFieldSx}
        />
      </TableCell>
    </TableRow>
  );

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
      {/* Header */}
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
      {/* View Full Coverage Book Button */}
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

      {/* Table */}
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
            {displayData.map((row, index) => renderRow(row, index))}
          </TableBody>
        </Table>
      </Box>

      {/* Tooth Selection Dialog */}
      <Dialog open={activeToothSelection !== null} onClose={() => setActiveToothSelection(null)} maxWidth="sm">
        <Box sx={{ position: 'relative', p: 2, minWidth: '400px' }}>
          <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontWeight: 500, color: '#444' }}>
            Select Tooth
          </Typography>
          <IconButton onClick={() => setActiveToothSelection(null)} sx={{ position: 'absolute', top: 4, right: 4, p: 0.5 }}>
            <Typography sx={{ fontSize: '1rem', color: '#888' }}>x</Typography>
          </IconButton>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', 'Q1', 'Q2', '9', '10', '11', '12', '13', '14', '15', '16'].map(t => {
                const dataArray = coverageData.length > 0 ? coverageData : rowData;
                const isSelected = activeToothSelection !== null && dataArray[activeToothSelection]?.teethLimit?.includes(t);
                const isQ = t.startsWith('Q');
                return (
                  <Typography
                    key={t}
                    onClick={() => handleToothToggle(t)}
                    sx={{ 
                      fontSize: '0.75rem', 
                      width: '24px', 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      color: isSelected ? '#1976d2' : '#555',
                      fontWeight: isSelected ? 800 : (isQ ? 700 : 400),
                      userSelect: 'none',
                      ml: (t === 'Q1' || t === '9') ? 3 : 0,
                      mr: (t === 'Q2') ? 3 : 0
                    }}
                  >
                    {t}
                  </Typography>
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              {['32', '31', '30', '29', '28', '27', '26', '25', 'Q4', 'Q3', '24', '23', '22', '21', '20', '19', '18', '17'].map(t => {
                const dataArray = coverageData.length > 0 ? coverageData : rowData;
                const isSelected = activeToothSelection !== null && dataArray[activeToothSelection]?.teethLimit?.includes(t);
                const isQ = t.startsWith('Q');
                return (
                  <Typography
                    key={t}
                    onClick={() => handleToothToggle(t)}
                    sx={{ 
                      fontSize: '0.75rem', 
                      width: '24px', 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      color: isSelected ? '#1976d2' : '#555',
                      fontWeight: isSelected ? 800 : (isQ ? 700 : 400),
                      userSelect: 'none',
                      ml: (t === 'Q4' || t === '24') ? 3 : 0,
                      mr: (t === 'Q3') ? 3 : 0
                    }}
                  >
                    {t}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Dialog>
      </Box>
    </Box>
  );
};

export default CoverageBookSummary;
