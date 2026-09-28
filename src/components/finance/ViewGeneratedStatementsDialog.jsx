import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import generatedStatementsIcon from '../../assets/reportsicon/generated statements.svg';
import sentIcon from '../../assets/reportsicon/sent.svg';
import statementIcon from '../../assets/reportsicon/statement.svg';
import arrowIcon from '../../assets/reportsicon/arrow.svg';

const ViewGeneratedStatementsDialog = ({ onClose, batches: initialBatches }) => {
  const [searchDate, setSearchDate] = useState('');
  const [batches, setBatches] = useState(initialBatches || [
    {
      id: 1,
      date: '07/15/2022',
      status: 'Pending',
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
      id: 3,
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
      id: 4,
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

  const downloadBatchFile = (batch, type) => {
    let content = `Batch Date: ${batch.date}\n`;
    content += `Total Statements: ${batch.totalCreated || 0}\n`;
    content += `Type: ${type}\n\n`;

    if (batch.patients && batch.patients.length > 0) {
      content += `Patients Included in this Batch:\n`;
      batch.patients.forEach(pt => {
        content += `- ${pt}\n`;
      });
    } else {
      content += `No specific patients recorded.\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `statements_${type.replace(/\s+/g, '_').toLowerCase()}_${batch.date.replace(/\//g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (batch, type) => {
    downloadBatchFile(batch, type);
  };

  const handleDownloadAllBatches = () => {
    batchesToDisplay.forEach(batch => {
      if (batch.myChartSent) {
        downloadBatchFile(batch, 'MyChart_Statements');
      }
      if (batch.manualPdfs && batch.manualPdfs.length > 0) {
        downloadBatchFile(batch, 'Manual_PDFs');
      }
    });
  };

  const handleExportLog = () => {
    let content = `Statement Log Export\nExport Date: ${new Date().toLocaleDateString()}\n\n`;
    batchesToDisplay.forEach(batch => {
      content += `Date: ${batch.date} | Total: ${batch.totalCreated || 0} | Status: ${batch.status || 'Completed'}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `statement_export_log_${new Date().toLocaleDateString().replace(/\//g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadButtonBg = '#2563eb'; // blue-600

  const batchesToDisplay = batches.filter(b => b.date.includes(searchDate));

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
          maxHeight: '90vh',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Title Header */}
      <DialogTitle sx={{
        boxSizing: 'border-box',
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        m: 0,
        flexShrink: 0
      }}>
        <TextField
          placeholder="Search by date..."
          variant="outlined"
          size="small"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          sx={{
            width: '260px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#fff',
              fontSize: '0.85rem',
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
            Showing <Box component="span" sx={{ fontWeight: 600, color: '#0f172a' }}>{batchesToDisplay.length}</Box> batches
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={handleExportLog}
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: '1.1rem !important' }} />}
            sx={{
              textTransform: 'none',
              color: '#334155',
              borderColor: '#e2e8f0',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                backgroundColor: '#f8fafc',
                borderColor: '#cbd5e1'
              }
            }}
          >
            Export log
          </Button>

          <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
            <CloseIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', flexGrow: 1, overflow: 'hidden' }}>
        {/* Column Headers */}
        <Box sx={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#fff',
          py: 2,
          px: 3,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Typography sx={{ width: '25%', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>
            CREATED ON
          </Typography>
          <Box sx={{ width: '37.5%', display: 'flex', alignItems: 'center', gap: 1, pl: 2 }}>
            <Box component="img" src={sentIcon} alt="Sent" sx={{ width: 18, height: 18 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>
              STATEMENTS SENT VIA MYCHART
            </Typography>
          </Box>
          <Box sx={{ width: '37.5%', display: 'flex', alignItems: 'center', gap: 1, pl: 2 }}>
            <Box component="img" src={statementIcon} alt="Statement" sx={{ width: 18, height: 18 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>
              MANUAL STATEMENTS PDF
            </Typography>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {batchesToDisplay.map((batch) => {
            const isPending = batch.status === 'Pending';
            const borderStyle = isPending ? '1px solid #fbd38d' : '1px solid #e2e8f0';
            const boxBorder = isPending ? '1px dashed #cbd5e1' : '1px solid #e2e8f0';

            return (
              <Box
                key={batch.id}
                sx={{
                  display: 'flex',
                  bgcolor: '#fff',
                  border: borderStyle,
                  borderRadius: '8px',
                  p: 2.5,
                  minHeight: '140px',
                  flexShrink: 0,
                  boxShadow: isPending ? '0 0 0 1px #fef3c7' : '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                {/* Created On Section */}
                <Box sx={{ width: '25%', pr: 3 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', mb: 1 }}>
                    {batch.date}
                  </Typography>

                  {isPending ? (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: '#fffbeb', px: 1.5, py: 0.5, borderRadius: '12px' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
                        Pending
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Typography sx={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        {batch.totalCreated} total statements created
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 0.5 }}>
                        {batch.sentViaMyChart} statement/s sent via My Chart
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 0.5 }}>
                        manual statement/s created
                      </Typography>
                      <Box sx={{ pl: 2, borderLeft: '2px solid #e2e8f0', mt: 0.5, py: 0.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 0.5 }}>
                          {batch.details?.withoutEmails || 0} statement/s for pts without emails
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 0.5 }}>
                          {batch.details?.withMcAccounts || 0} statement/s for pts with MC accounts
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {batch.details?.withEmails || 0} statement/s for pts with emails
                        </Typography>
                      </Box>
                      {batch.patients && batch.patients.length > 0 && (
                        <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                            Generated for:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {batch.patients.map((pt, idx) => (
                              <Typography key={idx} sx={{ fontSize: '0.7rem', color: '#3b82f6', bgcolor: '#eff6ff', px: 0.75, py: 0.25, borderRadius: '4px' }}>
                                {pt}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                {/* Statements Sent Via MyChart Section */}
                <Box sx={{ width: '37.5%', px: 2.5, borderLeft: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  {isPending ? (
                    <Box
                      sx={{
                        border: boxBorder,
                        borderRadius: '8px',
                        p: 2,
                        bgcolor: '#fafafa',
                        color: '#64748b',
                        fontSize: '0.85rem',
                        height: '100%'
                      }}
                    >
                      None
                    </Box>
                  ) : batch.myChartSent ? (
                    <Box
                      sx={{
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#f8fafc',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box component="img" src={arrowIcon} alt="Arrow" sx={{ width: 14, height: 14 }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                          {batch.myChartSent.successMessage}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleDownload(batch, 'MyChart_Statements')}
                        sx={{
                          bgcolor: downloadButtonBg,
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: 'none',
                          py: 0.5,
                          px: 2,
                          borderRadius: '6px',
                          '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
                        }}
                      >
                        Download all
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: '1px dashed #cbd5e1',
                        borderRadius: '8px',
                        p: 2,
                        bgcolor: '#fafafa',
                        color: '#64748b',
                        fontSize: '0.85rem',
                        height: '100%'
                      }}
                    >
                      None
                    </Box>
                  )}
                </Box>

                {/* Manual Statements PDF Section */}
                <Box sx={{ width: '37.5%', pl: 2.5, borderLeft: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {isPending ? (
                    <Box
                      sx={{
                        border: boxBorder,
                        borderRadius: '8px',
                        p: 2,
                        bgcolor: '#fafafa',
                        color: '#64748b',
                        fontSize: '0.85rem',
                        height: '100%'
                      }}
                    >
                      None
                    </Box>
                  ) : batch.manualPdfs && batch.manualPdfs.length > 0 ? (
                    batch.manualPdfs.map((pdf) => (
                      <Box key={pdf.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box
                          sx={{
                            border: '1px solid #f1f5f9',
                            borderRadius: '8px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: '#f8fafc',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box component="img" src={arrowIcon} alt="Arrow" sx={{ width: 14, height: 14 }} />
                            <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                              {pdf.label}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleDownload(batch, 'Manual_PDFs')}
                            sx={{
                              bgcolor: downloadButtonBg,
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'none',
                              boxShadow: 'none',
                              py: 0.5,
                              px: 2,
                              borderRadius: '6px',
                              '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
                            }}
                          >
                            Download all
                          </Button>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        border: '1px dashed #cbd5e1',
                        borderRadius: '8px',
                        p: 2,
                        bgcolor: '#fafafa',
                        color: '#64748b',
                        fontSize: '0.85rem',
                        height: '100%'
                      }}
                    >
                      None
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: '16px 24px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        bgcolor: '#f8fafc',
        m: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src={generatedStatementsIcon} alt="Generated Statements" sx={{ width: 20, height: 20 }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Generated Statements
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
            Statements are retained for 24 months.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: '#e2e8f0',
              color: '#334155',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              px: 3,
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f1f5f9' }
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadAllBatches}
            sx={{
              backgroundColor: '#2563eb',
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
            }}
          >
            Download all batches
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewGeneratedStatementsDialog;

