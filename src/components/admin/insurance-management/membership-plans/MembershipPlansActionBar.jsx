import React from 'react';
import { Box, Typography, TextField, InputAdornment, Button, IconButton, Link } from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  PrintOutlined as PrintIcon,
} from '@mui/icons-material';

const MembershipPlansActionBar = ({ search, setSearch, onAddPlan, view, setView }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
        Membership Plans
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link
          component="button"
          sx={{
            fontSize: '0.85rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            '&:hover': { color: '#334155' }
          }}
        >
          <PrintIcon sx={{ fontSize: '1.2rem' }} />
          Print
        </Link>

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
          Add New Plan
        </Button>

        <TextField
          size="small"
          placeholder="Search by membership..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 240,
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

        {/* View Toggle */}
        <Box sx={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff', overflow: 'hidden' }}>
          <IconButton
            size="small"
            onClick={() => setView('grid')}
            sx={{
              borderRadius: 0,
              borderRight: '1px solid #e2e8f0',
              p: 0.75,
              bgcolor: view === 'grid' ? '#2563eb' : 'transparent',
              color: view === 'grid' ? '#fff' : 'inherit',
              '&:hover': { bgcolor: view === 'grid' ? '#2563eb' : '#f8fafc' }
            }}
          >
            <Box sx={{ width: 16, height: 16, border: `1.5px solid ${view === 'grid' ? '#fff' : '#64748b'}`, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px', p: '1px' }}>
              {[1, 2, 3, 4].map(i => <Box key={i} sx={{ bgcolor: view === 'grid' ? '#fff' : '#64748b' }} />)}
            </Box>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setView('list')}
            sx={{
              borderRadius: 0,
              p: 0.75,
              bgcolor: view === 'list' ? '#2563eb' : 'transparent',
              color: view === 'list' ? '#fff' : 'inherit',
              '&:hover': { bgcolor: view === 'list' ? '#2563eb' : '#f8fafc' }
            }}
          >
            <Box sx={{ width: 16, height: 16, display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'center' }}>
              {[1, 2, 3].map(i => <Box key={i} sx={{ height: '2px', bgcolor: view === 'list' ? '#fff' : '#64748b', width: '100%' }} />)}
            </Box>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MembershipPlansActionBar;
