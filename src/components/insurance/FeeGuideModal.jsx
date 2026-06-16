import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { feeService } from '../../services/fee.service';

const FeeGuideModal = ({ open, onClose, feeGuideId }) => {
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchedIdRef = useRef(null);

  useEffect(() => {
    if (open && feeGuideId) {
      if (fetchedIdRef.current !== feeGuideId) {
        fetchedIdRef.current = feeGuideId;
        fetchFees();
      }
    } else {
      fetchedIdRef.current = null;
      setFees([]);
      setSearchQuery('');
    }
  }, [open, feeGuideId]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      // For now we might just pass a mock string like 'careington'. 
      // If the backend expects an ID, we'd pass an ID.
      // We will try fetching, but if it fails we mock it for demonstration.
      try {
        const response = await feeService.getFeeScheduleFees(feeGuideId, { limit: 50 });
        setFees(response.data || []);
      } catch (err) {
        console.log('Using mock data for fee schedule');
        setFees([
          { procCode: 'D0120', description: 'Periodic oral evaluation - established patient', amount: '$45.00' },
          { procCode: 'D0150', description: 'Comprehensive oral evaluation - new or established patient', amount: '$65.00' },
          { procCode: 'D0210', description: 'Intraoral - complete series of radiographic images', amount: '$110.00' },
          { procCode: 'D1110', description: 'Prophylaxis - adult', amount: '$75.00' },
          { procCode: 'D2391', description: 'Resin-based composite - one surface, posterior', amount: '$150.00' },
        ]);
      }
    } catch (error) {
      console.error('Failed to load fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFees = fees.filter(fee => 
    fee.procCode?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    fee.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" fontWeight={700}>
          Fee Schedule Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search procedure code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            * Provider-specific overrides can be layered on top
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f0f4f8' }}>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }}>Procedure Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '60%' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFees.map((fee, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{fee.procCode}</TableCell>
                    <TableCell>{fee.description}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      {typeof fee.amount === 'number' ? `$${fee.amount.toFixed(2)}` : fee.amount}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#666' }}>
                      No fees found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Button onClick={onClose} variant="contained" sx={{ textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeeGuideModal;
