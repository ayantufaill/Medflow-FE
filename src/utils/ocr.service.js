import Tesseract from 'tesseract.js';

/**
 * Extract text from an image using OCR
 * @param {File|string} imageFile - Image file or data URL
 * @param {Function} onProgress - Optional progress callback (0-1)
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromImage = async (imageFile, onProgress = null) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageFile, 'eng', {
      logger: (m) => {
        // Report progress if callback provided
        if (onProgress) {
          // Map different statuses to progress
          let progress = 0;
          if (m.status === 'loading tesseract core') progress = 0.1;
          else if (m.status === 'initializing tesseract') progress = 0.2;
          else if (m.status === 'loading language traineddata') progress = 0.3;
          else if (m.status === 'initializing api') progress = 0.4;
          else if (m.status === 'recognizing text') {
            progress = 0.5 + m.progress * 0.5;
          }

          onProgress(Math.min(progress, 1));
        }
        // Also log to console for debugging
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error(
      'Failed to extract text from image. Please ensure the image is clear and try again.'
    );
  }
};

/**
 * Parse driver's license OCR text to extract demographics
 * Handles various US driver's license formats
 * @param {string} ocrText - Raw OCR text from driver's license
 * @returns {Object} Parsed demographics data
 */
export const parseDriverLicense = (ocrText) => {
  const result = {
    firstName: '',
    lastName: '',
    middleName: '',
    preferredName: '',
    dateOfBirth: null,
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
    },
    gender: '',
    ssn: '',
    phonePrimary: '',
    email: '',
  };

  if (!ocrText) return result;

  // Log raw OCR text for debugging (remove in production if needed)
  console.log('Raw OCR Text:', ocrText);

  // Normalize text: remove extra spaces, newlines, and common OCR errors
  // Keep newlines for structure but normalize spaces
  let normalizedText = ocrText
    // Fix common OCR errors
    .replace(/[|]/g, 'I') // Replace pipe with I
    .replace(/[0O]/g, (m, offset) => {
      // Context-aware: if surrounded by letters, likely O; if by numbers, likely 0
      const before = ocrText[offset - 1] || '';
      const after = ocrText[offset + 1] || '';
      if (/\d/.test(before) || /\d/.test(after)) return '0';
      return 'O';
    })
    .replace(/[Il1]/g, (m, offset) => {
      // Context-aware: if at start of word or after space, likely I
      const before = ocrText[offset - 1] || '';
      if (/\s/.test(before) || offset === 0) return 'I';
      return m;
    })
    // Normalize whitespace
    .replace(/[^\S\n]+/g, ' ') // Replace multiple spaces with single space (but keep newlines)
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .trim();

  // Also create a version without newlines for pattern matching
  const textWithoutNewlines = normalizedText.replace(/\n/g, ' ');

  // Extract name patterns - improved to handle all cases (uppercase, mixed case, special chars)
  const namePatterns = [
    // Pattern 1: FIRST NAME: John LAST NAME: Doe (handles mixed case and all caps)
    /FIRST[\s\W]*NAME[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+)*).*?LAST[\s\W]*NAME[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+)*)/i,
    // Pattern 2: FN: John LN: Doe
    /FN[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+)*).*?LN[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+)*)/i,
    // Pattern 3: NAME: John Doe or DON: John Doe (handles all caps names)
    /(?:DON|DONOR|NAME)[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+)*\s+[A-Z][A-Za-z\-\']+)/i,
    // Pattern 4: All uppercase name (common on licenses): JOHN DOE or JOHN MIDDLE DOE
    /^([A-Z]{2,}(?:\s+[A-Z]{2,}){1,3})(?:\s|$|\n)/m,
    // Pattern 5: Mixed case name on first line: John Doe or John Middle Doe
    /^([A-Z][a-z]{1,}(?:\s+[A-Z][a-z]{1,}){1,3})(?:\s|$|\n)/m,
    // Pattern 6: Name with proper capitalization (First Middle Last)
    /\b([A-Z][a-z]{1,})\s+([A-Z]\.?\s+)?([A-Z][a-z]{1,})\b/,
    // Pattern 7: Name on line by itself (handles both uppercase and mixed case)
    /^([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+){1,2})\s*$/m,
    // Pattern 8: Two capitalized words that look like a name (more flexible)
    /\b([A-Z][A-Za-z\-\']{2,})\s+([A-Z][A-Za-z\-\']{2,})\b/,
  ];

  // Helper function to clean name (just trim, don't change case)
  const cleanName = (name) => {
    if (!name) return '';
    return name.trim();
  };

  // Helper function to validate if a word could be a name part
  const isValidNamePart = (word) => {
    if (!word || word.length < 2) return false;
    // Must contain only letters, hyphens, or apostrophes (NO NUMBERS)
    if (!/^[A-Za-z\-\']+$/.test(word)) return false;
    // Must not contain any digits
    if (/\d/.test(word)) return false;
    // Must not be all numbers
    if (/^\d+$/.test(word)) return false;
    // Must not look like a date (MM/DD, DD/MM, etc.)
    if (/^\d{1,2}[\/\-\.]\d{1,2}/.test(word)) return false;
    // Must not be a common skip word
    const skipWords = [
      'DRIVER',
      'LICENSE',
      'PERMIT',
      'ID',
      'STATE',
      'DLN',
      'DON',
      'DONOR',
      'CLASS',
      'END',
      'EXP',
      'EXPIRES',
      'ISSUED',
      'DOB',
      'BD',
      'SEX',
      'GENDER',
      'ADDRESS',
      'ADDR',
      'PHONE',
      'TEL',
      'EMAIL',
      'SSN',
      'SS#',
      'HEIGHT',
      'WEIGHT',
      'EYES',
      'HAIR',
      'RESTRICTIONS',
      'ENDORSEMENTS',
    ];
    return !skipWords.includes(word.toUpperCase());
  };

  for (const pattern of namePatterns) {
    const match =
      textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match) {
      // Pattern with separate first and last (patterns 1, 2)
      if (
        match.length >= 3 &&
        match[1] &&
        match[2] &&
        isValidNamePart(match[1]) &&
        isValidNamePart(match[2]) &&
        !/\d/.test(match[1]) && // Extra check: no digits in first name
        !/\d/.test(match[2]) // Extra check: no digits in last name
      ) {
        result.firstName = cleanName(match[1]);
        result.lastName = cleanName(match[2]);
        if (match[3] && isValidNamePart(match[3]) && !/\d/.test(match[3])) {
          result.middleName = cleanName(match[3].replace('.', ''));
        }
        console.log(
          'Name extracted (pattern 1-2):',
          result.firstName,
          result.lastName
        );
        break;
      }
      // Pattern with full name string (patterns 3-8)
      else if (match[1]) {
        let nameStr = match[1]
          .replace(/^(?:DON|DONOR|NAME)[\s\W:]*/i, '')
          .trim();

        // Split and filter name parts
        const nameParts = nameStr
          .split(/\s+/)
          .map((p) => p.trim())
          .filter((p) => isValidNamePart(p));

        if (nameParts.length >= 2 && nameParts.length <= 4) {
          // Additional validation: check if parts look like names
          const allValid = nameParts.every((p) => {
            // Must start with capital letter
            if (!/^[A-Z]/.test(p)) return false;
            // Must be at least 2 characters
            if (p.length < 2) return false;
            // Must not contain any digits
            if (/\d/.test(p)) return false;
            // Must not look like a date
            if (/^\d{1,2}[\/\-\.]\d{1,2}/.test(p)) return false;
            // Middle initial is OK (1-2 chars, letters only)
            if (p.length <= 2 && p.match(/^[A-Z]\.?$/)) return true;
            // Full name part should be at least 2 chars and letters only
            return p.length >= 2 && /^[A-Za-z\-\']+$/.test(p);
          });

          if (allValid) {
            result.firstName = cleanName(nameParts[0]);
            result.lastName = cleanName(nameParts[nameParts.length - 1]);

            if (nameParts.length > 2) {
              // Handle middle name/initial
              const middleParts = nameParts.slice(1, -1);
              const middleStr = middleParts.join(' ').replace(/\./g, '');
              result.middleName = cleanName(middleStr);
            }

            console.log(
              'Name extracted (pattern 3-8):',
              result.firstName,
              result.middleName || '(none)',
              result.lastName
            );
            break;
          }
        }
      }
    }
  }

  // Fallback: If no name found, try to find it in the first few lines
  // Names are typically at the top of driver's licenses
  if (!result.firstName || !result.lastName) {
    const lines = normalizedText.split('\n').slice(0, 5); // Check first 5 lines
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Skip lines that contain dates (common issue - dates being extracted as names)
      if (/\d{1,2}[\/\-\.]\d{1,2}/.test(trimmedLine)) continue;

      // Look for 2-4 capitalized words that could be a name (NO DIGITS)
      const nameMatch = trimmedLine.match(
        /^([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+){1,3})$/
      );
      if (nameMatch) {
        const nameStr = nameMatch[1];
        // Double check the entire string doesn't contain digits
        if (/\d/.test(nameStr)) continue;

        const nameParts = nameStr
          .split(/\s+/)
          .filter((p) => isValidNamePart(p) && !/\d/.test(p));

        if (nameParts.length >= 2 && nameParts.length <= 4) {
          // Double check it's not already extracted or a skip word
          const firstPart = nameParts[0].toUpperCase();
          const skipWords = ['DRIVER', 'LICENSE', 'PERMIT', 'STATE', 'ID'];
          if (!skipWords.includes(firstPart)) {
            result.firstName = cleanName(nameParts[0]);
            result.lastName = cleanName(nameParts[nameParts.length - 1]);
            if (nameParts.length > 2) {
              result.middleName = cleanName(nameParts.slice(1, -1).join(' '));
            }
            console.log(
              'Name extracted (fallback from first lines):',
              result.firstName,
              result.lastName
            );
            break;
          }
        }
      }
    }
  }

  // Extract Date of Birth
  // Common patterns: DOB, BIRTH, BD, or date formats
  const dobPatterns = [
    /(?:DOB|BIRTH|BD|DATE OF BIRTH|BIRTHDATE|BIRTH DATE)[\s\W:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g, // Generic date pattern
  ];

  const foundDates = [];
  for (const pattern of dobPatterns) {
    const matches =
      textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (matches) {
      for (const dateStr of matches) {
        const cleanDate = dateStr
          .replace(
            /^(?:DOB|BIRTH|BD|DATE OF BIRTH|BIRTHDATE|BIRTH DATE)[\s\W:]*/i,
            ''
          )
          .trim();
        const parsedDate = parseDate(cleanDate);
        if (parsedDate && isValidDOB(parsedDate)) {
          foundDates.push(parsedDate);
        }
      }
    }
  }

  // Use the earliest date found (most likely DOB)
  if (foundDates.length > 0) {
    foundDates.sort((a, b) => a - b);
    result.dateOfBirth = foundDates[0];
    console.log('DOB extracted:', result.dateOfBirth);
  }

  // Extract Address - improved to handle line2 (apartment/unit numbers)
  const addressPatterns = [
    // Pattern 1: Full address with line2 (APT, UNIT, #, etc.)
    /(?:ADDRESS|ADDR|RES)[\s\W:]*(\d+\s+[A-Z0-9\s,\-#]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|DR|DRIVE|BLVD|BOULEVARD|LN|LANE|CT|COURT|PL|PLACE|PKWY|PARKWAY|WAY|CIR|CIRCLE)[\s,]+(?:APT|APARTMENT|UNIT|STE|SUITE|#|NO\.?)[\s\W:]*([A-Z0-9\-\#]+))?[\s,]+([A-Z\s]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i,
    // Pattern 2: Address without line2
    /(?:ADDRESS|ADDR|RES)[\s\W:]*(\d+\s+[A-Z0-9\s,\-#]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|DR|DRIVE|BLVD|BOULEVARD|LN|LANE|CT|COURT|PL|PLACE|PKWY|PARKWAY|WAY|CIR|CIRCLE)[\s,]+[A-Z\s]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/i,
    // Pattern 3: Generic address pattern
    /(\d+\s+[A-Z0-9\s,\-#]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|DR|DRIVE|BLVD|BOULEVARD|LN|LANE|CT|COURT|PL|PLACE|PKWY|PARKWAY|WAY|CIR|CIRCLE)[\s,]+[A-Z\s]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/i,
    // Pattern 4: Simpler pattern: number + street name + city, state zip
    /(\d+\s+[A-Z0-9\s,\-#]+),\s*([A-Z\s]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i,
  ];

  for (const pattern of addressPatterns) {
    const match =
      textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match) {
      // Pattern 1: Has line2 (apartment/unit)
      if (match[1] && match[2] && match[3] && match[4] && match[5]) {
        result.address.line1 = match[1].trim();
        result.address.line2 = match[2].trim(); // APT/UNIT number
        result.address.city = match[3].trim();
        result.address.state = match[4].trim().toUpperCase();
        result.address.postalCode = match[5].trim();
        console.log('Address extracted with line2:', result.address);
        break;
      }
      // Pattern 4: Simple separate components
      else if (match[1] && match[2] && match[3] && match[4] && !match[5]) {
        result.address.line1 = match[1].trim();
        result.address.city = match[2].trim();
        result.address.state = match[3].trim().toUpperCase();
        result.address.postalCode = match[4].trim();
        console.log('Address extracted:', result.address);
        break;
      }
      // Other patterns: parse the full address string
      else if (match[1]) {
        const addressStr = match[1]
          .replace(/^(?:ADDRESS|ADDR|RES)[\s\W:]*/i, '')
          .trim();
        const parsedAddress = parseAddress(addressStr);
        if (parsedAddress.line1) {
          result.address = parsedAddress;
          console.log('Address extracted:', result.address);
          break;
        }
      }
    }
  }

  // Extract Gender
  // Common patterns: "SEX", "GENDER", "M", "F", "MALE", "FEMALE"
  const genderPatterns = [
    /(?:SEX|GENDER)[\s\W:]*([MF]|MALE|FEMALE)/i,
    /\bSEX[\s\W:]*([MF])\b/i,
    /\b([MF])\b(?!\d)(?![A-Z])/i, // Standalone M or F (not part of word or number)
  ];

  for (const pattern of genderPatterns) {
    const match =
      textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match) {
      const genderStr = match[1].toUpperCase();
      if (genderStr === 'M' || genderStr === 'MALE') {
        result.gender = 'male';
        console.log('Gender extracted: male');
        break;
      } else if (genderStr === 'F' || genderStr === 'FEMALE') {
        result.gender = 'female';
        console.log('Gender extracted: female');
        break;
      }
    }
  }

  // Extract SSN (Social Security Number)
  // Common patterns: SSN, SS#, or just the number format XXX-XX-XXXX
  const ssnPatterns = [
    /(?:SSN|SS#|SOCIAL SECURITY)[\s\W:]*(\d{3}[\s\-]?\d{2}[\s\-]?\d{4})/i,
    /\b(\d{3}[\s\-]\d{2}[\s\-]\d{4})\b/, // XXX-XX-XXXX format
    /\b(\d{9})\b/, // Just 9 digits (less reliable - only if no other pattern matches)
  ];

  for (const pattern of ssnPatterns) {
    const match =
      textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match) {
      const ssnStr = match[1].replace(/[\s\-]/g, '');
      // Validate it's 9 digits and not a date or other number
      if (ssnStr.length === 9 && /^\d{9}$/.test(ssnStr)) {
        // Check it's not all zeros or a common invalid pattern
        if (!ssnStr.match(/^0{9}$|^123456789$|^111111111$|^000000000$/)) {
          result.ssn = ssnStr;
          console.log('SSN extracted (masked):', '***-**-' + ssnStr.slice(-4));
          break;
        }
      }
    }
  }

  // Extract Phone Number
  // Common patterns: PHONE, PH, TEL, or phone number formats
  const phonePatterns = [
    /(?:PHONE|PH|TEL|TELEPHONE)[\s\W:]*(\+?1?[\s\-\.]?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4})/i,
    /\b(\+?1?[\s\-\.]?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4})\b/, // Generic phone format
    /\b(\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4})\b/, // (XXX) XXX-XXXX or variations
  ];

  for (const pattern of phonePatterns) {
    const match =
      textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match) {
      let phoneStr = match[1].replace(/[\s\-\.\(\)]/g, '');
      // Remove leading +1 or 1
      if (phoneStr.startsWith('1') && phoneStr.length === 11) {
        phoneStr = phoneStr.substring(1);
      } else if (phoneStr.startsWith('+1')) {
        phoneStr = phoneStr.substring(2);
      }
      // Validate it's 10 digits
      if (phoneStr.length === 10 && /^\d{10}$/.test(phoneStr)) {
        result.phonePrimary = phoneStr;
        console.log('Phone extracted:', phoneStr);
        break;
      }
    }
  }

  // Extract Email (if present on license - rare but possible)
  const emailPattern = /\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/;
  const emailMatch =
    textWithoutNewlines.match(emailPattern) ||
    normalizedText.match(emailPattern);
  if (emailMatch) {
    result.email = emailMatch[1].toLowerCase();
    console.log('Email extracted:', result.email);
  }

  console.log('Final parsed result:', {
    ...result,
    ssn: result.ssn ? '***-**-' + result.ssn.slice(-4) : '',
  });
  return result;
};

/**
 * Parse date string to Date object
 * @param {string} dateStr - Date string in various formats
 * @returns {Date|null} Parsed date or null
 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  // Remove common prefixes
  const cleanDate = dateStr
    .replace(/^(?:DOB|BIRTH|BD|DATE OF BIRTH)[\s:]*/i, '')
    .trim();

  // Try different date formats
  const formats = [
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/, // MM/DD/YYYY, MM-DD-YYYY, or MM.DD.YYYY
  ];

  for (const format of formats) {
    const match = cleanDate.match(format);
    if (match) {
      let month = parseInt(match[1], 10);
      let day = parseInt(match[2], 10);
      let year = parseInt(match[3], 10);

      // Handle 2-digit years
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }

      // Validate month and day
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const date = new Date(year, month - 1, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          return date;
        }
      }
    }
  }

  return null;
};

/**
 * Check if date is a valid DOB (not in future, reasonable age)
 * @param {Date} date - Date to validate
 * @returns {boolean}
 */
const isValidDOB = (date) => {
  if (!date) return false;
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  // DOB should be in the past and age should be reasonable (0-150 years)
  return date <= now && age >= 0 && age <= 150;
};

/**
 * Parse address string to structured address object
 * @param {string} addressStr - Address string
 * @returns {Object} Parsed address
 */
const parseAddress = (addressStr) => {
  const result = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  };

  if (!addressStr) return result;

  // Pattern 1: Address with line2 (APT, UNIT, etc.)
  let addressPattern =
    /^(\d+\s+[A-Z0-9\s,\-#]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|DR|DRIVE|BLVD|BOULEVARD|LN|LANE|CT|COURT|PL|PLACE|PKWY|PARKWAY|WAY|CIR|CIRCLE))[\s,]+(?:APT|APARTMENT|UNIT|STE|SUITE|#|NO\.?)[\s\W:]*([A-Z0-9\-\#]+)[\s,]+([A-Z\s]+),?\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i;
  let match = addressStr.match(addressPattern);

  if (match) {
    result.line1 = match[1].trim();
    result.line2 = match[2].trim();
    result.city = match[3].trim();
    result.state = match[4].trim().toUpperCase();
    result.postalCode = match[5].trim();
    return result;
  }

  // Pattern 2: Address without line2
  addressPattern =
    /^(\d+\s+[A-Z0-9\s,\-#]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|DR|DRIVE|BLVD|BOULEVARD|LN|LANE|CT|COURT|PL|PLACE|PKWY|PARKWAY|WAY|CIR|CIRCLE)),?\s*([A-Z\s]+),?\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i;
  match = addressStr.match(addressPattern);

  if (match) {
    result.line1 = match[1].trim();
    result.city = match[2].trim();
    result.state = match[3].trim().toUpperCase();
    result.postalCode = match[4].trim();
  } else {
    // Fallback: try to extract components separately
    const parts = addressStr
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (parts.length >= 3) {
      // Check if first part has apartment info
      const aptMatch = parts[0].match(
        /^(.+?)[\s,]+(?:APT|APARTMENT|UNIT|STE|SUITE|#|NO\.?)[\s\W:]*([A-Z0-9\-\#]+)$/i
      );
      if (aptMatch) {
        result.line1 = aptMatch[1].trim();
        result.line2 = aptMatch[2].trim();
      } else {
        result.line1 = parts[0];
      }
      result.city = parts[1];
      const stateZip = parts[2].match(/([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i);
      if (stateZip) {
        result.state = stateZip[1].toUpperCase();
        result.postalCode = stateZip[2];
      } else {
        // Try to find state and zip in the last part
        const stateMatch = parts[2].match(/([A-Z]{2})/);
        const zipMatch = parts[2].match(/(\d{5}(?:-\d{4})?)/);
        if (stateMatch) result.state = stateMatch[1];
        if (zipMatch) result.postalCode = zipMatch[1];
      }
    } else if (parts.length === 2) {
      // Just street and city/state/zip
      result.line1 = parts[0];
      const cityStateZip = parts[1];
      const cityMatch = cityStateZip.match(
        /^([A-Z\s]+),?\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/i
      );
      if (cityMatch) {
        result.city = cityMatch[1].trim();
        result.state = cityMatch[2].toUpperCase();
        result.postalCode = cityMatch[3];
      }
    }
  }

  return result;
};

/**
 * Parse insurance card OCR text to extract insurance information
 * Handles various US insurance card formats
 * @param {string} ocrText - Raw OCR text from insurance card
 * @returns {Object} Parsed insurance data
 */
export const parseInsuranceCard = (ocrText) => {
  const result = {
    subscriberName: '',
    policyNumber: '',
    groupNumber: '',
    subscriberDateOfBirth: null,
    effectiveDate: null,
    expirationDate: null,
    insuranceCompanyName: '',
  };

  if (!ocrText) return result;

  // Log raw OCR text for debugging
  console.log('Raw Insurance OCR Text:', ocrText);

  // Normalize text: remove extra spaces, newlines, and common OCR errors
  let normalizedText = ocrText
    .replace(/[|]/g, 'I')
    .replace(/[0O]/g, (m, offset) => {
      const before = ocrText[offset - 1] || '';
      const after = ocrText[offset + 1] || '';
      if (/\d/.test(before) || /\d/.test(after)) return '0';
      return 'O';
    })
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const textWithoutNewlines = normalizedText.replace(/\n/g, ' ');

  // Extract Subscriber Name
  const namePatterns = [
    /(?:SUBSCRIBER|SUB|MEMBER|NAME|PATIENT)[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+){1,3})/i,
    /(?:NAME|MEMBER NAME)[\s\W:]*([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+){1,3})/i,
    /^([A-Z][A-Za-z\-\']+(?:\s+[A-Z][A-Za-z\-\']+){1,3})(?:\s|$|\n)/m,
  ];

  for (const pattern of namePatterns) {
    const match = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match && match[1]) {
      const nameStr = match[1]
        .replace(/^(?:SUBSCRIBER|SUB|MEMBER|NAME|PATIENT)[\s\W:]*/i, '')
        .trim();
      const nameParts = nameStr.split(/\s+/).filter(p => p.length > 0);
      if (nameParts.length >= 2 && nameParts.length <= 4) {
        result.subscriberName = nameParts.join(' ');
        console.log('Subscriber name extracted:', result.subscriberName);
        break;
      }
    }
  }

  // Extract Policy Number
  const policyPatterns = [
    /(?:POLICY|POL|ID|MEMBER ID|MEMBER NUMBER|MEMBER#)[\s\W:]*([A-Z0-9\-]{4,20})/i,
    /(?:POLICY\s*#|POL\s*#|ID\s*#)[\s\W:]*([A-Z0-9\-]{4,20})/i,
    /\b([A-Z]{1,3}\d{6,12})\b/, // Common format: ABC123456789
    /\b(\d{8,12})\b/, // Just numbers (8-12 digits)
  ];

  for (const pattern of policyPatterns) {
    const match = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match && match[1]) {
      const policyStr = match[1]
        .replace(/^(?:POLICY|POL|ID|MEMBER ID|MEMBER NUMBER|MEMBER#)[\s\W:]*/i, '')
        .trim();
      if (policyStr.length >= 4 && policyStr.length <= 20) {
        result.policyNumber = policyStr;
        console.log('Policy number extracted:', result.policyNumber);
        break;
      }
    }
  }

  // Extract Group Number
  const groupPatterns = [
    /(?:GROUP|GRP|GROUP\s*#|GRP\s*#)[\s\W:]*([A-Z0-9\-]{3,20})/i,
    /(?:GROUP NUMBER|GROUP NO)[\s\W:]*([A-Z0-9\-]{3,20})/i,
  ];

  for (const pattern of groupPatterns) {
    const match = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match && match[1]) {
      const groupStr = match[1]
        .replace(/^(?:GROUP|GRP|GROUP\s*#|GRP\s*#|GROUP NUMBER|GROUP NO)[\s\W:]*/i, '')
        .trim();
      if (groupStr.length >= 3 && groupStr.length <= 20) {
        result.groupNumber = groupStr;
        console.log('Group number extracted:', result.groupNumber);
        break;
      }
    }
  }

  // Extract Subscriber Date of Birth
  const dobPatterns = [
    /(?:DOB|BIRTH|DATE OF BIRTH|BIRTHDATE|SUBSCRIBER DOB)[\s\W:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
  ];

  const foundDates = [];
  for (const pattern of dobPatterns) {
    const matches = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (matches) {
      for (const dateStr of matches) {
        const cleanDate = dateStr
          .replace(/^(?:DOB|BIRTH|DATE OF BIRTH|BIRTHDATE|SUBSCRIBER DOB)[\s\W:]*/i, '')
          .trim();
        const parsedDate = parseDate(cleanDate);
        if (parsedDate && isValidDOB(parsedDate)) {
          foundDates.push(parsedDate);
        }
      }
    }
  }

  // Use the earliest date found (most likely DOB)
  if (foundDates.length > 0) {
    foundDates.sort((a, b) => a - b);
    result.subscriberDateOfBirth = foundDates[0];
    console.log('Subscriber DOB extracted:', result.subscriberDateOfBirth);
  }

  // Extract Effective Date
  const effectiveDatePatterns = [
    /(?:EFFECTIVE|EFF|EFFECTIVE DATE|EFF DATE|COVERAGE BEGINS|BEGINS)[\s\W:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
  ];

  for (const pattern of effectiveDatePatterns) {
    const match = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match && match[1]) {
      const parsedDate = parseDate(match[1]);
      if (parsedDate) {
        result.effectiveDate = parsedDate;
        console.log('Effective date extracted:', result.effectiveDate);
        break;
      }
    }
  }

  // Extract Expiration Date
  const expirationDatePatterns = [
    /(?:EXP|EXPIRES|EXPIRATION|EXP DATE|EXPIRATION DATE|COVERAGE ENDS|ENDS)[\s\W:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
  ];

  for (const pattern of expirationDatePatterns) {
    const match = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match && match[1]) {
      const parsedDate = parseDate(match[1]);
      if (parsedDate) {
        result.expirationDate = parsedDate;
        console.log('Expiration date extracted:', result.expirationDate);
        break;
      }
    }
  }

  // Extract Insurance Company Name
  const companyPatterns = [
    /(?:INSURANCE|INS|CARRIER|PROVIDER|COMPANY)[\s\W:]*([A-Z][A-Za-z0-9\s&\-\.]{3,30})/i,
    /^([A-Z][A-Za-z0-9\s&\-\.]{3,30})(?:\s|$|\n)/m,
  ];

  // Common insurance company names to look for
  const commonCompanies = [
    'BLUE CROSS', 'BLUE SHIELD', 'AETNA', 'CIGNA', 'UNITED HEALTHCARE',
    'UNITEDHEALTH', 'HUMANA', 'ANTHEM', 'KAISER', 'MEDICARE', 'MEDICAID',
    'TRICARE', 'BCBS', 'BC/BS',
  ];

  for (const pattern of companyPatterns) {
    const match = textWithoutNewlines.match(pattern) || normalizedText.match(pattern);
    if (match && match[1]) {
      const companyStr = match[1]
        .replace(/^(?:INSURANCE|INS|CARRIER|PROVIDER|COMPANY)[\s\W:]*/i, '')
        .trim();
      if (companyStr.length >= 3 && companyStr.length <= 50) {
        result.insuranceCompanyName = companyStr;
        console.log('Insurance company extracted:', result.insuranceCompanyName);
        break;
      }
    }
  }

  // Fallback: Check for common company names in text
  if (!result.insuranceCompanyName) {
    for (const company of commonCompanies) {
      const regex = new RegExp(company, 'i');
      if (textWithoutNewlines.match(regex) || normalizedText.match(regex)) {
        result.insuranceCompanyName = company;
        console.log('Insurance company found (common name):', result.insuranceCompanyName);
        break;
      }
    }
  }

  console.log('Final parsed insurance result:', result);
  return result;
};