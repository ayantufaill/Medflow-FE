import React from 'react';
import { Box } from '@mui/material';

import QuickPaymentRequestDialog from './QuickPaymentRequestDialog';
import InsurancePaymentDialog from './InsurancePaymentDialog';
import CashPlusMenu from './CashPlusMenu';
import AddPaymentDialog from './AddPaymentDialog';
import AccountNotesDialog from './AccountNotesDialog';
import InvoiceModal from './InvoiceModal';
import PatientPrintOptions from './PatientPrintOptions';
import PrintReceiptDialog from './PrintReceiptDialog';
import ItemizedReceiptPreview from './ItemizedReceiptPreview';
import SimpleStatementDialog from './SimpleStatementDialog';
import DetailedStatementDialog from './DetailedStatementDialog';
import LateFeeDialog from './LateFeeDialog';
import ManualClaimDialog from './ManualClaimDialog';

const DialogWrapper = ({ children, onClose, maxWidth = '1200px' }) => (
  <Box 
    sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      bgcolor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1300
    }}
    onClick={onClose}
  >
    <Box 
      sx={{ 
        maxWidth: maxWidth, 
        width: '90%',
        bgcolor: '#fff',
        borderRadius: '8px',
        overflow: 'visible',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Box>
  </Box>
);

const FinanceDialogManager = ({
  patient,
  showQuickPayment, setShowQuickPayment,
  showInsurancePayment, setShowInsurancePayment, handleInsurancePaymentSave,
  showAddPayment, setShowAddPayment, handlePaymentApply,
  cashPlusAnchorEl, handleCashPlusClose, handleCashPlusSelect,
  showManualClaim, setShowManualClaim,
  showLateFee, setShowLateFee, selectedAdjustment, handleAddLateFee,
  showAccountNotes, setShowAccountNotes,
  showNewInvoice, setShowNewInvoice, handleInvoiceModalSave,
  printAnchorEl, handlePrintClose, handlePrintSelect,
  showPrintReceipt, setShowPrintReceipt, isFamilyReceipt,
  showItemizedReceipt, setShowItemizedReceipt,
  showSimpleStatement, setShowSimpleStatement,
  showDetailedStatement, setShowDetailedStatement
}) => {
  return (
    <>
      {showQuickPayment && (
        <DialogWrapper onClose={() => setShowQuickPayment(false)} maxWidth="500px">
          <QuickPaymentRequestDialog onClose={() => setShowQuickPayment(false)} />
        </DialogWrapper>
      )}

      {showInsurancePayment && (
        <DialogWrapper onClose={() => setShowInsurancePayment(false)}>
          <InsurancePaymentDialog patient={patient} onClose={() => setShowInsurancePayment(false)} onSave={handleInsurancePaymentSave} />
        </DialogWrapper>
      )}

      {showAddPayment && (
        <DialogWrapper onClose={() => setShowAddPayment(false)}>
          <AddPaymentDialog patient={patient} onClose={() => setShowAddPayment(false)} onPaymentApply={handlePaymentApply} />
        </DialogWrapper>
      )}

      <CashPlusMenu anchorEl={cashPlusAnchorEl} onClose={handleCashPlusClose} onSelect={handleCashPlusSelect} />

      {showManualClaim && (
        <DialogWrapper onClose={() => setShowManualClaim(false)}>
          <ManualClaimDialog patient={patient} onClose={() => setShowManualClaim(false)} />
        </DialogWrapper>
      )}

      {showLateFee && (
        <DialogWrapper onClose={() => setShowLateFee(false)}>
          <LateFeeDialog onClose={() => setShowLateFee(false)} adjustmentType={selectedAdjustment?.label} onAddFee={handleAddLateFee} />
        </DialogWrapper>
      )}

      {showAccountNotes && (
        <DialogWrapper onClose={() => setShowAccountNotes(false)} maxWidth="800px">
          <AccountNotesDialog onClose={() => setShowAccountNotes(false)} />
        </DialogWrapper>
      )}

      {showNewInvoice && (
        <DialogWrapper onClose={() => setShowNewInvoice(false)}>
          <InvoiceModal patient={patient} onSave={handleInvoiceModalSave} onClose={() => setShowNewInvoice(false)} />
        </DialogWrapper>
      )}

      <PatientPrintOptions anchorEl={printAnchorEl} onClose={handlePrintClose} onSelect={handlePrintSelect} />

      {showPrintReceipt && (
        <DialogWrapper onClose={() => setShowPrintReceipt(false)} maxWidth="800px">
          <PrintReceiptDialog isFamilyReceipt={isFamilyReceipt} patient={patient} onClose={() => setShowPrintReceipt(false)} />
        </DialogWrapper>
      )}

      {showItemizedReceipt && (
        <DialogWrapper onClose={() => setShowItemizedReceipt(false)} maxWidth="800px">
          <ItemizedReceiptPreview onClose={() => setShowItemizedReceipt(false)} />
        </DialogWrapper>
      )}

      {showSimpleStatement && (
        <DialogWrapper onClose={() => setShowSimpleStatement(false)} maxWidth="800px">
          <SimpleStatementDialog onClose={() => setShowSimpleStatement(false)} />
        </DialogWrapper>
      )}

      {showDetailedStatement && (
        <DialogWrapper onClose={() => setShowDetailedStatement(false)} maxWidth="800px">
          <DetailedStatementDialog onClose={() => setShowDetailedStatement(false)} />
        </DialogWrapper>
      )}
    </>
  );
};

export default FinanceDialogManager;
