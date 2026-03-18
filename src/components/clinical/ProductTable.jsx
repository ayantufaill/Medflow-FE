import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, Checkbox, TextField, Typography
} from '@mui/material';

const ProductTable = ({ rows = [], placeholderText = 'Select...', onAddRow }) => {
  // Get options from the first existing row to use for new rows
  const sampleOptions = rows.length > 0 && rows[0].options ? rows[0].options : [];
  
  const createDefaultRow = () => ({
    choice: '',
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: '',
    options: sampleOptions
  });

  const [tableData, setTableData] = useState(rows.length > 0 ? rows : [createDefaultRow()]);

  const handleCheckboxChange = (index, field) => {
    setTableData(prev => prev.map((row, i) => 
      i === index ? { ...row, [field]: !row[field] } : row
    ));
  };

  const handleSelectChange = (index, value) => {
    setTableData(prev => prev.map((row, i) => 
      i === index ? { ...row, choice: value } : row
    ));
  };

  const handleInstructionsChange = (index, value) => {
    setTableData(prev => prev.map((row, i) => 
      i === index ? { ...row, instructions: value } : row
    ));
  };

  const handleAddRow = () => {
    const newRow = createDefaultRow();
    setTableData(prev => [...prev, newRow]);
    if (onAddRow) {
      onAddRow(newRow);
    }
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: 'transparent' }}>
          <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', width: '25%', border: 'none' }}>Product Choice</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem', border: 'none' }}>Used by patient</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem', border: 'none' }}>Suggested to patient</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', border: 'none' }}>Instructions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index} sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ border: 'none' }}>
                <Select 
                  value={row.choice || ''} 
                  displayEmpty 
                  size="small" 
                  fullWidth 
                  onChange={(e) => handleSelectChange(index, e.target.value)}
                  sx={{ 
                    fontSize: '0.75rem', 
                    height: '30px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  <MenuItem value=""><em>{placeholderText}</em></MenuItem>
                  {row.options?.map((opt, idx) => (
                    <MenuItem key={idx} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="center" sx={{ border: 'none' }}>
                <Checkbox 
                  size="small" 
                  checked={row.usedByPatient || false}
                  onChange={() => handleCheckboxChange(index, 'usedByPatient')}
                />
              </TableCell>
              <TableCell align="center" sx={{ border: 'none' }}>
                <Checkbox 
                  size="small" 
                  checked={row.suggestedToPatient || false}
                  onChange={() => handleCheckboxChange(index, 'suggestedToPatient')}
                />
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <TextField 
                  variant="standard" 
                  fullWidth 
                  value={row.instructions || ''}
                  onChange={(e) => handleInstructionsChange(index, e.target.value)}
                  inputProps={{ style: { fontSize: '0.75rem' } }} 
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} sx={{ py: 0.5 }}>
              <Typography 
                onClick={handleAddRow}
                sx={{ 
                  fontSize: '0.75rem', color: '#2e3b84', 
                  cursor: 'pointer', fontWeight: 500 
                }}
              >
                +Add New Choice
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
