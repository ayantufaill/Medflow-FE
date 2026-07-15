import { Box, Typography, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { MedicalServicesOutlined as GeneralInfoIcon } from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, standardFieldSx } from "../../constants/styles";

const fieldLabelSx = {
  fontFamily: "Inter",
  fontSize: fontSize.xs,
  fontWeight: fontWeight.semibold,
  color: COLORS.TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const FieldBox = ({ label, value, onChange }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <Typography sx={fieldLabelSx}>{label}</Typography>
    <TextField variant="outlined" size="small" fullWidth value={value || ""} onChange={onChange} sx={standardFieldSx} />
  </Box>
);

const DateFieldBox = ({ label, value, onChange }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <Typography sx={fieldLabelSx}>{label}</Typography>
    <DatePicker
      views={['year', 'month', 'day']}
      disableFuture
      value={value ? dayjs(value) : null}
      onChange={(newValue) => {
        onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
      }}
      slotProps={{
        textField: {
          size: 'small',
          fullWidth: true,
          sx: standardFieldSx,
        }
      }}
    />
  </Box>
);

const FREQUENCY_OPTIONS = [
  { value: "3mo", label: "3 Mo" },
  { value: "6mo", label: "6 Mo" },
  { value: "9mo", label: "9 Mo" },
  { value: "12mo", label: "12 Mo" },
  { value: "not", label: "Not routinely" },
];

const FrequencyPill = ({ active, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      px: 2,
      py: 0.75,
      borderRadius: 999,
      border: `1px solid ${active ? COLORS.ACCENT : COLORS.BORDER}`,
      backgroundColor: active ? COLORS.ACCENT_BG : COLORS.SURFACE_CARD,
      cursor: "pointer",
    }}
  >
    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.medium, color: active ? COLORS.ACCENT : COLORS.TEXT_BODY }}>
      {label}
    </Typography>
  </Box>
);

const DentalGeneralInfo = ({ info, onChange }) => {
  return (
    <SectionCard icon={GeneralInfoIcon} title="General Information">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
        <FieldBox
          label="How would you rate the condition of your mouth?"
          value={info.mouthCondition}
          onChange={(e) => onChange("mouthCondition", e.target.value)}
        />
        <FieldBox
          label="How long have you been a patient?"
          value={info.patientSince}
          onChange={(e) => onChange("patientSince", e.target.value)}
        />

        <FieldBox
          label="Previous Dentist"
          value={info.previousDentist}
          onChange={(e) => onChange("previousDentist", e.target.value)}
        />
        <DateFieldBox
          label="Date of most recent X-rays"
          value={info.recentXrayDate}
          onChange={(val) => onChange("recentXrayDate", val)}
        />

        <DateFieldBox
          label="Date of most recent dental exam"
          value={info.recentExamDate}
          onChange={(val) => onChange("recentExamDate", val)}
        />
        <DateFieldBox
          label="Date of most recent treatment (other than cleaning)"
          value={info.recentTreatmentDate}
          onChange={(val) => onChange("recentTreatmentDate", val)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ ...fieldLabelSx, mb: 1 }}>I routinely see my dentist every</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {FREQUENCY_OPTIONS.map((option) => (
            <FrequencyPill
              key={option.value}
              label={option.label}
              active={(info.dentistVisitFrequency || "") === option.value}
              onClick={() => onChange("dentistVisitFrequency", option.value)}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ border: "1px solid rgba(234, 88, 12, 0.25)", backgroundColor: "rgba(234, 88, 12, 0.06)", borderRadius: 2, px: 2, py: 1.5 }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.STATUS_WARNING, textTransform: "uppercase", letterSpacing: "0.3px", mb: 0.5 }}>
          What is your immediate concern?
        </Typography>
        <TextField
          variant="standard"
          fullWidth
          value={info.immediateConcern || ""}
          onChange={(e) => onChange("immediateConcern", e.target.value)}
          InputProps={{ disableUnderline: true, sx: { fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY } }}
        />
      </Box>
    </SectionCard>
  );
};

export default DentalGeneralInfo;
