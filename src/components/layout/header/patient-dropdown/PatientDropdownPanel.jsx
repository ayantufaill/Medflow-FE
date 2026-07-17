import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Typography, CircularProgress } from "@mui/material";
import { Search, PersonAdd, Add } from "@mui/icons-material";
import { useDebounce } from "use-debounce";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import CurrentPatientCard from "./CurrentPatientCard";
import PatientListCard from "./PatientListCard";
import { usePatients, usePatient } from "../../../../hooks/redux";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Maps an API patient object to the flat shape that CurrentPatientCard and
// PatientListCard expect. Both card components read: name, id, phone,
// insurance, balance, appt, status.
export const toCardShape = (patient) => {
  if (!patient) return null;

  const name = `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unknown Patient";
  const age  = patient.dateOfBirth
    ? dayjs().diff(dayjs(patient.dateOfBirth), "year")
    : null;

    // Insurance / Payment logic
    const paidBy = patient.paymentMethod?.paidBy || patient.primaryInsurance?.name || patient.insuranceName;
    const hasCoverage = paidBy && paidBy !== 'Self Pay';
    const finalPaidBy = hasCoverage ? paidBy : 'Self Pay';

    // Balance logic
    let finalBalance = patient.displayedBalance != null 
      ? patient.displayedBalance 
      : null;
    
    // Fallback if backend hasn't deployed the change yet
    if (finalBalance == null) {
      if (patient.balanceBreakdown) {
        finalBalance = hasCoverage 
          ? patient.balanceBreakdown.insuranceBalance 
          : patient.balanceBreakdown.patientBalance;
      } else {
        finalBalance = hasCoverage 
          ? patient.InsEst 
          : (patient.balance ?? patient.EstBalance ?? patient.BalTotal);
      }
    }
    const displayBalance = (finalBalance && Number(finalBalance) !== 0) ? String(finalBalance) : null;

    // Appt formatting logic
    let apptString = null;
    if (patient.nextAppointmentDate) {
      const aptDate = dayjs.utc(patient.nextAppointmentDate);
      const today = dayjs.utc().startOf('day');
      const tomorrow = dayjs.utc().add(1, 'day').startOf('day');
      const target = aptDate.startOf('day');
      
      if (target.isSame(today)) {
        apptString = `Today · ${aptDate.format("h:mm A")}`;
      } else if (target.isSame(tomorrow)) {
        apptString = `Tomorrow · ${aptDate.format("h:mm A")}`;
      } else {
        apptString = aptDate.format("MM/DD/YYYY · h:mm A");
      }
    }

    return {
      name,
      id:       patient.patientNumber || patient.patientCode || patient._id?.slice(-6)?.toUpperCase() || "---",
      phone:    patient.mobilePhone || patient.phonePrimary || patient.phone || "--",
      coverage: finalPaidBy === 'Self Pay' ? "No active coverage" : finalPaidBy,
      insurance: finalPaidBy,
      balance:  displayBalance,
      appt:     apptString,
      status:   patient.status || "new",
      _id:      patient._id || patient.id,
    _raw:     patient, // preserve full object for Redux dispatch on select
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#5c646f", fontWeight: 500, px: "12px", mb: "6px" }}>
    {children}
  </Typography>
);

const FooterAction = ({ icon, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex", alignItems: "center", gap: "15px",
      px: "14px", py: "7px", cursor: "pointer", lineHeight: "20px",
      "&:hover": { backgroundColor: "#f8fafc" },
    }}
  >
    {icon}
    <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#09121f", fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
);

// ─── PatientDropdownPanel ─────────────────────────────────────────────────────

// PatientDropdownPanel renders the full search dropdown.
// onClose is called after a patient is selected so the parent can hide the panel.

const PatientDropdownPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const { patients, loading, fetch: searchPatients } = usePatients();
  const { currentPatient, setPatient, fetchById, setPatientId } = usePatient();

  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  // Debounce the raw input so the API is not called on every keystroke.
  const [debouncedQuery] = useDebounce(searchQuery, 350);

  // Load patients immediately when the panel mounts (shows a default list before the
  // user types). Also re-fetches whenever the debounced query changes.
  useEffect(() => {
    searchPatients({ search: debouncedQuery.trim(), limit: 20, page: 1 });
  }, [debouncedQuery]); // searchPatients is a stable useCallback

  // Auto-focus the search input when the panel opens.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Write the selected patient into Redux by fetching their full workspace data.
  // This ensures family details, balances, and other deep fields are populated.
  const handleSelectPatient = (rawPatient) => {
    const pId = rawPatient._id || rawPatient.id || rawPatient.PatNum;
    
    // Fallback: set basic patient data immediately so UI reacts fast
    setPatient(rawPatient);
    if (pId) setPatientId(pId);
    
    if (pId) {
      // Then fetch full workspace in background to populate family details
      fetchById(pId);
    }
    
    onClose?.(); // collapse the dropdown
  };

  // Build the shaped card objects from the Redux list.
  const patientCards = patients.map(toCardShape).filter(Boolean);
  const currentCard  = currentPatient ? toCardShape(currentPatient) : null;

  return (
    <Box
      sx={{
        width: "400px",
        backgroundColor: "#fff",
        borderRadius: "14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e0e5eb",
        overflow: "hidden",
      }}
    >
      {/* ── Search input ──────────────────────────────────────────────────────── */}
      <Box sx={{ px: "12px", pt: "12px", pb: "10px" }}>
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "#f1f4f7",
            borderRadius: "10px",
            px: "10px", py: "7px",
            border: "1.5px solid transparent",
            "&:focus-within": { borderColor: "#2262ef", backgroundColor: "#f1f4f7" },
            transition: "border-color 0.15s",
          }}
        >
          <Search sx={{ fontSize: "15px", color: "#9aa3ae", flexShrink: 0 }} />
          <Box
            component="input"
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, chart #, phone, email..."
            sx={{
              flex: 1, border: "none", outline: "none",
              backgroundColor: "#f1f4f7",
              fontFamily: "Inter", fontSize: "13px", color: "#374151",
              "&::placeholder": { color: "#9aa3ae" },
            }}
          />
          {/* Spinner while fetching — keeps the layout stable */}
          {loading && (
            <CircularProgress size={12} sx={{ color: "#2262ef", flexShrink: 0 }} />
          )}
        </Box>
      </Box>

      {/* ── Current patient ───────────────────────────────────────────────────── */}
      {currentCard && (
        <>
          <SectionLabel>Current Patient</SectionLabel>
          <Box sx={{ px: "12px", mb: "12px" }}>
            {/* Clicking the current patient re-confirms selection (no-op, just closes) */}
            <Box onClick={() => onClose?.()}>
              <CurrentPatientCard patient={currentCard} />
            </Box>
          </Box>
          <Divider sx={{ borderColor: "#f0f2f5" }} />
        </>
      )}

      {/* ── Patient list ──────────────────────────────────────────────────────── */}
      <Box sx={{ maxHeight: "340px", overflowY: "auto" }}>
        {patientCards.length > 0 ? (
          <>
            <Box sx={{ pt: "10px" }}>
              <SectionLabel>
                {searchQuery.trim() ? "Search results" : "All patients"}
              </SectionLabel>
            </Box>

            {patientCards.map((card, i) => (
              <Box key={card._id || i}>
                <PatientListCard
                  patient={card}
                  onClick={() => handleSelectPatient(card._raw)}
                />
                {i < patientCards.length - 1 && (
                  <Divider sx={{ mx: "12px", borderColor: "#f5f7fa" }} />
                )}
              </Box>
            ))}
          </>
        ) : !loading && debouncedQuery ? (
          /* No results message when the query returned nothing */
          <Box sx={{ px: "12px", py: "16px", textAlign: "center" }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
              No patients found for &quot;{debouncedQuery}&quot;
            </Typography>
          </Box>
        ) : null}
      </Box>

      <Divider sx={{ borderColor: "#f0f2f5" }} />

      {/* ── Footer actions ────────────────────────────────────────────────────── */}
      <FooterAction
        icon={<PersonAdd sx={{ fontSize: "15px", color: "#2262ef" }} />}
        label="Add new patient"
        onClick={() => {
          onClose?.();
          navigate("/patients/new");
        }}
      />
      <FooterAction
        icon={<Add sx={{ fontSize: "15px", color: "#2262ef" }} />}
        label="Quick book without chart"
      />
    </Box>
  );
};

export default PatientDropdownPanel;
