import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { INJURY_TYPES } from '../../constants/cobConstants';

/**
 * "Is this visit because of an injury?" — on the claim / encounter screen.
 *
 * This lives on the CLAIM and never on the coverage, because injury
 * relatedness is a property of the visit: the same workers' comp policy is
 * primary for the back injury and irrelevant for the flu shot two weeks later.
 * Storing it on the coverage would make every future claim inherit an answer
 * that was only ever true once.
 */
const InjuryQuestions = ({ injuryRelated, injuryType, onChange, disabled = false }) => (
  <Box
    data-testid="cob-injury-questions"
    sx={{
      border: `1px solid ${COLORS.BORDER}`,
      borderRadius: radius.lg,
      p: 1.75,
      backgroundColor: COLORS.SURFACE_CARD,
    }}
  >
    <Typography
      component="h4"
      sx={{
        fontFamily: 'Inter',
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: COLORS.TEXT_PRIMARY,
        mb: 1,
      }}
    >
      Is this visit because of an injury?
    </Typography>

    <FormControl component="fieldset" disabled={disabled}>
      <FormLabel
        component="legend"
        sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}
      >
        If it is, a different insurer may have to pay first.
      </FormLabel>
      <RadioGroup
        row
        name="injuryRelated"
        value={injuryRelated == null ? '' : String(injuryRelated)}
        onChange={(e) =>
          onChange?.({
            injuryRelated: e.target.value === 'true',
            // Clear the type when the answer flips to "no" so a stale
            // workers'-comp marker cannot ride along on an unrelated claim.
            injuryType: e.target.value === 'true' ? injuryType ?? null : null,
          })
        }
        data-testid="cob-injury-related"
      >
        <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
        <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
      </RadioGroup>
    </FormControl>

    {injuryRelated === true && (
      <FormControl component="fieldset" disabled={disabled} sx={{ mt: 1 }} data-testid="cob-injury-type-section">
        <FormLabel
          component="legend"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}
        >
          What kind of injury?
        </FormLabel>
        <RadioGroup
          row
          name="injuryType"
          value={injuryType || ''}
          onChange={(e) => onChange?.({ injuryRelated: true, injuryType: e.target.value })}
          data-testid="cob-injury-type"
        >
          {INJURY_TYPES.map((type) => (
            <FormControlLabel
              key={type.value}
              value={type.value}
              control={<Radio size="small" />}
              label={type.label}
              sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Inter', fontSize: fontSize.base } }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )}
  </Box>
);

export default InjuryQuestions;
