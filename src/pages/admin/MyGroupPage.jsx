import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { SyncAlt } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useBranch } from '../../hooks/redux';
import {
  fetchGroupUsers,
  selectGroupUsers,
  selectGroupUsersLoading,
  selectGroupUsersError,
} from '../../store/slices/practiceGroupSlice';
import {
  updateUserBranches,
  selectUserBranchMutationLoading,
  selectUserBranchMutationError,
} from '../../store/slices/userSlice';
import {
  fetchProviders,
  updateProviderBranches,
  selectProviderList,
  selectProviderListLoading,
  selectProviderListError,
  selectProviderBranchMutationLoading,
  selectProviderBranchMutationError,
} from '../../store/slices/providerSlice';

const RowCard = ({ title, subtitle, chips, onReassign }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #DFE5EC', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
    <Box sx={{ minWidth: 200, flex: 1 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{title}</Typography>
      {subtitle && <Typography sx={{ fontSize: '12.5px', color: '#6B7280' }}>{subtitle}</Typography>}
    </Box>
    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', flex: 1 }}>
      {chips.length > 0 ? chips.map((c) => (
        <Chip key={c} size="small" label={c} sx={{ bgcolor: '#EFF6FF', color: '#2362EF', fontWeight: 600 }} />
      )) : (
        <Typography sx={{ fontSize: '12.5px', color: '#9CA3AF' }}>No branches assigned</Typography>
      )}
    </Box>
    <Button size="small" startIcon={<SyncAlt />} onClick={onReassign}>
      Reassign
    </Button>
  </Paper>
);

const MyGroupPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const groupId = user?.groupId;
  const { branches, fetchBranches: loadBranches } = useBranch();

  const [tab, setTab] = useState('users');

  const groupUsers = useSelector(selectGroupUsers) || [];
  const groupUsersLoading = useSelector(selectGroupUsersLoading);
  const groupUsersError = useSelector(selectGroupUsersError);

  const providers = useSelector(selectProviderList) || [];
  const providersLoading = useSelector(selectProviderListLoading);
  const providersError = useSelector(selectProviderListError);

  const userBranchMutationLoading = useSelector(selectUserBranchMutationLoading);
  const userBranchMutationError = useSelector(selectUserBranchMutationError);
  const providerBranchMutationLoading = useSelector(selectProviderBranchMutationLoading);
  const providerBranchMutationError = useSelector(selectProviderBranchMutationError);

  // { type: 'user' | 'provider', id, name }
  const [reassignTarget, setReassignTarget] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  // Branch options come from GET /branches, which is already scoped server-side to
  // this admin's accessible branches (branchAccess middleware) — same source useBranch()
  // uses for the header's branch switcher, so this picker can't offer a branch the
  // admin (and therefore the entity being reassigned) shouldn't have access to.
  useEffect(() => {
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (groupId) dispatch(fetchGroupUsers(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    if (tab === 'providers') dispatch(fetchProviders({ limit: 100 }));
  }, [dispatch, tab]);

  const mutationLoading = reassignTarget?.type === 'user' ? userBranchMutationLoading : providerBranchMutationLoading;
  const mutationError = reassignTarget?.type === 'user' ? userBranchMutationError : providerBranchMutationError;

  const openReassign = (type, id, name, currentBranchIds) => {
    setReassignTarget({ type, id, name });
    setSelectedBranchIds(currentBranchIds || []);
  };

  const handleSaveReassign = async () => {
    const action = reassignTarget.type === 'user'
      ? updateUserBranches({ userId: reassignTarget.id, branchIds: selectedBranchIds })
      : updateProviderBranches({ providerId: reassignTarget.id, branchIds: selectedBranchIds });
    const thunk = reassignTarget.type === 'user' ? updateUserBranches : updateProviderBranches;
    const result = await dispatch(action);
    if (thunk.fulfilled.match(result)) {
      setReassignTarget(null);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', p: '24px', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
          My Group
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Reassign users and providers to branches within your practice group.
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid #E2E8F0' }}>
        <Tab value="users" label="Users" />
        <Tab value="providers" label="Providers" />
      </Tabs>

      {tab === 'users' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {groupUsersError && <Alert severity="error">Couldn't load group users: {groupUsersError}</Alert>}
          {groupUsersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : groupUsers.length === 0 ? (
            <Typography sx={{ py: 4, textAlign: 'center', color: '#6B7280' }}>No users found in this group.</Typography>
          ) : (
            groupUsers.map((u) => {
              const id = u._id || u.id;
              const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
              const branchNames = (u.branchIds || []).map((bId) => branches.find((b) => b.id === bId)?.name || bId);
              return (
                <RowCard
                  key={id}
                  title={fullName}
                  subtitle={u.email}
                  chips={branchNames}
                  onReassign={() => openReassign('user', id, fullName, u.branchIds)}
                />
              );
            })
          )}
        </Box>
      )}

      {tab === 'providers' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {providersError && <Alert severity="error">Couldn't load providers: {providersError}</Alert>}
          {providersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : providers.length === 0 ? (
            <Typography sx={{ py: 4, textAlign: 'center', color: '#6B7280' }}>No providers found in this group.</Typography>
          ) : (
            providers.map((p) => {
              const id = p._id || p.id;
              // Provider records nest the person's name/email under userId (same
              // shape PatientForm.jsx's provider pickers rely on) — providers
              // don't carry flat firstName/lastName of their own.
              const person = p.userId || p;
              const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ') || person.email || p.providerCode || id;
              const branchNames = (p.branchIds || []).map((bId) => branches.find((b) => b.id === bId)?.name || bId);
              return (
                <RowCard
                  key={id}
                  title={fullName}
                  subtitle={p.specialty || person.email}
                  chips={branchNames}
                  onReassign={() => openReassign('provider', id, fullName, p.branchIds)}
                />
              );
            })
          )}
        </Box>
      )}

      {/* Reassign branches dialog — shared by both tabs */}
      <Dialog open={!!reassignTarget} onClose={() => setReassignTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>Reassign Branches — {reassignTarget?.name}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {mutationError && <Alert severity="error" sx={{ mb: 2 }}>{mutationError}</Alert>}
          <FormControl fullWidth>
            <Select
              multiple
              displayEmpty
              value={selectedBranchIds}
              onChange={(e) => setSelectedBranchIds(e.target.value)}
              renderValue={(selected) => selected.length === 0
                ? <em>Not assigned</em>
                : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((bId) => (
                      <Chip key={bId} size="small" label={branches.find((b) => b.id === bId)?.name || bId} />
                    ))}
                  </Box>
                )}
            >
              {branches.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReassignTarget(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveReassign} disabled={mutationLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyGroupPage;
