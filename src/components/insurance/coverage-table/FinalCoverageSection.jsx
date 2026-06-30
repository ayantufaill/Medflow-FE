import React from 'react';
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { Add as AddIconNew } from "@mui/icons-material";
import CoverageGroup from './CoverageGroup';
import { COVERAGE_DATA } from '../utils/insuranceConstants';

const FinalCoverageSection = ({ coverageData, setCoverageData }) => {
  const handleDeleteCoverageItem = (itemId) => {
    if (!coverageData || !setCoverageData) return;
    const updatedData = {};
    Object.keys(coverageData).forEach(key => {
      updatedData[key] = coverageData[key].filter(item => item.id !== itemId);
    });
    setCoverageData(updatedData);
  };

  const handleChangeCoverageItem = (itemId, field, value) => {
    if (!coverageData || !setCoverageData) return;
    const updatedData = {};
    Object.keys(coverageData).forEach(key => {
      updatedData[key] = coverageData[key].map(item => item.id === itemId ? { ...item, [field]: value } : item);
    });
    setCoverageData(updatedData);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography 
          sx={{ color: '#2563eb', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <AddIconNew sx={{ fontSize: 16 }} /> Add Coverage
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.5 }}>COVERAGE BOOK SHORTCUTS</Typography>
            <Select 
              size="small" 
              displayEmpty 
              defaultValue="" 
              onChange={(e) => {
                if (e.target.value === 'standard_ppo' && setCoverageData) {
                  setCoverageData(COVERAGE_DATA);
                }
              }}
              sx={{ bgcolor: '#fff', fontSize: '0.75rem', '& .MuiSelect-select': { py: 0.8, px: 1.5 }, minWidth: '180px', '& fieldset': { borderColor: '#DFE5EC' } }}
            >
              <MenuItem value=""><em>Select template</em></MenuItem>
              <MenuItem value="standard_ppo" sx={{ fontSize: '0.75rem' }}>Standard PPO</MenuItem>
              <MenuItem value="custom" sx={{ fontSize: '0.75rem' }}>Custom Template</MenuItem>
            </Select>
          </Box>
          <Typography sx={{ color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', mt: 2.5 }}>+ Add Group</Typography>
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
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CoverageGroup title="Preventative" rows={coverageData?.preventative || COVERAGE_DATA.preventative} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Endodontics" rows={coverageData?.endodontics || COVERAGE_DATA.endodontics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Implant Services" rows={coverageData?.implantServices || COVERAGE_DATA.implantServices} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Prosthodontics, Fixed" rows={coverageData?.prosthodonticsFixed || COVERAGE_DATA.prosthodonticsFixed} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Adjunct General Services" rows={coverageData?.adjunctGeneral || COVERAGE_DATA.adjunctGeneral} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
          <CoverageGroup title="Maxillofacial Prosthetics" rows={coverageData?.maxillofacialProsthetics || COVERAGE_DATA.maxillofacialProsthetics} onDeleteItem={handleDeleteCoverageItem} onChangeItem={handleChangeCoverageItem} />
        </Box>
      </Box>
    </Box>
  );
};

export default FinalCoverageSection;
