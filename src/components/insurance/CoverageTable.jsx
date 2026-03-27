import React from "react";
import {
  Box, Typography, TextField, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment,
  Grid, Select, MenuItem, IconButton, Button
} from "@mui/material";
import { 
  InfoOutlined as InfoIcon, 
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIconNew
} from "@mui/icons-material";

// Sample coverage data structure - Replace with API data when implemented
const DEFAULT_COVERAGE = {
  individual: {
    unlimited: false,
    annualMax: '$1,500.00',
    usedAmount: '$158.00',
    usedAmountDate: ''
  },
  family: {
    unlimited: true,
    annualMax: '',
    usedAmount: '',
    usedAmountDate: ''
  },
  ortho: {
    annualMax: '$2,000.00',
    usedAmount: '$18.00',
    usedAmountDate: '03/03/2026'
  },
  categories: ['Diagnostic', 'Preventative', 'Major']
};

const CoverageTable = ({ 
  formData, 
  handleCoverageChange, 
  handleInputChange,
  handleRemoveOrthoMax,
  handleAddCategoryMax,
  headerStyle,
  bodyCellStyle,
  blueHeader,
  ActionText
}) => {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mt: 2, color: "#333", fontSize: "0.85rem" }}>Coverage</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: blueHeader }}>
            <TableRow>
              <TableCell sx={headerStyle}></TableCell>
              <TableCell sx={headerStyle} align="center">Unlimited</TableCell>
              <TableCell sx={headerStyle}>Annual Max</TableCell>
              <TableCell sx={headerStyle}>Used Amount</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 0 }}>Used Amount up-to date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Individual Row */}
            <TableRow>
              <TableCell sx={{ ...bodyCellStyle, fontWeight: 600, width: '20%' }}>Individual</TableCell>
              <TableCell align="center" sx={bodyCellStyle}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.individual.unlimited}
                  onChange={(e) => handleCoverageChange('individual', 'unlimited', e.target.checked)}
                />
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <TextField 
                  size="small" 
                  value={formData.coverage.individual.annualMax}
                  onChange={(e) => handleCoverageChange('individual', 'annualMax', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '90px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TextField 
                    size="small" 
                    value={formData.coverage.individual.usedAmount}
                    onChange={(e) => handleCoverageChange('individual', 'usedAmount', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                  <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', mr: 1 }} />
                </Box>
              </TableCell>
              <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}>
                <TextField 
                  size="small" 
                  value={formData.coverage.individual.usedAmountDate}
                  onChange={(e) => handleCoverageChange('individual', 'usedAmountDate', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.65rem', border: 'none' }, width: '70px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
            </TableRow>

            {/* Family Row */}
            <TableRow>
              <TableCell sx={{ ...bodyCellStyle, fontWeight: 600 }}>Family</TableCell>
              <TableCell align="center" sx={bodyCellStyle}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.family.unlimited}
                  onChange={(e) => handleCoverageChange('family', 'unlimited', e.target.checked)}
                />
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <TextField 
                  size="small" 
                  value={formData.coverage.family.annualMax}
                  onChange={(e) => handleCoverageChange('family', 'annualMax', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '90px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <TextField 
                  size="small" 
                  value={formData.coverage.family.usedAmount}
                  onChange={(e) => handleCoverageChange('family', 'usedAmount', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
              <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}>
                <TextField 
                  size="small" 
                  value={formData.coverage.family.usedAmountDate}
                  onChange={(e) => handleCoverageChange('family', 'usedAmountDate', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.65rem', border: 'none' }, width: '70px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
            </TableRow>

            {/* Ortho Row */}
            <TableRow>
              <TableCell sx={bodyCellStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Ortho</Typography>
                  {formData.coverage.ortho.annualMax && (
                    <ActionText icon={RemoveIcon} text="Remove Max" color="#9e9e9e" onClick={handleRemoveOrthoMax} />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={bodyCellStyle}></TableCell>
              <TableCell sx={bodyCellStyle}>
                <TextField 
                  size="small" 
                  value={formData.coverage.ortho.annualMax}
                  onChange={(e) => handleCoverageChange('ortho', 'annualMax', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '90px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <TextField 
                  size="small" 
                  value={formData.coverage.ortho.usedAmount}
                  onChange={(e) => handleCoverageChange('ortho', 'usedAmount', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
              <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}>
                <TextField 
                  size="small" 
                  value={formData.coverage.ortho.usedAmountDate}
                  onChange={(e) => handleCoverageChange('ortho', 'usedAmountDate', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.65rem', border: 'none' }, width: '70px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
            </TableRow>

            {/* Category Rows with Add Max */}
            {formData.coverage.categories.map((label) => (
              <TableRow key={label}>
                <TableCell sx={bodyCellStyle}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</Typography>
                    <ActionText icon={AddIcon} text="Add Max" onClick={() => handleAddCategoryMax(label)} />
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellStyle}></TableCell>
                <TableCell sx={bodyCellStyle}>
                  <TextField 
                    size="small" 
                    placeholder="-"
                    sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '90px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </TableCell>
                <TableCell sx={bodyCellStyle}></TableCell>
                <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormControlLabel 
        sx={{ mt: 1.5 }}
        control={<Checkbox size="small" checked={formData.honorWriteOff} onChange={(e) => handleInputChange('honorWriteOff', e.target.checked)} />} 
        label={<Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only) <InfoIcon sx={{ fontSize: 10 }} /></Typography>} 
      />

      {/* Final Coverage Section */}
      <FinalCoverageSection />
    </Box>
  );
};

const CoverageGroup = ({ title, rows, onDeleteItem }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 0 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: '#f0f4f8', height: '26px' }}>
          <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: '0.7rem', textAlign: 'center', py: 0.5 }}>
            {title}
          </TableCell>
        </TableRow>
        <TableRow sx={{ height: '24px' }}>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', width: '100px', borderRight: '1px solid #e0e0e0', py: 0.5 }}>
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', width: '50px', borderRight: '1px solid #e0e0e0', py: 0.5 }}>
            Coverage
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', width: '70px', lineHeight: 1.1, py: 0.5, whiteSpace: 'normal', wordWrap: 'break-word' }}>
            Waiting Period (Month)
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id || index} sx={{ height: '28px' }}>
            <TableCell sx={{ fontSize: '0.65rem', borderRight: '1px solid #eee', py: 0.5 }}>{row.label}</TableCell>
            <TableCell sx={{ fontSize: '0.65rem', color: '#1976d2', borderRight: '1px solid #eee', py: 0.5 }}>
              {row.coverage}%
            </TableCell>
            <TableCell sx={{ fontSize: '0.65rem', color: '#1976d2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '28px', py: 0.5 }}>
              <span>{row.waiting}</span>
              {row.deletable && (
                <DeleteIcon 
                  sx={{ fontSize: 12, color: '#d32f2f', cursor: 'pointer' }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteItem) {
                      onDeleteItem(row.id);
                    }
                  }}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// Sample data arrays - Replace with API data when implemented
const COVERAGE_DATA = {
  diagnostic: [
    { id: 1, label: 'Preventative', coverage: 100, waiting: 0 },
    { id: 2, label: 'Basic', coverage: 80, waiting: 0 }
  ],
  preventative: [
    { id: 3, label: 'Preventative', coverage: 100, waiting: 0 },
    { id: 4, label: 'Basic', coverage: 80, waiting: 0 }
  ],
  restorative: [
    { id: 5, label: 'Basic', coverage: 80, waiting: 0 },
    { id: 6, label: 'Major', coverage: 50, waiting: 0 }
  ],
  implantServices: [
    { id: 7, label: 'Major', coverage: 50, waiting: 0 }
  ],
  oralSurgery: [
    { id: 8, label: 'Basic', coverage: 80, waiting: 0 },
    { id: 9, label: 'Major', coverage: 50, waiting: 0 }
  ],
  adjunctiveGeneral: [
    { id: 10, label: 'Basic', coverage: 80, waiting: 0 },
    { id: 11, label: 'D9310', coverage: 50, waiting: '--*', deletable: true },
    { id: 12, label: 'D9230', coverage: 0, waiting: '--*', deletable: true }
  ]
};

const FinalCoverageSection = ({ coverageData, setCoverageData }) => {
  // Handler to delete coverage item
  const handleDeleteCoverageItem = (itemId) => {
    if (!coverageData || !setCoverageData) {
      console.log('Delete clicked for item:', itemId);
      return;
    }

    // Find and remove the item from the appropriate category
    const updatedData = {};
    Object.keys(coverageData).forEach(key => {
      updatedData[key] = coverageData[key].filter(item => item.id !== itemId);
    });
    
    setCoverageData(updatedData);
  };

  return (
    <Grid container spacing={1} sx={{ mt: 1.5, bgcolor: '#fff' }}>
      {/* Coverage Tables */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Coverage Table</Typography>
          <Typography sx={{ color: '#1976d2', fontSize: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <AddIconNew sx={{ fontSize: 10 }} /> Add Coverage
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <CoverageGroup title="Diagnostic" rows={coverageData?.diagnostic || COVERAGE_DATA.diagnostic} onDeleteItem={handleDeleteCoverageItem} />
            <CoverageGroup title="Preventative" rows={coverageData?.preventative || COVERAGE_DATA.preventative} onDeleteItem={handleDeleteCoverageItem} />
            <CoverageGroup title="Restorative" rows={coverageData?.restorative || COVERAGE_DATA.restorative} onDeleteItem={handleDeleteCoverageItem} />
          </Grid>
          <Grid item xs={6}>
            <CoverageGroup title="Implant Services" rows={coverageData?.implantServices || COVERAGE_DATA.implantServices} onDeleteItem={handleDeleteCoverageItem} />
            <CoverageGroup title="Oral Surgery" rows={coverageData?.oralSurgery || COVERAGE_DATA.oralSurgery} onDeleteItem={handleDeleteCoverageItem} />
            <CoverageGroup title="Adjunctive General Services" rows={coverageData?.adjunctiveGeneral || COVERAGE_DATA.adjunctiveGeneral} onDeleteItem={handleDeleteCoverageItem} />
          </Grid>
        </Grid>
      </Grid>

      {/* Coverage Book Shortcuts */}
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', mb: 0.5 }}>
          Coverage Book Shortcuts
        </Typography>
        
        <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, mb: 0.5 }}>
          Select a Template for coverage book shortcuts:
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Select fullWidth size="small" displayEmpty defaultValue="" sx={{ bgcolor: '#fff', fontSize: '0.65rem', '& .MuiSelect-select': { py: 0.5 } }}>
            <MenuItem value=""><em>Select template</em></MenuItem>
          </Select>
          <Typography sx={{ color: '#1976d2', fontSize: '0.6rem', whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: 600 }}>
            + Add Group
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export { DEFAULT_COVERAGE, COVERAGE_DATA };
export default CoverageTable;
