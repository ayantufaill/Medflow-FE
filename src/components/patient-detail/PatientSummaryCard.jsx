import { Box, Typography } from '@mui/material';
import InitialsAvatar from '../shared/InitialsAvatar';
import { computeAge } from './utils';
import { formatDate } from '../../utils/dateUtils';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

// "27 Jun 1983" — compact UTC-safe DOB format used in the header.
const formatShortDate = (dateString) => {
  if (!dateString) return null;
  const res = formatDate(dateString, 'DD MMM YYYY');
  return res === '-' ? null : res;
};

// Header identity block: avatar, name, DOB/age/chart# on one line, email/phone
// on the next — compact single-row treatment instead of the previous large
// 88px avatar + two-line summary.
export default function PatientSummaryCard({ patient, patientNumber, onProfileClick }) {
  const age = computeAge(patient?.dateOfBirth);
  const dob = formatShortDate(patient?.dateOfBirth);
  const chartNumber = patientNumber || patient?.patientCode;
  const phone = patient?.phonePrimary || patient?.phoneSecondary;

  const detailParts = [
    dob && `DOB ${dob}`,
    age != null && `${age} y`,
    chartNumber && `pt #${chartNumber}`,
  ].filter(Boolean);

  const contactParts = [patient?.email, phone].filter(Boolean);

  return (
    <Box
      onClick={onProfileClick}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, cursor: onProfileClick ? 'pointer' : 'default' }}
    >
      <InitialsAvatar
        name={`${patient?.firstName || ''} ${patient?.lastName || ''}`}
        size={40}
        fontSize={13}
        bg={COLORS.ACCENT}
      />
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap', rowGap: 0 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY, lineHeight: 1.3, whiteSpace: 'nowrap' }}>
            {patient?.firstName} {patient?.lastName}
          </Typography>
          {detailParts.length > 0 && (
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED, whiteSpace: 'nowrap' }}>
              {detailParts.join(' · ')}
            </Typography>
          )}
        </Box>
        {contactParts.length > 0 && (
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
            {contactParts.join(' · ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
