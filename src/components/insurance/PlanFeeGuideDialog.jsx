import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Box, Typography, Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const PlanFeeGuideDialog = ({ open, onClose, planName }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 1, name: 'Diagnostic' },
    { id: 2, name: 'Preventative' },
    { id: 3, name: 'Restorative' },
    { id: 4, name: 'Endodontics' },
    { id: 5, name: 'Periodontics' },
    { id: 6, name: 'Prosthodontics, Removable' },
    { id: 7, name: 'Maxillofacial Prosthetics' },
    { id: 8, name: 'Implant Services' },
    { id: 9, name: 'Prosthodontics, Fixed' },
    { id: 10, name: 'Oral Surgery' },
    { id: 11, name: 'Orthodontics' },
    { id: 12, name: 'Adjunctive General Services' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#5c7cba', color: '#fff', py: 1, fontSize: '0.9rem', textAlign: 'center' }}>
        {planName || 'Careington PPO Platinum (directly in network)'}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#0c345d' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', width: '200px' }}>Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Group</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Code</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Procedure Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} hover onClick={() => toggleRow(cat.id)} sx={{ cursor: 'pointer' }}>
                  <TableCell colSpan={5} sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, px: 1 }}>
                      <IconButton size="small">
                        {expandedRows[cat.id] ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                      </IconButton>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{cat.name}</Typography>
                    </Box>
                    <Collapse in={expandedRows[cat.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 4, pb: 1 }}>
                        <Typography variant="caption" color="textSecondary">No procedures defined for this category.</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 1.5, gap: 1 }}>
        <Button size="small" variant="contained" onClick={onClose} sx={{ bgcolor: '#a0aec0', textTransform: 'none' }}>Close</Button>
        <Button size="small" variant="contained" sx={{ bgcolor: '#d1a97d', textTransform: 'none' }}>Export as CSV</Button>
        <Button size="small" variant="contained" sx={{ bgcolor: '#4b71a1', textTransform: 'none' }}>Upload fee Guide</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanFeeGuideDialog;
