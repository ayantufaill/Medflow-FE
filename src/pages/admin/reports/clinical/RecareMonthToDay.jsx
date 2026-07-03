import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecareReport, selectRecareData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import RecareCategoryDialog from './RecareCategoryDialog';

const DEFAULT_DATA = [
  { name: 'On-Time No Pre-appt', value: 22, color: '#7b61ff' },
  { name: 'On-Time Pre-appt', value: 197, color: '#9e8aff' },
  { name: 'No Recare', value: 152, color: '#4a90e2' },
  { name: 'Flagged No-Recare', value: 1, color: '#82b1ff' },
  { name: 'Late >12 months Appointed', value: 2, color: '#cfd8dc' },
  { name: 'Late >12 months Broken Appointment', value: 41, color: '#90a4ae' },
  { name: 'Late >12 months No Appointment', value: 17, color: '#455a64' },
  { name: 'Late <12 months Appointed', value: 24, color: '#ffe0b2' },
  { name: 'Late <12 months Broken Appointment', value: 62, color: '#ffcc80' },
  { name: 'Late <12 months No Appointment', value: 18, color: '#ffb74d' },
];

const RecareMonthToDay = ({ setSubtitle }) => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchRecareReport({}));
    if (setSubtitle) setSubtitle('Month-to-day metrics derived from Recare data');
  }, [dispatch, setSubtitle]);

  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return DEFAULT_DATA; // Fallback to mock design data

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
      { name: 'On-Time No Pre-appt', value: onTimeNoPre, color: '#7b61ff' },
      { name: 'On-Time Pre-appt', value: onTimePre, color: '#9e8aff' },
      { name: 'No Recare', value: noRecare, color: '#4a90e2' },
      { name: 'Flagged No-Recare', value: flaggedNoRecare, color: '#82b1ff' },
      { name: 'Late >12 months Appointed', value: late12Appt, color: '#cfd8dc' },
      { name: 'Late >12 months Broken Appointment', value: late12Broken, color: '#90a4ae' },
      { name: 'Late >12 months No Appointment', value: late12NoAppt, color: '#455a64' },
      { name: 'Late <12 months Appointed', value: lateU12Appt, color: '#ffe0b2' },
      { name: 'Late <12 months Broken Appointment', value: lateU12Broken, color: '#ffcc80' },
      { name: 'Late <12 months No Appointment', value: lateU12NoAppt, color: '#ffb74d' },
    ];
  }, [apiData]);

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      {loading && (!apiData || apiData.length === 0) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
          <Pie
            data={chartData}
            cx="40%"
            cy="50%"
            innerRadius={0}
            outerRadius={200}
            paddingAngle={0}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                onClick={() => setSelectedCategory(entry.name)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [value, name]}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            onClick={(e) => e && e.value && setSelectedCategory(e.value)}
            wrapperStyle={{ cursor: 'pointer' }}
            formatter={(value, entry) => {
              const item = chartData.find(d => d.name === value);
              return <span style={{ fontSize: '0.8rem', color: '#666' }}>{value} ({item?.value || 0})</span>;
            }}
          />
        </PieChart>
        </ResponsiveContainer>
      )}
      <RecareCategoryDialog 
        open={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
        category={selectedCategory} 
      />
    </Box>
  );
};

export default RecareMonthToDay;
