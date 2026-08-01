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
              '& .MuiInputBase-root': { 
                fontFamily: "Inter", fontSize: "13px", height: "38px", backgroundColor: "#fff", borderRadius: "8px", color: "#374151" 
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262ef' }
            }}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '20px', color: '#9aa3ae' }} />
                </InputAdornment>
              ) 
            }}
          />
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            startIcon={<Typography sx={{ fontSize: '1.2rem', fontWeight: 300 }}>+</Typography>}
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              height: 38, 
              px: "20px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
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
