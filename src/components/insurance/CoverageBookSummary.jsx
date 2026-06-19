import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Button, Checkbox, Select, MenuItem, Dialog, IconButton
} from "@mui/material";
import { AutoFixNormal as ToothIcon } from "@mui/icons-material";

const CoverageBookSummary = ({ 
  headerStyle, 
  bodyCellStyle, 
  blueHeader,
  coverageData = [],
  onCoverageDataChange,
  onViewFullBook
}) => {
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
            {coverageData.length > 0 ? coverageData.map((row, index) => (
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
                      onChange={(e) => handleFieldChange(index, 'maxAllowed', e.target.value)}
                    />
                  </Box>
                </TableCell>
                {/* Delivery Pattern */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.2, flexWrap: 'nowrap' }}>
                    <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #999',
                        width: '10px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.frequency1 || ''}
                      onChange={(e) => handleFieldChange(index, 'frequency1', e.target.value)}
                    /> / 
                    <input 
                      style={{
                        border: 'none',
                        borderBottom: 'none',
                        width: '10px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.frequency2 || ''}
                      onChange={(e) => handleFieldChange(index, 'frequency2', e.target.value)}
                    />
                    <Select 
                      variant="standard" 
                      value={row.period || 'M'} 
                      disableUnderline 
                      onChange={(e) => handleFieldChange(index, 'period', e.target.value)}
                      sx={{ fontSize: "0.55rem", '& .MuiSelect-select': { py: 0.05 }, minWidth: '18px' }}
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
                      onChange={(e) => handleFieldChange(index, 'lifetimeLimit', e.target.value)}
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
                    onChange={(e) => handleFieldChange(index, 'age', e.target.value)}
                  />
                </TableCell>
                {/* Teeth Limit */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, cursor: 'pointer' }} onClick={() => setActiveToothSelection(index)}>
                    <ToothIcon sx={{ fontSize: 14, color: "#1976d2" }} />
                    {row.teethLimit && (
                      <Typography sx={{ fontSize: '0.6rem', color: '#1976d2' }}>
                        {row.teethLimit.length > 5 ? row.teethLimit.substring(0, 5) + '...' : row.teethLimit}
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
                      onChange={(e) => handleFieldChange(index, 'hasDowngrade', e.target.checked)}
                      sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} 
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
                        onChange={(e) => handleFieldChange(index, 'downgrade', e.target.value)}
                      />
                    )}
                  </Box>
                </TableCell>
                {/* NC */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <Checkbox 
                    size="small" 
                    checked={!!row.nc} 
                    onChange={(e) => handleFieldChange(index, 'nc', e.target.checked)}
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
                      onChange={(e) => handleFieldChange(index, 'flatPlanPortion', e.target.value)}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            )) : rowData.map((row, index) => (
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
                      onChange={(e) => handleFieldChange(index, 'maxAllowed', e.target.value)}
                    />
                  </Box>
                </TableCell>
                {/* Delivery Pattern */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.2, flexWrap: 'nowrap' }}>
                    <input 
                      style={{
                        border: 'none',
                        borderBottom: '1px solid #999',
                        width: '10px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.frequency1 || ''}
                      onChange={(e) => handleFieldChange(index, 'frequency1', e.target.value)}
                    /> / 
                    <input 
                      style={{
                        border: 'none',
                        borderBottom: 'none',
                        width: '10px',
                        height: '10px',
                        fontSize: '0.6rem',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                      value={row.frequency2 || ''}
                      onChange={(e) => handleFieldChange(index, 'frequency2', e.target.value)}
                    />
                    <Select 
                      variant="standard" 
                      value={row.period || 'M'} 
                      disableUnderline 
                      onChange={(e) => handleFieldChange(index, 'period', e.target.value)}
                      sx={{ fontSize: "0.55rem", '& .MuiSelect-select': { py: 0.05 }, minWidth: '18px' }}
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
                      onChange={(e) => handleFieldChange(index, 'lifetimeLimit', e.target.value)}
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
                    onChange={(e) => handleFieldChange(index, 'age', e.target.value)}
                  />
                </TableCell>
                {/* Teeth Limit */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, cursor: 'pointer' }} onClick={() => setActiveToothSelection(index)}>
                    <ToothIcon sx={{ fontSize: 14, color: "#1976d2" }} />
                    {row.teethLimit && (
                      <Typography sx={{ fontSize: '0.6rem', color: '#1976d2' }}>
                        {row.teethLimit.length > 5 ? row.teethLimit.substring(0, 5) + '...' : row.teethLimit}
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
                      onChange={(e) => handleFieldChange(index, 'hasDowngrade', e.target.checked)}
                      sx={{ p: 0 }} 
                    />
                    {row.hasDowngrade && (
                      <input 
                        style={{
                          border: 'none',
                          borderBottom: '1px solid #999',
                          width: '30px',
                          height: '10px',
                          fontSize: '0.55rem',
                          backgroundColor: 'transparent',
                          outline: 'none'
                        }}
                        value={row.downgrade || ''}
                        onChange={(e) => handleFieldChange(index, 'downgrade', e.target.value)}
                      />
                    )}
                  </Box>
                </TableCell>
                {/* NC */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <Checkbox 
                    size="small" 
                    checked={!!row.nc} 
                    onChange={(e) => handleFieldChange(index, 'nc', e.target.checked)}
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
                      onChange={(e) => handleFieldChange(index, 'flatPlanPortion', e.target.value)}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
  );
};

export default CoverageBookSummary;
