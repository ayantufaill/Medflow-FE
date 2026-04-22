import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider
} from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';

const SimpleStatement = () => {
  const primaryBlue = '#40548e';
  const lightBlue = '#abb8d3';

  const LabelInput = ({ label, width = '100%' }) => (
    <Box sx={{ width, mb: 1.5 }}>
      <Divider sx={{ mb: 0.5, borderColor: '#999' }} />
      <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#555', display: 'block', mt: -0.5 }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fff', width: '100%', p: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* Header Bar */}
      <Box sx={{ bgcolor: primaryBlue, color: '#fff', py: 1, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 400 }}>Patient Account Statement</Typography>
      </Box>

      <Box sx={{ px: 1, py: 2 }}>
        {/* Top Section */}
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Box sx={{ mt: 2 }}>
              {/* Blurred Address Placeholder */}
              <Box sx={{ mb: 8 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.4, color: '#333' }}>
                  <strong>Your Clinic Name</strong><br />
                  123 Medical Dr.<br />
                  City, State, Zip<br />
                  (555) 555-5555
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 8, fontSize: '1.1rem' }}>test test</Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ mt: 1 }}>
              <LabelInput label="card number" />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <LabelInput label="expiry date" />
                <LabelInput label="security code" />
              </Box>
              <LabelInput label="full name (as appears on card)" />
              <LabelInput label="signature" />

              {/* Estimates Table */}
              <Box sx={{ mt: 2, border: `1px solid ${lightBlue}`, borderRadius: '4px', overflow: 'hidden' }}>
                <Grid container>
                  <Grid item xs={6} sx={{ p: 1, bgcolor: lightBlue, borderRight: '1px solid #fff' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Insurance Estimate:</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>$0.00</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ p: 1, bgcolor: lightBlue }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Your Portion:</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>$0.00</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ p: 1, borderTop: `1px solid ${lightBlue}` }}>
                    <Typography sx={{ fontSize: '0.85rem', color: primaryBlue }}>Enclosed amount:</Typography>
                    <Box sx={{ height: '25px' }} />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Perforation Line */}
        <Box sx={{ position: 'relative', my: 5, borderTop: '1px dashed #bbb', textAlign: 'center' }}>
          <ContentCutIcon sx={{ position: 'absolute', left: 0, top: -12, color: '#bbb', fontSize: 20 }} />
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#777', fontSize: '0.75rem' }}>
            Please detach and return this part of the statement with your payment to ensure proper processing
          </Typography>
          <Divider sx={{ width: '60%', mx: 'auto', my: 1, opacity: 0.5 }} />
          <Typography variant="caption" sx={{ display: 'block', color: '#777', fontSize: '0.75rem' }}>
            Please keep this part of the statement for your records
          </Typography>
        </Box>

        {/* Middle Section: Info Box */}
        <Grid container sx={{ mb: 4 }} alignItems="flex-end">
          <Grid item xs={6}>
             <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>Your Clinic Name</Typography>
             <Typography variant="caption" sx={{ color: '#666' }}>123 Medical Dr. City, State, Zip</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ border: `1px solid ${lightBlue}`, borderRadius: '4px', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', borderBottom: `1px solid ${lightBlue}` }}>
                <Typography sx={{ flex: 1, p: 0.5, pl: 1, fontSize: '0.9rem', color: primaryBlue }}>Patient Name</Typography>
                <Typography sx={{ flex: 1, p: 0.5, fontSize: '0.9rem', borderLeft: `1px solid ${lightBlue}`, color: primaryBlue }}>test test</Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ flex: 1, p: 0.5, pl: 1, fontSize: '0.9rem', color: primaryBlue }}>Statement Date</Typography>
                <Typography sx={{ flex: 1, p: 0.5, fontSize: '0.9rem', borderLeft: `1px solid ${lightBlue}`, color: primaryBlue }}>04/15/2026</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Main Table */}
        <Box sx={{ border: `1px solid ${lightBlue}`, borderRadius: '8px', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: lightBlue, px: 2, py: 0.5, display: 'flex' }}>
            <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '0.85rem', color: primaryBlue }}>Date</Typography>
            <Typography sx={{ flex: 3.5, fontWeight: 'bold', fontSize: '0.85rem', color: primaryBlue }}>Description</Typography>
            <Typography sx={{ flex: 1.5, fontWeight: 'bold', fontSize: '0.85rem', color: primaryBlue }}>Provider</Typography>
            <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '0.85rem', color: primaryBlue, textAlign: 'right' }}>Amount</Typography>
          </Box>
          
          <Box sx={{ px: 2, py: 1.5, display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
            <Typography sx={{ flex: 1, fontSize: '0.85rem', color: primaryBlue }}>04/14/2026</Typography>
            <Box sx={{ flex: 3.5 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: primaryBlue }}>Invoice #24636: $100.00</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: primaryBlue }}>L5001 Broken appt</Typography>
            </Box>
            <Box sx={{ flex: 1.5 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#777' }}>[Provider Name]</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#999' }}>insurance est.</Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: primaryBlue }}>$100.00</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#abb8d3' }}>$0.00</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleStatement;