import { Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const TransactionTable = ({ transactions, outstandingBalance, showOutstandingBalance = true, showAmount = true, showBalance = true }) => {
  const textDarkBlue = '#40548e';
  const headerBlue = '#abb8d3';
  const rowLightBlue = '#f0f4fa';

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '8px', mb: 2, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: COLORS.SURFACE_TINT }}>
            <TableCell sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', borderBottom: `1px solid ${COLORS.BORDER}` }}>Date</TableCell>
            <TableCell sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', borderBottom: `1px solid ${COLORS.BORDER}` }}>Description</TableCell>
            <TableCell sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', borderBottom: `1px solid ${COLORS.BORDER}` }}>Provider</TableCell>
            {showAmount && (
              <TableCell sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', borderBottom: `1px solid ${COLORS.BORDER}` }}>Amount</TableCell>
            )}
            <TableCell sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', borderBottom: `1px solid ${COLORS.BORDER}` }}>Credit</TableCell>
            {showBalance && (
              <TableCell sx={{ color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semiBold, fontSize: '13px', borderBottom: `1px solid ${COLORS.BORDER}` }}>Balance</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} sx={{ bgcolor: transaction.bgcolor === '#f0f4fa' ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
              <TableCell sx={{ color: COLORS.TEXT_PRIMARY, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, fontSize: '13px' }}>{transaction.date}</TableCell>
              <TableCell sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                {transaction.descriptionSub ? (
                  <>
                    <Typography sx={{ fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>{transaction.description}</Typography>
                    <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '12px' }}>{transaction.descriptionSub}</Typography>
                  </>
                ) : (
                  <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>{transaction.description}</Typography>
                )}
              </TableCell>
              <TableCell sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                {transaction.provider ? (
                  <>
                    <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>{transaction.provider}</Typography>
                    {transaction.providerSub && (
                      <Typography variant="caption" sx={{ fontStyle: 'italic', color: COLORS.TEXT_SECONDARY, fontSize: '12px' }}>{transaction.providerSub}</Typography>
                    )}
                  </>
                ) : null}
              </TableCell>
              {showAmount && (
                <TableCell sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                  {transaction.amount ? (
                    <>
                      <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>{transaction.amount}</Typography>
                      {transaction.amountSub && (
                        <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '12px' }}>{transaction.amountSub}</Typography>
                      )}
                    </>
                  ) : null}
                </TableCell>
              )}
              <TableCell sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                {transaction.credit ? (
                  <>
                    <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>{transaction.credit}</Typography>
                    {transaction.creditSub && (
                      <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '12px' }}>{transaction.creditSub}</Typography>
                    )}
                  </>
                ) : null}
              </TableCell>
              {showBalance && (
                <TableCell sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                  <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px' }}>{transaction.balance}</Typography>
                </TableCell>
              )}
            </TableRow>
          ))}
          {/* Outstanding Balance Bar */}
          {showOutstandingBalance && (
            <TableRow 
              sx={{ 
                bgcolor: COLORS.SURFACE_TINT, 
                borderTop: `1px solid ${COLORS.BORDER}`
              }}
            >
              <TableCell 
                colSpan={showAmount && showBalance ? 5 : showAmount || showBalance ? 4 : 3} 
                align="right" 
                sx={{ 
                  fontWeight: fontWeight.semiBold, 
                  color: COLORS.TEXT_PRIMARY, 
                  fontSize: '14px',
                  py: 1.5,
                  border: 'none'
                }}
              >
                Outstanding Balance
              </TableCell>
              <TableCell 
                align="left" 
                sx={{ 
                  fontWeight: fontWeight.semiBold, 
                  color: COLORS.TEXT_PRIMARY, 
                  fontSize: '14px',
                  py: 1.5,
                  border: 'none',
                  pl: 2 
                }}
              >
                {outstandingBalance}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
