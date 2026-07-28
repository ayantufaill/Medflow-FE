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
} from '@mui/material';

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
      PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ backgroundColor: '#F8FAFC', color: '#1e293b', fontSize: '1.1rem', py: 2, px: 3, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 3 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Select Payer (Carrier)*:</Typography>
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
                    sx={{ '& .MuiOutlinedInput-root': { height: 35, py: 0, fontSize: '0.85rem' } }}
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
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Group Name*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.groupName || ''}
                onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Group Number*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.groupNumber || ''}
                onChange={(e) => setFormData({...formData, groupNumber: e.target.value})}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Notes</Typography>
              <TextField 
                fullWidth multiline rows={4} placeholder="Add notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem' } }}
              />
            </Box>
          </Grid>

          {/* Middle Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Plan or employer's name*:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.employer || ''}
                onChange={(e) => setFormData({...formData, employer: e.target.value})}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Plan or employer's phone:</Typography>
              <TextField 
                fullWidth size="small" 
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Plan Fee Guide:</Typography>
              <FormControl fullWidth size="small">
                <Select value="None" sx={{ fontSize: '0.85rem' }}>
                  <MenuItem value="None">None</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Providers Plan Fee Guides:</Typography>
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
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Individual annual max amount:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField size="small" value={formData.individualMax} onChange={(e) => setFormData({...formData, individualMax: e.target.value})} sx={{ width: 100, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}/>
                <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} checked={formData.individualMaxUnlimited} onChange={(e) => setFormData({...formData, individualMaxUnlimited: e.target.checked})} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>unlimited</Typography>} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: '#475569', mb: 0.5, display: 'block' }}>Family annual max amount:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField size="small" value={formData.familyMax} onChange={(e) => setFormData({...formData, familyMax: e.target.value})} sx={{ width: 100, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}/>
                <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} checked={formData.familyMaxUnlimited} onChange={(e) => setFormData({...formData, familyMaxUnlimited: e.target.checked})} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>unlimited</Typography>} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" fontWeight={600} sx={{ color: '#475569' }}>Ortho lifetime limit:</Typography>
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
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1, backgroundColor: '#F8FAFC', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            color: '#475569',
            borderColor: '#cbd5e1',
            fontSize: '0.85rem',
            px: 3,
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '0.85rem',
            px: 3,
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanFormDialog;
