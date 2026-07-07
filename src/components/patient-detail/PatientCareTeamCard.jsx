import { Box, Stack, Typography } from '@mui/material';
import InitialsAvatar from '../shared/InitialsAvatar';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const providerName = (provider) => {
  if (!provider) return null;
  if (provider.userId?.firstName || provider.userId?.lastName) {
    return `${provider.userId?.firstName || ''} ${provider.userId?.lastName || ''}`.trim();
  }
  return `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || null;
};

const findProvider = (providers, id) => {
  if (!id) return null;
  return providers.find((p) => (p._id || p.id)?.toString() === id.toString()) || null;
};

const CareTeamRow = ({ role, provider }) => {
  const name = providerName(provider);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        backgroundColor: COLORS.SURFACE_INPUT,
        borderRadius: radius.md,
        px: 1.5,
        py: 1.25,
      }}
    >
      <InitialsAvatar name={name || '?'} size={32} fontSize={12} bg={COLORS.ACCENT} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.4 }}>
          {role}
        </Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.medium, color: name ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
          {name || 'Not assigned'}
        </Typography>
      </Box>
    </Box>
  );
};

// Dentist/Hygienist assigned to this patient — pulled out of the old
// "Care Team Providers" preference block (buried under a divider below the
// main form grid) into its own card in the left column, next to Patient
// Details, matching the target design.
export default function PatientCareTeamCard({ patient, providers = [] }) {
  const dentistId = patient?.preferredDentistId || patient?.customFields?.preferredDentistId;
  const hygienistId = patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId;

  return (
    <Stack spacing={1.5}>
      <CareTeamRow role="Dentist" provider={findProvider(providers, dentistId)} />
      <CareTeamRow role="Hygienist" provider={findProvider(providers, hygienistId)} />
    </Stack>
  );
}
