// Routes for the Email & Messaging section (Admin → Patient Communication).
export const EMAIL_MESSAGING_BASE = '/admin/patient-communication/email-messaging';

export const EMAIL_MESSAGING_PATHS = {
  emailServices: `${EMAIL_MESSAGING_BASE}/email-services`,
  emailPreferences: `${EMAIL_MESSAGING_BASE}/email-preferences`,
  messagingServices: `${EMAIL_MESSAGING_BASE}/messaging-services`,
  numberSelection: `${EMAIL_MESSAGING_BASE}/messaging-services/number-selection`,
};

// Earlier standalone URLs, kept working as redirects.
export const LEGACY_EMAIL_MESSAGING_REDIRECTS = {
  '/admin/patient-communication/email-services': EMAIL_MESSAGING_PATHS.emailServices,
  '/admin/patient-communication/email-preferences': EMAIL_MESSAGING_PATHS.emailPreferences,
  '/admin/patient-communication/messaging-services': EMAIL_MESSAGING_PATHS.messagingServices,
  '/admin/patient-communication/number-selection': EMAIL_MESSAGING_PATHS.numberSelection,
};
