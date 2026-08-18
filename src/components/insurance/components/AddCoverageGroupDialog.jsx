import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  HealthAndSafety as CoverageIcon,
  MedicalServicesOutlined as ToothIcon
} from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { feeService } from '../../../services/fee.service';
import { coverageGroupService } from '../../../services/insurance.service';

const sharedInputSx = {
  borderRadius: '8px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E5E7EB',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DB',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2563EB',
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
    fontSize: '0.875rem',
    fontFamily: 'Inter',
    color: '#111827',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#9CA3AF',
    opacity: 1,
  },
};

const Label = ({ children }) => (
  <Typography
    sx={{
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: '11.5px',
      color: '#4B5563',
      display: 'block',
      mb: 0.75,
    }}
  >
    {children}
  </Typography>
);

const AddCoverageGroupDialog = ({ open, onClose, onSave }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [procedureOptions, setProcedureOptions] = useState([]);
  const [loadingProcedures, setLoadingProcedures] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Frequency section
  const [enableFrequency, setEnableFrequency] = useState(false);
  const [frequencyCount, setFrequencyCount] = useState('');
  const [frequencyPeriod, setFrequencyPeriod] = useState('Month');

  // Limitations section
  const [enableLimitations, setEnableLimitations] = useState(false);
  const [lifeLimit, setLifeLimit] = useState('');
  const [ageLimit, setAgeLimit] = useState('');

  // Downgrades section
  const [enableDowngrades, setEnableDowngrades] = useState(false);
  const [downgradeSubCheck, setDowngradeSubCheck] = useState(false);
  const [downgradeCode, setDowngradeCode] = useState('');

  const fetchProcedures = useDebouncedCallback(async (query) => {
    if (!query) {
      setProcedureOptions([]);
      return;
    }
    setLoadingProcedures(true);
    try {
      const result = await feeService.getProcedureCodes({ search: query, limit: 20 });
      setProcedureOptions(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProcedures(false);
    }
  }, 300);

  const resetForm = () => {
    setGroupName('');
    setSelectedCodes([]);
    setInputValue('');
    setEnableFrequency(false);
    setFrequencyCount('');
    setFrequencyPeriod('Month');
    setEnableLimitations(false);
    setLifeLimit('');
    setAgeLimit('');
    setEnableDowngrades(false);
    setDowngradeSubCheck(false);
    setDowngradeCode('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!groupName.trim()) return;
    const groupData = {
      name: groupName,
      codes: selectedCodes.map((c) => (typeof c === 'string' ? c : c.ProcCode)),
      frequency: enableFrequency ? { count: frequencyCount, period: frequencyPeriod } : null,
      limitations: enableLimitations ? { lifeLimit, ageLimit } : null,
      downgrades: enableDowngrades ? { subCheck: downgradeSubCheck, code: downgradeCode } : null,
    };

    try {
      const savedGroup = await coverageGroupService.createCoverageGroup(groupData);
      if (onSave) {
        onSave(savedGroup);
      }
    } catch (err) {
      console.error('Failed to create coverage group in backend', err);
      if (onSave) {
        onSave({ ...groupData, id: Date.now() });
      }
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Title / Header ── */}
      <DialogTitle
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#eff6ff',
          borderBottom: '1px solid #e2ebfc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <CoverageIcon sx={{ color: '#2563EB', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.4px',
                color: '#111827',
              }}
            >
              Add Coverage Group
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '11.5px',
                lineHeight: '17.25px',
                color: '#6B7280',
              }}
            >
              Enter the coverage group details and options
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={handleClose} sx={{ color: '#6B7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5 }}>
        {/* Group Name Row */}
        <Box sx={{ mb: 2.5 }}>
          <Label>Group Name</Label>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={sharedInputSx}
          />
        </Box>

        {/* Select Group Codes Row */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
            <Label>Select Group Codes</Label>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 500,
                color: '#2563EB',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Select Procedure
            </Typography>
          </Box>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={procedureOptions}
            getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.ProcCode} - ${option.Descript}`)}
            value={selectedCodes}
            onChange={(_, newValue) => setSelectedCodes(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
              fetchProcedures(newInputValue);
            }}
            loading={loadingProcedures}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={selectedCodes.length === 0 ? 'Search procedure code or description' : ''}
                sx={sharedInputSx}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingProcedures ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '13px',
            color: '#111827',
            mb: 1.5,
          }}
        >
          Include Group in:
        </Typography>

        {/* Section 1: Frequency */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={enableFrequency}
                onChange={(e) => setEnableFrequency(e.target.checked)}
                sx={{ p: 0.5, color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#374151', minWidth: '85px' }}>
                Frequency
              </Typography>
            }
            sx={{ m: 0 }}
          />

          <TextField
            size="small"
            placeholder="Count"
            disabled={!enableFrequency}
            value={frequencyCount}
            onChange={(e) => setFrequencyCount(e.target.value)}
            sx={{ ...sharedInputSx, width: '90px' }}
          />

          <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280' }}>
            / Frequency
          </Typography>

          <Select
            size="small"
            disabled={!enableFrequency}
            value={frequencyPeriod}
            onChange={(e) => setFrequencyPeriod(e.target.value)}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#fff',
              fontSize: '13px',
              fontFamily: 'Inter',
              height: '38px',
              minWidth: '100px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
            }}
          >
            <MenuItem value="Month" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Month(s)</MenuItem>
            <MenuItem value="Year" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Year(s)</MenuItem>
            <MenuItem value="Day" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Day(s)</MenuItem>
          </Select>
        </Box>

        {/* Section 2: Limitations */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={enableLimitations}
                onChange={(e) => setEnableLimitations(e.target.checked)}
                sx={{ p: 0.5, color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#374151', minWidth: '85px' }}>
                Limitations
              </Typography>
            }
            sx={{ m: 0 }}
          />

          <TextField
            size="small"
            placeholder="Life Limit"
            disabled={!enableLimitations}
            value={lifeLimit}
            onChange={(e) => setLifeLimit(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>$</Typography></InputAdornment>,
            }}
            sx={{ ...sharedInputSx, width: '120px' }}
          />

          <TextField
            size="small"
            placeholder="Age Limit"
            disabled={!enableLimitations}
            value={ageLimit}
            onChange={(e) => setAgeLimit(e.target.value)}
            sx={{ ...sharedInputSx, width: '110px' }}
          />
        </Box>

        {/* Section 3: Downgrades */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1.5, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={enableDowngrades}
                onChange={(e) => setEnableDowngrades(e.target.checked)}
                sx={{ p: 0.5, color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#374151', minWidth: '85px' }}>
                Downgrades
              </Typography>
            }
            sx={{ m: 0 }}
          />

          <Checkbox
            size="small"
            disabled={!enableDowngrades}
            checked={downgradeSubCheck}
            onChange={(e) => setDowngradeSubCheck(e.target.checked)}
            sx={{ p: 0.5, color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
          />

          <TextField
            size="small"
            placeholder="Code"
            disabled={!enableDowngrades}
            value={downgradeCode}
            onChange={(e) => setDowngradeCode(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ToothIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                </InputAdornment>
              ),
            }}
            sx={{ ...sharedInputSx, width: '130px' }}
          />
        </Box>
      </DialogContent>

      {/* ── Actions / Footer ── */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #F3F4F6', gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderRadius: '8px',
            color: '#374151',
            borderColor: '#D1D5DB',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 500,
            fontFamily: 'Inter',
            fontSize: '13px',
            '&:hover': {
              borderColor: '#9CA3AF',
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!groupName.trim()}
          sx={{
            borderRadius: '8px',
            bgcolor: '#3B82F6',
            textTransform: 'none',
            px: 3,
            py: 1,
            fontWeight: 500,
            fontFamily: 'Inter',
            fontSize: '13px',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#2563EB',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              bgcolor: '#93C5FD',
              color: '#ffffff',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoverageGroupDialog;
