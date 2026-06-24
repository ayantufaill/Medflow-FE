import { useState, useMemo, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { claimService } from '../../services/claim.service';
import ClaimAttachmentsDialog from '../../components/claims/attachments/ClaimAttachmentsDialog';
import ClaimPrintPreviewDialog from '../../components/claims/ClaimPrintPreviewDialog';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Menu,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Popover,
  Collapse,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  AttachFile as AttachFileIcon,
  Sync as SyncIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  ErrorOutline as ErrorIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
  InfoOutlined as InfoIcon,
  PictureAsPdf as PdfIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

// Claim type options
const CLAIM_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'eclaim_primary', label: 'E-claim Primary' },
  { value: 'eclaim_secondary', label: 'E-claim Secondary' },
  { value: 'paper_primary', label: 'Paper Primary' },
  { value: 'manual_primary', label: 'Manual Primary' },
];

// Carrier options
const CARRIERS = [
  { value: 'all', label: 'All' },
  { value: 'bcbs', label: 'Blue Cross Blue Shield' },
  { value: 'metlife', label: 'Metlife' },
  { value: 'aetna', label: 'Aetna Dental' },
  { value: 'guardian', label: 'Guardian Life' },
  { value: 'cigna', label: 'Cigna Dental' },
  { value: 'delta', label: 'Delta Dental Ins.' },
  { value: 'uhc', label: 'United Healthcare' },
  { value: 'humana', label: 'Humana Dental' },
  { value: 'principal', label: 'Principal Financial' },
  { value: 'anthem', label: 'Anthem' },
  { value: 'geha', label: 'GEHA Connection' },
];

// Claim Status Options (aligned with backend ClaimStatus values)
const CLAIM_STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'paid', label: 'Paid' },
  { value: 'partial', label: 'Partial' },
  { value: 'denied', label: 'Denied' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Group Date By Range Options (Specific to Outstanding Claims)
const DATE_RANGES = [
  { value: 'none', label: 'None' },
  { value: '0_30', label: '0-30 days' },
  { value: '31_60', label: '31-60 days' },
  { value: '61_90', label: '61-90 days' },
  { value: '90_plus', label: '90+ days' },
];

// Group By Options (Specific to Outstanding Claims)
const GROUP_BY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'carrier', label: 'Carrier' },
  { value: 'patient', label: 'Patient' },
  { value: 'provider', label: 'Provider' },
];

// Complete combined mock data for claims
const INITIAL_CLAIMS = [
  // 1-9: UNSENT CLAIMS
  {
    id: '1',
    patientName: 'Leticia Carter',
    patientCode: '(#0418)',
    patientDob: '08/12/1988',
    claimNumber: '#25390',
    claimType: 'E-claim Primary',
    createdDate: '05/21/2026',
    carrier: 'Blue Cross Blue Shield of Texas',
    status: 'readyForSubmission',
    notes: 'Prior auth attached, check policy limits',
    description: 'Waiting for the crown to be seated.',
    procedures: [
      { code: 'D2740', name: 'Crown - Porcelain/Ceramic Substrate', fee: 1150.00 },
      { code: 'D0120', name: 'Periodic Oral Evaluation - Established Patient', fee: 55.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '2',
    patientName: 'Russell Rudolf',
    patientCode: '(#0097)',
    patientDob: '10/24/1975',
    claimNumber: '#25401',
    claimType: 'E-claim Primary',
    createdDate: '05/21/2026',
    carrier: 'Metlife',
    status: 'readyForSubmission',
    notes: 'Sent via standard gateway',
    description: 'F/U 06/05/2026 BH. We have submitted the required digital charting. Previous SRP History: 06/01/2024.',
    procedures: [
      { code: 'D4341', name: 'Periodontal Scaling & Root Planing - 4+ Teeth', fee: 280.00 },
      { code: 'D4910', name: 'Periodontal Maintenance', fee: 140.00 },
    ],
    attachments: [{ id: 1, name: 'perio_chart.pdf' }],
    tab: 'unsent',
  },
  {
    id: '3',
    patientName: 'Evan Romero',
    patientCode: '(#0134)',
    patientDob: '05/16/1990',
    claimNumber: '#25407',
    claimType: 'E-claim Primary',
    createdDate: '05/21/2026',
    carrier: 'Aetna Dental',
    status: 'validationError',
    notes: 'Validation Alert: Missing Subscriber ID or invalid group format.',
    description: 'Member is not active on DOS Eff...',
    procedures: [
      { code: 'D2331', name: 'Resin-Based Composite - 2 Surfaces, Anterior', fee: 210.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '4',
    patientName: 'Gabriel Medina',
    patientCode: '(#0011)',
    patientDob: '12/03/1995',
    claimNumber: '#25474',
    claimType: 'E-claim Primary',
    createdDate: '05/21/2026',
    carrier: 'Guardian Life',
    status: 'readyForSubmission',
    notes: 'Discount schedule applied',
    description: 'It is a discounted plan',
    procedures: [
      { code: 'D1110', name: 'Prophylaxis - Adult', fee: 95.00 },
      { code: 'D1208', name: 'Topical Application of Fluoride', fee: 35.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '5',
    patientName: 'Ronald Patterson',
    patientCode: '(#0293)',
    patientDob: '02/14/1982',
    claimNumber: '#25574',
    claimType: 'E-claim Primary',
    createdDate: '05/19/2026',
    carrier: 'Cigna Dental',
    status: 'readyForSubmission',
    notes: 'Awaiting clinical notes',
    description: 'Waiting for the crown to be seated.',
    procedures: [
      { code: 'D6010', name: 'Surgical Placement of Implant Body - Endosteal', fee: 1950.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '6',
    patientName: 'Abdul Abayad',
    patientCode: '(#0028)',
    patientDob: '09/30/1969',
    claimNumber: '#27082',
    claimType: 'E-claim Primary',
    createdDate: '04/24/2026',
    carrier: 'Delta Dental Ins.',
    status: 'readyForSubmission',
    notes: 'No pre-auth required',
    description: 'Waiting for the crown to be seated.',
    procedures: [
      { code: 'D2740', name: 'Crown - Porcelain/Ceramic Substrate', fee: 1200.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '7',
    patientName: 'Keerthi Motupalli',
    patientCode: '(#0733)',
    patientDob: '11/12/1984',
    claimNumber: '#24007',
    claimType: 'E-claim Primary',
    createdDate: '04/16/2026',
    carrier: 'United Healthcare',
    status: 'readyForSubmission',
    notes: 'Deductible met',
    description: 'Paid Amount$169.00 Patient res...',
    procedures: [
      { code: 'D0150', name: 'Comprehensive Oral Evaluation - New Patient', fee: 110.00 },
      { code: 'D0210', name: 'Intraoral - Complete Series of Radiographic Images', fee: 165.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '8',
    patientName: 'Jenny Dondeti',
    patientCode: '(#0055)',
    patientDob: '04/05/1979',
    claimNumber: '#28458',
    claimType: 'E-claim Primary',
    createdDate: '01/08/2026',
    carrier: 'Humana Dental',
    status: 'readyForSubmission',
    notes: 'Inactive subscriber policy reported',
    description: 'Member is not active on DOS Eff...',
    procedures: [
      { code: 'D3330', name: 'Endodontic Therapy - Molar Tooth', fee: 980.00 },
    ],
    tab: 'unsent',
  },
  {
    id: '9',
    patientName: 'Samuel Green',
    patientCode: '(#0119)',
    patientDob: '07/22/1962',
    claimNumber: '#27488',
    claimType: 'E-claim Primary',
    createdDate: '07/23/2025',
    carrier: 'Principal Financial',
    status: 'readyForSubmission',
    notes: 'Secondary insurance exists',
    description: 'It is a discounted plan',
    procedures: [
      { code: 'D2950', name: 'Core Buildup, Including Any Pins when Required', fee: 245.00 },
    ],
    tab: 'unsent',
  },

  // 10-15: ERRORED CLAIMS
  {
    id: '10',
    patientName: 'Keerthi Motupalli',
    patientCode: '(#788)',
    patientDob: '11/12/1984',
    claimNumber: '#24447',
    claimType: 'E-claim Primary',
    createdDate: '04/17/2026',
    sentDate: '04/17/2026',
    carrier: 'Blue Cross Blue Shield of Texas',
    status: 'readyForSubmission',
    clearingHouseMessage: '',
    notes: 'Prior submission failed due to network timeout.',
    description: 'Paid Amount$169.00 Patient res...',
    procedures: [
      { code: 'D0150', name: 'Comprehensive Oral Evaluation', fee: 110.00 },
    ],
    tab: 'errored',
    redAttachment: true,
  },
  {
    id: '11',
    patientName: 'Babar Magsi',
    patientCode: '(#85)',
    patientDob: '03/09/1987',
    claimNumber: '#25372',
    claimType: 'E-claim Primary',
    createdDate: '05/13/2026',
    sentDate: '05/13/2026',
    carrier: 'Metlife',
    status: 'error',
    clearingHouseMessage: 'Status Response (A3): Returned validation errors on claim subscriber info',
    notes: 'Subscriber ID format does not match Metlife requirements.',
    description: 'Onlay Preps #18, 19, 30 Prep Date: 01/08/2026 Seat Date: 01/29/2026 Dx: Babar Magsi sease with erosion into dentin...',
    procedures: [
      { code: 'D2643', name: 'Onlay - Porcelain/Ceramic - Three Surfaces', fee: 940.00 },
      { code: 'D2644', name: 'Onlay - Porcelain/Ceramic - Four+ Surfaces', fee: 1050.00 },
    ],
    tab: 'errored',
    redAttachment: false,
  },
  {
    id: '12',
    patientName: 'Bekhzod Ivanov',
    patientCode: '(#1059)',
    patientDob: '05/20/2001',
    claimNumber: '#22699',
    claimType: 'E-claim Primary',
    createdDate: '03/18/2026',
    sentDate: '03/18/2026',
    carrier: 'Cigna Dental',
    status: 'eobUploaded',
    clearingHouseMessage: '',
    notes: 'EOB received digitally, manual review pending.',
    description: 'F/U 06/15/2026*Banding date:1... (KS6 bur); dentin sealed with RelyX (light cured) Temporaries fabricated using Clinicians Choice matrix + Kettenbach Visalys Temps seated, adjusted, polished; occlusion checked Cemented with TempBond Clear; excess removed; contacts flossed and verified Shade: A3 (Vita) Final material: Lithium disilicate (Emax) Lab: Reliable Dental Lab POIG given Dr. LP',
    procedures: [
      { code: 'D8080', name: 'Comprehensive Orthodontic Treatment - Adolescent', fee: 3200.00 },
    ],
    tab: 'errored',
    redAttachment: true,
  },
  {
    id: '13',
    patientName: 'Thomas Gellar',
    patientCode: '(#1246)',
    patientDob: '08/08/1978',
    claimNumber: '#25011',
    claimType: 'E-claim Primary',
    createdDate: '05/19/2026',
    sentDate: '05/19/2026',
    carrier: 'CIGNA',
    status: 'eobUploaded',
    clearingHouseMessage: '',
    notes: 'Full implants chart sent as supporting narrative.',
    description: 'F/U 05/21/2026 BH."Claim Statu... CC "I was reffered by Dr. Anver and would like to have my implant #14 restored" Patient was reffered by Dr. Anver for restoration of implant #14: Implant info: #14 Straumann BLC WB 4.5 x 8mm Heal Abutment: RB/WB 5GH 3.5 AH 2 Remov healing abutment with a Straumann driv Placed scan body provided by Dr. Anver. Intraoral scan taken. Removed scan body and placed back healing abutment. NV: Deliver implant crown #14 (1hr) Franco RDA',
    procedures: [
      { code: 'D6058', name: 'Abutment Supported Porcelain Crown', fee: 1450.00 },
    ],
    tab: 'errored',
    redAttachment: true,
  },
  {
    id: '14',
    patientName: 'Ivan Todorov',
    patientCode: '(#63)',
    patientDob: '12/25/1992',
    claimNumber: '#25262',
    claimType: 'E-claim Primary',
    createdDate: '05/15/2026',
    sentDate: '05/15/2026',
    carrier: 'United Healthcare Dental',
    status: 'error',
    clearingHouseMessage: 'Status Response (A3): Returned claim rejected by payer - invalid tooth number',
    notes: 'Tooth #14 is invalid for the specified procedure code.',
    description: 'F/U 06/01/2026 BH. We have req...',
    procedures: [
      { code: 'D7140', name: 'Extraction, Erupted Tooth or Exposed Root', fee: 185.00 },
    ],
    tab: 'errored',
    redAttachment: false,
  },
  {
    id: '15',
    patientName: 'Carolyn Miller',
    patientCode: '(#112)',
    patientDob: '01/30/1985',
    claimNumber: '#24285',
    claimType: 'E-claim Primary',
    createdDate: '04/29/2026',
    sentDate: '04/29/2026',
    carrier: 'Cigna Dental',
    status: 'eobUploaded',
    clearingHouseMessage: 'Status Response (A3): Returned claim processed - payment pending',
    notes: 'Payment scheduled for release on next carrier cycle.',
    description: '"Paid Amount$199.80 Patient res..."',
    procedures: [
      { code: 'D2160', name: 'Amalgam - Three Surfaces, Primary or Permanent', fee: 175.00 },
    ],
    tab: 'errored',
    redAttachment: true,
  },

  // 18-30: HISTORY CLAIMS
  {
    id: '18',
    patientName: 'Gweneth Taylor',
    patientCode: '(#71)',
    patientDob: '06/06/1980',
    claimNumber: '#25461',
    claimType: 'E-claim Primary',
    createdDate: '05/22/2026',
    sentDate: '05/22/2026',
    printedDate: '—',
    carrier: 'CIGNA',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: 'Sent digitally via Medflow portal.',
    description: 'Crown Prep 05/20/2026 06/16/2026',
    procedures: [{ code: 'D2740', name: 'Crown - Porcelain/Ceramic', fee: 1150.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '19',
    patientName: 'William Helm',
    patientCode: '(#93)',
    patientDob: '04/18/1971',
    claimNumber: '#25458',
    claimType: 'E-claim Primary',
    createdDate: '05/22/2026',
    sentDate: '05/22/2026',
    printedDate: '—',
    carrier: 'Anthem',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: 'Requires clinical chart review.',
    description: 'Babar Magsi',
    procedures: [{ code: 'D1110', name: 'Prophylaxis - Adult', fee: 95.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '20',
    patientName: 'Gweneth Taylor',
    patientCode: '(#71)',
    patientDob: '06/06/1980',
    claimNumber: '#25443',
    claimType: 'E-claim Primary',
    createdDate: '05/22/2026',
    sentDate: '05/22/2026',
    printedDate: '—',
    carrier: 'MetLife',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: 'Digital x-rays attached.',
    description: '',
    procedures: [{ code: 'D4341', name: 'Periodontal Scaling & Root Planing', fee: 280.00 }],
    tab: 'history',
    redAttachment: true,
  },
  {
    id: '21',
    patientName: 'Audrey Hepburn',
    patientCode: '(#71)',
    patientDob: '05/04/1929',
    claimNumber: '#25439',
    claimType: 'E-claim Primary',
    createdDate: '05/22/2026',
    sentDate: '05/22/2026',
    printedDate: '—',
    carrier: 'CIGNA',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: '',
    description: '',
    procedures: [{ code: 'D0120', name: 'Periodic Oral Evaluation', fee: 55.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '22',
    patientName: 'Marilyn Monroe',
    patientCode: '(#582)',
    patientDob: '06/01/1926',
    claimNumber: '#25435',
    claimType: 'E-claim Primary',
    createdDate: '05/22/2026',
    sentDate: '05/22/2026',
    printedDate: '—',
    carrier: 'CIGNA',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: '',
    description: '',
    procedures: [{ code: 'D2331', name: 'Resin-Based Composite - 2 Surfaces', fee: 210.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '23',
    patientName: 'Elvis Presley',
    patientCode: '(#1044)',
    patientDob: '01/08/1935',
    claimNumber: '#25415',
    claimType: 'E-claim Primary',
    createdDate: '05/21/2026',
    sentDate: '05/21/2026',
    printedDate: '—',
    carrier: 'MetLife',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: '',
    description: '',
    procedures: [{ code: 'D2740', name: 'Crown - Porcelain/Ceramic Substrate', fee: 1200.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '24',
    patientName: 'John Lennon',
    patientCode: '(#227)',
    patientDob: '10/09/1940',
    claimNumber: '#25403',
    claimType: 'E-claim Primary',
    createdDate: '05/21/2026',
    sentDate: '05/21/2026',
    printedDate: '—',
    carrier: 'Aetna Dental Plans',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: '',
    description: '',
    procedures: [{ code: 'D1110', name: 'Prophylaxis - Adult', fee: 95.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '25',
    patientName: 'Paul McCartney',
    patientCode: '(#24)',
    patientDob: '06/18/1942',
    claimNumber: '#25397',
    claimType: 'E-claim Primary',
    createdDate: '05/22/2026',
    sentDate: '05/22/2026',
    printedDate: '—',
    carrier: 'CIGNA',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: '',
    description: '',
    procedures: [{ code: 'D2950', name: 'Core Buildup, Including Any Pins', fee: 245.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '26',
    patientName: 'George Harrison',
    patientCode: '(#19)',
    patientDob: '02/25/1943',
    claimNumber: '#25313',
    claimType: 'E-claim Primary',
    createdDate: '05/19/2026',
    sentDate: '05/19/2026',
    printedDate: '—',
    carrier: 'CIGNA',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: '',
    description: '',
    procedures: [{ code: 'D0150', name: 'Comprehensive Oral Evaluation', fee: 110.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '27',
    patientName: 'Ringo Starr',
    patientCode: '(#200)',
    patientDob: '07/07/1940',
    claimNumber: '#25309',
    claimType: 'E-claim Primary',
    createdDate: '05/19/2026',
    sentDate: '05/19/2026',
    printedDate: '—',
    carrier: 'CIGNA',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: '',
    description: '',
    procedures: [{ code: 'D3330', name: 'Endodontic Therapy - Molar', fee: 980.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '28',
    patientName: 'Bob Dylan',
    patientCode: '(#1260)',
    patientDob: '05/24/1941',
    claimNumber: '#25303',
    claimType: 'E-claim Primary',
    createdDate: '05/18/2026',
    sentDate: '05/18/2026',
    printedDate: '—',
    carrier: 'Aetna Dental Plans',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: '',
    description: 'Crown Prep 05/14/2026 06/04/2026',
    procedures: [{ code: 'D2740', name: 'Crown - Porcelain/Ceramic', fee: 1150.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '29',
    patientName: 'Jimi Hendrix',
    patientCode: '(#308)',
    patientDob: '11/27/1942',
    claimNumber: '#25300',
    claimType: 'E-claim Primary',
    createdDate: '05/18/2026',
    sentDate: '05/18/2026',
    printedDate: '—',
    carrier: 'MetLife',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: '',
    description: '',
    procedures: [{ code: 'D4910', name: 'Periodontal Maintenance', fee: 140.00 }],
    tab: 'history',
    redAttachment: false,
  },
  {
    id: '30',
    patientName: 'Eric Clapton',
    patientCode: '(#99)',
    patientDob: '03/30/1945',
    claimNumber: '#25287',
    claimType: 'E-claim Primary',
    createdDate: '05/18/2026',
    sentDate: '05/18/2026',
    printedDate: '—',
    carrier: 'MetLife',
    status: 'acceptedPaid',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: '',
    description: 'Babar Magsi',
    procedures: [{ code: 'D6010', name: 'Surgical Placement of Implant Body', fee: 1950.00 }],
    tab: 'history',
    redAttachment: false,
  },

  // 31-32: OUTSTANDING CLAIMS
  {
    id: '31',
    patientName: 'Zachary Taylor',
    patientCode: '(#1124)',
    patientDob: '07/17/1984',
    claimNumber: '#25258',
    claimType: 'E-claim Primary',
    createdDate: '05/13/2026',
    sentDate: '05/15/2026',
    printedDate: '—',
    subscriber: 'Sean Carpenter',
    carrier: 'Aetna Dental Plans',
    planName: 'Aetna PPO (083321)',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    submittedValue: 318.00,
    notes: 'Prior authorization confirmed',
    description: '',
    procedures: [
      { code: 'D0120', name: 'Periodic Oral Evaluation', fee: 55.00 },
      { code: 'D0210', name: 'Intraoral - Complete Series', fee: 263.00 },
    ],
    tab: 'outstanding',
    redAttachment: false,
  },
  {
    id: '32',
    patientName: 'Amy Guy',
    patientCode: '(#942)',
    patientDob: '11/04/1991',
    claimNumber: '#24994',
    claimType: 'E-claim Primary',
    createdDate: '05/02/2026',
    sentDate: '05/04/2026',
    printedDate: '—',
    subscriber: 'Amy Guy',
    carrier: 'Blue Cross',
    planName: 'BCBS Choice (120984)',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    submittedValue: 5900.00,
    notes: 'Sent digitally.',
    description: 'F/U 06/01/2026 BH.',
    procedures: [
      { code: 'D6010', name: 'Implant Placement', fee: 5900.00 },
    ],
    tab: 'outstanding',
    redAttachment: false,
  },

  // 33-40: PREDETERMINATION CLAIMS
  {
    id: '33',
    patientName: 'Leticia Carter',
    patientCode: '(#253)',
    patientDob: '08/12/1988',
    claimNumber: '#24310',
    claimType: 'E-claim Primary',
    sentDate: '04/06/2026',
    carrier: 'CIGNA',
    treatingProvider: 'Sabour S.',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: 'Pre-auth crown replacement.',
    description: '',
    procedures: [{ code: 'D2750', name: 'Crown - Porcelain Fused to High Noble Metal', fee: 1100.00 }],
    tab: 'predetermination',
    attachmentColor: 'green',
  },
  {
    id: '34',
    patientName: 'Russell Rudolf',
    patientCode: '(#752)',
    patientDob: '10/24/1975',
    claimNumber: '#23814',
    claimType: 'Manual Primary',
    sentDate: '—',
    carrier: 'MetLife',
    treatingProvider: 'Sabour S.',
    status: 'manualClaim',
    clearingHouseMessage: '',
    notes: 'Paper pre-determination.',
    description: 'Babar Magsi',
    procedures: [{ code: 'D4341', name: 'Periodontal Scaling & Root Planing', fee: 280.00 }],
    tab: 'predetermination',
    attachmentColor: 'blue',
    showEye: true,
  },
  {
    id: '35',
    patientName: 'Evan Romero',
    patientCode: '(#812)',
    patientDob: '05/16/1990',
    claimNumber: '#23813',
    claimType: 'E-claim Primary',
    sentDate: '03/12/2026',
    carrier: 'MetLife',
    treatingProvider: 'Sabour S.',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A0): The claim has been received by the clearinghouse.',
    notes: 'X-rays attached.',
    description: '',
    procedures: [{ code: 'D2331', name: 'Resin Composite - 2 Surfaces', fee: 210.00 }],
    tab: 'predetermination',
    attachmentColor: 'red',
  },
  {
    id: '36',
    patientName: 'Gabriel Medina',
    patientCode: '(#226)',
    patientDob: '12/03/1995',
    claimNumber: '#23709',
    claimType: 'E-claim Primary',
    sentDate: '03/06/2026',
    carrier: 'Delta Dental',
    treatingProvider: 'Sabour S.',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A1): The claim is in process at the payer.',
    notes: 'General cleaning auth.',
    description: '',
    procedures: [{ code: 'D1110', name: 'Prophylaxis - Adult', fee: 95.00 }],
    tab: 'predetermination',
    attachmentColor: 'red',
  },
  {
    id: '37',
    patientName: 'Carolyn Miller',
    patientCode: '(#444)',
    patientDob: '01/30/1985',
    claimNumber: '#15152',
    claimType: 'E-claim Primary',
    sentDate: '11/06/2024',
    carrier: 'Delta Dental of California Federal Government plan',
    treatingProvider: 'Sabour S.',
    status: 'acceptedForProcessing',
    clearingHouseMessage: 'Accepted For Processing',
    notes: 'Bridges auth.',
    description: 'Dental bridges replace missing teeth tooth 20 is broken',
    procedures: [{ code: 'D6240', name: 'Pontic - Porcelain Fused to Noble Metal', fee: 950.00 }],
    tab: 'predetermination',
    attachmentColor: 'blue',
  },
  {
    id: '38',
    patientName: 'Babar Magsi',
    patientCode: '(#776)',
    patientDob: '03/09/1987',
    claimNumber: '#15117',
    claimType: 'Manual Primary',
    sentDate: '—',
    carrier: 'MetLife',
    treatingProvider: 'Sabour S.',
    status: 'manualClaim',
    clearingHouseMessage: '',
    notes: 'Manual submission.',
    description: '',
    procedures: [{ code: 'D6010', name: 'Surgical Placement of Implant Body', fee: 1950.00 }],
    tab: 'predetermination',
    attachmentColor: 'blue',
  },
  {
    id: '39',
    patientName: 'Ivan Todorov',
    patientCode: '(#585)',
    patientDob: '12/25/1992',
    claimNumber: '#14313',
    claimType: 'E-claim Primary',
    sentDate: '09/13/2024',
    carrier: 'GEHA Connection',
    treatingProvider: 'Sabour S.',
    status: 'inProcess',
    clearingHouseMessage: 'Status Response (A1): The claim is in process at the payer.',
    notes: 'Extraction pre-auth.',
    description: '',
    procedures: [{ code: 'D7140', name: 'Extraction, Erupted Tooth', fee: 185.00 }],
    tab: 'predetermination',
    attachmentColor: 'green',
  },
  {
    id: '40',
    patientName: 'Zachary Taylor',
    patientCode: '(#998)',
    patientDob: '07/17/1984',
    claimNumber: '#14218',
    claimType: 'E-claim Primary',
    sentDate: '09/09/2024',
    carrier: 'Aetna Dental Plans',
    treatingProvider: 'Sabour S.',
    status: 'accepted',
    clearingHouseMessage: 'Status Response (A2): Acknowledged/Accept at payer level.',
    notes: 'Complete x-rays pre-auth.',
    description: '',
    procedures: [{ code: 'D0210', name: 'Intraoral - Complete Series', fee: 263.00 }],
    tab: 'predetermination',
    attachmentColor: 'green',
  },
];

// High Fidelity Mock Dentical Reports Data
const DENTICAL_REPORTS_MOCK = [
  {
    id: 'dr_1',
    fileName: 'dentical_remittance_advice_052026.pdf',
    reportDate: '05/20/2026',
    dateCreated: '05/21/2026',
  },
  {
    id: 'dr_2',
    fileName: 'dentical_eligibility_status_051826.pdf',
    reportDate: '05/18/2026',
    dateCreated: '05/18/2026',
  },
  {
    id: 'dr_3',
    fileName: 'dentical_treatment_authorization_request_051526.pdf',
    reportDate: '05/15/2026',
    dateCreated: '05/16/2026',
  },
  {
    id: 'dr_4',
    fileName: 'dentical_claims_payment_summary_051026.pdf',
    reportDate: '05/10/2026',
    dateCreated: '05/11/2026',
  },
];

// High Fidelity Mock ERA (Electronic Remittance Advice) Reports Data
const INITIAL_ERA_REPORTS = [
  // ACTIVE CLAIMS (eraTab = 'active')
  {
    id: 'era_1',
    patientId: 'PT-0418',
    patientName: 'Leticia Carter',
    claimNumber: '#25390',
    carrier: 'Blue Cross Blue Shield of Texas',
    status: 'Paid',
    amountSubmitted: 1205.00,
    amountPaid: 964.00,
    patientResponsibility: 241.00,
    writeOff: 0.00,
    dateReceived: '05/22/2026',
    paymentType: 'EFT',
    eraTab: 'active',
  },
  {
    id: 'era_2',
    patientId: 'PT-0097',
    patientName: 'Russell Rudolf',
    claimNumber: '#25401',
    carrier: 'Metlife',
    status: 'Paid',
    amountSubmitted: 420.00,
    amountPaid: 336.00,
    patientResponsibility: 0.00,
    writeOff: 84.00,
    dateReceived: '05/21/2026',
    paymentType: 'Check',
    eraTab: 'active',
  },
  {
    id: 'era_3',
    patientId: 'PT-0134',
    patientName: 'Evan Romero',
    claimNumber: '#25407',
    carrier: 'Aetna Dental',
    status: 'Denial',
    amountSubmitted: 210.00,
    amountPaid: 0.00,
    patientResponsibility: 210.00,
    writeOff: 0.00,
    dateReceived: '05/20/2026',
    paymentType: 'EFT',
    eraTab: 'active',
  },
  {
    id: 'era_4',
    patientId: 'PT-0011',
    patientName: 'Gabriel Medina',
    claimNumber: '#25474',
    carrier: 'Guardian Life',
    status: 'Paid',
    amountSubmitted: 130.00,
    amountPaid: 104.00,
    patientResponsibility: 26.00,
    writeOff: 0.00,
    dateReceived: '05/19/2026',
    paymentType: 'EFT',
    eraTab: 'active',
  },
  {
    id: 'era_5',
    patientId: 'PT-0085',
    patientName: 'Babar Magsi',
    claimNumber: '#25372',
    carrier: 'Metlife',
    status: 'Paid',
    amountSubmitted: 1990.00,
    amountPaid: 1492.50,
    patientResponsibility: 100.00,
    writeOff: 397.50,
    dateReceived: '05/18/2026',
    paymentType: 'Check',
    eraTab: 'active',
  },
  {
    id: 'era_6',
    patientId: 'PT-0112',
    patientName: 'Carolyn Miller',
    claimNumber: '#24285',
    carrier: 'Cigna Dental',
    status: 'Paid',
    amountSubmitted: 175.00,
    amountPaid: 140.00,
    patientResponsibility: 35.00,
    writeOff: 0.00,
    dateReceived: '05/17/2026',
    paymentType: 'EFT',
    eraTab: 'active',
  },

  // VOIDED CLAIMS (eraTab = 'voided')
  {
    id: 'era_7',
    patientId: 'PT-0063',
    patientName: 'Ivan Todorov',
    claimNumber: '#25262',
    carrier: 'United Healthcare Dental',
    status: 'Voided',
    amountSubmitted: 185.00,
    amountPaid: 0.00,
    patientResponsibility: 0.00,
    writeOff: 0.00,
    dateReceived: '05/15/2026',
    paymentType: '—',
    eraTab: 'voided',
  },
  {
    id: 'era_8',
    patientId: 'PT-1246',
    patientName: 'Thomas Gellar',
    claimNumber: '#25011',
    carrier: 'CIGNA',
    status: 'Voided',
    amountSubmitted: 1450.00,
    amountPaid: 0.00,
    patientResponsibility: 0.00,
    writeOff: 0.00,
    dateReceived: '05/14/2026',
    paymentType: '—',
    eraTab: 'voided',
  },
];

const REJECTED_MOCK_DATA = [
  {
    id: '16',
    patientName: 'Hassan Al-Saeed',
    patientCode: '(#554)',
    patientDob: '02/12/1980',
    claimNumber: '#21182',
    claimType: 'E-claim Primary',
    createdDate: '04/10/2026',
    sentDate: '04/10/2026',
    printedDate: '—',
    carrier: 'Delta Dental Ins.',
    status: 'rejected',
    eraStatus: 'Rejected by Payer',
    clearingHouseMessage: 'Reject Reason: Patient eligibility not found on date of service.',
    notes: 'Checked insurance card, subscriber ID matches but coverage terminated.',
    description: 'F/U 05/10/2026. Verification failed.',
    procedures: [{ code: 'D0120', name: 'Periodic Oral Evaluation', fee: 55.00 }],
    tab: 'rejected',
    redAttachment: false,
  },
  {
    id: '17',
    patientName: 'Emily Rose',
    patientCode: '(#302)',
    patientDob: '05/06/1994',
    claimNumber: '#23190',
    claimType: 'E-claim Primary',
    createdDate: '03/05/2026',
    sentDate: '03/05/2026',
    printedDate: '03/06/2026',
    carrier: 'Aetna Dental',
    status: 'rejected',
    eraStatus: 'Rejected by Clearinghouse',
    clearingHouseMessage: 'Reject Reason: Missing signature indicator code.',
    notes: 'Dentist signature block was empty. Re-added and prepared.',
    description: 'Need doctor signature on file.',
    procedures: [{ code: 'D2740', name: 'Crown - Porcelain/Ceramic', fee: 1150.00 }],
    tab: 'rejected',
    redAttachment: true,
  },
];

const TABS = [
  'UNSENT CLAIMS',
  'ERRORED',
  'REJECTED',
  'HISTORY',
  'OUTSTANDING CLAIMS',
  'PREDETERMINATION',
  'DENTICAL REPORTS',
  'ERA REPORTS',
];

const ClaimsListPage = () => {
  const navigate = useNavigate();

  // Tabs State
  const [activeTab, setActiveTab] = useState(0);

  // ERA Reports Specific State
  const [activeEraTab, setActiveEraTab] = useState('active'); // 'active' | 'voided'
  const [searchEraContent, setSearchEraContent] = useState('');
  const [visibleEraCount, setVisibleEraCount] = useState(4); // Default to showing first 4, load more dynamically

  // Filters State
  const [sortReportBy, setSortReportBy] = useState('none');
  const [claimType, setClaimType] = useState('all');
  const [carrier, setCarrier] = useState('all');
  const [claimAttachment, setClaimAttachment] = useState('all');
  const [claimStatus, setClaimStatus] = useState('all');
  const [groupDateRange, setGroupDateRange] = useState('none');
  const [groupByOption, setGroupByOption] = useState('none');
  const [showNonAssignment, setShowNonAssignment] = useState(false);
  const [showInactivePolicies, setShowInactivePolicies] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [searchClaimOrDate, setSearchClaimOrDate] = useState('');
  const [searchReportContent, setSearchReportContent] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  // Clearing house message expansion state
  const [expandAllMessages, setExpandAllMessages] = useState(false);

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Claims Data State
  const [claims, setClaims] = useState([]);
  const [denticalReports, setDenticalReports] = useState([]);
  const [eraReports, setEraReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedClaims, setSelectedClaims] = useState({});

  // Fetch data from backend based on the active tab and filters
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 6) {
          // Dentical Reports
          const data = await claimService.getDenticalReports();
          if (active) {
            setDenticalReports(data || []);
          }
        } else if (activeTab === 7) {
          // ERA Reports
          const data = await claimService.getEraReports({
            eraTab: activeEraTab,
            search: searchEraContent,
            limit: 100
          });
          if (active) {
            setEraReports(data.reports || []);
          }
        } else {
          // Helper: map API claim to display-ready shape
          const mapClaimFields = (c, tab) => ({
            ...c,
            tab,
            patientName: c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : 'Unknown Patient',
            patientCode: c.patient ? `(${c.patient.patientCode})` : '',
            patientDob: c.patient?.dateOfBirth ? new Date(c.patient.dateOfBirth).toLocaleDateString() : '',
            carrier: c.insuranceCompany?.name || 'No Carrier',
            claimType: c.insuranceType ? `${c.insuranceType.charAt(0).toUpperCase() + c.insuranceType.slice(1)}` : 'Primary',
            claimNumber: c.claimNumber || c.claimCode || `#${c.id}`,
            createdDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '',
            sentDate: c.submittedDate ? new Date(c.submittedDate).toLocaleDateString() : (c.submissionDate ? new Date(c.submissionDate).toLocaleDateString() : ''),
            printedDate: '',
            procedures: c.procedures || [],
            clearingHouseMessage: c.denialReason || '',
            eraStatus: '',
            description: c.notes || '',
          });

          // Claims (tab specific)
          let fetchedClaims = [];
          if (activeTab >= 0 && activeTab <= 3) {
            // Fetch all claims for tabs 0-3; filter by status client-side
            const filterParams = { 
              page: 1, 
              limit: 500,
              ...(claimType !== 'all' && { claimFormat: claimType }),
              ...(carrier !== 'all' && { carrierName: carrier }),
              ...(claimAttachment !== 'all' && { hasAttachment: claimAttachment === 'with_attachments' ? 'true' : 'false' }),
              ...(claimStatus !== 'all' && { status: claimStatus }),
              ...(searchPatient && { patientName: searchPatient }),
              ...(searchClaimOrDate && { search: searchClaimOrDate }),
              ...(showHidden && { showHidden: true })
            };
            const data = await claimService.getAllClaims(filterParams);
            fetchedClaims = (data.claims || []).map(c => mapClaimFields(c, 'claims'));
          } else if (activeTab === 4) {
            const data = await claimService.getOutstandingClaims({ limit: 100, dateRange: groupDateRange, groupBy: groupByOption });
            fetchedClaims = (data.claims || []).map(c => mapClaimFields(c, 'outstanding'));
          } else if (activeTab === 5) {
            const data = await claimService.getPredeterminations({ limit: 100 });
            fetchedClaims = (data.claims || []).map(c => mapClaimFields(c, 'predetermination'));
          }
          if (active) {
            setClaims(fetchedClaims);
          }
        }
      } catch (error) {
        console.error('Error fetching claims data:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [
    activeTab, 
    activeEraTab, 
    searchEraContent, 
    groupDateRange, 
    groupByOption, 
    refreshTrigger,
    claimType,
    carrier,
    claimAttachment,
    claimStatus,
    searchPatient,
    searchClaimOrDate,
    showHidden
  ]);

  // Expandable Procedures State
  const [expandedProcedures, setExpandedProcedures] = useState({});

  // Popover State for Notes
  const [notePopover, setNotePopover] = useState({
    anchorEl: null,
    text: '',
  });

  // Modal Dialogs for Actions
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);
  const [editFormErrors, setEditFormErrors] = useState({});
  const [openAttachDialog, setOpenAttachDialog] = useState(false);
  const [attachingClaim, setAttachingClaim] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewingClaim, setPreviewingClaim] = useState(null);

  // Statistics & Alerts
  const validationErrorCount = useMemo(() => {
    return claims.filter((c) => ['denied', 'rejected', 'validationError', 'error'].includes(c.status)).length;
  }, [claims]);

  // Handle Note Popover Open
  const handleNoteOpen = (event, text) => {
    setNotePopover({
      anchorEl: event.currentTarget,
      text: text || 'No additional notes provided.',
    });
  };

  const handleNoteClose = () => {
    setNotePopover({
      anchorEl: null,
      text: '',
    });
  };

  // Revalidate/Retry validation error claims
  const handleRevalidate = async (claimId) => {
    try {
      setLoading(true);
      const validation = await claimService.validateClaim(claimId);
      if (validation.isValid) {
        await claimService.quickStatusUpdate(claimId, 'readyForSubmission', 'Revalidated: Ready');
        alert('Claim is valid! Status updated to Ready for Submission.');
      } else {
        const errorMsgs = validation.errors.map(e => e.message).join('\n');
        await claimService.quickStatusUpdate(claimId, 'validationError', `Validation failed: ${errorMsgs}`);
        alert('Validation failed:\n' + errorMsgs);
      }
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Error validating claim: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Handle row-based status change directly from dropdown
  const handleRowStatusChange = async (claimId, newStatus) => {
    try {
      setLoading(true);
      await claimService.quickStatusUpdate(claimId, newStatus, `Status updated to ${newStatus}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Error updating status: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Procedure Row Toggle
  const toggleProcedures = (id) => {
    setExpandedProcedures((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle Selecting Individual Claim Checkbox
  const handleSelectClaim = (id) => {
    setSelectedClaims((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle Selecting All Claims Checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelected = {};
    if (checked) {
      filteredClaims.forEach((c) => {
        newSelected[c.id] = true;
      });
    }
    setSelectedClaims(newSelected);
  };

  // Select All Dropdown Menu State
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  const isSelectAllMenuOpen = Boolean(selectAllAnchorEl);

  const handleSelectAllMenuOpen = (event) => {
    setSelectAllAnchorEl(event.currentTarget);
  };

  const handleSelectAllMenuClose = () => {
    setSelectAllAnchorEl(null);
  };

  // Helper to select specific subsets of claims
  const handleSelectSubset = (type) => {
    const newSelected = {};
    if (type === 'all') {
      filteredClaims.forEach((c) => {
        newSelected[c.id] = true;
      });
    } else if (type === 'ready') {
      filteredClaims.forEach((c) => {
        if (c.status === 'readyForSubmission') {
          newSelected[c.id] = true;
        }
      });
    } else if (type === 'errored') {
      filteredClaims.forEach((c) => {
        if (c.status === 'validationError' || c.status === 'error' || c.status === 'rejected') {
          newSelected[c.id] = true;
        }
      });
    } else if (type === 'none') {
      // empty selection
    }
    setSelectedClaims(newSelected);
    handleSelectAllMenuClose();
  };

  // Check if any claim is selected
  const hasSelection = useMemo(() => {
    return Object.values(selectedClaims).some((val) => val === true);
  }, [selectedClaims]);

  // Refresh filters and list
  const handleRefresh = () => {
    setSortReportBy('none');
    setClaimType('all');
    setCarrier('all');
    setClaimAttachment('all');
    setClaimStatus('all');
    setGroupDateRange('none');
    setGroupByOption('none');
    setShowNonAssignment(false);
    setShowInactivePolicies(false);
    setSearchPatient('');
    setSearchClaimOrDate('');
    setSearchReportContent('');
    setSearchEraContent('');
    setVisibleEraCount(4);
    setShowHidden(false);
    setSelectedClaims({});
    setExpandAllMessages(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Load More Claims Action for Rejected
  const handleLoadMoreClaims = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Load More ERA Reports
  const handleLoadMoreEraReports = () => {
    setVisibleEraCount((prev) => prev + 2);
  };

  // Delete/Void Predetermination claim
  const handleDeletePredetermination = async (claimId) => {
    if (window.confirm('Are you sure you want to delete this predetermination?')) {
      try {
        setLoading(true);
        await claimService.updateClaim(claimId, { status: 'cancelled' });
        setSelectedClaims((prev) => ({ ...prev, [claimId]: false }));
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        console.error(err);
        alert('Error cancelling predetermination: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter & Sort Claims based on Active Tab, Filter inputs and Sort choice
  const filteredClaims = useMemo(() => {
    let result = claims.filter((claim) => {
      // 1. Tab filtration mapping (status-based for tabs 0-3)
      if (activeTab === 0) {
        // Unsent: draft claims AND errored claims
        if (!['draft', 'error', 'validationError', 'rejected', 'denied'].includes(claim.status)) return false;
      } else if (activeTab === 1) {
        // Errored: rejected, denied, or validation error claims
        if (!['rejected', 'denied', 'validationError', 'error'].includes(claim.status)) return false;
      } else if (activeTab === 2) {
        // Rejected only
        if (claim.status !== 'rejected') return false;
      } else if (activeTab === 3) {
        // History: everything that has been processed (not draft)
        if (claim.status === 'draft') return false;
      } else if (activeTab === 4) {
        if (claim.tab !== 'outstanding') return false;
      } else if (activeTab === 5) {
        if (claim.tab !== 'predetermination') return false;
      } else {
        return false;
      }

      // 2. Claim Type filtration
      if (claimType !== 'all') {
        const typeNormalized = claim.claimType.toLowerCase().replace('-', '');
        const filterNormalized = claimType.toLowerCase().replace('_', '');
        if (!typeNormalized.includes(filterNormalized)) return false;
      }

      // 3. Carrier filtration
      if (carrier !== 'all') {
        const carrierMap = {
          bcbs: 'blue cross',
          metlife: 'metlife',
          aetna: 'aetna',
          guardian: 'guardian',
          cigna: 'cigna',
          delta: 'delta',
          uhc: 'united',
          humana: 'humana',
          principal: 'principal',
          anthem: 'anthem',
          geha: 'geha',
        };
        const searchStr = carrierMap[carrier] || '';
        if (!claim.carrier.toLowerCase().includes(searchStr)) return false;
      }

      // 4. Claim Attachment filtration
      if (claimAttachment !== 'all') {
        if (claimAttachment === 'with_attachments' && !claim.redAttachment && claim.attachmentColor !== 'green' && claim.attachmentColor !== 'red') return false;
        if (claimAttachment === 'without_attachments' && (claim.redAttachment || claim.attachmentColor === 'green' || claim.attachmentColor === 'red')) return false;
      }

      // 5. Claim Status filtration (Specific to History, Outstanding & Predetermination tabs)
      if ((activeTab === 3 || activeTab === 4 || activeTab === 5) && claimStatus !== 'all') {
        if (claim.status !== claimStatus) return false;
      }

      // 6. Patient Name search
      if (searchPatient.trim()) {
        if (!claim.patientName.toLowerCase().includes(searchPatient.toLowerCase())) return false;
      }

      // 7. Claim Code, Created Date, Sent Date or Printed Date search
      if (searchClaimOrDate.trim()) {
        const cleanSearch = searchClaimOrDate.toLowerCase();
        const createdMatch = claim.createdDate && claim.createdDate.toLowerCase().includes(cleanSearch);
        const sentMatch = claim.sentDate && claim.sentDate.toLowerCase().includes(cleanSearch);
        const printedMatch = claim.printedDate && claim.printedDate.toLowerCase().includes(cleanSearch);
        if (
          !claim.claimNumber.toLowerCase().includes(cleanSearch) &&
          !createdMatch &&
          !sentMatch &&
          !printedMatch
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort Logic if "Sort Report by" is active
    if (sortReportBy !== 'none') {
      result = [...result].sort((a, b) => {
        if (sortReportBy === 'patient_name') {
          return a.patientName.localeCompare(b.patientName);
        }
        if (sortReportBy === 'claim_number') {
          return a.claimNumber.localeCompare(b.claimNumber);
        }
        if (sortReportBy === 'sent_date') {
          const dateA = a.sentDate || '';
          const dateB = b.sentDate || '';
          return dateA.localeCompare(dateB);
        }
        if (sortReportBy === 'printed_date') {
          const dateA = a.printedDate || '';
          const dateB = b.printedDate || '';
          return dateA.localeCompare(dateB);
        }
        if (sortReportBy === 'carrier') {
          return a.carrier.localeCompare(b.carrier);
        }
        return 0;
      });
    }

    return result;
  }, [claims, activeTab, sortReportBy, claimType, carrier, claimAttachment, claimStatus, searchPatient, searchClaimOrDate]);

  // Dentical Reports Filter logic based on Search Input
  const filteredDenticalReports = useMemo(() => {
    if (!searchReportContent.trim()) return denticalReports;
    return denticalReports.filter((r) =>
      r.fileName.toLowerCase().includes(searchReportContent.toLowerCase()) ||
      r.reportDate.includes(searchReportContent) ||
      r.dateCreated.includes(searchReportContent)
    );
  }, [denticalReports, searchReportContent]);

  // ERA Reports Filter & Slice logic based on search ERA input and Active ERA sub-tab
  const filteredEraReports = useMemo(() => {
    // Backend already filters by eraTab, so no need to filter again here
    let result = [...eraReports];

    if (searchEraContent.trim()) {
      const s = searchEraContent.toLowerCase();
      result = result.filter(
        (r) =>
          r.patientName.toLowerCase().includes(s) ||
          r.patientId.toLowerCase().includes(s) ||
          r.claimNumber.toLowerCase().includes(s) ||
          r.carrier.toLowerCase().includes(s)
      );
    }

    return result.slice(0, visibleEraCount);
  }, [eraReports, activeEraTab, searchEraContent, visibleEraCount]);

  // Action for Unsent/Predetermination: Convert type
  const handleConvertType = () => {
    alert(`Converting selected claim types for: ${Object.keys(selectedClaims).filter(k => selectedClaims[k]).join(', ')}`);
  };

  // Action: Change Status
  const handleChangeStatus = () => {
    const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
    alert(`Change Status clicked for predeterminations: ${selectedIds.map(id => claims.find(c => c.id === id)?.claimNumber).join(', ')}`);
  };

  // Action for Unsent: Send Claims
  const handleSendClaims = async () => {
    const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
    const errorsSelected = claims.some((c) => selectedIds.includes(c.id) && c.status === 'validationError');

    if (errorsSelected) {
      alert('Cannot send claims with validation errors. Please resolve errors first.');
      return;
    }

    try {
      setLoading(true);
      await claimService.batchSubmitClaims(selectedIds, 'electronic');
      setSelectedClaims({});
      setRefreshTrigger((prev) => prev + 1);
      alert(`Successfully sent ${selectedIds.length} claim(s)! They are now in the OUTSTANDING CLAIMS tab.`);
    } catch (err) {
      console.error(err);
      alert('Error sending claims: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Action for Predetermination: Send Predeterminations
  const handleSendPredeterminations = async () => {
    const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
    try {
      setLoading(true);
      await claimService.batchSubmitClaims(selectedIds, 'electronic');
      setSelectedClaims({});
      setRefreshTrigger((prev) => prev + 1);
      alert(`Successfully sent ${selectedIds.length} predetermination(s) to clearinghouse!`);
    } catch (err) {
      console.error(err);
      alert('Error sending predeterminations: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Action for Predetermination: Print Predeterminations
  const handlePrintPredeterminations = () => {
    const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
    if (selectedIds.length === 0) {
      alert('Please select a predetermination to print.');
      return;
    }
    
    const firstSelectedId = selectedIds[0];
    const claimToPrint = claims.find(c => c.id === firstSelectedId);
    
    if (claimToPrint) {
      setPreviewingClaim(claimToPrint);
      setOpenPreviewDialog(true);
    }
  };

  // Action for Unsent: Print Claims
  const handlePrintClaims = () => {
    const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
    if (selectedIds.length === 0) {
      alert('Please select a claim to print.');
      return;
    }
    
    // Just grab the first selected claim to preview
    const firstSelectedId = selectedIds[0];
    const claimToPrint = claims.find(c => c.id === firstSelectedId);
    
    if (claimToPrint) {
      setPreviewingClaim(claimToPrint);
      setOpenPreviewDialog(true);
    }
  };

  // Action for Errored / Rejected / History: Void & Recreate Claims
  const handleVoidAndRecreate = async () => {
    const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
    try {
      setLoading(true);
      await Promise.all(
        selectedIds.map((id) =>
          claimService.quickStatusUpdate(id, 'draft', 'Voided and recreated draft')
        )
      );
      setSelectedClaims({});
      setRefreshTrigger((prev) => prev + 1);
      alert(`Voided and Recreated ${selectedIds.length} claim(s). They are now in the UNSENT CLAIMS tab.`);
    } catch (err) {
      console.error(err);
      alert('Error voiding and recreating claims: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Print Page Action
  const handlePrintPage = () => {
    window.print();
  };

  // Export CSV Action
  const handleExportCSV = () => {
    const headers = 'Patient Name,Claim #,Claim Type,Sent on,Printed on,Carrier,Status,ERA Status,Clearing House Status Message,Description\n';
    const rows = filteredClaims.map((c) =>
      `"${c.patientName}","${c.claimNumber}","${c.claimType}","${c.sentDate || ''}","${c.printedDate || ''}","${c.carrier}","${c.status}","${c.eraStatus || ''}","${c.clearingHouseMessage || ''}","${c.description}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'claims_report.csv');
    a.click();
    alert('Exported report to CSV!');
  };

  // Edit dialog actions
  const handleOpenEdit = (claim) => {
    setEditingClaim(claim);
    setEditFormErrors({});
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    // 1. Validate
    const errors = {};
    
    const hasSubmittedVal = editingClaim.submittedValue !== undefined && editingClaim.submittedValue !== null && editingClaim.submittedValue !== '';
    const hasClaimAmount = editingClaim.claimAmount !== undefined && editingClaim.claimAmount !== null && editingClaim.claimAmount !== '';
    
    let cAmount = undefined;
    let sAmount = undefined;

    if (hasClaimAmount || hasSubmittedVal) {
      cAmount = parseFloat(editingClaim.claimAmount || editingClaim.submittedValue || 0);
      sAmount = parseFloat(editingClaim.submittedAmount || editingClaim.submittedValue || 0);
      if (isNaN(cAmount) || cAmount < 0) errors.submittedAmount = 'Must be a valid positive amount';
      if (isNaN(sAmount) || sAmount < 0) errors.submittedAmount = 'Must be a valid positive amount';
    }
    
    const isErrorStatus = ['error', 'validationError'].includes(editingClaim.status);
    const currentNotes = editingClaim.notes || editingClaim.description || editingClaim.clearingHouseMessage || '';
    if (isErrorStatus && !currentNotes.trim()) {
      errors.notes = 'Status message or notes are required when setting an error status';
    }

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        status: editingClaim.status,
        notes: currentNotes,
        policyNumber: editingClaim.policyNumber,
      };
      
      if (cAmount !== undefined) payload.claimAmount = cAmount;
      if (sAmount !== undefined) payload.submittedAmount = sAmount;

      await claimService.updateClaim(editingClaim.id, payload);
      setOpenEditDialog(false);
      setEditingClaim(null);
      setRefreshTrigger((prev) => prev + 1);
      
      if (isErrorStatus) {
         setSnackbarMessage(`Claim successfully updated and moved to Errored status`);
      } else {
         setSnackbarMessage(`Claim successfully updated to ${editingClaim.status}`);
      }
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      alert('Error saving claim: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Attachment dialog actions
  const handleOpenAttach = (claim) => {
    setAttachingClaim(claim);
    setOpenAttachDialog(true);
  };

  const handleSaveAttach = async ({ newFiles, retainedFiles }) => {
    try {
      setLoading(true);
      
      const originalAttachments = attachingClaim.attachments || [];
      const removedFiles = originalAttachments.filter(
        att => !retainedFiles.some(r => r.id === att.id)
      );

      // Process removals
      if (removedFiles.length > 0) {
        await Promise.allSettled(
          removedFiles.map(file => {
            if (file.id) {
               return claimService.removeClaimDocument(attachingClaim.id, file.id);
            }
            return Promise.resolve();
          })
        );
      }

      // Process new uploads
      let newAttachments = [];
      if (newFiles && newFiles.length > 0) {
        const response = await claimService.uploadAttachments(attachingClaim.id, newFiles);
        newAttachments = response.data?.attachments || newFiles.map(f => ({ id: Math.random(), name: f.name }));
      }
      
      setClaims((prev) =>
        prev.map((c) => {
          if (c.id === attachingClaim.id) {
            const updatedAttachments = [...retainedFiles, ...newAttachments];
            const hasAttachments = updatedAttachments.length > 0;
            return { 
              ...c, 
              attachments: updatedAttachments,
              redAttachment: hasAttachments, 
              attachmentColor: hasAttachments ? 'red' : undefined 
            };
          }
          return c;
        })
      );
      
      let msgParts = [];
      if (newFiles?.length > 0) msgParts.push(`attached ${newFiles.length} file(s)`);
      if (removedFiles.length > 0) msgParts.push(`removed ${removedFiles.length} file(s)`);
      
      if (msgParts.length > 0) {
        setSnackbarMessage(`Successfully ${msgParts.join(' and ')} for claim ${attachingClaim.claimNumber}`);
        setSnackbarOpen(true);
      } else if (newFiles?.length === 0 && removedFiles.length === 0) {
        setOpenAttachDialog(false);
        setAttachingClaim(null);
      }
    } catch (error) {
      console.error('Failed to update attachments', error);
      alert('Failed to update attachments. Please try again.');
    } finally {
      setLoading(false);
      setOpenAttachDialog(false);
      setAttachingClaim(null);
    }
  };

  // Preview dialog actions
  const handleOpenPreview = (claim) => {
    setPreviewingClaim(claim);
    setOpenPreviewDialog(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Banner / Breadcrumb */}
      <Box sx={{ borderBottom: '1px solid #e0e6ed', pb: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a3a6b' }}>
          Claim Management
        </Typography>
      </Box>

      {/* Styled Horizontal Sub-Tabs */}
      <Box
        sx={{
          borderBottom: '2px solid #e0e6ed',
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          mb: 1.5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {TABS.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <Box
              key={tab}
              onClick={() => {
                setActiveTab(idx);
                setSelectedClaims({});
              }}
              sx={{
                pb: 1.5,
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#1a3a6b' : '#8898aa',
                cursor: 'pointer',
                borderBottom: isActive ? '3px solid #1a3a6b' : '3px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#1a3a6b',
                },
              }}
            >
              {tab}
            </Box>
          );
        })}
      </Box>

      {/* Small Italic description for History Tab */}
      {activeTab === 3 && (
        <Typography variant="caption" sx={{ color: '#8898aa', fontStyle: 'italic', display: 'block', mb: 2 }}>
          (all sent claims will appear here with their status)
        </Typography>
      )}

      {/* Conditional Filtering Panel */}
      {activeTab === 6 ? (
        <Paper sx={{ p: 2.5, mb: 3, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e6ed' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '350px', maxWidth: '650px' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                Search by report content:
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by Patient Name, Clearinghouse Claim #, or DCN..."
                value={searchReportContent}
                onChange={(e) => setSearchReportContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    fontSize: '0.85rem',
                  },
                }}
              />
            </Box>
            <Button
              onClick={handleRefresh}
              startIcon={<RefreshIcon sx={{ fontSize: '0.9rem' }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#1a3a6b',
                padding: '4px 8px',
                mb: 0.5,
                '&:hover': { background: 'none', textDecoration: 'underline' },
              }}
            >
              Refresh
            </Button>
          </Box>
        </Paper>
      ) : activeTab === 7 ? (
        // ERA REPORTS Header Panel (1:1 with Screenshot)
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2.5,
            mt: 1,
          }}
        >
          {/* Active Claims vs Voided Claims Brownish-Gold sub-toggles */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => {
                setActiveEraTab('active');
                setVisibleEraCount(4);
              }}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: activeEraTab === 'active' ? '#bc9363' : '#dbcaaf',
                borderRadius: '4px',
                px: 2.5,
                py: 0.6,
                '&:hover': { backgroundColor: '#a67d4e' },
              }}
            >
              Active Claims
            </Button>
            <Button
              onClick={() => {
                setActiveEraTab('voided');
                setVisibleEraCount(4);
              }}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: activeEraTab === 'voided' ? '#bc9363' : '#dbcaaf',
                borderRadius: '4px',
                px: 2.5,
                py: 0.6,
                '&:hover': { backgroundColor: '#a67d4e' },
              }}
            >
              Voided Claims
            </Button>
          </Box>

          {/* Filter button and Search input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon sx={{ fontSize: 16 }} />}
              onClick={handleRefresh}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1a3a6b',
                borderColor: '#e2e8f0',
                backgroundColor: '#f7fafc',
                py: 0.7,
                px: 2,
                '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#edf2f7' },
              }}
            >
              Filter
            </Button>
            <TextField
              size="small"
              placeholder="Search by Patient, Claim number or Document ID"
              value={searchEraContent}
              onChange={(e) => setSearchEraContent(e.target.value)}
              sx={{
                width: '320px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  borderRadius: '4px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#a0aec0', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      ) : (
        // STANDARD CLAIMS Filtering Panel
        <Paper sx={{ p: 2.5, mb: 3, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e6ed' }}>
          <Grid container spacing={2.5}>
            {/* Sort dropdown */}
            {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Sort Report by:
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={sortReportBy}
                      onChange={(e) => setSortReportBy(e.target.value)}
                      sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      <MenuItem value="none" sx={{ fontSize: '0.85rem' }}>None</MenuItem>
                      <MenuItem value="patient_name" sx={{ fontSize: '0.85rem' }}>Patient Name</MenuItem>
                      <MenuItem value="claim_number" sx={{ fontSize: '0.85rem' }}>Claim #</MenuItem>
                      <MenuItem value="sent_date" sx={{ fontSize: '0.85rem' }}>Sent Date</MenuItem>
                      <MenuItem value="printed_date" sx={{ fontSize: '0.85rem' }}>Printed Date</MenuItem>
                      <MenuItem value="carrier" sx={{ fontSize: '0.85rem' }}>Carrier</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            )}

            {/* Filter by Claim Type */}
            <Grid item xs={12} sm={(activeTab === 2 || activeTab === 3 || activeTab === 4) ? 3 : 4}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Filter by Claim Type:
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value)}
                    sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    {CLAIM_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value} sx={{ fontSize: '0.85rem' }}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Filter by Carrier */}
            <Grid item xs={12} sm={(activeTab === 2 || activeTab === 3 || activeTab === 4) ? 3 : 4}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Filter by Carrier:
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    {CARRIERS.map((c) => (
                      <MenuItem key={c.value} value={c.value} sx={{ fontSize: '0.85rem' }}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Filter by Claim Attachment */}
            <Grid item xs={12} sm={(activeTab === 2 || activeTab === 3 || activeTab === 4) ? 3 : 4}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Filter by Claim Attachment:
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={claimAttachment}
                    onChange={(e) => setClaimAttachment(e.target.value)}
                    sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <MenuItem value="all" sx={{ fontSize: '0.85rem' }}>All</MenuItem>
                    <MenuItem value="with_attachments" sx={{ fontSize: '0.85rem' }}>With Attachments</MenuItem>
                    <MenuItem value="without_attachments" sx={{ fontSize: '0.85rem' }}>Without Attachments</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Filter by Claim Status */}
            {(activeTab === 3 || activeTab === 4 || activeTab === 5) && (
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Filter by Claim Status:
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={claimStatus}
                      onChange={(e) => setClaimStatus(e.target.value)}
                      sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      {CLAIM_STATUSES.map((s) => (
                        <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.85rem' }}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            )}

            {/* Group Date By Range Filter (Specific to OUTSTANDING CLAIMS) */}
            {activeTab === 4 && (
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Group Date By Range:
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={groupDateRange}
                      onChange={(e) => setGroupDateRange(e.target.value)}
                      sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      {DATE_RANGES.map((r) => (
                        <MenuItem key={r.value} value={r.value} sx={{ fontSize: '0.85rem' }}>
                          {r.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            )}

            {/* Group By Filter (Specific to OUTSTANDING CLAIMS) */}
            {activeTab === 4 && (
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Group By:
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={groupByOption}
                      onChange={(e) => setGroupByOption(e.target.value)}
                      sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      {GROUP_BY_OPTIONS.map((g) => (
                        <MenuItem key={g.value} value={g.value} sx={{ fontSize: '0.85rem' }}>
                          {g.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            )}

            {/* Action alignment & Refresh link */}
            <Grid item xs={12} sm={(activeTab === 4 || activeTab === 5) ? 12 : activeTab === 3 ? 8 : 12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Button
                onClick={handleRefresh}
                startIcon={<RefreshIcon sx={{ fontSize: '0.9rem' }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1a3a6b',
                  padding: 0,
                  minWidth: 'auto',
                  '&:hover': { background: 'none', textDecoration: 'underline' },
                }}
              >
                Refresh
              </Button>
            </Grid>

            {/* Row 2 Text Searches */}
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                  Search by patient:
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by patient"
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      fontSize: '0.85rem',
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                  {activeTab === 5 ? 'Search by claim number or sent date:' : 'Search by claim number or sent date:'}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={activeTab === 5 ? 'Search by claim # or sent date' : 'Search by claim # or sent date'}
                  value={searchClaimOrDate}
                  onChange={(e) => setSearchClaimOrDate(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff',
                      fontSize: '0.85rem',
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Checkboxes */}
            <Grid item xs={12} sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {activeTab === 4 ? (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={showNonAssignment}
                        onChange={(e) => setShowNonAssignment(e.target.checked)}
                        sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>
                        Show Non-Assignment Claims
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={showInactivePolicies}
                        onChange={(e) => setShowInactivePolicies(e.target.checked)}
                        sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>
                        Show Claims for Inactive Policies
                      </Typography>
                    }
                  />
                </>
              ) : activeTab === 5 ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={showInactivePolicies}
                      onChange={(e) => setShowInactivePolicies(e.target.checked)}
                      sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>
                      Show Predeterminations for Inactive Policies
                    </Typography>
                  }
                />
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={showHidden}
                      onChange={(e) => setShowHidden(e.target.checked)}
                      sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>
                      Show Hidden Claims
                    </Typography>
                  }
                />
              )}
              {activeTab === 5 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={showHidden}
                      onChange={(e) => setShowHidden(e.target.checked)}
                      sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>
                      Show Hidden Claims
                    </Typography>
                  }
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Main Alert Warning & Actions Block */}
      {activeTab !== 6 && activeTab !== 7 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          {/* Count/Status alignment left */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {activeTab === 0 && validationErrorCount > 0 && (
              <Typography sx={{ color: '#d93838', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WarningIcon sx={{ fontSize: 16 }} />
                {validationErrorCount} claim/s have an alert. Please fix the validation errors before sending claims.
              </Typography>
            )}
            <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 700 }}>
              ({activeTab === 4 ? 61 : activeTab === 3 ? 347 : activeTab === 5 ? 8 : filteredClaims.length} claim/s)
            </Typography>
          </Box>

          {/* Buttons and Clearing House message expand link right */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
            {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) && (
              <Button
                onClick={() => setExpandAllMessages(!expandAllMessages)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1a3a6b',
                  padding: 0,
                  mb: -0.5,
                  '&:hover': { background: 'none', textDecoration: 'underline' },
                }}
              >
                {expandAllMessages ? 'Collapse all Clearing House Message' : 'Expand all Clearing House Message'}
              </Button>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {activeTab === 0 ? (
                // UNSENT CLAIMS Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleConvertType}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Convert Type
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleSendClaims}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Send Claims
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handlePrintClaims}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Print Claims
                  </Button>
                </>
              ) : activeTab === 1 ? (
                // ERRORED Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                </>
              ) : activeTab === 2 ? (
                // REJECTED Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePrintPage}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                    }}
                  >
                    Print Page
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleExportCSV}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e2d3c2',
                      color: '#4e3e31',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d4c5b4' },
                    }}
                  >
                    Export as CSV
                  </Button>
                </>
              ) : activeTab === 3 ? (
                // HISTORY Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                </>
              ) : activeTab === 4 ? (
                // OUTSTANDING CLAIMS Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePrintPage}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#1a3a6b',
                      color: '#ffffff',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#132c54' },
                    }}
                  >
                    Print Page
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handlePrintClaims}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Print Claims
                  </Button>
                </>
              ) : (
                // PREDETERMINATION Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleConvertType}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Convert Type
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleSendPredeterminations}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Send Predeterminations
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handlePrintPredeterminations}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Print Predeterminations
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Content Area */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12, flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#1a3a6b' }} />
          <Typography sx={{ color: '#4a5568', fontSize: '0.9rem', fontWeight: 500 }}>Loading data...</Typography>
        </Box>
      ) : activeTab === 6 ? (
        // DENTICAL REPORTS Table Layout
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>File Name</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Report Date</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Date Created
                    <Tooltip title="Date the Dentical report was received and imported into Medflow.">
                      <InfoIcon sx={{ fontSize: 14, color: '#a0aec0', cursor: 'pointer' }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDenticalReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No reports found matching the selection criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDenticalReports.map((report) => (
                  <TableRow
                    key={report.id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {/* File Name with PDF Icon */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PdfIcon sx={{ color: '#e53e3e', fontSize: 20 }} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => alert(`Opening PDF file: ${report.fileName}`)}>
                          {report.fileName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Report Date */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                        {report.reportDate}
                      </Typography>
                    </TableCell>

                    {/* Date Created */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                        {report.dateCreated}
                      </Typography>
                    </TableCell>

                    {/* Report Specific Actions */}
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Report PDF">
                          <IconButton size="small" onClick={() => alert(`Opening PDF file: ${report.fileName}`)} sx={{ color: '#7d9cc4' }}>
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Report">
                          <IconButton size="small" onClick={() => alert('Sending document to printer...')} sx={{ color: '#7d9cc4' }}>
                            <PrintIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download PDF File">
                          <IconButton size="small" onClick={() => alert(`Downloading ${report.fileName}`)} sx={{ color: '#7d9cc4' }}>
                            <DownloadIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : activeTab === 7 ? (
        // ERA REPORTS Table Layout (1:1 with Screenshot)
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PATIENT ID</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PATIENT NAME</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>CLAIM #</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>CARRIER</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>STATUS</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>AMOUNT SUBMITTED</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>AMOUNT PAID</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PATIENT RESPONSIBILITY</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>WRITE OFF</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>DATE RECEIVED</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PAYMENT TYPE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEraReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No ERA reports found matching the selection criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEraReports.map((era) => {
                  const isVoided = era.status === 'Voided';
                  const isDenial = era.status === 'Denial';
                  return (
                    <TableRow
                      key={era.id}
                      hover
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {/* Patient ID */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 500 }}>
                          {era.patientId}
                        </Typography>
                      </TableCell>

                      {/* Patient Name */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a3a6b' }}>
                          {era.patientName}
                        </Typography>
                      </TableCell>

                      {/* Claim # */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>
                          {era.claimNumber}
                        </Typography>
                      </TableCell>

                      {/* Carrier */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                          {era.carrier}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: isVoided ? '#e53e3e' : isDenial ? '#dd6b20' : '#319795',
                          }}
                        >
                          {era.status}
                        </Typography>
                      </TableCell>

                      {/* Amount Submitted */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>
                          ${era.amountSubmitted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Amount Paid */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 700 }}>
                          ${era.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Patient Responsibility */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                          ${era.patientResponsibility.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Write Off */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#718096' }}>
                          ${era.writeOff.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Date Received */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                          {era.dateReceived}
                        </Typography>
                      </TableCell>

                      {/* Payment Type */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 500 }}>
                          {era.paymentType}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // STANDARD CLAIMS Data Table
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#fafbfe', '& .MuiTableCell-root': { py: 0.8, px: 0.5, fontSize: '0.73rem', lineHeight: 1.2 } }}>
              <TableRow>
                <TableCell sx={{ width: '40px', py: 0.8, px: 0.5, textAlign: 'center', verticalAlign: 'top' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                    <Checkbox
                      size="small"
                      checked={filteredClaims.length > 0 && filteredClaims.every((c) => selectedClaims[c.id])}
                      indeterminate={
                        filteredClaims.some((c) => selectedClaims[c.id]) &&
                        !filteredClaims.every((c) => selectedClaims[c.id])
                      }
                      onChange={handleSelectAll}
                      sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleSelectAllMenuOpen}
                      sx={{ p: 0.2, color: '#4a5568', mt: 0.2 }}
                    >
                      <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  <Menu
                    anchorEl={selectAllAnchorEl}
                    open={isSelectAllMenuOpen}
                    onClose={handleSelectAllMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                        border: '1px solid #e2e8f0',
                      }
                    }}
                  >
                    <MenuItem onClick={() => handleSelectSubset('all')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Select All
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectSubset('ready')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Select All Ready
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectSubset('errored')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Select All with Alerts/Errors
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectSubset('none')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Clear Selection
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Patient Name</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                  {activeTab === 4 ? 'Claim # (created date)' : 'Claim #'}
                </TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Claim Type</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                  {activeTab === 0 ? 'Created Date' : 'Sent on'}
                </TableCell>
                {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Printed on
                  </TableCell>
                )}
                {activeTab === 4 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Subscriber
                  </TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Carrier</TableCell>
                {activeTab === 4 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Plan Name (#)
                  </TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Procedures</TableCell>
                {activeTab === 5 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Treating Provider</TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Status</TableCell>
                {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    ERA Status
                  </TableCell>
                )}
                {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Clearing House Status Message
                  </TableCell>
                )}
                {activeTab === 4 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Submitted Value
                  </TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Notes</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Description</TableCell>
                <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ '& .MuiTableCell-root': { py: 0.5, px: 0.4, fontSize: '0.73rem', lineHeight: 1.2 } }}>
              {filteredClaims.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === 4 ? 17 : activeTab === 5 ? 13 : activeTab === 2 || activeTab === 3 ? 14 : activeTab === 1 ? 12 : 11}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                        No claims found matching the selection criteria.
                      </Typography>
                      {activeTab === 2 && (
                        <Button
                          onClick={handleLoadMoreClaims}
                          startIcon={<SyncIcon sx={{ fontSize: '0.9rem' }} />}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#1a3a6b',
                            borderBottom: '1px dashed #1a3a6b',
                            borderRadius: 0,
                            padding: '2px 4px',
                            minWidth: 'auto',
                            '&:hover': { background: 'none', opacity: 0.8 },
                          }}
                        >
                          Load More Claims
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClaims.map((claim) => {
                  const isSelected = !!selectedClaims[claim.id];
                  const isExpanded = !!expandedProcedures[claim.id];
                  const isError = claim.status === 'denied' || claim.status === 'rejected' || claim.status === 'error' || claim.status === 'validationError';

                  // Determine attachment color badge background/icon styling
                  const hasAttachments = claim.attachments && claim.attachments.length > 0;
                  const errorStatuses = ['denied', 'rejected', 'validationError', 'error'];

                  let attachBg = '#e2e8f0'; // Light slate blue default
                  let attachColor = '#5b72a9';
                  let attachBorder = '1px solid #94a3b8';
                  let attachTooltip = 'Manage Attachments';
                  let attachHoverBg = '#cbd5e1';

                  if (!hasAttachments) {
                    if (errorStatuses.includes(claim.status)) {
                      attachBg = '#fecdd3'; // Red
                      attachColor = '#e11d48';
                      attachBorder = '1px solid #f43f5e';
                      attachTooltip = 'Error';
                      attachHoverBg = '#fda4af';
                    } else {
                      attachBg = '#fef08a'; // Yellow
                      attachColor = '#a16207';
                      attachBorder = '1px solid #eab308';
                      attachTooltip = 'Attachments Not Sent';
                      attachHoverBg = '#fde047';
                    }
                  } else {
                    attachBg = '#dbeafe'; // Blue (Correct)
                    attachColor = '#3b82f6';
                    attachBorder = '1px solid #93c5fd';
                    attachHoverBg = '#bfdbfe';
                  }

                  return (
                    <React.Fragment key={claim.id}>
                      <TableRow
                        hover
                        sx={{
                          backgroundColor: isSelected ? 'rgba(26, 58, 107, 0.03)' : 'transparent',
                          '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.05) !important' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {/* Checkbox column */}
                        <TableCell sx={{ py: 1, verticalAlign: 'top', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                            <Checkbox
                              size="small"
                              checked={isSelected}
                              onChange={() => handleSelectClaim(claim.id)}
                              sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => toggleProcedures(claim.id)}
                              sx={{ p: 0.2, color: '#4a5568', mt: 0.2 }}
                            >
                              {isExpanded ? (
                                <ArrowDropDownIcon sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                              ) : (
                                <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>

                        {/* Patient Name (+ Code & DOB) */}
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: isError && activeTab === 0 ? '#d93838' : '#2d3748', fontSize: '0.74rem' }}>
                            {claim.patientName}
                          </Typography>
                          <Typography sx={{ color: '#718096', fontWeight: 400, fontSize: '0.68rem' }}>
                            {claim.patientCode}
                          </Typography>
                          {(activeTab === 4 || activeTab === 5) && claim.patientDob && (
                            <Typography sx={{ color: '#718096', mt: 0.2, fontSize: '0.68rem' }}>
                              {claim.patientDob}
                            </Typography>
                          )}
                        </TableCell>

                        {/* Claim # (+ Created Date) */}
                        <TableCell>
                          <Typography 
                            onClick={(e) => {
                              e.stopPropagation();
                              const getSafeId = (field) => (field && typeof field === 'object' ? (field._id || field.id) : field);
                              const targetInvoiceId = getSafeId(claim.invoiceId) || getSafeId(claim.invoice);
                              const targetPatientId = getSafeId(claim.patientId) || getSafeId(claim.patient);
                              if (targetInvoiceId && targetPatientId) {
                                navigate('/finance', { state: { invoiceId: targetInvoiceId, patientId: targetPatientId } });
                              } else {
                                alert('Missing invoice or patient information for this claim.');
                              }
                            }}
                            sx={{ 
                              fontWeight: 600, 
                              color: '#1976d2', 
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: '#115293',
                              }
                            }}
                          >
                            {claim.claimNumber}
                          </Typography>
                          {activeTab === 4 && claim.createdDate && (
                            <Typography sx={{ color: '#718096', fontStyle: 'normal', fontSize: '0.68rem' }}>
                              ({claim.createdDate})
                            </Typography>
                          )}
                        </TableCell>

                        {/* Claim Type */}
                        <TableCell>
                          <Typography sx={{ color: isError && activeTab === 0 ? '#d93838' : '#718096', display: 'flex', flexDirection: 'column', fontSize: '0.7rem' }}>
                            <span style={{ fontWeight: 600 }}>{claim.claimType.split(' ')[0]}</span>
                            <span>{claim.claimType.split(' ').slice(1).join(' ')}</span>
                          </Typography>
                        </TableCell>

                        {/* Created Date / Sent Date */}
                        <TableCell>
                          <Typography sx={{ color: isError && activeTab === 0 ? '#d93838' : '#4a5568' }}>
                            {activeTab === 0 ? claim.createdDate : claim.sentDate}
                          </Typography>
                        </TableCell>

                        {/* Printed on Date */}
                        {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568' }}>
                              {claim.printedDate || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Subscriber */}
                        {activeTab === 4 && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>
                              {claim.subscriber || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Carrier */}
                        <TableCell>
                          <Typography sx={{ color: isError && activeTab === 0 ? '#d93838' : '#4a5568', fontWeight: 500, fontSize: '0.72rem' }}>
                            {claim.carrier}
                          </Typography>
                        </TableCell>

                        {/* Plan Name (#) */}
                        {activeTab === 4 && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568', fontStyle: 'normal', fontSize: '0.7rem' }}>
                              {claim.planName || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Procedures */}
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => toggleProcedures(claim.id)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#1a3a6b',
                              padding: '1px 6px',
                              minWidth: 'auto',
                              '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.08)' },
                            }}
                          >
                            {isExpanded ? 'Hide' : 'v Show'}
                          </Button>
                        </TableCell>

                        {/* Treating Provider */}
                        {activeTab === 5 && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>
                              {claim.treatingProvider || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Status Dropdown */}
                        <TableCell>
                          {activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5 ? (
                            // Interactive Dropdown
                            <FormControl size="small" variant="standard" sx={{ m: 0, minWidth: 75 }}>
                              <Select
                                value={claim.status}
                                onChange={(e) => handleRowStatusChange(claim.id, e.target.value)}
                                disableUnderline
                                sx={{
                                  fontSize: '0.72rem',
                                  fontWeight: 500,
                                  color: claim.status === 'denied' || claim.status === 'rejected' ? '#d93838' : '#2d3748',
                                  '& .MuiSelect-select': { py: 0.5, pr: 2 },
                                }}
                              >
                                <MenuItem value="draft" sx={{ fontSize: '0.7rem' }}>Draft</MenuItem>
                                <MenuItem value="submitted" sx={{ fontSize: '0.7rem' }}>Submitted</MenuItem>
                                <MenuItem value="pending" sx={{ fontSize: '0.7rem' }}>Pending</MenuItem>
                                <MenuItem value="accepted" sx={{ fontSize: '0.7rem' }}>Accepted</MenuItem>
                                <MenuItem value="paid" sx={{ fontSize: '0.7rem' }}>Paid</MenuItem>
                                <MenuItem value="partial" sx={{ fontSize: '0.7rem' }}>Partial</MenuItem>
                                <MenuItem value="denied" sx={{ fontSize: '0.7rem', color: '#d93838' }}>Denied</MenuItem>
                                <MenuItem value="rejected" sx={{ fontSize: '0.7rem', color: '#d93838' }}>Rejected</MenuItem>
                                <MenuItem value="cancelled" sx={{ fontSize: '0.7rem' }}>Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            // Standard Status in UNSENT tab
                            isError ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography sx={{ fontWeight: 600, color: '#d93838', fontSize: '0.72rem' }}>
                                  {claim.status}
                                </Typography>
                                <Tooltip title="Click to Revalidate / Resolve errors">
                                  <IconButton size="small" onClick={() => handleRevalidate(claim.id)} sx={{ p: 0.2, color: '#1a3a6b' }}>
                                    <SyncIcon sx={{ fontSize: 12 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Typography sx={{ fontWeight: 500, color: '#2d3748', fontSize: '0.72rem' }}>
                                {claim.status}
                              </Typography>
                            )
                          )}
                        </TableCell>

                        {/* ERA Status */}
                        {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                          <TableCell>
                            <Typography sx={{ color: claim.eraStatus ? '#d93838' : '#718096', fontWeight: 600, fontSize: '0.72rem' }}>
                              {claim.eraStatus || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Clearing House Status Message */}
                        {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) && (
                          <TableCell sx={{ maxWidth: '120px', verticalAlign: 'top' }}>
                            <Typography
                              noWrap={!isExpanded && !expandAllMessages}
                              sx={{
                                color: '#2d3748',
                                fontWeight: 500,
                                whiteSpace: (isExpanded || expandAllMessages) ? 'normal' : 'nowrap',
                                wordBreak: 'break-word',
                              }}
                            >
                              {claim.clearingHouseMessage || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Submitted Value */}
                        {activeTab === 4 && (
                          <TableCell sx={{ verticalAlign: 'top' }}>
                            <Typography sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                              ${(claim.submittedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Notes icon */}
                        <TableCell sx={{ verticalAlign: 'top' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleNoteOpen(e, claim.notes)}
                            sx={{ color: '#a0aec0', '&:hover': { color: '#1a3a6b' }, p: 0.2 }}
                          >
                            <DescriptionIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </TableCell>

                        {/* Description */}
                        <TableCell sx={{ maxWidth: isExpanded ? '400px' : '110px', verticalAlign: 'top' }}>
                          {isExpanded ? (
                            (() => {
                              let shortDesc = claim.description || '';
                              let longDesc = '';
                              if (claim.description.includes(' CC ')) {
                                const idx = claim.description.indexOf(' CC ');
                                shortDesc = claim.description.substring(0, idx);
                                longDesc = claim.description.substring(idx + 1);
                              } else if (claim.description.includes(' (KS6 ')) {
                                const idx = claim.description.indexOf(' (KS6 ');
                                shortDesc = claim.description.substring(0, idx);
                                longDesc = claim.description.substring(idx + 1);
                              }

                              return (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
                                  <Typography
                                    sx={{
                                      color: '#4a5568',
                                      fontStyle: 'italic',
                                      fontSize: '0.72rem',
                                    }}
                                  >
                                    {shortDesc}
                                  </Typography>
                                  {longDesc && (
                                    <Typography
                                      sx={{
                                        color: '#2d3748',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        lineHeight: 1.3,
                                        backgroundColor: '#f8fafc',
                                        p: 1,
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        fontSize: '0.72rem',
                                      }}
                                    >
                                      {longDesc}
                                    </Typography>
                                  )}
                                </Box>
                              );
                            })()
                          ) : (
                            <Tooltip title={claim.description || ''} arrow disableInteractive>
                              <Typography
                                noWrap
                                sx={{
                                  color: '#4a5568',
                                  fontStyle: 'italic',
                                  cursor: 'pointer',
                                }}
                              >
                                {(() => {
                                  if (claim.description.includes(' CC ')) {
                                    return claim.description.split(' CC ')[0];
                                  } else if (claim.description.includes(' (KS6 ')) {
                                    return claim.description.split(' (KS6 ')[0];
                                  }
                                  return claim.description || '—';
                                })()}
                              </Typography>
                            </Tooltip>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.2 }}>
                            {activeTab === 5 ? (
                              <>
                                <Tooltip title="Edit Predetermination">
                                  <IconButton size="small" onClick={() => handleOpenEdit(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                    <EditIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={attachTooltip}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenAttach(claim)}
                                    sx={{
                                      bgcolor: attachBg,
                                      color: attachColor,
                                      border: attachBorder,
                                      borderRadius: '4px',
                                      p: '2px',
                                      width: 24,
                                      height: 24,
                                      mx: 0.5,
                                      transition: 'all 0.2s',
                                      '&:hover': {
                                        bgcolor: attachHoverBg,
                                      }
                                    }}
                                  >
                                    <AttachFileIcon sx={{ fontSize: 16, transform: 'rotate(-45deg)' }} />
                                  </IconButton>
                                </Tooltip>
                                {claim.showEye ? (
                                  <Tooltip title="Preview ADA Form">
                                    <IconButton size="small" onClick={() => handleOpenPreview(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                      <VisibilityIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Delete Predetermination">
                                    <IconButton size="small" onClick={() => handleDeletePredetermination(claim.id)} sx={{ color: '#e53e3e', p: 0.2 }}>
                                      <DeleteIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            ) : (
                              <>
                                <Tooltip title="Edit Claim">
                                  <IconButton size="small" onClick={() => handleOpenEdit(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                    <EditIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={attachTooltip}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenAttach(claim)}
                                    sx={{
                                      bgcolor: attachBg,
                                      color: attachColor,
                                      border: attachBorder,
                                      borderRadius: '4px',
                                      p: '2px',
                                      width: 24,
                                      height: 24,
                                      mx: 0.5,
                                      transition: 'all 0.2s',
                                      '&:hover': {
                                        bgcolor: attachHoverBg,
                                      }
                                    }}
                                  >
                                    <AttachFileIcon sx={{ fontSize: 16, transform: 'rotate(-45deg)' }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Preview Claim Form">
                                  <IconButton size="small" onClick={() => handleOpenPreview(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                    <VisibilityIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Procedure list detail */}
                      <TableRow>
                        <TableCell
                          colSpan={activeTab === 4 ? 17 : activeTab === 5 ? 13 : activeTab === 2 || activeTab === 3 ? 14 : activeTab === 1 ? 12 : 11}
                          sx={{ p: 0, border: 'none' }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2.5, backgroundColor: '#fcfdfd', borderLeft: '3px solid #1a3a6b', borderBottom: '1px solid #e0e6ed' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b', mb: 1 }}>
                                Linked Procedures:
                              </Typography>
                              <Table size="small" sx={{ maxWidth: '600px', mb: 1 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}>Code</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}>Description</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}>Fee</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {claim.procedures.map((proc, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>{proc.code}</TableCell>
                                      <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>{proc.name}</TableCell>
                                      <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.5 }}>${proc.fee.toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.01)' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.5 }}>Total Charge:</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.5 }}>
                                      ${claim.procedures.reduce((acc, curr) => acc + curr.fee, 0).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination / Load More footer */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        {activeTab === 7 ? (
          <Button
            onClick={handleLoadMoreEraReports}
            startIcon={<RefreshIcon sx={{ fontSize: '0.9rem' }} />}
            sx={{
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#1a3a6b',
              borderBottom: '1px dashed #1a3a6b',
              borderRadius: 0,
              padding: '2px 4px',
              minWidth: 'auto',
              '&:hover': { background: 'none', opacity: 0.8 },
            }}
          >
            Load More Claims
          </Button>
        ) : (
          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500 }}>
            No more results to load
          </Typography>
        )}
      </Box>

      {/* Notes Popover */}
      <Popover
        open={Boolean(notePopover.anchorEl)}
        anchorEl={notePopover.anchorEl}
        onClose={handleNoteClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { p: 2, maxWidth: 300, borderRadius: '6px', mt: 0.5, boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b', mb: 0.5 }}>
          Claim Note
        </Typography>
        <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.5 }}>
          {notePopover.text}
        </Typography>
      </Popover>

      {/* Edit Claim Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a3a6b', borderBottom: '1px solid #e0e6ed', pb: 2 }}>
          Edit Claim {editingClaim?.claimNumber}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editingClaim && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Patient Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  disabled
                  value={editingClaim.patientName}
                  sx={{ backgroundColor: '#f7fafc' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Claim Type
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  disabled
                  value={editingClaim.claimType}
                  sx={{ backgroundColor: '#f7fafc' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Carrier
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  disabled
                  value={editingClaim.carrier}
                  sx={{ backgroundColor: '#f7fafc' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Status
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={editingClaim.status}
                    onChange={(e) => setEditingClaim({ ...editingClaim, status: e.target.value })}
                  >
                    <MenuItem value="readyForSubmission">readyForSubmission</MenuItem>
                    <MenuItem value="inProcess">inProcess</MenuItem>
                    <MenuItem value="accepted">accepted</MenuItem>
                    <MenuItem value="acceptedPaid">acceptedPaid</MenuItem>
                    <MenuItem value="error">error</MenuItem>
                    <MenuItem value="rejected">rejected</MenuItem>
                    <MenuItem value="eobUploaded">eobUploaded</MenuItem>
                    <MenuItem value="validationError">validationError</MenuItem>
                    <MenuItem value="manualClaim">manualClaim</MenuItem>
                    <MenuItem value="acceptedForProcessing">acceptedForProcessing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {activeTab === 4 && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Subscriber Name
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingClaim.subscriber || ''}
                      onChange={(e) => setEditingClaim({ ...editingClaim, subscriber: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Plan Name (#)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingClaim.planName || ''}
                      onChange={(e) => setEditingClaim({ ...editingClaim, planName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                      Submitted Value ($)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      error={!!editFormErrors.submittedAmount}
                      helperText={editFormErrors.submittedAmount}
                      value={editingClaim.submittedValue || 0}
                      onChange={(e) => setEditingClaim({ ...editingClaim, submittedValue: parseFloat(e.target.value) || 0 })}
                    />
                  </Grid>
                </>
              )}
              {activeTab === 5 && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                    Treating Provider
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={editingClaim.treatingProvider || ''}
                    onChange={(e) => setEditingClaim({ ...editingClaim, treatingProvider: e.target.value })}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Clearing House Status Message
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editingClaim.clearingHouseMessage || ''}
                  onChange={(e) => setEditingClaim({ ...editingClaim, clearingHouseMessage: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Description / Remarks
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editingClaim.description}
                  onChange={(e) => setEditingClaim({ ...editingClaim, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>
                  Internal Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  error={!!editFormErrors.notes}
                  helperText={editFormErrors.notes}
                  value={editingClaim.notes}
                  onChange={(e) => {
                    setEditingClaim({ ...editingClaim, notes: e.target.value });
                    if (editFormErrors.notes) setEditFormErrors(prev => ({ ...prev, notes: null }));
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e0e6ed' }}>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ textTransform: 'none', color: '#718096' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: '#1a3a6b' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attachments Management Dialog */}
      <ClaimAttachmentsDialog
        open={openAttachDialog}
        attachingClaim={attachingClaim}
        onClose={() => setOpenAttachDialog(false)}
        onSave={handleSaveAttach}
      />

      {/* Claim Form Preview Dialog */}
      <ClaimPrintPreviewDialog 
        open={openPreviewDialog} 
        claim={previewingClaim} 
        onClose={() => setOpenPreviewDialog(false)} 
      />

      {/* Success Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%', borderRadius: '8px', boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClaimsListPage;
