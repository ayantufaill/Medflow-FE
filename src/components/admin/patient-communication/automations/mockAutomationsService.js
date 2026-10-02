import { CHANNELS, getCategory } from './automationConfig';

// In-memory stand-in until the backend exposes automations
// (e.g. /communication/automations). Rejects the way axios does, so the
// page's error handling reads the same message either way.

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const apiError = (message) =>
  Object.assign(new Error(message), { response: { status: 400, data: { success: false, error: { message } } } });

const event = (name) => ({ type: 'event', event: name });
const offset = (amount, unit, direction, anchor) => ({ type: 'offset', amount, unit, direction, anchor });

let nextId = 100;
const message = (timing, channel, body, active, sent = 0, recipients = 0, subject = '') => ({
  id: String(nextId++),
  timing,
  channel,
  subject,
  body,
  active,
  sent,
  recipients,
});

let automations = {
  'pre-appointment': [
    message(event('When Appointment Requested'), 'Email, SMS',
      'Hi {Patient: Preferred Name}, this is to confirm that your appointment request for {Appointment: Date} at {Appointment: Time} has been received. Our office will be in touch shortly.',
      false, 0, 0, 'We received your appointment request'),
    message(event('When Appointment Created'), 'Email, SMS',
      'Hi! This is to confirm that your appointment for {Patient: Preferred Name} with {Practice: Name} is scheduled for {Appointment: Date} at {Appointment: Time}.',
      true, 412, 236, 'Your appointment is confirmed'),
    message(offset(7, 'Days', 'Before', 'Confirmed Appointment'), 'Preferred',
      'Hi! This is a friendly reminder that your appointment for {Patient: First Name} at {Practice: Name} is on {Appointment: Date} at {Appointment: Time}.',
      true, 198, 121),
    message(offset(7, 'Days', 'Before', 'Unconfirmed Appointment'), 'Preferred',
      'Hi! Your appointment for {Patient: First Name} with {Practice: Name} is scheduled for {Appointment: Date}. Please confirm here: {Appointment: Confirm Link}',
      true, 143, 98),
    message(offset(3, 'Days', 'Before', 'Unconfirmed Appointment'), 'Preferred',
      'Hi! Your appointment for {Patient: First Name} with {Practice: Name} is scheduled for {Appointment: Date}. We haven’t heard back yet. Please confirm: {Appointment: Confirm Link}',
      true, 121, 84),
    message(offset(1, 'Days', 'Before', 'Confirmed Appointment'), 'Preferred',
      'Hi! We look forward to seeing {Patient: First Name} for their appointment tomorrow at {Appointment: Time}.',
      true, 187, 79),
    message(offset(1, 'Days', 'Before', 'Unconfirmed Appointment'), 'Preferred',
      'Hi! Please confirm your appointment for {Patient: First Name} with {Practice: Name} tomorrow at {Appointment: Time}: {Appointment: Confirm Link}',
      true, 128, 47),
  ],
  'post-appointment': [
    message(offset(1, 'Hours', 'After', 'Appointment Completed'), 'SMS',
      'Hi! We loved having {Patient: Preferred Name} with us today at {Practice: Name}. If you enjoyed your visit, we’d appreciate a review: {Review: Link}',
      true, 64, 62),
    message(offset(1, 'Hours', 'After', 'Appointment Completed'), 'SMS',
      'Hi {Patient: Preferred Name}, thanks for visiting {Practice: Name}. If you enjoyed your visit, please leave us a review: {Review: Link}',
      false, 9, 8),
    message(offset(24, 'Hours', 'After', 'Appointment Completed'), 'SMS',
      'Hi! Just checking in after {Patient: First Name}’s visit yesterday! How is {Patient: Preferred Name} feeling? Reply to this message if you have any questions.',
      false, 8, 8),
  ],
  'recall-reminders': [
    message(offset(6, 'Weeks', 'Before', 'Prophy Due'), 'SMS',
      'Hi! {Patient: Preferred Name} is due for their next dental cleaning and exam with {Practice: Name}. Call us at {Practice: Phone} to schedule.',
      true),
    message(offset(4, 'Weeks', 'Before', 'Perio Due'), 'SMS',
      'Hi! {Patient: Preferred Name} is due for their next dental exam and cleaning appointment with {Practice: Name}. Call us at {Practice: Phone} to schedule.',
      true),
    message(offset(2, 'Weeks', 'After', 'Prophy Due'), 'SMS',
      'Hi! {Patient: Preferred Name} is overdue for their dental cleaning and exam with {Practice: Name}. Call us at {Practice: Phone} to book a visit.',
      true),
    message(offset(2, 'Weeks', 'After', 'Perio Due'), 'SMS',
      'Hi {Patient: Preferred Name}, you are overdue for your periodontal maintenance with {Practice: Name}. Call us at {Practice: Phone} to schedule.',
      false),
  ],
  'incomplete-forms': [
    message(offset(3, 'Days', 'Before', 'Unconfirmed Appointment'), 'Preferred',
      'Please complete the forms required for your appointment with {Practice: Name} on {Appointment: Date}: {Forms: Link}',
      true, 96, 82),
    message(offset(3, 'Days', 'Before', 'Confirmed Appointment'), 'Preferred',
      'Please complete the forms required for your appointment with {Practice: Name} on {Appointment: Date}: {Forms: Link}',
      true, 104, 91),
    message(offset(1, 'Days', 'Before', 'Unconfirmed Appointment'), 'Preferred',
      'Please complete the forms required for tomorrow’s appointment with {Practice: Name}: {Forms: Link}',
      true, 71, 63),
    message(offset(1, 'Days', 'Before', 'Confirmed Appointment'), 'Preferred',
      'Please complete the forms required for tomorrow’s appointment with {Practice: Name}: {Forms: Link}',
      true, 88, 77),
    message(offset(1, 'Hours', 'Before', 'Unconfirmed Appointment'), 'Preferred',
      'Please complete the forms required for today’s appointment with {Practice: Name}: {Forms: Link}',
      true, 52, 46),
    message(offset(1, 'Hours', 'Before', 'Confirmed Appointment'), 'Preferred',
      'Please complete the forms required for today’s appointment with {Practice: Name}: {Forms: Link}',
      true, 67, 52),
  ],
  'payment-reminders': [
    message(event('When Payment Plan Payment Processed'), 'SMS',
      'Hi {Patient: Preferred Name}, a payment of {Payment Plan: Payment Amount} was collected on your payment plan with {Practice: Name}. Thank you!',
      false),
    message(event('When Payment Plan Started'), 'SMS',
      'Hi {Patient: Preferred Name}, a payment plan totaling {Payment Plan: Total Amount} has been set up with {Practice: Name}. Your next payment is on {Payment Plan: Next Payment Date}.',
      false),
    message(event('When Payment Plan Updated'), 'SMS',
      'Hi {Patient: Preferred Name}, your payment plan at {Practice: Name} was updated. Your next payment is on {Payment Plan: Next Payment Date}.',
      false),
    message(event('When Payment Plan Payment Failed'), 'SMS',
      'Hi {Patient: Preferred Name}, {Practice: Name} was unable to process a recent payment on your payment plan. Please update your payment details: {Payment Plan: Payment Link}',
      false),
    message(offset(1, 'Days', 'Before', 'Payment Plan Payment'), 'SMS',
      'Hi {Patient: Preferred Name}, an upcoming payment on your payment plan with {Practice: Name} of {Payment Plan: Payment Amount} is scheduled for tomorrow.',
      false),
  ],
};

const summarize = (messages) => ({
  actions: messages.length,
  totalSent: messages.reduce((sum, m) => sum + m.sent, 0),
  recipients: messages.reduce((sum, m) => sum + m.recipients, 0),
});

const validate = (categoryId, data) => {
  const category = getCategory(categoryId);
  if (!category) throw apiError('Unknown automation category.');
  const { timing } = data;
  if (timing?.type === 'event') {
    if (!category.events.includes(timing.event)) throw apiError('Select when this message should be sent.');
  } else if (
    !(Number.isInteger(timing?.amount) && timing.amount >= 1 && timing.amount <= 365) ||
    !category.anchors.includes(timing.anchor) ||
    !category.directions.includes(timing.direction)
  ) {
    throw apiError('Enter a valid timing between 1 and 365.');
  }
  if (!CHANNELS.includes(data.channel)) throw apiError('Select a channel.');
  if (!data.body?.trim()) throw apiError('Message cannot be empty.');
  if (data.body.length > 1000) throw apiError('Message must be 1,000 characters or fewer.');
};

const pick = ({ timing, channel, subject = '', body }) => ({ timing, channel, subject: subject.trim(), body: body.trim() });

export const mockAutomationsService = {
  getAutomations: async (categoryId) => {
    await delay();
    const messages = structuredClone(automations[categoryId] ?? []);
    return { messages, overview: summarize(messages) };
  },

  createAutomation: async (categoryId, data) => {
    await delay();
    validate(categoryId, data);
    const created = { id: String(nextId++), ...pick(data), active: true, sent: 0, recipients: 0 };
    automations[categoryId] = [...automations[categoryId], created];
    return structuredClone(created);
  },

  updateAutomation: async (categoryId, id, data) => {
    await delay();
    validate(categoryId, data);
    automations[categoryId] = automations[categoryId].map((m) => (m.id === id ? { ...m, ...pick(data) } : m));
    return structuredClone(automations[categoryId].find((m) => m.id === id));
  },

  setAutomationActive: async (categoryId, id, active) => {
    await delay(200);
    automations[categoryId] = automations[categoryId].map((m) => (m.id === id ? { ...m, active } : m));
    return structuredClone(automations[categoryId].find((m) => m.id === id));
  },

  deleteAutomation: async (categoryId, id) => {
    await delay();
    automations[categoryId] = automations[categoryId].filter((m) => m.id !== id);
  },
};
