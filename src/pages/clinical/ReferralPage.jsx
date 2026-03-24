import React, { useState } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import AddIcon from '@mui/icons-material/Add';

const ReferralPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    specialist: '',
    specialty: '',
    reason: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ specialist: '', specialty: '', reason: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddReferral = () => {
    if (!formData.specialist) return;
    
    const newReferral = {
      id: referrals.length + 1,
      ...formData,
      date: new Date().toLocaleDateString(),
    };
    
    setReferrals([...referrals, newReferral]);
    handleClose();
  };

  return (
    <Box>
      <ClinicalNavbar />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Referral
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Patient referrals and specialist recommendations
        </Typography>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        {/* Previous Referrals Container */}
        <Box sx={{ maxWidth: '1000px', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', mt: 4 }}>
          <Box sx={{ backgroundColor: '#2e3b84', py: 1, textAlign: 'center' }}>
            <Typography sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>
              Previous Referrals
            </Typography>
          </Box>

          <Box sx={{ backgroundColor: '#fff' }}>
            {referrals.length === 0 ? (
              <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No previous referrals were created
                </Typography>
              </Box>
            ) : (
              referrals.map((ref) => (
                <Box key={ref.id} sx={{ p: 2, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{ref.specialist} ({ref.specialty})</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Reason: {ref.reason}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>{ref.date}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', maxWidth: '1000px' }}>
          <Button
            onClick={handleOpen}
            startIcon={<AddIcon sx={{ fontSize: '1.1rem !important' }} />}
            sx={{ textTransform: 'none', color: '#5b84c1', fontSize: '0.85rem', fontWeight: 500 }}
          >
            Add new referral
          </Button>
        </Box>
      </Box>

      {/* Add Referral Form Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1a2735' }}>Create New Referral</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Specialist Name"
              name="specialist"
              fullWidth
              size="small"
              value={formData.specialist}
              onChange={handleChange}
            />
            <TextField
              select
              label="Specialty"
              name="specialty"
              fullWidth
              size="small"
              value={formData.specialty}
              onChange={handleChange}
            >
              <MenuItem value="Oral Surgeon">Oral Surgeon</MenuItem>
              <MenuItem value="Endodontist">Endodontist</MenuItem>
              <MenuItem value="Periodontist">Periodontist</MenuItem>
              <MenuItem value="Orthodontist">Orthodontist</MenuItem>
            </TextField>
            <TextField
              label="Reason for Referral"
              name="reason"
              multiline
              rows={3}
              fullWidth
              size="small"
              value={formData.reason}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} sx={{ color: '#666', textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleAddReferral} 
            variant="contained" 
            sx={{ backgroundColor: '#2e3b84', textTransform: 'none', '&:hover': { backgroundColor: '#1e2a63' } }}
          >
            Create Referral
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferralPage;