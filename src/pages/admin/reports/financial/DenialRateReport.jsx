import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import apiClient from '../../../../config/api';
import { useAuth } from '../../../../contexts/AuthContext';

const DenialRateReport = () => {
  const { selectedBranchId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/reports/denial-rates', {
          params: { branchId: selectedBranchId }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError('Failed to fetch denial rates');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBranchId]);

  if (loading) return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Denial Rate By Payer
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Carrier</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Total Claims Submitted</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Total Claims Denied (Value)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Denial Rate %</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Top Denial Reasons</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.payerName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: '#1e293b' }}>
                  {row.payerName}
                </TableCell>
                <TableCell align="right">{row.totalSubmitted}</TableCell>
                <TableCell align="right">${(row.deniedValue || 0).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Typography sx={{ color: parseFloat(row.denialRate) > 10 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                    {row.denialRate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#475569', fontSize: '0.85rem' }}>{row.topReasons?.join(', ')}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DenialRateReport;
