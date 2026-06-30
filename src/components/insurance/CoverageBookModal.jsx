import React from 'react';
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Checkbox,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import { 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  HelpOutline as HelpOutlineIcon,
  AutoFixNormal as ToothIcon
} from '@mui/icons-material';
import { useCoverageBook } from './hooks/useCoverageBook';
import ToothSelectionDialog from './shared/ToothSelectionDialog';

const CoverageBookModal = ({ open, onClose, coverageData = [], setCoverageData, feeGuideId }) => {
  const {
    loading,
    treeData,
    expandedTypes,
    expandedGroups,
    activeToothSelection,
    setActiveToothSelection,
    toggleType,
    toggleGroup,
    handleFieldChange,
    handleToothToggle,
    isToothSelected
  } = useCoverageBook(open, feeGuideId, coverageData, setCoverageData);

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
      </Dialog>

      <ToothSelectionDialog
        open={!!activeToothSelection}
        onClose={() => setActiveToothSelection(null)}
        activeSelectionCode={activeToothSelection}
        isToothSelected={isToothSelected}
        onToothToggle={handleToothToggle}
      />
    </>
  );
};

export default CoverageBookModal;
