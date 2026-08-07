// http://localhost:5173/patients/details/16 => PatientDetailPage

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  MenuItem,
} from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { formatDate } from "./utils";
import { InlineFieldRow, standardFieldSx, labelWidth } from "./InlineField";
import {
  labelSx,
  fontSize,
  fontWeight,
  roundedSelectMenuProps,
} from "../../constants/styles";
import { COLORS } from "../../constants/colors";

// Radio option text (Male/Female, Male/Man/Female/Woman) had no fontFamily/size set,
// so it fell back to the theme default (Manrope, 1rem) instead of matching the
// Inter/12px value text used everywhere else on this page.
const radioLabelTypographySx = {
  fontFamily: "Inter",
  fontSize: fontSize.base,
  fontWeight: fontWeight.regular,
};

/**
 * Patient Details: demographics with underlined input style.
 * Label left, input right; radio groups for Sex at Birth and Gender Identity.
 */
export default function PatientDetailsSection({
  patient,
  isEditMode = false,
  onPatientDataChange,
}) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});

  // Update local data when patient prop changes
  useEffect(() => {
    if (patient) {
      console.log("📥 PatientDetailsSection received patient:", patient);
      setLocalPatientData(patient);
    }
  }, [patient]);

  const handleFieldChange = (field, value) => {
    // Convert date strings to ISO format for consistency
    let processedValue = value;
    if ((field === "dateOfBirth" || field === "lastVisitDate") && value) {
      try {
        // HTML5 date input returns YYYY-MM-DD, convert to ISO datetime at noon UTC
        const [year, month, day] = value.split("-");
        const date = new Date(
          Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            12,
            0,
            0,
          ),
        );
        if (!isNaN(date.getTime())) {
          processedValue = date.toISOString();
        }
      } catch (error) {
        console.error("Date conversion error:", error);
        processedValue = value; // Keep original if conversion fails
      }
    }

    const updatedData = { ...localPatientData, [field]: processedValue };
    setLocalPatientData(updatedData);
    if (onPatientDataChange) {
      onPatientDataChange(updatedData);
    }
  };

  const sexAtBirth =
    localPatientData?.sexAtBirth?.toLowerCase?.() ||
    localPatientData?.gender?.toLowerCase?.() ||
    "";
  const genderIdentity =
    localPatientData?.genderIdentity?.toLowerCase?.() ||
    localPatientData?.gender?.toLowerCase?.() ||
    "";
  const titleOptions = ["Mr.", "Mrs.", "Ms.", "Mx.", "Dr."];

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {isEditMode ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              py: 0.75,
            }}
          >
            <Typography
              component="label"
              sx={{
                fontFamily: "Inter",
                fontSize: fontSize.xs,
                fontWeight: fontWeight.semibold,
                color: COLORS.TEXT_SECONDARY,
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              Title
            </Typography>
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              value={localPatientData?.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              sx={standardFieldSx}
              SelectProps={{
                MenuProps: roundedSelectMenuProps,
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {titleOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        ) : (
          <InlineFieldRow
            label="Title"
            value={localPatientData?.title || ""}
            placeholder=""
            InputProps={{ readOnly: true }}
          />
        )}
        <InlineFieldRow
          label="First Name"
          value={localPatientData?.firstName || ""}
          placeholder="First name"
          onChange={(e) => handleFieldChange("firstName", e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
          required={isEditMode}
        />
        <InlineFieldRow
          label="Middle Name"
          value={localPatientData?.middleName || ""}
          placeholder="Middle name"
          onChange={(e) => handleFieldChange("middleName", e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Last Name"
          value={localPatientData?.lastName || ""}
          placeholder="Last name"
          onChange={(e) => handleFieldChange("lastName", e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
          required={isEditMode}
        />
        <InlineFieldRow
          label="Preferred Name"
          value={localPatientData?.preferredName || ""}
          placeholder="Preferred name"
          onChange={(e) => handleFieldChange("preferredName", e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />

        {isEditMode ? (
          <InlineFieldRow
            label="Date of Birth"
            required={true}
            input={
              <DatePicker
                views={["year", "month", "day"]}
                disableFuture
                minDate={dayjs().subtract(150, "year")}
                value={
                  localPatientData?.dateOfBirth
                    ? dayjs(localPatientData.dateOfBirth)
                    : null
                }
                onChange={(newValue) => {
                  handleFieldChange(
                    "dateOfBirth",
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                  );
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: standardFieldSx,
                  },
                }}
              />
            }
          />
        ) : (
          <InlineFieldRow
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            input={
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={formatDate(patient?.dateOfBirth) || ""}
                placeholder="MM/DD/YYYY"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        color: "action.active",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 20 }} />
                    </Box>
                  ),
                }}
                sx={standardFieldSx}
              />
            }
          />
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `${labelWidth}px 1fr`,
            gap: 1,
            alignItems: "center",
            py: 0.75,
            minHeight: 36,
          }}
        >
          <Typography sx={{ ...labelSx, fontFamily: "Inter" }}>
            Sex at Birth:
            {isEditMode && (
              <Box
                component="span"
                sx={{ color: COLORS.ACCENT, ml: 0.5, fontWeight: "bold" }}
              >
                *
              </Box>
            )}
          </Typography>
          <FormControl component="fieldset" sx={{ minWidth: 0 }}>
            <RadioGroup
              row
              value={
                ["male", "female", "intersex"].includes(sexAtBirth)
                  ? sexAtBirth
                  : ""
              }
              onChange={(e) => handleFieldChange("sexAtBirth", e.target.value)}
              disabled={!isEditMode}
            >
              <FormControlLabel
                value="male"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Male"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="female"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Female"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="intersex"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Intersex"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `${labelWidth}px 1fr`,
            gap: 1,
            alignItems: "flex-start",
            py: 0.75,
            minHeight: 36,
          }}
        >
          <Typography sx={{ ...labelSx, fontFamily: "Inter", pt: 0.5 }}>
            Gender Identity:
          </Typography>
          <FormControl component="fieldset" sx={{ minWidth: 0 }}>
            <RadioGroup
              row
              value={
                ["male", "female", "non_binary", "prefer_not_to_say"].includes(
                  genderIdentity,
                )
                  ? genderIdentity
                  : ""
              }
              onChange={(e) =>
                handleFieldChange("genderIdentity", e.target.value)
              }
              disabled={!isEditMode}
            >
              <FormControlLabel
                value="male"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Male/Man"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="female"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Female/Woman"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="non_binary"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Non-binary"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="prefer_not_to_say"
                control={<Radio size="small" sx={{ color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
                label="Prefer not to say"
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <InlineFieldRow
          label="Social Security Number"
          value={
            localPatientData?.ssn
              ? String(localPatientData.ssn).replace(
                  /(\d{3})(\d{2})(\d{4})/,
                  "$1-$2-$3",
                )
              : ""
          }
          placeholder="xxx-xx-xxxx"
          onChange={(e) =>
            handleFieldChange("ssn", e.target.value.replace(/[^0-9]/g, ""))
          }
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>
    </Box>
  );
}
