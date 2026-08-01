import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';
import { useNavigate } from 'react-router-dom';
import { communicationService } from '../../services/communication.service';

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
  const [previewData, setPreviewData] = useState(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplateName, setEditingTemplateName] = useState('');
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorCampaign, setEditorCampaign] = useState(null);

  const [campaigns, setCampaigns] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const fetchCampaignData = async () => {
    try {
      const [campaignsData, metricsData] = await Promise.all([
        communicationService.getCampaigns(),
        communicationService.getCampaignMetrics()
      ]);
      setCampaigns(campaignsData.campaigns || campaignsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to fetch campaign data', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'home') {
      fetchCampaignData();
    }
  }, [activeTab]);

  const handleEditCampaign = (campaign) => {
    setEditorTitle(campaign.subject || campaign.name);
    setEditorCampaign(campaign);
    setCampaignModalOpen(true);
  };

  const handleEditTemplate = (title) => {
    setEditingTemplateName(title);
    setTemplateModalOpen(true);
  };

  const handleCreateNew = (data) => {
    setCreateModalOpen(false);
    setEditorTitle(data?.name || 'New Campaign');
    setEditorCampaign(data ? { name: data.name, subject: data.subject, body: '' } : null);
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
            disableElevation
            onClick={() => setCreateModalOpen(true)}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              px: 3,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              '&:hover': {
                backgroundColor: COLORS.ACCENT_HOVER,
              },
            }}
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
              <CampaignSummaryCards metrics={metrics} />
              <CampaignsTable campaigns={campaigns} onEditCampaign={handleEditCampaign} onPreviewCampaign={(camp) => { setPreviewData(camp); setPreviewModalOpen(true); }} />
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
        campaign={previewData}
      />
      <TemplateEditorModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        templateName={editingTemplateName}
      />
      <CampaignEditor 
        open={campaignModalOpen}
        onClose={() => { setCampaignModalOpen(false); fetchCampaignData(); }}
        title={editorTitle}
        campaign={editorCampaign}
        onPreview={(data) => { setPreviewData(data); setPreviewModalOpen(true); }}
      />
    </Box>
  );
};

export default EmailCampaigns;
