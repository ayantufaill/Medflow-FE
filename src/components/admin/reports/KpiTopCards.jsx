import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const MetricCard = ({ title, value, icon, trend, trendLabel, color }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 2.5,
      borderRadius: '22px',
      border: '1px solid #DFE5EC',
      bgcolor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.02)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography sx={{ color: '#6B778C', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Typography>
      <Box sx={{ 
        width: 38, 
        height: 38, 
        borderRadius: '12px', 
        bgcolor: `${color}15`, 
        color: color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {icon}
      </Box>
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ color: '#1A1A1A', fontSize: '28px', fontWeight: 700 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
        <Typography sx={{ color: trend >= 0 ? '#42C070' : '#E55353', fontSize: '13px', fontWeight: 600 }}>
          {trend >= 0 ? '+' : ''}{trend}%
        </Typography>
        <Typography sx={{ color: '#8898AA', fontSize: '13px' }}>
          {trendLabel}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const KpiTopCards = () => {
  return (
    <Box sx={{ mb: 4, display: 'flex', gap: 3, width: '100%' }}>
      <MetricCard
        title="TOTAL NET PRODUCTION"
        value="$41,383.80"
        icon={<TrendingUpIcon fontSize="small" />}
        trend={12.5}
        trendLabel="vs last month"
        color="#2362EF"
      />
      <MetricCard
        title="TOTAL COLLECTION"
        value="$42,362.93"
        icon={<AttachMoneyIcon fontSize="small" />}
        trend={8.2}
        trendLabel="vs last month"
        color="#42C070"
      />
      <MetricCard
        title="TOTAL SEEN PATIENTS"
        value="84"
        icon={<PeopleOutlineIcon fontSize="small" />}
        trend={-2.4}
        trendLabel="vs last month"
        color="#F59E0B"
      />
      <MetricCard
        title="CASE ACCEPTED"
        value="$57,091.40"
        icon={<AssignmentTurnedInIcon fontSize="small" />}
        trend={15.3}
        trendLabel="vs last month"
        color="#8B5CF6"
      />
    </Box>
  );
};

export default KpiTopCards;
