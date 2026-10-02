// In-memory stand-in until the backend exposes the practice's two-way SMS
// number (e.g. GET /communication/messaging-service, the number-selection
// flow). Rejects the way axios does, so the page's error handling reads the
// same message either way.

export const MESSAGING_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
};

export const BUSINESS_TYPES = [
  'Sole proprietorship',
  'Partnership',
  'Limited liability company',
  'Corporation',
  'Non-profit organization',
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const apiError = (message, fields = null) =>
  Object.assign(new Error(message), {
    response: { status: 400, data: { success: false, error: { message, details: fields ? { fields } : null } } },
  });

let messagingService = {
  status: MESSAGING_STATUS.ACTIVE,
  phoneNumber: '2015006314', // 10-digit US number, digits only
};

let practiceDetails = {
  legalBusinessName: 'Bright Smile Dental Group LLC',
  doingBusinessAs: 'Bright Smile Dental',
  einLast4: '9859',
  businessType: 'Limited liability company',
  phoneNumber: '2015006314',
  website: 'https://www.brightsmiledental.com',
  address: '125 East Main Street',
  address2: '',
  city: 'Ramsey',
  state: 'NJ',
  zip: '07446-1926',
  owner: { name: 'Sarah Mitchell', phone: '8584729183', email: 'sarah.mitchell@brightsmiledental.com' },
};

// Area-code inventory the carrier would return; anything else gets a generated set.
const AVAILABLE_NUMBERS = {
  201: ['2015550142', '2015550178', '2015550193', '2015550126', '2015550111'],
  206: ['2065550104', '2065550187', '2065550159'],
  512: ['5125550136', '5125550162', '5125550190', '5125550148'],
};

const randomNumbersFor = (areaCode) =>
  Array.from({ length: 4 }, () => `${areaCode}555${String(Math.floor(100 + Math.random() * 900)).padStart(4, '0')}`);

const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

const validatePracticeDetails = (details) => {
  const fields = {};
  if (!details.legalBusinessName?.trim()) fields.legalBusinessName = 'Legal business name is required.';
  if (details.ein && digitsOnly(details.ein).length !== 9) fields.ein = 'EIN must be 9 digits, e.g. 12-3456789.';
  if (!details.businessType) fields.businessType = 'Select a business type.';
  if (digitsOnly(details.phoneNumber).length !== 10) fields.phoneNumber = 'Enter a valid 10-digit phone number.';
  if (details.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(details.website.trim())) {
    fields.website = 'Enter a valid website, e.g. https://www.yourpractice.com';
  }
  if (!details.address?.trim()) fields.address = 'Practice address is required.';
  if (!details.city?.trim()) fields.city = 'City is required.';
  if (!details.state) fields.state = 'Select a state.';
  if (!/^\d{5}(-\d{4})?$/.test(details.zip?.trim() ?? '')) fields.zip = 'Enter a 5-digit ZIP or ZIP+4, e.g. 07446-1926.';
  return fields;
};

export const mockMessagingService = {
  getMessagingService: async () => {
    await delay(300);
    return { ...messagingService };
  },

  getPracticeDetails: async () => {
    await delay(300);
    return structuredClone(practiceDetails);
  },

  /** Step 1: carriers need verified business details before a texting number is registered. */
  savePracticeDetails: async (details) => {
    await delay();
    const fields = validatePracticeDetails(details);
    if (Object.keys(fields).length) throw apiError('Please fix the highlighted fields.', fields);

    const { ein, ...rest } = details;
    practiceDetails = {
      ...practiceDetails,
      ...rest,
      einLast4: ein ? digitsOnly(ein).slice(-4) : practiceDetails.einLast4,
    };
    return structuredClone(practiceDetails);
  },

  /** Step 2: numbers available for a 3-digit area code. */
  searchAvailableNumbers: async (areaCode) => {
    await delay(600);
    if (!/^[2-9]\d{2}$/.test(String(areaCode))) throw apiError('Enter a valid 3-digit area code.');
    return (AVAILABLE_NUMBERS[areaCode] ?? randomNumbersFor(areaCode)).filter((n) => n !== messagingService.phoneNumber);
  },

  /** Claims the number; it stays pending until carrier registration completes. */
  selectMessagingNumber: async (phoneNumber) => {
    await delay(800);
    if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly(phoneNumber))) throw apiError('Select a number to continue.');
    messagingService = { status: MESSAGING_STATUS.PENDING, phoneNumber: digitsOnly(phoneNumber) };
    return { ...messagingService };
  },
};
