import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import CreateQuestionnaireModal from '../../components/admin/patient-communication/questionnaires/CreateQuestionnaireModal';
import QuestionnaireEditor from '../../components/admin/patient-communication/questionnaires/QuestionnaireEditor';
import QuestionnaireSidebar from '../../components/admin/patient-communication/questionnaires/QuestionnaireSidebar';
import CustomQuestionnairesTab from '../../components/admin/patient-communication/questionnaires/CustomQuestionnairesTab';
import SystemQuestionnairesTab from '../../components/admin/patient-communication/questionnaires/SystemQuestionnairesTab';

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



  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ px: 4, pt: 4, mb: 4 }}>

        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B' }}>Questionnaires</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your custom and system patient questionnaires.</Typography>
      </Box>

      {/* Main Layout Area */}
      <Box sx={{ display: 'flex', px: 4, gap: 4 }}>
        {/* Sidebar Component */}
        <Box sx={{ borderRadius: 4, overflow: 'hidden', height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eaeaea', flexShrink: 0, bgcolor: '#fff' }}>
          <QuestionnaireSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'custom' ? (
            <CustomQuestionnairesTab onOpenCreateModal={() => setCreateModalOpen(true)} />
          ) : (
            <SystemQuestionnairesTab onOpenSystem={handleOpenSystem} />
          )}
        </Box>
      </Box>

      {/* Modals */}
      <CreateQuestionnaireModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onCreate={handleCreateNew}
      />
      
      <QuestionnaireEditor 
        open={editorMode !== 'list'}
        mode={editorMode} 
        title={editorTitle} 
        onClose={() => setEditorMode('list')} 
      />
    </Box>
  );
};

export default Questionnaires;
