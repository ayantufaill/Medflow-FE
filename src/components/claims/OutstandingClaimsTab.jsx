import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';
import { mapClaimFields } from './claimUtils';
import { groupOutstandingClaims } from './outstandingClaimGroups';
import { getOutstandingDateBounds } from './outstandingDateBounds';

const DEFAULT_FILTERS = {
  sort: 'none', claimType: 'all', carrier: 'all', attachment: 'all',
  status: 'all', dateRange: 'none', filterDate: 'all', groupBy: 'none',
  searchPatient: '', searchClaim: '',
};

const OutstandingClaimsTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [loadError, setLoadError] = useState('');
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });

  const [showNonAssignment, setShowNonAssignment] = useState(false);
  const [showInactivePolicies, setShowInactivePolicies] = useState(false);

  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  const requestId = useRef(0);

  const loadData = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoadingClaims(true);
    setLoadError('');
    setFilteredClaims([]);
    try {
      const dateBounds = getOutstandingDateBounds(filters.filterDate, customDateRange);
      const options = {
        tab: 'outstanding', limit: 100,
        outstandingSort: filters.sort,
        outstandingClaimType: filters.claimType,
        outstandingCarrier: filters.carrier,
        outstandingAttachment: filters.attachment,
        outstandingStatus: filters.status,
        outstandingDate: filters.filterDate,
        outstandingStart: dateBounds.start,
        outstandingEnd: dateBounds.end,
        outstandingPatient: filters.searchPatient,
        outstandingClaim: filters.searchClaim,
        includeNonAssignment: showNonAssignment,
        includeInactivePolicies: showInactivePolicies,
      };
      const result = [];
      let page = 1;
      let pages = 1;
      do {
        const data = await claimService.getAllClaims({ ...options, page });
        if (currentRequest !== requestId.current) return;
        result.push(...(data.claims || []).map((claim) => mapClaimFields(claim, 'outstanding')));
        pages = data.pagination?.pages || 1;
        page += 1;
      } while (page <= pages);
      setFilteredClaims(result);
    } catch (err) {
      console.error(err);
      if (currentRequest === requestId.current) {
        setFilteredClaims([]);
        setLoadError('Could not load outstanding claims. Use Refresh to try again.');
      }
    } finally {
      if (currentRequest === requestId.current) setLoadingClaims(false);
    }
  }, [filters, customDateRange, showNonAssignment, showInactivePolicies]);

  const { changeStatus, printPage, exportCSV, toggleHide } = useClaimActions(loadData);

  useEffect(() => {
    const timer = setTimeout(loadData, filters.searchPatient || filters.searchClaim ? 250 : 0);
    const handleRefresh = () => loadData();
    window.addEventListener('refresh-claims', handleRefresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('refresh-claims', handleRefresh);
      requestId.current += 1;
    };
  }, [loadData, filters.searchPatient, filters.searchClaim]);

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
    setShowNonAssignment(false);
    setShowInactivePolicies(false);
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
      tabTitle: 'Outstanding Claims',
      isOutstanding: true,
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
      key: 'claimType',
      label: 'Filter by Claim Type:',
      width: '140px',
      value: filters.claimType,
      options: [
        { value: 'all', label: 'All' },
        { value: 'Fill Manual Primary', label: 'Fill Manual Primary' },
        { value: 'Manual Secondary', label: 'Manual Secondary' },
        { value: 'Manual Other', label: 'Manual Other' },
        { value: 'E-claim Primary', label: 'E-claim Primary' },
        { value: 'E-claim Secondary', label: 'E-claim Secondary' },
        { value: 'E-claim Other', label: 'E-claim Other' }
      ],
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

  const bottomPanelFilters = [
    {
      key: 'dateRange',
      label: 'Group Date By Range:',
      width: '140px',
      value: filters.dateRange,
      options: [
        { value: 'none', label: 'None' },
        { value: 'dos', label: 'Claim Date of Service' },
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
        searchPlaceholder="Search by name"
        searchValue={filters.searchPatient}
        onSearchChange={(v) => handleFilterChange('searchPatient', v)}
        extraSearchInputs={[
          {
            placeholder: 'Search by claim',
            value: filters.searchClaim,
            onChange: (v) => handleFilterChange('searchClaim', v)
          }
        ]}
        checkboxes={[
          { label: 'Show Non-Assignment Claims', checked: showNonAssignment, onChange: (value) => { setShowNonAssignment(value); setSelectedClaims({}); } },
          { label: 'Show Claims for Inactive Policies', checked: showInactivePolicies, onChange: (value) => { setShowInactivePolicies(value); setSelectedClaims({}); } }
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
            onClick: handlePrint,
            disabled: false,
          },
        ]}
      />

      {loadingClaims && <Typography sx={{ py: 1, color: '#64748b' }}>Loading claims...</Typography>}
      {loadError && <Typography sx={{ py: 1, color: 'error.main' }}>{loadError}</Typography>}
      {(filteredClaims.length ? groupOutstandingClaims(filteredClaims, filters.dateRange, filters.groupBy)
        : [{ label: null, claims: [] }]).map((group) => (
        <Box key={group.label || 'all'} sx={{ mb: group.label ? 4 : 0 }}>
          {group.label && (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1, mt: 2 }}>
              {group.label}
            </Typography>
          )}
          <StandardClaimsTable
            activeTab={4}
            filteredClaims={group.claims}
            dateRange="none"
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
            handleRevalidate={() => {}}
            handleNoteOpen={() => {}}
            handleOpenEdit={onOpenEdit}
            handleOpenAttach={onOpenAttach}
            handleOpenPreview={onOpenPreview}
            handleToggleHide={toggleHide}
            handleRowStatusChange={(id, newStatus) => changeStatus([id], newStatus, 'outstanding')}
          />
        </Box>
      ))}
    </Box>
  );
};

export default OutstandingClaimsTab;
