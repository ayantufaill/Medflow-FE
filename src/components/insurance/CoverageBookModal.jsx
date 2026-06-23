import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  IconButton,
  Checkbox,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import SelectToothDialog from './SelectToothDialog';
import { 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  HelpOutline as HelpOutlineIcon,
  AutoFixNormal as ToothIcon
} from '@mui/icons-material';
import { feeService } from '../../services/fee.service';

const getProcedureType = (codeStr) => {
  if (!codeStr || typeof codeStr !== 'string') return 'Other';
  const code = codeStr.toUpperCase();
  if (code.startsWith('D') || code.startsWith('C')) {
    const num = parseInt(code.substring(1), 10);
    if (!isNaN(num)) {
      if (num >= 100 && num <= 999) return 'Diagnostic';
      if (num >= 1000 && num <= 1999) return 'Preventive';
      if (num >= 2000 && num <= 2999) return 'Restorative';
      if (num >= 3000 && num <= 3999) return 'Endodontics';
      if (num >= 4000 && num <= 4999) return 'Periodontics';
      if (num >= 5000 && num <= 5899) return 'Prosthodontics, removable';
      if (num >= 5900 && num <= 5999) return 'Maxillofacial prosthetics';
      if (num >= 6000 && num <= 6199) return 'Implant services';
      if (num >= 6200 && num <= 6999) return 'Prosthodontics, fixed';
      if (num >= 7000 && num <= 7999) return 'Oral & maxillofacial surgery';
      if (num >= 8000 && num <= 8999) return 'Orthodontics';
      if (num >= 9000 && num <= 9999) return 'Adjunctive general services';
    }
  }
  return 'Other';
};

const CoverageBookModal = ({ open, onClose, coverageData = [], setCoverageData, onSave, feeGuideId }) => {
  const [loading, setLoading] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [expandedTypes, setExpandedTypes] = useState({'Diagnostic': true});
  const [expandedGroups, setExpandedGroups] = useState({'Diagnostic_Oral evaluation': true});
  const [activeToothSelection, setActiveToothSelection] = useState(null);
  const [localCoverageData, setLocalCoverageData] = useState([]);

  useEffect(() => {
    if (open) {
      setLocalCoverageData(coverageData || []);
    }
  }, [open, coverageData]);

  useEffect(() => {
    const fetchFees = async () => {
      if (!open || !feeGuideId) {
        if (!feeGuideId) setProcedures([]);
        return;
      }
      if (!/^\d+$/.test(String(feeGuideId))) {
        console.warn(`Non-numeric feeGuideId "${feeGuideId}" passed. Skipping API call.`);
        setProcedures([]);
        return;
      }
      setLoading(true);
      try {
        const response = await feeService.getFeeScheduleFees(feeGuideId, { limit: 5000 });
        if (response && response.data) {
          setProcedures(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [feeGuideId, open]);

  const mergedData = useMemo(() => {
    const overridesMap = new Map();
    localCoverageData.forEach(item => {
      if (item.code) overridesMap.set(item.code, item);
    });

    return procedures.map(proc => {
      const override = overridesMap.get(proc.code);
      return {
        ...proc,
        maxAllowed: override?.maxAllowed ?? proc.fee ?? '',
        frequency1: override?.frequency1 ?? '',
        frequency2: override?.frequency2 ?? '',
        period: override?.period ?? 'M',
        lifetimeLimit: override?.lifetimeLimit ?? '',
        age: override?.age ?? '',
        teethLimit: override?.teethLimit ?? '',
        hasDowngrade: override?.hasDowngrade ?? false,
        downgrade: override?.downgrade ?? '',
        nc: override?.nc ?? false,
        flatPlanPortion: override?.flatPlanPortion ?? ''
      };
    });
  }, [procedures, localCoverageData]);

  const treeData = useMemo(() => {
    const tree = {};
    mergedData.forEach(item => {
      const type = getProcedureType(item.code);
      const group = item.category || 'General';

      if (!tree[type]) tree[type] = {};
      if (!tree[type][group]) tree[type][group] = [];
      tree[type][group].push(item);
    });
    return tree;
  }, [mergedData]);

  const toggleType = (type) => setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  const toggleGroup = (groupKey) => setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));

  const handleFieldChange = (code, field, value) => {
    const newData = [...localCoverageData];
    const index = newData.findIndex(item => item.code === code);
    if (index >= 0) {
      newData[index] = { ...newData[index], [field]: value };
    } else {
      const item = mergedData.find(i => i.code === code);
      if (item) newData.push({ ...item, [field]: value });
    }
    setLocalCoverageData(newData);
  };

  const handleToothToggle = (tooth) => {
    if (!activeToothSelection) return;
    const proc = mergedData.find(p => p.code === activeToothSelection);
    if (!proc) return;
    
    let currentTeeth = proc.teethLimit ? proc.teethLimit.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (currentTeeth.includes(tooth)) {
      currentTeeth = currentTeeth.filter(t => t !== tooth);
    } else {
      currentTeeth.push(tooth);
    }
    handleFieldChange(activeToothSelection, 'teethLimit', currentTeeth.join(', '));
  };

  const headerCellStyle = { 
    fontWeight: 600, 
    color: '#fff', 
    backgroundColor: '#4A75B4', 
    fontSize: '0.65rem', 
    lineHeight: 1.2,
    py: 1, 
    px: 0.5,
    border: 'none',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  const cellStyle = { 
    fontSize: '0.75rem', 
    color: '#444',
    py: 0.8, 
    px: 0.5, 
    border: 'none',
    borderBottom: '1px solid #f0f0f0'
  };

  const inputStyle = {
    fontSize: '0.65rem',
    color: '#333',
    border: 'none',
    borderBottom: '1px solid #999',
    width: '25px',
    textAlign: 'center',
    outline: 'none',
    backgroundColor: 'transparent'
  };

  const renderInputCells = (proc = {}, isGroup = false, code = null) => {
    const onChange = (field, val) => {
      if (code) handleFieldChange(code, field, val);
    };
    
    return (
      <>
        {/* Max Allowed / UCR */}
        <TableCell sx={cellStyle} align="center">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.2 }}>
            $ <input style={inputStyle} value={proc.maxAllowed || ''} onChange={e => onChange('maxAllowed', e.target.value)} />
          </Box>
        </TableCell>
        
        {/* Delivery Pattern */}
        <TableCell sx={cellStyle} align="center">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.2, flexWrap: 'nowrap' }}>
            <input style={{...inputStyle, width:'15px'}} value={proc.frequency1 || ''} onChange={e => onChange('frequency1', e.target.value)} />
            <span>/</span>
            <input style={{...inputStyle, width:'15px', borderBottom: 'none'}} value={proc.frequency2 || ''} onChange={e => onChange('frequency2', e.target.value)} />
            <Select 
              variant="standard" 
              value={proc.period || 'M'} 
              disableUnderline 
              onChange={(e) => onChange('period', e.target.value)}
              sx={{ fontSize: "0.6rem", '& .MuiSelect-select': { py: 0.05 }, minWidth: '20px' }}
            >
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="Y">Y</MenuItem>
            </Select>
          </Box>
        </TableCell>

        {/* Lifetime Limit */}
        <TableCell sx={cellStyle} align="center">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.2 }}>
            $ <input style={inputStyle} value={proc.lifetimeLimit || ''} onChange={e => onChange('lifetimeLimit', e.target.value)} />
          </Box>
        </TableCell>

        {/* Age Limit */}
        <TableCell sx={cellStyle} align="center">
          <input style={{...inputStyle, width: '20px'}} value={proc.age || ''} onChange={e => onChange('age', e.target.value)} />
        </TableCell>

        {/* Teeth Limit */}
        <TableCell sx={cellStyle} align="center">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, cursor: 'pointer' }} onClick={() => code && setActiveToothSelection(code)}>
            <ToothIcon sx={{ fontSize: 16, color: "#1976d2" }} />
            {proc.teethLimit && (
              <Typography sx={{ fontSize: '0.65rem', color: '#1976d2' }}>
                {proc.teethLimit.length > 5 ? proc.teethLimit.substring(0, 5) + '...' : proc.teethLimit}
              </Typography>
            )}
          </Box>
        </TableCell>

        {/* Down-grade */}
        <TableCell sx={cellStyle} align="center">
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
            <Checkbox 
              size="small" 
              sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} 
              checked={proc.hasDowngrade || false} 
              onChange={e => onChange('hasDowngrade', e.target.checked)} 
            />
            {proc.hasDowngrade && (
              <input type="text" style={{...inputStyle, width: '35px'}} value={proc.downgrade || ''} onChange={e => onChange('downgrade', e.target.value)} />
            )}
          </Box>
        </TableCell>

        {/* NC */}
        <TableCell sx={cellStyle} align="center">
          <Checkbox 
            size="small" 
            sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} 
            checked={proc.nc || false} 
            onChange={e => onChange('nc', e.target.checked)} 
          />
        </TableCell>

        {/* Flat Plan Portion */}
        <TableCell sx={cellStyle} align="center">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.2 }}>
            $ <input style={inputStyle} value={proc.flatPlanPortion || ''} onChange={e => onChange('flatPlanPortion', e.target.value)} />
          </Box>
        </TableCell>
      </>
    );
  };

  const getGroupKey = (type, group) => `${type}_${group}`;



  const handleSaveClick = () => {
    if (setCoverageData) {
      setCoverageData(localCoverageData);
    }
    if (onSave) {
      onSave(localCoverageData);
    }
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ sx: { width: '95vw', height: '90vh', m: 0, borderRadius: 1 }}}>
        <DialogContent sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : (!feeGuideId ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 4 }}>
              <Typography color="textSecondary">Please select a Plan Fee Guide on the coverage form first to load procedures.</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ flex: 1, overflow: 'auto', bgcolor: '#fff' }}>
              <Table size="small" stickyHeader sx={{ minWidth: 1300, tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headerCellStyle, width: '10%' }}>Type</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '13%' }}>Group</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '6%' }}>Code</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '15%' }}>Procedure Name</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '7%' }} align="center">Max Allowed/<br/>UCR($)</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '10%' }} align="center">Delivery Pattern<br/>(Frequency,M,Y)</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '7%' }} align="center">Lifetime Limit</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '6%' }} align="center">Age Limit<br/>(Years)</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '6%' }} align="center">Teeth Limit<br/>(Tooth#)</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '8%' }} align="center">Down-grade</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '4%' }} align="center">NC</TableCell>
                    <TableCell sx={{ ...headerCellStyle, width: '8%' }} align="center">
                      Flat Plan Portion
                      <HelpOutlineIcon sx={{fontSize: '0.7rem', verticalAlign: 'middle', cursor: 'pointer', ml: 0.5}}/>
                      <Box sx={{ bgcolor: '#e0a860', color: '#fff', fontSize: '0.55rem', textAlign: 'center', borderRadius: '2px', py: 0.2, mt: 0.5, cursor: 'pointer', px: 1, whiteSpace: 'nowrap', width: 'fit-content', margin: '4px auto 0' }}>
                        Upload CSV
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(treeData).map(([type, groups]) => (
                    <React.Fragment key={type}>
                      {/* TYPE ROW */}
                      <TableRow hover>
                        <TableCell sx={cellStyle}>
                          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1, fontWeight: 600, color: '#333' }} onClick={() => toggleType(type)}>
                            {expandedTypes[type] ? <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: '#666', mr: 0.5 }} /> : <KeyboardArrowRightIcon sx={{ fontSize: '1rem', color: '#666', mr: 0.5 }} />}
                            {type}
                          </Box>
                        </TableCell>
                        <TableCell sx={cellStyle}></TableCell>
                        <TableCell sx={cellStyle}></TableCell>
                        <TableCell sx={cellStyle}></TableCell>
                        {renderInputCells()}
                      </TableRow>

                      {/* GROUPS AND PROCEDURES */}
                      {expandedTypes[type] && Object.entries(groups).map(([group, procs]) => (
                        <React.Fragment key={group}>
                          {/* GROUP ROW */}
                          <TableRow hover>
                            <TableCell sx={cellStyle}></TableCell>
                            <TableCell sx={cellStyle}>
                              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1, fontWeight: 500, color: '#555' }} onClick={() => toggleGroup(getGroupKey(type, group))}>
                                {expandedGroups[getGroupKey(type, group)] ? <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: '#666', mr: 0.5 }} /> : <KeyboardArrowRightIcon sx={{ fontSize: '1rem', color: '#666', mr: 0.5 }} />}
                                {group}
                              </Box>
                            </TableCell>
                            <TableCell sx={cellStyle}></TableCell>
                            <TableCell sx={cellStyle}></TableCell>
                            {renderInputCells()}
                          </TableRow>

                          {/* PROCEDURE ROWS */}
                          {expandedGroups[getGroupKey(type, group)] && procs.map(proc => (
                            <TableRow key={proc.code} hover>
                              <TableCell sx={cellStyle}></TableCell>
                              <TableCell sx={cellStyle}></TableCell>
                              <TableCell sx={{ ...cellStyle, pl: 2, fontWeight: 500 }}>{proc.code}</TableCell>
                              <TableCell sx={{ ...cellStyle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={proc.name}>
                                {proc.name}
                              </TableCell>
                              {renderInputCells(proc, false, proc.code)}
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none', color: '#555', borderColor: '#ccc' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveClick}
            variant="contained" 
            sx={{ textTransform: 'none', bgcolor: '#4A75B4', '&:hover': { bgcolor: '#3b5f94' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tooth Selection Dialog */}
      <SelectToothDialog
        open={!!activeToothSelection}
        onClose={() => setActiveToothSelection(null)}
        selectedTeeth={activeToothSelection ? (mergedData.find(p => p.code === activeToothSelection)?.teethLimit || []) : []}
        onToggle={handleToothToggle}
      />
    </>
  );
};

export default CoverageBookModal;
