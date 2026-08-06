import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

export default function CarrierInfoDialog({ open, onClose, company }) {
  // Format Address values
  const addressLine1 = company?.addressLine1 || company?.Address || company?.address?.street || '-';
  const addressLine2 = company?.addressLine2 || company?.Address2 || company?.address?.street2 || '-';
  const city = company?.city || company?.City || company?.address?.city || '-';
  const state = company?.state || company?.State || company?.address?.state || '-';
  const zipCode = company?.zipCode || company?.Zip || company?.address?.zipCode || '-';

  const cellLabelSx = {
    fontFamily: 'Inter',
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: COLORS.TEXT_SECONDARY,
    bgcolor: COLORS.SURFACE_TINT,
    borderRight: `1px solid ${COLORS.BORDER_LIGHT}`,
    borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
    width: '20%',
    py: 1.2,
    px: 1.5,
  };

  const cellValueSx = {
    fontFamily: 'Inter',
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: COLORS.TEXT_PRIMARY,
    borderRight: `1px solid ${COLORS.BORDER_LIGHT}`,
    borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
    width: '30%',
    py: 1.2,
    px: 1.5,
    '&:last-child': {
      borderRight: 'none',
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={false} 
      sx={{ zIndex: 1400 }}
      PaperProps={{ 
        sx: { 
          borderRadius: radius.lg,
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
          width: '580px',
          maxWidth: '95vw'
        } 
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          px: 3, 
          py: 1.8, 
          borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          bgcolor: '#f3f8fd'
        }}
      >
        <Typography 
          sx={{ 
            fontFamily: 'Inter', 
            fontSize: fontSize.lg, 
            fontWeight: fontWeight.bold, 
            color: COLORS.TEXT_PRIMARY 
          }}
        >
          Carrier Info
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED, '&:hover': { color: COLORS.TEXT_PRIMARY } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.WHITE }}>
        <TableContainer 
          component={Paper} 
          variant="outlined" 
          sx={{ 
            borderColor: COLORS.BORDER, 
            borderRadius: radius.md, 
            overflow: 'hidden',
            boxShadow: 'none'
          }}
        >
          <Table size="small">
            <TableBody>
              {/* Row 1 */}
              <TableRow>
                <TableCell sx={cellLabelSx}>Name</TableCell>
                <TableCell sx={cellValueSx}>{company?.name || company?.CarrierName || '-'}</TableCell>
                <TableCell sx={cellLabelSx}>Country</TableCell>
                <TableCell sx={cellValueSx}>{company?.country || 'US'}</TableCell>
              </TableRow>

              {/* Row 2 */}
              <TableRow>
                <TableCell sx={cellLabelSx}>Electronic ID</TableCell>
                <TableCell sx={cellValueSx}>{company?.payerId || company?.ElectID || '-'}</TableCell>
                <TableCell sx={cellLabelSx}>Address Line 1</TableCell>
                <TableCell sx={cellValueSx}>{addressLine1}</TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow>
                <TableCell sx={cellLabelSx}>Phone</TableCell>
                <TableCell sx={cellValueSx}>{company?.phone || company?.Phone || '-'}</TableCell>
                <TableCell sx={cellLabelSx}>Address Line 2</TableCell>
                <TableCell sx={cellValueSx}>{addressLine2}</TableCell>
              </TableRow>

              {/* Row 4 */}
              <TableRow>
                <TableCell sx={cellLabelSx}>Email</TableCell>
                <TableCell sx={cellValueSx}>{company?.email || company?.TIN || '-'}</TableCell>
                <TableCell sx={cellLabelSx}>City</TableCell>
                <TableCell sx={cellValueSx}>{city}</TableCell>
              </TableRow>

              {/* Row 5 */}
              <TableRow>
                <TableCell sx={cellLabelSx}>Fax</TableCell>
                <TableCell sx={cellValueSx}>{company?.fax || '-'}</TableCell>
                <TableCell sx={cellLabelSx}>State</TableCell>
                <TableCell sx={cellValueSx}>{state}</TableCell>
              </TableRow>

              {/* Row 6 */}
              <TableRow>
                <TableCell sx={{ ...cellLabelSx, borderBottom: 'none' }}>Website</TableCell>
                <TableCell sx={{ ...cellValueSx, borderBottom: 'none' }}>{company?.website || '-'}</TableCell>
                <TableCell sx={{ ...cellLabelSx, borderBottom: 'none' }}>Zip/Postal Code</TableCell>
                <TableCell sx={{ ...cellValueSx, borderBottom: 'none' }}>{zipCode}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* Footer Actions */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          px: 2.5, 
          pb: 2.5, 
          pt: 0.5,
          bgcolor: COLORS.WHITE
        }}
      >
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            fontFamily: 'Inter', 
            fontSize: fontSize.base, 
            fontWeight: fontWeight.bold, 
            textTransform: 'none',
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_SECONDARY,
            bgcolor: COLORS.WHITE,
            '&:hover': { 
              bgcolor: COLORS.SURFACE_HOVER,
              borderColor: COLORS.TEXT_MUTED,
            },
            borderRadius: radius.md,
            boxShadow: 'none',
            px: 3,
            py: 0.75
          }}
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
}
