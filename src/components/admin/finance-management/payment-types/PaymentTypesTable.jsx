import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import deleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

const DebouncedNoteField = ({ value, onBlur, ...props }) => {
  const [localVal, setLocalVal] = useState(value || '');
  
  useEffect(() => { 
    setLocalVal(value || ''); 
  }, [value]);
  
  return (
    <TextField
      {...props}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => onBlur(localVal)}
    />
  );
};

const PaymentTypesTable = ({
  paymentTypes,
  handleToggle,
  handleNoteChange,
  handleDelete,
  handleRestore,
  handleAdd,
}) => {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: '#F8FAFC', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #e2e8f0' } }}>
              <TableCell>Type</TableCell>
              <TableCell align="center">Include on Deposit Slip</TableCell>
              <TableCell align="center">Use Open Edge</TableCell>
              <TableCell align="center">Use Prosperipay</TableCell>
              <TableCell align="center">Use SmilePay</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentTypes.map((pt) => (
              <TableRow 
                key={pt.id} 
                sx={{ 
                  '&:hover': { bgcolor: '#fbfbfb' }, 
                  opacity: pt.isHidden ? 0.5 : 1,
                  '& .MuiTableCell-root': { py: 1, borderBottom: '1px solid #f1f5f9' }
                }}
              >
                <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600, color: pt.isHidden ? '#dc2626' : '#1e293b' }}>
                  {pt.type} {pt.isHidden && '(Deleted)'}
                </TableCell>
                <TableCell align="center">
                  <Checkbox 
                    size="small" 
                    checked={pt.depositSlip || false} 
                    onChange={() => handleToggle(pt, 'depositSlip')} 
                    sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox 
                    size="small" 
                    checked={pt.openEdge || false} 
                    onChange={() => handleToggle(pt, 'openEdge')} 
                    sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox 
                    size="small" 
                    checked={pt.prosperipay || false} 
                    onChange={() => handleToggle(pt, 'prosperipay')} 
                    sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox 
                    size="small" 
                    checked={pt.smilepay || false} 
                    onChange={() => handleToggle(pt, 'smilepay')} 
                    sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                </TableCell>
                <TableCell sx={{ width: '35%' }}>
                  <DebouncedNoteField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={pt.note}
                    onBlur={(newVal) => handleNoteChange(pt, newVal)}
                    sx={{ 
                      '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2, fontSize: '0.85rem' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  {pt.isHidden ? (
                    <Button 
                      variant="text" 
                      onClick={() => handleRestore(pt)} 
                      sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#2563eb', fontWeight: 600 }}
                    >
                       Restore
                    </Button>
                  ) : (
                    <IconButton size="small" onClick={() => handleDelete(pt.id)} sx={{ color: '#ef4444' }}>
                      <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <Button 
          startIcon={<AddIcon />}
          variant="contained" 
          onClick={handleAdd}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Add Payment Type
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentTypesTable;
