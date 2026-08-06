import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_TYPES } from '../../pages/claims/claimsConstants';
import { mapClaimFields } from './claimUtils';

const OutstandingClaimsTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  
  const [filters, setFilters] = useState({
    sort: 'none',
    claimType: 'all',
    carrier: 'all',
    attachment: 'all',
    status: 'all',
    dateRange: 'none',
    groupBy: 'none',
    searchPatient: '',
    searchClaim: '',
  });

  const [showNonAssignment, setShowNonAssignment] = useState(false);
  const [showInactivePolicies, setShowInactivePolicies] = useState(false);

  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  
  const { loading, changeStatus, voidAndRecreate, printPage, exportCSV, toggleHide } = useClaimActions(loadData);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoadingClaims(true);
    try {
      const data = await claimService.getAllClaims({ tab: 'outstanding' });
      const claimsData = (data.claims || []).map(c => mapClaimFields(c, 'outstanding'));
      setClaims(claimsData);
      applyFilters(claimsData, filters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClaims(false);
    }
  }

  const applyFilters = (data, currentFilters) => {
    let result = [...data];
    if (currentFilters.carrier !== 'all') {
      result = result.filter((c) => c.carrier === currentFilters.carrier);
    }
    if (currentFilters.claimType !== 'all') {
      result = result.filter((c) => c.claimType && c.claimType.includes(currentFilters.claimType));
    }
    if (currentFilters.status !== 'all') {
      result = result.filter(c => c.status === currentFilters.status);
    }
    if (currentFilters.attachment === 'yes') {
      result = result.filter(c => c.attachments?.length > 0 || c.redAttachment || c.attachmentColor);
    }
    if (currentFilters.attachment === 'no') {
      result = result.filter(c => !c.attachments?.length && !c.redAttachment && !c.attachmentColor);
    }
    // Simple date range mock logic
    if (currentFilters.dateRange !== 'all') {
      // In a real app, you would parse the date and compare
    }
    if (currentFilters.searchPatient) {
      const q = currentFilters.searchPatient.toLowerCase();
      result = result.filter(c => c.patientName?.toLowerCase().includes(q));
    }
    if (currentFilters.searchClaim) {
      const q = currentFilters.searchClaim.toLowerCase();
      result = result.filter(c => c.claimNumber?.toLowerCase().includes(q));
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
    applyFilters(claims, newFilters);
  };

  const handleClearAll = () => {
    const defaultFilters = {
      sort: 'none',
      claimType: 'all',
      carrier: 'all',
      attachment: 'all',
      status: 'all',
      dateRange: 'none',
      groupBy: 'none',
      searchPatient: '',
      searchClaim: '',
    };
    setFilters(defaultFilters);
    applyFilters(claims, defaultFilters);
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
      options: [
        { value: 'none', label: 'None' },
        { value: 'date', label: 'Date (Newest)' },
        { value: 'name', label: 'Patient Name' }
      ],
      onChange: (val) => handleFilterChange('sort', val),
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
    {
      key: 'attachment',
      label: 'Filter by Claim Attachment:',
      width: '140px',
      value: filters.attachment,
      options: [
        { value: 'all', label: 'All' },
        { value: 'yes', label: 'Has Attachments' },
        { value: 'no', label: 'No Attachments' },
      ],
      onChange: (val) => handleFilterChange('attachment', val),
    },
    {
      key: 'status',
      label: 'Filter by Claim Status:',
      width: '140px',
      value: filters.status,
      options: [
        { value: 'all', label: 'All' },
        { value: 'readyForSubmission', label: 'Ready for Submission' },
        { value: 'validationError', label: 'Validation Error' },
        { value: 'draft', label: 'Draft' },
      ],
      onChange: (val) => handleFilterChange('status', val),
    },
  ];

  const bottomPanelFilters = [
    {
      key: 'dateRange',
      label: 'Group Date By Range:',
      width: '140px',
      value: filters.dateRange,
      options: [
        { value: 'none', label: 'None' },
        { value: 'dos', label: 'DOS' },
        { value: '0-30', label: '0-30 days' },
        { value: '31-60', label: '31-60 days' },
        { value: '61-90', label: '61-90 days' },
        { value: '>90', label: '>90 days' },
      ],
      onChange: (val) => handleFilterChange('dateRange', val),
    },
    {
      key: 'groupBy',
      label: 'Group By:',
      width: '140px',
      value: filters.groupBy,
      options: [
        { value: 'none', label: 'None' },
        { value: 'carrier', label: 'Carrier' },
        { value: 'patient', label: 'Patient' },
      ],
      onChange: (val) => handleFilterChange('groupBy', val),
    },
  ];

  return (
    <Box>
      <ClaimFilterPanel
        filters={panelFilters}
        bottomRowFilters={bottomPanelFilters}
        searchPlaceholder="Search by .."
        searchValue={filters.searchPatient}
        onSearchChange={(v) => handleFilterChange('searchPatient', v)}
        extraSearchInputs={[
          {
            placeholder: 'Search by claim # or sent dat',
            value: filters.searchClaim,
            onChange: (v) => handleFilterChange('searchClaim', v)
          }
        ]}
        checkboxes={[
          { label: 'Show Non-Assignment Claims', checked: showNonAssignment, onChange: setShowNonAssignment },
          { label: 'Show Claims for Inactive Policies', checked: showInactivePolicies, onChange: setShowInactivePolicies }
        ]}
        onRefresh={loadData}
        onClearAll={handleClearAll}
      />

      <ClaimAlertBar
        claimCount={filteredClaims.length}
        hasSelection={selectedIds.length > 0}
        selectedCount={selectedIds.length}
        actions={[
          {
            label: 'Export CSV',
            variant: 'export',
            icon: 'export',
            onClick: () => exportCSV(filteredClaims),
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
        activeTab={4} // Outstanding is index 4
        filteredClaims={filteredClaims}
        dateRange={filters.dateRange}
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
        handleRevalidate={(id) => {}}
        handleNoteOpen={() => {}}
        handleOpenEdit={onOpenEdit}
        handleOpenAttach={onOpenAttach}
        handleOpenPreview={onOpenPreview}
        handleToggleHide={toggleHide}
      />
    </Box>
  );
};

export default OutstandingClaimsTab;
