import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_TYPES } from '../../pages/claims/claimsConstants';
import { mapClaimFields } from './claimUtils';

const PredeterminationTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  
  const [filters, setFilters] = useState({
    claimType: 'all',
    carrier: 'all',
    attachment: 'all',
    status: 'all',
    searchPatient: '',
    searchClaim: '',
  });

  const [showInactivePolicies, setShowInactivePolicies] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  
  const { loading, changeStatus, convertType, sendClaims, printPage, deleteClaim, toggleHide } = useClaimActions(loadData);

  useEffect(() => {
    loadData();
    const handleRefresh = () => loadData();
    window.addEventListener('refresh-claims', handleRefresh);
    return () => window.removeEventListener('refresh-claims', handleRefresh);
  }, []);

  async function loadData() {
    setLoadingClaims(true);
    try {
      const data = await claimService.getAllClaims({ tab: 'predetermination' });
      const claimsData = (data.claims || []).map(c => mapClaimFields(c, 'predetermination'));
      setClaims(claimsData);
      applyFilters(claimsData, filters);
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

    if (currentFilters.carrier !== 'all') {
      result = result.filter((c) => c.carrier === currentFilters.carrier);
    }
    if (currentFilters.claimType !== 'all') {
      result = result.filter((c) => c.claimType && c.claimType.includes(currentFilters.claimType));
    }
    if (currentFilters.status !== 'all') {
      result = result.filter((c) => c.status === currentFilters.status);
    }
    if (currentFilters.attachment === 'yes') {
      result = result.filter(c => c.attachments?.length > 0 || c.redAttachment || c.attachmentColor);
    } else if (currentFilters.attachment === 'no') {
      result = result.filter(c => !c.attachments?.length && !c.redAttachment && !c.attachmentColor);
    }
    
    if (currentFilters.searchPatient) {
      const q = currentFilters.searchPatient.toLowerCase();
      result = result.filter(c => c.patientName?.toLowerCase().includes(q));
    }
    if (currentFilters.searchClaim) {
      const q = currentFilters.searchClaim.toLowerCase();
      result = result.filter(c => c.claimNumber?.toLowerCase().includes(q));
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
      claimType: 'all',
      carrier: 'all',
      attachment: 'all',
      status: 'all',
      searchPatient: '',
      searchClaim: '',
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

  return (
    <Box>
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
          { label: 'Show Predeterminations for Inactive Policies', checked: showInactivePolicies, onChange: setShowInactivePolicies },
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
            onClick: () => printPage(),
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
        handleDeletePredetermination={(id) => deleteClaim(id)}
        handleOpenEdit={onOpenEdit}
        handleOpenAttach={onOpenAttach}
        handleOpenPreview={onOpenPreview}
      />
    </Box>
  );
};

export default PredeterminationTab;
