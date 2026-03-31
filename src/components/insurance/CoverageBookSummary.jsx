import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Button, Checkbox, Select, MenuItem
} from "@mui/material";
import { AutoFixNormal as ToothIcon } from "@mui/icons-material";

const CoverageBookSummary = ({ 
  headerStyle, 
  bodyCellStyle, 
  blueHeader,
  coverageData = [],
  onCoverageDataChange
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
      const updatedData = [...coverageData];
      if (updatedData[index]) {
        updatedData[index] = { ...updatedData[index], [field]: value };
        onCoverageDataChange(updatedData);
      }
    }
  };

  const handleTeethClick = (index) => {
    console.log('Teeth clicked for row:', index);
    // TODO: Implement teeth selection logic
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontWeight: 700, mt: 2, color: "#333", fontSize: "0.85rem" }}>Coverage Book Summary</Typography>
        <Button
          variant="contained"
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
                        borderBottom: '1px solid #999',
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
                <TableCell align="center" sx={localBodyCellStyle}>{row.age || "—"}</TableCell>
                {/* Teeth Limit */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <ToothIcon sx={{ fontSize: 14, color: "#1976d2", cursor: 'pointer' }} onClick={() => handleTeethClick(index)} />
                </TableCell>
                {/* Down-grade */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Checkbox 
                      size="small" 
                      checked={!!row.hasDowngrade} 
                      onChange={(e) => handleFieldChange(index, 'hasDowngrade', e.target.checked)}
                      sx={{ p: 0 }} 
                    />
                    {row.hasDowngrade && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: -0.3 }}>
                         <ToothIcon sx={{ fontSize: 10, color: "#1976d2" }} />
                         <Typography sx={{ fontSize: '0.55rem', ml: 0.3 }}>{row.downgrade || ''}</Typography>
                      </Box>
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
                        borderBottom: '1px solid #999',
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
                <TableCell align="center" sx={localBodyCellStyle}>{row.age || "—"}</TableCell>
                {/* Teeth Limit */}
                <TableCell align="center" sx={localBodyCellStyle}>
                  <ToothIcon sx={{ fontSize: 14, color: "#1976d2", cursor: 'pointer' }} onClick={() => handleTeethClick(index)} />
                </TableCell>
                {/* Down-grade */}
                <TableCell sx={localBodyCellStyle}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Checkbox 
                      size="small" 
                      checked={!!row.hasDowngrade} 
                      onChange={(e) => handleFieldChange(index, 'hasDowngrade', e.target.checked)}
                      sx={{ p: 0 }} 
                    />
                    {row.hasDowngrade && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: -0.3 }}>
                         <ToothIcon sx={{ fontSize: 10, color: "#1976d2" }} />
                         <Typography sx={{ fontSize: '0.55rem', ml: 0.3 }}>{row.downgrade || ''}</Typography>
                      </Box>
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
    </Box>
  );
};

export default CoverageBookSummary;
