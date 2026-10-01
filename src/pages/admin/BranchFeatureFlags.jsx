import { useState } from 'react';
import { Box, Typography, Paper, Switch, Alert, Chip, CircularProgress } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import apiClient from '../../config/api';

/**
 * group_admin-only per-branch feature flag toggles (PATCH /branches/:id/features).
 * The backend is the real authority — it accepts the new-model group_admin role
 * or a legacy wildcard admin and rejects everyone else; this UI just surfaces
 * the control, it doesn't duplicate that check.
 */
const BranchFeatureFlags = ({ branches = [] }) => {
  // branchId -> boolean, seeded from each branch's own `features` object if
  // the branch list already carries it; otherwise starts OFF until toggled.
  const [flags, setFlags] = useState(() => {
    const initial = {};
    for (const b of branches) {
      initial[b.id] = b.features?.treatment_coordinator === true;
    }
    return initial;
  });
  const [pendingBranchId, setPendingBranchId] = useState(null);
  const [error, setError] = useState('');

  const handleToggle = async (branchId, nextValue) => {
    setPendingBranchId(branchId);
    setError('');
    const previous = flags[branchId];
    setFlags((prev) => ({ ...prev, [branchId]: nextValue }));
    try {
      await apiClient.patch(`/branches/${branchId}/features`, { treatment_coordinator: nextValue });
    } catch (err) {
      setFlags((prev) => ({ ...prev, [branchId]: previous }));
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to update feature flag.');
    } finally {
      setPendingBranchId(null);
    }
  };

  if (branches.length === 0) {
    return <Typography sx={{ py: 4, textAlign: 'center', color: '#6B7280' }}>No branches found.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      {branches.map((branch) => {
        const isOn = !!flags[branch.id];
        return (
          <Paper
            key={branch.id}
            elevation={0}
            sx={{ p: 2, borderRadius: '12px', border: '1px solid #DFE5EC', display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{branch.name}</Typography>
                <Typography sx={{ fontSize: '12.5px', color: '#6B7280' }}>Treatment Coordinator</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {pendingBranchId === branch.id && <CircularProgress size={16} />}
                <Switch
                  checked={isOn}
                  disabled={pendingBranchId === branch.id}
                  onChange={(e) => handleToggle(branch.id, e.target.checked)}
                />
              </Box>
            </Box>
            {isOn && (
              <Chip
                size="small"
                icon={<InfoOutlined sx={{ fontSize: '14px !important' }} />}
                label="Front Desk and Branch Admin users in this branch can now present treatment plans."
                sx={{ bgcolor: '#EFF6FF', color: '#2362EF', fontWeight: 500, fontSize: '12px', alignSelf: 'flex-start', height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
              />
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default BranchFeatureFlags;
