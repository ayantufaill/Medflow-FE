import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import { Add as AddIconNew } from "@mui/icons-material";
import CoverageGroup from './CoverageGroup';
import { COVERAGE_DATA } from '../utils/insuranceConstants';
import AddCoverageItemDialog from '../components/AddCoverageItemDialog';
import AddCoverageGroupDialog from '../components/AddCoverageGroupDialog';
import { coverageGroupService } from '../../../services/insurance.service';

const ADA_CATEGORY_KEY_MAP = {
  'Diagnostic':                  'diagnostic',
  'Preventive':                  'preventative',
  'Restorative':                 'restorative',
  'Endodontics':                 'endodontics',
  'Periodontics':                'periodontics',
  'Prosthodontics, removable':   'prosthodonticsRemovable',
  'Maxillofacial Prosthetics':   'maxillofacialProsthetics',
  'Implant Services':            'implantServices',
  'Prosthodontics, fixed':       'prosthodonticsFixed',
  'Oral & Maxillofacial Surgery':'oralSurgery',
  'Orthodontics':                'orthodontics',
  'Adjunctive General Services': 'adjunctGeneral',
};

const FinalCoverageSection = ({ coverageData, setCoverageData }) => {
  const [isAddCoverageOpen, setIsAddCoverageOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [customGroups, setCustomGroups] = useState([]);

  const [customGroupValues, setCustomGroupValues] = useState(() => {
    try {
      const stored = localStorage.getItem('medflow_custom_coverage_group_values');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const loadCustomGroups = async () => {
      let localGroups = [];
      try {
        const stored = localStorage.getItem('medflow_custom_coverage_groups');
        if (stored) {
          localGroups = JSON.parse(stored);
        }
      } catch (e) {
        console.error(e);
      }

      try {
        const serverGroups = await coverageGroupService.getCoverageGroups();
        if (serverGroups && Array.isArray(serverGroups) && serverGroups.length > 0) {
          const combined = [...serverGroups];
          localGroups.forEach(localG => {
            if (!combined.some(sG => (sG.groupId || sG.id) === (localG.groupId || localG.id))) {
              combined.push(localG);
            }
          });
          setCustomGroups(combined);
          localStorage.setItem('medflow_custom_coverage_groups', JSON.stringify(combined));
          return;
        }
      } catch (err) {
        console.error('Failed to load coverage groups:', err);
      }

      if (localGroups.length > 0) {
        setCustomGroups(localGroups);
      }
    };
    loadCustomGroups();
  }, []);

  const handleDeleteCustomGroup = async (groupId, groupName) => {
    if (!window.confirm(`Delete coverage group "${groupName}"?`)) return;
    try {
      await coverageGroupService.deleteCoverageGroup(groupId);
    } catch (err) {
      console.error(err);
    }
    setCustomGroups(prev => {
      const updated = prev.filter(g => (g.groupId || g.id) !== groupId);
      try {
        localStorage.setItem('medflow_custom_coverage_groups', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSnackbarMessage(`Coverage group "${groupName}" deleted`);
  };

  const handleCustomGroupItemChange = (groupId, rowId, field, value) => {
    setCustomGroupValues(prev => {
      const updated = {
        ...prev,
        [`${groupId}_${rowId}`]: {
          ...prev[`${groupId}_${rowId}`],
          [field]: value
        }
      };
      try {
        localStorage.setItem('medflow_custom_coverage_group_values', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteCustomGroupItem = (groupId, rowId) => {
    setCustomGroups(prev => {
      const updated = prev.map(g => {
        if ((g.groupId || g.id) === groupId) {
          if (Array.isArray(g.codes)) {
            const codeIdx = parseInt(rowId.split('-').pop(), 10);
            const newCodes = g.codes.filter((_, idx) => idx !== codeIdx);
            return { ...g, codes: newCodes };
          }
        }
        return g;
      });
      try {
        localStorage.setItem('medflow_custom_coverage_groups', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const getRowsForGroup = (group) => {
    const groupId = group.groupId || group.id;
    if (Array.isArray(group.codes) && group.codes.length > 0) {
      return group.codes.map((code, idx) => {
        const rowId = `${groupId}-${idx}`;
        const itemVal = customGroupValues[`${groupId}_${rowId}`] || {};
        return {
          id: rowId,
          groupId: groupId,
          label: code,
          coverage: itemVal.coverage !== undefined ? itemVal.coverage : (group.coverage ?? 80),
          waiting: itemVal.waiting !== undefined ? itemVal.waiting : (group.waiting ?? 0),
          frequency: group.frequency,
          limitations: group.limitations,
          downgrades: group.downgrades,
          deletable: true,
        };
      });
    }
    const itemVal = customGroupValues[`${groupId}_${groupId}`] || {};
    return [
      {
        id: groupId,
        groupId: groupId,
        label: group.name,
        coverage: itemVal.coverage !== undefined ? itemVal.coverage : (group.coverage ?? 80),
        waiting: itemVal.waiting !== undefined ? itemVal.waiting : (group.waiting ?? 0),
        frequency: group.frequency,
        limitations: group.limitations,
        downgrades: group.downgrades,
        deletable: true,
      }
    ];
  };

  const col1CustomGroups = customGroups.filter((_, idx) => idx % 2 === 0);
  const col2CustomGroups = customGroups.filter((_, idx) => idx % 2 === 1);

  const handleDeleteCoverageItem = (itemId) => {
    if (!setCoverageData) return;
    const currentData = { ...COVERAGE_DATA, ...coverageData };
    const updatedData = {};
    Object.keys(currentData).forEach(key => {
      updatedData[key] = (currentData[key] || []).filter(item => item.id !== itemId);
    });
    setCoverageData(updatedData);
  };

  const handleChangeCoverageItem = (itemId, field, value) => {
    if (!setCoverageData) return;
    const currentData = { ...COVERAGE_DATA, ...coverageData };
    const updatedData = {};
    Object.keys(currentData).forEach(key => {
      updatedData[key] = (currentData[key] || []).map(item => item.id === itemId ? { ...item, [field]: value } : item);
    });
    setCoverageData(updatedData);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          onClick={() => setIsAddCoverageOpen(true)}
          sx={{ color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <AddIconNew sx={{ fontSize: 16 }} /> Add Coverage
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>COVERAGE BOOK SHORTCUTS</Typography>
            <Select 
              size="small" 
              displayEmpty 
              defaultValue="" 
              onChange={(e) => {
                if (e.target.value === 'standard_ppo' && setCoverageData) {
                  setCoverageData(COVERAGE_DATA);
                }
              }}
              sx={{ bgcolor: '#fff', fontSize: '0.7rem', '& .MuiSelect-select': { py: 0.8, px: 1.5 }, minWidth: '180px', '& fieldset': { borderColor: '#DFE5EC' } }}
            >
              <MenuItem value=""><em>Select template</em></MenuItem>
              <MenuItem value="standard_ppo" sx={{ fontSize: '0.7rem' }}>Standard PPO</MenuItem>
              <MenuItem value="custom" sx={{ fontSize: '0.7rem' }}>Custom Template</MenuItem>
              {customGroups.map((g) => (
                <MenuItem key={g.groupId || g.id} value={g.groupId || g.id} sx={{ fontSize: '0.7rem' }}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Typography 
            onClick={() => setIsAddGroupOpen(true)}
            sx={{ color: '#2563eb', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', mt: 2.5 }}
          >
            + Add Group
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '16px' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CoverageGroup title="Diagnostic" rows={coverageData?.diagnostic || COVERAGE_DATA.diagnostic} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Restorative" rows={coverageData?.restorative || COVERAGE_DATA.restorative} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Periodontics" rows={coverageData?.periodontics || COVERAGE_DATA.periodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Oral Surgery" rows={coverageData?.oralSurgery || COVERAGE_DATA.oralSurgery} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Prosthodontics, Removable" rows={coverageData?.prosthodonticsRemovable || COVERAGE_DATA.prosthodonticsRemovable} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Orthodontics" rows={coverageData?.orthodontics || COVERAGE_DATA.orthodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          {col1CustomGroups.map((group) => {
            const gId = group.groupId || group.id;
            return (
              <CoverageGroup
                key={gId}
                title={group.name}
                rows={getRowsForGroup(group)}
                onDeleteGroup={() => handleDeleteCustomGroup(gId, group.name)}
                onDeleteItem={(rowId) => handleDeleteCustomGroupItem(gId, rowId)}
                onChangeItem={(rowId, field, value) => handleCustomGroupItemChange(gId, rowId, field, value)}
              />
            );
          })}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CoverageGroup title="Preventative" rows={coverageData?.preventative || COVERAGE_DATA.preventative} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Endodontics" rows={coverageData?.endodontics || COVERAGE_DATA.endodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Implant Services" rows={coverageData?.implantServices || COVERAGE_DATA.implantServices} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Prosthodontics, Fixed" rows={coverageData?.prosthodonticsFixed || COVERAGE_DATA.prosthodonticsFixed} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Adjunct General Services" rows={coverageData?.adjunctGeneral || COVERAGE_DATA.adjunctGeneral} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Maxillofacial Prosthetics" rows={coverageData?.maxillofacialProsthetics || COVERAGE_DATA.maxillofacialProsthetics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          {col2CustomGroups.map((group) => {
            const gId = group.groupId || group.id;
            return (
              <CoverageGroup
                key={gId}
                title={group.name}
                rows={getRowsForGroup(group)}
                onDeleteGroup={() => handleDeleteCustomGroup(gId, group.name)}
                onDeleteItem={(rowId) => handleDeleteCustomGroupItem(gId, rowId)}
                onChangeItem={(rowId, field, value) => handleCustomGroupItemChange(gId, rowId, field, value)}
              />
            );
          })}
        </Box>
      </Box>

      <AddCoverageItemDialog
        open={isAddCoverageOpen}
        onClose={() => setIsAddCoverageOpen(false)}
        onSave={(newItem) => {
          if (setCoverageData) {
             const currentData = { ...COVERAGE_DATA, ...coverageData };
             const updatedData = { ...currentData };
             
             const categoryKey = ADA_CATEGORY_KEY_MAP[newItem.category];
             if (!categoryKey) {
               setSnackbarMessage('Procedure not found — category cannot be determined');
               return;
             }

             updatedData[categoryKey] = [...(updatedData[categoryKey] || []), { 
               ...newItem, 
               label: newItem.code,
               waiting: newItem.waitingPeriod,
               deletable: true,
               isCustom: true,
               noCoverage: false 
             }];
             setCoverageData(updatedData);
          }
        }}
      />

      <AddCoverageGroupDialog
        open={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
        onSave={(savedGroup) => {
          setCustomGroups((prev) => {
            const updated = [...prev, savedGroup];
            try {
              localStorage.setItem('medflow_custom_coverage_groups', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
          setSnackbarMessage(`Coverage group "${savedGroup.name}" added to coverage table`);
        }}
      />

      <Snackbar open={!!snackbarMessage} autoHideDuration={4000} onClose={() => setSnackbarMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" onClose={() => setSnackbarMessage('')}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FinalCoverageSection;
