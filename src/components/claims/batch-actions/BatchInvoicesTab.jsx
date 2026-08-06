import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Checkbox
} from '@mui/material';
import { Description as NoteIcon } from '@mui/icons-material';
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

const BatchInvoicesTab = ({ invoicePatients, selectedPatients, setSelectedPatients }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'none', overflowX: 'auto', width: '100%' }}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-head': headerCellSx }}>
            <TableCell sx={{ width: 44 }}>
              <Checkbox
                size="small"
                checked={invoicePatients.length > 0 && invoicePatients.every(p => selectedPatients[p.id])}
                indeterminate={invoicePatients.some(p => selectedPatients[p.id]) && !invoicePatients.every(p => selectedPatients[p.id])}
                onChange={(e) => {
                  const updated = {};
                  invoicePatients.forEach(p => { updated[p.id] = e.target.checked; });
                  setSelectedPatients(updated);
                }}
                sx={{ color: COLORS.BORDER, '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: COLORS.ACCENT }, p: 0 }}
              />
            </TableCell>
            <TableCell>PATIENT</TableCell>
            <TableCell>DOS</TableCell>
            <TableCell>CODE</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>PROVIDER</TableCell>
            <TableCell>NOTE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoicePatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, fontSize: fontSize.md, color: COLORS.TEXT_MUTED }}>
                No pending procedures for batch invoicing.
              </TableCell>
            </TableRow>
          ) : (
            invoicePatients.map((patient) =>
              patient.procedures.map((proc, procIdx) => {
                const isLastProc = procIdx === patient.procedures.length - 1;
                const rowBorderSx = {
                  borderBottom: isLastProc ? `1px solid ${COLORS.BORDER_VERY_LIGHT}` : 'none',
                };
                return (
                  <TableRow
                    key={`${patient.id}-${procIdx}`}
                    hover
                    sx={{ '&:hover': { backgroundColor: COLORS.SURFACE_HOVER }, transition: 'background-color 0.15s' }}
                  >
                    {procIdx === 0 && (
                      <TableCell
                        rowSpan={patient.procedures.length}
                        sx={{ verticalAlign: 'top', py: 1.5, borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`, width: 44 }}
                      >
                        <Checkbox
                          size="small"
                          checked={selectedPatients[patient.id] || false}
                          onChange={(e) => setSelectedPatients(prev => ({ ...prev, [patient.id]: e.target.checked }))}
                          sx={{ color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT }, p: 0 }}
                        />
                      </TableCell>
                    )}

                    {procIdx === 0 && (
                      <TableCell
                        rowSpan={patient.procedures.length}
                        sx={{ verticalAlign: 'top', py: 1.5, borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`, minWidth: '180px' }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                          <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.ACCENT, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                            {patient.name}
                          </Typography>
                          <Typography sx={{ fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>
                            ID: {patient.id}
                          </Typography>
                          {patient.primaryInsurance && (
                            <Typography sx={{ fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>
                              {patient.primaryInsurance}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    )}

                    <TableCell sx={{ py: 1.5, fontSize: fontSize.base, color: COLORS.TEXT_BODY, ...rowBorderSx }}>
                      {proc.dos}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, ...rowBorderSx }}>
                      {proc.code}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontSize: fontSize.base, color: COLORS.TEXT_BODY, ...rowBorderSx }}>
                      {proc.description}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontSize: fontSize.base, color: COLORS.TEXT_BODY, ...rowBorderSx }}>
                      {proc.provider}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, ...rowBorderSx }}>
                      {proc.hasNote && <NoteIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} />}
                    </TableCell>
                  </TableRow>
                );
              })
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BatchInvoicesTab;
