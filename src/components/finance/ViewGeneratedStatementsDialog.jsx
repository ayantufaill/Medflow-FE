import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewGeneratedStatementsDialog = ({ onClose, batches: initialBatches }) => {
  const [batches, setBatches] = useState(initialBatches || [
    {
      id: 1,
      date: '07/15/2022',
      totalCreated: 1,
      sentViaMyChart: 1,
      manualCreated: 0,
      details: {
        withoutEmails: 0,
        withMcAccounts: 0,
        withEmails: 0,
      },
      myChartSent: {
        count: 1,
        successMessage: '1 e-statements successfully sent!',
      },
      manualPdfs: null,
    },
    {
      id: 2,
      date: '07/15/2022',
      totalCreated: 3,
      sentViaMyChart: 0,
      manualCreated: 3,
      details: {
        withoutEmails: 0,
        withMcAccounts: 3,
        withEmails: 0,
      },
      myChartSent: null,
      manualPdfs: [
        {
          id: 'm1',
          label: '3 manual statements for pts with My Chart accounts',
          hasMyChart: true,
        }
      ],
    },
    {
      id: 3,
      date: '07/14/2022',
      totalCreated: 4,
      sentViaMyChart: 0,
      manualCreated: 4,
      details: {
        withoutEmails: 1,
        withMcAccounts: 2,
        withEmails: 1,
      },
      myChartSent: null,
      manualPdfs: [
        {
          id: 'm2',
          label: '1 manual statements for pts without emails',
          hasMyChart: false, // Doesn't have MyChart and doesn't have email -> no promo
        },
        {
          id: 'm3',
          label: '2 manual statements for pts with My Chart accounts',
          hasMyChart: true,
        },
        {
          id: 'm4',
          label: '1 manual statements for pts with emails!',
          hasMyChart: false, // Has email but no MyChart -> shows Create & Send button
          showCreateSend: true,
        }
      ],
    }
  ]);

  const handleCreateAndSend = (batchId, pdfId) => {
    // Simulate creating MyChart account and sending e-statements
    setBatches(prev => prev.map(batch => {
      if (batch.id !== batchId) return batch;

      // Update manualPdfs to remove the one that was converted
      const updatedPdfs = batch.manualPdfs.filter(pdf => pdf.id !== pdfId);
      
      // Update counts
      const updatedSentViaMyChart = batch.sentViaMyChart + 1;
      const updatedManualCreated = batch.manualCreated - 1;
      const updatedDetails = {
        ...batch.details,
        withEmails: Math.max(0, batch.details.withEmails - 1),
      };

      // Add to myChartSent
      const updatedMyChartSent = {
        count: updatedSentViaMyChart,
        successMessage: `${updatedSentViaMyChart} e-statements successfully sent!`,
      };

      return {
        ...batch,
        sentViaMyChart: updatedSentViaMyChart,
        manualCreated: updatedManualCreated,
        details: updatedDetails,
        myChartSent: updatedMyChartSent,
        manualPdfs: updatedPdfs.length > 0 ? updatedPdfs : null,
      };
    }));
  };

  const headerBackground = '#3b5f9a';
  const downloadButtonBg = '#3b5f9a';
  const createSendButtonBg = '#d4c197';
  const createSendButtonHover = '#c5b396';

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Title Header */}
      <DialogTitle sx={{ boxSizing: 'border-box', px: '25px', py: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd', m: 0, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Generated Statements
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748B' }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
        {/* Column Headers */}
        <Box sx={{ display: 'flex', borderBottom: '1px solid #e2e8f0', bgcolor: '#fff', py: 1.5, px: 3, position: 'sticky', top: 0, zIndex: 10 }}>
          <Typography sx={{ width: '25%', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
            Created On
          </Typography>
          <Typography sx={{ width: '37.5%', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', pl: 2 }}>
            Statements Sent Via MyChart
          </Typography>
          <Typography sx={{ width: '37.5%', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', pl: 2 }}>
            Manual Statements PDF
          </Typography>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {batches.map((batch) => (
          <Box
            key={batch.id}
            sx={{
              display: 'flex',
              bgcolor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              p: 2,
              minHeight: '140px',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {/* Created On Section */}
            <Box sx={{ width: '25%', pr: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#333', mb: 1 }}>
                {batch.date}
              </Typography>
              {batch.status === 'Pending' ? (
                <Typography sx={{ fontSize: '0.8rem', color: '#ff9800', fontWeight: 600 }}>
                  Pending
                </Typography>
              ) : (
                <>
                  <Typography sx={{ fontSize: '0.8rem', color: '#555', mb: 0.5 }}>
                    {batch.totalCreated} total statements created
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 0.25 }}>
                    {batch.sentViaMyChart} statement/s sent via My Chart
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 0.25 }}>
                    manual statement/s created
                  </Typography>
                  <Box sx={{ pl: 1.5, borderLeft: '1px solid #ccc', mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#888', mb: 0.25 }}>
                      {batch.details.withoutEmails} statement/s for pts without emails
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#888', mb: 0.25 }}>
                      {batch.details.withMcAccounts} statement/s for pts with MC accounts
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                      {batch.details.withEmails} statement/s for pts with emails
                    </Typography>
                  </Box>
                </>
              )}
            </Box>

            {/* Statements Sent Via MyChart Section */}
            <Box sx={{ width: '37.5%', px: 2, borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              {batch.status === 'Pending' ? (
                <Box sx={{ flexGrow: 1 }} />
              ) : batch.myChartSent ? (
                <Box
                  sx={{
                    border: '1px solid #b3cbdc',
                    borderRadius: '4px',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#f4f8fa',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#4a70b0', fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1 }}>
                      ︾
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#4a70b0', fontWeight: 500 }}>
                      {batch.myChartSent.successMessage}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: downloadButtonBg,
                      color: '#fff',
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      py: 0.25,
                      px: 1.5,
                      '&:hover': { bgcolor: '#2e4a78' },
                    }}
                  >
                    Download all
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: '1px solid #b3cbdc',
                    borderRadius: '4px',
                    p: 1.5,
                    bgcolor: '#fff',
                    color: '#666',
                    fontSize: '0.8rem',
                  }}
                >
                  None
                </Box>
              )}
            </Box>

            {/* Manual Statements PDF Section */}
            <Box sx={{ width: '37.5%', pl: 2, borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {batch.status === 'Pending' ? (
                <Box sx={{ flexGrow: 1 }} />
              ) : batch.manualPdfs && batch.manualPdfs.length > 0 ? (
                batch.manualPdfs.map((pdf) => (
                  <Box key={pdf.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box
                      sx={{
                        border: '1px solid #b3cbdc',
                        borderRadius: '4px',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#f4f8fa',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#4a70b0', fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1 }}>
                          ︾
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#4a70b0', fontWeight: 500 }}>
                          {pdf.label}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: downloadButtonBg,
                          color: '#fff',
                          fontSize: '0.7rem',
                          textTransform: 'none',
                          boxShadow: 'none',
                          py: 0.25,
                          px: 1.5,
                          '&:hover': { bgcolor: '#2e4a78' },
                        }}
                      >
                        Download all
                      </Button>
                    </Box>
                    
                    {/* Create & Send Promo block if patient has email but no MyChart */}
                    {pdf.showCreateSend && (
                      <Box
                        sx={{
                          border: '1px solid #e2d2b5',
                          borderRadius: '4px',
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: '#fbf9f4',
                          mt: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: '0.72rem', color: '#8d7857', maxWidth: '70%', lineHeight: 1.25 }}>
                          Would you like to create a MyChart account for all these patients and send them e-statements instead?
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleCreateAndSend(batch.id, pdf.id)}
                          sx={{
                            bgcolor: createSendButtonBg,
                            color: '#fff',
                            fontSize: '0.7rem',
                            textTransform: 'none',
                            boxShadow: 'none',
                            py: 0.5,
                            px: 1.5,
                            '&:hover': { bgcolor: createSendButtonHover },
                          }}
                        >
                          Create & Send
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    border: '1px solid #b3cbdc',
                    borderRadius: '4px',
                    p: 1.5,
                    bgcolor: '#fff',
                    color: '#666',
                    fontSize: '0.8rem',
                  }}
                >
                  None
                </Box>
              )}
            </Box>
          </Box>
        ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewGeneratedStatementsDialog;
