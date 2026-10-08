import { recareCategories } from '../../../../constants/recareCategories';
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecareReport, selectRecareData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import RecareCategoryDialog from './RecareCategoryDialog';

const RecareMonthToDay = ({ setSubtitle }) => {
  const branchId = useSelector(state => state.branch?.currentBranchId);
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchRecareReport({ branchId }));
    if (setSubtitle) setSubtitle('Current recall status of active patients');
  }, [dispatch, setSubtitle, branchId]);

  const chartData = useMemo(() => recareCategories.map(category => ({
    ...category, value: (apiData ?? []).filter(row => row.categoryKey === category.key).length,
  })), [apiData]);

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
