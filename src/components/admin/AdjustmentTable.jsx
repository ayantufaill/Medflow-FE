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
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const AdjustmentTable = ({ title, subtitle, data, section, hasNote, onAdd, onInputChange, onDelete }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="subtitle1" sx={{ color: '#4b71a1', fontWeight: 600, borderBottom: '1px solid #e0e0e0', pb: 0.5, mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', mb: 2 }}>
      {subtitle}
    </Typography>
    <TableContainer component={Box} sx={{ border: 'none', boxShadow: 'none' }}>
      <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f0f0f0', py: 0.5, px: 0.5 } }}>
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 600, color: 'text.primary', borderBottom: '2px solid #e0e0e0' } }}>
            <TableCell sx={{ width: '45%' }}>Type</TableCell>
            <TableCell sx={{ width: '80px' }}>$</TableCell>
            <TableCell sx={{ width: '80px' }}>%</TableCell>
            <TableCell>{hasNote ? '' : ''}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
              <TableCell sx={{ fontWeight: 500 }}>{row.type}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  variant="standard"
                  value={row.amount}
                  onChange={(e) => onInputChange(section, row.id, 'amount', e.target.value)}
                  InputProps={{ disableUnderline: false }}
                  sx={{ width: '100%', '& .MuiInput-root': { fontSize: '0.875rem' } }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  variant="standard"
                  value={row.percent}
                  onChange={(e) => onInputChange(section, row.id, 'percent', e.target.value)}
                  InputProps={{ disableUnderline: false }}
                  sx={{ width: '100%', '& .MuiInput-root': { fontSize: '0.875rem' } }}
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  {hasNote && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {row.note}
                    </Typography>
                  )}
                  {row.deletable && (
                    <IconButton size="small" sx={{ color: '#ff8a80' }} onClick={() => onDelete(section, row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {onAdd && (
      <Button
        startIcon={<AddIcon />}
        size="small"
        sx={{ textTransform: 'none', mt: 1, color: '#4b71a1' }}
        onClick={onAdd}
      >
        add
      </Button>
    )}
  </Box>
);

export default AdjustmentTable;
