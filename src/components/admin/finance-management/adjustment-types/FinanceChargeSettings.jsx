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
  MonetizationOnOutlined as MonetizationIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import deleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

const DebouncedTextField = ({ value, onBlur, ...props }) => {
  const [localVal, setLocalVal] = React.useState(value || '');
  React.useEffect(() => { setLocalVal(value || ''); }, [value]);
  
  return (
    <TextField
      {...props}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => onBlur(localVal)}
      size="small"
      sx={{ 
        backgroundColor: '#fff', 
        borderRadius: 1.5,
        '& .MuiOutlinedInput-root': {
          fontSize: '0.85rem',
          borderRadius: 1.5,
          '& fieldset': { borderColor: '#e2e8f0' },
          '&:hover fieldset': { borderColor: '#cbd5e1' },
          '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
        }
      }}
    />
  );
};

const FinanceChargeSettings = ({ data, section = 'finance', onAdd, onInputChange, onDelete }) => {
  return (
    <Box sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, backgroundColor: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
        <MonetizationIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Finance Charges
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#475569', mb: 3 }}>
          If left blank, no default amount will apply once adj. selected on patient bill.
        </Typography>

        <TableContainer component={Box} sx={{ border: 'none', boxShadow: 'none' }}>
          <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9', py: 1.5, px: 1 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '45%', fontSize: '0.8rem', color: '#475569', fontWeight: 600, borderBottom: '2px solid #e2e8f0 !important' }}>Type</TableCell>
                <TableCell sx={{ width: '100px', fontSize: '0.8rem', color: '#475569', fontWeight: 600, borderBottom: '2px solid #e2e8f0 !important' }}>$</TableCell>
                <TableCell sx={{ width: '100px', fontSize: '0.8rem', color: '#475569', fontWeight: 600, borderBottom: '2px solid #e2e8f0 !important' }}>%</TableCell>
                <TableCell sx={{ borderBottom: '2px solid #e2e8f0 !important' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell>
                    <DebouncedTextField
                      value={row.type}
                      onBlur={(newVal) => onInputChange(section, row.id, 'type', newVal)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <DebouncedTextField
                      value={row.amount}
                      onBlur={(newVal) => onInputChange(section, row.id, 'amount', newVal)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <DebouncedTextField
                      value={row.percent}
                      onBlur={(newVal) => onInputChange(section, row.id, 'percent', newVal)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                      {row.deletable && (
                        <IconButton size="small" onClick={() => onDelete(section, row.id)} sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2' } }}>
                          <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16 }} />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => onAdd(section)}
            sx={{
              color: '#3b82f6',
              borderColor: '#3b82f6',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: 1.5,
              px: 2,
              py: 0.75,
              '&:hover': { backgroundColor: '#eff6ff', borderColor: '#2563eb', color: '#2563eb' }
            }}
          >
            Add Finance Charge
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceChargeSettings;
