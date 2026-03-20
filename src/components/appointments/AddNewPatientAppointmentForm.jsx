import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  DeleteOutline as DeleteOutlineIcon,
  Close as CloseIcon,
  MailOutline,
  ChatBubbleOutline,
  Mic,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";

const FONT_SM = { fontSize: "11px" };
const FONT_XS = { fontSize: "10px" };

const procedureIcons = [
  { label: "New", color: "#81ecec" },
  { label: "Scr", color: "#ff7675" },
  { label: "FULL", color: "#ffeaa7" },
  { label: "Pano", color: "#636e72", font: "white" },
  { label: "FMX", color: "#2d3436", font: "white" },
  { label: "Xray", color: "#636e72", font: "white" },
  { label: "AdX", color: "#b2bec3" },
  { label: "SCN", color: "#55efc4" },
  { label: "Con", color: "#81ecec" },
  { label: "Vir", color: "#00b894", font: "white" },
];

const defaultProcedures = [
  {
    id: 1,
    code: "D0150",
    treatment: "Comprehensive Evaluation",
    provider: "Dr. Masterson",
    charge: "$85.00",
    checked: true,
  },
  {
    id: 2,
    code: "D1110",
    treatment: "Prophy",
    treatment2: "Adult",
    provider: "Dr. Masterson",
    charge: "$120.00",
    checked: true,
  },
  {
    id: 3,
    code: "D0274",
    treatment: "Bitewing Four Xrays",
    provider: "Dr. Masterson",
    charge: "$65.00",
    checked: true,
  },
];

const providerOptions = [
  "Dr. Masterson",
  "Dr. Kim",
  "Hygienist Kim",
  "Hygienist Sarah",
];

const operatoryOptions = [
  "Operatory 1",
  "Operatory 2",
  "Operatory 3",
  "Hyg 1",
];

const statusOptions = [
  "unconfirmed",
  "preconfirmed",
  "confirmed",
  "scheduled",
  "seated",
  "call",
  "checkout incomplete",
  "checked out complete",
  "no show",
  "rescheduled",
  "cancelled",
  "pending",
];

const AddNewPatientAppointmentForm = ({
  patients = [],
  loadingPatients = false,
  onPatientSearch,
  onSubmit,
  onCancel,
  loading = false,
  initialPatient = null,
  initialDateTime = null,
  open = true,
}) => {
  const [patient, setPatient] = useState(initialPatient || null);
  const [dateTime, setDateTime] = useState(
    initialDateTime || dayjs().hour(9).minute(5),
  );
  const [visitType, setVisitType] = useState("treatment");
  const [procedures, setProcedures] = useState(defaultProcedures);
  const [appointmentStatus, setAppointmentStatus] = useState("checked out complete");
  const [durationMins, setDurationMins] = useState(60);
  const [providerTimes, setProviderTimes] = useState([
    { provider: "Dr. Masterson", mins: 60 },
  ]);
  const [operatory, setOperatory] = useState("Operatory 2");
  const [preferredDentist, setPreferredDentist] = useState("");
  const [preferredHygienist, setPreferredHygienist] = useState("");
  const [referredBy, setReferredBy] = useState("Google reviews.");
  const [notes, setNotes] = useState("- Cash pay, no insurance.");
  const [sendReminders, setSendReminders] = useState(false);

  const handleProcedureCheck = (id) => {
    setProcedures((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)),
    );
  };

  const handleProcedureProviderChange = (id, value) => {
    setProcedures((prev) =>
      prev.map((p) => (p.id === id ? { ...p, provider: value } : p)),
    );
  };

  const handleAddProviderTime = () => {
    setProviderTimes((prev) => [...prev, { provider: "", mins: 60 }]);
  };

  const handleRemoveProviderTime = (index) => {
    setProviderTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProviderTimeChange = (index, field, value) => {
    setProviderTimes((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        patientId: patient?.id || patient?._id,
        appointmentDate: dateTime?.format?.("YYYY-MM-DD"),
        startTime: dateTime?.format?.("HH:mm"),
        durationMinutes: durationMins,
        status: appointmentStatus,
        notes,
        providerId: providerTimes[0]?.provider || "",
        operatory,
      });
    }
    if (onCancel) onCancel();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #eef2f6',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ bgcolor: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100%', overflow: 'hidden' }}>
        
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            py: 1.5,
            px: 2,
            bgcolor: "#2b6cb0",
            color: "#fff",
          }}
        >
          <Typography sx={{ fontWeight: 600, ...FONT_SM }}>
            Add New Patient Appointment
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{
              position: "absolute",
              right: 16,
              textTransform: "none",
              ...FONT_XS,
              bgcolor: "#e07c24",
              color: "#fff",
              "&:hover": { bgcolor: "#c96b1a" },
            }}
          >
            Convert to shortlist
          </Button>
        </Box>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* LEFT PANEL: Procedure Entry */}
        <Box sx={{ flexGrow: 1, p: 2, borderRight: '1px solid #cbd5e1', overflowY: 'auto', minHeight: 0 }}>
          
          {/* Visit Type Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: '12px', mr: 2, fontWeight: 600, color: '#4a6da7' }}>Type of visit:</Typography>
            <RadioGroup row value={visitType} onChange={(e) => setVisitType(e.target.value)}>
              <FormControlLabel value="treatment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{fontSize: '12px'}}>Treatment</Typography>} />
              <FormControlLabel value="recare" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{fontSize: '12px'}}>Recare</Typography>} />
            </RadioGroup>
          </Box>

          {/* Procedure Icons Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, alignItems: 'center' }}>
             <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {procedureIcons.map((item, idx) => (
                  <Chip 
                    key={idx} 
                    label={item.label} 
                    sx={{ 
                      bgcolor: item.color, color: item.font || 'black', 
                      borderRadius: '4px', height: 22, fontSize: '10px', fontWeight: 700 
                    }} 
                  />
                ))}
                <Typography sx={{ color: '#64748b', fontSize: '12px', ml: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>+Add Procedure</Typography>
             </Box>
          </Box>

          {/* Table Header Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#4a6da7' }}>
              Scheduled Procedures: <span style={{ fontWeight: 400, color: '#64748b', fontSize: '12px' }}>(show all procedures)</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button sx={{ bgcolor: '#e74c3c', color: 'white', textTransform: 'none', fontSize: '11px', height: 28, px: 2 }}>Compute next visit</Button>
              <Button sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', fontSize: '11px', height: 28, px: 2 }}>Re-estimate</Button>
            </Box>
          </Box>

          {/* The Procedure Table */}
          <Table size="small" sx={{ border: '1px solid #e2e8f0' }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ borderBottom: '2px solid #cbd5e1' }}><Checkbox size="small" checked /></TableCell>
                {['Procedure', 'Site', 'Treatment', 'Provider', 'Pt Part', 'Total Charge'].map(head => (
                  <TableCell key={head} sx={{ fontSize: '11px', fontWeight: 700, color: '#475569', borderBottom: '2px solid #cbd5e1' }}>{head}</TableCell>
                ))}
                <TableCell sx={{ borderBottom: '2px solid #cbd5e1' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {procedures.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                  <TableCell padding="checkbox"><Checkbox size="small" checked={row.checked} onChange={() => handleProcedureCheck(row.id)} /></TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{row.code}</TableCell>
                  <TableCell />
                  <TableCell>
                    <Select size="small" value={row.treatment} sx={{ height: 26, fontSize: '11px', width: 140, bgcolor: 'white' }}>
                      <MenuItem value={row.treatment}>{row.treatment}</MenuItem>
                      {row.treatment2 && <MenuItem value={row.treatment2}>{row.treatment2}</MenuItem>}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      size="small" 
                      value={row.provider} 
                      onChange={(e) => handleProcedureProviderChange(row.id, e.target.value)}
                      sx={{ height: 26, fontSize: '11px', minWidth: 120, bgcolor: 'white' }}
                    >
                      {providerOptions.map((opt) => (
                        <MenuItem key={opt} value={opt} sx={{ fontSize: '11px' }}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>{row.charge}</TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>{row.charge}</TableCell>
                  <TableCell sx={{ width: 80 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, color: '#94a3b8' }}>
                      <IconButton size="small" onClick={() => handleRemoveProviderTime(row.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      <IconButton size="small"><MailOutline fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow>
                <TableCell colSpan={6} align="right" sx={{ fontSize: '12px', fontWeight: 700, py: 0.5, pr: 2 }}>
                  ${procedures.reduce((sum, p) => sum + (parseFloat(p.charge?.replace('$', '') || '0')), 0).toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontSize: '12px', fontWeight: 700, py: 0.5 }}>
                  ${procedures.reduce((sum, p) => sum + (parseFloat(p.charge?.replace('$', '') || '0')), 0).toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>

          {/* Treatment Plan Procedures */}
          <Typography
            sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 1 }}
          >
            Treatment Plan Procedures:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={FONT_XS}>Select</InputLabel>
              <Select label="Select" sx={FONT_XS} />
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={FONT_XS}>Select</InputLabel>
              <Select label="Select" sx={FONT_XS} />
            </FormControl>
          </Box>
          <Button
            sx={{
              color: "#1976d2",
              textTransform: "none",
              ...FONT_XS,
              p: 0,
              minHeight: 0,
            }}
          >
            + add procedures from another visit
          </Button>
        </Box>

        {/* Right sidebar - Appointment Details */}
        <Box
          sx={{
            width: 320,
            borderLeft: "1px solid #e2e8f0",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            overflowY: 'auto'
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel sx={FONT_XS}>Appointment Status</InputLabel>
            <Select
              value={appointmentStatus}
              onChange={(e) => setAppointmentStatus(e.target.value)}
              label="Appointment Status"
              sx={FONT_XS}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt} sx={FONT_XS}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel sx={FONT_XS}>Operatory / Room</InputLabel>
            <Select
              value={operatory}
              onChange={(e) => setOperatory(e.target.value)}
              label="Operatory / Room"
              sx={FONT_XS}
            >
              {operatoryOptions.map((opt) => (
                <MenuItem key={opt} value={opt} sx={FONT_XS}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
              Appt Duration:
            </Typography>
            <TextField
              type="number"
              size="small"
              value={durationMins}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setDurationMins("");
                } else {
                  setDurationMins(Number(value) || 0);
                }
              }}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (!value || value < 5) {
                  setDurationMins(5);
                }
              }}
              sx={{ "& .MuiInputBase-input": FONT_XS }}
              inputProps={{ min: 5, step: 5 }}
            />
            <Typography
              component="span"
              sx={{ ...FONT_XS, ml: 0.5, color: "#64748b" }}
            >
              mins
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 0.5 }}
            >
              Provider
            </Typography>
            <Typography sx={{ ...FONT_XS, color: "#64748b", mb: 0.5 }}>
              Time
            </Typography>
            {providerTimes.map((row, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={row.provider}
                    onChange={(e) =>
                      handleProviderTimeChange(
                        index,
                        "provider",
                        e.target.value,
                      )
                    }
                    sx={FONT_XS}
                  >
                    {providerOptions.map((opt) => (
                      <MenuItem key={opt} value={opt} sx={FONT_XS}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  size="small"
                  value={row.mins}
                  onChange={(e) =>
                    handleProviderTimeChange(
                      index,
                      "mins",
                      Number(e.target.value),
                    )
                  }
                  sx={{ width: 70, "& .MuiInputBase-input": FONT_XS }}
                />
                <Typography sx={{ ...FONT_XS, color: "#64748b" }}>
                  mins
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveProviderTime(index)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
              <InputLabel sx={FONT_XS}>Add Provider/Assistant:</InputLabel>
              <Select
                label="Add Provider/Assistant:"
                sx={FONT_XS}
                onOpen={() => handleAddProviderTime()}
              >
                <MenuItem value="" sx={FONT_XS}>
                  Add...
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
              Patient's Preferred Dentist:
            </Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={preferredDentist}
                onChange={(e) => setPreferredDentist(e.target.value)}
                sx={FONT_XS}
              >
                <MenuItem value="" sx={FONT_XS}>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
              Patient's Preferred Hygienist:
            </Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={preferredHygienist}
                onChange={(e) => setPreferredHygienist(e.target.value)}
                sx={FONT_XS}
              >
                <MenuItem value="" sx={FONT_XS}>
                  Select
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
              Notes
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Add note/tags"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={2}
              sx={{ "& .MuiInputBase-input": FONT_XS }}
            />
          </Box>
          <Box>
            <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
              Tags
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                ...FONT_XS,
                bgcolor: "#e07c24",
                color: "#fff",
                "&:hover": { bgcolor: "#c96b1a" },
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer Utility Bar */}
      <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '12px', color: '#475569' }}>Send a reminder to "save the date" now:</Typography>
            <Button startIcon={<MailOutline />} sx={{ fontSize: '11px', textTransform: 'none', color: '#4a6da7' }}>Via Email</Button>
            <Button startIcon={<ChatBubbleOutline />} sx={{ fontSize: '11px', textTransform: 'none', color: '#4a6da7' }}>Via Text Message</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                textTransform: "none",
                ...FONT_SM,
                bgcolor: "#e07c24",
                color: "#fff",
                "&:hover": { bgcolor: "#c96b1a" },
              }}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onCancel}
              sx={{
                textTransform: "none",
                ...FONT_SM,
                borderColor: "#94a3b8",
                color: "#475569",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
      </Box>
    </Dialog>
  );
};

export default AddNewPatientAppointmentForm;
