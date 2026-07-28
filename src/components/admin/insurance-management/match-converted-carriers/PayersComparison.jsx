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
      width: '100%',
      '& .MuiOutlinedInput-root': {
        height: 36,
        bgcolor: '#fff',
        fontSize: '0.85rem',
        borderRadius: 2,
      },
    }}
  />
);

const PayersComparison = ({
  oldSearch,
  setOldSearch,
  oryxSearch,
  setOryxSearch,
  oldPayers,
  oryxPayers,
  selectedOld,
  setSelectedOld,
  selectedOryx,
  setSelectedOryx,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
      {/* Old Payers */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#1e293b',
          textAlign: 'center',
          mb: 2,
        }}>
          Old Payers
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchField value={oldSearch} onChange={(e) => setOldSearch(e.target.value)} />
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Payer Name</TableCell>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Payer ID</TableCell>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>Patients IDs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {oldPayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: 'none' }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                oldPayers.map((p, i) => (
                  <TableRow
                    key={i}
                    onClick={() => setSelectedOld(p)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedOld?.id === p.id ? '#eff6ff' : 'transparent',
                      '&:hover': { bgcolor: '#f8fafc' },
                      '&:last-child td, &:last-child th': { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8rem', color: '#1e293b', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#475569', py: 1 }}>{p.patientIds}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Oryx Payers */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#1e293b',
          textAlign: 'center',
          mb: 2,
        }}>
          MedFlow Payers
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchField value={oryxSearch} onChange={(e) => setOryxSearch(e.target.value)} />
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Payer Name</TableCell>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>Payer ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {oryxPayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3, color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: 'none' }}>
                    No Payer Selected
                  </TableCell>
                </TableRow>
              ) : (
                oryxPayers.map((p, i) => (
                  <TableRow
                    key={i}
                    onClick={() => setSelectedOryx(p)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedOryx?.id === p.id ? '#eff6ff' : 'transparent',
                      '&:hover': { bgcolor: '#f8fafc' },
                      '&:last-child td, &:last-child th': { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8rem', color: '#1e293b', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#475569', py: 1 }}>{p.id}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PayersComparison;
