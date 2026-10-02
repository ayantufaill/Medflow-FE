import { Box, Typography, TextField, MenuItem, Tooltip, InputAdornment } from '@mui/material';
import { InfoOutlined as InfoIcon, PlaceOutlined as PlaceIcon } from '@mui/icons-material';

import { COLORS } from '../../../../../constants/colors';
import { fontSize, fontWeight, radius, standardFieldSx, roundedSelectMenuProps } from '../../../../../constants/styles';
import { US_STATES } from '../../../../../constants/usAddressData';
import PhoneNumberInput, { formatPhoneNumber } from '../../../../shared/PhoneNumberInput';
import { BUSINESS_TYPES } from '../mockMessagingService';

const Field = ({ label, info, error, children }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY }}>
        {label}
      </Typography>
      {info && (
        <Tooltip title={info} arrow>
          <InfoIcon sx={{ fontSize: 15, color: COLORS.TEXT_MUTED, cursor: 'help' }} />
        </Tooltip>
      )}
    </Box>
    {children}
    <Typography sx={{ fontSize: fontSize.sm, color: COLORS.STATUS_ERROR, mt: 0.5, minHeight: 16 }}>{error}</Typography>
  </Box>
);

const PracticeDetailsStep = ({ values, errors, onChange, disabled }) => {
  const textField = (name, props = {}) => (
    <TextField
      fullWidth
      size="small"
      value={values[name] ?? ''}
      onChange={(e) => onChange(name, e.target.value)}
      error={Boolean(errors[name])}
      disabled={disabled}
      sx={standardFieldSx}
      {...props}
    />
  );

  const selectField = (name, options) =>
    textField(name, {
      select: true,
      SelectProps: { MenuProps: roundedSelectMenuProps },
      children: options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      )),
    });

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>
        Confirm Practice Details
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 3 }}>
        Phone carriers verify these details before a texting number can be registered to your practice.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 3, rowGap: 1 }}>
        <Field
          label="Legal Business Name"
          info="Must exactly match the name registered with the IRS for your EIN."
          error={errors.legalBusinessName}
        >
          {textField('legalBusinessName')}
        </Field>
        <Field label="Doing Business As" error={errors.doingBusinessAs}>
          {textField('doingBusinessAs')}
        </Field>

        <Field label="Employer Identification Number" error={errors.ein}>
          {textField('ein', {
            placeholder: values.einLast4 ? `****${values.einLast4}` : '12-3456789',
            inputProps: { inputMode: 'numeric', maxLength: 10 },
          })}
        </Field>
        <Field label="Business Type" error={errors.businessType}>
          {selectField('businessType', BUSINESS_TYPES.map((t) => ({ value: t, label: t })))}
        </Field>

        <Field label="Phone Number" error={errors.phoneNumber}>
          <PhoneNumberInput
            value={values.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            readOnly={disabled}
            sx={standardFieldSx}
          />
        </Field>
        <Field
          label="Website"
          info="Carriers review your website when approving your number for patient texting."
          error={errors.website}
        >
          {textField('website', { placeholder: 'https://www.yourpractice.com' })}
        </Field>

        <Field label="Practice Address" error={errors.address}>
          {textField('address', {
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <PlaceIcon sx={{ fontSize: 18, color: COLORS.TEXT_MUTED }} />
                </InputAdornment>
              ),
            },
          })}
        </Field>
        <Field label="Apt, suite, etc." error={errors.address2}>
          {textField('address2')}
        </Field>

        <Field label="City" error={errors.city}>
          {textField('city')}
        </Field>
        <Field label="State" error={errors.state}>
          {selectField('state', US_STATES.map((s) => ({ value: s.value, label: s.value })))}
        </Field>

        <Field label="Zip code" error={errors.zip}>
          {textField('zip', { placeholder: '07446-1926', inputProps: { maxLength: 10 } })}
        </Field>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
          Owner Contact Details
        </Typography>
        <Box
          sx={{
            border: `1.2px solid ${COLORS.BORDER}`,
            borderRadius: radius.md,
            bgcolor: COLORS.SURFACE_CARD,
            px: 1.5,
            py: 1.25,
            '& p': { fontSize: fontSize.base, color: COLORS.TEXT_BODY, lineHeight: 1.7 },
          }}
        >
          <Typography sx={{ fontWeight: `${fontWeight.semibold} !important` }}>{values.owner?.name}</Typography>
          <Typography>{formatPhoneNumber(values.owner?.phone)}</Typography>
          <Typography>{values.owner?.email}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PracticeDetailsStep;
