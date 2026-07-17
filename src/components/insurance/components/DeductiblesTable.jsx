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
  { id: 5, type: 'Orthodontics', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' }
];

const formatDateInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const isValidDate = (dateStr) => {
  if (!dateStr) return true;
  if (dateStr.length < 10) return false;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const isInvalidDate = (dateStr) => {
  if (!dateStr) return false;
  if (dateStr.length === 10) return !isValidDate(dateStr);
  
  const parts = dateStr.split('/');
  if (parts[0] && parseInt(parts[0], 10) > 12) return true;
  if (parts[1] && parseInt(parts[1], 10) > 31) return true;
  
  return false;
};

const inputSx = {
  bgcolor: '#f8f9fc',
  borderRadius: '6px',
  '& .MuiInputBase-root': { fontSize: '0.7rem', height: '36px', color: '#555' },
  '& fieldset': { borderColor: '#DFE5EC' }
};

const headerCellSx = {
  fontSize: '0.6rem',
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

  const handleDateChange = (e, index) => {
    const rawValue = e.target.value;
    const formatted = formatDateInput(rawValue);
    handleDeductibleChange(index, 'metDate', formatted);

    if (formatted.length === 10) {
      const nextInput = document.getElementById(`metDate-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
            <LayersIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Deductibles
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Per-type lifetime, standard and met amounts
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 1.5 }}>
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
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', py: 2 }}>
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
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.7rem', color: '#999' }}>$</Typography></InputAdornment>,
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
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.7rem', color: '#999' }}>$</Typography></InputAdornment>,
                    }}
                    sx={inputSx}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    fullWidth
                    size="small" 
                    value={row.metAmount}
                    onChange={(e) => handleDeductibleChange(index, 'metAmount', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.7rem', color: '#999' }}>$</Typography></InputAdornment>,
                    }}
                    sx={inputSx}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    id={`metDate-input-${index}`}
                    fullWidth
                    size="small" 
                    placeholder="mm / dd / yyyy"
                    value={row.metDate || ''}
                    onChange={(e) => handleDateChange(e, index)}
                    error={isInvalidDate(row.metDate)}
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
                  sx={{ color: '#2563eb', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600, display: 'inline-block' }}
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
