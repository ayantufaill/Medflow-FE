import dayjs from "dayjs";
import { formatDateForPayload } from '../../../utils/dateUtils';

// Pure value formatters/helpers shared across the New Patient Intake form
// (main form file, FormFieldsGrid, AddressFieldsSection).

export const trimValue = (value) => (typeof value === "string" ? value.trim() : value);

export const normalizePhone = (value) => {
  const digits = (value || "").replace(/[^\d+]/g, "").trim();
  if (!digits) return "";
  return digits.startsWith("+") ? digits : `+${digits}`;
};

export const formatPhoneInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatPostalCodeInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export const formatSSNInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

export const formatDateValue = (value) => {
  return formatDateForPayload(value);
};

export const removeEmptyCustomFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return true;
      return value !== "" && value !== null && value !== undefined;
    }),
  );

// Applies a raw-string formatter (e.g. formatSSNInput/formatPostalCodeInput) to
// a controlled <input>'s onChange WITHOUT dropping react-hook-form's own
// onChange from `register(...)`. Mutating `event.target.value` and then
// calling through to `registerOnChange` is required — replacing the onChange
// prop outright (as this form previously did for SSN and every postal code
// field) means react-hook-form never sees the keystroke, so the field's
// value silently never makes it into the submitted form data.
export const withFormattedOnChange = (formatter, registerOnChange) => (event) => {
  event.target.value = formatter(event.target.value);
  return registerOnChange?.(event);
};
