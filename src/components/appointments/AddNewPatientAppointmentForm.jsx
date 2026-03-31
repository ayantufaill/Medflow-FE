import { useState, useRef, useEffect } from "react";
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
  DeleteOutline as DeleteOutlineIcon,
  Close as CloseIcon,
  MailOutline,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import { FONT_SM, FONT_XS } from "../../constants/styles";

// Status options matching OperatorySidebar appointment card
const STATUS_OPTIONS = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "preconfirmed", label: "Pre-Confirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "call", label: "Call" },
  { value: "checkout incomplete", label: "Checkout Incomplete" },
  { value: "checkout complete", label: "Checkout Complete" },
  { value: "no show", label: "No Show" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "cancelled", label: "Cancelled" },
];

// Default procedure tags shown in the tag bar
const DEFAULT_PROCEDURE_TAGS = [
  { label: "New",  color: "#81ecec" },
  { label: "Scr",  color: "#ff7675" },
  { label: "FULL", color: "#ffeaa7" },
  { label: "Pano", color: "#636e72", font: "white" },
  { label: "FMX",  color: "#2d3436", font: "white" },
  { label: "Xray", color: "#636e72", font: "white" },
  { label: "AdX",  color: "#b2bec3" },
  { label: "SCN",  color: "#55efc4" },
  { label: "Con",  color: "#81ecec" },
  { label: "Vir",  color: "#00b894", font: "white" },
];

// Default rows shown in the scheduled procedures table
const DEFAULT_PROCEDURES = [
  { id: 1, code: "D0150", treatment: "Comprehensive Evaluation", tag: { label: "New",  color: "#81ecec" },                provider: "", charge: "$85.00",  checked: true },
  { id: 2, code: "D1110", treatment: "Prophy",                   tag: { label: "SCN",  color: "#55efc4" },                provider: "", charge: "$120.00", checked: true },
  { id: 3, code: "D0274", treatment: "Bitewing Four Xrays",      tag: { label: "Xray", color: "#636e72", font: "white" }, provider: "", charge: "$65.00",  checked: true },
];

// Default procedure added to the table when each tag chip is selected
const TAG_DEFAULT_PROCEDURES = {
  New:  { code: "D0150", treatment: "Comprehensive Evaluation",         charge: "$85.00"  },
  Scr:  { code: "D4341", treatment: "Periodontal Scaling & Root Planing", charge: "$220.00" },
  FULL: { code: "D2391", treatment: "Resin Composite – One Surface",     charge: "$185.00" },
  Pano: { code: "D0330", treatment: "Panoramic Radiographic Image",      charge: "$120.00" },
  FMX:  { code: "D0210", treatment: "Complete Series of Radiographs",    charge: "$150.00" },
  Xray: { code: "D0220", treatment: "Periapical First Image",            charge: "$30.00"  },
  AdX:  { code: "D0230", treatment: "Periapical Each Additional Image",  charge: "$25.00"  },
  SCN:  { code: "D1110", treatment: "Prophy",                            charge: "$120.00" },
  Con:  { code: "D0120", treatment: "Periodic Oral Evaluation",          charge: "$55.00"  },
  Vir:  { code: "D9310", treatment: "Consultation – Diagnostic Service", charge: "$95.00"  },
};

// Dummy searchable procedure catalog for the "Add Procedure" autocomplete
const DUMMY_PROCEDURE_OPTIONS = [
  { code: "D0120", treatment: "Periodic Oral Evaluation",           tag: { label: "Con",  color: "#81ecec" },                charge: "$55.00"  },
  { code: "D0140", treatment: "Limited Oral Evaluation",            tag: { label: "Con",  color: "#81ecec" },                charge: "$75.00"  },
  { code: "D0210", treatment: "Complete Series of Radiographs",     tag: { label: "FMX",  color: "#2d3436", font: "white" }, charge: "$150.00" },
  { code: "D0220", treatment: "Periapical First Image",             tag: { label: "Xray", color: "#636e72", font: "white" }, charge: "$30.00"  },
  { code: "D0230", treatment: "Periapical Each Additional Image",   tag: { label: "Xray", color: "#636e72", font: "white" }, charge: "$25.00"  },
  { code: "D0330", treatment: "Panoramic Radiographic Image",       tag: { label: "Pano", color: "#636e72", font: "white" }, charge: "$120.00" },
  { code: "D1120", treatment: "Child Prophylaxis",                  tag: { label: "SCN",  color: "#55efc4" },                charge: "$85.00"  },
  { code: "D2140", treatment: "Amalgam – One Surface Primary",      tag: { label: "FULL", color: "#ffeaa7" },                charge: "$145.00" },
  { code: "D2391", treatment: "Resin Composite – One Surface",      tag: { label: "FULL", color: "#ffeaa7" },                charge: "$185.00" },
  { code: "D4341", treatment: "Periodontal Scaling & Root Planing", tag: { label: "Scr",  color: "#ff7675" },                charge: "$220.00" },
  { code: "D7140", treatment: "Extraction – Erupted Tooth",         tag: { label: "New",  color: "#81ecec" },                charge: "$175.00" },
  { code: "D9310", treatment: "Consultation – Diagnostic Service",  tag: { label: "Vir",  color: "#00b894", font: "white" }, charge: "$95.00"  },
];

// props:
//   patients, loadingPatients, onPatientSearch — patient autocomplete
//   providers   — array from providerService/Redux (objects with _id, userId.firstName, etc.)
//   rooms       — array from roomService/Redux (objects with _id, name)
//   appointmentTypes — array from appointmentTypeService/Redux (objects with _id, name)
//   onSubmit, onCancel, loading, initialPatient, initialDateTime, open
const AddNewPatientAppointmentForm = ({
  patients = [],
  loadingPatients = false,
  onPatientSearch,
  providers = [],
  rooms = [],
  appointmentTypes = [],
  onSubmit,
  onCancel,
  loading = false,
  initialPatient = null,
  initialDateTime = null,
  open = true,
}) => {
  // Initialize patient from initialPatient prop, reset when it changes
  const [patient, setPatient] = useState(initialPatient || null);
  const [dateTime, setDateTime] = useState(
    initialDateTime || dayjs().hour(9).minute(5),
  );
  const [visitType, setVisitType] = useState("treatment");

  // Reset form when initialPatient changes (e.g., when opening from sidebar)
  useEffect(() => {
    if (initialPatient) {
      setPatient(initialPatient);
    }
  }, [initialPatient]);

  // Scheduled procedure table rows
  const [procedures, setProcedures] = useState(DEFAULT_PROCEDURES);

  // Procedure tags: all available tags + which ones are selected
  const [procedureTags, setProcedureTags] = useState(DEFAULT_PROCEDURE_TAGS);
  const [selectedTagLabels, setSelectedTagLabels] = useState(new Set());

  // Tracks which table row id was added by each tag (label → procedure id)
  const [tagProcedureIds, setTagProcedureIds] = useState({});

  // "Add Procedure" autocomplete state
  const [addingProcedure, setAddingProcedure] = useState(false);
  const [procedureInputValue, setProcedureInputValue] = useState("");
  const nextProcedureId = useRef(DEFAULT_PROCEDURES.length + 1);

  // Right-panel fields
  const [appointmentStatus, setAppointmentStatus] = useState("unconfirmed");
  const [durationMins, setDurationMins] = useState(60);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [selectedAssistantId, setSelectedAssistantId] = useState("");
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState("");
  const [notes, setNotes] = useState("");

  // Debounce ref for patient search
  const searchDebounceRef = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Format a provider object into a display name
  const providerLabel = (p) => {
    if (!p) return "";
    const u = p.userId || p;
    const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
    return name || p.providerCode || `Provider ${p._id || p.id}`;
  };

  // ── Procedure tag handlers ────────────────────────────────────────────────

  // Toggle a tag: selecting adds its default procedure to the table; deselecting removes it
  const handleTagClick = (label) => {
    const isSelected = selectedTagLabels.has(label);

    if (isSelected) {
      // Deselect — remove the procedure row that was added by this tag
      setSelectedTagLabels((prev) => { const n = new Set(prev); n.delete(label); return n; });
      const procId = tagProcedureIds[label];
      if (procId != null) {
        setProcedures((prev) => prev.filter((p) => p.id !== procId));
        setTagProcedureIds((prev) => { const { [label]: _, ...rest } = prev; return rest; });
      }
    } else {
      // Select — add the tag's default procedure to the table
      setSelectedTagLabels((prev) => new Set([...prev, label]));
      const template = TAG_DEFAULT_PROCEDURES[label];
      const tagInfo  = DEFAULT_PROCEDURE_TAGS.find((t) => t.label === label);
      if (template && tagInfo) {
        const newId = nextProcedureId.current++;
        setProcedures((prev) => [
          ...prev,
          {
            id: newId,
            code: template.code,
            treatment: template.treatment,
            tag: { label: tagInfo.label, color: tagInfo.color, font: tagInfo.font },
            provider: "",
            charge: template.charge,
            checked: true,
          },
        ]);
        setTagProcedureIds((prev) => ({ ...prev, [label]: newId }));
      }
    }
  };

  // Add a procedure from the autocomplete search to the scheduled procedures table
  const handleSelectProcedure = (option) => {
    if (!option) return;
    setProcedures((prev) => [
      ...prev,
      {
        id: nextProcedureId.current++,
        code: option.code,
        treatment: option.treatment,
        tag: option.tag,
        provider: "",
        charge: option.charge,
        checked: true,
      },
    ]);
    setProcedureInputValue("");
    setAddingProcedure(false);
  };

  // ── Procedure table handlers ──────────────────────────────────────────────

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

  const handleDeleteProcedure = (id) => {
    setProcedures((prev) => prev.filter((p) => p.id !== id));
    // If this row was added by a tag, deselect that tag too
    const tagLabel = Object.entries(tagProcedureIds).find(([, pid]) => pid === id)?.[0];
    if (tagLabel) {
      setSelectedTagLabels((prev) => { const n = new Set(prev); n.delete(tagLabel); return n; });
      setTagProcedureIds((prev) => { const { [tagLabel]: _, ...rest } = prev; return rest; });
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!onSubmit) return;

    // Calculate endTime from dateTime + durationMins
    const start = dateTime || dayjs();
    const end = start.add(durationMins || 30, "minute");

    onSubmit({
      patientId:    patient?._id || patient?.id,
      patientName:  patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "",
      appointmentDate: start.format("YYYY-MM-DD"),
      startTime:    start.format("HH:mm"),
      endTime:      end.format("HH:mm"),          // required by the API
      durationMinutes: durationMins,
      status:       appointmentStatus,             // valid API values only
      notes,
      providerId:   selectedProviderId || undefined,
      roomId:       selectedRoomId || undefined,   // API field name is roomId, not operatoryId
      ...(selectedAppointmentTypeId && { appointmentTypeId: selectedAppointmentTypeId }),
      // Pack selected tags and assistant into customFields (no dedicated API field)
      customFields: {
        selectedProcedureTags: [...selectedTagLabels],
        ...(selectedAssistantId && { assistantId: selectedAssistantId }),
        visitType,
      },
    });

    if (onCancel) onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      disableBackdropClick
      disableScrollLock
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: "1px solid #eef2f6",
          maxHeight: "90vh",
          overflow: "hidden",
          zIndex: 1301,
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          height: "100%",
          overflow: "hidden",
        }}
      >
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

        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", minHeight: 0 }}>

          {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              borderRight: "1px solid #cbd5e1",
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            {/* Visit Type */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography sx={{ fontSize: "12px", mr: 2, fontWeight: 600, color: "#4a6da7" }}>
                Type of visit:
              </Typography>
              <RadioGroup row value={visitType} onChange={(e) => setVisitType(e.target.value)}>
                <FormControlLabel
                  value="treatment"
                  control={<Radio size="small" sx={{ p: 0.5 }} />}
                  label={<Typography sx={{ fontSize: "12px" }}>Treatment</Typography>}
                />
                <FormControlLabel
                  value="recare"
                  control={<Radio size="small" sx={{ p: 0.5 }} />}
                  label={<Typography sx={{ fontSize: "12px" }}>Recare</Typography>}
                />
              </RadioGroup>
            </Box>

            {/* Procedure Tags
                - Click a tag to select/deselect it (highlighted with a border)
                - Click "+Add Procedure" to create a new custom tag */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2.5, alignItems: "center" }}>
              {procedureTags.map((item) => {
                const isSelected = selectedTagLabels.has(item.label);
                return (
                  <Chip
                    key={item.label}
                    label={item.label}
                    onClick={() => handleTagClick(item.label)}
                    sx={{
                      bgcolor: item.color,
                      color: item.font || "black",
                      borderRadius: "4px",
                      height: 24,
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      // Highlight selected tags with a dark border + slight shadow
                      border: isSelected ? "2px solid #1e293b" : "2px solid transparent",
                      boxShadow: isSelected ? "0 0 0 2px rgba(30,41,59,0.25)" : "none",
                      transition: "border 0.1s, box-shadow 0.1s",
                      "&:hover": { opacity: 0.85 },
                    }}
                  />
                );
              })}

              {/* Inline "Add Procedure" autocomplete */}
              {addingProcedure ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Autocomplete
                    autoFocus
                    open={procedureInputValue.length > 0}
                    options={DUMMY_PROCEDURE_OPTIONS}
                    getOptionLabel={(o) => `${o.code} – ${o.treatment}`}
                    inputValue={procedureInputValue}
                    onInputChange={(_, val) => setProcedureInputValue(val)}
                    onChange={(_, val) => handleSelectProcedure(val)}
                    filterOptions={(opts, { inputValue }) => {
                      const q = inputValue.toLowerCase();
                      return opts.filter(
                        (o) =>
                          o.code.toLowerCase().includes(q) ||
                          o.treatment.toLowerCase().includes(q),
                      );
                    }}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        key={option.code}
                        sx={{ display: "flex", alignItems: "center", gap: 1, py: "4px !important" }}
                      >
                        <Chip
                          label={option.tag.label}
                          size="small"
                          sx={{
                            bgcolor: option.tag.color,
                            color: option.tag.font || "black",
                            fontSize: "9px",
                            height: 18,
                            borderRadius: "3px",
                            fontWeight: 700,
                          }}
                        />
                        <Typography sx={{ fontSize: "11px", fontWeight: 600 }}>
                          {option.code}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#475569" }}>
                          {option.treatment}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#94a3b8", ml: "auto" }}>
                          {option.charge}
                        </Typography>
                      </Box>
                    )}
                    sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        autoFocus
                        placeholder="Search by code or name…"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setProcedureInputValue("");
                            setAddingProcedure(false);
                          }
                        }}
                        sx={{ "& .MuiInputBase-input": { fontSize: "11px", py: "4px !important" } }}
                      />
                    )}
                  />
                  <IconButton
                    size="small"
                    onClick={() => { setProcedureInputValue(""); setAddingProcedure(false); }}
                    sx={{ p: 0.25 }}
                  >
                    <CloseIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                  </IconButton>
                </Box>
              ) : (
                <Typography
                  onClick={() => setAddingProcedure(true)}
                  sx={{
                    color: "#64748b",
                    fontSize: "12px",
                    ml: 0.5,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline", color: "#1976d2" },
                  }}
                >
                  + Add Procedure
                </Typography>
              )}
            </Box>

            {/* Scheduled Procedures Table Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#4a6da7" }}>
                Scheduled Procedures:{" "}
                <span style={{ fontWeight: 400, color: "#64748b", fontSize: "12px" }}>
                  (show all procedures)
                </span>
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  sx={{
                    bgcolor: "#e74c3c",
                    color: "white",
                    textTransform: "none",
                    fontSize: "11px",
                    height: 28,
                    px: 2,
                  }}
                >
                  Compute next visit
                </Button>
                <Button
                  sx={{
                    bgcolor: "#d4a373",
                    color: "white",
                    textTransform: "none",
                    fontSize: "11px",
                    height: 28,
                    px: 2,
                  }}
                >
                  Re-estimate
                </Button>
              </Box>
            </Box>

            {/* Procedures Table */}
            <Table size="small" sx={{ border: "1px solid #e2e8f0" }}>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ borderBottom: "2px solid #cbd5e1" }}>
                    <Checkbox size="small" checked />
                  </TableCell>
                  {["Procedure", "Site", "Treatment", "Provider", "Pt Part", "Total Charge"].map(
                    (head) => (
                      <TableCell
                        key={head}
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#475569",
                          borderBottom: "2px solid #cbd5e1",
                        }}
                      >
                        {head}
                      </TableCell>
                    ),
                  )}
                  <TableCell sx={{ borderBottom: "2px solid #cbd5e1" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.map((row) => (
                  <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={row.checked}
                        onChange={() => handleProcedureCheck(row.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        {row.tag && (
                          <Chip
                            label={row.tag.label}
                            size="small"
                            sx={{
                              bgcolor: row.tag.color,
                              color: row.tag.font || "black",
                              fontSize: "9px",
                              height: 18,
                              borderRadius: "3px",
                              fontWeight: 700,
                            }}
                          />
                        )}
                        {row.code}
                      </Box>
                    </TableCell>
                    <TableCell />
                    <TableCell>
                      <Select
                        size="small"
                        value={row.treatment}
                        sx={{ height: 26, fontSize: "11px", width: 140, bgcolor: "white" }}
                      >
                        <MenuItem value={row.treatment}>{row.treatment}</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {/* Provider dropdown uses real providers from props */}
                      <Select
                        size="small"
                        value={row.provider}
                        onChange={(e) => handleProcedureProviderChange(row.id, e.target.value)}
                        sx={{ height: 26, fontSize: "11px", minWidth: 120, bgcolor: "white" }}
                        displayEmpty
                      >
                        <MenuItem value="" sx={{ fontSize: "11px" }}>
                          — Select —
                        </MenuItem>
                        {providers.map((p) => (
                          <MenuItem
                            key={p._id || p.id}
                            value={String(p._id || p.id)}
                            sx={{ fontSize: "11px" }}
                          >
                            {providerLabel(p)}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>{row.charge}</TableCell>
                    <TableCell sx={{ fontSize: "12px", fontWeight: 600 }}>{row.charge}</TableCell>
                    <TableCell sx={{ width: 60 }}>
                      <IconButton size="small" onClick={() => handleDeleteProcedure(row.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals row */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="right"
                    sx={{ fontSize: "12px", fontWeight: 700, py: 0.5, pr: 2 }}
                  >
                    $
                    {procedures
                      .reduce(
                        (sum, p) => sum + parseFloat(p.charge?.replace("$", "") || "0"),
                        0,
                      )
                      .toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px", fontWeight: 700, py: 0.5 }}>
                    $
                    {procedures
                      .reduce(
                        (sum, p) => sum + parseFloat(p.charge?.replace("$", "") || "0"),
                        0,
                      )
                      .toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>

            {/* Treatment Plan Procedures */}
            <Typography sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mt: 2, mb: 1 }}>
              Treatment Plan Procedures:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel sx={FONT_XS}>Appointment Type</InputLabel>
                <Select
                  label="Appointment Type"
                  value={selectedAppointmentTypeId}
                  onChange={(e) => setSelectedAppointmentTypeId(e.target.value)}
                  sx={FONT_XS}
                >
                  <MenuItem value="" sx={FONT_XS}>— None —</MenuItem>
                  {appointmentTypes.map((t) => (
                    <MenuItem key={t._id || t.id} value={String(t._id || t.id)} sx={FONT_XS}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              sx={{ color: "#1976d2", textTransform: "none", ...FONT_XS, p: 0, minHeight: 0 }}
            >
              + add procedures from another visit
            </Button>
          </Box>

          {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
          <Box
            sx={{
              width: 320,
              borderLeft: "1px solid #e2e8f0",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              overflowY: "auto",
            }}
          >
            {/* Appointment Status — values match backend API enum */}
            <FormControl size="small" fullWidth>
              <InputLabel sx={FONT_XS}>Appointment Status</InputLabel>
              <Select
                value={appointmentStatus}
                onChange={(e) => setAppointmentStatus(e.target.value)}
                label="Appointment Status"
                sx={FONT_XS}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} sx={FONT_XS}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Operatory / Room — populated from rooms API */}
            <FormControl size="small" fullWidth>
              <InputLabel sx={FONT_XS}>Operatory / Room</InputLabel>
              <Select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                label="Operatory / Room"
                sx={FONT_XS}
              >
                <MenuItem value="" sx={FONT_XS}>— Select —</MenuItem>
                {rooms.map((r) => (
                  <MenuItem key={r._id || r.id} value={String(r._id || r.id)} sx={FONT_XS}>
                    {r.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Appointment Duration */}
            <Box>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
                Appt Duration:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TextField
                  type="number"
                  size="small"
                  value={durationMins}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDurationMins(v === "" ? "" : Number(v) || 0);
                  }}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (!v || v < 5) setDurationMins(5);
                  }}
                  sx={{ width: 80, "& .MuiInputBase-input": FONT_XS }}
                  inputProps={{ min: 5, step: 5 }}
                />
                <Typography component="span" sx={{ ...FONT_XS, color: "#64748b" }}>
                  mins
                </Typography>
              </Box>
            </Box>

            {/* Provider — populated from providers API */}
            <Box>
              <Typography sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 0.5 }}>
                Provider
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  displayEmpty
                  sx={FONT_XS}
                >
                  <MenuItem value="" sx={FONT_XS}>— Select Provider —</MenuItem>
                  {providers.map((p) => (
                    <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={FONT_XS}>
                      {providerLabel(p)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Provider's Assistant — second provider slot */}
            <Box>
              <Typography sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 0.5 }}>
                Provider's Assistant
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedAssistantId}
                  onChange={(e) => setSelectedAssistantId(e.target.value)}
                  displayEmpty
                  sx={FONT_XS}
                >
                  <MenuItem value="" sx={FONT_XS}>— Select Assistant —</MenuItem>
                  {providers.map((p) => (
                    <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={FONT_XS}>
                      {providerLabel(p)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Date / Time */}
            <Box>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
                Date &amp; Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={dateTime}
                  onChange={(val) => val && setDateTime(val)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: { "& .MuiInputBase-input": FONT_XS },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* Notes */}
            <Box>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>Notes</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Add note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
                sx={{ "& .MuiInputBase-input": FONT_XS }}
              />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 1.5, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: "12px", color: "#475569" }}>
                Send a reminder to "save the date" now:
              </Typography>
              <Button
                startIcon={<MailOutline />}
                sx={{ fontSize: "11px", textTransform: "none", color: "#4a6da7" }}
              >
                Via Email
              </Button>
              <Button
                startIcon={<ChatBubbleOutline />}
                sx={{ fontSize: "11px", textTransform: "none", color: "#4a6da7" }}
              >
                Via Text Message
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                disabled={loading || !patient}
                sx={{
                  textTransform: "none",
                  ...FONT_SM,
                  bgcolor: "#e07c24",
                  color: "#fff",
                  "&:hover": { bgcolor: "#c96b1a" },
                }}
              >
                {loading ? "Saving..." : "Add"}
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
