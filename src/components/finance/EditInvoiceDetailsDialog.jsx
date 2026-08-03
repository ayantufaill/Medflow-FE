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
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const EditInvoiceDetailsDialog = ({ onClose, invoiceId = '25136' }) => {
  const [showEstimates, setShowEstimates] = useState(false);
  return (
    <Box sx={{ width: '1000px', bgcolor: '#fff', borderRadius: radius.md, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: COLORS.SURFACE_TINT, borderBottom: `1px solid ${COLORS.BORDER}`, p: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semiBold, fontSize: '15px' }}>
          Edit invoice #{invoiceId}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: '24px' }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setShowEstimates(true)}
            sx={{ 
              bgcolor: COLORS.ACCENT, 
              color: COLORS.WHITE, 
              textTransform: 'none', 
              px: 2, 
              height: '32px',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              boxShadow: 'none',
              borderRadius: radius.sm,
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
            }}
          >
            Edit Estimates
          </Button>
        </Stack>

        <TableContainer sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '6px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.SURFACE_TINT, '& th': { borderBottom: `1px solid ${COLORS.BORDER}`, py: 1.5, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px' } }}>
                <TableCell padding="checkbox">
                  <Checkbox size="small" sx={{ color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} />
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
              <TableRow sx={{ '& td': { borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.5, fontSize: '13px', color: COLORS.TEXT_PRIMARY } }}>
                <TableCell padding="checkbox">
                  <Checkbox size="small" sx={{ color: COLORS.TEXT_SECONDARY, '&.Mui-checked': { color: COLORS.ACCENT } }} />
                </TableCell>
                <TableCell>
                  <TextField 
                    size="small" 
                    value="05/06/2026" 
                    variant="outlined"
                    sx={{ 
                      width: '110px',
                      '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
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
                      bgcolor: '#e0f2fe', 
                      color: COLORS.ACCENT, 
                      borderRadius: radius.sm,
                      height: '24px',
                      border: `1px solid #bae6fd`,
                      '& .MuiChip-label': { px: 1, fontSize: '11px', fontWeight: fontWeight.semiBold },
                      '& .MuiChip-deleteIcon': { color: COLORS.ACCENT, '&:hover': { color: COLORS.ACCENT_HOVER } }
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField 
                    size="small" 
                    value="$100.00"
                    variant="outlined"
                    sx={{ 
                      width: '80px',
                      '& .MuiInputBase-root': { height: '32px', fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                      '& .MuiInputBase-input': { textAlign: 'right' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
                    }} 
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Actions */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3, pt: 2, borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: COLORS.BORDER, 
              color: COLORS.TEXT_PRIMARY, 
              textTransform: 'none', 
              minWidth: '60px',
              height: '36px',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
            }}
          >
            DBI
          </Button>

          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: COLORS.ACCENT, 
                color: COLORS.ACCENT, 
                textTransform: 'none', 
                px: 3,
                height: '36px',
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                borderRadius: radius.sm,
                '&:hover': { borderColor: COLORS.ACCENT_HOVER, bgcolor: 'rgba(59, 130, 246, 0.04)' }
              }}
            >
              Re-estimate
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: COLORS.ACCENT, 
                color: COLORS.WHITE, 
                textTransform: 'none', 
                px: 3,
                height: '36px',
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                boxShadow: 'none',
                borderRadius: radius.sm,
                '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
              }}
            >
              Save
            </Button>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ 
                borderColor: COLORS.BORDER, 
                color: COLORS.TEXT_PRIMARY, 
                textTransform: 'none', 
                px: 3,
                height: '36px',
                fontSize: '13px',
                fontWeight: fontWeight.medium,
                borderRadius: radius.sm,
                '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' }
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
            zIndex: 140000
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
