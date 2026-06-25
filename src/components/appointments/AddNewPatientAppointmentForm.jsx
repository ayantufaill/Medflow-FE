import { useState, useRef, useEffect, useMemo } from "react";
import {
  Autocomplete, Box, Button, Checkbox, Chip, Dialog,
  FormControlLabel, IconButton, MenuItem,
  Radio, RadioGroup, Select, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import {
  DeleteOutline, Close, EventNote, AutoAwesome,
  AccessTime, Person, LocalOffer, Add, Search,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

/* ─── Constants ───────────────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "preconfirmed", label: "Preconfirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "arrived", label: "Arrived" },
  { value: "ready_to_be_seated", label: "Ready To Be Seated" },
  { value: "seated", label: "Seated" },
  { value: "ready_for_doctor", label: "Ready For Doctor" },
  { value: "in_treatment", label: "In Treatment" },
  { value: "ready_for_checkout", label: "Ready For Checkout" },
  { value: "checked_out_incomplete", label: "Checked out incomplete" },
  { value: "checked_out_complete", label: "Checked out complete" },
  { value: "no_show", label: "No Show" },
  { value: "call", label: "Call" },
  { value: "left_message", label: "Left message" },
  { value: "running_late", label: "Running Late" },
  { value: "sent_email_or_text", label: "Sent Email Or Text" },
  { value: "late", label: "Late" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
];
const DEFAULT_PROCEDURE_TAGS = [
  { label: "NP",    color: "#0d9488" },
  { label: "Exm",   color: "#92400e", font: "white" },
  { label: "Del",   color: "#4d7c0f", font: "white" },
  { label: "DFV",   color: "#1d4ed8", font: "white" },
  { label: "P-OP",  color: "#c2410c", font: "white" },
  { label: "P-OP",  color: "#ea580c", font: "white" },
  { label: "HYG",   color: "#16a34a", font: "white" },
  { label: "HYG",   color: "#059669", font: "white" },
  { label: "Perio", color: "#6b7280", font: "white" },
  { label: "LOE",   color: "#65a30d", font: "white" },
  { label: "HYG",   color: "#10b981" },
  { label: "POE",   color: "#374151", font: "white" },
  { label: "PA1",   color: "#f87171" },
  { label: "Pano",  color: "#1e293b", font: "white" },
  { label: "PAJ",   color: "#7c3aed", font: "white" },
  { label: "VEL",   color: "#0891b2", font: "white" },
  { label: "RCR",   color: "#1e40af", font: "white" },
  { label: "LTD",   color: "#d97706", font: "white" },
  { label: "FULL",  color: "#7f1d1d", font: "white" },
  { label: "FMD",   color: "#78350f", font: "white" },
];

const TAG_DEFAULT_PROCEDURES = {
  NP:    { code: "D0150", treatment: "Comprehensive Evaluation",         charge: "$85.00"  },
  Exm:   { code: "D0120", treatment: "Periodic Oral Evaluation",         charge: "$55.00"  },
  FULL:  { code: "D2391", treatment: "Resin Composite – One Surface",    charge: "$185.00" },
  Pano:  { code: "D0330", treatment: "Panoramic Radiographic Image",     charge: "$120.00" },
  HYG:   { code: "D1110", treatment: "Prophy",                           charge: "$120.00" },
  Perio: { code: "D4341", treatment: "Periodontal Scaling & Root Planing", charge: "$220.00" },
  DFV:   { code: "D0220", treatment: "Periapical First Image",           charge: "$30.00"  },
  FMD:   { code: "D0210", treatment: "Complete Series of Radiographs",   charge: "$150.00" },
};

const DUMMY_PROCEDURE_OPTIONS = [
  { code: "D0120", treatment: "Periodic Oral Evaluation",           tag: { label: "Exm",  color: "#92400e", font: "white" }, charge: "$55.00"  },
  { code: "D0150", treatment: "Comprehensive Evaluation",           tag: { label: "NP",   color: "#0d9488" },                charge: "$85.00"  },
  { code: "D0210", treatment: "Complete Series of Radiographs",     tag: { label: "FMD",  color: "#78350f", font: "white" }, charge: "$150.00" },
  { code: "D0220", treatment: "Periapical First Image",             tag: { label: "DFV",  color: "#1d4ed8", font: "white" }, charge: "$30.00"  },
  { code: "D0330", treatment: "Panoramic Radiographic Image",       tag: { label: "Pano", color: "#1e293b", font: "white" }, charge: "$120.00" },
  { code: "D1110", treatment: "Prophy",                             tag: { label: "HYG",  color: "#16a34a", font: "white" }, charge: "$120.00" },
  { code: "D1206", treatment: "Fluoride",                           tag: { label: "HYG",  color: "#059669", font: "white" }, charge: "$45.00"  },
  { code: "D2391", treatment: "Resin Composite – One Surface",      tag: { label: "FULL", color: "#7f1d1d", font: "white" }, charge: "$185.00" },
  { code: "D4341", treatment: "Periodontal Scaling & Root Planing", tag: { label: "Perio",color: "#6b7280", font: "white" }, charge: "$220.00" },
];

const COLOR_TAGS = [
  "#0d9488", "#f97316", "#eab308",
  "#ef4444", "#8b5cf6", "#06b6d4",
  "#22c55e", "#ec4899",
];

const INITIAL_PROCEDURES = [
  { id: 1,  code: "D1110", site: "Adult",   treatment: "Prophy",               provider: "", charge: "$120.00", checked: true },
  { id: 2,  code: "D1206", site: "Varnish", treatment: "Fluoride",              provider: "", charge: "$45.00",  checked: true },
  { id: 3,  code: "D0330", site: "",        treatment: "Panoramic Xray",        provider: "", charge: "$120.00", checked: true },
  { id: 4,  code: "D0274", site: "",        treatment: "Bitewing Four Xrays",   provider: "", charge: "$65.00",  checked: true },
  { id: 5,  code: "FMD",   site: "",        treatment: "FMD",                   provider: "", charge: "$150.00", checked: true },
  { id: 6,  code: "FULL",  site: "",        treatment: "FULL",                  provider: "", charge: "$185.00", checked: true },
  { id: 7,  code: "POP2",  site: "",        treatment: "P-OP",                  provider: "", charge: "$95.00",  checked: true },
  { id: 8,  code: "POP",   site: "",        treatment: "P-OP",                  provider: "", charge: "$95.00",  checked: true },
  { id: 9,  code: "DFV",   site: "",        treatment: "DFV",                   provider: "", charge: "$30.00",  checked: true },
];

/* ─── Tiny helpers ────────────────────────────────────────────────── */
const Label = ({ children, sx }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "4px", ...sx }}>
    {children}
  </Typography>
);

const FieldBox = ({ label, children, sx }) => (
  <Box sx={sx}>
    <Label>{label}</Label>
    {children}
  </Box>
);

/* ─── Main component ──────────────────────────────────────────────── */
const AddNewPatientAppointmentForm = ({
  patients = [],
  loadingPatients = false,
  onPatientSearch,
  providers = [],
  // rooms and appointmentTypes accepted for API compatibility but not rendered
  // eslint-disable-next-line no-unused-vars
  rooms: _rooms = [],
  // eslint-disable-next-line no-unused-vars
  appointmentTypes: _appointmentTypes = [],
  onSubmit,
  onCancel,
  loading = false,
  initialPatient = null,
  initialDateTime = null,
  open = true,
  // eslint-disable-next-line no-unused-vars
  appointments: _appointments = [],
}) => {
  /* ── State ── */
  const [patient,       setPatient]       = useState(initialPatient || null);
  const [apptDate,      setApptDate]      = useState(initialDateTime || dayjs());
  const [timeHours,     setTimeHours]     = useState(initialDateTime ? initialDateTime.format("hh") : "09");
  const [timeMins,      setTimeMins]      = useState(initialDateTime ? initialDateTime.format("mm") : "00");
  const [amPm,          setAmPm]          = useState(initialDateTime ? initialDateTime.format("A") : "AM");
  const [visitType,     setVisitType]     = useState("recare");
  const [procedures,    setProcedures]    = useState(INITIAL_PROCEDURES);
  const [selectedTagLabels, setSelectedTagLabels] = useState(new Set());
  const [tagProcedureIds,   setTagProcedureIds]   = useState({});
  const [addingProcedure,   setAddingProcedure]   = useState(false);
  const [procedureInput,    setProcedureInput]    = useState("");
  const nextId = useRef(10);

  // Right panel
  const [status,             setStatus]             = useState("confirmed");
  const [durationMins,       setDurationMins]       = useState(60);
  const [providerRows,       setProviderRows]       = useState([{ id: 1, providerId: "", time: 60 }]);
  const [preferredDentist,   setPreferredDentist]   = useState("");
  const [preferredHygienist, setPreferredHygienist] = useState("");
  const [notes,              setNotes]              = useState("");
  const [selectedColorTags,  setSelectedColorTags]  = useState(new Set(["#eab308"]));

  useEffect(() => { if (initialPatient) setPatient(initialPatient); }, [initialPatient]);

  // Derive the full dayjs datetime from the split fields
  const dateTime = useMemo(() => {
    const h = parseInt(timeHours || "9", 10);
    const m = parseInt(timeMins  || "0", 10);
    const hour24 = amPm === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
    return (apptDate || dayjs()).hour(hour24).minute(m).second(0);
  }, [apptDate, timeHours, timeMins, amPm]);

  /* ── Provider helpers ── */
  const providerLabel = (p) => {
    if (!p) return "";
    const u = p.userId || p;
    return [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || p.providerCode || "";
  };

  /* ── Tag handlers ── */
  const handleTagClick = (label, idx) => {
    const key = `${label}-${idx}`;
    const isSelected = selectedTagLabels.has(key);
    if (isSelected) {
      setSelectedTagLabels((prev) => { const n = new Set(prev); n.delete(key); return n; });
      const procId = tagProcedureIds[key];
      if (procId != null) {
        setProcedures((prev) => prev.filter((p) => p.id !== procId));
        setTagProcedureIds((prev) => { const { [key]: _, ...rest } = prev; return rest; });
      }
    } else {
      setSelectedTagLabels((prev) => new Set([...prev, key]));
      const template = TAG_DEFAULT_PROCEDURES[label];
      const tagInfo  = DEFAULT_PROCEDURE_TAGS[idx];
      if (template && tagInfo) {
        const newId = nextId.current++;
        setProcedures((prev) => [...prev, {
          id: newId, code: template.code, treatment: template.treatment,
          site: "", provider: "", charge: template.charge, checked: true,
          tag: { label: tagInfo.label, color: tagInfo.color, font: tagInfo.font },
        }]);
        setTagProcedureIds((prev) => ({ ...prev, [key]: newId }));
      }
    }
  };

  const handleSelectProcedure = (option) => {
    if (!option) return;
    setProcedures((prev) => [...prev, {
      id: nextId.current++, code: option.code, treatment: option.treatment,
      site: "", provider: "", charge: option.charge, checked: true, tag: option.tag,
    }]);
    setProcedureInput(""); setAddingProcedure(false);
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    if (!onSubmit) return;
    const end = dateTime.add(durationMins || 30, "minute");
    onSubmit({
      patientId:       patient?._id || patient?.id,
      patientName:     patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "",
      appointmentDate: dateTime.format("YYYY-MM-DD"),
      startTime:       dateTime.format("HH:mm"),
      endTime:         end.format("HH:mm"),
      durationMinutes: durationMins,
      status,
      notes,
      providerId: providerRows[0]?.providerId || undefined,
      roomId:     undefined,
      customFields: {
        visitType,
        procedures: procedures.filter((p) => p.checked).map(({ code, treatment, charge }) => ({ code, treatment, charge })),
        preferredDentist,
        preferredHygienist,
        colorTags: [...selectedColorTags],
      },
    });
  };

  const patientDisplayName = patient
    ? (patient.name || patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient")
    : "";
  const patientId = patient?.patientId || patient?.chartNumber || patient?.id || patient?._id || "";

  /* ────────────────────── JSX ────────────────────── */
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => { if (reason !== "backdropClick" && onCancel) onCancel(); }}
      maxWidth="lg"
      fullWidth
      disableScrollLock
      PaperProps={{
        sx: { borderRadius: "12px", border: "1px solid #e0e5eb", maxHeight: "92vh", overflow: "hidden" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>

        {/* ── HEADER ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", px: "10px", py: "10px", borderBottom: "1px solid #e0e5eb", flexShrink: 0, backgroundColor: "#f3f8fd" }}>
          <Box sx={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <EventNote sx={{ fontSize: "20px", color: "#2262ef" }} />
          </Box>
          <Box>
            <Typography sx={{ 
              display :'flex',
              flexDirection :'column',
              justifyContent :'flex-start',
              alignItems :'flex-start',
              width :'320px',
              height :'24px',
              padding :'0px',
              fontFamily: "Inter", 
              fontSize: "15px", 
              fontWeight: 700, 
              color: "#09121f" }}>
              Add new patient appointment
            </Typography>
            <Typography sx={{ fontWeight :'400', lineHeight :'16.25px', letterSpacing :'0px', textAlign :'left', color :'#5c646f', fontFamily: "Inter", fontSize: "11px" }}>
              Schedule treatment or recare with smart conflict detection.
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Button
            variant="outlined"
            startIcon={<AutoAwesome sx={{ fontSize: "14px" }} />}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection:'row', padding :'0px 11.800000190734863px', borderWidth:'1px',
              fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
              textTransform: "none", borderRadius: "20px",
              borderColor: "#e0e5eb", color: "#09121f",gap:'12px',
              px: "14px", py: "6px", bgcolor: '#fbfdfe',
              "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
            }}
          >
            Convert to shortlist
          </Button>

          <IconButton onClick={onCancel} size="small" sx={{ color: "#6b7280" }}>
            <Close sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>

        {/* ── BODY ── */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* ── LEFT PANEL ── */}
          <Box sx={{ flex: 1, p: "20px", overflowY: "auto", borderRight: "1px solid #e0e5eb", minWidth: 0 }}>

            {/* For Patient / Date / Time */}
            <Box sx={{ display: "flex", gap: "12px", mb: "20px", alignItems: "flex-end" }}>

              {/* For Patient */}
              <FieldBox label="For Patient" sx={{ flex: 1 }}>
                <Autocomplete
                  size="small"
                  options={patients}
                  loading={loadingPatients}
                  getOptionLabel={(o) => {
                    const name = o.name || o.fullName || `${o.firstName || ""} ${o.lastName || ""}`.trim();
                    const id = o.patientId || o.chartNumber || o.id || o._id || "";
                    return id ? `${name}  pt #${id}` : name;
                  }}
                  value={patient}
                  onChange={(_, v) => setPatient(v)}
                  onInputChange={(_, v, reason) => { if (reason === "input" && onPatientSearch) onPatientSearch(v); }}
                  renderOption={(props, o) => {
                    const name = o.name || o.fullName || `${o.firstName || ""} ${o.lastName || ""}`.trim();
                    const initials = o.name
                      ? o.name.slice(0, 2).toUpperCase()
                      : `${o.firstName?.[0] || ""}${o.lastName?.[0] || ""}`.toUpperCase();
                    const id = o.patientId || o.chartNumber || o.id || o._id;
                    return (
                      <Box component="li" {...props} key={o._id || o.id} sx={{ display: "flex", alignItems: "center", gap: "8px", py: "6px !important" }}>
                        <Box sx={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#2262ef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#fff" }}>{initials}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#09121f" }}>{name}</Typography>
                          {id && <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>pt #{id}</Typography>}
                        </Box>
                      </Box>
                    );
                  }}
                  renderInput={(params) => {
                    const initials = patient
                      ? (patient.name
                          ? patient.name.slice(0, 2).toUpperCase()
                          : `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase())
                      : "";
                    return (
                      <TextField
                        {...params}
                        placeholder="Search patient..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <Search sx={{ fontSize: "16px", color: "#9aa3ae", ml: "4px", mr: "2px", flexShrink: 0 }} />
                              {patient && (
                                <Box sx={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#2262ef", display: "flex", alignItems: "center", justifyContent: "center", mx: "4px", flexShrink: 0 }}>
                                  <Typography sx={{ fontFamily: "Inter", fontSize: "9px", fontWeight: 700, color: "#fff" }}>{initials}</Typography>
                                </Box>
                              )}
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          sx: { fontFamily: "Inter", fontWeight: 500, fontSize: "13px", borderRadius: "8px", height: "40px" },
                        }}
                      />
                    );
                  }}
                />
              </FieldBox>

              {/* Date */}
              <FieldBox label="Date" sx={{ width: "165px", flexShrink: 0 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={apptDate}
                    onChange={(v) => v && setApptDate(v)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: "165px", "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", height: "40px" } },
                      },
                    }}
                  />
                </LocalizationProvider>
              </FieldBox>

              {/* Time */}
              <FieldBox label="Time" sx={{ flexShrink: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "8px", overflow: "hidden", height: "40px" }}>
                  <AccessTime sx={{ fontSize: "16px", color: "#9aa3ae", ml: "10px", mr: "4px", flexShrink: 0 }} />
                  <input
                    value={`${timeHours}:${timeMins}`}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(":");
                      if (h !== undefined) setTimeHours(h.slice(0, 2));
                      if (m !== undefined) setTimeMins(m.slice(0, 2));
                    }}
                    style={{ border: "none", outline: "none", width: "60px", fontFamily: "Inter", fontSize: "13px", color: "#09121f", background: "transparent" }}
                  />
                  {["AM", "PM"].map((p) => (
                    <Box
                      key={p}
                      onClick={() => setAmPm(p)}
                      sx={{
                        px: "10px", height: "100%", display: "flex", alignItems: "center",
                        cursor: "pointer", fontFamily: "Inter", fontSize: "12px", fontWeight: 600,
                        backgroundColor: amPm === p ? "#2262ef" : "transparent",
                        color: amPm === p ? "#fff" : "#6b7280",
                        transition: "all 0.15s",
                      }}
                    >
                      {p}
                    </Box>
                  ))}
                </Box>
              </FieldBox>
            </Box>

            {/* Type of visit */}
            <Box sx={{ mb: "16px" }}>
              <Label>Type of visit</Label>
              <RadioGroup row value={visitType} onChange={(e) => setVisitType(e.target.value)} sx={{ gap: "8px" }}>
                {["Treatment", "Recare"].map((v) => (
                  <FormControlLabel
                    key={v}
                    value={v.toLowerCase()}
                    control={<Radio size="small" sx={{ p: "4px", color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }} />}
                    label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>{v}</Typography>}
                  />
                ))}
              </RadioGroup>
            </Box>

            {/* Quick add procedure */}
            <Box sx={{ mb: "20px" }}>
              <Label>Quick add procedure</Label>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                {DEFAULT_PROCEDURE_TAGS.map((tag, idx) => {
                  const key = `${tag.label}-${idx}`;
                  const isSelected = selectedTagLabels.has(key);
                  return (
                    <Chip
                      key={key}
                      label={tag.label}
                      onClick={() => handleTagClick(tag.label, idx)}
                      sx={{
                        backgroundColor: tag.color,
                        color: tag.font || "#111",
                        borderRadius: "20px",
                        height: "26px",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "Inter",
                        cursor: "pointer",
                        border: isSelected ? "2px solid #09121f" : "2px solid transparent",
                        "& .MuiChip-label": { px: "8px" },
                        "&:hover": { opacity: 0.85 },
                      }}
                    />
                  );
                })}

                {addingProcedure ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Autocomplete
                      autoFocus
                      open={procedureInput.length > 0}
                      options={DUMMY_PROCEDURE_OPTIONS}
                      getOptionLabel={(o) => `${o.code} – ${o.treatment}`}
                      inputValue={procedureInput}
                      onInputChange={(_, v) => setProcedureInput(v)}
                      onChange={(_, v) => handleSelectProcedure(v)}
                      filterOptions={(opts, { inputValue }) => {
                        const q = inputValue.toLowerCase();
                        return opts.filter((o) => o.code.toLowerCase().includes(q) || o.treatment.toLowerCase().includes(q));
                      }}
                      renderOption={(props, o) => (
                        <Box component="li" {...props} key={o.code} sx={{ display: "flex", alignItems: "center", gap: "8px", py: "4px !important" }}>
                          <Chip label={o.tag.label} size="small" sx={{ backgroundColor: o.tag.color, color: o.tag.font || "#111", fontSize: "9px", height: "16px", borderRadius: "4px", fontWeight: 700, "& .MuiChip-label": { px: "6px" } }} />
                          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600 }}>{o.code}</Typography>
                          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>{o.treatment}</Typography>
                          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae", ml: "auto" }}>{o.charge}</Typography>
                        </Box>
                      )}
                      sx={{ width: 260 }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" autoFocus placeholder="Search by code or name…"
                          onKeyDown={(e) => { if (e.key === "Escape") { setProcedureInput(""); setAddingProcedure(false); } }}
                          sx={{ "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "11px" } }}
                        />
                      )}
                    />
                    <IconButton size="small" onClick={() => { setProcedureInput(""); setAddingProcedure(false); }} sx={{ p: "2px" }}>
                      <Close sx={{ fontSize: "14px", color: "#9aa3ae" }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={() => setAddingProcedure(true)}
                    sx={{ display: "flex", alignItems: "center", gap: "4px", border: "1.5px dashed #d1d5db", borderRadius: "20px", px: "10px", height: "26px", cursor: "pointer", "&:hover": { borderColor: "#2262ef" } }}
                  >
                    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "#6b7280" }}>+ Add Procedure</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* New procedures table */}
            <Box sx={{ 
              mb: "16px", display: "flex", flexDirection: "column",
              gap: "2.5px", width:'100%', padding :'5.199999809265137px 0px 0px 0px' }}>
              <Label sx={{ mb: "8px" }}>New procedures</Label>
              <Table size="small" sx={{ border: "1px solid #e0e5eb", borderRadius: "12px", overflow: "hidden", borderColor:'pink', borderColor:'#e0e5eb' }}>
                <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                  <TableRow sx={{ backgroundColor: "rgba(241, 246, 252, 0.60)" }}>
                    <TableCell padding="checkbox" sx={{ borderBottom: "1px solid #e0e5eb", width: "36px" }}>
                      <Checkbox size="small" sx={{height: '16px', width: '16px'}}/>
                    </TableCell>
                    {[
                      { label: "PROCEDURE", width: "14%"  },
                      { label: "SITE",      width: "20%" },
                      { label: "TREATMENT", width: "38%"   },
                      { label: "PROVIDER",  width: "28%"   },
                    ].map(({ label, width }) => (
                      <TableCell key={label} sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#5c646f", borderBottom: "1px solid #e0e5eb", letterSpacing: "0.5px", py: "8px", width }}>
                        {label}
                      </TableCell>
                    ))}
                    <TableCell sx={{ borderBottom: "1px solid #green", width: "36px" }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedures.map((row) => (
                    <TableRow key={row.id} sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}>
                      <TableCell padding="checkbox">
                        <Checkbox size="small" checked={row.checked} onChange={() => setProcedures((prev) => prev.map((p) => p.id === row.id ? { ...p, checked: !p.checked } : p))} sx={{ color: "#ffffff", borderColor:'#767676', borderStyle:'solid',borderRadius: '2.5px', "&.Mui-checked": { color: "#2262ef" } }} />
                      </TableCell>
                      <TableCell sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", whiteSpace: "nowrap" }}>
                        {row.code}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={row.site || ""}
                          onChange={(e) => setProcedures((prev) => prev.map((p) => p.id === row.id ? { ...p, site: e.target.value } : p))}
                          placeholder="—"
                          sx={{ width: "100%", "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "12px", py: "4px", px: "6px" }, "& .MuiOutlinedInput-root": { borderRadius: "4px" } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={row.treatment}
                          sx={{ fontFamily: "Inter", fontSize: "12px", height: "28px", width: "100%", "& .MuiSelect-select": { py: "4px" } }}
                        >
                          <MenuItem value={row.treatment} sx={{ fontFamily: "Inter", fontSize: "12px" }}>{row.treatment}</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          displayEmpty
                          value={row.provider}
                          onChange={(e) => setProcedures((prev) => prev.map((p) => p.id === row.id ? { ...p, provider: e.target.value } : p))}
                          sx={{ fontFamily: "Inter", fontSize: "12px", height: "28px", width: "100%", "& .MuiSelect-select": { py: "4px" } }}
                        >
                          <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>— Select —</MenuItem>
                          {providers.map((p) => (
                            <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "12px" }}>
                              {providerLabel(p)}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => setProcedures((prev) => prev.filter((p) => p.id !== row.id))} sx={{ color: "#ef4444" }}>
                          <DeleteOutline sx={{ fontSize: "16px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {procedures.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center", py: "20px" }}>
                        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
                          No procedures added. Select a quick tag above.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>

            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280", mb: "4px" }}>
              Patient doesn't have a recare plan.{" "}
              <Box component="span" sx={{ color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>Add a procedure</Box>
              {" "}or{" "}
              <Box component="span" sx={{ color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>start a plan.</Box>
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              + add procedures from another visit
            </Typography>
          </Box>

          {/* ── RIGHT PANEL ── */}
          <Box sx={{ width: "30%", minWidth: "300px", flexShrink: 0, p: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Appointment status */}
            <FieldBox label="Appointment status">
              <Select
                size="small" fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{o.label}</MenuItem>
                ))}
              </Select>
            </FieldBox>

            {/* Appt duration */}
            <Box>
              <Label>Appt duration</Label>
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Number input */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TextField
                    type="number"
                    size="small"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value) || 0)}
                    sx={{ width: "64px", "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "13px", py: "6px", textAlign: "center" }, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    inputProps={{ min: 5, step: 5 }}
                  />
                  <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>mins</Typography>
                </Box>
                {/* Quick preset pills */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Box sx={{ display: "flex", gap: "4px" }}>
                    {[30, 45, 60].map((v) => (
                      <Box key={v} onClick={() => setDurationMins(v)} sx={{ px: "10px", py: "3px", borderRadius: "6px", cursor: "pointer", fontFamily: "Inter", fontSize: "11px", fontWeight: 600, backgroundColor: durationMins === v ? "#2262ef" : "#f1f5f9", color: durationMins === v ? "#fff" : "#6b7280", transition: "all 0.15s", "&:hover": { backgroundColor: durationMins === v ? "#1a50cc" : "#e2e8f0" } }}>
                        {v}m
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: "4px" }}>
                    {[90, 120].map((v) => (
                      <Box key={v} onClick={() => setDurationMins(v)} sx={{ px: "10px", py: "3px", borderRadius: "6px", cursor: "pointer", fontFamily: "Inter", fontSize: "11px", fontWeight: 600, backgroundColor: durationMins === v ? "#2262ef" : "#f1f5f9", color: durationMins === v ? "#fff" : "#6b7280", transition: "all 0.15s", "&:hover": { backgroundColor: durationMins === v ? "#1a50cc" : "#e2e8f0" } }}>
                        {v}m
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Provider / Assistant times */}
            <Box>
              <Label>Provider / Assistant times</Label>
              <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "8px", overflow: "hidden" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 0, backgroundColor: "rgba(241, 246, 252, 0.60)", px: "10px", py: "6px", borderBottom: "1px solid #e0e5eb" }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.5px" }}>PROVIDER</Typography>
                  <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.5px" }}>TIME</Typography>
                </Box>
                {providerRows.map((row) => (
                  <Box key={row.id} sx={{ display: "flex", alignItems: "center", gap: "6px", px: "8px", py: "8px", borderBottom: "1px solid #f0f2f5", "&:last-child": { borderBottom: "none" } }}>
                    <Select
                      size="small" displayEmpty
                      value={row.providerId}
                      onChange={(e) => setProviderRows((prev) => prev.map((r) => r.id === row.id ? { ...r, providerId: e.target.value } : r))}
                      sx={{ flex: 1, fontFamily: "Inter", fontSize: "12px", "& .MuiSelect-select": { py: "5px" } }}
                    >
                      <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>— Select —</MenuItem>
                      {providers.map((p) => (
                        <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "12px" }}>{providerLabel(p)}</MenuItem>
                      ))}
                    </Select>
                    <TextField
                      size="small" type="number"
                      value={row.time}
                      onChange={(e) => setProviderRows((prev) => prev.map((r) => r.id === row.id ? { ...r, time: Number(e.target.value) } : r))}
                      sx={{ width: "48px", "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "12px", py: "5px", textAlign: "center" } }}
                    />
                    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>m</Typography>
                    <IconButton size="small" onClick={() => setProviderRows((prev) => prev.filter((r) => r.id !== row.id))} sx={{ color: "#ef4444", p: "2px" }}>
                      <DeleteOutline sx={{ fontSize: "14px" }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Typography
                onClick={() => setProviderRows((prev) => [...prev, { id: Date.now(), providerId: "", time: 60 }])}
                sx={{ fontFamily: "Inter", fontSize: "12px", color: "#2262ef", cursor: "pointer", mt: "6px", "&:hover": { textDecoration: "underline" } }}
              >
                + Add provider / assistant
              </Typography>
            </Box>

            {/* Patient's preferred dentist */}
            <FieldBox label="Patient's preferred dentist">
              <Select
                size="small" fullWidth displayEmpty
                value={preferredDentist}
                onChange={(e) => setPreferredDentist(e.target.value)}
                sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: preferredDentist ? "#09121f" : "#9aa3ae" }}
              >
                <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select dentist</MenuItem>
                {providers.map((p) => (
                  <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{providerLabel(p)}</MenuItem>
                ))}
              </Select>
            </FieldBox>

            {/* Patient's preferred hygienist */}
            <FieldBox label="Patient's preferred hygienist">
              <Select
                size="small" fullWidth displayEmpty
                value={preferredHygienist}
                onChange={(e) => setPreferredHygienist(e.target.value)}
                sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: preferredHygienist ? "#09121f" : "#9aa3ae" }}
              >
                <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select hygienist</MenuItem>
                {providers.map((p) => (
                  <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{providerLabel(p)}</MenuItem>
                ))}
              </Select>
            </FieldBox>

            {/* Notes */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "4px" }}>
                <Label sx={{ mb: 0 }}>Notes</Label>
                <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                  Show system notes
                </Typography>
              </Box>
              <TextField
                size="small" fullWidth multiline rows={3}
                placeholder="Add note / tags..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
              />
            </Box>

            {/* Tags */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "8px" }}>
                <LocalOffer sx={{ fontSize: "14px", color: "#6b7280" }} />
                <Label sx={{ mb: 0 }}>Tags</Label>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                {COLOR_TAGS.map((color) => {
                  const isSelected = selectedColorTags.has(color);
                  return (
                    <Box
                      key={color}
                      onClick={() => setSelectedColorTags((prev) => {
                        const n = new Set(prev);
                        isSelected ? n.delete(color) : n.add(color);
                        return n;
                      })}
                      sx={{
                        width: "28px", height: "28px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: isSelected ? "2px solid #09121f" : "2px solid transparent",
                        transition: "border 0.15s",
                      }}
                    >
                      {isSelected && (
                        <Box sx={{ width: "10px", height: "6px", border: "2px solid #fff", borderTop: "none", borderRight: "none", transform: "rotate(-45deg)", mt: "-2px" }} />
                      )}
                    </Box>
                  );
                })}
                <Box sx={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { borderColor: "#9ca3af" } }}>
                  <Add sx={{ fontSize: "14px", color: "#9aa3ae" }} />
                </Box>
              </Box>
            </Box>

          </Box>
        </Box>

        {/* ── FOOTER ── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "20px", py: "12px", borderTop: "1px solid #e0e5eb", flexShrink: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Person sx={{ fontSize: "16px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>
              Booking for{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#09121f" }}>
                {patientDisplayName || "—"}
              </Box>
              {patient && (
                <Box component="span" sx={{ color: "#9aa3ae" }}> · pt #{patientId || "—"}</Box>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "8px" }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, textTransform: "none", borderRadius: "8px", borderColor: "#e0e5eb", color: "#374151", px: "16px", py: "7px", "&:hover": { borderColor: "#d1d5db", backgroundColor: "#f9fafb" } }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, textTransform: "none", borderRadius: "8px", borderColor: "#e0e5eb", color: "#374151", px: "16px", py: "7px", "&:hover": { borderColor: "#d1d5db", backgroundColor: "#f9fafb" } }}
            >
              Save as draft
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !patient}
              sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, textTransform: "none", borderRadius: "8px", backgroundColor: "#2262ef", color: "#fff", px: "20px", py: "7px", boxShadow: "none", "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" }, "&.Mui-disabled": { backgroundColor: "#9aa3ae", color: "#fff" } }}
            >
              {loading ? "Saving…" : "Add appointment"}
            </Button>
          </Box>
        </Box>

      </Box>
    </Dialog>
  );
};

export default AddNewPatientAppointmentForm;
