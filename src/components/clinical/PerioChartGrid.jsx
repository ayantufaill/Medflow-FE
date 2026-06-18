import { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Grid, Select, MenuItem, Chip, Button 
} from '@mui/material';
import { fontSize, fontWeight } from "../../constants/styles";

const CELL_WIDTH = 25;
const LABEL_WIDTH = 150;

const SmallSelect = ({ value = 'none', onChange }) => (
  <Select
    size="small"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{
      height: 20,
      fontSize: '10px',
      minWidth: 50,
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      borderBottom: '1px solid #ccc',
      borderRadius: 0,
      bgcolor: '#f5f7fa'
    }}
  >
    <MenuItem value="none" sx={{ fontSize: '10px' }}>none</MenuItem>
    <MenuItem value="1" sx={{ fontSize: '10px' }}>1</MenuItem>
    <MenuItem value="2" sx={{ fontSize: '10px' }}>2</MenuItem>
    <MenuItem value="3" sx={{ fontSize: '10px' }}>3</MenuItem>
  </Select>
);

const MeasurementCell = ({ value, color, bgcolor, isEditing, onDoubleClick, onChange, onBlur }) => {
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <Box 
      onDoubleClick={onDoubleClick}
      sx={{ 
        width: CELL_WIDTH, 
        height: 22, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '11px',
        color: color || '#333',
        bgcolor: bgcolor || 'transparent',
        border: '0.5px solid #eee',
        cursor: 'text'
      }}
    >
      {isEditing ? (
        <input 
          ref={inputRef}
          defaultValue={value}
          onBlur={(e) => onBlur(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onBlur(e.target.value);
            }
          }}
          style={{ width: '100%', height: '100%', border: 'none', textAlign: 'center', fontSize: '11px', outline: 'none', background: 'transparent' }}
        />
      ) : value}
    </Box>
  );
};

const SiteMeasurement = ({ values = ['', '', ''], type, editingCell, onEditStart, onEditSave, tooth, side }) => (
  <Box sx={{ display: 'flex' }}>
    {values.map((v, i) => {
      let color = '#333';
      let bgcolor = 'transparent';
      
      if (type === 'probe') {
        const val = parseInt(v);
        if (val >= 4 && val < 5) color = '#f39c12';
        if (val >= 5) {
          color = 'white';
          bgcolor = '#e74c3c';
        }
        if (val > 0 && val < 4) {
           bgcolor = '#e9f7ef';
           color = '#27ae60';
        }
      }
      
      if (type === 'attachment' && v) {
        color = '#27ae60';
        bgcolor = '#e9f7ef';
      }

      const isEditing = editingCell?.tooth === tooth && editingCell?.side === side && editingCell?.type === type && editingCell?.index === i;

      return (
        <MeasurementCell 
          key={i} 
          value={v} 
          color={color} 
          bgcolor={bgcolor} 
          isEditing={isEditing}
          onDoubleClick={() => onEditStart(tooth, side, type, i)}
          onBlur={(newValue) => onEditSave(tooth, side, type, i, newValue)}
        />
      );
    })}
  </Box>
);

const PCSCell = ({ active = [], onToggle }) => (
  <Box sx={{ display: 'flex' }}>
    {['P', 'C', 'S'].map(label => (
      <Box 
        key={label} 
        onDoubleClick={() => onToggle(label)}
        sx={{ 
          width: CELL_WIDTH, 
          height: 22, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '10px',
          color: active.includes(label) ? '#fff' : '#ccc',
          bgcolor: active.includes(label) ? '#f39c12' : 'transparent',
          border: '0.5px solid #eee',
          fontWeight: active.includes(label) ? 'bold' : 'normal',
          cursor: 'pointer'
        }}
      >
        {label}
      </Box>
    ))}
  </Box>
);

const BleedingCell = ({ active = [], onToggle }) => (
  <Box sx={{ display: 'flex' }}>
    {[0, 1, 2].map(i => (
      <Box 
        key={i} 
        onDoubleClick={() => onToggle(i)}
        sx={{ 
          width: CELL_WIDTH, 
          height: 22, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '0.5px solid #eee',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ 
          width: 12, 
          height: 12, 
          bgcolor: active.includes(i) ? '#e74c3c' : 'transparent',
          border: '1px solid #ddd',
          borderRadius: '2px'
        }} />
      </Box>
    ))}
  </Box>
);

const ToothColumn = ({ 
  number, 
  data, 
  isBottom = false, 
  isMissing = false,
  editingCell,
  onEditStart,
  onEditSave,
  onToggleArrayItem,
  onSelectChange,
  side
}) => {
  const commonRows = (
    <>
      <BleedingCell active={data?.bleeding} onToggle={(val) => onToggleArrayItem(number, side, 'bleeding', val)} />
      <PCSCell active={data?.pcs} onToggle={(val) => onToggleArrayItem(number, side, 'pcs', val)} />
      <SiteMeasurement values={data?.attachment || ['', '', '']} type="attachment" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
      <SiteMeasurement values={data?.recession || ['', '', '']} type="recession" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
      <SiteMeasurement values={data?.probe || ['', '', '']} type="probe" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
    </>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      borderRight: '1px solid #eee',
      bgcolor: isMissing ? '#f5f5f5' : 'white',
      opacity: isMissing ? 0.6 : 1
    }}>
      {!isBottom ? (
        <>
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.mobility} onChange={(val) => onSelectChange(number, side, 'mobility', val)} /></Box>
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.furcation} onChange={(val) => onSelectChange(number, side, 'furcation', val)} /></Box>
          {commonRows}
          <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderTop: '1px solid #ddd' }}>
            {number}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
            {number}
          </Box>
          <SiteMeasurement values={data?.probe || ['', '', '']} type="probe" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <SiteMeasurement values={data?.recession || ['', '', '']} type="recession" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <SiteMeasurement values={data?.attachment || ['', '', '']} type="attachment" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <PCSCell active={data?.pcs} onToggle={(val) => onToggleArrayItem(number, side, 'pcs', val)} />
          <BleedingCell active={data?.bleeding} onToggle={(val) => onToggleArrayItem(number, side, 'bleeding', val)} />
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.furcation} onChange={(val) => onSelectChange(number, side, 'furcation', val)} /></Box>
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.mobility} onChange={(val) => onSelectChange(number, side, 'mobility', val)} /></Box>
        </>
      )}
    </Box>
  );
};

const RowLabels = ({ labels, isBottom = false }) => (
  <Box sx={{ width: LABEL_WIDTH, borderRight: '1px solid #ddd' }}>
    <Box sx={{ height: isBottom ? 25 : 55 }} /> {/* Spacer for tooth number / mobility */}
    {labels.map(l => (
      <Typography key={l} sx={{ 
        height: 22, 
        fontSize: '11px', 
        display: 'flex', 
        alignItems: 'center', 
        px: 1,
        color: '#555'
      }}>
        {l}
      </Typography>
    ))}
  </Box>
);

const PerioChartGrid = ({ chartData = {}, setChartData, missingTeeth = [] }) => {
  const [editingCell, setEditingCell] = useState(null);

  const topLabels = ['Mobility', 'Furcation', 'Bleeding', 'Plq/calc/sup', 'Attachment Loss', 'Recession (FGM/CEJ)', 'Probe'];
  const bottomLabels = ['Probe', 'Recession (FGM/CEJ)', 'Attachment Loss', 'Plq/calc/sup', 'Bleeding', 'Furcation', 'Mobility'];

  const handleEditStart = (tooth, side, type, index) => {
    setEditingCell({ tooth, side, type, index });
  };

  const handleEditSave = (tooth, side, type, index, newValue) => {
    setChartData(prev => {
      const updated = { ...prev };
      if (!updated[tooth]) updated[tooth] = { facial: {}, lingual: {} };
      if (!updated[tooth][side]) updated[tooth][side] = {};
      
      const arr = [...(updated[tooth][side][type] || ['', '', ''])];
      arr[index] = newValue;
      updated[tooth][side][type] = arr;
      
      return updated;
    });
    setEditingCell(null);
  };

  const handleToggleArrayItem = (tooth, side, type, val) => {
    setChartData(prev => {
      const updated = { ...prev };
      if (!updated[tooth]) updated[tooth] = { facial: {}, lingual: {} };
      if (!updated[tooth][side]) updated[tooth][side] = {};
      
      const current = updated[tooth][side][type] || [];
      const newArr = current.includes(val) 
        ? current.filter(item => item !== val)
        : [...current, val];
        
      updated[tooth][side][type] = newArr;
      return updated;
    });
  };

  const handleSelectChange = (tooth, side, type, val) => {
    setChartData(prev => {
      const updated = { ...prev };
      if (!updated[tooth]) updated[tooth] = { facial: {}, lingual: {} };
      if (!updated[tooth][side]) updated[tooth][side] = {};
      
      updated[tooth][side][type] = val;
      return updated;
    });
  };

  const renderQuadrant = (teeth, side = 'facial', isBottom = false) => (
    <Box sx={{ display: 'flex', mb: 2, border: '1px solid #ddd' }}>
      {teeth.map(n => (
        <ToothColumn 
          key={n} 
          number={n} 
          side={side}
          data={chartData[n]?.[side]} 
          isBottom={isBottom} 
          isMissing={missingTeeth.includes(n)} 
          editingCell={editingCell}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onToggleArrayItem={handleToggleArrayItem}
          onSelectChange={handleSelectChange}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: 'white', overflowX: 'auto' }}>
      {/* Top Section (1-16) */}
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* FACIAL label */}
          <Box sx={{ display: 'flex' }}>
             <RowLabels labels={topLabels} />
             {renderQuadrant([1, 2, 3, 4, 5, 6, 7, 8], 'facial', false)}
             {renderQuadrant([9, 10, 11, 12, 13, 14, 15, 16], 'facial', false)}
             <Typography sx={{ ml: 2, mt: 1, fontWeight: 'bold', fontSize: '11px', color: '#999' }}>FACIAL</Typography>
          </Box>
          
          {/* LINGUAL label */}
          <Box sx={{ display: 'flex', mt: -2 }}>
             <RowLabels labels={bottomLabels} isBottom />
             {renderQuadrant([1, 2, 3, 4, 5, 6, 7, 8], 'lingual', true)}
             {renderQuadrant([9, 10, 11, 12, 13, 14, 15, 16], 'lingual', true)}
             <Typography sx={{ ml: 2, mt: 4, fontWeight: 'bold', fontSize: '11px', color: '#999' }}>LINGUAL</Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section (32-17) */}
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* LINGUAL label */}
          <Box sx={{ display: 'flex' }}>
             <RowLabels labels={topLabels} />
             {renderQuadrant([32, 31, 30, 29, 28, 27, 26, 25], 'lingual', false)}
             {renderQuadrant([24, 23, 22, 21, 20, 19, 18, 17], 'lingual', false)}
             <Typography sx={{ ml: 2, mt: 1, fontWeight: 'bold', fontSize: '11px', color: '#999' }}>LINGUAL</Typography>
          </Box>
          
          {/* FACIAL label */}
          <Box sx={{ display: 'flex', mt: -2 }}>
             <RowLabels labels={bottomLabels} isBottom />
             {renderQuadrant([32, 31, 30, 29, 28, 27, 26, 25], 'facial', true)}
             {renderQuadrant([24, 23, 22, 21, 20, 19, 18, 17], 'facial', true)}
             <Typography sx={{ ml: 2, mt: 4, fontWeight: 'bold', fontSize: '11px', color: '#999' }}>FACIAL</Typography>
          </Box>
        </Box>
      </Box>

      <Button 
        variant="contained" 
        sx={{ mt: 4, bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' }, textTransform: 'none' }}
      >
        Delete Exam
      </Button>
    </Box>
  );
};

export default PerioChartGrid;
