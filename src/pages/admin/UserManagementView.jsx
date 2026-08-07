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
import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';
import AssignRolesModal from './AssignRolesModal';
import adduserIcon from '../../assets/usermanagement icons/adduser.svg';
import viewIcon from '../../assets/usermanagement icons/view.svg';
import editIcon from '../../assets/usermanagement icons/edit.svg';
import rolesIcon from '../../assets/usermanagement icons/roles.svg';

// ─── UserRow ─────────────────────────────────────────────────────────────────

const UserRow = ({ user, onViewUser, onEditUser, onAssignRolesUser }) => {
  const theme = useTheme();
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
          px: '22px', py: '18px',
          backgroundColor: '#F8FAFC',
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          {/* User Contact Info Cards */}
          <Grid container spacing={2} sx={{ mb: '16px' }}>
            {user.email && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{
                  p: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' },
                }}>
                  <Box sx={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <EmailIcon sx={{ color: '#2262EF', fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      lineHeight: 1.2,
                    }}>
                      Email Address
                    </Typography>
                    <Typography sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      mt: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {user.phone && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{
                  p: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' },
                }}>
                  <Box sx={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <PhoneIcon sx={{ color: '#2262EF', fontSize: '18px' }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      lineHeight: 1.2,
                    }}>
                      Phone Number
                    </Typography>
                    <Typography sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      mt: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {user.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Action Bar Footer */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: '14px',
            borderTop: '1px solid #E2E8F0',
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Typography sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#64748B',
            }}>
              Manage account permissions and details
            </Typography>

            <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                startIcon={<img src={viewIcon} alt="view" style={{ width: 15, height: 15 }} />}
                onClick={(e) => { e.stopPropagation(); onViewUser ? onViewUser(user) : navigate(`/users/${user._id || user.id}`); }}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  height: '36px',
                  borderRadius: '8px',
                  px: '14px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                    borderColor: '#94A3B8',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  },
                }}
              >
                View
              </Button>
              <Button
                startIcon={<img src={editIcon} alt="edit" style={{ width: 15, height: 15 }} />}
                onClick={(e) => { e.stopPropagation(); onEditUser ? onEditUser(user) : navigate(`/users/${user._id || user.id}/edit`); }}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  height: '36px',
                  borderRadius: '8px',
                  px: '14px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                    borderColor: '#94A3B8',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  },
                }}
              >
                Edit
              </Button>
              <Button
                startIcon={<img src={rolesIcon} alt="roles" style={{ width: 15, height: 15 }} />}
                onClick={(e) => { e.stopPropagation(); onAssignRolesUser ? onAssignRolesUser(user) : navigate(`/users/${user._id || user.id}/roles`); }}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  height: '36px',
                  borderRadius: '8px',
                  px: '16px',
                  bgcolor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  boxShadow: '0 1px 2px rgba(34, 98, 239, 0.08)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: '#DBEAFE',
                    borderColor: '#93C5FD',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 5px rgba(34, 98, 239, 0.15)',
                  },
                }}
              >
                Roles
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

// ─── RoleBlock ────────────────────────────────────────────────────────────────

const RoleBlock = ({ roleName, users, onViewUser, onEditUser, onAssignRolesUser }) => {
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
        {users.map((user) => <UserRow key={user._id || user.id} user={user} onViewUser={onViewUser} onEditUser={onEditUser} onAssignRolesUser={onAssignRolesUser} />)}
      </Collapse>
    </Paper>
  );
};

// ─── UserManagementView ───────────────────────────────────────────────────────

const UserManagementView = () => {
  const { data: roles = [] } = useRoles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedUserForRoles, setSelectedUserForRoles] = useState(null);

  const fetchingRef = useRef(false);

  const fetchAllUsers = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      setLoading(true);
      setError('');
      const PAGE_LIMIT = 100;
      let page = 1;
      let allUsers = [];
      const statusFilter = showInactive ? 'inactive' : '';

      while (true) {
        const result = await userService.getAllUsers(page, PAGE_LIMIT, '', '', statusFilter);
        const batch = result.users || [];
        allUsers = allUsers.concat(batch);
        const total = result.pagination?.total || 0;
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
  const ungrouped = users.filter(
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
                <RoleBlock
                  roleName={roleName}
                  users={roleUsers}
                  onViewUser={setSelectedUserForView}
                  onEditUser={setSelectedUserForEdit}
                  onAssignRolesUser={setSelectedUserForRoles}
                />
              </Grid>
            ) : null
          )}
          {ungrouped.length > 0 && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <RoleBlock
                roleName="Other"
                users={ungrouped}
                onViewUser={setSelectedUserForView}
                onEditUser={setSelectedUserForEdit}
                onAssignRolesUser={setSelectedUserForRoles}
              />
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

      <ViewUserModal
        open={Boolean(selectedUserForView)}
        onClose={() => setSelectedUserForView(null)}
        user={selectedUserForView}
        onEditUser={(user) => setSelectedUserForEdit(user)}
        onAssignRolesUser={(user) => setSelectedUserForRoles(user)}
      />

      <EditUserModal
        open={Boolean(selectedUserForEdit)}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onSuccess={fetchAllUsers}
      />

      <AssignRolesModal
        open={Boolean(selectedUserForRoles)}
        onClose={() => setSelectedUserForRoles(null)}
        user={selectedUserForRoles}
        onSuccess={fetchAllUsers}
      />
    </Paper>
  );
};

export default UserManagementView;
