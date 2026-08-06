import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { userValidations } from "../../validations/userValidations";
import { useRoles } from "../../hooks/queries/useRoles";

const inputFieldSx = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    '& fieldset': { borderWidth: '1px', borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#94a3b8' },
    '&.Mui-focused fieldset': { borderColor: '#1d4ed8', borderWidth: '1.5px' },
    '&.Mui-error fieldset': { borderColor: '#ef4444' },
    '&.Mui-disabled': { backgroundColor: '#f8fafc', opacity: 0.75 },
  },
  '& .MuiOutlinedInput-input': { padding: '9px 12px', fontSize: '13px', color: '#0f172a', height: 'auto' },
  '& .MuiOutlinedInput-input::placeholder': { color: '#94a3b8', opacity: 1 },
  '& .MuiFormHelperText-root': { fontFamily: 'Inter, sans-serif', fontSize: '11px', mt: '4px', mx: 0 },
};

const fieldLabelSx = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  color: '#475569',
  mb: '6px',
  display: 'block',
};

const UserForm = ({
  onSubmit,
  initialData = null,
  loading = false,
  isEditMode = false,
  hidePassword = false,
  hideRoleSelection = false,
  hideButtons = false,
  disableEmail = false,
  formId,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { data: allRoles = [] } = useRoles();
  const roles = useMemo(() => allRoles.filter((role) => role.isActive !== false), [allRoles]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleId: "",
      password: "",
      confirmPassword: "",
      preferredLanguage: "en",
      isActive: true,
    },
  });

  const password = watch("password");

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone ? initialData.phone.replace("+", "") : "",
        roleId: initialData.roles?.[0]?._id || "",
        password: "",
        confirmPassword: "",
        preferredLanguage: initialData.preferredLanguage || "en",
        isActive: initialData.isActive !== false,
      });
    }
  }, [initialData, reset]);

  const handleBack = () => {
    window.history.back();
  };

  const sanitizeValue = (value) =>
    typeof value === "string" ? value.trim() : value;

  const handleFormSubmit = (formData) => {
    const sanitizedData = {
      ...formData,
      firstName: sanitizeValue(formData.firstName),
      lastName: sanitizeValue(formData.lastName),
      email: sanitizeValue(formData.email),
      phone: `+${sanitizeValue(formData.phone)}`,
      preferredLanguage: sanitizeValue(formData.preferredLanguage),
    };

    onSubmit(sanitizedData);
  };

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Grid container spacing={2.5}>
        <Grid size={{xs: 12, sm: 6}}>
          <Typography sx={fieldLabelSx}>First Name</Typography>
          <TextField
            fullWidth
            placeholder="Enter first name"
            {...register("firstName", userValidations.firstName)}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Typography sx={fieldLabelSx}>Last Name</Typography>
          <TextField
            fullWidth
            placeholder="Enter last name"
            {...register("lastName", userValidations.lastName)}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Typography sx={fieldLabelSx}>Email Address</Typography>
          <TextField
            fullWidth
            placeholder="Enter email address"
            type="email"
            {...register("email", userValidations.email)}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={disableEmail}
            sx={inputFieldSx}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Typography sx={fieldLabelSx}>Phone Number</Typography>
          <Controller
            name="phone"
            control={control}
            rules={{
              ...userValidations.phone,
              validate: (value) => {
                // If a country is selected and value exists, check length against format
                if (selectedCountry && value) {
                  const format = selectedCountry.format || "";
                  // Count the number of dots in the format (represents expected digits)
                  const requiredLength = (format.match(/\./g) || []).length;
                  
                  if (value.length !== requiredLength) {
                    return "Phone number is incomplete";
                  }
                }
                return true;
              }
            }}
            render={({ field }) => (
              <Box>
                <Box
                  sx={{
                    width: "100%",
                    "& .react-tel-input": {
                      width: "100% !important",
                      fontFamily: "Inter, sans-serif !important",
                    },
                    "& .form-control": {
                      width: "100% !important",
                    },
                    "& .special-label": {
                      display: "none !important",
                    },
                  }}
                >
                  <PhoneInput
                    {...field}
                    specialLabel={""}
                    country={"us"}
                    enableSearch={true}
                    disableSearchIcon={false}
                    searchPlaceholder="Search country"
                    onChange={(value, country, e, formattedValue) => {
                      field.onChange(value);
                      setSelectedCountry(country);
                    }}
                    value={field.value || ""}
                    inputStyle={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "8px",
                      border: `1px solid ${errors.phone ? "#ef4444" : "#e2e8f0"}`,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                    }}
                    buttonStyle={{
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                      border: `1px solid ${errors.phone ? "#ef4444" : "#e2e8f0"}`,
                      borderRight: "none",
                      backgroundColor: "#f8fafc",
                    }}
                    dropdownStyle={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
                {errors.phone && (
                  <FormHelperText error sx={{ mt: "4px", mx: 0, fontFamily: "Inter, sans-serif", fontSize: "11px" }}>
                    {errors.phone.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Grid>
        {isEditMode && (
          <Grid size={{xs: 12, sm: 6}}>
            <Box sx={{
              height: "40px",
              mt: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "16px",
              bgcolor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                Account Active Status
              </Typography>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#1d4ed8" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1d4ed8" },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        )}
        {!isEditMode && !hideRoleSelection && (
          <Grid size={{xs: 12, sm: 6}}>
            <Typography sx={fieldLabelSx}>Select Role</Typography>
            <FormControl fullWidth>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    displayEmpty
                    sx={{
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: field.value ? "#0f172a" : "#94a3b8",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1d4ed8", borderWidth: "1.5px" },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: "4px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          "& .MuiMenuItem-root": {
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            color: "#0f172a",
                            py: "10px",
                            "&:hover": { bgcolor: "#f8fafc" },
                            "&.Mui-selected": { bgcolor: "#eff6ff", color: "#1d4ed8", fontWeight: 600 },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em style={{ color: "#94a3b8", fontStyle: "normal" }}>-- Select Role --</em>
                    </MenuItem>
                    {roles.map((role) => (
                      <MenuItem
                        key={role._id || role.id}
                        value={role._id || role.id}
                      >
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        )}
        {!isEditMode && !hidePassword && (
          <>
            <Grid size={{xs: 12, sm: 6}}>
              <Typography sx={fieldLabelSx}>Password</Typography>
              <TextField
                fullWidth
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                {...register("password", userValidations.password)}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={inputFieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                        size="small"
                        sx={{ color: "#64748b", mr: "2px" }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: "18px" }} /> : <Visibility sx={{ fontSize: "18px" }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <Typography sx={fieldLabelSx}>Confirm Password</Typography>
              <TextField
                fullWidth
                placeholder="Re-enter password"
                type={showConfirmPassword ? "text" : "password"}
                {...register(
                  "confirmPassword",
                  userValidations.confirmPassword(password)
                )}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={inputFieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        tabIndex={-1}
                        size="small"
                        sx={{ color: "#64748b", mr: "2px" }}
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ fontSize: "18px" }} /> : <Visibility sx={{ fontSize: "18px" }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  }}
                />
            </Grid>
          </>
        )}
        {!hideButtons && (
          <Grid size={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "12px", pt: "8px" }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  textTransform: "none", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "13px",
                  borderColor: "#cbd5e1", color: "#0f172a", borderRadius: "6px",
                  px: "16px", height: "36px",
                  "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveIcon sx={{ fontSize: "17px !important" }} />
                  )
                }
                disabled={loading}
                sx={{
                  textTransform: "none", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "13px",
                  bgcolor: "#1d4ed8", color: "#ffffff", borderRadius: "6px",
                  px: "24px", height: "36px",
                  "&:hover": { bgcolor: "#1e40af" },
                }}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : "Create User"}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserForm;