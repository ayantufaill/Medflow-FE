import { Grid, MenuItem } from "@mui/material";
import FormField from "./FormField";
import { OutlinedInput, OutlinedSelect, PhoneInput } from "./formInputs";
import { withFormattedOnChange } from "./formatters";

const DEFAULT_GRID_SIZE = { xs: 12, sm: 4 };

// Renders one field config into its Grid + FormField + input. Only handles
// the field types that are plain register()-bound values with no side
// effects on other fields — anything with cross-field behavior (date pickers,
// radio groups that reset other fields, autocompletes, address blocks) stays
// as explicit JSX in the section that needs it, rendered alongside this grid
// rather than forced through it.
const renderInput = (field, { register, errors }) => {
  const rules = {};
  if (field.required) {
    rules.required = typeof field.required === "string" ? field.required : `${field.label} is required`;
  }
  if (field.pattern) rules.pattern = field.pattern;

  const error = errors?.[field.name];
  const registered = register(field.name, rules);

  if (field.type === "select") {
    return (
      <OutlinedSelect
        {...registered}
        disabled={field.disabled}
        error={!!error}
        helperText={error?.message}
      >
        {field.options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </OutlinedSelect>
    );
  }

  if (field.type === "phone") {
    return (
      <PhoneInput
        {...registered}
        disabled={field.disabled}
        error={!!error}
        helperText={error?.message}
      />
    );
  }

  // type === "text"
  return (
    <OutlinedInput
      {...registered}
      disabled={field.disabled}
      placeholder={field.placeholder}
      error={!!error}
      helperText={error?.message}
      onChange={field.formatter ? withFormattedOnChange(field.formatter, registered.onChange) : registered.onChange}
    />
  );
};

// Declarative list-of-fields renderer, used *inside* a SectionCard's own
// <Grid container>. `fields` is an array of { name, label, type:
// 'text'|'select'|'phone', required, placeholder, options, formatter,
// disabled, gridSize }. Deliberately renders bare <Grid> items rather than
// its own container, so a section can freely interleave these with dividers,
// AddressFieldsSection, or other bespoke widgets in the same container and
// get identical spacing throughout — the same layout the hand-written JSX
// version had.
const FormFieldsGrid = ({ fields, register, errors }) => (
  <>
    {fields.map((field) => (
      <Grid key={field.name} size={field.gridSize || DEFAULT_GRID_SIZE}>
        <FormField label={field.label} required={!!field.required}>
          {renderInput(field, { register, errors })}
        </FormField>
      </Grid>
    ))}
  </>
);

export default FormFieldsGrid;
