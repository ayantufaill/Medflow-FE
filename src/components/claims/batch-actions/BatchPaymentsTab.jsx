import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip, Box, Button
} from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const headerCellSx = { backgroundColor: '#f8f9fa', 
  py: '10px',
  fontFamily: 'Inter',
  fontSize: fontSize.sm,
  fontWeight: fontWeight.semibold,
  color: COLORS.TEXT_MUTED,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  borderBottom: `1px solid ${COLORS.BORDER}`,
};

const bodyCellSx = {
  py: 1.5,
  fontSize: fontSize.base,
  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
};

const BatchPaymentsTab = ({
  filteredBatchPayments,
  setSelectedBatchPayment,
  setOpenDetailsModal,
  setOpenEOBModal
}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'none', overflowX: 'auto', width: '100%' }}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-head': headerCellSx }}>
            <TableCell>PAYMENT REF #</TableCell>
            <TableCell>DATE</TableCell>
            <TableCell>STATUS</TableCell>
            <TableCell>CARRIER</TableCell>
            <TableCell>PATIENTS</TableCell>
            <TableCell>TOTAL PAYMENTS</TableCell>
            <TableCell>CLAIM BREAKDOWN</TableCell>
            <TableCell align="right">EOB</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBatchPayments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4, fontSize: fontSize.md, color: COLORS.TEXT_MUTED }}>
                No batch payments found. Click "Add New Payment" to record a bulk check.
              </TableCell>
            </TableRow>
          ) : (
            filteredBatchPayments.map((payment) => (
              <TableRow
                key={payment.id}
                hover
                sx={{ '&:hover': { backgroundColor: COLORS.SURFACE_HOVER }, transition: 'background-color 0.15s' }}
              >
                <TableCell sx={{ ...bodyCellSx, minWidth: '180px' }}>
                  <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY, fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.4 }}>
                    {payment.paymentRef}
                  </Typography>
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
                    {payment.date}
                  </Typography>
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Chip
                    label={payment.status}
                    size="small"
                    sx={{
                      fontSize: fontSize.xs,
                      fontWeight: fontWeight.bold,
                      height: '22px',
                      borderRadius: radius.pill,
                      backgroundColor: payment.status === 'COMPLETED' ? COLORS.PRICE_BG : '#fee2e2',
                      color: payment.status === 'COMPLETED' ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR,
                    }}
                  />
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                    {payment.carrier}
                  </Typography>
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
                    {payment.patientsText}
                  </Typography>
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                    ${parseFloat(payment.totalPayments || 0).toFixed(2)}
                  </Typography>
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => { setSelectedBatchPayment(payment); setOpenDetailsModal(true); }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: fontWeight.bold,
                      fontSize: fontSize.sm,
                      py: 0.25,
                      px: 1.5,
                      borderRadius: radius.pill,
                      borderColor: COLORS.ACCENT,
                      color: COLORS.ACCENT,
                    }}
                  >
                    View Allocations
                  </Button>
                </TableCell>

                <TableCell align="right" sx={bodyCellSx}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => { setSelectedBatchPayment(payment); setOpenEOBModal(true); }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: fontWeight.bold,
                      fontSize: fontSize.sm,
                      py: 0.25,
                      px: 1.5,
                      borderRadius: radius.pill,
                      borderColor: COLORS.BORDER,
                      color: COLORS.TEXT_SECONDARY,
                      bgcolor: COLORS.SURFACE_TINT,
                    }}
                  >
                    Manage EOB
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BatchPaymentsTab;
