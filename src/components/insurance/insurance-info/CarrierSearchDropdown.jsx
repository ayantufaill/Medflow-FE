import React, { useState } from 'react';
import { Box, Paper, Popper, Table, TableBody, TableCell, TableRow, Checkbox, FormControlLabel, Typography, Chip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import FormInput from '../components/FormInput';

// Helper to assemble real address into a single readable string
const formatAddress = (addr) => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  const street = [addr.addressLine1 || addr.Address || addr.street || addr.address, addr.addressLine2 || addr.Address2 || addr.street2]
    .filter(Boolean)
    .join(', ');
  const cityState = [addr.city || addr.City, addr.state || addr.State]
    .filter(Boolean)
    .join(', ');
  const zip = addr.zipCode || addr.Zip || addr.zip || '';
  const cityStateZip = [cityState, zip].filter(Boolean).join(' ');

  return [street, cityStateZip].filter(Boolean).join(', ');
};

// Expand carriers with multiple addresses into distinct selectable rows
const expandCarrierRows = (carriers) => {
  const rows = [];
  carriers.forEach((carrier, cIdx) => {
    const multiAddrs = Array.isArray(carrier.addresses) && carrier.addresses.length > 0
      ? carrier.addresses
      : (Array.isArray(carrier.addressList) && carrier.addressList.length > 0 ? carrier.addressList : null);

    if (multiAddrs) {
      multiAddrs.forEach((addr, aIdx) => {
        const formatted = formatAddress(addr);
        rows.push({
          ...carrier,
          _rowKey: `${carrier._id || carrier.id || cIdx}-addr-${aIdx}`,
          resolvedAddress: formatted,
          selectedAddress: formatted
        });
      });
    } else {
      const formatted = formatAddress({
        addressLine1: carrier.addressLine1 || carrier.Address || carrier.address,
        addressLine2: carrier.addressLine2 || carrier.Address2,
        city: carrier.city || carrier.City,
        state: carrier.state || carrier.State,
        zipCode: carrier.zipCode || carrier.Zip
      }) || carrier.payerAddress || carrier.address || '';

      rows.push({
        ...carrier,
        _rowKey: `${carrier._id || carrier.id || cIdx}-0`,
        resolvedAddress: formatted,
        selectedAddress: formatted
      });
    }
  });
  return rows;
};

const CarrierSearchDropdown = ({ formData, handleInputChange, companies = [], handleSelectResult }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (val, openDropdown = true) => {
    handleInputChange('carrierSearch', val);

    const rawPool = Array.isArray(companies) ? companies : (companies?.companies || []);
    const searchPool = expandCarrierRows(rawPool);
    let filtered = searchPool;

    if (val) {
      const query = val.toLowerCase();
      filtered = searchPool.filter(item =>
        (item.payerId || item.id?.toString() || '').toLowerCase().includes(query) ||
        (item.name || item.carrierName || '').toLowerCase().includes(query) ||
        (item.resolvedAddress || '').toLowerCase().includes(query) ||
        (item.groupName || '').toLowerCase().includes(query) ||
        (item.groupNumber || '').toLowerCase().includes(query) ||
        (item.planName || item.name || '').toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(item => item.isActive !== false);

    if (formData.excludeSystemCarriers) {
      filtered = filtered.filter(item => !item.isSystemCarrier && !item.isSystem);
    }

    setSearchResults(filtered);
    if (openDropdown) {
      setShowDropdown(true);
    }
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
          subLabel="(Search by Payer Id, Carrier, Plan name, Group name, Group number)"
          placeholder="Search carrier..."
          InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
          sx={{ mb: 0.75 }}
          value={formData.carrierSearch || ''}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => handleSearch(formData.carrierSearch || '')}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        <Popper
          open={showDropdown && Boolean(anchorEl) && (searchResults.length > 0 || Boolean(formData.carrierSearch))}
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
                {searchResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 2.5, color: '#6b7280', fontSize: '0.75rem' }}>
                      No carriers found
                    </TableCell>
                  </TableRow>
                ) : (
                  searchResults.map((item, idx) => (
                    <TableRow
                      key={item._rowKey || idx}
                      hover
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' } }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.7rem', py: 1, whiteSpace: 'nowrap' }}>{item.payerId || item.id || '-'}</TableCell>
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
                        {item.planName || item.name || '-'}
                        {item.isExistingPlan && (
                          <Chip label="Plan benefits" size="small" sx={{ ml: 0.75, height: 16, fontSize: '0.55rem', bgcolor: '#e6f0fd', color: '#2563eb' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
              setTimeout(() => handleSearch(formData.carrierSearch || '', false), 0);
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
