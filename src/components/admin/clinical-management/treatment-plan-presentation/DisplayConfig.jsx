import React from 'react';
import { Box, Typography, Grid, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';

const DisplayConfig = ({ displayBy, setDisplayBy, displayPerItem, setDisplayPerItem, totals, setTotals }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 4 }}>
      {/* Procedure List Section */}
      <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
          Procedure List
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display by
            </Typography>
            <RadioGroup value={displayBy} onChange={(e) => setDisplayBy(e.target.value)}>
              <FormControlLabel 
                value="itemized" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Itemized per Phase & Visit Show Totals</Typography>} 
              />
              <FormControlLabel 
                value="no_sep" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Itemized (no separation)</Typography>} 
              />
              <FormControlLabel 
                value="code" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Grouped per Code</Typography>} 
              />
              <FormControlLabel 
                value="tooth" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Grouped per Tooth</Typography>} 
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display per item (1)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.dateDiagnosed || false} onChange={(e) => setDisplayPerItem({...displayPerItem, dateDiagnosed: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Date diagnosed</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.toothNumber || false} onChange={(e) => setDisplayPerItem({...displayPerItem, toothNumber: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Tooth number</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.procCode || false} onChange={(e) => setDisplayPerItem({...displayPerItem, procCode: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Procedure Code</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.shortDesc || false} onChange={(e) => setDisplayPerItem({...displayPerItem, shortDesc: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>System Short Description</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.officeDesc || false} onChange={(e) => setDisplayPerItem({...displayPerItem, officeDesc: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Description</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.procNote || false} onChange={(e) => setDisplayPerItem({...displayPerItem, procNote: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Procedure Note</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.showProcs || false} onChange={(e) => setDisplayPerItem({...displayPerItem, showProcs: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Show Procedures</Typography>} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Display per item (2)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.officeFee || false} onChange={(e) => setDisplayPerItem({...displayPerItem, officeFee: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office Fee/UCR</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.newFee || false} onChange={(e) => setDisplayPerItem({...displayPerItem, newFee: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>New Fee</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.billedFee || false} onChange={(e) => setDisplayPerItem({...displayPerItem, billedFee: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Billed Fee</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.contractedFee || false} onChange={(e) => setDisplayPerItem({...displayPerItem, contractedFee: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Contracted fee</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.ptPortion || false} onChange={(e) => setDisplayPerItem({...displayPerItem, ptPortion: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Estimated pt portion</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.insCoverage || false} onChange={(e) => setDisplayPerItem({...displayPerItem, insCoverage: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Estimated Ins Coverage</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.insAdj || false} onChange={(e) => setDisplayPerItem({...displayPerItem, insAdj: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Estimated Ins Adj</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.appliedAdj || false} onChange={(e) => setDisplayPerItem({...displayPerItem, appliedAdj: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Applied Adjustment</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={displayPerItem.appliedAdjPct || false} onChange={(e) => setDisplayPerItem({...displayPerItem, appliedAdjPct: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Applied Adjustment Percentage</Typography>} 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Totals Section */}
      <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
          Totals
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Fee Totals
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <FormControlLabel 
                control={<Checkbox size="small" checked={totals.officeFees || false} onChange={(e) => setTotals({...totals, officeFees: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office fees/UCR</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={totals.billedFees || false} onChange={(e) => setTotals({...totals, billedFees: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Billed fees</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={totals.contractedFees || false} onChange={(e) => setTotals({...totals, contractedFees: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Contracted fees</Typography>} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <FormControlLabel 
                control={<Checkbox size="small" checked={totals.adjustment || false} onChange={(e) => setTotals({...totals, adjustment: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Adjustment</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={totals.ptPortion || false} onChange={(e) => setTotals({...totals, ptPortion: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Estimated pt portion</Typography>} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" checked={totals.insCoverage || false} onChange={(e) => setTotals({...totals, insCoverage: e.target.checked})} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Estimated Ins Coverage</Typography>} 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DisplayConfig;
