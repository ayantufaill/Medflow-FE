import React from "react";
import {
  Box, Typography, TextField, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { Person as PersonIcon, Groups as GroupsIcon } from "@mui/icons-material";

// Sample deductible data structure - Replace with API data when implemented
const DEFAULT_DEDUCTIBLES = [
  { id: 1, type: 'Standard', lifetime: false, standard: false, individual: '$50.00', family: '$150.00', metAmount: '$50.00', metDate: '03/03/2026' },
  { id: 2, type: 'Preventative', lifetime: false, standard: false, individual: '$0.00', family: '$0.00', metAmount: '$0.00', metDate: '03/03/2026' },
  { id: 3, type: 'Basic', lifetime: false, standard: true, individual: '', family: '', metAmount: '', metDate: '' },
  { id: 4, type: 'Major', lifetime: false, standard: true, individual: '', family: '', metAmount: '', metDate: '' },
  { id: 5, type: 'Orthodontics', lifetime: false, standard: false, individual: '$0.00', family: '$0.00', metAmount: '$0.00', metDate: '03/03/2026' }
];

const DeductiblesTable = ({ 
  formData, 
  handleDeductibleChange,
  tableHeaderStyle,
  blueHeader
}) => {
  // Use formData.deductibles if available, otherwise use default structure
  const deductibles = formData.deductibles?.length > 0 ? formData.deductibles : DEFAULT_DEDUCTIBLES;
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mt: 2, color: "#333", fontSize: "0.85rem" }}>Deductibles</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: blueHeader }}>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '90px' }}>Types</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '70px' }} align="center">Lifetime</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '80px' }} align="center">Standard</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '130px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <PersonIcon sx={{ fontSize: 11 }} /> Individual Deductibles
                </Box>
              </TableCell>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '120px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <GroupsIcon sx={{ fontSize: 12 }} /> Family Deductibles
                </Box>
              </TableCell>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '110px' }}>Deductibles Met Amount</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, minWidth: '100px', borderRight: 0 }}>Deductibles Met Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deductibles.map((row, index) => (
              <TableRow key={row.type} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fff' } }}>
                <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600, borderRight: '1px solid #eee', minWidth: '90px' }}>{row.type}</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #eee', minWidth: '70px', py: 0 }}>
                  <Checkbox 
                    size="small" 
                    checked={row.lifetime}
                    onChange={(e) => handleDeductibleChange(index, 'lifetime', e.target.checked)}
                    sx={{ p: 0.1 }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #eee', minWidth: '80px', py: 0 }}>
                  <Checkbox 
                    size="small" 
                    checked={row.standard}
                    onChange={(e) => handleDeductibleChange(index, 'standard', e.target.checked)}
                    sx={{ p: 0.1 }}
                  />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #eee', bgcolor: row.individual ? '#fff' : '#f5f7fa', minWidth: '130px', py: 0 }}>
                  <TextField 
                    size="small" 
                    value={row.individual}
                    onChange={(e) => handleDeductibleChange(index, 'individual', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.6rem', border: 'none' }, width: '110px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #eee', bgcolor: row.family ? '#fff' : '#f5f7fa', minWidth: '120px', py: 0 }}>
                  <TextField 
                    size="small" 
                    value={row.family}
                    onChange={(e) => handleDeductibleChange(index, 'family', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.6rem', border: 'none' }, width: '100px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #eee', minWidth: '110px', py: 0 }}>
                  <TextField 
                    size="small" 
                    value={row.metAmount}
                    onChange={(e) => handleDeductibleChange(index, 'metAmount', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.6rem', border: 'none' }, width: '90px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.65rem', minWidth: '100px', py: 0 }}>
                  <TextField 
                    size="small" 
                    value={row.metDate}
                    onChange={(e) => handleDeductibleChange(index, 'metDate', e.target.value)}
                    sx={{ '& input': { py: 0.15, fontSize: '0.6rem', border: 'none' }, width: '90px', '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } } }} 
                  />
                </TableCell>
              </TableRow>
            ))}
            {/* Add Deductible by Procedure Code Row */}
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 1, px: 2 }}>
                <Typography sx={{ color: '#1976d2', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>
                  + Add Deductible by Procedure Code
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export { DEFAULT_DEDUCTIBLES };
export default DeductiblesTable;
