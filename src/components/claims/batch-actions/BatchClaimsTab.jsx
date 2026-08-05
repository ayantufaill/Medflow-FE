import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Checkbox, Collapse
} from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const headerCellSx = {
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

const BatchClaimsTab = ({ filteredClaimsList, selectedClaims, setSelectedClaims }) => {
  const [expandedId, setExpandedId] = React.useState(null);

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', backgroundColor: 'transparent' }}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-head': headerCellSx }}>
            <TableCell sx={{ width: 44 }}>
              <Checkbox
                size="small"
                checked={filteredClaimsList.length > 0 && filteredClaimsList.every(c => selectedClaims[c.id])}
                indeterminate={filteredClaimsList.some(c => selectedClaims[c.id]) && !filteredClaimsList.every(c => selectedClaims[c.id])}
                onChange={(e) => {
                  const updated = {};
                  filteredClaimsList.forEach(c => { updated[c.id] = e.target.checked; });
                  setSelectedClaims(updated);
                }}
                sx={{ color: COLORS.BORDER, '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: COLORS.ACCENT }, p: 0 }}
              />
            </TableCell>
            <TableCell>PATIENT</TableCell>
            <TableCell>INVOICE #</TableCell>
            <TableCell>CLAIM TYPE</TableCell>
            <TableCell>CARRIER</TableCell>
            <TableCell>PLAN NAME</TableCell>
            <TableCell>TOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredClaimsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, fontSize: fontSize.md, color: COLORS.TEXT_MUTED }}>
                No pending claims found.
              </TableCell>
            </TableRow>
          ) : (
            filteredClaimsList.map((claim) => {
              const claimTotal = (claim.procedures || []).reduce((sum, p) => sum + (Number(p.fee) || 0), 0);
              const isExpanded = expandedId === claim.id;
              return (
                <React.Fragment key={claim.id}>
                  <TableRow
                    hover
                    onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                    sx={{
                      cursor: 'pointer',
                      '& .MuiTableCell-body': { borderBottom: isExpanded ? 'none' : `1px solid ${COLORS.BORDER_VERY_LIGHT}` },
                      '&:hover': { backgroundColor: COLORS.SURFACE_HOVER },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }} onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        size="small"
                        checked={selectedClaims[claim.id] || false}
                        onChange={(e) => setSelectedClaims(prev => ({ ...prev, [claim.id]: e.target.checked }))}
                        sx={{ color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT }, p: 0 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                        {claim.patient}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, fontFamily: 'monospace' }}>
                        {claim.invoiceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
                        {claim.claimType}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                        {claim.carrier}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
                        {claim.planName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                        ${claimTotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* Collapsible procedure details */}
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, borderBottom: isExpanded ? `1px solid ${COLORS.BORDER_VERY_LIGHT}` : 'none' }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, py: 2, backgroundColor: COLORS.SURFACE_HOVER, borderLeft: `3px solid ${COLORS.ACCENT}` }}>
                          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, letterSpacing: '0.4px', textTransform: 'uppercase', mb: 1 }}>
                            Procedure Details
                          </Typography>
                          <Table size="small" sx={{ maxWidth: 600 }}>
                            <TableHead>
                              <TableRow>
                                {['DOS', 'Code', 'Description', 'Fee'].map(h => (
                                  <TableCell key={h} sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, py: 0.75, borderBottom: `1px solid ${COLORS.BORDER}` }}>
                                    {h}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(claim.procedures || []).map((p, idx) => (
                                <TableRow key={idx}>
                                  <TableCell sx={{ fontSize: fontSize.xs, py: 0.75, color: COLORS.TEXT_BODY, borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>{p.dos || '—'}</TableCell>
                                  <TableCell sx={{ fontSize: fontSize.xs, py: 0.75, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>{p.code || '—'}</TableCell>
                                  <TableCell sx={{ fontSize: fontSize.xs, py: 0.75, color: COLORS.TEXT_BODY, borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>{p.description || '—'}</TableCell>
                                  <TableCell sx={{ fontSize: fontSize.xs, py: 0.75, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>${Number(p.fee || 0).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BatchClaimsTab;
