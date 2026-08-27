import React from 'react';
import { Box, TextField, InputAdornment, FormControl, Select, MenuItem, FormControlLabel, Checkbox, Typography, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import adduserIcon from '../../assets/usermanagement icons/adduser.svg';
import { roundedSelectMenuProps } from '../../constants/styles';

const ProvidersFilterBar = ({ 
  tabConfig, 
  search, 
  setSearch, 
  setPage, 
  specialtyFilter, 
  setSpecialtyFilter, 
  SPECIALTIES, 
  dragEnabled, 
  setDragEnabled, 
  setAddDialog, 
  useRedux, 
  fetchLocal 
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '12px', lineHeight: '16px', color: '#111', mb: '8px' }}>Patient Name:</Typography>
        <TextField
          size="small"
          placeholder={tabConfig.searchPlaceholder || 'Search by provider name'}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ width: '260px', '& .MuiOutlinedInput-root': { borderRadius: '6px', height: '36px' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20 }} /></InputAdornment>,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '12px', lineHeight: '16px', color: '#111', mb: '8px' }}>Speciality:</Typography>
        <FormControl sx={{ width: '260px' }}>
          <Select
            displayEmpty
            value={specialtyFilter}
            onChange={(e) => { setSpecialtyFilter(e.target.value); setPage(0); }}
            renderValue={(v) => v || 'Filter by Speciality'}
            MenuProps={roundedSelectMenuProps}
            sx={{
              bgcolor: 'white',
              borderRadius: '6px',
              height: '36px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
              '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center', fontSize: '13px', color: '#334155', fontWeight: 500 }
            }}
          >
            <MenuItem value=""><em>All Specialties</em></MenuItem>
            {SPECIALTIES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={dragEnabled}
            onChange={(e) => setDragEnabled(e.target.checked)}
          />
        }
        label={
          <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>
            Drag & Drop Table rows to reorder
          </Typography>
        }
        sx={{ mr: 1, mt: '24px' }}
      />

      <Box sx={{ flex: 1 }} />

      <Button
        variant="outlined"
        onClick={() => { if (useRedux) { setSearch(''); setSpecialtyFilter(''); } else fetchLocal(); }}
        sx={{ whiteSpace: 'nowrap', color: '#111', borderColor: '#e0e0e0', fontWeight: 600, fontSize: '0.8rem', mt: '24px', borderRadius: '6px', textTransform: 'none', height: '36px' }}
      >
        Reset Provider Order
      </Button>

      <Button
        variant="contained"
        startIcon={<img src={adduserIcon} alt="add user" style={{ width: 16, height: 16 }} />}
        onClick={() => setAddDialog({ open: true, title: tabConfig.buttonLabel, providerCategory: tabConfig.apiParams.providerCategory || null })}
        sx={{ 
          backgroundColor: '#2262EF', 
          minWidth: '142px',
          height: '36px',
          borderRadius: '6px', 
          paddingLeft: '12px',
          paddingRight: '12px',
          textTransform: 'none', 
          fontFamily: 'Inter',
          fontWeight: 500, 
          fontSize: '14px',
          whiteSpace: 'nowrap',
          '&:hover': { backgroundColor: '#1d4ed8' }, 
          boxShadow: 'none',
          mt: '24px'
        }}
      >
        {tabConfig.buttonLabel}
      </Button>
    </Box>
  );
};

export default ProvidersFilterBar;
