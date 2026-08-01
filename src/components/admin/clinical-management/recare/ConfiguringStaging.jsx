import React from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ConfiguringStaging = ({
  stages,
  activeTab,
  handleTabChange,
  handleAddStage,
  handleDeleteStage,
  handleUpdateStageDetails,
  handleUpdateStageProcedure,
  stagingProcedures
}) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
            Configuring Staging
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 0.5 }}>
            Customize the procedures and the intervals for each stage of periodontal disease (automatically calculated by Medflow)
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
            Create your own recare intervals and procedures for membership plans
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleAddStage}
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
          + Add Stage
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
          sx={{ 
            minHeight: 40,
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontSize: '0.85rem', 
              fontWeight: 500,
              minWidth: 80, 
              minHeight: 40, 
              p: 1.5, 
              color: '#64748b' 
            },
            '& .Mui-selected': { 
              color: '#3b82f6 !important', 
              fontWeight: 600
            },
            '& .MuiTabs-indicator': { 
              backgroundColor: '#3b82f6',
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }
          }}
        >
          {stages.map((stage, idx) => (
            <Tab 
              key={idx} 
              label={stage.name} 
              sx={stage.name === 'Healthy' ? { color: '#10b981 !important' } : {}} 
            />
          ))}
        </Tabs>
      </Box>

      {stages[activeTab] && (
        <Box sx={{ backgroundColor: '#f8fafc', p: 3, borderRadius: 2, border: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <TextField 
              placeholder="Stage Name" 
              size="small" 
              value={stages[activeTab].name}
              onChange={(e) => handleUpdateStageDetails({ name: e.target.value })}
              sx={{ 
                flex: 1, 
                maxWidth: 300,
                backgroundColor: '#fff', 
                '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
                '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1, fontWeight: 500, color: '#1e293b' } 
              }} 
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={stages[activeTab].default || false}
                  onChange={(e) => handleUpdateStageDetails({ default: e.target.checked })}
                  sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }}
                />
              }
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Make Default Stage</Typography>}
            />
            
            <Box sx={{ ml: 'auto' }}>
              <IconButton 
                size="small" 
                onClick={() => handleDeleteStage(activeTab)}
                sx={{ 
                  color: '#ef4444', 
                  backgroundColor: '#fef2f2', 
                  border: '1px solid #fecaca',
                  borderRadius: 1.5,
                  '&:hover': { backgroundColor: '#fee2e2' } 
                }}
              >
                <DeleteIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Box>
          </Box>

          <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Procedure</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', width: 180 }}>Frequency Interval</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', width: 100, textAlign: 'right' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stagingProcedures.map((proc, index) => {
                  const currentProc = stages[activeTab].procedures?.find(p => p.name === proc) || { name: proc, frequency: 'Months', active: false };
                  return (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#fff' }, transition: 'background-color 0.2s' }}>
                      <TableCell sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>{proc}</TableCell>
                      <TableCell>
                        <Select 
                          fullWidth 
                          size="small" 
                          value={currentProc.frequency || 'Months'}
                          onChange={(e) => handleUpdateStageProcedure(proc, { frequency: e.target.value })}
                          sx={{ 
                            fontSize: '0.85rem', 
                            backgroundColor: '#fff', 
                            borderRadius: 1.5,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                          }}
                        >
                          <MenuItem value="Months" sx={{ fontSize: '0.85rem' }}>Months</MenuItem>
                          <MenuItem value="Weeks" sx={{ fontSize: '0.85rem' }}>Weeks</MenuItem>
                          <MenuItem value="Days" sx={{ fontSize: '0.85rem' }}>Days</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Switch 
                          size="small" 
                          checked={currentProc.active || false}
                          onChange={(e) => handleUpdateStageProcedure(proc, { active: e.target.checked })}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#10b981',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#10b981',
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ConfiguringStaging;
