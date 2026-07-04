import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FieldBox, Label } from "./helpers";
import dayjs from "dayjs";
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
            views={['year', 'month', 'day']}
            disablePast
            slotProps={{
              popper: { sx: { zIndex: 1400 } },
              textField: {
                size: "small",
                sx: { width: "165px", "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", height: "40px" } },
              },
            }}
          />
        </LocalizationProvider>
      </FieldBox>

      <FieldBox label="Time" sx={{ flexShrink: 0, width: "135px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={dayjs().hour(amPm === "PM" ? (parseInt(timeHours)%12)+12 : parseInt(timeHours)%12).minute(parseInt(timeMins))}
            minTime={dayjs(apptDate).isSame(dayjs(), 'day') ? dayjs() : null}
            onChange={(v) => {
              if (v) {
                onTimeChange(v.format("hh"), v.format("mm"));
                onAmPmChange(v.format("A"));
              }
            }}
            slotProps={{
              popper: { sx: { zIndex: 1400 } },
              textField: {
                size: "small",
                sx: { "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", height: "40px" } },
              },
            }}
          />
        </LocalizationProvider>
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
