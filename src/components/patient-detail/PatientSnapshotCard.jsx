import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { usePatientBalance } from '../../hooks/redux/usePatient';
import { formatDate } from './utils';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

const SnapshotRow = ({ label, value, valueColor }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.medium, color: valueColor || COLORS.TEXT_PRIMARY }}>
      {value}
    </Typography>
  </Box>
);

// Extracts whatever numeric balance shape the invoice API returns
// (`{ balance }`, `{ totalBalance }`, a bare number, etc.) without assuming
// one specific field name.
const readBalanceAmount = (data) => {
  if (data == null) return null;
  if (typeof data === 'number') return data;
  return data.balance ?? data.totalBalance ?? data.total ?? null;
};

// At-a-glance financial/appointment summary — chart #, balance, last/next
// visit, insurance, referral source. New card, not present in the previous
// plain-form layout; balance comes from the same usePatientBalance cache
// used elsewhere in the app (e.g. the header patient search card).
export default function PatientSnapshotCard({ patient, patientNumber }) {
  const patientId = patient?._id || patient?.id;
  const { fetchBalance, getBalance } = usePatientBalance();

  useEffect(() => {
    if (patientId) fetchBalance(patientId);
  }, [patientId, fetchBalance]);

  const balanceData = patientId ? getBalance(patientId) : null;
  const balanceAmount = readBalanceAmount(balanceData);
  const balanceText = balanceAmount != null ? `$${Number(balanceAmount).toFixed(2)}` : '—';

  const lastVisit = patient?.lastVisitDate ? formatDate(patient.lastVisitDate) : '—';
  const nextAppt = patient?.nextAppointmentDate ? formatDate(patient.nextAppointmentDate) : '—';
  const insurance = patient?.primaryInsurance?.name || patient?.insuranceName || 'No active';
  const referredBy = patient?.customFields?.referringPatient || patient?.referralSource || '—';

  return (
    <Box>
      <SnapshotRow label="Chart #" value={patientNumber || patient?.patientCode || '—'} />
      <SnapshotRow label="Balance" value={balanceText} valueColor={balanceAmount ? COLORS.STATUS_WARNING : undefined} />
      <SnapshotRow label="Last visit" value={lastVisit} />
      <SnapshotRow label="Next appt" value={nextAppt} />
      <SnapshotRow label="Insurance" value={insurance} />
      <SnapshotRow label="Referred by" value={referredBy} />
    </Box>
  );
}
