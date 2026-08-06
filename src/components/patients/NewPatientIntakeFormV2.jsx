import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  Typography,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import SectionCard from "../shared/SectionCard";
import FormField from "./form-components/FormField";
import FormFieldsGrid from "./form-components/FormFieldsGrid";
import AddressFieldsSection from "./form-components/AddressFieldsSection";
import ColoredChipCheckbox from "./form-components/ColoredChipCheckbox";
import {
  OutlinedInput,
  OutlinedSelect,
  CustomRadioGroup,
  FieldDivider,
} from "./form-components/formInputs";
import {
  trimValue,
  normalizePhone,
  formatSSNInput,
  formatDateValue,
  removeEmptyCustomFields,
} from "./form-components/formatters";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

import { patientService } from "../../services/patient.service";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
  selectProviderDropdownLoading,
} from "../../store/slices/providerSlice";

const REFERRING_SOURCE_OPTIONS = [
  "Google",
  "Website",
  "Walk In",
  "Social Media",
  "Existing Patient",
  "Insurance Directory",
  "Provider Referral",
];

// The app's global theme (theme.js) defaults to Manrope, but every redesigned
// page (PatientsListPage, the schedule module, etc.) explicitly renders in
// Inter instead. Rather than repeating `fontFamily: "Inter"` on every single
// Typography/TextField in this large form, nest a theme override for this
// subtree — MUI components pull their font from theme.typography.fontFamily,
// so this cascades correctly everywhere without per-element overrides.
const withInterFont = (outerTheme) =>
  createTheme(outerTheme, {
    typography: { fontFamily: '"Inter", "Manrope", sans-serif' },
  });

const DEFAULT_VALUES = {
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  dateOfBirth: null,
  sexAtBirth: "",
  genderIdentity: "",
  ssn: "",
  preferredDentistId: "",
  preferredHygienistId: "",
  mobileNumber: "",
  homePhoneNumber: "",
  patientCountry: "United States",
  patientAddressLine1: "",
  patientAddressLine2: "",
  patientCity: "",
  patientState: "",
  patientPostalCode: "",
  emailAddress: "",
  maritalStatus: "",
  occupation: "",
  guardianEmployer: "",
  workCountry: "United States",
  workAddressLine1: "",
  workAddressLine2: "",
  workCity: "",
  workState: "",
  workPostalCode: "",
  workPhoneNumber: "",
  spouseFirstName: "",
  spouseMiddleName: "",
  spouseLastName: "",
  spouseOccupation: "",
  spouseEmployer: "",
  spouseCountry: "United States",
  spouseAddressLine1: "",
  spouseAddressLine2: "",
  spouseCity: "",
  spouseState: "",
  spousePostalCode: "",
  spouseWorkPhoneNumber: "",
  spouseEmailAddress: "",
  emergencyContactName: "",
  emergencyRelationship: "",
  emergencyHomePhone: "",
  emergencyWorkPhone: "",
  emergencyMobilePhone: "",
  contactByPhone: false,
  leaveVoicemailAtHome: false,
  agreeElectronicCommunications: false,
  agreeSmsMessages: false,
  pauseScheduleGapFillsReminders: false,
  pauseArAutomationReminders: false,
  referringSources: "",
  referringPatient: "",
  releaseSpouse: false,
  releaseChildren: false,
  releaseParents: false,
  releaseOther: "",
  reminderPreference: "",
  stopReminderAfterConfirmation: false,
  dontRequestReview: false,
  assignmentRelease: "",
  photographyRelease: "",
  socialMediaRelease: "",
  sendWelcome: false,
  sendWelcomeMethod: "",
  newPatient: false,
};

// ─── Field configs consumed by <FormFieldsGrid> ──────────────────────────────
// Each SectionCard's plain text/select/phone fields are declared here instead
// of hand-written as repeated Grid+FormField+Input JSX. Fields with side
// effects on other fields (date picker, radio groups, autocompletes, address
// blocks) are NOT declared here — they stay as explicit JSX in the section
// that needs them; see the render below.

const PATIENT_NAME_FIELDS = [
  {
    name: "title",
    label: "Title",
    type: "select",
    gridSize: { xs: 12, sm: 3 },
    options: [
      { value: "", label: "-" },
      { value: "mr", label: "Mr." },
      { value: "ms", label: "Ms." },
      { value: "mrs", label: "Mrs." },
    ],
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: "First name is required",
    placeholder: "First name",
    gridSize: { xs: 12, sm: 3 },
  },
  {
    name: "middleName",
    label: "Middle Name",
    type: "text",
    placeholder: "Middle name",
    gridSize: { xs: 12, sm: 3 },
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: "Last name is required",
    placeholder: "Last name",
    gridSize: { xs: 12, sm: 3 },
  },
];
const PATIENT_PREFERRED_NAME_FIELD = [
  {
    name: "preferredName",
    label: "Preferred Name",
    type: "text",
    placeholder: "Name patient goes by",
    gridSize: { xs: 12, sm: 4 },
  },
];
// SSN previously lost the formatted value entirely — see formatters.js's
// withFormattedOnChange for why — now fixed via the `formatter` option.
const PATIENT_SSN_FIELD = [
  {
    name: "ssn",
    label: "Social Security Number",
    type: "text",
    placeholder: "XXX-XX-XXXX",
    formatter: formatSSNInput,
    gridSize: { xs: 12, sm: 4 },
  },
];

const CONTACT_FIELDS = [
  {
    name: "mobileNumber",
    label: "Mobile Number",
    type: "phone",
    required: "Mobile number is required",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "homePhoneNumber",
    label: "Home Phone Number",
    type: "phone",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "emailAddress",
    label: "Email Address",
    type: "text",
    placeholder: "patient@email.com",
    gridSize: { xs: 12, sm: 4 },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
];

const ADDITIONAL_INFO_FIELDS = [
  {
    name: "occupation",
    label: "Occupation",
    type: "text",
    placeholder: "Patient's occupation",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "guardianEmployer",
    label: "Patient's / Guardian's Employer",
    type: "text",
    placeholder: "Employer name",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "workPhoneNumber",
    label: "Work Phone Number",
    type: "phone",
    gridSize: { xs: 12, sm: 4 },
  },
];

// A function (not a static array) because every field needs the same
// `disabled: isSingle` — built once per render in the component body.
const spouseNameFields = (disabled) => [
  {
    name: "spouseFirstName",
    label: "First Name",
    type: "text",
    placeholder: "First name",
    disabled,
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "spouseMiddleName",
    label: "Middle Name",
    type: "text",
    placeholder: "Middle name",
    disabled,
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "spouseLastName",
    label: "Last Name",
    type: "text",
    placeholder: "Last name",
    disabled,
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "spouseOccupation",
    label: "Occupation",
    type: "text",
    placeholder: "Spouse's occupation",
    disabled,
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "spouseEmployer",
    label: "Employer",
    type: "text",
    placeholder: "Employer name",
    disabled,
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "spouseWorkPhoneNumber",
    label: "Work Phone Number",
    type: "phone",
    disabled,
    gridSize: { xs: 12, sm: 4 },
  },
];
const spouseEmailField = (disabled) => [
  {
    name: "spouseEmailAddress",
    label: "Email Address",
    type: "text",
    placeholder: "spouse@email.com",
    disabled,
    gridSize: { xs: 12, sm: 4 },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
];

const EMERGENCY_CONTACT_FIELDS = [
  {
    name: "emergencyContactName",
    label: "Full Name",
    type: "text",
    required: "Emergency contact name is required",
    placeholder: "Contact full name",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "emergencyRelationship",
    label: "Relationship",
    type: "select",
    gridSize: { xs: 12, sm: 4 },
    options: [
      { value: "", label: "Select relationship" },
      ...["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"].map(
        (r) => ({ value: r, label: r }),
      ),
    ],
  },
  {
    name: "emergencyHomePhone",
    label: "Home Phone",
    type: "phone",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "emergencyWorkPhone",
    label: "Work Phone",
    type: "phone",
    gridSize: { xs: 12, sm: 4 },
  },
  {
    name: "emergencyMobilePhone",
    label: "Mobile Number",
    type: "phone",
    gridSize: { xs: 12, sm: 4 },
  },
];

const REFERRING_SOURCE_FIELD = [
  {
    name: "referringSources",
    label: "Referring Source",
    type: "select",
    gridSize: { xs: 12, sm: 4 },
    options: [
      { value: "", label: "Select source" },
      ...REFERRING_SOURCE_OPTIONS.map((o) => ({ value: o, label: o })),
    ],
  },
];

const providerLabel = (provider) => {
  if (provider?.userId?.firstName || provider?.userId?.lastName) {
    return `${provider.userId?.firstName || ""} ${provider.userId?.lastName || ""}`.trim();
  }
  return (
    `${provider?.firstName || ""} ${provider?.lastName || ""}`.trim() ||
    provider?.name ||
    "Unknown"
  );
};

const patientLabel = (patient) => {
  if (!patient) return "";
  if (typeof patient === "string") return patient;
  const fullName =
    `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
  return patient.patientCode
    ? `${fullName} (${patient.patientCode})`
    : fullName;
};

const NewPatientIntakeFormV2 = ({ onSubmit, loading = false, onCancel }) => {
  const dispatch = useDispatch();
  const providers = useSelector(selectProviderDropdownList);
  const providersLoading = useSelector(selectProviderDropdownLoading);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientSearchText, setPatientSearchText] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: DEFAULT_VALUES });

  const maritalStatus = watch("maritalStatus");
  const isSingle = maritalStatus === "single";
  const referringSources = watch("referringSources");
  const isReferringPatientEnabled =
    referringSources === "Walk In" || referringSources === "Existing Patient";
  const sendWelcome = watch("sendWelcome");

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        setPatientsLoading(true);
        const result = await patientService.getAllPatients(
          1,
          20,
          patientSearchText,
          "active",
        );
        if (!isMounted) return;
        setPatients(result?.patients || result?.items || []);
      } catch {
        if (!isMounted) return;
        setPatients([]);
      } finally {
        if (isMounted) setPatientsLoading(false);
      }
    }, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [patientSearchText]);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const providerOptions = useMemo(
    () =>
      providers.map((p) => ({ value: p._id || p.id, label: providerLabel(p) })),
    [providers],
  );

  const handleFormSubmit = (values) => {
    const customFields = removeEmptyCustomFields({
      workCountry: trimValue(values.workCountry),
      workAddressLine1: trimValue(values.workAddressLine1),
      workAddressLine2: trimValue(values.workAddressLine2),
      workCity: trimValue(values.workCity),
      workState: trimValue(values.workState),
      workPostalCode: trimValue(values.workPostalCode),
      workPhoneNumber: trimValue(values.workPhoneNumber),
      spouseFirstName: trimValue(values.spouseFirstName),
      spouseMiddleName: trimValue(values.spouseMiddleName),
      spouseLastName: trimValue(values.spouseLastName),
      spouseOccupation: trimValue(values.spouseOccupation),
      spouseEmployer: trimValue(values.spouseEmployer),
      spouseCountry: trimValue(values.spouseCountry),
      spouseAddressLine1: trimValue(values.spouseAddressLine1),
      spouseAddressLine2: trimValue(values.spouseAddressLine2),
      spouseCity: trimValue(values.spouseCity),
      spouseState: trimValue(values.spouseState),
      spousePostalCode: trimValue(values.spousePostalCode),
      spouseWorkPhoneNumber: trimValue(values.spouseWorkPhoneNumber),
      spouseEmailAddress: trimValue(values.spouseEmailAddress),
      communicationContactByPhone: values.contactByPhone,
      communicationLeaveVoicemailAtHome: values.leaveVoicemailAtHome,
      communicationAgreeElectronicCommunications:
        values.agreeElectronicCommunications,
      communicationAgreeSmsMessages: values.agreeSmsMessages,
      communicationPauseScheduleGapFillsReminders:
        values.pauseScheduleGapFillsReminders,
      communicationPauseArAutomationReminders:
        values.pauseArAutomationReminders,
      newPatient: values.newPatient,
      referringSources: values.referringSources,
      referringPatient: trimValue(values.referringPatient),
      releaseSpouse: values.releaseSpouse,
      releaseChildren: values.releaseChildren,
      releaseParents: values.releaseParents,
      releaseOther: trimValue(values.releaseOther),
      reminderPreference: values.reminderPreference,
      stopReminderAfterConfirmation: values.stopReminderAfterConfirmation,
      dontRequestReview: values.dontRequestReview,
      sendWelcome: values.sendWelcome,
      sendWelcomeMethod: values.sendWelcome ? values.sendWelcomeMethod : "",
    });

    const address = removeEmptyCustomFields({
      line1: trimValue(values.patientAddressLine1) || "",
      line2: trimValue(values.patientAddressLine2) || "",
      city: trimValue(values.patientCity) || "",
      state: trimValue(values.patientState) || "",
      postalCode: trimValue(values.patientPostalCode) || "",
    });
    const emergencyContact = removeEmptyCustomFields({
      name: trimValue(values.emergencyContactName) || "",
      relationship: trimValue(values.emergencyRelationship) || "",
      phone: normalizePhone(
        values.emergencyMobilePhone ||
          values.emergencyHomePhone ||
          values.emergencyWorkPhone,
      ),
    });
    const spouseInfo = removeEmptyCustomFields({
      name:
        trimValue(values.spouseFirstName) +
        " " +
        trimValue(values.spouseLastName),
      phone: normalizePhone(values.spouseWorkPhoneNumber) || "",
      email: trimValue(values.spouseEmailAddress) || "",
    });

    const payload = removeEmptyCustomFields({
      firstName: trimValue(values.firstName),
      lastName: trimValue(values.lastName),
      middleName: trimValue(values.middleName) || "",
      preferredName: trimValue(values.preferredName) || "",
      dateOfBirth: formatDateValue(values.dateOfBirth),
      gender: (() => {
        const g = values.genderIdentity || values.sexAtBirth || "";
        return g === "intersex" ? "unknown" : g;
      })(),
      ssn: (values.ssn || "").replace(/\D/g, ""),
      phonePrimary: normalizePhone(
        values.mobileNumber || values.homePhoneNumber,
      ),
      phoneSecondary: normalizePhone(
        values.homePhoneNumber || values.workPhoneNumber,
      ),
      email: trimValue(values.emailAddress) || "",
      preferredLanguage: "en",
      communicationPreference: (() => {
        const prefs = [];
        if (values.contactByPhone) prefs.push("phone");
        if (values.agreeSmsMessages || values.sendWelcomeMethod === "text")
          prefs.push("sms");
        if (values.agreeElectronicCommunications) prefs.push("email");
        return prefs.length > 0 ? prefs : [];
      })(),
      portalAccessEnabled: false,
      referralSource:
        values.referringSources || trimValue(values.referringPatient) || "",
      isActive: true,
      address: Object.keys(address).length ? address : undefined,
      emergencyContact: Object.keys(emergencyContact).length
        ? emergencyContact
        : undefined,
      spouseInfo: Object.keys(spouseInfo).length ? spouseInfo : undefined,
      title: trimValue(values.title),
      sexAtBirth: values.sexAtBirth,
      genderIdentity: values.genderIdentity,
      preferredDentistId:
        values.preferredDentistId === "null" ? "" : values.preferredDentistId,
      preferredHygienistId:
        values.preferredHygienistId === "null"
          ? ""
          : values.preferredHygienistId,
      maritalStatus: values.maritalStatus,
      occupation: trimValue(values.occupation),
      employer: trimValue(values.employer) || trimValue(values.spouseEmployer),
      guardianEmployer: trimValue(values.guardianEmployer),
      customFields: Object.keys(customFields).length ? customFields : undefined,
      assignmentAndRelease: removeEmptyCustomFields({
        assignmentRelease: values.assignmentRelease,
        photographyRelease: values.photographyRelease,
        socialMediaRelease: values.socialMediaRelease,
        aiRelease: values.aiRelease,
      }),
    });
    onSubmit(payload);
  };

  return (
    <ThemeProvider theme={withInterFont}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ backgroundColor: COLORS.SURFACE_PAGE, minHeight: "100%" }}
        >
          {/* Page Header — sits directly under the app's main header. Three
            flex sections: breadcrumb (left), Assign Care Team (center),
            bookmark/Cancel/Save (right). */}
          <Box
            sx={{
              px: 4,
              py: 2,
              margin: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              borderRadius: "12px",
              backgroundColor: COLORS.SURFACE_CARD,
              borderBottom: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: COLORS.ACCENT,
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.semibold,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={onCancel}
              >
                Patients
              </Typography>
              <Typography
                sx={{ color: COLORS.TEXT_MUTED, fontSize: fontSize.base }}
              >
                /
              </Typography>
              <Typography
                sx={{
                  color: COLORS.TEXT_PRIMARY,
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.semibold,
                  textTransform: "uppercase",
                }}
              >
                Add New Patient
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: COLORS.ACCENT,
                  fontWeight: fontWeight.semibold,
                  fontSize: fontSize.base,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                <PeopleAltOutlinedIcon fontSize="small" /> Assign Care Team
              </Box>
              <Controller
                name="preferredDentistId"
                control={control}
                render={({ field }) => (
                  <OutlinedSelect
                    {...field}
                    SelectProps={{ displayEmpty: true }}
                    sx={{
                      width: 200,
                      "& .MuiOutlinedInput-root": {
                        height: "36px",
                        backgroundColor: COLORS.SURFACE_CARD,
                        borderColor: COLORS.BORDER,
                      },
                    }}
                  >
                    <MenuItem value="">Preferred Dentist</MenuItem>
                    {providerOptions.map((p) => (
                      <MenuItem key={p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </OutlinedSelect>
                )}
              />
              <Controller
                name="preferredHygienistId"
                control={control}
                render={({ field }) => (
                  <OutlinedSelect
                    {...field}
                    SelectProps={{ displayEmpty: true }}
                    sx={{
                      width: 200,
                      "& .MuiOutlinedInput-root": {
                        height: "36px",
                        backgroundColor: COLORS.SURFACE_CARD,
                        borderColor: COLORS.BORDER,
                      },
                    }}
                  >
                    <MenuItem value="">Preferred Hygienist</MenuItem>
                    {providerOptions.map((p) => (
                      <MenuItem key={p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </OutlinedSelect>
                )}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{
                  height: "36px",
                  px: 2.5,
                  borderRadius: radius.md,
                  textTransform: "none",
                  color: COLORS.TEXT_BODY,
                  borderColor: COLORS.BORDER,
                  "&:hover": {
                    borderColor: COLORS.TEXT_MUTED,
                    backgroundColor: COLORS.SURFACE_HOVER,
                  },
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.medium,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>

          {/* Content Area */}
          <Box sx={{ px: 4, pb: 10, maxWidth: 1136, mx: "auto" }}>
            <SectionCard
              icon={PersonOutlineIcon}
              title="Patient Details"
              subtitle="Legal name, demographics, and identity"
              badge="required"
            >
              <Grid container spacing={2.5}>
                <FormFieldsGrid
                  fields={PATIENT_NAME_FIELDS}
                  register={register}
                  errors={errors}
                />

                <FormFieldsGrid
                  fields={PATIENT_PREFERRED_NAME_FIELD}
                  register={register}
                  errors={errors}
                />
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormField label="Date of Birth" required>
                    <Controller
                      name="dateOfBirth"
                      rules={{ required: "Date of birth is required" }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          disableFuture
                          minDate={dayjs().subtract(150, "year")}
                          openTo="year"
                          views={["year", "month", "day"]}
                          value={field.value}
                          onChange={field.onChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "42px",
                              borderRadius: radius.md,
                              backgroundColor: COLORS.SURFACE_INPUT,
                              "& fieldset": {
                                borderWidth: "1.2px",
                                borderColor: COLORS.BORDER,
                              },
                              "&:hover fieldset": {
                                borderColor: COLORS.TEXT_MUTED,
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: COLORS.ACCENT,
                                borderWidth: "1.2px",
                              },
                              "&.Mui-error fieldset": {
                                borderColor: COLORS.STATUS_ERROR,
                              },
                              "&.Mui-error:hover fieldset": {
                                borderColor: COLORS.STATUS_ERROR,
                              },
                              "&.Mui-error.Mui-focused fieldset": {
                                borderColor: COLORS.STATUS_ERROR,
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "8px 12px",
                              fontSize: fontSize.md,
                            },
                          }}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              size: "small",
                              fullWidth: true,
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </FormField>
                </Grid>
                <FormFieldsGrid
                  fields={PATIENT_SSN_FIELD}
                  register={register}
                  errors={errors}
                />

                <Grid
                  size={{ xs: 12 }}
                  sx={{ pt: "24px !important", pb: "4px !important" }}
                >
                  <FieldDivider />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Sex at Birth" required>
                    <Controller
                      name="sexAtBirth"
                      rules={{ required: "Sex at birth is required" }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <CustomRadioGroup
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { label: "Male", value: "male" },
                              { label: "Female", value: "female" },
                              { label: "Intersex", value: "intersex" },
                            ]}
                          />
                          {error && (
                            <FormHelperText error>
                              {error.message}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </FormField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Gender Identity">
                    <Controller
                      name="genderIdentity"
                      control={control}
                      render={({ field }) => (
                        <CustomRadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          options={[
                            { label: "Male / Man", value: "male" },
                            { label: "Female / Woman", value: "female" },
                            { label: "Non-binary", value: "non_binary" },
                            {
                              label: "Prefer not to say",
                              value: "prefer_not_to_say",
                            },
                          ]}
                        />
                      )}
                    />
                  </FormField>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              icon={PhoneOutlinedIcon}
              title="Contact Information"
              subtitle="Phone numbers, email, and mailing address"
            >
              <Grid container spacing={2}>
                <FormFieldsGrid
                  fields={CONTACT_FIELDS}
                  register={register}
                  errors={errors}
                />

                <Grid
                  size={{ xs: 12 }}
                  sx={{ pt: "24px !important", pb: "4px !important" }}
                >
                  <FieldDivider />
                </Grid>

                <AddressFieldsSection
                  prefix="patient"
                  label="Patient's Address"
                  addressLine2Placeholder="Apt, suite, unit..."
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />

                <Grid
                  size={{ xs: 12 }}
                  sx={{ pt: "24px !important", pb: "4px !important" }}
                >
                  <FieldDivider />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    sx={{
                      fontSize: fontSize.base,
                      fontWeight: fontWeight.semibold,
                      color: COLORS.TEXT_SECONDARY,
                      textTransform: "uppercase",
                      mb: 1.5,
                    }}
                  >
                    Marital Status
                  </Typography>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <CustomRadioGroup
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { label: "Single", value: "single" },
                          { label: "Married", value: "married" },
                          { label: "Widowed", value: "widowed" },
                          { label: "Divorced", value: "divorced" },
                          { label: "Under 18", value: "under_18" },
                          {
                            label: "Prefer not to answer",
                            value: "prefer_not_to_answer",
                          },
                        ]}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              icon={InfoOutlinedIcon}
              title="Additional Information"
              subtitle="Occupation and work contact details"
              badge="optional"
            >
              <Grid container spacing={2}>
                <FormFieldsGrid
                  fields={ADDITIONAL_INFO_FIELDS}
                  register={register}
                  errors={errors}
                />

                <Grid
                  size={{ xs: 12 }}
                  sx={{ pt: "24px !important", pb: "4px !important" }}
                >
                  <FieldDivider />
                </Grid>

                <AddressFieldsSection
                  prefix="work"
                  label="Work Address"
                  addressLine2Placeholder="Suite, floor..."
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />
              </Grid>
            </SectionCard>

            <SectionCard
              icon={PeopleAltOutlinedIcon}
              title="Spouse / Partner Information"
              subtitle="Spouse or domestic partner details"
              badge="optional"
            >
              <Grid container spacing={2}>
                <FormFieldsGrid
                  fields={spouseNameFields(isSingle)}
                  register={register}
                  errors={errors}
                />

                <Grid
                  size={{ xs: 12 }}
                  sx={{ pt: "24px !important", pb: "4px !important" }}
                >
                  <FieldDivider />
                </Grid>

                <AddressFieldsSection
                  prefix="spouse"
                  label="Work Address"
                  addressLine2Placeholder="Suite, unit..."
                  disabled={isSingle}
                  register={register}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />

                <Grid
                  size={{ xs: 12 }}
                  sx={{ pt: "24px !important", pb: "4px !important" }}
                >
                  <FieldDivider />
                </Grid>

                <FormFieldsGrid
                  fields={spouseEmailField(isSingle)}
                  register={register}
                  errors={errors}
                />
              </Grid>
            </SectionCard>

            <SectionCard
              icon={WarningAmberOutlinedIcon}
              title="Emergency Contact"
              subtitle="Who to contact in case of emergency"
            >
              <Grid container spacing={2}>
                <FormFieldsGrid
                  fields={EMERGENCY_CONTACT_FIELDS}
                  register={register}
                  errors={errors}
                />
              </Grid>
            </SectionCard>

            <SectionCard
              icon={CallMadeOutlinedIcon}
              title="Referring"
              subtitle="Referral source and referring patient"
              badge="optional"
            >
              <Grid container spacing={2}>
                <FormFieldsGrid
                  fields={REFERRING_SOURCE_FIELD}
                  register={register}
                  errors={errors}
                />
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormField label="Referring Patient">
                    <Controller
                      name="referringPatient"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          freeSolo
                          disabled={!isReferringPatientEnabled}
                          options={patients}
                          getOptionLabel={(opt) =>
                            typeof opt === "string" ? opt : patientLabel(opt)
                          }
                          value={
                            patients.find(
                              (p) => patientLabel(p) === field.value,
                            ) || null
                          }
                          inputValue={field.value || ""}
                          onOpen={() => setPatientSearchText(field.value || "")}
                          onChange={(_, newVal) =>
                            field.onChange(
                              typeof newVal === "string"
                                ? newVal
                                : patientLabel(newVal),
                            )
                          }
                          onInputChange={(_, newInpVal) => {
                            field.onChange(newInpVal);
                            setPatientSearchText(newInpVal);
                          }}
                          loading={patientsLoading}
                          noOptionsText="No patients found"
                          renderInput={(params) => (
                            <OutlinedInput
                              {...params}
                              placeholder="Search patients..."
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      pl: 1,
                                      pr: 0.5,
                                      color: COLORS.TEXT_SECONDARY,
                                    }}
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                      ></line>
                                    </svg>
                                  </Box>
                                ),
                                endAdornment: (
                                  <>
                                    {patientsLoading ? (
                                      <CircularProgress size={18} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </FormField>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              icon={DescriptionOutlinedIcon}
              title="Release, Communication & Preferences"
              subtitle="Privacy releases, contact consents, and appointment reminders"
            >
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: fontSize.base,
                        fontWeight: fontWeight.semibold,
                        color: COLORS.TEXT_SECONDARY,
                        textTransform: "uppercase",
                        mr: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Release Information
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        borderBottom: `1px solid ${COLORS.BORDER}`,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: fontSize.md,
                      color: COLORS.TEXT_BODY,
                      mb: 1.5,
                    }}
                  >
                    Can discuss healthcare information with:
                  </Typography>
                  <Stack spacing={1.5}>
                    <Controller
                      name="releaseSpouse"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          shape="circle"
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Spouse / Common-law partner"
                        />
                      )}
                    />
                    <Controller
                      name="releaseChildren"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          shape="circle"
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Children"
                        />
                      )}
                    />
                    <Controller
                      name="releaseParents"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          shape="circle"
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Parents"
                        />
                      )}
                    />
                    <FormField label="Other">
                      <OutlinedInput
                        {...register("releaseOther")}
                        placeholder="Specify..."
                      />
                    </FormField>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: fontSize.base,
                        fontWeight: fontWeight.semibold,
                        color: COLORS.TEXT_SECONDARY,
                        textTransform: "uppercase",
                        mr: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Communication Consents
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        borderBottom: `1px solid ${COLORS.BORDER}`,
                      }}
                    />
                  </Box>
                  <Stack spacing={1.5}>
                    <Controller
                      name="contactByPhone"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Contact me on the phone numbers provided"
                        />
                      )}
                    />
                    <Controller
                      name="leaveVoicemailAtHome"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Leave voicemail at home"
                        />
                      )}
                    />
                    <Controller
                      name="agreeElectronicCommunications"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="I agree that the dental practice may communicate with me electronically."
                        />
                      )}
                    />
                    <Controller
                      name="agreeSmsMessages"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="By opting in, I agree to receive SMS messages from the dental office."
                        />
                      )}
                    />
                    <Controller
                      name="pauseScheduleGapFillsReminders"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Pause Schedule Gap Fill Reminders"
                        />
                      )}
                    />
                    <Controller
                      name="pauseArAutomationReminders"
                      control={control}
                      render={({ field }) => (
                        <ColoredChipCheckbox
                          checked={!!field.value}
                          onChange={field.onChange}
                          label="Pause AR Automation Reminders"
                        />
                      )}
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: fontSize.base,
                        fontWeight: fontWeight.semibold,
                        color: COLORS.TEXT_SECONDARY,
                        textTransform: "uppercase",
                        mr: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Confirmation Preferences
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        borderBottom: `1px solid ${COLORS.BORDER}`,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: fontSize.md,
                      color: COLORS.TEXT_BODY,
                      mb: 1.5,
                    }}
                  >
                    Patient prefers to receive a reminder before appointment:
                  </Typography>
                  <Controller
                    name="reminderPreference"
                    control={control}
                    render={({ field }) => (
                      <Stack spacing={1.5} mb={3}>
                        <ColoredChipCheckbox
                          shape="circle"
                          checked={field.value === "none"}
                          onChange={(val) => {
                            if (val) {
                              field.onChange("none");
                              setValue("stopReminderAfterConfirmation", false);
                              setValue("dontRequestReview", false);
                            } else field.onChange("");
                          }}
                          label="No, it is unnecessary"
                        />
                        <ColoredChipCheckbox
                          shape="circle"
                          checked={field.value === "helpful"}
                          onChange={(val) => {
                            if (val) {
                              field.onChange("helpful");
                              setValue("stopReminderAfterConfirmation", false);
                              setValue("dontRequestReview", false);
                            } else field.onChange("");
                          }}
                          label="Yes, it is a helpful reminder"
                        />
                        <Controller
                          name="stopReminderAfterConfirmation"
                          control={control}
                          render={({ field: sf }) => (
                            <ColoredChipCheckbox
                              shape="circle"
                              checked={!!sf.value}
                              onChange={(val) => {
                                sf.onChange(val);
                                if (val) {
                                  setValue("reminderPreference", "");
                                  setValue("dontRequestReview", false);
                                }
                              }}
                              label="Stop reminding after confirmation"
                            />
                          )}
                        />
                      </Stack>
                    )}
                  />

                  <Typography
                    sx={{
                      fontSize: fontSize.md,
                      color: COLORS.TEXT_BODY,
                      mb: 1.5,
                    }}
                  >
                    Patient prefers not to receive a review request:
                  </Typography>
                  <Controller
                    name="dontRequestReview"
                    control={control}
                    render={({ field }) => (
                      <ColoredChipCheckbox
                        shape="circle"
                        checked={!!field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          if (val) {
                            setValue("reminderPreference", "");
                            setValue("stopReminderAfterConfirmation", false);
                          }
                        }}
                        label="Don't request review"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              icon={ChecklistOutlinedIcon}
              title="Assignment & Release"
              subtitle="Photography, social media, and assignment consents"
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: fontSize.md,
                      fontWeight: fontWeight.semibold,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    Assignment & Release
                  </Typography>
                  <Controller
                    name="assignmentRelease"
                    control={control}
                    render={({ field }) => (
                      <CustomRadioGroup
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { label: "No", value: "no" },
                          { label: "Yes", value: "yes" },
                        ]}
                      />
                    )}
                  />
                </Box>
                <FieldDivider />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: fontSize.md,
                      fontWeight: fontWeight.semibold,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    Photography Release
                  </Typography>
                  <Controller
                    name="photographyRelease"
                    control={control}
                    render={({ field }) => (
                      <CustomRadioGroup
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { label: "No", value: "no" },
                          { label: "Yes", value: "yes" },
                        ]}
                      />
                    )}
                  />
                </Box>
                <FieldDivider />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: fontSize.md,
                      fontWeight: fontWeight.semibold,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    Social Media Release
                  </Typography>
                  <Controller
                    name="socialMediaRelease"
                    control={control}
                    render={({ field }) => (
                      <CustomRadioGroup
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { label: "No", value: "no" },
                          { label: "Yes", value: "yes" },
                        ]}
                      />
                    )}
                  />
                </Box>
              </Box>
            </SectionCard>
          </Box>

          {/* Bottom Action Bar — sits in normal document flow at the end of the
            page (not fixed/sticky), so it only comes into view once the user
            scrolls all the way down. */}
          <Box
            sx={{
              backgroundColor: COLORS.SURFACE_CARD,
              borderTop: `1px solid ${COLORS.BORDER}`,
              px: 4,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Controller
                name="sendWelcome"
                control={control}
                render={({ field }) => (
                  <ColoredChipCheckbox
                    sx={{ width: "auto", minHeight: "36px", py: "6px" }}
                    checked={!!field.value}
                    onChange={field.onChange}
                    label="Send Welcome"
                  />
                )}
              />
              <Box
                sx={{
                  width: "1px",
                  height: "24px",
                  backgroundColor: COLORS.BORDER,
                  flexShrink: 0,
                }}
              />
              <Controller
                name="sendWelcomeMethod"
                control={control}
                render={({ field }) => (
                  <CustomRadioGroup
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { label: "Email", value: "email" },
                      { label: "Text Message", value: "text" },
                    ]}
                  />
                )}
              />
              <Box
                sx={{
                  width: "1px",
                  height: "24px",
                  backgroundColor: COLORS.BORDER,
                  flexShrink: 0,
                }}
              />
              <Controller
                name="newPatient"
                control={control}
                render={({ field }) => (
                  <ColoredChipCheckbox
                    sx={{ width: "auto", minHeight: "36px", py: "6px" }}
                    checked={!!field.value}
                    onChange={field.onChange}
                    label="New Patient"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontSize: fontSize.base,
                  color: COLORS.TEXT_MUTED,
                  display: { xs: "none", lg: "block" },
                }}
              >
                Welcome delivery is optional and will only be sent if you enable
                it.
              </Typography>
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{
                  px: 3,
                  height: "40px",
                  borderRadius: radius.md,
                  textTransform: "none",
                  color: COLORS.TEXT_BODY,
                  borderColor: COLORS.BORDER,
                  "&:hover": {
                    borderColor: COLORS.TEXT_MUTED,
                    backgroundColor: COLORS.SURFACE_HOVER,
                  },
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.medium,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                }
                sx={{
                  px: 3,
                  height: "40px",
                  borderRadius: radius.md,
                  textTransform: "none",
                  backgroundColor: COLORS.ACCENT,
                  "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
                  boxShadow: "none",
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.medium,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add Patient"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default NewPatientIntakeFormV2;
