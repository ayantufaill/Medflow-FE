import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
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

const MeasurementCell = ({ value, color, bgcolor, isEditing, onDoubleClick, onChange, onBlur, isReadOnly }) => {
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <Box 
      onDoubleClick={isReadOnly ? undefined : onDoubleClick}
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
        cursor: isReadOnly ? 'default' : 'text',
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

const SiteMeasurement = ({ values = ['', '', ''], type, editingCell, onEditStart, onEditSave, tooth, side, isLast, isReadOnly }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: ROW_HEIGHT, borderBottom: isLast ? 'none' : '1px solid #E2E8F0', bgcolor: isReadOnly ? '#f1f5f9' : 'transparent' }}>
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
          bgcolor={isReadOnly ? 'transparent' : bgcolor} 
          isEditing={isEditing}
          isReadOnly={isReadOnly}
          onDoubleClick={() => onEditStart(tooth, side, type, i)}
          onBlur={(newValue) => onEditSave(tooth, side, type, i, newValue)}
        />
      );
    })}
  </Box>
);

const PCSCell = ({ active = [], onToggle, isLast, isReadOnly }) => {
  const configs = {
    'P': { color: '#d97706', bg: '#fef3c7' },
    'C': { color: '#2563eb', bg: '#dbeafe' },
    'S': { color: '#64748b', bg: '#f1f5f9' }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: ROW_HEIGHT, borderBottom: isLast ? 'none' : '1px solid #E2E8F0', bgcolor: isReadOnly ? '#f1f5f9' : 'transparent' }}>
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
              bgcolor: isActive ? (isReadOnly ? 'transparent' : configs[label].bg) : (isReadOnly ? 'transparent' : '#fff'),
              border: isActive ? `1px solid ${configs[label].color}` : '1px solid #E2E8F0',
              borderRadius: '4px',
              mx: '1.5px',
              fontWeight: isActive ? 700 : 500,
              cursor: isReadOnly ? 'default' : 'pointer',
              opacity: isActive ? 1 : (isReadOnly ? 0.3 : 0.6),
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

const BleedingCell = ({ active = [], onToggle, isLast, isReadOnly }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: ROW_HEIGHT, borderBottom: isLast ? 'none' : '1px solid #E2E8F0', bgcolor: isReadOnly ? '#f1f5f9' : 'transparent' }}>
    {[0, 1, 2].map(i => (
      <Box 
        key={i} 
        onDoubleClick={isReadOnly ? undefined : () => onToggle(i)}
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
          cursor: isReadOnly ? 'default' : 'pointer',
          bgcolor: isReadOnly ? 'transparent' : '#fff',
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
  isLastColumn = false,
  isCompareMode = false,
  compareDates = [],
  compareFields = {},
  historicalData = {},
  isSelected = false,
  onColumnClick,
  columnRef
}) => {
  // Lookup real historical data from the historicalData prop
  const getHistoricalData = (date, tooth, side, type) => {
    const dateData = historicalData[date];
    if (dateData && dateData[tooth] && dateData[tooth][side]) {
      const val = dateData[tooth][side][type];
      if (val !== undefined) return val;
    }
    // Fallback defaults
    if (type === 'bleeding') return [];
    if (type === 'pcs') return [];
    if (type === 'probe') return ['', '', ''];
    if (type === 'recession') return ['', '', ''];
    if (type === 'attachment') return ['', '', ''];
    if (type === 'mobility') return 'none';
    if (type === 'furcation') return 'none';
    return null;
  };

  return (
    <Box 
      ref={columnRef}
      component="fieldset"
      disabled={isMissing}
      onClick={() => onColumnClick && onColumnClick(number)}
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
      bgcolor: isMissing ? '#f8fafc' : (isSelected ? '#EFF6FF' : 'transparent'),
      opacity: isMissing ? 0.4 : 1,
      pointerEvents: isMissing ? 'none' : 'auto',
      borderRight: isLastColumn ? 'none' : '1px solid #E2E8F0',
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      outlineOffset: '-1px',
      transition: 'background-color 0.2s, outline 0.2s',
      cursor: 'pointer'
    }}>
      {!isBottom ? (
        <>
          {!hideMobility && (
            <>
              <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: '1px solid #E2E8F0' }}>
                <SmallSelect value={data?.mobility} onChange={(val) => onSelectChange(number, side, 'mobility', val)} />
              </Box>
              {isCompareMode && compareFields?.mobility && compareDates.map(date => (
                <Box key={`mob-${date}`} sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: '1px solid #E2E8F0', bgcolor: '#f1f5f9' }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{getHistoricalData(date, number, side, 'mobility')}</Typography>
                </Box>
              ))}
            </>
          )}
          
          <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: '1px solid #E2E8F0' }}>
            <SmallSelect value={data?.furcation} onChange={(val) => onSelectChange(number, side, 'furcation', val)} />
          </Box>
          {isCompareMode && compareFields?.furcation && compareDates.map(date => (
            <Box key={`furc-${date}`} sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: '1px solid #E2E8F0', bgcolor: '#f1f5f9' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{getHistoricalData(date, number, side, 'furcation')}</Typography>
            </Box>
          ))}

          <BleedingCell active={data?.bleeding} onToggle={(val) => onToggleArrayItem(number, side, 'bleeding', val)} />
          {isCompareMode && compareFields?.bleeding && compareDates.map(date => (
            <BleedingCell key={`bld-${date}`} active={getHistoricalData(date, number, side, 'bleeding')} isReadOnly />
          ))}

          <PCSCell active={data?.pcs} onToggle={(val) => onToggleArrayItem(number, side, 'pcs', val)} />
          {isCompareMode && compareFields?.pcs && compareDates.map(date => (
            <PCSCell key={`pcs-${date}`} active={getHistoricalData(date, number, side, 'pcs')} isReadOnly />
          ))}

          <SiteMeasurement values={data?.attachment || ['', '', '']} type="attachment" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          {isCompareMode && compareFields?.attachmentLoss && compareDates.map(date => (
            <SiteMeasurement key={`att-${date}`} values={getHistoricalData(date, number, side, 'attachment')} type="attachment" tooth={number} side={side} isReadOnly />
          ))}

          <SiteMeasurement values={data?.recession || ['', '', '']} type="recession" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          {isCompareMode && compareFields?.recession && compareDates.map(date => (
            <SiteMeasurement key={`rec-${date}`} values={getHistoricalData(date, number, side, 'recession')} type="recession" tooth={number} side={side} isReadOnly />
          ))}

          <SiteMeasurement values={data?.probe || ['', '', '']} type="probe" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} isLast={!isCompareMode || !compareFields?.probe || compareDates.length === 0} />
          {isCompareMode && compareFields?.probe && compareDates.map((date, idx) => (
            <SiteMeasurement key={`prb-${date}`} values={getHistoricalData(date, number, side, 'probe')} type="probe" tooth={number} side={side} isReadOnly isLast={idx === compareDates.length - 1} />
          ))}
        </>
      ) : (
        <>
          <SiteMeasurement values={data?.probe || ['', '', '']} type="probe" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          {isCompareMode && compareFields?.probe && compareDates.map(date => (
            <SiteMeasurement key={`prb-${date}`} values={getHistoricalData(date, number, side, 'probe')} type="probe" tooth={number} side={side} isReadOnly />
          ))}

          <SiteMeasurement values={data?.recession || ['', '', '']} type="recession" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          {isCompareMode && compareFields?.recession && compareDates.map(date => (
            <SiteMeasurement key={`rec-${date}`} values={getHistoricalData(date, number, side, 'recession')} type="recession" tooth={number} side={side} isReadOnly />
          ))}

          <SiteMeasurement values={data?.attachment || ['', '', '']} type="attachment" editingCell={editingCell} onEditStart={onEditStart} onEditSave={onEditSave} tooth={number} side={side} />
          {isCompareMode && compareFields?.attachmentLoss && compareDates.map(date => (
            <SiteMeasurement key={`att-${date}`} values={getHistoricalData(date, number, side, 'attachment')} type="attachment" tooth={number} side={side} isReadOnly />
          ))}

          <PCSCell active={data?.pcs} onToggle={(val) => onToggleArrayItem(number, side, 'pcs', val)} />
          {isCompareMode && compareFields?.pcs && compareDates.map(date => (
            <PCSCell key={`pcs-${date}`} active={getHistoricalData(date, number, side, 'pcs')} isReadOnly />
          ))}

          <BleedingCell active={data?.bleeding} onToggle={(val) => onToggleArrayItem(number, side, 'bleeding', val)} />
          {isCompareMode && compareFields?.bleeding && compareDates.map(date => (
            <BleedingCell key={`bld-${date}`} active={getHistoricalData(date, number, side, 'bleeding')} isReadOnly />
          ))}

          <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: (hideMobility && (!isCompareMode || !compareFields?.furcation || compareDates.length === 0)) ? 'none' : '1px solid #E2E8F0' }}>
            <SmallSelect value={data?.furcation} onChange={(val) => onSelectChange(number, side, 'furcation', val)} />
          </Box>
          {isCompareMode && compareFields?.furcation && compareDates.map((date, idx) => (
            <Box key={`furc-${date}`} sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: (hideMobility && idx === compareDates.length - 1) ? 'none' : '1px solid #E2E8F0', bgcolor: '#f1f5f9' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{getHistoricalData(date, number, side, 'furcation')}</Typography>
            </Box>
          ))}

          {!hideMobility && (
            <>
              <Box sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: (!isCompareMode || !compareFields?.mobility || compareDates.length === 0) ? 'none' : '1px solid #E2E8F0' }}>
                <SmallSelect value={data?.mobility} onChange={(val) => onSelectChange(number, side, 'mobility', val)} />
              </Box>
              {isCompareMode && compareFields?.mobility && compareDates.map((date, idx) => (
                <Box key={`mob-${date}`} sx={{ height: ROW_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '6px', borderBottom: idx === compareDates.length - 1 ? 'none' : '1px solid #E2E8F0', bgcolor: '#f1f5f9' }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{getHistoricalData(date, number, side, 'mobility')}</Typography>
                </Box>
              ))}
            </>
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

const PerioChartGrid = forwardRef(({ chartData = {}, setChartData, missingTeeth = [], isCompareMode, compareDates, compareFields, selectedToothNumber, onToothColumnClick, historicalData = {} }, ref) => {
  const [editingCell, setEditingCell] = useState(null);

  const generateLabels = (baseLabels) => {
    if (!isCompareMode || !compareDates || compareDates.length === 0) return baseLabels;
    let newLabels = [];
    baseLabels.forEach(label => {
      newLabels.push(label);
      if (label === 'MOBILITY' && compareFields?.mobility) compareDates.forEach(d => newLabels.push(`Mobility ${d}`));
      if (label === 'FURCATION' && compareFields?.furcation) compareDates.forEach(d => newLabels.push(`Furcation ${d}`));
      if (label === 'BLEEDING' && compareFields?.bleeding) compareDates.forEach(d => newLabels.push(`Bleeding ${d}`));
      if (label === 'PLQ / CALC / SUP' && compareFields?.pcs) compareDates.forEach(d => newLabels.push(`Plq/calc/sup ${d}`));
      if (label === 'ATTACHMENT LOSS' && compareFields?.attachmentLoss) compareDates.forEach(d => newLabels.push(`Attachment Loss ${d}`));
      if (label === 'RECESSION (FGM/CEJ)' && compareFields?.recession) compareDates.forEach(d => newLabels.push(`Recession (FGM/CEJ) ${d}`));
      if (label === 'PROBE' && compareFields?.probe) compareDates.forEach(d => newLabels.push(`Probe ${d}`));
    });
    return newLabels;
  };

  const topLabelsUpper = generateLabels(['MOBILITY', 'FURCATION', 'BLEEDING', 'PLQ / CALC / SUP', 'ATTACHMENT LOSS', 'RECESSION (FGM/CEJ)', 'PROBE']);
  const bottomLabelsUpper = generateLabels(['PROBE', 'RECESSION (FGM/CEJ)', 'ATTACHMENT LOSS', 'PLQ / CALC / SUP', 'BLEEDING', 'FURCATION']);
  
  const topLabelsLower = generateLabels(['MOBILITY', 'FURCATION', 'BLEEDING', 'PLQ / CALC / SUP', 'ATTACHMENT LOSS', 'RECESSION (FGM/CEJ)', 'PROBE']);
  const bottomLabelsLower = generateLabels(['PROBE', 'RECESSION (FGM/CEJ)', 'ATTACHMENT LOSS', 'PLQ / CALC / SUP', 'BLEEDING', 'FURCATION']);

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

  // Refs for tooth columns (for scroll-to-tooth)
  const toothColumnRefs = useRef({});

  const getToothColumnRef = useCallback((toothNum) => {
    if (!toothColumnRefs.current[toothNum]) {
      toothColumnRefs.current[toothNum] = { current: null };
    }
    return (el) => { toothColumnRefs.current[toothNum] = el; };
  }, []);

  // Expose scrollToTooth to parent via ref
  useImperativeHandle(ref, () => ({
    scrollToTooth: (toothNum) => {
      const el = toothColumnRefs.current[toothNum];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }), []);

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
          isSelected={selectedToothNumber === n}
          onColumnClick={onToothColumnClick}
          historicalData={historicalData}
          columnRef={getToothColumnRef(n)}
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
            <Box 
              key={num} 
              onClick={() => onToothColumnClick && onToothColumnClick(num)}
              sx={{ 
                flex: 1, minWidth: 0, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 700, fontSize: '12px', 
                color: selectedToothNumber === num ? '#2563eb' : '#0F172A', 
                bgcolor: selectedToothNumber === num ? '#EFF6FF' : 'transparent',
                borderRight: '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#F1F5F9' }
              }}
            >
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
    <Box sx={{ 
      mt: 3, 
      bgcolor: 'transparent', 
      overflowX: 'auto', 
      overflowY: 'hidden',
      '&::-webkit-scrollbar': { height: '6px' },
      '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
    }}>
      <Box sx={{ minWidth: 'min-content', zoom: { xs: 0.45, sm: 0.55, md: 0.65, lg: 0.75, xl: 0.9 } }}>
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
    </Box>
  );
});

PerioChartGrid.displayName = 'PerioChartGrid';

export default PerioChartGrid;
