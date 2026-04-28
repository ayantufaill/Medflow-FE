import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button
} from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { fontSize, fontWeight } from '../../constants/styles';
import StatementHeader from './StatementHeader';
import StatementInfo from './StatementInfo';
import TransactionTable from './TransactionTable';
import StatementSummary from './StatementSummary';
import StatementFooter from './StatementFooter';

const DetailedStatement = ({ onClose }) => {
  const contentRef = useRef(null);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState('');
  
  const primaryBlue = '#40548e';
  const lightBlue = '#abb8d3';
  const textDarkBlue = '#40548e';
  const headerBlue = '#abb8d3';
  const rowLightBlue = '#f0f4fa';

  const handleClose = () => {
    console.log('Close button clicked, onClose prop:', onClose);
    if (onClose) {
      console.log('Calling onClose...');
      onClose();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const content = contentRef.current;
    if (content) {
      // Get all styles from the current document
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Patient Account Statement</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                margin: 0; 
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @media print { 
                body { 
                  margin: 0; 
                  padding: 0; 
                }
                @page {
                  margin: 0.5cm;
                }
              }
              ${styles}
            </style>
          </head>
          <body>
            ${content.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Mock data - replace with API data
  const patientInfo = {
    name: 'test test',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    fullName: '',
    signature: ''
  };

  const statementInfo = {
    patientName: 'test test',
    statementDate: '04/15/2026'
  };

  const outstandingInfo = {
    outstanding: '$0.00',
    insuranceEstimate: '$0.00',
    yourPortion: '$0.00',
    enclosedAmount: ''
  };

  const transactions = [
    {
      id: 1,
      date: '04/14/2026',
      description: 'Invoice #24636: $100.00',
      descriptionSub: 'L5001 Broken appt',
      provider: 'Provider Name',
      providerSub: 'insurance est.',
      amount: '$100.00',
      amountSub: '$0.00',
      credit: '',
      balance: '$100.00',
      bgcolor: rowLightBlue
    },
    {
      id: 2,
      date: '04/14/2026',
      description: 'Credit Adjustment #24640 Un-Collected',
      descriptionSub: '',
      provider: '',
      providerSub: '',
      amount: '',
      amountSub: '',
      credit: '$100.00',
      balance: '$0.00',
      bgcolor: 'transparent'
    }
  ];

  const outstandingBalance = '$0.00';

  const summaryData = [
    { label: 'Total Charges', value: '$100.00' },
    { label: 'Total Patient Payments', value: '$0.00' },
    { label: 'Total Insurance Payments', value: '$0.00' },
    { label: 'Total Adjustment', value: '$100.00' },
    { label: 'Outstanding Balance', value: '$0.00' }
  ];

  const insuranceSubtotals = [
    { label: 'Estimated Remaining Insurance', value: '$0.00' },
    { label: 'Estimated Remaining Insurance Adjustment', value: '$0.00' }
  ];

  const yourPortion = '$0.00';

  const agingData = [
    { label: 'Balance 0-30 days', value: '$0.00' },
    { label: '>30 days', value: '$0.00' },
    { label: '>60 days', value: '$0.00' },
    { label: '>90 days', value: '$0.00' },
    { label: 'Account Credit', value: '$0.00' }
  ];

  const appointments = [
    { label: 'Next Scheduled Treatment Appointment', value: 'No Scheduled Appointment' },
    { label: 'Next Scheduled Hygiene Appointment', value: 'No Scheduled Appointment' }
  ];

  return (
    <Box ref={contentRef} sx={{ bgcolor: '#fff', width: '100%', p: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* Header Bar */}
      <Box sx={{ bgcolor: primaryBlue, color: '#fff', py: 1, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.regular }}>Patient Account Statement</Typography>
      </Box>

      <Box sx={{ px: 1, py: 2 }}>
        {/* Top Section */}
        <StatementHeader 
          patientInfo={patientInfo}
          statementInfo={statementInfo}
          outstandingInfo={outstandingInfo}
        />

        {/* Perforation Line */}
        <Box sx={{ position: 'relative', my: 5, borderTop: '1px dashed #bbb', textAlign: 'center' }}>
           <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#777', fontSize: fontSize.xs }}>
            Please detach and return this part of the statement with your payment to ensure proper processing
          </Typography>
          <ContentCutIcon sx={{ position: 'absolute', left: 0, top: -12, color: '#bbb', fontSize: 20 }} />
          <Typography variant="caption" sx={{ display: 'block', color: '#777', fontSize: fontSize.xs }}>
            Please keep this part of the statement for your records
          </Typography>
        </Box>

        {/* Middle Section: Info Box */}
        <StatementInfo statementInfo={statementInfo} />

        {/* Main Transaction Table */}
        <TransactionTable 
          transactions={transactions}
          outstandingBalance={outstandingBalance}
        />

        {/* Summary & Aging Boxes */}
        <StatementSummary 
          summaryData={summaryData}
          insuranceSubtotals={insuranceSubtotals}
          yourPortion={yourPortion}
          agingData={agingData}
        />

        {/* Appointments & Notes */}
        <StatementFooter 
          appointments={appointments}
          notes={notes}
          showNotesInput={showNotesInput}
          onNotesChange={(e) => setNotes(e.target.value)}
          onSaveNotes={() => setShowNotesInput(false)}
          onEditNotes={() => setShowNotesInput(true)}
          onCloseNotes={() => setShowNotesInput(false)}
        />

        {/* Action Buttons */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            sx={{ 
              color: textDarkBlue, 
              borderColor: textDarkBlue,
              minWidth: 100
            }}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: textDarkBlue,
              color: '#fff',
              minWidth: 100
            }}
            onClick={() => setShowNotesInput(true)}
          >
            Add Notes
          </Button>
          <Button 
            variant="outlined" 
            sx={{ 
              color: textDarkBlue, 
              borderColor: textDarkBlue,
              minWidth: 100
            }}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailedStatement;
