import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
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

const RecareMonthToDay = () => {
  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius={0}
            outerRadius={200}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
            formatter={(value, entry) => {
              const item = data.find(d => d.name === value);
              return <span style={{ fontSize: '0.8rem', color: '#666' }}>{value} ({item.value})</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RecareMonthToDay;
