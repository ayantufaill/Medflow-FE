import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
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
import ClaimAttachmentsDialog from '../../components/claims/attachments/ClaimAttachmentsDialog';
import ClaimPrintPreviewDialog from '../../components/claims/ClaimPrintPreviewDialog';
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
    <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f7f8fa' }}>
      
      {/* LEFT COLUMN - Main Claim Content (~75%) */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flex: 1, overflowY: 'auto' }}>
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

      {/* RIGHT COLUMN - RightPanel component (~25%) */}
      <Box sx={{ width: 320, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <RightPanel />
      </Box>

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
        handleSaveAttach={() => setOpenAttachDialog(false)}
      />

    </Box>
  );
};

export default ClaimsListPage;
