import { useState, useEffect, useCallback } from 'react';
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
          px: 2, py: 1,
          display: 'flex', alignItems: 'center', gap: 1,
          cursor: 'pointer',
          '&:hover': { backgroundColor: theme.palette.action.hover },
        }}
      >
        {expanded
          ? <KeyboardArrowDown fontSize="small" sx={{ color: theme.palette.primary.main, flexShrink: 0 }} />
          : <KeyboardArrowRight fontSize="small" sx={{ color: theme.palette.primary.main, flexShrink: 0 }} />}
        <Typography variant="body2" color="primary" sx={{ flex: 1 }}>{fullName}</Typography>
        {!user.isActive && (
          <Chip label="Inactive" size="small" color="default" sx={{ height: 18, fontSize: '0.7rem' }} />
        )}
      </Box>

      <Collapse in={expanded}>
        <Box sx={{
          px: 3, pb: 1.5, pt: 0.5,
          backgroundColor: theme.palette.grey[50],
          borderTop: `1px solid ${theme.palette.divider}`,
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
              startIcon={<VisibilityIcon sx={{ fontSize: '0.85rem !important' }} />}
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${user._id || user.id}`); }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25 }}>
              View
            </Button>
            <Button size="small" variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: '0.85rem !important' }} />}
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${user._id || user.id}/edit`); }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25 }}>
              Edit
            </Button>
            <Button size="small" variant="outlined"
              startIcon={<SecurityIcon sx={{ fontSize: '0.85rem !important' }} />}
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${user._id || user.id}/roles`); }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25 }}>
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
    <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: 'hidden' }}>
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          backgroundColor: '#1a3a6b', color: '#fff',
          px: 2, py: 1.25,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', userSelect: 'none', position: 'relative',
        }}
      >
        <Typography fontWeight={700} fontSize="0.9rem" textAlign="center">{roleName}</Typography>
        <IconButton size="small" sx={{ color: '#fff', p: 0, position: 'absolute', right: 8 }}>
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

  const fetchAllUsers = useCallback(async () => {
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
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to fetch users.'
      );
    } finally {
      setLoading(false);
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
    <Box>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Link component="button" variant="body2" underline="hover" color="primary" sx={{ cursor: 'default' }}>
          User Management
        </Link>
        <Typography variant="body2" color="text.secondary">{'>'}</Typography>
        <Typography variant="body2" color="text.secondary">Users</Typography>
      </Box>

      {/* Top bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', mb: 3, flexDirection: 'column', gap: 0.5 }}>
        <Button
          variant="text"
          endIcon={<AddIcon sx={{ fontSize: '1rem !important' }} />}
          onClick={() => setDrawerOpen(true)}
          sx={{ fontWeight: 400, textTransform: 'none', color: 'text.primary', p: 0, minWidth: 'unset' }}
        >
          Add User
        </Button>
        <FormControlLabel
          control={
            <Checkbox size="small" checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)} sx={{ py: 0 }} />
          }
          label={<Typography variant="body2" color="text.secondary">show inactive users</Typography>}
          sx={{ m: 0 }}
        />
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
    </Box>
  );
};

export default UserManagementView;
