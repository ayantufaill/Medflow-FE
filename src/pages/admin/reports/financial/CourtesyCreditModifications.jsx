import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const CourtesyCreditModifications = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Courtesy Credit Modifications Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
        <Grid container spacing={3} alignItems="flex-end" sx={{ mb: 2 }}>
          <Grid item xs={12} md={2}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>Start Date:</Typography>
            <Box sx={{ borderBottom: '1px solid #ccc', pb: 0.5 }}>
              <Typography variant="caption">05/08/2026</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>End Date:</Typography>
            <Box sx={{ borderBottom: '1px solid #ccc', pb: 0.5 }}>
              <Typography variant="caption">05/08/2026</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">Filter by Adjustment Type: All</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">Filter by Action: All</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">Filter by Patients: All</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <Select fullWidth size="small" variant="standard" defaultValue="pts" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="pts">Filter by Flags: Patients with or without flags</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Select fullWidth size="small" variant="standard" defaultValue="all" sx={{ fontSize: '0.75rem' }}>
              <MenuItem value="all">Filter by Users: All</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel 
              control={<Checkbox size="small" />} 
              label={<Typography variant="caption">Group By Adjustment Type</Typography>} 
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <TextField
            size="small"
            placeholder="Search by patient name"
            sx={{ width: 300, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.8 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#94a3b8' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2, borderTop: '1px solid #eee', pt: 2 }}>
        <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export As CSV</Button>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>
    </Box>
  );
};

export default CourtesyCreditModifications;
