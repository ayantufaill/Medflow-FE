export const TIME_LABEL_WIDTH = 52;
export const COLUMN_MIN_WIDTH = 260;
export const HOUR_HEIGHT = 120;
export const START_HOUR = 7;
export const HOURS = Array.from({ length: 14 }, (_, i) => i + START_HOUR); // 7AM → 8PM

export const OPERATORIES = [
  { id: 1, name: 'Hygiene 01',   doctor: 'Dr. Sophie Lee',    color: '#2262ef' },
  { id: 2, name: 'Treatment 01', doctor: 'Dr. Marcus Chen',   color: '#2262ef' },
  { id: 3, name: 'Hygiene 02',   doctor: 'Sharon Smith, RDH', color: '#4caf50' },
  { id: 4, name: 'Hygiene 03',   doctor: 'Amy Park, RDH',     color: '#4caf50' },
];

export const formatHour = (h) => {
  if (h === 12) return '12PM';
  return h > 12 ? `${h - 12}PM` : `${h}AM`;
};

export const MOCK_APPOINTMENTS = [
  // Training blocks at 7AM for all operatories
  ...[ 1, 2, 3, 4 ].map((opId) => ({
    id: `block-${opId}`,
    type: 'block',
    title: 'Keep schedule clear · Training',
    operatoryId: opId,
    startHour: 7,
    startMinute: 0,
    durationMinutes: 60,
  })),
  {
    id: 'apt-1',
    patientName: 'ALI TARIQ',
    time: '11:00 AM',
    status: 'UNCONFIRMED',
    procedures: 'Crown(3), Office',
    description: 'Whitening Full, Comprehensive Evaluation',
    tags: ['EXM', 'PRV', 'PRV', 'Xray', 'Xray'],
    price: '$224.00 / $224.00',
    operatoryId: 1,
    startHour: 11,
    startMinute: 0,
    durationMinutes: 120,
    headerColor: '#2262ef',
  },
  {
    id: 'apt-2',
    patientName: 'ALI TARIQ',
    time: '09:00 AM',
    status: 'PRECONFIRMED',
    procedures: 'Crown(3), Office',
    description: 'Whitening Full, Comprehensive Evaluation',
    tags: ['EXM', 'PRV', 'PRV', 'Xray', 'Xray'],
    price: '$224.00 / $224.00',
    operatoryId: 3,
    startHour: 9,
    startMinute: 0,
    durationMinutes: 120,
    headerColor: '#0d9488',
  },
];
