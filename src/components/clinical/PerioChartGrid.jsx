import { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Select, MenuItem, Button 
} from '@mui/material';
import TeethImageRow from './periodontal/TeethImageRow';
import PerioGraphOverlay from './periodontal/PerioGraphOverlay';

const LABEL_WIDTH = 96;
const ROW_HEIGHT = 32;

const SmallSelect = ({ value = 'none', onChange }) => (
  <Select
    size="small"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{
      height: 22,
      fontSize: '11px',
      width: '100%',
      color: '#64748B',
      bgcolor: '#F8FAFC',
      '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #E2E8F0' },
      borderRadius: '4px',
      '& .MuiSelect-select': { py: 0, px: 1, display: 'flex', alignItems: 'center' }
    }}
  >
    <MenuItem value="none" sx={{ fontSize: '11px' }}>none</MenuItem>
    <MenuItem value="1" sx={{ fontSize: '11px' }}>1</MenuItem>
    <MenuItem value="2" sx={{ fontSize: '11px' }}>2</MenuItem>
    <MenuItem value="3" sx={{ fontSize: '11px' }}>3</MenuItem>
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
        flex: 1,
        minWidth: 0,
        height: 22, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        color: color || '#334155',
        bgcolor: bgcolor || '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        mx: '1.5px',
        cursor: 'text',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
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
          style={{ 
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100%', 
            height: '100%', 
            border: 'none', 
            textAlign: 'center', 
            fontSize: '12px', 
            fontWeight: 600, 
            outline: 'none', 
            background: 'transparent',
            padding: 0,
            margin: 0,
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        />
      ) : value}
    </Box>
  );
};

const SiteMeasurement = ({ values = ['', '', ''], type, editingCell, onEditStart, onEditSave, tooth, side, isLast }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: ROW_HEIGHT, borderBottom: isLast ? 'none' : '1px solid #E2E8F0' }}>
    {values.map((v, i) => {
      let color = '#334155';
      let bgcolor = '#fff';
      
      if (type === 'probe') {
        const val = parseInt(v);
        if (val >= 4 && val < 5) color = '#d97706'; // Orange text for 4
        if (val >= 5) {
          color = '#ef4444'; // Red text for >=5
          bgcolor = '#fef2f2';
        }
      }
      
      if (type === 'attachment' && v) {
        color = '#2563eb';
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

const PCSCell = ({ active = [], onToggle, isLast }) => {
  const configs = {
    'P': { color: '#d97706', bg: '#fef3c7' },
    'C': { color: '#2563eb', bg: '#dbeafe' },
    'S': { color: '#64748b', bg: '#f1f5f9' }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: ROW_HEIGHT, borderBottom: isLast ? 'none' : '1px solid #E2E8F0' }}>
      {['P', 'C', 'S'].map(label => {
        const isActive = active.includes(label);
        return (
          <Box 
            key={label} 
            onDoubleClick={() => onToggle(label)}
            sx={{ 
              flex: 1, 
              minWidth: 0,
              height: 22, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '11px',
              color: isActive ? configs[label].color : '#94A3B8',
              bgcolor: isActive ? configs[label].bg : '#fff',
              border: isActive ? `1px solid ${configs[label].bg}` : '1px solid #E2E8F0',
              borderRadius: '4px',
              mx: '1.5px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              opacity: isActive ? 1 : 0.6,
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
          >
            {label}
          </Box>
        );
      })}
    </Box>
  );
};

const BleedingCell = ({ active = [], onToggle, isLast }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: ROW_HEIGHT, borderBottom: isLast ? 'none' : '1px solid #E2E8F0' }}>
    {[0, 1, 2].map(i => (
      <Box 
        key={i} 
        onDoubleClick={() => onToggle(i)}
        sx={{ 
          flex: 1, 
          minWidth: 0,
          height: 22, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          mx: '1.5px',
          cursor: 'pointer',
          bgcolor: '#fff',
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ 
          width: 10, 
          height: 10, 
          bgcolor: active.includes(i) ? '#ef4444' : 'transparent',
          borderRadius: '2px',
          transition: 'background-color 0.2s'
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
  side,
  hideMobility = false,
  isLastColumn = false
}) => {
  return (
    <Box 
      component="fieldset"
      disabled={isMissing}
      sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1,
      minWidth: 0,
      m: 0,
      p: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      bgcolor: isMissing ? '#f8fafc' : 'transparent',
      opacity: isMissing ? 0.4 : 1,
      pointerEvents: isMissing ? 'none' : 'auto',
      borderRight: isLastColumn ? 'none' : '1px solid #E2E8F0'
    }}>
      {!isBottom ? (
        <>
          {!hideMobility && (
            <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: '1px solid #E2E8F0' }}>
              <SmallSelect value={data?.mobility} onChange={(val) => onSelectChange(number, side, 'mobility', val)} />
            </Box>
          )}
          <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: '1px solid #E2E8F0' }}>
            <SmallSelect value={data?.furcation} onChange={(val) => onSelectChange(number, side, 'furcation', val)} />
          </Box>
          <BleedingCell active={data?.bleeding} onToggle={(val) => onToggleArrayItem(number, side, 'bleeding', val)} />
          <PCSCell active={data?.pcs} onToggle={(val) => onToggleArrayItem(number, side, 'pcs', val)} />
          <SiteMeasurement values={data?.attachment || ['', '', '']} type="attachment" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <SiteMeasurement values={data?.recession || ['', '', '']} type="recession" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <SiteMeasurement values={data?.probe || ['', '', '']} type="probe" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} isLast={true} />
        </>
      ) : (
        <>
          <SiteMeasurement values={data?.probe || ['', '', '']} type="probe" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <SiteMeasurement values={data?.recession || ['', '', '']} type="recession" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <SiteMeasurement values={data?.attachment || ['', '', '']} type="attachment" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          <PCSCell active={data?.pcs} onToggle={(val) => onToggleArrayItem(number, side, 'pcs', val)} />
          <BleedingCell active={data?.bleeding} onToggle={(val) => onToggleArrayItem(number, side, 'bleeding', val)} />
          <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: hideMobility ? 'none' : '1px solid #E2E8F0' }}>
            <SmallSelect value={data?.furcation} onChange={(val) => onSelectChange(number, side, 'furcation', val)} />
          </Box>
          {!hideMobility && (
            <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px' }}>
              <SmallSelect value={data?.mobility} onChange={(val) => onSelectChange(number, side, 'mobility', val)} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const RowLabels = ({ labels, isBottom = false, hasMobility = true }) => (
  <Box sx={{ width: LABEL_WIDTH, borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
    {labels.map((l, idx) => (
      <Typography key={`${l}-${idx}`} sx={{ 
        height: ROW_HEIGHT, 
        fontSize: '10px',
        lineHeight: 1.1,
        display: 'flex', 
        alignItems: 'center', 
        px: 1,
        fontWeight: 700,
        color: '#64748B',
        borderBottom: idx < labels.length - 1 ? '1px solid #E2E8F0' : 'none'
      }}>
        {l}
      </Typography>
    ))}
  </Box>
);

const PerioChartGrid = ({ chartData = {}, setChartData, missingTeeth = [] }) => {
  const [editingCell, setEditingCell] = useState(null);

  const topLabelsUpper = ['MOBILITY', 'FURCATION', 'BLEEDING', 'PLQ / CALC / SUP', 'ATTACHMENT LOSS', 'RECESSION (FGM/CEJ)', 'PROBE'];
  const bottomLabelsUpper = ['PROBE', 'RECESSION (FGM/CEJ)', 'ATTACHMENT LOSS', 'PLQ / CALC / SUP', 'BLEEDING', 'FURCATION'];
  
  const topLabelsLower = ['MOBILITY', 'FURCATION', 'BLEEDING', 'PLQ / CALC / SUP', 'ATTACHMENT LOSS', 'RECESSION (FGM/CEJ)', 'PROBE'];
  const bottomLabelsLower = ['PROBE', 'RECESSION (FGM/CEJ)', 'ATTACHMENT LOSS', 'PLQ / CALC / SUP', 'BLEEDING', 'FURCATION'];

  const chartDataRef = useRef(chartData);
  useEffect(() => {
    chartDataRef.current = chartData;
  }, [chartData]);

  const internalSetChartData = (updater) => {
    const newVal = typeof updater === 'function' ? updater(chartDataRef.current) : updater;
    chartDataRef.current = newVal;
    setChartData(newVal);
  };

  const handleEditStart = (tooth, side, type, index) => {
    setEditingCell({ tooth, side, type, index });
  };

  const handleEditSave = (tooth, side, type, index, newValue) => {
    internalSetChartData(prev => {
      const updated = { ...prev };
      updated[tooth] = { ...(prev[tooth] || { facial: {}, lingual: {} }) };
      updated[tooth][side] = { ...(updated[tooth][side] || {}) };
      
      const arr = [...(updated[tooth][side][type] || ['', '', ''])];
      arr[index] = newValue;
      updated[tooth][side][type] = arr;
      
      if (type === 'probe' || type === 'recession') {
        const probeArr = type === 'probe' ? arr : (updated[tooth][side].probe || ['', '', '']);
        const recArr = type === 'recession' ? arr : (updated[tooth][side].recession || ['', '', '']);
        
        updated[tooth][side].attachment = probeArr.map((pVal, idx) => {
          const rVal = recArr[idx] || '0';
          if (!pVal) return '';
          return String(parseInt(pVal) + parseInt(rVal));
        });
      }
      
      return updated;
    });
    setEditingCell(null);
  };

  const handleToggleArrayItem = (tooth, side, type, val) => {
    internalSetChartData(prev => {
      const updated = { ...prev };
      updated[tooth] = { ...(prev[tooth] || { facial: {}, lingual: {} }) };
      updated[tooth][side] = { ...(updated[tooth][side] || {}) };
      
      const current = updated[tooth][side][type] || [];
      const newArr = current.includes(val) 
        ? current.filter(item => item !== val)
        : [...current, val];
        
      updated[tooth][side][type] = newArr;
      return updated;
    });
  };

  const handleSelectChange = (tooth, side, type, val) => {
    internalSetChartData(prev => {
      const updated = { ...prev };
      updated[tooth] = { ...(prev[tooth] || { facial: {}, lingual: {} }) };
      updated[tooth][side] = { ...(updated[tooth][side] || {}) };
      
      updated[tooth][side][type] = val;
      return updated;
    });
  };

  const renderQuadrant = (teeth, side = 'facial', isBottom = false, hideMobility = false) => (
    <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
      {teeth.map((n, idx) => (
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
          hideMobility={hideMobility}
          isLastColumn={idx === teeth.length - 1}
        />
      ))}
    </Box>
  );

  const ToothNumbersRow = ({ teeth }) => (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flex: 1, minWidth: 0, bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <Box sx={{ width: LABEL_WIDTH, flexShrink: 0, borderRight: '1px solid #E2E8F0' }}>
          <Typography sx={{ height: 32, fontSize: '10px', display: 'flex', alignItems: 'center', px: 1, fontWeight: 700, color: '#64748B' }}>
            Teeth
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
          {teeth.map(num => (
            <Box key={num} sx={{ flex: 1, minWidth: 0, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#0F172A', borderRight: '1px solid #E2E8F0' }}>
              {num}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderArchSection = (title, teethStr, teethArray, topLabels, bottomLabels, isUpper) => (
    <Box sx={{ mb: 4, display: 'flex' }}>
      {/* Main Grid Container */}
      <Box sx={{ flex: 1, minWidth: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', bgcolor: '#fff' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5, borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>{title}</Typography>
          <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8' }}>{teethStr}</Typography>
        </Box>
        <Box sx={{ overflow: 'hidden', pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '100%' }}>

          {/* Upper Teeth Row (Above Top Data Section) */}
          {isUpper && (
            <Box sx={{ mt: 2, mb: 1, display: 'flex' }}>
              <Box sx={{ width: LABEL_WIDTH, flexShrink: 0, borderRight: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '10px', px: 1, fontWeight: 700, color: '#64748B' }}>
                  Teeth
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flex: 1, minWidth: 0, position: 'relative' }}>
                <TeethImageRow teeth={teethArray} missingTeeth={missingTeeth} />
                <PerioGraphOverlay teeth={teethArray} chartData={chartDataRef.current} missingTeeth={missingTeeth} isUpper={true} side="facial" />
              </Box>
            </Box>
          )}

          {/* Top FACIAL/LINGUAL section */}
          <Box sx={{ display: 'flex' }}>
            <RowLabels labels={topLabels} />
            <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
              {renderQuadrant(teethArray, isUpper ? 'facial' : 'lingual', false, false)}
            </Box>
          </Box>
          
          {/* Numbers Row */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
             <ToothNumbersRow teeth={teethArray} />
          </Box>

          {/* Bottom LINGUAL/FACIAL section */}
          <Box sx={{ display: 'flex' }}>
            <RowLabels labels={bottomLabels} isBottom />
            <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
              {renderQuadrant(teethArray, isUpper ? 'lingual' : 'facial', true, true)}
            </Box>
          </Box>

          {/* Lower Teeth Row (Below Bottom Data Section) */}
          {!isUpper && (
            <Box sx={{ mt: 1, mb: 2, display: 'flex' }}>
              <Box sx={{ width: LABEL_WIDTH, flexShrink: 0, borderRight: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '10px', px: 1, fontWeight: 700, color: '#64748B' }}>
                  Teeth
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flex: 1, minWidth: 0, position: 'relative' }}>
                <TeethImageRow teeth={teethArray} missingTeeth={missingTeeth} />
                <PerioGraphOverlay teeth={teethArray} chartData={chartDataRef.current} missingTeeth={missingTeeth} isUpper={false} side="facial" />
              </Box>
            </Box>
          )}

          </Box>
        </Box>
      </Box>

      {/* Right side labels outside the container */}
      <Box sx={{ width: 60, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header Spacer (approx 44px) */}
        <Box sx={{ height: 44 }} />
        
        {/* Upper Teeth Row Spacer */}
        {isUpper && <Box sx={{ height: 80, mt: 2, mb: 1 }} />}

        {/* Top Labels */}
        <Box sx={{ display: 'flex', alignItems: 'center', height: topLabels.length * ROW_HEIGHT, pl: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#94A3B8' }}>{isUpper ? 'FACIAL' : 'LINGUAL'}</Typography>
        </Box>

        {/* Numbers Row Spacer */}
        <Box sx={{ height: 32 }} />

        {/* Bottom Labels */}
        <Box sx={{ display: 'flex', alignItems: 'center', height: bottomLabels.length * ROW_HEIGHT, pl: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#94A3B8' }}>{isUpper ? 'LINGUAL' : 'FACIAL'}</Typography>
        </Box>

        {/* Lower Teeth Row Spacer */}
        {!isUpper && <Box sx={{ height: 80, mt: 1, mb: 2 }} />}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ mt: 3, bgcolor: 'transparent', overflow: 'hidden', zoom: { xs: 0.45, sm: 0.55, md: 0.65, lg: 0.75, xl: 0.9 } }}>
      {renderArchSection(
        'UPPER ARCH • MAXILLA', 
        'Teeth 1-16', 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        topLabelsUpper,
        bottomLabelsUpper,
        true
      )}

      {renderArchSection(
        'LOWER ARCH • MANDIBLE', 
        'Teeth 32-17', 
        [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17],
        topLabelsLower,
        bottomLabelsLower,
        false
      )}
    </Box>
  );
};

export default PerioChartGrid;
