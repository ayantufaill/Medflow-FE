import { Box, Typography } from '@mui/material';
import { formatDate } from './utils';
import { InlineFieldRow } from './InlineField';
import { sectionTitleSx } from '../../constants/styles';

/**
 * Additional Information (and optionally Spouse Information).
 */
export default function AdditionalInformationSection({ patient, showSpouse = true }) {
  return (
    <Box sx={showSpouse ? { mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' } : {}}>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        Additional Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow label="Referred By" value={patient?.referralSource} />
        <InlineFieldRow label="Last Visit Date" value={formatDate(patient?.lastVisitDate)} />
        <InlineFieldRow label="Portal Access" value={patient?.portalAccessEnabled ? 'Yes' : 'No'} />
      </Box>

      {showSpouse && (
        <>
          <Typography variant="subtitle1" sx={{ ...sectionTitleSx, mt: 2.5 }}>
            Spouse Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <InlineFieldRow label="Spouse Name" value={patient?.spouseInfo?.name || ''} />
            <InlineFieldRow label="Spouse Phone" value={patient?.spouseInfo?.phone || ''} />
            <InlineFieldRow label="Email Address" value={patient?.spouseInfo?.email || ''} />
          </Box>
        </>
      )}
    </Box>
  );
}
