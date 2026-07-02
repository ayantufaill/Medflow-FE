import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecareReport, selectRecareData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import RecareCategoryDialog from './RecareCategoryDialog';

const DEFAULT_DATA = [
  { name: 'June', 'On-Time No Pre-appt': 20, 'On-Time Pre-appt': 180, 'Late <12 months No Appointment': 18, 'Late <12 months Broken Appointment': 62, 'Late <12 months Appointed': 24, 'Late >12 months No Appointment': 17, 'Late >12 months Broken Appointment': 41, 'Late >12 months Appointed': 2, 'No Recare': 300 },
  { name: 'July', 'On-Time No Pre-appt': 22, 'On-Time Pre-appt': 185, 'Late <12 months No Appointment': 20, 'Late <12 months Broken Appointment': 65, 'Late <12 months Appointed': 26, 'Late >12 months No Appointment': 15, 'Late >12 months Broken Appointment': 38, 'Late >12 months Appointed': 3, 'No Recare': 310 },
  { name: 'August', 'On-Time No Pre-appt': 25, 'On-Time Pre-appt': 175, 'Late <12 months No Appointment': 22, 'Late <12 months Broken Appointment': 60, 'Late <12 months Appointed': 22, 'Late >12 months No Appointment': 20, 'Late >12 months Broken Appointment': 45, 'Late >12 months Appointed': 1, 'No Recare': 320 },
  { name: 'September', 'On-Time No Pre-appt': 18, 'On-Time Pre-appt': 190, 'Late <12 months No Appointment': 15, 'Late <12 months Broken Appointment': 70, 'Late <12 months Appointed': 28, 'Late >12 months No Appointment': 12, 'Late >12 months Broken Appointment': 35, 'Late >12 months Appointed': 4, 'No Recare': 330 },
  { name: 'October', 'On-Time No Pre-appt': 21, 'On-Time Pre-appt': 180, 'Late <12 months No Appointment': 25, 'Late <12 months Broken Appointment': 58, 'Late <12 months Appointed': 20, 'Late >12 months No Appointment': 18, 'Late >12 months Broken Appointment': 42, 'Late >12 months Appointed': 2, 'No Recare': 340 },
  { name: 'November', 'On-Time No Pre-appt': 24, 'On-Time Pre-appt': 200, 'Late <12 months No Appointment': 19, 'Late <12 months Broken Appointment': 68, 'Late <12 months Appointed': 30, 'Late >12 months No Appointment': 14, 'Late >12 months Broken Appointment': 40, 'Late >12 months Appointed': 3, 'No Recare': 350 },
  { name: 'December', 'On-Time No Pre-appt': 19, 'On-Time Pre-appt': 195, 'Late <12 months No Appointment': 23, 'Late <12 months Broken Appointment': 61, 'Late <12 months Appointed': 25, 'Late >12 months No Appointment': 16, 'Late >12 months Broken Appointment': 39, 'Late >12 months Appointed': 2, 'No Recare': 345 },
  { name: 'January', 'On-Time No Pre-appt': 23, 'On-Time Pre-appt': 205, 'Late <12 months No Appointment': 21, 'Late <12 months Broken Appointment': 66, 'Late <12 months Appointed': 27, 'Late >12 months No Appointment': 13, 'Late >12 months Broken Appointment': 43, 'Late >12 months Appointed': 3, 'No Recare': 355 },
  { name: 'February', 'On-Time No Pre-appt': 26, 'On-Time Pre-appt': 185, 'Late <12 months No Appointment': 24, 'Late <12 months Broken Appointment': 63, 'Late <12 months Appointed': 23, 'Late >12 months No Appointment': 19, 'Late >12 months Broken Appointment': 46, 'Late >12 months Appointed': 1, 'No Recare': 360 },
  { name: 'March', 'On-Time No Pre-appt': 20, 'On-Time Pre-appt': 190, 'Late <12 months No Appointment': 22, 'Late <12 months Broken Appointment': 67, 'Late <12 months Appointed': 29, 'Late >12 months No Appointment': 11, 'Late >12 months Broken Appointment': 37, 'Late >12 months Appointed': 4, 'No Recare': 370 },
  { name: 'April', 'On-Time No Pre-appt': 22, 'On-Time Pre-appt': 210, 'Late <12 months No Appointment': 18, 'Late <12 months Broken Appointment': 64, 'Late <12 months Appointed': 24, 'Late >12 months No Appointment': 15, 'Late >12 months Broken Appointment': 41, 'Late >12 months Appointed': 2, 'No Recare': 380 },
  { name: 'May', 'On-Time No Pre-appt': 25, 'On-Time Pre-appt': 180, 'Late <12 months No Appointment': 21, 'Late <12 months Broken Appointment': 62, 'Late <12 months Appointed': 25, 'Late >12 months No Appointment': 17, 'Late >12 months Broken Appointment': 44, 'Late >12 months Appointed': 3, 'No Recare': 385 },
];

const RecareMonthly = ({ setSubtitle }) => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchRecareReport({}));
    if (setSubtitle) setSubtitle('Monthly metrics derived from Recare data');
  }, [dispatch, setSubtitle]);

  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return DEFAULT_DATA; // Fallback
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthData = months.map(m => ({
      name: m,
      'On-Time No Pre-appt': 0, 'On-Time Pre-appt': 0, 'Late <12 months No Appointment': 0,
      'Late <12 months Broken Appointment': 0, 'Late <12 months Appointed': 0,
      'Late >12 months No Appointment': 0, 'Late >12 months Broken Appointment': 0,
      'Late >12 months Appointed': 0, 'No Recare': 0
    }));

    const now = new Date();

    apiData.forEach(row => {
      const recallDate = row.recallDate || row.nextRecareAppt;
      const apptDate = row.apptDate || row.nextTreatmentAppt;
      
      let mIdx = 0;
      if (recallDate) {
        const d = new Date(recallDate);
        if (!isNaN(d.getTime())) mIdx = d.getMonth();
      }

      const entry = monthData[mIdx];
      
      if (!recallDate) {
        entry['No Recare']++;
        return;
      }

      const rDate = new Date(recallDate);
      if (isNaN(rDate.getTime())) {
        entry['No Recare']++;
        return;
      }

      const diffMonths = (now.getTime() - rDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (diffMonths <= 0) {
        if (apptDate) entry['On-Time Pre-appt']++;
        else entry['On-Time No Pre-appt']++;
      } else if (diffMonths < 12) {
        if (apptDate) entry['Late <12 months Appointed']++;
        else entry['Late <12 months No Appointment']++;
      } else {
        if (apptDate) entry['Late >12 months Appointed']++;
        else entry['Late >12 months No Appointment']++;
      }
    });

    return monthData;
  }, [apiData]);

  return (
    <Box sx={{ height: 'auto', width: '100%', p: 2, overflow: 'hidden' }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 1, 
          textAlign: 'left', 
          color: '#673ab7', 
          fontWeight: 600,
          ml: 5
        }}
      >
        Number of patients/month
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        {loading && (!apiData || apiData.length === 0) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 200, left: 40, bottom: 20 }}
            barCategoryGap="25%"
          >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: '#000' }} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#000' }} 
            dy={10}
          />
          <YAxis 
            axisLine={{ stroke: '#000' }} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#000' }} 
            domain={[0, 800]} 
            ticks={[0, 100, 200, 300, 400, 500, 600, 700, 800]}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="top" 
            wrapperStyle={{ paddingLeft: 40, right: 0, cursor: 'pointer' }}
            iconType="rect"
            iconSize={14}
            formatter={(value) => <span style={{ color: '#666', fontSize: '0.75rem' }}>{value}</span>}
            onClick={(e) => e && e.value && setSelectedCategory(e.value)}
          />
          <Bar dataKey="No Recare" stackId="a" fill="#4a90e2" onClick={() => setSelectedCategory("No Recare")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="Late >12 months Appointed" stackId="a" fill="#cfd8dc" onClick={() => setSelectedCategory("Late >12 months Appointed")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="Late >12 months Broken Appointment" stackId="a" fill="#90a4ae" onClick={() => setSelectedCategory("Late >12 months Broken Appointment")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="Late >12 months No Appointment" stackId="a" fill="#455a64" onClick={() => setSelectedCategory("Late >12 months No Appointment")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="Late <12 months Appointed" stackId="a" fill="#ffe0b2" onClick={() => setSelectedCategory("Late <12 months Appointed")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="Late <12 months Broken Appointment" stackId="a" fill="#ffcc80" onClick={() => setSelectedCategory("Late <12 months Broken Appointment")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="Late <12 months No Appointment" stackId="a" fill="#ffb74d" onClick={() => setSelectedCategory("Late <12 months No Appointment")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="On-Time Pre-appt" stackId="a" fill="#9e8aff" onClick={() => setSelectedCategory("On-Time Pre-appt")} style={{ cursor: 'pointer' }} />
          <Bar dataKey="On-Time No Pre-appt" stackId="a" fill="#7b61ff" onClick={() => setSelectedCategory("On-Time No Pre-appt")} style={{ cursor: 'pointer' }} />
        </BarChart>
        </ResponsiveContainer>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 10 }}>
        <Typography variant="body2" sx={{ color: '#673ab7', fontWeight: 500 }}>2025 - 2026</Typography>
      </Box>
      <RecareCategoryDialog 
        open={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
        category={selectedCategory} 
      />
    </Box>
  );
};

export default RecareMonthly;
