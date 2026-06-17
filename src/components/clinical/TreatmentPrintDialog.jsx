import React, { useState, useEffect } from 'react';
import { Dialog, Box, Stack, Button, Typography, Grid, Checkbox } from '@mui/material';

export default function TreatmentPrintDialog({ 
  open, 
  onClose, 
  visits = [], 
  activePlan, 
  updateMutation 
}) {
  const [showPrintNotes, setShowPrintNotes] = useState(false);
  const [printNotesText, setPrintNotesText] = useState('');
  const [paymentOptionSelections, setPaymentOptionSelections] = useState({
    payInAdvance: false,
    payAsYouGo: false,
    paymentPlan: false,
    financing: false
  });

  // Populate print notes when the dialog opens if the plan has notes
  useEffect(() => {
    if (open && activePlan?.notes) {
      setPrintNotesText(activePlan.notes);
    }
  }, [open, activePlan]);

  const handleSaveNotes = () => {
    if (activePlan?._id) {
      updateMutation.mutate({
        id: activePlan._id,
        data: { notes: printNotesText }
      });
    }
    setShowPrintNotes(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#f8fafc',
          minHeight: '80vh',
          '@media print': {
            bgcolor: '#fff',
            boxShadow: 'none',
            margin: 0,
            padding: 0,
          }
        }
      }}
    >
      <Box sx={{ p: 4, '@media print': { p: 0 } }} id="printable-area">
        {/* Action Bar (Hidden when printing) */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 3, '@media print': { display: 'none' } }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => window.print()} sx={{ bgcolor: '#1a237e' }}>Print</Button>
        </Stack>

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Medflow</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>Dental Clinic Management</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>Treatment Plan Estimate</Typography>
            <Typography sx={{ fontSize: '0.9rem' }}>Date: {new Date().toLocaleDateString()}</Typography>
          </Box>
        </Box>

        {/* Visits Tables */}
        {visits.map((visit, vIdx) => (
          <Box key={visit.id || vIdx} sx={{ mb: 4 }}>
            <Typography sx={{ fontWeight: 600, bgcolor: '#e2e8f0', p: 1, borderRadius: '4px 4px 0 0', border: '1px solid #cbd5e1' }}>
              {visit.label || `Visit ${vIdx + 1}`}
            </Typography>
            <Box sx={{ border: '1px solid #cbd5e1', borderTop: 'none', borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
              <Grid container sx={{ bgcolor: '#f1f5f9', p: 1, borderBottom: '1px solid #cbd5e1' }}>
                <Grid item xs={2}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Code</Typography></Grid>
                <Grid item xs={4}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</Typography></Grid>
                <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Tooth</Typography></Grid>
                <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Surf</Typography></Grid>
                <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Fee</Typography></Grid>
                <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Ins</Typography></Grid>
                <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Pt</Typography></Grid>
              </Grid>
              {visit.procedures && visit.procedures.map((p, pIdx) => (
                <Grid container key={p.id || pIdx} sx={{ p: 1, borderBottom: pIdx < visit.procedures.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <Grid item xs={2}><Typography sx={{ fontSize: '0.8rem' }}>{p.code}</Typography></Grid>
                  <Grid item xs={4}><Typography sx={{ fontSize: '0.8rem' }}>{p.treatmentName}</Typography></Grid>
                  <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem' }}>{p.toothNumber}</Typography></Grid>
                  <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem' }}>{p.surface}</Typography></Grid>
                  <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem' }}>{p.fee || '$0.00'}</Typography></Grid>
                  <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem' }}>{p.insuranceAmount || '$0.00'}</Typography></Grid>
                  <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem' }}>{p.patientAmount || '$0.00'}</Typography></Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        ))}

        {/* Payment Options */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5, '@media print': { display: 'none' } }}>
             <Typography sx={{ fontSize: '0.8rem', color: '#7a8fb8', cursor: 'pointer' }}>↻ Refresh Payment Options</Typography>
          </Box>
          <Box sx={{ border: '1px solid #cbd5e1', borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#7a8fb8', p: 1, display: 'flex', justifyContent: 'center' }}>
               <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Payment Options</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.payInAdvance} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, payInAdvance: e.target.checked})} />
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Pay In Advance:</strong> Receive a 5 % courtesy discount by paying your treatment in full today</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.payAsYouGo} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, payAsYouGo: e.target.checked})} />
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Pay As You Go:</strong> Payment at each appointment as treatment progresses. Payment: As showing above in treatment presentation.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.paymentPlan} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, paymentPlan: e.target.checked})} />
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Payment Plan:</strong> For 12 months, paying 5 % Mgmt fee. <br/>Down payment: $ 263.34 <br/>Monthly payment: $ 87.78</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.financing} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, financing: e.target.checked})} />
                  <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Financing - Care Credit:</strong> No interest rate financing through care credit.</Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Treatment Plan Notes */}
        {!showPrintNotes && (
           <Box sx={{ mb: 2, '@media print': { display: 'none' } }}>
              <Button size="small" onClick={() => setShowPrintNotes(true)} sx={{ textTransform: 'none' }}>+ Add Notes</Button>
           </Box>
        )}
        {showPrintNotes && (
          <Box sx={{ mb: 4, border: '1px solid #cbd5e1', borderRadius: '4px' }}>
            <Box sx={{ bgcolor: '#7a8fb8', p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Treatment Plan Notes:</Typography>
               <Box sx={{ '@media print': { display: 'none' } }}>
                 <Typography sx={{ color: '#fff', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }} onClick={() => setShowPrintNotes(false)}>×</Typography>
               </Box>
            </Box>
            <Box sx={{ p: 2 }}>
               <Box
                 component="textarea"
                 placeholder="Write notes"
                 value={printNotesText}
                 onChange={(e) => setPrintNotesText(e.target.value)}
                 sx={{
                   width: '100%',
                   minHeight: '100px',
                   border: '1px solid #e2e8f0',
                   borderRadius: '4px',
                   p: 1,
                   fontFamily: 'inherit',
                   fontSize: '0.85rem',
                   resize: 'vertical',
                   '@media print': {
                      border: 'none',
                      resize: 'none',
                   }
                 }}
               />
               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, '@media print': { display: 'none' } }}>
                  <Button variant="contained" size="small" onClick={handleSaveNotes} sx={{ bgcolor: '#1e293b', textTransform: 'none' }}>Done</Button>
               </Box>
            </Box>
          </Box>
        )}

        {/* Acknowledgments & Signatures */}
        <Box sx={{ mb: 4 }}>
           <Typography sx={{ fontSize: '0.85rem', mb: 1 }}>Acknowledgment:</Typography>
           <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5 }}>
             This treatment plan and alternatives have been described to me. I fully understand the risks, benefits, and alternatives of the recommended treatment. My questions have been answered.
           </Typography>
           <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5 }}>
             I understand that as the treatment progresses, modifications may be necessary and these may affect the fee. Should this occur, I further understand that the modification of treatment and the change in fee will be discussed with me at the earliest possible time.
           </Typography>
           <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5 }}>
             I understand that I am responsible to pay up front for all my treatment. The treatment will be submitted to my dental insurance company on my behalf, but our office will not accept assignment payments from my dental insurance company on my behalf.
           </Typography>
           <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5, fontWeight: 'bold' }}>
             This estimate is valid for 90 days from the date of this letter.
           </Typography>
           <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 4, lineHeight: 1.5 }}>
             If treatment commences, but the entire treatment plan is not completed, I acknowledge that the expected outcome for whatever procedures are completed may be compromised.
           </Typography>
           
           <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
              <Box sx={{ flex: 1 }}>
                 <Box sx={{ borderBottom: '1px solid #000', pb: 0.5, mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem' }}>{new Date().toLocaleDateString()}</Typography>
                 </Box>
                 <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>Date</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                 <Box sx={{ borderBottom: '1px solid #000', pb: 0.5, mb: 0.5, minHeight: '20px' }}>
                 </Box>
                 <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>Signature</Typography>
              </Box>
           </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
