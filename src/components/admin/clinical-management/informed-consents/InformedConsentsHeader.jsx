import React from 'react';
import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const InformedConsentsHeader = ({
  searchQuery,
  handleSearch,
  setAddDialogOpen,
  navigate
}) => {
  return (
    <>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.25rem' }}>
          Informed Consents
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ 
              width: 300, 
              '& .MuiInputBase-root': { fontSize: '0.85rem', height: 38, backgroundColor: '#fff', borderRadius: 1.5, borderColor: '#e2e8f0' } 
            }}
            InputProps={{ 
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ fontSize: '1.2rem', color: '#94a3b8' }} />
                </InputAdornment>
              ) 
            }}
          />
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            startIcon={<Typography sx={{ fontSize: '1.2rem', fontWeight: 300 }}>+</Typography>}
            sx={{ 
              backgroundColor: '#3b82f6', 
              color: '#fff', 
              textTransform: 'none', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              height: 38, 
              px: 3,
              borderRadius: 1.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }
            }}
          >
            Add New Consent
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default InformedConsentsHeader;
