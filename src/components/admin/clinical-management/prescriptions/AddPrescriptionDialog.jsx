import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material';

const AddPrescriptionDialog = ({
  open,
  onClose,
  newTemplateDraft,
  setNewTemplateDraft,
  handleSaveNewTemplate
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#fff',
          color: '#1e293b',
          fontSize: '1.25rem',
          fontWeight: 700,
          py: 2.5,
          px: 4,
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        Add Prescription Template
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400, mt: 0.5 }}>
          Create a new prescription template for your clinic
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 4, pb: 2 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Template Name</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.name}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Template Description</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.description}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Drug*</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.medication}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, medication: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Dose</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.dose}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, dose: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Route</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.route}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, route: e.target.value })}
              sx={{ borderRadius: 2, fontSize: '0.85rem' }}
            >
              <MenuItem value="Oral">Oral</MenuItem>
              <MenuItem value="Topical">Topical</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Forms</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.forms}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, forms: e.target.value })}
              sx={{ borderRadius: 2, fontSize: '0.85rem' }}
            >
              <MenuItem value="Tablet">Tablet</MenuItem>
              <MenuItem value="Capsule">Capsule</MenuItem>
              <MenuItem value="Liquid">Liquid</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Frequency</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.frequency}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, frequency: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Duration</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.duration}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, duration: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Duration Unit</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.durationUnit}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, durationUnit: e.target.value })}
              sx={{ borderRadius: 2, fontSize: '0.85rem' }}
            >
              <MenuItem value="Day">Day</MenuItem>
              <MenuItem value="Week">Week</MenuItem>
              <MenuItem value="Month">Month</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Quantity*</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.quantity}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, quantity: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Spelled out quantity</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.spelledOutQuantity}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, spelledOutQuantity: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Refills*</Typography>
            <TextField
              fullWidth size="small"
              value={newTemplateDraft.refills}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, refills: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Provider*</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.provider}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, provider: e.target.value })}
              sx={{ borderRadius: 2, fontSize: '0.85rem' }}
            >
              <MenuItem value="Clinic Doctor">Clinic Doctor</MenuItem>
              <MenuItem value="Christina Sabour">Christina Sabour</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: 3 }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={newTemplateDraft.maySubstitute} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, maySubstitute: e.target.checked })} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>May substitute generic</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={newTemplateDraft.isLongTerm} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, isLongTerm: e.target.checked })} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>Long Term</Typography>}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Patient Instructions</Typography>
            <TextField
              fullWidth multiline rows={3}
              value={newTemplateDraft.patientInstructions}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, patientInstructions: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-root': { fontSize: '0.85rem' } }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#334155' }}>Rx Instructions</Typography>
            <TextField
              fullWidth multiline rows={3}
              value={newTemplateDraft.rxInstructions}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, rxInstructions: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiInputBase-root': { fontSize: '0.85rem' } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3, gap: 1, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.85rem',
            px: 3,
            '&:hover': { backgroundColor: '#e2e8f0' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveNewTemplate}
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            px: 4,
            boxShadow: 'none',
            borderRadius: 1.5,
            '&:hover': { backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }
          }}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPrescriptionDialog;
