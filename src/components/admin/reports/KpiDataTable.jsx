import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';

const commonCellSx = { 
  py: 1.5, 
  px: 2, 
  borderBottom: `1px solid ${COLORS.BORDER} !important`, 
  fontSize: fontSize.base,
  whiteSpace: 'nowrap'
};

const headerSx = {
  py: '10px',
  px: 2,
  fontFamily: 'Inter',
  fontSize: fontSize.sm,
  fontWeight: fontWeight.semibold,
  color: 'black',
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  borderBottom: `1px solid ${COLORS.BORDER} !important`,
  bgcolor: COLORS.SURFACE_CARD,
};

const KpiDataTable = ({ activeGroupsList, months, providerName }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {providerName && (
        <Box sx={{ mb: 2, pl: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: COLORS.TEXT_PRIMARY,
              fontWeight: fontWeight.bold,
            }}
          >
            {providerName} Dashboard
          </Typography>
        </Box>
      )}

      <TableContainer
        sx={{
          overflowX: 'auto',
          width: '100%',
          '@media print': {
            overflow: 'visible',
            boxShadow: 'none',
            '& th, & td': {
              position: 'static !important',
            }
          }
        }}
      >
        <Table size="small" sx={{ minWidth: 1200, borderCollapse: 'separate', borderSpacing: 0, '@media print': { minWidth: '100%' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, width: 260, position: 'sticky', left: 0, zIndex: 1 }}>
                Metrics
              </TableCell>
              {months.map((m, idx) => (
                <TableCell key={idx} align="right" sx={{ ...headerSx, minWidth: 90 }}>
                  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: 'black', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                    {m.label}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize.xs, color: COLORS.TEXT_MUTED, mt: 0.5 }}>
                    {m.year}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activeGroupsList.map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                <TableRow sx={{ bgcolor: COLORS.SURFACE_HOVER }}>
                  <TableCell 
                    sx={{ 
                      ...commonCellSx, 
                      py: 1, 
                      color: '#1A1A1A', 
                      fontWeight: 600, 
                      fontSize: '12px', 
                      textTransform: 'uppercase',
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      bgcolor: 'inherit'
                    }}
                  >
                    {group.title}
                  </TableCell>
                  <TableCell 
                    colSpan={months.length} 
                    sx={{ 
                      ...commonCellSx, 
                      py: 1 
                    }} 
                  />
                </TableRow>
                {group.rows.map((row, rowIdx) => (
                  <TableRow
                    key={rowIdx}
                    sx={{
                      bgcolor: COLORS.SURFACE_CARD,
                      '&:hover': { backgroundColor: '#F8FAFC' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell
                      sx={{
                        ...commonCellSx,
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        pl: 3,
                        zIndex: 0
                      }}
                    >
                      <InfoOutlinedIcon sx={{ fontSize: '16px', color: '#8898AA', cursor: 'pointer', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#4A4A4A', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {row.label}
                      </Typography>
                    </TableCell>
                    {row.values.map((val, valIdx) => (
                      <TableCell
                        key={valIdx}
                        align="right"
                        sx={{
                          ...commonCellSx,
                          color: '#1A1A1A',
                          fontWeight: 500
                        }}
                      >
                        {val !== '0' ? `$${val}` : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KpiDataTable;
