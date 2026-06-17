import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Checkbox,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Close as CloseIcon, 
  KeyboardArrowDown as KeyboardArrowDownIcon, 
  KeyboardArrowRight as KeyboardArrowRightIcon,
  AutoFixNormal as ToothIcon,
  HelpOutline as HelpIcon,
  CropSquare as SquareIcon
} from '@mui/icons-material';
import SelectToothDialog from './SelectToothDialog';

const MOCK_HIERARCHY = [
  {
    type: 'Diagnostic',
    groups: [
      {
        group: 'Oral evaluation',
        procedures: [
          { code: 'CD0120-1', name: 'Periodic Oral Eval 1 o...' },
          { code: 'CD0120-2', name: 'Periodic Oral Eval 2 o...' },
          { code: 'Ctest', name: 'test' },
          { code: 'D0120', name: 'periodic oral evaluati...' },
          { code: 'D0140', name: 'limited oral evaluatio...' },
          { code: 'D0145', name: 'oral evaluation for a p...' },
          { code: 'D0150', name: 'comprehensive oral e...' },
          { code: 'D0160', name: 'detailed and extensiv...' },
          { code: 'D0170', name: 're-evaluation - limited...' },
          { code: 'D0171', name: 're-evaluation - post-o...' },
          { code: 'D0180', name: 'comprehensive perio...' },
          { code: 'D0190', name: 'screening of a patient' },
          { code: 'D0191', name: 'assessment of a patient' }
        ]
      },
      {
        group: 'Diagnostic imaging',
        procedures: [
          { code: 'D0210', name: 'intraoral - complete s...' },
          { code: 'D0220', name: 'intraoral - periapical f...' },
          { code: 'D0230', name: 'intraoral - periapical e...' },
          { code: 'D0240', name: 'intraoral - occlusal ra...' }
        ]
      }
    ]
  },
  {
    type: 'Preventative',
    groups: [
      {
        group: 'Dental prophylaxis',
        procedures: [
          { code: 'D1110', name: 'prophylaxis - adult' },
          { code: 'D1120', name: 'prophylaxis - child' }
        ]
      },
      {
        group: 'Topical fluoride treatment',
        procedures: [
          { code: 'D1206', name: 'topical application of f...' },
          { code: 'D1208', name: 'topical application of f...' }
        ]
      }
    ]
  },
  {
    type: 'Restorative',
    groups: [
      {
        group: 'Amalgam restorations',
        procedures: [
          { code: 'D2140', name: 'amalgam - one surface' },
          { code: 'D2150', name: 'amalgam - two surfaces' }
        ]
      },
      {
        group: 'Resin-based composite',
        procedures: [
          { code: 'D2391', name: 'resin-based composite' }
        ]
      }
    ]
  },
  {
    type: 'Endodontics',
    groups: [
      {
        group: 'Pulp capping',
        procedures: [
          { code: 'D3110', name: 'pulp cap - direct' },
          { code: 'D3120', name: 'pulp cap - indirect' }
        ]
      }
    ]
  },
  {
    type: 'Periodontics',
    groups: [
      {
        group: 'Surgical services',
        procedures: [
          { code: 'D4210', name: 'gingivectomy or gingivoplasty' },
          { code: 'D4211', name: 'gingivectomy - one to three contiguous teeth' }
        ]
      }
    ]
  },
  {
    type: 'Implant Services',
    groups: [
      {
        group: 'Implants',
        procedures: [
          { code: 'D6010', name: 'surgical placement of implant body' },
          { code: 'D6058', name: 'abutment supported porcelain/ceramic crown' }
        ]
      }
    ]
  },
  {
    type: 'Oral Surgery',
    groups: [
      {
        group: 'Extractions',
        procedures: [
          { code: 'D7140', name: 'extraction, erupted tooth or exposed root' },
          { code: 'D7210', name: 'extraction, erupted tooth requiring removal of bone' }
        ]
      }
    ]
  },
  {
    type: 'Prosthodontics, Fixed',
    groups: [
      {
        group: 'Fixed partial denture pontics',
        procedures: [
          { code: 'D6240', name: 'pontic - porcelain fused to high noble metal' }
        ]
      }
    ]
  },
  {
    type: 'Prosthodontics, Removable',
    groups: [
      {
        group: 'Complete dentures',
        procedures: [
          { code: 'D5110', name: 'complete denture - maxillary' },
          { code: 'D5120', name: 'complete denture - mandibular' }
        ]
      }
    ]
  },
  {
    type: 'Adjunct General Services',
    groups: [
      {
        group: 'Unclassified treatment',
        procedures: [
          { code: 'D9110', name: 'palliative (emergency) treatment of dental pain' }
        ]
      }
    ]
  },
  {
    type: 'Orthodontics',
    groups: [
      {
        group: 'Comprehensive orthodontic treatment',
        procedures: [
          { code: 'D8080', name: 'comprehensive orthodontic treatment of the adolescent dentition' },
          { code: 'D8090', name: 'comprehensive orthodontic treatment of the adult dentition' }
        ]
      }
    ]
  },
  {
    type: 'Maxillofacial Prosthetics',
    groups: [
      {
        group: 'Prostheses',
        procedures: [
          { code: 'D5911', name: 'facial moulage (sectional)' },
          { code: 'D5912', name: 'facial moulage (complete)' }
        ]
      }
    ]
  }
];

const sharedInputStyle = {
  border: 'none',
  borderBottom: '1px solid #ccc',
  width: '30px',
  height: '14px',
  fontSize: '0.65rem',
  backgroundColor: 'transparent',
  outline: 'none',
  textAlign: 'center',
  color: '#333'
};

const smallInputStyle = {
  ...sharedInputStyle,
  width: '15px'
};

const CoverageBookModal = ({ open, onClose, coverageData = [], onSave }) => {
  const [expandedTypes, setExpandedTypes] = useState({ 'Diagnostic': true });
  const [expandedGroups, setExpandedGroups] = useState({ 'Diagnostic-Oral evaluation': true });
  const [tableData, setTableData] = useState({});

  useEffect(() => {
    if (open) {
      const dict = {};
      if (Array.isArray(coverageData)) {
        coverageData.forEach(item => {
          if (item.rowKey) {
            dict[item.rowKey] = item;
          } else if (item.code) {
            dict[`proc-${item.code}`] = item;
          }
        });
      }
      setTableData(dict);
    }
  }, [open, coverageData]);

  const [toothDialogOpen, setToothDialogOpen] = useState(false);
  const [activeToothRow, setActiveToothRow] = useState(null);

  const toggleType = (type) => {
    setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleGroup = (type, group) => {
    const key = `${type}-${group}`;
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFieldChange = (rowKey, field, value) => {
    setTableData(prev => ({
      ...prev,
      [rowKey]: {
        ...(prev[rowKey] || {}),
        [field]: value
      }
    }));
  };

  const renderInputControls = (rowKey) => {
    const row = tableData[rowKey] || {};
    return (
      <>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', fontSize: '0.65rem' }}>
            $ <input 
              style={sharedInputStyle} 
              value={row.maxAllowed || ''}
              onChange={(e) => handleFieldChange(rowKey, 'maxAllowed', e.target.value)}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', fontSize: '0.65rem', gap: 0.2 }}>
            <input 
              style={smallInputStyle} 
              value={row.frequency1 || ''}
              onChange={(e) => handleFieldChange(rowKey, 'frequency1', e.target.value)}
            /> / 
            <input 
              style={smallInputStyle} 
              value={row.frequency2 || ''}
              onChange={(e) => handleFieldChange(rowKey, 'frequency2', e.target.value)}
            />
            <Select 
              variant="standard" 
              value={row.period || 'M'} 
              disableUnderline 
              onChange={(e) => handleFieldChange(rowKey, 'period', e.target.value)}
              sx={{ fontSize: "0.55rem", '& .MuiSelect-select': { py: 0.05 }, minWidth: '18px', ml: 0.5 }}
            >
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="Y">Y</MenuItem>
            </Select>
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', fontSize: '0.65rem' }}>
            $ <input 
              style={sharedInputStyle} 
              value={row.lifetimeLimit || ''}
              onChange={(e) => handleFieldChange(rowKey, 'lifetimeLimit', e.target.value)}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', fontSize: '0.65rem', justifyContent: 'center' }}>
            <input 
              style={sharedInputStyle} 
              value={row.age || ''}
              onChange={(e) => handleFieldChange(rowKey, 'age', e.target.value)}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <ToothIcon 
              onClick={() => { setActiveToothRow(rowKey); setToothDialogOpen(true); }}
              sx={{ fontSize: 16, color: '#4A74BB', cursor: 'pointer' }} 
            />
            {row.teeth && row.teeth.length > 0 && (
              <Typography 
                onClick={() => { setActiveToothRow(rowKey); setToothDialogOpen(true); }}
                sx={{ fontSize: '0.65rem', color: '#4A74BB', cursor: 'pointer', fontWeight: 600 }}
              >
                {row.teeth.join(', ')}
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
            <Checkbox 
              size="small" 
              checked={!!row.hasDowngrade} 
              onChange={(e) => handleFieldChange(rowKey, 'hasDowngrade', e.target.checked)}
              sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} 
            />
            {row.hasDowngrade && (
              <input 
                style={sharedInputStyle}
                value={row.downgrade || ''}
                onChange={(e) => handleFieldChange(rowKey, 'downgrade', e.target.value)}
              />
            )}
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#555', fontSize: '0.65rem' }}>
            $ <input 
              style={sharedInputStyle} 
              value={row.flatPlanPortion || ''}
              onChange={(e) => handleFieldChange(rowKey, 'flatPlanPortion', e.target.value)}
            />
          </Box>
        </TableCell>
      </>
    );
  };

  const headerStyle = {
    fontWeight: 700,
    fontSize: '0.7rem',
    color: '#fff',
    borderBottom: 'none',
    whiteSpace: 'nowrap',
    px: 1,
    py: 1.5
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
      <DialogContent sx={{ p: 0, bgcolor: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
          <Table stickyHeader size="small" sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: '#4A74BB' } }}>
                <TableCell sx={{ ...headerStyle, width: '15%', pl: 4 }}>Type</TableCell>
                <TableCell sx={{ ...headerStyle, width: '20%', pl: 4 }}>Group</TableCell>
                <TableCell sx={{ ...headerStyle, width: '8%' }}>Code</TableCell>
                <TableCell sx={{ ...headerStyle, width: '18%' }}>Procedure Name</TableCell>
                <TableCell sx={{ ...headerStyle, width: '10%' }}>
                  Max Allowed /<br/>UCR($)
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '10%' }}>
                  Delivery Pattern<br/>(unit/month)
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '8%' }}>
                  Lifetime<br/>Limit ($)
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '6%' }}>
                  Age Limit<br/>(years)
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '6%' }}>
                  Teeth Limit<br/>(tooth#)
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '6%' }}>
                  Down-grade
                </TableCell>
                <TableCell sx={{ ...headerStyle, width: '10%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Flat Plan<br/>Portion
                      <HelpIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                    </Box>
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{ 
                        mt: 0.5, 
                        bgcolor: '#e0b85c', 
                        color: '#fff', 
                        fontSize: '0.5rem', 
                        px: 0.5, 
                        py: 0.1, 
                        minWidth: 'auto',
                        '&:hover': { bgcolor: '#d1a84f' }
                      }}
                    >
                      Upload CSV
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_HIERARCHY.map((typeData) => (
                <React.Fragment key={typeData.type}>
                  {/* TYPE ROW */}
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #f0f0f0', py: 0.5 } }}>
                    <TableCell>
                      <Box 
                        onClick={() => toggleType(typeData.type)}
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#555', ml: -1 }}
                      >
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          {expandedTypes[typeData.type] ? <KeyboardArrowDownIcon sx={{ fontSize: 18 }} /> : <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{typeData.type}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {renderInputControls(`type-${typeData.type}`)}
                  </TableRow>

                  {/* GROUPS */}
                  {expandedTypes[typeData.type] && typeData.groups.map((groupData) => (
                    <React.Fragment key={groupData.group}>
                      {/* GROUP ROW */}
                      <TableRow sx={{ '& td': { borderBottom: '1px solid #f0f0f0', py: 0.5 } }}>
                        <TableCell></TableCell>
                        <TableCell>
                          <Box 
                            onClick={() => toggleGroup(typeData.type, groupData.group)}
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#666', ml: -1 }}
                          >
                            <IconButton size="small" sx={{ p: 0.5 }}>
                              {expandedGroups[`${typeData.type}-${groupData.group}`] ? <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />}
                            </IconButton>
                            <Typography sx={{ fontSize: '0.7rem' }}>{groupData.group}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        {renderInputControls(`group-${typeData.type}-${groupData.group}`)}
                      </TableRow>

                      {/* PROCEDURES */}
                      {expandedGroups[`${typeData.type}-${groupData.group}`] && groupData.procedures.map((proc, idx) => (
                        <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #f0f0f0', py: 0.5 } }}>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', color: '#555', pl: 2 }}>{proc.code}</TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', color: '#555' }}>{proc.name}</TableCell>
                          {renderInputControls(`proc-${proc.code}`)}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none', color: '#555', borderColor: '#ccc' }}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            const arr = Object.keys(tableData).map(key => ({
              ...tableData[key],
              rowKey: key,
              code: key.startsWith('proc-') ? key.replace('proc-', '') : undefined
            }));
            if (onSave) onSave(arr);
            onClose();
          }} 
          variant="contained" 
          sx={{ textTransform: 'none', bgcolor: '#4A74BB', '&:hover': { bgcolor: '#385c96' } }}
        >
          Save Changes
        </Button>
      </DialogActions>

      <SelectToothDialog
        open={toothDialogOpen}
        onClose={() => setToothDialogOpen(false)}
        selectedTeeth={activeToothRow && tableData[activeToothRow] ? tableData[activeToothRow].teeth : []}
        onSave={(teeth) => {
          if (activeToothRow) {
            handleFieldChange(activeToothRow, 'teeth', teeth);
          }
        }}
      />
    </Dialog>
  );
};

export default CoverageBookModal;
