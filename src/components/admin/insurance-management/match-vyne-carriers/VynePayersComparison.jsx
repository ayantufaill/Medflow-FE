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
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon, Info as InfoIcon } from '@mui/icons-material';

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

const VynePayersComparison = ({
  officeSearch,
  setOfficeSearch,
  vyneSearch,
  setVyneSearch,
  officePayers,
  vynePayers,
  selectedOffice,
  setSelectedOffice,
  selectedVyne,
  setSelectedVyne
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
      {/* Office Payers */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          fontWeight: 600,
          fontSize: '1rem',
          color: '#1e293b',
          textAlign: 'center',
          mb: 2,
        }}>
          Office Payers
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchField value={officeSearch} onChange={(e) => setOfficeSearch(e.target.value)} />
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Payer Name</TableCell>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>Payer ID</TableCell>
                <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', width: 40 }} align="center">
                  <VisibilityIcon sx={{ fontSize: '1rem' }} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {officePayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: 'none' }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                officePayers.map((p, i) => (
                  <TableRow
                    key={i}
                    onClick={() => setSelectedOffice(p)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedOffice?.id === p.id ? '#eff6ff' : 'transparent',
                      '&:hover': { bgcolor: '#f8fafc' },
                      '&:last-child td, &:last-child th': { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8rem', color: '#1e293b', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#475569', borderRight: '1px solid #e2e8f0', py: 1 }}>{p.id}</TableCell>
                    <TableCell sx={{ py: 1 }} align="center">
                      <IconButton size="small">
                        <VisibilityIcon sx={{ fontSize: '0.9rem', color: '#64748b' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Vyne Payers */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          fontWeight: 600,
          fontSize: '1rem',
          color: '#1e293b',
          textAlign: 'center',
          mb: 2,
        }}>
          Vyne Payers <InfoIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', color: '#94a3b8', ml: 0.5 }} />
        </Typography>
        <Box sx={{ mb: 2 }}>
          <SearchField value={vyneSearch} onChange={(e) => setVyneSearch(e.target.value)} />
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
              {vynePayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3, color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', borderBottom: 'none' }}>
                    No Payer Selected
                  </TableCell>
                </TableRow>
              ) : (
                vynePayers.map((p, i) => (
                  <TableRow
                    key={i}
                    onClick={() => setSelectedVyne(p)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedVyne?.id === p.id ? '#eff6ff' : 'transparent',
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

export default VynePayersComparison;
