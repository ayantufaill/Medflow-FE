import React, { useState } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import AddIcon from '@mui/icons-material/Add';

import CreateNewReferral from '../../components/clinical/CreateNewReferral';

const ReferralPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          {/* Add New Referral Button and Container */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
          <Button
            onClick={handleOpen}
            startIcon={<AddIcon sx={{ fontSize: '1.1rem !important' }} />}
            sx={{ textTransform: 'none', color: '#5b84c1', fontSize: '0.85rem', fontWeight: 500 }}
          >
            Add new referral
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        {/* Previous Referrals Container */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
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

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
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
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 2, height: '90vh' } }}
      >
        <CreateNewReferral onClose={handleClose} />
      </Dialog>
    </Box>
  );
};

export default ReferralPage;