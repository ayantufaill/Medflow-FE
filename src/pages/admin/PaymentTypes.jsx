import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Delete as DeleteIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

import {
  fetchPaymentTypes,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
  fetchPaymentTypeDefaults,
  savePaymentTypeDefaults,
  selectPaymentTypes,
  selectPaymentTypesLoading,
  selectPaymentTypeDefaults
} from '../../store/slices/billingSlice';

const DebouncedNoteField = ({ value, onBlur, ...props }) => {
  const [localVal, setLocalVal] = useState(value || '');
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setLocalVal(value || ''); }, [value]);
  
  return (
    <TextField
      {...props}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => onBlur(localVal)}
    />
  );
};

const PaymentTypes = () => {
  const dispatch = useDispatch();
  const paymentTypes = useSelector(selectPaymentTypes);
  const loading = useSelector(selectPaymentTypesLoading);
  const defaultTypes = useSelector(selectPaymentTypeDefaults);

  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentTypes());
    dispatch(fetchPaymentTypeDefaults());
  }, [dispatch]);

  const handleToggle = (pt, field) => {
    dispatch(updatePaymentType({
      id: pt.id,
      [field]: !pt[field]
    }));
  };

  const handleNoteChange = (pt, value) => {
    if (pt.note === value) return;
    dispatch(updatePaymentType({
      id: pt.id,
      note: value
    }));
  };

  const handleDelete = (id) => {
    dispatch(deletePaymentType(id));
  };

  const handleRestore = (pt) => {
    dispatch(updatePaymentType({
      id: pt.id,
      isHidden: false
    }));
  };

  const handleAdd = () => {
    dispatch(createPaymentType({
      name: 'New Payment Type',
      depositSlip: false,
      openEdge: false,
      prosperipay: false,
      smilepay: false,
      note: ''
    }));
  };

  const handleDefaultChange = (field, value) => {
    dispatch(savePaymentTypeDefaults({
      ...defaultTypes,
      [field]: value
    }));
  };

  if (loading && paymentTypes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const visiblePaymentTypes = paymentTypes.filter(pt => showDeleted || !pt.isHidden);

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
            onClick={() => dispatch(fetchPaymentTypes())}
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
                <TableRow key={pt.id} sx={{ '&:hover': { bgcolor: '#fbfbfb' }, opacity: pt.isHidden ? 0.6 : 1 }}>
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: pt.isHidden ? '#e53e3e' : '#4a5568' }}>
                    {pt.type} {pt.isHidden && '(Deleted)'}
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.depositSlip || false} onChange={() => handleToggle(pt, 'depositSlip')} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.openEdge || false} onChange={() => handleToggle(pt, 'openEdge')} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.prosperipay || false} onChange={() => handleToggle(pt, 'prosperipay')} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={pt.smilepay || false} onChange={() => handleToggle(pt, 'smilepay')} />
                  </TableCell>
                  <TableCell sx={{ width: '40%' }}>
                    <DebouncedNoteField
                      variant="standard"
                      fullWidth
                      value={pt.note}
                      onBlur={(newVal) => handleNoteChange(pt, newVal)}
                      sx={{ '& .MuiInput-underline:before': { borderBottomColor: '#e2e8f0' }, '& .MuiInputBase-input': { fontSize: '0.75rem', color: '#4a5568' } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {pt.isHidden ? (
                      <MuiLink component="button" onClick={() => handleRestore(pt)} sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>
                         Restore
                      </MuiLink>
                    ) : (
                      <IconButton size="small" onClick={() => handleDelete(pt.id)}>
                        <DeleteIcon sx={{ fontSize: '1rem', color: '#feb2b2' }} />
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
            onClick={handleAdd}
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
                value={defaultTypes.patient || ''}
                onChange={(e) => handleDefaultChange('patient', e.target.value)}
                sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
              >
                {paymentTypes.filter(pt => !pt.isHidden).map(pt => (
                  <MenuItem key={pt.id} value={pt.type}>{pt.type}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', width: '220px' }}>Insurance Payment Default Type:</Typography>
              <Select
                size="small"
                value={defaultTypes.insurance || ''}
                onChange={(e) => handleDefaultChange('insurance', e.target.value)}
                sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
              >
                {paymentTypes.filter(pt => !pt.isHidden).map(pt => (
                  <MenuItem key={pt.id} value={pt.type}>{pt.type}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', width: '220px' }}>Family Payment Default Type:</Typography>
              <Select
                size="small"
                value={defaultTypes.family || ''}
                onChange={(e) => handleDefaultChange('family', e.target.value)}
                sx={{ height: 24, fontSize: '0.8125rem', width: '150px' }}
              >
                <MenuItem value="">None</MenuItem>
                {paymentTypes.filter(pt => !pt.isHidden).map(pt => (
                  <MenuItem key={pt.id} value={pt.type}>{pt.type}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentTypes;
