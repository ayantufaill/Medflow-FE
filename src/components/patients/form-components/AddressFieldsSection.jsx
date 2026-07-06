import { Autocomplete, Box, Grid, MenuItem, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import FormField from "./FormField";
import { OutlinedInput, OutlinedSelect } from "./formInputs";
import { formatPostalCodeInput, withFormattedOnChange } from "./formatters";
import { US_STATES, STATE_CITIES } from "../../../constants/usAddressData";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius } from "../../../constants/styles";

const COUNTRY_OPTIONS = ["United States"];

// Country / Address Line 1 / Address Line 2 / State / City / Zip block, used
// identically for the patient's address, work address, and spouse's work
// address — the three previously had this block copy-pasted verbatim with
// only the field-name prefix differing (patient/work/spouse).
//
// `prefix` builds the react-hook-form field names: `${prefix}Country`,
// `${prefix}AddressLine1`, `${prefix}AddressLine2`, `${prefix}State`,
// `${prefix}City`, `${prefix}PostalCode`.
const AddressFieldsSection = ({
  prefix,
  register,
  control,
  watch,
  setValue,
  disabled = false,
  addressLine2Placeholder = "Suite, unit...",
  label = "Address",
}) => {
  const stateFieldName = `${prefix}State`;
  const cityFieldName = `${prefix}City`;
  const selectedState = watch(stateFieldName);
  const registeredPostalCode = register(`${prefix}PostalCode`);

  return (
    <Grid size={{ xs: 12 }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", mb: 2 }}>
        {label}
      </Typography>
      <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, p: 2.5, backgroundColor: COLORS.SURFACE_CARD }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormField label="Country">
              <Controller name={`${prefix}Country`} control={control} render={({ field }) => (
                <OutlinedSelect {...field} disabled={disabled}>
                  {COUNTRY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </OutlinedSelect>
              )} />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Address Line 1">
              <OutlinedInput {...register(`${prefix}AddressLine1`)} disabled={disabled} placeholder="Street address" />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormField label="Address Line 2">
              <OutlinedInput {...register(`${prefix}AddressLine2`)} disabled={disabled} placeholder={addressLine2Placeholder} />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="State">
              <Controller name={stateFieldName} control={control} render={({ field }) => (
                <OutlinedSelect {...field} disabled={disabled} onChange={(e) => { field.onChange(e); setValue(cityFieldName, ""); }}>
                  <MenuItem value="">Select state</MenuItem>
                  {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </OutlinedSelect>
              )} />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="City">
              <Controller name={cityFieldName} control={control} render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={STATE_CITIES[selectedState] || []}
                  value={value || ""}
                  onChange={(_, newVal) => onChange(newVal || "")}
                  onInputChange={(_, newInputValue) => onChange(newInputValue || "")}
                  disabled={disabled || !selectedState}
                  freeSolo
                  renderInput={(params) => (
                    <OutlinedInput
                      {...params}
                      placeholder={disabled ? "" : selectedState ? "City" : "Select state first"}
                    />
                  )}
                />
              )} />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="Zip / Postal Code">
              <OutlinedInput
                {...registeredPostalCode}
                disabled={disabled}
                placeholder="Zip code"
                onChange={withFormattedOnChange(formatPostalCodeInput, registeredPostalCode.onChange)}
              />
            </FormField>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default AddressFieldsSection;
