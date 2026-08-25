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
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  DescriptionOutlined as DescriptionIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { COLORS } from '../../../../constants/colors';

const dropdownMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      '& .MuiMenuItem-root': {
        fontSize: '13px',
        fontFamily: 'Inter',
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: '#f3f4f6'
        },
        '&.Mui-selected': {
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          '&:hover': {
            backgroundColor: '#dbeafe'
          }
        }
      }
    }
  },
  style: { zIndex: 10000 },
  sx: { zIndex: 10000 },
};

const selectStyles = {
  fontFamily: "Inter", 
  fontSize: "13px", 
  borderRadius: "8px", 
  backgroundColor: "#fff",
  color: "#374151", 
  height: "38px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6", borderWidth: "1px" },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    height: "100% !important",
  },
  "& .MuiSelect-icon": {
    color: "#9ca3af",
  }
};

const FormSection = ({ title, children }) => (
  <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '12px', mb: 3, backgroundColor: '#FFFFFF' }}>
    <Box sx={{ px: 2.5, py: 1.5, backgroundColor: COLORS.SURFACE_TINT, borderBottom: `1px solid ${COLORS.BORDER}`, borderTopLeftRadius: '11px', borderTopRightRadius: '11px' }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#111' }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>
      {children}
    </Box>
  </Box>
);

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
        sx: { borderRadius: "12px" }
      }}
    >
      <Box
        sx={{
          backgroundColor: COLORS.SURFACE_TINT,
          color: '#111',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>
              Add Prescription Template
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: '#6B7280' }}>
              Create a new prescription template for your clinic.
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#6B7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 0, backgroundColor: COLORS.BACKGROUND }}>
        <FormSection title="General Information">
          <Grid container spacing={2.5}>
            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Template Name</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.name}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, name: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Template Description</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.description}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, description: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Medication Details">
          <Grid container spacing={2.5}>
            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Drug*</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.medication}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, medication: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Dose</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.dose}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, dose: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>

            <Grid size={4}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Route</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.route}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, route: e.target.value })}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={dropdownMenuProps}
                sx={selectStyles}
              >
                <MenuItem value="Oral">Oral</MenuItem>
                <MenuItem value="Topical">Topical</MenuItem>
              </Select>
            </Grid>
            <Grid size={4}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Forms</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.forms}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, forms: e.target.value })}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={dropdownMenuProps}
                sx={selectStyles}
              >
                <MenuItem value="Tablet">Tablet</MenuItem>
                <MenuItem value="Capsule">Capsule</MenuItem>
                <MenuItem value="Liquid">Liquid</MenuItem>
              </Select>
            </Grid>
            <Grid size={4}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Frequency</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.frequency}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, frequency: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Dispensing Details">
          <Grid container spacing={2.5}>
            <Grid size={3}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Duration</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.duration}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, duration: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
            <Grid size={3}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Duration Unit</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.durationUnit}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, durationUnit: e.target.value })}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={dropdownMenuProps}
                sx={selectStyles}
              >
                <MenuItem value="Day">Day</MenuItem>
                <MenuItem value="Week">Week</MenuItem>
                <MenuItem value="Month">Month</MenuItem>
              </Select>
            </Grid>
            <Grid size={3}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Quantity*</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.quantity}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, quantity: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
            <Grid size={3}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Refills*</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.refills}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, refills: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>

            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Spelled out quantity</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.spelledOutQuantity}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, spelledOutQuantity: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Provider*</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.provider}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, provider: e.target.value })}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={dropdownMenuProps}
                sx={selectStyles}
              >
                <MenuItem value="Clinic Doctor">Clinic Doctor</MenuItem>
                <MenuItem value="Christina Sabour">Christina Sabour</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </FormSection>

        <FormSection title="Instructions & Options">
          <Grid container spacing={2.5}>
            <Grid size={12} sx={{ display: 'flex', gap: 3, pb: 1 }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={newTemplateDraft.maySubstitute} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, maySubstitute: e.target.checked })} />}
                label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151", fontWeight: 500 }}>May substitute generic</Typography>}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={newTemplateDraft.isLongTerm} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, isLongTerm: e.target.checked })} />}
                label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151", fontWeight: 500 }}>Long Term</Typography>}
              />
            </Grid>

            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Patient Instructions</Typography>
              <TextField
                fullWidth multiline rows={3}
                value={newTemplateDraft.patientInstructions}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, patientInstructions: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Rx Instructions</Typography>
              <TextField
                fullWidth multiline rows={3}
                value={newTemplateDraft.rxInstructions}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, rxInstructions: e.target.value })}
                sx={{
                  "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
                  "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
                }}
              />
            </Grid>
          </Grid>
        </FormSection>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        backgroundColor: 'white', 
        borderTop: `1px solid ${COLORS.BORDER}`, 
        gap: 1.5,
        justifyContent: 'flex-end',
        m: 0
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderColor: '#D1D5DB', 
            color: '#374151',
            backgroundColor: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2,
            '&:hover': {
              backgroundColor: '#F3F4F6',
              borderColor: '#D1D5DB'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveNewTemplate}
          variant="contained"
          sx={{ 
            backgroundColor: '#2563EB',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1D4ED8',
              boxShadow: 'none'
            }
          }}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPrescriptionDialog;
