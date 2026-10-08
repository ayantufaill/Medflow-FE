import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { useDebounce } from 'use-debounce';
import PlanMasterActionBar from '../../components/admin/insurance-management/plan-master/PlanMasterActionBar';
import PlanMasterTable from '../../components/admin/insurance-management/plan-master/PlanMasterTable';
import PlanMasterEditDialog from '../../components/admin/insurance-management/plan-master/PlanMasterEditDialog';
import PlanMasterHistoryDialog from '../../components/admin/insurance-management/plan-master/PlanMasterHistoryDialog';
import { usePermissions } from '../../hooks/usePermissions';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useCobPlans, useUpdateCobPlan } from '../../hooks/queries/useCob';
import { useInsuranceCatalog } from '../../hooks/redux/useInsuranceCatalog';
import { COB_PERMISSIONS } from '../../constants/cobConstants';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { getErrorMessage } from '../../utils/errorUtils';

/**
 * Admin → Insurance Management → Plan Coordination.
 *
 * This is master data, not per-patient data: the settings here are inherited
 * by every patient carrying the plan, which is exactly why editing is behind
 * `insurance.plan_master.edit` and why the edit dialog shows the number of
 * patients a change would re-evaluate.
 *
 * Read access follows the surrounding admin area (ADMIN_GROUP on the route);
 * only the write path is permission-gated, so a billing coordinator can look
 * things up without being able to change them.
 */
const CobPlanMaster = () => {
  const { has } = usePermissions();
  const { showSnackbar } = useSnackbar();
  const canRead = has(COB_PERMISSIONS.PLAN_MASTER_READ);
  const canEdit = has(COB_PERMISSIONS.PLAN_MASTER_EDIT);

  const [search, setSearch] = useState('');
  const [carrierId, setCarrierId] = useState('');
  const [unconfirmedOnly, setUnconfirmedOnly] = useState(false);
  // Matches the 500ms the other admin list pages use, so typing feels the same.
  const [debouncedSearch] = useDebounce(search, 500);

  const [editPlan, setEditPlan] = useState(null);
  const [historyPlan, setHistoryPlan] = useState(null);

  const filters = useMemo(
    () => ({ page: 1, limit: 50, search: debouncedSearch, carrierId, unconfirmedOnly }),
    [debouncedSearch, carrierId, unconfirmedOnly]
  );

  const plansQuery = useCobPlans(filters, { enabled: canRead });
  const updatePlan = useUpdateCobPlan();

  // Carrier list is already in the Redux insurance catalog that the rest of
  // the insurance admin area uses; no reason to fetch it a second time.
  const { companies, fetchCompanies } = useInsuranceCatalog();

  // The catalog hook is a selector only — nothing fetches on its own, so the
  // first screen to need carriers asks for them.
  useEffect(() => {
    if (!companies?.length) fetchCompanies();
  }, [companies?.length, fetchCompanies]);

  const carriers = useMemo(
    () =>
      (companies || []).map((company) => ({
        id: company._id || company.id,
        name: company.name || company.companyName,
      })),
    [companies]
  );

  const plans = plansQuery.data?.plans || [];

  const handleSave = async (payload) => {
    try {
      const result = await updatePlan.mutateAsync({ planId: editPlan.planId, payload });
      // The response carries the re-evaluation that actually happened, so the
      // confirmation reports the real number rather than the prediction.
      const reEvaluated = result?.reEvaluated?.length ?? 0;
      showSnackbar(
        reEvaluated > 0
          ? `Saved. ${reEvaluated} patient${reEvaluated === 1 ? '' : 's'} had their insurance order worked out again.`
          : 'Plan coordination settings saved.',
        'success'
      );
      setEditPlan(null);
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#FBFCFE',
        borderRadius: radius.lg,
        border: `1px solid ${COLORS.BORDER}`,
        minHeight: '100vh',
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily: 'Inter',
          fontSize: '18px',
          fontWeight: fontWeight.semibold,
          color: COLORS.TEXT_PRIMARY,
          mb: 0.5,
        }}
      >
        Plan coordination settings
      </Typography>
      <Typography
        sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2.5 }}
      >
        How each plan coordinates benefits with other insurance. These settings decide the
        suggested insurance order for every patient carrying the plan.
      </Typography>

      {!canRead ? (
        <Alert severity="info" data-testid="plan-master-no-permission" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
          You don&apos;t have permission to view plan coordination settings.
        </Alert>
      ) : (
        <>
          {!canEdit && (
            <Alert severity="info" data-testid="plan-master-readonly" sx={{ mb: 2, fontFamily: 'Inter', fontSize: fontSize.base }}>
              You can view these settings. Changing them needs the plan master-data permission.
            </Alert>
          )}

          <PlanMasterActionBar
            search={search}
            onSearchChange={setSearch}
            carrierId={carrierId}
            onCarrierChange={setCarrierId}
            unconfirmedOnly={unconfirmedOnly}
            onUnconfirmedOnlyChange={setUnconfirmedOnly}
            carriers={carriers}
            total={plansQuery.data?.total ?? plans.length}
          />

          <PlanMasterTable
            plans={plans}
            loading={plansQuery.isLoading}
            error={plansQuery.isError}
            canEdit={canEdit}
            onEdit={setEditPlan}
            onHistory={setHistoryPlan}
          />
        </>
      )}

      <PlanMasterEditDialog
        open={!!editPlan}
        plan={editPlan}
        onClose={() => setEditPlan(null)}
        onSave={handleSave}
        saving={updatePlan.isPending}
      />

      <PlanMasterHistoryDialog
        open={!!historyPlan}
        plan={historyPlan}
        onClose={() => setHistoryPlan(null)}
      />
    </Box>
  );
};

export default CobPlanMaster;
