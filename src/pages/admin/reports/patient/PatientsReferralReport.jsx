import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ReferralPatientDialog from '../../../../components/admin/reports/ReferralPatientDialog';
import { fetchPatientsReferralReport, selectPatientsReferralData, selectPatientReportLoading } from '../../../../store/slices/patientReportSlice';

const REFERRAL_DATA = [
  { name: 'Review websites', value: 13, fill: '#D1A3D1' },
  { name: 'Magazine/Newspaper', value: 12, fill: '#5C74D9' },
  { name: 'Friend or family', value: 26, fill: '#00A8C6' },
  { name: 'Google', value: 16, fill: '#55548C' },
  { name: 'Other', value: 5, fill: '#F2D06B' },
  { name: 'DR GIRBELT TARIMO', value: 3, fill: '#8CBE91' },
  { name: 'Dr. Phoebe Test', value: 3, fill: '#D96C7C' },
];

const PatientsReferralReport = () => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectPatientsReferralData);
  const loading = useSelector(selectPatientReportLoading);

  const [activeFilter, setActiveFilter] = useState('This Year');
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch from API when filter changes
  useEffect(() => {
    dispatch(fetchPatientsReferralReport({ filter: activeFilter, startDate, endDate }));
  }, [dispatch, activeFilter, startDate, endDate]);

  const handleSliceClick = (entry) => {
    setSelectedReferral(entry);
  };

  const currentData = useMemo(() => {
    // If backend provided actual pie chart data, format it and use it
    if (apiData && apiData.length > 0 && apiData[0].value !== undefined) {
      return apiData.map(item => ({
        name: item.name,
        value: Number(item.value) || 0,
        fill: item.fill || '#ccc' // fallback color if backend doesn't provide one
      }));
    }

    // Fallback logic for mock data scaling
    let scale = 1;
    if (activeFilter === 'Today') scale = 0.05;
    else if (activeFilter === 'This Week') scale = 0.2;
    else if (activeFilter === 'This Month') scale = 0.5;
    else if (activeFilter === 'Range') scale = 0.3; 
    
    return REFERRAL_DATA.map(item => ({
      ...item,
      value: Math.max(1, Math.round(item.value * scale))
    }));
  }, [apiData, activeFilter]);

  return (
    <Box sx={{ p: 2, bgcolor: '#fff', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {['Today', 'This Week', 'This Month', 'This Year', 'Range'].map(filter => (
          <Button
            key={filter}
            variant="contained"
            onClick={() => setActiveFilter(filter)}
            sx={{
              textTransform: 'none',
              bgcolor: activeFilter === filter ? '#d4af37' : '#e6c875',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#c59d24' }
            }}
          >
            {filter}
          </Button>
        ))}
        {activeFilter === 'Range' && (
          <Box sx={{ display: 'flex', gap: 1, ml: 2, alignItems: 'center' }}>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px' }}
            />
            <Typography variant="caption" sx={{ color: '#555' }}>to</Typography>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px' }}
            />
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <Button variant="contained" sx={{ textTransform: 'none', bgcolor: '#4a73b1', '&:hover': { bgcolor: '#385a8f' }, boxShadow: 'none' }}>
          Download as CSV
        </Button>
        <Button variant="contained" sx={{ textTransform: 'none', bgcolor: '#e6c875', '&:hover': { bgcolor: '#c59d24' }, boxShadow: 'none' }}>
          Create Template
        </Button>
      </Box>

      {/* Chart Box */}
      <Paper elevation={0} sx={{ border: '2px solid #4a73b1', p: 4, width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 450 }}>
        
        {/* Title & Pie Chart side */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Typography variant="h5" sx={{ color: '#4a73b1', fontWeight: 600, mb: 2 }}>
            Patients Referral
          </Typography>
          
          {loading && (
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <CircularProgress />
            </Box>
          )}

          <Box sx={{ width: '100%', height: 350, opacity: loading ? 0.5 : 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  dataKey="value"
                  isAnimationActive={true}
                  onClick={(e) => handleSliceClick(e.payload.payload)}
                  onMouseEnter={(e, index) => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  {currentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      stroke="#fff" 
                      strokeWidth={hoveredSlice === index ? 4 : 1}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Legend Side */}
        <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', gap: 1.5, mt: 7 }}>
          {currentData.map((entry, index) => (
            <Box
              key={index}
              onClick={() => handleSliceClick(entry)}
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 1,
                bgcolor: hoveredSlice === index ? 'rgba(0,0,0,0.04)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: entry.fill }} />
              <Typography sx={{ fontSize: '0.85rem', color: entry.fill, fontWeight: hoveredSlice === index ? 600 : 400 }}>
                {entry.name} ({entry.value})
              </Typography>
            </Box>
          ))}
        </Box>

      </Paper>

      {/* Detail Dialog */}
      <ReferralPatientDialog 
        open={Boolean(selectedReferral)} 
        onClose={() => setSelectedReferral(null)}
        referral={selectedReferral}
      />
    </Box>
  );
};

export default PatientsReferralReport;
