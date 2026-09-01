import React, { useEffect, useState } from 'react';
import { Box, Paper, MenuItem, Button, TextField, Autocomplete, CircularProgress, Typography } from '@mui/material';
import { OutlinedSelect } from '../../patients/form-components/formInputs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcedureCodes, fetchProcedureButtons, selectProcedureCodes, selectProcedureCodesLoading, selectProcedureButtons, selectProcedureButtonsLoading } from '../../../store/slices/feeGuideSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { selectCurrentAppointment } from '../../../store/slices/appointmentSlice';
import { COLORS } from '../../../constants/colors';
import { roundedAutocompletePaperSx, radius, fontSize } from '../../../constants/styles';
import { KeyboardArrowDown as ExpandMoreIcon } from '@mui/icons-material';

const NewTreatmentPlanProcedures = ({ onProcedureClick }) => {
  const dispatch = useDispatch();
  const procedureCodes = useSelector(selectProcedureCodes) || [];
  const procedureCodesLoading = useSelector(selectProcedureCodesLoading);
  const procedureButtons = useSelector(selectProcedureButtons) || [];
  const procedureButtonsLoading = useSelector(selectProcedureButtonsLoading);
  const providersList = useSelector(selectProviderDropdownList) || [];
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProcedureType, setSelectedProcedureType] = useState('Planned');
  const [selectedProvider, setSelectedProvider] = useState('');
  const currentAppointment = useSelector(selectCurrentAppointment);
  const [selectedProcedureOption, setSelectedProcedureOption] = useState(null);
  const [procedureSearchInput, setProcedureSearchInput] = useState('');

  const [hasRequestedCodes, setHasRequestedCodes] = useState(false);
  const [hasRequestedButtons, setHasRequestedButtons] = useState(false);

  // Determine what to render based on API data
  const renderCategories = procedureButtons.map(b => b.category);
    
  // Auto-select first category when loaded
  useEffect(() => {
    if (!selectedCategory && procedureButtons.length > 0) {
      setSelectedCategory(procedureButtons[0].category);
    }
  }, [procedureButtons, selectedCategory]);

  // Auto-select provider from appointment
  useEffect(() => {
    if (currentAppointment && !selectedProvider) {
      // currentAppointment.providerId is a full provider object { _id, providerCode, ... }
      const provObj = currentAppointment.providerId;
      const provId = typeof provObj === 'object' && provObj !== null
        ? (provObj._id || provObj.id)
        : provObj;
      if (provId) {
        setSelectedProvider(String(provId));
      }
    }
  }, [currentAppointment, selectedProvider]);

  useEffect(() => {
    if (procedureCodes.length === 0 && !procedureCodesLoading && !hasRequestedCodes) {
      setHasRequestedCodes(true);
      dispatch(fetchProcedureCodes({ limit: 2000 }));
    }
    if (procedureButtons.length === 0 && !procedureButtonsLoading && !hasRequestedButtons) {
      setHasRequestedButtons(true);
      dispatch(fetchProcedureButtons());
    }
    if (providersList.length === 0) {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [dispatch, procedureCodes.length, procedureCodesLoading, procedureButtons.length, procedureButtonsLoading, hasRequestedCodes, hasRequestedButtons, providersList.length]);

  // Find procedures for currently selected category
  const activeProcedures = procedureButtons.find(b => b.category === selectedCategory)?.items || [];

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ width: '35%' }}>
          <OutlinedSelect
            value={selectedProcedureType}
            onChange={(e) => setSelectedProcedureType(e.target.value)}
            fullWidth
          >
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Existing">Existing</MenuItem>
            <MenuItem value="Referred">Referred</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
          </OutlinedSelect>
        </Box>
        
        <Box sx={{ width: '65%' }}>
          <OutlinedSelect
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Provider</MenuItem>
            {providersList.map((provider) => {
              const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
              const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
              const name = `${first} ${last}`.trim() || provider.providerCode || provider._id || 'Unknown';
              return (
                <MenuItem key={provider._id} value={provider._id}>
                  {name}
                </MenuItem>
              );
            })}
          </OutlinedSelect>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        {/* Category Column */}
        <Box sx={{ width: '35%', height: '100%', maxHeight: '280px' }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%', overflowY: 'auto' }}>
            {procedureButtonsLoading && procedureButtons.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              renderCategories.map((cat, idx) => (
                <Box 
                  key={idx} 
                  onClick={() => setSelectedCategory(cat)}
                  sx={{ 
                    py: 1,
                    px: 1.5,
                    cursor: 'pointer', 
                    fontSize: '0.85rem',
                    color: selectedCategory === cat ? '#2563eb' : '#475569',
                    bgcolor: selectedCategory === cat ? '#eff6ff' : 'transparent',
                    borderLeft: selectedCategory === cat ? '3px solid #2563eb' : '3px solid transparent',
                    '&:hover': { bgcolor: '#f8fafc' }
                  }}
                >
                  {cat}
                </Box>
              ))
            )}
          </Paper>
        </Box>

        {/* Procedures Grid */}
        <Box sx={{ 
          width: '65%', 
          height: '100%', 
          maxHeight: '280px', // Constrain height to force separate scrolling
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          alignContent: 'start',
          pr: 1 // Add padding for scrollbar
        }}>
          {activeProcedures.map((proc, idx) => (
            <Button
              key={idx}
              onClick={() => onProcedureClick({
                name: proc.name,
                code: proc.code,
                procedureCode: proc.code,
                description: proc.name,
                provider: selectedProvider,
                status: selectedProcedureType
              })}
              variant="outlined"
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: '#475569',
                borderColor: '#e2e8f0',
                bgcolor: '#fff',
                py: 2,
                px: 1.5,
                minHeight: '60px',
                textAlign: 'left',
                fontSize: '0.8rem',
                lineHeight: 1.2,
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }
              }}
            >
              {proc.name}
            </Button>
            ))}
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mt: 2 }}>
        <Autocomplete
          openOnFocus
          popupIcon={<ExpandMoreIcon sx={{ color: COLORS.TEXT_SECONDARY }} />}
          clearIcon={null}
          options={procedureCodes}
          loading={procedureCodesLoading}
          value={selectedProcedureOption}
          inputValue={procedureSearchInput}
          onInputChange={(_, newInputValue) => setProcedureSearchInput(newInputValue)}
          getOptionLabel={(option) => `${option.ProcCode || option.code} - ${option.Descript || option.name || option.AbbrDesc || ''}`}
          filterOptions={(options, { inputValue }) => {
            const query = (inputValue || '').trim().toLowerCase();
            if (!query) return options;
            return options.filter((option) => {
              const code = (option.ProcCode || option.code || '').toLowerCase();
              const description = (option.Descript || option.name || option.AbbrDesc || '').toLowerCase();
              return code.includes(query) || description.includes(query);
            });
          }}
          isOptionEqualToValue={(option, value) => (option.ProcCode || option.code) === (value.ProcCode || value.code)}
          onChange={(_, value) => {
            if (!value) return;
            setSelectedProcedureOption(null);
            onProcedureClick({
              name: value.Descript || value.name || value.AbbrDesc || value.ProcCode || value.code,
              code: value.ProcCode || value.code,
              procedureCode: value.ProcCode || value.code,
              description: value.Descript || value.name || value.AbbrDesc || '',
              provider: selectedProvider,
              status: selectedProcedureType
            });
            setProcedureSearchInput('');
          }}
          slotProps={{
            popper: { sx: { zIndex: 1400 } },
            paper: { sx: roundedAutocompletePaperSx },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '42px',
              borderRadius: radius.md,
              backgroundColor: COLORS.SURFACE_INPUT,
              fontFamily: 'Inter',
              paddingRight: '36px !important',
              '& fieldset': { borderWidth: '1.2px', borderColor: COLORS.BORDER },
              '&:hover fieldset': { borderColor: COLORS.TEXT_MUTED },
              '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT, borderWidth: '1.2px' },
            },
            '& .MuiOutlinedInput-input': {
              padding: '8px 12px !important',
              fontSize: fontSize.md,
            },
            '& .MuiAutocomplete-endAdornment': {
              right: '10px',
            },
            '& .MuiAutocomplete-popupIndicator': {
              padding: 0,
            },
          }}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <Box component="li" key={key} {...restProps} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: '6px !important' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', minWidth: 72 }}>
                  {option.ProcCode || option.code}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>
                  {option.Descript || option.name || option.AbbrDesc}
                </Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Search/Select Procedure Code"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {procedureCodesLoading ? <CircularProgress color="inherit" size={14} sx={{ mr: 0.75 }} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          fullWidth
        />
      </Box>

    </Paper>
  );
};

export default NewTreatmentPlanProcedures;
