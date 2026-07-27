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

import AddOpenEdgeManualDialog from './AddOpenEdgeManualDialog';
import AddOpenEdgeAutoDialog from './AddOpenEdgeAutoDialog';

const OpenEdgeSection = ({ 
  terminals, 
  onAddManual, 
  onAddAuto, 
  onDelete 
}) => {
  const [openEdgeManualOpen, setOpenEdgeManualOpen] = useState(false);
  const [openEdgeAutoOpen, setOpenEdgeAutoOpen] = useState(false);
  const [openEdgeForm, setOpenEdgeForm] = useState({ serialNum: '', accountToken: '' });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!openEdgeForm.serialNum || !openEdgeForm.accountToken) return;
    onAddManual(openEdgeForm);
    setOpenEdgeForm({ serialNum: '', accountToken: '' });
    setOpenEdgeManualOpen(false);
  };

  const handleAutoSubmit = (e) => {
    e.preventDefault();
    onAddAuto();
    setOpenEdgeAutoOpen(false);
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
        OpenEdge payment terminals
      </Typography>
      
      <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '40%' }}>Terminal Serial Num.</TableCell>
                <TableCell sx={{ ...headerStyle, width: '50%' }}>
                  OpenEdge Account Token 
                  <Tooltip title="This token uniquely identifies your OpenEdge merchant account" arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8', verticalAlign: 'middle', cursor: 'help' }} />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '10%' }} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {terminals.length > 0 ? (
                terminals.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ ...cellStyle, fontWeight: 600 }}>{row.serialNum}</TableCell>
                    <TableCell sx={{ ...cellStyle, color: '#2563eb' }}>{row.accountToken}</TableCell>
                    <TableCell sx={cellStyle} align="right">
                      <IconButton size="small" onClick={() => onDelete(row.id)} sx={{ color: '#ef4444' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ ...cellStyle, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', py: 3 }}>
                    No OpenEdge terminals configured. Use links below to add.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', gap: 2 }}>
          <Button 
            variant="text" 
            onClick={() => setOpenEdgeManualOpen(true)}
            sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}
          >
            + Add new workstation manually
          </Button>
          <Button 
            variant="text" 
            onClick={() => setOpenEdgeAutoOpen(true)}
            sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}
          >
            + Add workstation using connected device
          </Button>
        </Box>
      </Box>

      <AddOpenEdgeManualDialog 
        open={openEdgeManualOpen}
        onClose={() => setOpenEdgeManualOpen(false)}
        form={openEdgeForm}
        setForm={setOpenEdgeForm}
        onSubmit={handleManualSubmit}
      />

      <AddOpenEdgeAutoDialog 
        open={openEdgeAutoOpen}
        onClose={() => setOpenEdgeAutoOpen(false)}
        onSubmit={handleAutoSubmit}
      />
    </Box>
  );
};

export default OpenEdgeSection;
