import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
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

const RecareMonthly = () => {
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
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
            wrapperStyle={{ paddingLeft: 40, right: 0 }}
            iconType="rect"
            iconSize={14}
            formatter={(value) => <span style={{ color: '#666', fontSize: '0.75rem' }}>{value}</span>}
          />
          <Bar dataKey="No Recare" stackId="a" fill="#4a90e2" />
          <Bar dataKey="Late >12 months Appointed" stackId="a" fill="#cfd8dc" />
          <Bar dataKey="Late >12 months Broken Appointment" stackId="a" fill="#90a4ae" />
          <Bar dataKey="Late >12 months No Appointment" stackId="a" fill="#455a64" />
          <Bar dataKey="Late <12 months Appointed" stackId="a" fill="#ffe0b2" />
          <Bar dataKey="Late <12 months Broken Appointment" stackId="a" fill="#ffcc80" />
          <Bar dataKey="Late <12 months No Appointment" stackId="a" fill="#ffb74d" />
          <Bar dataKey="On-Time Pre-appt" stackId="a" fill="#9e8aff" />
          <Bar dataKey="On-Time No Pre-appt" stackId="a" fill="#7b61ff" />
        </BarChart>
      </ResponsiveContainer>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 10 }}>
        <Typography variant="body2" sx={{ color: '#673ab7', fontWeight: 500 }}>2025 - 2026</Typography>
      </Box>
    </Box>
  );
};

export default RecareMonthly;
