import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const RecareListTable = ({ rows = [] }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <TableContainer elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f8fafc', py: 1.5, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' } }}>
              <TableCell>Patient</TableCell>
              <TableCell align="center">Flags</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Recall Date</TableCell>
              <TableCell>Last Exam</TableCell>
              <TableCell>Last Prophy</TableCell>
              <TableCell>Last Main.</TableCell>
              <TableCell>Last Comm.</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Contact Again</TableCell>
              <TableCell>Follow up</TableCell>
              <TableCell>Appt Date</TableCell>
              <TableCell align="center">Count</TableCell>
              <TableCell align="center">Reset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'top', borderBottom: '1px solid #e2e8f0', color: '#1e293b', fontWeight: 600 } }}>
                <TableCell sx={{ color: '#1e293b', fontWeight: 700 }}>{row.patient}</TableCell>
                <TableCell align="center">
                  {row.flags === 'red' && <CircleIcon sx={{ fontSize: 10, color: '#ef4444' }} />}
                </TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell sx={{ color: '#3b82f6', cursor: 'pointer' }}>{row.contact}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.recallDate}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.lastExam}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.lastProphy}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.lastMaintenance}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.lastComm}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                    <Typography variant="caption" sx={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>
                      + Add note
                    </Typography>
                    {row.note && (
                      <Box sx={{ p: '6px 12px', backgroundColor: '#ffedd5', border: '1px solid #fed7aa', borderRadius: '12px', maxWidth: '200px' }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#92400e', lineHeight: 1.2 }}>{row.note}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.contactAgain}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.followUp}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.apptDate}</TableCell>
                <TableCell align="center" sx={{ color: '#3b82f6' }}>{row.contactCount}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="contained" sx={{ fontSize: '0.65rem', fontWeight: 700, p: '4px 12px', backgroundColor: '#f59e0b', borderRadius: '20px', boxShadow: 'none', '&:hover': { backgroundColor: '#d97706', boxShadow: 'none' } }}>
                    RESET
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecareListTable;
