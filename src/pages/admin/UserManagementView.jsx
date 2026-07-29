import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Collapse,
  IconButton,
  useTheme,
  Link,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { userService } from '../../services/user.service';
import { useRoles } from '../../hooks/queries/useRoles';
import AddUserDrawer from './AddUserDrawer';
import adduserIcon from '../../assets/usermanagement icons/adduser.svg';
import viewIcon from '../../assets/usermanagement icons/view.svg';
import editIcon from '../../assets/usermanagement icons/edit.svg';
import rolesIcon from '../../assets/usermanagement icons/roles.svg';

// ─── UserRow ─────────────────────────────────────────────────────────────────

const UserRow = ({ user }) => {
  const theme    = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

  return (
    <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          px: 2, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 1,
          cursor: 'pointer',
          backgroundColor: '#fff',
          '&:hover': { backgroundColor: theme.palette.action.hover },
        }}
      >
        <Typography sx={{ color: 'text.secondary', flexShrink: 0, fontSize: '0.8rem', width: 16 }}>
          {expanded ? 'v' : '>'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{fullName}</Typography>
        {!user.isActive && (
          <Chip label="Inactive" size="small" color="default" sx={{ height: 18, fontSize: '0.7rem' }} />
        )}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{
          px: 4.5, pb: 1.5, pt: 1,
          backgroundColor: '#fff',
        }}>
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {user.email && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <EmailIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                </Box>
              </Grid>
            )}
            {user.phone && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined"
              startIcon={<img src={viewIcon} alt="view" style={{ width: 14, height: 14 }} />}
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${user._id || user.id}`); }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, borderColor: '#e0e0e0', color: '#2262EF' }}>
              View
            </Button>
            <Button size="small" variant="outlined"
              startIcon={<img src={editIcon} alt="edit" style={{ width: 14, height: 14 }} />}
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${user._id || user.id}/edit`); }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, borderColor: '#e0e0e0', color: '#2262EF' }}>
              Edit
            </Button>
            <Button size="small" variant="outlined"
              startIcon={<img src={rolesIcon} alt="roles" style={{ width: 14, height: 14 }} />}
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${user._id || user.id}/roles`); }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, borderColor: '#e0e0e0', color: '#2262EF' }}>
              Roles
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

// ─── RoleBlock ────────────────────────────────────────────────────────────────

const RoleBlock = ({ roleName, users }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  if (users.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '6px', overflow: 'hidden' }}>
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          backgroundColor: '#2262EF', color: '#fff',
          px: 2, height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', userSelect: 'none', position: 'relative',
        }}
      >
        <Typography fontWeight={700} fontSize="0.9rem" textAlign="center">{roleName}</Typography>
        <IconButton size="small" sx={{ color: '#fff', p: 0, position: 'absolute', right: 16 }}>
          {expanded ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        {users.map((user) => <UserRow key={user._id || user.id} user={user} />)}
      </Collapse>
    </Paper>
  );
};

// ─── UserManagementView ───────────────────────────────────────────────────────

const UserManagementView = () => {
  const { data: roles = [] } = useRoles();
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  
  const fetchingRef = useRef(false);

  const fetchAllUsers = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      setLoading(true);
      setError('');
      const PAGE_LIMIT    = 100;
      let page            = 1;
      let allUsers        = [];
      const statusFilter  = showInactive ? 'inactive' : '';

      while (true) {
        const result = await userService.getAllUsers(page, PAGE_LIMIT, '', '', statusFilter);
        const batch  = result.users || [];
        allUsers     = allUsers.concat(batch);
        const total  = result.pagination?.total || 0;
        if (allUsers.length >= total || batch.length < PAGE_LIMIT) break;
        page++;
      }
      setUsers(allUsers);
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : 
        (err.response?.data?.error?.message || err.response?.data?.message || err?.message || 'Failed to fetch users.');
      setError(errorMsg);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [showInactive]);

  useEffect(() => { fetchAllUsers(); }, [fetchAllUsers]);

  const usersByRole = roles.reduce((acc, role) => {
    acc[role.name] = users.filter((u) =>
      (u.roles || []).some((r) => (typeof r === 'string' ? r : r?.name) === role.name)
    );
    return acc;
  }, {});

  const allRoleNames = roles.map((r) => r.name);
  const ungrouped    = users.filter(
    (u) => !u.roles || u.roles.length === 0 ||
      !(u.roles || []).some((r) => allRoleNames.includes(typeof r === 'string' ? r : r?.name))
  );

  const hasAnyUsers = Object.values(usersByRole).some((a) => a.length > 0) || ungrouped.length > 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>Users</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox size="small" checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)} sx={{ py: 0 }} />
            }
            label={<Typography variant="body2" color="text.secondary">Show inactive users</Typography>}
            sx={{ m: 0 }}
          />
          <Button
            variant="contained"
            startIcon={<img src={adduserIcon} alt="add user" style={{ width: 16, height: 16 }} />}
            onClick={() => setDrawerOpen(true)}
            sx={{
              backgroundColor: '#2262EF',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              width: '124px',
              height: '36px',
              borderRadius: '6px',
              pl: '7px',
              pr: '12px',
              '&:hover': { backgroundColor: '#1d4ed8' },
              boxShadow: 'none',
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : !hasAnyUsers ? (
        <Typography color="text.secondary" textAlign="center" py={6}>No users found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {Object.entries(usersByRole).map(([roleName, roleUsers]) =>
            roleUsers.length > 0 ? (
              <Grid size={{ xs: 12, sm: 6 }} key={roleName}>
                <RoleBlock roleName={roleName} users={roleUsers} />
              </Grid>
            ) : null
          )}
          {ungrouped.length > 0 && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <RoleBlock roleName="Other" users={ungrouped} />
            </Grid>
          )}
        </Grid>
      )}

      <AddUserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        roles={roles}
        onCreated={fetchAllUsers}
      />
    </Paper>
  );
};

export default UserManagementView;
