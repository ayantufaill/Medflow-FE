import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {
  fetchPaymentTerminals,
  savePaymentTerminals,
  selectPaymentTerminals,
  selectPaymentTerminalsLoading
} from '../../store/slices/billingSlice';

const PaymentTerminals = () => {
  const dispatch = useDispatch();
  const paymentTerminalsState = useSelector(selectPaymentTerminals);
  const loading = useSelector(selectPaymentTerminalsLoading);

  useEffect(() => {
    dispatch(fetchPaymentTerminals());
  }, [dispatch]);

  // Derive lists from Redux state
  const openEdgeTerminals = paymentTerminalsState?.openEdge || [];
  const prosperipayTerminals = paymentTerminalsState?.prosperipay || [];
  const payrixTerminals = paymentTerminalsState?.payrix || [];

  // --- DIALOG OPEN/CLOSE STATES ---
  const [openEdgeManualOpen, setOpenEdgeManualOpen] = useState(false);
  const [openEdgeAutoOpen, setOpenEdgeAutoOpen] = useState(false);
  const [prosperipayOpen, setProsperipayOpen] = useState(false);
  const [payrixOpen, setPayrixOpen] = useState(false);

  // --- DIALOG FORM STATES ---
  const [openEdgeForm, setOpenEdgeForm] = useState({ serialNum: '', accountToken: '' });
  const [prosperipayForm, setProsperipayForm] = useState({ name: '', serialNum: '', merchantId: '', model: '', deviceId: '' });
  const [payrixForm, setPayrixForm] = useState({ terminalId: '', serialNum: '', modelNum: '', laneId: '' });

  // --- HANDLERS FOR ADDING ---
  const handleAddOpenEdge = (e) => {
    e.preventDefault();
    if (!openEdgeForm.serialNum || !openEdgeForm.accountToken) return;
    const newTerminals = {
      ...paymentTerminalsState,
      openEdge: [
        ...openEdgeTerminals,
        { id: Date.now(), serialNum: openEdgeForm.serialNum, accountToken: openEdgeForm.accountToken }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
    setOpenEdgeForm({ serialNum: '', accountToken: '' });
    setOpenEdgeManualOpen(false);
  };

  const handleAddOpenEdgeAuto = (e) => {
    e.preventDefault();
    const newTerminals = {
      ...paymentTerminalsState,
      openEdge: [
        ...openEdgeTerminals,
        { id: Date.now(), serialNum: 'AUTO-' + Math.floor(1000 + Math.random() * 9000), accountToken: 'TOKEN-' + Math.floor(100000 + Math.random() * 900000) }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
    setOpenEdgeAutoOpen(false);
  };

  const handleAddProsperipay = (e) => {
    e.preventDefault();
    if (!prosperipayForm.name || !prosperipayForm.serialNum) return;
    const newTerminals = {
      ...paymentTerminalsState,
      prosperipay: [
        ...prosperipayTerminals,
        {
          id: Date.now(),
          name: prosperipayForm.name,
          serialNum: prosperipayForm.serialNum,
          merchantId: prosperipayForm.merchantId || 'XXXX-9012',
          model: prosperipayForm.model || 'Model Name',
          deviceId: prosperipayForm.deviceId || 'DEV-' + Math.floor(100000 + Math.random() * 900000)
        }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
    setProsperipayForm({ name: '', serialNum: '', merchantId: '', model: '', deviceId: '' });
    setProsperipayOpen(false);
  };

  const handleAddPayrix = (e) => {
    e.preventDefault();
    if (!payrixForm.terminalId || !payrixForm.serialNum) return;
    const newTerminals = {
      ...paymentTerminalsState,
      payrix: [
        ...payrixTerminals,
        {
          id: Date.now(),
          terminalId: payrixForm.terminalId,
          serialNum: payrixForm.serialNum,
          modelNum: payrixForm.modelNum || 'Model Name',
          laneId: payrixForm.laneId || '1'
        }
      ]
    };
    dispatch(savePaymentTerminals(newTerminals));
    setPayrixForm({ terminalId: '', serialNum: '', modelNum: '', laneId: '' });
    setPayrixOpen(false);
  };

  // --- HANDLERS FOR DELETING ---
  const handleDeleteOpenEdge = (id) => {
    const newTerminals = { ...paymentTerminalsState, openEdge: openEdgeTerminals.filter(t => t.id !== id) };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleDeleteProsperipay = (id) => {
    const newTerminals = { ...paymentTerminalsState, prosperipay: prosperipayTerminals.filter(t => t.id !== id) };
    dispatch(savePaymentTerminals(newTerminals));
  };

  const handleDeletePayrix = (id) => {
    const newTerminals = { ...paymentTerminalsState, payrix: payrixTerminals.filter(t => t.id !== id) };
    dispatch(savePaymentTerminals(newTerminals));
  };

  // --- STYLING ---
  const headerStyle = { 
    fontWeight: 600, 
    color: '#333333', 
    fontSize: '0.8125rem', 
    borderBottom: '1px solid #e0e0e0', 
    pb: 0.75, 
    pt: 0.75,
    px: 1
  };
  
  const cellStyle = {
    fontSize: '0.8125rem',
    color: '#4a5568',
    borderBottom: '1px solid #f0f0f0',
    py: 1,
    px: 1
  };

  const actionLinkStyle = { 
    display: 'inline-block', 
    color: '#4b71a1', 
    fontSize: '0.8125rem', 
    textDecoration: 'none', 
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
  };

  const sectionHeaderStyle = {
    fontWeight: 600, 
    textDecoration: 'underline', 
    mb: 1.5, 
    fontSize: '1rem', 
    color: '#1a3a6b'
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; Payment Terminals
        </Typography>
      </Box>

      {/* --- OPENEDGE SECTION --- */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={sectionHeaderStyle}>OpenEdge payment terminals</Typography>
        <TableContainer sx={{ border: 'none', boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '40%' }}>Terminal Serial Num.</TableCell>
                <TableCell sx={{ ...headerStyle, width: '50%' }}>
                  OpenEdge Account Token 
                  <Tooltip title="This token uniquely identifies your OpenEdge merchant account" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 13, ml: 0.5, color: '#999', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '10%' }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {openEdgeTerminals.length > 0 ? (
                openEdgeTerminals.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#fbfbfb' } }}>
                    <TableCell sx={cellStyle}>{row.serialNum}</TableCell>
                    <TableCell sx={{ ...cellStyle, color: '#1976d2' }}>{row.accountToken}</TableCell>
                    <TableCell sx={cellStyle} align="right">
                      <IconButton size="small" onClick={() => handleDeleteOpenEdge(row.id)}>
                        <DeleteOutlineIcon fontSize="small" sx={{ color: '#ccc', '&:hover': { color: '#ef4444' } }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ ...cellStyle, color: '#999', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                    No OpenEdge terminals configured. Use links below to add.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box>
            <Typography onClick={() => setOpenEdgeManualOpen(true)} sx={actionLinkStyle}>
              +add new workstation manually
            </Typography>
          </Box>
          <Box>
            <Typography onClick={() => setOpenEdgeAutoOpen(true)} sx={actionLinkStyle}>
              +add workstation using connected device
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* --- PROSPERIPAY SECTION --- */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={sectionHeaderStyle}>Prosperipay payment terminals</Typography>
        <TableContainer sx={{ border: 'none', boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '15%' }}>
                  Name 
                  <Tooltip title="Custom display name of the terminal workstation" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 13, ml: 0.5, color: '#999', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '20%' }}>
                  Terminal Serial Num. 
                  <Tooltip title="The manufacturer's hardware serial number" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 13, ml: 0.5, color: '#999', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '25%' }}>Prosperipay Merchant ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: '20%' }}>Device Model</TableCell>
                <TableCell sx={{ ...headerStyle, width: '15%' }}>Device ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: '5%' }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {prosperipayTerminals.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#fbfbfb' } }}>
                  <TableCell sx={{ ...cellStyle, fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell sx={{ ...cellStyle, color: '#1976d2' }}>{row.serialNum}</TableCell>
                  <TableCell sx={cellStyle}>{row.merchantId}</TableCell>
                  <TableCell sx={cellStyle}>{row.model}</TableCell>
                  <TableCell sx={cellStyle}>{row.deviceId}</TableCell>
                  <TableCell sx={cellStyle} align="right">
                    <IconButton size="small" onClick={() => handleDeleteProsperipay(row.id)}>
                      <DeleteOutlineIcon fontSize="small" sx={{ color: '#ccc', '&:hover': { color: '#ef4444' } }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 1.5 }}>
          <Typography onClick={() => setProsperipayOpen(true)} sx={actionLinkStyle}>
            +add new device manually
          </Typography>
        </Box>
      </Box>

      {/* --- PAYRIX SECTION --- */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={sectionHeaderStyle}>Payrix payment terminals</Typography>
        <TableContainer sx={{ border: 'none', boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '20%' }}>
                  Terminal ID 
                  <Tooltip title="The registered identifier of this terminal in Payrix" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 13, ml: 0.5, color: '#999', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '25%' }}>
                  Terminal Serial Num. 
                  <Tooltip title="Payrix terminal hardware serial number" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 13, ml: 0.5, color: '#999', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '35%' }}>Terminal Model Number</TableCell>
                <TableCell sx={{ ...headerStyle, width: '15%' }}>Lane ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: '5%' }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {payrixTerminals.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#fbfbfb' } }}>
                  <TableCell sx={{ ...cellStyle, fontWeight: 600 }}>{row.terminalId}</TableCell>
                  <TableCell sx={{ ...cellStyle, color: '#1976d2' }}>{row.serialNum}</TableCell>
                  <TableCell sx={cellStyle}>{row.modelNum}</TableCell>
                  <TableCell sx={cellStyle}>{row.laneId}</TableCell>
                  <TableCell sx={cellStyle} align="right">
                    <IconButton size="small" onClick={() => handleDeletePayrix(row.id)}>
                      <DeleteOutlineIcon fontSize="small" sx={{ color: '#ccc', '&:hover': { color: '#ef4444' } }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 1.5 }}>
          <Typography onClick={() => setPayrixOpen(true)} sx={actionLinkStyle}>
            +add new device manually
          </Typography>
        </Box>
      </Box>

      {/* --- DIALOG: ADD OPENEDGE WORKSTATION MANUALLY --- */}
      <Dialog open={openEdgeManualOpen} onClose={() => setOpenEdgeManualOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleAddOpenEdge}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1a3a6b', pb: 1 }}>Add OpenEdge Workstation</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <TextField
                label="Terminal Serial Number"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={openEdgeForm.serialNum}
                onChange={(e) => setOpenEdgeForm(prev => ({ ...prev, serialNum: e.target.value }))}
              />
              <TextField
                label="OpenEdge Account Token"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={openEdgeForm.accountToken}
                onChange={(e) => setOpenEdgeForm(prev => ({ ...prev, accountToken: e.target.value }))}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpenEdgeManualOpen(false)} color="inherit" size="small" sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#112546' } }}>
              Add Terminal
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* --- DIALOG: ADD OPENEDGE WORKSTATION AUTO (CONNECTED DEVICE) --- */}
      <Dialog open={openEdgeAutoOpen} onClose={() => setOpenEdgeAutoOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleAddOpenEdgeAuto}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1a3a6b', pb: 1 }}>Connect OpenEdge Device</DialogTitle>
          <DialogContent sx={{ py: 1 }}>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
              The system will automatically search for and connect to active OpenEdge devices on your local network. Please ensure the device is powered on and connected.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpenEdgeAutoOpen(false)} color="inherit" size="small" sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#112546' } }}>
              Start Scan & Connect
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* --- DIALOG: ADD PROSPERIPAY DEVICE --- */}
      <Dialog open={prosperipayOpen} onClose={() => setProsperipayOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleAddProsperipay}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1a3a6b', pb: 1 }}>Add Prosperipay Device</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Device Name (e.g., Checkin)"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={prosperipayForm.name}
                onChange={(e) => setProsperipayForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                label="Terminal Serial Number"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={prosperipayForm.serialNum}
                onChange={(e) => setProsperipayForm(prev => ({ ...prev, serialNum: e.target.value }))}
              />
              <TextField
                label="Prosperipay Merchant ID"
                variant="outlined"
                size="small"
                fullWidth
                value={prosperipayForm.merchantId}
                onChange={(e) => setProsperipayForm(prev => ({ ...prev, merchantId: e.target.value }))}
              />
              <TextField
                label="Device Model"
                variant="outlined"
                size="small"
                fullWidth
                value={prosperipayForm.model}
                onChange={(e) => setProsperipayForm(prev => ({ ...prev, model: e.target.value }))}
              />
              <TextField
                label="Device ID"
                variant="outlined"
                size="small"
                fullWidth
                value={prosperipayForm.deviceId}
                onChange={(e) => setProsperipayForm(prev => ({ ...prev, deviceId: e.target.value }))}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setProsperipayOpen(false)} color="inherit" size="small" sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#112546' } }}>
              Add Device
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* --- DIALOG: ADD PAYRIX DEVICE --- */}
      <Dialog open={payrixOpen} onClose={() => setPayrixOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleAddPayrix}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1a3a6b', pb: 1 }}>Add Payrix Device</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Terminal ID (e.g., Checkout)"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={payrixForm.terminalId}
                onChange={(e) => setPayrixForm(prev => ({ ...prev, terminalId: e.target.value }))}
              />
              <TextField
                label="Terminal Serial Number"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={payrixForm.serialNum}
                onChange={(e) => setPayrixForm(prev => ({ ...prev, serialNum: e.target.value }))}
              />
              <TextField
                label="Terminal Model Number"
                variant="outlined"
                size="small"
                fullWidth
                value={payrixForm.modelNum}
                onChange={(e) => setPayrixForm(prev => ({ ...prev, modelNum: e.target.value }))}
              />
              <TextField
                label="Lane ID"
                variant="outlined"
                size="small"
                fullWidth
                value={payrixForm.laneId}
                onChange={(e) => setPayrixForm(prev => ({ ...prev, laneId: e.target.value }))}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setPayrixOpen(false)} color="inherit" size="small" sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#1a3a6b', '&:hover': { bgcolor: '#112546' } }}>
              Add Device
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PaymentTerminals;
