import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete, Box, Button, CircularProgress, Grid, MenuItem, Stack, TextField, Typography, Checkbox, FormControlLabel
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import SectionCard from "./form-components/SectionCard";
import FormField from "./form-components/FormField";
import ChipToggleGroup from "./form-components/ChipToggleGroup";
import PillToggle from "./form-components/PillToggle";
import ColoredChipCheckbox from "./form-components/ColoredChipCheckbox";


import { patientService } from "../../services/patient.service";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchAllProvidersForDropdown, selectProviderDropdownList, selectProviderDropdownLoading 
} from "../../store/slices/providerSlice";

const COUNTRY_OPTIONS = ["United States", "Canada", "Other"];
import { US_STATES, STATE_CITIES } from "../../constants/usAddressData";
const REFERRING_SOURCE_OPTIONS = ["Google", "Website", "Walk In", "Social Media", "Existing Patient", "Insurance Directory", "Provider Referral"];

const DEFAULT_VALUES = {
  title: "", firstName: "", middleName: "", lastName: "", preferredName: "", dateOfBirth: null, sexAtBirth: "", genderIdentity: "", ssn: "",
  preferredDentistId: "", preferredHygienistId: "", mobileNumber: "", homePhoneNumber: "", patientCountry: "United States", patientAddressLine1: "", patientAddressLine2: "", patientCity: "", patientState: "", patientPostalCode: "", emailAddress: "", maritalStatus: "",
  occupation: "", guardianEmployer: "", workCountry: "United States", workAddressLine1: "", workAddressLine2: "", workCity: "", workState: "", workPostalCode: "", workPhoneNumber: "",
  spouseFirstName: "", spouseMiddleName: "", spouseLastName: "", spouseOccupation: "", spouseEmployer: "", spouseCountry: "United States", spouseAddressLine1: "", spouseAddressLine2: "", spouseCity: "", spouseState: "", spousePostalCode: "", spouseWorkPhoneNumber: "", spouseEmailAddress: "",
  emergencyContactName: "", emergencyRelationship: "", emergencyHomePhone: "", emergencyWorkPhone: "", emergencyMobilePhone: "",
  contactByPhone: false, leaveVoicemailAtHome: false, agreeElectronicCommunications: false, agreeSmsMessages: false, pauseScheduleGapFillsReminders: false, pauseArAutomationReminders: false,
  referringSources: "", referringPatient: "",
  releaseSpouse: false, releaseChildren: false, releaseParents: false, releaseOther: "",
  reminderPreference: "", stopReminderAfterConfirmation: false, dontRequestReview: false,
  assignmentRelease: "", photographyRelease: "", socialMediaRelease: "",
  sendWelcome: false, sendWelcomeMethod: "", newPatientFlag: false,
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
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};
const formatPostalCodeInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};
const formatSSNInput = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
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

const OutlinedInput = (props) => (
  <TextField
    variant="outlined" size="small" fullWidth {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: "42px", borderRadius: "8px", backgroundColor: "#F0F3FB",
        "& fieldset": { borderWidth: "1.2px", borderColor: "#E2E8F0" },
        "&:hover fieldset": { borderColor: "#CBD5E1" },
        "&.Mui-focused fieldset": { borderColor: "#1a73e8", borderWidth: "1.2px" },
      },
      "& .MuiOutlinedInput-input": { padding: "8px 12px", fontSize: "0.88rem" },
      ...props.sx
    }}
  />
);

const OutlinedSelect = ({ children, ...props }) => (
  <TextField
    select variant="outlined" size="small" fullWidth {...props}
    SelectProps={{ displayEmpty: true, ...props.SelectProps }}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: "42px", borderRadius: "8px", backgroundColor: "#F0F3FB",
        "& fieldset": { borderWidth: "1.2px", borderColor: "#E2E8F0" },
        "&:hover fieldset": { borderColor: "#CBD5E1" },
        "&.Mui-focused fieldset": { borderColor: "#1a73e8", borderWidth: "1.2px" },
      },
      "& .MuiSelect-select": { padding: "8px 12px", fontSize: "0.88rem" },
      ...props.sx
    }}
  >
    {children}
  </TextField>
);

const PhoneInput = ({ onChange, ...props }) => (
  <OutlinedInput
    {...props}
    placeholder="(201) 555-0123"
    onChange={(event) => {
      event.target.value = formatPhoneInput(event.target.value);
      onChange?.(event);
    }}
    InputProps={{
      startAdornment: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, pr: 1, borderRight: "1px solid #E2E8F0" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <TextField
            select
            variant="standard"
            defaultValue="US"
            InputProps={{ disableUnderline: true }}
            SelectProps={{ IconComponent: () => null }}
            sx={{
              "& .MuiSelect-select": {
                py: 0, pl: 0, pr: "0 !important",
                fontSize: "0.85rem", fontWeight: 500, color: "#1E293B",
                "&:focus": { backgroundColor: "transparent" }
              }
            }}
          >
            <MenuItem value="US">US</MenuItem>
            <MenuItem value="CA">CA</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
            <MenuItem value="AU">AU</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>
        </Box>
      ),
      ...props.InputProps
    }}
  />
);

const CustomRadioGroup = ({ options = [], value, onChange, sx = {} }) => (
  <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", ...sx }}>
    {options.map((opt) => (
      <Box
        key={opt.value}
        onClick={() => onChange(opt.value)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "34.8px",
          px: 1.5,
          borderRadius: "8px",
          border: "1.2px solid",
          borderColor: value === opt.value ? "#1a73e8" : "#E2E8F0",
          backgroundColor: value === opt.value ? "#e8f0fe" : "#F0F3FB",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: value === opt.value ? "#1a73e8" : "#CBD5E1" },
          ...(opt.width ? { width: opt.width } : {}),
          boxSizing: "border-box"
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "1.2px solid",
            borderColor: value === opt.value ? "#1a73e8" : "#94A3B8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value === opt.value && <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#1a73e8" }} />}
        </Box>
        <Typography sx={{ fontSize: "0.85rem", color: value === opt.value ? "#1a73e8" : "#475569", fontWeight: 500, whiteSpace: "nowrap" }}>
          {opt.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

const providerLabel = (provider) => {
  if (provider?.userId?.firstName || provider?.userId?.lastName) {
    return `${provider.userId?.firstName || ""} ${provider.userId?.lastName || ""}`.trim();
  }
  return `${provider?.firstName || ""} ${provider?.lastName || ""}`.trim() || provider?.name || "Unknown";
};

const patientLabel = (patient) => {
  if (!patient) return "";
  if (typeof patient === "string") return patient;
  const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
  return patient.patientCode ? `${fullName} (${patient.patientCode})` : fullName;
};

const NewPatientIntakeFormV2 = ({ onSubmit, loading = false, onCancel }) => {
  const dispatch = useDispatch();
  const providers = useSelector(selectProviderDropdownList);
  const providersLoading = useSelector(selectProviderDropdownLoading);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientSearchText, setPatientSearchText] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({ defaultValues: DEFAULT_VALUES });

  const maritalStatus = watch("maritalStatus");
  const isSingle = maritalStatus === "single";
  const referringSources = watch("referringSources");
  const isReferringPatientEnabled = referringSources === "Walk In" || referringSources === "Existing Patient";
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
        if (isMounted) setPatientsLoading(false);
      }
    }, 300);
    return () => { isMounted = false; clearTimeout(timer); };
  }, [patientSearchText]);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const providerOptions = useMemo(() => providers.map((p) => ({ value: p._id || p.id, label: providerLabel(p) })), [providers]);

  const handleFormSubmit = (values) => {
    const customFields = removeEmptyCustomFields({
      workCountry: trimValue(values.workCountry), workAddressLine1: trimValue(values.workAddressLine1), workAddressLine2: trimValue(values.workAddressLine2), workCity: trimValue(values.workCity), workState: trimValue(values.workState), workPostalCode: trimValue(values.workPostalCode), workPhoneNumber: trimValue(values.workPhoneNumber),
      spouseFirstName: trimValue(values.spouseFirstName), spouseMiddleName: trimValue(values.spouseMiddleName), spouseLastName: trimValue(values.spouseLastName), spouseOccupation: trimValue(values.spouseOccupation), spouseEmployer: trimValue(values.spouseEmployer), spouseCountry: trimValue(values.spouseCountry), spouseAddressLine1: trimValue(values.spouseAddressLine1), spouseAddressLine2: trimValue(values.spouseAddressLine2), spouseCity: trimValue(values.spouseCity), spouseState: trimValue(values.spouseState), spousePostalCode: trimValue(values.spousePostalCode), spouseWorkPhoneNumber: trimValue(values.spouseWorkPhoneNumber), spouseEmailAddress: trimValue(values.spouseEmailAddress),
      communicationContactByPhone: values.contactByPhone, communicationLeaveVoicemailAtHome: values.leaveVoicemailAtHome, communicationAgreeElectronicCommunications: values.agreeElectronicCommunications, communicationAgreeSmsMessages: values.agreeSmsMessages, communicationPauseScheduleGapFillsReminders: values.pauseScheduleGapFillsReminders, communicationPauseArAutomationReminders: values.pauseArAutomationReminders,
      referringSources: values.referringSources, referringPatient: trimValue(values.referringPatient),
      releaseSpouse: values.releaseSpouse, releaseChildren: values.releaseChildren, releaseParents: values.releaseParents, releaseOther: trimValue(values.releaseOther),
      reminderPreference: values.reminderPreference, stopReminderAfterConfirmation: values.stopReminderAfterConfirmation, dontRequestReview: values.dontRequestReview,
      assignmentRelease: values.assignmentRelease, photographyRelease: values.photographyRelease, socialMediaRelease: values.socialMediaRelease,
      sendWelcome: values.sendWelcome, sendWelcomeMethod: values.sendWelcome ? values.sendWelcomeMethod : "", newPatientFlag: values.newPatientFlag,
    });

    const address = removeEmptyCustomFields({ line1: trimValue(values.patientAddressLine1) || "", line2: trimValue(values.patientAddressLine2) || "", city: trimValue(values.patientCity) || "", state: trimValue(values.patientState) || "", postalCode: trimValue(values.patientPostalCode) || "" });
    const emergencyContact = removeEmptyCustomFields({ name: trimValue(values.emergencyContactName) || "", relationship: trimValue(values.emergencyRelationship) || "", phone: normalizePhone(values.emergencyMobilePhone || values.emergencyHomePhone || values.emergencyWorkPhone) });
    const spouseInfo = removeEmptyCustomFields({ name: trimValue(values.spouseFirstName) + " " + trimValue(values.spouseLastName), phone: normalizePhone(values.spouseWorkPhoneNumber) || "", email: trimValue(values.spouseEmailAddress) || "" });

    const payload = removeEmptyCustomFields({
      firstName: trimValue(values.firstName), lastName: trimValue(values.lastName), middleName: trimValue(values.middleName) || "", preferredName: trimValue(values.preferredName) || "",
      dateOfBirth: formatDateValue(values.dateOfBirth), gender: values.genderIdentity || values.sexAtBirth || "", ssn: (values.ssn || "").replace(/\D/g, ""),
      phonePrimary: normalizePhone(values.mobileNumber || values.homePhoneNumber), phoneSecondary: normalizePhone(values.homePhoneNumber || values.workPhoneNumber), email: trimValue(values.emailAddress) || "",
      preferredLanguage: "en", communicationPreference: values.contactByPhone ? "phone" : values.agreeSmsMessages ? "sms" : values.sendWelcomeMethod === "text" ? "sms" : "email",
      portalAccessEnabled: false, referralSource: values.referringSources || trimValue(values.referringPatient) || "", isActive: true,
      address: Object.keys(address).length ? address : undefined, emergencyContact: Object.keys(emergencyContact).length ? emergencyContact : undefined, spouseInfo: Object.keys(spouseInfo).length ? spouseInfo : undefined,
      title: trimValue(values.title), sexAtBirth: values.sexAtBirth, genderIdentity: values.genderIdentity,
      preferredDentistId: values.preferredDentistId === "null" ? "" : values.preferredDentistId, preferredHygienistId: values.preferredHygienistId === "null" ? "" : values.preferredHygienistId,
      maritalStatus: values.maritalStatus, occupation: trimValue(values.occupation), employer: trimValue(values.employer) || trimValue(values.spouseEmployer), guardianEmployer: trimValue(values.guardianEmployer),
      customFields: Object.keys(customFields).length ? customFields : undefined,
    });
    onSubmit(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        
        {/* Top Header / Nav Area */}
        <Box sx={{ px: 4, pt: 3, pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#1a73e8", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline" } }} onClick={onCancel}>Patients</Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem" }}>/</Typography>
              <Typography sx={{ color: "#1E293B", fontSize: "0.85rem", fontWeight: 600 }}>Add New Patient</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ backgroundColor: "#F1F5F9", color: "#64748B", px: 1.5, py: 0.5, borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #E2E8F0" }}>
                Draft auto-saved
              </Box>
              <Button variant="outlined" sx={{ minWidth: "auto", p: "6px", borderColor: "#E2E8F0", color: "#64748B", borderRadius: "8px", "&:hover": { backgroundColor: "#F8FAFC", borderColor: "#CBD5E1" } }}>
                <SaveOutlinedIcon fontSize="small" sx={{ fontSize: "1.1rem" }} />
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#1a73e8", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase" }}>
              <PeopleAltOutlinedIcon fontSize="small" /> ASSIGN CARE TEAM
            </Box>
            <Controller name="preferredDentistId" control={control} render={({ field }) => (
              <OutlinedSelect {...field} SelectProps={{ displayEmpty: true }} sx={{ width: 280, "& .MuiOutlinedInput-root": { backgroundColor: "#fff", borderColor: "#E2E8F0" } }}>
                <MenuItem value=""><span style={{ color: "#94A3B8" }}>Preferred Dentist</span></MenuItem>
                {providerOptions.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
              </OutlinedSelect>
            )} />
            <Controller name="preferredHygienistId" control={control} render={({ field }) => (
              <OutlinedSelect {...field} SelectProps={{ displayEmpty: true }} sx={{ width: 280, "& .MuiOutlinedInput-root": { backgroundColor: "#fff", borderColor: "#E2E8F0" } }}>
                <MenuItem value=""><span style={{ color: "#94A3B8" }}>Preferred Hygienist</span></MenuItem>
                {providerOptions.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
              </OutlinedSelect>
            )} />
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ px: 4, pb: 10, maxWidth: 1136, mx: "auto" }}>
          
          <SectionCard icon={PersonOutlineIcon} title="Patient Details" subtitle="Legal name, demographics, and identity" badge="required">
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormField label="Title">
                  <OutlinedSelect {...register("title")} SelectProps={{ displayEmpty: true }}>
                    <MenuItem value="">-</MenuItem>
                    <MenuItem value="mr">Mr.</MenuItem>
                    <MenuItem value="ms">Ms.</MenuItem>
                    <MenuItem value="mrs">Mrs.</MenuItem>
                  </OutlinedSelect>
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormField label="First Name" required>
                  <OutlinedInput {...register("firstName", { required: "Required" })} error={!!errors.firstName} placeholder="First name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormField label="Middle Name">
                  <OutlinedInput {...register("middleName")} placeholder="Middle name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormField label="Last Name" required>
                  <OutlinedInput {...register("lastName", { required: "Required" })} error={!!errors.lastName} placeholder="Last name" />
                </FormField>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Preferred Name">
                  <OutlinedInput {...register("preferredName")} placeholder="Name patient goes by" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Date of Birth" required>
                  <Controller name="dateOfBirth" control={control} render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} sx={{ "& .MuiOutlinedInput-root": { height: "42px", borderRadius: "8px", backgroundColor: "#F0F3FB", "& fieldset": { borderWidth: "1.2px", borderColor: "#E2E8F0" }, "&:hover fieldset": { borderColor: "#CBD5E1" }, "&.Mui-focused fieldset": { borderColor: "#1a73e8", borderWidth: "1.2px" } }, "& .MuiInputBase-input": { padding: "8px 12px", fontSize: "0.88rem" } }} slotProps={{ textField: { variant: "outlined", size: "small", fullWidth: true } }} />
                  )} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Social Security Number">
                  <OutlinedInput {...register("ssn")} placeholder="XXX-XX-XXXX" onChange={(e) => e.target.value = formatSSNInput(e.target.value)} />
                </FormField>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ pt: "24px !important", pb: "4px !important" }}>
                <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="Sex at Birth" required>
                  <Controller name="sexAtBirth" control={control} render={({ field }) => (
                    <CustomRadioGroup value={field.value} onChange={field.onChange} options={[{label:"Male",value:"male"}, {label:"Female",value:"female"}, {label:"Intersex",value:"intersex"}]} />
                  )} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="Gender Identity">
                  <Controller name="genderIdentity" control={control} render={({ field }) => (
                    <CustomRadioGroup value={field.value} onChange={field.onChange} options={[{label:"Male / Man",value:"male"}, {label:"Female / Woman",value:"female"}, {label:"Non-binary",value:"non-binary"}, {label:"Prefer not to say",value:"prefer_not_to_say"}]} />
                  )} />
                </FormField>
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={PhoneOutlinedIcon} title="Contact Information" subtitle="Phone numbers, email, and mailing address">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Mobile Number" required>
                  <PhoneInput {...register("mobileNumber")} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Home Phone Number">
                  <PhoneInput {...register("homePhoneNumber")} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Email Address">
                  <OutlinedInput {...register("emailAddress")} placeholder="patient@email.com" />
                </FormField>
              </Grid>
              
              <Grid size={{ xs: 12 }} sx={{ pt: "24px !important", pb: "4px !important" }}>
                <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mb: 2 }}>Patient's Address</Typography>
                <Box sx={{ border: "1px solid #E2E8F0", borderRadius: "8px", p: 2.5, backgroundColor: "#fff" }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormField label="Country">
                        <Controller name="patientCountry" control={control} render={({ field }) => (
                          <OutlinedSelect {...field}>
                            {COUNTRY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                          </OutlinedSelect>
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField label="Address Line 1">
                        <OutlinedInput {...register("patientAddressLine1")} placeholder="Street address" />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormField label="Address Line 2">
                        <OutlinedInput {...register("patientAddressLine2")} placeholder="Apt, suite, unit..." />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="State">
                        <Controller name="patientState" control={control} render={({ field }) => (
                          <OutlinedSelect {...field} onChange={(e) => { field.onChange(e); setValue("patientCity", ""); }}>
                            <MenuItem value="">Select state</MenuItem>
                            {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                          </OutlinedSelect>
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="City">
                        <Controller name="patientCity" control={control} render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            options={STATE_CITIES[watch("patientState")] || []}
                            value={value || ""}
                            onChange={(_, newVal) => onChange(newVal || "")}
                            onInputChange={(_, newInputValue) => onChange(newInputValue || "")}
                            disabled={!watch("patientState")}
                            freeSolo
                            renderInput={(params) => (
                              <OutlinedInput 
                                {...params} 
                                placeholder={watch("patientState") ? "City" : "Select state first"} 
                              />
                            )}
                          />
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="Zip / Postal Code">
                        <OutlinedInput {...register("patientPostalCode")} placeholder="Zip code" onChange={(e) => e.target.value = formatPostalCodeInput(e.target.value)} />
                      </FormField>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ pt: "24px !important", pb: "4px !important" }}>
                <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mb: 1.5 }}>Marital Status</Typography>
                <Controller name="maritalStatus" control={control} render={({ field }) => (
                  <CustomRadioGroup value={field.value} onChange={field.onChange} options={[
                    {label:"Single",value:"single"}, {label:"Married",value:"married"}, {label:"Widowed",value:"widowed"}, {label:"Divorced",value:"divorced"}, {label:"Under 18",value:"under_18"}, {label:"Prefer not to answer",value:"prefer_not_to_answer"}
                  ]} />
                )} />
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={InfoOutlinedIcon} title="Additional Information" subtitle="Occupation and work contact details" badge="optional">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Occupation">
                  <OutlinedInput {...register("occupation")} placeholder="Patient's occupation" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Patient's / Guardian's Employer">
                  <OutlinedInput {...register("guardianEmployer")} placeholder="Employer name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Work Phone Number">
                  <PhoneInput {...register("workPhoneNumber")} />
                </FormField>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ pt: "24px !important", pb: "4px !important" }}>
                <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mb: 2 }}>Work Address</Typography>
                <Box sx={{ border: "1px solid #E2E8F0", borderRadius: "8px", p: 2.5, backgroundColor: "#fff" }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormField label="Country">
                        <Controller name="workCountry" control={control} render={({ field }) => (
                          <OutlinedSelect {...field}>
                            {COUNTRY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                          </OutlinedSelect>
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField label="Address Line 1">
                        <OutlinedInput {...register("workAddressLine1")} placeholder="Street address" />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormField label="Address Line 2">
                        <OutlinedInput {...register("workAddressLine2")} placeholder="Suite, floor..." />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="State">
                        <Controller name="workState" control={control} render={({ field }) => (
                          <OutlinedSelect {...field} onChange={(e) => { field.onChange(e); setValue("workCity", ""); }}>
                            <MenuItem value="">Select state</MenuItem>
                            {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                          </OutlinedSelect>
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="City">
                        <Controller name="workCity" control={control} render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            options={STATE_CITIES[watch("workState")] || []}
                            value={value || ""}
                            onChange={(_, newVal) => onChange(newVal || "")}
                            onInputChange={(_, newInputValue) => onChange(newInputValue || "")}
                            disabled={!watch("workState")}
                            freeSolo
                            renderInput={(params) => (
                              <OutlinedInput 
                                {...params} 
                                placeholder={watch("workState") ? "City" : "Select state first"} 
                              />
                            )}
                          />
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="Zip / Postal Code">
                        <OutlinedInput {...register("workPostalCode")} placeholder="Zip code" onChange={(e) => e.target.value = formatPostalCodeInput(e.target.value)} />
                      </FormField>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={PeopleAltOutlinedIcon} title="Spouse / Partner Information" subtitle="Spouse or domestic partner details" badge="optional">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="First Name">
                  <OutlinedInput {...register("spouseFirstName")} disabled={isSingle} placeholder="First name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Middle Name">
                  <OutlinedInput {...register("spouseMiddleName")} disabled={isSingle} placeholder="Middle name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Last Name">
                  <OutlinedInput {...register("spouseLastName")} disabled={isSingle} placeholder="Last name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Occupation">
                  <OutlinedInput {...register("spouseOccupation")} disabled={isSingle} placeholder="Spouse's occupation" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Employer">
                  <OutlinedInput {...register("spouseEmployer")} disabled={isSingle} placeholder="Employer name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Work Phone Number">
                  <PhoneInput {...register("spouseWorkPhoneNumber")} disabled={isSingle} />
                </FormField>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ pt: "24px !important", pb: "4px !important" }}>
                <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mb: 2 }}>Work Address</Typography>
                <Box sx={{ border: "1px solid #E2E8F0", borderRadius: "8px", p: 2.5, backgroundColor: "#fff" }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormField label="Country">
                        <Controller name="spouseCountry" control={control} render={({ field }) => (
                          <OutlinedSelect {...field} disabled={isSingle}>
                            {COUNTRY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                          </OutlinedSelect>
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField label="Address Line 1">
                        <OutlinedInput {...register("spouseAddressLine1")} disabled={isSingle} placeholder="Street address" />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormField label="Address Line 2">
                        <OutlinedInput {...register("spouseAddressLine2")} disabled={isSingle} placeholder="Suite, unit..." />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="State">
                        <Controller name="spouseState" control={control} render={({ field }) => (
                          <OutlinedSelect {...field} disabled={isSingle} onChange={(e) => { field.onChange(e); setValue("spouseCity", ""); }}>
                            <MenuItem value="">Select state</MenuItem>
                            {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                          </OutlinedSelect>
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="City">
                        <Controller name="spouseCity" control={control} render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            options={STATE_CITIES[watch("spouseState")] || []}
                            value={value || ""}
                            onChange={(_, newVal) => onChange(newVal || "")}
                            onInputChange={(_, newInputValue) => onChange(newInputValue || "")}
                            disabled={isSingle || !watch("spouseState")}
                            freeSolo
                            renderInput={(params) => (
                              <OutlinedInput 
                                {...params} 
                                placeholder={isSingle ? "" : watch("spouseState") ? "City" : "Select state first"} 
                              />
                            )}
                          />
                        )} />
                      </FormField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormField label="Zip / Postal Code">
                        <OutlinedInput {...register("spousePostalCode")} disabled={isSingle} placeholder="Zip code" onChange={(e) => e.target.value = formatPostalCodeInput(e.target.value)} />
                      </FormField>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ pt: "24px !important", pb: "4px !important" }}>
                <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Email Address">
                  <OutlinedInput {...register("spouseEmailAddress")} disabled={isSingle} placeholder="spouse@email.com" />
                </FormField>
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={WarningAmberOutlinedIcon} title="Emergency Contact" subtitle="Who to contact in case of emergency">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Full Name" required>
                  <OutlinedInput {...register("emergencyContactName")} placeholder="Contact full name" />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Relationship" required>
                  <Controller name="emergencyRelationship" control={control} render={({ field }) => (
                    <OutlinedSelect {...field}>
                      <MenuItem value="">Select relationship</MenuItem>
                      {["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"].map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </OutlinedSelect>
                  )} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Home Phone">
                  <PhoneInput {...register("emergencyHomePhone")} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Work Phone">
                  <PhoneInput {...register("emergencyWorkPhone")} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Mobile Number">
                  <PhoneInput {...register("emergencyMobilePhone")} />
                </FormField>
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={CallMadeOutlinedIcon} title="Referring" subtitle="Referral source and referring patient" badge="optional">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Referring Source">
                  <Controller name="referringSources" control={control} render={({ field }) => (
                    <OutlinedSelect {...field}>
                      <MenuItem value="">Select source</MenuItem>
                      {REFERRING_SOURCE_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </OutlinedSelect>
                  )} />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField label="Referring Patient">
                  <Controller name="referringPatient" control={control} render={({ field }) => (
                    <Autocomplete
                      freeSolo disabled={!isReferringPatientEnabled} options={patients} getOptionLabel={(opt) => typeof opt === "string" ? opt : patientLabel(opt)}
                      value={patients.find((p) => patientLabel(p) === field.value) || null}
                      inputValue={field.value || ""} onOpen={() => setPatientSearchText(field.value || "")}
                      onChange={(_, newVal) => field.onChange(typeof newVal === "string" ? newVal : patientLabel(newVal))}
                      onInputChange={(_, newInpVal) => { field.onChange(newInpVal); setPatientSearchText(newInpVal); }}
                      loading={patientsLoading} noOptionsText="No patients found"
                      renderInput={(params) => (
                        <OutlinedInput 
                          {...params} 
                          placeholder="Search patients..." 
                          InputProps={{ 
                            ...params.InputProps, 
                            startAdornment: (
                              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pr: 0.5, color: "#64748B" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              </Box>
                            ),
                            endAdornment: (
                              <>{patientsLoading ? <CircularProgress size={18} /> : null}{params.InputProps.endAdornment}</>
                            ) 
                          }} 
                        />
                      )}
                    />
                  )} />
                </FormField>
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={DescriptionOutlinedIcon} title="Release, Communication & Preferences" subtitle="Privacy releases, contact consents, and appointment reminders">
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mr: 2, whiteSpace: "nowrap" }}>Release Information</Typography>
                  <Box sx={{ flexGrow: 1, borderBottom: "1px solid #E2E8F0" }} />
                </Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#475569", mb: 1.5 }}>Can discuss healthcare information with:</Typography>
                <Stack spacing={1.5}>
                  <Controller name="releaseSpouse" control={control} render={({ field }) => <ColoredChipCheckbox shape="circle" checked={!!field.value} onChange={field.onChange} label="Spouse / Common-law partner" />} />
                  <Controller name="releaseChildren" control={control} render={({ field }) => <ColoredChipCheckbox shape="circle" checked={!!field.value} onChange={field.onChange} label="Children" />} />
                  <Controller name="releaseParents" control={control} render={({ field }) => <ColoredChipCheckbox shape="circle" checked={!!field.value} onChange={field.onChange} label="Parents" />} />
                  <FormField label="Other">
                    <OutlinedInput {...register("releaseOther")} placeholder="Specify..." />
                  </FormField>
                </Stack>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mr: 2, whiteSpace: "nowrap" }}>Communication Consents</Typography>
                  <Box sx={{ flexGrow: 1, borderBottom: "1px solid #E2E8F0" }} />
                </Box>
                <Stack spacing={1.5}>
                  <Controller name="contactByPhone" control={control} render={({ field }) => <ColoredChipCheckbox checked={!!field.value} onChange={field.onChange} label="Contact me on the phone numbers provided" />} />
                  <Controller name="leaveVoicemailAtHome" control={control} render={({ field }) => <ColoredChipCheckbox checked={!!field.value} onChange={field.onChange} label="Leave voicemail at home" />} />
                  <Controller name="agreeElectronicCommunications" control={control} render={({ field }) => <ColoredChipCheckbox checked={!!field.value} onChange={field.onChange} label="I agree that the dental practice may communicate with me electronically." />} />
                  <Controller name="agreeSmsMessages" control={control} render={({ field }) => <ColoredChipCheckbox checked={!!field.value} onChange={field.onChange} label="By opting in, I agree to receive SMS messages from the dental office." />} />
                  <Controller name="pauseScheduleGapFillsReminders" control={control} render={({ field }) => <ColoredChipCheckbox checked={!!field.value} onChange={field.onChange} label="Pause Schedule Gap Fill Reminders" />} />
                  <Controller name="pauseArAutomationReminders" control={control} render={({ field }) => <ColoredChipCheckbox checked={!!field.value} onChange={field.onChange} label="Pause AR Automation Reminders" />} />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", mr: 2, whiteSpace: "nowrap" }}>Confirmation Preferences</Typography>
                  <Box sx={{ flexGrow: 1, borderBottom: "1px solid #E2E8F0" }} />
                </Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#475569", mb: 1.5 }}>Patient prefers to receive a reminder before appointment:</Typography>
                <Controller name="reminderPreference" control={control} render={({ field }) => (
                  <Stack spacing={1.5} mb={3}>
                    <ColoredChipCheckbox shape="circle" checked={field.value === "none"} onChange={(val) => { if(val){field.onChange("none"); setValue("stopReminderAfterConfirmation",false); setValue("dontRequestReview",false);}else field.onChange(""); }} label="No, it is unnecessary" />
                    <ColoredChipCheckbox shape="circle" checked={field.value === "helpful"} onChange={(val) => { if(val){field.onChange("helpful"); setValue("stopReminderAfterConfirmation",false); setValue("dontRequestReview",false);}else field.onChange(""); }} label="Yes, it is a helpful reminder" />
                    <Controller name="stopReminderAfterConfirmation" control={control} render={({ field: sf }) => (
                      <ColoredChipCheckbox shape="circle" checked={!!sf.value} onChange={(val) => { sf.onChange(val); if(val){setValue("reminderPreference",""); setValue("dontRequestReview",false);} }} label="Stop reminding after confirmation" />
                    )} />
                  </Stack>
                )} />

                <Typography sx={{ fontSize: "0.85rem", color: "#475569", mb: 1.5 }}>Patient prefers not to receive a review request:</Typography>
                <Controller name="dontRequestReview" control={control} render={({ field }) => (
                  <ColoredChipCheckbox shape="circle" checked={!!field.value} onChange={(val) => { field.onChange(val); if(val){setValue("reminderPreference",""); setValue("stopReminderAfterConfirmation",false);} }} label="Don't request review" />
                )} />
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard icon={ChecklistOutlinedIcon} title="Assignment & Release" subtitle="Photography, social media, and assignment consents">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Assignment & Release</Typography>
                <Controller name="assignmentRelease" control={control} render={({ field }) => (
                  <CustomRadioGroup value={field.value} onChange={field.onChange} options={[{label: "No", value: "no"}, {label: "Yes", value: "yes"}]} />
                )} />
              </Box>
              <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Photography Release</Typography>
                <Controller name="photographyRelease" control={control} render={({ field }) => (
                  <CustomRadioGroup value={field.value} onChange={field.onChange} options={[{label: "No", value: "no"}, {label: "Yes", value: "yes"}]} />
                )} />
              </Box>
              <Box sx={{ borderBottom: "1px solid #F1F5F9", ml: "-40px", width: "calc(100% + 80px)" }} />
              
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Social Media Release</Typography>
                <Controller name="socialMediaRelease" control={control} render={({ field }) => (
                  <CustomRadioGroup value={field.value} onChange={field.onChange} options={[{label: "No", value: "no"}, {label: "Yes", value: "yes"}]} />
                )} />
              </Box>
            </Box>
          </SectionCard>
        </Box>

        {/* Bottom Action Bar */}
        <Box sx={{ position: "sticky", bottom: 0, zIndex: 100, backgroundColor: "#fff", borderTop: "1px solid #E2E8F0", px: 4, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Controller name="sendWelcome" control={control} render={({ field }) => (
              <ColoredChipCheckbox sx={{ width: "auto", minHeight: "36px", py: "6px" }} checked={!!field.value} onChange={field.onChange} label="Send Welcome" />
            )} />
            <Controller name="sendWelcomeMethod" control={control} render={({ field }) => (
              <CustomRadioGroup value={field.value} onChange={field.onChange} options={[{label: "Email", value: "email"}, {label: "Text Message", value: "text"}]} />
            )} />
            <Box sx={{ width: "1px", height: "24px", backgroundColor: "#E2E8F0", mx: 0.5 }} />
            <Controller name="newPatientFlag" control={control} render={({ field }) => (
              <ColoredChipCheckbox sx={{ width: "auto", minHeight: "36px", py: "6px" }} checked={!!field.value} onChange={field.onChange} label="New Patient" />
            )} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", display: { xs: "none", lg: "block" } }}>
              Welcome delivery is optional and will only be sent if you enable it.
            </Typography>
            <Button variant="outlined" onClick={onCancel} sx={{ px: 3, height: "40px", borderRadius: "8px", textTransform: "none", color: "#475569", borderColor: "#CBD5E1", fontSize: "0.85rem", fontWeight: 500 }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading} startIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>} sx={{ px: 3, height: "40px", borderRadius: "8px", textTransform: "none", backgroundColor: "#3B82F6", "&:hover": { backgroundColor: "#2563EB" }, boxShadow: "none", fontSize: "0.85rem", fontWeight: 500 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Add Patient"}
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default NewPatientIntakeFormV2;
