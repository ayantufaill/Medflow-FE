import React, { useState, useMemo } from 'react';
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
  const [payerType, setPayerType] = useState('Payer');
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredCarriers = useMemo(() => {
    let filtered = MOCK_CARRIERS;
    if (searchText) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return filtered;
  }, [searchText]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Carrier,Total Collection,Patient Name,Patient Collection,Patient Production,Patient Write-off\n";
    MOCK_CARRIERS.forEach(carrier => {
      csvContent += `"${carrier.name}","${carrier.collection}","","","",""\n`;
      carrier.patients.forEach(p => {
        csvContent += `"${carrier.name}","","${p.name}","${p.collection}","${p.production}","${p.writeoff}"\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "collection_carrier.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Collection Per Carrier Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
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
            <RadioGroup row value={payerType} onChange={(e) => setPayerType(e.target.value)}>
              <FormControlLabel value="Payer" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Filter by Payer:</Typography>} />
              <FormControlLabel value="Plan" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Filter by Plan:</Typography>} />
            </RadioGroup>
            <TextField size="small" variant="outlined" placeholder="Enter Name" value={searchText} onChange={(e) => setSearchText(e.target.value)} sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }} />
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
      </Box>

      {/* Carrier Sections */}
      {filteredCarriers.map((carrier, idx) => (
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

