import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Sync as SyncIcon,
  InfoOutlined as InfoIcon,
  ChevronRight as ChevronRightIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  DescriptionOutlined as DescriptionIcon,
} from '@mui/icons-material';
import { feeService } from '../../services/fee.service';

const CODES_CATEGORIES = [
  'Diagnostic',
  'Preventive',
  'Restorative',
  'Endodontics',
  'Periodontics',
  'Prosthodontics, Removable',
  'Implant Services',
  'Prosthodontics, Fixed',
  'Oral & Maxillofacial Surgery',
  'Orthodontics',
  'Adjunctive General Services',
];

const MOCK_SUBTYPE_CODES = {
  'Oral evaluation': [
    { ProcCode: 'D0120', Descript: 'periodic oral evaluation - established patient', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D0140', Descript: 'limited oral evaluation - problem focused', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D0145', Descript: 'oral evaluation for a patient under three years of age and counseling with primary caregiver', site: 'None', dbi: false, provider: 'Default' },
    { ProcCode: 'D0150', Descript: 'comprehensive oral evaluation - new or established patient', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D0160', Descript: 'detailed and extensive oral evaluation - problem focused, by report', site: 'None', dbi: false, provider: 'Default' },
    { ProcCode: 'D0170', Descript: 're-evaluation - limited, problem focused (established patient; not post-operative visit)', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D0171', Descript: 're-evaluation - post-operative office visit', site: 'None', dbi: false, provider: 'Default' },
    { ProcCode: 'D0180', Descript: 'Comprehensive Periodontal Evaluation - New or Established Patient', site: 'None', dbi: false, provider: 'Default' },
    { ProcCode: 'D0190', Descript: 'screening of a patient', site: 'None', dbi: false, provider: 'Default' },
    { ProcCode: 'D0191', Descript: 'assessment of a patient', site: 'None', dbi: false, provider: 'Default' },
  ],
  'Diagnostic Imaging': [
    { ProcCode: 'D0330', Descript: 'panoramic radiographic image', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D0210', Descript: 'intraoral - complete series of radiographic images', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D0220', Descript: 'intraoral - periapical first radiographic image', site: 'None', dbi: false, provider: 'Default' },
  ],
  'Fluoride': [
    { ProcCode: 'D1206', Descript: 'topical application of fluoride varnish', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D1208', Descript: 'topical application of fluoride - excluding varnish', site: 'None', dbi: false, provider: 'Default' },
  ],
  'Prophy': [
    { ProcCode: 'D1110', Descript: 'prophylaxis - adult', site: 'None', dbi: false, provider: 'Dentist' },
    { ProcCode: 'D1120', Descript: 'prophylaxis - child', site: 'None', dbi: false, provider: 'Default' },
  ],
};

const INITIAL_CODES_TAB = [
  { 
    name: 'Diagnostic', 
    subItems: [
      'Oral evaluation', 'Diagnostic Imaging', 'Additional Imaging', 'CBCT', 
      'Diagnostic Tests', 'Oral pathology', 'Tests', 'Caries assessment', 
      '$$', 'Diagnostic Mock-Up', 'redo prev tx', 'Diagnostic'
    ] 
  },
  { 
    name: 'Preventative', 
    subItems: ['Prophy', 'Fluoride', 'Preventative services', 'Space maintenance', 'vaccine administration'] 
  },
  { 
    name: 'Restorative', 
    subItems: [
      'Direct', 'Indirect Adhesive', 'Indirect', 'Indirect Cohesive', 
      'Recement/Repair', 'Pediatric', 'Additional restorative', 'BU/P&C', 
      'Restorative', 'Per arch', 'clip-stationery'
    ] 
  },
  { name: 'Endodontics', subItems: [] },
  { name: 'Periodontics', subItems: [] },
  { name: 'Prosthodontics, Removable', subItems: [] },
  { name: 'Maxillofacial Prosthetics', subItems: [] },
  { name: 'Implant Services', subItems: [] },
  { name: 'Prosthodontics, Fixed', subItems: [] },
  { name: 'Oral Surgery', subItems: [] },
  { name: 'Orthodontics', subItems: [] },
  { name: 'Adjunctive General Services', subItems: [] },
  { name: 'Medicament carrier', subItems: [] },
  { name: 'Product', subItems: [] },
  { name: 'Myofunctional Therapy', subItems: [] },
  { name: 'Adjunctive', subItems: [] },
  { name: 'Prosthodontics, Resection', subItems: [] },
];

const INITIAL_NO_CHARGE = [
  { 
    id: 0, name: 'Delivery ortho appliance', icon: 'braces',
    procedures: [{ id: 1, code: 'Cd8999.1', subCode: '', billed: false, phase: '', visit: '' }]
  },
  { 
    id: 0, name: 'Delivery-crown', icon: 'no-charge-gold',
    procedures: [{ id: 1, code: 'CD2999', subCode: '', billed: false, phase: '', visit: '' }]
  },
  { 
    id: 1, name: 'Adjustment', icon: 'no-charge-red',
    procedures: [{ id: 1, code: 'D9951', subCode: 'nc', billed: false, phase: '', visit: 'Visit 1' }]
  },
  { 
    id: 2, name: 'Post Op', icon: 'p-op',
    procedures: [{ id: 1, code: 'D0171', subCode: 'nc', billed: false, phase: '', visit: 'Visit 1' }]
  },
  { 
    id: 3, name: 'Periodic ortho', icon: 'braces',
    procedures: [{ id: 1, code: 'D8670', subCode: 'nc', billed: false, phase: '', visit: '' }]
  },
];

const INITIAL_POWER_CODES = [
  { 
    id: 0, name: 'Full work up', icon: 'goggles',
    procedures: [
      { id: 1, code: 'C2999.20', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 2, code: 'D0350', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 3, code: 'D0302', subCode: '', billed: false, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 5, code: 'D8210', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 6, code: 'Cd8999.1', subCode: '', billed: false, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 7, code: 'D0470', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
    ]
  },
  { 
    id: 0, name: 'New', icon: 'label-new',
    procedures: [
      { id: 1, code: 'D0150', subCode: '', billed: true, phase: '', visit: '' },
      { id: 2, code: 'D0210', subCode: '', billed: true, phase: '', visit: '' },
      { id: 3, code: 'D0302', subCode: '3D scan', billed: false, phase: '', visit: '' },
    ]
  },
  { 
    id: 2, name: 'HYG child w/ Xray', icon: 'label-kid',
    procedures: [
      { id: 1, code: 'D1120', subCode: 'Prophy <14yo', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D0150', subCode: 'Comp Exam', billed: true, phase: '', visit: '' },
      { id: 3, code: 'D1208', subCode: 'Fluoride', billed: true, phase: '', visit: '' },
      { id: 4, code: 'D0274', subCode: 'Bitewings', billed: true, phase: '', visit: '' },
      { id: 5, code: 'D0220', subCode: 'Periapical', billed: true, phase: '', visit: '' },
      { id: 6, code: 'D0230', subCode: 'Periapical', billed: true, phase: '', visit: '' },
    ]
  },
  { 
    id: 3, name: 'ScRP/Laser', icon: 'label-srp',
    procedures: [
      { id: 1, code: 'D4341', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 2, code: 'CD4999.1', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 3, code: 'PS7213774927MML62137', subCode: 'Rinse', billed: true, phase: '', visit: 'Visit 1' },
      { id: 4, code: 'CD4999.4', subCode: 'Irrigation', billed: true, phase: '', visit: 'Visit 1' },
      { id: 5, code: 'CD4999.5', subCode: 'Disinfection A', billed: true, phase: '', visit: 'Visit 2' },
    ]
  },
  { 
    id: 4, name: 'Gingivitis', icon: 'label-gin',
    procedures: [
      { id: 1, code: 'D4346', subCode: '', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'CD4999.1', subCode: 'Quadrant', billed: true, phase: '', visit: 'Visit 1' },
      { id: 3, code: 'CD4999.4', subCode: 'Irrigation', billed: true, phase: '', visit: 'Visit 1' },
    ]
  },
  { 
    id: 5, name: 'Perio Recall w/ Xray', icon: 'probe',
    procedures: [
      { id: 1, code: 'D4910', subCode: 'Maintenance', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D0274', subCode: 'Bitewings', billed: true, phase: '', visit: 'Visit 1' },
      { id: 3, code: 'D1208', subCode: 'Fluoride', billed: true, phase: '', visit: 'Visit 1' },
    ]
  },
  { 
    id: 6, name: 'Single crown', icon: 'tooth-green',
    procedures: [
      { id: 1, code: 'D2740', subCode: 'Prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D2740', subCode: 'Delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 3, code: 'D0220', subCode: 'PA', billed: true, phase: '', visit: 'Visit 1' },
    ]
  },
  { 
    id: 7, name: 'Onlay', icon: 'tooth-white',
    procedures: [
      { id: 1, code: 'D2783', subCode: 'Onlay', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'CD2999', subCode: 'Delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 3, code: 'D0220', subCode: 'PA', billed: true, phase: '', visit: 'Visit 1' },
    ]
  },
  { 
    id: 8, name: 'Single Implant', icon: 'bolt-implant',
    procedures: [
      { id: 3, code: 'D6057', subCode: 'impression', billed: true, phase: '', visit: 'Visit 1' },
      { id: 3, code: 'D6058', subCode: 'impression', billed: true, phase: '', visit: 'Visit 1' },
      { id: 4, code: 'D6057', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 4, code: 'D6058', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { 
    id: 9, name: 'Invisalign', icon: 'bolt-braces',
    procedures: [
      { id: 1, code: 'D8090', subCode: 'Invisalign start', billed: true, phase: '', visit: 'Visit 1' },
      { id: 1, code: 'D0602', subCode: 'Scan start', billed: false, phase: '', visit: 'Visit 1' },
      { id: 1, code: 'D8695', subCode: 'Retainer removal', billed: false, phase: '', visit: 'Visit 1' },
    ]
  },
  { 
    id: 10, name: 'Deprogrammer + Delivery', icon: 'label-dep',
    procedures: [
      { id: 1, code: 'D0210', subCode: 'Impression/scan', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'Cd8999.1', subCode: 'Delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 3, code: 'D0171', subCode: 'Post op bite confirmation', billed: false, phase: '', visit: 'Visit 3' },
    ]
  },
  { 
    id: 11, name: 'CBC CDCT', icon: 'label-cbc',
    procedures: [
      { id: 1, code: 'D0367', subCode: '', billed: true, phase: '', visit: '' },
    ]
  },
  { 
    id: 12, name: 'Retainers', icon: 'bolt-retainer',
    procedures: [
      { id: 1, code: 'D0600', subCode: 'Scan for retainers', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'Cd8999.1', subCode: 'Deliver retainers', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { 
    id: 13, name: 'Oral DNA', icon: 'oral-dna',
    procedures: [
      { id: 1, code: 'C0699', subCode: '', billed: true, phase: '', visit: 'Visit 1' },
    ]
  },
];

const INITIAL_DIAGNOSTIC = [
  { id: 0, name: 'Screen', icon: 'label-scr', procedures: [] },
  { id: 1, name: 'Oral evaluation Comprehensive Evaluation', icon: 'label-full', procedures: [{ id: 1, code: 'D0150', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 2, name: 'Oral evaluation Limited Evaluation', icon: 'label-ltd', procedures: [{ id: 1, code: 'D0140', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 3, name: 'Oral evaluation Periodic Evaluation', icon: 'label-rcr', procedures: [{ id: 1, code: 'D0120', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 4, name: 'Diagnostic Imaging Panoramic Xray', icon: 'label-pano', procedures: [{ id: 1, code: 'D0330', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 5, name: 'Diagnostic Imaging Intraoral Full Mouth Xrays', icon: 'label-fmx', procedures: [{ id: 1, code: 'D0210', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 6, name: 'Diagnostic Imaging Bitewing Four Xrays', icon: 'icon-grid', procedures: [{ id: 1, code: 'D0274', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 7, name: 'Diagnostic Imaging Bitewing Two Xrays', icon: 'icon-grid', procedures: [{ id: 1, code: 'D0272', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 8, name: 'Diagnostic Imaging Intraoral Periapical Xray', icon: 'label-xray', procedures: [{ id: 1, code: 'D0220', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 9, name: 'Add\'l PA', icon: 'label-add-pa', procedures: [{ id: 1, code: 'D0230', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 10, name: '3d Scan Itero', icon: 'label-scn', procedures: [{ id: 1, code: 'D0802', subCode: '', billed: false, phase: '', visit: '' }] },
  { id: 11, name: 'Consult', icon: 'label-con', procedures: [{ id: 1, code: 'C2999.20', subCode: '', billed: false, phase: '', visit: '' }] },
  { id: 12, name: 'Virtual', icon: 'label-vir', procedures: [] },
];

const INITIAL_PREVENTIVE = [
  { id: 0, name: 'Prev Resin', icon: 'label-prv', procedures: [{ id: 1, code: 'CPRVRES', subCode: 'cprvres', billed: true, phase: '', visit: '' }] },
  { id: 1, name: 'Prophy Adult', icon: 'icon-prophy', procedures: [{ id: 1, code: 'D1110', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 2, name: 'Prophy Child', icon: 'icon-prophy', procedures: [{ id: 1, code: 'D1120', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 3, name: 'Fluoride Varnish', icon: 'icon-varnish', procedures: [{ id: 1, code: 'D1206', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 4, name: 'Preventive services Sealant', icon: 'icon-sealant', procedures: [{ id: 1, code: 'D1351', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 5, name: 'CURODONT', icon: 'icon-curodont', procedures: [] },
];

const INITIAL_RESTORATIVE = [
  { id: 1, name: 'Direct Resin composite', icon: 'tooth-white-filling', procedures: [{ id: 1, code: 'D2392', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 2, name: 'Injection molded composite', icon: 'tooth-yellow-filling', procedures: [] },
  { id: 4, name: 'Porcelain Crown', icon: 'icon-restorative-crown', 
    procedures: [
      { id: 1, code: 'D2740', subCode: 'Prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D2740', subCode: 'Delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 3, code: 'D0220', subCode: 'PA', billed: true, phase: '', visit: 'Visit 1' },
      { id: 4, code: 'D2950', subCode: 'Build up', billed: true, phase: '', visit: 'Visit 1' },
    ]
  },
  { id: 8, name: 'Porcelain Veneer', icon: 'icon-restorative-veneer-double',
    procedures: [
      { id: 1, code: 'D2962', subCode: 'prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D2962', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 3, code: 'D0220', subCode: 'PA', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 12, name: 'BU/P&C Core Build Up', icon: 'icon-restorative-bu', procedures: [] },
];

const INITIAL_ENDODONTICS = [
  { id: 1, name: 'Root Canal Root Canal Treatment', icon: 'icon-endo-root-canal', procedures: [{ id: 1, code: 'D3330', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 2, name: 'Root Canal Root Canal Retreatment', icon: 'icon-endo-root-canal-tool', procedures: [{ id: 1, code: 'D3348', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 3, name: 'Pulp capping Indirect Pulp Cap', icon: 'icon-endo-pulp-cap', procedures: [{ id: 1, code: 'D3120', subCode: '', billed: true, phase: '', visit: '' }] },
];

const INITIAL_PERIODONTICS = [
  { id: 0, name: 'LBR', icon: 'label-lbr', procedures: [{ id: 1, code: 'CD4999.1', subCode: '', billed: true, phase: 'Phase 1', visit: 'Visit 1' }] },
  { id: 1, name: 'Hygiene Maintenance', icon: 'icon-perio-mirror-probe', procedures: [{ id: 1, code: 'D4910', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 2, name: 'ScRP 4+ teeth', icon: 'icon-perio-scalers', procedures: [{ id: 1, code: 'D4341', subCode: '', billed: true, phase: '', visit: 'Visit 1' }] },
  { id: 3, name: 'ScRP 1-3 teeth', icon: 'icon-perio-yellow-probe', procedures: [] },
  { id: 4, name: 'Hygiene Debridement', icon: 'icon-perio-gingiva', procedures: [{ id: 1, code: 'D4355', subCode: '', billed: true, phase: '', visit: '' }] },
];

const INITIAL_PROSTHO_REMOVABLE = [
  { id: 0, name: 'Valplast Partial', icon: 'icon-prostho-partial-dots',
    procedures: [
      { id: 1, code: 'D5226', subCode: '', billed: false, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D5226', subCode: 'CD9999.5', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 1, name: 'Complete Denture', icon: 'icon-prostho-denture',
    procedures: [
      { id: 1, code: 'D5110', subCode: 'impression', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D5110', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
];

const INITIAL_IMPLANT_SERVICES = [
  { id: 1, name: 'Porcelain Implant Crown', icon: 'icon-implant-crown',
    procedures: [
      { id: 1, code: 'D6058', subCode: 'prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D6058', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 5, name: 'Custom Abutment', icon: 'icon-implant-abutment',
    procedures: [
      { id: 1, code: 'D6057', subCode: 'prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D6057', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 6, name: 'Surgical Placement Endosteal Implant', icon: 'bolt-implant',
    procedures: [{ id: 1, code: 'D6010', subCode: '', billed: true, phase: '', visit: '' }]
  },
];

const INITIAL_PROSTHO_FIXED = [
  { id: 1, name: 'Porcelain Retainer', icon: 'icon-fixed-bridge',
    procedures: [
      { id: 1, code: 'D6740', subCode: 'prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D6740', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
      { id: 3, code: 'D0220', subCode: 'Post delivery PA', billed: true, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 2, name: 'Porcelain Pontic', icon: 'icon-fixed-pontic-wire',
    procedures: [
      { id: 1, code: 'D6245', subCode: 'prep', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D6245', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
];

const INITIAL_ORAL_SURGERY = [
  { id: 1, name: 'Extractions Surgical Extraction', icon: 'tooth-white-filling', procedures: [{ id: 1, code: 'D7210', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 2, name: 'Extractions Simple Extraction', icon: 'tooth-white-filling', procedures: [{ id: 1, code: 'D7140', subCode: '', billed: true, phase: '', visit: '' }] },
];

const INITIAL_ORTHO = [
  { id: 1, name: 'Deprogrammer', icon: 'label-dep',
    procedures: [
      { id: 1, code: 'D8210', subCode: 'impression', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D8210', subCode: 'delivery', billed: false, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 2, name: 'Ortho Tx', icon: 'braces',
    procedures: [
      { id: 2, code: 'D8090', subCode: '8090', billed: true, phase: 'Phase 1', visit: 'Visit 1' },
      { id: 3, code: 'D8670', subCode: '8670', billed: false, phase: '', visit: 'Visit 2' },
      { id: 4, code: 'D8670', subCode: '', billed: false, phase: '', visit: 'Visit 3' },
      { id: 5, code: 'D8680', subCode: '8680', billed: true, phase: '', visit: 'Visit 4' },
      { id: 6, code: 'D0302', subCode: '', billed: false, phase: '', visit: 'Visit 4' },
      { id: 7, code: 'Cd8999.1', subCode: '', billed: false, phase: '', visit: 'Visit 5' },
    ]
  },
];

const INITIAL_ADJUNCTIVE = [
  { id: 0, name: 'TMJ Botox', icon: 'icon-adjunctive-syringe', procedures: [] },
  { id: 0, name: 'Botox single unit', icon: 'icon-adjunctive-syringe', procedures: [{ id: 1, code: 'Cd9999', subCode: 'CD9999', billed: true, phase: '', visit: '' }] },
  { id: 1, name: 'Whitening Office Whitening', icon: 'icon-adjunctive-whitening-office',
    procedures: [
      { id: 1, code: 'D9972', subCode: '', billed: true, phase: '', visit: 'Visit 1' },
      { id: 2, code: 'D9972', subCode: 'Cd9972.1', billed: true, phase: '', visit: 'Visit 2' },
    ]
  },
  { id: 2, name: 'Whitening Home Whitening', icon: 'icon-adjunctive-whitening-home', procedures: [{ id: 1, code: 'D9975', subCode: '', billed: true, phase: '', visit: '' }] },
  { id: 3, name: 'Sedation Nitrous Sedative', icon: 'icon-adjunctive-sedation', procedures: [{ id: 1, code: 'D9230', subCode: '', billed: true, phase: '', visit: '' }] },
];

const ProcedureIcon = ({ type }) => {
  const labelStyles = {
    fontSize: '0.6rem',
    fontWeight: 'bold',
    px: 0.5,
    borderRadius: '3px',
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    minWidth: 32,
  };

  const toothBase = (color = '#f0f4fa') => (
    <Box sx={{ width: 22, height: 22, border: '1.5px solid #666', borderRadius: '6px 6px 4px 4px', backgroundColor: color, position: 'relative', overflow: 'hidden' }} />
  );

  switch (type) {
    case 'no-charge-red':
      return (
        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #f56565', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: '#fff' }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 'bold' }}>$</Typography>
          <Box sx={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: '#f56565', transform: 'rotate(-45deg)' }} />
        </Box>
      );
    case 'no-charge-gold':
      return (
        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #d9a36d', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: '#fff' }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 'bold' }}>$</Typography>
          <Box sx={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: '#d9a36d', transform: 'rotate(-45deg)' }} />
        </Box>
      );
    case 'p-op':
      return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ...labelStyles, backgroundColor: '#fed7d7', border: '1px solid #feb2b2', minWidth: 36, height: 20 }}>P-OP</Box>
          <Box sx={{ position: 'absolute', top: -5, right: -5, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #f56565', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <Typography sx={{ fontSize: '0.5rem', color: '#f56565', fontWeight: 'bold' }}>$</Typography>
            <Box sx={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#f56565', transform: 'rotate(-45deg)' }} />
          </Box>
        </Box>
      );
    case 'braces':
      return (
        <Box sx={{ width: 24, height: 20, border: '1px solid #666', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', px: 0.5, backgroundColor: '#f9fafb' }}>
          <Box sx={{ width: 4, height: 8, backgroundColor: '#666', borderRadius: '1px' }} />
          <Box sx={{ width: 4, height: 8, backgroundColor: '#666', borderRadius: '1px' }} />
        </Box>
      );
    case 'goggles':
      return (
        <Box sx={{ width: 26, height: 18, backgroundColor: '#bee3f8', borderRadius: '10px 10px 4px 4px', border: '1.5px solid #4a90e2', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, backgroundColor: '#4a90e2', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, borderTop: '1px solid #4a90e2' }} />
        </Box>
      );
    case 'label-new':
      return <Box sx={{ ...labelStyles, backgroundColor: '#4fd1c5' }}>New</Box>;
    case 'label-kid':
      return <Box sx={{ ...labelStyles, backgroundColor: '#48bb78', color: '#fff' }}>Kid</Box>;
    case 'label-srp':
      return <Box sx={{ ...labelStyles, backgroundColor: '#667eea', color: '#fff' }}>SRP</Box>;
    case 'label-gin':
      return <Box sx={{ ...labelStyles, backgroundColor: '#f56565', color: '#fff' }}>Gin</Box>;
    case 'label-dep':
      return <Box sx={{ ...labelStyles, backgroundColor: '#c6f6d5', border: '1px solid #9ae6b4' }}>DEP</Box>;
    case 'label-cbc':
      return <Box sx={{ ...labelStyles, backgroundColor: '#fff5f5', border: '1px solid #fed7d7' }}>CBC</Box>;
    case 'label-scr':
      return <Box sx={{ ...labelStyles, backgroundColor: '#f56565', color: '#fff' }}>Scr</Box>;
    case 'label-full':
      return <Box sx={{ ...labelStyles, backgroundColor: '#fefcbf', border: '1px solid #ecc94b' }}>FULL</Box>;
    case 'label-ltd':
      return <Box sx={{ ...labelStyles, backgroundColor: '#fed7d7', border: '1px solid #feb2b2' }}>LTD</Box>;
    case 'label-rcr':
      return <Box sx={{ ...labelStyles, backgroundColor: '#bee3f8', border: '1px solid #4299e1' }}>RCR</Box>;
    case 'label-pano':
      return <Box sx={{ ...labelStyles, backgroundColor: '#2d3748', color: '#fff' }}>Pano</Box>;
    case 'label-fmx':
      return <Box sx={{ ...labelStyles, backgroundColor: '#2d3748', color: '#fff' }}>FMX</Box>;
    case 'label-xray':
      return <Box sx={{ ...labelStyles, backgroundColor: '#2d3748', color: '#fff' }}>Xray</Box>;
    case 'label-add-pa':
      return <Box sx={{ ...labelStyles, backgroundColor: '#fefcbf', border: '1px solid #ecc94b', minWidth: 44 }}>Add'l PA</Box>;
    case 'label-scn':
      return <Box sx={{ ...labelStyles, backgroundColor: '#c6f6d5', border: '1px solid #9ae6b4' }}>SCN</Box>;
    case 'label-con':
      return <Box sx={{ ...labelStyles, backgroundColor: '#b2f5ea', border: '1px solid #4fd1c5' }}>Con</Box>;
    case 'label-vir':
      return <Box sx={{ ...labelStyles, backgroundColor: '#b2f5ea', border: '1px solid #4fd1c5' }}>Vir</Box>;
    case 'label-prv':
      return <Box sx={{ ...labelStyles, backgroundColor: '#b2f5ea', border: '1px solid #4fd1c5' }}>PRV</Box>;
    case 'label-lbr':
      return <Box sx={{ ...labelStyles, backgroundColor: '#f56565', color: '#fff' }}>LBR</Box>;
    case 'icon-grid':
      return (
        <Box sx={{ width: 22, height: 18, border: '1px solid #666', borderRadius: '2px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 0.2, p: 0.2 }}>
           <Box sx={{ backgroundColor: '#666' }} />
           <Box sx={{ backgroundColor: '#666' }} />
           <Box sx={{ backgroundColor: '#666' }} />
           <Box sx={{ backgroundColor: '#666' }} />
        </Box>
      );
    case 'icon-prophy':
      return (
        <Box sx={{ width: 20, height: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: 6, height: 4, backgroundColor: '#4a5568', borderRadius: '2px' }} />
          <Box sx={{ width: 2, height: 12, backgroundColor: '#a0aec0' }} />
          <Box sx={{ width: 6, height: 2, backgroundColor: '#4a5568' }} />
        </Box>
      );
    case 'icon-varnish':
      return (
        <Box sx={{ width: 16, height: 20, border: '1px solid #666', borderRadius: '2px 2px 4px 4px', position: 'relative' }}>
          <Box sx={{ height: 6, backgroundColor: '#4a90e2' }} />
          <Box sx={{ height: 1, backgroundColor: '#666', position: 'absolute', top: 6, left: 0, right: 0 }} />
        </Box>
      );
    case 'icon-sealant':
      return <Box sx={{ width: 18, height: 18, backgroundColor: '#fed7e2', borderRadius: '4px', border: '1px solid #fbb6ce' }} />;
    case 'icon-curodont':
      return <Box sx={{ width: 18, height: 18, backgroundColor: '#c6f6d5', borderRadius: '50%', border: '1px solid #48bb78' }} />;
    case 'tooth-white-filling':
      return (
        <Box sx={{ position: 'relative' }}>
          {toothBase()}
          <Box sx={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 8, backgroundColor: '#fff', borderRadius: '2px' }} />
        </Box>
      );
    case 'tooth-yellow-filling':
      return (
        <Box sx={{ position: 'relative' }}>
          {toothBase()}
          <Box sx={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 8, backgroundColor: '#fefcbf', border: '1px solid #ecc94b', borderRadius: '2px' }} />
        </Box>
      );
    case 'icon-restorative-crown':
      return <Box sx={{ width: 20, height: 16, backgroundColor: '#fff', border: '1.5px solid #666', borderRadius: '4px 4px 2px 2px' }} />;
    case 'icon-restorative-veneer-double':
      return (
        <Box sx={{ display: 'flex', position: 'relative', width: 22, height: 22 }}>
          <Box sx={{ width: 12, height: 16, border: '1.5px solid #666', borderRadius: '8px 2px 2px 2px', backgroundColor: '#fff' }} />
          <Box sx={{ width: 12, height: 16, border: '1.5px solid #666', borderRadius: '8px 2px 2px 2px', backgroundColor: '#fff', position: 'absolute', top: 4, left: 8 }} />
        </Box>
      );
    case 'icon-restorative-bu':
      return (
        <Box sx={{ position: 'relative' }}>
          {toothBase()}
          <Box sx={{ position: 'absolute', top: 2, left: 2, right: 2, height: 8, backgroundColor: '#bee3f8', border: '1px solid #4a90e2', borderRadius: '2px' }} />
        </Box>
      );
    case 'icon-endo-root-canal':
      return (
        <Box sx={{ position: 'relative' }}>
          {toothBase()}
          <Box sx={{ position: 'absolute', top: 6, bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, backgroundColor: '#f56565', borderRadius: '1px' }} />
        </Box>
      );
    case 'icon-endo-root-canal-tool':
      return (
        <Box sx={{ position: 'relative' }}>
          {toothBase()}
          <Box sx={{ position: 'absolute', top: 6, bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, backgroundColor: '#f56565', borderRadius: '1px' }} />
          <Box sx={{ position: 'absolute', top: 1, left: 2, width: 6, height: 6, backgroundColor: '#4299e1', transform: 'rotate(45deg)' }} />
        </Box>
      );
    case 'icon-endo-pulp-cap':
      return (
        <Box sx={{ position: 'relative' }}>
          {toothBase()}
          <Box sx={{ position: 'absolute', top: 10, bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, backgroundColor: '#f56565', borderRadius: '1px' }} />
          <Box sx={{ position: 'absolute', top: 4, left: 4, right: 4, height: 6, backgroundColor: '#bee3f8', border: '1px solid #4299e1', borderRadius: '2px' }} />
        </Box>
      );
    case 'icon-perio-mirror-probe':
      return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', position: 'relative', width: 24, height: 24 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #666', backgroundColor: '#e2e8f0' }} />
          <Box sx={{ width: 1.5, height: 20, backgroundColor: '#666', transform: 'rotate(-20deg)', position: 'absolute', left: 12 }} />
        </Box>
      );
    case 'icon-perio-scalers':
      return (
        <Box sx={{ display: 'flex', gap: 0.2, alignItems: 'flex-end' }}>
           {[1,2,3,4].map(i => (
             <Box key={i} sx={{ width: 4, height: 16, border: '1px solid #666', borderRadius: '2px 2px 0 0', backgroundColor: '#bee3f8' }} />
           ))}
        </Box>
      );
    case 'icon-perio-yellow-probe':
      return (
        <Box sx={{ width: 14, height: 20, position: 'relative' }}>
           <Box sx={{ width: 4, height: 18, backgroundColor: '#ecc94b', border: '1px solid #666' }} />
           <Box sx={{ position: 'absolute', bottom: 2, left: 4, width: 8, height: 2, backgroundColor: '#ecc94b', border: '1px solid #666' }} />
        </Box>
      );
    case 'icon-perio-gingiva':
      return (
        <Box sx={{ width: 22, height: 22, position: 'relative' }}>
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: 8, backgroundColor: '#fed7e2', border: '1.5px solid #f687b3', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: 4, left: 4, right: 4, height: 10, backgroundColor: '#ecc94b', border: '1.5px solid #d69e2e', borderRadius: '4px 4px 0 0' }} />
        </Box>
      );
    case 'icon-prostho-partial-dots':
      return (
        <Box sx={{ width: 22, height: 18, backgroundColor: '#b794f4', borderRadius: '10px 10px 4px 4px', border: '1.5px solid #805ad5', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.8, p: 0.6 }}>
           {[1,2,3,4].map(i => <Box key={i} sx={{ width: 3, height: 3, backgroundColor: '#fff', borderRadius: '50%' }} />)}
        </Box>
      );
    case 'icon-prostho-denture':
      return <Box sx={{ width: 22, height: 16, backgroundColor: '#fbb6ce', borderRadius: '12px 12px 4px 4px', border: '1.5px solid #f687b3' }} />;
    case 'icon-implant-crown':
      return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: 22, height: 22 }}>
          <Box sx={{ width: 18, height: 14, backgroundColor: '#fff', border: '1.5px solid #666', borderRadius: '4px 4px 0 0' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 8, backgroundColor: '#a0aec0', borderRadius: '1px', border: '1px solid #666' }} />
        </Box>
      );
    case 'icon-implant-abutment':
      return <Box sx={{ width: 12, height: 18, backgroundColor: '#ecc94b', borderRadius: '2px', border: '1.5px solid #d69e2e' }} />;
    case 'icon-fixed-bridge':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: 22 }}>
          <Box sx={{ width: 10, height: 14, border: '1.5px solid #666', borderRadius: '4px', backgroundColor: '#fff' }} />
          <Box sx={{ width: 6, height: 2, backgroundColor: '#ccc' }} />
          <Box sx={{ width: 10, height: 14, border: '1.5px solid #666', borderRadius: '4px', backgroundColor: '#fff' }} />
        </Box>
      );
    case 'icon-fixed-pontic-wire':
      return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 22 }}>
          <Box sx={{ width: 18, height: 10, backgroundColor: '#fff', border: '1.5px solid #666', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', top: 4, width: '100%', height: 1.5, backgroundColor: '#ccc' }} />
        </Box>
      );
    case 'icon-adjunctive-syringe':
      return (
        <Box sx={{ width: 20, height: 20, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: 4, height: 10, border: '1.5px solid #666', borderRadius: '1px', backgroundColor: '#fff' }} />
          <Box sx={{ width: 1, height: 8, backgroundColor: '#666' }} />
          <Box sx={{ width: 6, height: 2, backgroundColor: '#666', position: 'absolute', top: 0 }} />
        </Box>
      );
    case 'icon-adjunctive-whitening-office':
      return (
        <Box sx={{ width: 22, height: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <Box sx={{ width: 12, height: 8, backgroundColor: '#bee3f8', border: '1.5px solid #4a90e2', borderRadius: '50% 50% 0 0' }} />
           <Box sx={{ width: 2, height: 10, backgroundColor: '#a0aec0' }} />
           <Box sx={{ width: 10, height: 2, backgroundColor: '#4a5568' }} />
        </Box>
      );
    case 'icon-adjunctive-whitening-home':
      return <Box sx={{ width: 20, height: 14, border: '1.5px solid #666', borderRadius: '4px 4px 10px 10px', backgroundColor: '#fff' }} />;
    case 'icon-adjunctive-sedation':
      return (
        <Box sx={{ width: 16, height: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: 10, height: 14, backgroundColor: '#4299e1', borderRadius: '5px 5px 2px 2px', border: '1.5px solid #2b6cb0' }} />
          <Box sx={{ width: 4, height: 6, backgroundColor: '#a0aec0', border: '1px solid #666' }} />
        </Box>
      );
    case 'probe':
      return (
        <Box sx={{ width: 20, height: 20, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 4, height: 16, backgroundColor: '#9ae6b4', borderRadius: '2px' }} />
          <Box sx={{ width: 8, height: 4, backgroundColor: '#f56565', borderRadius: '50%', position: 'absolute', top: 0 }} />
        </Box>
      );
    case 'tooth-green':
      return <Box sx={{ width: 18, height: 18, backgroundColor: '#9ae6b4', borderRadius: '4px', border: '1px solid #48bb78' }} />;
    case 'tooth-white':
      return <Box sx={{ width: 18, height: 18, backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ccc' }} />;
    case 'bolt-implant':
      return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
           <Box sx={{ width: 18, height: 18, backgroundColor: '#f0f4fa', borderRadius: '4px', border: '1px solid #ccc' }} />
           <Typography sx={{ position: 'absolute', top: -5, right: -6, fontSize: '0.9rem', color: '#ecc94b', textShadow: '0 0 2px rgba(0,0,0,0.2)', zIndex: 1 }}>⚡</Typography>
        </Box>
      );
    case 'bolt-braces':
      return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
           <Box sx={{ width: 24, height: 18, border: '1px solid #666', borderRadius: '4px', backgroundColor: '#f9fafb' }} />
           <Typography sx={{ position: 'absolute', top: -5, right: -6, fontSize: '0.9rem', color: '#ecc94b', textShadow: '0 0 2px rgba(0,0,0,0.2)', zIndex: 1 }}>⚡</Typography>
        </Box>
      );
    case 'bolt-retainer':
      return (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
           <Box sx={{ width: 24, height: 10, backgroundColor: '#319795', borderRadius: '12px 12px 2px 2px' }} />
           <Typography sx={{ position: 'absolute', top: -8, right: -6, fontSize: '0.9rem', color: '#ecc94b', textShadow: '0 0 2px rgba(0,0,0,0.2)', zIndex: 1 }}>⚡</Typography>
        </Box>
      );
    case 'oral-dna':
      return (
        <Box sx={{ width: 14, height: 22, border: '1px solid #666', borderRadius: '2px', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
          <Box sx={{ height: 6, backgroundColor: '#f56565' }} />
          <Box sx={{ height: 16, backgroundColor: '#fff' }} />
        </Box>
      );
    default:
      return <Box sx={{ width: 16, height: 16, backgroundColor: '#1a3a6b', borderRadius: '2px' }} />;
  }
};

const ProcedureCodesManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityQuery, setEligibilityQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubItems, setExpandedSubItems] = useState([]);
  const [expandedCodesCategories, setExpandedCodesCategories] = useState([]);
  const [expandedSubTypes, setExpandedSubTypes] = useState([]);

  const handleToggleSubType = (subTypeName) => {
    if (expandedSubTypes.includes(subTypeName)) {
      setExpandedSubTypes(expandedSubTypes.filter(s => s !== subTypeName));
    } else {
      setExpandedSubTypes([...expandedSubTypes, subTypeName]);
    }
  };

  const getProcedureCodesForSubType = (subTypeName) => {
    // Return specific mocks if available
    if (MOCK_SUBTYPE_CODES[subTypeName]) {
      return MOCK_SUBTYPE_CODES[subTypeName];
    }
    
    // Check if we have local custom codes added to this category/subtype
    const custom = localCustomCodes.filter(c => c.Category.toLowerCase() === subTypeName.toLowerCase());
    if (custom.length > 0) {
      return custom;
    }

    // Otherwise generate realistic generic codes
    const baseCodeNum = 1000 + Math.abs(subTypeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 8000;
    return [
      { ProcCode: `D${baseCodeNum}`, Descript: `${subTypeName} standard procedure code`, site: 'None', dbi: false, provider: 'Default' },
      { ProcCode: `D${baseCodeNum + 1}`, Descript: `${subTypeName} additional level procedure`, site: 'None', dbi: false, provider: 'Dentist' },
    ];
  };
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState(null);
  const [procedureCodes, setProcedureCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCodes, setTotalCodes] = useState(0);
  const [page, setPage] = useState(1);

  const [localCustomCodes, setLocalCustomCodes] = useState([]);
  const [isAddCustomCodeOpen, setAddCustomCodeOpen] = useState(false);
  const [customCodeForm, setCustomCodeForm] = useState({
    code: 'C',
    category: '',
    procedureType: '',
    procedure: '',
    codeName: '',
    site: 'None',
    description: '',
  });

  const handleOpenAddCustomCode = (categoryName = '') => {
    setCustomCodeForm({
      code: 'C',
      category: categoryName || '',
      procedureType: '',
      procedure: '',
      codeName: '',
      site: 'None',
      description: '',
    });
    setAddCustomCodeOpen(true);
  };

  const handleCloseAddCustomCode = () => {
    setAddCustomCodeOpen(false);
  };

  const handleSaveCustomCode = (e) => {
    e.preventDefault();
    const newCode = {
      ProcCode: customCodeForm.code,
      Descript: customCodeForm.description || customCodeForm.codeName,
      Category: customCodeForm.category,
    };
    setLocalCustomCodes((prev) => [newCode, ...prev]);
    setAddCustomCodeOpen(false);
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchProcedureCodes();
    }
  }, [activeTab, searchQuery, page]);

  const fetchProcedureCodes = async (category = null) => {
    try {
      setLoading(true);
      const result = await feeService.getProcedureCodes({
        search: searchQuery,
        category: category,
        page,
        limit: 50
      });
      setProcedureCodes(result.data);
      setTotalCodes(result.total);
    } catch (error) {
      console.error('Failed to fetch procedure codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCodesCategory = (catName) => {
    if (expandedCodesCategories.includes(catName)) {
      setExpandedCodesCategories(expandedCodesCategories.filter(c => c !== catName));
    } else {
      setExpandedCodesCategories([...expandedCodesCategories, catName]);
      fetchProcedureCodes(catName);
    }
  };

  const handleOpenSyncDialog = (e) => {
    e?.stopPropagation();
    setSyncDialogOpen(true);
  };

  const handleCloseSyncDialog = () => {
    setSyncDialogOpen(false);
  };

  // Dynamic State for Categories and Items
  const [categories, setCategories] = useState([
    { name: 'No Charge', hasIcon: true, subItems: INITIAL_NO_CHARGE },
    { name: 'Power Codes', hasIcon: true, hasInfo: true, subItems: INITIAL_POWER_CODES },
    { name: 'Quick Codes', isHeader: true, hasInfo: true },
    { name: 'Diagnostic', hasIcon: true, subItems: INITIAL_DIAGNOSTIC },
    { name: 'Preventive', hasIcon: true, subItems: INITIAL_PREVENTIVE },
    { name: 'Restorative', hasIcon: true, subItems: INITIAL_RESTORATIVE },
    { name: 'Endodontics', hasIcon: true, subItems: INITIAL_ENDODONTICS },
    { name: 'Periodontics', hasIcon: true, subItems: INITIAL_PERIODONTICS },
    { name: 'Prosthodontics, Removable', hasIcon: true, subItems: INITIAL_PROSTHO_REMOVABLE },
    { name: 'Implant Services', hasIcon: true, subItems: INITIAL_IMPLANT_SERVICES },
    { name: 'Prosthodontics, Fixed', hasIcon: true, subItems: INITIAL_PROSTHO_FIXED },
    { name: 'Oral Surgery', hasIcon: true, subItems: INITIAL_ORAL_SURGERY },
    { name: 'Orthodontics', hasIcon: true, subItems: INITIAL_ORTHO },
    { name: 'Adjunctive General Services', hasIcon: true, subItems: INITIAL_ADJUNCTIVE },
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleSubItem = (name) => {
    setExpandedSubItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  // Add/Delete Logic
  const handleAddPowerCode = (catIdx) => {
    const newCategories = [...categories];
    const category = newCategories[catIdx];
    const newId = category.subItems.length ? Math.max(...category.subItems.map(i => i.id)) + 1 : 0;
    
    category.subItems.push({
      id: newId,
      name: 'New Power Code',
      icon: 'default',
      procedures: []
    });
    
    setCategories(newCategories);
  };

  const handleDeletePowerCode = (catIdx, itemIdx) => {
    const newCategories = [...categories];
    newCategories[catIdx].subItems.splice(itemIdx, 1);
    setCategories(newCategories);
  };

  const handleAddProcedure = (catIdx, itemIdx) => {
    const newCategories = [...categories];
    const item = newCategories[catIdx].subItems[itemIdx];
    
    if (!item.procedures) item.procedures = [];
    
    const newPId = item.procedures.length ? Math.max(...item.procedures.map(p => p.id)) + 1 : 1;
    
    item.procedures.push({
      id: newPId,
      code: 'New',
      subCode: '',
      billed: false,
      phase: '',
      visit: ''
    });
    
    setCategories(newCategories);
  };

  const handleDeleteProcedure = (catIdx, itemIdx, procIdx) => {
    const newCategories = [...categories];
    newCategories[catIdx].subItems[itemIdx].procedures.splice(procIdx, 1);
    setCategories(newCategories);
  };

  const handleUpdateProcedureField = (catIdx, itemIdx, procIdx, field, value) => {
    const newCategories = [...categories];
    newCategories[catIdx].subItems[itemIdx].procedures[procIdx][field] = value;
    setCategories(newCategories);
  };

  const handleUpdateItemName = (catIdx, itemIdx, name) => {
    const newCategories = [...categories];
    newCategories[catIdx].subItems[itemIdx].name = name;
    setCategories(newCategories);
  };

  const renderNestedDetails = (catIdx, itemIdx, procedures, isLocked) => (
    <Box sx={{ mt: 1, mb: 2, border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', opacity: isLocked ? 0.85 : 1 }}>
      <Box sx={{ display: 'flex', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', py: 0.8, px: 2 }}>
        <Typography sx={{ width: '8%', fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>Order</Typography>
        <Typography sx={{ width: '15%', fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>Code</Typography>
        <Typography sx={{ width: '15%', fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>Sub Code</Typography>
        <Typography sx={{ width: '25%', fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>Billed Procedures</Typography>
        <Typography sx={{ width: '15%', fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>Phase</Typography>
        <Typography sx={{ width: '15%', fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>Visit</Typography>
        <Box sx={{ width: '7%' }} />
      </Box>
      {procedures.map((proc, pIdx) => (
        <Box key={pIdx} sx={{ display: 'flex', alignItems: 'center', py: 0.8, px: 2, borderBottom: pIdx < procedures.length - 1 ? '1px solid #eee' : 'none' }}>
          <Typography sx={{ width: '8%', fontSize: '0.8rem', color: '#666' }}>{proc.id}</Typography>
          <Box sx={{ width: '15%', pr: 1 }}>
            <TextField 
              size="small" 
              value={proc.code} 
              disabled={isLocked}
              onChange={(e) => handleUpdateProcedureField(catIdx, itemIdx, pIdx, 'code', e.target.value)}
              sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem', backgroundColor: isLocked ? '#fcfcfc' : '#fff' } }}
            />
          </Box>
          <Box sx={{ width: '15%', pr: 1 }}>
            <TextField 
              size="small" 
              value={proc.subCode} 
              disabled={isLocked}
              onChange={(e) => handleUpdateProcedureField(catIdx, itemIdx, pIdx, 'subCode', e.target.value)}
              sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem', backgroundColor: isLocked ? '#fcfcfc' : '#fff' } }}
            />
          </Box>
          <Box sx={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
            <Checkbox 
              size="small" 
              checked={proc.billed} 
              disabled={isLocked}
              onChange={(e) => handleUpdateProcedureField(catIdx, itemIdx, pIdx, 'billed', e.target.checked)}
              sx={{ p: 0 }} 
            />
          </Box>
          <Box sx={{ width: '15%', pr: 1 }}>
            <Select 
              size="small" 
              value={proc.phase} 
              disabled={isLocked}
              onChange={(e) => handleUpdateProcedureField(catIdx, itemIdx, pIdx, 'phase', e.target.value)}
              sx={{ height: 28, fontSize: '0.75rem', width: '100%', backgroundColor: isLocked ? '#fcfcfc' : '#fff' }} 
              displayEmpty
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Phase 1">Phase 1</MenuItem>
              <MenuItem value="Phase 2">Phase 2</MenuItem>
            </Select>
          </Box>
          <Box sx={{ width: '15%', pr: 1 }}>
            <Select 
              size="small" 
              value={proc.visit} 
              disabled={isLocked}
              onChange={(e) => handleUpdateProcedureField(catIdx, itemIdx, pIdx, 'visit', e.target.value)}
              sx={{ height: 28, fontSize: '0.75rem', width: '100%', backgroundColor: isLocked ? '#fcfcfc' : '#fff' }} 
              displayEmpty
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Visit 1">Visit 1</MenuItem>
              <MenuItem value="Visit 2">Visit 2</MenuItem>
              <MenuItem value="Visit 3">Visit 3</MenuItem>
              <MenuItem value="Visit 4">Visit 4</MenuItem>
            </Select>
          </Box>
          <Box sx={{ width: '7%', display: 'flex', justifyContent: 'center' }}>
            <DeleteIcon 
              onClick={() => handleDeleteProcedure(catIdx, itemIdx, pIdx)}
              sx={{ color: '#d32f2f', fontSize: '1rem', cursor: 'pointer' }} 
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ p: 1.5, borderTop: '1px solid #e0e0e0' }}>
        <Typography 
          onClick={() => handleAddProcedure(catIdx, itemIdx)}
          sx={{ fontSize: '0.75rem', color: '#4a90e2', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
        >
          + Add Procedure
        </Typography>
      </Box>
    </Box>
  );

  const renderSubItem = (catIdx, itemIdx, item) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', pl: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box 
            onClick={() => toggleSubItem(item.name)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 350, cursor: 'pointer' }}
          >
            {expandedSubItems.includes(item.name) ? (
              <KeyboardArrowUpIcon sx={{ color: '#666', fontSize: '1rem' }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: '#666', fontSize: '1rem' }} />
            )}
            <Typography sx={{ fontSize: '0.8rem', color: '#666', minWidth: 16 }}>{item.id}-</Typography>
            <Box sx={{ minWidth: 32, display: 'flex', justifyContent: 'center' }}>
              <ProcedureIcon type={item.icon} />
            </Box>
            {editingPath === `${catIdx}-${itemIdx}` ? (
              <TextField
                size="small"
                value={item.name}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleUpdateItemName(catIdx, itemIdx, e.target.value)}
                variant="standard"
                sx={{ 
                  ml: 1, 
                  width: '80%',
                  '& .MuiInputBase-input': { 
                    color: '#1a3a6b', 
                    fontSize: '0.8rem', 
                    fontWeight: 500,
                    py: 0,
                  },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #ccc' }
                }}
              />
            ) : (
              <Typography 
                sx={{ 
                  ml: 1, 
                  color: '#1a3a6b', 
                  fontSize: '0.8rem', 
                  fontWeight: 500,
                }}
              >
                {item.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ width: 160 }}>
            <FormControlLabel
              onClick={(e) => e.stopPropagation()}
              control={<Checkbox size="small" sx={{ p: 0.5 }} disabled={editingPath !== `${catIdx}-${itemIdx}`} />}
              label={<Typography sx={{ fontSize: '0.75rem' }}>Show in Schedule</Typography>}
              sx={{ ml: 2, opacity: editingPath !== `${catIdx}-${itemIdx}` ? 0.7 : 1 }}
            />
          </Box>

          <Box sx={{ width: 160 }}>
            <FormControlLabel
              onClick={(e) => e.stopPropagation()}
              control={<Checkbox size="small" sx={{ p: 0.5 }} disabled={editingPath !== `${catIdx}-${itemIdx}`} />}
              label={<Typography sx={{ fontSize: '0.75rem' }}>Hide Power Code</Typography>}
              sx={{ ml: 1, opacity: editingPath !== `${catIdx}-${itemIdx}` ? 0.7 : 1 }}
            />
          </Box>

          <Box sx={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
            {editingPath === `${catIdx}-${itemIdx}` ? (
              <CheckIcon 
                onClick={(e) => { e.stopPropagation(); setEditingPath(null); }} 
                sx={{ color: '#48bb78', fontSize: '1.2rem', cursor: 'pointer' }} 
              />
            ) : (
              <EditIcon 
                onClick={(e) => { e.stopPropagation(); setEditingPath(`${catIdx}-${itemIdx}`); }} 
                sx={{ color: '#4a90e2', fontSize: '1rem', cursor: 'pointer' }} 
              />
            )}
            <DeleteIcon 
              onClick={(e) => { e.stopPropagation(); handleDeletePowerCode(catIdx, itemIdx); }} 
              sx={{ 
                color: '#d32f2f', 
                fontSize: '1rem', 
                cursor: 'pointer',
              }} 
            />
          </Box>
        </Box>
        <Box
          onClick={handleOpenSyncDialog}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: '#1a3a6b',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <SyncIcon sx={{ fontSize: '0.9rem' }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Sync</Typography>
        </Box>
      </Box>
      {expandedSubItems.includes(item.name) && item.procedures && (
        <Box sx={{ pl: 5, pr: 2 }}>
          {renderNestedDetails(catIdx, itemIdx, item.procedures, editingPath !== `${catIdx}-${itemIdx}`)}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Procedure Codes
        </Typography>
      </Box>

      {/* Main Tabs and Sync */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 0, borderBottom: '1px solid #e0e0e0' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              minWidth: 'auto',
              px: 3,
              color: '#666',
            },
            '& .Mui-selected': {
              color: '#1a3a6b !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1a3a6b',
            },
          }}
        >
          <Tab label="Power Codes" />
          <Tab label="Codes" />
          <Tab label="Eligibility Used ADA Codes" />
        </Tabs>
        <Box
          onClick={handleOpenSyncDialog}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 1.5,
            cursor: 'pointer',
            color: '#1a3a6b',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <SyncIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Sync</Typography>
        </Box>
      </Box>

      {/* Tab Content: Power Codes */}
      {activeTab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                  sx={{ color: '#999', '&.Mui-checked': { color: '#1a3a6b' } }}
                />
              }
              label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Include Inactive Codes</Typography>}
            />
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#d9a36d',
                '&:hover': { backgroundColor: '#c28e5a' },
                fontSize: '0.8rem',
                px: 3,
                borderRadius: '4px',
                boxShadow: 'none',
                height: 32,
              }}
            >
              Reset Power Codes
            </Button>
          </Box>

          <Box sx={{ pl: 1 }}>
            {categories.map((cat, catIdx) => (
              <Box key={catIdx} sx={{ mb: 1 }}>
                {cat.isHeader ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 1, mt: 1 }}>
                    <Typography sx={{ color: '#1a3a6b', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {cat.name}
                    </Typography>
                    {cat.hasInfo && <InfoIcon sx={{ color: '#999', fontSize: '1rem', ml: 0.5 }} />}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 0.2, cursor: 'pointer' }} onClick={() => toggleCategory(cat.name)}>
                    {expandedCategories.includes(cat.name) ? (
                       <KeyboardArrowDownIcon sx={{ color: '#1a3a6b', fontSize: '1.1rem' }} />
                    ) : (
                       <ChevronRightIcon sx={{ color: '#1a3a6b', fontSize: '1.1rem' }} />
                    )}
                    <Box sx={{ width: 14, height: 14, backgroundColor: '#1a3a6b', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon sx={{ color: '#fff', fontSize: '0.8rem' }} />
                    </Box>
                    <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>{cat.name}</Typography>
                    {cat.hasInfo && <InfoIcon sx={{ color: '#999', fontSize: '0.9rem', ml: 0.5 }} />}
                  </Box>
                )}

                {expandedCategories.includes(cat.name) && !cat.isHeader && (
                  <Box>
                    {cat.subItems?.map((item, itemIdx) => (
                       <Box key={itemIdx}>{renderSubItem(catIdx, itemIdx, item)}</Box>
                    ))}
                    {cat.subItems && (
                      <Box sx={{ mt: 1, pl: 3.5 }}>
                        <Typography 
                          onClick={() => handleAddPowerCode(catIdx)}
                          variant="caption" 
                          sx={{ color: '#1a3a6b', cursor: 'pointer', fontWeight: 500, fontSize: '0.75rem', '&:hover': { textDecoration: 'underline' } }}
                        >
                          + Add Power Code
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Tab Content: Codes */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          {/* Search Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pl: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>Search Procedure</Typography>
            <TextField
              placeholder="Enter code or procedure"
              size="small"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) fetchProcedureCodes();
              }}
              sx={{
                width: 300,
                '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.7 },
                '& .MuiOutlinedInput-root': { borderRadius: '4px' }
              }}
            />
          </Box>

          {/* Categories or Search Results */}
          <Box sx={{ pl: 1 }}>
            {searchQuery ? (
               <Box>
                 {loading ? (
                   <CircularProgress size={24} />
                 ) : [
                    ...localCustomCodes.filter(c => 
                      c.ProcCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      c.Descript.toLowerCase().includes(searchQuery.toLowerCase())
                    ),
                    ...procedureCodes
                  ].map((sub, subIdx) => (
                     <Box key={subIdx} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #f0f0f0' }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                         <Typography sx={{ color: '#666', fontSize: '1.1rem', mr: 0.5 }}>+</Typography>
                         <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>
                           {sub.ProcCode} - {sub.Descript}
                         </Typography>
                       </Box>
                     </Box>
                  ))}
                </Box>
             ) : (
               INITIAL_CODES_TAB.map((category, idx) => (
                 <Box key={idx}>
                   <Box 
                     onClick={() => handleToggleCodesCategory(category.name)}
                     sx={{ 
                       display: 'flex', 
                       alignItems: 'center', 
                       py: 0.8, 
                       cursor: 'pointer',
                       backgroundColor: expandedCodesCategories.includes(category.name) ? '#f5f7f9' : 'transparent',
                       borderBottom: '1px solid #f0f0f0',
                       px: 1,
                       mx: -1
                     }}
                   >
                     <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                       <Typography sx={{ color: '#666', fontSize: '1.05rem', fontWeight: 'bold', width: 20, mr: 0.5 }}>
                         {expandedCodesCategories.includes(category.name) ? '−' : '+'}
                       </Typography>
                       <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500, mr: 2 }}>
                         {category.name}
                       </Typography>
                       <Typography
                         onClick={(e) => {
                           e.stopPropagation();
                           handleOpenAddCustomCode(category.name);
                         }}
                         sx={{
                           color: '#4a90e2',
                           fontSize: '0.8rem',
                           fontWeight: 500,
                           cursor: 'pointer',
                           '&:hover': { textDecoration: 'underline' }
                         }}
                       >
                         + Add Custom Code
                       </Typography>
                     </Box>
                   </Box>

                    {expandedCodesCategories.includes(category.name) && (
                      <Box sx={{ pl: 3 }}>
                        {category.subItems && category.subItems.length > 0 ? (
                          category.subItems.map((subItem, subIdx) => {
                            const isSubTypeExpanded = expandedSubTypes.includes(subItem);
                            return (
                              <Box key={subIdx} sx={{ mb: 0.5 }}>
                                {/* SubType Header Row */}
                                <Box
                                  onClick={() => handleToggleSubType(subItem)}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: 0.6,
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#f8fafc' },
                                    borderBottom: '1px solid #f1f5f9'
                                  }}
                                >
                                  <Typography sx={{ color: '#666', fontSize: '0.95rem', fontWeight: 'bold', width: 20, mr: 0.5, pl: 0.5 }}>
                                    {isSubTypeExpanded ? '−' : '+'}
                                  </Typography>
                                  <Typography sx={{ color: '#1a3a6b', fontSize: '0.8rem', fontWeight: 600, mr: 2 }}>
                                    {subItem}
                                  </Typography>
                                  <Typography
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenAddCustomCode(subItem);
                                    }}
                                    sx={{
                                      color: '#4a90e2',
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                      cursor: 'pointer',
                                      '&:hover': { textDecoration: 'underline' }
                                    }}
                                  >
                                    + Add Custom Code
                                  </Typography>
                                </Box>

                                {/* SubType Expanded Procedure Codes */}
                                {isSubTypeExpanded && (
                                  <Box sx={{ pl: 3, borderLeft: '1px dashed #cbd5e1', ml: 1.5 }}>
                                    {getProcedureCodesForSubType(subItem).map((procItem, procIdx) => (
                                      <Box
                                        key={procIdx}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          py: 1,
                                          borderBottom: '1px solid #f1f5f9',
                                          gap: 2
                                        }}
                                      >
                                        {/* Icon */}
                                        <DescriptionIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />

                                        {/* Code Box */}
                                        <Box
                                          sx={{
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '4px',
                                            px: 1.2,
                                            py: 0.3,
                                            backgroundColor: '#f8fafc',
                                            minWidth: 65,
                                            textAlign: 'center'
                                          }}
                                        >
                                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                                            {procItem.ProcCode}
                                          </Typography>
                                        </Box>

                                        {/* Description */}
                                        <Typography sx={{ fontSize: '0.75rem', color: '#334155', flex: 1 }}>
                                          {procItem.Descript}
                                        </Typography>

                                        {/* Add Custom Site Link */}
                                        <Typography
                                          sx={{
                                            color: '#3b82f6',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            minWidth: 100,
                                            '&:hover': { textDecoration: 'underline' }
                                          }}
                                        >
                                          + Add Custom Site
                                        </Typography>

                                        {/* Checkbox DBI */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                                          <Checkbox size="small" sx={{ p: 0.5 }} checked={procItem.dbi || false} />
                                          <Typography sx={{ fontSize: '0.75rem', color: '#475569', ml: 0.5 }}>DBI</Typography>
                                        </Box>

                                        {/* Stacking Office Code / Office Desc links */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
                                          <Typography
                                            sx={{
                                              color: '#3b82f6',
                                              fontSize: '0.75rem',
                                              fontWeight: 500,
                                              cursor: 'pointer',
                                              lineHeight: 1.2,
                                              '&:hover': { textDecoration: 'underline' }
                                            }}
                                          >
                                            + Add Office Code
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color: '#3b82f6',
                                              fontSize: '0.75rem',
                                              fontWeight: 500,
                                              cursor: 'pointer',
                                              lineHeight: 1.2,
                                              mt: 0.3,
                                              '&:hover': { textDecoration: 'underline' }
                                            }}
                                          >
                                            + Add Office Desc.
                                          </Typography>
                                        </Box>

                                        {/* Provider Dropdown */}
                                        <Select
                                          size="small"
                                          value={procItem.provider || 'Default'}
                                          sx={{ height: 26, fontSize: '0.75rem', minWidth: 90, backgroundColor: '#fff' }}
                                        >
                                          <MenuItem value="Default">Default</MenuItem>
                                          <MenuItem value="Dentist">Dentist</MenuItem>
                                          <MenuItem value="Hygienist">Hygienist</MenuItem>
                                        </Select>
                                      </Box>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            );
                          })
                        ) : (
                          [
                            ...localCustomCodes.filter(c => c.Category.toLowerCase() === category.name.toLowerCase()),
                            ...procedureCodes
                          ].map((sub, subIdx) => (
                            <Box key={subIdx} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #f0f0f0' }}>
                              <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>
                                {sub.ProcCode} - {sub.Descript}
                              </Typography>
                            </Box>
                          ))
                        )}
                      </Box>
                    )}
                 </Box>
               ))
             )}
           </Box>

           {/* Footer Add */}
           <Box sx={{ mt: 2, pl: 1 }}>
             <Typography
               onClick={() => handleOpenAddCustomCode('')}
               sx={{
                 color: '#4a90e2',
                 fontSize: '0.8rem',
                 fontWeight: 500,
                 cursor: 'pointer',
                 '&:hover': { textDecoration: 'underline' }
               }}
             >
               + Add Custom Code
             </Typography>
           </Box>
         </Box>
      )}

      {/* Tab Content: Eligibility Used ADA Codes */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
              Add Procedure Code
            </Typography>
            <TextField
              placeholder="Enter code or procedure"
              variant="standard"
              size="small"
              value={eligibilityQuery}
              onChange={(e) => setEligibilityQuery(e.target.value)}
              sx={{
                width: 250,
                '& .MuiInput-input': { fontSize: '0.85rem', color: '#666' },
                '& .MuiInput-underline:before': { borderBottomColor: '#ccc' },
                '& .MuiInput-underline:after': { borderBottomColor: '#1a3a6b' }
              }}
            />
          </Box>
        </Box>
      )}

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={handleCloseSyncDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0c345d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 2,
            px: 3,
            lineHeight: 1.3,
          }}
        >
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Source Office:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="thedentalstudio"
              disabled
              sx={{
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Target Offices
            </Typography>
            {/* Placeholder for Target Offices list - matching Products/Checklists page */}
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseSyncDialog}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#d0d0d0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseSyncDialog}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#6b8fb9',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#5a7ca8' }
            }}
          >
            Sync
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Custom Code Dialog */}
      <Dialog
        open={isAddCustomCodeOpen}
        onClose={handleCloseAddCustomCode}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '4px', overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#4b71a1',
            color: '#fff',
            fontSize: '1.05rem',
            fontWeight: 600,
            py: 1.5,
            px: 3,
            textAlign: 'center',
          }}
        >
          Add Custom Code
        </DialogTitle>
        <form onSubmit={handleSaveCustomCode}>
          <DialogContent sx={{ py: 3, px: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Code *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  value={customCodeForm.code}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, code: e.target.value }))}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Category *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  value={customCodeForm.category}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, category: e.target.value }))}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Procedure Type *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  value={customCodeForm.procedureType}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, procedureType: e.target.value }))}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Procedure *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  value={customCodeForm.procedure}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, procedure: e.target.value }))}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Code Name:
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={customCodeForm.codeName}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, codeName: e.target.value }))}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Site
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={customCodeForm.site}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, site: e.target.value }))}
                  sx={{ height: 38, fontSize: '0.85rem' }}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Upper Right">Upper Right</MenuItem>
                  <MenuItem value="Upper Left">Upper Left</MenuItem>
                  <MenuItem value="Lower Right">Lower Right</MenuItem>
                  <MenuItem value="Lower Left">Lower Left</MenuItem>
                  <MenuItem value="Upper Arch">Upper Arch</MenuItem>
                  <MenuItem value="Lower Arch">Lower Arch</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  required
                  value={customCodeForm.description}
                  onChange={(e) => setCustomCodeForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#c5a059',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                px: 3,
                py: 0.75,
                borderRadius: '4px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#b08c48', boxShadow: 'none' }
              }}
            >
              Save
            </Button>
            <Button
              onClick={handleCloseAddCustomCode}
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#a0aec0',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                px: 3,
                py: 0.75,
                borderRadius: '4px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#8a9ab0', boxShadow: 'none' }
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default ProcedureCodesManagement;
