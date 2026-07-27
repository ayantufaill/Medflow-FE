import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import AddProsperipayDialog from './AddProsperipayDialog';

const ProsperipaySection = ({ terminals, onAdd, onDelete }) => {
  const [prosperipayOpen, setProsperipayOpen] = useState(false);
  const [prosperipayForm, setProsperipayForm] = useState({ name: '', serialNum: '', merchantId: '', model: '', deviceId: '' });

  const handleAddProsperipay = (e) => {
    e.preventDefault();
    if (!prosperipayForm.name || !prosperipayForm.serialNum) return;
    onAdd(prosperipayForm);
    setProsperipayForm({ name: '', serialNum: '', merchantId: '', model: '', deviceId: '' });
    setProsperipayOpen(false);
  };

  const headerStyle = { 
    fontWeight: 600, 
    color: '#475569', 
    fontSize: '0.75rem', 
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0', 
    backgroundColor: '#F8FAFC',
    py: 1.5, 
    px: 2
  };
  
  const cellStyle = {
    fontSize: '0.85rem',
    color: '#1e293b',
    borderBottom: '1px solid #f1f5f9',
    py: 1.5,
    px: 2
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 2 }}>
        Prosperipay payment terminals
      </Typography>
      
      <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '15%' }}>
                  Name 
                  <Tooltip title="Custom display name of the terminal workstation" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '20%' }}>
                  Terminal Serial Num. 
                  <Tooltip title="The manufacturer's hardware serial number" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '25%' }}>Prosperipay Merchant ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: '20%' }}>Device Model</TableCell>
                <TableCell sx={{ ...headerStyle, width: '15%' }}>Device ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: '5%' }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {terminals.length > 0 ? (
                terminals.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ ...cellStyle, fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ ...cellStyle, color: '#2563eb' }}>{row.serialNum}</TableCell>
                    <TableCell sx={cellStyle}>{row.merchantId}</TableCell>
                    <TableCell sx={cellStyle}>{row.model}</TableCell>
                    <TableCell sx={cellStyle}>{row.deviceId}</TableCell>
                    <TableCell sx={cellStyle} align="right">
                      <IconButton size="small" onClick={() => onDelete(row.id)} sx={{ color: '#ef4444' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ ...cellStyle, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', py: 3 }}>
                    No Prosperipay terminals configured. Use link below to add.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <Button 
            variant="text" 
            onClick={() => setProsperipayOpen(true)}
            sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}
          >
            + Add new device manually
          </Button>
        </Box>
      </Box>

      <AddProsperipayDialog 
        open={prosperipayOpen}
        onClose={() => setProsperipayOpen(false)}
        form={prosperipayForm}
        setForm={setProsperipayForm}
        onSubmit={handleAddProsperipay}
      />
    </Box>
  );
};

export default ProsperipaySection;
