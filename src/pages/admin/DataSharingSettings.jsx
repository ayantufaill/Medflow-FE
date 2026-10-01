import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Switch, Button, CircularProgress, Alert
} from '@mui/material';
import apiClient from '../../config/api';

const CATEGORIES = [
  { id: 'IDENTITY', label: 'Identity & Demographics' },
  { id: 'CLINICAL', label: 'Clinical Records' },
  { id: 'FINANCIAL', label: 'Financial Data (Payments, Invoices)' },
  { id: 'IMAGING', label: 'Imaging & X-Rays' },
  { id: 'APPOINTMENTS', label: 'Appointments' },
  { id: 'INSURANCE', label: 'Insurance' },
];

const DataSharingSettings = () => {
  const [policy, setPolicy] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/sharing/policy');
      const payload = res.data?.data || {};
      setPolicy(payload.policy || payload.sharing || payload || {});
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load sharing policy. ' + (err.response?.data?.error?.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleToggle = (category) => {
    setPolicy(prev => ({
      ...prev,
      [category]: prev[category] === 'GROUP_READ' ? 'OWN_BRANCH' : 'GROUP_READ'
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await Promise.all(
        CATEGORIES.map((cat) =>
          apiClient.put('/sharing/policy', {
            category: cat.id,
            mode: policy[cat.id] || 'OWN_BRANCH',
          })
        )
      );
      setSuccess('Data sharing policy saved successfully.');
    } catch (err) {
      setError('Failed to save policy. ' + (err.response?.data?.error?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>Data Sharing Settings</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure cross-branch data sharing within your practice group. 
        "Group Read" allows staff at any branch to view records created at other branches.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="center">Group Read Access</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CATEGORIES.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.label}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={policy[cat.id] === 'GROUP_READ'}
                      onChange={() => handleToggle(cat.id)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading || saving}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DataSharingSettings;
