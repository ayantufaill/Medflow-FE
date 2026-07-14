import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createProvider } from "../../../store/slices/providerSlice";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { phoneInputStyles } from "../practice-info/PracticeInformationForm";

const PROVIDER_TYPES = [
  "Dentist",
  "Hygienist",
  "Specialist",
  "Assistant",
  "Office Staff",
];
const SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Endodontics",
  "Periodontics",
  "Pediatric Dentistry",
  "Oral Surgery",
  "Prosthodontics",
];
const TAX_ID_TYPES = ["SSN", "EIN", "ITIN"];
const PROVIDER_COLORS = [
  "#14B8A6", // teal
  "#F59E0B", // amber
  "#FBBF24", // yellow
  "#F43F5E", // rose
  "#8B5CF6", // purple
  "#3B82F6", // blue
  "#10B981", // emerald
];

const FormField = ({ label, required, error, helperText, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: "#6B7280",
        fontSize: "0.75rem",
        mb: 0.5,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {label}
      {required && (
        <Box component="span" sx={{ color: "#EF4444", ml: 0.2 }}>
          *
        </Box>
      )}
    </Typography>
    {children}
    {error && helperText && (
      <FormHelperText error sx={{ fontSize: "0.65rem", mt: 0.25, ml: 0 }}>
        {helperText}
      </FormHelperText>
    )}
  </Box>
);

const CardSection = ({ title, children, sx = {} }) => (
  <Box
    sx={{
      bgcolor: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      mb: 2,
      ...sx
    }}
  >
    <Box sx={{ 
      bgcolor: "#F3F8FD", 
      height: "36px", 
      display: "flex", 
      alignItems: "center", 
      px: 2, 
      borderBottom: "1px solid #E5E7EB",
      borderRadius: "12px 12px 0 0",
    }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "#111827",
          fontSize: "0.85rem",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>
      {children}
    </Box>
  </Box>
);

const AddProviderForm = ({ onSave, onCancel }) => {
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [providerColor, setProviderColor] = useState(PROVIDER_COLORS[0]);
  const [phoneCode, setPhoneCode] = useState('us');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      prefix: "Dr.", // Preserved for backend requirements
      preferredName: "",
      internalCodeName: "",
      mobilePhone: "",
      email: "",
      npiNumber: "",
      licenseNumber: "",
      deaNumber: "",
      specialty: "",
      federalTaxNumber: "",
      providerType: "Dentist",
      taxIdType: "SSN",
      signatureOnFile: false,
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        specialty: data.specialty ? [data.specialty] : undefined,
        color: providerColor,
      };
      const created = await dispatch(createProvider(payload)).unwrap();
      showSnackbar("Provider added successfully", "success");
      reset();
      onSave(created);
    } catch (err) {
      showSnackbar(err || "Failed to add provider", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "36px",
      borderRadius: "8px",
      bgcolor: "#FFFFFF",
      "& fieldset": { borderColor: "#E5E7EB" },
      "&:hover fieldset": { borderColor: "#D1D5DB" },
      "&.Mui-focused fieldset": { borderColor: "#3B82F6", borderWidth: "1px" },
    },
    "& .MuiInputBase-input": {
      fontSize: "0.875rem",
      color: "#111827",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
      height: "100% !important",
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        bgcolor: "#FBFCFD",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Form Header */}
      <Box
        sx={{
          bgcolor: "#F1F5FD",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2.5,
          borderBottom: "1px solid #E5E7EB",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3B82F6",
            }}
          >
            <PersonAddAlt1Icon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem" }}>
              Add Providers
            </Typography>
            <Typography sx={{ color: "#6B7280", fontSize: "0.75rem", mt: -0.25 }}>
              Add new Providers
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onCancel} size="small" sx={{ color: "#9CA3AF" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Form Body */}
      <Box sx={{ p: 2.5, pt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2.5, flexDirection: 'row' }}>
          {/* Left Column */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardSection title="Personal Information">
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField label="First Name" required error={!!errors.firstName} helperText={errors.firstName?.message}>
                    <TextField fullWidth placeholder="Enter First Name" {...register("firstName", { required: "Required" })} sx={inputStyles} />
                  </FormField>
                  <FormField label="Last Name" required error={!!errors.lastName} helperText={errors.lastName?.message}>
                    <TextField fullWidth placeholder="Enter Last Name" {...register("lastName", { required: "Required" })} sx={inputStyles} />
                  </FormField>
                  <FormField label="Preferred Name">
                    <TextField fullWidth placeholder="Enter Preferred Name" {...register("preferredName")} sx={inputStyles} />
                  </FormField>
                  <FormField label="Internal Code Name">
                    <TextField fullWidth placeholder="Enter internal Code" {...register("internalCodeName")} sx={inputStyles} />
                  </FormField>
                  <FormField label="Mobile Phone Number" required>
                    <Controller
                      name="mobilePhone"
                      control={control}
                      render={({ field }) => (
                        <Box sx={{ position: 'relative', ...phoneInputStyles }}>
                          <PhoneInput
                            {...field}
                            country="us"
                            enableSearch
                            specialLabel=""
                            onChange={(value, country) => {
                              field.onChange(value);
                              setPhoneCode(country?.countryCode || 'us');
                            }}
                            value={field.value || ""}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '55px',
                              height: '36px',
                              pointerEvents: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                              zIndex: 2,
                            }}
                          >
                            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase' }}>
                              {phoneCode}
                            </Typography>
                            <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: '#9ca3af' }} />
                          </Box>
                        </Box>
                      )}
                    />
                  </FormField>

                  <FormField label="Email" required error={!!errors.email} helperText={errors.email?.message}>
                    <TextField fullWidth placeholder="Enter Your Email" {...register("email", { required: "Required" })} sx={inputStyles} />
                  </FormField>
              </Box>
            </CardSection>

            <CardSection title="Provider Type & Tax Detail" sx={{ height: 'calc(100% - 370px)', mb: 0 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField label="Tax Id Type">
                    <TextField fullWidth placeholder="Enter Tax Id Type" {...register("taxIdType")} sx={inputStyles} />
                  </FormField>
                  <FormField label="Provider Type" required>
                    <Controller
                      name="providerType"
                      control={control}
                      render={({ field }) => (
                        <TextField select {...field} fullWidth sx={inputStyles}>
                          {PROVIDER_TYPES.map((t) => (
                            <MenuItem key={t} value={t} sx={{ fontSize: "0.875rem" }}>
                              {t}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </FormField>
              </Box>
            </CardSection>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <CardSection title="Professional & Licensing Information">
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormField label="License Number" required error={!!errors.licenseNumber} helperText={errors.licenseNumber?.message}>
                    <TextField fullWidth placeholder="Enter License Number" {...register("licenseNumber", { required: "Required" })} sx={inputStyles} />
                  </FormField>
                  <FormField label="NPI">
                    <TextField fullWidth placeholder="Enter NPI" {...register("npiNumber")} sx={inputStyles} />
                  </FormField>
                  <FormField label="Federal Tax Number" required error={!!errors.federalTaxNumber} helperText={errors.federalTaxNumber?.message}>
                    <TextField fullWidth placeholder="Enter Federal Tax Number" {...register("federalTaxNumber", { required: "Required" })} sx={inputStyles} />
                  </FormField>
                  <FormField label="DEA">
                    <TextField fullWidth placeholder="Enter DEA" {...register("deaNumber")} sx={inputStyles} />
                  </FormField>
                  <FormField label="Speciality" required error={!!errors.specialty} helperText={errors.specialty?.message}>
                    <Controller
                      name="specialty"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <TextField 
                          select
                          {...field} 
                          fullWidth 
                          sx={inputStyles}
                          SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected) => {
                              if (!selected) {
                                return <span style={{ color: "#9CA3AF" }}>Select Speciality</span>;
                              }
                              return selected;
                            }
                          }}
                        >
                          <MenuItem value="" disabled sx={{ display: "none" }}>
                            Select Speciality
                          </MenuItem>
                          {SPECIALTIES.map((s) => (
                            <MenuItem key={s} value={s} sx={{ fontSize: "0.875rem" }}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </FormField>
              </Box>
            </CardSection>

            <CardSection title="Profile Background Color" sx={{ flexGrow: 1, mb: 0 }}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "flex-start" }}>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#6B7280", mb: 1 }}>
                    Colors
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.75, mb: 1.5 }}>
                    {PROVIDER_COLORS.map((c) => (
                      <Box
                        key={c}
                        onClick={() => setProviderColor(c)}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: c,
                          cursor: "pointer",
                          border: providerColor === c ? "2px solid #111827" : "none",
                          boxShadow: providerColor === c ? "0 0 0 2px #fff inset" : "none",
                        }}
                      />
                    ))}
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "1px dashed #9CA3AF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Typography sx={{ color: "#9CA3AF", fontSize: "14px", lineHeight: 1 }}>+</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: "auto" }}>
                  <Typography sx={{ fontSize: "0.6rem", color: "#9CA3AF", maxWidth: 280, lineHeight: 1.4 }}>
                    The color for the provider show on the appointment card and as a background for the provider name in the different parts of the software
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Controller
                      name="signatureOnFile"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          size="small"
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": { color: "#3B82F6" },
                            p: 0,
                            mr: 0.5
                          }}
                        />
                      )}
                    />
                    <Typography sx={{ fontSize: "0.85rem", color: "#6B7280" }}>
                      Signature on the File
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardSection>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3, pt: 1 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: "#374151",
              borderColor: "#D1D5DB",
              textTransform: "none",
              borderRadius: "6px",
              px: 3.5,
              py: 0.75,
              fontWeight: 600,
              fontSize: "0.85rem",
              "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F3F4F6" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            sx={{
              bgcolor: "#2362EF",
              "&:hover": { bgcolor: "#1D4ED8" },
              textTransform: "none",
              borderRadius: "6px",
              px: 4,
              py: 0.75,
              fontWeight: 600,
              fontSize: "0.85rem",
              boxShadow: "none",
            }}
          >
            {saving ? "Saving..." : "Apply"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProviderForm;
