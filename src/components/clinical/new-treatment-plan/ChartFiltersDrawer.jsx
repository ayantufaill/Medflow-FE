import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Tabs, 
  Tab, 
  Button,
  Divider,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

  const topTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const bottomTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];
  
  const primaryLabels = { 4:'A', 5:'B', 6:'C', 7:'D', 8:'E', 9:'F', 10:'G', 11:'H', 12:'I', 13:'J', 20:'K', 21:'L', 22:'M', 23:'N', 24:'O', 25:'P', 26:'Q', 27:'R', 28:'S', 29:'T' };

  const getRegionTeeth = (region) => {
    switch(region) {
      case 'UR': return [1, 2, 3, 4, 5, 6, 7, 8];
      case 'UL': return [9, 10, 11, 12, 13, 14, 15, 16];
      case 'LR': return [25, 26, 27, 28, 29, 30, 31, 32];
      case 'LL': return [17, 18, 19, 20, 21, 22, 23, 24];
      case 'U': return topTeeth;
      case 'L': return bottomTeeth;
      default: return [];
    }
  };

  const handleToothClick = (toothNum) => {
    if (selectedTeeth.includes(toothNum)) {
      setSelectedTeeth(selectedTeeth.filter(t => t !== toothNum));
    } else {
      setSelectedTeeth([...selectedTeeth, toothNum]);
    }
  };

  const handleRegionClick = (region) => {
    if (region === 'Supernumerary') {
      if (selectedTeeth.includes('Supernumerary')) {
        setSelectedTeeth(selectedTeeth.filter(t => t !== 'Supernumerary'));
      } else {
        setSelectedTeeth([...selectedTeeth, 'Supernumerary']);
      }
      return;
    }
    
    const regionTeeth = getRegionTeeth(region);
    const allSelected = regionTeeth.every(t => selectedTeeth.includes(t));
    if (allSelected) {
      setSelectedTeeth(selectedTeeth.filter(t => !regionTeeth.includes(t)));
    } else {
      const newTeeth = new Set([...selectedTeeth, ...regionTeeth]);
      setSelectedTeeth(Array.from(newTeeth));
    }
  };

  const typeOptions = ['All Types', 'Procedure', 'Condition', 'Tooth State'];
  const toothStateOptions = ['All Tooth States', 'Primary Unerupted', 'Primary', 'Permanent Unerupted', 'Permanent', 'Missing'];
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

  const renderRegionButton = (region) => {
    let isSelected = false;
    if (region === 'Supernumerary') {
      isSelected = selectedTeeth.includes('Supernumerary');
    } else {
      const regionTeeth = getRegionTeeth(region);
      isSelected = regionTeeth.length > 0 && regionTeeth.every(t => selectedTeeth.includes(t));
    }
    return (
      <Button 
        variant="outlined" 
        onClick={() => handleRegionClick(region)}
        sx={{ 
          flex: 1, textTransform: 'none', 
          color: isSelected ? '#fff' : '#475569', 
          bgcolor: isSelected ? '#2262ef' : 'transparent',
          borderColor: isSelected ? '#2262ef' : '#e2e8f0', 
          py: 0.5, minWidth: 0,
          '&:hover': {
            bgcolor: isSelected ? '#1a50c7' : '#f8fafc',
          }
        }}
      >
        {region}
      </Button>
    );
  };

  const renderToothGrid = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
      {/* UR, U, UL */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {renderRegionButton('UR')}
        {renderRegionButton('U')}
        {renderRegionButton('UL')}
      </Box>
      {/* Top letters row */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {topTeeth.map((toothNum, idx) => {
          const label = primaryLabels[toothNum] || '*';
          const isSelected = selectedTeeth.includes(toothNum);
          return (
            <Button 
              key={`top-${idx}`} 
              variant="outlined" 
              onClick={() => handleToothClick(toothNum)}
              sx={{ 
                flex: 1, minWidth: 0, padding: 0, height: 32, 
                color: label === '*' ? '#94a3b8' : (isSelected ? '#fff' : '#475569'), 
                bgcolor: isSelected ? '#2262ef' : 'transparent',
                borderColor: isSelected ? '#2262ef' : '#e2e8f0',
                '&:hover': {
                  bgcolor: isSelected ? '#1a50c7' : '#f8fafc',
                }
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
      {/* Bottom letters row */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {bottomTeeth.map((toothNum, idx) => {
          const label = primaryLabels[toothNum] || '*';
          const isSelected = selectedTeeth.includes(toothNum);
          return (
            <Button 
              key={`bottom-${idx}`} 
              variant="outlined" 
              onClick={() => handleToothClick(toothNum)}
              sx={{ 
                flex: 1, minWidth: 0, padding: 0, height: 32, 
                color: label === '*' ? '#94a3b8' : (isSelected ? '#fff' : '#475569'), 
                bgcolor: isSelected ? '#2262ef' : 'transparent',
                borderColor: isSelected ? '#2262ef' : '#e2e8f0',
                '&:hover': {
                  bgcolor: isSelected ? '#1a50c7' : '#f8fafc',
                }
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
      {/* LR, L, LL */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {renderRegionButton('LR')}
        {renderRegionButton('L')}
        {renderRegionButton('LL')}
      </Box>
    </Box>
  );

  const renderFilterButton = (label, isSelected, onClick) => (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        textTransform: 'none',
        borderRadius: '4px',
        borderColor: isSelected ? '#2262ef' : '#e2e8f0',
        color: isSelected ? '#2262ef' : '#475569',
        bgcolor: isSelected ? '#eaf1ff' : 'transparent',
        py: 0.5,
        px: 2,
        '&:hover': {
          borderColor: isSelected ? '#2262ef' : '#cbd5e1',
          bgcolor: isSelected ? '#eaf1ff' : '#f8fafc',
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
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { width: 500, display: 'flex', flexDirection: 'column' }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>Adjust chart</Typography>
        <IconButton onClick={onClose} sx={{ border: '1px solid #e2e8f0', borderRadius: 1, color: '#2262ef' }} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ minHeight: 40 }}>
          <Tab label="Filters" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40, py: 0 }} />
          <Tab label="Columns" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40, py: 0 }} />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Site Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>Site</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleRegionClick('Supernumerary')}
                  sx={{ 
                    textTransform: 'none', 
                    color: selectedTeeth.includes('Supernumerary') ? '#fff' : '#475569', 
                    bgcolor: selectedTeeth.includes('Supernumerary') ? '#2262ef' : 'transparent',
                    borderColor: selectedTeeth.includes('Supernumerary') ? '#2262ef' : '#e2e8f0', 
                    py: 0.25,
                    '&:hover': {
                      bgcolor: selectedTeeth.includes('Supernumerary') ? '#1a50c7' : '#f8fafc',
                    }
                  }}
                >
                  Supernumerary
                </Button>
              </Box>
              {renderToothGrid()}
            </Box>

            {/* Type Section */}
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Type</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {typeOptions.map(opt => renderFilterButton(opt, selectedType === opt, () => setSelectedType(opt)))}
              </Box>
            </Box>

            {/* Tooth State Section */}
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Tooth State</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {toothStateOptions.map(opt => renderFilterButton(opt, selectedToothState === opt, () => setSelectedToothState(opt)))}
              </Box>
            </Box>

            {/* Condition Status Section */}
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Condition Status</Typography>
              {/* Additional content could go here based on requirements */}
            </Box>

          </Box>
        )}
        
        {tabValue === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {columnOptions.map(col => (
              <Box key={col.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#1e293b' }}>{col.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                  <Switch 
                    size="small"
                    checked={visibleColumns[col.id]} 
                    onChange={() => handleToggleColumn(col.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#2262ef' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2262ef' }
                    }}
                  />
                  <Typography sx={{ color: '#475569', fontSize: '0.875rem' }}>Visible</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: '#fff' }}>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#2262ef', fontWeight: 600, px: 4, py: 1 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleApply} sx={{ textTransform: 'none', bgcolor: '#2262ef', boxShadow: 'none', fontWeight: 600, px: 4, py: 1, '&:hover': { bgcolor: '#1a50c7' } }}>
          Apply
        </Button>
      </Box>

    </Drawer>
  );
};

export default ChartFiltersDrawer;
