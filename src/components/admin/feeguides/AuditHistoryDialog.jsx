import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const AuditHistoryDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#4b71a1', 
        color: 'white', 
        textAlign: 'center',
        py: 1,
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Audit FeeGuides History
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#4b71a1', fontWeight: 600 }}>Filter list by:</Typography>
          <Typography variant="body2" sx={{ color: '#4b71a1', fontWeight: 600, ml: 4 }}>Action:</Typography>
          <TextField 
            select 
            size="small" 
            defaultValue="All"
            SelectProps={{ native: true }}
            sx={{ '& .MuiInputBase-root': { fontSize: '0.8rem' } }}
          >
            <option value="All">All</option>
          </TextField>
        </Box>
        <TableContainer sx={{ border: '1px solid #e0e0e0', maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { bgcolor: '#f9fafb', fontWeight: 700, fontSize: '0.75rem', py: 1.5 } }}>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
                <TableCell sx={{ textAlign: 'center' }} colSpan={3}>Difference</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { bgcolor: '#f9fafb', fontWeight: 700, fontSize: '0.75rem', py: 1 } }}>
                <TableCell colSpan={4} />
                <TableCell sx={{ textAlign: 'center', width: '20%' }}>Key</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '20%' }}>Old</TableCell>
                <TableCell sx={{ textAlign: 'center', width: '20%' }}>New</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { date: '09/21/2021 12:40:52 PM', user: 'Admin User', name: 'FeeGuide', action: 'Add', diff: [] },
                { date: '09/21/2021 12:41:28 PM', user: 'Admin User', name: 'FeeGuide', action: 'Update', diff: [{ key: '/name', old: 'Careington PPO', new: 'Careington PPO (directly in network)' }] },
                { date: '09/21/2021 12:41:43 PM', user: 'Admin User', name: 'D2390', action: 'Update', diff: [{ key: '/price', old: '', new: '226' }, { key: '/modified', old: '09/21/2021 12:40 PM', new: '09/21/2021 12:41 PM' }] },
                { date: '09/21/2021 12:41:44 PM', user: 'Admin User', name: 'D2391', action: 'Update', diff: [{ key: '/price', old: '', new: '98' }, { key: '/modified', old: '09/21/2021 12:40 PM', new: '09/21/2021 12:41 PM' }] },
                { date: '09/21/2021 12:41:44 PM', user: 'Admin User', name: 'D2392', action: 'Update', diff: [{ key: '/price', old: '', new: '134' }, { key: '/modified', old: '09/21/2021 12:40 PM', new: '09/21/2021 12:41 PM' }] },
                { date: '09/21/2021 12:41:44 PM', user: 'Admin User', name: 'D2393', action: 'Update', diff: [{ key: '/price', old: '', new: '167' }, { key: '/modified', old: '09/21/2021 12:40 PM', new: '09/21/2021 12:41 PM' }] },
                { date: '09/21/2021 12:41:44 PM', user: 'Admin User', name: 'D2394', action: 'Update', diff: [{ key: '/price', old: '', new: '175' }, { key: '/modified', old: '09/21/2021 12:40 PM', new: '09/21/2021 12:41 PM' }] },
                { date: '09/21/2021 01:15:22 PM', user: 'Sarah Miller', name: 'D0120', action: 'Update', diff: [{ key: '/price', old: '45', new: '52' }] },
                { date: '09/21/2021 01:16:05 PM', user: 'Sarah Miller', name: 'D0150', action: 'Update', diff: [{ key: '/price', old: '85', new: '95' }, { key: '/modified', old: '09/21/2021 12:40 PM', new: '09/21/2021 01:16 PM' }] },
                { date: '09/22/2021 09:10:12 AM', user: 'John Davis', name: 'FeeGuide', action: 'Update', diff: [{ key: '/default', old: 'No', new: 'Yes' }] },
              ].map((row, i) => (
                <React.Fragment key={i}>
                  <TableRow sx={{ '& .MuiTableCell-root': { py: 1, fontSize: '0.75rem', verticalAlign: 'top', borderBottom: row.diff.length > 0 ? 'none' : '1px solid #e0e0e0' } }}>
                    <TableCell rowSpan={row.diff.length || 1}>{row.date}</TableCell>
                    <TableCell rowSpan={row.diff.length || 1}>{row.user}</TableCell>
                    <TableCell rowSpan={row.diff.length || 1}>{row.name}</TableCell>
                    <TableCell rowSpan={row.diff.length || 1}>{row.action}</TableCell>
                    {row.diff.length === 0 && <TableCell colSpan={3} />}
                    {row.diff.length > 0 && (
                      <>
                        <TableCell sx={{ borderLeft: '1px solid #e0e0e0', textAlign: 'center' }}>{row.diff[0].key}</TableCell>
                        <TableCell sx={{ borderLeft: '1px solid #e0e0e0', textAlign: 'center' }}>{row.diff[0].old}</TableCell>
                        <TableCell sx={{ borderLeft: '1px solid #e0e0e0', textAlign: 'center' }}>{row.diff[0].new}</TableCell>
                      </>
                    )}
                  </TableRow>
                  {row.diff.slice(1).map((d, j) => (
                    <TableRow key={j} sx={{ '& .MuiTableCell-root': { py: 1, fontSize: '0.75rem', borderBottom: j === row.diff.length - 2 ? '1px solid #e0e0e0' : 'none' } }}>
                      <TableCell sx={{ borderLeft: '1px solid #e0e0e0', textAlign: 'center' }}>{d.key}</TableCell>
                      <TableCell sx={{ borderLeft: '1px solid #e0e0e0', textAlign: 'center' }}>{d.old}</TableCell>
                      <TableCell sx={{ borderLeft: '1px solid #e0e0e0', textAlign: 'center' }}>{d.new}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AuditHistoryDialog;
