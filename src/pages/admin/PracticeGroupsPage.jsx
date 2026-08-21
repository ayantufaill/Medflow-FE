import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Add, Business, LocationOn, PersonAdd, Edit } from '@mui/icons-material';
import {
  fetchPracticeGroups,
  createPracticeGroup,
  updatePracticeGroup,
  createBranch,
  createGroupAdmin,
  selectPracticeGroups,
  selectPracticeGroupLoading,
  selectPracticeGroupError,
  selectPracticeGroupMutationLoading,
  selectPracticeGroupMutationError,
} from '../../store/slices/practiceGroupSlice';

const emptyGroupForm = { name: '' };
const emptyBranchForm = { name: '', address: '', city: '', state: '', zip: '', phone: '' };
const emptyAdminForm = { firstName: '', lastName: '', email: '', branchId: '' };

const PracticeGroupsPage = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectPracticeGroups) || [];
  const loading = useSelector(selectPracticeGroupLoading);
  const error = useSelector(selectPracticeGroupError);
  const mutationLoading = useSelector(selectPracticeGroupMutationLoading);
  const mutationError = useSelector(selectPracticeGroupMutationError);

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupForm, setGroupForm] = useState(emptyGroupForm);

  const [branchDialogGroupId, setBranchDialogGroupId] = useState(null);
  const [branchForm, setBranchForm] = useState(emptyBranchForm);

  const [adminDialogGroup, setAdminDialogGroup] = useState(null);
  const [adminForm, setAdminForm] = useState(emptyAdminForm);
  const [adminSuccessMessage, setAdminSuccessMessage] = useState('');

  const [editDialogGroup, setEditDialogGroup] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', isActive: true });

  useEffect(() => {
    dispatch(fetchPracticeGroups());
  }, [dispatch]);

  const handleCreateGroup = async () => {
    const result = await dispatch(createPracticeGroup(groupForm));
    if (createPracticeGroup.fulfilled.match(result)) {
      setGroupDialogOpen(false);
      setGroupForm(emptyGroupForm);
    }
  };

  const handleCreateBranch = async () => {
    // Drop empty optional fields rather than sending them as blank strings.
    const payload = Object.fromEntries(
      Object.entries(branchForm).filter(([, value]) => value !== '')
    );
    const result = await dispatch(createBranch({ groupId: branchDialogGroupId, payload }));
    if (createBranch.fulfilled.match(result)) {
      setBranchDialogGroupId(null);
      setBranchForm(emptyBranchForm);
    }
  };

  const handleUpdateGroup = async () => {
    const result = await dispatch(updatePracticeGroup({ groupId: editDialogGroup.id, payload: editForm }));
    if (updatePracticeGroup.fulfilled.match(result)) {
      setEditDialogGroup(null);
    }
  };

  const handleCreateAdmin = async () => {
    // Backend expects the branch reference as `clinicId`, not `branchId` (confirmed
    // via a real 400 validation response) — keep the form's own state named
    // `branchId` for clarity since it's a branch picker, just rename on the wire.
    const { branchId, ...rest } = adminForm;
    const payload = { ...rest, clinicId: branchId };
    const result = await dispatch(createGroupAdmin({ groupId: adminDialogGroup.id, payload }));
    if (createGroupAdmin.fulfilled.match(result)) {
      setAdminSuccessMessage(`Group Admin created for ${adminDialogGroup.name}.`);
      setAdminDialogGroup(null);
      setAdminForm(emptyAdminForm);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', p: '24px', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
            Practice Groups
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
            The organizations that own your clinic branches — the Group → Branch tenant layer.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setGroupDialogOpen(true)} sx={{ bgcolor: '#2362EF' }}>
          New Group
        </Button>
      </Box>

      {adminSuccessMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setAdminSuccessMessage('')}>
          {adminSuccessMessage}
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 3 }}>Couldn't load practice groups: {error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : groups.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', color: '#6B7280' }}>
          No practice groups yet — create the first one to start provisioning branches.
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {groups.map((group) => (
            <Paper key={group.id} elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #DFE5EC' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Business sx={{ color: '#2362EF' }} />
                <Typography sx={{ fontWeight: 700, fontSize: '17px', color: '#111827' }}>{group.name}</Typography>
                <Chip
                  size="small"
                  label={group.isActive ? 'Active' : 'Inactive'}
                  sx={{
                    bgcolor: group.isActive ? '#E1F2EA' : '#FAEAE9',
                    color: group.isActive ? '#1F7A5C' : '#A6332F',
                    fontWeight: 600,
                  }}
                />
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => { setEditDialogGroup(group); setEditForm({ name: group.name, isActive: group.isActive }); }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<LocationOn />}
                    onClick={() => { setBranchDialogGroupId(group.id); setBranchForm(emptyBranchForm); }}
                  >
                    Add Branch
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PersonAdd />}
                    onClick={() => { setAdminDialogGroup(group); setAdminForm({ ...emptyAdminForm, branchId: group.branches?.[0]?.id || '' }); }}
                    disabled={!group.branches || group.branches.length === 0}
                  >
                    Add Group Admin
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {group.branches && group.branches.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {group.branches.map((branch) => (
                    <Box
                      key={branch.id}
                      sx={{
                        px: 2, py: 1, borderRadius: '10px', border: '1px solid #E2E8F0',
                        display: 'flex', flexDirection: 'column', minWidth: 160,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: '13.5px', color: '#111827' }}>{branch.name}</Typography>
                      {branch.city && (
                        <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>{branch.city}</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>No branches yet.</Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* New Group dialog */}
      <Dialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>New Practice Group</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {mutationError && <Alert severity="error">{mutationError}</Alert>}
          <TextField
            label="Group Name"
            fullWidth
            autoFocus
            value={groupForm.name}
            onChange={(e) => setGroupForm({ name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateGroup} disabled={!groupForm.name || mutationLoading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Group dialog — rename and/or deactivate */}
      <Dialog open={!!editDialogGroup} onClose={() => setEditDialogGroup(null)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Group</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {mutationError && <Alert severity="error">{mutationError}</Alert>}
          <TextField
            label="Group Name"
            fullWidth
            autoFocus
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <TextField
            select
            label="Status"
            fullWidth
            value={editForm.isActive ? 'active' : 'inactive'}
            onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogGroup(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateGroup} disabled={!editForm.name || mutationLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Branch dialog */}
      <Dialog open={!!branchDialogGroupId} onClose={() => setBranchDialogGroupId(null)} fullWidth maxWidth="xs">
        <DialogTitle>Add Branch</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {mutationError && <Alert severity="error">{mutationError}</Alert>}
          <TextField
            label="Branch Name"
            fullWidth
            autoFocus
            value={branchForm.name}
            onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            value={branchForm.address}
            onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="City"
              fullWidth
              value={branchForm.city}
              onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
            />
            <TextField
              label="State"
              sx={{ width: 100 }}
              value={branchForm.state}
              onChange={(e) => setBranchForm({ ...branchForm, state: e.target.value })}
            />
            <TextField
              label="Zip"
              sx={{ width: 110 }}
              value={branchForm.zip}
              onChange={(e) => setBranchForm({ ...branchForm, zip: e.target.value })}
            />
          </Box>
          <TextField
            label="Phone"
            fullWidth
            value={branchForm.phone}
            onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBranchDialogGroupId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBranch} disabled={!branchForm.name || mutationLoading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Group Admin dialog */}
      <Dialog open={!!adminDialogGroup} onClose={() => setAdminDialogGroup(null)} fullWidth maxWidth="xs">
        <DialogTitle>Add Group Admin — {adminDialogGroup?.name}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {mutationError && <Alert severity="error">{mutationError}</Alert>}
          <TextField
            label="First Name"
            fullWidth
            autoFocus
            value={adminForm.firstName}
            onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={adminForm.lastName}
            onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={adminForm.email}
            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
          />
          <TextField
            select
            label="Branch"
            fullWidth
            value={adminForm.branchId}
            onChange={(e) => setAdminForm({ ...adminForm, branchId: e.target.value })}
          >
            {(adminDialogGroup?.branches || []).map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminDialogGroup(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAdmin}
            disabled={!adminForm.firstName || !adminForm.lastName || !adminForm.email || !adminForm.branchId || mutationLoading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PracticeGroupsPage;
