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
  Button,
} from '@mui/material';

const AuditHistoryDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#fff',
        color: '#0f172a',
        fontSize: '1.1rem',
        fontWeight: 700,
        py: 3,
        px: 4,
        lineHeight: 1.3,
        borderBottom: '1px solid #f1f5f9'
      }}>
        Audit Fee Guides History
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>Filter list by:</Typography>
          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, ml: 3 }}>Action:</Typography>
          <TextField 
            select 
            size="small" 
            defaultValue="All"
            SelectProps={{ native: true }}
            sx={{ 
              '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2, fontSize: '0.85rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
            }}
          >
            <option value="All">All</option>
          </TextField>
        </Box>
        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #e2e8f0' } }}>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
                <TableCell sx={{ textAlign: 'center' }} colSpan={3}>Difference</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1, borderBottom: '2px solid #e2e8f0' } }}>
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
                  <TableRow sx={{ '& .MuiTableCell-root': { py: 1.5, fontSize: '0.85rem', color: '#1e293b', verticalAlign: 'top', borderBottom: row.diff.length > 0 ? 'none' : '1px solid #f1f5f9' } }}>
                    <TableCell rowSpan={row.diff.length || 1}>{row.date}</TableCell>
                    <TableCell rowSpan={row.diff.length || 1}>{row.user}</TableCell>
                    <TableCell rowSpan={row.diff.length || 1}>{row.name}</TableCell>
                    <TableCell rowSpan={row.diff.length || 1}>{row.action}</TableCell>
                    {row.diff.length === 0 && <TableCell colSpan={3} />}
                    {row.diff.length > 0 && (
                      <>
                        <TableCell sx={{ borderLeft: '1px solid #f1f5f9', textAlign: 'center' }}>{row.diff[0].key}</TableCell>
                        <TableCell sx={{ borderLeft: '1px solid #f1f5f9', textAlign: 'center', color: '#dc2626' }}>{row.diff[0].old}</TableCell>
                        <TableCell sx={{ borderLeft: '1px solid #f1f5f9', textAlign: 'center', color: '#16a34a' }}>{row.diff[0].new}</TableCell>
                      </>
                    )}
                  </TableRow>
                  {row.diff.slice(1).map((d, j) => (
                    <TableRow key={j} sx={{ '& .MuiTableCell-root': { py: 1.5, fontSize: '0.85rem', borderBottom: j === row.diff.length - 2 ? '1px solid #f1f5f9' : 'none' } }}>
                      <TableCell sx={{ borderLeft: '1px solid #f1f5f9', textAlign: 'center' }}>{d.key}</TableCell>
                      <TableCell sx={{ borderLeft: '1px solid #f1f5f9', textAlign: 'center', color: '#dc2626' }}>{d.old}</TableCell>
                      <TableCell sx={{ borderLeft: '1px solid #f1f5f9', textAlign: 'center', color: '#16a34a' }}>{d.new}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            variant="contained" 
            sx={{ 
              textTransform: 'none', 
              backgroundColor: '#2563eb', 
              fontWeight: 600, 
              borderRadius: 2, 
              px: 4, 
              boxShadow: 'none', 
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' } 
            }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuditHistoryDialog;
