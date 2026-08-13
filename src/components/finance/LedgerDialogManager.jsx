import React from 'react';
import { Box, Dialog, DialogContent, Menu, MenuItem } from '@mui/material';

import BackdateTransactionPopup from './BackdateTransactionPopup';
import PrintOptionsDropdown from './PrintOptionsDropdown';
import AdjustmentOptionsDropdown from './AdjustmentOptionsDropdown';
import CreditSubtractionDialog from './CreditSubtractionDialog';
import DebitAdjustmentDialog from './DebitAdjustmentDialog';
import MembershipAdjustmentDialog from './MembershipAdjustmentDialog';
import InsuranceWriteOffDialog from './InsuranceWriteOffDialog';
import CourtesyCreditComponent from './CourtesyCreditComponent';
import UndoConfirmationDialog from './UndoConfirmationDialog';
import VoidConfirmationDialog from './VoidConfirmationDialog';
import SimpleStatement from './SimpleStatement';
import DetailedStatement from './DetailedStatement';
import EditDeposit from './EditDeposit';
import InvoiceModal from './InvoiceModal';
import TransferCreditConfirmationDialog from './TransferCreditConfirmationDialog';
import EditInvoiceDetailsDialog from './EditInvoiceDetailsDialog';
import ClaimAttachmentsDialog from '../claims/attachments/ClaimAttachmentsDialog';

const LedgerDialogManager = ({
  anchorEl, setAnchorEl, handleBackdateDone,
  printAnchorEl, setPrintAnchorEl, handlePrintSelect,
  adjAnchorEl, setAdjAnchorEl, handleAdjustmentSelect, adjItem,
  showAdjustDialog, setShowAdjustDialog,
  showDebitDialog, setShowDebitDialog,
  showMembershipDialog, setShowMembershipDialog,
  showWriteOffDialog, setShowWriteOffDialog,
  showVoidDialog, handleVoidCancel, handleVoidConfirm, voidTarget,
  showCourtesyCredit, handleCourtesyCreditCancel, handleCourtesyCreditSave, editTarget,
  showUndoDialog, handleUndoCancel, handleUndoConfirm,
  showSimpleStatement, setShowSimpleStatement,
  showDetailedStatement, setShowDetailedStatement,
  showEditDeposit, handleEditDepositCancel, handleEditDepositSave, editDepositTarget,
  showInvoiceModal, handleInvoiceModalCancel, handleInvoiceModalSave, invoiceModalData,
  magicStickAnchorEl, setMagicStickAnchorEl,
  showTransferConfirmation, setShowTransferConfirmation, handleTransferConfirm,
  showEditInvoice, setShowEditInvoice, editInvoiceTarget,
  showAttachDialog, setShowAttachDialog, attachTarget,
  printItem
}) => (
  <>
    {/* ── Popovers / Dropdowns ── */}
    <BackdateTransactionPopup open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} onDone={handleBackdateDone} />
    <PrintOptionsDropdown anchorEl={printAnchorEl} open={Boolean(printAnchorEl)} onClose={() => setPrintAnchorEl(null)} onSelect={handlePrintSelect} />
    <AdjustmentOptionsDropdown anchorEl={adjAnchorEl} open={Boolean(adjAnchorEl)} onClose={() => setAdjAnchorEl(null)} onSelect={handleAdjustmentSelect} />

    {/* Adjustment sub-dialogs */}
    {[
      { open: showAdjustDialog,     onClose: () => setShowAdjustDialog(false),     Component: CreditSubtractionDialog },
      { open: showDebitDialog,      onClose: () => setShowDebitDialog(false),      Component: DebitAdjustmentDialog },
      { open: showMembershipDialog, onClose: () => setShowMembershipDialog(false), Component: MembershipAdjustmentDialog },
      { open: showWriteOffDialog,   onClose: () => setShowWriteOffDialog(false),   Component: InsuranceWriteOffDialog },
    ].map(({ open, onClose, Component }, i) => (
      <Dialog key={i} open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ zIndex: 130000 }} PaperProps={{ sx: { borderRadius: '14px', overflow: 'hidden' } }}>
        <DialogContent sx={{ p: 0 }}><Component onClose={onClose} editTarget={adjItem || editTarget} /></DialogContent>
      </Dialog>
    ))}

    <VoidConfirmationDialog open={showVoidDialog} onClose={handleVoidCancel} onConfirm={handleVoidConfirm} voidTarget={voidTarget} />

    <Dialog open={showCourtesyCredit} onClose={handleCourtesyCreditCancel} maxWidth="md" fullWidth sx={{ zIndex: 130000 }}
      PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden', bgcolor: 'transparent', boxShadow: 'none' } }}>
      <DialogContent sx={{ p: 0 }}>
        <CourtesyCreditComponent adjustmentData={editTarget} onSave={handleCourtesyCreditSave} onCancel={handleCourtesyCreditCancel} showAmountSection={false} />
      </DialogContent>
    </Dialog>

    <UndoConfirmationDialog open={showUndoDialog} onClose={handleUndoCancel} onConfirm={handleUndoConfirm} />

    {/* Statement dialogs */}
    {[
      { open: showSimpleStatement,   onClose: () => setShowSimpleStatement(false),   Component: SimpleStatement },
      { open: showDetailedStatement, onClose: () => setShowDetailedStatement(false), Component: DetailedStatement },
    ].map(({ open, onClose, Component }, i) => (
      <Dialog key={i} open={open} onClose={onClose} maxWidth={false} fullWidth
        PaperProps={{ sx: { borderRadius: '14px', overflow: 'hidden', maxHeight: '90vh', margin: 0, bgcolor: '#f5f5f5', width: '880px', maxWidth: '90vw' } }}
        sx={{ zIndex: 130000, '& .MuiDialog-paper': { margin: 0, maxWidth: '100%' } }}>
        <DialogContent sx={{ p: 0, m: 0, bgcolor: '#f5f5f5' }}><Component onClose={onClose} printItem={printItem} /></DialogContent>
      </Dialog>
    ))}

    <Dialog open={showEditDeposit} onClose={handleEditDepositCancel} maxWidth={false} sx={{ zIndex: 130000 }}
      PaperProps={{ sx: { minWidth: 220, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', bgcolor: '#fff', borderRadius: '4px', overflow: 'hidden' } }}>
      <DialogContent sx={{ p: 0 }}>
        <EditDeposit depositData={editDepositTarget} onSave={handleEditDepositSave} onCancel={handleEditDepositCancel} />
      </DialogContent>
    </Dialog>

    <Dialog open={showInvoiceModal} onClose={handleInvoiceModalCancel} maxWidth={false} fullWidth
      sx={{ zIndex: 130000 }}
      PaperProps={{ sx: { borderRadius: '14px', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #ccc' } }}>
      <DialogContent sx={{ p: 0 }}>
        <InvoiceModal invoiceData={invoiceModalData} onSave={handleInvoiceModalSave} onCancel={handleInvoiceModalCancel} />
      </DialogContent>
    </Dialog>

    <Menu anchorEl={magicStickAnchorEl} open={Boolean(magicStickAnchorEl)} onClose={() => setMagicStickAnchorEl(null)}
      PaperProps={{ sx: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #eef2ff', '& .MuiMenuItem-root': { fontSize: '12px', fontWeight: 500, color: '#444', py: 1 } } }}>
      <MenuItem onClick={() => { setMagicStickAnchorEl(null); setShowTransferConfirmation(true); }}>
        Transfer Outstanding To Patient
      </MenuItem>
    </Menu>

    <TransferCreditConfirmationDialog
      open={showTransferConfirmation}
      onClose={() => setShowTransferConfirmation(false)}
      onConfirm={handleTransferConfirm}
    />

    {showEditInvoice && (
      <Box
        sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 130000 }}
        onClick={() => setShowEditInvoice(false)}
      >
        <Box onClick={(e) => e.stopPropagation()}>
          <EditInvoiceDetailsDialog onClose={() => setShowEditInvoice(false)} invoiceId={editInvoiceTarget?.id} />
        </Box>
      </Box>
    )}

    {showAttachDialog && attachTarget && (
      <ClaimAttachmentsDialog
        open={showAttachDialog}
        attachingClaim={attachTarget}
        onClose={() => setShowAttachDialog(false)}
        onSave={async (data) => {
          if (data.newFiles && data.newFiles.length > 0 && attachTarget?.id) {
            try {
              const { claimService } = await import('../../services/claim.service');
              await claimService.uploadAttachments(attachTarget.id, data.newFiles);
              window.dispatchEvent(new CustomEvent('refresh-ledger'));
            } catch (err) {
              console.error('Failed to upload attachments', err);
              alert('Failed to upload attachments. Please try again.');
            }
          }
          setShowAttachDialog(false);
        }}
      />
    )}
  </>
);

export default LedgerDialogManager;
