import React from 'react';
import { TableRow, TableCell, TextField, InputAdornment, Typography, Select, MenuItem, Box, Checkbox } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { inputFieldSx, deliveryPatternSx, bodyCellSx } from '../styles/coverageStyles';

const CoverageBookRow = ({ row, index, handleFieldChange, setActiveToothSelection }) => {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
      <TableCell sx={{ ...bodyCellSx, fontWeight: 700, fontSize: '0.75rem', color: '#333', minWidth: '80px' }}>
        {row.code}
      </TableCell>
      <TableCell sx={{ ...bodyCellSx, fontSize: '0.7rem', color: '#555', minWidth: '150px', maxWidth: '180px' }}>
        {row.name}
      </TableCell>
      <TableCell sx={{ ...bodyCellSx, minWidth: '90px' }}>
        <TextField 
          size="small"
          value={row.maxAllowed || ''}
          onChange={(e) => handleFieldChange(index, 'maxAllowed', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.7rem', color: '#999' }}>$</Typography></InputAdornment>,
          }}
          sx={inputFieldSx}
        />
      </TableCell>
      <TableCell sx={{ ...bodyCellSx, minWidth: '110px' }}>
        <Select
          size="small"
          displayEmpty
          value={row.deliveryPattern || ''}
          onChange={(e) => handleFieldChange(index, 'deliveryPattern', e.target.value)}
          renderValue={(selected) => {
            if (!selected) return <Typography sx={{ color: '#999', fontSize: '0.7rem' }}>__ / __ M</Typography>;
            return selected;
          }}
          sx={deliveryPatternSx}
        >
          <MenuItem value="" disabled><em>Select</em></MenuItem>
          <MenuItem value="1/1 M" sx={{ fontSize: '0.7rem' }}>1/1 M</MenuItem>
          <MenuItem value="1/6 M" sx={{ fontSize: '0.7rem' }}>1/6 M</MenuItem>
          <MenuItem value="1/12 M" sx={{ fontSize: '0.7rem' }}>1/12 M</MenuItem>
          <MenuItem value="2/12 M" sx={{ fontSize: '0.7rem' }}>2/12 M</MenuItem>
          <MenuItem value="1/1 Y" sx={{ fontSize: '0.7rem' }}>1/1 Y</MenuItem>
          <MenuItem value="1/5 Y" sx={{ fontSize: '0.7rem' }}>1/5 Y</MenuItem>
        </Select>
      </TableCell>
      <TableCell sx={{ ...bodyCellSx, minWidth: '90px' }}>
        <TextField 
          size="small"
          value={row.lifetimeLimit || ''}
          onChange={(e) => handleFieldChange(index, 'lifetimeLimit', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.7rem', color: '#999' }}>$</Typography></InputAdornment>,
          }}
          sx={inputFieldSx}
        />
      </TableCell>
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '50px', fontSize: '0.8rem', fontWeight: 500, color: '#333' }}>
        {row.age || '—'}
      </TableCell>
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '80px' }}>
        <Box 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, cursor: 'pointer' }} 
          onClick={() => setActiveToothSelection(row.code || index)}
        >
          <EditIcon sx={{ fontSize: 16, color: row.teethLimit || (Array.isArray(row.teeth) && row.teeth.length > 0) ? '#2362EF' : '#94a3b8' }} />
          {(row.teethLimit || (Array.isArray(row.teeth) && row.teeth.length > 0)) ? (
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2362EF', bgcolor: '#e6f0fd', px: 0.8, py: 0.2, borderRadius: '10px' }}>
              {Array.isArray(row.teeth) ? row.teeth.join(', ') : row.teethLimit}
            </Typography>
          ) : null}
        </Box>
      </TableCell>
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '50px' }}>
        <Checkbox 
          size="small" 
          checked={!!row.hasDowngrade} 
          onChange={(e) => handleFieldChange(index, 'hasDowngrade', e.target.checked)}
          sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }} 
        />
      </TableCell>
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '40px' }}>
        <Checkbox 
          size="small" 
          checked={!!row.nc} 
          onChange={(e) => handleFieldChange(index, 'nc', e.target.checked)}
          sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }} 
        />
      </TableCell>
      <TableCell sx={{ ...bodyCellSx, minWidth: '90px' }}>
        <TextField 
          size="small"
          value={row.flatPlanPortion || ''}
          onChange={(e) => handleFieldChange(index, 'flatPlanPortion', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.7rem', color: '#999' }}>$</Typography></InputAdornment>,
          }}
          sx={inputFieldSx}
        />
      </TableCell>
    </TableRow>
  );
};

export default CoverageBookRow;
