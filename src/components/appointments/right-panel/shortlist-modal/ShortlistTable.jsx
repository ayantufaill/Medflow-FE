import { Box, Typography, Checkbox, IconButton } from "@mui/material";
import { Delete, KeyboardArrowDown } from "@mui/icons-material";
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
    <Cell col="check">
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
    <Cell col="actions" />
  </Box>
);

/* ── single data row ───────────────────────────────────────── */
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
        size="small"
        checked={checked}
        onChange={onToggle}
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

    <Cell col="actions">
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
          edit
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#0d9488", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
          +add to schedule
        </Typography>
        <IconButton size="small" sx={{ p: "2px", "&:hover": { backgroundColor: "#fef2f2" } }}>
          <Box component="img" src={DeleteIconImg} sx={{ width: "14px", height: "14px", objectFit: "contain" }} />
        </IconButton>
      </Box>
    </Cell>
  </Box>
);

/* ── table container ───────────────────────────────────────── */
const ShortlistTable = ({ patients, selected, onToggleAll, onToggleRow }) => {
  const allChecked = selected.length === patients.length;

  return (
    <Box sx={{ flex: 1, overflowY: "auto", px: "24px", py: "16px" }}>
      <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "10px", overflow: "hidden" }}>
        <TableHeader allChecked={allChecked} onToggleAll={onToggleAll} />
        {patients.map((patient) => (
          <TableRow
            key={patient.id}
            patient={patient}
            checked={selected.includes(patient.id)}
            onToggle={() => onToggleRow(patient.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ShortlistTable;
