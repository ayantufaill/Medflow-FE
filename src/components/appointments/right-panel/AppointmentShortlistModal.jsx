import { useState } from "react";
import { Dialog, Box, Typography, Checkbox, IconButton, Divider } from "@mui/material";
import {
  Close, CalendarMonth, Search, Print, Delete,
  KeyboardArrowDown,
} from "@mui/icons-material";

/* ── mock data ─────────────────────────────────────────────── */
const PATIENTS = [
  { id: 1, name: "Ann Hathaway",     providers: "SMI",      duration: "60 mins", prefDay: "Thurs", prefTime: "07:10 AM", procedures: ["fl", "hygiene", "periodic ex"],  note: "—",     aptDate: "May 19, 2022", nextAptDate: "—" },
  { id: 2, name: "Melina Freschi",   providers: "BAL",      duration: "60 mins", prefDay: "Tues",  prefTime: "09:10 AM", procedures: ["periodic ex", "hygiene", "fl"],   note: "—",     aptDate: "Jul 19, 2022", nextAptDate: "—" },
  { id: 3, name: "JOHN CLAD",        providers: "BAL, BAL", duration: "70 mins", prefDay: "Mon",   prefTime: "04:00 PM", procedures: ["hygiene", "BW4", "comp ex"],      note: "note1", aptDate: "Feb 07, 2022", nextAptDate: "—" },
  { id: 4, name: "Melina Haines",    providers: "BAL",      duration: "60 mins", prefDay: "Thurs", prefTime: "09:10 AM", procedures: ["fl", "hygiene", "periodic ex"],   note: "—",     aptDate: "Apr 28, 2022", nextAptDate: "—" },
  { id: 5, name: "Sabrina Gauthier", providers: "BAL",      duration: "60 mins", prefDay: "Tues",  prefTime: "09:25 AM", procedures: ["hygiene", "periodic ex"],         note: "—",     aptDate: "Apr 05, 2022", nextAptDate: "—" },
];

/* ── reusable atoms ────────────────────────────────────────── */
const ColLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.4px", textTransform: "uppercase" }}>
    {children}
  </Typography>
);

const FilterLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#9aa3ae", letterSpacing: "0.5px", textTransform: "uppercase", mb: "5px" }}>
    {children}
  </Typography>
);

/* plain bordered input ──────────────────────────────────────── */
const FilterInput = ({ placeholder, endAdornment, width = "100%" }) => (
  <Box sx={{
    display: "flex", alignItems: "center",
    width,
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    px: "10px", height: "36px",
    backgroundColor: "#fff",
    gap: "4px",
  }}>
    <Box
      component="input"
      placeholder={placeholder}
      sx={{
        flex: 1, border: "none", outline: "none",
        fontFamily: "Inter", fontSize: "13px", color: "#374151",
        backgroundColor: "transparent",
        "&::placeholder": { color: "#9aa3ae" },
      }}
    />
    {endAdornment}
  </Box>
);

/* select lookalike ──────────────────────────────────────────── */
const FilterSelect = ({ value = "All", width = "100%" }) => (
  <Box sx={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width,
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    px: "10px", height: "36px",
    backgroundColor: "#fff",
    cursor: "pointer",
  }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>{value}</Typography>
    <KeyboardArrowDown sx={{ fontSize: "16px", color: "#9aa3ae" }} />
  </Box>
);

/* procedure chip ────────────────────────────────────────────── */
const ProcChip = ({ label }) => (
  <Box sx={{ backgroundColor: "#e0f2fe", borderRadius: "4px", px: "7px", py: "2px" }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#0369a1" }}>{label}</Typography>
  </Box>
);

/* ── column layout ─────────────────────────────────────────── */
const COL = {
  check:    { width: "40px",  flex: "none" },
  name:     { width: "148px", flex: "none" },
  provider: { width: "80px",  flex: "none" },
  duration: { width: "76px",  flex: "none" },
  prefDay:  { width: "68px",  flex: "none" },
  prefTime: { width: "80px",  flex: "none" },
  procs:    { flex: "1",      minWidth: "130px" },
  note:     { width: "60px",  flex: "none" },
  aptDate:  { width: "108px", flex: "none" },
  nextApt:  { width: "90px",  flex: "none" },
  actions:  { width: "168px", flex: "none" },
};

const Cell = ({ col, children, sx }) => (
  <Box sx={{ width: COL[col].width, flex: COL[col].flex, minWidth: COL[col].minWidth, flexShrink: 0, ...sx }}>
    {children}
  </Box>
);

/* ── table header row ──────────────────────────────────────── */
const TableHeader = ({ allChecked, onToggleAll }) => (
  <Box sx={{
    display: "flex", alignItems: "center",
    px: "14px", py: "10px",
    backgroundColor: "#fafbfc",
    borderBottom: "1px solid #e0e5eb",
  }}>
    <Cell col="check">
      <Checkbox
        size="small" checked={allChecked} onChange={onToggleAll}
        sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }}
      />
    </Cell>
    <Cell col="name">
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
        <ColLabel>Patient Name</ColLabel>
        <KeyboardArrowDown sx={{ fontSize: "13px", color: "#9aa3ae" }} />
      </Box>
    </Cell>
    <Cell col="provider"><ColLabel>Providers</ColLabel></Cell>
    <Cell col="duration"><ColLabel>Duration</ColLabel></Cell>
    <Cell col="prefDay"><ColLabel>Pref. Day</ColLabel></Cell>
    <Cell col="prefTime"><ColLabel>Pref. Time</ColLabel></Cell>
    <Cell col="procs"><ColLabel>Procedures</ColLabel></Cell>
    <Cell col="note"><ColLabel>Note</ColLabel></Cell>
    <Cell col="aptDate">
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
        <ColLabel>Apt. Date</ColLabel>
        <KeyboardArrowDown sx={{ fontSize: "13px", color: "#9aa3ae" }} />
      </Box>
    </Cell>
    <Cell col="nextApt"><ColLabel>Next Apt. Date</ColLabel></Cell>
    <Cell col="actions" />
  </Box>
);

/* ── table data row ────────────────────────────────────────── */
const TableRow = ({ patient, checked, onToggle }) => (
  <Box sx={{
    display: "flex", alignItems: "center",
    px: "14px", py: "12px",
    borderBottom: "1px solid #f0f2f5",
    "&:last-child": { borderBottom: "none" },
    "&:hover": { backgroundColor: "#fafbfc" },
  }}>
    <Cell col="check">
      <Checkbox
        size="small" checked={checked} onChange={onToggle}
        sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }}
      />
    </Cell>

    <Cell col="name">
      <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f" }}>
        {patient.name}
      </Typography>
    </Cell>

    <Cell col="provider">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.providers}</Typography>
    </Cell>

    <Cell col="duration">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.duration}</Typography>
    </Cell>

    <Cell col="prefDay">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.prefDay}</Typography>
    </Cell>

    <Cell col="prefTime">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.prefTime}</Typography>
    </Cell>

    <Cell col="procs">
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {patient.procedures.map((p) => <ProcChip key={p} label={p} />)}
      </Box>
    </Cell>

    <Cell col="note">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.note}</Typography>
    </Cell>

    <Cell col="aptDate">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.aptDate}</Typography>
    </Cell>

    <Cell col="nextApt">
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{patient.nextAptDate}</Typography>
    </Cell>

    {/* actions */}
    <Cell col="actions">
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
          edit
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0d9488", cursor: "pointer", textAlign: "right", "&:hover": { textDecoration: "underline" } }}>
          +add to schedule
        </Typography>
        <IconButton size="small" sx={{ p: "2px", color: "#ef4444", "&:hover": { backgroundColor: "#fef2f2" } }}>
          <Delete sx={{ fontSize: "14px" }} />
        </IconButton>
      </Box>
    </Cell>
  </Box>
);

/* ═══════════════════════════════════════════════════════════ */
const AppointmentShortlistModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState([]);
  const [ampm, setAmpm] = useState("AM");

  const allChecked = selected.length === PATIENTS.length;
  const toggleAll = () => setSelected(allChecked ? [] : PATIENTS.map((p) => p.id));
  const toggleRow = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "min(1180px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 64px)",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          m: 0,
        },
      }}
    >
      {/* ── HEADER ── */}
      <Box sx={{ backgroundColor: "#f3f8fd", px: "24px", py: "14px", borderBottom: "1px solid #e8edf3", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <Box sx={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <CalendarMonth sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>Appointment Shortlist</Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>Schedule treatment or recare</Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose} size="small" sx={{ color: "#9aa3ae", "&:hover": { backgroundColor: "#e8edf3" } }}>
          <Close sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      {/* ── TABS ── */}
      <Box sx={{ borderBottom: "1px solid #e8edf3", px: "24px", display: "flex", gap: "24px", flexShrink: 0 }}>
        {["Treatment", "Recare"].map((label, i) => (
          <Box
            key={label}
            onClick={() => setTab(i)}
            sx={{
              py: "12px",
              cursor: "pointer",
              borderBottom: tab === i ? "2px solid #2262ef" : "2px solid transparent",
              mb: "-1px",
            }}
          >
            <Typography sx={{
              fontFamily: "Inter", fontSize: "14px",
              fontWeight: tab === i ? 700 : 400,
              color: tab === i ? "#2262ef" : "#9aa3ae",
            }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── FILTERS AREA ── */}
      <Box sx={{ px: "24px", py: "16px", borderBottom: "1px solid #f0f2f5", flexShrink: 0 }}>

        {/* Search row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "16px" }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 700, color: "#09121f", flexShrink: 0 }}>
            Search:
          </Typography>
          <Box sx={{
            display: "flex", alignItems: "center", gap: "8px",
            flex: 1, maxWidth: "340px",
            border: "1px solid #d1d5db", borderRadius: "8px",
            px: "10px", height: "38px",
          }}>
            <Search sx={{ fontSize: "15px", color: "#9aa3ae" }} />
            <Box
              component="input"
              placeholder="Patient Name"
              sx={{
                flex: 1, border: "none", outline: "none",
                fontFamily: "Inter", fontSize: "13px", color: "#374151",
                "&::placeholder": { color: "#9aa3ae" },
              }}
            />
          </Box>
          <Box sx={{
            backgroundColor: "#2262ef", borderRadius: "8px",
            px: "18px", height: "38px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              Search Patient Name
            </Typography>
          </Box>
        </Box>

        {/* Filter row */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "flex-end", mb: "14px" }}>
          {/* Provider */}
          <Box sx={{ width: "165px" }}>
            <FilterLabel>Provider</FilterLabel>
            <FilterSelect value="All" />
          </Box>

          {/* Max appt duration */}
          <Box sx={{ width: "150px" }}>
            <FilterLabel>Max Appt. Duration</FilterLabel>
            <FilterInput
              placeholder=""
              endAdornment={<Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", flexShrink: 0 }}>min</Typography>}
            />
          </Box>

          {/* Min appt duration */}
          <Box sx={{ width: "150px" }}>
            <FilterLabel>Min Appt. Duration</FilterLabel>
            <FilterInput
              placeholder=""
              endAdornment={<Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", flexShrink: 0 }}>min</Typography>}
            />
          </Box>

          {/* Pref day */}
          <Box sx={{ width: "165px" }}>
            <FilterLabel>Pref Day</FilterLabel>
            <FilterSelect value="All" />
          </Box>

          {/* Pref time */}
          <Box>
            <FilterLabel>Pref. Time</FilterLabel>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Box sx={{ border: "1px solid #d1d5db", borderRadius: "6px", px: "10px", height: "36px", display: "flex", alignItems: "center", width: "54px" }}>
                <Box
                  component="input"
                  defaultValue="12"
                  sx={{
                    width: "100%", border: "none", outline: "none",
                    fontFamily: "Inter", fontSize: "13px", color: "#374151",
                    textAlign: "center",
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden", height: "36px" }}>
                {["AM", "PM"].map((v) => (
                  <Box
                    key={v}
                    onClick={() => setAmpm(v)}
                    sx={{
                      px: "14px",
                      display: "flex", alignItems: "center",
                      backgroundColor: ampm === v ? "#2262ef" : "#fff",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: ampm === v ? "#2262ef" : "#f5f7fa" },
                    }}
                  >
                    <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: ampm === v ? "#fff" : "#374151" }}>
                      {v}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Patient flags */}
        <Box sx={{ mb: "14px" }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae", mb: "5px" }}>Patient Flags</Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#2262ef", cursor: "pointer", fontWeight: 500 }}>
            + Select Flags
          </Typography>
        </Box>

        {/* Action buttons — right aligned */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <Box sx={{
            backgroundColor: "#2262ef", borderRadius: "8px",
            px: "20px", height: "38px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>Apply Filters</Typography>
          </Box>

          <Box sx={{
            border: "1px solid #d1d5db", borderRadius: "8px",
            px: "20px", height: "38px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#f5f7fa" },
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#374151" }}>Clear All Filters</Typography>
          </Box>

          <Box sx={{
            border: "1px solid #d1d5db", borderRadius: "8px",
            px: "16px", height: "38px",
            display: "flex", alignItems: "center", gap: "7px",
            cursor: "pointer", "&:hover": { backgroundColor: "#f5f7fa" },
          }}>
            <Print sx={{ fontSize: "15px", color: "#374151" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 500, color: "#374151" }}>Print</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── TABLE ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: "24px", py: "16px" }}>
        <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "10px", overflow: "hidden" }}>
          <TableHeader allChecked={allChecked} onToggleAll={toggleAll} />
          {PATIENTS.map((patient) => (
            <TableRow
              key={patient.id}
              patient={patient}
              checked={selected.includes(patient.id)}
              onToggle={() => toggleRow(patient.id)}
            />
          ))}
        </Box>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{
        backgroundColor: "#f8fafc",
        px: "24px", py: "12px",
        borderTop: "1px solid #f0f2f5",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0,
      }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
          {PATIENTS.length} shortlisted
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
          {selected.length} selected
        </Typography>
      </Box>
    </Dialog>
  );
};

export default AppointmentShortlistModal;
