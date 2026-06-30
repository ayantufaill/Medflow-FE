export const DUMMY_INSURANCE = [
  { payerId: '00621', carrierName: 'Blue Cross Blue Shield of Illinois', groupName: 'VIVID SEATS, LLC', groupNumber: '300871', planName: 'BCBS IL', payerAddress: '123 Blue St, Chicago, IL', carrierPhone: '800-123-4567' },
  { payerId: '52133', carrierName: 'United Healthcare Dental', groupName: 'DOXIM', groupNumber: '1602187', planName: 'UHC ( DOXIM )', payerAddress: '456 Health Way, Minnetonka, MN', carrierPhone: '800-987-6543' },
  { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'Texas Health Resources', groupNumber: '087639801700001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TX Health Resources', groupNumber: '087639801300001', planName: 'TX HEALTH RESOURCES', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'Texas Health Resources', groupNumber: '876398-17-001', planName: '800-451-7715', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna(TEXAS HEALTH RESOURCES)', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
];

export const DEFAULT_COVERAGE = {
  individual: { unlimited: false, annualMax: '$1,500.00', usedAmount: '$158.00', usedAmountDate: '' },
  family: { unlimited: true, annualMax: '', usedAmount: '', usedAmountDate: '' },
  ortho: { annualMax: '$2,000.00', usedAmount: '$18.00', usedAmountDate: '03/03/2026' },
  categories: ['Diagnostic', 'Preventative', 'Major']
};

export const COVERAGE_DATA = {
  diagnostic: [
    { id: 1, label: 'Preventative', coverage: 100, waiting: 0, notes: '' },
    { id: 2, label: 'Basic', coverage: 80, waiting: 0, notes: '' }
  ],
  preventative: [
    { id: 3, label: 'Preventative', coverage: 100, waiting: 0, notes: '' },
    { id: 4, label: 'General', coverage: 100, waiting: 0, notes: '' },
    { id: 5, label: 'Basic', coverage: 80, waiting: 0, notes: '' }
  ],
  restorative: [
    { id: 6, label: 'Basic', coverage: 80, waiting: 0, notes: '' },
    { id: 7, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 8, label: 'General', coverage: 80, waiting: 0, notes: '' }
  ],
  endodontics: [
    { id: 9, label: 'Endodontics', coverage: 80, waiting: 0, notes: '' }
  ],
  periodontics: [
    { id: 10, label: 'Major', coverage: 50, waiting: 0, notes: '' }
  ],
  implantServices: [
    { id: 11, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 12, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ],
  oralSurgery: [
    { id: 13, label: 'Basic', coverage: 80, waiting: 0, notes: '' },
    { id: 14, label: 'Major', coverage: 50, waiting: 0, notes: '' }
  ],
  prosthodonticsFixed: [
    { id: 15, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ],
  prosthodonticsRemovable: [
    { id: 16, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ],
  adjunctGeneral: [
    { id: 17, label: 'Basic', coverage: 80, waiting: 0, notes: '' },
    { id: 18, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 19, label: 'Standard', coverage: 50, waiting: 0, notes: '' }
  ],
  orthodontics: [
    { id: 20, label: 'Orthodontics', coverage: 50, waiting: 0, notes: '' },
    { id: 21, label: 'orthodontics', coverage: 50, waiting: 0, notes: '' }
  ],
  maxillofacialProsthetics: [
    { id: 22, label: 'Major', coverage: 50, waiting: 0, notes: '' },
    { id: 23, label: 'General', coverage: 50, waiting: 0, notes: '' }
  ]
};

export const DEFAULT_BOOK_ROW_DATA = [
  { code: "CNAN3 e A", name: "Alternative to Fluoride varnish", age: "18" },
  { code: "D1206", name: "Topical application of fluoride", age: "18" },
  { code: "D1208", name: "Topical application of fluoride - except varnish", age: "18" },
  { code: "D1351", name: "Sealant - per tooth", age: "15" },
  { code: "D2740", name: "Crown - porcelain/ceramic substrate materials", age: "" },
  { code: "D2750", name: "Crown - porcelain fused to high noble metal", age: "" },
];
