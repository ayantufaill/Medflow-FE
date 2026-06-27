import { Box, Divider, InputAdornment, TextField, Typography } from "@mui/material";
import { Search, PersonAdd, Add } from "@mui/icons-material";
import CurrentPatientCard from "./CurrentPatientCard";
import PatientListCard from "./PatientListCard";

const CURRENT_PATIENT = {
  name: "Melina Cuellar",
  id: "765",
  phone: "+1 (855) 849-5255",
  coverage: "No active coverage",
  appt: "01/17/2023 · 10:00 AM",
  status: "in_treatment",
};

const ALL_PATIENTS = [
  { name: "Molina Whitish",  id: "812", phone: "+1 (415) 555-2210", insurance: "Delta Dental", balance: "148",  appt: "Today · 10:00 AM",  status: "active" },
  { name: "Melina Paz",      id: "904", phone: "+1 (628) 555-1188", insurance: "MetLife",       balance: "1820", appt: "Today · 11:40 AM", status: "in_treatment" },
  { name: "Jordan Reyes",    id: "611", phone: "+1 (917) 555-9931", insurance: "Cigna",                          appt: "Today · 1:00 PM",   status: "active" },
  { name: "Aisha Patel",     id: "532", phone: "+1 (212) 555-7715", insurance: "Aetna",                          appt: "Today · 2:00 PM",   status: "active" },
  { name: "Vanessa Thorne",  id: "338", phone: "+1 (305) 555-7780", insurance: "Delta Dental",  balance: "530",                             status: "overdue" },
  { name: "Leo Garcia",      id: "221", phone: "+1 (310) 555-1190", insurance: "Self-pay",                                                   status: "new" },
];

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", px: "12px", mb: "6px" }}>
    {children}
  </Typography>
);

const FooterAction = ({ icon, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex", alignItems: "center", gap: "8px",
      px: "12px", py: "10px", cursor: "pointer",
      "&:hover": { backgroundColor: "#f8fafc" },
    }}
  >
    {icon}
    <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#2262ef", fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
);

const PatientDropdownPanel = () => (
  <Box sx={{
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e0e5eb",
    overflow: "hidden",
  }}>
    {/* Search bar */}
    <Box sx={{ px: "12px", pt: "12px", pb: "10px" }}>
      <TextField
        fullWidth
        placeholder="Search by name, chart #, phone, email..."
        size="small"
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ fontSize: "16px", color: "#9aa3ae" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f5f7fa",
            fontFamily: "Inter",
            fontSize: "13px",
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: "#e0e5eb" },
            "&.Mui-focused fieldset": { borderColor: "#2262ef", borderWidth: "1.5px" },
          },
          "& input::placeholder": { color: "#9aa3ae", opacity: 1 },
        }}
      />
    </Box>

    {/* Current patient section */}
    <SectionLabel>Current Patient</SectionLabel>
    <Box sx={{ px: "12px", mb: "12px" }}>
      <CurrentPatientCard patient={CURRENT_PATIENT} />
    </Box>

    <Divider sx={{ borderColor: "#f0f2f5" }} />

    {/* All patients section */}
    <Box sx={{ maxHeight: "340px", overflowY: "auto" }}>
      <Box sx={{ pt: "10px" }}>
        <SectionLabel>All patients</SectionLabel>
      </Box>
      {ALL_PATIENTS.map((pt, i) => (
        <Box key={pt.id}>
          <PatientListCard patient={pt} />
          {i < ALL_PATIENTS.length - 1 && (
            <Divider sx={{ mx: "12px", borderColor: "#f5f7fa" }} />
          )}
        </Box>
      ))}
    </Box>

    <Divider sx={{ borderColor: "#f0f2f5" }} />

    {/* Footer actions */}
    <FooterAction
      icon={<PersonAdd sx={{ fontSize: "16px", color: "#2262ef" }} />}
      label="Add new patient"
    />
    <FooterAction
      icon={<Add sx={{ fontSize: "16px", color: "#2262ef" }} />}
      label="Quick book without chart"
    />
  </Box>
);

export default PatientDropdownPanel;
