import { Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { FieldBox } from "./helpers";
import { providerLabel } from "./helpers";
import { STATUS_OPTIONS } from "./constants";
import DurationPicker from "./DurationPicker";
import ProviderTimesCard from "./ProviderTimesCard";
import ColorTagPicker from "./ColorTagPicker";

const AppointmentRightPanel = ({
  branchId, onBranchChange, branches,
  status, onStatusChange,
  roomId, onRoomChange, rooms, isRoomOccupied,
  durationMins, onDurationChange,
  providerRows, setProviderRows, providerError,
  preferredDentist, onPreferredDentistChange,
  preferredHygienist, onPreferredHygienistChange,
  notes, onNotesChange,
  selectedColorTags, onColorTagsChange,
  providers,
  referredBy, onReferredByChange,
  noReminders, onNoRemindersChange,
  tags, onTagsChange,
  showExtendedOptions,
  readOnly,
}) => (
  <Box sx={{ width: "30%", minWidth: "300px", flexShrink: 0, p: "20px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: "18px", pointerEvents: readOnly ? 'none' : 'auto', opacity: readOnly ? 0.85 : 1 }}>

    <FieldBox label="Appointment status">
      <Select MenuProps={{ sx: { zIndex: 1400 } }}
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

    <FieldBox label="Branch">
      <Select MenuProps={{ sx: { zIndex: 1400 } }}
        size="small" fullWidth displayEmpty
        value={branchId || ""}
        onChange={(e) => onBranchChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: branchId ? "#09121f" : "#9aa3ae" }}
      >
        <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Not specified</MenuItem>
        {(branches || []).map((b) => (
          <MenuItem key={b.id} value={b.id} sx={{ fontFamily: "Inter", fontSize: "13px" }}>{b.name}</MenuItem>
        ))}
      </Select>
    </FieldBox>

    <FieldBox label="Operatory">
      <Select MenuProps={{ sx: { zIndex: 1400 } }}
        size="small" fullWidth displayEmpty
        value={roomId || ""}
        onChange={(e) => onRoomChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: roomId ? "#09121f" : "#9aa3ae" }}
      >
        <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select operatory</MenuItem>
        {(rooms || []).map((r) => {
          const roomVal = String(r._id || r.id || r.roomCode || r.title || r.name || "");
          return (
            <MenuItem key={roomVal} value={roomVal} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
              {r.name || r.title || r.roomCode || `Operatory ${r.id || ""}`}
            </MenuItem>
          );
        })}
      </Select>
      {isRoomOccupied && (
        <Typography sx={{ color: '#ef4444', fontSize: '12px', mt: '4px', fontFamily: 'Inter' }}>
          This operatory is occupied at the selected time.
        </Typography>
      )}
    </FieldBox>

    <DurationPicker value={durationMins} onChange={onDurationChange} />

    <ProviderTimesCard providerRows={providerRows} setProviderRows={setProviderRows} providers={providers} error={providerError} />

    <FieldBox label="Patient's preferred dentist">
      <Select MenuProps={{ sx: { zIndex: 1400 } }}
        size="small" fullWidth displayEmpty
        value={preferredDentist}
        onChange={(e) => onPreferredDentistChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: preferredDentist ? "#09121f" : "#9aa3ae" }}
      >
        <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select dentist</MenuItem>
        {providers.map((p) => {
          const providerId = String(p.ProvNum || p.providerId || p._id || p.id);
          return (
            <MenuItem key={providerId} value={providerId} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
              {providerLabel(p)}
            </MenuItem>
          );
        })}
      </Select>
    </FieldBox>

    <FieldBox label="Patient's preferred hygienist">
      <Select MenuProps={{ sx: { zIndex: 1400 } }}
        size="small" fullWidth displayEmpty
        value={preferredHygienist}
        onChange={(e) => onPreferredHygienistChange(e.target.value)}
        sx={{ fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", color: preferredHygienist ? "#09121f" : "#9aa3ae" }}
      >
        <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Select hygienist</MenuItem>
        {providers.map((p) => {
          const providerId = String(p.ProvNum || p.providerId || p._id || p.id);
          return (
            <MenuItem key={providerId} value={providerId} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
              {providerLabel(p)}
            </MenuItem>
          );
        })}
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
      {/* Extended fields — only visible when opened from PatientCard Book button */}
    {showExtendedOptions && (
      <>
        {/* Referred By */}
        <FieldBox label="Referred by">
          <TextField
            size="small" fullWidth
            placeholder="e.g. Google reviews."
            value={referredBy || ''}
            onChange={(e) => onReferredByChange && onReferredByChange(e.target.value)}
            sx={{ '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px' } }}
          />
        </FieldBox>

        {/* Reminder Preferences */}
        <Box>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, color: '#374151', mb: '6px' }}>Reminder Preferences</Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={!!noReminders}
                onChange={(e) => onNoRemindersChange && onNoRemindersChange(e.target.checked)}
                sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#2262ef' } }}
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151' }}>
                Don't send reminders for this appointment
              </Typography>
            }
          />
        </Box>
      </>
    )}

    <ColorTagPicker selected={selectedColorTags} onChange={onColorTagsChange} />
    </Box>
  </Box>
);

export default AppointmentRightPanel;
