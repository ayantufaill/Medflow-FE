import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Save as SaveIcon } from "@mui/icons-material";
import { patientService } from "../../services/patient.service";
import { providerService } from "../../services/provider.service";

const COUNTRY_OPTIONS = ["United States", "Canada", "Other"];

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const REFERRING_SOURCE_OPTIONS = [
  "Google",
  "Website",
  "Walk In",
  "Social Media",
  "Existing Patient",
  "Insurance Directory",
  "Provider Referral",
];

const SECTION_SX = {
  display: "flex",
  flexDirection: "column",
  gap: 0.85,
};

const HEADER_BAR_SX = {
  backgroundColor: "#4f86c6",
  color: "#fff",
  textAlign: "center",
  py: 0.8,
  fontWeight: 600,
  borderRadius: "4px 4px 0 0",
  mb: 1.25,
};

const PLACEHOLDER_TEXT_SX = {
  opacity: 1,
  fontWeight: 400,
};

const TOP_SECTION_MIN_HEIGHT = {
  md: 470,
};

const MIDDLE_SECTION_MIN_HEIGHT = {
  md: 365,
};

const STANDARD_FIELD_SX = {
  my: 0,
  "& .MuiInputBase-input": {
    fontSize: "0.88rem",
    py: 0.35,
    "&::placeholder": PLACEHOLDER_TEXT_SX,
  },
  "& .MuiInputBase-input::placeholder": PLACEHOLDER_TEXT_SX,
  "& input::placeholder": PLACEHOLDER_TEXT_SX,
  "& textarea::placeholder": PLACEHOLDER_TEXT_SX,
  "& .MuiInputLabel-root": {
    fontSize: "0.84rem",
    fontWeight: 500,
    color: "#5f6670",
  },
  "& .MuiFormHelperText-root": {
    mt: 0.25,
    fontSize: "0.72rem",
  },
};

const STANDARD_INPUT_TEXT_SX = {
  fontSize: "0.88rem",
  py: 0.35,
  "&::placeholder": PLACEHOLDER_TEXT_SX,
};

const BOLD_INPUT_TEXT_SX = {
  ...STANDARD_INPUT_TEXT_SX,
  fontWeight: 600,
};

const rowLabelSx = {
  fontSize: "0.88rem",
  fontWeight: 500,
  color: "#2f3b4a",
  whiteSpace: "nowrap",
  pt: 0.55,
};

const sectionTitleSx = {
  fontWeight: 600,
  fontSize: "1.08rem",
  color: "#2b3440",
  pb: 0.35,
  borderBottom: "1px solid #9fb0a7",
  mb: 0.75,
};

const addressInlineLabelSx = {
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#2f3b4a",
  lineHeight: 1.1,
  whiteSpace: "nowrap",
};

const addressInlineRowSx = {
  display: "grid",
  gridTemplateColumns: "92px minmax(0, 1fr)",
  columnGap: 1,
  alignItems: "center",
};

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
  contactByPhone: true,
  leaveVoicemailAtHome: true,
  agreeElectronicCommunications: true,
  agreeSmsMessages: true,
  pauseScheduleGapFillsReminders: false,
  pauseArAutomationReminders: false,
  referringSources: "",
  referringPatient: "",
  releaseSpouse: false,
  releaseChildren: false,
  releaseParents: false,
  releaseOther: "",
  reminderPreference: "helpful",
  stopReminderAfterConfirmation: false,
  dontRequestReview: false,
  assignmentRelease: "",
  photographyRelease: "",
  socialMediaRelease: "",
  sendWelcome: false,
  sendWelcomeMethod: "email",
  newPatientFlag: true,
};

const trimValue = (value) => (typeof value === "string" ? value.trim() : value);

const normalizePhone = (value) => {
  const digits = (value || "").replace(/[^\d+]/g, "").trim();
  if (!digits) return "";
  return digits.startsWith("+") ? digits : `+${digits}`;
};

const formatPhoneInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const formatPostalCodeInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 9);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatDateValue = (value) => {
  if (!value) return undefined;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toISOString() : undefined;
};

const removeEmptyCustomFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return true;
      return value !== "" && value !== null && value !== undefined;
    }),
  );

const Section = ({ title, children, sx = {} }) => (
  <Box sx={{ ...SECTION_SX, ...sx }}>
    <Typography sx={sectionTitleSx}>{title}</Typography>
    {children}
  </Box>
);

const Row = ({
  label,
  children,
  alignTop = false,
  labelSize = 4,
  fieldSize = 8,
}) => (
  <Grid container spacing={0.8} alignItems={alignTop ? "flex-start" : "center"}>
    <Grid size={{ xs: 12, sm: labelSize }}>
      <Typography sx={rowLabelSx}>{label}</Typography>
    </Grid>
    <Grid size={{ xs: 12, sm: fieldSize }}>{children}</Grid>
  </Grid>
);

const StandardTextInput = (props) => (
  <TextField
    variant="standard"
    size="small"
    fullWidth
    InputLabelProps={{
      shrink: true,
      ...(props.InputLabelProps || {}),
    }}
    sx={{
      ...STANDARD_FIELD_SX,
      ...(props.sx || {}),
    }}
    {...props}
  />
);

const PhoneTextInput = ({ onChange, inputProps, InputProps, ...props }) => (
  <StandardTextInput
    {...props}
    placeholder={props.placeholder || "(201) 555-0123"}
    onChange={(event) => {
      event.target.value = formatPhoneInput(event.target.value);
      onChange?.(event);
    }}
    inputProps={{
      inputMode: "numeric",
      maxLength: 14,
      ...inputProps,
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment
          position="start"
          sx={{
            mr: 0.6,
            ml: 0,
            height: 22,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.3,
              color: "#616161",
              lineHeight: 1,
            }}
          >
            <Box component="span" sx={{ fontSize: "1rem", lineHeight: 1 }}>
              🇺🇸
            </Box>
            <Box component="span" sx={{ fontSize: "0.7rem", color: "#7b7b7b" }}>
              ▾
            </Box>
          </Box>
        </InputAdornment>
      ),
      ...InputProps,
    }}
  />
);

const StandardSelect = ({
  field,
  label,
  children,
  error,
  helperText,
  multiple = false,
}) => (
  <TextField
    select
    variant="standard"
    size="small"
    fullWidth
    label={label}
    {...field}
    InputLabelProps={{ shrink: true }}
    SelectProps={{ multiple }}
    error={error}
    helperText={helperText}
    sx={STANDARD_FIELD_SX}
  >
    {children}
  </TextField>
);

const AddressFieldRow = ({ label, children }) => (
  <Box sx={addressInlineRowSx}>
    <Typography sx={addressInlineLabelSx}>{label}</Typography>
    {children}
  </Box>
);

const AddressTextInput = ({ label, ...props }) => (
  <AddressFieldRow label={label}>
    <StandardTextInput {...props} />
  </AddressFieldRow>
);

const PostalCodeTextInput = ({ onChange, inputProps, ...props }) => (
  <AddressTextInput
    {...props}
    onChange={(event) => {
      event.target.value = formatPostalCodeInput(event.target.value);
      onChange?.(event);
    }}
    inputProps={{
      inputMode: "numeric",
      maxLength: 10,
      ...inputProps,
    }}
  />
);

const AddressSelect = ({ field, label, children, sx }) => (
  <AddressFieldRow label={label}>
    <StandardSelect field={field} sx={sx}>
      {children}
    </StandardSelect>
  </AddressFieldRow>
);

const RadioRow = ({ value, onChange, options, row = true, sx = {} }) => (
  <RadioGroup
    row={row}
    value={value}
    onChange={onChange}
    sx={{ gap: row ? 1.5 : 0.25, ...sx }}
  >
    {options.map((option) => (
      <FormControlLabel
        key={option.value}
        value={option.value}
        control={<Radio size="small" />}
        sx={{ mr: row ? 1.5 : 0 }}
        slotProps={{ typography: { fontSize: "0.84rem" } }}
        label={option.label}
      />
    ))}
  </RadioGroup>
);

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

  const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
  return patient.patientCode ? `${fullName} (${patient.patientCode})` : fullName;
};

const NewPatientIntakeForm = ({ onSubmit, loading = false, onCancel }) => {
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientSearchText, setPatientSearchText] = useState("");
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const sendWelcome = watch("sendWelcome");

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(async () => {
      try {
        setPatientsLoading(true);
        const result = await patientService.getAllPatients(1, 20, patientSearchText, "active");
        if (!isMounted) return;
        setPatients(result?.patients || result?.items || []);
      } catch {
        if (!isMounted) return;
        setPatients([]);
      } finally {
        if (isMounted) {
          setPatientsLoading(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [patientSearchText]);

  useEffect(() => {
    let isMounted = true;

    const fetchProviders = async () => {
      try {
        setProvidersLoading(true);
        const result = await providerService.getAllProviders(1, 100, "", true);
        if (!isMounted) return;
        setProviders(result?.providers || result?.items || []);
      } catch {
        if (!isMounted) return;
        setProviders([]);
      } finally {
        if (isMounted) {
          setProvidersLoading(false);
        }
      }
    };

    fetchProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  const providerOptions = useMemo(
    () =>
      providers.map((provider) => ({
        value: provider._id || provider.id,
        label: providerLabel(provider),
      })),
    [providers],
  );

  const handleFormSubmit = (values) => {
    const customFields = removeEmptyCustomFields({
      title: trimValue(values.title),
      sexAtBirth: values.sexAtBirth,
      genderIdentity: values.genderIdentity,
      preferredDentistId: values.preferredDentistId,
      preferredHygienistId: values.preferredHygienistId,
      occupation: trimValue(values.occupation),
      guardianEmployer: trimValue(values.guardianEmployer),
      workCountry: trimValue(values.workCountry),
      workAddressLine1: trimValue(values.workAddressLine1),
      workAddressLine2: trimValue(values.workAddressLine2),
      workCity: trimValue(values.workCity),
      workState: trimValue(values.workState),
      workPostalCode: trimValue(values.workPostalCode),
      workPhoneNumber: trimValue(values.workPhoneNumber),
      maritalStatus: values.maritalStatus,
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
      referringSources: values.referringSources,
      referringPatient: trimValue(values.referringPatient),
      releaseSpouse: values.releaseSpouse,
      releaseChildren: values.releaseChildren,
      releaseParents: values.releaseParents,
      releaseOther: trimValue(values.releaseOther),
      reminderPreference: values.reminderPreference,
      stopReminderAfterConfirmation: values.stopReminderAfterConfirmation,
      dontRequestReview: values.dontRequestReview,
      assignmentRelease: values.assignmentRelease,
      photographyRelease: values.photographyRelease,
      socialMediaRelease: values.socialMediaRelease,
      sendWelcome: values.sendWelcome,
      sendWelcomeMethod: values.sendWelcome ? values.sendWelcomeMethod : "",
      newPatientFlag: values.newPatientFlag,
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

    const payload = removeEmptyCustomFields({
      firstName: trimValue(values.firstName),
      lastName: trimValue(values.lastName),
      middleName: trimValue(values.middleName) || "",
      preferredName: trimValue(values.preferredName) || "",
      dateOfBirth: formatDateValue(values.dateOfBirth),
      gender: values.genderIdentity || values.sexAtBirth || "",
      ssn: (values.ssn || "").replace(/\D/g, ""),
      phonePrimary: normalizePhone(
        values.mobileNumber || values.homePhoneNumber,
      ),
      phoneSecondary: normalizePhone(
        values.homePhoneNumber || values.workPhoneNumber,
      ),
      email: trimValue(values.emailAddress) || "",
      preferredLanguage: "en",
      communicationPreference: values.contactByPhone
        ? "phone"
        : values.agreeSmsMessages
          ? "sms"
          : values.sendWelcomeMethod === "text"
            ? "sms"
            : "email",
      portalAccessEnabled: false,
      referralSource: values.referringSources || trimValue(values.referringPatient) || "",
      isActive: true,
      address: Object.keys(address).length ? address : undefined,
      emergencyContact: Object.keys(emergencyContact).length ? emergencyContact : undefined,
      customFields: Object.keys(customFields).length ? customFields : undefined,
    });

    console.log("New patient payload:", JSON.stringify(payload, null, 2));

    onSubmit(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          px: { xs: 0.5, md: 1 },
          pb: 1,
        }}
      >
        <Typography sx={HEADER_BAR_SX}>Add New Patient</Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1.5,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            <Box sx={{ width: { xs: "100%", md: 220 } }}>
              <Controller
                name="preferredDentistId"
                control={control}
                render={({ field }) => (
                  <StandardSelect
                    field={field}
                    label="Preferred Dentist"
                    error={!!errors.preferredDentistId}
                    helperText={errors.preferredDentistId?.message}
                  >
                    <MenuItem value="">None</MenuItem>
                    {providersLoading && (
                      <MenuItem value="" disabled>
                        Loading...
                      </MenuItem>
                    )}
                    {providerOptions.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </MenuItem>
                    ))}
                  </StandardSelect>
                )}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: 220 } }}>
              <Controller
                name="preferredHygienistId"
                control={control}
                render={({ field }) => (
                  <StandardSelect
                    field={field}
                    label="Preferred Hygienist"
                    error={!!errors.preferredHygienistId}
                    helperText={errors.preferredHygienistId?.message}
                  >
                    <MenuItem value="">None</MenuItem>
                    {providersLoading && (
                      <MenuItem value="" disabled>
                        Loading...
                      </MenuItem>
                    )}
                    {providerOptions.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </MenuItem>
                    ))}
                  </StandardSelect>
                )}
              />
            </Box>
          </Stack>
        </Box>

        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ minHeight: TOP_SECTION_MIN_HEIGHT, pb: 1 }}>
              <Section title="Patient Details">
                <Row label="Title:">
                  <StandardTextInput {...register("title")} />
                </Row>
                <Row label="First Name:">
                  <StandardTextInput
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    placeholder="First name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Row>
                <Row label="Middle Name:">
                  <StandardTextInput
                    {...register("middleName")}
                    placeholder="Middle name"
                  />
                </Row>
                <Row label="Last Name:">
                  <StandardTextInput
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    placeholder="Last name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Row>
                <Row label="Preferred Name:">
                  <StandardTextInput
                    {...register("preferredName")}
                    placeholder="Preferred name"
                  />
                </Row>
                <Row label="Date of Birth:">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        maxDate={dayjs()}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            fullWidth: true,
                            sx: {
                              ...STANDARD_FIELD_SX,
                              "& .MuiPickersSectionList-root":
                                STANDARD_INPUT_TEXT_SX,
                              "& .MuiPickersInputBase-sectionsContainer":
                                STANDARD_INPUT_TEXT_SX,
                            },
                            InputLabelProps: {
                              shrink: true,
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Row>
                <Row label="Sex at Birth:" alignTop>
                  <Controller
                    name="sexAtBirth"
                    control={control}
                    render={({ field }) => (
                      <RadioRow
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { label: "Male", value: "male" },
                          { label: "Female", value: "female" },
                        ]}
                      />
                    )}
                  />
                </Row>
                <Row label="Gender Identity:" alignTop>
                  <Controller
                    name="genderIdentity"
                    control={control}
                    render={({ field }) => (
                      <RadioRow
                        value={field.value}
                        onChange={field.onChange}
                        row={false}
                        options={[
                          { label: "Male/Man", value: "male" },
                          { label: "Female/Woman", value: "female" },
                        ]}
                      />
                    )}
                  />
                </Row>
                <Box sx={{ pb: 1.5 }}>
                  <Row
                    label="Social Security Number:"
                    labelSize={5.2}
                    fieldSize={6.8}
                  >
                    <StandardTextInput
                      {...register("ssn")}
                      placeholder="ssNumber"
                      sx={{ ml: 0.75 }}
                    />
                  </Row>
                </Box>
              </Section>
            </Box>

            <Box sx={{ minHeight: MIDDLE_SECTION_MIN_HEIGHT }}>
              <Section title="Spouse Information">
                <Row label="Spouse's Name:" alignTop>
                  <Stack spacing={1}>
                    <StandardTextInput
                      {...register("spouseFirstName")}
                      placeholder="First name"
                    />
                    <StandardTextInput
                      {...register("spouseMiddleName")}
                      placeholder="Middle name"
                    />
                    <StandardTextInput
                      {...register("spouseLastName")}
                      placeholder="Last name"
                    />
                  </Stack>
                </Row>
                <Row label="Occupation:">
                  <StandardTextInput {...register("spouseOccupation")} />
                </Row>
                <Row label="Spouse's Employer:">
                  <StandardTextInput {...register("spouseEmployer")} />
                </Row>
                <Row label="Work Address:" alignTop>
                  <Stack spacing={1}>
                    <Controller
                      name="spouseCountry"
                      control={control}
                      render={({ field }) => (
                        <AddressSelect
                          field={field}
                          label="Country:"
                          sx={{ "& .MuiSelect-select": { fontWeight: 600 } }}
                        >
                          {COUNTRY_OPTIONS.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </AddressSelect>
                      )}
                    />
                    <AddressTextInput
                      {...register("spouseAddressLine1")}
                      label="Address Line 1:"
                      placeholder="Address line 1"
                    />
                    <AddressTextInput
                      {...register("spouseAddressLine2")}
                      label="Address Line 2:"
                      placeholder="Address line 2"
                    />
                    <AddressTextInput
                      {...register("spouseCity")}
                      label="City:"
                      placeholder="City"
                    />
                    <Controller
                      name="spouseState"
                      control={control}
                      render={({ field }) => (
                        <AddressSelect field={field} label="State:">
                          <MenuItem value="">Select state</MenuItem>
                          {US_STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </AddressSelect>
                      )}
                    />
                    <PostalCodeTextInput
                      {...register("spousePostalCode")}
                      label="Zip/Postal Code:"
                      placeholder="Zip/Postal Code"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...STANDARD_INPUT_TEXT_SX,
                          pl: 0.4,
                        },
                      }}
                    />
                  </Stack>
                </Row>
                <Row label="Work Phone Number:" labelSize={4.8} fieldSize={7.2}>
                  <PhoneTextInput {...register("spouseWorkPhoneNumber")} />
                </Row>
                <Row label="Email Address:">
                  <StandardTextInput {...register("spouseEmailAddress")} />
                </Row>
              </Section>
            </Box>

            <Section title="Referring" sx={{ mt: { md: 3 } }}>
              <Row label="Referring source:">
                <Controller
                  name="referringSources"
                  control={control}
                  render={({ field }) => (
                    <StandardSelect field={field}>
                      <MenuItem value="">Select source</MenuItem>
                      {REFERRING_SOURCE_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </StandardSelect>
                  )}
                />
              </Row>
              <Row label="Referring Patient:">
                <Controller
                  name="referringPatient"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      freeSolo
                      options={patients}
                      filterOptions={(options) => options}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : patientLabel(option)
                      }
                      value={
                        patients.find((patient) => patientLabel(patient) === field.value) || null
                      }
                      inputValue={field.value || ""}
                      onOpen={() => {
                        setPatientSearchText(field.value || "");
                      }}
                      onChange={(_, newValue) => {
                        field.onChange(
                          typeof newValue === "string" ? newValue : patientLabel(newValue)
                        );
                      }}
                      onInputChange={(_, newInputValue) => {
                        field.onChange(newInputValue);
                        setPatientSearchText(newInputValue);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        patientLabel(option) === patientLabel(value)
                      }
                      loading={patientsLoading}
                      noOptionsText="No patients found"
                      openOnFocus
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          size="small"
                          fullWidth
                          placeholder="Search patients"
                          InputLabelProps={{ shrink: true }}
                          sx={STANDARD_FIELD_SX}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {patientsLoading ? <CircularProgress size={18} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Row>
            </Section>

            <Section title="Assignment & Release:" sx={{ mt: { md: 30 } }}>
              <Row
                label="Assignment & Release:"
                labelSize={5.2}
                fieldSize={6.8}
              >
                <Controller
                  name="assignmentRelease"
                  control={control}
                  render={({ field }) => (
                    <RadioRow
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: { md: 2.25 } }}
                      options={[
                        { label: "No", value: "no" },
                        { label: "Yes", value: "yes" },
                      ]}
                    />
                  )}
                />
              </Row>
              <Row label="Photography Release:" labelSize={5.2} fieldSize={6.8}>
                <Controller
                  name="photographyRelease"
                  control={control}
                  render={({ field }) => (
                    <RadioRow
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: { md: 2.25 } }}
                      options={[
                        { label: "No", value: "no" },
                        { label: "Yes", value: "yes" },
                      ]}
                    />
                  )}
                />
              </Row>
              <Row
                label="Social Media Release:"
                labelSize={5.2}
                fieldSize={6.8}
              >
                <Controller
                  name="socialMediaRelease"
                  control={control}
                  render={({ field }) => (
                    <RadioRow
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: { md: 2.25 } }}
                      options={[
                        { label: "No", value: "no" },
                        { label: "Yes", value: "yes" },
                      ]}
                    />
                  )}
                />
              </Row>
            </Section>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ minHeight: TOP_SECTION_MIN_HEIGHT, pb: 1 }}>
              <Section title="Contact Information">
                <Row label="Mobile Number:" labelSize={4.6} fieldSize={7.4}>
                  <PhoneTextInput {...register("mobileNumber")} />
                </Row>
                <Row label="Home Phone Number:" labelSize={4.8} fieldSize={7.2}>
                  <PhoneTextInput {...register("homePhoneNumber")} />
                </Row>
                <Row label="Patient's Address:" alignTop>
                  <Stack spacing={1}>
                    <Controller
                      name="patientCountry"
                      control={control}
                      render={({ field }) => (
                        <AddressSelect field={field} label="Country:">
                          {COUNTRY_OPTIONS.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </AddressSelect>
                      )}
                    />
                    <AddressTextInput
                      {...register("patientAddressLine1")}
                      label="Address Line 1:"
                      placeholder="Address line 1"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                    <AddressTextInput
                      {...register("patientAddressLine2")}
                      label="Address Line 2:"
                      placeholder="Address line 2"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                    <AddressTextInput
                      {...register("patientCity")}
                      label="City:"
                      placeholder="City"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                    <Controller
                      name="patientState"
                      control={control}
                      render={({ field }) => (
                        <AddressSelect
                          field={field}
                          label="State:"
                          sx={{ "& .MuiSelect-select": { fontWeight: 600 } }}
                        >
                          <MenuItem value="">Select state</MenuItem>
                          {US_STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </AddressSelect>
                      )}
                    />
                    <PostalCodeTextInput
                      {...register("patientPostalCode")}
                      label="Zip/Postal Code:"
                      placeholder="Zip/Postal Code"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          pl: 0.4,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                  </Stack>
                </Row>
                <Row label="Email Address:">
                  <StandardTextInput {...register("emailAddress")} />
                </Row>
                <Box sx={{ pt: 0.35 }}>
                  <Typography sx={{ ...rowLabelSx, pt: 0, mb: 0.35 }}>
                    Marital Status:
                  </Typography>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onChange={field.onChange}
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(3, minmax(0, max-content))",
                          columnGap: 1.15,
                          rowGap: 0.1,
                          pl: 0.15,
                        }}
                      >
                        {[
                          { label: "Single", value: "single" },
                          { label: "Married", value: "married" },
                          { label: "Widowed", value: "widowed" },
                          { label: "Divorced", value: "divorced" },
                          { label: "Under 18", value: "under_18" },
                          {
                            label: "Prefer not to answer",
                            value: "prefer_not_to_answer",
                          },
                        ].map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" />}
                            label={option.label}
                            sx={{ mr: 0, mb: 0 }}
                            slotProps={{
                              typography: {
                                fontSize: "0.84rem",
                                fontWeight: 600,
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Section>
            </Box>

            <Box sx={{ minHeight: MIDDLE_SECTION_MIN_HEIGHT }}>
              <Section title="Emergency Contact">
                <Row label="Name:">
                  <StandardTextInput {...register("emergencyContactName")} />
                </Row>
                <Row label="Relationship:">
                  <StandardTextInput {...register("emergencyRelationship")} />
                </Row>
                <Row label="Home Phone Number:" labelSize={4.8} fieldSize={7.2}>
                  <PhoneTextInput {...register("emergencyHomePhone")} />
                </Row>
                <Row label="Work Phone Number:" labelSize={4.8} fieldSize={7.2}>
                  <PhoneTextInput {...register("emergencyWorkPhone")} />
                </Row>
                <Row label="Mobile Number:" labelSize={4.6} fieldSize={7.4}>
                  <PhoneTextInput {...register("emergencyMobilePhone")} />
                </Row>
              </Section>
            </Box>

            <Section title="Release Information" sx={{ mt: { md: 16.5 } }}>
              <Typography variant="body2" color="text.secondary">
                Can discuss healthcare information with:
              </Typography>
              <Controller
                name="releaseSpouse"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={!!field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        size="small"
                      />
                    }
                    label="Spouse / Common-law partner"
                    sx={{ mr: 0, mb: 0.2, alignItems: "center" }}
                    slotProps={{
                      typography: { fontSize: "0.84rem", fontWeight: 600 },
                    }}
                  />
                )}
              />
              <Controller
                name="releaseChildren"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={!!field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        size="small"
                      />
                    }
                    label="Children"
                    sx={{ mr: 0, mb: 0.2, alignItems: "center" }}
                    slotProps={{
                      typography: { fontSize: "0.84rem", fontWeight: 600 },
                    }}
                  />
                )}
              />
              <Controller
                name="releaseParents"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={!!field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        size="small"
                      />
                    }
                    label="Parents"
                    sx={{ mr: 0, mb: 0.2, alignItems: "center" }}
                    slotProps={{
                      typography: { fontSize: "0.84rem", fontWeight: 600 },
                    }}
                  />
                )}
              />
              <Row label="Other:">
                <StandardTextInput {...register("releaseOther")} />
              </Row>
            </Section>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ minHeight: TOP_SECTION_MIN_HEIGHT, pb: 1 }}>
              <Section title="Additional Information">
                <Row label="Occupation:">
                  <StandardTextInput {...register("occupation")} />
                </Row>
                <Row
                  label="Patient's / Guardian's Employer:"
                  labelSize={7}
                  fieldSize={5}
                >
                  <StandardTextInput {...register("guardianEmployer")} />
                </Row>
                <Row label="Work Address:" alignTop>
                  <Stack spacing={1}>
                    <Controller
                      name="workCountry"
                      control={control}
                      render={({ field }) => (
                        <AddressSelect
                          field={field}
                          label="Country:"
                          sx={{ "& .MuiSelect-select": { fontWeight: 600 } }}
                        >
                          {COUNTRY_OPTIONS.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </AddressSelect>
                      )}
                    />
                    <AddressTextInput
                      {...register("workAddressLine1")}
                      label="Address Line 1:"
                      placeholder="Address line 1"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                    <AddressTextInput
                      {...register("workAddressLine2")}
                      label="Address Line 2:"
                      placeholder="Address line 2"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                    <AddressTextInput
                      {...register("workCity")}
                      label="City:"
                      placeholder="City"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                    <Controller
                      name="workState"
                      control={control}
                      render={({ field }) => (
                        <AddressSelect
                          field={field}
                          label="State:"
                          sx={{ "& .MuiSelect-select": { fontWeight: 600 } }}
                        >
                          <MenuItem value="">Select state</MenuItem>
                          {US_STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </AddressSelect>
                      )}
                    />
                    <PostalCodeTextInput
                      {...register("workPostalCode")}
                      label="Zip/Postal Code:"
                      placeholder="Zip/Postal Code"
                      sx={{
                        "& .MuiInputBase-input": {
                          ...BOLD_INPUT_TEXT_SX,
                          pl: 0.4,
                          "&::placeholder": { opacity: 1, fontWeight: 400 },
                        },
                      }}
                    />
                  </Stack>
                </Row>
                <Row label="Work Phone Number:" labelSize={4.8} fieldSize={7.2}>
                  <PhoneTextInput {...register("workPhoneNumber")} />
                </Row>
              </Section>
            </Box>

            <Box sx={{ minHeight: MIDDLE_SECTION_MIN_HEIGHT }}>
              <Section title="Communication">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  You can contact patient via following means:
                </Typography>
                <Controller
                  name="contactByPhone"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="Contact me on the phone numbers provided"
                      slotProps={{ typography: { fontWeight: 600 } }}
                    />
                  )}
                />
                <Controller
                  name="leaveVoicemailAtHome"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="Leave voicemail at home"
                      slotProps={{ typography: { fontWeight: 600 } }}
                    />
                  )}
                />
                <Controller
                  name="agreeElectronicCommunications"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="I agree that the dental practice may communicate with me electronically."
                      slotProps={{ typography: { fontWeight: 600 } }}
                    />
                  )}
                />
                <Controller
                  name="agreeSmsMessages"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="By opting in, I agree to receive SMS messages from the dental office."
                      slotProps={{ typography: { fontWeight: 600 } }}
                    />
                  )}
                />
                <Controller
                  name="pauseScheduleGapFillsReminders"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="Pause Schedule Gap Fills Reminders"
                      slotProps={{ typography: { fontWeight: 600 } }}
                    />
                  )}
                />
                <Controller
                  name="pauseArAutomationReminders"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="Pause AR Automation Reminders"
                      slotProps={{ typography: { fontWeight: 600 } }}
                    />
                  )}
                />
              </Section>
            </Box>

            <Section title="Confirmation" sx={{ mt: { md: 15 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Patient prefers to receive a reminder before his/her
                appointment:
              </Typography>
              <Controller
                name="reminderPreference"
                control={control}
                render={({ field }) => (
                  <RadioRow
                    value={field.value}
                    onChange={field.onChange}
                    row={false}
                    options={[
                      { label: "No, it is unnecessary", value: "none" },
                      {
                        label: "Yes, it is a helpful reminder",
                        value: "helpful",
                      },
                    ]}
                  />
                )}
              />
              <Controller
                name="stopReminderAfterConfirmation"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Radio
                        size="small"
                        checked={!!field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                      />
                    }
                    label="Stop Reminding After Confirmation"
                    slotProps={{ typography: { fontSize: "0.84rem" } }}
                  />
                )}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 2 }}>
                Patient prefers not to receive a review request:
              </Typography>
              <Controller
                name="dontRequestReview"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Radio
                        size="small"
                        checked={!!field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                      />
                    }
                    label="Don't request review"
                    slotProps={{ typography: { fontSize: "0.84rem" } }}
                  />
                )}
              />
            </Section>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Controller
              name="sendWelcome"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  }
                  label="Send Welcome:"
                />
              )}
            />

            <Controller
              name="sendWelcomeMethod"
              control={control}
              render={({ field }) => (
                <RadioRow
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Email", value: "email" },
                    { label: "Text Message", value: "text" },
                  ]}
                />
              )}
            />

            <Controller
              name="newPatientFlag"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  }
                  label="New Patient"
                />
              )}
            />
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{
                backgroundColor: "#d8b16b",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#c49c56",
                },
              }}
            >
              {loading ? "Adding..." : "Add Patient"}
            </Button>
          </Stack>
        </Stack>

        {!sendWelcome && (
          <FormHelperText sx={{ mt: 1 }}>
            Welcome delivery is optional and will only be sent if you enable it.
          </FormHelperText>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default NewPatientIntakeForm;
