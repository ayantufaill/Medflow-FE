import { Box, Typography, TextField, Select, MenuItem } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { MedicalServicesOutlined as GeneralInfoIcon, MonitorWeightOutlined as WeightIcon, StraightenOutlined as HeightIcon } from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, standardFieldSx, roundedSelectMenuProps } from "../../constants/styles";

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

const unitSelectSx = {
  fontSize: fontSize.base,
  fontWeight: fontWeight.semibold,
  "&:before, &:after": { display: "none" },
  ml: 0.5,
};

const MedicalGeneralInfoCard = ({ generalInfo, onChangeField }) => {
  return (
    <SectionCard icon={GeneralInfoIcon} title="General Information">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2, mb: 2 }}>
        <FieldBox
          label="Reason for approval visit"
          value={generalInfo.purpose}
          onChange={(e) => onChangeField("purpose", e.target.value)}
        />
        <FieldBox
          label="Physician Name"
          value={generalInfo.physicianName}
          onChange={(e) => onChangeField("physicianName", e.target.value)}
        />
        <FieldBox
          label="Physician Specialty"
          value={generalInfo.physicianSpecialty}
          onChange={(e) => onChangeField("physicianSpecialty", e.target.value)}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography sx={fieldLabelSx}>Last Physical Exam</Typography>
          <DatePicker
            views={['year', 'month', 'day']}
            disableFuture
            value={generalInfo.lastExamDate ? dayjs(generalInfo.lastExamDate) : null}
            onChange={(newValue) => {
              onChangeField("lastExamDate", newValue ? newValue.format('YYYY-MM-DD') : '');
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
        <FieldBox
          label="Illness / Medical Issues"
          value={generalInfo.healthEstimate}
          onChange={(e) => onChangeField("healthEstimate", e.target.value)}
        />

        {/* Weight + Height share the third column's width, same as Physician
            Specialty above, instead of each wrapping onto its own full row. */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <WeightIcon sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />
              <Typography sx={fieldLabelSx}>Weight</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder={generalInfo.weightUnit === "KG" ? "72" : "160"}
                fullWidth
                value={generalInfo.weight || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9.]+$/.test(val)) {
                    onChangeField("weight", val);
                  }
                }}
                sx={{ ...standardFieldSx, minWidth: 0 }}
              />
              <TextField
                select
                SelectProps={{ MenuProps: roundedSelectMenuProps }}
                variant="outlined"
                size="small"
                value={generalInfo.weightUnit || "LBS"}
                onChange={(e) => onChangeField("weightUnit", e.target.value)}
                sx={{ ...standardFieldSx, width: 90 }}
              >
                <MenuItem value="LBS">LBS</MenuItem>
                <MenuItem value="KG">KG</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <HeightIcon sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />
              <Typography sx={fieldLabelSx}>Height</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder={generalInfo.heightUnit === "CM" ? "160" : "5'3"}
                fullWidth
                value={generalInfo.height || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9.,'" ]+$/.test(val)) {
                    onChangeField("height", val);
                  }
                }}
                sx={{ ...standardFieldSx, minWidth: 0 }}
              />
              <TextField
                select
                SelectProps={{ MenuProps: roundedSelectMenuProps }}
                variant="outlined"
                size="small"
                value={generalInfo.heightUnit || "FT/IN"}
                onChange={(e) => onChangeField("heightUnit", e.target.value)}
                sx={{ ...standardFieldSx, width: 90 }}
              >
                <MenuItem value="FT/IN">FT/IN</MenuItem>
                <MenuItem value="CM">CM</MenuItem>
              </TextField>
            </Box>
          </Box>
        </Box>
      </Box>
    </SectionCard>
  );
};

export default MedicalGeneralInfoCard;
