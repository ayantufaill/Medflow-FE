import React, { useState } from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import CreateCampaignModal from './CreateCampaignModal';
import PreviewCampaignModal from './PreviewCampaignModal';
import CampaignEditor from './CampaignEditor';

import CampaignSidebar from '../../components/admin/patient-communication/email-campaigns/CampaignSidebar';
import CampaignSummaryCards from '../../components/admin/patient-communication/email-campaigns/CampaignSummaryCards';
import CampaignsTable from '../../components/admin/patient-communication/email-campaigns/CampaignsTable';
import TemplatesList from '../../components/admin/patient-communication/email-campaigns/TemplatesList';
import TemplateEditorModal from '../../components/admin/patient-communication/email-campaigns/TemplateEditorModal';

const EmailCampaigns = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplateName, setEditingTemplateName] = useState('');
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');

  const handleEditCampaign = (title) => {
    setEditorTitle(title);
    setCampaignModalOpen(true);
  };

  const handleEditTemplate = (title) => {
    setEditingTemplateName(title);
    setTemplateModalOpen(true);
  };

  const handleCreateNew = () => {
    setCreateModalOpen(false);
    setEditorTitle('New Campaign');
    setCampaignModalOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B', mb: 0.5 }}>Campaigns Overview</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Track and manage your email campaigns and view insights.</Typography>
        </Box>
        {activeTab === 'home' && (
          <Button 
            variant="contained" 
            onClick={() => setCreateModalOpen(true)}
            sx={{ bgcolor: '#3B82F6', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', borderRadius: 1.5, px: 3, py: 1, boxShadow: 'none', transition: 'all 0.15s', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
          >
            Create Campaign
          </Button>
        )}
      </Box>

      {/* Main Layout Area */}
      <Box sx={{ display: 'flex', px: 4, gap: 4 }}>
        {/* Sidebar Component */}
        <Box sx={{ borderRadius: 4, overflow: 'hidden', height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eaeaea', flexShrink: 0 }}>
          <CampaignSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'home' ? (
            <>
              <CampaignSummaryCards />
              <CampaignsTable onEditCampaign={handleEditCampaign} onPreviewCampaign={() => setPreviewModalOpen(true)} />
            </>
          ) : (
            <TemplatesList onEditTemplate={handleEditTemplate} />
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
      <TemplateEditorModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        templateName={editingTemplateName}
      />
      <CampaignEditor 
        open={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        title={editorTitle}
        onPreview={() => setPreviewModalOpen(true)}
      />
    </Box>
  );
};

export default EmailCampaigns;
