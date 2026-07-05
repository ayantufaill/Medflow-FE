import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CircleIcon from '@mui/icons-material/Circle';

const getFlagColors = (idx) => {
  const colors = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
  return [colors[idx % colors.length]];
};

const AgingReportTable = ({ loading, reportData, hidePatientNames, agingBuckets, totals, setShowAccountNotes }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
      <TableContainer elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f8fafc', py: 1.5, borderBottom: '1px solid #e2e8f0' } }}>
              <TableCell padding="checkbox"><RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#cbd5e1' }} /></TableCell>
              <TableCell>Flags</TableCell>
              {!hidePatientNames && <TableCell>Patient Name</TableCell>}
              {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket}</TableCell>)}
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Total</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Total Owings</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Plan Owing</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Last Billed</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : reportData.map((row, idx) => (
              <React.Fragment key={idx}>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                  <TableCell padding="checkbox"><RadioButtonUncheckedIcon sx={{ fontSize: 20, color: '#cbd5e1' }} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {getFlagColors(idx).map((color, i) => (
                         <CircleIcon key={i} sx={{ fontSize: 12, color: color }} />
                      ))}
                    </Box>
                  </TableCell>
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
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>${row.paymentPlan.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>${row.credit.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{row.lastBilled || '07/15/2022'}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ display: 'flex', alignItems: 'center', color: '#3b82f6', cursor: 'pointer', gap: 0.5, whiteSpace: 'nowrap' }}
                      onClick={() => setShowAccountNotes(true)}
                    >
                      <NoteAddIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>add account note</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgingReportTable;
