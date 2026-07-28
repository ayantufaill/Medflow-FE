import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Checkbox, Tooltip } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const getFlagColors = (idx) => {
  const defaultFlags = [
    { color: '#22c55e', name: 'Send appointment reminder earlier' },
    { color: '#f59e0b', name: 'Alert' },
    { color: '#ef4444', name: 'Late Payment' },
    { color: '#3b82f6', name: 'Needs special care' },
    { color: '#8b5cf6', name: 'Old Patient' }
  ];
  
  // Return 1 or 2 flags deterministically based on idx
  const flagsCount = (idx % 2) + 1;
  const result = [];
  for(let i = 0; i < flagsCount; i++) {
    result.push(defaultFlags[(idx + i) % defaultFlags.length]);
  }
  return result;
};

const AgingReportTable = ({ tableId = "aging-report-table", loading, reportData, hidePatientNames, agingBuckets, totals, showFlags, showPaymentPlan, setSelectedPatientForNotes, selectedNames = [], setSelectedNames }) => {
  const firstColSpan = 1 + (showFlags ? 1 : 0) + (!hidePatientNames ? 1 : 0);
  const rightColSpan = 4 + (showPaymentPlan ? 1 : 0);
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedNames(reportData.map((row) => row.name));
    } else {
      setSelectedNames([]);
    }
  };

  const handleSelectRow = (event, name) => {
    if (event.target.checked) {
      setSelectedNames((prev) => [...prev, name]);
    } else {
      setSelectedNames((prev) => prev.filter((n) => n !== name));
    }
  };
  
  const isAllSelected = reportData.length > 0 && selectedNames.length === reportData.length;
  const isIndeterminate = selectedNames.length > 0 && selectedNames.length < reportData.length;
  
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer elevation={0} sx={{ overflowX: 'auto' }}>
        <Table id={tableId} size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0' } }}>
              <TableCell padding="checkbox" sx={{ width: '40px' }}>
                <Checkbox 
                  size="small"
                  sx={{ p: 0 }}
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {showFlags && <TableCell sx={{ width: '60px' }}>Flags</TableCell>}
              {!hidePatientNames && <TableCell sx={{ minWidth: '140px', width: '15%' }}>Patient Name</TableCell>}
              {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket.replace(/ days?/i, '')}</TableCell>)}
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
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
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
                <React.Fragment key={idx}>
                  <TableRow sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                    <TableCell padding="checkbox">
                      <Checkbox 
                        size="small"
                        sx={{ p: 0 }}
                        checked={selectedNames.includes(row.name)}
                        onChange={(e) => handleSelectRow(e, row.name)}
                      />
                    </TableCell>
                    {showFlags && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
                          {(() => {
                            let flagsToRender = row.flags && row.flags.length > 0 ? row.flags : getFlagColors(idx);
                            
                            // If it's a string, split it (just in case backend sends comma separated)
                            if (typeof flagsToRender === 'string') {
                              flagsToRender = flagsToRender.split(',').map(s => s.trim()).filter(Boolean);
                            }
                            
                            return (Array.isArray(flagsToRender) ? flagsToRender : []).map((flagObj, i) => {
                              let flagColor = '#3b82f6';
                              let flagName = 'Flag';
                              
                              if (typeof flagObj === 'string') {
                                flagColor = flagObj;
                                flagName = `Flag`;
                              } else if (flagObj) {
                                flagColor = flagObj.color || flagColor;
                                flagName = flagObj.name || flagName;
                              }
                              
                              return (
                                <Tooltip key={i} title={flagName} arrow placement="top">
                                  <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: flagColor, flexShrink: 0, cursor: 'help' }} />
                                </Tooltip>
                              );
                            });
                          })()}
                        </Box>
                      </TableCell>
                    )}
                    {!hidePatientNames && (
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', color: '#3b82f6' }}>{row.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                            (Delta Dental Ins. Co. - Utah + Delta Dental of Arkansas)
                          </Typography>
                        </Box>
                      </TableCell>
                    )}
                    {agingBuckets.map(bucket => (
                      <TableCell key={bucket} align="right">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '60px' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: '100%' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Pt</Typography>
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>${row.buckets[bucket].pt.toFixed(2)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: '100%' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Ins</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>${row.buckets[bucket].ins.toFixed(2)}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#1e293b' }}>${row.total.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#1e293b' }}>${row.totalOwings.toFixed(2)}</TableCell>
                    {showPaymentPlan && <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>${row.paymentPlan.toFixed(2)}</TableCell>}
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>${row.credit.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{row.lastBilled || '07/15/2022'}</TableCell>
                    <TableCell className="no-print">
                      <Box 
                        sx={{ display: 'flex', alignItems: 'center', color: '#3b82f6', cursor: 'pointer', gap: 0.5, whiteSpace: 'nowrap' }}
                        onClick={() => setSelectedPatientForNotes(row)}
                      >
                        <NoteAddIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>add account note</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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
              {agingBuckets.map((bucket) => (
                <TableCell key={bucket} align="right">
                  ${totals.buckets[bucket]?.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalOutstanding?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 3: Total Patients Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Patients Balances
              </TableCell>
              {agingBuckets.map((bucket) => (
                <TableCell key={bucket} align="right">
                  ${totals.buckets[bucket]?.pt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalPt?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 4: Total Insurance Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Insurance Balances
              </TableCell>
              {agingBuckets.map((bucket) => (
                <TableCell key={bucket} align="right">
                  ${totals.buckets[bucket]?.ins.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalIns?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 5: Total Account Credit */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Total Account Credit
              </TableCell>
              {agingBuckets.map((bucket) => (
                <TableCell key={bucket} />
              ))}
              <TableCell align="right" />
              <TableCell colSpan={2} />
              <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                ${totals.totalCredit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </TableCell>
              <TableCell colSpan={1} />
              <TableCell className="no-print" />
            </TableRow>

            {/* Footer Row 6: Net Outstanding Balances */}
            <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none', pb: 2 } }}>
              <TableCell colSpan={firstColSpan} sx={{ color: '#555', fontWeight: 600 }}>
                Net Outstanding Balances<br/>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 400 }}>(Total Outstanding - Total Account Credit)</Typography>
              </TableCell>
              {agingBuckets.map((bucket) => (
                <TableCell key={bucket} />
              ))}
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>
                ${Math.max(0, (totals.totalOutstanding || 0) - (totals.totalCredit || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell colSpan={rightColSpan - 1} />
              <TableCell className="no-print" />
            </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgingReportTable;
