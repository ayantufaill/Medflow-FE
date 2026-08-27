import React from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TextField, Chip, IconButton } from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";

const CoverageGroup = ({ title, rows = [], onDeleteItem, onChangeItem, onDeleteGroup }) => (
  <Box sx={{ border: '1px solid #DFE5EC', borderRadius: '8px', mb: 2, overflow: 'hidden' }}>
    <Box sx={{ bgcolor: '#f0f4f8', py: 1, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #DFE5EC' }}>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#333' }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '0.6rem', color: '#888', fontStyle: 'italic' }}>
          Custom overrides allowed per procedure code
        </Typography>
      </Box>
      {onDeleteGroup && (
        <IconButton size="small" onClick={onDeleteGroup} sx={{ color: '#ef4444', p: 0.5 }}>
          <DeleteIcon sx={{ fontSize: 15 }} />
        </IconButton>
      )}
    </Box>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: '#777', textTransform: 'uppercase', width: '40%', borderRight: '1px solid #f0f0f0', py: 1, px: 0.75, letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
            CATEGORY / SUB-TYPE
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: '#777', textTransform: 'uppercase', width: '22%', borderRight: '1px solid #f0f0f0', py: 1, px: 0.75, letterSpacing: '0.2px', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
            COVERAGE %
          </TableCell>
          <TableCell sx={{ fontWeight: 700, fontSize: '0.6rem', color: '#777', textTransform: 'uppercase', width: '38%', py: 1, px: 0.75, letterSpacing: '0.2px', lineHeight: 1.3 }}>
            WAITING PERIOD<br />(MONTHS)
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id || index} sx={{ '&:hover': { bgcolor: '#fafbfd' } }}>
            <TableCell sx={{ fontSize: '0.7rem', color: '#555', borderRight: '1px solid #f0f0f0', py: 1.2, px: 0.75, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9e9e9e' }}>→</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1e293b' }}>{row.label}</Typography>
                </Box>
                {/* Badges for Frequency, Limitations, Downgrades */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, ml: 1.5, mt: 0.2 }}>
                  {row.frequency?.count && (
                    <Chip 
                      label={`Freq: ${row.frequency.count}/${row.frequency.period || 'Mo'}`} 
                      size="small" 
                      sx={{ fontSize: '0.58rem', height: 16, bgcolor: '#e2ebfc', color: '#2563eb', fontWeight: 600, px: 0.3 }} 
                    />
                  )}
                  {(row.limitations?.lifeLimit || row.limitations?.ageLimit) && (
                    <Chip 
                      label={`Limit: ${row.limitations.lifeLimit ? '$' + row.limitations.lifeLimit : ''}${row.limitations.ageLimit ? ' Age:' + row.limitations.ageLimit : ''}`} 
                      size="small" 
                      sx={{ fontSize: '0.58rem', height: 16, bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600, px: 0.3 }} 
                    />
                  )}
                  {row.downgrades?.code && (
                    <Chip 
                      label={`Down: ${row.downgrades.code}`} 
                      size="small" 
                      sx={{ fontSize: '0.58rem', height: 16, bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600, px: 0.3 }} 
                    />
                  )}
                </Box>
              </Box>
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', color: '#1976d2', borderRight: '1px solid #f0f0f0', py: 1.2, px: 0.75, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <TextField 
                variant="standard"
                size="small" 
                type="number"
                value={row.coverage !== undefined ? row.coverage : ''}
                InputProps={{ inputProps: { min: 0, max: 100 }, disableUnderline: false }}
                onChange={(e) => {
                  if (e.target.value === '') {
                    if (onChangeItem) onChangeItem(row.id, 'coverage', '');
                    return;
                  }
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = 0;
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  if (onChangeItem) onChangeItem(row.id, 'coverage', val);
                }}
                sx={{ 
                  '& input': { py: 0.1, px: 0.5, fontSize: '0.7rem', color: '#1976d2', width: '35px', textAlign: 'center' },
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }} 
              />%
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', color: '#1976d2', py: 1.2, px: 0.75, borderBottom: index === rows.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField 
                  variant="standard"
                  size="small" 
                  type="number"
                  value={row.waiting !== undefined ? row.waiting : ''}
                  InputProps={{ inputProps: { min: 0 }, disableUnderline: false }}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      if (onChangeItem) onChangeItem(row.id, 'waiting', '');
                      return;
                    }
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val < 0) val = 0;
                    if (onChangeItem) onChangeItem(row.id, 'waiting', val);
                  }}
                  sx={{ 
                    '& input': { py: 0.1, px: 0.5, fontSize: '0.7rem', color: '#1976d2', width: '30px', textAlign: 'center' },
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
