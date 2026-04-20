import React from "react";
import {
  Box, Typography, TextField, Checkbox, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Paper, Button, InputAdornment, Select, MenuItem
} from "@mui/material";
import { Search as SearchIcon, InfoOutlined as InfoIcon, PeopleOutline as PeopleIcon } from "@mui/icons-material";

const InsuranceInformation = ({ 
  formData, 
  handleInputChange, 
  insuranceCompanies = [],
  assignmentOptions = [],
  onSearchChange,
  tinyText,
  blueHeader
}) => {
  const [searchResults, setSearchResults] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Default empty arrays if props are not provided
  const companies = insuranceCompanies.length > 0 ? insuranceCompanies : [];
  const benefits = assignmentOptions.length > 0 ? assignmentOptions : [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' },
    { value: 3, label: 'Pay to both (Split)' }
  ];

  // Robust dummy data to ensure results show up as in the screenshot
  const DUMMY_INSURANCE = [
    { payerId: '00621', carrierName: 'Blue Cross Blue Shield of Illinois', groupName: 'VIVID SEATS, LLC', groupNumber: '300871', planName: 'BCBS IL', payerAddress: '123 Blue St, Chicago, IL', carrierPhone: '800-123-4567' },
    { payerId: '52133', carrierName: 'United Healthcare Dental', groupName: 'DOXIM', groupNumber: '1602187', planName: 'UHC ( DOXIM )', payerAddress: '456 Health Way, Minnetonka, MN', carrierPhone: '800-987-6543' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'Texas Health Resources', groupNumber: '087639801700001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TX Health Resources', groupNumber: '087639801300001', planName: 'TX HEALTH RESOURCES', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'Texas Health Resources', groupNumber: '876398-17-001', planName: '800-451-7715', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna(TEXAS HEALTH RESOURCES)', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  ];

  const handleSearch = (val) => {
    handleInputChange('carrierSearch', val);
    if (!val) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const searchPool = companies.length > 0 ? companies : DUMMY_INSURANCE;
    const filtered = searchPool.filter(item => 
      (item.payerId || '').toLowerCase().includes(val.toLowerCase()) ||
      (item.carrierName || '').toLowerCase().includes(val.toLowerCase()) ||
      (item.groupName || '').toLowerCase().includes(val.toLowerCase()) ||
      (item.groupNumber || '').toLowerCase().includes(val.toLowerCase()) ||
      (item.planName || '').toLowerCase().includes(val.toLowerCase())
    );

    setSearchResults(filtered);
    setShowDropdown(true);
  };

  const handleSelectResult = (item) => {
    handleInputChange('carrierName', item.carrierName);
    handleInputChange('payerId', item.payerId);
    handleInputChange('carrierPhone', item.carrierPhone);
    handleInputChange('payerAddress', item.payerAddress);
    handleInputChange('groupName', item.groupName);
    handleInputChange('groupNumber', item.groupNumber);
    handleInputChange('insurancePlan', item.planName);
    handleInputChange('carrierSearch', '');
    setShowDropdown(false);
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1, color: "#333", fontSize: "0.85rem" }}>Insurance Information</Typography>
      <Box sx={{ position: 'relative' }}>
        <TextField 
          fullWidth size="small" placeholder="Search by Payer Id, Carrier..." 
          InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
          sx={{ mb: 0.75, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.4 } }}
          value={formData.carrierSearch || ''}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => formData.carrierSearch && setShowDropdown(true)}
        />

        {showDropdown && searchResults.length > 0 && (
          <Paper 
            elevation={8} 
            sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              zIndex: 9999, 
              maxHeight: '400px', 
              overflowY: 'auto', 
              border: '1px solid #ddd',
              width: { xs: '300px', sm: '500px', md: '700px' },
              mt: 0.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            <Table size="small" stickyHeader>
              <TableBody>
                <TableRow sx={{ bgcolor: '#eef4ff' }}>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer ID</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group Name</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group #</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Plan/Employer Name</TableCell>
                </TableRow>
                {searchResults.map((item, idx) => (
                  <TableRow 
                    key={idx} 
                    hover 
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' } }}
                    onClick={() => handleSelectResult(item)}
                  >
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.payerId}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.carrierName}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupName}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupNumber}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.planName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Exclude System Carriers</Typography>} sx={{ ml: 0 }} />

      {/* Display carrier info from API or fallback to display data */}
      <Box sx={{ bgcolor: blueHeader, p: 0.75, borderRadius: 1, mt: 1, mb: 1.5, overflow: 'hidden' }}>
         <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Paper elevation={0} sx={{ flex: 1, p: 0.75, textAlign: 'left', bgcolor: '#fff', borderRadius: 1, minWidth: 0 }}>
              <Typography variant="caption" color="textSecondary" sx={tinyText}>Carrier/Payer Name</Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem', mt: 0.3 }}>{formData.carrierName || '-'}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ flex: 1, p: 0.75, textAlign: 'left', bgcolor: '#fff', borderRadius: 1, minWidth: 0 }}>
              <Typography variant="caption" color="textSecondary" sx={tinyText}>Payer ID</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.3 }}>{formData.payerId || '-'}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ flex: 1, p: 0.75, textAlign: 'left', bgcolor: '#fff', borderRadius: 1, minWidth: 0 }}>
              <Typography variant="caption" color="textSecondary" sx={tinyText}>Carrier Phone</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.3 }}>{formData.carrierPhone || '-'}</Typography>
            </Paper>
         </Box>
         <Paper elevation={0} sx={{ mt: 0.5, p: 1, textAlign: 'left', bgcolor: '#fff', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary" sx={tinyText}>Payer Address</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.3, fontWeight: 500 }}>{formData.payerAddress || '-'}</Typography>
         </Paper>
      </Box>

      {/* Checkboxes above the table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, mt: 1, px: 0.5 }}>
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: 0.5 }} checked={formData.claimsOnlyPolicy || false} onChange={(e) => handleInputChange('claimsOnlyPolicy', e.target.checked)} />}
          label={<Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>Claims only policy</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: 0.5 }} checked={formData.planInfo} onChange={(e) => handleInputChange('planInfo', e.target.checked)} />}
          label={<Typography variant="caption">Plan Info</Typography>}
        />
      </Box>

      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
         <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
            <Table size="small">
              <TableBody>
                {/* Insurance Plan */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                    Insurance Plan <span style={{ color: '#d32f2f' }}>*</span>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}>
                    <TextField 
                      variant="standard" 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.8rem', '& fieldset': { border: 'none' } } }} 
                      value={formData.insurancePlan || ''}
                      onChange={(e) => handleInputChange('insurancePlan', e.target.value)}
                      required 
                    />
                  </TableCell>
                </TableRow>

                {/* Group Name */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                    Group Name <span style={{ color: '#d32f2f' }}>*</span>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}>
                    <TextField 
                      variant="standard" 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.8rem', '& fieldset': { border: 'none' } } }} 
                      value={formData.groupName || ''}
                      onChange={(e) => handleInputChange('groupName', e.target.value)}
                      required 
                    />
                  </TableCell>
                </TableRow>

                {/* Group Number */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Group Number <span style={{ color: '#d32f2f' }}>*</span>
                      <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}>
                    <TextField 
                      variant="standard" 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.8rem', '& fieldset': { border: 'none' } } }} 
                      value={formData.groupNumber || ''}
                      onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                      required 
                    />
                  </TableCell>
                </TableRow>

                {/* Phone Number */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>Phone Number</TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}>
                    <TextField 
                      variant="standard" 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.8rem', '& fieldset': { border: 'none' } } }} 
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </TableCell>
                </TableRow>

                {/* Health Plan Checkbox */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}></TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={formData.healthPlan} onChange={(e) => handleInputChange('healthPlan', e.target.checked)} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">Health Plan</Typography>
                          <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
                        </Box>
                      }
                    />
                  </TableCell>
                </TableRow>

                {/* Assignment of Benefits */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Assignment of Benefits
                      <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}>
                    <Select
                      variant="standard"
                      fullWidth
                      disableUnderline
                      value={formData.assignmentOfBenefits}
                      onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {benefits.map(option => (
                        <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>{option.label}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>

                {/* Save as Template */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #e0e0e0', p: '4px 12px', height: '40px', fontSize: '0.8rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={formData.saveAsTemplate} onChange={(e) => handleInputChange('saveAsTemplate', e.target.checked)} />}
                      label={<Typography variant="body2">Save as Template</Typography>}
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #e0e0e0', height: '40px', fontSize: '0.8rem', width: '60%', p: '0px 8px' }}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
         </TableContainer>
         <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#1a237e', borderRadius: '50px', textTransform: 'none', fontWeight: 600, py: 0.8, fontSize: '0.85rem', '&:hover': { bgcolor: '#0d47a1' } }}>
            Copy Plan Billing Info From Template
         </Button>
      </Box>

      {/* Patients Covered Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, mt: 2 }}>
        <PeopleIcon sx={{ fontSize: 16, color: '#1a237e' }} />
        <Typography sx={{ color: '#1976d2', fontSize: '0.7rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
          Patients covered: {formData.patientsCovered || 1}
        </Typography>
      </Box>
      <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2, fontSize: '0.65rem' }}>
        Editing this plan will result in changes to all patients covered under it
      </Typography>
    </Box>
  );
};

export default InsuranceInformation;
