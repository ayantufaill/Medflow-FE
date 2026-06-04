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
  TextField,
} from '@mui/material';

const MOCK_FAMILIES = [
  {
    id: '196',
    name: 'Family One',
    patientCollection: '$0.00',
    insuranceCollection: '$216.00',
    totalCollection: '$216.00',
    members: [
      { id: '196', name: 'Member A', patientCollection: '$0.00', insuranceCollection: '$216.00', totalCollection: '$216.00' }
    ]
  },
  {
    id: '298',
    name: 'Family Two',
    patientCollection: '$0.00',
    insuranceCollection: '$119.00',
    totalCollection: '$119.00',
    members: [
      { id: '298', name: 'Member B', patientCollection: '$0.00', insuranceCollection: '$119.00', totalCollection: '$119.00' }
    ]
  },
  {
    id: '782',
    name: 'Family Three',
    patientCollection: '$0.00',
    insuranceCollection: '$99.00',
    totalCollection: '$99.00',
    members: [
      { id: '782', name: 'Member C', patientCollection: '$0.00', insuranceCollection: '$99.00', totalCollection: '$99.00' }
    ]
  }
];

const TotalCollectionFamily = () => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('Default');

  const filteredFamilies = useMemo(() => {
    let filtered = MOCK_FAMILIES;
    if (searchText) {
      filtered = filtered.filter(f => f.name.toLowerCase().includes(searchText.toLowerCase()) || f.id.toLowerCase().includes(searchText.toLowerCase()));
    }
    return filtered;
  }, [searchText]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Patient,Patient Collection,Insurance Collection,Total Collection\n";
    MOCK_FAMILIES.forEach(family => {
      csvContent += `"${family.id}","${family.name}","${family.patientCollection}","${family.insuranceCollection}","${family.totalCollection}"\n`;
      family.members.forEach(member => {
        csvContent += `"${member.id}","${member.name}","${member.patientCollection}","${member.insuranceCollection}","${member.totalCollection}"\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "total_collection_family.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Total Collection By Family Report:
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Sort Report By</Typography>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ fontSize: '0.85rem', minWidth: 100, height: 32, backgroundColor: '#5c85bb', color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="Amount">Amount</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
      </Box>

      {/* Families List */}
      {filteredFamilies.map((family, idx) => (
        <Box key={idx} sx={{ mb: 6 }}>
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 600 }}>
              Total Patient Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#000', ml: 1 }}>{family.patientCollection}</Typography>
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 600 }}>
              Total Insurance Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#000', ml: 1 }}>{family.insuranceCollection}</Typography>
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 600 }}>
              Total Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#000', ml: 1 }}>{family.totalCollection}</Typography>
            </Typography>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ borderBottom: 'none', borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderTop: '1px solid #e0e0e0' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', width: '80px' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient Collection</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Insurance Collection</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Total Collection</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {family.members.map((member, mIdx) => (
                  <TableRow key={mIdx} sx={{ backgroundColor: '#fcfcfc' }}>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#0052cc', textDecoration: 'underline' }}>{member.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.patientCollection}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.insuranceCollection}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{member.totalCollection}</TableCell>
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

export default TotalCollectionFamily;

