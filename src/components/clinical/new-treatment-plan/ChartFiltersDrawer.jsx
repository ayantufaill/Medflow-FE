import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Tabs, 
  Tab, 
  Button,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const labelSx = { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: 1.5 };
const sectionSx = { p: 2, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, bgcolor: COLORS.SURFACE_CARD };

const ChartFiltersDrawer = ({ open, onClose, onApply }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedToothState, setSelectedToothState] = useState('All Tooth States');
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  
  const [visibleColumns, setVisibleColumns] = useState({
    icd: true,
    provider: true,
    created: true,
    completed: true,
    lab: true,
    comments: true
  });

  const handleApply = () => {
    if (onApply) {
      onApply({
        type: selectedType,
        toothState: selectedToothState,
        teeth: selectedTeeth,
        columns: visibleColumns
      });
    }
    onClose();
  };

  const maxillaryUR = [1, 2, 3, 4, 5];
  const maxillaryUA = [6, 7, 8, 'Q1', '', 'Q2', 9, 10, 11];
  const maxillaryUL = [12, 13, 14, 15, 16];

  const mandibularLR = [32, 31, 30, 29, 28];
  const mandibularLA = [27, 26, 25, 'Q4', '', 'Q3', 24, 23, 22];
  const mandibularLL = [21, 20, 19, 18, 17];

  // Supernumerary Adult Teeth
  const superAdultRightPost = { top: [51, 52, 53, 54, 55], bottom: [82, 81, 80, 79, 78] };
  const superAdultAnterior = { top: [56, 57, 58, 59, 60, 61], bottom: [77, 76, 75, 74, 73, 72] };
  const superAdultLeftPost = { top: [62, 63, 64, 65, 66], bottom: [71, 70, 69, 68, 67] };

  // Retained Primary Teeth
  const retainedRightPost = { top: ['A', 'B'], bottom: ['T', 'S'] };
  const retainedAnterior = { top: ['C', 'D', 'E', 'F', 'G', 'H'], bottom: ['R', 'Q', 'P', 'O', 'N', 'M'] };
  const retainedLeftPost = { top: ['I', 'J'], bottom: ['L', 'K'] };

  // Supernumerary Primary Teeth
  const superPrimaryRightPost = { top: ['AS', 'BS'], bottom: ['TS', 'SS'] };
  const superPrimaryAnterior = { top: ['CS', 'DS', 'ES', 'FS', 'GS', 'HS'], bottom: ['RS', 'QS', 'PS', 'OS', 'NS', 'MS'] };
  const superPrimaryLeftPost = { top: ['IS', 'JS'], bottom: ['LS', 'KS'] };

  const [showSuperAdult, setShowSuperAdult] = useState(false);
  const [showRetainedPrimary, setShowRetainedPrimary] = useState(false);
  const [showSuperPrimary, setShowSuperPrimary] = useState(false);

  const handleToothClick = (tooth) => {
    if (tooth === '' || (typeof tooth === 'string' && tooth.startsWith('Q'))) return;
    setSelectedTeeth(prev => {
      return prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth];
    });
  };

  const handleRegionClick = (regionArray) => {
    const validTeeth = regionArray.filter(t => t !== '' && !(typeof t === 'string' && t.startsWith('Q')));
    const allSelected = validTeeth.every(t => selectedTeeth.includes(t));
    if (allSelected) {
      setSelectedTeeth(selectedTeeth.filter(t => !validTeeth.includes(t)));
    } else {
      const newTeeth = new Set([...selectedTeeth, ...validTeeth]);
      setSelectedTeeth(Array.from(newTeeth));
    }
  };

  const ToothButton = ({ label }) => {
    const isSelected = selectedTeeth.includes(label);
    const isQuadrant = typeof label === 'string' && label.startsWith('Q');

    return (
      <Box
        onClick={() => handleToothClick(label)}
        sx={{
          width: '26px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          color: isSelected ? 'white' : '#4b5563',
          bgcolor: isSelected ? '#5c7bb5' : 'transparent',
          cursor: (label === '' || isQuadrant) ? 'default' : 'pointer',
          '&:hover': { bgcolor: (label === '' || isQuadrant) ? 'transparent' : isSelected ? '#4a6291' : '#f3f4f6' },
          visibility: label === '' ? 'hidden' : 'visible',
          borderRadius: '2px',
          m: '1px'
        }}
      >
        {label}
      </Box>
    );
  };

  const HeaderBox = ({ label, onClickRegion }) => (
    <Box 
      onClick={onClickRegion}
      sx={{ 
        bgcolor: '#f9fafb', py: 0.5, textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#6b7280',
        cursor: onClickRegion ? 'pointer' : 'default',
        '&:hover': { bgcolor: onClickRegion ? '#e5e7eb' : '#f9fafb' }
      }}
    >
      {label}
    </Box>
  );

  const AdditionalTeethContainer = ({ title, rightPost, anterior, leftPost }) => (
    <Box sx={{ borderTop: '1px solid #e5e7eb', mb: 0, overflow: 'hidden' }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '11px', color: '#1e3a8a', bgcolor: '#f9fafb', py: 0.5, px: 1.5 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
        {/* Right Posterior */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderBox label="Right Posterior" />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
            {rightPost.top.map(t => <ToothButton key={t} label={t} />)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
            {rightPost.bottom.map(t => <ToothButton key={t} label={t} />)}
          </Box>
        </Box>
        {/* Anterior */}
        <Box sx={{ flex: 1.5, borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderBox label="Anterior" />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
            {anterior.top.map(t => <ToothButton key={t} label={t} />)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
            {anterior.bottom.map(t => <ToothButton key={t} label={t} />)}
          </Box>
        </Box>
        {/* Left Posterior */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HeaderBox label="Left Posterior" />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
            {leftPost.top.map(t => <ToothButton key={t} label={t} />)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
            {leftPost.bottom.map(t => <ToothButton key={t} label={t} />)}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderToothGrid = () => (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '4px', mb: 2, overflow: 'hidden' }}>
        <HeaderBox label="Maxillary Arch" />
        <Box sx={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
          <Box sx={{ width: '26%' }}>
            <HeaderBox label="UR" onClickRegion={() => handleRegionClick(maxillaryUR)} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {maxillaryUR.map(t => <ToothButton key={t} label={t} />)}
            </Box>
          </Box>
          <Box sx={{ width: '48%', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
            <HeaderBox label="UA" onClickRegion={() => handleRegionClick(maxillaryUA)} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {maxillaryUA.map((t, i) => <ToothButton key={i} label={t} />)}
            </Box>
          </Box>
          <Box sx={{ width: '26%' }}>
            <HeaderBox label="UL" onClickRegion={() => handleRegionClick(maxillaryUL)} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {maxillaryUL.map(t => <ToothButton key={t} label={t} />)}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
          <Box sx={{ width: '26%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {mandibularLR.map(t => <ToothButton key={t} label={t} />)}
            </Box>
            <HeaderBox label="LR" onClickRegion={() => handleRegionClick(mandibularLR)} />
          </Box>
          <Box sx={{ width: '48%', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {mandibularLA.map((t, i) => <ToothButton key={t} label={t} />)}
            </Box>
            <HeaderBox label="LA" onClickRegion={() => handleRegionClick(mandibularLA)} />
          </Box>
          <Box sx={{ width: '26%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {mandibularLL.map(t => <ToothButton key={t} label={t} />)}
            </Box>
            <HeaderBox label="LL" onClickRegion={() => handleRegionClick(mandibularLL)} />
          </Box>
        </Box>
        <HeaderBox label="Mandibular Arch" />

        {showSuperAdult && (
          <AdditionalTeethContainer 
            title="Supernumerary Adult Teeth" 
            rightPost={superAdultRightPost} 
            anterior={superAdultAnterior} 
            leftPost={superAdultLeftPost} 
          />
        )}
        {showRetainedPrimary && (
          <AdditionalTeethContainer 
            title="Retained Primary Teeth" 
            rightPost={retainedRightPost} 
            anterior={retainedAnterior} 
            leftPost={retainedLeftPost} 
          />
        )}
        {showSuperPrimary && (
          <AdditionalTeethContainer 
            title="Supernumerary Primary Teeth" 
            rightPost={superPrimaryRightPost} 
            anterior={superPrimaryAnterior} 
            leftPost={superPrimaryLeftPost} 
          />
        )}
      </Box>

      {/* Toggle buttons for additional teeth */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          sx={{ flex: 1, minWidth: '130px', bgcolor: '#002868', color: 'white', textTransform: 'none', borderRadius: '24px', fontSize: '11px', py: 1, '&:hover': { bgcolor: '#001a45' }, lineHeight: 1.2 }}
          onClick={() => setShowSuperAdult(!showSuperAdult)}
        >
          Supernumerary Adult<br />Teeth
        </Button>
        <Button 
          variant="contained" 
          sx={{ flex: 1, minWidth: '130px', bgcolor: '#002868', color: 'white', textTransform: 'none', borderRadius: '24px', fontSize: '11px', py: 1, '&:hover': { bgcolor: '#001a45' }, lineHeight: 1.2 }}
          onClick={() => setShowRetainedPrimary(!showRetainedPrimary)}
        >
          Retained Primary<br />Teeth
        </Button>
        <Button 
          variant="contained" 
          sx={{ flex: 1, minWidth: '130px', bgcolor: '#002868', color: 'white', textTransform: 'none', borderRadius: '24px', fontSize: '11px', py: 1, '&:hover': { bgcolor: '#001a45' }, lineHeight: 1.2 }}
          onClick={() => setShowSuperPrimary(!showSuperPrimary)}
        >
          Supernumerary Primary<br />Teeth
        </Button>
      </Box>
    </Box>
  );

  const typeOptions = ['All Types', 'Procedure', 'Condition'];
  const toothStateOptions = ['All Tooth States', 'Primary', 'Permanent', 'Missing'];
  const columnOptions = [
    { id: 'icd', label: 'ICD' },
    { id: 'provider', label: 'Provider' },
    { id: 'created', label: 'Created' },
    { id: 'completed', label: 'Completed' },
    { id: 'lab', label: 'Lab Cases' },
    { id: 'comments', label: 'Comments' }
  ];

  const handleToggleColumn = (id) => {
    setVisibleColumns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFilterButton = (label, isSelected, onClick) => (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        textTransform: 'none',
        borderRadius: radius.md,
        borderColor: isSelected ? COLORS.ACCENT : COLORS.BORDER,
        color: isSelected ? '#fff' : COLORS.TEXT_PRIMARY,
        bgcolor: isSelected ? COLORS.ACCENT : 'transparent',
        py: 0.5,
        px: 2,
        '&:hover': {
          borderColor: isSelected ? COLORS.ACCENT : COLORS.BORDER,
          bgcolor: isSelected ? COLORS.ACCENT : COLORS.SURFACE_INPUT,
        }
      }}
    >
      {label}
    </Button>
  );

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600 }, maxWidth: '100%', display: 'flex', flexDirection: 'column', bgcolor: COLORS.SURFACE_PAGE }
      }}
    >
      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>Adjust Chart</Typography>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: fontSize.base }}>Filter and customize chart view</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close Adjust Chart"><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ px: 2.5, borderBottom: `1px solid ${COLORS.BORDER}` }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ minHeight: 48, '& .MuiTab-root': { color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.semibold, '&.Mui-selected': { color: COLORS.ACCENT } }, '& .MuiTabs-indicator': { backgroundColor: COLORS.ACCENT } }}>
          <Tab label="Filters" sx={{ textTransform: 'none', minHeight: 48 }} />
          <Tab label="Columns" sx={{ textTransform: 'none', minHeight: 48 }} />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={sectionSx}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>Site</Typography>
              </Box>
              {renderToothGrid()}
            </Box>

            <Box sx={sectionSx}>
              <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 1.5 }}>Type</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {typeOptions.map(opt => renderFilterButton(opt, selectedType === opt, () => setSelectedType(opt)))}
              </Box>
            </Box>

            <Box sx={sectionSx}>
              <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 1.5 }}>Tooth State</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {toothStateOptions.map(opt => renderFilterButton(opt, selectedToothState === opt, () => setSelectedToothState(opt)))}
              </Box>
            </Box>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box sx={sectionSx}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {columnOptions.map(col => (
                <Box key={col.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>{col.label}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Switch 
                      size="small"
                      checked={visibleColumns[col.id]} 
                      onChange={() => handleToggleColumn(col.id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.ACCENT },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.ACCENT }
                      }}
                    />
                    <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: fontSize.sm }}>Visible</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_FOOTER, display: 'flex', justifyContent: 'flex-end', gap: 1.25 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: radius.md, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleApply} sx={{ bgcolor: COLORS.ACCENT, borderRadius: radius.md, textTransform: 'none' }}>
          Apply
        </Button>
      </Box>
    </Drawer>
  );
};

export default ChartFiltersDrawer;
