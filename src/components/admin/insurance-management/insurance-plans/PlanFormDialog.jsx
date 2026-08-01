import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  Button,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const PlanFormDialog = ({
  open,
  onClose,
  title,
  formData,
  setFormData,
  onSave,
  carriersList,
}) => {
  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "10px", py: "10px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ 
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {title}
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Configure insurance plan details.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ mt: 1, px: 4, py: 3 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Select Payer (Carrier)*:</Typography>
              <Autocomplete
                size="small"
                disablePortal
                options={carriersList || []}
                getOptionLabel={(option) => option.name || ''}
                value={(carriersList || []).find(c => (c._id || c.id) === formData.payerId) || null}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    payerName: newValue ? newValue.name : '',
                    payerId: newValue ? (newValue._id || newValue.id) : ''
                  });
                }}
                componentsProps={{
                  popper: { sx: { zIndex: 10000 } }
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Search for an insurance company" 
                    sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
                  />
                )}
              />
              <FormControlLabel
                control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Exclude System Carriers</Typography>}
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Group Name*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.groupName || ''}
                onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Group Number*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.groupNumber || ''}
                onChange={(e) => setFormData({...formData, groupNumber: e.target.value})}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Notes</Typography>
              <TextField 
                fullWidth multiline rows={4} placeholder="Add notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
            </Box>
          </Grid>

          {/* Middle Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Plan or employer's name*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.employer || ''}
                onChange={(e) => setFormData({...formData, employer: e.target.value})}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Plan or employer's phone:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Plan Fee Guide:</Typography>
              <FormControl fullWidth size="small">
                <Select value="None" sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }} MenuProps={{ sx: { zIndex: 10000 } }}>
                  <MenuItem value="None">None</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Providers Plan Fee Guides:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#2563eb', cursor: 'pointer', mt: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>+ Add</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Health Plan</Typography>} />
              <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>CoPay/Fixed Benefits Plan</Typography>} />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <FormControlLabel 
                control={<Checkbox checked={formData.assignment === 'Assignment'} size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} onChange={() => setFormData({...formData, assignment: 'Assignment'})}/>} 
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Assignment</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox checked={formData.assignment === 'Non-Assignment'} size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} onChange={() => setFormData({...formData, assignment: 'Non-Assignment'})}/>} 
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Non-Assignment</Typography>} 
              />
            </Box>
          </Grid>

          {/* Right Column - Coverage */}
          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 600, mb: 2 }}>Coverage</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Individual annual max amount:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField size="small" value={formData.individualMax} onChange={(e) => setFormData({...formData, individualMax: e.target.value})} sx={{ width: 100, "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}/>
                <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} checked={formData.individualMaxUnlimited} onChange={(e) => setFormData({...formData, individualMaxUnlimited: e.target.checked})} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>unlimited</Typography>} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Family annual max amount:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField size="small" value={formData.familyMax} onChange={(e) => setFormData({...formData, familyMax: e.target.value})} sx={{ width: 100, "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}/>
                <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} checked={formData.familyMaxUnlimited} onChange={(e) => setFormData({...formData, familyMaxUnlimited: e.target.checked})} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>unlimited</Typography>} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>Ortho lifetime limit:</Typography>
                <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#e2e8f0', color: '#334155', fontSize: '0.7rem', boxShadow: 'none', '&:hover': { backgroundColor: '#cbd5e1', boxShadow: 'none' } }}>Add Limit</Button>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.2 }}>Honor Write Off (When Limitation Reached for In-Network Providers Only)</Typography>} />
            </Box>
            <Box sx={{ mt: 1 }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Save as template</Typography>} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: "20px", py: "12px", borderTop: '1px solid #e0e5eb', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onSave}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanFormDialog;
