import { useState, useMemo } from 'react';
import React from 'react';
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
  const [activeTab, setActiveTab] = useState('INSURANCE BATCH PAYMENT');

  // Search & Basic Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterCarrier, setFilterCarrier] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [sortReportBy, setSortReportBy] = useState('Date of Service');

  // Tab 1 States
  const [batchPayments, setBatchPayments] = useState(INITIAL_BATCH_PAYMENTS);
  const [selectedBatchPayment, setSelectedBatchPayment] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openEOBModal, setOpenEOBModal] = useState(false);
  const [openAddPaymentModal, setOpenAddPaymentModal] = useState(false);
  const [newPaymentRef, setNewPaymentRef] = useState('');
  const [newPaymentCarrier, setNewPaymentCarrier] = useState('CIGNA');
  const [newPaymentDate, setNewPaymentDate] = useState('05/23/2026');
  const [checkAmount, setCheckAmount] = useState('');
  const [allocations, setAllocations] = useState(
    OUTSTANDING_CLAIMS_FOR_ALLOCATION.map(claim => ({
      ...claim,
      allocatedPaid: 0,
      allocatedWriteOff: 0,
      checked: false,
    }))
  );

  // Tab 2 States (Batch Invoices)
  const [invoicePatients, setInvoicePatients] = useState(INITIAL_BATCH_INVOICES_PATIENTS);
  const [selectedPatients, setSelectedPatients] = useState({});
  const [openAddInvoiceModal, setOpenAddInvoiceModal] = useState(false);
  const [newInvoiceDelivery, setNewInvoiceDelivery] = useState('Email & SMS');

  // Tab 3 States (Batch Claims - 1:1 with Screenshot)
  const [claimsList, setClaimsList] = useState(INITIAL_BATCH_CLAIMS_LIST);
  const [selectedClaims, setSelectedClaims] = useState({});
  const [excludeClosedInvoices, setExcludeClosedInvoices] = useState(true);
  const [filterClaimType, setFilterClaimType] = useState('All');
  const [filterClaimsCarrier, setFilterClaimsCarrier] = useState('All');
  const [expandedProcedures, setExpandedProcedures] = useState({}); // claimId: true/false
  const [claimsSearchQuery, setClaimsSearchQuery] = useState('');

  // Simulated upload state
  const [uploadingEob, setUploadingEob] = useState(false);

  // Dynamic Filtering for Batch Payments
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
  const handleSaveBatchPayment = () => {
    if (!newPaymentRef.trim()) {
      alert('Please enter a payment reference number.');
      return;
    }

    const selectedClaims = allocations.filter(a => a.checked);
    if (selectedClaims.length === 0) {
      alert('Please select at least one claim to allocate payment.');
      return;
    }

    const claimsListMock = selectedClaims.map(c => ({
      claimNumber: c.claimNumber,
      patient: c.patient,
      patientId: c.patientId,
      submitted: c.submitted,
      paid: Number(c.allocatedPaid) || 0,
      writeOff: Number(c.allocatedWriteOff) || 0,
      status: 'Paid',
    }));

    const totalAllocatedPaid = claimsListMock.reduce((sum, item) => sum + item.paid, 0);

    const newPayment = {
      id: `bp-${Date.now()}`,
      paymentRef: newPaymentRef,
      date: newPaymentDate,
      status: 'COMPLETED',
      carrier: newPaymentCarrier,
      patientsText: claimsListMock.length === 1 ? claimsListMock[0].patient : `${claimsListMock.length} Patients`,
      totalPayments: totalAllocatedPaid,
      claims: claimsListMock,
      eobs: [],
    };

    setBatchPayments([newPayment, ...batchPayments]);
    setOpenAddPaymentModal(false);

    setNewPaymentRef('');
    setCheckAmount('');
    setAllocations(
      OUTSTANDING_CLAIMS_FOR_ALLOCATION.map(claim => ({
        ...claim,
        allocatedPaid: 0,
        allocatedWriteOff: 0,
        checked: false,
      }))
    );
  };

  // Handlers for Batch Invoices
  const handleSaveBatchInvoice = () => {
    const selectedIds = Object.keys(selectedPatients).filter(id => selectedPatients[id]);
    const selectedList = invoicePatients.filter(p => selectedIds.includes(p.id));
    const totalAmt = selectedList.reduce((sum, p) => sum + p.procedures.reduce((s, proc) => s + proc.fee, 0), 0);

    alert(`Successfully generated batch statements for ${selectedList.length} patients!\nTotal Batch Amount: $${totalAmt.toFixed(2)}\nDelivery Preference: ${newInvoiceDelivery}`);
    
    setInvoicePatients(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedPatients({});
    setOpenAddInvoiceModal(false);
  };

  // Toggle procedures collapse inside claims list
  const toggleClaimProcedures = (claimId) => {
    setExpandedProcedures(prev => ({
      ...prev,
      [claimId]: !prev[claimId],
    }));
  };

  // Handle EDI submission of selected claims
  const handlePackAndSubmitClaims = () => {
    const selectedIds = Object.keys(selectedClaims).filter(id => selectedClaims[id]);
    const count = selectedIds.length;
    alert(`Generating EDI 837 transaction package for ${count} claims...\nTransmitting securely to Clearinghouse Gateway.`);
    
    // Remove the submitted claims from active pending list
    setClaimsList(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedClaims({});
  };

  const handleRefreshBatchPayments = () => {
    setBatchPayments(INITIAL_BATCH_PAYMENTS);
    setSearchQuery('');
    setFilterCarrier('All');
    setFilterDate('All');
    setShowFilterDrawer(false);
  };

  // Handle EOB File Upload Simulation
  const handleEobUpload = () => {
    setUploadingEob(true);
    setTimeout(() => {
      setUploadingEob(false);
      const updated = batchPayments.map(p => {
        if (p.id === selectedBatchPayment.id) {
          const newEob = {
            id: `eob-${Date.now()}`,
            filename: `EOB_${p.carrier.replace(/\s+/g, '')}_Manual_${Math.floor(Math.random() * 1000)}.pdf`,
            uploadDate: '05/23/2026',
            size: '142 KB'
          };
          const newEobsList = [...(p.eobs || []), newEob];
          setSelectedBatchPayment(prev => ({ ...prev, eobs: newEobsList }));
          return { ...p, eobs: newEobsList };
        }
        return p;
      });
      setBatchPayments(updated);
    }, 1500);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Banner / Breadcrumb - Identical to Claim Management Page */}
      <Box sx={{ borderBottom: '1px solid #e0e6ed', pb: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a3a6b' }}>
          Batch Actions
        </Typography>
      </Box>

      {/* Styled Horizontal Sub-Tabs - 100% Identical to Claim Management Sub-tabs */}
      <Box
        sx={{
          borderBottom: '2px solid #e0e6ed',
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          mb: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {['INSURANCE BATCH PAYMENT', 'BATCH INVOICES', 'BATCH CLAIMS'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Box
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
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

      {/* Dynamic Sub-tab Configurations & Action Controls */}
      {activeTab === 'INSURANCE BATCH PAYMENT' ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setOpenAddPaymentModal(true)}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#1a3a6b',
                borderRadius: '4px',
                px: 2.5,
                py: 0.7,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#11274c' },
              }}
            >
              Add New Payment
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
              onClick={handleRefreshBatchPayments}
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
              Refresh
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon sx={{ fontSize: 16 }} />}
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
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
              placeholder="Search For Payment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '280px',
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
      ) : activeTab === 'BATCH INVOICES' ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2.5,
          }}
        >
          {/* Sort dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a3a6b' }}>
              Sort Report by:
            </Typography>
            <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sortReportBy}
                onChange={(e) => setSortReportBy(e.target.value)}
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#1a3a6b',
                  '&:before': { borderBottom: 'none' },
                  '&:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': { py: 0 }
                }}
              >
                <MenuItem value="Date of Service">Date of Service</MenuItem>
                <MenuItem value="Patient Name">Patient Name</MenuItem>
                <MenuItem value="Provider">Provider</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              disabled={!hasSelectedPatients}
              onClick={() => alert(`Reverting ${Object.keys(selectedPatients).filter(id => selectedPatients[id]).length} patient procedures back to in-progress status.`)}
              sx={{
                textTransform: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: hasSelectedPatients ? '#bc9363' : '#dbcaaf',
                borderRadius: '4px',
                px: 2,
                py: 0.7,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#a67d4e' },
                '&.Mui-disabled': { backgroundColor: '#dbcaaf', color: 'rgba(255,255,255,0.7)' }
              }}
            >
              Un-complete Procedures
            </Button>
            <Button
              variant="contained"
              disabled={!hasSelectedPatients}
              onClick={() => setOpenAddInvoiceModal(true)}
              sx={{
                textTransform: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: hasSelectedPatients ? '#bc9363' : '#dbcaaf',
                borderRadius: '4px',
                px: 2,
                py: 0.7,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#a67d4e' },
                '&.Mui-disabled': { backgroundColor: '#dbcaaf', color: 'rgba(255,255,255,0.7)' }
              }}
            >
              Batch Invoices
            </Button>
            <Button
              variant="contained"
              onClick={() => alert('Opening invoice print generation spooler...')}
              sx={{
                textTransform: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#1a3a6b',
                borderRadius: '4px',
                px: 2,
                py: 0.7,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#11274c' }
              }}
            >
              Print
            </Button>
          </Box>
        </Box>
      ) : (
        // ------------------ TAB 3: BATCH CLAIMS CONTROLS (1:1 with Screenshot) ------------------
        <Box sx={{ mb: 2.5 }}>
          {/* Row 1: Filters on left, Refresh on right */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3.5 }}>
              {/* Sort By */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a3a6b' }}>
                  Sort Report by:
                </Typography>
                <FormControl variant="standard" size="small" sx={{ minWidth: 110 }}>
                  <Select
                    value={sortReportBy}
                    onChange={(e) => setSortReportBy(e.target.value)}
                    sx={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1a3a6b',
                      '&:before': { borderBottom: 'none' },
                      '&:after': { borderBottom: 'none' },
                    }}
                  >
                    <MenuItem value="Date of Service">Date of Service</MenuItem>
                    <MenuItem value="Patient Name">Patient Name</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Filter by Claim Type */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a3a6b' }}>
                  Filter by Claim Type:
                </Typography>
                <FormControl variant="standard" size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={filterClaimType}
                    onChange={(e) => setFilterClaimType(e.target.value)}
                    sx={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1a3a6b',
                      '&:before': { borderBottom: 'none' },
                      '&:after': { borderBottom: 'none' },
                    }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Manual & Electronic">Manual & Electronic</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Filter by Carrier */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a3a6b' }}>
                  Filter by Carrier:
                </Typography>
                <FormControl variant="standard" size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={filterClaimsCarrier}
                    onChange={(e) => setFilterClaimsCarrier(e.target.value)}
                    sx={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#1a3a6b',
                      '&:before': { borderBottom: 'none' },
                      '&:after': { borderBottom: 'none' },
                    }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Membership Payer">Membership Payer</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Refresh Link exactly as screenshot */}
            <Button
              onClick={() => alert('Refreshing pending claims...')}
              startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#1a3a6b',
                minWidth: 'auto',
                p: 0,
                '&:hover': { background: 'none', textDecoration: 'underline' }
              }}
            >
              Refresh
            </Button>
          </Box>

          {/* Row 2: Exclude Closed Checkbox on left, Send Claims & Print Buttons on right */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={excludeClosedInvoices}
                  onChange={(e) => setExcludeClosedInvoices(e.target.checked)}
                  sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' }, p: 0.5 }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.82rem', color: '#1a3a6b', fontWeight: 600 }}>
                  Exclude closed invoices
                </Typography>
              }
            />

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                disabled={!hasSelectedClaims}
                onClick={handlePackAndSubmitClaims}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: hasSelectedClaims ? '#bc9363' : '#dbcaaf',
                  borderRadius: '4px',
                  px: 2.2,
                  py: 0.7,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#a67d4e' },
                  '&.Mui-disabled': { backgroundColor: '#dbcaaf', color: 'rgba(255,255,255,0.7)' }
                }}
              >
                Send Claims ▾
              </Button>
              <Button
                variant="contained"
                onClick={() => alert('Opening claim forms print queue spooler...')}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#1a3a6b',
                  borderRadius: '4px',
                  px: 2.2,
                  py: 0.7,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#11274c' }
                }}
              >
                Print
              </Button>
            </Box>
          </Box>

          {/* Row 3: Full Width Search input */}
          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by name, invoice number, or date"
              value={claimsSearchQuery}
              onChange={(e) => setClaimsSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  borderRadius: '4px',
                  borderColor: '#e2e8f0',
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

          {/* Results count text directly below search bar */}
          <Typography sx={{ color: '#1a3a6b', fontSize: '0.82rem', fontWeight: 700, fontStyle: 'italic' }}>
            ({filteredClaimsList.length} claim/s)
          </Typography>
        </Box>
      )}

      {/* Advanced Filter Drawer (For Tab 1) */}
      {activeTab === 'INSURANCE BATCH PAYMENT' && (
        <Collapse in={showFilterDrawer}>
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: '8px', border: '1px solid #e0e6ed', boxShadow: 'none' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1a3a6b' }}>
              Filter Batch Payments
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                  Carrier / Payer:
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select value={filterCarrier} onChange={(e) => setFilterCarrier(e.target.value)}>
                    <MenuItem value="All">All Carriers</MenuItem>
                    <MenuItem value="Delta Dental Ins. Co. - Georgia">Delta Dental Ins. Co. - Georgia</MenuItem>
                    <MenuItem value="MetLife">MetLife</MenuItem>
                    <MenuItem value="Blue Cross Blue Shield of Texas">Blue Cross Blue Shield of Texas</MenuItem>
                    <MenuItem value="2 Payers">Multi-Payers (2 Payers)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                  Date Range:
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                    <MenuItem value="All">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="last7">Last 7 Days</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setFilterCarrier('All');
                    setFilterDate('All');
                  }}
                  sx={{ textTransform: 'none', height: 38, fontWeight: 600 }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setShowFilterDrawer(false)}
                  sx={{ textTransform: 'none', bgcolor: '#1a3a6b', height: 38, fontWeight: 600, '&:hover': { bgcolor: '#11274c' } }}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      )}

      {/* Main Table Container */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'hidden' }}>
        {/* Tab 1 Table: Insurance Batch Payments */}
        {activeTab === 'INSURANCE BATCH PAYMENT' && (
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>PAYMENT REF #</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>DATE</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>STATUS</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>CARRIER</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>PATIENTS</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>TOTAL PAYMENTS</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>CLAIM BREAKDOWN</TableCell>
                <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>EOB</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBatchPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No batch payments found. Click "Add New Payment" to record a bulk check.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBatchPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell sx={{ py: 1.5, minWidth: '200px' }}>
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          color: '#334155',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          lineHeight: 1.3,
                          maxWidth: '180px',
                        }}
                      >
                        {payment.paymentRef}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                        {payment.date}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={payment.status}
                        size="small"
                        sx={{
                          bgcolor: payment.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
                          color: payment.status === 'COMPLETED' ? '#15803d' : '#b91c1c',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          height: '24px',
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      {payment.carrier.includes('Payers') ? (
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => alert(`Payers details for ${payment.paymentRef}: Cigna, MetLife, Guardian.`)}
                          sx={{
                            color: '#1a3a6b',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '0.82rem',
                            textAlign: 'left',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {payment.carrier}
                        </Link>
                      ) : (
                        <Typography sx={{ fontSize: '0.82rem', color: '#4a5568', fontWeight: 500 }}>
                          {payment.carrier}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          setSelectedBatchPayment(payment);
                          setOpenDetailsModal(true);
                        }}
                        sx={{
                          color: '#1a3a6b',
                          fontWeight: 700,
                          textDecoration: 'none',
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {payment.patientsText}
                      </Link>
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#4a5568' }}>
                        ${payment.totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Button
                        variant="text"
                        onClick={() => {
                          setSelectedBatchPayment(payment);
                          setOpenDetailsModal(true);
                        }}
                        sx={{
                          color: '#1a3a6b',
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.82rem',
                          padding: 0,
                          minWidth: 'auto',
                          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Button
                        variant="text"
                        onClick={() => {
                          setSelectedBatchPayment(payment);
                          setOpenEOBModal(true);
                        }}
                        sx={{
                          color: '#1a3a6b',
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.82rem',
                          padding: 0,
                          minWidth: 'auto',
                          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                        }}
                      >
                        Manage EOB
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Tab 2 Table: Batch Invoices (Grouped Procedures) */}
        {activeTab === 'BATCH INVOICES' && (
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ width: 50, color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>
                  <input
                    type="checkbox"
                    checked={invoicePatients.length > 0 && invoicePatients.every(p => selectedPatients[p.id])}
                    onChange={(e) => {
                      const updated = {};
                      invoicePatients.forEach(p => {
                        updated[p.id] = e.target.checked;
                      });
                      setSelectedPatients(updated);
                    }}
                    style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Patient</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>DOS</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Procedure</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Description</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Provider</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoicePatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No pending procedures for batch invoicing.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoicePatients.map((patient) => {
                  return patient.procedures.map((proc, procIdx) => {
                    const isLastProc = procIdx === patient.procedures.length - 1;
                    return (
                      <TableRow
                        key={`${patient.id}-${procIdx}`}
                        hover
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {procIdx === 0 && (
                          <TableCell
                            rowSpan={patient.procedures.length}
                            sx={{
                              verticalAlign: 'top',
                              py: 2,
                              borderBottom: '1px solid #e0e6ed',
                              width: 50,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPatients[patient.id] || false}
                              onChange={(e) => {
                                setSelectedPatients(prev => ({
                                  ...prev,
                                  [patient.id]: e.target.checked,
                                }));
                              }}
                              style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                            />
                          </TableCell>
                        )}

                        {procIdx === 0 && (
                          <TableCell
                            rowSpan={patient.procedures.length}
                            sx={{
                              verticalAlign: 'top',
                              py: 2,
                              borderBottom: '1px solid #e0e6ed',
                              minWidth: '220px',
                            }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Link
                                component="button"
                                variant="body2"
                                onClick={() => alert(`Opening patient chart for ${patient.name}`)}
                                sx={{
                                  color: '#1a3a6b',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  fontSize: '0.85rem',
                                  textAlign: 'left',
                                  width: 'fit-content',
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                              >
                                {patient.name}
                              </Link>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, color: '#8898aa' }}>
                                <Tooltip title="Appointments">
                                  <CalendarIcon sx={{ fontSize: 13, cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} onClick={() => alert(`Opening appointments for ${patient.name}`)} />
                                </Tooltip>
                                <Tooltip title="Ledger">
                                  <DollarIcon sx={{ fontSize: 13, cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} onClick={() => alert(`Opening Ledger for ${patient.name}`)} />
                                </Tooltip>
                                <Tooltip title="Treatment Plan">
                                  <TxIcon sx={{ fontSize: 13, cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} onClick={() => alert(`Opening Treatment Plan for ${patient.name}`)} />
                                </Tooltip>
                                <Tooltip title="Communications">
                                  <ChatIcon sx={{ fontSize: 13, cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} onClick={() => alert(`Opening Communication log for ${patient.name}`)} />
                                </Tooltip>
                              </Box>
                            </Box>
                          </TableCell>
                        )}

                        <TableCell sx={{ py: 1.5, borderBottom: isLastProc ? '1px solid #e0e6ed' : 'none' }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568' }}>
                            {proc.dos}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ py: 1.5, borderBottom: isLastProc ? '1px solid #e0e6ed' : 'none' }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568', fontWeight: 600 }}>
                            {proc.code}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ py: 1.5, borderBottom: isLastProc ? '1px solid #e0e6ed' : 'none' }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568' }}>
                            {proc.description}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ py: 1.5, borderBottom: isLastProc ? '1px solid #e0e6ed' : 'none' }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568' }}>
                            {proc.provider}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ py: 1.5, borderBottom: isLastProc ? '1px solid #e0e6ed' : 'none' }}>
                          {proc.hasNote ? (
                            <Tooltip title="View completed procedure note">
                              <IconButton
                                size="small"
                                onClick={() => alert(`Procedure Note snippet for ${patient.name} (${proc.code}): Checked note entry signed on ${proc.dos}.`)}
                                sx={{ p: 0, color: '#7d9cc4' }}
                              >
                                <NoteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          ) : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })
              )}
            </TableBody>
          </Table>
        )}

        {/* ------------------ Tab 3 Table: Batch Claims (1:1 with Screenshot) ------------------ */}
        {activeTab === 'BATCH CLAIMS' && (
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ width: 50, color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>
                  <input
                    type="checkbox"
                    checked={filteredClaimsList.length > 0 && filteredClaimsList.every(c => selectedClaims[c.id])}
                    onChange={(e) => {
                      const updated = {};
                      filteredClaimsList.forEach(c => {
                        updated[c.id] = e.target.checked;
                      });
                      setSelectedClaims(updated);
                    }}
                    style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Patient</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Invoice # (date)</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Claim Type</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Carrier</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Plan name (#)</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Procedures</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClaimsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No pending claims found matching criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClaimsList.map((claim) => {
                  const isExpanded = expandedProcedures[claim.id];
                  return (
                    <React.Fragment key={claim.id}>
                      <TableRow
                        hover
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {/* Checkbox */}
                        <TableCell sx={{ py: 1.5 }}>
                          <input
                            type="checkbox"
                            checked={selectedClaims[claim.id] || false}
                            onChange={(e) => {
                              setSelectedClaims(prev => ({
                                ...prev,
                                [claim.id]: e.target.checked
                              }));
                            }}
                            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                          />
                        </TableCell>

                        {/* Patient Link with micro-icons under */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Link
                              component="button"
                              variant="body2"
                              onClick={() => alert(`Opening Patient Profile: ${claim.patient}`)}
                              sx={{
                                color: '#1a3a6b',
                                fontWeight: 700,
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                textAlign: 'left',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              {claim.patient}
                            </Link>
                            {/* Tiny grey icons inline */}
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.3, color: '#8898aa' }}>
                              <CalendarIcon sx={{ fontSize: 13, cursor: 'pointer' }} onClick={() => alert(`Appointments: ${claim.patient}`)} />
                              <DollarIcon sx={{ fontSize: 13, cursor: 'pointer' }} onClick={() => alert(`Ledger: ${claim.patient}`)} />
                              <TxIcon sx={{ fontSize: 13, cursor: 'pointer' }} onClick={() => alert(`Treatment Plan: ${claim.patient}`)} />
                              <ChatIcon sx={{ fontSize: 13, cursor: 'pointer' }} onClick={() => alert(`Logs: ${claim.patient}`)} />
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Invoice # (date) */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568', fontWeight: 500 }}>
                            {claim.invoiceNumber}
                          </Typography>
                        </TableCell>

                        {/* Claim Type */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568' }}>
                            {claim.claimType}
                          </Typography>
                        </TableCell>

                        {/* Carrier */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568', fontWeight: 500 }}>
                            {claim.carrier}
                          </Typography>
                        </TableCell>

                        {/* Plan Name */}
                        <TableCell sx={{ py: 1.5, maxWidth: '240px' }}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#4a5568', lineHeight: 1.3 }}>
                            {claim.planName}
                          </Typography>
                        </TableCell>

                        {/* Procedures Toggle */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Button
                            variant="text"
                            onClick={() => toggleClaimProcedures(claim.id)}
                            startIcon={isExpanded ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                            sx={{
                              color: '#1a3a6b',
                              fontWeight: 700,
                              textTransform: 'none',
                              fontSize: '0.82rem',
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': { background: 'none', textDecoration: 'underline' }
                            }}
                          >
                            {isExpanded ? 'Hide' : 'Show'}
                          </Button>
                        </TableCell>

                        {/* Note & Ignore actions exactly as screenshot */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Link
                              component="button"
                              variant="body2"
                              onClick={() => alert(`Ignoring Claim for Invoice ${claim.invoiceNumber}`)}
                              sx={{
                                color: '#1a3a6b',
                                fontWeight: 700,
                                textDecoration: 'none',
                                fontSize: '0.82rem',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              Ignore
                            </Link>
                            <Tooltip title="View completed claim document note">
                              <IconButton
                                size="small"
                                onClick={() => alert(`Claim note: Procedure verified for submission.`)}
                                sx={{ p: 0, color: '#7d9cc4' }}
                              >
                                <NoteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Collapsible procedures drawer */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0, px: 4, bgcolor: '#fafbfe' }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 1.5, borderLeft: '3px solid #1a3a6b', pl: 2, my: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a3a6b', fontSize: '0.8rem' }}>
                                Claim Treatment Details:
                              </Typography>
                              <Table size="small" sx={{ maxWidth: '700px' }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: '#4a5568', fontSize: '0.75rem' }}>DOS</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#4a5568', fontSize: '0.75rem' }}>Tooth#</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#4a5568', fontSize: '0.75rem' }}>Surface</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#4a5568', fontSize: '0.75rem' }}>Pt. Balance</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#4a5568', fontSize: '0.75rem' }}>Ins. Balance</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {claim.procedures.map((proc, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{proc.dos || '—'}</TableCell>
                                      <TableCell sx={{ fontSize: '0.75rem' }}>{proc.tooth || '—'}</TableCell>
                                      <TableCell sx={{ fontSize: '0.75rem' }}>{proc.surface || '—'}</TableCell>
                                      <TableCell sx={{ fontSize: '0.75rem' }}>{proc.ptBalance || '—'}</TableCell>
                                      <TableCell sx={{ fontSize: '0.75rem' }}>{proc.insBalance || '—'}</TableCell>
                                    </TableRow>
                                  ))}
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
        )}
      </TableContainer>

      {/* Pagination for Batch Invoices */}
      {activeTab === 'BATCH INVOICES' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2.5, gap: 1.5 }}>
          <Button
            disabled
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#a0aec0',
              minWidth: 'auto',
              '&.Mui-disabled': { color: '#cbd5e1' }
            }}
          >
            ‹ Prev
          </Button>
          <Typography sx={{ fontSize: '0.85rem', color: '#718096', fontWeight: 500 }}>
            Page 1 of 1 · <strong style={{ color: '#1a3a6b' }}>{invoicePatients.length} patients total</strong>
          </Typography>
          <Button
            disabled
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#a0aec0',
              minWidth: 'auto',
              '&.Mui-disabled': { color: '#cbd5e1' }
            }}
          >
            Next ›
          </Button>
        </Box>
      )}

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
            <Button
              variant="contained"
              startIcon={<UploadIcon sx={{ fontSize: 16 }} />}
              disabled={uploadingEob}
              onClick={handleEobUpload}
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

      {/* 3. ADD NEW BATCH PAYMENT MODAL */}
      <Dialog open={openAddPaymentModal} onClose={() => setOpenAddPaymentModal(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '6px', height: '600px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e6ed', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a3a6b', fontSize: '1.1rem' }}>
            Insurance New Payment
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="contained" sx={{ bgcolor: '#7994c6', textTransform: 'none', fontWeight: 600, borderRadius: '4px', '&:hover': { bgcolor: '#627cb3' }, boxShadow: 'none' }}>
              Next: Payment Allocation
            </Button>
            <IconButton onClick={() => setOpenAddPaymentModal(false)} size="small" sx={{ color: '#1a3a6b' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'row', bgcolor: '#f4f6f8' }}>
          {/* Left Sidebar (Stepper) */}
          <Box sx={{ width: '220px', borderRight: '1px solid #e0e6ed', bgcolor: '#f4f6f8', pt: 4, px: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Step 1 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
              <Box sx={{ zIndex: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: '#1a3a6b', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                 <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1a3a6b' }}>Claims Selection</Typography>
              <Box sx={{ position: 'absolute', left: 18, top: 25, bottom: -35, width: '2px', bgcolor: '#e0e6ed' }} />
            </Box>
            {/* Step 2 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
              <Box sx={{ zIndex: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: '#f4f6f8', border: '2px solid #cbd5e1', ml: 1 }} />
              <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#718096' }}>Payment Allocation</Typography>
              <Box sx={{ position: 'absolute', left: 18, top: 25, bottom: -35, width: '2px', bgcolor: '#e0e6ed' }} />
            </Box>
            {/* Step 3 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
              <Box sx={{ zIndex: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: '#f4f6f8', border: '2px solid #cbd5e1', ml: 1 }} />
              <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', color: '#718096' }}>Payment Method</Typography>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', gap: 3 }}>
            {/* Left Column: Search and Claims */}
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Search Box */}
              <Paper sx={{ p: 2, borderRadius: '6px', border: '1px solid #e0e6ed', boxShadow: 'none' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', mb: 1 }}>Search By:</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 1.5, ml: 0 }}>
                  <FormControlLabel
                    value="Carrier"
                    control={<Radio size="small" checked sx={{ p: 0.5, color: '#1a3a6b', '&.Mui-checked': { color: '#1a3a6b' } }} />}
                    label={<Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>Carrier</Typography>}
                    sx={{ m: 0 }}
                  />
                  <FormControlLabel
                    value="Patient"
                    control={<Radio size="small" checked={false} sx={{ p: 0.5, color: '#cbd5e1' }} />}
                    label={<Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>Patient</Typography>}
                    sx={{ m: 0 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search for Carrier"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7994c6', fontSize: 18 }} /></InputAdornment>
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Paper>

              {/* Claims Box */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', ml: 0.5, textTransform: 'uppercase' }}>Claims</Typography>
                <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: '6px', border: '1px solid #e0e6ed', boxShadow: 'none', bgcolor: '#f8fafc', minHeight: '150px' }}>
                  <Box sx={{ color: '#1a3a6b', mb: 1 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                      <line x1="3" y1="3" x2="21" y2="21"></line>
                    </svg>
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a3a6b', mb: 0.5 }}>No Claims Yet</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#718096' }}>Start by searching for a carrier or patient and select it</Typography>
                </Paper>
              </Box>
            </Box>

            {/* Right Column: Selected Claims */}
            <Box sx={{ flex: 1.2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', ml: 0.5, textTransform: 'uppercase' }}>Selected Claims</Typography>
                <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: '6px', border: '1px solid #e0e6ed', boxShadow: 'none', bgcolor: '#f8fafc', minHeight: '150px' }}>
                  <Box sx={{ color: '#1a3a6b', mb: 1 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                      <line x1="3" y1="3" x2="21" y2="21"></line>
                    </svg>
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a3a6b', mb: 0.5 }}>No Claims Selected Yet</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#718096', textAlign: 'center' }}>Start by selecting claims from the list on the left</Typography>
                </Paper>
              </Box>
            </Box>
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
