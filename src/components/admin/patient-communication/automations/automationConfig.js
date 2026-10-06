// Shared definitions for the Automations screens (Pre-Appointment,
// Post-Appointment, Recall Reminders, Incomplete Forms, Payment Reminders).
//
// A message's timing is either an event ("When Appointment Created") or an
// offset from an anchor ("7 Days Before Confirmed Appointment").

export const CHANNELS = ['Preferred', 'SMS', 'Email', 'Email, SMS'];

export const TIME_UNITS = ['Hours', 'Days', 'Weeks'];

export const AUTOMATION_CATEGORIES = [
  {
    id: 'pre-appointment',
    label: 'Pre-Appointment',
    description: 'Confirmations and reminders sent before a patient’s appointment.',
    events: ['When Appointment Requested', 'When Appointment Created'],
    anchors: ['Confirmed Appointment', 'Unconfirmed Appointment'],
    directions: ['Before'],
    variableGroups: ['Patient', 'Practice', 'Appointment'],
  },
  {
    id: 'post-appointment',
    label: 'Post-Appointment',
    description: 'Follow-ups and review requests sent after a visit is completed.',
    events: [],
    anchors: ['Appointment Completed'],
    directions: ['After'],
    variableGroups: ['Patient', 'Practice', 'Appointment', 'Review'],
  },
  {
    id: 'recall-reminders',
    label: 'Recall Reminders',
    description: 'Reminders for patients who are due or overdue for their next recall visit.',
    events: [],
    anchors: ['Prophy Due', 'Perio Due'],
    directions: ['Before', 'After'],
    variableGroups: ['Patient', 'Practice'],
  },
  {
    id: 'incomplete-forms',
    label: 'Incomplete Forms',
    description: 'Nudges for patients who haven’t completed the forms for an upcoming appointment.',
    events: [],
    anchors: ['Confirmed Appointment', 'Unconfirmed Appointment'],
    directions: ['Before'],
    variableGroups: ['Patient', 'Practice', 'Appointment', 'Forms'],
  },
  {
    id: 'payment-reminders',
    label: 'Payment Reminders',
    description: 'Payment plan updates and upcoming payment reminders.',
    events: [
      'When Payment Plan Payment Processed',
      'When Payment Plan Started',
      'When Payment Plan Updated',
      'When Payment Plan Payment Failed',
    ],
    anchors: ['Payment Plan Payment'],
    directions: ['Before'],
    variableGroups: ['Patient', 'Practice', 'Payment Plan'],
  },
];

export const getCategory = (id) => AUTOMATION_CATEGORIES.find((c) => c.id === id);

/** "When Appointment Created" or "7 Days Before Confirmed Appointment" (singular unit for 1). */
export const formatTiming = (timing) => {
  if (!timing) return '';
  if (timing.type === 'event') return timing.event;
  const unit = timing.amount === 1 ? timing.unit.replace(/s$/, '') : timing.unit;
  return `${timing.amount} ${unit} ${timing.direction} ${timing.anchor}`;
};

// Merge fields use the templates' existing "{Group: Field}" format.
export const MESSAGE_VARIABLES = [
  { group: 'Patient', fields: ['Preferred Name', 'First Name', 'Last Name'] },
  { group: 'Practice', fields: ['Name', 'Phone', 'Address'] },
  { group: 'Appointment', fields: ['Date', 'Time', 'Provider Name', 'Confirm Link'] },
  { group: 'Forms', fields: ['Link'] },
  { group: 'Payment Plan', fields: ['Payment Amount', 'Total Amount', 'Next Payment Date', 'Payment Link'] },
  { group: 'Review', fields: ['Link'] },
];

export const toVariableToken = (group, field) => `{${group}: ${field}}`;

const TOKEN_PATTERN = /\{([^:{}]+):\s*([^{}]+)\}/g;

/** Splits a message into text and merge-field parts so the table can bold the fields ("Patient Preferred Name"). */
export const splitMessage = (body = '') => {
  const parts = [];
  let last = 0;
  for (const match of body.matchAll(TOKEN_PATTERN)) {
    if (match.index > last) parts.push({ text: body.slice(last, match.index) });
    parts.push({ text: `${match[1].trim()} ${match[2].trim()}`, variable: true });
    last = match.index + match[0].length;
  }
  if (last < body.length) parts.push({ text: body.slice(last) });
  return parts;
};
