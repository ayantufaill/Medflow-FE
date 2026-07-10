import { InlineFieldRow, standardFieldSx } from './InlineField';
import PhoneNumberInput from '../shared/PhoneNumberInput';

/**
 * Shared phone field for the Patient Detail page (Contact Information,
 * Emergency Contact, Spouse Information, ...): a read-only formatted box in view
 * mode, react-phone-input-2's flag-dropdown + country search in edit mode.
 */
const PhoneField = ({ value, label, isEditMode, onChange }) => (
  <InlineFieldRow
    label={label}
    input={
      <PhoneNumberInput
        value={value}
        onChange={onChange}
        readOnly={!isEditMode}
        sx={!isEditMode ? { ...standardFieldSx, minWidth: 0 } : undefined}
      />
    }
  />
);

export default PhoneField;
