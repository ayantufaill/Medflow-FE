import {
  Box, Typography, TextField, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, InputAdornment,
  Grid, Select, MenuItem, IconButton, Button
} from "@mui/material";
import { 
  InfoOutlined as InfoIcon, 
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIconNew,
  GppGood as GppGoodIcon
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
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
      <Box sx={{ p: 2 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fc', borderTop: '1px solid #DFE5EC', borderBottom: '1px solid #DFE5EC' }}>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}></TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }} align="center">UNLIMITED</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}>ANNUAL MAX</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}>USED AMOUNT</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}>USED UP-TO DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Individual Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5, width: '20%' }}>Individual</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.individual.unlimited}
                  onChange={(e) => handleCoverageChange('individual', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  disabled={formData.coverage.individual.unlimited}
                  value={formData.coverage.individual.unlimited ? '' : formData.coverage.individual.annualMax}
                  placeholder={formData.coverage.individual.unlimited ? 'Unlimited' : ''}
                  onChange={(e) => handleCoverageChange('individual', 'annualMax', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.individual.usedAmount}
                  disabled
                  placeholder="Auto-"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  type="text"
                  placeholder="mm / dd / yyyy"
                  value={formData.coverage.individual.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('individual', 'usedAmountDate', e.target.value)}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
            </TableRow>

            {/* Family Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5 }}>aamily</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.family.unlimited}
                  onChange={(e) => handleCoverageChange('family', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  disabled={formData.coverage.family.unlimited}
                  value={formData.coverage.family.unlimited ? '' : formData.coverage.family.annualMax}
                  placeholder={formData.coverage.family.unlimited ? 'Unlimited' : ''}
                  onChange={(e) => handleCoverageChange('family', 'annualMax', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.family.usedAmount}
                  disabled
                  placeholder="Auto-"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  type="text"
                  placeholder="mm / dd / yyyy"
                  value={formData.coverage.family.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('family', 'usedAmountDate', e.target.value)}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
            </TableRow>

            {/* Ortho Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5 }}>3 rtho</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.ortho?.unlimited || false}
                  onChange={(e) => handleCoverageChange('ortho', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  disabled={formData.coverage.ortho?.unlimited}
                  value={formData.coverage.ortho?.unlimited ? '' : formData.coverage.ortho.annualMax}
                  placeholder={formData.coverage.ortho?.unlimited ? 'Unlimited' : ''}
                  onChange={(e) => handleCoverageChange('ortho', 'annualMax', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.ortho.usedAmount}
                  disabled
                  placeholder="Auto-"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  type="text"
                  placeholder="mm / dd / yyyy"
                  value={formData.coverage.ortho.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('ortho', 'usedAmountDate', e.target.value)}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
            </TableRow>

            {/* Category Rows */}
            {['Diagnostic', 'Preventative', 'Major'].map((label) => {
              const catKey = label.toLowerCase();
              return (
                <TableRow key={label} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</Typography>
                      <Typography sx={{ color: '#00b09b', fontSize: '0.7rem', ml: 1, cursor: 'pointer', fontWeight: 600 }}>
                        + Add Max
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                    <Checkbox 
                      size="small" 
                      checked={formData.coverage[catKey]?.unlimited || false}
                      onChange={(e) => handleCoverageChange(catKey, 'unlimited', e.target.checked)}
                      sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                    <TextField 
                      fullWidth
                      size="small" 
                      disabled={formData.coverage[catKey]?.unlimited}
                      value={formData.coverage[catKey]?.unlimited ? '' : formData.coverage[catKey]?.annualMax || ''}
                      onChange={(e) => handleCoverageChange(catKey, 'annualMax', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                      }}
                      sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                    <TextField 
                      fullWidth
                      size="small" 
                      value=""
                      disabled
                      placeholder="Auto-"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                      }}
                      sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#999', fontSize: '0.75rem' }}>
                    —
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <FormControlLabel 
        sx={{ mt: 1.5, ml: 0.5 }}
        control={<Checkbox size="small" checked={formData.honorWriteOff} onChange={(e) => handleInputChange('honorWriteOff', e.target.checked)} sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }} />} 
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only)</Typography> 
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
          </Box>
        } 
      />
      </Box>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
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
        <Box sx={{ p: 2 }}>
        <FinalCoverageSection coverageData={coverageCategoryData} setCoverageData={setCoverageCategoryData} />
        </Box>
      </Box>
    </Box>
  );
};

const CoverageGroup = ({ title, rows, onDeleteItem, onChangeItem }) => (
  <Box sx={{ border: '1px solid #DFE5EC', borderRadius: '8px', mb: 2, overflow: 'hidden' }}>
    {/* Group Header */}
    <Box sx={{ bgcolor: '#f0f4f8', py: 1, px: 2, textAlign: 'center', borderBottom: '1px solid #DFE5EC' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#333' }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: '0.65rem', color: '#888', fontStyle: 'italic' }}>
        Custom overrides allowed per procedure code
      </Typography>
    </Box>
    {/* Column Headers */}
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#777', textTransform: 'uppercase', width: '45%', borderRight: '1px solid #f0f0f0', py: 1, letterSpacing: '0.3px' }}>
            CATEGORY / SUB-TYPE
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#777', textTransform: 'uppercase', width: '25%', borderRight: '1px solid #f0f0f0', py: 1, letterSpacing: '0.3px', lineHeight: 1.3 }}>
            COVERAGE %
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#777', textTransform: 'uppercase', width: '30%', py: 1, letterSpacing: '0.3px', lineHeight: 1.3 }}>
            WAITING PERIOD (MONTHS)
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id || index} sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
            <TableCell sx={{ fontSize: '0.75rem', color: '#555', borderRight: '1px solid #f0f0f0', py: 1.2, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#9e9e9e' }}>→</Typography>
                {row.label}
              </Box>
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#1976d2', borderRight: '1px solid #f0f0f0', py: 1.2, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <TextField 
                variant="standard"
                size="small" 
                type="number"
                value={row.coverage !== undefined ? row.coverage : ''}
                InputProps={{ inputProps: { min: 0, max: 100 }, disableUnderline: false }}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 0;
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  if (onChangeItem) onChangeItem(row.id, 'coverage', val);
                }}
                sx={{ 
                  '& input': { py: 0.1, px: 0.5, fontSize: '0.75rem', color: '#1976d2', width: '35px', textAlign: 'center' },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }} 
              />%
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#1976d2', py: 1.2, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField 
                  variant="standard"
                  size="small" 
                  type="number"
                  value={row.waiting !== undefined ? row.waiting : ''}
                  InputProps={{ inputProps: { min: 0 }, disableUnderline: false }}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val < 0) val = 0;
                    if (onChangeItem) onChangeItem(row.id, 'waiting', val);
                  }}
                  sx={{ 
                    '& input': { py: 0.1, px: 0.5, fontSize: '0.75rem', color: '#1976d2', width: '30px', textAlign: 'center' },
                    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
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
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
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
    <Box sx={{ mt: 1 }}>
      {/* Top row: + Add Coverage on left, Coverage Book Shortcuts on right */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          sx={{ color: '#2563eb', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <AddIconNew sx={{ fontSize: 16 }} /> Add Coverage
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>COVERAGE BOOK SHORTCUTS</Typography>
            <Select 
              size="small" 
              displayEmpty 
              defaultValue="" 
              onChange={(e) => {
                if (e.target.value === 'standard_ppo' && setCoverageData) {
                  setCoverageData(COVERAGE_DATA);
                }
              }}
              sx={{ bgcolor: '#fff', fontSize: '0.75rem', '& .MuiSelect-select': { py: 0.8, px: 1.5 }, minWidth: '180px', '& fieldset': { borderColor: '#DFE5EC' } }}
            >
              <MenuItem value=""><em>Select template</em></MenuItem>
              <MenuItem value="standard_ppo" sx={{ fontSize: '0.75rem' }}>Standard PPO</MenuItem>
              <MenuItem value="custom" sx={{ fontSize: '0.75rem' }}>Custom Template</MenuItem>
            </Select>
          </Box>
          <Typography sx={{ color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', mt: 2.5 }}>+ Add Group</Typography>
        </Box>
      </Box>

      {/* Coverage Group Cards - two column layout */}
      <Grid container spacing={2}>
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
        
    </Box>
  );
};

export { DEFAULT_COVERAGE, COVERAGE_DATA };
export default CoverageTable;
