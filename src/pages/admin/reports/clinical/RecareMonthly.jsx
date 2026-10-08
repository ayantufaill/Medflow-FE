import { recareCategories } from '../../../../constants/recareCategories';
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecareReport, selectRecareData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import RecareCategoryDialog from './RecareCategoryDialog';

const RecareMonthly = ({ setSubtitle }) => {
  const branchId = useSelector(state => state.branch?.currentBranchId);
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchRecareReport({ branchId }));
    if (setSubtitle) setSubtitle('Current recall status grouped by recall due month');
  }, [dispatch, setSubtitle, branchId]);

  const chartData = useMemo(() => {
    const months = new Map();
    for (const row of apiData ?? []) {
      const month = row.recallDate?.slice(0, 7) || 'No due date';
      if (!months.has(month)) months.set(month, { name: month, ...Object.fromEntries(recareCategories.map(c => [c.name, 0])) });
      if (row.category in months.get(month)) months.get(month)[row.category]++;
    }
    return [...months.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [apiData]);

  return (
    <Box
      sx={{
        height: 'auto',
        width: '100%',
        p: 3,
        overflow: 'hidden',
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
        Number of patients by recall due month
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
            allowDecimals={false}
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
            onClick={(e) => { setSelectedMonth(null); if (e?.value) setSelectedCategory(e.value); }}
          />
          {recareCategories.map(c => <Bar key={c.key} dataKey={c.name} stackId="a" fill={c.color}
            onClick={entry => { setSelectedMonth(entry.name || entry.payload?.name); setSelectedCategory(c.name); }} style={{ cursor: 'pointer' }} />)}
        </BarChart>
        </ResponsiveContainer>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 10 }}>
        <Typography variant="body2" sx={{ color: '#5C646F', fontWeight: 500, fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>Current patient snapshot</Typography>
      </Box>
      <RecareCategoryDialog 
        open={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
        category={selectedCategory} month={selectedMonth}
      />
    </Box>
  );
};

export default RecareMonthly;
