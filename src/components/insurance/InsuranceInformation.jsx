import React from 'react';
import {
  Box, Typography, TextField, Checkbox, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Paper, Button, InputAdornment, Select, MenuItem, Menu, ListItemText
} from "@mui/material";
import { Search as SearchIcon, InfoOutlined as InfoIcon, PeopleOutline as PeopleIcon, Business as BusinessIcon } from "@mui/icons-material";

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
  const [templateAnchorEl, setTemplateAnchorEl] = React.useState(null);

  // Default empty arrays if props are not provided
  const companies = insuranceCompanies.length > 0 ? insuranceCompanies : [];
  const benefits = assignmentOptions.length > 0 ? assignmentOptions : [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' }
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

    const searchPool = companies.length > 0 ? companies : DUMMY_INSURANCE;
    let filtered = searchPool;
    
    if (val) {
      filtered = searchPool.filter(item => 
        (item.payerId || item.id?.toString() || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.carrierName || item.name || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupName || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupNumber || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.planName || item.name || '').toLowerCase().includes(val.toLowerCase())
      );
    }

    // Always filter out inactive companies regardless of the checkbox
    filtered = filtered.filter(item => item.isActive !== false);

    if (formData.excludeSystemCarriers) {
      filtered = filtered.filter(item => !item.isSystemCarrier && !item.isSystem);
    }

    setSearchResults(filtered);
    setShowDropdown(true);
  };

  const handleSelectResult = (item) => {
    handleInputChange('insuranceCompanyId', item._id || item.id || 1);
    handleInputChange('carrierName', item.carrierName || item.name || '');
    handleInputChange('payerId', item.payerId || item.id || '');
    handleInputChange('carrierPhone', item.carrierPhone || item.phone || '');
    handleInputChange('payerAddress', item.payerAddress || item.address || item.city || '');
    handleInputChange('groupName', item.groupName || '');
    handleInputChange('groupNumber', item.groupNumber || '');
    handleInputChange('insurancePlan', item.planName || item.name || '');
    if (item.feeSched || item.feeGuide) {
      handleInputChange('planFeeGuide', item.feeSched || item.feeGuide);
    }
    handleInputChange('carrierSearch', '');
    setShowDropdown(false);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  return (
    <Box sx={{ 
      border: '1px solid #DFE5EC', 
      borderRadius: '12px', 
      backgroundColor: '#FFFFFF', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
             <BusinessIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Insurance Information
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Carrier, payer and plan billing details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
      <Box sx={{ position: 'relative', mt: 1 }}>
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
          Search Carrier
        </Typography>
        <TextField 
          fullWidth size="small" placeholder="Search by Payer Id, Carrier..." 
          InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
          sx={{ 
            mb: 0.75, 
            bgcolor: '#f8f9fc',
            '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
            '& fieldset': { borderColor: '#DFE5EC' }
          }}
          value={formData.carrierSearch || ''}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => handleSearch(formData.carrierSearch || '')}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
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
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.payerId || item.id || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.carrierName || item.name || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupName || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupNumber || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.planName || item.name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <FormControlLabel 
        control={
          <Checkbox 
            size="small" 
            checked={formData.excludeSystemCarriers || false} 
            onChange={(e) => {
              handleInputChange('excludeSystemCarriers', e.target.checked);
              // Trigger a re-search so the dropdown updates immediately
              setTimeout(() => handleSearch(formData.carrierSearch || ''), 0);
            }} 
          />
        } 
        label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Exclude System Carriers</Typography>} 
        sx={{ ml: 0 }} 
      />

      {/* Carrier Info Fields */}
      <Box sx={{ mt: 1, mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
          Carrier / Payer Name <span style={{ color: '#d32f2f' }}>*</span>
        </Typography>
        <TextField 
          fullWidth size="small" 
          value={formData.carrierName || ''}
          onChange={(e) => handleInputChange('carrierName', e.target.value)}
          sx={{ 
            mb: 1.5,
            bgcolor: '#f8f9fc',
            '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
            '& fieldset': { borderColor: '#DFE5EC' }
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
              Payer ID <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField 
              fullWidth size="small" 
              value={formData.payerId || ''}
              onChange={(e) => handleInputChange('payerId', e.target.value)}
              sx={{ 
                bgcolor: '#f8f9fc',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
              Carrier Phone
            </Typography>
            <TextField 
              fullWidth size="small" 
              value={formData.carrierPhone || ''}
              onChange={(e) => handleInputChange('carrierPhone', e.target.value)}
              sx={{ 
                bgcolor: '#f8f9fc',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            />
          </Box>
        </Box>

        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
          Payer Address
        </Typography>
        <TextField 
          fullWidth size="small" 
          value={formData.payerAddress || ''}
          onChange={(e) => handleInputChange('payerAddress', e.target.value)}
          sx={{ 
            bgcolor: '#f8f9fc',
            '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
            '& fieldset': { borderColor: '#DFE5EC' }
          }}
        />
      </Box>

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

      <Box sx={{ border: '1px solid #DFE5EC', borderRadius: 2, p: 2 }}>
         <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #DFE5EC', borderRadius: 2 }}>
            <Table size="small">
              <TableBody>
                {/* Insurance Plan */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', borderTop: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Insurance Plan <span style={{ color: '#d32f2f' }}>*</span>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', borderTop: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px', color: '#333' }}>
                    <TextField 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: '#333', '& fieldset': { border: 'none' } } }} 
                      value={formData.insurancePlan || ''}
                      onChange={(e) => handleInputChange('insurancePlan', e.target.value)}
                      required 
                    />
                  </TableCell>
                </TableRow>

                {/* Group Name */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Group Name <span style={{ color: '#d32f2f' }}>*</span>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px', color: '#333' }}>
                    <TextField 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: '#333', '& fieldset': { border: 'none' } } }} 
                      value={formData.groupName || ''}
                      onChange={(e) => handleInputChange('groupName', e.target.value)}
                      required 
                    />
                  </TableCell>
                </TableRow>

                {/* Group Number */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Group Number <span style={{ color: '#d32f2f' }}>*</span>
                      <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px', color: '#333' }}>
                    <TextField 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: '#333', '& fieldset': { border: 'none' } } }} 
                      value={formData.groupNumber || ''}
                      onChange={(e) => {
                        const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                        handleInputChange('groupNumber', alphanumericValue);
                      }}
                      placeholder="e.g. 300871"
                      required 
                    />
                  </TableCell>
                </TableRow>

                {/* Phone Number */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Phone Number
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px', color: '#333' }}>
                    <TextField 
                      fullWidth 
                      InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: '#333', '& fieldset': { border: 'none' } } }} 
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </TableCell>
                </TableRow>

                {/* Health Plan Checkbox */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666' }}></TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px' }}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={formData.healthPlan} onChange={(e) => handleInputChange('healthPlan', e.target.checked)} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Health Plan</Typography>
                        </Box>
                      }
                    />
                  </TableCell>
                </TableRow>

                {/* Assignment of Benefits */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Assignment of Benefits <span style={{ color: '#d32f2f' }}>*</span>
                      <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px', color: '#333' }}>
                    <Select
                      variant="standard"
                      fullWidth
                      disableUnderline
                      value={formData.assignmentOfBenefits || 1}
                      onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
                      sx={{ fontSize: '0.85rem' }}
                    >
                      {benefits.map(option => (
                        <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.85rem' }}>{option.label}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>

                {/* Save as Template */}
                <TableRow>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', borderBottom: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666' }}></TableCell>
                  <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', borderBottom: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px' }}>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={formData.saveAsTemplate} onChange={(e) => handleInputChange('saveAsTemplate', e.target.checked)} />}
                      label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Save as Template</Typography>}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
         </TableContainer>
         <Button 
           variant="contained" 
           fullWidth 
           onClick={(e) => setTemplateAnchorEl(e.currentTarget)}
           sx={{ mt: 2, bgcolor: '#2563eb', borderRadius: '6px', textTransform: 'none', fontWeight: 600, py: 1, fontSize: '0.85rem', boxShadow: 'none', '&:hover': { bgcolor: '#1d4ed8' } }}
         >
            Copy Plan Billing Info From Template
         </Button>
         <Menu
           anchorEl={templateAnchorEl}
           open={Boolean(templateAnchorEl)}
           onClose={() => setTemplateAnchorEl(null)}
           PaperProps={{ sx: { width: 300, maxHeight: 300 } }}
         >
           {formData.coverageTemplates?.length > 0 ? (
             formData.coverageTemplates.map((template, idx) => (
               <MenuItem 
                 key={idx} 
                 onClick={() => {
                   setTemplateAnchorEl(null);
                   if (formData.handleApplyTemplate) {
                     formData.handleApplyTemplate(template);
                   }
                 }}
               >
                 <ListItemText 
                   primary={template.name || 'Unnamed Template'} 
                   secondary={template.description || 'No description available'} 
                   primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
                   secondaryTypographyProps={{ fontSize: '0.75rem' }}
                 />
               </MenuItem>
             ))
           ) : (
             <MenuItem disabled>
               <ListItemText primary="No templates available" />
             </MenuItem>
           )}
         </Menu>
      </Box>

      {/* Patients Covered Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, mt: 2, px: 1 }}>
        <Typography sx={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600 }}>
          Patients covered: {formData.patientsCovered || 1}
        </Typography>
        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
          Editing this plan will result in changes to all patients covered under it
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default InsuranceInformation;
