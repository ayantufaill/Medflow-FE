import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ClaimFilterPanel from './ClaimFilterPanel';
import ClaimAlertBar from './ClaimAlertBar';
import { StandardClaimsTable } from './StandardClaimsTable';
import ClaimFooterTip from './ClaimFooterTip';
import InvalidInfoDialog from './InvalidInfoDialog';
import { useClaimActions } from '../../hooks/useClaimActions';
import { claimService } from '../../services/claim.service';
import { CARRIERS, CLAIM_TYPES, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';
import { mapClaimFields } from './claimUtils';

const UnsentClaimsTab = ({ onOpenEdit, onOpenAttach, onOpenPreview }) => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  
  // Filter state
  const [filters, setFilters] = useState({
    carrier: 'all',
    claimType: 'all',
    attachment: 'all',
    status: 'all',
    search: '',
  });
  const [showHidden, setShowHidden] = useState(false);
  const [showReadyOnly, setShowReadyOnly] = useState(false);

  // Table state
  const [selectedClaims, setSelectedClaims] = useState({});
  const [expandedProcedures, setExpandedProcedures] = useState({});
  
  // Menu anchors
  const [selectAllAnchorEl, setSelectAllAnchorEl] = useState(null);
  
  // Dialog state
  const [invalidInfoClaim, setInvalidInfoClaim] = useState(null);
  
  // Use shared actions
  const {
    loading, changeStatus, sendClaims, convertType, toggleHide, printPage, exportCSV, showMessage
  } = useClaimActions(loadData);

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
      const data = await claimService.getAllClaims({ tab: 'unsent' });
      const claimsData = (data.claims || []).map(c => mapClaimFields(c, 'unsent'));
      setClaims(claimsData);
      applyFilters(claimsData, filters, showHidden, showReadyOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClaims(false);
    }
  }

  const applyFilters = (data, currentFilters, hidden, readyOnly) => {
    let result = [...data];
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
      result = result.filter((c) => c.attachments && c.attachments.length > 0);
    } else if (currentFilters.attachment === 'no') {
      result = result.filter((c) => !c.attachments || c.attachments.length === 0);
    }
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.patientName.toLowerCase().includes(q) ||
          c.claimNumber.toLowerCase().includes(q)
      );
    }
    if (!hidden) {
      result = result.filter((c) => !c.isHidden);
    }
    if (readyOnly) {
      result = result.filter((c) => c.status === 'readyForSubmission');
    }
    setFilteredClaims(result);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(claims, newFilters, showHidden, showReadyOnly);
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
    applyFilters(claims, defaultFilters, showHidden, showReadyOnly);
  };

  const handleSearchChange = (value) => {
    handleFilterChange('search', value);
  };

  const handleToggleHidden = (checked) => {
    setShowHidden(checked);
    applyFilters(claims, filters, checked, showReadyOnly);
  };

  const handleToggleReadyOnly = (checked) => {
    setShowReadyOnly(checked);
    applyFilters(claims, filters, showHidden, checked);
  };

  // Table selection logic
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
    } else if (subset === 'ready') {
      filteredClaims.forEach((c) => {
        if (c.status === 'readyForSubmission') newSelected[c.id] = true;
      });
    } else if (subset === 'errored') {
      filteredClaims.forEach((c) => {
        if (c.status === 'validationError') newSelected[c.id] = true;
      });
    }
    setSelectedClaims(newSelected);
    setSelectAllAnchorEl(null);
  };

  const handleSelectClaim = (id) => {
    setSelectedClaims((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRevalidate = async (claimId) => {
    try {
      const result = await claimService.validateClaim(claimId);
      if (result.isValid) {
        await claimService.updateClaim(claimId, { status: 'readyForSubmission' });
        showMessage("Claim revalidated and is ready for submission!", "success");
        window.dispatchEvent(new CustomEvent('refresh-claims'));
      } else {
        showMessage(`Claim still has ${result.errors.length} validation error(s).`, "error");
      }
    } catch (err) {
      console.error("Revalidation failed", err);
      showMessage("Failed to revalidate claim.", "error");
    }
  };

  const selectedIds = Object.keys(selectedClaims).filter((id) => selectedClaims[id]);
  const alertCount = filteredClaims.filter((c) => c.status === 'validationError').length;

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
        onSearchChange={handleSearchChange}
        checkboxes={[
          { label: 'Show Hidden Claims', checked: showHidden, onChange: handleToggleHidden }
        ]}
        onRefresh={loadData}
        onClearAll={handleClearAll}
      />

      <ClaimAlertBar
        alertCount={alertCount}
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
            label: 'Send Claims',
            variant: 'send',
            icon: 'send',
            onClick: () => sendClaims(selectedIds),
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
        activeTab={0} // Unsent tab is index 0
        filteredClaims={filteredClaims}
        selectedClaims={selectedClaims}
        handleSelectAll={handleSelectAll}
        handleSelectAllMenuOpen={(e) => setSelectAllAnchorEl(e.currentTarget)}
        isSelectAllMenuOpen={Boolean(selectAllAnchorEl)}
        handleSelectAllMenuClose={() => setSelectAllAnchorEl(null)}
        handleSelectSubset={handleSelectSubset}
        selectAllAnchorEl={selectAllAnchorEl}
        handleSelectClaim={handleSelectClaim}
        toggleProcedures={(id) => setExpandedProcedures(prev => ({ ...prev, [id]: !prev[id] }))}
        expandedProcedures={expandedProcedures}
        handleToggleHide={toggleHide}
        handleRevalidate={handleRevalidate}
        handleNoteOpen={() => {}}
        handleOpenEdit={onOpenEdit}
        handleOpenAttach={onOpenAttach}
        handleOpenPreview={onOpenPreview}
        handleOpenInvalidInfo={(claim) => setInvalidInfoClaim(claim)}
      />

      <ClaimFooterTip />

      <InvalidInfoDialog 
        open={!!invalidInfoClaim} 
        onClose={() => setInvalidInfoClaim(null)} 
        claim={invalidInfoClaim} 
      />
    </Box>
  );
};

export default UnsentClaimsTab;
