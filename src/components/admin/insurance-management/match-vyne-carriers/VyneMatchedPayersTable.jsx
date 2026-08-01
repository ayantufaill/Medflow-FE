import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchField = ({ value, onChange, placeholder }) => (
  <TextField
    size="small"
    placeholder={placeholder || "Search list"}
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
        </InputAdornment>
      ),
    }}
    sx={{
      width: 250,
      '& .MuiOutlinedInput-root': {
        height: 36,
        bgcolor: '#fff',
        fontSize: '0.85rem',
        borderRadius: 2,
      },
    }}
  />
);

const VyneMatchedPayersTable = ({ matchedPayers, matchedSearch, setMatchedSearch, title = "Matched Payers" }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, position: 'relative' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <SearchField value={matchedSearch} onChange={(e) => setMatchedSearch(e.target.value)} />
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Office Payer Name</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Office Payer ID</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Vyne Payer Name</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Vyne Payer ID</TableCell>
              <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>Vyne Master ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchedPayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: 'none' }}>
                  No Data Available
                </TableCell>
              </TableRow>
            ) : (
              matchedPayers.map((p, i) => (
                <TableRow key={i} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #f1f5f9' }}>{p.officeName}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #f1f5f9' }}>{p.officeId}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #f1f5f9' }}>{p.vyneName}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #f1f5f9' }}>{p.vyneId}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{p.vyneMasterId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VyneMatchedPayersTable;
