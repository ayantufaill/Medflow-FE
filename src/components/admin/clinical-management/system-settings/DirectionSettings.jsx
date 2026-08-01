import React from 'react';
import { Box, Typography, Button, Select, MenuItem, Grid } from '@mui/material';

const DirectionSettings = ({ directions, handleDirectionChange, handleSaveDirections, isModified }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
          Tooth Charting Direction
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
          Configure the default charting direction. ("Right to left" means from the right of the page to the left of the page.)
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ maxWidth: '100%' }}>
        {Object.entries(directions).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
              <Select
                value={value}
                onChange={(e) => handleDirectionChange(key, e.target.value)}
                size="small"
                sx={{ 
                  backgroundColor: '#fff', 
                  fontSize: '0.85rem', 
                  borderRadius: 1.5,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                }}
              >
                <MenuItem value="Left to right" sx={{ fontSize: '0.85rem' }}>Left to right</MenuItem>
                <MenuItem value="Right to left" sx={{ fontSize: '0.85rem' }}>Right to left</MenuItem>
              </Select>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="contained"
          onClick={handleSaveDirections}
          disabled={!isModified}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
          }}
        >
          Save Directions
        </Button>
      </Box>
    </Box>
  );
};

export default DirectionSettings;
