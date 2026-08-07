import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_TYPES } from '../../pages/claims/claimsConstants';
import { mapClaimFields } from './claimUtils';

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
    search: '',
  });

  const [showHidden, setShowHidden] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  
  const {
    loading, changeStatus, voidAndRecreate, toggleHide, printPage, exportCSV
  } = useClaimActions(loadData);

  useEffect(() => {
    loadData();
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

  const applyFilters = (data, currentFilters, hidden) => {
    let result = [...data];

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
    applyFilters(claims, newFilters, showHidden);
  };

  const handleClearAll = () => {
    const defaultFilters = {
      carrier: 'all',
      claimType: 'all',
      attachment: 'all',
      status: 'all',
      search: '',
    };
    setFilters(defaultFilters);
    applyFilters(claims, defaultFilters, showHidden);
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
      options: [
        { value: 'none', label: 'None' },
        { value: 'date', label: 'Date (Newest)' },
        { value: 'name', label: 'Patient Name' }
      ],
      onChange: (val) => handleFilterChange('sort', val),
    },
    {
      key: 'attachment',
      label: 'Claim Attachment:',
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
      label: 'Claim Status:',
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
      />
    </Box>
  );
};

export default HistoryClaimsTab;
