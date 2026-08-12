import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecareReport, selectRecareData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import RecareCategoryDialog from './RecareCategoryDialog';

const DEFAULT_DATA = [
  { name: 'On-Time No Pre-appt', value: 22, color: '#a855f7' },
  { name: 'On-Time Pre-appt', value: 197, color: '#d8b4fe' },
  { name: 'No Recare', value: 152, color: '#3b82f6' },
  { name: 'Flagged No-Recare', value: 1, color: '#93c5fd' },
  { name: 'Late >12 months Appointed', value: 2, color: '#64748b' },
  { name: 'Late >12 months Broken Appointment', value: 41, color: '#1e293b' },
  { name: 'Late >12 months No Appointment', value: 17, color: '#475569' },
  { name: 'Late <12 months Appointed', value: 24, color: '#fcd34d' },
  { name: 'Late <12 months Broken Appointment', value: 62, color: '#fbbf24' },
  { name: 'Late <12 months No Appointment', value: 18, color: '#f59e0b' },
];

const RecareMonthToDay = ({ setSubtitle }) => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!apiData || apiData.length === 0) {
      dispatch(fetchRecareReport({}));
    }
    if (setSubtitle) setSubtitle('Month-to-day metrics derived from Recare data');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setSubtitle]);

  const chartData = useMemo(() => {
    if (!apiData) return []; // Return empty array if not loaded yet

    let onTimeNoPre = 0, onTimePre = 0, noRecare = 0, flaggedNoRecare = 0;
    let late12Appt = 0, late12Broken = 0, late12NoAppt = 0;
    let lateU12Appt = 0, lateU12Broken = 0, lateU12NoAppt = 0;

    const now = new Date();
    
    apiData.forEach(row => {
      const recallDate = row.recallDate || row.nextRecareAppt;
      const apptDate = row.apptDate || row.nextTreatmentAppt;
      const flags = row.flags;

      if (!recallDate) {
        if (flags) flaggedNoRecare++;
        else noRecare++;
        return;
      }

      const rDate = new Date(recallDate);
      if (isNaN(rDate.getTime())) {
        noRecare++;
        return;
      }

      const diffMonths = (now.getTime() - rDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (diffMonths <= 0) {
        if (apptDate) onTimePre++;
        else onTimeNoPre++;
      } else if (diffMonths < 12) {
        if (apptDate) lateU12Appt++;
        else lateU12NoAppt++; 
      } else {
        if (apptDate) late12Appt++;
        else late12NoAppt++;
      }
    });

    return [
      { name: 'On-Time No Pre-appt', value: onTimeNoPre, color: '#a855f7' },
      { name: 'On-Time Pre-appt', value: onTimePre, color: '#d8b4fe' },
      { name: 'No Recare', value: noRecare, color: '#3b82f6' },
      { name: 'Flagged No-Recare', value: flaggedNoRecare, color: '#93c5fd' },
      { name: 'Late >12 months Appointed', value: late12Appt, color: '#64748b' },
      { name: 'Late >12 months Broken Appointment', value: late12Broken, color: '#1e293b' },
      { name: 'Late >12 months No Appointment', value: late12NoAppt, color: '#475569' },
      { name: 'Late <12 months Appointed', value: lateU12Appt, color: '#fcd34d' },
      { name: 'Late <12 months Broken Appointment', value: lateU12Broken, color: '#fbbf24' },
      { name: 'Late <12 months No Appointment', value: lateU12NoAppt, color: '#f59e0b' },
    ];
  }, [apiData]);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const pieData = totalValue === 0 ? [{ name: 'No Data', value: 1, color: '#f8fafc' }] : chartData;
  const legendPayload = chartData.map(item => ({
    id: item.name,
    type: 'square',
    value: item.name,
    color: item.color
  }));

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        p: 3,
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
        boxSizing: 'border-box'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2, 
          textAlign: 'left', 
          color: '#09121F', 
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          fontSize: '15px',
          ml: 5
        }}
      >
        Number of patients
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        {loading && (!apiData || apiData.length === 0) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
          <Pie
            data={pieData}
            cx="40%"
            cy="50%"
            innerRadius={0}
            outerRadius={200}
            paddingAngle={0}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                onClick={() => totalValue > 0 && setSelectedCategory(entry.name)}
                style={{ cursor: totalValue > 0 ? 'pointer' : 'default' }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [totalValue === 0 ? 0 : value, name]}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            payload={legendPayload}
            onClick={(e) => totalValue > 0 && e && e.value && setSelectedCategory(e.value)}
            wrapperStyle={{ cursor: totalValue > 0 ? 'pointer' : 'default' }}
            formatter={(value) => {
              const item = chartData.find(d => d.name === value);
              return <span style={{ fontSize: '0.8rem', color: '#666' }}>{value} ({item?.value || 0})</span>;
            }}
          />
        </PieChart>
        </ResponsiveContainer>
      )}
      </Box>
      <RecareCategoryDialog 
        open={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
        category={selectedCategory} 
      />
    </Box>
  );
};

export default RecareMonthToDay;
