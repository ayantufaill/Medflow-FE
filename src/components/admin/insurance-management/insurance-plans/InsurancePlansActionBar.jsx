import React from 'react';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon, Sync as SyncIcon, Add as AddIcon } from '@mui/icons-material';

const InsurancePlansActionBar = ({ searchCarrier, setSearchCarrier, searchGeneral, setSearchGeneral, onAddPlan, onSync }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
        Insurance Plans
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search by carrier name..."
          value={searchCarrier}
          onChange={(e) => setSearchCarrier(e.target.value)}
          sx={{
            width: 220,
            '& .MuiOutlinedInput-root': {
              height: 36,
              fontSize: '0.85rem',
              backgroundColor: '#fff',
              borderRadius: 2
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          placeholder="Search by group name/num..."
          value={searchGeneral}
          onChange={(e) => setSearchGeneral(e.target.value)}
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              height: 36,
              fontSize: '0.85rem',
              backgroundColor: '#fff',
              borderRadius: 2
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          startIcon={<SyncIcon />}
          size="small"
          variant="outlined"
          onClick={onSync}
          sx={{
            textTransform: 'none',
            color: '#1e293b',
            borderColor: '#e2e8f0',
            fontWeight: 600,
            borderRadius: 2,
            height: 36,
            px: 2,
            '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
          }}
        >
          Sync
        </Button>

        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="contained"
          onClick={onAddPlan}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            height: 36,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Add Plan
        </Button>
      </Box>
    </Box>
  );
};

export default InsurancePlansActionBar;
