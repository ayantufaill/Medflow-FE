import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';
import { claimService } from '../../services/claim.service';
import { invoiceService } from '../../services/invoice.service';
import { insuranceCompanyService } from '../../services/insurance.service';
import BatchTabs from '../../components/claims/batch-actions/BatchTabs';
import BatchPaymentsTab from '../../components/claims/batch-actions/BatchPaymentsTab';
import BatchInvoicesTab from '../../components/claims/batch-actions/BatchInvoicesTab';
import BatchClaimsTab from '../../components/claims/batch-actions/BatchClaimsTab';
import { headingSecondarySx, fontSize, fontWeight } from '../../constants/styles';
import { ReportFilterBar, ReportSelect, ReportSearchInput } from '../../components/reports/ui';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Popover,
  FormGroup,
  Divider,
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

import ClaimBreakdownDetailsModal from '../../components/claims/batch-actions/modals/ClaimBreakdownDetailsModal';
import ManageEOBModal from '../../components/claims/batch-actions/modals/ManageEOBModal';
import AddPaymentModal from '../../components/claims/batch-actions/modals/AddPaymentModal';
import AddInvoiceModal from '../../components/claims/batch-actions/modals/AddInvoiceModal';


export default function BatchActionsPage() {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('INSURANCE BATCH PAYMENT');

  // Search & Basic Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCarriers, setSelectedCarriers] = useState([]);
  const [sortReportBy, setSortReportBy] = useState('Date of Service');
  const [allCarriers, setAllCarriers] = useState([]);

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
      const fetchedPayments = data.payments || [];
      setBatchPayments(fetchedPayments);
      return fetchedPayments;
    } catch (error) {
      console.error('Failed to load batch payments:', error);
      return [];
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

  const loadCarriers = async () => {
    try {
      const data = await insuranceCompanyService.getAllInsuranceCompanies(1, 1000, '', 'active');
      const fetchedCarriers = (data.companies || []).map(c => c.name).sort();
      setAllCarriers(fetchedCarriers);
      if (fetchedCarriers.length > 0) {
        setNewPaymentCarrier(fetchedCarriers[0]);
      }
    } catch (error) {
      console.error('Failed to load carriers:', error);
    }
  };

  // Run on mount
  useEffect(() => {
    loadBatchPayments();
    loadPendingProcedures();
    loadPendingClaims();
    loadAllocations();
    loadCarriers();
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

      const matchesCarrier = selectedCarriers.length === 0 || selectedCarriers.some(c => payment.carrier.toLowerCase().includes(c.toLowerCase()));
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.some(s => payment.status.toLowerCase() === s.toLowerCase());

      return matchesSearch && matchesCarrier && matchesStatus;
    });
  }, [batchPayments, searchQuery, selectedCarriers, selectedStatuses]);

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
    if (!file || !selectedBatchPayment) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', `EOB for Batch ${selectedBatchPayment.paymentRef}`);

    setUploadingEob(true);
    try {
      await claimService.uploadEOB(selectedBatchPayment.id, formData);
      const updatedPayments = await loadBatchPayments();
      if (updatedPayments && selectedBatchPayment) {
        const refreshed = updatedPayments.find((p) => p.id === selectedBatchPayment.id);
        if (refreshed) {
          setSelectedBatchPayment(refreshed);
        }
      }
    } catch (error) {
      alert(`EOB upload failed: ${error.message}`);
    } finally {
      setUploadingEob(false);
    }
  };

  // Handle EOB Deletion
  const handleDeleteEob = async (eobId, filename) => {
    if (!selectedBatchPayment) return;
    if (!window.confirm(`Are you sure you want to delete ${filename || 'this EOB'}?`)) return;
    try {
      await claimService.deleteEOB(selectedBatchPayment.id, eobId);
      const updatedPayments = await loadBatchPayments();
      if (updatedPayments && selectedBatchPayment) {
        const refreshed = updatedPayments.find((p) => p.id === selectedBatchPayment.id);
        if (refreshed) {
          setSelectedBatchPayment(refreshed);
        }
      }
    } catch (error) {
      alert(`Failed to delete EOB: ${error.message}`);
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
    <Box sx={{ display: 'flex', width: '100%', gap: '8px', p: '8px', backgroundColor: '#f8f9fa', height: 'calc(100vh - 65px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ position: 'relative', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', fontFamily: 'Inter' }}>Batch Actions</Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, borderBottom: '1px solid #e2e8f0' }}>
          <BatchTabs 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSearchQuery('');
            }} 
          />
        </Box>

        {/* Filter & action bars */}
      {activeTab === 'INSURANCE BATCH PAYMENT' ? (
        <ReportFilterBar
          topRowFilters={
            <>
              <ReportSearchInput placeholder="Search payments…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Button variant="outlined" size="small" startIcon={<RefreshIcon sx={{ fontSize: 15 }} />} onClick={handleRefreshBatchPayments}
                sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b', bgcolor: '#f8fafc', borderRadius: '6px', px: 2, fontWeight: 600, fontSize: '0.85rem', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f1f5f9' } }}
              >
                Refresh
              </Button>
            </>
          }
          topRowActions={
            <>
              <Button variant="outlined" size="small" startIcon={<FilterIcon sx={{ fontSize: 15 }} />} onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: filterAnchorEl ? '#2362EF' : '#64748b', bgcolor: filterAnchorEl ? '#eff6ff' : '#f8fafc', borderRadius: '6px', px: 2, fontWeight: 600, fontSize: '0.85rem', '&:hover': { borderColor: '#cbd5e1', bgcolor: filterAnchorEl ? '#eff6ff' : '#f1f5f9' } }}
              >
                Filter
              </Button>
              <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 15 }} />} onClick={() => setOpenAddPaymentModal(true)}
                sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' } }}
              >
                Add New Payment
              </Button>
            </>
          }
          middleRowFilters={null}
          onClearAll={null}
          onApplyFilters={null}
        />
      ) : activeTab === 'BATCH INVOICES' ? (
        <ReportFilterBar
          topRowFilters={
            <ReportSelect label="SORT BY" value={sortReportBy} onChange={(e) => setSortReportBy(e.target.value)} options={[{value: 'Date of Service', label: 'Date of Service'}, {value: 'Patient Name', label: 'Patient Name'}, {value: 'Provider', label: 'Provider'}]} />
          }
          topRowActions={
            <>
              <Button variant="outlined" size="small" disabled={!hasSelectedPatients} onClick={handleUncompleteProcedures}
                sx={{ textTransform: 'none', borderColor: '#ef4444', color: '#ef4444', borderRadius: '6px', px: 2, py: 0.7, fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: 'rgba(239,68,68,0.05)', borderColor: '#dc2626', color: '#dc2626' }, '&.Mui-disabled': { opacity: 0.4, borderColor: '#ef4444' } }}
              >Un-complete</Button>
              <Button variant="contained" size="small" disabled={!hasSelectedPatients} onClick={() => setOpenAddInvoiceModal(true)}
                sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, py: 0.7, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' }, '&.Mui-disabled': { opacity: 0.45, bgcolor: '#2362EF', color: 'white' } }}
              >Batch Invoices</Button>
              <Button variant="outlined" size="small" onClick={() => alert('Opening invoice print generation spooler...')} startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
                sx={{ textTransform: 'none', borderColor: '#2362EF', color: '#2362EF', borderRadius: '8px', px: 2, py: 0.7, fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#eff6ff', borderColor: '#1D53CC' } }}
              >Print</Button>
            </>
          }
        />
      ) : (
        <ReportFilterBar
          topRowFilters={
            <>
              <ReportSelect label="SORT BY" value={sortReportBy} onChange={(e) => setSortReportBy(e.target.value)} options={[{value: 'Date of Service', label: 'Date of Service'}, {value: 'Patient Name', label: 'Patient Name'}]} />
              <ReportSelect label="CLAIM TYPE" value={filterClaimType} onChange={(e) => setFilterClaimType(e.target.value)} options={[{value: 'All', label: 'All'}, {value: 'Manual & Electronic', label: 'Manual & Electronic'}]} />
              <ReportSelect label="CARRIER" value={filterClaimsCarrier} onChange={(e) => setFilterClaimsCarrier(e.target.value)} options={[{value: 'All', label: 'All'}, {value: 'Membership Payer', label: 'Membership Payer'}]} />
            </>
          }
          topRowActions={null}
          bottomRowLeftActions={
            <>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, mr: 1 }}>
                {filteredClaimsList.length} claim(s)
              </Typography>
              <Button variant="contained" size="small" disabled={!hasSelectedClaims} onClick={handlePackAndSubmitClaims}
                sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, py: 0.7, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' }, '&.Mui-disabled': { opacity: 0.45, bgcolor: '#2362EF', color: 'white' } }}
              >Send Claims ▾</Button>
              <Button variant="outlined" size="small" onClick={() => alert('Opening claim forms print queue spooler...')} startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
                sx={{ textTransform: 'none', borderColor: '#2362EF', color: '#2362EF', borderRadius: '8px', px: 2, py: 0.7, fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#eff6ff', borderColor: '#1D53CC' } }}
              >Print</Button>
            </>
          }
          bottomRowFilters={
            <>
              <ReportSearchInput placeholder="Search claims…" value={claimsSearchQuery} onChange={(e) => setClaimsSearchQuery(e.target.value)} />
              <FormControlLabel
                control={<Checkbox checked={excludeClosedInvoices} onChange={(e) => setExcludeClosedInvoices(e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' }, p: 0.5 }} />}
                label={<Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Exclude closed invoices</Typography>}
              />
            </>
          }
        />
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
          <Button disabled size="small" sx={{ textTransform: 'none', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, '&.Mui-disabled': { color: '#64748b' } }}>
            ‹ Prev
          </Button>
          <Typography sx={{ fontSize: fontSize.base, color: '#475569', fontWeight: fontWeight.medium }}>
            Page 1 of 1 · <strong style={{ color: '#1e293b' }}>{invoicePatients.length} patients total</strong>
          </Typography>
          <Button disabled size="small" sx={{ textTransform: 'none', fontSize: fontSize.sm, fontWeight: fontWeight.semibold, '&.Mui-disabled': { color: '#64748b' } }}>
            Next ›
          </Button>
        </Box>
      )}

          </Box>{/* close p:3 scroll */}
        </Box>{/* close white card */}
      </Box>{/* close column */}

      {/* -------------------- MODALS & DIALOGS -------------------- */}

      <ClaimBreakdownDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        selectedBatchPayment={selectedBatchPayment}
      />

      <ManageEOBModal
        open={openEOBModal}
        onClose={() => setOpenEOBModal(false)}
        selectedBatchPayment={selectedBatchPayment}
        uploadingEob={uploadingEob}
        handleEobUpload={handleEobUpload}
        handleDeleteEob={handleDeleteEob}
      />

      <AddPaymentModal
        open={openAddPaymentModal}
        onClose={() => setOpenAddPaymentModal(false)}
        activeModalStep={activeModalStep}
        setActiveModalStep={setActiveModalStep}
        allocations={allocations}
        setAllocations={setAllocations}
        searchType={searchType}
        setSearchType={setSearchType}
        allocationsSearchQuery={allocationsSearchQuery}
        setAllocationsSearchQuery={setAllocationsSearchQuery}
        newPaymentRef={newPaymentRef}
        setNewPaymentRef={setNewPaymentRef}
        checkAmount={checkAmount}
        setCheckAmount={setCheckAmount}
        newPaymentCarrier={newPaymentCarrier}
        setNewPaymentCarrier={setNewPaymentCarrier}
        newPaymentDate={newPaymentDate}
        setNewPaymentDate={setNewPaymentDate}
        handleSaveBatchPayment={handleSaveBatchPayment}
        allCarriers={allCarriers}
      />

      <AddInvoiceModal
        open={openAddInvoiceModal}
        onClose={() => setOpenAddInvoiceModal(false)}
        selectedPatients={selectedPatients}
        newInvoiceDelivery={newInvoiceDelivery}
        setNewInvoiceDelivery={setNewInvoiceDelivery}
        handleSaveBatchInvoice={handleSaveBatchInvoice}
      />

      {/* FILTER POPOVER FOR BATCH PAYMENTS */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, width: 300, mt: 1, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' } }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>BY STATUS</Typography>
          <FormGroup>
            {['PENDING', 'PROCESSING', 'COMPLETED', 'PARTIALLY SUCCESSFUL', 'FAILED'].map(status => (
              <FormControlLabel
                key={status}
                control={<Checkbox size="small" checked={selectedStatuses.includes(status)} onChange={(e) => {
                  if (e.target.checked) setSelectedStatuses([...selectedStatuses, status]);
                  else setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                }} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }} />}
                label={<Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>{status}</Typography>}
                sx={{ ml: 0 }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>BY CARRIER</Typography>
          <FormGroup>
            {allCarriers.length > 0 ? allCarriers.map(carrier => (
              <FormControlLabel
                key={carrier}
                control={<Checkbox size="small" checked={selectedCarriers.includes(carrier)} onChange={(e) => {
                  if (e.target.checked) setSelectedCarriers([...selectedCarriers, carrier]);
                  else setSelectedCarriers(selectedCarriers.filter(c => c !== carrier));
                }} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }} />}
                label={<Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>{carrier}</Typography>}
                sx={{ ml: 0 }}
              />
            )) : (
              <Typography sx={{ fontSize: '0.8rem', color: '#718096', fontStyle: 'italic', ml: 1 }}>No carriers found</Typography>
            )}
          </FormGroup>
        </Box>
      </Popover>
    </Box>
  );
}
