import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FieldBox, Label } from "./helpers";
import PatientSearchField from "./PatientSearchField";
import ProcedureTagStrip from "./ProcedureTagStrip";
import ProcedureTable from "./ProcedureTable";

const AppointmentLeftPanel = ({
  // Patient
  patients, loadingPatients, patient, onPatientChange, onPatientSearch,
  // Date/time
  apptDate, onDateChange,
  timeHours, timeMins, amPm,
  onTimeChange, onAmPmChange,
  // Visit type
  visitType, onVisitTypeChange,
  // Procedure tags
  selectedTagLabels, onTagClick,
  addingProcedure, procedureInput,
  onProcedureInputChange, onAddingProcedureToggle, onSelectProcedure,
  // Procedure table
  procedures, setProcedures, providers,
}) => (
  <Box sx={{ flex: 1, p: "20px", overflowY: "auto", borderRight: "1px solid #e0e5eb", minWidth: 0 }}>

    {/* Patient / Date / Time row */}
    <Box sx={{ display: "flex", gap: "12px", mb: "20px", alignItems: "flex-end" }}>
      <PatientSearchField
        patients={patients}
        loadingPatients={loadingPatients}
        value={patient}
        onChange={onPatientChange}
        onSearch={onPatientSearch}
      />

      <FieldBox label="Date" sx={{ width: "165px", flexShrink: 0 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={apptDate}
            onChange={(v) => v && onDateChange(v)}
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "165px", "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", height: "40px" } },
              },
            }}
          />
        </LocalizationProvider>
      </FieldBox>

      <FieldBox label="Time" sx={{ flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "8px", overflow: "hidden", height: "40px" }}>
          <AccessTime sx={{ fontSize: "16px", color: "#9aa3ae", ml: "10px", mr: "4px", flexShrink: 0 }} />
          <input
            value={`${timeHours}:${timeMins}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":");
              onTimeChange(h?.slice(0, 2) ?? timeHours, m?.slice(0, 2) ?? timeMins);
            }}
            style={{ border: "none", outline: "none", width: "60px", fontFamily: "Inter", fontSize: "13px", color: "#09121f", background: "transparent" }}
          />
          {["AM", "PM"].map((p) => (
            <Box
              key={p}
              onClick={() => onAmPmChange(p)}
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
      <RadioGroup row value={visitType} onChange={(e) => onVisitTypeChange(e.target.value)} sx={{ gap: "8px" }}>
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
    <ProcedureTagStrip
      selectedTagLabels={selectedTagLabels}
      onTagClick={onTagClick}
      addingProcedure={addingProcedure}
      procedureInput={procedureInput}
      onProcedureInputChange={onProcedureInputChange}
      onAddingProcedureToggle={onAddingProcedureToggle}
      onSelectProcedure={onSelectProcedure}
    />

    {/* Procedure table */}
    <ProcedureTable procedures={procedures} setProcedures={setProcedures} providers={providers} />

    {/* Recare hint */}
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
);

export default AppointmentLeftPanel;
