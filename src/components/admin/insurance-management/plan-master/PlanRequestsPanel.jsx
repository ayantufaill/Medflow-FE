import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BaseDialog from '../../../shared/BaseDialog';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import { formatDate } from '../../../../utils/dateUtils';
import { getErrorMessage } from '../../../../utils/errorUtils';
import { usePlanRequests, useResolvePlanRequest } from '../../../../hooks/queries/useCob';

/**
 * The "plans waiting to be added" worklist.
 *
 * This is the other half of the front desk's "the plan isn't in this list"
 * flow, and without it that flow is a message into the void. It sits above the
 * plan table because it is a queue: a request left open means a coverage
 * somewhere is attached to no plan, and its patient's order is stuck on
 * NEEDS_INFO.
 *
 * Resolving requires pointing at the plan that was created. "Resolved" with
 * nothing to point at is indistinguishable from "ignored" a month later, and
 * the front desk's coverage still needs a plan to attach to — so the backend
 * requires `planId`, and this form collects it.
 */
const PlanRequestsPanel = ({ canResolve, plans = [] }) => {
  const { showSnackbar } = useSnackbar();
  const requestsQuery = usePlanRequests({ status: 'OPEN' });
  const resolveRequest = useResolvePlanRequest();

  const [resolving, setResolving] = useState(null);
  const [planId, setPlanId] = useState('');
  const [note, setNote] = useState('');
  const [mode, setMode] = useState('RESOLVED');

  const requests = requestsQuery.data?.requests || [];

  const open = (request) => {
    setResolving(request);
    setPlanId('');
    setNote('');
    setMode('RESOLVED');
  };

  const submit = async () => {
    try {
      await resolveRequest.mutateAsync({
        requestId: resolving.id,
        status: mode,
        planId: mode === 'RESOLVED' ? planId : undefined,
        resolutionNote: note.trim() || undefined,
      });
      showSnackbar(
        mode === 'RESOLVED' ? 'Plan request closed.' : 'Plan request declined.',
        'success'
      );
      setResolving(null);
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  };

  // Nothing waiting is the normal state — an empty box every day teaches
  // people to stop looking at this area.
  if (!requestsQuery.isLoading && !requestsQuery.isError && requests.length === 0) return null;

  const canSubmit = mode === 'RESOLVED' ? !!planId : note.trim().length > 0;

  return (
    <>
      <Box
        data-testid="plan-requests-panel"
        sx={{
          mb: 2.5,
          border: `1px solid ${COLORS.BORDER}`,
          borderLeft: `3px solid ${COLORS.STATUS_WARNING}`,
          borderRadius: radius.lg,
          backgroundColor: COLORS.SURFACE_CARD,
          p: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Typography
            component="h3"
            sx={{
              fontFamily: 'Inter',
              fontSize: fontSize.md,
              fontWeight: fontWeight.semibold,
              color: COLORS.TEXT_PRIMARY,
            }}
          >
            Plans waiting to be added
          </Typography>
          {requests.length > 0 && (
            <Chip
              size="small"
              label={requests.length}
              data-testid="plan-requests-count"
              sx={{
                height: 20,
                fontFamily: 'Inter',
                fontSize: fontSize.xs,
                fontWeight: fontWeight.semibold,
                borderRadius: radius.pill,
                color: COLORS.STATUS_WARNING,
                backgroundColor: 'rgba(234, 88, 12, 0.10)',
              }}
            />
          )}
        </Stack>

        <Typography
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 1.5 }}
        >
          The front desk found these on a card but couldn&apos;t pick them from the list. Until each
          one is added, the patient&apos;s insurance order can&apos;t be worked out.
        </Typography>

        {requestsQuery.isLoading ? (
          <Stack alignItems="center" sx={{ py: 2 }} data-testid="plan-requests-loading">
            <CircularProgress size={20} />
          </Stack>
        ) : requestsQuery.isError ? (
          <Alert severity="error" data-testid="plan-requests-error" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
            We couldn&apos;t load the plan requests.
          </Alert>
        ) : (
          <Box component="ul" sx={{ m: 0, p: 0 }}>
            {requests.map((request) => (
              <Box
                component="li"
                key={request.id}
                data-testid={`plan-request-${request.id}`}
                sx={{
                  listStyle: 'none',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  py: 1,
                  borderTop: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: fontSize.base,
                      fontWeight: fontWeight.medium,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {request.planName}
                    {request.carrierName ? ` — ${request.carrierName}` : ''}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>
                    {[
                      request.groupNumber ? `Group ${request.groupNumber}` : '',
                      request.payerPhone ? `Phone ${request.payerPhone}` : '',
                      `Asked ${formatDate(request.createdAt)}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                  {request.note && (
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_SECONDARY,
                        fontStyle: 'italic',
                      }}
                    >
                      “{request.note}”
                    </Typography>
                  )}
                </Box>

                {canResolve && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => open(request)}
                    data-testid={`plan-request-resolve-${request.id}`}
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: fontSize.base,
                      textTransform: 'none',
                      borderRadius: radius.md,
                      borderColor: COLORS.BORDER,
                      color: COLORS.TEXT_BODY,
                    }}
                  >
                    Close this
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <BaseDialog
        open={!!resolving}
        onClose={() => setResolving(null)}
        title={`Close request — ${resolving?.planName || ''}`}
        maxWidth="sm"
        loading={resolveRequest.isPending}
        showCloseButton
        actions={
          <>
            <Button
              onClick={() => setResolving(null)}
              sx={{ fontFamily: 'Inter', fontSize: fontSize.base, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={submit}
              disabled={!canSubmit || resolveRequest.isPending}
              data-testid="plan-request-submit"
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.semibold,
                textTransform: 'none',
                borderRadius: radius.md,
                backgroundColor: COLORS.ACCENT,
                '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
              }}
            >
              {mode === 'RESOLVED' ? 'Close and link the plan' : 'Decline the request'}
            </Button>
          </>
        }
      >
        <TextField
          select
          fullWidth
          label="What happened?"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          data-testid="plan-request-mode"
          SelectProps={{ inputProps: { 'aria-label': 'What happened?' } }}
          sx={{ mb: 2 }}
        >
          <MenuItem value="RESOLVED">I added the plan</MenuItem>
          <MenuItem value="REJECTED">This isn&apos;t a plan we need</MenuItem>
        </TextField>

        {mode === 'RESOLVED' ? (
          <TextField
            select
            fullWidth
            required
            label="Which plan did you add?"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            data-testid="plan-request-plan"
            SelectProps={{ inputProps: { 'aria-label': 'Which plan did you add?' } }}
            helperText="The front desk's coverage will be attached to this plan."
          >
            {plans.map((plan) => (
              <MenuItem key={plan.planId} value={plan.planId}>
                {[plan.carrierName, plan.planName].filter(Boolean).join(' — ')}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Alert severity="info" sx={{ mb: 2, fontFamily: 'Inter', fontSize: fontSize.base }}>
            Declining tells whoever asked, so say why — they are looking at a patient&apos;s card.
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          minRows={2}
          required={mode === 'REJECTED'}
          label="Note for whoever asked"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          inputProps={{ 'aria-label': 'Note for whoever asked' }}
          data-testid="plan-request-note"
          sx={{ mt: 2 }}
        />
      </BaseDialog>
    </>
  );
};

export default PlanRequestsPanel;
