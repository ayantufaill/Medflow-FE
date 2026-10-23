import { Alert, Box, Chip, Divider, Typography } from '@mui/material';
import BaseDialog from '../../shared/BaseDialog';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import { ELIGIBILITY_STATUS } from '../utils/eligibilityStatus';

const money = (n) => (n == null ? '-' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

// Stedi dates come back as YYYYMMDD or YYYYMMDD-YYYYMMDD.
const formatStediDate = (value) => {
  if (!value) return null;
  return String(value)
    .split('-')
    .map((d) => (/^\d{8}$/.test(d) ? `${d.slice(4, 6)}/${d.slice(6, 8)}/${d.slice(0, 4)}` : d))
    .join(' – ');
};

const Row = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.5 }}>
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>{label}</Typography>
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{value ?? '-'}</Typography>
  </Box>
);

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, mt: 2, mb: 0.5 }}>
    {children}
  </Typography>
);

const amountLabel = (row) =>
  [row.coverageLevel, row.isRemaining ? 'Remaining' : row.timePeriod, row.serviceTypes?.length && !row.serviceTypes.includes('Dental Care') ? row.serviceTypes.join(', ') : null]
    .filter(Boolean)
    .join(' · ');

const NetworkSummary = ({ title, data }) => {
  const empty = !data.coinsurance.length && !data.deductibles.length && !data.maximums.length;
  return (
    <Box sx={{ flex: 1, minWidth: 260 }}>
      <SectionTitle>{title}</SectionTitle>
      <Divider sx={{ mb: 0.5 }} />
      {empty && (
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_MUTED, py: 0.5 }}>
          Payer returned no details for this network.
        </Typography>
      )}
      {data.coinsurance.map((c, i) => (
        <Row
          key={`c${i}`}
          label={`${c.serviceTypes.join(', ')}${c.notes?.length ? ` (${c.notes.join(', ')})` : ''}`}
          value={c.insurancePercent == null ? '-' : `Ins ${c.insurancePercent}% / Pt ${c.patientPercent}%`}
        />
      ))}
      {data.deductibles.map((d, i) => (
        <Row key={`d${i}`} label={`Deductible · ${amountLabel(d)}`} value={money(d.amount)} />
      ))}
      {data.maximums.map((m, i) => (
        <Row key={`m${i}`} label={`Maximum · ${amountLabel(m)}`} value={money(m.amount)} />
      ))}
    </Box>
  );
};

export default function EligibilityResultDialog({ open, onClose, result }) {
  if (!result) return null;
  const status = ELIGIBILITY_STATUS[result.status] ?? ELIGIBILITY_STATUS.error;
  const dates = result.plan?.dates || {};
  const authRequired = (result.benefits || []).filter((b) => b.authRequired);

  return (
    <BaseDialog open={open} onClose={onClose} title="Eligibility Check" maxWidth="md" showCloseButton>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
        <Chip label={status.label} size="small" sx={{ bgcolor: status.color, color: COLORS.WHITE, fontWeight: fontWeight.semibold }} />
        {result.mock && <Chip label="MOCK DATA" size="small" variant="outlined" color="warning" />}
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>
          Checked {new Date(result.checkedAt).toLocaleString()} · Date of service {formatStediDate(result.dateOfService)}
        </Typography>
      </Box>

      {result.errors?.map((e, i) => (
        <Alert key={i} severity="error" sx={{ mb: 1 }}>
          {e.description}
          {e.followupAction ? ` — ${e.followupAction}` : ''}
        </Alert>
      ))}

      <SectionTitle>Plan</SectionTitle>
      <Divider sx={{ mb: 0.5 }} />
      <Row label="Payer" value={`${result.payer?.name ?? '-'} (${result.payer?.id ?? '-'})`} />
      <Row label="Group" value={[result.plan?.groupName, result.plan?.groupNumber].filter(Boolean).join(' · ') || '-'} />
      <Row label="Plan begin" value={formatStediDate(dates.planBegin || dates.eligibilityBegin || dates.plan)} />
      {dates.planEnd && <Row label="Plan end" value={formatStediDate(dates.planEnd)} />}

      {result.status === 'active' && (
        <>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <NetworkSummary title="In Network" data={result.summary.inNetwork} />
            <NetworkSummary title="Out of Network" data={result.summary.outOfNetwork} />
          </Box>
          {authRequired.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Prior authorization required: {[...new Set(authRequired.flatMap((b) => b.serviceTypes))].join(', ')}
            </Alert>
          )}
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_MUTED, mt: 2 }}>
            The payer lists both networks; which one applies depends on whether this provider is contracted with the plan.
          </Typography>
        </>
      )}
    </BaseDialog>
  );
}
