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

const CoverageGroup = ({ title, rows, onDeleteItem, onChangeItem }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 0 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: '#f0f4f8', height: '26px' }}>
          <TableCell colSpan={3} sx={{ py: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', textAlign: 'center' }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: '0.55rem', color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
              Custom overrides allowed per procedure code
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow sx={{ height: '24px' }}>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', width: '45%', borderRight: '1px solid #e0e0e0', py: 0.5 }}>
            Category / Sub-type
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', width: '25%', borderRight: '1px solid #e0e0e0', py: 0.5 }}>
            Coverage %
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', width: '30%', lineHeight: 1.1, py: 0.5, whiteSpace: 'normal', wordWrap: 'break-word' }}>
            Waiting Period (Months)
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id || index} sx={{ height: '28px' }}>
            <TableCell sx={{ fontSize: '0.65rem', borderRight: '1px solid #eee', py: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#9e9e9e' }}>→</Typography>
                {row.label}
              </Box>
            </TableCell>
            <TableCell sx={{ fontSize: '0.65rem', color: '#1976d2', borderRight: '1px solid #eee', py: 0.5 }}>
              <TextField 
                variant="standard"
                size="small" 
                type="number"
                value={row.coverage !== undefined ? row.coverage : ''}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 0;
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  if (onChangeItem) onChangeItem(row.id, 'coverage', val);
                }}
                sx={{ 
                  '& input': { py: 0.1, px: 0.5, fontSize: '0.65rem', color: '#1976d2', width: '35px', textAlign: 'center' },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { 
                    WebkitAppearance: 'none', 
                    margin: 0 
                  },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }} 
              />%
            </TableCell>
            <TableCell sx={{ fontSize: '0.65rem', color: '#1976d2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '28px', py: 0.5 }}>
              <TextField 
                variant="standard"
                size="small" 
                type="number"
                value={row.waiting !== undefined ? row.waiting : ''}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 0;
                  if (val < 0) val = 0;
                  if (onChangeItem) onChangeItem(row.id, 'waiting', val);
                }}
                sx={{ 
                  '& input': { py: 0.1, px: 0.5, fontSize: '0.65rem', color: '#1976d2', width: '30px', textAlign: 'center' },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { 
                    WebkitAppearance: 'none', 
                    margin: 0 
                  },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }} 
              />
              {row.deletable && (
                <DeleteIcon 
                  sx={{ fontSize: 14, color: '#d32f2f', cursor: 'pointer', ml: 0.5 }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteItem) onDeleteItem(row.id);
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
    { id: 1, label: 'Preventative', coverage: 100, waiting: 0, notes: '' },
    { id: 2, label: 'Basic', coverage: 80, waiting: 0, notes: '' }
  ],
  preventative: [
    { id: 3, label: 'Preventative', coverage: 100, waiting: 0, notes: '' },
    { id: 4, label: 'General', coverage: 100, waiting: 0, notes: '' },
    { id: 5, label: 'Basic', coverage: 80, waiting: 0, notes: '' }
  ],
  restorative: [
    { id: 6, label: 'Basic', coverage: 80, waiting: 0, notes: '' },
    { id: 7, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 8, label: 'General', coverage: 80, waiting: 0, notes: '' }
  ],
  endodontics: [
    { id: 9, label: 'Endodontics', coverage: 80, waiting: 0, notes: '' }
  ],
  periodontics: [
    { id: 10, label: 'Major', coverage: 50, waiting: 0, notes: '' }
  ],
  implantServices: [
    { id: 11, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 12, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ],
  oralSurgery: [
    { id: 13, label: 'Basic', coverage: 80, waiting: 0, notes: '' },
    { id: 14, label: 'Major', coverage: 50, waiting: 0, notes: '' }
  ],
  prosthodonticsFixed: [
    { id: 15, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ],
  prosthodonticsRemovable: [
    { id: 16, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ],
  adjunctGeneral: [
    { id: 17, label: 'Basic', coverage: 80, waiting: 0, notes: '' },
    { id: 18, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 19, label: 'Standard', coverage: 50, waiting: 0, notes: '' }
  ],
  orthodontics: [
    { id: 20, label: 'Orthodontics', coverage: 50, waiting: 0, notes: '' },
    { id: 21, label: 'orthodontics', coverage: 50, waiting: 0, notes: '' }
  ],
  maxillofacialProsthetics: [
    { id: 22, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 23, label: 'General', coverage: 50, waiting: 0, notes: '' }
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

  const handleChangeCoverageItem = (itemId, field, value) => {
    if (!coverageData || !setCoverageData) return;
    const updatedData = {};
    Object.keys(coverageData).forEach(key => {
      updatedData[key] = coverageData[key].map(item => item.id === itemId ? { ...item, [field]: value } : item);
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
            <CoverageGroup title="Diagnostic" rows={coverageData?.diagnostic || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Preventative" rows={coverageData?.preventative || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Restorative" rows={coverageData?.restorative || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Endodontics" rows={coverageData?.endodontics || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Periodontics" rows={coverageData?.periodontics || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Implant Services" rows={coverageData?.implantServices || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          </Grid>
          <Grid item xs={6}>
            <CoverageGroup title="Oral Surgery" rows={coverageData?.oralSurgery || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Prosthodontics, Fixed" rows={coverageData?.prosthodonticsFixed || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Prosthodontics, Removable" rows={coverageData?.prosthodonticsRemovable || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Adjunct General Services" rows={coverageData?.adjunctGeneral || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Orthodontics" rows={coverageData?.orthodontics || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Maxillofacial Prosthetics" rows={coverageData?.maxillofacialProsthetics || []} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
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
          <Select 
            fullWidth 
            size="small" 
            displayEmpty 
            defaultValue="" 
            onChange={(e) => {
              if (e.target.value === 'standard_ppo' && setCoverageData) {
                setCoverageData(COVERAGE_DATA);
              }
            }}
            sx={{ bgcolor: '#fff', fontSize: '0.65rem', '& .MuiSelect-select': { py: 0.5 } }}
          >
            <MenuItem value=""><em>Select template</em></MenuItem>
            <MenuItem value="standard_ppo" sx={{ fontSize: '0.65rem' }}>Standard PPO</MenuItem>
            <MenuItem value="custom" sx={{ fontSize: '0.65rem' }}>Custom Template</MenuItem>
          </Select>
          <Typography sx={{ color: '#1976d2', fontSize: '0.6rem', whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: 600 }}>
            + Add Coverage Group
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export { DEFAULT_COVERAGE, COVERAGE_DATA };
export default CoverageTable;
