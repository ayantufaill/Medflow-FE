import React from "react";
import {
  Box, Typography, TextField, Checkbox, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Paper, Button, InputAdornment, Select, MenuItem
} from "@mui/material";
import { Search as SearchIcon, InfoOutlined as InfoIcon, PeopleOutline as PeopleIcon } from "@mui/icons-material";

const MembershipInformation = ({ 
  formData, 
  handleInputChange,
  membershipPlans = []
}) => {
  const compactText = { fontSize: '0.65rem' };
  const compactTableHeader = { fontSize: '0.7rem', color: '#424242' };
  
  // Use API data or empty array as fallback
  const plans = membershipPlans.length > 0 ? membershipPlans : [];
  
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 0.5, color: "#333", fontSize: "0.8rem" }}>Membership Information</Typography>
      
      {/* Compact Search Section */}
      <Box sx={{ mb: 0.75 }}>
        <TextField 
          fullWidth size="small" placeholder="Search by Plan Name, ID..." 
          InputProps={{ endAdornment: <SearchIcon color="disabled" fontSize="small" /> }}
          sx={{ mb: 0.5, '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.3 }, '& .MuiOutlinedInput-root': { minHeight: '32px' } }}
          value={formData.carrierSearch || ''}
          onChange={(e) => handleInputChange('carrierSearch', e.target.value)}
        />
        <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.3 }} />} label={<Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Claims only policy</Typography>} sx={{ ml: 0, mt: -0.25 }} />
      </Box>

      {/* Plan Info Checkbox - More Compact */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5, mt: 0.5 }}>
        <FormControlLabel
          value="planInfo"
          control={<Checkbox size="small" sx={{ p: 0.4 }} checked={formData.planInfo} onChange={(e) => handleInputChange('planInfo', e.target.checked)} />}
          label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Plan Info</Typography>}
          labelPlacement="end"
        />
      </Box>

      {/* Compact Table Section */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
         <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
           <Table size="small">
             <TableBody>
               {/* Membership Plan */}
               <TableRow>
                 <TableCell sx={{ border: '1px solid #e0e0e0', p: '3px 8px', height: '32px', fontSize: '0.75rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                   Membership Plan Name<span style={{ color: '#d32f2f' }}>*</span>
                 </TableCell>
                 <TableCell sx={{ border: '1px solid #e0e0e0', height: '32px', fontSize: '0.75rem', width: '60%', p: '0px 6px' }}>
                   <TextField 
                     variant="standard" 
                     fullWidth 
                     InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', '& fieldset': { border: 'none' } } }} 
                     value={formData.insurancePlan || ''}
                     onChange={(e) => handleInputChange('insurancePlan', e.target.value)}
                     required 
                   />
                 </TableCell>
               </TableRow>

               {/* Group Name */}
               <TableRow>
                 <TableCell sx={{ border: '1px solid #e0e0e0', p: '3px 8px', height: '32px', fontSize: '0.75rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                   Membership Plan Annual Fee <span style={{ color: '#d32f2f' }}>*</span>
                 </TableCell>
                 <TableCell sx={{ border: '1px solid #e0e0e0', height: '32px', fontSize: '0.75rem', width: '60%', p: '0px 6px' }}>
                   <TextField 
                     variant="standard" 
                     fullWidth 
                     InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', '& fieldset': { border: 'none' } } }} 
                     value={formData.groupName || ''}
                     onChange={(e) => handleInputChange('groupName', e.target.value)}
                     required 
                   />
                 </TableCell>
               </TableRow>

               {/* Group Number */}
               <TableRow>
                 <TableCell sx={{ border: '1px solid #e0e0e0', p: '3px 8px', height: '32px', fontSize: '0.75rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                     Membership Plan Annual Fee <span style={{ color: '#d32f2f' }}>*</span>
                     <InfoIcon sx={{ fontSize: 12, color: '#bdbdbd' }} />
                   </Box>
                 </TableCell>
                 <TableCell sx={{ border: '1px solid #e0e0e0', height: '32px', fontSize: '0.75rem', width: '60%', p: '0px 6px' }}>
                   <TextField 
                     variant="standard" 
                     fullWidth 
                     InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', '& fieldset': { border: 'none' } } }} 
                     value={formData.groupNumber || ''}
                     onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                     required 
                   />
                 </TableCell>
               </TableRow>


                <TableRow>
                 <TableCell sx={{ border: '1px solid #e0e0e0', p: '3px 8px', height: '32px', fontSize: '0.75rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                   <FormControlLabel
                     control={<Checkbox size="small" sx={{ p: 0.4 }} checked={formData.saveAsTemplate} onChange={(e) => handleInputChange('saveAsTemplate', e.target.checked)} />}
                     label={<Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Auto Renewal</Typography>}
                   />
                 </TableCell>
                 <TableCell sx={{ border: '1px solid #e0e0e0', height: '32px', fontSize: '0.75rem', width: '60%', p: '0px 6px' }}></TableCell>
               </TableRow>

               {/* Save as Template */}
               <TableRow>
                 <TableCell sx={{ border: '1px solid #e0e0e0', p: '3px 8px', height: '32px', fontSize: '0.75rem', bgcolor: '#f9fafb', width: '40%', color: '#424242' }}>
                   <FormControlLabel
                     control={<Checkbox size="small" sx={{ p: 0.4 }} checked={formData.saveAsTemplate} onChange={(e) => handleInputChange('saveAsTemplate', e.target.checked)} />}
                     label={<Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Save as Template</Typography>}
                   />
                 </TableCell>
                 <TableCell sx={{ border: '1px solid #e0e0e0', height: '32px', fontSize: '0.75rem', width: '60%', p: '0px 6px' }}></TableCell>
               </TableRow>
             </TableBody>
           </Table>
         </TableContainer>
         <Button variant="contained" fullWidth sx={{ mt: 1, mb: 0.5, bgcolor: '#1a237e', borderRadius: '50px', textTransform: 'none', fontWeight: 600, py: 0.6, fontSize: '0.75rem', '&:hover': { bgcolor: '#0d47a1' } }}>
            Copy Plan Details From Template
         </Button>
      </Box>

      {/* Members Covered Info - More Compact */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.3, mt: 1 }}>
        <PeopleIcon sx={{ fontSize: 14, color: '#1a237e' }} />
        <Typography sx={{ color: '#1976d2', fontSize: '0.65rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
          Patients Covered: {formData.patientsCovered || 1}
        </Typography>
      </Box>
      <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1, fontSize: '0.6rem' }}>
        Editing this plan will result in changes to all members enrolled under it
      </Typography>
    </Box>
  );
};

export default MembershipInformation;
