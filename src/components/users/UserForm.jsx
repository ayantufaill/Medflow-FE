import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { userValidations } from "../../validations/userValidations";
import { roleService } from "../../services/role.service";

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
  const [roles, setRoles] = useState([]);
  // State to track selected country data for phone validation
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const allRoles = await roleService.getAllRoles();
        setRoles(allRoles.filter((role) => role.isActive !== false));
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

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
        phone: initialData.phone.replace("+", "") || "",
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
      <Grid container spacing={2}>
        <Grid size={{xs: 12, sm: 6}}>
          <TextField
            fullWidth
            label="First Name"
            {...register("firstName", userValidations.firstName)}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <TextField
            fullWidth
            label="Last Name"
            {...register("lastName", userValidations.lastName)}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email", userValidations.email)}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={disableEmail}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
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
                    },
                    "& .form-control": {
                      width: "100% !important",
                    },
                  }}
                >
                  <PhoneInput
                    {...field}
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
                      borderColor: errors.phone ? "#d32f2f" : undefined,
                    }}
                    buttonStyle={{
                      borderColor: errors.phone ? "#d32f2f" : undefined,
                    }}
                  />
                </Box>
                {errors.phone && (
                  <FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
                    {errors.phone.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Grid>
        {!isEditMode && !hideRoleSelection && (
          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Select Role"
                  >
                    <MenuItem value="">
                      <em>--None--</em>
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
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", userValidations.password)}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                {...register(
                  "confirmPassword",
                  userValidations.confirmPassword(password)
                )}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={loading}
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