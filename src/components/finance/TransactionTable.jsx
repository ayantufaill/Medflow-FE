import React from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';

const TransactionTable = ({ transactions, outstandingBalance }) => {
  const textDarkBlue = '#40548e';
  const headerBlue = '#abb8d3';
  const rowLightBlue = '#f0f4fa';

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: headerBlue }}>
            {['Date', 'Description', 'Provider', 'Amount', 'Credit', 'Balance'].map((head) => (
              <TableCell key={head} sx={{ color: textDarkBlue, fontWeight: fontWeight.bold, fontSize: fontSize.sm, border: 'none' }}>{head}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} sx={{ bgcolor: transaction.bgcolor }}>
              <TableCell sx={{ color: textDarkBlue, border: 'none', fontSize: fontSize.sm }}>{transaction.date}</TableCell>
              <TableCell sx={{ border: 'none' }}>
                {transaction.descriptionSub ? (
                  <>
                    <Typography sx={{ fontWeight: fontWeight.bold, color: textDarkBlue, fontSize: fontSize.sm }}>{transaction.description}</Typography>
                    <Typography variant="caption" sx={{ color: textDarkBlue, fontSize: fontSize.xs }}>{transaction.descriptionSub}</Typography>
                  </>
                ) : (
                  <Typography sx={{ color: textDarkBlue, fontSize: fontSize.sm }}>{transaction.description}</Typography>
                )}
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                {transaction.provider ? (
                  <>
                    <Typography sx={{ color: textDarkBlue, fontSize: fontSize.sm }}>{transaction.provider}</Typography>
                    {transaction.providerSub && (
                      <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#888', fontSize: fontSize.xs }}>{transaction.providerSub}</Typography>
                    )}
                  </>
                ) : null}
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                {transaction.amount ? (
                  <>
                    <Typography sx={{ color: textDarkBlue, fontSize: fontSize.sm }}>{transaction.amount}</Typography>
                    {transaction.amountSub && (
                      <Typography variant="caption" sx={{ color: '#999', fontSize: fontSize.xs }}>{transaction.amountSub}</Typography>
                    )}
                  </>
                ) : null}
              </TableCell>
              <TableCell sx={{ color: textDarkBlue, border: 'none', fontSize: fontSize.sm }}>{transaction.credit}</TableCell>
              <TableCell sx={{ color: textDarkBlue, border: 'none', fontSize: fontSize.sm }}>{transaction.balance}</TableCell>
            </TableRow>
          ))}
          {/* Outstanding Balance Bar */}
          <TableRow 
            sx={{ 
              bgcolor: headerBlue, 
              borderTop: '2px solid rgba(0,0,0,0.05)', 
            }}
          >
            <TableCell 
              colSpan={5} 
              align="right" 
              sx={{ 
                fontWeight: fontWeight.bold, 
                color: textDarkBlue, 
                fontSize: fontSize.lg,
                py: 1.5,
                border: 'none'
              }}
            >
              Outstanding Balance
            </TableCell>
            <TableCell 
              align="left" 
              sx={{ 
                fontWeight: fontWeight.bold, 
                color: textDarkBlue, 
                fontSize: fontSize.lg,
                py: 1.5,
                border: 'none',
                pl: 2 
              }}
            >
              {outstandingBalance}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
