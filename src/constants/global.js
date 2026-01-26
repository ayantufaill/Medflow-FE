// Email validation regex pattern
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Phone validation regex pattern
const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

// Password strength validation regex (must contain uppercase, lowercase, and number)
const PASSWORD_STRENGTH_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// URL validation regex pattern
const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export { EMAIL_PATTERN, PHONE_PATTERN, PASSWORD_STRENGTH_PATTERN, URL_PATTERN };