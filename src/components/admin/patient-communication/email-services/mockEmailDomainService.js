import { DOMAIN_STATUS } from './constants';

// In-memory stand-in for the email-domain endpoints in communication.service.js
// (getEmailDomain / setEmailDomain / verifyEmailDomain). Same method names and
// response shapes, so switching USE_MOCK_EMAIL_DOMAIN off needs no page changes.

const MAIL_FROM_SUBDOMAIN = 'medflow-email-service';
const DOMAIN_PATTERN = /^(?=.{1,253}$)(?:(?!-)[a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}$/;

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDkimToken = () =>
  Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz234567'[Math.floor(Math.random() * 32)]).join('');

const buildDnsRecords = (tokens) => [
  ...tokens.map((token) => ({
    type: 'CNAME',
    name: `${token}._domainkey`,
    value: `${token}.dkim.amazonses.com`,
  })),
  {
    type: 'MX',
    name: MAIL_FROM_SUBDOMAIN,
    value: '10 feedback-smtp.us-east-1.amazonses.com',
    hint: 'If your provider has a Priority field, remove the 10 from Value and enter it in the Priority field.',
  },
  {
    type: 'TXT',
    name: MAIL_FROM_SUBDOMAIN,
    value: '"v=spf1 include:amazonses.com ~all"',
    hint: 'Make sure to include the quotation marks when entering your TXT record.',
  },
];

const normalizeDomain = (input) => {
  const domain = String(input)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[/?#].*$/, '')
    .replace(/\.$/, '');
  return DOMAIN_PATTERN.test(domain) ? domain : null;
};

// Rejects the way axios does, so the page's error handling reads the same message.
const apiError = (message) =>
  Object.assign(new Error(message), { response: { status: 400, data: { success: false, error: { message } } } });

let state = {
  domain: 'brightsmiledental.com',
  status: DOMAIN_STATUS.VERIFIED,
  provider: 'mock',
  records: buildDnsRecords([
    'wg2y7gjlxsuwsumb6x2mu2lytlerg2em',
    'rkf6qual7x3wkduk5vv5x7fi4jodkwfy',
    'fig4heoz5fefyw5txo4fqfqqlgleystd',
  ]),
  createdAt: '2026-09-20T10:00:00.000Z',
  lastCheckedAt: '2026-10-02T09:30:00.000Z',
};

export const mockEmailDomainService = {
  getEmailDomain: async () => {
    await delay(300);
    return structuredClone(state);
  },

  setEmailDomain: async (input) => {
    await delay();
    const domain = normalizeDomain(input);
    if (!domain) throw apiError('Enter a valid domain, e.g. yourpractice.com');
    if (domain === state.domain) throw apiError('This is already your current domain.');

    state = {
      domain,
      status: DOMAIN_STATUS.PENDING,
      provider: 'mock',
      records: buildDnsRecords([randomDkimToken(), randomDkimToken(), randomDkimToken()]),
      createdAt: new Date().toISOString(),
      lastCheckedAt: null,
    };
    return structuredClone(state);
  },

  // Demo behaviour: every check finds the records, so the happy path is visible.
  verifyEmailDomain: async () => {
    await delay(900);
    if (!state.domain) throw apiError('No email domain has been set up yet.');
    state = {
      ...state,
      status: DOMAIN_STATUS.VERIFIED,
      records: state.records.map((record) => ({ ...record, found: true })),
      lastCheckedAt: new Date().toISOString(),
    };
    return structuredClone(state);
  },
};
