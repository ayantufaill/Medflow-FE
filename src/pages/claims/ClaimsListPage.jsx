import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { claimService } from '../../services/claim.service';
import ClaimManagementHeader from '../../components/claims/ClaimManagementHeader';
import ClaimTabBar from '../../components/claims/ClaimTabBar';
import UnsentClaimsTab from '../../components/claims/UnsentClaimsTab';
import ErroredClaimsTab from '../../components/claims/ErroredClaimsTab';
import RejectedClaimsTab from '../../components/claims/RejectedClaimsTab';
import HistoryClaimsTab from '../../components/claims/HistoryClaimsTab';
import OutstandingClaimsTab from '../../components/claims/OutstandingClaimsTab';
import PredeterminationTab from '../../components/claims/PredeterminationTab';
import DenticalReportsTab from '../../components/claims/DenticalReportsTab';
import EraReportsTab from '../../components/claims/EraReportsTab';
import RightPanel from '../../components/appointments/right-panel/RightPanel';
import RightPanelCollapsed from '../../components/appointments/right-panel/RightPanelCollapsed';
import { ClaimsDialogs } from '../../components/claims/ClaimsDialogs';

const TAB_COMPONENTS = [
  UnsentClaimsTab,        // 0
  ErroredClaimsTab,       // 1
  RejectedClaimsTab,      // 2
  HistoryClaimsTab,       // 3
  OutstandingClaimsTab,   // 4
  PredeterminationTab,    // 5
  DenticalReportsTab,     // 6
  EraReportsTab,          // 7
];

const ClaimsListPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Dialogs State (Shared across all tabs if needed)
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);
  
  const [openAttachDialog, setOpenAttachDialog] = useState(false);
  const [attachingClaim, setAttachingClaim] = useState(null);
  
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewingClaim, setPreviewingClaim] = useState(null);

  const [tabCounts, setTabCounts] = useState({
    unsent: 0, errored: 0, rejected: 0, history: 0, outstanding: 0, predetermination: 0, dentical: 0, era: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await claimService.getTabSummary();
        if (data) {
          setTabCounts(data);
        }
      } catch (err) {
        console.error("Failed to load tab counts", err);
      }
    };
    fetchCounts();
  }, []);

  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  // Placeholder functions for dialogs if a child tab needs to trigger them
  // In a full implementation, these would be passed down via Context or props
  // For now, the tabs handle their own rendering for the most part.

  return (
    <Box sx={{ display: 'flex', width: '100%', gap: '8px', p: '8px', backgroundColor: '#f8f9fa', height: 'calc(100vh - 65px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      
      {/* LEFT COLUMN - Main Claim Content (~75%) */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ position: 'relative', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <ClaimManagementHeader />
          <ClaimTabBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            tabCounts={tabCounts} 
          />
          <Box sx={{ mt: 2 }}>
            <ActiveTabComponent 
              onOpenEdit={(claim) => { setEditingClaim(claim); setOpenEditDialog(true); }}
              onOpenAttach={(claim) => { setAttachingClaim(claim); setOpenAttachDialog(true); }}
              onOpenPreview={(claim) => { setPreviewingClaim(claim); setOpenPreviewDialog(true); }}
            />
          </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT COLUMN - RightPanel component (~25%) */}
      {rightPanelOpen ? (
        <Box sx={{ flex: '0 0 320px', width: '320px', minWidth: '320px', maxWidth: '320px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <IconButton onClick={() => setRightPanelOpen(false)} sx={{ color: 'text.secondary', p: 0, '&:hover': { color: 'primary.main' } }}>
              <KeyboardDoubleArrowRightIcon fontSize="small" />
            </IconButton>
          </Box>
          <RightPanel hideAppointmentShortlist={true} />
        </Box>
      ) : (
        <Box sx={{ height: '100%', flexShrink: 0 }}>
          <RightPanelCollapsed onExpand={() => setRightPanelOpen(true)} hideAppointmentShortlist={true} />
        </Box>
      )}

      {/* Shared Dialogs */}
      <ClaimsDialogs
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        editingClaim={editingClaim}
        setEditingClaim={setEditingClaim}
        openAttachDialog={openAttachDialog}
        setOpenAttachDialog={setOpenAttachDialog}
        attachingClaim={attachingClaim}
        openPreviewDialog={openPreviewDialog}
        setOpenPreviewDialog={setOpenPreviewDialog}
        previewingClaim={previewingClaim}
        activeTab={activeTab}
        handleSaveEdit={() => setOpenEditDialog(false)}
        handleSaveAttach={async (data) => {
          if (data.newFiles && data.newFiles.length > 0 && attachingClaim?.id) {
            try {
              await claimService.uploadAttachments(attachingClaim.id, data.newFiles);
              // Trigger a reload of the tab data (the tab will re-fetch if we dispatch an event, or we can just reload the page)
              window.dispatchEvent(new CustomEvent('refresh-claims'));
            } catch (err) {
              console.error('Failed to upload attachments', err);
              alert('Failed to upload attachments. Please try again.');
            }
          }
          setOpenAttachDialog(false);
        }}
      />

    </Box>
  );
};

export default ClaimsListPage;
