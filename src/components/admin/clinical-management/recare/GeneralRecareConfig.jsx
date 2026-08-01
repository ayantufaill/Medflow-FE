import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Radio,
  RadioGroup,
  IconButton,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  KeyboardArrowDown as ExpandIcon,
} from '@mui/icons-material';

const GeneralRecareConfig = ({
  autoCreate,
  handleToggleAutoCreate,
  procedures,
  updateProcedure
}) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 1 }}>
        General Recare Configuration
      </Typography>
      <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 2 }}>
        Automatically create recare plans using the default setting when needed, or uncheck it so recare plans are only created by you using the selected configuration.
      </Typography>
      
      <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              size="small" 
              checked={autoCreate} 
              onChange={(e) => handleToggleAutoCreate(e.target.checked)} 
              sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Automatically create recare plans</Typography>}
        />
      </Box>

      <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 2, mb: 1 }}>
        Configure and order the codes that you would like to include in your recare plan, the intervals used, and the procedures to trigger the reminders
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Update Recall Dates For All Patients
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
          }}
        >
          Update Recare Plans For All Patients
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
          Drag and drop to rearrange <DragIcon sx={{ fontSize: '1rem' }} />
        </Typography>
      </Box>

      <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Intervals</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Recall Trigger</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {procedures.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                <TableCell sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell sx={{ width: 220 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField 
                      size="small" 
                      value={row.intervals} 
                      onChange={(e) => updateProcedure(index, { intervals: e.target.value })}
                      sx={{ 
                        width: 60,
                        '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' },
                        '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8, textAlign: 'center' } 
                      }} 
                    />
                    <RadioGroup 
                      row 
                      value={row.unit} 
                      onChange={(e) => updateProcedure(index, { unit: e.target.value })}
                    >
                      <FormControlLabel value="Days" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569', ml: 0.5, mr: 1 }}>Days</Typography>} />
                      <FormControlLabel value="Months" control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' }, p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569', ml: 0.5 }}>Months</Typography>} />
                    </RadioGroup>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Checkbox 
                    size="small" 
                    checked={row.trigger} 
                    onChange={(e) => updateProcedure(index, { trigger: e.target.checked })}
                    sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#10b981' } }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton size="small" sx={{ color: '#cbd5e1', '&:hover': { color: '#94a3b8', backgroundColor: '#f1f5f9' } }}>
                      <DragIcon sx={{ fontSize: '1.2rem', cursor: 'grab' }} />
                    </IconButton>
                    <IconButton size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '50%', '&:hover': { backgroundColor: '#f1f5f9' } }}>
                      <ExpandIcon sx={{ fontSize: '1rem', color: '#64748b' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {procedures.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94a3b8', fontSize: '0.85rem' }}>
                  No procedures configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GeneralRecareConfig;
