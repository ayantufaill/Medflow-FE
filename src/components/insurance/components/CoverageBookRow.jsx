import React from 'react';
import { TableRow, TableCell, TextField, InputAdornment, Typography, Select, MenuItem, Box, Checkbox } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { inputFieldSx, deliveryPatternSx, bodyCellSx } from '../styles/coverageStyles';
import { getDowngradeCode } from '../utils/insuranceHelpers';

import DeliveryPatternInput from './DeliveryPatternInput';

const CoverageBookRow = ({ row, index, handleFieldChange, setActiveToothSelection, getRowData }) => {
  const autoDowngrade = getDowngradeCode(row.code);
  // Teeth selected for the downgraded code live in their own coverage row.
  const downgradeCode = row.downgrade || autoDowngrade;
  const downgradeTeeth =
    downgradeCode && getRowData
      ? getRowData(downgradeCode).teethLimit ||
        (Array.isArray(getRowData(downgradeCode).teeth)
          ? getRowData(downgradeCode).teeth.join(', ')
          : '')
      : '';

  const handleDowngradeToggle = (checked) => {
    // Crown codes carry a fixed downgrade alternative, so fill it in for the user.
    handleFieldChange(index, {
      hasDowngrade: checked,
      ...(autoDowngrade ? { downgrade: checked ? autoDowngrade : '' } : {}),
    });
  };
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
        <DeliveryPatternInput
          value={row.deliveryPattern || ''}
          onChange={(val) => handleFieldChange(index, 'deliveryPattern', val)}
        />
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
      <TableCell align="center" sx={{ ...bodyCellSx, minWidth: '80px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3 }}>
          <Checkbox
            size="small"
            checked={!!row.hasDowngrade}
            onChange={(e) => handleDowngradeToggle(e.target.checked)}
            sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
          />
          {row.hasDowngrade && downgradeCode && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2, cursor: 'pointer' }}
              title={`Select teeth for ${downgradeCode}`}
              // Teeth are stored against the downgraded procedure's own code.
              onClick={() => setActiveToothSelection(downgradeCode)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <EditIcon sx={{ fontSize: 14, color: downgradeTeeth ? '#2362EF' : '#94a3b8' }} />
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#1976d2' }}>
                  {downgradeCode}
                </Typography>
              </Box>
              {downgradeTeeth && (
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2362EF', bgcolor: '#e6f0fd', px: 0.6, py: 0.1, borderRadius: '10px' }}>
                  {downgradeTeeth}
                </Typography>
              )}
            </Box>
          )}
        </Box>
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
