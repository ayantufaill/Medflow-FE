import { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopy from "@mui/icons-material/ContentCopy";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HistoryIcon from "@mui/icons-material/History";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PatientChat from "../shared/PatientChat";
import AppointmentPage from "../shared/AppointmentPage";
import { compactInputLabelSx, compactInputValueSx } from "../../constants/styles";

const StyledDateCalendar = ({ value, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar
      value={value}
      onChange={onChange}
      sx={{
        width: "100%",
        "& .MuiPickersCalendarHeader-root": {
          paddingLeft: "16px",
          paddingRight: "16px",
          marginTop: "8px",
        },
        "& .MuiPickersCalendarHeader-label": {
          fontSize: "14px",
          fontWeight: 600,
          color: "#2c3e50",
        },
        "& .MuiDayCalendar-weekDayLabel": {
          fontSize: "12px",
          fontWeight: 500,
          color: "#7f8c8d",
          width: "36px",
          height: "36px",
        },
        "& .MuiPickersDay-root": {
          fontSize: "13px",
          fontWeight: 400,
          width: "36px",
          height: "36px",
          "&:hover": {
            backgroundColor: "#e3f2fd",
          },
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#ffffff",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
          "&.MuiPickersDay-today": {
            border: "2px solid #1976d2",
            backgroundColor: "#e3f2fd",
            fontWeight: 700,
            color: "#1976d2",
          },
        },
        "& .MuiDayCalendar-header": {
          justifyContent: "space-around",
          marginBottom: "4px",
        },
        "& .MuiDayCalendar-weekContainer": {
          justifyContent: "space-around",
          margin: "2px 0",
        },
      }}
    />
  </LocalizationProvider>
);

const OperatorySidebar = ({
  START_HOUR,
  activeTab, 
  providers = [],
  rooms = [],
  selectedDate,
  onDateChange,
  patientQuery,
  setPatientQuery,
  patients = [],
  loadingPatients = false,
  onPatientSearch,
  onPatientSelect,
  onCreatePatient,
  hasSelectedPatient,
  preAppointmentChecklist = {},
  preAppointmentExpanded,
  setPreAppointmentExpanded,
  handlePreAppointmentSelection,
  checkOutChecklist = {},
  checkOutExpanded,
  setCheckOutExpanded,
  handleCheckOutSelection,
  onScheduleAppointmentClick,
  onCompleteBillClick,
  onPurchaseProductsClick,
  getStatusColor,
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState("confirmed");
  
  // --- Search Form State ---
  const [searchProvider, setSearchProvider] = useState(null);
  const [searchDuration, setSearchDuration] = useState(60);
  const [searchOperatory, setSearchOperatory] = useState(null);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchDays, setSearchDays] = useState([]);
  const [searchAm, setSearchAm] = useState(true);
  const [searchPm, setSearchPm] = useState(true);
  const [searchDoubleBooking, setSearchDoubleBooking] = useState(false);
  const [searchRange, setSearchRange] = useState("1 month");

  const [checkInChecklist, setCheckInChecklist] = useState({
    patientArrived: null,
    copayCollected: null,
    formsCompleted: null,
    insuranceVerified: null,
  });
  const [checkInExpanded, setCheckInExpanded] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [appointmentPageOpen, setAppointmentPageOpen] = useState(false);

  const searchDebounceRef = useRef(null);

  const handleCheckInSelection = (item, selectionType) => {
    setCheckInChecklist((prev) => ({
      ...prev,
      [item]: prev[item] === selectionType ? null : selectionType,
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleChatClick = () => setChatOpen(true);
  const handleCloseChat = () => setChatOpen(false);
  const handleAppointmentPageClick = () => setAppointmentPageOpen(true);
  const handleCloseAppointmentPage = () => setAppointmentPageOpen(false);

  useEffect(() => {
    if (isCreatingPatient) return;
    if (!patientQuery?.trim()) {
      setShowQuickCreate(false);
      setIsCreatingPatient(false);
      return;
    }
    if (!loadingPatients && (!patients || patients.length === 0)) {
      setShowQuickCreate(true);
    } else if (patients && patients.length > 0) {
      setShowQuickCreate(false);
    }
  }, [patientQuery, loadingPatients, patients, isCreatingPatient]);

  const handleCreatePatientClick = async () => {
    if (!onCreatePatient) return;
    const cleanPhone = newPhone.replace(/\D/g, '');
    const payload = {
      firstName: newFirstName || patientQuery || "",
      lastName: newLastName || "",
      dateOfBirth: newDob || "",
      mobilePhone: cleanPhone || "",
      email: newEmail || "",
      sendWelcomeEmail,
      isNewPatient,
    };
    await onCreatePatient(payload);
    setNewFirstName(""); setNewLastName(""); setNewDob(""); setNewPhone(""); setNewEmail("");
  };

  return (
    <Box
      component="aside"
      sx={{
        borderRadius: 2,
        border: "1px solid #eef2f6",
        bgcolor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "688px", 
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        
        {/* TAB 0: Patients */}
        {activeTab === 0 && (
          <>
            {/* Patient Search */}
            <Box sx={{ p: 2, bgcolor: "#fafcff" }}>
              <Autocomplete
                size="small"
                options={patients}
                loading={loadingPatients}
                value={selectedPatient}
                getOptionLabel={(o) => o?.firstName && o?.lastName ? `${o.firstName} ${o.lastName}` : o?.name || "" }
                onChange={(_, value) => {
                  setSelectedPatient(value);
                  onPatientSelect?.(value || null);
                  if (value) {
                    setPatientQuery(value.firstName && value.lastName ? `${value.firstName} ${value.lastName}` : value.name || "");
                  }
                }}
                inputValue={patientQuery}
                onInputChange={(_, value, reason) => {
                  if (reason === 'input') {
                    setPatientQuery(value);
                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                    searchDebounceRef.current = setTimeout(() => onPatientSearch?.(value), 300);
                  } else if (reason === 'clear') {
                    setPatientQuery('');
                    setSelectedPatient(null);
                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                    onPatientSearch?.('');
                  }
                }}
                renderInput={(params) => (<TextField {...params} placeholder="Search patients..." InputProps={{ ...params.InputProps, startAdornment: ( <InputAdornment position="start"><SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} /></InputAdornment> ), }} />)}
              />
            </Box>

            {/* Quick Create Patient */}
            {showQuickCreate && (
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', color: "#64748b", mb: 1.5, fontWeight: 500 }}>Create New Patient</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth variant="standard" size="small" label="First Name *" value={newFirstName} onChange={(e) => {setNewFirstName(e.target.value); setIsCreatingPatient(true);}} onBlur={() => setIsCreatingPatient(false)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth variant="standard" size="small" label="Last Name *" value={newLastName} onChange={(e) => {setNewLastName(e.target.value); setIsCreatingPatient(true);}} onBlur={() => setIsCreatingPatient(false)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth variant="standard" size="small" label="Date of Birth" type="date" value={newDob} onChange={(e) => {setNewDob(e.target.value); setIsCreatingPatient(true);}} onBlur={() => setIsCreatingPatient(false)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth variant="standard" size="small" label="Mobile Phone" value={newPhone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        let formatted = (digits.length <= 3) ? digits : (digits.length <= 6) ? `(${digits.slice(0, 3)}) ${digits.slice(3)}` : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                        setNewPhone(formatted);
                        setIsCreatingPatient(true);
                      }}
                      onBlur={() => setIsCreatingPatient(false)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ inputMode: 'numeric', maxLength: 14, style: { paddingLeft: '24px' } }}
                      placeholder="(201) 555-0123"
                      InputProps={{ startAdornment: <InputAdornment position="start" sx={{ ml: 0.5 }}><span style={{ fontSize: '16px', color: '#616161' }}>☎</span></InputAdornment> }}
                      sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth variant="standard" size="small" label="Email" type="email" value={newEmail} onChange={(e) => {setNewEmail(e.target.value); setIsCreatingPatient(true);}} onBlur={() => setIsCreatingPatient(false)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Checkbox size="small" checked={sendWelcomeEmail} onChange={(e) => setSendWelcomeEmail(e.target.checked)} />
                        <Typography sx={{ fontSize: "0.73rem", color: "#475569", fontWeight: 600 }}>Send welcome email</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Checkbox size="small" checked={isNewPatient} onChange={(e) => setIsNewPatient(e.target.checked)} />
                        <Typography sx={{ fontSize: "0.73rem", color: "#475569", fontWeight: 600 }}>New patient</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button fullWidth variant="contained" size="small" onClick={() => { setIsCreatingPatient(false); handleCreatePatientClick(); }} sx={{ textTransform: "none", bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, fontSize: "0.8rem", py: 0.65, mt: 1 }}>Create Patient</Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {hasSelectedPatient && (
              <>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth variant="contained" size="small" startIcon={<EventNoteIcon />}
                    onClick={onScheduleAppointmentClick} disabled={!onScheduleAppointmentClick}
                    sx={{ textTransform: "none", borderRadius: 1.5, bgcolor: onScheduleAppointmentClick ? "#1976d2" : "#cbd5e1", "&:hover": { bgcolor: onScheduleAppointmentClick ? "#1565c0" : "#94a3b8" }, fontSize: '0.8rem', py: 0.75 }}
                  >
                    Schedule Appointment
                  </Button>
                </Box>
                <Box sx={{ px: 2, pb: 2, bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {[PersonOutlineIcon, ChatOutlinedIcon, ExitToAppIcon].map((Icon, i) => (
                        <IconButton key={i} size="small" sx={{ bgcolor: '#eef2f6', borderRadius: 1.5, color: '#1e293b', p: 0.75 }} onClick={() => { if (i === 1) handleChatClick(); if (i === 2) handleAppointmentPageClick(); }}>
                          <Icon fontSize="small" />
                        </IconButton>
                      ))}
                    </Box>
                    <Paper elevation={0} sx={{ flexGrow: 1, p: 1.5, border: '1px solid #cbd5e1', borderRadius: 1.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                        {selectedPatient?.firstName && selectedPatient?.lastName ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : selectedPatient?.name || 'Patient'} (#1218)
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Birthday: {selectedPatient?.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Phone: {selectedPatient?.phonePrimary || selectedPatient?.mobilePhone || 'N/A'}</Typography>
                          <IconButton size="small" onClick={() => copyToClipboard(selectedPatient?.phonePrimary || selectedPatient?.mobilePhone || '')} sx={{ p: 0.25 }}> <ContentCopy sx={{ fontSize: 12, color: '#94a3b8' }} /> </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5 }}>
                        {['H', 'P', 'B', 'F', 'D'].map((char) => (
                          <Avatar key={char} sx={{ width: 22, height: 22, fontSize: '9px', bgcolor: '#e2e8f0', color: '#64748b' }}>{char}</Avatar>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                <Box sx={{ p: 2 }}>
                  {/* Appointment Card */}
                  <Paper elevation={0} sx={{ border: '1px solid #cbd5e1', borderRadius: 1.5, overflow: 'hidden', mb: 2 }}>
                    <Box sx={{ position: 'relative', bgcolor: getStatusColor ? getStatusColor(appointmentStatus, '#a78bfa') : '#a78bfa', p: 0.75, color: 'white', overflow: 'hidden' }}>
                      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `repeating-linear-gradient(90deg, transparent 0px, transparent 12px, rgba(255, 255, 255, 0.15) 12px, rgba(255, 255, 255, 0.15) 24px )`, animation: "slide 1s linear infinite", "@keyframes slide": { "0%": { backgroundPosition: "0 0" }, "100%": { backgroundPosition: "24px 0" } } }} />
                      <Typography sx={{ fontSize: '11px', fontWeight: 800, textAlign: 'center', letterSpacing: '0.5px', position: 'relative' }}>RECARE 03/04/2026 @ 09:00 AM</Typography>
                    </Box>
                    <Box sx={{ p: 1.5 }}>
                      <Select value={appointmentStatus} onChange={(e) => setAppointmentStatus(e.target.value)} size="small" fullWidth sx={{ height: 32, fontSize: '0.8rem', mb: 1, borderRadius: 1 }}>
                        {['unconfirmed', 'preconfirmed', 'confirmed', 'seated', 'call', 'checkout incomplete', 'checkout complete', 'no show', 'rescheduled', 'cancelled'].map(s => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
                      </Select>
                      <Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>hygiene, periodic ex, fl</Typography>
                    </Box>
                  </Paper>

                  {/* Pre-Appointment Checklist restored */}
                  <Box sx={{ mb: 2 }}>
                    <Box onClick={() => setPreAppointmentExpanded(!preAppointmentExpanded)} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, px: 1.5, borderRadius: 1.5, bgcolor: "#f8fafc", cursor: "pointer", "&:hover": { bgcolor: "#f1f5f9" } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                        <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 600, color: "#475569" }}>Pre-Appointment Checklist</Typography>
                      </Box>
                      <Box sx={{ transform: preAppointmentExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", color: "#64748b" }}><EventNoteIcon sx={{ fontSize: 16 }} /></Box>
                    </Box>
                    {preAppointmentExpanded && (
                      <Box sx={{ pt: 1 }}>
                        {['importHistory', 'importRecord', 'apptReminder', 'verifyInsurance', 'premedicationReminder', 'labCaseReceived'].map(key => (
                          <Box key={key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75, px: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', color: "#475569" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip label="N/A" size="small" onClick={() => handlePreAppointmentSelection(key, 'na')} sx={{ minWidth: 48, height: 28, fontSize: 11, bgcolor: preAppointmentChecklist[key] === 'na' ? '#ef4444' : '#f1f5f9', color: preAppointmentChecklist[key] === 'na' ? '#fff' : '#64748b' }} />
                              <IconButton size="small" onClick={() => handlePreAppointmentSelection(key, 'checked')} sx={{ width: 28, height: 28, border: '2px solid', borderColor: preAppointmentChecklist[key] === 'checked' ? '#10b981' : '#cbd5e1', bgcolor: preAppointmentChecklist[key] === 'checked' ? '#10b981' : 'transparent', color: '#fff' }}><CheckIcon sx={{ fontSize: 16 }} /></IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Other Dropdowns restored */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.8rem' }}>ReAppointment</InputLabel>
                      <Select label="ReAppointment" defaultValue="" sx={{ borderRadius: 1.5, fontSize: '0.8rem' }}>
                        {['1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontSize: '0.8rem' }}>Recare</InputLabel>
                      <Select label="Recare" defaultValue="" sx={{ borderRadius: 1.5, fontSize: '0.8rem' }}>
                        {['3 months', '4 months', '6 months', '9 months', '12 months'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </>
            )}
          </>
        )}

        {/* TAB 1: Pending */}
        {activeTab === 1 && <Box p={2}><Typography variant="body2" color="text.secondary">Pending Appointments View</Typography></Box>}

        {/* TAB 2: Search */}
        {activeTab === 2 && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', mb: 1 }}>Search for Empty Slots By:</Typography>
            <Box>
              <Typography variant="overline" sx={{ display: 'block', mb: 0.5, lineHeight: 1, color: '#64748b', fontWeight: 700 }}>PROVIDER:</Typography>
              <Autocomplete
                size="small"
                options={providers}
                getOptionLabel={(o) => {
                  if (!o) return "";
                  if (o.name) return o.name;
                  const fullName = `${o.firstName || ""} ${o.lastName || ""}`.trim();
                  if (fullName) return fullName;
                  const userFullName = `${o.userId?.firstName || ""} ${o.userId?.lastName || ""}`.trim();
                  if (userFullName) return userFullName;
                  return o.providerCode || `Provider #${o._id || o.id}` || "";
                }}
                value={searchProvider}
                onChange={(_, v) => setSearchProvider(v)}
                renderInput={(params) => <TextField {...params} placeholder="Search and select providers" variant="outlined" />}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700 }}>DURATION:</Typography>
              <TextField size="small" variant="standard" value={searchDuration} onChange={(e) => setSearchDuration(e.target.value)} sx={{ width: 40, "& .MuiInputBase-input": { textAlign: 'center', fontWeight: 600, fontSize: '0.75rem' }}} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>mins</Typography>
            </Box>
            <Box>
              <Typography variant="overline" sx={{ display: 'block', mb: 0.5, lineHeight: 1, color: '#64748b', fontWeight: 700 }}>OPERATORY:</Typography>
              <Autocomplete size="small" options={rooms} getOptionLabel={(o) => o.name || ""} value={searchOperatory} onChange={(_, v) => setSearchOperatory(v)} renderInput={(params) => <TextField {...params} placeholder="Search Operatory" variant="outlined" />} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ display: 'block', mb: 0.5, lineHeight: 1, color: '#64748b', fontWeight: 700 }}>DATE RANGE:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField size="small" type="date" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} sx={{ "& .MuiInputBase-input": { fontSize: '0.7rem' } }} />
                <TextField size="small" type="date" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} sx={{ "& .MuiInputBase-input": { fontSize: '0.7rem' } }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700 }}>TIME:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Checkbox size="small" checked={searchAm} onChange={(e) => setSearchAm(e.target.checked)} /><Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>AM</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Checkbox size="small" checked={searchPm} onChange={(e) => setSearchPm(e.target.checked)} /><Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>PM</Typography></Box>
            </Box>
            <Button variant="contained" fullWidth sx={{ mt: 1, bgcolor: '#5c7cbc', textTransform: 'none', fontWeight: 700, boxShadow: 'none', "&:hover": { bgcolor: '#4a6496' } }}>Search</Button>
          </Box>
        )}

        {/* TAB 3: Productivity */}
        {activeTab === 3 && <Box p={2}><Typography variant="body2" color="text.secondary">Productivity Metrics View</Typography></Box>}
      </Box>

      <Divider />
      <Box sx={{ p: 2, bgcolor: "#fafcff", flexShrink: 0 }}>
        <StyledDateCalendar value={selectedDate} onChange={(v) => v && onDateChange && onDateChange(v)} />
      </Box>

      <PatientChat open={chatOpen} onClose={handleCloseChat} patientName={selectedPatient ? (selectedPatient.firstName + " " + selectedPatient.lastName) : ""} />
      <AppointmentPage open={appointmentPageOpen} onClose={handleCloseAppointmentPage} patientName={selectedPatient ? (selectedPatient.firstName + " " + selectedPatient.lastName) : ""} />
    </Box>
  );
};

export default OperatorySidebar;