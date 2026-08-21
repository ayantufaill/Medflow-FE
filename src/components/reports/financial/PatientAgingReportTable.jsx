import React from 'react';
import {
  Box, Typography, Checkbox, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TableFooter, Paper, Tooltip
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPracticeInfo } from '../../../store/slices/practiceInfoSlice';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

const getFlagColors = (idx) => {
  const colors = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
  return [colors[idx % colors.length]];
};

const PatientAgingReportTable = ({ tableId = "patient-aging-table", loading, reportData, agingBuckets, hidePatientNames, totals, showFlags, showPaymentPlan }) => {
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];

  const resolveFlagColor = (flagVal) => {
    const found = globalFlags.find(f => f.id === flagVal);
    if (found) return { color: found.color, name: found.name };
    return { color: flagVal, name: 'Flag' };
  };

  const firstColSpan = 1 + (showFlags ? 1 : 0) + (hidePatientNames ? 0 : 1); // Checkbox + Flags + Patient Name
  const rightColSpan = 4 + (showPaymentPlan ? 1 : 0); // Owings + PaymentPlan + Credit + Billed + Notes
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table id={tableId} size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1 } }}>
            <TableCell padding="checkbox" sx={{ width: '40px' }}><Checkbox size="small" /></TableCell>
            {showFlags && <TableCell sx={{ width: '60px' }}>Flags</TableCell>}
            {!hidePatientNames && <TableCell sx={{ minWidth: '140px', width: '15%' }}>Patient Name</TableCell>}
            {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket.replace(/ days?/gi, '')}</TableCell>)}
            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Total</TableCell>
            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Total Owings</TableCell>
            {showPaymentPlan && <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Plan Owing</TableCell>}
            <TableCell align="right">Credit</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>Last Billed</TableCell>
            <TableCell className="no-print">Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={15} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">Loading...</Typography>
              </TableCell>
            </TableRow>
          ) : reportData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={15} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>No data available</Typography>
              </TableCell>
            </TableRow>
          ) : (
            reportData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5, verticalAlign: 'top' } }}>
                <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                {showFlags && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {(row.flags && row.flags.length > 0 ? row.flags : getFlagColors(idx)).map((flagVal, i) => {
                        const { color, name } = resolveFlagColor(flagVal);
                        return (
                          <Tooltip key={i} title={name} arrow placement="top">
                            <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: color, flexShrink: 0, cursor: 'pointer' }} />
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </TableCell>
                )}
                {!hidePatientNames && (
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem' }}>👤</Typography>
                      </Box>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer' }}>
                        {row.name}
                      </Typography>
                    </Box>
                  </TableCell>
                )}
                {agingBuckets.map(bucket => (
                  <TableCell key={bucket} align="right">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '60px' }}>
                      <Typography variant="caption" sx={{ display: 'block' }}>Pt. ${(row.buckets[bucket]?.pt || 0).toFixed(2)}</Typography>
                    </Box>
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Typography variant="caption" sx={{ display: 'block' }}>${row.total.toFixed(2)}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>${row.totalOwings.toFixed(2)}</TableCell>
                {showPaymentPlan && <TableCell align="right">${row.paymentPlan.toFixed(2)}</TableCell>}
                <TableCell align="right">${row.credit.toFixed(2)}</TableCell>
                <TableCell>{row.lastBilled}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', cursor: 'pointer' }}>
                    <NoteAddOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    <Typography variant="caption">add account note</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {totals && (
          <TableFooter>
            {/* Footer Row 1: Headers */}
            <TableRow sx={{ '& td, & th': { fontSize: '0.75rem', border: 'none', py: 1, borderTop: '2px solid #e0e0e0' } }}>
              <TableCell colSpan={firstColSpan} sx={{ fontWeight: 600 }}>  </TableCell>
              {agingBuckets.map((bucket) => (
                <TableCell key={bucket} align="right" sx={{ fontWeight: 600 }}>
                  {bucket.replace(/ days?/i, '')}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 2: Total Outstanding Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Outstanding Balances
              </TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right">
                  ${(totals.buckets[bucket]?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${(totals.totalOutstanding || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 3: Total Patients Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Patients Balances
              </TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right">
                  ${(totals.buckets[bucket]?.pt || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${(totals.totalPt || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 4: Total Insurance Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Insurance Balances
              </TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right">
                  ${(totals.buckets[bucket]?.ins || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${(totals.totalIns || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 5: Total Account Credit */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Account Credit
              </TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                ${(totals.totalCredit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 6: Net Outstanding Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Net Outstanding Balances<br/>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 400 }}>(Total Outstanding - Total Account Credit)</Typography>
              </TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>
                ${Math.max(0, totals.totalOutstanding - totals.totalCredit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default PatientAgingReportTable;
