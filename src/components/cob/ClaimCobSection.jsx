import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import CoverageOrderPanel from './CoverageOrderPanel';
import InjuryQuestions from './InjuryQuestions';
import ClaimResponsibilityPanel from './balances/ClaimResponsibilityPanel';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useEvaluateOrder } from '../../hooks/queries/useCob';
import { getErrorMessage } from '../../utils/errorUtils';

/**
 * Everything coordination-of-benefits on a claim screen, in one block.
 *
 * `dateOfService` is passed straight through to the order panel: a claim must
 * bill the order that was effective on the date of service, not today's. The
 * panel puts a note on screen when the two differ.
 *
 * The injury question sits here rather than on the coverage form because
 * injury relatedness belongs to the visit: the same workers' comp policy is
 * primary for the back injury and irrelevant for the flu shot.
 *
 * There is no endpoint that stores injury relatedness on a claim — the backend
 * takes it as CLAIM CONTEXT on the evaluate call
 * (`evaluateOrderValidator.injuryRelated` / `injuryType`), which is the same
 * modelling decision from the other side: it is an input to the ranking for
 * this date of service, not a stored property of a coverage. So answering the
 * question re-runs the rules with that context.
 */
const ClaimCobSection = ({
  claimId,
  patientId,
  invoiceId,
  dateOfService,
  initialInjuryRelated = null,
  initialInjuryType = null,
  carriers = [],
  onOpenClaim,
  onEditCoverage,
}) => {
  const { showSnackbar } = useSnackbar();
  const evaluateOrder = useEvaluateOrder(patientId);

  const [injury, setInjury] = useState({
    injuryRelated: initialInjuryRelated,
    injuryType: initialInjuryType,
  });

  // Keep in step with the claim once it has loaded.
  useEffect(() => {
    setInjury({ injuryRelated: initialInjuryRelated, injuryType: initialInjuryType });
  }, [initialInjuryRelated, initialInjuryType]);

  const handleInjuryChange = async (next) => {
    setInjury(next);

    // "Yes" with no type yet is an incomplete answer — hold the save until the
    // user says which kind of injury, so the backend never sees `injuryRelated`
    // without the type it needs to pick a payer.
    if (next.injuryRelated === true && !next.injuryType) return;

    try {
      await evaluateOrder.mutateAsync({
        dateOfService,
        triggerReason: 'CLAIM_INJURY_CONTEXT',
        injuryRelated: next.injuryRelated,
        injuryType: next.injuryType,
      });
      showSnackbar('Insurance order worked out again for this visit.', 'success');
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  };

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Box>
        <InjuryQuestions
          injuryRelated={injury.injuryRelated}
          injuryType={injury.injuryType}
          onChange={handleInjuryChange}
          disabled={evaluateOrder.isPending}
        />
      </Box>

      <CoverageOrderPanel
        patientId={patientId}
        dateOfService={dateOfService}
        carriers={carriers}
        onEditCoverage={onEditCoverage}
        onOpenClaim={onOpenClaim}
      />

      {/* The panel fetches its own downstream estimates — one call keyed on
          the claim, rather than this component assembling them. */}
      <ClaimResponsibilityPanel claimId={claimId} invoiceId={invoiceId} />
    </Stack>
  );
};

export default ClaimCobSection;
