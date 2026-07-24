import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { communicationService } from '../../services/communication.service';

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
  const [editorDesc, setEditorDesc] = useState('');
  const [editorId, setEditorId] = useState(null);
  
  const [questionnaires, setQuestionnaires] = useState({ custom: [], system: [] });
  const [loading, setLoading] = useState(true);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getQuestionnaires();
      setQuestionnaires(data);
    } catch (error) {
      console.error('Failed to fetch questionnaires:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const handleCreateNew = (payload) => {
    setCreateModalOpen(false);
    setEditorTitle(payload?.title || ''); 
    setEditorDesc(payload?.description || '');
    setEditorId(null);
    setEditorMode('custom');
  };

  const handleOpenSystem = (title, id) => {
    setEditorTitle(title);
    setEditorId(id);
    setEditorMode('system');
  };

  const handleOpenCustom = (title, id) => {
    setEditorTitle(title);
    setEditorId(id);
    setEditorMode('custom');
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
        <Box sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
              <CircularProgress size={40} sx={{ color: '#3B82F6' }} />
            </Box>
          ) : activeTab === 'custom' ? (
            <CustomQuestionnairesTab 
              questionnaires={questionnaires.custom}
              onOpenCreateModal={() => setCreateModalOpen(true)} 
              onOpenCustom={handleOpenCustom}
              refreshList={fetchQuestionnaires}
            />
          ) : (
            <SystemQuestionnairesTab 
              questionnaires={questionnaires.system}
              onOpenSystem={handleOpenSystem} 
              refreshList={fetchQuestionnaires}
            />
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
        description={editorDesc}
        id={editorId}
        onClose={() => {
          setEditorMode('list');
          fetchQuestionnaires();
        }} 
      />
    </Box>
  );
};

export default Questionnaires;
