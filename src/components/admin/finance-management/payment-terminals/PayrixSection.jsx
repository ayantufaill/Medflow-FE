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

import AddPayrixDialog from './AddPayrixDialog';

const PayrixSection = ({ terminals, onAdd, onDelete }) => {
  const [payrixOpen, setPayrixOpen] = useState(false);
  const [payrixForm, setPayrixForm] = useState({ terminalId: '', serialNum: '', modelNum: '', laneId: '' });

  const handleAddPayrix = (e) => {
    e.preventDefault();
    if (!payrixForm.terminalId || !payrixForm.serialNum) return;
    onAdd(payrixForm);
    setPayrixForm({ terminalId: '', serialNum: '', modelNum: '', laneId: '' });
    setPayrixOpen(false);
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
        Payrix payment terminals
      </Typography>
      
      <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '20%' }}>
                  Terminal ID 
                  <Tooltip title="The registered identifier of this terminal in Payrix" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '25%' }}>
                  Terminal Serial Num. 
                  <Tooltip title="Payrix terminal hardware serial number" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '35%' }}>Terminal Model Number</TableCell>
                <TableCell sx={{ ...headerStyle, width: '15%' }}>Lane ID</TableCell>
                <TableCell sx={{ ...headerStyle, width: '5%' }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {terminals.length > 0 ? (
                terminals.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ ...cellStyle, fontWeight: 600 }}>{row.terminalId}</TableCell>
                    <TableCell sx={{ ...cellStyle, color: '#2563eb' }}>{row.serialNum}</TableCell>
                    <TableCell sx={cellStyle}>{row.modelNum}</TableCell>
                    <TableCell sx={cellStyle}>{row.laneId}</TableCell>
                    <TableCell sx={cellStyle} align="right">
                      <IconButton size="small" onClick={() => onDelete(row.id)} sx={{ color: '#ef4444' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ ...cellStyle, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', py: 3 }}>
                    No Payrix terminals configured. Use link below to add.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <Button 
            variant="text" 
            onClick={() => setPayrixOpen(true)}
            sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}
          >
            + Add new device manually
          </Button>
        </Box>
      </Box>

      <AddPayrixDialog 
        open={payrixOpen}
        onClose={() => setPayrixOpen(false)}
        form={payrixForm}
        setForm={setPayrixForm}
        onSubmit={handleAddPayrix}
      />
    </Box>
  );
};

export default PayrixSection;
