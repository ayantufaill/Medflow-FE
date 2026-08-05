import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';
import { claimService } from '../../services/claim.service';
import BatchTabs from '../../components/claims/batch-actions/BatchTabs';
import BatchPaymentsTab from '../../components/claims/batch-actions/BatchPaymentsTab';
import BatchInvoicesTab from '../../components/claims/batch-actions/BatchInvoicesTab';
import BatchClaimsTab from '../../components/claims/batch-actions/BatchClaimsTab';
import { COLORS } from '../../constants/colors';
import { radius, headingPrimarySx, headingSecondarySx, fontSize, fontWeight } from '../../constants/styles';
import { ReportFilterBar } from '../../components/reports/ui';
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
  FormControl,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  Link,
  Collapse,
  Checkbox,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as DollarIcon,
  AssignmentOutlined as TxIcon,
  ChatBubbleOutline as ChatIcon,
  Description as NoteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

// ---------------------- TAB 1: BATCH PAYMENTS DATA ----------------------
const INITIAL_BATCH_PAYMENTS = [
  {
    id: 'bp-1',
    paymentRef: '19d017ffced7OAxUSHBLpvO9z',
    date: '03/18/2026',
    status: 'COMPLETED',
    carrier: 'Delta Dental Ins. Co. - Georgia',
    patientsText: 'Sam Dastoor',
    totalPayments: 43.60,
    claims: [
      { claimNumber: '#25410', patient: 'Sam Dastoor', patientId: 'PT-0810', submitted: 60.00, paid: 43.60, writeOff: 16.40, status: 'Paid' }
    ],
    eobs: [
      { id: 'eob-1', filename: 'EOB_DeltaDental_SamDastoor.pdf', uploadDate: '03/18/2026', size: '124 KB' }
    ]
  },
  {
    id: 'bp-2',
    paymentRef: '19d015f909cFFk0H7PnnYhst',
    date: '03/18/2026',
    status: 'COMPLETED',
    carrier: 'MetLife',
    patientsText: 'Parker Desfosses',
    totalPayments: 120.00,
    claims: [
      { claimNumber: '#25411', patient: 'Parker Desfosses', patientId: 'PT-0192', submitted: 150.00, paid: 120.00, writeOff: 30.00, status: 'Paid' }
    ],
    eobs: [
      { id: 'eob-2', filename: 'EOB_MetLife_ParkerD.pdf', uploadDate: '03/18/2026', size: '185 KB' }
    ]
  },
  {
    id: 'bp-3',
    paymentRef: '19d015ed06fNgUw8loD0aWXY0',
    date: '03/18/2026',
    status: 'FAILED',
    carrier: 'MetLife',
    patientsText: 'Parker Desfosses',
    totalPayments: 120.00,
    claims: [
      { claimNumber: '#25412', patient: 'Parker Desfosses', patientId: 'PT-0192', submitted: 150.00, paid: 0.00, writeOff: 0.00, status: 'Failed' }
    ],
    eobs: []
  },
  {
    id: 'bp-4',
    paymentRef: '19d01519c4b5Od9tWZ9IKP1yX',
    date: '03/18/2026',
    status: 'COMPLETED',
    carrier: 'Blue Cross Blue Shield of Texas',
    patientsText: '2 Patients',
    totalPayments: 308.00,
    claims: [
      { claimNumber: '#25413', patient: 'Alice Smith', patientId: 'PT-0081', submitted: 200.00, paid: 158.00, writeOff: 42.00, status: 'Paid' },
      { claimNumber: '#25414', patient: 'Bob Jones', patientId: 'PT-0082', submitted: 180.00, paid: 150.00, writeOff: 30.00, status: 'Paid' }
    ],
    eobs: [
      { id: 'eob-4', filename: 'EOB_BCBS_Texas_Batch.pdf', uploadDate: '03/18/2026', size: '298 KB' }
    ]
  },
  {
    id: 'bp-5',
    paymentRef: '19a93736f78QHfqtSGczs8UQd',
    date: '11/17/2025',
    status: 'COMPLETED',
    carrier: 'Renaissance Life and Health',
    patientsText: 'Kara Williams',
    totalPayments: 840.20,
    claims: [
      { claimNumber: '#25415', patient: 'Kara Williams', patientId: 'PT-0481', submitted: 1000.00, paid: 840.20, writeOff: 159.80, status: 'Paid' }
    ],
    eobs: [
      { id: 'eob-5', filename: 'EOB_Renaissance_Kara.pdf', uploadDate: '11/17/2025', size: '145 KB' }
    ]
  },
  {
    id: 'bp-6',
    paymentRef: '19a115da30dyMxbEErVnALr2l',
    date: '10/23/2025',
    status: 'COMPLETED',
    carrier: '2 Payers',
    patientsText: '8 Patients',
    totalPayments: 2066.06,
    claims: [
      { claimNumber: '#25301', patient: 'Emma Watson', patientId: 'PT-0312', submitted: 400.00, paid: 320.00, writeOff: 80.00, status: 'Paid' },
      { claimNumber: '#25302', patient: 'Danielle Cole', patientId: 'PT-0881', submitted: 350.00, paid: 280.00, writeOff: 70.00, status: 'Paid' },
      { claimNumber: '#25303', patient: 'Babar Magsi', patientId: 'PT-0072', submitted: 80.00, paid: 56.80, writeOff: 23.20, status: 'Paid' },
      { claimNumber: '#25304', patient: 'John Cena', patientId: 'PT-0044', submitted: 500.00, paid: 400.00, writeOff: 100.00, status: 'Paid' },
      { claimNumber: '#25305', patient: 'Sarah Connor', patientId: 'PT-0294', submitted: 600.00, paid: 480.00, writeOff: 120.00, status: 'Paid' },
      { claimNumber: '#25306', patient: 'Peter Parker', patientId: 'PT-0899', submitted: 150.00, paid: 120.00, writeOff: 30.00, status: 'Paid' },
      { claimNumber: '#25307', patient: 'Bruce Banner', patientId: 'PT-0922', submitted: 300.00, paid: 240.00, writeOff: 60.00, status: 'Paid' },
      { claimNumber: '#25308', patient: 'Tony Stark', patientId: 'PT-0511', submitted: 210.00, paid: 169.26, writeOff: 40.74, status: 'Paid' }
    ],
    eobs: [
      { id: 'eob-6', filename: 'EOB_MultiPayer_Oct23.pdf', uploadDate: '10/23/2025', size: '412 KB' }
    ]
  },
  {
    id: 'bp-7',
    paymentRef: '199deefc96068w178NC1VkxB4',
    date: '10/13/2025',
    status: 'COMPLETED',
    carrier: 'CIGNA',
    patientsText: 'Rodney Obaldo',
    totalPayments: 314.00,
    claims: [
      { claimNumber: '#25416', patient: 'Rodney Obaldo', patientId: 'PT-0922', submitted: 400.00, paid: 314.00, writeOff: 86.00, status: 'Paid' }
    ],
    eobs: []
  },
  {
    id: 'bp-8',
    paymentRef: '199a0a29270Gzn3Zkfv4W8TYW',
    date: '10/01/2025',
    status: 'COMPLETED',
    carrier: '3 Payers',
    patientsText: '5 Patients',
    totalPayments: 2751.20,
    claims: [
      { claimNumber: '#25211', patient: 'Diana Prince', patientId: 'PT-0401', submitted: 950.00, paid: 760.00, writeOff: 190.00, status: 'Paid' },
      { claimNumber: '#25212', patient: 'Bruce Wayne', patientId: 'PT-0707', submitted: 1200.00, paid: 960.00, writeOff: 240.00, status: 'Paid' },
      { claimNumber: '#25213', patient: 'Clark Kent', patientId: 'PT-0909', submitted: 600.00, paid: 480.00, writeOff: 120.00, status: 'Paid' },
      { claimNumber: '#25214', patient: 'Barry Allen', patientId: 'PT-0210', submitted: 450.00, paid: 360.00, writeOff: 90.00, status: 'Paid' },
      { claimNumber: '#25215', patient: 'Hal Jordan', patientId: 'PT-0552', submitted: 240.00, paid: 191.20, writeOff: 48.80, status: 'Paid' }
    ],
    eobs: [
      { id: 'eob-8', filename: 'EOB_MultiPayer_Oct1.pdf', uploadDate: '10/01/2025', size: '380 KB' }
    ]
  }
];

// ---------------------- TAB 2: BATCH INVOICES DATA ----------------------
const INITIAL_BATCH_INVOICES_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Leticia Carter',
    procedures: [
      { dos: '05/07/2026', code: 'D0140', description: 'limited ex', provider: 'Christian Sabour', hasNote: true, fee: 85.00 },
      { dos: '05/07/2026', code: 'D0220', description: 'PA1', provider: 'Christian Sabour', hasNote: false, fee: 35.00 }
    ]
  },
  {
    id: 'pat-2',
    name: 'Abdul Abayad',
    procedures: [
      { dos: '05/12/2026', code: 'D0120', description: 'periodic ex', provider: 'Christian Sabour', hasNote: true, fee: 55.00 },
      { dos: '05/12/2026', code: 'D1110', description: 'hygiene', provider: 'Christian Sabour', hasNote: false, fee: 95.00 },
      { dos: '05/12/2026', code: 'D1206', description: 'fl', provider: 'Christian Sabour', hasNote: false, fee: 30.00 }
    ]
  },
  {
    id: 'pat-3',
    name: 'William Waller',
    procedures: [
      { dos: '05/19/2026', code: 'D0171', description: 'post-op', provider: 'Christian Sabour', hasNote: true, fee: 0.00 }
    ]
  },
  {
    id: 'pat-4',
    name: 'Russell Rudolf',
    procedures: [
      { dos: '05/20/2026', code: 'D8670', description: 'ortho', provider: 'Christian Sabour', hasNote: false, fee: 180.00 }
    ]
  },
  {
    id: 'pat-5',
    name: 'Sarah Jenkins',
    procedures: [
      { dos: '05/20/2026', code: 'D2740', description: 'porc Cr', provider: 'Christian Sabour', hasNote: true, fee: 1150.00 }
    ]
  },
  {
    id: 'pat-6',
    name: 'Emily Rose',
    procedures: [
      { dos: '05/21/2026', code: 'D0150', description: 'comp ex', provider: 'Christian Sabour', hasNote: true, fee: 110.00 },
      { dos: '05/21/2026', code: 'D0210', description: 'FMX', provider: 'Christian Sabour', hasNote: false, fee: 140.00 },
      { dos: '05/21/2026', code: 'D0802', description: '3d scan', provider: 'Christian Sabour', hasNote: false, fee: 250.00 }
    ]
  }
];

// ---------------------- TAB 3: BATCH CLAIMS DATA (1:1 with Screenshot) ----------------------
const INITIAL_BATCH_CLAIMS_LIST = [
  {
    id: 'clm-1',
    patient: 'Leticia Carter',
    invoiceNumber: '#23244 (02/12/2026)',
    claimType: 'Manual & Electronic',
    carrier: 'Membership Payer',
    planName: 'Bright Beginning (Bright Beginning)',
    procedures: [
      { dos: '02/12/2026', tooth: '14', surface: 'O', ptBalance: '$22.50', insBalance: '$62.50', code: 'D0140', description: 'limited ex', provider: 'Christian Sabour', fee: 85.00 },
      { dos: '02/12/2026', tooth: '14', surface: 'B', ptBalance: '$15.00', insBalance: '$20.00', code: 'D0220', description: 'PA1', provider: 'Christian Sabour', fee: 35.00 }
    ]
  },
  {
    id: 'clm-2',
    patient: 'Abdul Abayad',
    invoiceNumber: '#23245 (02/12/2026)',
    claimType: 'Manual & Electronic',
    carrier: 'Membership Payer',
    planName: 'Clean + Confident - Existing Patient (Clean + Confident - Existing Patient)',
    procedures: [
      { dos: '02/12/2026', tooth: '3', surface: 'M', ptBalance: '$18.00', insBalance: '$37.00', code: 'D0120', description: 'periodic ex', provider: 'Christian Sabour', fee: 55.00 },
      { dos: '02/12/2026', tooth: '3', surface: 'O', ptBalance: '$30.00', insBalance: '$65.00', code: 'D1110', description: 'hygiene', provider: 'Christian Sabour', fee: 95.00 },
      { dos: '02/12/2026', tooth: 'A', surface: 'V', ptBalance: '$8.00', insBalance: '$12.00', code: 'D1206', description: 'fl', provider: 'Christian Sabour', fee: 30.00 }
    ]
  }
];

// Outstanding Claims Allocation Mock
const OUTSTANDING_CLAIMS_FOR_ALLOCATION = [
  { claimNumber: '#25402', patient: 'Amanda Waller', patientId: 'PT-0921', carrier: 'CIGNA', submitted: 450.00, openAmount: 360.00 },
  { claimNumber: '#25403', patient: 'Harvey Dent', patientId: 'PT-0115', carrier: 'CIGNA', submitted: 820.00, openAmount: 640.00 },
  { claimNumber: '#25405', patient: 'Barry Allen', patientId: 'PT-0210', carrier: 'MetLife', submitted: 180.00, openAmount: 144.00 },
  { claimNumber: '#25406', patient: 'Hal Jordan', patientId: 'PT-0552', carrier: 'BCBS of Texas', submitted: 350.00, openAmount: 280.00 },
  { claimNumber: '#25408', patient: 'Diana Prince', patientId: 'PT-0401', carrier: 'Delta Dental Ins. Co. - Georgia', submitted: 240.00, openAmount: 192.00 }
];

export default function BatchActionsPage() {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('INSURANCE BATCH PAYMENT');

  // Search & Basic Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterCarrier, setFilterCarrier] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [sortReportBy, setSortReportBy] = useState('Date of Service');

  // Tab 1 States
  const [batchPayments, setBatchPayments] = useState([]);
  const [selectedBatchPayment, setSelectedBatchPayment] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openEOBModal, setOpenEOBModal] = useState(false);
  const [openAddPaymentModal, setOpenAddPaymentModal] = useState(false);
  const [newPaymentRef, setNewPaymentRef] = useState('');
  const [newPaymentCarrier, setNewPaymentCarrier] = useState('CIGNA');
  const [newPaymentDate, setNewPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkAmount, setCheckAmount] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [allocationsSearchQuery, setAllocationsSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Carrier');
  const [activeModalStep, setActiveModalStep] = useState(0);

  // Tab 2 States (Batch Invoices)
  const [invoicePatients, setInvoicePatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState({});
  const [openAddInvoiceModal, setOpenAddInvoiceModal] = useState(false);
  const [newInvoiceDelivery, setNewInvoiceDelivery] = useState('Email & SMS');

  // Tab 3 States (Batch Claims - 1:1 with Screenshot)
  const [claimsList, setClaimsList] = useState([]);
  const [selectedClaims, setSelectedClaims] = useState({});
  const [excludeClosedInvoices, setExcludeClosedInvoices] = useState(true);
  const [filterClaimType, setFilterClaimType] = useState('All');
  const [filterClaimsCarrier, setFilterClaimsCarrier] = useState('All');
  const [expandedProcedures, setExpandedProcedures] = useState({}); // claimId: true/false
  const [claimsSearchQuery, setClaimsSearchQuery] = useState('');

  // Loading and Uploading states
  const [loading, setLoading] = useState(false);
  const [uploadingEob, setUploadingEob] = useState(false);

  // Data Fetching Handlers
  const loadBatchPayments = async () => {
    setLoading(true);
    try {
      const data = await claimService.getBatchPayments({ search: searchQuery });
      setBatchPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to load batch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingProcedures = async () => {
    try {
      const data = await claimService.getPendingProcedures();
      setInvoicePatients(data.patients || []);
    } catch (error) {
      console.error('Failed to load pending procedures:', error);
    }
  };

  const loadPendingClaims = async () => {
    try {
      const data = await claimService.getAllClaims({
        status: 'draft',
        search: claimsSearchQuery
      });
      const formatted = (data.claims || []).map(c => {
        const patientName = c.patient ? `${c.patient.firstName || ''} ${c.patient.lastName || ''}`.trim() : (c.subscriber || 'Unknown');
        const invoiceDate = c.invoice?.createdAt ? new Date(c.invoice.createdAt).toLocaleDateString() : '—';
        const invoiceNumber = c.invoice?.invoiceNumber || c.invoiceId || '—';
        const proceduresMapped = (c.procedures || []).map(p => ({
          dos: p.dos ? new Date(p.dos).toLocaleDateString() : new Date(c.createdAt).toLocaleDateString(),
          tooth: p.tooth || '—',
          surface: p.surface || '—',
          ptBalance: p.ptBalance || `$${(p.fee * 0.2).toFixed(2)}`,
          insBalance: p.insBalance || `$${(p.fee * 0.8).toFixed(2)}`,
          code: p.code || '—',
          description: p.description || '—',
          provider: p.provider || '—',
          fee: p.fee || 0
        }));

        return {
          id: c.id,
          patient: patientName,
          invoiceNumber: `#${invoiceNumber} (${invoiceDate})`,
          claimType: c.insuranceType || 'Manual & Electronic',
          carrier: c.insuranceCompany?.name || 'Membership Payer',
          planName: c.planName || 'Standard Plan',
          procedures: proceduresMapped
        };
      });
      setClaimsList(formatted);
    } catch (error) {
      console.error('Failed to load pending claims:', error);
    }
  };

  const loadAllocations = async (search = '') => {
    try {
      const data = await claimService.getOutstandingClaimsForAllocation(search);
      const formatted = (data.claims || []).map(c => ({
        claimId: c.id,
        claimNumber: c.claimNumber || `#${c.id}`,
        patient: c.subscriber || 'Unknown Patient',
        patientId: c.patient?.id || '—',
        carrier: c.planName || 'Unknown Carrier',
        submitted: c.submittedAmount || 0,
        openAmount: (c.claimAmount || 0) - (c.paidAmount || 0),
        allocatedPaid: 0,
        allocatedWriteOff: 0,
        checked: false
      }));
      setAllocations(formatted);
    } catch (error) {
      console.error('Failed to load allocations:', error);
    }
  };

  // Run on mount
  useEffect(() => {
    loadBatchPayments();
    loadPendingProcedures();
    loadPendingClaims();
    loadAllocations();
  }, []);

  // Reload payments when main search query changes
  useEffect(() => {
    loadBatchPayments();
  }, [searchQuery]);

  // Reload claims when claims search query changes
  useEffect(() => {
    loadPendingClaims();
  }, [claimsSearchQuery]);

  // Reload allocations when allocations search query changes
  useEffect(() => {
    loadAllocations(allocationsSearchQuery);
  }, [allocationsSearchQuery]);

  // Dynamic Filtering for Batch Payments (local fallback filtering)
  const filteredBatchPayments = useMemo(() => {
    return batchPayments.filter((payment) => {
      const matchesSearch =
        payment.paymentRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.patientsText.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCarrier = filterCarrier === 'All' || payment.carrier.toUpperCase() === filterCarrier.toUpperCase();

      return matchesSearch && matchesCarrier;
    });
  }, [batchPayments, searchQuery, filterCarrier]);

  // Check if any Patient is selected in Batch Invoices
  const hasSelectedPatients = useMemo(() => {
    return Object.values(selectedPatients).some((v) => v === true);
  }, [selectedPatients]);

  // Check if any Claim is selected in Batch Claims
  const hasSelectedClaims = useMemo(() => {
    return Object.values(selectedClaims).some((v) => v === true);
  }, [selectedClaims]);

  // Dynamic Filtering for Batch Claims
  const filteredClaimsList = useMemo(() => {
    return claimsList.filter((claim) => {
      const matchesSearch =
        claim.patient.toLowerCase().includes(claimsSearchQuery.toLowerCase()) ||
        claim.invoiceNumber.toLowerCase().includes(claimsSearchQuery.toLowerCase());
      
      const matchesClaimType = filterClaimType === 'All' || claim.claimType.includes(filterClaimType);
      const matchesCarrier = filterClaimsCarrier === 'All' || claim.carrier.includes(filterClaimsCarrier);

      return matchesSearch && matchesClaimType && matchesCarrier;
    });
  }, [claimsList, claimsSearchQuery, filterClaimType, filterClaimsCarrier]);

  // Handlers for Allocations / Payment Creation
  const handleSaveBatchPayment = async () => {
    if (!newPaymentRef.trim()) {
      alert('Please enter a payment reference number.');
      return;
    }

    const selectedClaims = allocations.filter(a => a.checked);
    if (selectedClaims.length === 0) {
      alert('Please select at least one claim to allocate payment.');
      return;
    }

    const payload = {
      paymentRef: newPaymentRef,
      carrierId: '1', // default fallback carrier ID
      paymentDate: newPaymentDate,
      checkAmount: parseFloat(checkAmount) || 0,
      allocations: selectedClaims.map(c => ({
        claimId: c.claimId,
        paidAmount: parseFloat(c.allocatedPaid) || 0,
        writeOff: parseFloat(c.allocatedWriteOff) || 0,
        // Extra fields preserved in Note JSON for Details UI:
        claimNumber: c.claimNumber,
        patient: c.patient,
        patientId: c.patientId,
        submitted: c.submitted,
        paid: parseFloat(c.allocatedPaid) || 0,
        status: 'Paid'
      }))
    };

    try {
      await claimService.recordBatchPayment(payload);
      alert('Batch payment recorded successfully!');
      setOpenAddPaymentModal(false);
      loadBatchPayments();
      // Reset forms
      setNewPaymentRef('');
      setCheckAmount('');
      setActiveModalStep(0);
      loadAllocations();
    } catch (error) {
      alert(`Failed to save batch payment: ${error.message}`);
    }
  };

  // Handlers for Batch Invoices
  const handleSaveBatchInvoice = async () => {
    const selectedIds = Object.keys(selectedPatients).filter(id => selectedPatients[id]);
    try {
      await claimService.generateBatchInvoices(selectedIds, newInvoiceDelivery);
      alert(`Successfully generated batch statements for ${selectedIds.length} patients!`);
      setSelectedPatients({});
      setOpenAddInvoiceModal(false);
      loadPendingProcedures();
    } catch (error) {
      alert(`Failed to generate batch invoices: ${error.message}`);
    }
  };

  // Toggle procedures collapse inside claims list
  const toggleClaimProcedures = (claimId) => {
    setExpandedProcedures(prev => ({
      ...prev,
      [claimId]: !prev[claimId],
    }));
  };

  // Handle EDI submission of selected claims
  const handlePackAndSubmitClaims = async () => {
    const selectedIds = Object.keys(selectedClaims).filter(id => selectedClaims[id]);
    try {
      const result = await claimService.batchSubmitClaims(selectedIds, 'electronic');
      alert(`EDI batch transmission successful!\nSubmitted: ${result.submitted}\nFailed: ${result.failed}`);
      setSelectedClaims({});
      loadPendingClaims();
    } catch (error) {
      alert(`Failed to submit batch claims: ${error.message}`);
    }
  };

  const handleRefreshBatchPayments = () => {
    loadBatchPayments();
    loadPendingProcedures();
    loadPendingClaims();
    setSearchQuery('');
    setFilterCarrier('All');
    setFilterDate('All');
    setShowFilterDrawer(false);
  };

  // Handle EOB File Upload
  const handleEobUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', `EOB for Batch ${selectedBatchPayment.paymentRef}`);

    setUploadingEob(true);
    try {
      await claimService.uploadEOB(selectedBatchPayment.id, formData);
      alert('EOB uploaded successfully!');
      setOpenEOBModal(false);
      loadBatchPayments();
    } catch (error) {
      alert(`EOB upload failed: ${error.message}`);
    } finally {
      setUploadingEob(false);
    }
  };

  const handleUncompleteProcedures = async () => {
    const selectedIds = Object.keys(selectedPatients).filter(id => selectedPatients[id]);
    try {
      const selectedList = invoicePatients.filter(p => selectedIds.includes(p.id));
      const procIds = selectedList.flatMap(p => p.procedures.map(proc => proc.id || ''));
      const validProcIds = procIds.filter(Boolean);

      if (validProcIds.length === 0) {
        alert('No valid procedures found for the selected patient(s) to revert.');
        return;
      }

      await claimService.uncompleteProcedures(validProcIds);
      alert(`Successfully reverted ${validProcIds.length} procedures back to treatment planned status.`);
      setSelectedPatients({});
      loadPendingProcedures();
    } catch (error) {
      alert(`Failed to revert procedures: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: '8px', bgcolor: COLORS.SURFACE_PAGE, minHeight: 'calc(100vh - 65px)', width: '100%', boxSizing: 'border-box' }}>
      {/* Header Card */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: COLORS.SURFACE_CARD, 
        borderRadius: radius.lg, 
        border: `1px solid ${COLORS.BORDER}`, 
        p: '8px',
        px: 2,
        mb: '8px',
      }}>
        <Typography sx={headingPrimarySx}>Batch Actions</Typography>
      </Box>

      {/* Main Content Card */}
      <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, p: '8px' }}>
        {/* Tabs */}
        <Box sx={{ px: '8px' }}>
          <BatchTabs 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSearchQuery('');
            }} 
          />
        </Box>

        {/* Filter & action bars */}
        <Box sx={{ px: '8px' }}>
      {activeTab === 'INSURANCE BATCH PAYMENT' ? (
        <Box sx={{ mb: 2, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: 'hidden' }}>
          {/* Top row: action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: COLORS.SURFACE_CARD, flexWrap: 'wrap' }}>
            <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 15 }} />} onClick={() => setOpenAddPaymentModal(true)}
              sx={{ textTransform: 'none', bgcolor: COLORS.ACCENT, borderRadius: radius.md, px: 2, boxShadow: 'none', fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' } }}
            >
              Add New Payment
            </Button>
            <Button variant="outlined" size="small" startIcon={<RefreshIcon sx={{ fontSize: 15 }} />} onClick={handleRefreshBatchPayments}
              sx={{ textTransform: 'none', borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, borderRadius: radius.md, px: 2, fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { borderColor: COLORS.ACCENT, color: COLORS.ACCENT } }}
            >
              Refresh
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <TextField size="small" placeholder="Search payments…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '220px', '& .MuiOutlinedInput-root': { bgcolor: COLORS.SURFACE_INPUT, fontSize: fontSize.md, borderRadius: radius.md, '& fieldset': { borderColor: COLORS.BORDER }, '&:hover fieldset': { borderColor: COLORS.TEXT_MUTED }, '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT } } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 16 }} /></InputAdornment> }}
            />
            <Button variant="outlined" size="small" startIcon={<FilterIcon sx={{ fontSize: 15 }} />} onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              sx={{ textTransform: 'none', borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, borderRadius: radius.md, px: 2, fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { borderColor: COLORS.ACCENT, color: COLORS.ACCENT } }}
            >
              Filter
            </Button>
          </Box>
          {/* Collapsible filter drawer */}
          <Collapse in={showFilterDrawer}>
            <Box sx={{ borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#f8fafc', p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Carrier / Payer</Typography>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <Select value={filterCarrier} onChange={(e) => setFilterCarrier(e.target.value)} sx={{ fontSize: fontSize.md, borderRadius: radius.md, bgcolor: COLORS.SURFACE_CARD }}>
                    <MenuItem value="All">All Carriers</MenuItem>
                    <MenuItem value="Delta Dental Ins. Co. - Georgia">Delta Dental Ins. Co.</MenuItem>
                    <MenuItem value="MetLife">MetLife</MenuItem>
                    <MenuItem value="Blue Cross Blue Shield of Texas">Blue Cross Blue Shield</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Date Range</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} sx={{ fontSize: fontSize.md, borderRadius: radius.md, bgcolor: COLORS.SURFACE_CARD }}>
                    <MenuItem value="All">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="last7">Last 7 Days</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Button size="small" variant="outlined" onClick={() => { setFilterCarrier('All'); setFilterDate('All'); }}
                sx={{ textTransform: 'none', fontSize: fontSize.md, fontWeight: fontWeight.semibold, borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, borderRadius: radius.md, height: 36 }}
              >Reset</Button>
              <Button size="small" variant="contained" onClick={() => setShowFilterDrawer(false)}
                sx={{ textTransform: 'none', bgcolor: COLORS.ACCENT, fontSize: fontSize.md, fontWeight: fontWeight.semibold, borderRadius: radius.md, height: 36, boxShadow: 'none', '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' } }}
              >Apply</Button>
            </Box>
          </Collapse>
        </Box>
      ) : activeTab === 'BATCH INVOICES' ? (
        <Box sx={{ mb: 2, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: 'hidden' }}>
          {/* Top row: sort filter */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, pb: 1.5, bgcolor: COLORS.SURFACE_CARD }}>
            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>SORT BY</Typography>
            <FormControl variant="standard" size="small" sx={{ minWidth: 140 }}>
              <Select value={sortReportBy} onChange={(e) => setSortReportBy(e.target.value)} disableUnderline
                sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, '& .MuiSelect-select': { py: 0 } }}
              >
                <MenuItem value="Date of Service">Date of Service</MenuItem>
                <MenuItem value="Patient Name">Patient Name</MenuItem>
                <MenuItem value="Provider">Provider</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* Bottom row: actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, pt: 1.5, bgcolor: '#f8fafc', borderTop: `1px solid ${COLORS.BORDER}` }}>
            <Button variant="outlined" size="small" disabled={!hasSelectedPatients} onClick={handleUncompleteProcedures}
              sx={{ textTransform: 'none', borderColor: COLORS.STATUS_ERROR, color: COLORS.STATUS_ERROR, borderRadius: radius.md, px: 2, fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { bgcolor: 'rgba(239,68,68,0.05)' }, '&.Mui-disabled': { opacity: 0.4 } }}
            >Un-complete</Button>
            <Button variant="contained" size="small" disabled={!hasSelectedPatients} onClick={() => setOpenAddInvoiceModal(true)}
              sx={{ textTransform: 'none', bgcolor: COLORS.ACCENT, borderRadius: radius.md, px: 2, boxShadow: 'none', fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }, '&.Mui-disabled': { opacity: 0.45 } }}
            >Batch Invoices</Button>
            <Button variant="outlined" size="small" onClick={() => alert('Opening invoice print generation spooler...')} startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
              sx={{ textTransform: 'none', borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, borderRadius: radius.md, px: 2, fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { borderColor: COLORS.ACCENT, color: COLORS.ACCENT } }}
            >Print</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 2, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: 'hidden' }}>
          {/* Top row: filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, pb: 1.5, bgcolor: COLORS.SURFACE_CARD, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>SORT BY</Typography>
              <FormControl variant="standard" size="small" sx={{ minWidth: 130 }}>
                <Select value={sortReportBy} onChange={(e) => setSortReportBy(e.target.value)} disableUnderline sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, '& .MuiSelect-select': { py: 0 } }}>
                  <MenuItem value="Date of Service">Date of Service</MenuItem>
                  <MenuItem value="Patient Name">Patient Name</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>CLAIM TYPE</Typography>
              <FormControl variant="standard" size="small" sx={{ minWidth: 130 }}>
                <Select value={filterClaimType} onChange={(e) => setFilterClaimType(e.target.value)} disableUnderline sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, '& .MuiSelect-select': { py: 0 } }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Manual & Electronic">Manual & Electronic</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>CARRIER</Typography>
              <FormControl variant="standard" size="small" sx={{ minWidth: 130 }}>
                <Select value={filterClaimsCarrier} onChange={(e) => setFilterClaimsCarrier(e.target.value)} disableUnderline sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, '& .MuiSelect-select': { py: 0 } }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Membership Payer">Membership Payer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <TextField size="small" placeholder="Search claims…" value={claimsSearchQuery} onChange={(e) => setClaimsSearchQuery(e.target.value)}
              sx={{ width: '200px', '& .MuiOutlinedInput-root': { bgcolor: COLORS.SURFACE_INPUT, fontSize: fontSize.md, borderRadius: radius.md, '& fieldset': { borderColor: COLORS.BORDER }, '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT } } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 16 }} /></InputAdornment> }}
            />
          </Box>
          {/* Bottom row: actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, pt: 1.5, bgcolor: '#f8fafc', borderTop: `1px solid ${COLORS.BORDER}` }}>
            <FormControlLabel
              control={<Checkbox checked={excludeClosedInvoices} onChange={(e) => setExcludeClosedInvoices(e.target.checked)} size="small" sx={{ color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT }, p: 0.5 }} />}
              label={<Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.medium }}>Exclude closed invoices</Typography>}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, fontWeight: fontWeight.medium, mr: 1 }}>
              {filteredClaimsList.length} claim(s)
            </Typography>
            <Button variant="contained" size="small" disabled={!hasSelectedClaims} onClick={handlePackAndSubmitClaims}
              sx={{ textTransform: 'none', bgcolor: COLORS.ACCENT, borderRadius: radius.md, px: 2, boxShadow: 'none', fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }, '&.Mui-disabled': { opacity: 0.45 } }}
            >Send Claims ▾</Button>
            <Button variant="outlined" size="small" onClick={() => alert('Opening claim forms print queue spooler...')} startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
              sx={{ textTransform: 'none', borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, borderRadius: radius.md, px: 2, fontWeight: fontWeight.semibold, fontSize: fontSize.md, '&:hover': { borderColor: COLORS.ACCENT, color: COLORS.ACCENT } }}
            >Print</Button>
          </Box>
        </Box>
      )}{/* end filter bars */}

      {/* Tab Tables */}
      {activeTab === 'INSURANCE BATCH PAYMENT' && (
        <BatchPaymentsTab 
          filteredBatchPayments={filteredBatchPayments}
          setSelectedBatchPayment={setSelectedBatchPayment}
          setOpenDetailsModal={setOpenDetailsModal}
          setOpenEOBModal={setOpenEOBModal}
        />
      )}

      {activeTab === 'BATCH INVOICES' && (
        <BatchInvoicesTab 
          invoicePatients={invoicePatients}
          selectedPatients={selectedPatients}
          setSelectedPatients={setSelectedPatients}
        />
      )}

      {activeTab === 'BATCH CLAIMS' && (
        <BatchClaimsTab 
          filteredClaimsList={filteredClaimsList}
          selectedClaims={selectedClaims}
          setSelectedClaims={setSelectedClaims}
        />
      )}

      {activeTab === 'BATCH INVOICES' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2, gap: 1.5 }}>
          <Button disabled size="small" sx={{ textTransform: 'none', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, '&.Mui-disabled': { color: COLORS.TEXT_MUTED } }}>
            ‹ Prev
          </Button>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.medium }}>
            Page 1 of 1 · <strong style={{ color: COLORS.TEXT_PRIMARY }}>{invoicePatients.length} patients total</strong>
          </Typography>
          <Button disabled size="small" sx={{ textTransform: 'none', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, '&.Mui-disabled': { color: COLORS.TEXT_MUTED } }}>
            Next ›
          </Button>
        </Box>
      )}

      </Box>{/* close px:'8px' inner wrapper */}
      </Box>{/* close Main Content Card */}

      {/* -------------------- MODALS & DIALOGS -------------------- */}

      {/* 1. CLAIM BREAKDOWN DETAIL MODAL */}
      <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e6ed', pb: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a3a6b', fontSize: '1.1rem' }}>
              Claim Breakdown Details
            </Typography>
            <Typography variant="caption" sx={{ color: '#718096' }}>
              Reference #: {selectedBatchPayment?.paymentRef} ({selectedBatchPayment?.carrier})
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDetailsModal(false)} size="small" sx={{ color: '#718096' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#fafbfe' }}>
                <TableRow>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }}>CLAIM #</TableCell>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }}>PATIENT ID</TableCell>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }}>PATIENT NAME</TableCell>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }} align="right">SUBMITTED</TableCell>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }} align="right">AMOUNT PAID</TableCell>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }} align="right">WRITE OFF</TableCell>
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1 }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedBatchPayment?.claims.map((claim, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{claim.claimNumber}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#4a5568' }}>{claim.patientId}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a3a6b', fontSize: '0.8rem' }}>{claim.patient}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.8rem', color: '#4a5568' }}>${claim.submitted.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#1a3a6b', fontSize: '0.8rem' }}>${claim.paid.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ color: '#b45309', fontSize: '0.8rem' }}>${claim.writeOff.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={claim.status}
                        size="small"
                        sx={{
                          bgcolor: claim.status === 'Failed' ? '#fee2e2' : '#dcfce7',
                          color: claim.status === 'Failed' ? '#b91c1c' : '#15803d',
                          fontWeight: 700,
                          fontSize: '0.7rem'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e6ed', px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={() => setOpenDetailsModal(false)}
            sx={{ bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#11274c' }, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. MANAGE EOB MODAL */}
      <Dialog open={openEOBModal} onClose={() => setOpenEOBModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e6ed', pb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a3a6b', fontSize: '1.1rem' }}>
            Manage EOB Documents
          </Typography>
          <IconButton onClick={() => setOpenEOBModal(false)} size="small" sx={{ color: '#718096' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#4a5568' }}>
            Uploaded EOB Statements ({selectedBatchPayment?.eobs?.length || 0})
          </Typography>

          {(!selectedBatchPayment?.eobs || selectedBatchPayment.eobs.length === 0) ? (
            <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', mb: 3, bgcolor: '#f8fafc' }}>
              <Typography variant="body2" sx={{ color: '#718096', mb: 2, fontStyle: 'italic' }}>
                No EOB documents have been uploaded for this batch payment yet.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              {selectedBatchPayment.eobs.map((eob) => (
                <Paper key={eob.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', border: '1px solid #e0e6ed' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a3a6b' }}>
                      {eob.filename}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                      Uploaded: {eob.uploadDate} | Size: {eob.size}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => alert(`Downloading EOB document: ${eob.filename}`)}
                      size="small"
                      sx={{ color: '#7d9cc4' }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${eob.filename}?`)) {
                          const updated = batchPayments.map(p => {
                            if (p.id === selectedBatchPayment.id) {
                              const newList = p.eobs.filter(e => e.id !== eob.id);
                              setSelectedBatchPayment(prev => ({ ...prev, eobs: newList }));
                              return { ...p, eobs: newList };
                            }
                            return p;
                          });
                          setBatchPayments(updated);
                        }
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Upload Section */}
          <Box sx={{ border: '2px dashed #94a3b8', p: 3, borderRadius: '8px', textAlign: 'center', bgcolor: '#f8fafc' }}>
            <CloudUploadIcon sx={{ fontSize: 36, color: '#a0aec0', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5 }}>
              Select a digital EOB PDF statement to link
            </Typography>
            <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 2 }}>
              Supported format: PDF up to 10MB
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf"
              onChange={handleEobUpload}
            />
            <Button
              variant="contained"
              startIcon={<UploadIcon sx={{ fontSize: 16 }} />}
              disabled={uploadingEob}
              onClick={() => fileInputRef.current?.click()}
              sx={{ bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#11274c' }, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
            >
              {uploadingEob ? 'Uploading EOB...' : 'Choose File & Upload'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e6ed', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setOpenEOBModal(false)} sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#cbd5e1' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddPaymentModal} onClose={() => { setOpenAddPaymentModal(false); setActiveModalStep(0); }} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '6px', height: '600px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e6ed', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a3a6b', fontSize: '1.1rem' }}>
            Insurance New Payment - Step {activeModalStep + 1} of 3
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {activeModalStep > 0 && (
              <Button
                variant="outlined"
                onClick={() => setActiveModalStep(prev => prev - 1)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '4px', borderColor: '#cbd5e1', color: '#475569' }}
              >
                Back
              </Button>
            )}
            {activeModalStep === 0 && (
              <Button
                variant="contained"
                disabled={allocations.filter(a => a.checked).length === 0}
                onClick={() => setActiveModalStep(1)}
                sx={{ bgcolor: '#1a3a6b', textTransform: 'none', fontWeight: 600, borderRadius: '4px', '&:hover': { bgcolor: '#11274c' }, boxShadow: 'none' }}
              >
                Next: Payment Allocation
              </Button>
            )}
            {activeModalStep === 1 && (
              <Button
                variant="contained"
                onClick={() => setActiveModalStep(2)}
                sx={{ bgcolor: '#1a3a6b', textTransform: 'none', fontWeight: 600, borderRadius: '4px', '&:hover': { bgcolor: '#11274c' }, boxShadow: 'none' }}
              >
                Next: Payment Method
              </Button>
            )}
            {activeModalStep === 2 && (
              <Button
                variant="contained"
                onClick={handleSaveBatchPayment}
                sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 600, borderRadius: '4px', '&:hover': { bgcolor: '#059669' }, boxShadow: 'none' }}
              >
                Record Batch Payment
              </Button>
            )}
            <IconButton onClick={() => { setOpenAddPaymentModal(false); setActiveModalStep(0); }} size="small" sx={{ color: '#1a3a6b' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'row', bgcolor: '#f4f6f8' }}>
          {/* Left Sidebar (Stepper) */}
          <Box sx={{ width: '220px', borderRight: '1px solid #e0e6ed', bgcolor: '#f4f6f8', pt: 4, px: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Step 1 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
              <Box sx={{ zIndex: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: activeModalStep >= 0 ? '#1a3a6b' : '#f4f6f8', border: activeModalStep >= 0 ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                {activeModalStep > 0 ? (
                  <Typography sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>✓</Typography>
                ) : (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
                )}
              </Box>
              <Typography sx={{ fontWeight: activeModalStep === 0 ? 700 : 500, fontSize: '0.8rem', color: activeModalStep === 0 ? '#1a3a6b' : '#718096' }}>Claims Selection</Typography>
              <Box sx={{ position: 'absolute', left: 18, top: 25, bottom: -35, width: '2px', bgcolor: activeModalStep > 0 ? '#1a3a6b' : '#e0e6ed' }} />
            </Box>
            {/* Step 2 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
              <Box sx={{ zIndex: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: activeModalStep >= 1 ? '#1a3a6b' : '#f4f6f8', border: activeModalStep >= 1 ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                {activeModalStep > 1 ? (
                  <Typography sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>✓</Typography>
                ) : activeModalStep === 1 ? (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
                ) : null}
              </Box>
              <Typography sx={{ fontWeight: activeModalStep === 1 ? 700 : 500, fontSize: '0.8rem', color: activeModalStep === 1 ? '#1a3a6b' : '#718096' }}>Payment Allocation</Typography>
              <Box sx={{ position: 'absolute', left: 18, top: 25, bottom: -35, width: '2px', bgcolor: activeModalStep > 1 ? '#1a3a6b' : '#e0e6ed' }} />
            </Box>
            {/* Step 3 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
              <Box sx={{ zIndex: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: activeModalStep === 2 ? '#1a3a6b' : '#f4f6f8', border: activeModalStep === 2 ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                {activeModalStep === 2 && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />}
              </Box>
              <Typography sx={{ fontWeight: activeModalStep === 2 ? 700 : 500, fontSize: '0.8rem', color: activeModalStep === 2 ? '#1a3a6b' : '#718096' }}>Payment Method</Typography>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', gap: 3, overflowY: 'auto' }}>
            {activeModalStep === 0 && (
              <>
                {/* Left Column: Search and Claims */}
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Search Box */}
                  <Paper sx={{ p: 2, borderRadius: '6px', border: '1px solid #e0e6ed', boxShadow: 'none' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', mb: 1 }}>Search By:</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5, ml: 0 }}>
                      <FormControlLabel
                        value="Carrier"
                        control={<Radio size="small" checked={searchType === 'Carrier'} onChange={() => setSearchType('Carrier')} sx={{ p: 0.5, color: '#1a3a6b', '&.Mui-checked': { color: '#1a3a6b' } }} />}
                        label={<Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>Carrier</Typography>}
                        sx={{ m: 0 }}
                      />
                      <FormControlLabel
                        value="Patient"
                        control={<Radio size="small" checked={searchType === 'Patient'} onChange={() => setSearchType('Patient')} sx={{ p: 0.5, color: '#1a3a6b', '&.Mui-checked': { color: '#1a3a6b' } }} />}
                        label={<Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>Patient</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      value={allocationsSearchQuery}
                      onChange={(e) => setAllocationsSearchQuery(e.target.value)}
                      placeholder={searchType === 'Carrier' ? "Search for Carrier" : "Search for Patient"}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7994c6', fontSize: 18 }} /></InputAdornment>
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                    />
                  </Paper>

                  {/* Claims Box */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', ml: 0.5, textTransform: 'uppercase' }}>Outstanding Claims</Typography>
                    {allocations.length === 0 ? (
                      <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: '6px', border: '1px solid #e0e6ed', boxShadow: 'none', bgcolor: '#f8fafc', minHeight: '150px' }}>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a3a6b', mb: 0.5 }}>No Claims Found</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#718096' }}>There are no outstanding claims matching your filter.</Typography>
                      </Paper>
                    ) : (
                      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', maxHeight: '300px', overflowY: 'auto' }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox" sx={{ bgcolor: '#fafbfe' }}></TableCell>
                              <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1, bgcolor: '#fafbfe' }}>CLAIM #</TableCell>
                              <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1, bgcolor: '#fafbfe' }}>PATIENT</TableCell>
                              <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, py: 1, bgcolor: '#fafbfe' }}>CARRIER</TableCell>
                              <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700, py: 1, bgcolor: '#fafbfe' }}>OPEN BAL</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allocations.map((claim, idx) => (
                              <TableRow key={claim.claimId} hover>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    size="small"
                                    checked={claim.checked}
                                    onChange={() => {
                                      setAllocations(prev => prev.map((c, i) => i === idx ? { ...c, checked: !c.checked } : c));
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{claim.claimNumber}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', color: '#4a5568' }}>{claim.patient}</TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', color: '#4a5568' }}>{claim.carrier}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#1a3a6b' }}>${claim.openAmount.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                </Box>

                {/* Right Column: Selected Claims */}
                <Box sx={{ flex: 1.2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', ml: 0.5, textTransform: 'uppercase' }}>Selected Claims ({allocations.filter(a => a.checked).length})</Typography>
                    {allocations.filter(a => a.checked).length === 0 ? (
                      <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: '6px', border: '1px solid #e0e6ed', boxShadow: 'none', bgcolor: '#f8fafc', minHeight: '150px' }}>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a3a6b', mb: 0.5 }}>No Claims Selected Yet</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#718096', textAlign: 'center' }}>Start by selecting claims from the list on the left</Typography>
                      </Paper>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '380px', overflowY: 'auto' }}>
                        {allocations.filter(a => a.checked).map(claim => (
                          <Paper key={claim.claimId} variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px', bgcolor: 'white' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{claim.claimNumber}</Typography>
                              <Typography variant="caption" sx={{ color: '#718096' }}>{claim.patient}</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#1a3a6b', fontSize: '0.85rem' }}>${claim.openAmount.toFixed(2)}</Typography>
                          </Paper>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            )}

            {activeModalStep === 1 && (
              <>
                {/* Left Column: Allocation Inputs */}
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b' }}>Allocate Check Amounts to Claims</Typography>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#fafbfe' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>CLAIM # / PATIENT</TableCell>
                          <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700 }}>OPEN AMT</TableCell>
                          <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, width: '120px' }}>PAID AMT</TableCell>
                          <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, width: '120px' }}>WRITE OFF</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allocations.filter(a => a.checked).map((claim) => (
                          <TableRow key={claim.claimId}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{claim.claimNumber}</Typography>
                              <Typography variant="caption" sx={{ color: '#718096' }}>{claim.patient}</Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>${claim.openAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                placeholder="0.00"
                                value={claim.allocatedPaid || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setAllocations(prev => prev.map(c => c.claimId === claim.claimId ? { ...c, allocatedPaid: val } : c));
                                }}
                                inputProps={{ style: { fontSize: '0.8rem', padding: '6px' } }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                placeholder="0.00"
                                value={claim.allocatedWriteOff || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setAllocations(prev => prev.map(c => c.claimId === claim.claimId ? { ...c, allocatedWriteOff: val } : c));
                                }}
                                inputProps={{ style: { fontSize: '0.8rem', padding: '6px' } }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Right Column: Allocation Summary */}
                <Box sx={{ flex: 1.2 }}>
                  <Paper sx={{ p: 2, borderRadius: '6px', border: '1px solid #e0e6ed', bgcolor: 'white', boxShadow: 'none' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b', mb: 2 }}>Allocation Summary</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Claims:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{allocations.filter(a => a.checked).length}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Allocated Paid:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a3a6b' }}>
                          ${allocations.filter(a => a.checked).reduce((sum, c) => sum + (c.allocatedPaid || 0), 0).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Write-offs:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309' }}>
                          ${allocations.filter(a => a.checked).reduce((sum, c) => sum + (c.allocatedWriteOff || 0), 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </>
            )}

            {activeModalStep === 2 && (
              <>
                {/* Left Column: Form Details */}
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b' }}>Enter Check Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Check/Reference Number:</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={newPaymentRef}
                        onChange={(e) => setNewPaymentRef(e.target.value)}
                        placeholder="e.g. EFT-90284"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Total Check Amount ($):</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={checkAmount}
                        onChange={(e) => setCheckAmount(e.target.value)}
                        placeholder="e.g. 500.00"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Insurance Carrier:</Typography>
                      <FormControl fullWidth size="small">
                        <Select value={newPaymentCarrier} onChange={(e) => setNewPaymentCarrier(e.target.value)}>
                          <MenuItem value="CIGNA">Cigna Dental</MenuItem>
                          <MenuItem value="Delta Dental">Delta Dental</MenuItem>
                          <MenuItem value="MetLife">MetLife Dental</MenuItem>
                          <MenuItem value="Aetna">Aetna PPO</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Check Date:</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={newPaymentDate}
                        onChange={(e) => setNewPaymentDate(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Right Column: Check Summary */}
                <Box sx={{ flex: 1.2 }}>
                  <Paper sx={{ p: 2, borderRadius: '6px', border: '1px solid #e0e6ed', bgcolor: 'white', boxShadow: 'none' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b', mb: 2 }}>Summary Details</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>Carrier:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{newPaymentCarrier}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Allocated:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                          ${allocations.filter(a => a.checked).reduce((sum, c) => sum + (c.allocatedPaid || 0), 0).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>Reference #:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{newPaymentRef || 'Not entered'}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* 4. CREATE BATCH INVOICES MODAL */}
      <Dialog open={openAddInvoiceModal} onClose={() => setOpenAddInvoiceModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e6ed', pb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a3a6b', fontSize: '1.1rem' }}>
            Generate New Batch Statements
          </Typography>
          <IconButton onClick={() => setOpenAddInvoiceModal(false)} size="small" sx={{ color: '#718096' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>
                Preferred Statements Delivery Method:
              </Typography>
              <FormControl size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}>
                <Select value={newInvoiceDelivery} onChange={(e) => setNewInvoiceDelivery(e.target.value)}>
                  <MenuItem value="Email & SMS">Digital Delivery (Email & SMS)</MenuItem>
                  <MenuItem value="Printed Mail">Post Office Printed Mail</MenuItem>
                  <MenuItem value="None">Generate Offline PDF Statements Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 500 }}>
            This will generate bulk invoices for the {Object.keys(selectedPatients).filter(id => selectedPatients[id]).length} selected patients. Proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e6ed', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setOpenAddInvoiceModal(false)} sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#cbd5e1' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveBatchInvoice}
            sx={{ bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#11274c' }, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
          >
            Generate Batch Invoices
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
