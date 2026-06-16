import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Button, Checkbox, Select, MenuItem
} from "@mui/material";
import { AutoFixNormal as ToothIcon } from "@mui/icons-material";
import React, { useState } from 'react';
import SelectToothDialog from './SelectToothDialog';

const CoverageBookSummary = ({ 
  headerStyle, 
  bodyCellStyle, 
  blueHeader,
  coverageData = [],
  onCoverageDataChange,
  onViewFullBook
}) => {
  const [toothDialogOpen, setToothDialogOpen] = useState(false);
  const [activeToothIndex, setActiveToothIndex] = useState(null);

  const localHeaderStyle = {
    fontSize: "0.55rem",
    fontWeight: 700,
    color: "#555",
    borderRight: "1px solid #e0e0e0",
    lineHeight: 1.2,
    py: 0.4,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  const localBodyCellStyle = {
    fontSize: "0.6rem",
    borderRight: "1px solid #e0e0e0",
    py: 0.25,
    height: "30px",
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const rowData = [
    { code: "CNANOHA", name: "Alternative to Fluoride varnish", age: "18" },
    { code: "D1206", name: "Topical application of fluoride", age: "18" },
    { code: "D1208", name: "Topical application of fluoride - except varnish", age: "18" },
    { code: "D1351", name: "Sealant - per tooth", age: "15" },
    { code: "D2740", name: "Crown - porcelain/ceramic substrate materials", downgrade: "D2790" },
    { code: "D2750", name: "Crown - porcelain fused to high noble metal", downgrade: "D2790" },
  ];

  const getRowData = (code) => {
    return coverageData.find(item => item.code === code || item.rowKey === `proc-${code}`) || {};
  };

  const handleFieldChange = (code, field, value) => {
    if (onCoverageDataChange) {
      let updatedData = [...coverageData];
      const existingIndex = updatedData.findIndex(item => item.code === code || item.rowKey === `proc-${code}`);
      
      if (existingIndex >= 0) {
        updatedData[existingIndex] = { ...updatedData[existingIndex], [field]: value };
      } else {
        const templateRow = rowData.find(r => r.code === code);
        updatedData.push({
          ...templateRow,
          rowKey: `proc-${code}`,
          [field]: value
        });
      }
      onCoverageDataChange(updatedData);
    }
  };

  const handleTeethClick = (code) => {
    setActiveToothIndex(code);
    setToothDialogOpen(true);
  };

  const handleToothSave = (teeth) => {
    if (activeToothIndex !== null) {
      handleFieldChange(activeToothIndex, 'teeth', teeth);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontWeight: 700, mt: 2, color: "#333", fontSize: "0.85rem" }}>Coverage Book Summary</Typography>
        <Button
          variant="contained"
          onClick={onViewFullBook}
          sx={{
            bgcolor: "#0d47a1",
            textTransform: "none",
            fontSize: "0.6rem",
            fontWeight: 600,
            px: 1,
            borderRadius: 1,
            minHeight: '24px',
            minWidth: 'auto'
          }}
        >
          View Full Coverage Book
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: blueHeader }}>
            <TableRow>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '60px', maxWidth: '60px' }}>Code</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '140px', maxWidth: '140px' }}>Procedure Name</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '70px', maxWidth: '70px' }}>Max Allowed/UCR($)</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '100px', maxWidth: '100px' }}>Delivery Pattern(Frequency,M,Y)</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '70px', maxWidth: '70px' }}>Lifetime Limit</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '50px', maxWidth: '50px' }}>Age Limit (Years)</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '50px', maxWidth: '50px' }}>Teeth Limit(Tooth#)</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '70px', maxWidth: '70px' }}>Down-grade</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '40px', maxWidth: '40px' }}>NC</TableCell>
              <TableCell sx={{ ...localHeaderStyle, minWidth: '70px', maxWidth: '70px', borderRight: 0 }}>Flat Plan Portion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((templateRow, index) => {
              const row = { ...templateRow, ...getRowData(templateRow.code) };
              return (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fff' } }}>
                <TableCell sx={localBodyCellStyle}>{row.code}</TableCell>
                <TableCell sx={localBodyCellStyle}>{row.name}</TableCell>
                {/* Max Allowed */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                    $ <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #999',
                        width: '20px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.maxAllowed || ''}
                      onChange={(e) => handleFieldChange(row.code, 'maxAllowed', e.target.value)}
                    />
                  </Box>
                </TableCell>
                {/* Delivery Pattern */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                    <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #ccc',
                        width: '15px',
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        color: '#333'
                      }}
                      value={row.frequency1 || ''}
                      onChange={(e) => handleFieldChange(row.code, 'frequency1', e.target.value)}
                      placeholder="_"
                    />
                    <Typography sx={{ color: '#555', fontSize: '0.65rem' }}>/</Typography>
                    <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #ccc',
                        width: '15px',
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        color: '#333'
                      }}
                      value={row.frequency2 || ''}
                      onChange={(e) => handleFieldChange(row.code, 'frequency2', e.target.value)}
                      placeholder="_"
                    />
                    <Select 
                      variant="standard" 
                      value={row.period || 'M'} 
                      disableUnderline 
                      onChange={(e) => handleFieldChange(row.code, 'period', e.target.value)}
                      sx={{ fontSize: "0.55rem", '& .MuiSelect-select': { py: 0.05 }, minWidth: '18px', ml: 0.5 }}
                    >
                      <MenuItem value="M">M</MenuItem>
                      <MenuItem value="Y">Y</MenuItem>
                    </Select>
                  </Box>
                </TableCell>
                {/* Lifetime Limit */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                    $ <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #999',
                        width: '20px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.lifetimeLimit || ''}
                      onChange={(e) => handleFieldChange(row.code, 'lifetimeLimit', e.target.value)}
                    />
                  </Box>
                </TableCell>
                {/* Age Limit */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <input 
                    style={{
                      border: 'none',
                      width: '20px',
                      height: '10px',
                      fontSize: '0.6rem',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      textAlign: 'center'
                    }}
                    value={row.age || ''}
                    placeholder=""
                    onChange={(e) => handleFieldChange(row.code, 'age', e.target.value)}
                  />
                </TableCell>
                {/* Teeth Limit */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <ToothIcon sx={{ fontSize: 14, color: "#1976d2", cursor: 'pointer' }} onClick={() => handleTeethClick(row.code)} />
                    {row.teeth && row.teeth.length > 0 && (
                      <Typography 
                        onClick={() => handleTeethClick(row.code)}
                        sx={{ fontSize: '0.65rem', color: '#1976d2', cursor: 'pointer', fontWeight: 600, px: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '40px' }}
                      >
                        {row.teeth.join(', ')}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                {/* Down-grade */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                    <Checkbox 
                      size="small" 
                      checked={!!row.hasDowngrade} 
                      onChange={(e) => handleFieldChange(row.code, 'hasDowngrade', e.target.checked)}
                      sx={{ p: 0 }} 
                    />
                    {row.hasDowngrade && (
                      <input 
                        style={{
                          border: 'none',
                          borderBottom: '1px solid #999',
                          width: '30px',
                          height: '10px',
                          fontSize: '0.65rem',
                          backgroundColor: 'transparent',
                          outline: 'none'
                        }}
                        value={row.downgrade || ''}
                        onChange={(e) => handleFieldChange(row.code, 'downgrade', e.target.value)}
                      />
                    )}
                  </Box>
                </TableCell>
                {/* NC */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <Checkbox 
                    size="small" 
                    checked={!!row.nc} 
                    onChange={(e) => handleFieldChange(row.code, 'nc', e.target.checked)}
                    sx={{ p: 0 }} 
                  />
                </TableCell>
                {/* Flat Plan Portion */}
                <TableCell sx={{ ...localBodyCellStyle, borderRight: 0, maxWidth: '60px' }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                    $ <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #999',
                        width: '20px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.flatPlanPortion || ''}
                      onChange={(e) => handleFieldChange(row.code, 'flatPlanPortion', e.target.value)}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            );})}
          </TableBody>
        </Table>
      </TableContainer>
      
      <SelectToothDialog
        open={toothDialogOpen}
        onClose={() => setToothDialogOpen(false)}
        selectedTeeth={activeToothIndex !== null && coverageData[activeToothIndex] ? coverageData[activeToothIndex].teeth : []}
        onSave={handleToothSave}
      />
    </Box>
  );
};

export default CoverageBookSummary;
