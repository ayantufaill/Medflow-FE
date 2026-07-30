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
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';

const MembershipPlanFormDialog = ({ open, onClose, formData, setFormData, onSave }) => {
  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            Add New Membership Plan
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Configure membership plan details.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ mt: 1, px: 4, py: 3 }}>
        {/* Plan Details Section */}
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 2, color: '#1e293b' }}>Membership Plan Details</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>MEMBERSHIP PLAN NAME *</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter plan name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>MEMBERSHIP PLAN ANNUAL FEE *</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter annual fee"
              value={formData.annualFee}
              onChange={(e) => setFormData({...formData, annualFee: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>MEMBERSHIP PLAN MONTHLY FEE *</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter monthly fee"
              value={formData.monthlyFee}
              onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
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
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>INDIVIDUAL ANNUAL MAX *</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                fullWidth size="small" placeholder="Enter amount"
                disabled={formData.isIndividualMaxUnlimited}
                value={formData.individualMax}
                onChange={(e) => setFormData({...formData, individualMax: e.target.value})}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={formData.isIndividualMaxUnlimited} onChange={(e) => setFormData({...formData, isIndividualMaxUnlimited: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Unlimited</Typography>}
                sx={{ whiteSpace: 'nowrap' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>FAMILY ANNUAL MAX *</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                fullWidth size="small" placeholder="Enter amount"
                disabled={formData.isFamilyMaxUnlimited}
                value={formData.familyMax}
                onChange={(e) => setFormData({...formData, familyMax: e.target.value})}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={formData.isFamilyMaxUnlimited} onChange={(e) => setFormData({...formData, isFamilyMaxUnlimited: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>Unlimited</Typography>}
                sx={{ whiteSpace: 'nowrap' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: '#374151', mb: '4px' }}>ORTHO LIFETIME LIMIT</Typography>
            <TextField 
              fullWidth size="small" placeholder="Enter amount"
              value={formData.orthoLimit}
              onChange={(e) => setFormData({...formData, orthoLimit: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
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
          Create New Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipPlanFormDialog;
