import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_TYPES, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';
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
    filterDate: 'all',
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
    const handleRefresh = () => loadData();
    window.addEventListener('refresh-claims', handleRefresh);
    return () => {
      window.removeEventListener('refresh-claims', handleRefresh);
    };
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
    filterDate: 'all',
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

      {filters.dateRange === 'dos' ? (
        (() => {
          const buckets = { "0-30 days": [], "31-60 days": [], "61-90 days": [], ">90 days": [], "Unknown": [] };
          const getAgeBucket = (dateStr) => {
            if (!dateStr) return "Unknown";
            const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 3600 * 24));
            if (days <= 30) return "0-30 days";
            if (days <= 60) return "31-60 days";
            if (days <= 90) return "61-90 days";
            return ">90 days";
          };
          filteredClaims.forEach(c => {
            buckets[getAgeBucket(c.createdDate)].push(c);
          });
          const activeBuckets = ["0-30 days", "31-60 days", "61-90 days", ">90 days", "Unknown"].filter(b => buckets[b].length > 0);
          
          if (activeBuckets.length === 0) {
            return (
              <StandardClaimsTable
                activeTab={4} // Outstanding is index 4
                filteredClaims={[]}
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
                handleRevalidate={(id) => {}}
                handleNoteOpen={() => {}}
                handleOpenEdit={onOpenEdit}
                handleOpenAttach={onOpenAttach}
                handleOpenPreview={onOpenPreview}
                handleToggleHide={toggleHide}
                handleRowStatusChange={(id, newStatus) => changeStatus([id], newStatus, 'outstanding')}
              />
            );
          }

          return activeBuckets.map(bucket => (
            <Box key={bucket} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1, textTransform: 'uppercase', mt: 2 }}>
                {bucket} Group
              </Typography>
              <StandardClaimsTable
                activeTab={4}
                filteredClaims={buckets[bucket]}
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
                handleRevalidate={(id) => {}}
                handleNoteOpen={() => {}}
                handleOpenEdit={onOpenEdit}
                handleOpenAttach={onOpenAttach}
                handleOpenPreview={onOpenPreview}
                handleToggleHide={toggleHide}
                handleRowStatusChange={(id, newStatus) => changeStatus([id], newStatus, 'outstanding')}
              />
            </Box>
          ));
        })()
      ) : (
        <StandardClaimsTable
          activeTab={4} // Outstanding is index 4
          filteredClaims={filteredClaims}
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
          handleRevalidate={(id) => {}}
          handleNoteOpen={() => {}}
          handleOpenEdit={onOpenEdit}
          handleOpenAttach={onOpenAttach}
          handleOpenPreview={onOpenPreview}
          handleToggleHide={toggleHide}
          handleRowStatusChange={(id, newStatus) => changeStatus([id], newStatus, 'outstanding')}
        />
      )}
    </Box>
  );
};

export default OutstandingClaimsTab;
