import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const OperatorySetup = () => {
  // Mock data matching the screenshot
  const operatories = [
    { name: 'Operatory 1', status: 'Active', order: 1 },
    { name: 'Operatory 2', status: 'Active', order: 2 },
    { name: 'Operatory 3', status: 'Active', order: 3 },
    { name: 'Operatory 4', status: 'Active', order: 4 },
    { name: 'Consult', status: 'Active', order: 5 },
  ];

  const primaryNavy = '#002855'; // Matching the dark navy in your image

  return (
    <Box sx={{ p: 3, bgcolor: '#ffffff', minHeight: '100vh' }}>
      
      {/* --- BREADCRUMBS --- */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#9e9e9e' }} />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="caption"
          component={RouterLink}
          to="/admin/practice-setup"
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Practice Setup
        </Typography>
        <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500 }}>
          Operatory Setup
        </Typography>
      </Breadcrumbs>

      {/* --- OPERATORIES SECTION --- */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
            Operatories
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Button 
              variant="contained" 
              sx={{ 
                borderRadius: '20px', 
                textTransform: 'none', 
                px: 3, 
                bgcolor: primaryNavy,
                '&:hover': { bgcolor: '#001a3a' }
              }}
            >
              Add Operatory
            </Button>
            <Box sx={{ mt: 1 }}>
              <FormControlLabel 
                control={<Checkbox size="small" sx={{ p: 0.5 }} />} 
                label={<Typography variant="caption" color="textSecondary">Show Deleted Operatories</Typography>} 
              />
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #e0e0e0' }}>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Operatory</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Note</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operatories.map((op) => (
                <TableRow key={op.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ py: 1.5 }}>{op.name}</TableCell>
                  <TableCell>{op.status}</TableCell>
                  <TableCell>{op.order}</TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <DeleteOutlineIcon fontSize="small" sx={{ color: '#bdbdbd' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- OFFICE FILTERS SECTION --- */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 500 }}>
            Office Filters
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              borderRadius: '20px', 
              textTransform: 'none', 
              px: 3, 
              bgcolor: primaryNavy,
              '&:hover': { bgcolor: '#001a3a' }
            }}
          >
            Add Filter
          </Button>
        </Box>
        <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #e0e0e0' }}>
                <TableCell sx={{ fontWeight: 600, color: '#666', width: '30%' }}>Filter</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', width: '40%' }}>Ops Included</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666', width: '30%' }}>Schedule</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
               <TableRow><TableCell colSpan={3} sx={{ py: 4 }} /></TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- USER FILTERS SECTION --- */}
      <Box>
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 500, mb: 1 }}>
          User Filters
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
           <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>
             [User Display Name]
           </Typography>
           <Link 
             component="button" 
             variant="body2" 
             underline="none"
             sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e', '&:hover': { color: primaryNavy } }}
           >
             <AddIcon sx={{ fontSize: 16, mr: 0.5 }} /> Add Filter
           </Link>
        </Box>
      </Box>

    </Box>
  );
};

export default OperatorySetup;
