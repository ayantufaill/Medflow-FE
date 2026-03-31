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
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.7rem', width: '20%', border: 'none', py: 0.5 }}>Product Choice</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.7rem', border: 'none', py: 0.5, px: 0.3, width: '20%' }}>Used by patient</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.7rem', border: 'none', py: 0.5, px: 0.3, width: '20%' }}>Suggested to patient</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.7rem', border: 'none', py: 0.5, width: '40%' }}>Instructions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow 
              key={index} 
              sx={{ 
                borderBottom: '1px solid #f0f0f0',
                bgcolor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              <TableCell sx={{ border: 'none', py: 0.3 }}>
                <Select 
                  value={row.choice || ''} 
                  displayEmpty 
                  size="small" 
                  fullWidth 
                  onChange={(e) => handleSelectChange(index, e.target.value)}
                  sx={{ 
                    fontSize: '0.7rem', 
                    height: '28px',
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
                    <MenuItem key={idx} value={opt.value} sx={{ fontSize: '0.7rem' }}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="center" sx={{ border: 'none', py: 0.3, px: 0.5 }}>
                <Checkbox 
                  size="small" 
                  checked={row.usedByPatient || false}
                  onChange={() => handleCheckboxChange(index, 'usedByPatient')}
                  sx={{ padding: '4px' }}
                />
              </TableCell>
              <TableCell align="center" sx={{ border: 'none', py: 0.3, px: 0.5 }}>
                <Checkbox 
                  size="small" 
                  checked={row.suggestedToPatient || false}
                  onChange={() => handleCheckboxChange(index, 'suggestedToPatient')}
                  sx={{ padding: '4px' }}
                />
              </TableCell>
              <TableCell sx={{ border: 'none', py: 0.3 }}>
                <TextField 
                  variant="standard" 
                  value={row.instructions || ''}
                  onChange={(e) => handleInstructionsChange(index, e.target.value)}
                  inputProps={{ style: { fontSize: '0.7rem', padding: '2px 0' } }}
                  sx={{ 
                    maxWidth: '200px',
                    '& .MuiInput-underline': {
                      width: '180px',
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} sx={{ py: 0.2 }}>
              <Typography 
                onClick={handleAddRow}
                sx={{ 
                  fontSize: '0.7rem', color: '#2e3b84', 
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
