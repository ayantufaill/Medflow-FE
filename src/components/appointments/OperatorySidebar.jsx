import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAppointmentThunk, fetchPatientHistory, selectPatientHistoryList, selectPatientHistoryLoading } from "../../store/slices/appointmentSlice";
import { fetchCurrentPracticeInfo } from "../../store/slices/practiceInfoSlice";
import dayjs from "dayjs";
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
  Collapse,
  Tooltip,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FlagIcon from "@mui/icons-material/Flag";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PatientChat from "../shared/PatientChat";
import AppointmentPage from "../shared/AppointmentPage";
import { compactInputLabelSx, compactInputValueSx } from "../../constants/styles";
import PatientRouteSlipDialog from "./PatientRouteSlipDialog";
import FamilyAppointmentsDialog from "./FamilyAppointmentsDialog";
import AppointmentHistoryDialog from "./AppointmentHistoryDialog";
import { usePatient, usePatientBalance } from "../../hooks/redux/usePatient";

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

const ProductivityMetricCard = ({ title, amount, metrics, footer }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      border: "1px solid #cbd5e1",
      borderRadius: 1.5,
      bgcolor: "#ffffff",
    }}
  >
    <Box sx={{ mb: 1 }}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>{title}</Typography>
      <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
        S <strong>${amount.toLocaleString()}</strong>
      </Typography>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {metrics.map((m, idx) => (
        <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "25px 50px 1fr 50px", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>{m.label}</Typography>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, textAlign: "right", color: m.color }}>
            ${m.value.toLocaleString()}
          </Typography>
          
          <Box sx={{ position: "relative", height: 12, bgcolor: "#e2e8f0", borderRadius: 0.5, overflow: "visible" }}>
            {/* Goal Line */}
            {m.goal && (
              <Box
                sx={{
                  position: "absolute",
                  left: "75%",
                  top: -2,
                  bottom: -2,
                  width: 2,
                  bgcolor: "#334155",
                  zIndex: 2,
                }}
              />
            )}
            
            {/* Indicator Triangle for P and C */}
            {(m.label === "P" || m.label === "C") && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${Math.min((m.value / (m.goal || m.value * 1.5)) * 75, 100)}%`,
                  top: -6,
                  width: 0,
                  height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderTop: "6px solid #334155",
                  transform: "translateX(-50%)",
                  zIndex: 3,
                }}
              />
            )}

            {/* Actual Progress Bar */}
            <Box
              sx={{
                width: `${Math.min((m.value / (m.goal || m.value * 1.5)) * 75, 100)}%`,
                height: "100%",
                bgcolor: m.color,
                borderRadius: 0.5,
              }}
            />
          </Box>

          <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", textAlign: "right" }}>
            {m.goal ? `$${m.goal.toLocaleString()}` : ""}
          </Typography>
        </Box>
      ))}
    </Box>

    <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 0.3 }}>
      {footer.map((f, idx) => (
        <Typography key={idx} sx={{ fontSize: "0.7rem", color: "#64748b" }}>
          {f.label} <strong>${f.value.toLocaleString()}</strong> (goal ${f.goal.toLocaleString()})
        </Typography>
      ))}
    </Box>
  </Paper>
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
  appointments = [],
  pendingItems = [],
  onDropOnPending,
  onRemovePending,
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const dispatch = useDispatch();
  const practiceData = useSelector((state) => state.practiceInfo.data);

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo(true));
  }, [dispatch]);

  const [appointmentStatus, setAppointmentStatus] = useState("confirmed");
  const [viewMode, setViewMode] = useState("schedule");
  // Derived patient details from Redux hook
  const { currentPatient: patientDetails, loading: patientLoading, fetchById, clear: clearPatientDetail } = usePatient();
  const { getBalance, fetchBalance, loading: balanceLoading } = usePatientBalance();
  const patientBalance = getBalance(selectedPatient?.id || selectedPatient?._id);
  const loadingDetails = patientLoading || balanceLoading;
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [familyExpanded, setFamilyExpanded] = useState(true);
  const [proceduresExpanded, setProceduresExpanded] = useState(true);
  const [recareExpanded, setRecareExpanded] = useState(true);

  const patientHistory = useSelector(selectPatientHistoryList);
  const patientHistoryLoading = useSelector(selectPatientHistoryLoading);

  const recareProcedures = useMemo(() => {
    if (!patientHistory || patientHistory.length === 0) return [];
    const pastAppointments = patientHistory.filter(appt => 
      dayjs(appt.appointmentDate || appt.start).isBefore(dayjs(), 'day') || 
      appt.status === 'checked_out_complete' || 
      appt.status === 'completed'
    );
    const map = new Map();
    pastAppointments.forEach(appt => {
      if (appt.customFields?.procedures && Array.isArray(appt.customFields.procedures)) {
        appt.customFields.procedures.forEach(p => {
          if (p.code) {
            map.set(p.code, { code: p.code, treatment: p.treatment || p.name || "Treatment", duration: appt.durationMinutes || appt.duration || 60 });
          }
        });
      }
      if (appt.procedures) {
        const codes = appt.procedures.split(',').map(s => s.trim()).filter(Boolean);
        codes.forEach(code => {
          if (!map.has(code)) {
            map.set(code, { code, treatment: appt.appointmentType?.name || "Treatment", duration: appt.durationMinutes || appt.duration || 60 });
          }
        });
      }
      if (appt.appointmentType?.name) {
        const name = appt.appointmentType.name;
        if (!map.has(name)) {
          map.set(name, { code: "RECARE", treatment: name, duration: appt.durationMinutes || appt.duration || 60 });
        }
      }
    });
    return Array.from(map.values());
  }, [patientHistory]);

  const defaultRecareProcedures = [
    { code: "D0120", treatment: "Periodic Oral Evaluation", duration: 50 },
    { code: "D1110", treatment: "Prophy", duration: 60 },
    { code: "D0274", treatment: "Bitewings - Four Xrays", duration: 50 },
  ];

  const displayProcedures = recareProcedures.length > 0 ? recareProcedures : defaultRecareProcedures;
  
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
  const [productivityProvider, setProductivityProvider] = useState("all");

  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState("input"); // "input" or "results"

  const handlePerformSearch = () => {
    let start = searchStartDate ? dayjs(searchStartDate) : dayjs();
    let end = searchEndDate ? dayjs(searchEndDate) : null;
    
    if (!end) {
      const months = parseInt(searchRange) || 1;
      end = start.add(months, "month");
    }
    
    const results = [];
    const roomsToSearch = searchOperatory ? [searchOperatory] : rooms;
    const searchProviderId = searchProvider?._id || searchProvider?.id;
    
    let current = start.clone();
    let dayCount = 0;
    // Cap at 90 days to avoid massive arrays or rendering lag
    while ((current.isBefore(end) || current.isSame(end, "day")) && dayCount < 90) {
      const dayOfWeek = current.day();
      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = current.format("YYYY-MM-DD");
        
        const dayAppts = appointments.filter(a => {
          const apptDate = dayjs(a.date || a.appointmentDate).format("YYYY-MM-DD");
          return apptDate === dateStr;
        });
        
        roomsToSearch.forEach(room => {
          const roomId = room._id || room.id;
          const colId = `op${roomId}`;
          
          // 1-hour candidate slots
          const candidateSlots = [
            { label: "9:00 AM to 10:00 AM", startHour: 9, endHour: 10, amPm: "AM" },
            { label: "10:00 AM to 11:00 AM", startHour: 10, endHour: 11, amPm: "AM" },
            { label: "11:00 AM to 12:00 PM", startHour: 11, endHour: 12, amPm: "AM" },
            { label: "1:00 PM to 2:00 PM", startHour: 13, endHour: 14, amPm: "PM" },
            { label: "2:00 PM to 3:00 PM", startHour: 14, endHour: 15, amPm: "PM" },
            { label: "3:00 PM to 4:00 PM", startHour: 15, endHour: 16, amPm: "PM" },
            { label: "4:00 PM to 5:00 PM", startHour: 16, endHour: 17, amPm: "PM" },
          ];
          
          candidateSlots.forEach(slot => {
            if (slot.amPm === "AM" && !searchAm) return;
            if (slot.amPm === "PM" && !searchPm) return;
            
            const slotStart = current.hour(slot.startHour).minute(0);
            const slotEnd = current.hour(slot.endHour).minute(0);
            
            const hasConflict = dayAppts.some(appt => {
              const apptStart = dayjs(appt.start);
              const apptEnd = dayjs(appt.end);
              const isOverlap = apptStart.isBefore(slotEnd) && apptEnd.isAfter(slotStart);
              if (!isOverlap) return false;
              
              // Overlaps room/operatory
              if (!searchDoubleBooking && (String(appt.columnId) === colId || String(appt.roomId) === String(roomId))) {
                return true;
              }
              
              // Overlaps selected provider
              if (searchProviderId && String(appt.providerId) === String(searchProviderId)) {
                return true;
              }
              
              return false;
            });
            
            if (!hasConflict) {
              results.push({
                date: current.clone(),
                dateStr: dateStr,
                dateFormatted: current.format("ddd MM/DD/YY"),
                roomName: room.name || `Op ${roomId}`,
                columnId: colId,
                timeLabel: slot.label,
              });
            }
          });
        });
      }
      current = current.add(1, "day");
      dayCount++;
    }
    
    setSearchResults(results);
    setSearchMode("results");
  };

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
  const [routeSlipOpen, setRouteSlipOpen] = useState(false);
  const [familyAppointmentsOpen, setFamilyAppointmentsOpen] = useState(false);
  const [appointmentHistoryOpen, setAppointmentHistoryOpen] = useState(false);

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
  const handleRouteSlipClick = () => setRouteSlipOpen(true);
  const handleCloseRouteSlip = () => setRouteSlipOpen(false);
  const handleFamilyAppointmentsClick = () => setFamilyAppointmentsOpen(true);
  const handleCloseFamilyAppointments = () => setFamilyAppointmentsOpen(false);
  const handleAppointmentHistoryClick = () => setAppointmentHistoryOpen(true);
  const handleCloseAppointmentHistory = () => setAppointmentHistoryOpen(false);

  // Fetch detailed patient data via Redux when a patient is selected
  useEffect(() => {
    if (selectedPatient?.id || selectedPatient?._id) {
      const pid = selectedPatient.id || selectedPatient._id;
      fetchById(pid);
      fetchBalance(pid);
      dispatch(fetchPatientHistory(pid));
    }
  }, [selectedPatient, fetchById, fetchBalance, dispatch]);

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
          <Box sx={{ bgcolor: "#F0F4F8" }}>
            {/* Create Appointment Button */}
            <Box sx={{ p: 1.5, pb: 0, bgcolor: "#ffffff" }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                onClick={onScheduleAppointmentClick}
                sx={{
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  py: 1,
                  mb: 1,
                  borderRadius: "6px",
                  boxShadow: "none"
                }}
              >
                Create Appointment
              </Button>
            </Box>

            {/* Patient Search */}
            <Box sx={{ p: 1.5, bgcolor: "#ffffff" }}>
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
                onOpen={() => {
                  if (!patients || patients.length === 0) {
                    onPatientSearch?.("");
                  }
                }}
                onInputChange={(_, value, reason) => {
                  if (reason === 'input') {
                    setPatientQuery(value);
                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                    searchDebounceRef.current = setTimeout(() => onPatientSearch?.(value), 300);
                  } else if (reason === 'clear') {
                    setPatientQuery('');
                    setSelectedPatient(null);
                    clearPatientDetail();
                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                    onPatientSearch?.('');
                  }
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    placeholder="Search for Patients by name or ID" 
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa',
                        borderRadius: '6px',
                        '& fieldset': { borderColor: '#ddd' },
                      }
                    }}
                    InputProps={{ 
                      ...params.InputProps, 
                      startAdornment: ( 
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                        </InputAdornment> 
                      ), 
                    }} 
                  />
                )}
              />
            </Box>

            {/* Quick Create Patient */}
            {showQuickCreate && (
              <Box sx={{ p: 2, bgcolor: 'white' }}>
                <Typography sx={{ fontSize: '0.8rem', color: "#64748b", mb: 1.5, fontWeight: 500 }}>Create New Patient</Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth variant="standard" size="small" label="First Name *" value={newFirstName} onChange={(e) => {setNewFirstName(e.target.value); setIsCreatingPatient(true);}} onBlur={() => setIsCreatingPatient(false)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth variant="standard" size="small" label="Last Name *" value={newLastName} onChange={(e) => {setNewLastName(e.target.value); setIsCreatingPatient(true);}} onBlur={() => setIsCreatingPatient(false)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputLabel-root": compactInputLabelSx, "& .MuiInputBase-input": { ...compactInputValueSx, py: 0.35 }}} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button fullWidth variant="contained" size="small" onClick={() => { setIsCreatingPatient(false); handleCreatePatientClick(); }} sx={{ textTransform: "none", bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" }, fontSize: "0.75rem", py: 0.5, mt: 1 }}>Create Patient</Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {hasSelectedPatient && (
              <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Patient Header Card */}
                <Paper variant="outlined" sx={{ p: 1.25, borderRadius: '8px', border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pt: 0.5 }}>
                      <IconButton size="small" sx={{ p: 0.5 }} onClick={handleAppointmentPageClick}><PersonOutlineIcon sx={{ fontSize: 18, color: '#666' }} /></IconButton>
                      <IconButton size="small" sx={{ p: 0.5 }} onClick={handleChatClick}><ChatOutlinedIcon sx={{ fontSize: 18, color: '#666' }} /></IconButton>
                      <IconButton size="small" sx={{ p: 0.5 }}><ExitToAppIcon sx={{ fontSize: 18, color: '#666' }} /></IconButton>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a3353' }}>
                        {patientDetails?.firstName || selectedPatient?.firstName || ""} {patientDetails?.lastName || selectedPatient?.lastName || ""}
                        {!patientDetails?.firstName && !selectedPatient?.firstName && (patientDetails?.name || selectedPatient?.name || "---")}
                        {" "}(#{patientDetails?.patientCode || selectedPatient?.patientCode || patientDetails?._id?.slice(-4) || selectedPatient?._id?.slice(-4) || '---'})
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#666' }}>
                          Date of Birth (DOB): {(() => {
                            const dob = patientDetails?.dateOfBirth || selectedPatient?.dateOfBirth;
                            if (!dob) return '---';
                            const age = dayjs().diff(dayjs(dob), 'year');
                            return `${dayjs(dob).format('MM/DD/YYYY')} (${isNaN(age) ? '---' : age})`;
                          })()}
                        </Typography>
                        <IconButton 
                          size="small" 
                          sx={{ p: 0.2, color: '#999', '&:hover': { color: '#666' } }}
                          onClick={() => {
                            const dob = patientDetails?.dateOfBirth || selectedPatient?.dateOfBirth;
                            if (dob) copyToClipboard(dayjs(dob).format('MM/DD/YYYY'));
                          }}
                        >
                          <ContentCopy sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.4, mt: 1.5 }}>
                        <Box sx={{ bgcolor: '#eee', p: 0.3, borderRadius: '4px', display: 'flex' }}><LocalHospitalIcon sx={{ fontSize: 12, color: '#999' }} /></Box>
                        <Box sx={{ bgcolor: '#eee', p: 0.3, borderRadius: '4px', display: 'flex', position: 'relative' }}>
                          <Typography sx={{ fontSize: '10px', color: '#999', lineHeight: 1, fontWeight: 700 }}>He</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.4, mt: 0.5 }}>
                        {['B', 'R', 'F', 'D'].map(char => (
                          <Box key={char} sx={{ width: 18, height: 18, bgcolor: '#f5f5f5', color: '#999', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: '1px solid #eee' }}>
                            {char}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Section: Procedure List Example */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <HeaderAccordion title="P 1 #15 crown /bu" value="____ min" icon={KeyboardArrowRightIcon} expanded={proceduresExpanded} setExpanded={setProceduresExpanded} />
                  
                  <DetailAccordion title="Recare" expanded={recareExpanded} setExpanded={setRecareExpanded}>
                    <Box 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", JSON.stringify({
                          isRecareGroup: true,
                          procedures: displayProcedures,
                          duration: Math.max(...displayProcedures.map(p => p.duration || 60), 60),
                          patientId: selectedPatient?.id || selectedPatient?._id,
                          patientName: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
                        }));
                      }}
                      sx={{ 
                        p: 1, 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 0.75,
                        cursor: "grab",
                        border: "2px dashed #1976d2",
                        borderRadius: "8px",
                        bgcolor: "#f0f7ff",
                        "&:hover": {
                          bgcolor: "#e3f2fd",
                          borderColor: "#1565c0",
                        },
                        "&:active": {
                          cursor: "grabbing"
                        }
                      }}
                    >
                      {displayProcedures.map((proc, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 1,
                            bgcolor: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          }}
                        >
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b" }}>
                              {proc.code}
                            </Typography>
                            <Typography sx={{ fontSize: "0.7rem", color: "#475569", fontWeight: 500 }}>
                              {proc.treatment}
                            </Typography>
                          </Box>
                          <Box sx={{ bgcolor: "#e2e8f0", px: 0.75, py: 0.25, borderRadius: "4px", flexShrink: 0 }}>
                            <Typography sx={{ fontSize: "0.65rem", color: "#475569", fontWeight: 700 }}>
                              {proc.duration} min
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </DetailAccordion>
                </Box>

                {/* List of Scheduled Appointments (Integrated from Dialog design) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 0.5 }}>
                  {appointments
                    .filter(a => dayjs(a.start).isAfter(dayjs().subtract(1, 'day')))
                    .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
                    .map(appt => (
                      <SidebarAppointmentCard 
                        key={appt.id} 
                        appointment={appt} 
                        onClick={() => {
                          if (onDateChange) onDateChange(dayjs(appt.date));
                        }} 
                      />
                    ))
                  }
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <ActionButton label="Route Slip" onClick={handleRouteSlipClick} />
                  <ActionButton label="Family Appointments" onClick={handleFamilyAppointmentsClick} />
                  <ActionButton label="Appointment History" onClick={handleAppointmentHistoryClick} />
                </Box>

                <Button variant="contained" fullWidth sx={{ bgcolor: '#94a3b8', borderRadius: '4px', textTransform: 'none', py: 0.75, fontSize: '0.85rem', fontWeight: 600, boxShadow: 'none' }}>
                  Purchase Products
                </Button>

                {/* Patient Details Detail View */}
                <DetailAccordion title="Patient Details" expanded={detailsExpanded} setExpanded={setDetailsExpanded}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5 }}>
                    <Box>
                      <Typography className="detail-label" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>Preferred Providers <KeyboardArrowDownIcon sx={{ fontSize: 14 }} /></Typography>
                      <Box sx={{ pl: 1, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#666' }}>Preferred Dentist:</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#333', fontWeight: 600 }}>
                            {patientDetails?.preferredProvider?.name || patientDetails?.preferredDentist?.name || '---'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#666' }}>Preferred Hygienist:</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#333', fontWeight: 600 }}>
                            {patientDetails?.preferredHygienist?.name || '---'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      <Typography className="detail-label">Patient Forms</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, pl: 1, flexWrap: 'wrap' }}>
                        {patientDetails?.forms && patientDetails.forms.length > 0 ? (
                          patientDetails.forms.map(form => {
                            const char = typeof form === 'string' ? form : form.type?.[0] || '?';
                            const isCompleted = typeof form === 'object' ? form.status === 'completed' : false;
                            return (
                              <Tooltip key={char} title={typeof form === 'object' ? form.name : char}>
                                <Box sx={{ 
                                  width: 18, height: 18, 
                                  bgcolor: isCompleted ? '#10b981' : (char === 'B' ? '#ef4444' : '#f5f5f5'), 
                                  color: (isCompleted || char === 'B') ? 'white' : '#999', 
                                  fontSize: '10px', fontWeight: 800, 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' 
                                }}>{char}</Box>
                              </Tooltip>
                            );
                          })
                        ) : (
                          <Typography sx={{ fontSize: '0.72rem', color: '#999', fontStyle: 'italic' }}>
                            No forms submitted
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#777' }} />
                        <Typography className="detail-label" sx={{ color: '#777', mb: 0 }}>Medical Alerts</Typography>
                      </Box>
                      <Box sx={{ pl: 2.5, mt: 0.5 }}>
                        {(() => {
                          const alerts = patientDetails?.medicalAlerts || patientDetails?.medicalHistory?.alerts || [];
                          if (alerts.length === 0) {
                            return (
                              <Typography sx={{ fontSize: '0.72rem', color: '#999', fontStyle: 'italic' }}>
                                No medical alerts
                              </Typography>
                            );
                          }
                          return alerts.map((alert, idx) => (
                            <Typography key={idx} sx={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>
                              {typeof alert === 'string' ? alert : alert.description || alert.name}
                            </Typography>
                          ));
                        })()}
                      </Box>
                    </Box>

                    <Box>
                      <Typography className="detail-label">Patient Flags</Typography>
                      {(patientDetails?.flags || []).length > 0 ? (
                        patientDetails.flags.map((flag, idx) => (
                          <Typography key={idx} sx={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600, pl: 1 }}>{flag}</Typography>
                        ))
                      ) : (
                        <Typography sx={{ fontSize: '0.72rem', color: '#999', pl: 1, fontStyle: 'italic' }}>No flags</Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography className="detail-label">Bills</Typography>
                      <Box sx={{ pl: 1 }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#333' }}>Last Bill: {patientBalance?.lastBillDate ? dayjs(patientBalance.lastBillDate).format('MM/DD/YYYY') : 'None'}</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography className="detail-label">Used Amount:</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#333', pl: 1, fontWeight: 600 }}>
                        ${patientBalance?.usedAmount?.toLocaleString() || '0.00'}
                      </Typography>
                    </Box>
                  </Box>
                </DetailAccordion>

                {/* Family Details Accordion */}
                <DetailAccordion title="Family Details" expanded={familyExpanded} setExpanded={setFamilyExpanded}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5 }}>
                    <Box>
                      <Typography className="detail-label">Family members:</Typography>
                      {(patientDetails?.familyMembers || []).length > 0 ? (
                        patientDetails.familyMembers.map((member, idx) => (
                          <Typography key={idx} sx={{ fontSize: '0.72rem', color: '#333', pl: 1 }}>
                            {member.firstName} {member.lastName} ({member.relationship || 'Member'})
                          </Typography>
                        ))
                      ) : (
                        <Typography sx={{ fontSize: '0.72rem', color: '#999', pl: 1, fontStyle: 'italic' }}>No family found</Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography className="detail-label">Family Bills:</Typography>
                      <Box sx={{ pl: 1, mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#333' }}>Total outstanding: <strong>${patientBalance?.familyTotalOutstanding?.toLocaleString() || '0.00'}</strong></Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#333' }}>Individual Outstanding: <strong>${patientBalance?.individualOutstanding?.toLocaleString() || '0.00'}</strong></Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#333' }}>Insurance Outstanding: <strong>${patientBalance?.insuranceOutstanding?.toLocaleString() || '0.00'}</strong></Typography>
                      </Box>
                    </Box>
                  </Box>
                </DetailAccordion>
              </Box>
            )}
          </Box>
        )}

        {/* TAB 1: Pending */}
        {activeTab === 1 && (
          <Box
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              try {
                const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
                if (dragData && onDropOnPending) {
                  onDropOnPending(dragData);
                }
              } catch (err) {
                console.error("Error parsing drop data:", err);
              }
            }}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minHeight: "250px",
              bgcolor: "#f8fafc",
              border: "2px dashed #cbd5e1",
              borderRadius: "8px",
              m: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#3b82f6",
                bgcolor: "#eff6ff",
              }
            }}
          >
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155", textAlign: "center" }}>
              Pending Reschedules ({pendingItems.length})
            </Typography>

            {pendingItems.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, py: 4, gap: 1 }}>
                <Typography sx={{ fontSize: 28 }}>🔄</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center", fontWeight: 500 }}>
                  Drag any appointment or blocked slot from the calendar and drop here
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: "400px", overflowY: "auto", pr: 0.5 }}>
                {pendingItems.map((item) => {
                  const isAppt = item.type === "appointment";
                  const title = isAppt ? item.data.patientName : (item.data.notes || "Blocked Slot");
                  const subtitle = isAppt ? (item.data.title || "Appointment") : "Calendar Block";
                  const duration = isAppt ? (item.data.durationMinutes || 60) : 30;
                  
                  return (
                    <Paper
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", JSON.stringify({
                          isPendingItem: true,
                          id: item.id,
                          type: item.type,
                          originalData: item.data
                        }));
                      }}
                      sx={{
                        p: 1.25,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        bgcolor: "#ffffff",
                        cursor: "grab",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                          transform: "translateY(-1px)",
                          borderColor: "#93c5fd"
                        },
                        "&:active": {
                          cursor: "grabbing"
                        },
                        position: "relative"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                        {isAppt ? (
                          <Box sx={{ 
                            width: 24, 
                            height: 24, 
                            borderRadius: "50%", 
                            bgcolor: "#e0f2fe", 
                            color: "#0284c7", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            fontWeight: 700
                          }}>
                            {item.data.patientInitials || "PT"}
                          </Box>
                        ) : (
                          <Box sx={{ 
                            width: 24, 
                            height: 24, 
                            borderRadius: "50%", 
                            bgcolor: "#fef3c7", 
                            color: "#d97706", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            fontWeight: 700
                          }}>
                            🚫
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {title}
                          </Typography>
                          <Typography sx={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 500 }}>
                            {subtitle}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onRemovePending) onRemovePending(item);
                          }}
                          sx={{ p: 0.2, color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
                        >
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Box sx={{ bgcolor: isAppt ? "#f0fdf4" : "#fff7ed", px: 1, py: 0.25, borderRadius: "4px" }}>
                          <Typography sx={{ fontSize: "0.65rem", color: isAppt ? "#15803d" : "#c2410c", fontWeight: 700 }}>
                            {isAppt ? "APPOINTMENT" : "BLOCK"}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>
                          ⏱️ {duration} min
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* TAB 2: Search */}
        {activeTab === 2 && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {searchMode === "input" ? (
              <>
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

                <Box sx={{ display: 'flex', alignItems: 'center', mt: -1 }}>
                  <Checkbox size="small" checked={searchDoubleBooking} onChange={(e) => setSearchDoubleBooking(e.target.checked)} sx={{ p: 0.5 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a678d' }}>ALLOW DOUBLE BOOKING</Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ display: 'block', mb: 0.5, lineHeight: 1, color: '#64748b', fontWeight: 700 }}>SEARCH AVAILABILITY FOR:</Typography>
                  <Select
                    fullWidth size="small"
                    value={searchRange}
                    onChange={(e) => setSearchRange(e.target.value)}
                    sx={{ bgcolor: '#fff', borderRadius: '6px', fontSize: '0.8rem' }}
                  >
                    <MenuItem value="1 month">1 month</MenuItem>
                    <MenuItem value="2 months">2 months</MenuItem>
                    <MenuItem value="3 months">3 months</MenuItem>
                    <MenuItem value="6 months">6 months</MenuItem>
                    <MenuItem value="8 months">8 months</MenuItem>
                  </Select>
                </Box>
                <Button onClick={handlePerformSearch} variant="contained" fullWidth sx={{ mt: 1, bgcolor: '#5c7cbc', textTransform: 'none', fontWeight: 700, boxShadow: 'none', "&:hover": { bgcolor: '#4a6496' } }}>Search</Button>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, borderBottom: '1px solid #cbd5e1', pb: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                    Results for: {searchDuration} mins, {searchAm ? 'AM ' : ''}{searchPm ? 'PM' : ''}, {searchRange}
                  </Typography>
                  <IconButton size="small" onClick={() => setSearchMode("input")} sx={{ p: 0.5 }}>
                    <EditIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: "400px", overflowY: "auto", pr: 0.5 }}>
                  {searchResults.length === 0 ? (
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', py: 4 }}>
                      No empty slots found for the selected criteria.
                    </Typography>
                  ) : (
                    searchResults.map((slot, idx) => (
                      <Paper
                        key={idx}
                        onClick={() => {
                          if (onDateChange) onDateChange(slot.date);
                        }}
                        sx={{
                          p: 1.25,
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                            bgcolor: "#f0f7ff",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)"
                          }
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b" }}>
                            {slot.dateFormatted}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>
                            {slot.roomName}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: "0.75rem", color: "#1976d2", fontWeight: 700 }}>
                          {slot.timeLabel}
                        </Typography>
                      </Paper>
                    ))
                  )}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* TAB 3: Productivity */}
        {activeTab === 3 && (
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Header Controls */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>Selected Provider:</Typography>
                <Select
                  size="small"
                  value={productivityProvider}
                  onChange={(e) => setProductivityProvider(e.target.value)}
                  sx={{ height: 32, minWidth: 120, fontSize: "0.8rem" }}
                  displayEmpty
                >
                  <MenuItem value="all">All</MenuItem>
                  {providers.map((p) => {
                    const providerId = p._id || p.id;
                    const providerName = p.name || 
                      (p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : "") ||
                      (p.userId?.firstName && p.userId?.lastName ? `${p.userId.firstName} ${p.userId.lastName}` : "") ||
                      p.providerCode || 
                      `Provider #${providerId}`;
                    
                    return (
                      <MenuItem key={providerId} value={providerId}>
                        {providerName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>Date:</Typography>
                  <TextField
                    type="date"
                    variant="standard"
                    size="small"
                    value={dayjs(selectedDate).format("YYYY-MM-DD")}
                    onChange={(e) => onDateChange?.(dayjs(e.target.value))}
                    InputProps={{ disableUnderline: true }}
                    sx={{ 
                      "& .MuiInputBase-input": { 
                        fontSize: "0.8rem", 
                        fontWeight: 700,
                        color: "#1e293b",
                        py: 0,
                        cursor: "pointer",
                        width: "105px"
                      } 
                    }}
                  />
                </Box>
                <Button 
                  variant="contained" 
                  size="small" 
                  sx={{ 
                    height: 24, 
                    px: 1.5,
                    fontSize: "0.7rem", 
                    textTransform: "none", 
                    bgcolor: "#5c7cbc",
                    borderRadius: 1,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#4a6496", boxShadow: "none" }
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Divider />

            {/* Metrics Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <ProductivityMetricCard
                title="Total"
                amount={1294}
                metrics={[
                  { label: "P", value: 7115, goal: 6200, color: "#82b366" },
                  { label: "C", value: 6458.5, goal: 6076, color: "#82b366" },
                  { label: "GP", value: 8136, color: "#666666" },
                  { label: "GC", value: 6458.5, color: "#b3b3b3" },
                ]}
                footer={[
                  { label: "Production per hour", value: 222.34, goal: 193.7 },
                  { label: "Production per visit", value: 1778.75, goal: 1550 },
                ]}
              />

              <ProductivityMetricCard
                title="Dentist"
                amount={932}
                metrics={[
                  { label: "P", value: 6609, goal: 5600, color: "#82b366" },
                  { label: "C", value: 6096.5, goal: 5488, color: "#82b366" },
                  { label: "GP", value: 7517, color: "#666666" },
                  { label: "GC", value: 6096.5, color: "#b3b3b3" },
                ]}
                footer={[
                  { label: "Production per hour", value: 275.38, goal: 233.3 },
                  { label: "Production per visit", value: 1652.25, goal: 1400 },
                ]}
              />

              <ProductivityMetricCard
                title="Hygienist"
                amount={362}
                metrics={[
                  { label: "P", value: 506, goal: 600, color: "#f87171" },
                  { label: "C", value: 362, goal: 588, color: "#f87171" },
                  { label: "GP", value: 619, color: "#666666" },
                  { label: "GC", value: 362, color: "#b3b3b3" },
                ]}
                footer={[
                  { label: "Production per hour", value: 63.25, goal: 75 },
                  { label: "Production per visit", value: 126.5, goal: 150 },
                ]}
              />
            </Box>
          </Box>
        )}
      </Box>

      {activeTab !== 2 && (
        <>
          <Divider />
          <Box sx={{ p: 2, bgcolor: "#fafcff", flexShrink: 0 }}>
            <StyledDateCalendar value={selectedDate} onChange={(v) => v && onDateChange && onDateChange(v)} />
          </Box>
        </>
      )}

      <PatientChat open={chatOpen} onClose={handleCloseChat} patientName={selectedPatient ? (selectedPatient.firstName + " " + selectedPatient.lastName) : ""} />
      <AppointmentPage open={appointmentPageOpen} onClose={handleCloseAppointmentPage} patientName={selectedPatient ? (selectedPatient.firstName + " " + selectedPatient.lastName) : ""} appointments={appointments || []} />
      <PatientRouteSlipDialog 
        open={routeSlipOpen} 
        onClose={handleCloseRouteSlip} 
        patient={selectedPatient}
        patientDetails={patientDetails}
        patientBalance={patientBalance}
      />
      <FamilyAppointmentsDialog
        open={familyAppointmentsOpen}
        onClose={handleCloseFamilyAppointments}
        patient={selectedPatient}
        familyMembers={patientDetails?.familyMembers || []}
      />
      <AppointmentHistoryDialog
        open={appointmentHistoryOpen}
        onClose={handleCloseAppointmentHistory}
        patient={selectedPatient}
      />
    </Box>
  );
};

// --- Helper Components for the Overhaul ---

const ActionButton = ({ label, onClick }) => (
  <Button
    variant="contained"
    fullWidth
    onClick={onClick}
    sx={{
      bgcolor: '#5c7cbc',
      borderRadius: '4px',
      textTransform: 'none',
      py: 0.6,
      fontSize: '0.85rem',
      fontWeight: 600,
      boxShadow: 'none',
      "&:hover": { bgcolor: '#4a6496', boxShadow: 'none' }
    }}
  >
    {label}
  </Button>
);

const HeaderAccordion = ({ title, value, icon: Icon, expanded, setExpanded }) => (
  <Box sx={{ mb: 0.5 }}>
    <Box 
      onClick={() => setExpanded(!expanded)}
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        bgcolor: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        p: 0.75, 
        cursor: 'pointer' 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon sx={{ fontSize: 16, color: '#666' }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#333' }}>{title}</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>{value}</Typography>
    </Box>
  </Box>
);

const DetailAccordion = ({ title, children, expanded, setExpanded }) => (
  <Box sx={{ mb: 1, border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
    <Box 
      onClick={() => setExpanded(!expanded)}
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        bgcolor: '#94a3b8', 
        p: 0.75, 
        cursor: 'pointer' 
      }}
    >
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.2s' }} />
        {title}
      </Typography>
    </Box>
    <Collapse in={expanded}>
      <Box sx={{ bgcolor: 'white' }}>
        <style>
          {`
            .detail-label {
              font-size: 0.75rem;
              font-weight: 700;
              color: #777;
              border-left: 2px solid #ddd;
              padding-left: 8px;
              margin-bottom: 4px;
            }
          `}
        </style>
        {children}
      </Box>
    </Collapse>
  </Box>
);

const CollapsibleChecklist = ({ title, items, selections, onToggleItem, open, onToggleOpen }) => {
  const doneCount = items.filter(item => selections[item]).length;
  const totalCount = items.length;

  return (
    <Box sx={{ borderBottom: "1px solid #eee" }}>
      <Box 
        onClick={(e) => {
          e.stopPropagation();
          onToggleOpen();
        }}
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          py: 0.5, 
          px: 1.5, 
          cursor: "pointer",
          bgcolor: "#fdfdfd",
          "&:hover": { bgcolor: "#f1f5f9" }
        }}
      >
        <Typography sx={{ fontSize: "0.75rem", color: "#334155", fontWeight: 600 }}>
          {title} ({doneCount}/{totalCount})
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {doneCount === totalCount && totalCount > 0 ? (
            <CheckIcon sx={{ fontSize: 14, color: "#10b981", fontWeight: 'bold' }} />
          ) : null}
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#64748b", transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </Box>
      </Box>
      <Collapse in={open}>
        <Box sx={{ pl: 3.5, pr: 1.5, py: 0.5, bgcolor: "#fff", display: "flex", flexDirection: "column", gap: 0.25 }}>
          {items.map(item => (
            <Box key={item} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.1 }} onClick={(e) => e.stopPropagation()}>
              <Typography sx={{ fontSize: "0.7rem", color: "#475569" }}>{item}</Typography>
              <Checkbox 
                size="small" 
                checked={!!selections[item]} 
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleItem(item);
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ p: 0.25 }}
              />
            </Box>
          ))}
          {items.length === 0 && (
            <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontStyle: "italic", py: 0.5 }}>
              No items configured
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const APPOINTMENT_STATUS_OPTIONS = [
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

const SidebarAppointmentCard = ({ appointment, onClick }) => {
  const dispatch = useDispatch();
  const practiceData = useSelector((state) => state.practiceInfo.data);

  const preApptItems = practiceData?.scheduleConfig?.preApptChecklist || ["Import History", "Import Record", "Appt Reminder", "Verify Insurance Eligibility", "Share Consent Forms", "Deposit for treatment"];
  const checkInItems = practiceData?.scheduleConfig?.checkInChecklist || ["Review Records", "Review & sign Visit Plan", "Sign Consent Forms", "Verify Premed Taken"];
  const checkOutItems = practiceData?.scheduleConfig?.checkOutChecklist || ["Complete & Bill Procedures", "Purchase Products", "Share Clinical Reports", "Prescription", "Schedule Next Appt", "Send Lab Case"];

  const [preApptOpen, setPreApptOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const headerDate = dayjs(appointment.start || appointment.appointmentDate).format("MM/DD/YYYY");
  const headerTime = dayjs(appointment.start || appointment.appointmentDate).format("hh:mm A");
  const type = appointment.title || "RECARE";
  const isRecare = type.toLowerCase().includes("recare");

  const checklistsState = appointment.checklists || { preAppt: {}, checkIn: {}, checkOut: {} };

  const currentStatus = appointment.status || "unconfirmed";
  const showAllChecklists = !["unconfirmed", "preconfirmed", "confirmed", "scheduled"].includes(currentStatus);

  const handleToggleItem = (category, item) => {
    const currentCategorySelections = checklistsState[category] || {};
    const updatedChecklists = {
      ...checklistsState,
      [category]: {
        ...currentCategorySelections,
        [item]: !currentCategorySelections[item]
      }
    };

    dispatch(updateAppointmentThunk({
      appointmentId: appointment._id || appointment.id,
      payload: { checklists: updatedChecklists }
    }));
  };

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{ border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden", cursor: "pointer", transition: "0.2s", "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" } }}
    >
      <Box sx={{ bgcolor: isRecare ? "#a26da1" : "#5b9bae", p: 0.5, color: "#fff" }}>
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, textAlign: "center" }}>
          {type.toUpperCase()} {headerDate} @ {headerTime}
        </Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Select
            value={currentStatus}
            onChange={(e) => {
              const newStatus = e.target.value;
              dispatch(updateAppointmentThunk({
                appointmentId: appointment._id || appointment.id,
                payload: { status: newStatus }
              }));
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{
              height: 28,
              fontSize: "0.75rem",
              "& .MuiSelect-select": { py: 0.25, pl: 1 },
              width: "145px",
              borderRadius: "4px",
              bgcolor: "#fff"
            }}
          >
            {APPOINTMENT_STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.75rem" }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={{ fontSize: '0.75rem', color: '#999', fontWeight: 700 }}>P1 V{appointment.id?.toString().slice(-1) || '1'}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <MailOutlineIcon sx={{ fontSize: 16, color: "#5c7cbc" }} />
          <ChatOutlinedIcon sx={{ fontSize: 16, color: "#5c7cbc" }} />
        </Box>
        <Typography sx={{ fontSize: "0.75rem", color: "#333", mb: 0.5 }}>{appointment.note || "periodic ex, fl, hygiene"}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ bgcolor: "#d7ebd8", px: 0.5, borderRadius: "2px", border: "1px solid #c0e0c1" }}>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, color: "#478c4a" }}>SAB</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ borderTop: "1px solid #ddd", bgcolor: "#f9f9f9" }}>
        <CollapsibleChecklist 
          title="Pre-appt Checklist" 
          items={preApptItems} 
          selections={checklistsState.preAppt || {}} 
          onToggleItem={(item) => handleToggleItem('preAppt', item)}
          open={preApptOpen}
          onToggleOpen={() => setPreApptOpen(!preApptOpen)}
        />
        {showAllChecklists && (
          <>
            <CollapsibleChecklist 
              title="Check-in Checklist" 
              items={checkInItems} 
              selections={checklistsState.checkIn || {}} 
              onToggleItem={(item) => handleToggleItem('checkIn', item)}
              open={checkInOpen}
              onToggleOpen={() => setCheckInOpen(!checkInOpen)}
            />
            <CollapsibleChecklist 
              title="Check-out Checklist" 
              items={checkOutItems} 
              selections={checklistsState.checkOut || {}} 
              onToggleItem={(item) => handleToggleItem('checkOut', item)}
              open={checkOutOpen}
              onToggleOpen={() => setCheckOutOpen(!checkOutOpen)}
            />
          </>
        )}
      </Box>
    </Paper>
  );
};

export default OperatorySidebar;