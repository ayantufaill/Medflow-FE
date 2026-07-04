import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableRow, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import FormInput from '../FormInput';

const CarrierSearchDropdown = ({ formData, handleInputChange, companies, DUMMY_INSURANCE, handleSelectResult }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (val) => {
    handleInputChange('carrierSearch', val);

    const searchPool = companies.length > 0 ? companies : DUMMY_INSURANCE;
    let filtered = searchPool;
    
    if (val) {
      filtered = searchPool.filter(item => 
        (item.payerId || item.id?.toString() || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.carrierName || item.name || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupName || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupNumber || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.planName || item.name || '').toLowerCase().includes(val.toLowerCase())
      );
    }

    filtered = filtered.filter(item => item.isActive !== false);

    if (formData.excludeSystemCarriers) {
      filtered = filtered.filter(item => !item.isSystemCarrier && !item.isSystem);
    }

    setSearchResults(filtered);
    setShowDropdown(true);
  };

  const onSelect = (item) => {
    handleSelectResult(item);
    setShowDropdown(false);
  };

  return (
    <>
      <Box sx={{ position: 'relative', mt: 1 }}>
        <FormInput
          label="Search Carrier"
          placeholder="Search by Payer Id, Carrier..."
          InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
          sx={{ mb: 0.75 }}
          value={formData.carrierSearch || ''}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => handleSearch(formData.carrierSearch || '')}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        {showDropdown && searchResults.length > 0 && (
          <Paper 
            elevation={8} 
            sx={{ 
              position: 'absolute', top: '100%', left: 0, zIndex: 9999, 
              maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd',
              width: { xs: '300px', sm: '500px', md: '700px' }, mt: 0.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            <Table size="small" stickyHeader>
              <TableBody>
                <TableRow sx={{ bgcolor: '#eef4ff' }}>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer ID</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group Name</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group #</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Plan/Employer Name</TableCell>
                </TableRow>
                {searchResults.map((item, idx) => (
                  <TableRow key={idx} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' } }} onClick={() => onSelect(item)}>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.payerId || item.id || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.carrierName || item.name || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupName || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupNumber || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.planName || item.name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <FormControlLabel 
        control={
          <Checkbox 
            size="small" 
            checked={formData.excludeSystemCarriers || false} 
            onChange={(e) => {
              handleInputChange('excludeSystemCarriers', e.target.checked);
              setTimeout(() => handleSearch(formData.carrierSearch || ''), 0);
            }} 
          />
        } 
        label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Exclude System Carriers</Typography>} 
        sx={{ ml: 0 }} 
      />
    </>
  );
};

export default CarrierSearchDropdown;
