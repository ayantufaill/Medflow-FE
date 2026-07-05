import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FieldBox } from "./helpers";
import { providerLabel } from "./helpers";
import { STATUS_OPTIONS } from "./constants";
import DurationPicker from "./DurationPicker";
import ProviderTimesCard from "./ProviderTimesCard";
import ColorTagPicker from "./ColorTagPicker";

const AppointmentRightPanel = ({
  status, onStatusChange,
  durationMins, onDurationChange,
  providerRows, setProviderRows,
  preferredDentist, onPreferredDentistChange,
  preferredHygienist, onPreferredHygienistChange,
  notes, onNotesChange,
  selectedColorTags, onColorTagsChange,
  providers,
}) => (
  <Box sx={{ width: "30%", minWidth: "300px", flexShrink: 0, p: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>

    <FieldBox label="Appointment status">
      <Select
        size="small"
        fullWidth
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }}
      >
        {STATUS_OPTIONS.map((o) => (
          <MenuItem key={o.value} value={o.value} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{o.label}</MenuItem>
        ))}
      </Select>
    </FieldBox>

    <DurationPicker value={durationMins} onChange={onDurationChange} />

    <ProviderTimesCard providerRows={providerRows} setProviderRows={setProviderRows} providers={providers} />

    <FieldBox label="Patient's preferred dentist">
      <Select
        size="small" fullWidth displayEmpty
        value={preferredDentist}
        onChange={(e) => onPreferredDentistChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: preferredDentist ? "#09121f" : "#9aa3ae" }}
      >
        <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select dentist</MenuItem>
        {providers.map((p) => (
          <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{providerLabel(p)}</MenuItem>
        ))}
      </Select>
    </FieldBox>

    <FieldBox label="Patient's preferred hygienist">
      <Select
        size="small" fullWidth displayEmpty
        value={preferredHygienist}
        onChange={(e) => onPreferredHygienistChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: preferredHygienist ? "#09121f" : "#9aa3ae" }}
      >
        <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select hygienist</MenuItem>
        {providers.map((p) => (
          <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{providerLabel(p)}</MenuItem>
        ))}
      </Select>
    </FieldBox>

    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "4px" }}>
        <Box sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151" }}>Notes</Box>
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
          Show system notes
        </Typography>
      </Box>
      <TextField
        size="small" fullWidth multiline rows={3}
        placeholder="Add note / tags..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        sx={{ "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px" }, "& .MuiInputBase-input": { color: "#374151" } }}
      />
    </Box>

    <ColorTagPicker selected={selectedColorTags} onChange={onColorTagsChange} />
  </Box>
);

export default AppointmentRightPanel;
