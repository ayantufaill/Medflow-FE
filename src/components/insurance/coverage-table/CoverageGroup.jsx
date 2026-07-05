import React from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TextField } from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";

const CoverageGroup = ({ title, rows, onDeleteItem, onChangeItem }) => (
  <Box sx={{ border: '1px solid #DFE5EC', borderRadius: '8px', mb: 2, overflow: 'hidden' }}>
    <Box sx={{ bgcolor: '#f0f4f8', py: 1, px: 2, textAlign: 'center', borderBottom: '1px solid #DFE5EC' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#333' }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: '0.65rem', color: '#888', fontStyle: 'italic' }}>
        Custom overrides allowed per procedure code
      </Typography>
    </Box>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#777', textTransform: 'uppercase', width: '45%', borderRight: '1px solid #f0f0f0', py: 1, letterSpacing: '0.3px' }}>
            CATEGORY / SUB-TYPE
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#777', textTransform: 'uppercase', width: '25%', borderRight: '1px solid #f0f0f0', py: 1, letterSpacing: '0.3px', lineHeight: 1.3 }}>
            COVERAGE %
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#777', textTransform: 'uppercase', width: '30%', py: 1, letterSpacing: '0.3px', lineHeight: 1.3 }}>
            WAITING PERIOD (MONTHS)
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id || index} sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
            <TableCell sx={{ fontSize: '0.75rem', color: '#555', borderRight: '1px solid #f0f0f0', py: 1.2, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#9e9e9e' }}>→</Typography>
                {row.label}
              </Box>
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#1976d2', borderRight: '1px solid #f0f0f0', py: 1.2, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <TextField 
                variant="standard"
                size="small" 
                type="number"
                value={row.coverage !== undefined ? row.coverage : ''}
                InputProps={{ inputProps: { min: 0, max: 100 }, disableUnderline: false }}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 0;
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  if (onChangeItem) onChangeItem(row.id, 'coverage', val);
                }}
                sx={{ 
                  '& input': { py: 0.1, px: 0.5, fontSize: '0.75rem', color: '#1976d2', width: '35px', textAlign: 'center' },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }} 
              />%
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#1976d2', py: 1.2, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField 
                  variant="standard"
                  size="small" 
                  type="number"
                  value={row.waiting !== undefined ? row.waiting : ''}
                  InputProps={{ inputProps: { min: 0 }, disableUnderline: false }}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val < 0) val = 0;
                    if (onChangeItem) onChangeItem(row.id, 'waiting', val);
                  }}
                  sx={{ 
                    '& input': { py: 0.1, px: 0.5, fontSize: '0.75rem', color: '#1976d2', width: '30px', textAlign: 'center' },
                    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& input[type=number]': { MozAppearance: 'textfield' }
                  }} 
                />
                {row.deletable && (
                  <DeleteIcon 
                    sx={{ fontSize: 14, color: '#d32f2f', cursor: 'pointer', ml: 0.5 }} 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteItem) onDeleteItem(row.id);
                    }}
                  />
                )}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

export default CoverageGroup;
