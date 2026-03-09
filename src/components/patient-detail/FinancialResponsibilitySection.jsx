import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const sectionTitleSx = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'primary.main',
  mb: 1.5,
};

export default function FinancialResponsibilitySection() {
  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        <InfoIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
        Financial Responsibility
      </Typography>
      <RadioGroup defaultValue="hoh" name="financialResponsibility" sx={{ mt: 0.5 }}>
        <FormControlLabel value="self" control={<Radio size="small" />} label="Self" />
        <FormControlLabel value="hoh" control={<Radio size="small" />} label="HOH responsible" />
      </RadioGroup>
    </Box>
  );
}
