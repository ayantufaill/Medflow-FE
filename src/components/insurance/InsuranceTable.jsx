import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';
import InsuranceTableRow from './InsuranceTableRow';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

const InsuranceTable = ({
  patientId,
  currentTabData,
  expandedRowId,
  onViewCoverage,
  onCheckEligibility,
  onDeactivate,
  onActivate,
  onRowMenuOpen
}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', backgroundColor: 'transparent' }}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{
            '& .MuiTableCell-head': {
              py: '10px',
              fontFamily: 'Inter',
              fontSize: fontSize.sm,
              fontWeight: fontWeight.semibold,
              color: COLORS.TEXT_MUTED,
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              borderBottom: `1px solid ${COLORS.BORDER}`,
            },
          }}>
            {!patientId && <TableCell>PATIENT</TableCell>}
            <TableCell>PAYER/CARRIER</TableCell>
            <TableCell align="center">PLAN</TableCell>
            <TableCell>SUBSCRIBER</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {currentTabData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={patientId ? 4 : 5} align="center" sx={{ py: 3, fontSize: fontSize.md, color: COLORS.TEXT_MUTED }}>
                No coverages found in this tab
              </TableCell>
            </TableRow>
          ) : (
            currentTabData.map((row) => (
              <InsuranceTableRow
                key={row.id}
                row={row}
                patientId={patientId}
                isExpanded={expandedRowId === row.id}
                onViewCoverage={onViewCoverage}
                onCheckEligibility={onCheckEligibility}
                onDeactivate={onDeactivate}
                onActivate={onActivate}
                onRowMenuOpen={onRowMenuOpen}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InsuranceTable;
