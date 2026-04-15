import { useState, useEffect, useRef } from "react";
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
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PatientChat from "../shared/PatientChat";
import AppointmentPage from "../shared/AppointmentPage";
import { compactInputLabelSx, compactInputValueSx } from "../../constants/styles";
import { patientService } from "../../services/patient.service";
import { invoiceService } from "../../services/invoice.service";

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
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState("confirmed");
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientBalance, setPatientBalance] = useState(null);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [familyExpanded, setFamilyExpanded] = useState(true);
  const [proceduresExpanded, setProceduresExpanded] = useState(true);
  const [recareExpanded, setRecareExpanded] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
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

  // Fetch detailed patient data when a patient is selected
  useEffect(() => {
    if (selectedPatient?.id || selectedPatient?._id) {
      const pid = selectedPatient.id || selectedPatient._id;
      const fetchPatientFullDetails = async () => {
        setLoadingDetails(true);
        try {
          const [details, balance] = await Promise.all([
            patientService.getPatientWorkspace(pid),
            invoiceService.getPatientBalance(pid)
          ]);
          setPatientDetails(details);
          setPatientBalance(balance);
        } catch (error) {
          console.error("Error fetching patient details:", error);
        } finally {
          setLoadingDetails(false);
        }
      };
      fetchPatientFullDetails();
    } else {
      setPatientDetails(null);
      setPatientBalance(null);
    }
  }, [selectedPatient]);

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
                onInputChange={(_, value, reason) => {
                  if (reason === 'input') {
                    setPatientQuery(value);
                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                    searchDebounceRef.current = setTimeout(() => onPatientSearch?.(value), 300);
                  } else if (reason === 'clear') {
                    setPatientQuery('');
                    setSelectedPatient(null);
                    setPatientDetails(null);
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
                        {selectedPatient?.firstName} {selectedPatient?.lastName} (#{selectedPatient?.patientCode || selectedPatient?._id?.slice(-4) || '---'})
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#666', mt: 0.25 }}>
                        Birthday: {selectedPatient?.dateOfBirth ? dayjs(selectedPatient.dateOfBirth).format('MM/DD/YYYY') : '---'} (35)
                      </Typography>
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
                <Box>
                  <HeaderAccordion title="P 1 #15 crown /bu" value="____ min" icon={KeyboardArrowRightIcon} expanded={proceduresExpanded} setExpanded={setProceduresExpanded} />
                  <HeaderAccordion title="Recare" value="____ min" icon={EventNoteIcon} expanded={recareExpanded} setExpanded={setRecareExpanded} />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <ActionButton label="Route Slip" />
                  <ActionButton label="Family Appointments" />
                  <ActionButton label="Appointment History" />
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
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, pl: 1 }}>
                        {(patientDetails?.forms || ['B', 'R', 'P', 'Q']).map(form => {
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
                        })}
                      </Box>
                    </Box>

                    <Box>
                      <Typography className="detail-label" sx={{ color: (patientDetails?.medicalAlerts?.length > 0 || patientDetails?.medicalHistory?.alerts?.length > 0) ? '#ef4444' : '#777' }}>Medical Alerts</Typography>
                      {(patientDetails?.medicalAlerts || patientDetails?.medicalHistory?.alerts || []).length > 0 ? (
                        (patientDetails?.medicalAlerts || patientDetails?.medicalHistory?.alerts).map((alert, idx) => (
                          <Typography key={idx} sx={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600, pl: 1 }}>
                            {typeof alert === 'string' ? alert : alert.description || alert.name}
                          </Typography>
                        ))
                      ) : (
                        <Typography sx={{ fontSize: '0.72rem', color: '#999', pl: 1, fontStyle: 'italic' }}>No alerts</Typography>
                      )}
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

      <Divider />
      <Box sx={{ p: 2, bgcolor: "#fafcff", flexShrink: 0 }}>
        <StyledDateCalendar value={selectedDate} onChange={(v) => v && onDateChange && onDateChange(v)} />
      </Box>

      <PatientChat open={chatOpen} onClose={handleCloseChat} patientName={selectedPatient ? (selectedPatient.firstName + " " + selectedPatient.lastName) : ""} />
      <AppointmentPage open={appointmentPageOpen} onClose={handleCloseAppointmentPage} patientName={selectedPatient ? (selectedPatient.firstName + " " + selectedPatient.lastName) : ""} />
    </Box>
  );
};

// --- Helper Components for the Overhaul ---

const ActionButton = ({ label }) => (
  <Button
    variant="contained"
    fullWidth
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

export default OperatorySidebar;