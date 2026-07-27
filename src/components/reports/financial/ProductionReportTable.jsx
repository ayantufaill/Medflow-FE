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
  TableFooter,
  Paper,
  Button,
  Grid,
  Tooltip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ProductionReportTable = ({
  sortedReportData,
  grouping,
  showFlags,
  showDOB = true,
  showProvider = true,
  handleExportGroupCSV,
  handlePrintGroup
}) => {
  const baseColSpan = 8;
  const leftOffset = baseColSpan - (!showDOB ? 1 : 0) - (!showProvider ? 2 : 0);
  const totalCols = 21 - (!showDOB ? 1 : 0) - (!showProvider ? 2 : 0);

  const totalCharge = sortedReportData.reduce((sum, row) => sum + (row.fee || row.charge || 0), 0);
  const totalAdj = sortedReportData.reduce((sum, row) => sum + (row.adj || 0), 0);
  const totalWriteOff = sortedReportData.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);
  const totalInsPay = sortedReportData.reduce((sum, row) => sum + (row.insPay || 0), 0);
  const totalPtPay = sortedReportData.reduce((sum, row) => sum + (row.ptPay || 0), 0);
  const totalActualWO = sortedReportData.reduce((sum, row) => sum + (row.actualWriteOff || 0), 0);
  const totalCollAdj = sortedReportData.reduce((sum, row) => sum + (row.collectionAdj || 0), 0);
  const totalPtRef = sortedReportData.reduce((sum, row) => sum + (row.ptRefund || 0), 0);
  const totalInsRef = sortedReportData.reduce((sum, row) => sum + (row.insRefund || 0), 0);
  const totalPayFromCred = sortedReportData.reduce((sum, row) => sum + (row.payFromCredit || 0), 0);
  const totalRefToCred = sortedReportData.reduce((sum, row) => sum + (row.refundToCredit || 0), 0);
  const totalCredit = sortedReportData.reduce((sum, row) => sum + (row.credit || 0), 0);
  const totalOverpay = sortedReportData.reduce((sum, row) => sum + (row.overpaymentToCredit || 0), 0);

  const netProduction = totalCharge + totalAdj - totalWriteOff;
  const seenPatients = new Set(sortedReportData.map(r => r.patient)).size;

  // Shared Styles for Theme Consistency
  const headerRowSx = { '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } };
  const bodyRowSx = { '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } };
  const footerRowSx = { backgroundColor: '#f8fafc', '& td': { fontWeight: 700, fontSize: '0.75rem', color: '#1e293b', borderTop: '2px solid #e2e8f0', py: 1.5 } };
  const borderLeftSx = { borderLeft: '1px solid #e2e8f0' };

  if (sortedReportData.length === 0) {
    return (
      <>
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
          <TableContainer elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }} id="production-report-table">
            <Table size="small" sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow sx={headerRowSx}>
                  <TableCell>Date</TableCell>
                  <TableCell>Flags</TableCell>
                  <TableCell>Patient</TableCell>
                  {showDOB && <TableCell>Date of Birth</TableCell>}
                  <TableCell>Code</TableCell>
                  <TableCell>Procedure</TableCell>
                  {showProvider && <TableCell align="center" colSpan={2} sx={borderLeftSx}>Provider / Internal Code</TableCell>}
                  <TableCell align="center" colSpan={3} sx={borderLeftSx}>Production</TableCell>
                  <TableCell align="center" colSpan={10} sx={borderLeftSx}>Collection</TableCell>
                </TableRow>
                <TableRow sx={headerRowSx}>
                  <TableCell colSpan={5 + (showDOB ? 1 : 0)}></TableCell>
                  {showProvider && (
                    <>
                      <TableCell align="center" sx={borderLeftSx}>Render</TableCell>
                      <TableCell align="center">Bill</TableCell>
                    </>
                  )}
                  <TableCell align="right" sx={borderLeftSx}>Procedure Charge</TableCell>
                  <TableCell align="right">Adj</TableCell>
                  <TableCell align="right">Estimate write off ⓘ</TableCell>
                  <TableCell align="right" sx={borderLeftSx}>Insurance Payment</TableCell>
                  <TableCell align="right">Patient Payment</TableCell>
                  <TableCell align="right">Actual Write-off ⓘ</TableCell>
                  <TableCell align="right">Adj ⓘ</TableCell>
                  <TableCell align="right">Pt. Refund ⓘ</TableCell>
                  <TableCell align="right">Ins. Refund ⓘ</TableCell>
                  <TableCell align="right">Pay From Credit ⓘ</TableCell>
                  <TableCell align="right">Refund To Credit ⓘ</TableCell>
                  <TableCell align="right">Credit (+/-) ⓘ</TableCell>
                  <TableCell align="right">Overpayment To Credit ⓘ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={totalCols} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#64748b' }}>No records found matching current criteria.</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Footer Summary */}
        <Box sx={{ mt: 3, px: 2, mb: 4, fontFamily: 'sans-serif' }} id="production-report-footer">
          <Grid container sx={{ justifyContent: 'center', gap: { xs: 4, md: 10 } }}>
            {/* Left Column */}
            <Grid item xs={12} md="auto">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 12px', fontSize: '11px' }}>
                <Box sx={{ color: '#1565c0' }}>Gross Production:</Box> 
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                  ${(totalCharge).toFixed(2)}
                  <Tooltip title="Total charge amount">
                    <InfoOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#888' }} />
                  </Tooltip>
                </Box>
                
                <Box sx={{ color: '#1565c0' }}>Net est. Production:</Box> 
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                  Total Charge + Adj(+/-) - Est Write Off = ${netProduction.toFixed(2)}
                  <Tooltip title="Total Charge + Adjustments - Estimated Write Off">
                    <InfoOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#888' }} />
                  </Tooltip>
                </Box>

                <Box sx={{ color: '#1565c0' }}>Number of Seen Patients:</Box> 
                <Box sx={{ color: '#333' }}>{seenPatients}</Box>

                <Box sx={{ color: '#1565c0' }}>Average Production Per Patient:</Box> 
                <Box sx={{ color: '#333' }}>${(seenPatients > 0 ? netProduction / seenPatients : 0).toFixed(2)}</Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md="auto">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 12px', fontSize: '11px' }}>
                {[
                  { label: 'Total Collection Incl. Pay From Credit:', val: totalPtPay + totalInsPay + totalPayFromCred },
                  { label: 'Total Collection Excl. Pay From Credit:', val: totalPtPay + totalInsPay },
                  { label: 'Collection From Credit:', val: totalPayFromCred },
                  { label: 'Total Prepayments:', val: 0 },
                  { label: 'Total Prepayments Excluding Refunds:', val: 0 },
                  { label: 'Actual Write-Off:', val: totalActualWO },
                  { label: 'Total Collection Adjustments:', val: totalCollAdj },
                  { label: 'Total Production Adjustments:', val: totalAdj },
                  { label: 'Adjusted Collection Incl. Pay From Credit:', val: totalPtPay + totalInsPay + totalPayFromCred + totalCollAdj },
                  { label: 'Adjusted Collection Excl. Pay From Credit:', val: totalPtPay + totalInsPay + totalCollAdj },
                  { label: 'Total Patient Refund:', val: totalPtRef },
                  { label: 'Total Insurance Refund:', val: totalInsRef },
                  { label: 'Total Overpayment to Credit:', val: totalOverpay },
                  { label: 'Total Deposit Slip:', val: totalPtPay + totalInsPay },
                  { label: 'Total Patient Income:', val: totalPtPay },
                  { label: 'Total Insurance Income:', val: totalInsPay },
                  { label: 'Total Adjustments:', val: totalAdj },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Box sx={{ color: '#1565c0', textAlign: 'left' }}>{item.label}</Box> 
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                      {item.val < 0 ? '-' : ''}${Math.abs(item.val).toFixed(2)}
                      <Tooltip title={item.label.replace(':', '')}>
                        <InfoOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#888' }} />
                      </Tooltip>
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Collection Percentage Centered Bottom */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: '8px', fontSize: '11px', whiteSpace: 'nowrap' }}>
              <Box sx={{ color: '#1565c0' }}>Collection Percentage:</Box> 
              <Box sx={{ color: '#333' }}>
                (Total Collection + Collection Adjustment) / Net est. Production * 100 = {netProduction !== 0 ? (((totalPtPay + totalInsPay + totalCollAdj) / netProduction) * 100).toFixed(2) : '0.00'}%
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      {grouping === 'group-provider' ? (
        <Box id="production-report-table">
          {(() => {
            const groups = {};
            sortedReportData.forEach(row => {
              const prov = row.provider || 'Unassigned';
              if (!groups[prov]) groups[prov] = [];
              groups[prov].push(row);
            });

            return Object.keys(groups).map((provName) => {
              const groupRows = groups[provName];
              const grpCharge = groupRows.reduce((sum, row) => sum + (row.fee || row.charge || 0), 0);
              const grpAdj = groupRows.reduce((sum, row) => sum + (row.adj || 0), 0);
              const grpWriteOff = groupRows.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);
              const grpInsPay = groupRows.reduce((sum, row) => sum + (row.insPay || 0), 0);
              const grpPtPay = groupRows.reduce((sum, row) => sum + (row.ptPay || 0), 0);
              const grpActualWO = groupRows.reduce((sum, row) => sum + (row.actualWriteOff || 0), 0);
              const grpCollAdj = groupRows.reduce((sum, row) => sum + (row.collectionAdj || 0), 0);
              const grpPtRef = groupRows.reduce((sum, row) => sum + (row.ptRefund || 0), 0);
              const grpInsRef = groupRows.reduce((sum, row) => sum + (row.insRefund || 0), 0);
              const grpPayFromCred = groupRows.reduce((sum, row) => sum + (row.payFromCredit || 0), 0);
              const grpRefToCred = groupRows.reduce((sum, row) => sum + (row.refundToCredit || 0), 0);
              const grpCredit = groupRows.reduce((sum, row) => sum + (row.credit || 0), 0);
              const grpOverpay = groupRows.reduce((sum, row) => sum + (row.overpaymentToCredit || 0), 0);
              const tableId = `production-report-table-${provName.replace(/\s+/g, '-')}`;

              return (
                <Box key={provName} sx={{ mb: 4, mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
                      Provider: {provName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleExportGroupCSV(provName, groupRows)} 
                        startIcon={<FileDownloadIcon />} 
                        sx={{ textTransform: 'none', py: 0.25, fontSize: '0.65rem', height: 24 }}
                      >
                        Export CSV
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handlePrintGroup(tableId, provName)} 
                        startIcon={<PrintIcon />} 
                        sx={{ textTransform: 'none', py: 0.25, fontSize: '0.65rem', height: 24 }}
                      >
                        Print
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <TableContainer elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }} id={tableId}>
                      <Table size="small" sx={{ minWidth: 1200 }}>
                        <TableHead>
                          <TableRow sx={headerRowSx}>
                            <TableCell>Date</TableCell>
                            <TableCell>Flags</TableCell>
                            <TableCell>Patient</TableCell>
                            {showDOB && <TableCell>Date of Birth</TableCell>}
                            <TableCell>Code</TableCell>
                            <TableCell>Procedure</TableCell>
                            {showProvider && <TableCell align="center" colSpan={2} sx={borderLeftSx}>Provider / Internal Code</TableCell>}
                            <TableCell align="center" colSpan={3} sx={borderLeftSx}>Production</TableCell>
                            <TableCell align="center" colSpan={10} sx={borderLeftSx}>Collection</TableCell>
                          </TableRow>
                          <TableRow sx={headerRowSx}>
                            <TableCell colSpan={5 + (showDOB ? 1 : 0)}></TableCell>
                            {showProvider && (
                              <>
                                <TableCell align="center" sx={borderLeftSx}>Render</TableCell>
                                <TableCell align="center">Bill</TableCell>
                              </>
                            )}
                            <TableCell align="right" sx={borderLeftSx}>Procedure Charge</TableCell>
                            <TableCell align="right">Adj</TableCell>
                            <TableCell align="right">Estimate write off ⓘ</TableCell>
                            <TableCell align="right" sx={borderLeftSx}>Insurance Payment</TableCell>
                            <TableCell align="right">Patient Payment</TableCell>
                            <TableCell align="right">Actual Write-off ⓘ</TableCell>
                            <TableCell align="right">Adj ⓘ</TableCell>
                            <TableCell align="right">Pt. Refund ⓘ</TableCell>
                            <TableCell align="right">Ins. Refund ⓘ</TableCell>
                            <TableCell align="right">Pay From Credit ⓘ</TableCell>
                            <TableCell align="right">Refund To Credit ⓘ</TableCell>
                            <TableCell align="right">Credit (+/-) ⓘ</TableCell>
                            <TableCell align="right">Overpayment To Credit ⓘ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupRows.map((row, idx) => (
                            <TableRow key={row.procedureId || idx} sx={bodyRowSx}>
                              <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                              <TableCell>
                                {showFlags && row.flags && row.flags.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                    {row.flags.map((color, i) => (
                                      <Box key={i} sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: color, flexShrink: 0 }} />
                                    ))}
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell sx={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>{row.patient || 'Mock Patient'}</TableCell>
                              {showDOB && <TableCell>{row.dob || '-'}</TableCell>}
                              <TableCell>{row.code || 'D0120'}</TableCell>
                              <TableCell>{row.procedure || 'Periodic Exam'}</TableCell>
                              {showProvider && (
                                <>
                                  <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                                  <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                                </>
                              )}
                              <TableCell align="right">${(row.fee || row.charge || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.adj || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.estWriteOff || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.insPay || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.ptPay || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.actualWriteOff || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.collectionAdj || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.ptRefund || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.insRefund || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.payFromCredit || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.refundToCredit || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.credit || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${(row.overpaymentToCredit || 0).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow sx={footerRowSx}>
                            <TableCell colSpan={leftOffset} align="right">Subtotal ({provName}):</TableCell>
                            <TableCell align="right">${grpCharge.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpAdj.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpWriteOff.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpInsPay.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpPtPay.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpActualWO.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpCollAdj.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpPtRef.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpInsRef.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpPayFromCred.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpRefToCred.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpCredit.toFixed(2)}</TableCell>
                            <TableCell align="right">${grpOverpay.toFixed(2)}</TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              );
            });
          })()}
        </Box>
      ) : (
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
          <TableContainer elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }} id="production-report-table">
            <Table size="small" sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow sx={headerRowSx}>
                  <TableCell>Date</TableCell>
                  <TableCell>Flags</TableCell>
                  <TableCell>Patient</TableCell>
                  {showDOB && <TableCell>Date of Birth</TableCell>}
                  <TableCell>Code</TableCell>
                  <TableCell>Procedure</TableCell>
                  {showProvider && <TableCell align="center" colSpan={2} sx={borderLeftSx}>Provider / Internal Code</TableCell>}
                  <TableCell align="center" colSpan={3} sx={borderLeftSx}>Production</TableCell>
                  <TableCell align="center" colSpan={10} sx={borderLeftSx}>Collection</TableCell>
                </TableRow>
                <TableRow sx={headerRowSx}>
                  <TableCell colSpan={3 + (showDOB ? 1 : 0) + 2}></TableCell>
                  {showProvider && (
                    <>
                      <TableCell align="center" sx={borderLeftSx}>Render</TableCell>
                      <TableCell align="center">Bill</TableCell>
                    </>
                  )}
                  <TableCell align="right" sx={borderLeftSx}>Procedure Charge</TableCell>
                  <TableCell align="right">Adj</TableCell>
                  <TableCell align="right">Estimate write off ⓘ</TableCell>
                  <TableCell align="right" sx={borderLeftSx}>Insurance Payment</TableCell>
                  <TableCell align="right">Patient Payment</TableCell>
                  <TableCell align="right">Actual Write-off ⓘ</TableCell>
                  <TableCell align="right">Adj ⓘ</TableCell>
                  <TableCell align="right">Pt. Refund ⓘ</TableCell>
                  <TableCell align="right">Ins. Refund ⓘ</TableCell>
                  <TableCell align="right">Pay From Credit ⓘ</TableCell>
                  <TableCell align="right">Refund To Credit ⓘ</TableCell>
                  <TableCell align="right">Credit (+/-) ⓘ</TableCell>
                  <TableCell align="right">Overpayment To Credit ⓘ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedReportData.map((row, idx) => (
                  <TableRow key={row.procedureId || idx} sx={bodyRowSx}>
                    <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      {showFlags && row.flags && row.flags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          {row.flags.map((color, i) => (
                            <Box key={i} sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: color, flexShrink: 0 }} />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>{row.patient || 'Mock Patient'}</TableCell>
                    {showDOB && <TableCell>{row.dob || '-'}</TableCell>}
                    <TableCell>{row.code || 'D0120'}</TableCell>
                    <TableCell>{row.procedure || 'Periodic Exam'}</TableCell>
                    {showProvider && (
                      <>
                        <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                        <TableCell align="center">{row.provider || 'SAB'}</TableCell>
                      </>
                    )}
                    <TableCell align="right">${(row.fee || row.charge || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.adj || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.estWriteOff || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.insPay || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.ptPay || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.actualWriteOff || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.collectionAdj || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.ptRefund || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.insRefund || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.payFromCredit || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.refundToCredit || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.credit || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${(row.overpaymentToCredit || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow sx={footerRowSx}>
                  <TableCell colSpan={leftOffset} align="right">Total:</TableCell>
                  <TableCell align="right">${totalCharge.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalAdj.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalWriteOff.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalInsPay.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalPtPay.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalActualWO.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalCollAdj.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalPtRef.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalInsRef.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalPayFromCred.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalRefToCred.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalCredit.toFixed(2)}</TableCell>
                  <TableCell align="right">${totalOverpay.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      )}

        {/* Footer Summary */}
        <Box sx={{ mt: 3, px: 2, mb: 4, fontFamily: 'sans-serif' }} id="production-report-footer">
          <Grid container sx={{ justifyContent: 'center', gap: { xs: 4, md: 10 } }}>
            {/* Left Column */}
            <Grid item xs={12} md="auto">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 12px', fontSize: '11px' }}>
                <Box sx={{ color: '#1565c0' }}>Gross Production:</Box> 
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                  ${(totalCharge).toFixed(2)}
                  <Tooltip title="Total charge amount">
                    <InfoOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#888' }} />
                  </Tooltip>
                </Box>
                
                <Box sx={{ color: '#1565c0' }}>Net est. Production:</Box> 
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                  Total Charge + Adj(+/-) - Est Write Off = ${netProduction.toFixed(2)}
                  <Tooltip title="Total Charge + Adjustments - Estimated Write Off">
                    <InfoOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#888' }} />
                  </Tooltip>
                </Box>

                <Box sx={{ color: '#1565c0' }}>Number of Seen Patients:</Box> 
                <Box sx={{ color: '#333' }}>{seenPatients}</Box>

                <Box sx={{ color: '#1565c0' }}>Average Production Per Patient:</Box> 
                <Box sx={{ color: '#333' }}>${(seenPatients > 0 ? netProduction / seenPatients : 0).toFixed(2)}</Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md="auto">
              <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 12px', fontSize: '11px' }}>
                {[
                  { label: 'Total Collection Incl. Pay From Credit:', val: totalPtPay + totalInsPay + totalPayFromCred },
                  { label: 'Total Collection Excl. Pay From Credit:', val: totalPtPay + totalInsPay },
                  { label: 'Collection From Credit:', val: totalPayFromCred },
                  { label: 'Total Prepayments:', val: 0 },
                  { label: 'Total Prepayments Excluding Refunds:', val: 0 },
                  { label: 'Actual Write-Off:', val: totalActualWO },
                  { label: 'Total Collection Adjustments:', val: totalCollAdj },
                  { label: 'Total Production Adjustments:', val: totalAdj },
                  { label: 'Adjusted Collection Incl. Pay From Credit:', val: totalPtPay + totalInsPay + totalPayFromCred + totalCollAdj },
                  { label: 'Adjusted Collection Excl. Pay From Credit:', val: totalPtPay + totalInsPay + totalCollAdj },
                  { label: 'Total Patient Refund:', val: totalPtRef },
                  { label: 'Total Insurance Refund:', val: totalInsRef },
                  { label: 'Total Overpayment to Credit:', val: totalOverpay },
                  { label: 'Total Deposit Slip:', val: totalPtPay + totalInsPay },
                  { label: 'Total Patient Income:', val: totalPtPay },
                  { label: 'Total Insurance Income:', val: totalInsPay },
                  { label: 'Total Adjustments:', val: totalAdj },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Box sx={{ color: '#1565c0', textAlign: 'left' }}>{item.label}</Box> 
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#333' }}>
                      {item.val < 0 ? '-' : ''}${Math.abs(item.val).toFixed(2)}
                      <Tooltip title={item.label.replace(':', '')}>
                        <InfoOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#888' }} />
                      </Tooltip>
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Collection Percentage Centered Bottom */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: '8px', fontSize: '11px', whiteSpace: 'nowrap' }}>
              <Box sx={{ color: '#1565c0' }}>Collection Percentage:</Box> 
              <Box sx={{ color: '#333' }}>
                (Total Collection + Collection Adjustment) / Net est. Production * 100 = {netProduction !== 0 ? (((totalPtPay + totalInsPay + totalCollAdj) / netProduction) * 100).toFixed(2) : '0.00'}%
              </Box>
            </Box>
          </Box>
        </Box>
    </>
  );
};

export default ProductionReportTable;