import React, { useState } from 'react';
import { 
  Box, Typography, Button, Stack, Divider, 
  IconButton, Link, Grid, TextField, Checkbox
} from '@mui/material';
import { Refresh as RefreshIcon, Edit as EditIcon } from '@mui/icons-material';

const AdjustedFeeTreatmentPlan = ({ onClose, paymentOptionType = null, showGroupingSection = false }) => {
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState('');

  const rowLightBlue = '#f0f4fa';
  const textDarkBlue = '#1a237e';
  const headerBlue = '#7788bb';
  const paymentHeaderBlue = '#a3b1d6';

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 900, 
      bgcolor: '#fff', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Blue Header Bar */}
      <Box sx={{ bgcolor: '#7788bb', color: '#fff', p: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
          Grouped By Phase
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        {/* Top Section: Logo and Patient Info */}
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 6 }}>
          {/* Logo/Clinic Info */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#444', mb: 1, letterSpacing: '1px' }}>
              THE DENTAL STUDIO
            </Typography>
            <Box sx={{ color: '#666', fontSize: '12px', lineHeight: 1.4 }}>
              <Typography variant="caption" display="block">The Dental Studio</Typography>
              <Typography variant="caption" display="block">2041 Olympia Dr Ste 100</Typography>
              <Typography variant="caption" display="block">Flower Mound, TX 75028</Typography>
              <Typography variant="caption" display="block">www.thedentalstudiotx.com</Typography>
              <Typography variant="caption" display="block">+1 (214) 285-0011</Typography>
            </Box>
          </Box>

          {/* Patient Info / Benefits */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
              Vicky [Patient Name]
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
              +1 (214) 285-0011
            </Typography>
            
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#888', mb: 0.5, fontSize: '12px' }}>
              Your Benefits
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', fontSize: '13px' }}>
              No insurance coverage
            </Typography>
          </Box>
        </Stack>

        {/* Grouping Section (New image reference) */}
        {showGroupingSection && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, fontSize: '13px' }}>
              Treatment Plan Name: TP 1
            </Typography>
            
            {/* Grouping Table */}
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <Grid container sx={{ bgcolor: paymentHeaderBlue, py: 0.8, px: 2 }}>
                <Grid size={3}>
                  <Typography sx={{ fontWeight: 600, fontSize: '12px', color: '#444' }}>Tooth</Typography>
                </Grid>
                <Grid size={9}>
                  <Typography sx={{ fontWeight: 600, fontSize: '12px', color: '#444', textAlign: 'center' }}>Code</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1.5, px: 2, bgcolor: '#fff' }}>
                <Grid size={3}>
                  <Typography sx={{ fontSize: '12px' }}></Typography>
                </Grid>
                <Grid size={9}>
                  <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>D0274 , D1110 , D0120 , D1206 , D0210</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Summary Details */}
            <Box sx={{ ml: 'auto', width: '300px' }}>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>Total Billed Fee</Typography>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>$663.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>Total Contracted Fee</Typography>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>$663.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>Total Adjustment</Typography>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>$0.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>Estimated Insurance Coverage</Typography>
                  <Typography variant="caption" sx={{ color: '#444', fontWeight: 500 }}>$0.00</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Blue Highlight Bar */}
            <Box sx={{ 
              bgcolor: textDarkBlue, 
              color: '#fff', 
              p: 0.8, 
              mt: 1.5, 
              borderRadius: 0.5,
              display: 'flex',
              justifyContent: 'center',
              gap: 4
            }}>
              <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>Estimated Pt Portion</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>$663.00</Typography>
            </Box>
          </Box>
        )}

        {/* Empty State Message */}
        {!showGroupingSection && (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
              This patient does not have any planned procedures yet.
            </Typography>
          </Box>
        )}

        {/* Refresh Link */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Link 
            href="#" 
            underline="hover" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: headerBlue, 
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <RefreshIcon sx={{ fontSize: 14, mr: 0.5 }} />
            Refresh Payment Options
          </Link>
        </Box>

        {/* Payment Options Section */}
        {paymentOptionType && (
          <Box sx={{ mb: 4, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: paymentHeaderBlue, color: textDarkBlue, p: 0.8, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
                Payment Options
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#fff' }}>
              {paymentOptionType === '15_percent' && (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1.5 }}>
                  <Checkbox size="small" defaultChecked sx={{ p: 0 }} />
                  <Typography variant="body2" sx={{ fontSize: '13px', color: '#333', flex: 1 }}>
                    <strong>15% Adjustment:</strong> You will receive 15% off on all treatment as a friend and family courtesy. 0.0
                  </Typography>
                  <IconButton size="small">
                    <EditIcon sx={{ fontSize: 16, color: '#666' }} />
                  </IconButton>
                </Stack>
              )}
              {paymentOptionType === 'no_grouping' && (
                <>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1.5, borderBottom: '1px solid #eee' }}>
                    <Checkbox size="small" defaultChecked sx={{ p: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: '13px', color: '#333', flex: 1 }}>
                      <strong>Pay As You Go:</strong> Payment at each appointment as treatment progresses. Payment: As showing above in treatment presentation.
                    </Typography>
                    <IconButton size="small">
                      <EditIcon sx={{ fontSize: 16, color: '#666' }} />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1.5 }}>
                    <Checkbox size="small" defaultChecked sx={{ p: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: '13px', color: '#333', flex: 1 }}>
                      <strong>Financing - Care Credit or Sunbit:</strong> No interest rate financing through Care Credit or Sunbit.
                    </Typography>
                    <IconButton size="small">
                      <EditIcon sx={{ fontSize: 16, color: '#666' }} />
                    </IconButton>
                  </Stack>
                </>
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Acknowledgment Section */}
        <Box sx={{ color: '#444', fontSize: '12px', lineHeight: 1.6, mb: 6 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px' }}>
            Acknowledgment:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
            This treatment plan and alternatives have been described to me. I fully understand the risks, benefits, and alternatives of the recommended treatment. My questions have been answered.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
            I understand that as the treatment progresses, modifications may be necessary and these may affect the fee. Should this occur, I further understand that the modification of treatment and the change in fee will be discussed with me at the earliest possible time.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
            I understand that I am responsible to pay up front for all my treatment. The treatment will be submitted to my dental insurance company on my behalf, but our office will not accept assignment payments from my dental insurance company on my behalf.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
            This estimate is valid for 90 days from the date of this letter.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
            If treatment commences, but the entire treatment plan is not completed, I acknowledge that the expected outcome for whatever procedures are completed may be compromised.
          </Typography>
        </Box>

        {/* Signature Section */}
        <Grid container spacing={8} sx={{ mb: 4 }}>
          <Grid size={6}>
            <Box sx={{ borderBottom: '1px solid #999', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', mb: 0.5 }}>
                05/06/2026
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#666' }}>Date</Typography>
            
            <Box sx={{ borderBottom: '1px solid #999', mt: 8, mb: 0.5 }}></Box>
            <Typography variant="caption" sx={{ color: '#666' }}>Patient/Guardian</Typography>
          </Grid>
          <Grid size={6}>
            <Box sx={{ borderBottom: '1px solid #999', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', mb: 0.5 }}>
                05/06/2026
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#666' }}>Date</Typography>
            
            <Box sx={{ borderBottom: '1px solid #999', mt: 8, mb: 0.5 }}></Box>
            <Typography variant="caption" sx={{ color: '#666' }}>Office</Typography>
          </Grid>
        </Grid>

        {/* Notes Section */}
        {(showNotesInput || notes) && (
          <Box sx={{ mb: 4, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: rowLightBlue, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '13px', color: textDarkBlue }}>Notes:</Typography>
              {(showNotesInput || notes) && (
                <Typography 
                  sx={{ fontWeight: 'bold', cursor: 'pointer', color: textDarkBlue, px: 1 }}
                  onClick={() => {
                    if (showNotesInput && notes) {
                      setShowNotesInput(false);
                    } else {
                      setShowNotesInput(false);
                      setNotes('');
                    }
                  }}
                >
                  ×
                </Typography>
              )}
            </Box>
            <Box sx={{ p: 2, position: 'relative' }}>
              {showNotesInput ? (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '13px'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{ 
                        bgcolor: textDarkBlue,
                        '&:hover': { bgcolor: '#0d1642' }
                      }}
                      onClick={() => setShowNotesInput(false)}
                    >
                      Save
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography 
                  sx={{ fontSize: '13px', whiteSpace: 'pre-wrap', cursor: 'pointer' }}
                  onClick={() => setShowNotesInput(true)}
                >
                  {notes}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Footer Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button 
            variant="contained" 
            size="small"
            onClick={() => setShowNotesInput(true)}
            sx={{ 
              bgcolor: '#1a237e', 
              color: '#fff', 
              textTransform: 'none', 
              fontSize: '12px',
              px: 3,
              '&:hover': { bgcolor: '#0d1642' }
            }}
          >
            {notes ? 'Edit Notes' : 'Add Notes'}
          </Button>

          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              size="small"
              onClick={onClose}
              sx={{ 
                bgcolor: '#9e9e9e', 
                color: '#fff', 
                textTransform: 'none', 
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#757575' }
              }}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                bgcolor: '#5c7bb7', 
                color: '#fff', 
                textTransform: 'none', 
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#4a69bd' }
              }}
            >
              Share With Patient
            </Button>
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                bgcolor: '#d4c4a8', 
                color: '#fff', 
                textTransform: 'none', 
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#c5b396' }
              }}
            >
              Print
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AdjustedFeeTreatmentPlan;
