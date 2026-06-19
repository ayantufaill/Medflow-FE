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
  ActionText,
  coverageCategoryData,
  setCoverageCategoryData
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', ml: 1, mr: -0.5 }}>$</Typography>
                    <TextField 
                      size="small" 
                      disabled={formData.coverage.individual.unlimited}
                      value={formData.coverage.individual.unlimited ? '' : formData.coverage.individual.annualMax}
                      placeholder={formData.coverage.individual.unlimited ? 'Unlimited' : ''}
                      onChange={(e) => handleCoverageChange('individual', 'annualMax', e.target.value)}
                      sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                    />
                </Box>
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#999', ml: 1, mr: -0.5 }}>$</Typography>
                    <TextField 
                      size="small" 
                      value={formData.coverage.individual.usedAmount}
                      disabled
                      placeholder="Auto-calc"
                      sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none', color: '#999', WebkitTextFillColor: '#999' }, width: '70px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                    />
                  </Box>
                  <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', mr: 1 }} />
                </Box>
              </TableCell>
              <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}>
                <TextField 
                  size="small" 
                  type="date"
                  value={formData.coverage.individual.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('individual', 'usedAmountDate', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.65rem', border: 'none' }, width: '100px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', ml: 1, mr: -0.5 }}>$</Typography>
                  <TextField 
                    size="small" 
                    disabled={formData.coverage.family.unlimited}
                    value={formData.coverage.family.unlimited ? '' : formData.coverage.family.annualMax}
                    placeholder={formData.coverage.family.unlimited ? 'Unlimited' : ''}
                    onChange={(e) => handleCoverageChange('family', 'annualMax', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </Box>
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#999', ml: 1, mr: -0.5 }}>$</Typography>
                  <TextField 
                    size="small" 
                    value={formData.coverage.family.usedAmount}
                    disabled
                    placeholder="Auto-calc"
                    sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none', color: '#999', WebkitTextFillColor: '#999' }, width: '70px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}>
                <TextField 
                  size="small" 
                  type="date"
                  value={formData.coverage.family.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('family', 'usedAmountDate', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.65rem', border: 'none' }, width: '100px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
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
              <TableCell align="center" sx={bodyCellStyle}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.ortho?.unlimited || false}
                  onChange={(e) => handleCoverageChange('ortho', 'unlimited', e.target.checked)}
                />
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', ml: 1, mr: -0.5 }}>$</Typography>
                  <TextField 
                    size="small" 
                    disabled={formData.coverage.ortho?.unlimited}
                    value={formData.coverage.ortho?.unlimited ? '' : formData.coverage.ortho.annualMax}
                    placeholder={formData.coverage.ortho?.unlimited ? 'Unlimited' : ''}
                    onChange={(e) => handleCoverageChange('ortho', 'annualMax', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </Box>
              </TableCell>
              <TableCell sx={bodyCellStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#999', ml: 1, mr: -0.5 }}>$</Typography>
                  <TextField 
                    size="small" 
                    value={formData.coverage.ortho.usedAmount}
                    disabled
                    placeholder="Auto-calc"
                    sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none', color: '#999', WebkitTextFillColor: '#999' }, width: '70px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ ...bodyCellStyle, borderRight: 0 }}>
                <TextField 
                  size="small" 
                  type="date"
                  value={formData.coverage.ortho.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('ortho', 'usedAmountDate', e.target.value)}
                  sx={{ '& input': { py: 0.15, fontSize: '0.65rem', border: 'none' }, width: '100px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                />
              </TableCell>
            </TableRow>

            {/* Category Rows with Add Max */}
            {formData.coverage.categories.map((label) => {
              const catKey = label.toLowerCase();
              return (
                <TableRow key={label}>
                  <TableCell sx={bodyCellStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</Typography>
                      {(!formData.coverage[catKey] || !formData.coverage[catKey].annualMax) && (
                        <ActionText icon={AddIcon} text="Add Max" onClick={() => handleAddCategoryMax(label)} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={bodyCellStyle}>
                    <Checkbox 
                      size="small" 
                      checked={formData.coverage[catKey]?.unlimited || false}
                      onChange={(e) => handleCoverageChange(catKey, 'unlimited', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formData.coverage[catKey]?.annualMax !== undefined ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', ml: 1, mr: -0.5 }}>$</Typography>
                        <TextField 
                          size="small" 
                          disabled={formData.coverage[catKey]?.unlimited}
                          placeholder={formData.coverage[catKey]?.unlimited ? 'Unlimited' : '-'}
                          value={formData.coverage[catKey]?.unlimited ? '' : formData.coverage[catKey].annualMax}
                          onChange={(e) => handleCoverageChange(catKey, 'annualMax', e.target.value)}
                          sx={{ '& input': { py: 0.15, fontSize: '0.7rem', border: 'none' }, width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                        />
                      </Box>
                    ) : null}
                  </TableCell>
                  <TableCell sx={{ ...bodyCellStyle, textAlign: 'center', color: '#999' }}>—</TableCell>
                  <TableCell sx={{ ...bodyCellStyle, borderRight: 0, textAlign: 'center', color: '#999' }}>—</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <FormControlLabel 
        sx={{ mt: 1.5 }}
        control={<Checkbox size="small" checked={formData.honorWriteOff} onChange={(e) => handleInputChange('honorWriteOff', e.target.checked)} />} 
        label={<Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only) <InfoIcon sx={{ fontSize: 10 }} /></Typography>} 
      />

      {/* Final Coverage Section */}
      <FinalCoverageSection coverageData={coverageCategoryData} setCoverageData={setCoverageCategoryData} />
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
          <Typography sx={{ color: '#bdbdbd', fontSize: '0.6rem', cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}>
            <AddIconNew sx={{ fontSize: 10 }} /> Add Coverage
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <CoverageGroup title="Diagnostic" rows={coverageData?.diagnostic || COVERAGE_DATA.diagnostic} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Preventative" rows={coverageData?.preventative || COVERAGE_DATA.preventative} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Restorative" rows={coverageData?.restorative || COVERAGE_DATA.restorative} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Endodontics" rows={coverageData?.endodontics || COVERAGE_DATA.endodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Periodontics" rows={coverageData?.periodontics || COVERAGE_DATA.periodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Implant Services" rows={coverageData?.implantServices || COVERAGE_DATA.implantServices} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          </Grid>
          <Grid item xs={6}>
            <CoverageGroup title="Oral Surgery" rows={coverageData?.oralSurgery || COVERAGE_DATA.oralSurgery} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Prosthodontics, Fixed" rows={coverageData?.prosthodonticsFixed || COVERAGE_DATA.prosthodonticsFixed} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Prosthodontics, Removable" rows={coverageData?.prosthodonticsRemovable || COVERAGE_DATA.prosthodonticsRemovable} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Adjunct General Services" rows={coverageData?.adjunctGeneral || COVERAGE_DATA.adjunctGeneral} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Orthodontics" rows={coverageData?.orthodontics || COVERAGE_DATA.orthodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
            <CoverageGroup title="Maxillofacial Prosthetics" rows={coverageData?.maxillofacialProsthetics || COVERAGE_DATA.maxillofacialProsthetics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
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
          <Typography sx={{ color: '#bdbdbd', fontSize: '0.6rem', whiteSpace: 'nowrap', cursor: 'not-allowed', fontWeight: 600 }}>
            + Add Coverage Group
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export { DEFAULT_COVERAGE, COVERAGE_DATA };
export default CoverageTable;
