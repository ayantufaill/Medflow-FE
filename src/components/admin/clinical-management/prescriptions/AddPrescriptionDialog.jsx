import React from 'react';
import {
  Dialog,
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
  DescriptionOutlined as DescriptionIcon
} from '@mui/icons-material';

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
        sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: "0px 8px 24px rgba(0,0,0,0.12)" }
      }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
            Add Prescription Template
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Create a new prescription template for your clinic.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ py: 3, px: 3, backgroundColor: "#fff" }}>
        <Grid container spacing={2.5}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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

          <Grid item xs={6}>
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
          <Grid item xs={6}>
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

          <Grid item xs={6}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Route</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.route}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, route: e.target.value })}
              MenuProps={{ sx: { zIndex: 10000 } }}
              sx={{
                fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff",
                color: "#374151", height: "38px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
              }}
            >
              <MenuItem value="Oral">Oral</MenuItem>
              <MenuItem value="Topical">Topical</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Forms</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.forms}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, forms: e.target.value })}
              MenuProps={{ sx: { zIndex: 10000 } }}
              sx={{
                fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff",
                color: "#374151", height: "38px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
              }}
            >
              <MenuItem value="Tablet">Tablet</MenuItem>
              <MenuItem value="Capsule">Capsule</MenuItem>
              <MenuItem value="Liquid">Liquid</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={3}>
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
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Duration Unit</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.durationUnit}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, durationUnit: e.target.value })}
              MenuProps={{ sx: { zIndex: 10000 } }}
              sx={{
                fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff",
                color: "#374151", height: "38px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
              }}
            >
              <MenuItem value="Day">Day</MenuItem>
              <MenuItem value="Week">Week</MenuItem>
              <MenuItem value="Month">Month</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={3}>
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

          <Grid item xs={4}>
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
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>Provider*</Typography>
            <Select
              fullWidth size="small"
              value={newTemplateDraft.provider}
              onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, provider: e.target.value })}
              MenuProps={{ sx: { zIndex: 10000 } }}
              sx={{
                fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff",
                color: "#374151", height: "38px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
              }}
            >
              <MenuItem value="Clinic Doctor">Clinic Doctor</MenuItem>
              <MenuItem value="Christina Sabour">Christina Sabour</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: 3 }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={newTemplateDraft.maySubstitute} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, maySubstitute: e.target.checked })} />}
              label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151", fontWeight: 500 }}>May substitute generic</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={newTemplateDraft.isLongTerm} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, isLongTerm: e.target.checked })} />}
              label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151", fontWeight: 500 }}>Long Term</Typography>}
            />
          </Grid>

          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
      </DialogContent>
      <DialogActions sx={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        px: "20px", py: "12px", gap: "8px",
        borderTop: '1px solid #e0e5eb', m: 0
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveNewTemplate}
          variant="contained"
          disableElevation
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            "&:hover": { backgroundColor: "#1a50cc" },
          }}
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPrescriptionDialog;
