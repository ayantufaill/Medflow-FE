import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, TextField, Grid, Divider, IconButton, Autocomplete, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProcedureCategorySelectDialog from './ProcedureCategorySelectDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProcedureCodes, selectProcedureCodes, selectProcedureCodesLoading } from '../../store/slices/feeGuideSlice';

const AddNewProcedureDialog = ({ onClose, onSave }) => {
  const maxillaryUR = [1, 2, 3, 4, 5];
  const maxillaryUA = [6, 7, 8, 'Q1', '', 'Q2', 9, 10, 11];
  const maxillaryUL = [12, 13, 14, 15, 16];
  
  const mandibularLR = [32, 31, 30, 29, 28];
  const mandibularLA = [27, 26, 25, 'Q4', '', 'Q3', 24, 23, 22];
  const mandibularLL = [21, 20, 19, 18, 17];

  // Supernumerary Adult Teeth
  const superAdultRightPost = { top: [51, 52, 53, 54, 55], bottom: [82, 81, 80, 79, 78] };
  const superAdultAnterior = { top: [56, 57, 58, 59, 60, 61], bottom: [77, 76, 75, 74, 73, 72] };
  const superAdultLeftPost = { top: [62, 63, 64, 65, 66], bottom: [71, 70, 69, 68, 67] };

  // Retained Primary Teeth
  const retainedRightPost = { top: ['AS', 'BS'], bottom: ['TS', 'SS'] };
  const retainedAnterior = { top: ['CS', 'DS', 'ES', 'FS', 'GS', 'HS'], bottom: ['RS', 'QS', 'PS', 'OS', 'NS', 'MS'] };
  const retainedLeftPost = { top: ['IS', 'JS'], bottom: ['LS', 'KS'] };

  // Supernumerary Primary Teeth
  const superPrimaryRightPost = { top: ['AS', 'BS'], bottom: ['TS', 'SS'] };
  const superPrimaryAnterior = { top: ['CS', 'DS', 'ES', 'FS', 'GS', 'HS'], bottom: ['RS', 'QS', 'PS', 'OS', 'NS', 'MS'] };
  const superPrimaryLeftPost = { top: ['IS', 'JS'], bottom: ['LS', 'KS'] };

  const surfaces = ['M', 'D', 'O/I', 'L', 'B/F', 'C', 'V'];

  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [dontChangeCode, setDontChangeCode] = useState(false);

  // Visibility state for additional teeth containers
  const [showSuperAdult, setShowSuperAdult] = useState(false);
  const [showRetainedPrimary, setShowRetainedPrimary] = useState(false);
  const [showSuperPrimary, setShowSuperPrimary] = useState(false);
  
  // Autocomplete and Dialog states
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const dispatch = useDispatch();
  const allCodes = useSelector(selectProcedureCodes);
  const loading = useSelector(selectProcedureCodesLoading);

  // Fetch all procedure codes if we haven't already
  useEffect(() => {
    if (allCodes.length === 0) {
      dispatch(fetchProcedureCodes({ limit: 1000 }));
    }
  }, [dispatch, allCodes.length]);

  // Debounced search for procedures filtering locally
  useEffect(() => {
    if (!inputValue) {
      setSearchOptions([]);
      return;
    }

    const timer = setTimeout(() => {
      setSearchLoading(true);
      const lowerInput = inputValue.toLowerCase();
      const filtered = allCodes.filter(c => 
        (c.ProcCode && c.ProcCode.toLowerCase().includes(lowerInput)) ||
        (c.Descript && c.Descript.toLowerCase().includes(lowerInput))
      ).slice(0, 20); // limit to 20 results for performance
      setSearchOptions(filtered);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, allCodes]);

  const handleToothClick = (tooth) => {
    if (tooth === '' || (typeof tooth === 'string' && tooth.startsWith('Q'))) return;
    setSelectedTeeth(prev => 
      prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth]
    );
  };

  const handleSurfaceClick = (surface) => {
    setSelectedSurfaces(prev =>
      prev.includes(surface) ? prev.filter(s => s !== surface) : [...prev, surface]
    );
  };

  const ToothButton = ({ label }) => {
    const isSelected = selectedTeeth.includes(label);
    const isQuadrant = typeof label === 'string' && label.startsWith('Q');
    
    return (
    <Box
      onClick={() => handleToothClick(label)}
      sx={{
        width: '30px',
        height: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: isSelected ? 'white' : '#4b5563',
        bgcolor: isSelected ? '#5c7bb5' : 'transparent',
        cursor: (label === '' || isQuadrant) ? 'default' : 'pointer',
        '&:hover': { bgcolor: (label === '' || isQuadrant) ? 'transparent' : isSelected ? '#4a6291' : '#f3f4f6' },
        visibility: label === '' ? 'hidden' : 'visible',
        borderRadius: '2px',
        m: '1px'
      }}
    >
      {label}
    </Box>
    );
  };

  const HeaderBox = ({ label }) => (
    <Box sx={{ bgcolor: '#f9fafb', py: 0.5, textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>
      {label}
    </Box>
  );

  const AdditionalTeethContainer = ({ title, rightPost, anterior, leftPost }) => (
    <Box sx={{ borderTop: '1px solid #e5e7eb', mb: 0, overflow: 'hidden' }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '13px', color: '#1e3a8a', bgcolor: '#f9fafb', py: 0.5, px: 1.5 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
        {/* Right Posterior */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderBox label="Right Posterior" />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {rightPost.top.map(t => <ToothButton key={t} label={t} />)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {rightPost.bottom.map(t => <ToothButton key={t} label={t} />)}
          </Box>
        </Box>
        {/* Anterior */}
        <Box sx={{ flex: 1.5, borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderBox label="Anterior" />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {anterior.top.map(t => <ToothButton key={t} label={t} />)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {anterior.bottom.map(t => <ToothButton key={t} label={t} />)}
          </Box>
        </Box>
        {/* Left Posterior */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderBox label="Left Posterior" />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {leftPost.top.map(t => <ToothButton key={t} label={t} />)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {leftPost.bottom.map(t => <ToothButton key={t} label={t} />)}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#5c7bb5',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', fontSize: '16px' }}>
          Add new procedure
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, maxHeight: 'calc(90vh - 60px)', overflowY: 'auto' }}>
        {/* Select Tooth Section */}
        <Typography sx={{ color: '#5c7bb5', fontSize: '14px', mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          Select Tooth
        </Typography>

        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '4px', mb: 2, overflow: 'hidden' }}>
          <HeaderBox label="Maxillary Arch" />
          <Box sx={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            <Box sx={{ width: '26%' }}>
              <HeaderBox label="UR" />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {maxillaryUR.map(t => <ToothButton key={t} label={t} />)}
              </Box>
            </Box>
            <Box sx={{ width: '48%', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
              <HeaderBox label="UA" />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {maxillaryUA.map((t, i) => <ToothButton key={i} label={t} />)}
              </Box>
            </Box>
            <Box sx={{ width: '26%' }}>
              <HeaderBox label="UL" />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {maxillaryUL.map(t => <ToothButton key={t} label={t} />)}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
            <Box sx={{ width: '26%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {mandibularLR.map(t => <ToothButton key={t} label={t} />)}
              </Box>
              <HeaderBox label="LR" />
            </Box>
            <Box sx={{ width: '48%', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {mandibularLA.map((t, i) => <ToothButton key={i} label={t} />)}
              </Box>
              <HeaderBox label="LA" />
            </Box>
            <Box sx={{ width: '26%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {mandibularLL.map(t => <ToothButton key={t} label={t} />)}
              </Box>
              <HeaderBox label="LL" />
            </Box>
          </Box>
          <HeaderBox label="Mandibular Arch" />

          {/* Conditionally rendered additional teeth containers — inside arch box */}
          {showSuperAdult && (
            <AdditionalTeethContainer
              title="Supernumerary Adult Teeth"
              rightPost={superAdultRightPost}
              anterior={superAdultAnterior}
              leftPost={superAdultLeftPost}
            />
          )}
          {showRetainedPrimary && (
            <AdditionalTeethContainer
              title="Retained Primary Teeth"
              rightPost={retainedRightPost}
              anterior={retainedAnterior}
              leftPost={retainedLeftPost}
            />
          )}
          {showSuperPrimary && (
            <AdditionalTeethContainer
              title="Supernumerary Primary Teeth"
              rightPost={superPrimaryRightPost}
              anterior={superPrimaryAnterior}
              leftPost={superPrimaryLeftPost}
            />
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          {!showSuperAdult && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowSuperAdult(true)}
              sx={{
                bgcolor: '#003380',
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#002660' }
              }}
            >
              Supernumerary Adult Teeth
            </Button>
          )}
          {!showRetainedPrimary && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowRetainedPrimary(true)}
              sx={{
                bgcolor: '#003380',
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#002660' }
              }}
            >
              Retained Primary Teeth
            </Button>
          )}
          {!showSuperPrimary && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowSuperPrimary(true)}
              sx={{
                bgcolor: '#003380',
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#002660' }
              }}
            >
              Supernumerary Primary Teeth
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#5c7bb5' }} />

        {/* Select Surface */}
        <Typography sx={{ color: '#5c7bb5', fontSize: '14px', mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          Select Surface
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
          {surfaces.map(s => {
            const isSelected = selectedSurfaces.includes(s);
            return (
              <Box
                key={s}
                onClick={() => handleSurfaceClick(s)}
                sx={{
                  border: '1px solid',
                  borderColor: isSelected ? '#5c7bb5' : '#9ca3af',
                  bgcolor: isSelected ? '#5c7bb5' : 'transparent',
                  color: isSelected ? 'white' : 'inherit',
                  width: '25px',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: isSelected ? '#4a6291' : '#f3f4f6' },
                  borderRadius: '2px'
                }}
              >
                {s}
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#5c7bb5' }} />

        {/* Enter Code */}
        <Typography sx={{ color: '#5c7bb5', fontSize: '14px', mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          Enter Code
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ 
            width: '250px', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)', 
            '&:focus-within': { borderBottom: '2px solid #5c7bb5' } 
          }}>
            <Autocomplete
              multiple
              freeSolo
              options={searchOptions}
              getOptionLabel={(option) => typeof option === 'string' ? option : `${option.ProcCode} - ${option.Descript}`}
              loading={searchLoading}
              inputValue={inputValue}
              onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
              value={selectedProcedures}
              onChange={(e, newValue) => {
                setSelectedProcedures(newValue);
              }}
              componentsProps={{ popper: { sx: { zIndex: 1500 } } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter code or procedure"
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    endAdornment: (
                      <React.Fragment>
                        {searchLoading ? <CircularProgress color="inherit" size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              sx={{ 
                width: '100%', 
                '& .MuiInputBase-root': { 
                  fontSize: '14px',
                  maxHeight: '90px',
                  overflowY: 'auto',
                  alignItems: 'flex-start',
                  pb: 0.5
                } 
              }}
            />
          </Box>
          <Typography 
            onClick={() => setIsSelectDialogOpen(true)}
            sx={{ color: '#5c7bb5', fontSize: '14px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Select Procedure
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#5c7bb5' }} />

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox 
                size="small" 
                checked={dontChangeCode}
                onChange={(e) => setDontChangeCode(e.target.checked)}
              />
            }
            label="Don't Change Code"
            sx={{ '& .MuiTypography-root': { fontSize: '13px', fontWeight: 'bold', color: '#374151' } }}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedProcedures.length === 0) return;
                
                selectedProcedures.forEach((proc, index) => {
                  const isLast = index === selectedProcedures.length - 1;
                  const code = typeof proc === 'string' ? proc : proc.ProcCode || proc.code;
                  const desc = typeof proc === 'string' ? '' : (proc.Descript || proc.name || '');
                  const feeAmount = typeof proc === 'string' ? 0 : (proc.fee || 0);

                  onSave({
                    selectedTeeth,
                    selectedSurfaces,
                    procedureCode: code,
                    procedureDescription: desc,
                    fee: feeAmount,
                    dontChangeCode
                  }, !isLast);
                });
              }}
              sx={{
                bgcolor: '#d2b48c',
                color: 'white',
                textTransform: 'none',
                boxShadow: 'none',
                px: 4,
                '&:hover': { bgcolor: '#c1a37b', boxShadow: 'none' }
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: '#9ca3af',
                color: 'white',
                textTransform: 'none',
                boxShadow: 'none',
                px: 4,
                '&:hover': { bgcolor: '#8b949e', boxShadow: 'none' }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>

      <ProcedureCategorySelectDialog
        open={isSelectDialogOpen}
        onClose={() => setIsSelectDialogOpen(false)}
        onSelect={(procs) => {
          if (Array.isArray(procs) && procs.length > 0) {
            setSelectedProcedures(prev => [...prev, ...procs]);
            setIsSelectDialogOpen(false);
          }
        }}
      />
    </Box>
  );
};

export default AddNewProcedureDialog;
