import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  PieChart as PieChartIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import CreateQuestionnaireModal from './CreateQuestionnaireModal';
import QuestionnaireEditor from './QuestionnaireEditor';

const EmptyStateIllustration = () => {
  return (
    <Box sx={{ position: 'relative', width: 300, height: 300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Floating Elements */}
      <Paper elevation={1} sx={{ position: 'absolute', top: 50, right: 30, width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
        <EmailIcon sx={{ color: '#1976d2', opacity: 0.6 }} />
      </Paper>
      
      <Paper elevation={1} sx={{ position: 'absolute', top: 120, left: 10, width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
        <PieChartIcon sx={{ color: '#1a3a6b' }} />
      </Paper>

      <Paper elevation={1} sx={{ position: 'absolute', bottom: 40, right: 10, width: 50, height: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <Box sx={{ width: 10, height: 10, bgcolor: '#1a3a6b', borderRadius: '50%', position: 'absolute', top: 8, right: 8 }} />
        <Box sx={{ width: '120%', height: 25, bgcolor: '#e0e0e0', borderTopLeftRadius: 20, borderTopRightRadius: 30, transform: 'rotate(-5deg)', mb: -5 }} />
      </Paper>

      {/* Main Clipboard */}
      <Paper elevation={2} sx={{ width: 140, height: 180, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, zIndex: 10, border: '1px solid #e0e0e0' }}>
        {/* Clip */}
        <Box sx={{ position: 'absolute', top: -8, width: 50, height: 16, bgcolor: '#1a3a6b', borderRadius: 1 }} />
        <Box sx={{ position: 'absolute', top: -14, width: 16, height: 16, border: '3px solid #1a3a6b', borderRadius: '50%', bgcolor: '#fff' }} />
        
        {/* Checkmark Rows */}
        <Box sx={{ width: '100%', px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 22, height: 22, bgcolor: '#4caf50', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 2 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 22, height: 22, bgcolor: '#1a3a6b', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 2 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 22, height: 22, bgcolor: '#1a3a6b', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>✓</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 2 }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const systemCards = [
  { title: 'Dental History', questions: 37 },
  { title: 'Medical History', questions: 62 },
  { title: 'Pediatric Dental Hx', questions: 31 },
  { title: 'Pediatric Medical Hx', questions: 44 },
];

const Questionnaires = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('custom');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Editor State
  const [editorMode, setEditorMode] = useState('list'); // 'list', 'custom', 'system'
  const [editorTitle, setEditorTitle] = useState('');

  const handleCreateNew = () => {
    setCreateModalOpen(false);
    setEditorTitle('health'); // using the mockup name
    setEditorMode('custom');
  };

  const handleOpenSystem = (title) => {
    setEditorTitle(title.toLowerCase().split(' ')[0]); // 'dental' from 'Dental History'
    setEditorMode('system');
  };

  if (editorMode !== 'list') {
    return (
      <QuestionnaireEditor 
        mode={editorMode} 
        title={editorTitle} 
        onBack={() => setEditorMode('list')} 
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
        <Typography sx={{ fontSize: '0.95rem', color: 'text.primary' }}>Questionnaires</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', minHeight: '80vh' }}>
        {/* Sidebar */}
        <Box sx={{ width: 220, minWidth: 220, borderRight: '1px solid #e0e0e0', pt: 2 }}>
          {['Custom Questionnaires', 'System Questionnaires'].map((item) => {
            const id = item.split(' ')[0].toLowerCase(); // 'custom' or 'system'
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
                <Typography sx={{ fontSize: '0.85rem', fontWeight: activeTab === id ? 600 : 400, color: activeTab === id ? '#222' : '#555' }}>
                  {item}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, px: 4, py: 2 }}>
          
          {activeTab === 'custom' ? (
            <>
              {/* Custom Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>
                  Custom Questionnaires
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setCreateModalOpen(true)}
                  sx={{ bgcolor: '#4caf50', textTransform: 'none', fontWeight: 600, borderRadius: 5, px: 3, '&:hover': { bgcolor: '#388e3c' } }}
                >
                  Create Questionnaire
                </Button>
              </Box>

              {/* Empty State */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <EmptyStateIllustration />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a3a6b', mt: 4, mb: 3 }}>
                  No Questionnaires Yet
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setCreateModalOpen(true)}
                  sx={{ bgcolor: '#4caf50', textTransform: 'none', fontWeight: 600, borderRadius: 5, px: 4, py: 1, '&:hover': { bgcolor: '#388e3c' } }}
                >
                  Get Started
                </Button>
              </Box>
            </>
          ) : (
            <>
              {/* System Header (Implied from design, just grid) */}
              <Grid container spacing={4} sx={{ pt: 4 }}>
                {systemCards.map((card, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Paper 
                      elevation={2} 
                      onClick={() => handleOpenSystem(card.title)}
                      sx={{ 
                        height: 250, 
                        display: 'flex', flexDirection: 'column', 
                        cursor: 'pointer', borderRadius: 1, overflow: 'hidden',
                        transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      {/* Top half - White */}
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#fff', flex: 1 }}>
                        <Typography sx={{ fontSize: '0.9rem', color: '#1a3a6b', fontWeight: 500 }}>{card.title}</Typography>
                        <IconButton size="small" sx={{ p: 0 }}><MoreVertIcon sx={{ fontSize: '1.2rem', color: '#999' }}/></IconButton>
                      </Box>
                      {/* Bottom half - Light Grey */}
                      <Box sx={{ p: 2, bgcolor: '#f0f2f5', flex: 2 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 500 }}>{card.questions} Questions</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

        </Box>
      </Box>

      {/* Modals */}
      <CreateQuestionnaireModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onCreate={handleCreateNew}
      />
    </Box>
  );
};

export default Questionnaires;
