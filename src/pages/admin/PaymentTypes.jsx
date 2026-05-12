import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Add as AddIcon
} from '@mui/icons-material';

const PaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([
    { id: 1, type: 'Do not use', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 2, type: 'Check', depositSlip: true, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 3, type: 'Account Credit', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, disabled: true, deleted: false },
    { id: 4, type: 'Debit Card', depositSlip: false, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, deleted: false },
    { id: 5, type: 'EFT', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 6, type: 'Cash', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 7, type: 'Care Credit', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 8, type: 'Master Card', depositSlip: false, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, deleted: false },
    { id: 9, type: 'Visa Card', depositSlip: false, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, deleted: false },
    { id: 10, type: 'ACH Payment', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, disabled: true, deleted: false },
    { id: 11, type: 'Patient Overpayment', depositSlip: false, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, disabled: true, deleted: false },
    { id: 12, type: 'American Express', depositSlip: false, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, deleted: false },
    { id: 13, type: 'Discover', depositSlip: false, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, deleted: false },
    { id: 14, type: 'Card on File', depositSlip: false, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, disabled: true, deleted: false },
    { id: 15, type: 'Online Card', depositSlip: true, openEdge: false, prosperipay: false, smilepay: true, note: 'Added automatically and used for online (MyChart) card payments', deletable: false, deleted: false },
    { id: 16, type: 'Sunbit', depositSlip: true, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 17, type: 'Cherry', depositSlip: true, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 18, type: 'HFD', depositSlip: true, openEdge: false, prosperipay: false, smilepay: false, note: '', deletable: true, deleted: false },
    { id: 19, type: 'VCC', depositSlip: true, openEdge: false, prosperipay: false, smilepay: true, note: '', deletable: true, deleted: false },
  ]);

  const [showDeleted, setShowDeleted] = useState(false);
  const [defaultTypes, setDefaultTypes] = useState({
    patient: 'Master Card',
    insurance: 'Master Card',
    family: ''
  });

  const handleToggle = (id, field) => {
    setPaymentTypes(prev => prev.map(pt => 
      pt.id === id ? { ...pt, [field]: !pt[field] } : pt
    ));
  };

  const handleNoteChange = (id, value) => {
    setPaymentTypes(prev => prev.map(pt => 
      pt.id === id ? { ...pt, note: value } : pt
    ));
  };

  const handleDelete = (id) => {
    setPaymentTypes(prev => prev.map(pt => 
      pt.id === id ? { ...pt, deleted: true } : pt
    ));
  };

  const handleRestore = (id) => {
    setPaymentTypes(prev => prev.map(pt => 
      pt.id === id ? { ...pt, deleted: false } : pt
    ));
  };

  const visiblePaymentTypes = paymentTypes.filter(pt => showDeleted || !pt.deleted);

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; Payment Types
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />}
            label={<Typography sx={{ fontSize: '0.8125rem' }}>Show Deleted Payment Types</Typography>}
            sx={{ m: 0 }}
          />
          <MuiLink 
            component="button" 
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8125rem', color: '#4b71a1', textDecoration: 'none' }}
          >
            <SyncIcon sx={{ fontSize: '1rem' }} /> Sync
          </MuiLink>
        </Box>
      </Box>

      {/* Main Table Card */}
      <Box sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 1, p: 3 }}>
        <TableContainer>
          <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f0f0f0', py: 0.5 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Type</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Include on Deposit Slip</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Use Open Edge</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Use Prosperipay</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Use SmilePay</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Note</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePaymentTypes.map((pt) => (
                <TableRow key={pt.id} sx={{ '&:hover': { bgcolor: '#fbfbfb' }, opacity: pt.deleted ? 0.6 : 1 }}>
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: pt.deleted ? '#e53e3e' : (pt.disabled ? '#a0aec0' : '#4a5568') }}>
                    {pt.type} {pt.deleted && '(Deleted)'}
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.depositSlip} onChange={() => handleToggle(pt.id, 'depositSlip')} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.openEdge} onChange={() => handleToggle(pt.id, 'openEdge')} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.prosperipay} onChange={() => handleToggle(pt.id, 'prosperipay')} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.smilepay} onChange={() => handleToggle(pt.id, 'smilepay')} />
                  </TableCell>
                  <TableCell sx={{ width: '40%' }}>
                    <TextField
                      variant="standard"
                      fullWidth
                      value={pt.note}
                      onChange={(e) => handleNoteChange(pt.id, e.target.value)}
                      sx={{ '& .MuiInput-underline:before': { borderBottomColor: '#e2e8f0' }, '& .MuiInputBase-input': { fontSize: '0.75rem', color: pt.deletable ? '#4a5568' : '#a0aec0' } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {pt.deleted ? (
                      <MuiLink component="button" onClick={() => handleRestore(pt.id)} sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>
                        Restore
                      </MuiLink>
                    ) : (
                      <IconButton size="small" disabled={!pt.deletable} onClick={() => handleDelete(pt.id)}>
                        <DeleteIcon sx={{ fontSize: '1rem', color: pt.deletable ? '#feb2b2' : '#edf2f7' }} />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2 }}>
          <MuiLink 
            component="button" 
            sx={{ fontSize: '0.8125rem', color: '#4b71a1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            +add
          </MuiLink>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#4b71a1', fontStyle: 'italic', mb: 0.5 }}>
            Any adjustment added on a payment type will automatically apply to the invoice of the patient once selected.
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#4b71a1', fontStyle: 'italic', mb: 4 }}>
            Any note added on a payment type will be visible on the invoice.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', width: '220px' }}>Patient Payment Default Type:</Typography>
              <Select
                size="small"
                value={defaultTypes.patient}
                onChange={(e) => setDefaultTypes({ ...defaultTypes, patient: e.target.value })}
                sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
              >
                <MenuItem value="Master Card">Master Card</MenuItem>
                <MenuItem value="Visa Card">Visa Card</MenuItem>
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', width: '220px' }}>Insurance Payment Default Type:</Typography>
              <Select
                size="small"
                value={defaultTypes.insurance}
                onChange={(e) => setDefaultTypes({ ...defaultTypes, insurance: e.target.value })}
                sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
              >
                <MenuItem value="Master Card">Master Card</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', width: '220px' }}>Family Payment Default Type:</Typography>
              <Select
                size="small"
                value={defaultTypes.family}
                onChange={(e) => setDefaultTypes({ ...defaultTypes, family: e.target.value })}
                sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentTypes;
