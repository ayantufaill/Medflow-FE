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
  // Default empty arrays if props are not provided
  const companies = insuranceCompanies.length > 0 ? insuranceCompanies : [];
  const benefits = assignmentOptions.length > 0 ? assignmentOptions : [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' },
    { value: 3, label: 'Pay to both (Split)' }
  ];

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1, color: "#333", fontSize: "0.85rem" }}>Insurance Information</Typography>
      <TextField 
        fullWidth size="small" placeholder="Search by Payer Id, Carrier..." 
        InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
        sx={{ mb: 0.75, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.4 } }}
        value={formData.carrierSearch || ''}
        onChange={(e) => onSearchChange ? onSearchChange(e.target.value) : handleInputChange('carrierSearch', e.target.value)}
      />
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

      {/* Plan Info Checkbox - Outside Table */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: 1 }}>
        <FormControlLabel
          value="planInfo"
          control={<Checkbox size="small" sx={{ p: 0.5 }} checked={formData.planInfo} onChange={(e) => handleInputChange('planInfo', e.target.checked)} />}
          label={<Typography variant="caption">Plan Info</Typography>}
          labelPlacement="end"
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
