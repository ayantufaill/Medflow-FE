import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const MOCK_MODIFICATIONS = [
  { action: 'Add', trans: 'pay #25197', proc: 'D0120', rendering: 'SAB', billing: 'SAB', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$31.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'pay #25197', proc: 'D0274', rendering: 'SAB', billing: 'SAB', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$35.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'pay #25197', proc: 'D1110', rendering: 'SAB', billing: 'SAB', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$53.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'pay #25200', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$99.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'adj #25199', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '-$96.00', debitAdj: '$0.00', collection: '$0.00', accountCredit: '$0.00' },
  { action: 'Void', trans: 'pay #25213', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '-$99.00', accountCredit: '$0.00' },
  { action: 'Void', trans: 'adj #25212', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '+$96.00', debitAdj: '$0.00', collection: '$0.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'dep #25208', proc: 'D1110', rendering: '', billing: '', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '$0.00', accountCredit: '+$9.90' },
];

const ModificationsReport = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', border: '1px solid #000' }}>
          <Box sx={{ px: 2, py: 0.5, borderRight: '1px solid #000', backgroundColor: '#f5f5f5' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>affected date:</Typography>
          </Box>
          <Box sx={{ px: 2, py: 0.5 }}>
            <Typography sx={{ fontSize: '0.8rem' }}>05/08/2026</Typography>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #000', borderRadius: 0 }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { border: '1px solid #000', px: 1, py: 0.5 } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Action</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>transaction #</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>procedures</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>rendering prov / internal code</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>billing prov / internal code</TableCell>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>production</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>collection</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>account credit</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>fees</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>credit adj</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>debit adj</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_MODIFICATIONS.map((row, index) => {
              const isAdd = row.action === 'Add';
              const isVoid = row.action === 'Void';
              const bgColor = isAdd ? '#e6f4ea' : isVoid ? '#fce8e6' : '#fff';
              const textColor = isAdd ? '#007b3e' : isVoid ? '#d93025' : '#000';
              const collectionColor = row.collection.startsWith('-') ? '#d93025' : row.collection.startsWith('+') ? '#007b3e' : '#000';

              return (
                <TableRow key={index} sx={{ backgroundColor: bgColor }}>
                  <TableCell sx={{ fontSize: '0.75rem', color: textColor, fontWeight: 600 }}>{row.action}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#0052cc', textDecoration: 'underline' }}>{row.trans}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.proc}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.rendering}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.billing}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.fees}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: row.creditAdj.startsWith('-') ? '#007b3e' : row.creditAdj.startsWith('+') ? '#d93025' : '#000' }}>{row.creditAdj}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.debitAdj}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: collectionColor }}>{row.collection}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: row.accountCredit.startsWith('+') ? '#007b3e' : '#000' }}>{row.accountCredit}</TableCell>
                </TableRow>
              );
            })}

            {/* Totals Rows */}
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell colSpan={5} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>totals modifications</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#d93025' }}>-$2,574.00</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#007b3e' }}>+$1,868.00</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#007b3e' }}>+$107.70</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell colSpan={3} sx={{ border: 'none' }}></TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', backgroundColor: '#f5f5f5' }}>net prod modification</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', backgroundColor: '#f5f5f5' }}>(prod + adj)</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', backgroundColor: '#f5f5f5', color: '#d93025' }}>-$2,466.30</TableCell>
              <TableCell colSpan={4} sx={{ border: 'none' }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ModificationsReport;
