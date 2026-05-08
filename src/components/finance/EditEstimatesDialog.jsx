import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  TextField,
} from '@mui/material';

const EditEstimatesDialog = ({ onClose, invoiceId = '25136', date = '05/06/2026', patientName = 'Vicky Widener', treatment = 'Late cancellation' }) => {
  return (
    <Box sx={{ width: '1200px', bgcolor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#7788bb', p: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.85rem' }}>
          Edit invoice #{invoiceId}
        </Typography>
      </Box>

      {/* Sub-header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #ffccbc' }}>
        <Typography variant="caption" sx={{ color: '#ef5350', fontWeight: 'bold', mr: 1 }}>
          {date}
        </Typography>
        <Typography variant="caption" sx={{ color: '#ef5350', fontWeight: 'bold' }}>
          Invoice #{invoiceId}: 
        </Typography>
        <Typography variant="caption" sx={{ color: '#333', fontWeight: 500, ml: 0.5 }}>
          for {patientName} [ {treatment} ]
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <TableContainer sx={{ border: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #eee', py: 1, color: '#333', fontWeight: 'bold', fontSize: '0.8rem' } }}>
                <TableCell>DOS</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Insurance</TableCell>
                <TableCell>Ins Writeoff</TableCell>
                <TableCell>Pt. Portion</TableCell>
                <TableCell>Deductible</TableCell>
                <TableCell>In. Portion</TableCell>
                <TableCell align="right">Total Charge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '& td': { borderBottom: '1px solid #eee', py: 1.5, fontSize: '0.85rem' } }}>
                <TableCell>{date}</TableCell>
                <TableCell>L5002</TableCell>
                <TableCell>{treatment}</TableCell>
                <TableCell>Christina Sabour</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>()</TableCell>
                <TableCell>
                  <TextField 
                    variant="standard" 
                    size="small" 
                    defaultValue="$0.00" 
                    sx={{ width: '70px', '& .MuiInputBase-input': { fontSize: '0.85rem', textAlign: 'center' } }} 
                  />
                </TableCell>
                <TableCell>
                  <TextField 
                    variant="standard" 
                    size="small" 
                    defaultValue="$100.00" 
                    sx={{ width: '70px', '& .MuiInputBase-input': { fontSize: '0.85rem', textAlign: 'center', color: '#1a237e', fontWeight: 500 } }} 
                  />
                </TableCell>
                <TableCell>
                  <TextField 
                    variant="standard" 
                    size="small" 
                    defaultValue="$0.00" 
                    sx={{ width: '60px', '& .MuiInputBase-input': { fontSize: '0.85rem', textAlign: 'center' } }} 
                  />
                </TableCell>
                <TableCell>
                  <TextField 
                    variant="standard" 
                    size="small" 
                    defaultValue="$0.00" 
                    sx={{ width: '60px', '& .MuiInputBase-input': { fontSize: '0.85rem', textAlign: 'center' } }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField 
                    variant="standard" 
                    size="small" 
                    defaultValue="$100.00" 
                    sx={{ width: '80px', '& .MuiInputBase-input': { fontSize: '0.85rem', textAlign: 'right', fontWeight: 'bold' } }} 
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Actions */}
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }} spacing={2}>
          <Link 
            component="button" 
            variant="caption" 
            sx={{ 
              color: '#5c6bc0', 
              textDecoration: 'none', 
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            + Add description
          </Link>
          
          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#d2b48c', 
                color: '#fff', 
                textTransform: 'none', 
                px: 2,
                boxShadow: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                '&:hover': { bgcolor: '#c4a47c' }
              }}
            >
              Edit Invoice & Save
            </Button>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ 
                bgcolor: '#9e9e9e', 
                color: '#fff', 
                textTransform: 'none', 
                px: 2,
                boxShadow: 'none',
                borderRadius: '4px',
                fontSize: '0.85rem',
                '&:hover': { bgcolor: '#8e8e8e' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default EditEstimatesDialog;
