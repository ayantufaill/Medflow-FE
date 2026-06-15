import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Radio,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid
} from '@mui/material';

const DEDUCTIBLE_CATEGORIES = [
  { category: 'Standard', ind: 50, fam: 100, freq: 'Annual', std: false },
  { category: 'Preventative', ind: 0, fam: 0, freq: 'Annual', std: true },
  { category: 'Basic', ind: 50, fam: 100, freq: 'Annual', std: true },
  { category: 'Major', ind: 50, fam: 100, freq: 'Annual', std: true },
  { category: 'Orthodontics', ind: 50, fam: 100, freq: 'Annual', std: true },
];

// Static fallback if no coverageCategoryTable exists
const COVERAGE_TABLE = {
  left: [
    { name: 'Diagnostic', subs: [{ name: 'Preventative', val: '% 100' }, { name: 'Basic', val: '% 100' }] },
    { name: 'Preventative', subs: [{ name: 'Preventative', val: '% 100' }, { name: 'Basic', val: '% 80' }] },
    { name: 'Restorative', subs: [{ name: 'Basic', val: '% 80' }, { name: 'Major', val: '% 50' }] },
    { name: 'Endodontics', val: '% 80' },
    { name: 'Periodontics', subs: [{ name: 'Major', val: '% 50' }, { name: 'Basic', val: '% 80' }] },
    { name: 'Prosthodontics, Removable', val: '% 50' },
    { name: 'Maxillofacial Prosthetics', val: '% 50' },
  ],
  right: [
    { name: 'Implant Services', val: '% 50' },
    { name: 'Prosthodontics, Fixed', val: '% 50' },
    { name: 'Oral Surgery', subs: [{ name: 'Basic', val: '% 80' }, { name: 'Major', val: '% 50' }] },
    { name: 'Adjunctive General Services', subs: [{ name: 'Basic', val: '% 50' }, { name: 'Major', val: '% 50' }, { name: 'Standard', val: '% 50' }] },
    { name: 'Medicament carrier', val: '% 50' },
    { name: 'Orthodontics', val: '% 50' },
  ]
};

const mapCategory = (key, title, data) => {
  const items = data?.[key] || [];
  if (items.length === 0) return { name: title, val: '% 0' };
  if (items.length === 1) return { name: title, val: `% ${items[0].coverage}` };
  return { name: title, subs: items.map(item => ({ name: item.label, val: `% ${item.coverage}` })) };
};

const ReadOnlyField = ({ label, value, underlined }) => (
  <Box sx={{ display: 'flex', mb: 1, borderBottom: underlined ? '1px solid #f0f0f0' : 'none', pb: 0.5 }}>
    <Typography sx={{ fontSize: '0.85rem', color: '#666', minWidth: '180px' }}>{label}</Typography>
    <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>{value || ' '}</Typography>
  </Box>
);

export default function ViewCoverage({ open, onClose, insurance, getInsuranceCompanyName }) {
  const companyName = getInsuranceCompanyName?.(insurance?.insuranceCompanyId) || 'Delta Dental of Washington';

  const covDataArray = insurance?.coverageCategoryTable;
  let covData = null;
  if (Array.isArray(covDataArray) && covDataArray.length > 0 && typeof covDataArray[0] === 'object' && covDataArray[0].category) {
    covData = {};
    covDataArray.forEach(group => {
      covData[group.category] = group.items;
    });
  } else if (covDataArray && !Array.isArray(covDataArray)) {
    covData = covDataArray;
  }

  const coverageLeft = covData && Object.keys(covData).length > 0 ? [
    mapCategory('diagnostic', 'Diagnostic', covData),
    mapCategory('preventative', 'Preventative', covData),
    mapCategory('restorative', 'Restorative', covData),
    mapCategory('endodontics', 'Endodontics', covData),
    mapCategory('periodontics', 'Periodontics', covData),
    mapCategory('prosthodonticsRemovable', 'Prosthodontics, Removable', covData),
    mapCategory('maxillofacialProsthetics', 'Maxillofacial Prosthetics', covData)
  ] : COVERAGE_TABLE.left;

  const coverageRight = covData && Object.keys(covData).length > 0 ? [
    mapCategory('implantServices', 'Implant Services', covData),
    mapCategory('prosthodonticsFixed', 'Prosthodontics, Fixed', covData),
    mapCategory('oralSurgery', 'Oral Surgery', covData),
    mapCategory('adjunctGeneral', 'Adjunctive General Services', covData),
    { name: 'Medicament carrier', val: '% 50' },
    mapCategory('orthodontics', 'Orthodontics', covData)
  ] : COVERAGE_TABLE.right;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 0 } }}>
      {/* Title bar */}
      <Box sx={{ bgcolor: '#4a73b8', color: 'white', py: 1.5, textAlign: 'center', position: 'relative' }}>
        <Typography variant="subtitle1" fontWeight={600}>Insurance Plan</Typography>
      </Box>

      <DialogContent sx={{ p: 4, pt: 2, bgcolor: '#fbfbfb' }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ border: '1px solid #777', p: 1, mb: 1, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#666', minWidth: '80px' }}>Payer Name*:</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>{companyName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#666', minWidth: '80px' }}>Payer ID*:</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>{insurance?.payerId || '91062'}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
               <Button variant="contained" size="small" sx={{ bgcolor: '#4a73b8', textTransform: 'none', py: 0.2, px: 2, borderRadius: 1 }}>Edit carrier</Button>
            </Box>
            
            <ReadOnlyField label="Group Name*:" value={insurance?.groupName || 'Billing Training Oryx'} underlined />
            <ReadOnlyField label="Group Number*:" value={insurance?.groupNumber || '12345980'} underlined />
          </Grid>
          
          {/* Middle Column */}
          <Grid item xs={12} md={4}>
            <ReadOnlyField label="Plan or employer's name*:" value={insurance?.employerName || 'Billing Training Oryx'} underlined />
            <ReadOnlyField label="Plan or employer's phone:" value={insurance?.employerPhone || ''} underlined />
            <ReadOnlyField label="Plan Fee Guide:" value="None" underlined />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <FormControlLabel 
                control={<Radio size="small" sx={{ color: '#ccc' }} />} 
                label={<Typography sx={{fontSize: '0.85rem', color: '#999'}}>Health Plan</Typography>} 
              />
              <FormControlLabel 
                control={<Radio size="small" checked sx={{ color: '#ccc', '&.Mui-checked': { color: '#ccc' } }} />} 
                label={<Typography sx={{fontSize: '0.85rem', color: '#999'}}>CoPay/Fixed Benefits Plan</Typography>} 
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.85rem', color: '#4a73b8', fontWeight: 600, mb: 1 }}>Coverage</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', minWidth: '180px' }}>Individual annual max amount:</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#888', mr: 2 }}>{insurance?.coverageLimits?.individual?.annualMax || '$1500.00'}</Typography>
              <FormControlLabel 
                control={<Checkbox size="small" checked={insurance?.coverageLimits?.individual?.unlimited || false} sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#ccc' } }} />} 
                label={<Typography sx={{fontSize: '0.85rem', color: '#999'}}>unlimited</Typography>} 
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', minWidth: '180px' }}>Family annual max amount:</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#888', mr: 2 }}>{insurance?.coverageLimits?.family?.annualMax || '$0.00'}</Typography>
              <FormControlLabel 
                control={<Checkbox size="small" checked={insurance?.coverageLimits?.family?.unlimited || false} sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#ccc' } }} />} 
                label={<Typography sx={{fontSize: '0.85rem', color: '#999'}}>unlimited</Typography>} 
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', minWidth: '180px' }}>Ortho lifetime limit:</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#888', mr: 2 }}>{insurance?.coverageLimits?.ortho?.annualMax || '$0.00'}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={0}>
          {/* Deductibles */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 1 }}>Deductibles</Typography>
            <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: 'none', py: 0.5, px: 2 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#333' }}>Category</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#333' }}>Individual</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#333' }}>Family</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#333' }}>Frequency</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(insurance?.deductiblesGrid?.length > 0 ? insurance.deductiblesGrid : DEDUCTIBLE_CATEGORIES.map(d => ({ type: d.category, individual: `$${d.ind.toFixed(2)}`, family: `$${d.fam.toFixed(2)}`, standard: d.std }))).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#555' }}>{row.type || row.category}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#4a73b8' }}>{row.individual || '$0.00'}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#4a73b8' }}>{row.family || '$0.00'}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#ccc' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Annual <span style={{fontSize:'8px'}}>▼</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                       <FormControlLabel 
                         control={<Checkbox size="small" checked={row.standard || row.std} sx={{ p: 0, mr: 0.5, color: '#ccc', '&.Mui-checked': { color: '#ccc' } }} />} 
                         label={<Typography sx={{fontSize: '0.8rem', color: '#999'}}>standard</Typography>} 
                       />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>

          {/* Coverage Table */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, borderLeft: '1px solid #ddd', pl: 2, height: '32px' }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#333', mr: 2 }}>Coverage table</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#4a73b8', cursor: 'pointer' }}>+ Add Coverage</Typography>
            </Box>
            
            <Grid container spacing={0} sx={{ borderLeft: '1px solid #ddd' }}>
               <Grid item xs={6} sx={{ pl: 2 }}>
                 {/* Left Coverage */}
                 <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: 'none', py: 0.2, px: 2 } }}>
                   <TableBody>
                     {coverageLeft.map((item, i) => (
                       <React.Fragment key={i}>
                         <TableRow>
                           <TableCell sx={{ fontSize: '0.8rem', color: '#555' }}>{item.name}</TableCell>
                           <TableCell sx={{ fontSize: '0.8rem', color: '#4a73b8', textAlign: 'right' }}>{item.val}</TableCell>
                         </TableRow>
                         {item.subs && item.subs.map((sub, j) => (
                           <TableRow key={j}>
                             <TableCell sx={{ fontSize: '0.8rem', color: '#555', pl: 3 }}>{sub.name}</TableCell>
                             <TableCell sx={{ fontSize: '0.8rem', color: '#4a73b8', textAlign: 'right' }}>{sub.val}</TableCell>
                           </TableRow>
                         ))}
                       </React.Fragment>
                     ))}
                   </TableBody>
                 </Table>
               </Grid>
               <Grid item xs={6}>
                 {/* Right Coverage */}
                 <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: 'none', py: 0.2, px: 2 }, borderLeft: '1px solid #ddd' }}>
                   <TableBody>
                     {coverageRight.map((item, i) => (
                       <React.Fragment key={i}>
                         <TableRow>
                           <TableCell sx={{ fontSize: '0.8rem', color: '#555' }}>{item.name}</TableCell>
                           <TableCell sx={{ fontSize: '0.8rem', color: '#4a73b8', textAlign: 'right' }}>{item.val}</TableCell>
                         </TableRow>
                         {item.subs && item.subs.map((sub, j) => (
                           <TableRow key={j}>
                             <TableCell sx={{ fontSize: '0.8rem', color: '#555', pl: 3 }}>{sub.name}</TableCell>
                             <TableCell sx={{ fontSize: '0.8rem', color: '#4a73b8', textAlign: 'right' }}>{sub.val}</TableCell>
                           </TableRow>
                         ))}
                       </React.Fragment>
                     ))}
                   </TableBody>
                 </Table>
               </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 1 }}>
           <Button variant="contained" size="small" onClick={onClose} sx={{ bgcolor: '#8b9dc3', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#7a8bb0' } }}>Plan Fee Guide</Button>
           <Button variant="contained" size="small" onClick={onClose} sx={{ bgcolor: '#4a73b8', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#3b588c' } }}>Coverage Book</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
