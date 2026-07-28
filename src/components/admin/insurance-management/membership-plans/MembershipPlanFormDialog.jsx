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
  Button,
  Box,
  InputAdornment,
  Link,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

const MembershipPlanFormDialog = ({ open, onClose, formData, setFormData, onSave }) => {
  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ backgroundColor: '#F8FAFC', color: '#1e293b', fontSize: '1.1rem', py: 2, px: 3, fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>
        Add New Membership Plan
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 3 }}>
        {/* Plan Details Section */}
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 2, color: '#1e293b' }}>Membership Plan Details</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>MEMBERSHIP PLAN NAME *</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter plan name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>MEMBERSHIP PLAN ANNUAL FEE *</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter annual fee"
              value={formData.annualFee}
              onChange={(e) => setFormData({...formData, annualFee: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>MEMBERSHIP PLAN MONTHLY FEE *</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter monthly fee"
              value={formData.monthlyFee}
              onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.isCoPay} onChange={(e) => setFormData({...formData, isCoPay: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>CoPay/Fixed Benefits Plan <InfoIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', ml: 0.5, color: '#94a3b8' }} /></Typography>}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox size="small" checked={formData.autoRenewal} onChange={(e) => setFormData({...formData, autoRenewal: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Auto Renewal</Typography>}
            />
          </Grid>
        </Grid>

        {/* Coverage Details Section */}
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 2, color: '#1e293b' }}>Coverage Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>INDIVIDUAL ANNUAL MAX *</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                fullWidth size="small" placeholder="Enter amount"
                disabled={formData.isIndividualMaxUnlimited}
                value={formData.individualMax}
                onChange={(e) => setFormData({...formData, individualMax: e.target.value})}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={formData.isIndividualMaxUnlimited} onChange={(e) => setFormData({...formData, isIndividualMaxUnlimited: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Unlimited</Typography>}
                sx={{ whiteSpace: 'nowrap' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>FAMILY ANNUAL MAX *</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                fullWidth size="small" placeholder="Enter amount"
                disabled={formData.isFamilyMaxUnlimited}
                value={formData.familyMax}
                onChange={(e) => setFormData({...formData, familyMax: e.target.value})}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={formData.isFamilyMaxUnlimited} onChange={(e) => setFormData({...formData, isFamilyMaxUnlimited: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Unlimited</Typography>}
                sx={{ whiteSpace: 'nowrap' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>ORTHO LIFETIME LIMIT</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter amount"
              value={formData.orthoLimit}
              onChange={(e) => setFormData({...formData, orthoLimit: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Link component="button" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>+ Add Note</Link>
        </Box>

        <Box sx={{ mt: 1 }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={formData.saveAsTemplate} onChange={(e) => setFormData({...formData, saveAsTemplate: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
            label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Save as template</Typography>}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1, backgroundColor: '#F8FAFC', borderTop: '1px solid #e2e8f0' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', fontSize: '0.85rem', px: 3, borderRadius: '6px',
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{
            textTransform: 'none', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.85rem', px: 3, borderRadius: '6px', boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Create New Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipPlanFormDialog;
