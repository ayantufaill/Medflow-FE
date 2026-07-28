import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

const DepositSlipPreview = ({
  createdSlipDetails,
  previewPayments,
  previewTotal,
  filteredPatientPayments,
  filteredInsurancePayments,
  patientGroups,
  insuranceGroups,
  depositNote,
  setDepositNote,
  handlePrint,
  handleClear,
  formatMethodLabel
}) => {
  if (!createdSlipDetails) {
    return (
      <Box className="no-print">
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#2563eb' }}>
          Deposit slip preview:
        </Typography>
        
        {previewPayments.length === 0 ? (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>No payments match filters.</Typography>
            <Typography variant="caption" color="text.secondary">
              Adjust the date range or payment type filters to see pending deposits.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: '12px', borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL DEPOSIT AMOUNT</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#00c853', fontSize: '2rem', lineHeight: 1 }}>
                    ${previewTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL ITEM COUNT</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '2rem', color: '#000000', lineHeight: 1 }}>
                      {previewPayments.length}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                      ({filteredPatientPayments.length} pt, {filteredInsurancePayments.length} ins)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000' }}>Included Items:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button startIcon={<DownloadIcon fontSize="small" />} variant="outlined" size="small" sx={{ textTransform: 'none', color: '#000000', borderColor: '#cbd5e1', borderRadius: '6px', px: 2, fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}>
                  CSV
                </Button>
                <Button startIcon={<PrintIcon fontSize="small" />} variant="outlined" size="small" sx={{ textTransform: 'none', color: '#000000', borderColor: '#cbd5e1', borderRadius: '6px', px: 2, fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}>
                  Print
                </Button>
              </Box>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #cbd5e1', borderRadius: '12px', maxHeight: 350, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ '& th': { backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: 500, py: 2, borderBottom: '1px solid #cbd5e1' } }}>
                    <TableCell>Patient/Carrier</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewPayments.map((p, idx) => (
                    <TableRow key={idx} sx={{ '& td': { fontSize: '0.85rem', py: 2, verticalAlign: 'middle', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }, backgroundColor: '#ffffff' }}>
                      <TableCell>{p.patientName || p.carrierName || 'Unknown Carrier'}</TableCell>
                      <TableCell>{formatMethodLabel(p.method)}</TableCell>
                      <TableCell>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>${p.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    );
  }

  // If createdSlipDetails exists, show the actual created slip
  return (
    <Box sx={{ fontFamily: 'sans-serif', color: '#333' }}>
      {/* Slip Header */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3b82f6', mb: 2 }}>
          Deposit slip:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
              Total Amount: ${createdSlipDetails.slip.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Bank account number:
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Bank account info: {createdSlipDetails.slip.bankAccountInfo || ''}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Patient Payments Grouped Section */}
      {createdSlipDetails.patientPayments.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', px: 2, py: 1, fontWeight: 700, mb: 2, width: 'fit-content' }}>
            Patient Payment:
          </Typography>

          {Object.entries(patientGroups).map(([method, items]) => {
            const groupTotal = items.reduce((sum, item) => sum + item.amount, 0);
            return (
              <Box key={method} sx={{ mb: 3, pl: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#64748b' }}>
                  {method}
                </Typography>
                <TableContainer sx={{ overflowX: 'auto', mb: 1, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Table size="small">
                    <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, py: 1 } }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Pay Type</TableCell>
                      <TableCell>Pay Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((p, idx) => (
                      <TableRow key={p.id} sx={{ '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' }, backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                        <TableCell>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</TableCell>
                        <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{p.patientName}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell>${p.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {/* Group Total */}
                    <TableRow sx={{ backgroundColor: '#ffffff' }}>
                      <TableCell colSpan={3} sx={{ borderBottom: 'none' }} />
                      <TableCell colSpan={1} sx={{ pt: 1.5, pb: 1.5, borderTop: '2px solid #e2e8f0', borderBottom: 'none' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textAlign: 'right', color: '#1e293b' }}>
                          Total: ${groupTotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Insurance Payments Grouped Section */}
      {createdSlipDetails.insurancePayments.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', px: 2, py: 1, fontWeight: 700, mb: 2, width: 'fit-content' }}>
            Insurance Payment:
          </Typography>

          {Object.entries(insuranceGroups).map(([method, items]) => {
            const groupTotal = items.reduce((sum, item) => sum + item.amount, 0);
            return (
              <Box key={method} sx={{ mb: 3, pl: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#64748b' }}>
                  {method}
                </Typography>
                <TableContainer sx={{ overflowX: 'auto', mb: 1, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Table size="small">
                    <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, py: 1 } }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Ins. Name</TableCell>
                      <TableCell>Pay Type</TableCell>
                      <TableCell>Pay Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((ins, idx) => (
                      <TableRow key={ins.id} sx={{ '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' }, backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                        <TableCell>{ins.date ? new Date(ins.date).toLocaleDateString() : '-'}</TableCell>
                        <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{ins.patientName || 'Unknown'}</TableCell>
                        <TableCell>{ins.carrierName || 'Unknown'}</TableCell>
                        <TableCell>{ins.method}</TableCell>
                        <TableCell>${ins.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {/* Group Total */}
                    <TableRow sx={{ backgroundColor: '#ffffff' }}>
                      <TableCell colSpan={4} sx={{ borderBottom: 'none' }} />
                      <TableCell colSpan={1} sx={{ pt: 1.5, pb: 1.5, borderTop: '2px solid #e2e8f0', borderBottom: 'none' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', textAlign: 'right', color: '#1e293b' }}>
                          Total: ${groupTotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Deposit Note Area */}
      <Box className="no-print" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#334155' }}>
          Deposit Note: <span style={{ fontWeight: 400, color: '#64748b' }}>(would appear on the deposit slip)</span>
        </Typography>
        <TextField
          multiline
          rows={3}
          fullWidth
          value={depositNote}
          onChange={(e) => setDepositNote(e.target.value)}
          placeholder="Enter note details here..."
          sx={{ 
            bgcolor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '0.875rem',
              '& fieldset': { borderColor: '#cbd5e1' },
              '&:hover fieldset': { borderColor: '#94a3b8' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
            }
          }}
        />
      </Box>

      {/* Print and Clear Action Buttons */}
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleClear}
          sx={{ 
            textTransform: "none", 
            borderRadius: "8px", 
            px: 2, 
            height: 30, 
            fontSize: "12px", 
            fontWeight: 600,
            borderColor: '#cbd5e1', 
            color: '#475569',
            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
          }}
        >
          Clear
        </Button>
        <Button 
          startIcon={<PrintIcon sx={{ fontSize: '14px' }} />}
          variant="outlined" 
          size="small"
          onClick={handlePrint}
          sx={{ 
            textTransform: "none", 
            borderRadius: "8px", 
            px: 2, 
            height: 30, 
            fontSize: "12px", 
            fontWeight: 600
          }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default DepositSlipPreview;
