import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  EmailOutlined as EmailIcon,
  TouchAppOutlined as ClickIcon,
  UnsubscribeOutlined as BounceIcon,
  SendOutlined as SendIcon,
} from '@mui/icons-material';

const SummaryCard = ({ title, count, icon: Icon, color, bgcolor }) => (
  <Box sx={{ 
    bgcolor, 
    color, 
    p: 3, 
    borderRadius: '12px', 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    border: '1px solid #E5E9F2',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }
  }}>
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 1, borderRadius: '50%', mb: 1.5, display: 'flex' }}>
      <Icon sx={{ fontSize: '1.5rem', opacity: 0.9, color }} />
    </Box>
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>{title}</Typography>
    <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, mt: 0.5, color: '#1E293B' }}>{count}</Typography>
  </Box>
);

const CampaignSummaryCards = ({ metrics }) => {
  const m = metrics || {
    totalOpened: "5,069",
    totalClicked: "1,661",
    totalBounced: "114",
    totalSent: "10,113"
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 4, width: '100%' }}>
      <SummaryCard title="Total Opened" count={m.totalOpened || 0} icon={EmailIcon} color="#3B82F6" bgcolor="#F0F5FF" />
      <SummaryCard title="Total Clicked" count={m.totalClicked || 0} icon={ClickIcon} color="#10B981" bgcolor="#ECFDF5" />
      <SummaryCard title="Total Bounced" count={m.totalBounced || 0} icon={BounceIcon} color="#F59E0B" bgcolor="#FFFBEB" />
      <SummaryCard title="Total Sent" count={m.totalSent || 0} icon={SendIcon} color="#64748B" bgcolor="#F8FAFC" />
    </Box>
  );
};

export default CampaignSummaryCards;
