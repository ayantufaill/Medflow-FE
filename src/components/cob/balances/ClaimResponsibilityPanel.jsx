import { Alert, Typography } from '@mui/material';
import { ReceiptLongOutlined as ReceiptIcon } from '@mui/icons-material';
import SectionCard from '../../shared/SectionCard';
import ResponsibilityBalanceTable from './ResponsibilityBalanceTable';
import SecondaryClaimButton from './SecondaryClaimButton';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { COLORS } from '../../../constants/colors';
import { fontSize } from '../../../constants/styles';
import { ESTIMATE_LABEL } from '../../../constants/cobConstants';
import { getErrorMessage } from '../../../utils/errorUtils';
import {
  useInvoiceResponsibility,
  useSecondaryClaimReadiness,
  useGenerateSecondaryClaim,
} from '../../../hooks/queries/useCob';

/**
 * The claim-screen balance panel: who owes what, plus the gated
 * "create secondary claim" action.
 *
 * Keyed by INVOICE for the balance (one invoice is what a patient receives and
 * what the responsibility ledger is written against) and by CLAIM for the
 * secondary gate (readiness is a property of the primary claim's remittance).
 *
 * Kept separate from CoverageOrderPanel because the two read different
 * endpoints and must fail independently — a balance endpoint being down should
 * never hide the coverage order.
 */
const ClaimResponsibilityPanel = ({ claimId, invoiceId, estimatesByParty }) => {
  const { showSnackbar } = useSnackbar();

  const breakdown = useInvoiceResponsibility(invoiceId);
  const readiness = useSecondaryClaimReadiness(claimId);
  const generateSecondary = useGenerateSecondaryClaim();

  const handleCreate = async () => {
    try {
      await generateSecondary.mutateAsync(claimId);
      showSnackbar('Secondary claim created.', 'success');
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  };

  const hasEstimates = Object.keys(estimatesByParty || {}).length > 0;

  return (
    <SectionCard
      icon={ReceiptIcon}
      title="Balance by responsible party"
      subtitle="Insurance, then the patient"
      action={
        claimId ? (
          <SecondaryClaimButton
            readiness={readiness.data}
            creating={generateSecondary.isPending}
            onCreate={handleCreate}
          />
        ) : null
      }
    >
      {/* Called out once above the table as well as per-row: the per-row chip
          answers "is this figure firm?" and this line answers "why is anything
          on this screen an estimate at all?". */}
      {hasEstimates && (
        <Alert
          severity="info"
          data-testid="cob-estimates-notice"
          sx={{ mb: 2, fontFamily: 'Inter', fontSize: fontSize.base }}
        >
          Insurers below that haven&apos;t paid yet are shown as an {ESTIMATE_LABEL.toLowerCase()}.
          Each one firms up when its remittance is posted.
        </Alert>
      )}

      {!invoiceId ? (
        <Typography
          data-testid="cob-balance-no-invoice"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, py: 2 }}
        >
          This claim isn&apos;t linked to an invoice yet, so there is no balance to split.
        </Typography>
      ) : (
        <ResponsibilityBalanceTable
          data={breakdown.data}
          estimatesByParty={estimatesByParty}
          loading={breakdown.isLoading}
          error={breakdown.isError ? breakdown.error : null}
        />
      )}

      {/* The gate's reason in full, because the tooltip is easy to miss. */}
      {readiness.data && readiness.data.posted !== true && (
        <Typography
          data-testid="cob-secondary-blocked-reason"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY, mt: 1.5 }}
        >
          {readiness.data.reason ||
            "Waiting on the primary insurer's payment before the secondary claim can be created."}
        </Typography>
      )}

      {/* Once posted, the figures the secondary will actually carry. */}
      {readiness.data?.posted === true && (
        <Typography
          data-testid="cob-primary-remittance-summary"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY, mt: 1.5 }}
        >
          The secondary claim will carry the primary&apos;s adjudication: paid{' '}
          {readiness.data.paidAmount?.toFixed?.(2) ?? readiness.data.paidAmount}, allowed{' '}
          {readiness.data.allowedAmount?.toFixed?.(2) ?? readiness.data.allowedAmount}, patient
          responsibility{' '}
          {readiness.data.patientResponsibility?.toFixed?.(2) ??
            readiness.data.patientResponsibility}
          {readiness.data.adjustments?.length
            ? ` and ${readiness.data.adjustments.length} adjustment code${
                readiness.data.adjustments.length === 1 ? '' : 's'
              }`
            : ''}
          .
        </Typography>
      )}
    </SectionCard>
  );
};

export default ClaimResponsibilityPanel;
