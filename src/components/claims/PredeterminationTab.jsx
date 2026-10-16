import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { CARRIERS, CLAIM_TYPES, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';

import { useFilteredClaimTab } from './useFilteredClaimTab';

const DEFAULT_FILTERS = {
    sort: 'none', claimType: 'all', carrier: 'all', attachment: 'all',
    status: 'all', filterDate: 'all', searchPatient: '', searchClaim: '',
};

const PredeterminationTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [showHidden, setShowHidden] = useState(false);
  const [showInactivePolicies, setShowInactivePolicies] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  const { filteredClaims, loadingClaims, loadError, loadData } =
    useFilteredClaimTab('predetermination', filters, customDateRange, showHidden, showInactivePolicies);
  const { changeStatus, convertType, sendClaims, printPage, deleteClaim, toggleHide } = useClaimActions(loadData);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setSelectedClaims({});
  };
  const handleCustomDateRangeChange = (range) => {
    setCustomDateRange(range);
    setSelectedClaims({});
  };
  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setCustomDateRange({ start: null, end: null });
    setShowHidden(false);
    setShowInactivePolicies(false);
  };
  const handleToggleHidden = (value) => {
    setShowHidden(value);
    setSelectedClaims({});
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

  const handlePrint = () => {
    const claimsToPrint = selectedIds.length > 0
      ? filteredClaims.filter((c) => selectedClaims[c.id])
      : filteredClaims;
    printPage({
      claims: claimsToPrint,
      tabTitle: 'Predeterminations',
      filters,
      customDateRange,
    });
  };

  const panelFilters = [
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
      label: 'Filter by Claim Status:',
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
  ];

  return (
    <Box>
      {loadingClaims && <Typography sx={{ py: 1 }}>Loading claims...</Typography>}
      {loadError && <Typography color="error" sx={{ py: 1 }}>{loadError}</Typography>}
      <ClaimFilterPanel
        filters={panelFilters}
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
          { label: 'Show Predeterminations for Inactive Policies', checked: showInactivePolicies, onChange: (value) => { setShowInactivePolicies(value); setSelectedClaims({}); } },
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
            label: 'Convert Claims',
            variant: 'outlined',
            onClick: () => convertType(selectedIds, 'paper'),
          },
          {
            label: 'Change Status',
            variant: 'outlined',
            onClick: () => changeStatus(selectedIds, 'manualClaim'),
          },
          {
            label: 'Send Predeterminations',
            variant: 'send',
            icon: 'send',
            onClick: () => sendClaims(selectedIds),
          },
          {
            label: 'Print',
            variant: 'print',
            icon: 'print',
            onClick: handlePrint,
            disabled: false,
          },
        ]}
      />

      <StandardClaimsTable
  activeTab={5} // Predetermination is index 5
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
  handleRowStatusChange={(id, newStatus) => changeStatus([id], newStatus, 'predetermination')}
  handleDeletePredetermination={(id) => deleteClaim(id)}
  handleOpenEdit={onOpenEdit}
  handleOpenAttach={onOpenAttach}
  handleOpenPreview={onOpenPreview}
/>
    </Box>
  );
};

export default PredeterminationTab;
