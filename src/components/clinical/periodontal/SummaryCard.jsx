import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const SummaryCard = ({ summaryData }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', height: '100%', minHeight: '219px', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Box sx={{ py: 1.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', fontSize: '12px' }}>SUMMARY</Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '12px' }}>Live metrics update as you chart</Typography>
      </Box>
      
      <Box sx={{ px: 3, pb: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <Table size="small" sx={{ 
            width: '100%',
            '& .MuiTableCell-root': { py: 0.5, borderBottom: '1px solid #f1f5f9' },
            '& tbody tr:last-of-type .MuiTableCell-root': { borderBottom: 'none' },
            borderCollapse: 'collapse',
            borderSpacing: 0
          }}>
            <TableHead sx={{ backgroundColor: '#F1F6FA', height: '32px' }}>
              <TableRow>
                <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', pl: { xs: 1, md: 2 }, width: { xs: 'auto', md: '120px' } }}>METRIC</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'center', px: 0.5 }}>BLEEDING</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'center', px: 0.5 }}>PROBING ≤ 4MM</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'center', px: 0.5 }}>PROBING 5MM</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'center', px: 0.5 }}>PROBING ≥ 6MM</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'right', pr: { xs: 1, md: 2 } }}>RECESSION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, idx) => {
                const isPercentage = row.label.includes('%');
                return (
                  <TableRow key={idx} sx={{ height: '31px' }}>
                    <TableCell sx={{ 
                      color: isPercentage ? '#334155' : '#64748b', 
                      fontSize: '11px', 
                      fontWeight: isPercentage ? 700 : 600, 
                      backgroundColor: 'rgba(241, 246, 250, 0.4)', 
                      pl: { xs: 1, md: 2 }
                    }}>
                      {row.label}
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', backgroundColor: '#ffffff', color: isPercentage ? '#0f172a' : '#334155', fontWeight: isPercentage ? 700 : 500, textAlign: 'center', px: 0.5 }}>{row.bleeding}</TableCell>
                    <TableCell sx={{ fontSize: '12px', backgroundColor: '#ffffff', color: isPercentage ? '#0f172a' : '#334155', fontWeight: isPercentage ? 700 : 500, textAlign: 'center', px: 0.5 }}>{row.p4}</TableCell>
                    <TableCell sx={{ fontSize: '12px', backgroundColor: '#ffffff', color: isPercentage ? '#0f172a' : '#334155', fontWeight: isPercentage ? 700 : 500, textAlign: 'center', px: 0.5 }}>{row.p5}</TableCell>
                    <TableCell sx={{ fontSize: '12px', backgroundColor: '#ffffff', color: isPercentage ? '#0f172a' : '#334155', fontWeight: isPercentage ? 700 : 500, textAlign: 'center', px: 0.5 }}>{row.p6}</TableCell>
                    <TableCell sx={{ fontSize: '12px', backgroundColor: '#ffffff', color: isPercentage ? '#0f172a' : '#334155', fontWeight: isPercentage ? 700 : 500, textAlign: 'right', pr: { xs: 1, md: 2 } }}>{row.recession}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default SummaryCard;
