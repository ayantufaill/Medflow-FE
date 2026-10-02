import { mockEmailDomainService } from '../email-services/mockEmailDomainService';

// In-memory stand-in until the backend exposes email preferences
// (e.g. GET/PUT /communication/email-preferences). Rejects the way axios does,
// so the page's error handling reads the same message either way.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const apiError = (message, field) =>
  Object.assign(new Error(message), {
    response: { status: 400, data: { success: false, error: { message, details: field ? { field } : null } } },
  });

let preferences = {
  sentFromEmail: 'noreply@brightsmiledental.com',
  replyToEmail: 'info@brightsmiledental.com',
};

export const mockEmailPreferencesService = {
  getEmailPreferences: async () => {
    await delay(300);
    return { ...preferences };
  },

  updateEmailPreferences: async (data) => {
    await delay();
    const sentFromEmail = String(data.sentFromEmail ?? '').trim().toLowerCase();
    const replyToEmail = String(data.replyToEmail ?? '').trim().toLowerCase();

    if (!EMAIL_PATTERN.test(sentFromEmail)) throw apiError('Enter a valid email address.', 'sentFromEmail');
    if (!EMAIL_PATTERN.test(replyToEmail)) throw apiError('Enter a valid email address.', 'replyToEmail');

    // Emails can only be sent from the domain verified under Email Services.
    const { domain } = await mockEmailDomainService.getEmailDomain();
    if (domain && sentFromEmail.split('@')[1] !== domain) {
      throw apiError(`'Sent From' email must use your email domain (@${domain}).`, 'sentFromEmail');
    }

    preferences = { sentFromEmail, replyToEmail };
    return { ...preferences };
  },
};
