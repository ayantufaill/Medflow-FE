import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  List,
  ListItemButton,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, LockOutlined, ManageAccountsOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useBranch } from '../../hooks/redux';
import { hasRequiredRole } from '../../config/navMenuItems';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import {
  useTeamMembers,
  useMemberModuleAccess,
  useUpdateMemberModuleAccess,
} from '../../hooks/queries/useTeamAccess';
import { canEditMember, isPatientAccount, memberRoleLabel, featureBase } from '../../constants/teamModuleAccess';
import ModuleAccessRow from '../../components/admin/team-access/ModuleAccessRow';

const memberId = (m) => String(m?._id || m?.id || '');
const memberName = (m) => `${m?.firstName || ''} ${m?.lastName || ''}`.trim() || m?.email || 'Unnamed user';

const sameMap = (a, b) => {
  const aKeys = Object.keys(a);
  return aKeys.length === Object.keys(b).length && aKeys.every((k) => a[k] === b[k]);
};

const EMPTY_DRAFT = { modules: {}, features: {} };

// Drop feature switches that now just restate what the module level (or the
// role) already gives, so "Custom" only marks a real difference.
const pruneFeatures = (module, levelOverride, features) => {
  const next = { ...features };
  for (const f of module.features) {
    if (next[f.key] !== undefined && next[f.key] === featureBase(f, levelOverride)) delete next[f.key];
  }
  return next;
};

const MemberListItem = ({ member, selected, editable, onClick }) => (
  <ListItemButton
    selected={selected}
    onClick={onClick}
    sx={{
      borderRadius: radius.md,
      mb: 0.5,
      alignItems: 'flex-start',
      gap: 1,
      '&.Mui-selected, &.Mui-selected:hover': { bgcolor: COLORS.ACCENT_BG },
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography noWrap sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>{memberName(member)}</Typography>
      <Typography noWrap sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>{member.email}</Typography>
      <Typography noWrap sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.25 }}>{memberRoleLabel(member)}</Typography>
    </Box>
    {!editable && <LockOutlined sx={{ fontSize: 16, color: COLORS.TEXT_MUTED, mt: 0.5 }} />}
  </ListItemButton>
);

const TeamAccessPage = () => {
  const { user } = useAuth();
  const actorId = user?._id || user?.id;
  const isBranchAdminOnly = hasRequiredRole(user, ['Branch Admin']) && !hasRequiredRole(user, ['Group Admin', 'Admin']);
  const { branches, fetchBranches: loadBranches } = useBranch();

  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [pendingSelectId, setPendingSelectId] = useState(null);
  // { modules: { [moduleKey]: level }, features: { [featureKey]: bool } } — overrides only.
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [expanded, setExpanded] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: members = [], isLoading: membersLoading, error: membersError } = useTeamMembers(branchFilter);
  const selected = members.find((m) => memberId(m) === selectedId) || null;
  const editable = selected ? canEditMember({ actorIsBranchAdminOnly: isBranchAdminOnly, actorId, member: selected }) : false;
  // Locked members (other admins) are refused by the API anyway; don't ask.
  const { data: accessData, isLoading: accessLoading, error: accessError } = useMemberModuleAccess(editable ? selectedId : null);
  const updateMutation = useUpdateMemberModuleAccess();

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members
      .filter((m) => memberId(m) !== String(actorId) && !isPatientAccount(m))
      .filter((m) => !q || memberName(m).toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q));
  }, [members, search, actorId]);

  const modules = accessData?.modules || [];
  const saved = useMemo(
    () => ({ modules: accessData?.moduleAccess || {}, features: accessData?.featureAccess || {} }),
    [accessData]
  );
  const isDirty = !sameMap(draft.modules, saved.modules) || !sameMap(draft.features, saved.features);
  const changeCount =
    modules.filter((m) => draft.modules[m.key] !== saved.modules[m.key]).length +
    modules.flatMap((m) => m.features).filter((f) => draft.features[f.key] !== saved.features[f.key]).length;

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const selectMember = (id) => {
    if (id === selectedId) return;
    if (isDirty) {
      setPendingSelectId(id);
      return;
    }
    setSelectedId(id);
    setExpanded({});
  };

  const confirmSwitch = () => {
    setSelectedId(pendingSelectId);
    setPendingSelectId(null);
    setExpanded({});
  };

  // Picking the level the role already gives clears the override, so the
  // member keeps the role's exact wording (e.g. "View, update") untouched.
  const setLevel = (module, level) => {
    setDraft((prev) => {
      const modulesNext = { ...prev.modules };
      if (level === module.roleDefaultLevel) delete modulesNext[module.key];
      else modulesNext[module.key] = level;
      return { modules: modulesNext, features: pruneFeatures(module, modulesNext[module.key], prev.features) };
    });
  };

  const setFeature = (module, feature, on) => {
    setDraft((prev) => {
      const features = { ...prev.features };
      if (on === featureBase(feature, prev.modules[module.key])) delete features[feature.key];
      else features[feature.key] = on;
      return { ...prev, features };
    });
  };

  const resetModule = (module) => {
    setDraft((prev) => {
      const modulesNext = { ...prev.modules };
      delete modulesNext[module.key];
      const features = { ...prev.features };
      for (const f of module.features) delete features[f.key];
      return { modules: modulesNext, features };
    });
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ userId: selectedId, moduleAccess: draft.modules, featureAccess: draft.features });
      setToast(`Access updated for ${memberName(selected)}.`);
    } catch {
      // surfaced below via updateMutation.error
    }
  };

  const errorMessage = (err) => err?.response?.data?.error?.message || err?.message || 'Something went wrong.';
  const cardSx = { borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_CARD };

  return (
    <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, p: '24px', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 0.5, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
          Team Access
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '0.9rem' }}>
          {isBranchAdminOnly
            ? 'Choose what each person in your branch can use. Everything starts on what their role gives (marked with a dot). Change a module, or open Customize to switch single actions on or off.'
            : 'Choose what each person in your practice group can use. Everything starts on what their role gives (marked with a dot). Change a module, or open Customize to switch single actions on or off.'}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, gap: 3, alignItems: 'start' }}>
        {/* ── Team list ─────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{ ...cardSx, p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search team"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: COLORS.TEXT_MUTED }} /></InputAdornment> }}
            sx={{ mb: 1.5 }}
          />
          {!isBranchAdminOnly && branches.length > 1 && (
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <Select displayEmpty value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
                <MenuItem value="">All branches</MenuItem>
                {branches.map((b) => (
                  <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {membersError && <Alert severity="error" sx={{ mb: 1.5 }}>Couldn't load your team: {errorMessage(membersError)}</Alert>}
          {membersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={28} /></Box>
          ) : filteredMembers.length === 0 ? (
            <Typography sx={{ py: 4, textAlign: 'center', color: COLORS.TEXT_SECONDARY, fontSize: fontSize.lg }}>No team members found.</Typography>
          ) : (
            <List disablePadding sx={{ maxHeight: { md: 'calc(100vh - 300px)' }, overflowY: 'auto' }}>
              {filteredMembers.map((m) => {
                const id = memberId(m);
                return (
                  <MemberListItem
                    key={id}
                    member={m}
                    selected={id === selectedId}
                    editable={canEditMember({ actorIsBranchAdminOnly: isBranchAdminOnly, actorId, member: m })}
                    onClick={() => selectMember(id)}
                  />
                );
              })}
            </List>
          )}
        </Paper>

        {/* ── Module access for the selected member ─────────────────── */}
        <Paper elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
          {!selected ? (
            <Box sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <ManageAccountsOutlined sx={{ fontSize: 40, color: COLORS.TEXT_MUTED, mb: 1 }} />
              <Typography sx={{ fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>Select a team member</Typography>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>Their module access will show here.</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 2.5, borderBottom: `1px solid ${COLORS.BORDER}`, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{ fontWeight: fontWeight.bold, fontSize: '16px', color: COLORS.TEXT_PRIMARY }}>{memberName(selected)}</Typography>
                  <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
                    {selected.email} · {memberRoleLabel(selected)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                  {(selected.branchIds || []).map((bId) => (
                    <Chip key={bId} size="small" label={branches.find((b) => String(b.id) === String(bId))?.name || bId} sx={{ bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT, fontWeight: fontWeight.semibold }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {!editable && (
                  <Alert severity="info" icon={<LockOutlined fontSize="small" />}>
                    {isBranchAdminOnly
                      ? 'Admin accounts are managed by your group admin.'
                      : 'Group admin accounts are managed by your platform admin.'}
                  </Alert>
                )}
                {accessError && <Alert severity="error">Couldn't load module access: {errorMessage(accessError)}</Alert>}
                {updateMutation.error && <Alert severity="error" onClose={() => updateMutation.reset()}>Couldn't save: {errorMessage(updateMutation.error)}</Alert>}

                {editable && accessLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={28} /></Box>
                )}

                {editable && !accessLoading && modules.map((module) => (
                  <ModuleAccessRow
                    key={module.key}
                    module={module}
                    levelOverride={draft.modules[module.key]}
                    featureOverrides={draft.features}
                    expanded={!!expanded[module.key]}
                    disabled={updateMutation.isPending}
                    onToggleExpand={() => setExpanded((prev) => ({ ...prev, [module.key]: !prev[module.key] }))}
                    onLevelChange={(level) => setLevel(module, level)}
                    onFeatureChange={(feature, on) => setFeature(module, feature, on)}
                    onReset={() => resetModule(module)}
                  />
                ))}
              </Box>

              {editable && !accessError && (
                <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, bgcolor: COLORS.SURFACE_FOOTER }}>
                  {isDirty && (
                    <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mr: 'auto' }}>
                      {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
                    </Typography>
                  )}
                  <Button onClick={() => setDraft(saved)} disabled={!isDirty || updateMutation.isPending}>Discard</Button>
                  <Button variant="contained" onClick={handleSave} disabled={!isDirty || updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving…' : 'Save changes'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>

      <Dialog open={!!pendingSelectId} onClose={() => setPendingSelectId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Discard unsaved changes?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: fontSize.lg, color: COLORS.TEXT_SECONDARY }}>
            You have unsaved access changes for {memberName(selected)}. Switching will discard them.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingSelectId(null)}>Keep editing</Button>
          <Button color="error" variant="contained" onClick={confirmSwitch}>Discard</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default TeamAccessPage;
