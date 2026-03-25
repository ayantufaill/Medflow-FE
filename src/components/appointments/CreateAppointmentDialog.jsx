import dayjs from "dayjs";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";

const CreateAppointmentDialog = ({
  open,
  onClose,
  DEMO_PATIENTS,
  selectedPatient,
  setSelectedPatientId,
  draft,
  setDraft,
  OPERATORY_COLUMNS,
  createAppointment,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 600, color: "#1e293b" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventNoteIcon sx={{ color: "#1976d2" }} />
          Schedule Appointment
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}
        >
          <Autocomplete
            size="small"
            options={DEMO_PATIENTS}
            getOptionLabel={(option) => option.name}
            value={selectedPatient || null}
            onChange={(_, newValue) => {
              const id = newValue?.id || null;
              if (id) {
                setSelectedPatientId(id);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                InputLabelProps={{ sx: { fontSize: 13 } }}
                InputProps={{
                  ...params.InputProps,
                  sx: { fontSize: 13, borderRadius: 1.5 },
                }}
              />
            )}
          />

          <TextField
            fullWidth
            size="small"
            label="Appointment Title"
            value={draft.title}
            onChange={(e) =>
              setDraft((p) => ({ ...p, title: e.target.value }))
            }
            InputLabelProps={{ sx: { fontSize: 13 } }}
            InputProps={{ sx: { fontSize: 13, borderRadius: 1.5 } }}
          />

          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 13 }}>Operatory</InputLabel>
            <Select
              label="Operatory"
              value={draft.columnId}
              onChange={(e) =>
                setDraft((p) => ({ ...p, columnId: e.target.value }))
              }
              sx={{ borderRadius: 1.5, fontSize: 13 }}
            >
              {OPERATORY_COLUMNS.map((c) => (
                <MenuItem key={c.id} value={c.id} sx={{ fontSize: 13 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: c.color,
                      }}
                    />
                    {c.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
          >
            <TextField
              size="small"
              label="Start"
              value={
                draft.startIso ? dayjs(draft.startIso).format("h:mm A") : ""
              }
              disabled
              InputLabelProps={{ sx: { fontSize: 13 } }}
              InputProps={{ sx: { fontSize: 13, borderRadius: 1.5 } }}
            />
            <TextField
              size="small"
              label="End"
              value={draft.endIso ? dayjs(draft.endIso).format("h:mm A") : ""}
              disabled
              InputLabelProps={{ sx: { fontSize: 13 } }}
              InputProps={{ sx: { fontSize: 13, borderRadius: 1.5 } }}
            />
          </Box>

          {selectedPatient && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8fafc",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonIcon sx={{ color: "#64748b", fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                  Selected Patient
                </Typography>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}
                >
                  {selectedPatient.name}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            borderColor: "#cbd5e1",
            color: "#475569",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={createAppointment}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            bgcolor: "#1976d2",
            px: 3,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Save Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppointmentDialog;

