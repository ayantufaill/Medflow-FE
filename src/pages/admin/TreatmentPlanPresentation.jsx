import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Grid,
  Paper,
  IconButton,
  Divider,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Sync as SyncIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const INITIAL_SAVED_FORMS = [
  'Adjusted Fee Treatment Plan',
  '15% Friends + Family',
  'No Grouping',
  'Grouped By Tooth/Area',
  'Grouped By Code - Non-Contracted Ins',
  'Without Insurance Estimates - Itemized',
  'Grouped By Code - Contracted Ins',
  'With Insurance Estimates Itemized',
  'New Presentation1002250375',
];

const TreatmentPlanPresentation = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState('New Presentation1002250375');
  const [activeForm, setActiveForm] = useState('New Presentation1002250375');
  const [savedForms, setSavedForms] = useState(INITIAL_SAVED_FORMS);
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);

  // Form states (simplified for demonstration)
  const [headerChecks, setHeaderChecks] = useState({ logo: true, phone: true });
  
  const handleOpenSyncDialog = () => setSyncDialogOpen(true);
  const handleCloseSyncDialog = () => setSyncDialogOpen(false);

  const handleDeleteForm = (formToDelete) => {
    setSavedForms(savedForms.filter(f => f !== formToDelete));
    if (activeForm === formToDelete) {
      setActiveForm(savedForms[0]);
      setFormName(savedForms[0]);
    }
  };

  const handleRefresh = () => {
    // Mock refresh logic: Reset form name to active form's initial name
    setFormName(activeForm);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.85rem',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          TreatmentPlan Presentation
        </Typography>
      </Box>

      {/* Action Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, pr: 2, gap: 2 }}>
        <Box 
          onClick={handleRefresh}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1a3a6b', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          <RefreshIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Refresh</Typography>
        </Box>
        <Box 
          onClick={handleOpenSyncDialog}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1a3a6b', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          <SyncIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Sync</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Form Configuration */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#666' }}>Form Name:</Typography>
            <TextField
              size="small"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              sx={{ width: 350, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
            />
          </Box>

          {/* Header Area Section */}
          <Paper variant="outlined" sx={{ mb: 2.5, p: 0, borderRadius: 1, borderColor: '#e0e0e0' }}>
            <Grid container>
              <Grid size={1.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', backgroundColor: '#fdfdfd' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Header Area</Typography>
              </Grid>
              <Grid size={10.5} sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid size={3}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Office Info</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" checked={headerChecks.logo} onChange={(e) => setHeaderChecks({...headerChecks, logo: e.target.checked})} />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Logo</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked={headerChecks.phone} onChange={(e) => setHeaderChecks({...headerChecks, phone: e.target.checked})} />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Phone Number</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Address</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Website</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Email</Typography>} />
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Patient Info</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Full Name</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Title</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Age</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient DOB</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Phone Number</Typography>} />
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Benefits</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Primary Carrier</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Primary Deductible</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Primary Remaining</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Secondary Carrier</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Secondary Deductible</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient Secondary Remaining</Typography>} />
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Other</Typography>
                    <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Show treatment plan name</Typography>} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Procedure List Section */}
          <Paper variant="outlined" sx={{ mb: 2.5, p: 0, borderRadius: 1, borderColor: '#e0e0e0' }}>
            <Grid container>
              <Grid size={1.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', backgroundColor: '#fdfdfd' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Procedure List</Typography>
              </Grid>
              <Grid size={10.5} sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Display by</Typography>
                    <RadioGroup value="itemized">
                      <FormControlLabel value="itemized" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.72rem' }}>Itemized per Phase & Visit Show Totals</Typography>} />
                      <FormControlLabel value="no_sep" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.72rem' }}>Itemized (no separation)</Typography>} />
                      <FormControlLabel value="code" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.72rem' }}>Grouped per Code</Typography>} />
                      <FormControlLabel value="tooth" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.72rem' }}>Grouped per Tooth</Typography>} />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Display per item</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Date diagnosed</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Tooth number</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Procedure Code</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>System Short Description</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Description</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Procedure Note</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Show Procedures</Typography>} />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ mt: 3.5, display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office Fee/UCR</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>New Fee</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Billed Fee</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Contracted fee</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Estimated pt portion</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Estimated Ins Coverage</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Estimated Ins Adj</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Applied Adjustment</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Applied Adjustment Percentage</Typography>} />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Totals Section */}
          <Paper variant="outlined" sx={{ mb: 2.5, p: 0, borderRadius: 1, borderColor: '#e0e0e0' }}>
            <Grid container>
              <Grid size={1.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', backgroundColor: '#fdfdfd' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Totals</Typography>
              </Grid>
              <Grid size={10.5} sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1, color: '#888' }}>Fee Totals</Typography>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office fees/UCR</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Billed fees</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Contracted fees</Typography>} />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '0.75rem' }}>Adjustment</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Estimated pt portion</Typography>} />
                      <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Estimated Ins Coverage</Typography>} />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Payment Options Section */}
          <Paper variant="outlined" sx={{ mb: 2.5, p: 0, borderRadius: 1, borderColor: '#e0e0e0' }}>
            <Grid container>
              <Grid size={1.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', backgroundColor: '#fdfdfd' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Payment Options</Typography>
              </Grid>
              <Grid size={10.5} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#4a90e2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>+ add new payment option</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Acknowledgment Section */}
          <Paper variant="outlined" sx={{ mb: 2.5, p: 0, borderRadius: 1, borderColor: '#e0e0e0' }}>
            <Grid container>
              <Grid size={1.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', backgroundColor: '#fdfdfd' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Acknowledgment</Typography>
              </Grid>
              <Grid size={10.5} sx={{ p: 2 }}>
                {[
                  "This treatment plan and alternatives have been described to me. I fully understand the risks, benefits, and alternatives of the recommended treatment. My questions have been answered.",
                  "I understand that as the treatment progresses, modifications may be necessary and these may affect the fee. Should this occur, I further understand that the modification of treatment and the change in fee will be discussed with me at the earliest possible time.",
                  "I understand that I am responsible to pay up front for all my treatment. The treatment will be submitted to my dental insurance company on my behalf, but our office will not accept assignment payments from my dental insurance company on my behalf.",
                  "This estimate is valid for 90 days from the date of this letter.",
                  "If treatment commences, but the entire treatment plan is not completed, I acknowledge that the expected outcome for whatever procedures are completed may be compromised."
                ].map((text, idx) => (
                  <Box key={idx} sx={{ mb: 2.5 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      defaultValue={text}
                      sx={{ 
                        '& .MuiInputBase-root': { backgroundColor: '#fff' },
                        '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: 1.5, color: '#333' } 
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                      <IconButton size="small"><DeleteIcon sx={{ fontSize: '1rem', color: '#f8d7da' }} /></IconButton>
                    </Box>
                  </Box>
                ))}
                <Typography sx={{ fontSize: '0.75rem', color: '#4a90e2', cursor: 'pointer', mt: 1, '&:hover': { textDecoration: 'underline' } }}>+ add new paragraph</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Signature Section */}
          <Paper variant="outlined" sx={{ mb: 4, p: 0, borderRadius: 1, borderColor: '#e0e0e0' }}>
            <Grid container>
              <Grid size={1.5} sx={{ p: 2, borderRight: '1px solid #e0e0e0', backgroundColor: '#fdfdfd' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', fontWeight: 600 }}>Signature</Typography>
              </Grid>
              <Grid size={10.5} sx={{ p: 2, display: 'flex', gap: 6 }}>
                <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Patient/Guardian</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked />} label={<Typography sx={{ fontSize: '0.75rem' }}>Office</Typography>} />
              </Grid>
            </Grid>
          </Paper>

          {/* Bottom Footer Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mb: 10 }}>
            <Button variant="contained" sx={{ backgroundColor: '#a0aec0', color: '#fff', textTransform: 'none', px: 5, boxShadow: 'none', '&:hover': { backgroundColor: '#718096', boxShadow: 'none' } }}>
              Cancel
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#6b8fb9', color: '#fff', textTransform: 'none', px: 5, boxShadow: 'none', '&:hover': { backgroundColor: '#4a6a8a', boxShadow: 'none' } }}>
              Save
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Management Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#6b8fb9', color: '#fff', textTransform: 'none', mb: 3, py: 1, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#4a6a8a', boxShadow: 'none' } }}
          >
            Create new Presentation
          </Button>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#666', mb: 0.5, fontWeight: 500 }}>Sort By</Typography>
              <Select fullWidth size="small" value="Created Date" sx={{ fontSize: '0.75rem', backgroundColor: '#fff' }}>
                <MenuItem value="Created Date">Created Date</MenuItem>
              </Select>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#666', mb: 0.5 }}>&nbsp;</Typography>
              <Select fullWidth size="small" value="Descending" sx={{ fontSize: '0.75rem', backgroundColor: '#fff' }}>
                <MenuItem value="Descending">Descending</MenuItem>
              </Select>
            </Box>
          </Box>

          <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden', borderColor: '#e0e0e0' }}>
            <Box sx={{ p: 1.5, backgroundColor: '#6b8fb9', color: '#fff' }}>
              <Typography sx={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>Saved Treatment Printout Form</Typography>
            </Box>
            <Box sx={{ backgroundColor: '#fff' }}>
              {savedForms.map((form) => (
                <Box
                  key={form}
                  onClick={() => {
                    setActiveForm(form);
                    setFormName(form);
                  }}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    backgroundColor: activeForm === form ? '#718096' : 'transparent',
                    color: activeForm === form ? '#fff' : '#444',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: '0.2s',
                    '&:hover': { backgroundColor: activeForm === form ? '#718096' : '#f8f9fa' }
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, flex: 1, pr: 1 }}>{form}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenSyncDialog(); }} sx={{ p: 0, color: activeForm === form ? '#fff' : '#4a90e2' }}>
                      <SyncIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteForm(form); }} sx={{ p: 0, color: activeForm === form ? '#fff' : '#f8d7da' }}>
                      <DeleteIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={handleCloseSyncDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0c345d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 2,
            px: 3,
            lineHeight: 1.3,
          }}
        >
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Source Office:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="thedentalstudio"
              disabled
              sx={{
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Target Offices
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseSyncDialog}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#d0d0d0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseSyncDialog}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#6b8fb9',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#5a7ca8' }
            }}
          >
            Sync
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreatmentPlanPresentation;
