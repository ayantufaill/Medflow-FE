import {
  Box, Typography, TextField, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, InputAdornment
} from "@mui/material";
import { DeleteOutlined as DeleteIcon, Layers as LayersIcon } from "@mui/icons-material";

// Sample deductible data structure - Replace with API data when implemented
const DEFAULT_DEDUCTIBLES = [
  { id: 1, type: 'Standard', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
  { id: 2, type: 'Preventative', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
  { id: 3, type: 'Basic', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
  { id: 4, type: 'Major', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
  { id: 5, type: '3 rthodontics', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' }
];

const inputSx = {
  bgcolor: '#f8f9fc',
  borderRadius: '6px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' },
  '& fieldset': { borderColor: '#DFE5EC' }
};

const headerCellSx = {
  fontSize: '0.65rem',
  fontWeight: 700,
  color: '#777',
  textTransform: 'uppercase',
  borderBottom: '1px solid #DFE5EC',
  borderRight: 'none',
  py: 1.5,
  letterSpacing: '0.3px'
};

const DeductiblesTable = ({ 
  formData, 
  handleDeductibleChange,
  handleAddDeductibleRow,
  handleRemoveDeductibleRow,
  tableHeaderStyle,
  blueHeader
}) => {
  // Use formData.deductibles if available, otherwise use default structure
  const deductibles = formData.deductibles?.length > 0 ? formData.deductibles : DEFAULT_DEDUCTIBLES;
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
            <LayersIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Deductibles
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Per-type lifetime, standard and met amounts
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fc' }}>
              <TableCell sx={{ ...headerCellSx, minWidth: '90px' }}>TYPES</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '70px' }} align="center">LIFETIME</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '80px' }} align="center">STANDARD</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '130px' }}>INDIVIDUAL</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '120px' }}>FAMILY</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '130px' }}>MET AMOUNT</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '120px' }}>MET DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deductibles.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                  {row.isCodeRow ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField 
                        size="small" 
                        placeholder="CDT Code"
                        value={row.type}
                        onChange={(e) => handleDeductibleChange(index, 'type', e.target.value)}
                        sx={{ ...inputSx, width: '100px' }} 
                      />
                      <IconButton size="small" onClick={() => handleRemoveDeductibleRow && handleRemoveDeductibleRow(index)} sx={{ p: 0.5, color: '#d32f2f' }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ) : (
                    row.type
                  )}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
                  <Checkbox 
                    size="small" 
                    checked={row.lifetime}
                    onChange={(e) => handleDeductibleChange(index, 'lifetime', e.target.checked)}
                    sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
                  <Checkbox 
                    size="small" 
                    checked={row.standard}
                    onChange={(e) => handleDeductibleChange(index, 'standard', e.target.checked)}
                    sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    fullWidth
                    size="small" 
                    value={row.individual}
                    onChange={(e) => handleDeductibleChange(index, 'individual', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#999' }}>$</Typography></InputAdornment>,
                    }}
                    sx={inputSx}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    fullWidth
                    size="small" 
                    value={row.family}
                    onChange={(e) => handleDeductibleChange(index, 'family', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#999' }}>$</Typography></InputAdornment>,
                    }}
                    sx={inputSx}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    fullWidth
                    size="small" 
                    value={row.metAmount}
                    disabled
                    placeholder="Auto-calc"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                    }}
                    sx={{ ...inputSx, '& .MuiInputBase-root.Mui-disabled': { bgcolor: '#f8f9fc', color: '#aaa' } }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    fullWidth
                    size="small" 
                    placeholder="mm / dd / yyyy"
                    value={row.metDate || ''}
                    onChange={(e) => handleDeductibleChange(index, 'metDate', e.target.value)}
                    sx={inputSx}
                  />
                </TableCell>
              </TableRow>
            ))}
            {/* Add Deductible by Procedure Code Row */}
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 2, borderBottom: 'none' }}>
                <Typography 
                  onClick={() => handleAddDeductibleRow && handleAddDeductibleRow()}
                  sx={{ color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, display: 'inline-block' }}
                >
                  + Add Deductible by Procedure Code
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  );
};

export { DEFAULT_DEDUCTIBLES };
export default DeductiblesTable;
