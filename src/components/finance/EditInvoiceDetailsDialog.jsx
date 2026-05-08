import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import EditEstimatesDialog from './EditEstimatesDialog';

const EditInvoiceDetailsDialog = ({ onClose, invoiceId = '25136' }) => {
  const [showEstimates, setShowEstimates] = useState(false);
  return (
    <Box sx={{ width: '1000px', bgcolor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#7788bb', p: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.85rem' }}>
          Edit invoice #{invoiceId}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setShowEstimates(true)}
            sx={{ 
              bgcolor: '#d2b48c', 
              color: '#fff', 
              textTransform: 'none', 
              px: 2, 
              py: 0.5,
              fontSize: '0.8rem',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#c4a47c' }
            }}
          >
            Edit Estimates
          </Button>
        </Stack>

        <TableContainer sx={{ border: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #eee', py: 1, color: '#333', fontWeight: 'bold', fontSize: '0.85rem' } }}>
                <TableCell padding="checkbox">
                  <Checkbox size="small" />
                </TableCell>
                <TableCell>DOS</TableCell>
                <TableCell>Procedure</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell align="right">Total Charge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '& td': { borderBottom: '1px solid #eee', py: 1.5, fontSize: '0.85rem' } }}>
                <TableCell padding="checkbox">
                  <Checkbox size="small" />
                </TableCell>
                <TableCell>
                  <TextField 
                    size="small" 
                    value="05/06/2026" 
                    sx={{ 
                      width: '110px',
                      '& .MuiInputBase-input': { py: 0.5, px: 1, fontSize: '0.85rem' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' }
                    }} 
                  />
                </TableCell>
                <TableCell>L5002</TableCell>
                <TableCell></TableCell>
                <TableCell>Finance charge- Late cancellation</TableCell>
                <TableCell>
                  <Chip 
                    label="SAB" 
                    size="small"
                    onDelete={() => {}}
                    deleteIcon={<KeyboardArrowDown />}
                    sx={{ 
                      bgcolor: '#c8e6c9', 
                      color: '#2e7d32', 
                      borderRadius: '4px',
                      height: '24px',
                      '& .MuiChip-label': { px: 1, fontSize: '0.75rem', fontWeight: 'bold' }
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField 
                    size="small" 
                    value="$100.00" 
                    sx={{ 
                      width: '80px',
                      '& .MuiInputBase-input': { py: 0.5, px: 1, fontSize: '0.85rem', textAlign: 'right' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' }
                    }} 
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Actions */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#90a4ae', 
              color: '#fff', 
              textTransform: 'none', 
              minWidth: '60px',
              boxShadow: 'none',
              fontSize: '0.85rem'
            }}
          >
            DBI
          </Button>

          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#d2b48c', 
                color: '#fff', 
                textTransform: 'none', 
                px: 3,
                boxShadow: 'none',
                borderRadius: '4px',
                '&:hover': { bgcolor: '#c4a47c' }
              }}
            >
              Re-estimate
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#d2b48c', 
                color: '#fff', 
                textTransform: 'none', 
                px: 3,
                boxShadow: 'none',
                borderRadius: '4px',
                '&:hover': { bgcolor: '#c4a47c' }
              }}
            >
              Save
            </Button>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ 
                bgcolor: '#9e9e9e', 
                color: '#fff', 
                textTransform: 'none', 
                px: 3,
                boxShadow: 'none',
                borderRadius: '4px',
                '&:hover': { bgcolor: '#8e8e8e' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Edit Estimates Dialog Overlay */}
      {showEstimates && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1400
          }}
          onClick={() => setShowEstimates(false)}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <EditEstimatesDialog 
              onClose={() => setShowEstimates(false)} 
              invoiceId={invoiceId}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditInvoiceDetailsDialog;
