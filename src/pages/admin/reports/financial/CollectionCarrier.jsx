import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from '@mui/material';

const MOCK_CARRIERS = [
  {
    name: 'CIGNA',
    collection: '$1,236.00',
    production: '$2,713.00',
    writeoff: '$2,134.00',
    patients: [
      { name: 'Patient One', collection: '$1,017.00', production: '$2,494.00', writeoff: '$1,910.00' },
      { name: 'Patient Two', collection: '$148.00', production: '$148.00', writeoff: '$156.00' },
      { name: 'Patient Three', collection: '$71.00', production: '$71.00', writeoff: '$68.00' },
    ]
  },
  {
    name: 'United Healthcare',
    collection: '$216.00',
    production: '$216.00',
    writeoff: '$211.00',
    patients: [
      { name: 'Patient Four', collection: '$216.00', production: '$216.00', writeoff: '$211.00' },
    ]
  }
];

const CollectionCarrier = () => {
  const [networkFilter, setNetworkFilter] = useState('None');
  const [payerFilter, setPayerFilter] = useState('Payer');

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Collection Per Carrier Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Date Range:</Typography>
            <Select value="Daily" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
              <MenuItem value="Daily">Daily</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', ml: 1 }}>← May 08, 2026 →</Typography>
            <Typography sx={{ fontSize: '0.85rem' }}>Date: 05/08/2026</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Provider:</Typography>
            <Select value="All" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
              <MenuItem value="All">All</MenuItem>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Filter by:</Typography>
            <RadioGroup row value={networkFilter} onChange={(e) => setNetworkFilter(e.target.value)}>
              <FormControlLabel value="None" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>None</Typography>} />
              <FormControlLabel value="In" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>In Network</Typography>} />
              <FormControlLabel value="Out" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Out of Network</Typography>} />
            </RadioGroup>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RadioGroup row value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)}>
              <FormControlLabel value="Payer" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Filter by Payer:</Typography>} />
            </RadioGroup>
            <TextField size="small" variant="outlined" placeholder="Enter Name" sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RadioGroup row value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)}>
              <FormControlLabel value="Plan" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Filter by Plan:</Typography>} />
            </RadioGroup>
            <TextField size="small" variant="outlined" placeholder="Enter Name" sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }} />
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="contained" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.8rem' }}>Apply Filters</Button>
            <Button variant="contained" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.8rem' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.8rem' }}>Export CSV</Button>
        <Button variant="contained" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.8rem' }}>Print</Button>
      </Box>

      {/* Carrier Sections */}
      {MOCK_CARRIERS.map((carrier, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          <Typography sx={{ color: '#0052cc', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>{carrier.name}</Typography>
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Total Collection: <Typography component="span" sx={{ fontWeight: 600, color: '#000' }}>{carrier.collection}</Typography></Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Total Production: <Typography component="span" sx={{ fontWeight: 600, color: '#000' }}>{carrier.production}</Typography></Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Total Write-off: <Typography component="span" sx={{ fontWeight: 600, color: '#000' }}>{carrier.writeoff}</Typography></Typography>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ borderBottom: 'none', borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderTop: '1px solid #e0e0e0' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Collection</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Production</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Write-off</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {carrier.patients.map((p, pIdx) => (
                  <TableRow key={pIdx} sx={{ backgroundColor: '#fcfcfc' }}>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#0052cc', textDecoration: 'underline' }}>{p.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{p.collection}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{p.production}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{p.writeoff}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default CollectionCarrier;

