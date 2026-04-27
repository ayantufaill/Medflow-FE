import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Grid,
  IconButton,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PatientFlags = () => {
  const primaryNavy = '#002855';

  const FlagRow = ({ color, name }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1, 
        mb: 0.5, 
        bgcolor: '#f8f9fa', 
        borderRadius: 1,
        '&:hover': { bgcolor: '#f1f3f4' }
      }}
    >
      <Box sx={{ width: 16, height: 16, bgcolor: color, mr: 2, borderRadius: '2px' }} />
      <Typography variant="body2" sx={{ flexGrow: 1, color: '#333' }}>{name}</Typography>
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small"><EditIcon sx={{ fontSize: 16, color: '#1976d2' }} /></IconButton>
        <IconButton size="small"><DeleteIcon sx={{ fontSize: 16, color: '#d32f2f' }} /></IconButton>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Box sx={{ p: 4, maxWidth: 1600, mx: 'auto' }}>
        {/* --- HEADER & BREADCRUMBS --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: '0.85rem' }}>
            <Link
                component={RouterLink}
                to="/admin/practice-setup"
                variant="body2"
                underline="hover"
                color="primary"
                sx={{ fontWeight: 500 }}
                >
                Practice Setup
            </Link>
            <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Patient Flags</Typography>
          </Breadcrumbs>
          
          <Stack spacing={1} direction="row" alignItems="center" sx={{ mt: -0.5 }}>
            <Button startIcon={<SyncIcon />} sx={{ textTransform: 'none', color: '#666', fontWeight: 600, fontSize: '0.8rem' }}>Sync</Button>
            <Button startIcon={<AddIcon />} sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 600, fontSize: '0.8rem' }}>Add new category</Button>
          </Stack>
        </Box>

        <Grid container spacing={24}>
          {/* --- COLUMN 1: PATIENT COMMUNICATION --- */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>Patient Communication</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1.5, px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, width: 40, color: '#333' }}>Color</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#333' }}>Name</Typography>
            </Stack>
            <FlagRow color="#7cb342" name="Send appointment reminder earlier than scheduled time" />
            <Button startIcon={<AddIcon />} sx={{ textTransform: 'none', mt: 2, color: '#9e9e9e', fontWeight: 500 }} size="small">
              Add new flag
            </Button>
          </Grid>

          {/* --- COLUMN 2: BILLING --- */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>Billing</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1.5, px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, width: 40, color: '#333' }}>Color</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#333' }}>Name</Typography>
            </Stack>
            <FlagRow color="#26a69a" name="alert" />
            <FlagRow color="#5e35b1" name="old patient" />
            <FlagRow color="#d81b60" name="family & friends" />
            <FlagRow color="#fb8c00" name="late payment" />
            <FlagRow color="#03a9f4" name="needs special care" />
            <FlagRow color="#00ff00" name="TDS Member" />
            <Button startIcon={<AddIcon />} sx={{ textTransform: 'none', mt: 2, color: '#9e9e9e', fontWeight: 500 }} size="small">
              Add new flag
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientFlags;
