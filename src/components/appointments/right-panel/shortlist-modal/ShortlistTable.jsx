import { Box, Typography, Checkbox, IconButton } from "@mui/material";
import { Delete, KeyboardArrowDown } from "@mui/icons-material";
import { useDraggable } from "@dnd-kit/core";
import dayjs from "dayjs";
import { useDropdownData } from "../../../../hooks/redux";
import { Cell, ColLabel, ProcChip } from "./helpers";
import DeleteIconImg from "../../../../assets/operatory icons/delete.png";

/* ── table header row ──────────────────────────────────────── */
const TableHeader = ({ allChecked, onToggleAll }) => (
  <Box sx={{
    display: "flex", alignItems: "center",
    px: "14px", py: "10px",
    backgroundColor: "#fafbfc",
    borderBottom: "1px solid #e0e5eb",
  }}>
    <Cell col="check" sx={{ "@media print": { display: "none" } }}>
      <Checkbox
        size="small"
        checked={allChecked}
        onChange={onToggleAll}
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
    <Cell col="actions" sx={{ "@media print": { display: "none" } }} />
  </Box>
);

/* ── single data row ───────────────────────────────────────── */
const TableRow = ({ patient, checked, onToggle, providersList = [], onDelete }) => {
  const name = patient.PatientName || patient.patientName || patient.name || `Patient #${patient.PatNum || ''}`;
  
  // Find provider initials
  const rawProv = patient.ProvNum || patient.providerId || patient.providers;
  let providerStr = "-";
  if (rawProv) {
    const provObj = providersList.find(p => String(p.id || p._id) === String(rawProv));
    if (provObj) {
      const pName = provObj.providerName || provObj.name || 
        `${provObj.userId?.firstName || provObj.firstName || ''} ${provObj.userId?.lastName || provObj.lastName || ''}`.trim();
      providerStr = pName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || String(rawProv);
    } else {
      providerStr = String(rawProv);
    }
  }

  const durationMins = patient.DurationMins || patient.durationMinutes || patient.duration;
  const duration = durationMins ? `${durationMins} mins` : "-";
  const apptDate = patient.AppointmentDate || patient.appointmentDate;
  const startTime = patient.StartTime || patient.startTime;
  
  const rawPrefDay = patient.PreferredDay || patient.prefDay || "Any";
  const prefDay = apptDate ? dayjs(apptDate).format("ddd") : (rawPrefDay !== "Any" ? rawPrefDay.substring(0, 3) : "Any");
  const prefTime = startTime || patient.PreferredTime || patient.prefTime || "Any";
  
  let procs = [];
  const customFields = patient.CustomFields || patient.customFields || {};
  if (customFields.procedures && customFields.procedures.length > 0) {
    procs = customFields.procedures.map(p => p.treatment || p.code || p);
  } else if (customFields.procedureTags && customFields.procedureTags.length > 0) {
    procs = customFields.procedureTags.map(p => p.label);
  } else if (patient.procedures) {
    procs = patient.procedures;
  } else if (typeof patient.Procedures === 'string') {
    try { procs = JSON.parse(patient.Procedures); } catch (e) { procs = []; }
  } else if (Array.isArray(patient.Procedures)) {
    procs = patient.Procedures;
  }

  const note = patient.Notes || patient.notes || patient.note || "-";
  const aptDate = apptDate || patient.aptDate || "-";
  const nextAptDate = patient.nextAptDate || "-";

  return (
    <Box 
      sx={{
      display: "flex", alignItems: "center",
      px: "14px", py: "12px",
      borderBottom: "1px solid #f0f2f5",
      "&:last-child": { borderBottom: "none" },
      "&:hover": { backgroundColor: "#fafbfc" },
    }}>
      <Cell col="check" sx={{ "@media print": { display: "none" } }}>
        <Checkbox
          size="small"
          checked={checked}
          onChange={onToggle}
          sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }}
        />
      </Cell>

      <Cell col="name">
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f" }}>
          {name}
        </Typography>
      </Cell>

      <Cell col="provider">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{providerStr}</Typography>
      </Cell>

      <Cell col="duration">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{duration}</Typography>
      </Cell>

      <Cell col="prefDay">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{prefDay}</Typography>
      </Cell>

      <Cell col="prefTime">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{prefTime}</Typography>
      </Cell>

      <Cell col="procs">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {procs.map((p, i) => <ProcChip key={i} label={typeof p === 'string' ? p : (p?.label || p?.code || p)} />)}
        </Box>
      </Cell>

      <Cell col="note">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{note}</Typography>
      </Cell>

      <Cell col="aptDate">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{aptDate}</Typography>
      </Cell>

      <Cell col="nextApt">
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{nextAptDate}</Typography>
      </Cell>

      <Cell col="actions" sx={{ "@media print": { display: "none" } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography 
            onClick={() => window.dispatchEvent(new CustomEvent('edit-shortlist-item', { detail: patient }))}
            sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          >
            edit
          </Typography>
          <Typography 
            onClick={() => window.dispatchEvent(new CustomEvent('add-shortlist-to-schedule', { detail: patient }))}
            sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0d9488", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          >
            +add to schedule
          </Typography>
          <IconButton onClick={() => onDelete(patient._id || patient.id || patient.ShortlistNum || patient.PatNum)} size="small" sx={{ p: "2px", "&:hover": { backgroundColor: "#fef2f2" } }}>
            <Box component="img" src={DeleteIconImg} sx={{ width: "14px", height: "14px", objectFit: "contain" }} />
          </IconButton>
        </Box>
      </Cell>
    </Box>
  );
};

/* ── table container ───────────────────────────────────────── */
const ShortlistTable = ({ patients, selected, onToggleAll, onToggleRow, onDelete }) => {
  const allChecked = selected.length === patients.length;
  const { providers: providersList } = useDropdownData({ providers: true });

  return (
    <Box sx={{ flex: 1, overflowY: "auto", px: "24px", py: "16px" }}>
      <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "10px", overflow: "hidden" }}>
        <TableHeader allChecked={allChecked} onToggleAll={onToggleAll} />
        {patients.map((patient) => (
          <TableRow
            key={patient.ShortlistNum || patient.id}
            patient={patient}
            checked={selected.includes(patient.ShortlistNum || patient.id)}
            onToggle={() => onToggleRow(patient.ShortlistNum || patient.id)}
            providersList={providersList}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ShortlistTable;
