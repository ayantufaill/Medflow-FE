import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCut as ContentCutIcon
} from '@mui/icons-material';

const PreviewStatementDialog = ({ open, onClose }) => {
  const [statementData, setStatementData] = useState({
    amountDue: '',
    enclosedAmount: '',
    creditCardNo: '',
    creditCardType: '',
    csv: '',
    expiryDate: '',
    nameOnCard: '',
    signature: ''
  });

  const handleInputChange = (field) => (e) => {
    setStatementData({ ...statementData, [field]: e.target.value });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 0, minHeight: '90vh' }
      }}
    >
      {/* Header Bar */}
      <Box sx={{ bgcolor: '#4a89dc', py: 1, px: 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
          Preview of Statement/Invoice/Receipt
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small" 
          sx={{ position: 'absolute', right: 8, top: 4, color: 'white' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, bgcolor: 'white' }}>
        {/* Top Info Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          {/* Left: Office Address (Blue marks in image) */}
          <Box sx={{ maxWidth: '250px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#333' }}>The Dental Studio</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>1234 Main Street, Suite 300</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Anytown, ST 12345</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Phone: (555) 123-4567</Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5 }}>Patient Name Billing Address</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Street</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>City, State, Zip code</Typography>
            </Box>
          </Box>

          {/* Right: Statement Info & Payment Box */}
          <Box sx={{ textAlign: 'right', minWidth: '400px' }}>
            <Typography sx={{ color: '#4a89dc', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline', mb: 0.5 }}>
              Statement #
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
              from <span style={{ color: '#4a89dc' }}>mm/dd/yyyy</span> to <span style={{ color: '#4a89dc' }}>mm/dd/yyyy</span>
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc', mb: 0.5 }}>mm/dd/yyyy</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>account <span style={{ color: '#4a89dc' }}>#0000</span></Typography>

            <Box sx={{ border: '1px solid #4a89dc', p: 1.5, mt: 2, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>Amount due:</Typography>
                  <TextField 
                    variant="standard" 
                    size="small" 
                    value={statementData.amountDue}
                    onChange={handleInputChange('amountDue')}
                    sx={{ width: '80px', '& .MuiInputBase-input': { py: 0, fontSize: '0.8rem' } }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>Enclosed amount:</Typography>
                  <TextField 
                    variant="standard" 
                    size="small" 
                    value={statementData.enclosedAmount}
                    onChange={handleInputChange('enclosedAmount')}
                    sx={{ width: '80px', '& .MuiInputBase-input': { py: 0, fontSize: '0.8rem' } }} 
                  />
                </Box>
              </Box>
              <Typography sx={{ fontSize: '0.8rem' }}>Due date: mm/dd/yyyy or upon receipt</Typography>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Credit Card #:</Typography>
                <TextField 
                  variant="standard" 
                  fullWidth 
                  value={statementData.creditCardNo}
                  onChange={handleInputChange('creditCardNo')}
                  sx={{ '& .MuiInputBase-input': { py: 0, fontSize: '0.75rem' } }} 
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Credit Card Type:</Typography>
                  <TextField 
                    variant="standard" 
                    fullWidth 
                    value={statementData.creditCardType}
                    onChange={handleInputChange('creditCardType')}
                    sx={{ '& .MuiInputBase-input': { py: 0, fontSize: '0.75rem' } }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>3 digit CSV:</Typography>
                  <TextField 
                    variant="standard" 
                    fullWidth 
                    value={statementData.csv}
                    onChange={handleInputChange('csv')}
                    sx={{ '& .MuiInputBase-input': { py: 0, fontSize: '0.75rem' } }} 
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Expiration date:</Typography>
                <TextField 
                  variant="standard" 
                  fullWidth 
                  value={statementData.expiryDate}
                  onChange={handleInputChange('expiryDate')}
                  sx={{ '& .MuiInputBase-input': { py: 0, fontSize: '0.75rem' } }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Name:</Typography>
                <TextField 
                  variant="standard" 
                  fullWidth 
                  value={statementData.nameOnCard}
                  onChange={handleInputChange('nameOnCard')}
                  sx={{ '& .MuiInputBase-input': { py: 0, fontSize: '0.75rem' } }} 
                />
              </Box>
              <Typography sx={{ fontSize: '0.65rem', fontStyle: 'italic', color: '#999', mt: -0.5 }}>(as it appears on the card)</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Signature:</Typography>
                <TextField 
                  variant="standard" 
                  fullWidth 
                  value={statementData.signature}
                  onChange={handleInputChange('signature')}
                  sx={{ '& .MuiInputBase-input': { py: 0, fontSize: '0.75rem' } }} 
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Detach Line */}
        <Box sx={{ my: 4, position: 'relative', borderTop: '1px dashed #ccc', textAlign: 'center' }}>
          <ContentCutIcon sx={{ position: 'absolute', left: -5, top: -10, color: '#999', fontSize: '1.2rem', transform: 'rotate(90deg)' }} />
          <Typography sx={{ fontSize: '0.7rem', color: '#999', bgcolor: 'white', px: 2, display: 'inline-block', position: 'relative', top: -10 }}>
            Please detach and return this part of the statement with your payment to ensure proper processing
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#999', mt: 0.5 }}>
            Please keep this part of the statement for your records
          </Typography>
        </Box>

        {/* Bottom Section (Main Statement) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
           <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 2, color: '#ccc' }}>THE DENTAL STUDIO</Typography>
           <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>The Dental Studio</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>1234 Main Street, Suite 300</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Anytown, ST 12345</Typography>
              
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ color: '#4a89dc', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'underline' }}>Statement #</Typography>
                <Typography sx={{ fontSize: '0.7rem' }}>from <span style={{ color: '#4a89dc' }}>mm/dd/yyyy</span> to <span style={{ color: '#4a89dc' }}>mm/dd/yyyy</span></Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#4a89dc' }}>mm/dd/yyyy</Typography>
                <Typography sx={{ fontSize: '0.7rem' }}>account <span style={{ color: '#4a89dc' }}>#0000</span></Typography>
              </Box>
           </Box>
        </Box>

        {/* Invoice Table */}
        <TableContainer sx={{ border: '1px solid #333', mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={{ py: 0.5 }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>Invoice <span style={{ color: '#4a89dc' }}>#0000</span></Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>Patient: <span style={{ color: '#4a89dc' }}>Patient Name</span></Typography>
                </TableCell>
                <TableCell colSpan={5} align="right" sx={{ py: 0.5 }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>Procedure Date: <span style={{ color: '#4a89dc' }}>mm/dd/yyyy</span></Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ borderTop: '1px solid #333' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Treatment</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Provider</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Original Charge</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Adjusted Charge</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>In. Portion</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Pt. Portion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc', textDecoration: 'underline' }}>Code</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>Treatment</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>Provider</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>Original Charge</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>Adjusted Charge</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>In. Portion</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>Pt. Portion</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#4a89dc' }}>TOTAL</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', color: '#4a89dc' }}>(sum of original charges)</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', color: '#4a89dc' }}>(sum of adjusted charges)</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', color: '#4a89dc' }}>(sum of insurance portion)</TableCell>
                <TableCell sx={{ fontSize: '0.7rem', color: '#4a89dc' }}>(sum of patient portion)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Red Box */}
        <Box sx={{ border: '1px solid red', p: 1.5, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 6, mb: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem' }}>Total patient portion</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc', fontWeight: 600 }}>$0.00</Typography>
            </Box>
            <Typography sx={{ alignSelf: 'flex-end', pb: 0.5 }}>-</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem' }}>Paid Portion</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc', fontWeight: 600 }}>$0.00</Typography>
            </Box>
            <Typography sx={{ alignSelf: 'flex-end', pb: 0.5 }}>=</Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem' }}>Amount Due</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc', fontWeight: 600 }}>$0.00</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right', pr: 2, mb: 1 }}>+</Box>

        {/* Aging Red Box */}
        <Box sx={{ border: '1px solid red', p: 1.5, mb: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem' }}>Balance forward from</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#4a89dc' }}>mm/dd/yyyy</Typography>
            </Box>
            {['0-30', '31-60', '61-90', '>90', 'Previous balance'].map((age) => (
              <Box key={age} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem' }}>{age}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc', mt: 2 }}>$0.00</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right', pr: 2, mb: 1 }}>=</Box>

        {/* Account Credit Red Box */}
        <Box sx={{ border: '1px solid red', p: 1, mb: 3 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
            ACCOUNT CREDIT <span style={{ color: '#4a89dc' }}>$0.00</span> TOTAL BALANCE <span style={{ color: 'red' }}>$0.00</span>
          </Typography>
        </Box>

        {/* Next Appts */}
        <Box sx={{ border: '1px solid #333', p: 1.5, mb: 2, display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.8rem' }}>Next scheduled treatment appt</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc' }}>no scheduled appt or mm/dd/yyyy</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.8rem' }}>Next scheduled hygiene appt</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#4a89dc' }}>no scheduled appt or mm/dd/yyyy</Typography>
          </Box>
        </Box>

        {/* Footnotes */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>* deductible was applied</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>** insurance claim sent</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>*** insurance claim received</Typography>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            onClick={onClose} 
            variant="contained" 
            sx={{ 
              bgcolor: '#aab2bd', 
              color: 'white', 
              textTransform: 'none', 
              borderRadius: 1,
              '&:hover': { bgcolor: '#939ba3' }
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewStatementDialog;
