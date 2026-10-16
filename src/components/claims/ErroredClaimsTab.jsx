import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { CARRIERS, CLAIM_TYPES, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';
import ClearinghouseMessageDialog from './ClearinghouseMessageDialog';

import { useFilteredClaimTab } from './useFilteredClaimTab';

const DEFAULT_FILTERS = {
    sort: 'none', attachment: 'all', status: 'all', carrier: 'all',
    claimType: 'all', filterDate: 'all', search: '',
};

const ErroredClaimsTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [showHidden, setShowHidden] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  const [rejectionReasonClaim, setRejectionReasonClaim] = useState(null);
  const { filteredClaims, loadingClaims, loadError, loadData } =
    useFilteredClaimTab('errored', filters, customDateRange, showHidden, false);
  const {    changeStatus, voidAndRecreate, toggleHide, printPage, exportCSV} = useClaimActions(loadData);

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
    setSelectedClaims({});
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
      tabTitle: 'Errored Claims',
      filters,
      customDateRange,
    });
  };

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
      {loadingClaims && <Typography sx={{ py: 1 }}>Loading claims...</Typography>}
      {loadError && <Typography color="error" sx={{ py: 1 }}>{loadError}</Typography>}
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
            onClick: handlePrint,
            disabled: false,
          },
        ]}
      />

      <StandardClaimsTable
        activeTab={1} // Errored is index 1
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
        handleOpenEdit={onOpenEdit}
        handleOpenAttach={onOpenAttach}
        handleOpenPreview={onOpenPreview}
        handleOpenRejectionReason={(claim) => setRejectionReasonClaim(claim)}
      />

      <ClearinghouseMessageDialog 
        open={!!rejectionReasonClaim} 
        onClose={() => setRejectionReasonClaim(null)} 
        claim={rejectionReasonClaim} 
      />
    </Box>
  );
};

export default ErroredClaimsTab;
