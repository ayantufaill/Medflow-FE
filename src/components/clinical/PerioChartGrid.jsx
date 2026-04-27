import React from 'react';
import { 
  Box, Typography, Grid, Select, MenuItem, Chip, Button 
} from '@mui/material';
import { fontSize, fontWeight } from "../../constants/styles";

const CELL_WIDTH = 25;
const LABEL_WIDTH = 150;

const SmallSelect = ({ value = 'none' }) => (
  <Select
    size="small"
    value={value}
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

const MeasurementCell = ({ value, color, bgcolor }) => (
  <Box sx={{ 
    width: CELL_WIDTH, 
    height: 22, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: '11px',
    color: color || '#333',
    bgcolor: bgcolor || 'transparent',
    border: '0.5px solid #eee'
  }}>
    {value}
  </Box>
);

const SiteMeasurement = ({ values = ['', '', ''], type }) => (
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
        color = '#f39c12';
      }

      return <MeasurementCell key={i} value={v} color={color} bgcolor={bgcolor} />;
    })}
  </Box>
);

const PCSCell = ({ active = [] }) => (
  <Box sx={{ display: 'flex' }}>
    {['P', 'C', 'S'].map(label => (
      <Box key={label} sx={{ 
        width: CELL_WIDTH, 
        height: 22, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '10px',
        color: active.includes(label) ? '#f39c12' : '#ccc',
        border: '0.5px solid #eee',
        fontWeight: active.includes(label) ? 'bold' : 'normal'
      }}>
        {label}
      </Box>
    ))}
  </Box>
);

const BleedingCell = ({ active = [] }) => (
  <Box sx={{ display: 'flex' }}>
    {[0, 1, 2].map(i => (
      <Box key={i} sx={{ 
        width: CELL_WIDTH, 
        height: 22, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '0.5px solid #eee'
      }}>
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

const ToothColumn = ({ number, data, isBottom = false, isMissing = false }) => {
  const commonRows = (
    <>
      <BleedingCell active={data?.bleeding} />
      <PCSCell active={data?.pcs} />
      <SiteMeasurement values={data?.attachment} type="attachment" />
      <SiteMeasurement values={data?.recession} type="recession" />
      <SiteMeasurement values={data?.probe} type="probe" />
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
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.mobility} /></Box>
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.furcation} /></Box>
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
          <SiteMeasurement values={data?.probe} type="probe" />
          <SiteMeasurement values={data?.recession} type="recession" />
          <SiteMeasurement values={data?.attachment} type="attachment" />
          <PCSCell active={data?.pcs} />
          <BleedingCell active={data?.bleeding} />
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.furcation} /></Box>
          <Box sx={{ p: 0.5, textAlign: 'center' }}><SmallSelect value={data?.mobility} /></Box>
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

const PerioChartGrid = () => {
  const topLabels = ['Mobility', 'Furcation', 'Bleeding', 'Plq/calc/sup', 'Attachment Loss', 'Recession (FGM/CEJ)', 'Probe'];
  const bottomLabels = ['Probe', 'Recession (FGM/CEJ)', 'Attachment Loss', 'Plq/calc/sup', 'Bleeding', 'Furcation', 'Mobility'];

  // Dummy data generator
  const getDummyData = (n) => ({
    mobility: n % 5 === 0 ? '1' : 'none',
    furcation: n % 7 === 0 ? '1' : 'none',
    bleeding: n % 3 === 0 ? [1] : [],
    pcs: n % 2 === 0 ? ['P', 'S'] : ['C'],
    attachment: n % 4 === 0 ? ['4', '5', '4'] : ['', '', ''],
    recession: n % 4 === 0 ? ['2', '3', '2'] : ['', '', ''],
    probe: [ (n%3)+2, (n%2)+2, (n%4)+2 ].map(String)
  });

  const renderQuadrant = (teeth, isBottom = false) => (
    <Box sx={{ display: 'flex', mb: 2, border: '1px solid #ddd' }}>
      {teeth.map(n => (
        <ToothColumn key={n} number={n} data={getDummyData(n)} isBottom={isBottom} isMissing={n === 3 || n === 12 || n === 17 || n === 30} />
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
             {renderQuadrant([1, 2, 3, 4, 5, 6, 7, 8])}
             {renderQuadrant([9, 10, 11, 12, 13, 14, 15, 16])}
             <Typography sx={{ ml: 2, mt: 1, fontWeight: 'bold', fontSize: '11px', color: '#999' }}>FACIAL</Typography>
          </Box>
          
          {/* LINGUAL label */}
          <Box sx={{ display: 'flex', mt: -2 }}>
             <RowLabels labels={bottomLabels} isBottom />
             {renderQuadrant([1, 2, 3, 4, 5, 6, 7, 8], true)}
             {renderQuadrant([9, 10, 11, 12, 13, 14, 15, 16], true)}
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
             {renderQuadrant([32, 31, 30, 29, 28, 27, 26, 25])}
             {renderQuadrant([24, 23, 22, 21, 20, 19, 18, 17])}
             <Typography sx={{ ml: 2, mt: 1, fontWeight: 'bold', fontSize: '11px', color: '#999' }}>LINGUAL</Typography>
          </Box>
          
          {/* FACIAL label */}
          <Box sx={{ display: 'flex', mt: -2 }}>
             <RowLabels labels={bottomLabels} isBottom />
             {renderQuadrant([32, 31, 30, 29, 28, 27, 26, 25], true)}
             {renderQuadrant([24, 23, 22, 21, 20, 19, 18, 17], true)}
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
