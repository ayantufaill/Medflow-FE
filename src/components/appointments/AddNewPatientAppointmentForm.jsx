import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";

const FONT_SM = { fontSize: "0.8125rem" };
const FONT_XS = { fontSize: "0.75rem" };

const PROCEDURE_ICONS = [
  { id: "p-op", label: "P-OP", color: "#7e57c2" },
  { id: "hyg", label: "HYG", color: "#26a69a" },
  { id: "fmx", label: "FMX", color: "#ef6c00" },
  { id: "pano", label: "Pano", color: "#42a5f5" },
  { id: "full", label: "FULL", color: "#8d6e63" },
  { id: "xray", label: "Xray", color: "#66bb6a" },
];

const defaultProcedures = [
  {
    id: 1,
    code: "D0150",
    treatment: "Comprehensive Evaluation",
    provider: "KIM",
    charge: "",
    checked: true,
  },
  {
    id: 2,
    code: "D1110",
    treatment: "Prophy",
    treatment2: "Adult",
    provider: "KIM",
    charge: "",
    checked: true,
  },
  {
    id: 3,
    code: "D0274",
    treatment: "Bitewing Four Xrays",
    provider: "KIM",
    charge: "",
    checked: true,
  },
  {
    id: 4,
    code: "D0330",
    treatment: "Panoramic Xray",
    provider: "KIM",
    charge: "",
    checked: false,
  },
];

const providerOptions = ["KIM", "DR", "JOHN", "SARAH", "Hygienist Kim"];

const operatoryOptions = [
  { value: "op1", label: "Op 1" },
  { value: "op2", label: "Op 2" },
  { value: "op3", label: "Op 3" },
  { value: "op4", label: "Op 4" },
  { value: "consult", label: "Hyg 1" },
];

const statusOptions = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "preconfirmed", label: "Preconfirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "scheduled", label: "Scheduled" },
  { value: "seated", label: "Seated" },
  { value: "call", label: "Call" },
  { value: "checkout incomplete", label: "Checkout Incomplete" },
  { value: "checkout complete", label: "Checkout Complete" },
  { value: "no show", label: "No Show" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pending", label: "Pending" },
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
}) => {
  const [patient, setPatient] = useState(initialPatient || null);
  const [dateTime, setDateTime] = useState(
    initialDateTime || dayjs().hour(9).minute(5),
  );
  const [visitType, setVisitType] = useState("Treatment");
  const [procedures, setProcedures] = useState(defaultProcedures);
  const [status, setStatus] = useState("confirmed");
  const [durationMins, setDurationMins] = useState(90);
  const [providerTimes, setProviderTimes] = useState([
    { provider: "Hygienist Kim", mins: 60 },
  ]);
  const [roomId, setRoomId] = useState("");
  const [preferredDentist, setPreferredDentist] = useState("");
  const [preferredHygienist, setPreferredHygienist] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);

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
        status: typeof status === "string" ? status.toLowerCase() : status,
        notes,
        providerId: providerTimes[0]?.provider || "",
        roomId,
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
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

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left content */}
        <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
          {/* For Patient + Date/Time */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ ...FONT_XS, color: "#475569" }}>
                For Patient:
              </Typography>
              <Autocomplete
                size="small"
                value={patient}
                onChange={(_, v) => setPatient(v)}
                onInputChange={(_, v) => onPatientSearch?.(v)}
                options={patients}
                getOptionLabel={(o) =>
                  o?.firstName && o?.lastName
                    ? `${o.firstName} ${o.lastName}`
                    : o?.name || ""
                }
                sx={{ minWidth: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search patient..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <SearchIcon
                          sx={{ color: "#94a3b8", mr: 0.5, fontSize: 18 }}
                        />
                      ),
                    }}
                    sx={{ "& .MuiInputBase-root": { ...FONT_XS } }}
                  />
                )}
              />
            </Box>
            <Typography sx={{ ...FONT_XS, color: "#64748b" }}>
              on {dateTime ? dayjs(dateTime).format("MM/DD/YYYY") : "--"} @{" "}
              {dateTime ? dayjs(dateTime).format("hh:mm A") : "--"}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={dateTime}
                onChange={setDateTime}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { "& .MuiInputBase-input": FONT_XS, width: 180 },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          {/* Type of visit */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
              Type of visit:
            </Typography>
            <RadioGroup
              row
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
            >
              <FormControlLabel
                value="Treatment"
                control={<Radio size="small" />}
                label={<Typography sx={FONT_XS}>Treatment</Typography>}
              />
              <FormControlLabel
                value="Recare"
                control={<Radio size="small" />}
                label={<Typography sx={FONT_XS}>Recare</Typography>}
              />
            </RadioGroup>
          </Box>

          {/* Procedure icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {PROCEDURE_ICONS.map((icon) => (
              <Box
                key={icon.id}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: icon.color,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...FONT_XS,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {icon.label}
              </Box>
            ))}
          </Box>
          <Button
            sx={{
              color: "#1976d2",
              textTransform: "none",
              ...FONT_XS,
              p: 0,
              minHeight: 0,
              mb: 2,
            }}
          >
            +Add Procedure
          </Button>

          {/* New Procedures */}
          <Typography
            sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 1 }}
          >
            New Procedures:
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ border: "1px solid #e2e8f0", borderRadius: 1, mb: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell
                    sx={{
                      ...FONT_XS,
                      fontWeight: 600,
                      color: "#475569",
                      py: 0.75,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...FONT_XS,
                      fontWeight: 600,
                      color: "#475569",
                      py: 0.75,
                    }}
                  >
                    Procedure
                  </TableCell>
                  <TableCell
                    sx={{
                      ...FONT_XS,
                      fontWeight: 600,
                      color: "#475569",
                      py: 0.75,
                    }}
                  >
                    Site
                  </TableCell>
                  <TableCell
                    sx={{
                      ...FONT_XS,
                      fontWeight: 600,
                      color: "#475569",
                      py: 0.75,
                    }}
                  >
                    Treatment
                  </TableCell>
                  <TableCell
                    sx={{
                      ...FONT_XS,
                      fontWeight: 600,
                      color: "#475569",
                      py: 0.75,
                    }}
                  >
                    Provider
                  </TableCell>
                  <TableCell
                    sx={{
                      ...FONT_XS,
                      fontWeight: 600,
                      color: "#475569",
                      py: 0.75,
                    }}
                  >
                    Total Charge
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ py: 0.5 }}>
                      <Checkbox
                        size="small"
                        checked={row.checked}
                        onChange={() => handleProcedureCheck(row.id)}
                        sx={{ p: 0.25 }}
                      />
                    </TableCell>
                    <TableCell sx={{ ...FONT_XS, py: 0.5 }}>
                      {row.code}
                    </TableCell>
                    <TableCell sx={{ ...FONT_XS, py: 0.5 }}>-</TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        size="small"
                        value={row.treatment}
                        readOnly
                        variant="outlined"
                        sx={{ "& .MuiInputBase-input": FONT_XS, width: 160 }}
                      />
                      {row.treatment2 && (
                        <Select
                          size="small"
                          value={row.treatment2}
                          sx={{ ml: 0.5, ...FONT_XS, minWidth: 90, height: 32 }}
                        >
                          <MenuItem value="Adult" sx={FONT_XS}>
                            Adult
                          </MenuItem>
                          <MenuItem value="Child" sx={FONT_XS}>
                            Child
                          </MenuItem>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={row.provider || ""}
                          onChange={(e) =>
                            handleProcedureProviderChange(
                              row.id,
                              e.target.value,
                            )
                          }
                          displayEmpty
                          sx={FONT_XS}
                        >
                          {providerOptions.map((opt) => (
                            <MenuItem key={opt} value={opt} sx={FONT_XS}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ ...FONT_XS, py: 0.5 }}>
                      {row.charge || ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
        <Paper
          elevation={0}
          sx={{
            width: 320,
            borderLeft: "1px solid #e2e8f0",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel sx={FONT_XS}>Appointment Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Appointment Status"
              sx={FONT_XS}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={FONT_XS}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel sx={FONT_XS}>Operatory / Room</InputLabel>
            <Select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              label="Operatory / Room"
              sx={FONT_XS}
            >
              {operatoryOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={FONT_XS}>
                  {opt.label}
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
              onChange={(e) => setDurationMins(Number(e.target.value) || 0)}
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

          <Box sx={{ flex: 1 }} />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
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
        </Paper>
      </Box>
    </Box>
  );
};

export default AddNewPatientAppointmentForm;
