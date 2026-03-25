import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { sectionTitleSx } from '../../constants/styles';

export default function FinancialResponsibilitySection({ patient }) {
  const responsibility = patient?.financialResponsibility || {};
  const value = responsibility?.type || 'hoh';
  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        <InfoIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
        Financial Responsibility
      </Typography>
      <RadioGroup value={value} name="financialResponsibility" sx={{ mt: 0.5 }}>
        <FormControlLabel value="self" control={<Radio size="small" />} label="Self" />
        <FormControlLabel value="hoh" control={<Radio size="small" />} label="HOH responsible" />
      </RadioGroup>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {responsibility?.name || responsibility?.displayName || 'No responsible party selected'}
      </Typography>
    </Box>
  );
}
