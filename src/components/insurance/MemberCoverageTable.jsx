import React from "react";
import {
  Box, Typography, TextField, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment,
  Grid, Select, MenuItem, IconButton
} from "@mui/material";
import { 
  InfoOutlined as InfoIcon, 
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  Add as AddIconNew,
  DeleteOutline as DeleteIcon
} from "@mui/icons-material";

// Common styles for the small, dense tables
const cellStyle = {
  fontSize: '0.75rem',
  padding: '4px 8px',
  borderRight: '1px solid #e0e0e0',
  '&:last-child': { borderRight: 0 }
};

const headerCellStyle = {
  ...cellStyle,
  fontWeight: 600,
  color: '#555',
  backgroundColor: '#fff',
};

const blueText = {
  color: '#4A90E2',
  fontWeight: 500
};

const MemberCoverageTable = ({ 
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
      <Typography sx={{ fontWeight: 700, mt: 2, color: "#333", fontSize: "0.85rem" }}>Member Coverage</Typography>
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

      {/* Final Coverage Section with Coverage Tables */}
      <MemberFinalCoverageSection 
        coverageData={formData.coverageDetails}
        setCoverageData={(updatedData) => handleInputChange('coverageDetails', updatedData)}
      />
    </Box>
  );
};

// Sample data arrays for coverage groups
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

const CoverageSmallTable = ({ title, rows = [], onDeleteItem }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 1.5, borderRadius: '2px' }}>
    <Table size="small">
      <TableHead>
        {/* Category Title Row */}
        <TableRow>
          <TableCell colSpan={3} sx={{ ...headerCellStyle, textAlign: 'center', py: 0.6, borderBottom: '1px solid #e0e0e0', fontSize: '0.7rem', fontWeight: 700 }}>
            {title}
          </TableCell>
        </TableRow>
        {/* Column Header Row */}
        <TableRow sx={{ height: '28px' }}>
          <TableCell sx={{ ...headerCellStyle, width: '45%', fontSize: '0.6rem', fontWeight: 700 }}></TableCell>
          <TableCell sx={{ ...headerCellStyle, width: '28%', fontSize: '0.6rem', fontWeight: 700 }}>Coverage</TableCell>
          <TableCell sx={{ ...headerCellStyle, width: '27%', fontSize: '0.6rem', fontWeight: 700 }}>Waiting Period (Month)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows && rows.length > 0 ? rows.map((row, index) => (
          <TableRow key={row.id || index} sx={{ '&:hover': { bgcolor: '#f9f9f9' }, height: '26px' }}>
            <TableCell sx={{ ...cellStyle, fontSize: '0.65rem' }}>{row.label}</TableCell>
            <TableCell sx={{ ...cellStyle, ...blueText, fontSize: '0.65rem' }}>{row.coverage}%</TableCell>
            <TableCell sx={{ ...cellStyle, fontSize: '0.65rem' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={blueText}>{row.waiting}</span>
                {row.deletable && (
                  <IconButton size="small" sx={{ p: 0, color: '#ff4d4f' }}>
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={3} sx={{ ...cellStyle, textAlign: 'center', color: '#999' }}>No data available</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const MemberFinalCoverageSection = ({ coverageData, setCoverageData }) => {
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

  // Get coverage arrays from data or use empty arrays as fallback
  const diagnosticRows = coverageData?.diagnostic || [];
  const preventativeRows = coverageData?.preventative || [];
  const restorativeRows = coverageData?.restorative || [];
  const implantServicesRows = coverageData?.implantServices || [];
  const prosthodonticsRows = coverageData?.prosthodontics || [];
  const oralSurgeryRows = coverageData?.oralSurgery || [];
  const adjunctiveGeneralRows = coverageData?.adjunctiveGeneral || [];

  // Frequency data - can be replaced with API data
  const frequencyData = [
    { id: 1, label: 'Fluoride', unit: 2, freq: '1 Year' },
    { id: 2, label: 'Oral Evaluation', unit: 2, freq: '1 Year' }
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 1.5, bgcolor: '#fff' }}>
      
      {/* COLUMN 1: Diagnostic & Preventative */}
      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mr: 1 }}>Coverage Table</Typography>
          <Typography sx={{ color: '#4A90E2', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <AddIconNew sx={{ fontSize: 12, mr: 0.2 }} /> Add Coverage
          </Typography>
        </Box>

        <CoverageSmallTable 
          title="Diagnostic" 
          rows={diagnosticRows}
          onDeleteItem={handleDeleteCoverageItem}
        />
        
        <CoverageSmallTable 
          title="Preventative" 
          rows={preventativeRows}
          onDeleteItem={handleDeleteCoverageItem}
        />
      </Grid>

      {/* COLUMN 2: Implant, Prosthodontics, Surgery */}
      <Grid item xs={12} md={4} sx={{ mt: 3.5 }}>
        <CoverageSmallTable 
          title="Implant Services" 
          rows={implantServicesRows}
          onDeleteItem={handleDeleteCoverageItem}
        />
        <CoverageSmallTable 
          title="Prosthodontics, Fixed" 
          rows={prosthodonticsRows.length > 0 ? prosthodonticsRows : [{ id: 100, label: 'Prosthodontics, Fixed', coverage: 0, waiting: '0' }]}
          onDeleteItem={handleDeleteCoverageItem}
        />
        <CoverageSmallTable 
          title="Oral Surgery" 
          rows={oralSurgeryRows}
          onDeleteItem={handleDeleteCoverageItem}
        />
        <CoverageSmallTable 
          title="Adjunctive General Services" 
          rows={adjunctiveGeneralRows}
          onDeleteItem={handleDeleteCoverageItem}
        />
      </Grid>

      {/* COLUMN 3: Shortcuts & Frequency */}
      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1.5 }}>Coverage Book Shortcuts</Typography>
            
            <Typography sx={{ fontSize: '0.7rem', mb: 0.5 }}>Update groups from template</Typography>
            <Select 
              fullWidth 
              size="small" 
              displayEmpty 
              defaultValue="" 
              sx={{ fontSize: '0.7rem', mb: 2.5, '& .MuiSelect-select': { py: 0.4 } }}
            >
              <MenuItem value=""><em>Select template</em></MenuItem>
            </Select>
          </Box>
          <Typography sx={{ color: '#4A90E2', fontSize: '0.7rem', cursor: 'pointer', mt: 4.5, ml: 1.5, fontWeight: 600 }}>
            + Add Coverage Group
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 0.8 }}>Frequency</Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '2px' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#fcfcfc' }}>
                <TableCell sx={{ ...headerCellStyle, width: '55%', fontSize: '0.65rem', fontWeight: 700 }}></TableCell>
                <TableCell sx={{ ...headerCellStyle, width: '20%', fontSize: '0.65rem', fontWeight: 700 }}>Unit</TableCell>
                <TableCell sx={{ ...headerCellStyle, fontSize: '0.65rem', fontWeight: 700 }}>Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {frequencyData && frequencyData.length > 0 ? frequencyData.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  <TableCell sx={{ ...cellStyle, color: '#4A90E2', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.65rem' }}>{row.label}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontSize: '0.65rem' }}>{row.unit}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontSize: '0.65rem' }}>
                    <Select 
                      size="small" 
                      variant="standard" 
                      defaultValue={row.freq} 
                      sx={{ fontSize: '0.65rem', width: '100%', '&:before, &:after': { display: 'none' } }}
                    >
                      <MenuItem value="1 Year">1 Year</MenuItem>
                      <MenuItem value="6 Months">6 Months</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ ...cellStyle, textAlign: 'center', color: '#999' }}>No frequency data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

    </Grid>
  );
};

// Default coverage data structure for API integration
// This provides the initial structure that will be populated with API data
const DEFAULT_COVERAGE_DETAILS = {
  diagnostic: [],
  preventative: [],
  restorative: [],
  implantServices: [],
  prosthodontics: [],
  oralSurgery: [],
  adjunctiveGeneral: []
};

export { DEFAULT_COVERAGE_DETAILS };
export default MemberCoverageTable;
