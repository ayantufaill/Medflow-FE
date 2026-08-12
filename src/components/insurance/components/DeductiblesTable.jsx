import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, InputAdornment, Popover, Autocomplete, CircularProgress
} from "@mui/material";
import { DeleteOutlined as DeleteIcon, Layers as LayersIcon, CalendarTodayOutlined as CalendarIcon } from "@mui/icons-material";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { feeService } from '../../../services/fee.service';

const parseToDayjs = (val) => {
  if (!val) return null;
  if (dayjs.isDayjs && dayjs.isDayjs(val)) return val;
  const str = String(val).trim();
  if (!str) return null;
  const parsedCustom = dayjs(str, ['MM/DD/YYYY', 'YYYY-MM-DD', 'M/D/YYYY', 'MM-DD-YYYY'], true);
  if (parsedCustom.isValid()) return parsedCustom;
  const parsedStandard = dayjs(str);
  return parsedStandard.isValid() ? parsedStandard : null;
};

const InsuranceDatePicker = ({ value, onChange, error, id }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleTextChange = (e) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    onChange(formatted);
  };

  return (
    <>
      <TextField
        id={id}
        fullWidth
        size="small"
        placeholder="mm / dd / yyyy"
        value={value || ''}
        onClick={handleOpen}
        onChange={handleTextChange}
        error={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ ml: 0 }}>
              <IconButton size="small" onClick={handleOpen} sx={{ p: '2px', color: '#2362EF' }}>
                <CalendarIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          bgcolor: '#f8f9fc',
          borderRadius: '6px',
          '& .MuiOutlinedInput-root': {
            fontFamily: "'Inter', sans-serif",
            fontSize: '12.5px',
            fontWeight: 400,
            height: '36px',
            color: '#1e293b',
            cursor: 'pointer',
            borderRadius: '6px',
            pr: '6px',
            '& fieldset': { 
              borderColor: '#DFE5EC',
            },
            '&:hover fieldset': {
              borderColor: '#2362EF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2362EF',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputBase-input': {
            fontFamily: "'Inter', sans-serif",
            fontSize: '12.5px',
            fontWeight: 400,
            color: '#1e293b',
            cursor: 'pointer',
            py: '6px',
            pl: '8px',
            pr: '2px',
            '&::placeholder': {
              color: '#94a3b8',
              opacity: 1,
              fontFamily: "'Inter', sans-serif",
              fontSize: '12.5px',
            },
          },
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 1,
            borderRadius: '12px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.12)',
            zIndex: 99999,
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={parseToDayjs(value)}
            onChange={(newVal) => {
              const formatted = newVal && newVal.isValid() ? newVal.format('MM/DD/YYYY') : '';
              onChange(formatted);
              handleClose();
            }}
            sx={{
              fontFamily: "'Inter', sans-serif",
              '& .MuiPickersDay-root': {
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                '&.Mui-selected': {
                  backgroundColor: '#2362EF !important',
                  color: '#ffffff !important',
                },
              },
              '& .MuiDayCalendar-weekDayLabel': {
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              },
              '& .MuiPickersCalendarHeader-label': {
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              },
            }}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
};

const ProcedureCodeSearchAutocomplete = ({ value, onChange, onRemove }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let active = true;
    const loadCodes = async () => {
      setLoading(true);
      try {
        const res = await feeService.getProcedureCodes({ limit: 150 });
        if (active && res && res.data) {
          setOptions(res.data);
        }
      } catch (err) {
        console.error('Error fetching procedure codes for deductible:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCodes();
    return () => { active = false; };
  }, []);

  const selectedOption = options.find(
    (opt) => opt.ProcCode === value || opt.code === value
  ) || (value ? { ProcCode: value, Descript: '' } : null);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Autocomplete
        size="small"
        freeSolo
        options={options}
        loading={loading}
        value={selectedOption}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue || '');
          if (newInputValue !== undefined) {
            onChange(newInputValue);
          }
        }}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            onChange(newValue);
          } else if (newValue && (newValue.ProcCode || newValue.code)) {
            const codeStr = newValue.ProcCode || newValue.code;
            onChange(codeStr);
          } else {
            onChange('');
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          if (!option) return '';
          return option.ProcCode || option.code || '';
        }}
        filterOptions={(optionsList, { inputValue: query }) => {
          if (!query) return optionsList;
          const q = query.toLowerCase().trim();
          return optionsList.filter((opt) => {
            const code = (opt.ProcCode || opt.code || '').toLowerCase();
            const desc = (opt.Descript || opt.name || '').toLowerCase();
            return code.includes(q) || desc.includes(q);
          });
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const code = option.ProcCode || option.code || '';
          const desc = option.Descript || option.name || '';
          return (
            <Box component="li" key={key} {...optionProps} sx={{ fontSize: '12.5px', fontFamily: "'Inter', sans-serif" }}>
              <Typography sx={{ fontWeight: 600, fontSize: '12.5px', color: '#2362EF', mr: 1, fontFamily: "'Inter', sans-serif" }}>
                {code}
              </Typography>
              {desc && (
                <Typography sx={{ fontSize: '12px', color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
                  — {desc}
                </Typography>
              )}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="CDT Code"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={14} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              width: '120px',
              bgcolor: '#ffffff',
              borderRadius: '6px',
              '& .MuiOutlinedInput-root': {
                fontFamily: "'Inter', sans-serif",
                fontSize: '12.5px',
                fontWeight: 500,
                height: '36px',
                color: '#1e293b',
                p: '0 6px !important',
                borderRadius: '6px',
                '& fieldset': { borderColor: '#DFE5EC' },
                '&:hover fieldset': { borderColor: '#2362EF' },
                '&.Mui-focused fieldset': { borderColor: '#2362EF', borderWidth: '1.5px' },
              },
              '& .MuiInputBase-input': {
                fontFamily: "'Inter', sans-serif",
                fontSize: '12.5px',
                color: '#1e293b',
                p: '4px 0 !important',
                '&::placeholder': { color: '#94a3b8', opacity: 1 },
              },
            }}
          />
        )}
      />
      <IconButton size="small" onClick={onRemove} sx={{ p: 0.5, color: '#ef4444' }}>
        <DeleteIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};

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
  '& .MuiInputBase-root': { fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 500, height: '36px', color: '#1e293b' },
  '& fieldset': { borderColor: '#DFE5EC' },
  '&:hover fieldset': { borderColor: '#2362EF' }
};

const headerCellSx = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
            <LayersIcon sx={{ fontSize: 16, color: '#2362EF' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#0f172a", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Deductibles
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#64748b' }}>
              Per-type lifetime, standard and met amounts
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#2362EF', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 1.5 }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fc' }}>
              <TableCell sx={{ ...headerCellSx, minWidth: '150px' }}>TYPES</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '70px' }} align="center">LIFETIME</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '80px' }} align="center">STANDARD</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '130px' }}>INDIVIDUAL</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '120px' }}>FAMILY</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '130px' }}>MET AMOUNT</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: '160px' }}>MET DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deductibles.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
                <TableCell sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1e293b', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                  {row.isCodeRow ? (
                    <ProcedureCodeSearchAutocomplete
                      value={row.type}
                      onChange={(newVal) => handleDeductibleChange(index, 'type', newVal)}
                      onRemove={() => handleRemoveDeductibleRow && handleRemoveDeductibleRow(index)}
                    />
                  ) : (
                    row.type
                  )}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
                  <Checkbox 
                    size="small" 
                    checked={row.lifetime}
                    onChange={(e) => handleDeductibleChange(index, 'lifetime', e.target.checked)}
                    sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
                  <Checkbox 
                    size="small" 
                    checked={row.standard}
                    onChange={(e) => handleDeductibleChange(index, 'standard', e.target.checked)}
                    sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <TextField 
                    fullWidth
                    size="small" 
                    value={row.individual}
                    onChange={(e) => handleDeductibleChange(index, 'individual', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
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
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
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
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                    }}
                    sx={inputSx}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                  <InsuranceDatePicker
                    id={`metDate-input-${index}`}
                    value={row.metDate}
                    onChange={(formatted) => handleDeductibleChange(index, 'metDate', formatted)}
                    error={isInvalidDate(row.metDate)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {/* Add Deductible by Procedure Code Row */}
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 2, borderBottom: 'none' }}>
                <Typography 
                  onClick={() => handleAddDeductibleRow && handleAddDeductibleRow()}
                  sx={{ color: '#2362EF', fontFamily: "'Inter', sans-serif", fontSize: '13px', cursor: 'pointer', fontWeight: 600, display: 'inline-block' }}
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

export { DEFAULT_DEDUCTIBLES, InsuranceDatePicker };
export default DeductiblesTable;
