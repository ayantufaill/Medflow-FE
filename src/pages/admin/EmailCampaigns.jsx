import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  EmailOutlined as EmailIcon,
  TouchAppOutlined as ClickIcon,
  UnsubscribeOutlined as BounceIcon,
  SendOutlined as SendIcon,
  Search as SearchIcon,
  PrintOutlined as PrintIcon,
  ContentCopy as CopyIcon,
  PersonOutline as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import CreateCampaignModal from './CreateCampaignModal';
import PreviewCampaignModal from './PreviewCampaignModal';
import CampaignEditor from './CampaignEditor';

const mockData = [
  { name: 'Membership Plan-541244220-431372052', status: 'Sent', date: '12/11/2025', opened: '13', clicked: 'NA', bounced: 'NA', notOpened: '4', sentTo: '68 / 67' },
  { name: 'BOTOX-1042548036', status: 'Sent', date: '12/08/2025', opened: '149', clicked: '2', bounced: '5', notOpened: '144', sentTo: '225 / 248' },
  { name: 'BOTOX-1504342631', status: 'Sent', date: '12/02/2025', opened: '120', clicked: '1', bounced: '8', notOpened: '158', sentTo: '225 / 248' },
  { name: 'BOTOX-404166013', status: 'Sent', date: '11/24/2025', opened: '145', clicked: '1', bounced: '9', notOpened: '144', sentTo: '225 / 248' },
  { name: 'Use it or Lose it-1213300343', status: 'Sent', date: '11/03/2025', opened: '188', clicked: 'NA', bounced: '8', notOpened: '134', sentTo: '233 / 234' },
  { name: 'BOTOX-2134410491', status: 'Sent', date: '10/27/2025', opened: '156', clicked: '1', bounced: '4', notOpened: '164', sentTo: '223 / 233' },
  { name: 'BOTOX-1551912592', status: 'Draft', date: '10/14/2025', opened: 'NA', clicked: 'NA', bounced: 'NA', notOpened: 'NA', sentTo: '0' },
  { name: '4 Year Birthday-1121418329', status: 'Sent', date: '10/08/2025', opened: '121', clicked: '3', bounced: '2', notOpened: '142', sentTo: '225 / 233' },
  { name: 'BOTOX-107004543', status: 'Sent', date: '10/02/2025', opened: '151', clicked: '2', bounced: '5', notOpened: '158', sentTo: '220 / 225' },
  { name: 'BOTOX-655677420', status: 'Draft', date: '10/01/2025', opened: 'NA', clicked: 'NA', bounced: 'NA', notOpened: 'NA', sentTo: '0' },
];

const templatesData = [
  'Membership Plan-941944290',
  'Membership Plan',
  'Use it or Lose it',
  'Leave Us a Review',
  '4 Year Birthday',
  'BOTOX',
  'BOOST 2025-492156060',
  'TOP 3 BOTOX-363682503',
  'TOP 3 BOTOX',
  'BOOST 2025',
  'BOTOX',
  'Spring Break Is Around the Corner',
  'Heart Health Month',
  'Deactivation letter',
  'Use it or Lose it!',
];

const SummaryCard = ({ title, count, icon: Icon, color, bgcolor }) => (
  <Box sx={{ bgcolor, color, p: 2, borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <Icon sx={{ fontSize: '1.8rem', mb: 1 }} />
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{title}</Typography>
    <Typography sx={{ fontSize: '1.2rem', fontWeight: 700 }}>{count}</Typography>
  </Box>
);

const EmailCampaigns = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('list'); // 'list', 'edit-campaign', 'edit-template'
  const [editorTitle, setEditorTitle] = useState('');

  const thSx = { fontSize: '0.75rem', fontWeight: 700, color: '#333', py: 1.5, borderBottom: '2px solid #eaeaea' };
  const tdSx = { fontSize: '0.75rem', py: 1.5, borderBottom: '1px solid #eaeaea' };

  const handleEditCampaign = (title) => {
    setEditorTitle(title);
    setEditorMode('edit-campaign');
  };

  const handleEditTemplate = (title) => {
    setEditorTitle(title);
    setEditorMode('edit-template');
  };

  const handleCreateNew = () => {
    setCreateModalOpen(false);
    setEditorTitle('New Campaign');
    setEditorMode('edit-campaign');
  };

  // If in editor mode, render full-width editor
  if (editorMode !== 'list') {
    return (
      <CampaignEditor 
        mode={editorMode === 'edit-template' ? 'template' : 'campaign'} 
        title={editorTitle}
        onCancel={() => setEditorMode('list')}
        onPreview={() => setPreviewModalOpen(true)}
      />
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} sx={{ mb: 2, px: 2, pt: 1 }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin');
          }}
          sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#1a3a6b' }}
        >
          Patient Communication
        </Link>
        <Typography sx={{ fontSize: '0.95rem', color: 'text.primary' }}>Email Campaign</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', minHeight: '80vh' }}>
        {/* Sidebar */}
        <Box sx={{ width: 200, minWidth: 200, borderRight: '1px solid #e0e0e0', pt: 2 }}>
          {['Home', 'Templates'].map((item) => {
            const id = item.toLowerCase();
            return (
              <Box
                key={id}
                onClick={() => setActiveTab(id)}
                sx={{
                  py: 1.5,
                  px: 3,
                  cursor: 'pointer',
                  borderLeft: activeTab === id ? '4px solid #1a3a6b' : '4px solid transparent',
                  backgroundColor: activeTab === id ? '#f4f6f9' : 'transparent',
                  '&:hover': { backgroundColor: '#f9f9f9' },
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', fontWeight: activeTab === id ? 600 : 400, color: activeTab === id ? '#1a3a6b' : '#555' }}>
                  {item}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, px: 4, py: 2 }}>
          {activeTab === 'home' ? (
            <>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>Campaigns</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setCreateModalOpen(true)}
                  sx={{ bgcolor: '#4caf50', textTransform: 'none', fontWeight: 600, borderRadius: 5, px: 3, '&:hover': { bgcolor: '#388e3c' } }}
                >
                  Create Campaign
                </Button>
              </Box>

              <Select size="small" defaultValue="all" sx={{ mb: 2, minWidth: 120, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }}>
                <MenuItem value="all" sx={{ fontSize: '0.8rem' }}>All Time</MenuItem>
              </Select>

              {/* Summary Cards */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, maxWidth: 800 }}>
                <SummaryCard title="Total Opened" count="5069" icon={EmailIcon} color="#2e7d32" bgcolor="#e8f5e9" />
                <SummaryCard title="Total Clicked" count="1661" icon={ClickIcon} color="#1976d2" bgcolor="#e3f2fd" />
                <SummaryCard title="Total Bounced" count="114" icon={BounceIcon} color="#e65100" bgcolor="#fff3e0" />
                <SummaryCard title="Total Sent" count="10113" icon={SendIcon} color="#424242" bgcolor="#eeeeee" />
              </Box>

              {/* Table Controls */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Search"
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1rem', color: '#999' }} /></InputAdornment> }}
                    sx={{ width: 250, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.8rem', borderRadius: 5, bgcolor: '#f9f9f9' } }}
                  />
                  <Select size="small" defaultValue="status" sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.8rem', borderRadius: 5, bgcolor: '#f9f9f9' } }}>
                    <MenuItem value="status" sx={{ fontSize: '0.8rem' }}>View By status</MenuItem>
                  </Select>
                  <Button variant="contained" sx={{ bgcolor: '#1a3a6b', textTransform: 'none', fontWeight: 600, borderRadius: 5, px: 3, height: 36, '&:hover': { bgcolor: '#15305a' } }}>
                    Apply
                  </Button>
                </Box>
                <IconButton><PrintIcon sx={{ color: '#1a3a6b' }} /></IconButton>
              </Box>

              {/* Data Table */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={thSx}>Name</TableCell>
                      <TableCell sx={thSx}>Status</TableCell>
                      <TableCell sx={thSx}>Created</TableCell>
                      <TableCell sx={thSx} align="center">Opened</TableCell>
                      <TableCell sx={thSx} align="center">Clicked</TableCell>
                      <TableCell sx={thSx} align="center">Bounced</TableCell>
                      <TableCell sx={thSx} align="center">Not Opened</TableCell>
                      <TableCell sx={thSx}>Sent to</TableCell>
                      <TableCell sx={thSx} align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockData.map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ ...tdSx, fontWeight: 500 }}>{row.name}</TableCell>
                        <TableCell sx={tdSx}>
                          <Box sx={{
                            display: 'inline-block',
                            px: 1.5, py: 0.3,
                            borderRadius: 4,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: row.status === 'Sent' ? '#e8f5e9' : '#eeeeee',
                            color: row.status === 'Sent' ? '#2e7d32' : '#757575',
                          }}>
                            {row.status}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ ...tdSx, color: '#555' }}>{row.date}</TableCell>
                        <TableCell sx={tdSx} align="center">
                          {row.opened !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>{row.opened}</Link> : <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>NA</Typography>}
                        </TableCell>
                        <TableCell sx={tdSx} align="center">
                          {row.clicked !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>{row.clicked}</Link> : <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>NA</Typography>}
                        </TableCell>
                        <TableCell sx={tdSx} align="center">
                          {row.bounced !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>{row.bounced}</Link> : <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>NA</Typography>}
                        </TableCell>
                        <TableCell sx={tdSx} align="center">
                          {row.notOpened !== 'NA' ? <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>{row.notOpened}</Link> : <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>NA</Typography>}
                        </TableCell>
                        <TableCell sx={tdSx}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon sx={{ fontSize: '0.9rem', color: '#1a3a6b' }} />
                            <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>{row.sentTo}</Link>
                          </Box>
                        </TableCell>
                        <TableCell sx={tdSx} align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            {row.status === 'Draft' && (
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => handleEditCampaign(row.name)}
                                sx={{ borderRadius: 5, textTransform: 'none', py: 0.2, px: 2, borderColor: '#1a3a6b', color: '#1a3a6b' }}
                              >
                                Edit
                              </Button>
                            )}
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={() => setPreviewModalOpen(true)}
                              sx={{ borderRadius: 5, textTransform: 'none', py: 0.2, px: 2, bgcolor: '#e0e0e0', color: '#333', boxShadow: 'none', '&:hover': { bgcolor: '#ccc', boxShadow: 'none' } }}
                            >
                              Preview
                            </Button>
                            <IconButton size="small"><CopyIcon sx={{ fontSize: '1rem', color: '#999' }} /></IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              {/* Templates View */}
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#222', mb: 2 }}>Templates</Typography>
              <TextField
                size="small"
                placeholder="Search"
                InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: '1rem', color: '#999' }} /></InputAdornment> }}
                sx={{ width: 300, mb: 4, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.8rem', bgcolor: '#f9f9f9' } }}
              />
              <Box sx={{ borderTop: '1px solid #eee' }}>
                {templatesData.map((template, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      py: 1.5, borderBottom: '1px solid #eee', cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f7fa' }
                    }}
                  >
                    <Typography 
                      sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a3a6b', flex: 1 }}
                      onClick={() => handleEditTemplate(template)}
                    >
                      {template}
                    </Typography>
                    <IconButton size="small"><CopyIcon sx={{ fontSize: '1rem', color: '#999' }} /></IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}

        </Box>
      </Box>

      {/* Modals */}
      <CreateCampaignModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onCreate={handleCreateNew}
      />
      <PreviewCampaignModal 
        open={previewModalOpen} 
        onClose={() => setPreviewModalOpen(false)} 
      />
    </Box>
  );
};

export default EmailCampaigns;
