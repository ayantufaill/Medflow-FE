import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_TYPES, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';
import { mapClaimFields } from './claimUtils';
import { applyDateFilter } from './claimFilterUtils';

const HistoryClaimsTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  
  const [filters, setFilters] = useState({
    sort: 'none',
    attachment: 'all',
    status: 'all',
    carrier: 'all',
    claimType: 'all',
    filterDate: 'all',
    search: '',
  });
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });

  const [showHidden, setShowHidden] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  
  const {
    loading, changeStatus, voidAndRecreate, toggleHide, printPage, exportCSV
  } = useClaimActions(loadData);

  useEffect(() => {
    loadData();
    const handleRefresh = () => loadData();
    window.addEventListener('refresh-claims', handleRefresh);
    return () => window.removeEventListener('refresh-claims', handleRefresh);
  }, []);

  async function loadData() {
    setLoadingClaims(true);
    try {
      const data = await claimService.getAllClaims({ tab: 'history' });
      const claimsData = (data.claims || []).map(c => mapClaimFields(c, 'history'));
      setClaims(claimsData);
      applyFilters(claimsData, filters, showHidden);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClaims(false);
    }
  }

  const applyFilters = (data, currentFilters, hidden, dateRange = customDateRange) => {
    let result = applyDateFilter([...data], currentFilters.filterDate, dateRange, 'createdDate');

    if (!hidden) {
      result = result.filter(c => !c.isHidden);
    }

    if (currentFilters.attachment === 'yes') result = result.filter(c => c.attachments?.length > 0 || c.redAttachment || c.attachmentColor);
    if (currentFilters.attachment === 'no') result = result.filter(c => !c.attachments?.length && !c.redAttachment && !c.attachmentColor);
    if (currentFilters.status !== 'all') result = result.filter(c => c.status === currentFilters.status);
    if (currentFilters.carrier !== 'all') result = result.filter(c => c.carrier === currentFilters.carrier);
    if (currentFilters.claimType !== 'all') result = result.filter(c => c.claimType && c.claimType.includes(currentFilters.claimType));
    
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.patientName?.toLowerCase().includes(q) ||
          c.claimNumber?.toLowerCase().includes(q)
      );
    }

    if (currentFilters.sort === 'date') {
      result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    } else if (currentFilters.sort === 'name') {
      result.sort((a, b) => (a.patientName || '').localeCompare(b.patientName || ''));
    }

    setFilteredClaims(result);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(claims, newFilters, showHidden, customDateRange);
  };

  const handleCustomDateRangeChange = (range) => {
    setCustomDateRange(range);
    applyFilters(claims, filters, showHidden, range);
  };

  const handleRowStatusChange = async (claimId, newStatus) => {
    try {
      await claimService.quickStatusUpdate(claimId, newStatus, "Status updated from History tab");
      window.dispatchEvent(new CustomEvent('refresh-claims'));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status: " + (err.message || err));
    }
  };

  const handleClearAll = () => {
    const defaultFilters = {
      carrier: 'all',
      claimType: 'all',
      attachment: 'all',
      status: 'all',
      filterDate: 'all',
      search: '',
    };
    setFilters(defaultFilters);
    setCustomDateRange({ start: null, end: null });
    applyFilters(claims, defaultFilters, showHidden, { start: null, end: null });
  };

  const handleToggleHidden = (val) => {
    setShowHidden(val);
    applyFilters(claims, filters, val);
  };

  // Selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = {};
      filteredClaims.forEach((c) => { newSelected[c.id] = true; });
      setSelectedClaims(newSelected);
    } else {
      setSelectedClaims({});
    }
  };

  const handleSelectSubset = (subset) => {
    const newSelected = {};
    if (subset === 'all') {
      filteredClaims.forEach((c) => { newSelected[c.id] = true; });
    }
    setSelectedClaims(newSelected);
    setSelectAllAnchorEl(null);
  };

  const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);

  const panelFilters = [
    {
      key: 'sort',
      label: 'Sort Report By:',
      width: '140px',
      value: filters.sort || 'none',
      options: SORT_REPORT_OPTIONS,
      onChange: (val) => handleFilterChange('sort', val),
    },
    {
      key: 'attachment',
      label: 'Claim Attachment:',
      width: '140px',
      value: filters.attachment,
      options: [
        { value: 'all', label: 'All' },
        { value: 'withAttachments', label: 'With Attachments' },
        { value: 'withoutAttachments', label: 'Without Attachments' },
        { value: 'unsentAttachments', label: 'Unsent Attachments' },
        { value: 'sentAttachments', label: 'Sent Attachments' },
        { value: 'erroredAttachments', label: 'Errored Attachments' }
      ],
      onChange: (val) => handleFilterChange('attachment', val),
    },
    {
      key: 'status',
      label: 'Claim Status:',
      width: '140px',
      value: filters.status,
      options: CLAIM_STATUSES,
      onChange: (val) => handleFilterChange('status', val),
    },
    {
      key: 'filterDate',
      label: 'Filter by Date:',
      width: '140px',
      value: filters.filterDate || 'all',
      options: FILTER_DATE_OPTIONS,
      onChange: (val) => handleFilterChange('filterDate', val),
    },
    {
      key: 'claimType',
      label: 'Filter by Claim Type:',
      width: '140px',
      value: filters.claimType,
      options: CLAIM_TYPES,
      onChange: (val) => handleFilterChange('claimType', val),
    },
    {
      key: 'carrier',
      label: 'Filter by Carrier:',
      width: '140px',
      value: filters.carrier,
      options: CARRIERS,
      onChange: (val) => handleFilterChange('carrier', val),
    },
  ];

  return (
    <Box>
      <ClaimFilterPanel
        filters={panelFilters}
        searchValue={filters.search}
        onSearchChange={(v) => handleFilterChange('search', v)}
        checkboxes={[
          { label: 'Show Hidden Claims', checked: showHidden, onChange: handleToggleHidden }
        ]}
        onRefresh={loadData}
        onClearAll={handleClearAll}
        customDateRange={customDateRange}
        onCustomDateRangeChange={handleCustomDateRangeChange}
      />

      <ClaimAlertBar
        claimCount={filteredClaims.length}
        hasSelection={selectedIds.length > 0}
        selectedCount={selectedIds.length}
        actions={[
          {
            label: 'Change Status',
            variant: 'outlined',
            onClick: () => changeStatus(selectedIds, 'draft'),
          },
          {
            label: 'Void and Recreate',
            variant: 'default',
            onClick: () => voidAndRecreate(selectedIds),
          },
          {
            label: 'Export CSV',
            variant: 'export',
            icon: 'export',
            onClick: () => {
              if (typeof exportCSV === 'function') {
                exportCSV(filteredClaims);
              } else {
                console.warn('exportCSV not defined');
              }
            },
            disabled: false,
          },
          {
            label: 'Print',
            variant: 'print',
            icon: 'print',
            onClick: () => printPage(),
            disabled: false,
          },
        ]}
      />

      <StandardClaimsTable
        activeTab={3} // History is index 3
        filteredClaims={filteredClaims}
        selectedClaims={selectedClaims}
        handleSelectAll={handleSelectAll}
        handleSelectAllMenuOpen={(e) => setSelectAllAnchorEl(e.currentTarget)}
        isSelectAllMenuOpen={Boolean(selectAllAnchorEl)}
        handleSelectAllMenuClose={() => setSelectAllAnchorEl(null)}
        handleSelectSubset={handleSelectSubset}
        selectAllAnchorEl={selectAllAnchorEl}
        handleSelectClaim={(id) => setSelectedClaims((prev) => ({ ...prev, [id]: !prev[id] }))}
        toggleProcedures={(id) => setExpandedProcedures(prev => ({ ...prev, [id]: !prev[id] }))}
        expandedProcedures={expandedProcedures}
        handleToggleHide={toggleHide}
        handleRowStatusChange={handleRowStatusChange}
        handleOpenEdit={onOpenEdit}
        handleOpenAttach={onOpenAttach}
        handleOpenPreview={onOpenPreview}
      />
    </Box>
  );
};

export default HistoryClaimsTab;
