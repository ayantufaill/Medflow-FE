import React, { useState } from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Select, MenuItem, Menu, ListItemText } from "@mui/material";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";

const PlanBillingTable = ({ formData, handleInputChange, benefits }) => {
  const [templateAnchorEl, setTemplateAnchorEl] = useState(null);

  return (
    <Box sx={{ border: '1px solid #DFE5EC', borderRadius: 2, p: 2 }}>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #DFE5EC', borderRadius: 2 }}>
        <Table size="small">
          <TableBody>
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
            <TableRow>
              <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phone Number
              </TableCell>
              <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px', color: '#333' }}>
                <TextField 
                  fullWidth 
                  InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: '#333', '& fieldset': { border: 'none' } } }} 
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: '1px solid #DFE5EC', borderLeft: 'none', p: '8px 16px', height: '44px', fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ffffff', width: '40%', color: '#666' }}></TableCell>
              <TableCell sx={{ border: '1px solid #DFE5EC', borderRight: 'none', height: '44px', fontSize: '0.8rem', width: '60%', p: '0px 16px' }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={formData.healthPlan} onChange={(e) => handleInputChange('healthPlan', e.target.checked)} />}
                  label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Health Plan</Typography>}
                />
              </TableCell>
            </TableRow>
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
  );
};

export default PlanBillingTable;
