import React from 'react';
import { Box, Typography, Grid, FormControlLabel, Checkbox } from '@mui/material';

const HeaderConfig = ({ headerChecks, setHeaderChecks }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
        Header Area
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Office Info
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.logo || false} onChange={(e) => setHeaderChecks({...headerChecks, logo: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Logo</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.phone || false} onChange={(e) => setHeaderChecks({...headerChecks, phone: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Phone Number</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.address || false} onChange={(e) => setHeaderChecks({...headerChecks, address: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Address</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.website || false} onChange={(e) => setHeaderChecks({...headerChecks, website: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Website</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.email || false} onChange={(e) => setHeaderChecks({...headerChecks, email: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Email</Typography>} 
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Patient Info
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.fullName || false} onChange={(e) => setHeaderChecks({...headerChecks, fullName: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Patient Full Name</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.title || false} onChange={(e) => setHeaderChecks({...headerChecks, title: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Patient Title</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.age || false} onChange={(e) => setHeaderChecks({...headerChecks, age: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Patient Age</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.dob || false} onChange={(e) => setHeaderChecks({...headerChecks, dob: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Patient DOB</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.patientPhone || false} onChange={(e) => setHeaderChecks({...headerChecks, patientPhone: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Patient Phone Number</Typography>} 
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Benefits
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.carrier || false} onChange={(e) => setHeaderChecks({...headerChecks, carrier: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Primary Carrier</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.deductible || false} onChange={(e) => setHeaderChecks({...headerChecks, deductible: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Primary Deductible</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.remaining || false} onChange={(e) => setHeaderChecks({...headerChecks, remaining: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Primary Remaining</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.secCarrier || false} onChange={(e) => setHeaderChecks({...headerChecks, secCarrier: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Secondary Carrier</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.secDeductible || false} onChange={(e) => setHeaderChecks({...headerChecks, secDeductible: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Secondary Deductible</Typography>} 
            />
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.secRemaining || false} onChange={(e) => setHeaderChecks({...headerChecks, secRemaining: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Secondary Remaining</Typography>} 
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Other
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel 
              control={<Checkbox size="small" checked={headerChecks.showPlanName || false} onChange={(e) => setHeaderChecks({...headerChecks, showPlanName: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Show treatment plan name</Typography>} 
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeaderConfig;
