export const ASSIGNMENT_OF_BENEFITS_OPTIONS = [
  { value: 1, label: 'Pay to dentist (Assignment)' },
  { value: 2, label: 'Pay to patient (Benefit)' },
  { value: 3, label: 'Pay to both (Split)' }
];

export const COVERAGE_TYPES = [
  { value: 'ppo', label: 'Percentage Based Coverage (PPO)' },
  { value: 'table', label: 'Table/Schedule of Benefits' },
  { value: 'flat', label: 'Flat Fee' }
];

export const monthMapReverse = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April',
  5: 'May', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December'
};

export const monthMap = { 
  January: 1, February: 2, March: 3, April: 4, 
  May: 5, June: 6, July: 7, August: 8, 
  September: 9, October: 10, November: 11, December: 12 
};

export const STYLE_CONSTANTS = {
  blueHeader: "#f0f4f8",
  sectionTitle: { fontWeight: 700, mb: 1, color: "#333", fontSize: "0.85rem" },
  tinyText: { fontSize: '0.7rem' },
  tableHeaderStyle: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: "#555",
    borderRight: '1px solid #e0e0e0',
    py: 0.5,
    lineHeight: 1.1,
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  },
  inputBg: "#f9fafb",
  headerStyle: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: "#555",
    borderRight: '1px solid #e0e0e0',
    py: 0.5
  },
  bodyCellStyle: {
    fontSize: '0.75rem',
    borderRight: '1px solid #eee',
    py: 0.2,
    height: '35px'
  }
};
