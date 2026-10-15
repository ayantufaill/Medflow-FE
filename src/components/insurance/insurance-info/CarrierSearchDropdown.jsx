import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Popper, Table, TableBody, TableCell, TableRow, Checkbox, FormControlLabel, Typography, Chip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import FormInput from '../components/FormInput';
import { insuranceCompanyService } from '../../../services/insurance.service';
import { buildCarrierSearchRows } from './carrierSearchRows';

const CarrierSearchDropdown = ({ formData, handleInputChange, existingPlans = [], handleSelectResult }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const query = formData.carrierSearch || '';
  const matchingExistingPlans = existingPlans.filter((plan) =>
    !formData.excludeSystemCarriers || (!plan.isSystemCarrier && !plan.isSystem)
  ).filter((plan) =>
    [plan.payerId, plan.carrierName, plan.groupName, plan.groupNumber, plan.planName]
      .some((value) => String(value || '').toLowerCase().includes(query.trim().toLowerCase()))
  ).map((plan, index) => ({
    ...plan,
    resolvedAddress: plan.payerAddress || '',
    _rowKey: `existing-plan-${plan._id}-${plan.groupNumber || index}`,
  }));
  const visibleResults = [...matchingExistingPlans, ...searchResults];

  useEffect(() => {
    if (!showDropdown) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const result = await insuranceCompanyService.getAllInsuranceCompanies(page, 40, query.trim(), 'active', true);
        if (cancelled) return;
        const rows = buildCarrierSearchRows(result?.companies || [], query);
        setSearchResults((current) => page === 1 ? rows : [...current, ...rows]);
        setHasMore(page < (result?.pagination?.totalPages || 1));
      } catch (requestError) {
        if (cancelled) return;
        setError(requestError?.response?.data?.message || 'Could not load carriers. Try again.');
        if (page === 1) setSearchResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, page === 1 ? 250 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [showDropdown, query, page]);

  const handleSearch = (val) => {
    handleInputChange('carrierSearch', val);
    setPage(1);
    setSearchResults([]);
    setLoading(true);
    setShowDropdown(true);
  };

  const onSelect = (item) => {
    handleSelectResult(item);
    setShowDropdown(false);
  };

  return (
    <>
      <Box ref={setAnchorEl} sx={{ position: 'relative', mt: 1 }}>
        <FormInput
          label="Search Carrier"
          subLabel="(Search by Payer ID, carrier, address, employer, group name or number)"
          placeholder="Search carrier..."
          InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
          sx={{ mb: 0.75 }}
          value={formData.carrierSearch || ''}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { setLoading(true); setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        <Popper
          open={showDropdown && Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
          modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
        >
          <Paper
            elevation={8}
            sx={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              width: { xs: '320px', sm: '650px', md: '880px' },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            <Table size="small" stickyHeader>
              <TableBody>
                <TableRow sx={{ bgcolor: '#eef4ff' }}>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer ID</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Address</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group Name</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group #</TableCell>
                  <TableCell sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Plan/Employer Name</TableCell>
                </TableRow>
                {visibleResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 2.5, color: '#6b7280', fontSize: '0.75rem' }}>
                      {loading ? 'Loading carriers...' : error || 'No carriers found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleResults.map((item, idx) => (
                    <TableRow
                      key={item._rowKey || idx}
                      hover
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' } }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.7rem', py: 1, whiteSpace: 'nowrap' }}>{item.payerId || '-'}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', py: 1 }}>{item.name || item.carrierName || '-'}</TableCell>
                      <TableCell
                        sx={{
                          fontSize: '0.7rem',
                          py: 1,
                          maxWidth: '220px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={item.resolvedAddress}
                      >
                        {item.resolvedAddress || '-'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', py: 1 }}>{item.groupName || '-'}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', py: 1 }}>{item.groupNumber || '-'}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', py: 1 }}>
                        {item.employerName || item.planName || item.name || '-'}
                        {item.isExistingPlan && (
                          <Chip label="Plan benefits" size="small" sx={{ ml: 0.75, height: 16, fontSize: '0.55rem', bgcolor: '#e6f0fd', color: '#2563eb' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {error && searchResults.length > 0 && <Typography sx={{ p: 1, color: 'error.main' }}>{error}</Typography>}
            {hasMore && !error && (
              <Button disabled={loading} fullWidth onMouseDown={(event) => event.preventDefault()} onClick={() => setPage((current) => current + 1)}>
                {loading ? 'Loading...' : 'Load more carriers'}
              </Button>
            )}
          </Paper>
        </Popper>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={formData.excludeSystemCarriers || false}
            onChange={(e) => {
              handleInputChange('excludeSystemCarriers', e.target.checked);
              setPage(1);
            }}
          />
        }
        label={<Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Exclude System Carriers</Typography>}
        sx={{ ml: 0 }}
      />
    </>
  );
};

export default CarrierSearchDropdown;
